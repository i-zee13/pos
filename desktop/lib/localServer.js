const { spawn, execFile } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

const LOCAL_PORT = 8787;
const LOCAL_HOST = '127.0.0.1';

let phpProcess = null;
let lastError = '';

function isDev() {
  return !app.isPackaged;
}

function resolvePaths() {
  if (isDev()) {
    const desktopDir = __dirname.replace(/[\\/]lib$/, '');
    const repoRoot = path.resolve(desktopDir, '..');
    const appLocal = path.join(desktopDir, 'app-local');
    const laravelRoot = fs.existsSync(path.join(appLocal, 'artisan'))
      ? appLocal
      : repoRoot;
    const phpDir = path.join(desktopDir, 'runtime', 'php');
    const phpCandidates = [
      path.join(phpDir, 'php.exe'),
      path.join(phpDir, 'php'),
      'php',
    ];
    return { laravelRoot, phpCandidates, phpDir, desktopDir };
  }

  const res = process.resourcesPath;
  const phpDir = path.join(res, 'php');
  return {
    laravelRoot: path.join(res, 'app-local'),
    phpCandidates: [path.join(phpDir, 'php.exe'), path.join(phpDir, 'php')],
    phpDir,
    desktopDir: res,
  };
}

function findPhp(phpCandidates) {
  for (const c of phpCandidates) {
    if (c === 'php') return c;
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function ensureSqliteAndEnv(laravelRoot, dbPathOverride) {
  const dirs = [
    'storage/app/public',
    'storage/framework/cache',
    'storage/framework/sessions',
    'storage/framework/views',
    'storage/logs',
    'bootstrap/cache',
    'database',
  ];
  for (const d of dirs) {
    fs.mkdirSync(path.join(laravelRoot, d), { recursive: true });
  }

  // Mac pe config:cache absolute paths likh deta hai — Windows pe crash.
  const cacheDir = path.join(laravelRoot, 'bootstrap', 'cache');
  for (const name of fs.readdirSync(cacheDir)) {
    if (name === '.gitignore' || name === 'packages.php' || name === 'services.php') {
      continue;
    }
    if (name.endsWith('.php')) {
      try {
        fs.unlinkSync(path.join(cacheDir, name));
      } catch (e) {
        // ignore
      }
    }
  }

  const dbPath =
    dbPathOverride || path.join(laravelRoot, 'database', 'pos-local.sqlite');
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '');
  }

  const envPath = path.join(laravelRoot, '.env');
  if (!fs.existsSync(envPath)) {
    const example = path.join(laravelRoot, '.env.example.local');
    if (fs.existsSync(example)) {
      fs.copyFileSync(example, envPath);
    }
  }

  // Force sqlite absolute path for Windows portable runs
  if (fs.existsSync(envPath)) {
    let env = fs.readFileSync(envPath, 'utf8');
    const absDb = dbPath.replace(/\\/g, '/');
    if (/^DB_DATABASE=/m.test(env)) {
      env = env.replace(/^DB_DATABASE=.*$/m, 'DB_DATABASE="' + absDb + '"');
    } else {
      env += '\nDB_DATABASE="' + absDb + '"\n';
    }
    if (!/^DB_CONNECTION=/m.test(env)) {
      env += 'DB_CONNECTION=sqlite\n';
    } else {
      env = env.replace(/^DB_CONNECTION=.*$/m, 'DB_CONNECTION=sqlite');
    }
    if (!/^APP_URL=/m.test(env)) {
      env += 'APP_URL=http://127.0.0.1:8787\n';
    } else {
      env = env.replace(/^APP_URL=.*$/m, 'APP_URL=http://127.0.0.1:8787');
    }
    // Never keep a Mac absolute LOG path
    env = env.replace(/^LOG_CHANNEL=.*$/m, 'LOG_CHANNEL=stack');
    try {
      fs.writeFileSync(envPath, env);
    } catch (e) {
      // Packaged resources may be read-only — APP_KEY/DB still set via process env below.
    }
  }

  // Best-effort write into packaged .env (may fail if resources are read-only).
  try {
    ensureAppKeyInEnvFile(laravelRoot);
  } catch (e) {
    // Fallback: APP_KEY is also injected via process env in startLocalServer.
  }

  return dbPath;
}

