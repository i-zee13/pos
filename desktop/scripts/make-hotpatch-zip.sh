#!/usr/bin/env bash
# Build a small PHP hotpatch zip for an already-installed Storeeo POS Windows app.
# No Electron rebuild needed — unzip into resources\app-local (overwrite).
#
# Usage (from repo root):
#   bash desktop/scripts/make-hotpatch-zip.sh
#
# On Windows, unzip into the install folder, e.g.:
#   C:\Users\<you>\AppData\Local\Programs\Storeeo POS\resources\app-local\
# then restart Storeeo POS. SQLite data in %APPDATA%\StoreeoPOS is untouched.

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT_DIR="$ROOT/desktop/dist"
STAMP="$(date +%Y%m%d-%H%M)"
ZIP_NAME="StoreeoPOS-hotpatch-invoices-sqlite-${STAMP}.zip"
STAGE="$OUT_DIR/.hotpatch-stage"

rm -rf "$STAGE"
mkdir -p "$STAGE/app"

FILES=(
  "app/helpers.php"
  "app/Http/Controllers/StockController.php"
  "app/Http/Controllers/SaleController.php"
  "app/Http/Controllers/PurchaseReturnController.php"
  "app/Http/Controllers/SalesReturnController.php"
  "app/Http/Controllers/ProductReplacementController.php"
)

for f in "${FILES[@]}"; do
  mkdir -p "$STAGE/app/$(dirname "$f")"
  cp "$ROOT/$f" "$STAGE/app/$f"
done

cat > "$STAGE/README-HOTPATCH.txt" <<'EOF'
Storeeo POS — invoice SQLite hotpatch (no full rebuild)

What this fixes
- Purchase / sale / return / replacement ledger + stock NOT NULL issues on SQLite
- Purchase & sale add / edit / delete product / delete invoice

Install on Windows
1. Quit Storeeo POS completely.
2. Open the app install folder (typical):
     %LOCALAPPDATA%\Programs\Storeeo POS\resources\app-local\
   Or right-click shortcut → Open file location → go up to resources\app-local.
3. Unzip this archive so files land under app-local, e.g.:
     app-local\app\helpers.php
     app-local\app\Http\Controllers\SaleController.php
     ...
   Overwrite when asked.
4. Start Storeeo POS again.

Notes
- Your shop DB stays in %APPDATA%\StoreeoPOS — this only replaces PHP code.
- If the app is in Program Files, you may need Admin to overwrite files.
- Prefer this for quick fix testing; for official release still pack a new Setup.exe.
EOF

mkdir -p "$OUT_DIR"
(
  cd "$STAGE"
  # zip contents so unzipping into app-local works if user opens the zip and copies "app/"
  rm -f "$OUT_DIR/$ZIP_NAME"
  zip -r "$OUT_DIR/$ZIP_NAME" app README-HOTPATCH.txt >/dev/null
)

rm -rf "$STAGE"
echo "Created: $OUT_DIR/$ZIP_NAME"
ls -lh "$OUT_DIR/$ZIP_NAME"
