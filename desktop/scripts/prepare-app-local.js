#!/usr/bin/env node
/**
 * Copy Laravel POS into desktop/app-local for offline packaging.
 * Shop PC will not need XAMPP/Composer — only the packaged exe.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const desktopDir = path.resolve(__dirname, '..');
const repoRoot = path.resolve(desktopDir, '..');
const dest = path.join(desktopDir, 'app-local');

const EXCLUDES = [
  'desktop',
  'node_modules',
  '.git',
  '.idea',
  '.vscode',
  'tests',
  'storage/logs/*',
  'storage/framework/cache/*',
  'storage/framework/sessions/*',
  'storage/framework/views/*',
  '.env',
  '.env.backup',
  'tenants',
  'DB',
  '*.md',
];

function ensureDirs(root) {
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
    fs.mkdirSync(path.join(root, d), { recursive: true });
  }
}

function main() {
  if (!fs.existsSync(path.join(repoRoot, 'artisan'))) {
    throw new Error('Run from POS repo — artisan not found at ' + repoRoot);
  }
  if (!fs.existsSync(path.join(repoRoot, 'vendor'))) {
    throw new Error('vendor/ missing — run composer install in repo root first');
  }

  console.log('Preparing app-local from', repoRoot);
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(dest, { recursive: true });

  const excludeArgs = EXCLUDES.map((e) => `--exclude=${e}`).join(' ');
  // rsync on Mac; fallback to cp on failure
  try {
    execSync(
      `rsync -a ${excludeArgs} --exclude=desktop "${repoRoot}/" "${dest}/"`,
      { stdio: 'inherit' }
    );
  } catch (e) {
    console.warn('rsync failed, using node copy (slower)');
    copyRecursive(repoRoot, dest, new Set(['desktop', 'node_modules', '.git', 'tenants', 'DB']));
  }

  ensureDirs(dest);

  // Never ship Mac absolute paths from config:cache
  const cacheDir = path.join(dest, 'bootstrap', 'cache');
  if (fs.existsSync(cacheDir)) {
    for (const name of fs.readdirSync(cacheDir)) {
      if (name.endsWith('.php') && name !== 'packages.php' && name !== 'services.php') {
        try {
          fs.unlinkSync(path.join(cacheDir, name));
        } catch (e) {
          // ignore
        }
      }
    }
  }

  // Offline SQLite env template
  const envLocal = `APP_NAME="Storeeo POS Local"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8787

LOG_CHANNEL=stack

DB_CONNECTION=sqlite
# Absolute path filled on first desktop run if missing — relative works from artisan cwd:
DB_DATABASE=database/pos-local.sqlite

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DRIVER=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120
`;

  fs.writeFileSync(path.join(dest, '.env.example.local'), envLocal);

  // Empty sqlite file placeholder
  const sqlite = path.join(dest, 'database', 'pos-local.sqlite');
  if (!fs.existsSync(sqlite)) {
    fs.writeFileSync(sqlite, '');
  }

  // Copy .env.example.local → .env if no .env
  if (!fs.existsSync(path.join(dest, '.env'))) {
    fs.copyFileSync(path.join(dest, '.env.example.local'), path.join(dest, '.env'));
  }

  // SQLite bootstrap (schema + local admin seed) for first offline run
  const bootstrapSrc = path.join(desktopDir, 'assets', 'sqlite-bootstrap.sql');
  const bootstrapPhpSrc = path.join(repoRoot, 'database', 'desktop_sqlite_bootstrap.php');
  if (fs.existsSync(bootstrapSrc)) {
    fs.copyFileSync(bootstrapSrc, path.join(dest, 'database', 'sqlite-bootstrap.sql'));
  } else {
    console.warn('WARN: desktop/assets/sqlite-bootstrap.sql missing — run build-sqlite-bootstrap.py');
  }
  if (fs.existsSync(bootstrapPhpSrc)) {
    fs.copyFileSync(
      bootstrapPhpSrc,
      path.join(dest, 'database', 'desktop_sqlite_bootstrap.php')
    );
  }

  const routerSrc = path.join(desktopDir, 'assets', 'desktop-router.php');
  if (fs.existsSync(routerSrc)) {
    fs.copyFileSync(routerSrc, path.join(dest, 'desktop-router.php'));
  }

  console.log('OK: app-local ready at', dest);
  console.log('First local run auto-imports SQLite schema + admin/admin123. Products sync still Phase 2.');
  console.log('Then: npm run fetch:php-win && npm run pack:win');
}

function copyRecursive(src, dst, skipNames) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (skipNames.has(entry.name)) continue;
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(s, d, skipNames);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

main();