function mintAppKey() {
  const crypto = require('crypto');
  return 'base64:' + crypto.randomBytes(32).toString('base64');
}

/**
 * Stable APP_KEY in Electron userData (writable on Windows installs).
 * Do not copy keys from the Mac repo .env into the installer.
 */
function resolveOrCreateAppKey() {
  const keyFile = path.join(app.getPath('userData'), 'app-key.txt');
  try {
    if (fs.existsSync(keyFile)) {
      const existing = fs.readFileSync(keyFile, 'utf8').trim();
      if (existing.length > 10) {
        return existing;
      }
    }
    const key = mintAppKey();
    fs.mkdirSync(path.dirname(keyFile), { recursive: true });
    fs.writeFileSync(keyFile, key);
    return key;
  } catch (e) {
    return mintAppKey();
  }
}

/** Laravel needs APP_KEY — generate locally if empty. */
function ensureAppKeyInEnvFile(laravelRoot) {
  const envPath = path.join(laravelRoot, '.env');
  if (!fs.existsSync(envPath)) {
    return;
  }
  let env = fs.readFileSync(envPath, 'utf8');
  const match = env.match(/^APP_KEY\s*=\s*(.*)$/m);
  const current = match ? match[1].trim().replace(/^["']|["']$/g, '') : '';
  if (current.length > 10) {
    return;
  }
  const key = resolveOrCreateAppKey();
  if (/^APP_KEY\s*=/m.test(env)) {
    env = env.replace(/^APP_KEY\s*=.*$/m, 'APP_KEY=' + key);
  } else {
    env += '\nAPP_KEY=' + key + '\n';
  }
  fs.writeFileSync(envPath, env);
}

function writeRouter(laravelRoot) {
  const router = path.join(laravelRoot, 'desktop-router.php');
  const contents = `<?php
// Portable desktop router for php -S
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
if ($uri !== '/' && file_exists(__DIR__.'/public'.$uri)) {
    return false;
}
require_once __DIR__.'/public/index.php';
`;
  try {
    if (!fs.existsSync(router)) {
      fs.writeFileSync(router, contents);
    }
  } catch (e) {
    if (!fs.existsSync(router)) {
      throw new Error(
        'Cannot write desktop-router.php (install folder locked?). Reinstall 0.2.6+. ' +
          e.message
      );
    }
  }
  return router;
}

function localStatus() {
  const { laravelRoot, phpCandidates, phpDir } = resolvePaths();
  const phpBin = findPhp(phpCandidates);
  const hasArtisan = fs.existsSync(path.join(laravelRoot, 'artisan'));
  const hasPublic = fs.existsSync(path.join(laravelRoot, 'public', 'index.php'));
  return {
    ready: Boolean(phpBin && hasArtisan && hasPublic),
    phpBin,
    phpDir,
    laravelRoot,
    hasArtisan,
    hasPublic,
    url: `http://${LOCAL_HOST}:${LOCAL_PORT}`,
    running: Boolean(phpProcess),
    lastError,
  };
}

function waitForHttp(url, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve(true);
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error('Local server timeout (' + timeoutMs / 1000 + 's). PHP start fail?'));
          return;
        }
        setTimeout(tryOnce, 350);
      });
      req.setTimeout(1200, () => req.destroy());
    };
    tryOnce();
  });
}

