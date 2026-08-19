const { app, BrowserWindow, ipcMain, dialog } = require('electron');
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
 * Storeeo POS Desktop — Phase 1 shopkeeper local build.
 * Always runs local SQLite POS (net on/off). Cloud sync = Phase 2.
 */

app.setName('StoreeoPOS');

const CONFIG_NAME = 'desktop-config.json';
const PLACEHOLDER_URL = 'https://pos.storeeo.app';

let mainWindow = null;

function configPath() {
  return path.join(app.getPath('userData'), CONFIG_NAME);
}

function loadConfig() {
  const file = configPath();
  const defaults = {
    posUrl: process.env.POS_DESKTOP_URL || PLACEHOLDER_URL,
    preferLocalWhenOffline: true,
    forceLocalMode: true,
    shopSetupDone: false,
    shopName: '',
  };
  try {
    if (fs.existsSync(file)) {
      const loaded = JSON.parse(fs.readFileSync(file, 'utf8'));
      const next = Object.assign({}, defaults, loaded, { forceLocalMode: true });
      if (
        loaded.shopSetupDone == null &&
        loaded.posUrl &&
        !/example\.com/i.test(String(loaded.posUrl))
      ) {
        next.shopSetupDone = true;
      }
      return next;
    }
  } catch (e) {
    // ignore
  }
  return Object.assign({}, defaults);
}

function saveConfig(partial) {
  const next = Object.assign({}, loadConfig(), partial, { forceLocalMode: true });
  const file = configPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(next, null, 2), 'utf8');
  return next;
}

function needsSetup(config) {
  return !config.shopSetupDone;
}

