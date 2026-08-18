#!/usr/bin/env node
/**
 * Download portable PHP for Windows into desktop/runtime/php
 * Run on Mac/Windows before pack:win so the installer ships PHP (no XAMPP on shop PC).
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const PHP_VERSION = '8.1.31';
const ZIP_NAME = `php-${PHP_VERSION}-Win32-vs16-x64.zip`;
// Use archives — current /releases/ tree 404s for older 8.1 builds.
const URL = `https://windows.php.net/downloads/releases/archives/${ZIP_NAME}`;

const desktopDir = path.resolve(__dirname, '..');
const runtimeDir = path.join(desktopDir, 'runtime', 'php');
const zipPath = path.join(desktopDir, 'runtime', ZIP_NAME);

function download(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          fs.unlinkSync(dest);
          return download(res.headers.location, dest).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          reject(new Error('HTTP ' + res.statusCode + ' for ' + url));
          return;
        }
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve(dest)));
      })
      .on('error', reject);
  });
}

async function main() {
  console.log('Downloading', URL);
  await download(URL, zipPath);
  console.log('Extracting to', runtimeDir);
  fs.rmSync(runtimeDir, { recursive: true, force: true });
  fs.mkdirSync(runtimeDir, { recursive: true });

  if (process.platform === 'darwin' || process.platform === 'linux') {
    execSync(`unzip -q "${zipPath}" -d "${runtimeDir}"`, { stdio: 'inherit' });
  } else {
    execSync(
      `powershell -NoProfile -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${runtimeDir}' -Force"`,
      { stdio: 'inherit' }
    );
  }

  const phpIniDev = path.join(runtimeDir, 'php.ini-development');
  const phpIni = path.join(runtimeDir, 'php.ini');
  if (fs.existsSync(phpIniDev) && !fs.existsSync(phpIni)) {
    fs.copyFileSync(phpIniDev, phpIni);
  }

  // Enable common extensions for Laravel if php.ini exists
  if (fs.existsSync(phpIni)) {
    let ini = fs.readFileSync(phpIni, 'utf8');
    const exts = [
      'curl',
      'fileinfo',
      'gd',
      'mbstring',
      'openssl',
      'pdo_mysql',
      'pdo_sqlite',
      'sqlite3',
    ];
    for (const name of exts) {
      ini = ini.replace(new RegExp(`;\\s*extension\\s*=\\s*${name}\\b`, 'gi'), `extension=${name}`);
    }
    // extension_dir for Windows portable
    if (!/^\s*extension_dir\s*=/m.test(ini)) {
      ini = ini.replace(
        /;?\s*extension_dir\s*=\s*"ext"/,
        'extension_dir = "ext"'
      );
      if (!/^\s*extension_dir\s*=/m.test(ini)) {
        ini += '\nextension_dir = "ext"\n';
      }
    }
    fs.writeFileSync(phpIni, ini);
  }

  const phpExe = path.join(runtimeDir, 'php.exe');
  if (!fs.existsSync(phpExe)) {
    throw new Error('php.exe not found after extract — check ZIP layout');
  }
  console.log('OK:', phpExe);
  console.log('Next: npm run prepare:app-local && npm run pack:win');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
