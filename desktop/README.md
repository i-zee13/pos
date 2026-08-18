# Storeeo POS — Windows desktop (1→1 offline)

Branch: `feature/offline-desktop-exe`

Shop PC: **no XAMPP / Composer**. You ship a single `.exe`.

## Phases

| Phase | Status | Deliverable |
|-------|--------|-------------|
| **0** | Done | Electron shell + setup URL + cloud POS |
| **1** | In progress | Portable PHP + `app-local` Laravel; offline → `http://127.0.0.1:8787` |
| **2** | Next | `sync_queue` push/pull when net returns |

## Phase 1 — build offline-capable installer (developer machine)

```bash
cd /path/to/pos
composer install   # if vendor missing

cd desktop
npm install
npm run fetch:php-win      # downloads Windows PHP into runtime/php
npm run prepare:app-local  # copies Laravel → app-local (needs vendor/)

# Inside app-local, generate key + sqlite migrate (once):
cd app-local
# set APP_KEY — copy from main .env or:
../runtime/php/php.exe artisan key:generate   # on Windows host
# or on Mac with system php against app-local:
php artisan key:generate --env=local
php artisan migrate --force --path=database/migrations/2026_08_17_000001_create_sync_queue_table.php
# Full schema still needs a local sqlite dump/seed (Phase 1.1) — see below.

cd ../desktop
npm run pack:win
# → dist/StoreeoPOS-Setup-0.2.0.exe
```

### Runtime behaviour

1. Setup screen → save cloud URL (`https://pos.storeeo.app/...`)
2. **Online** → open cloud URL  
3. **Offline** → start bundled `php artisan serve` on port **8787** and open local POS  
4. If PHP/`app-local` missing → offline page with Retry / Start local

### Still TODO before real offline sales

- Seed `app-local` SQLite with products/customers (or first-online sync pull — Phase 2)
- MySQL→SQLite compatibility checks for existing queries
- `sync_queue` writers on sale save

## Config

`%APPDATA%\StoreeoPOS\desktop-config.json` (created automatically; setup UI preferred)

## Dev without packaging

```bash
cd desktop
npm start
# Offline test: turn Wi‑Fi off; if system `php` exists and repo has artisan, local serve can start from repo root.
```