function checkOnline() {
  return new Promise((resolve) => {
    dns.lookup('dns.google', (err) => resolve(!err));
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
  // Always local for shopkeeper builds — never open cloud POS.
  saveConfig({ forceLocalMode: true });

  if (needsSetup(config)) {
    mainWindow.loadFile(path.join(__dirname, 'setup.html'));
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
  const isLocal = /127\.0\.0\.1|localhost/i.test(String(targetUrl));
  try {
    mainWindow.setTitle(isLocal ? 'Storeeo POS — LOCAL' : 'Storeeo POS — Cloud');
  } catch (e) {
    // ignore
  }

  // Brief loading page so user never stares at raw Chromium white
  if (isLocal) {
    mainWindow.loadURL(
      'data:text/html,' +
        encodeURIComponent(
          '<html><body style="margin:0;background:#1a2332;color:#f5f0e8;font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;height:100vh"><div style="text-align:center"><h2>Storeeo POS</h2><p>Local POS load ho raha hai…</p></div></body></html>'
        )
    );
  }

  const go = () => {
    mainWindow.loadURL(targetUrl).catch(async () => {
      if (allowLocalFallback) {
        await openLocalOrOffline();
      } else {
        showOfflinePage('Failed to open ' + targetUrl);
      }
    });
  };
  setTimeout(go, isLocal ? 150 : 0);

  mainWindow.webContents.removeAllListeners('did-fail-load');
  mainWindow.webContents.on('did-fail-load', async (_e, code, desc, url, isMainFrame) => {
    if (!isMainFrame) return;
    if (url && url.startsWith('file:')) return;
    if (url && url.startsWith('data:')) return;
    if (allowLocalFallback) {
      await openLocalOrOffline();
    } else {
      showOfflinePage('Failed to load POS: ' + (desc || code));
    }
  });

  // Do NOT treat short innerText as blank — purchase/sale pages hide UI
  // behind a preloader (display:none), so innerText can be ~0 while page is fine.
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
    mode: 'shopkeeper-local',
    posUrl: config.posUrl,
    shopName: config.shopName || '',
    shopSetupDone: Boolean(config.shopSetupDone),
    configPath: configPath(),
    online,
    forceLocalMode: true,
    local: localStatus(),
    sync: {
      enabled: false,
      note: 'Phase 2: cloud sync later',
    },
  };
});

ipcMain.handle('desktop:completeShopSetup', async (_event, payload) => {
  const raw = payload || {};
  const shopName = String(raw.shopName || '').trim() || 'My Shop';
  const posUrl = String(raw.posUrl || PLACEHOLDER_URL).trim();
  saveConfig({
    shopName,
    shopSetupDone: true,
    forceLocalMode: true,
    posUrl: /^https?:\/\//i.test(posUrl) ? posUrl : PLACEHOLDER_URL,
  });
  await openLocalOrOffline();
  return { ok: true, shopName };
});

// Keep old IPC name for compatibility — always starts local.
ipcMain.handle('desktop:savePosUrl', async (_event, payload) => {
  const raw = typeof payload === 'string' ? { posUrl: payload } : payload || {};
  const shopName = String(raw.shopName || '').trim() || 'My Shop';
  const posUrl = String(raw.posUrl || PLACEHOLDER_URL).trim();
  saveConfig({
    shopName,
    shopSetupDone: true,
    forceLocalMode: true,
    posUrl: /^https?:\/\//i.test(posUrl) ? posUrl : PLACEHOLDER_URL,
  });
  await openLocalOrOffline();
  return { ok: true, forceLocalMode: true, posUrl };
});

ipcMain.handle('desktop:setForceLocal', async () => {
  saveConfig({ forceLocalMode: true });
  await openLocalOrOffline();
  return { ok: true, forceLocalMode: true };
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

ipcMain.handle('desktop:backupLocalDb', async () => {
  const src = path.join(app.getPath('userData'), 'database', 'pos-local.sqlite');
  if (!fs.existsSync(src) || fs.statSync(src).size < 100) {
    throw new Error('Local DB abhi nahi bani. Pehle Start local POS chalao.');
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const defaultName = `StoreeoPOS-backup-${stamp}.zip`;
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Save local POS backup',
    defaultPath: path.join(app.getPath('documents'), defaultName),
    filters: [
      { name: 'Zip archive', extensions: ['zip'] },
      { name: 'All files', extensions: ['*'] },
    ],
  });

  if (result.canceled || !result.filePath) {
    return { ok: false, canceled: true };
  }

  const outZip = result.filePath.endsWith('.zip') ? result.filePath : result.filePath + '.zip';
  const tmpDir = path.join(app.getPath('temp'), 'storeeo-backup-' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });
  const sqliteCopy = path.join(tmpDir, 'pos-local.sqlite');
  const readme = path.join(tmpDir, 'RESTORE.txt');
  fs.copyFileSync(src, sqliteCopy);
  fs.writeFileSync(
    readme,
    'Storeeo POS local backup\n\n1. Close Storeeo POS\n2. Copy pos-local.sqlite to %APPDATA%\\\\StoreeoPOS\\\\database\\\\pos-local.sqlite\n3. Start app again\n'
  );

  try {
    const { execFileSync } = require('child_process');
    if (process.platform === 'win32') {
      const ps = `Compress-Archive -Path '${sqliteCopy.replace(/'/g, "''")}','${readme.replace(/'/g, "''")}' -DestinationPath '${outZip.replace(/'/g, "''")}' -Force`;
      execFileSync('powershell.exe', ['-NoProfile', '-Command', ps], { windowsHide: true });
    } else {
      execFileSync('zip', ['-j', '-q', outZip, sqliteCopy, readme]);
    }
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {
      // ignore
    }
  }

  const backupDir = path.join(app.getPath('userData'), 'backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const mirror = path.join(backupDir, path.basename(outZip));
  fs.copyFileSync(outZip, mirror);

  return { ok: true, path: outZip, mirror };
});

ipcMain.handle('desktop:openBackupsPage', async () => {
  try {
    const url = await startLocalServer();
    openPos(url.replace(/\/$/, '') + '/backups', { allowLocalFallback: false });
    return { ok: true, url: url + '/backups' };
  } catch (e) {
    const msg = e && e.message ? e.message : String(e);
    showOfflinePage(msg);
    throw new Error(msg);
  }
});