function killPortWindows(port) {
  return new Promise((resolve) => {
    if (process.platform !== 'win32') {
      resolve();
      return;
    }
    // Never use fragile cmd for-loops — wrong token can taskkill Electron itself.
    execFile(
      'netstat',
      ['-ano'],
      { windowsHide: true, maxBuffer: 2 * 1024 * 1024 },
      (err, stdout) => {
        if (err || !stdout) {
          resolve();
          return;
        }
        const selfPid = process.pid;
        const parentPid = typeof process.ppid === 'number' ? process.ppid : -1;
        const pids = new Set();
        for (const line of String(stdout).split(/\r?\n/)) {
          if (!/LISTENING/i.test(line)) continue;
          const m = line.match(/^\s*TCP\s+(\S+):(\d+)\s+\S+\s+LISTENING\s+(\d+)\s*$/i);
          if (!m) continue;
          if (Number(m[2]) !== Number(port)) continue;
          const pid = Number(m[3]);
          if (!pid || pid === selfPid || pid === parentPid) continue;
          pids.add(pid);
        }
        if (pids.size === 0) {
          resolve();
          return;
        }
        let left = pids.size;
        const done = () => {
          left -= 1;
          if (left <= 0) resolve();
        };
        for (const pid of pids) {
          // No /T — only the listener PID (avoid killing unexpected process trees)
          execFile('taskkill', ['/F', '/PID', String(pid)], { windowsHide: true }, () => done());
        }
      }
    );
  });
}

function runPhpFile(phpBin, args, opts) {
  return new Promise((resolve, reject) => {
    execFile(
      phpBin,
      args,
      {
        cwd: opts.cwd,
        env: opts.env,
        windowsHide: true,
        maxBuffer: 2 * 1024 * 1024,
        timeout: opts.timeout || 120000,
      },
      (err, stdout, stderr) => {
        if (err) {
          const detail = [stderr, stdout, err.message].filter(Boolean).join(' | ');
          reject(new Error(detail.slice(0, 800)));
          return;
        }
        resolve(String(stdout || '').trim());
      }
    );
  });
}

/**
 * First-run: import POS schema into empty SQLite, then Laravel migrations.
 * DB lives in Electron userData (writable on Windows).
 */
async function prepareLocalDatabase(laravelRoot, phpBin, env) {
  const dbPath = path.join(app.getPath('userData'), 'database', 'pos-local.sqlite');
  ensureSqliteAndEnv(laravelRoot, dbPath);

  const bootstrapPhp = path.join(laravelRoot, 'database', 'desktop_sqlite_bootstrap.php');
  const bootstrapSql = path.join(laravelRoot, 'database', 'sqlite-bootstrap.sql');
  if (fs.existsSync(bootstrapPhp) && fs.existsSync(bootstrapSql)) {
    try {
      const out = await runPhpFile(phpBin, [bootstrapPhp, dbPath], {
        cwd: laravelRoot,
        env,
        timeout: 180000,
      });
      if (out) {
        // keep lastError empty on success; optional log via stderr only
      }
    } catch (e) {
      lastError = 'SQLite bootstrap failed: ' + e.message;
      throw new Error(lastError);
    }
  }

  // Laravel-only migrations (sessions, sync_queue, …) — ignore failures if already applied
  try {
    await runPhpFile(phpBin, ['artisan', 'migrate', '--force', '--no-interaction'], {
      cwd: laravelRoot,
      env,
      timeout: 180000,
    });
  } catch (e) {
    // Non-fatal: schema bootstrap already created core POS tables
    if (!/Nothing to migrate|Migration table/i.test(e.message)) {
      // keep going — missing optional migrations shouldn't block login
    }
  }

  return dbPath;
}

