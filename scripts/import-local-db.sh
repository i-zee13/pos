#!/usr/bin/env bash
# =============================================================================
#  import-local-db.sh
#  -------------------------------------------------------------------
#  ~/Downloads se SQL dump uthata hai → local MySQL DB mein import
#  → setup_tenant_database.sql chalata hai.
#
#  Usage:
#    ./scripts/import-local-db.sh atta.sql
#    ./scripts/import-local-db.sh atta.sql --skip-setup
#
#  DB settings project .env se (DB_DATABASE / DB_USERNAME / DB_PASSWORD)
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DOTENV="${PROJECT_DIR}/.env"
SETUP_SQL="${PROJECT_DIR}/setup_tenant_database.sql"
DOWNLOADS_DIR="${DOWNLOADS_DIR:-$HOME/Downloads}"
DOWNLOADS_DIR="${DOWNLOADS_DIR/#\~/$HOME}"

SKIP_SETUP=0
DUMP_NAME=""

usage() {
  cat <<EOF
Usage: $0 <dump-filename.sql> [--skip-setup]

Example:
  $0 atta.sql
EOF
  exit 1
}

for arg in "$@"; do
  case "$arg" in
    --skip-setup) SKIP_SETUP=1 ;;
    -h|--help) usage ;;
    -*)
      echo "Unknown option: $arg"
      usage
      ;;
    *)
      [[ -z "$DUMP_NAME" ]] || usage
      DUMP_NAME="$arg"
      ;;
  esac
done

[[ -n "$DUMP_NAME" ]] || usage

LOCAL_DUMP="${DOWNLOADS_DIR}/${DUMP_NAME}"
[[ -f "$LOCAL_DUMP" ]] || { echo "ERROR: Dump nahi mili: $LOCAL_DUMP"; exit 1; }
[[ -f "$DOTENV" ]] || { echo "ERROR: .env nahi mili: $DOTENV"; exit 1; }
[[ -f "$SETUP_SQL" ]] || { echo "ERROR: setup_tenant_database.sql nahi mili"; exit 1; }

# Read DB_* from .env (simple KEY=VALUE, supports quotes)
get_env() {
  local key="$1"
  local line
  line="$(grep -m1 "^${key}=" "$DOTENV" 2>/dev/null || true)"
  [[ -n "$line" ]] || { printf '%s' ""; return 0; }
  line="${line#${key}=}"
  # trim surrounding quotes
  if [[ "$line" == \"*\" ]]; then
    line="${line:1:${#line}-2}"
  elif [[ "$line" == \'*\' ]]; then
    line="${line:1:${#line}-2}"
  fi
  printf '%s' "$line"
}

DB_HOST="$(get_env DB_HOST)"
DB_PORT="$(get_env DB_PORT)"
DB_NAME="$(get_env DB_DATABASE)"
DB_USER="$(get_env DB_USERNAME)"
DB_PASS="$(get_env DB_PASSWORD)"

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-pos}"
DB_USER="${DB_USER:-root}"

MYSQL=(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER")
if [[ -n "$DB_PASS" ]]; then
  MYSQL+=(-p"$DB_PASS")
fi

echo "==> LOCAL import"
echo "    Dump: $LOCAL_DUMP"
echo "    DB:   $DB_USER@$DB_HOST:$DB_PORT / $DB_NAME"
echo

echo "==> Recreate database..."
"${MYSQL[@]}" -e "DROP DATABASE IF EXISTS \`${DB_NAME}\`; CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo "==> Importing dump (wait)..."
"${MYSQL[@]}" "$DB_NAME" < "$LOCAL_DUMP"
echo "==> Import OK"

if [[ "$SKIP_SETUP" -eq 0 ]]; then
  echo "==> Running setup_tenant_database.sql..."
  "${MYSQL[@]}" "$DB_NAME" < "$SETUP_SQL"
  echo "==> Setup OK"
else
  echo "==> Setup skipped"
fi

echo "==> Verify..."
"${MYSQL[@]}" "$DB_NAME" -e "
SELECT 'tables' AS chk, COUNT(*) AS val FROM information_schema.tables WHERE table_schema='${DB_NAME}'
UNION ALL
SELECT 'users missing tenant', COUNT(*) FROM users WHERE tenant_id IS NULL
UNION ALL
SELECT 'system customers', COUNT(*) FROM customers WHERE system_code IN ('EXPENSE','COUNTER_SALE','NET_PURCHASE','NET_PURCHASE_RETURN');
"

if command -v php >/dev/null 2>&1; then
  (cd "$PROJECT_DIR" && php artisan config:clear >/dev/null 2>&1 || true)
  (cd "$PROJECT_DIR" && php artisan cache:clear >/dev/null 2>&1 || true)
fi

echo
echo "==> COMPLETE (local)"
echo "    Open: http://localhost:8000"
