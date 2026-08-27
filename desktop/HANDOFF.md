# Storeeo POS desktop — handoff (continue on another laptop)

**Branch:** `feature/offline-desktop-exe`  
**Chat context:** offline Windows desktop Phase 1 (local SQLite + Electron).  
**Do not mix with:** `stock-godowns` / `main-tanent` invoice-godown merge work (that lived on other branches).

Paste this file into a new Cursor chat on the Windows laptop and say:  
*“Continue Storeeo desktop from `desktop/HANDOFF.md` — build / pack next.”*

---

## Goal

Shop PC gets **one installer** (no XAMPP). App runs Laravel locally when needed.

| Phase | Status | What |
|-------|--------|------|
| 0 | Done | Electron shell + cloud URL setup |
| **1** | **Current** | Portable PHP + `app-local` + local SQLite; local UI on `http://127.0.0.1:8787` |
| 2 | Next | Sync queue push/pull with cloud |

**Shopkeeper mode (current intent):** app should stay on **local** POS (AnyDesk / internet on does not force cloud). Sync = Phase 2.

---

## Repo / laptop bootstrap

```bash
git fetch origin
git checkout feature/offline-desktop-exe
git pull

cd desktop
npm install
```

Latest packaged version in `package.json`: **0.3.5**  
Artifact name: `StoreeoPOS-Setup-0.3.5.exe` (under `desktop/dist/` when built; large binaries may not be on every clone).

### Build installer (Windows or cross-pack as you already do)

```bash
cd desktop
npm run fetch:php-win       # if runtime/php missing
npm run prepare:app-local   # refresh app-local from Laravel (needs vendor)
npm run pack:win
# → desktop/dist/StoreeoPOS-Setup-<version>.exe
```

Dev without pack:

```bash
cd desktop
npm start
```

---

## Runtime paths (Windows client)

| What | Where |
|------|--------|
| Config / setup URL | `%APPDATA%\StoreeoPOS\desktop-config.json` |
| Local SQLite | `%APPDATA%\StoreeoPOS\database\pos-local.sqlite` |
| Writable Laravel storage | `%APPDATA%\StoreeoPOS\laravel-storage` (`DESKTOP_STORAGE_PATH`) |
| Bundled app | install dir → `resources\app-local` + `resources\php` (`asar: false`) |

Bootstrap local DB (when first run / seed path): admin / `admin123`, system customers (EXPENSE, Counter Sale, NET PURCHASE, NET PURCHASE RETURN), company, godown, geo, logo as implemented in app-local bootstrap.

---

## Bugs already fixed (don’t re-debug from zero)

1. **Product add stuck on Processing** — create needs `stock_balance = 0`.
2. **PHP exit `3221225781` / missing DLL** — client must install VC++ x64:  
   https://aka.ms/vs/17/release/vc_redist.x64.exe  
   (see `WINDOWS_LOCAL_FIX.md`)
3. **Blank white screen after install** — Program Files storage read-only → use `%APPDATA%\StoreeoPOS\laravel-storage`.
4. **Dotenv crash** — `GOOGLE_DRIVE_FOLDER_NAME=POS DBs Backups` must be **quoted** in env.
5. **500 after login (force password change)** — profile `$designation` null; patches under `desktop/patches/fix-500-after-login` / `client-replace-now`.
6. **Fake “Blank page detect” on Purchase** — Electron `innerText < 5` on pages with `display:none` preloader; **remove that check** in `desktop/main.js`. Patch zip: `desktop/patches/fix-blank-on-purchase.zip` → replace `resources\app\main.js` on asar:false builds.

Useful patch zips (no full reinstall):

- `desktop/patches/client-replace-now.zip`
- `desktop/patches/fix-blank-on-purchase.zip`
- `desktop/patches/blank-screen-fix.zip` / related READMEs in each folder

---

## Important product notes

- Phase 1 local DB is **not** a live mirror of cloud shop data. Sync = Phase 2.
- Invoice / godown / purchi work on `stock-godowns` + `main-tanent` is **separate**; don’t “fix stock” on this branch unless asked.
- `desktop/app-local` is the packaged Laravel copy — prefer editing via prepare script / known desktop patches so pack stays consistent.

---

## Suggested next steps on Windows laptop

1. Confirm branch + `npm install`.
2. Reproduce or install current `0.3.3` build; verify local open on `127.0.0.1:8787`.
3. If client still white-screen / purchase blank: apply `main.js` blank-page patch + storage path.
4. Bump version in `desktop/package.json` when shipping a new exe.
5. Phase 2 design: what syncs (sales, stock, products), conflict rules, first-online pull.

---

## Cursor tip

Full prior chat does not reliably sync across laptops. Use **this file + the branch** as source of truth. Optional: open prior transcript on Mac only at  
`~/.cursor/projects/.../agent-transcripts/` — not required to continue builds.