async function startLocalServer() {
  lastError = '';
  const status = localStatus();
  if (!status.ready) {
    const missing = [];
    if (!status.phpBin) missing.push('php.exe');
    if (!status.hasArtisan) missing.push('app-local/artisan');
    if (!status.hasPublic) missing.push('app-local/public');
    lastError = 'Local engine missing: ' + missing.join(', ');
    throw new Error(lastError);
  }

  if (phpProcess) {
    try {
      await waitForHttp(status.url, 2500);
      return status.url;
    } catch (e) {
      stopLocalServer();
    }
  }

  await killPortWindows(LOCAL_PORT);

  const env = Object.assign({}, process.env, {
    APP_ENV: 'local',
    // Keep debug off in UI — deprecations/notices break login CSS when printed
    APP_DEBUG: 'false',
    APP_KEY: resolveOrCreateAppKey(),
  });
  // Point PHP at portable php.ini when present
  const ini = path.join(status.phpDir || path.dirname(status.phpBin), 'php.ini');
  if (fs.existsSync(ini)) {
    env.PHPRC = path.dirname(ini);
  }

  // DB env BEFORE bootstrap/migrate so artisan hits the same sqlite file
  const dbPath = path.join(app.getPath('userData'), 'database', 'pos-local.sqlite');
  env.DB_CONNECTION = 'sqlite';
  env.DB_DATABASE = dbPath.replace(/\\/g, '/');
  env.APP_URL = `http://${LOCAL_HOST}:${LOCAL_PORT}`;

  await prepareLocalDatabase(status.laravelRoot, status.phpBin, env);

  const router = writeRouter(status.laravelRoot);
  const publicDir = path.join(status.laravelRoot, 'public');

  // Built-in server: hide PHP notices so they don't corrupt HTML/CSS
  const args = [
    '-d',
    'display_errors=0',
    '-d',
    'display_startup_errors=0',
    '-S',
    `${LOCAL_HOST}:${LOCAL_PORT}`,
    '-t',
    publicDir,
    router,
  ];

  let stdout = '';
  let stderr = '';

  phpProcess = spawn(status.phpBin, args, {
    cwd: status.laravelRoot,
    env,
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  phpProcess.stdout.on('data', (buf) => {
    stdout += buf.toString();
    if (stdout.length > 3000) stdout = stdout.slice(-3000);
  });
  phpProcess.stderr.on('data', (buf) => {
    stderr += buf.toString();
    if (stderr.length > 3000) stderr = stderr.slice(-3000);
  });

  let exitedEarly = null;
  phpProcess.on('error', (err) => {
    exitedEarly = err.message;
    phpProcess = null;
  });
  phpProcess.on('exit', (code) => {
    if (phpProcess) {
      exitedEarly = 'PHP exited code ' + code;
    }
    phpProcess = null;
  });

  try {
    await waitForHttp(status.url, 15000);
  } catch (e) {
    const raw = [e.message, exitedEarly, stderr.trim(), stdout.trim()]
      .filter(Boolean)
      .join(' | ');
    lastError = humanizePhpCrash(raw);
    stopLocalServer();
    throw new Error(lastError);
  }

  return status.url;
}

function humanizePhpCrash(raw) {
  const text = String(raw || '');
  // 3221225781 = 0xC0000135 STATUS_DLL_NOT_FOUND (usually missing VC++ runtime)
  if (
    text.includes('3221225781') ||
    /0xC0000135/i.test(text) ||
    /VCRUNTIME|MSVCP|api-ms-win/i.test(text)
  ) {
    return (
      'Windows pe PHP start nahi hua: Microsoft Visual C++ Redistributable (x64) missing. ' +
      'Install karein: "VC++ 2015-2022 x64" (Microsoft), PC restart, phir Storeeo POS. ' +
      'Detail: ' +
      text.slice(0, 200)
    );
  }
  if (text.includes('3221225477') || /0xC0000005/i.test(text)) {
    return 'PHP crash (access violation). VC++ Redistributable install karke dubara try karein. ' + text.slice(0, 180);
  }
  return text || 'Local POS start failed';
}

function stopLocalServer() {
  if (!phpProcess) return;
  const proc = phpProcess;
  phpProcess = null;
  try {
    if (process.platform === 'win32' && proc.pid) {
      // Only the PHP process — never /T against unknown trees
      execFile('taskkill', ['/F', '/PID', String(proc.pid)], { windowsHide: true }, () => {});
    } else {
      proc.kill();
    }
  } catch (e) {
    // ignore
  }
}

module.exports = {
  LOCAL_PORT,
  localStatus,
  startLocalServer,
  stopLocalServer,
};
