const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const dns = require('dns');
const { pathToFileURL } = require('url');
const {
  localStatus,
  startLocalServer,
  stopLocalServer,
} = require('./lib/localServer');

/**
 * Phase 1: cloud when online; local PHP+Laravel when offline (if packaged).
 * Setup screen still collects cloud POS URL for sync later.
 */

app.setName('StoreeoPOS');

const CONFIG_NAME = 'desktop-config.json';
const PLACEHOLDER_URL = 'https://example.com';

let mainWindow = null;

function configPath() {
  return path.join(app.getPath('userData'), CONFIG_NAME);
}

function loadConfig() {
  const file = configPath();
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  } catch (e) {
    // ignore
  }
  return {
    posUrl: process.env.POS_DESKTOP_URL || PLACEHOLDER_URL,
    preferLocalWhenOffline: true,
  };
}

function saveConfig(partial) {
  const next = Object.assign({}, loadConfig(), partial);
  const file = configPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(next, null, 2), 'utf8');
  return next;
}

function needsSetup(config) {
  const url = (config.posUrl || '').trim();
  return !url || /example\.com/i.test(url);
}

function checkOnline() {
  return new Promise((resolve) => {
    dns.lookup('pos.storeeo.app', (err) => {
      if (!err) {
        resolve(true);
        return;
      }
      dns.lookup('dns.google', (err2) => resolve(!err2));
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.once('ready-to-show', () => mainWindow.show());

  boot().catch((e) => {
    console.error(e);
    showOfflinePage(e.message);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

async function boot() {
  const config = loadConfig();
  if (needsSetup(config)) {
    mainWindow.loadFile(path.join(__dirname, 'setup.html'));
    return;
  }

  const online = await checkOnline();
  if (online) {
    openPos(config.posUrl, { allowLocalFallback: true });
    return;
  }

  await openLocalOrOffline();
}

async function openLocalOrOffline() {
  const st = localStatus();
  if (!st.ready) {
    showOfflinePage(
      'Local engine package incomplete hai. Naya installer (0.2.7+) install karein — pehle purani Storeeo POS Task Manager se band karein.'
    );
    return;
  }
  try {
    const url = await startLocalServer();
    openPos(url, { allowLocalFallback: false });
  } catch (e) {
    showOfflinePage(e.message || 'Local POS start failed');
  }
}

function showOfflinePage(detail) {
  if (!mainWindow) return;
  let url = pathToFileURL(path.join(__dirname, 'offline.html')).href;
  if (detail) {
    url += '?msg=' + encodeURIComponent(String(detail).slice(0, 500));
  }
  mainWindow.loadURL(url);
}

function openPos(targetUrl, opts) {
  const allowLocalFallback = opts && opts.allowLocalFallback;
  if (!mainWindow) return;
  mainWindow.loadURL(targetUrl).catch(async () => {
    if (allowLocalFallback) {
      await openLocalOrOffline();
    } else {
      showOfflinePage('Failed to open ' + targetUrl);
    }
  });
  mainWindow.webContents.removeAllListeners('did-fail-load');
  mainWindow.webContents.on('did-fail-load', async (_e, _code, _desc, url, isMainFrame) => {
    if (!isMainFrame) return;
    if (url && url.startsWith('file:')) return;
    if (allowLocalFallback) {
      await openLocalOrOffline();
    } else {
      showOfflinePage('Failed to load POS');
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Do not let a stray exception kill the whole desktop shell
process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err);
  try {
    showOfflinePage(err && err.message ? err.message : String(err));
  } catch (e) {
    // ignore
  }
});
process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection', reason);
  try {
    const msg = reason && reason.message ? reason.message : String(reason);
    showOfflinePage(msg);
  } catch (e) {
    // ignore
  }
});

app.on('window-all-closed', () => {
  stopLocalServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  stopLocalServer();
});

ipcMain.handle('desktop:getInfo', async () => {
  const config = loadConfig();
  const online = await checkOnline();
  return {
    version: app.getVersion(),
    mode: 'phase-1-local-engine',
    posUrl: config.posUrl,
    configPath: configPath(),
    online,
    local: localStatus(),
    sync: {
      enabled: false,
      note: 'Phase 2: push sync_queue when online',
    },
  };
});

ipcMain.handle('desktop:savePosUrl', async (_event, posUrl) => {
  const url = String(posUrl || '').trim();
  if (!url || !/^https?:\/\//i.test(url)) {
    throw new Error('URL must start with http:// or https://');
  }
  saveConfig({ posUrl: url });
  const online = await checkOnline();
  if (online) {
    openPos(url, { allowLocalFallback: true });
  } else {
    await openLocalOrOffline();
  }
  return { ok: true, posUrl: url };
});

ipcMain.handle('desktop:startLocal', async () => {
  try {
    // Do NOT reload offline.html here — reload feels like the app closed.
    const url = await startLocalServer();
    openPos(url, { allowLocalFallback: false });
    return { ok: true, url };
  } catch (e) {
    const msg = e && e.message ? e.message : String(e);
    showOfflinePage(msg);
    throw new Error(msg);
  }
});

ipcMain.handle('desktop:retryBoot', async () => {
  try {
    await boot();
    return { ok: true };
  } catch (e) {
    const msg = e && e.message ? e.message : String(e);
    showOfflinePage(msg);
    throw new Error(msg);
  }
});
