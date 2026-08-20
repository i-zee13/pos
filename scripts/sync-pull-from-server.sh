#!/usr/bin/env bash
# =============================================================================
#  sync-pull-from-server.sh
#  -------------------------------------------------------------------
#  Server DB → local MySQL (POS local pe chalao jab remote 502 ho).
#
#  Default: SSH + mysqldump (502 se independent — SSH chalay to kaam karega)
#  Optional: --http  PHP db-export.php se download (jab web PHP chal raha ho)
#
#  Usage:
#    ./scripts/sync-pull-from-server.sh
#    ./scripts/sync-pull-from-server.sh --http
#    ./scripts/sync-pull-from-server.sh --skip-setup
#
#  Config: scripts/remote-db.env
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="${SCRIPT_DIR}/remote-db.env"
DOTENV="${PROJECT_DIR}/.env"
SETUP_SQL="${PROJECT_DIR}/setup_tenant_database.sql"
DOWNLOADS_DIR="${DOWNLOADS_DIR:-$HOME/Downloads}"
DOWNLOADS_DIR="${DOWNLOADS_DIR/#\~/$HOME}"

USE_HTTP=0
SKIP_SETUP=0

usage() {
  cat <<EOF
Usage: $0 [--http] [--skip-setup]

  (default)  SSH se remote mysqldump → local import
  --http     PHP db-export.php URL se dump download → local import
  --skip-setup  setup_tenant_database.sql mat chalao
EOF
  exit 1
}

for arg in "$@"; do
  case "$arg" in
    --http) USE_HTTP=1 ;;
    --skip-setup) SKIP_SETUP=1 ;;
    -h|--help) usage ;;
    *) usage ;;
  esac
done

[[ -f "$ENV_FILE" ]] || { echo "ERROR: $ENV_FILE missing"; exit 1; }
[[ -f "$DOTENV" ]] || { echo "ERROR: $DOTENV missing"; exit 1; }

# shellcheck disable=SC1090
source "$ENV_FILE"

: "${SSH_HOST:?}"
: "${SSH_PORT:?}"
: "${SSH_USER:?}"
: "${SSH_PASS:?}"
: "${DB_NAME:?}"
: "${DB_USER:?}"
: "${DB_PASS:?}"

EXPORT_URL="${EXPORT_URL:-}"
EXPORT_TOKEN="${EXPORT_TOKEN:-}"

get_env() {
  local key="$1"
  local line
  line="$(grep -m1 "^${key}=" "$DOTENV" 2>/dev/null || true)"
  [[ -n "$line" ]] || { printf '%s' ""; return 0; }
  line="${line#${key}=}"
  if [[ "$line" == \"*\" ]]; then
    line="${line:1:${#line}-2}"
  elif [[ "$line" == \'*\' ]]; then
    line="${line:1:${#line}-2}"
  fi
  printf '%s' "$line"
}

LOCAL_HOST="$(get_env DB_HOST)"; LOCAL_HOST="${LOCAL_HOST:-127.0.0.1}"
LOCAL_PORT="$(get_env DB_PORT)"; LOCAL_PORT="${LOCAL_PORT:-3306}"
LOCAL_NAME="$(get_env DB_DATABASE)"; LOCAL_NAME="${LOCAL_NAME:-pos}"
LOCAL_USER="$(get_env DB_USERNAME)"; LOCAL_USER="${LOCAL_USER:-root}"
LOCAL_PASS="$(get_env DB_PASSWORD)"

MYSQL=(mysql -h "$LOCAL_HOST" -P "$LOCAL_PORT" -u "$LOCAL_USER")
if [[ -n "$LOCAL_PASS" ]]; then
  MYSQL+=(-p"$LOCAL_PASS")
fi

STAMP="$(date +%Y%m%d_%H%M%S)"
LOCAL_DUMP="${DOWNLOADS_DIR}/${DB_NAME}_pull_${STAMP}.sql"

if ! command -v expect >/dev/null 2>&1; then
  echo "ERROR: expect chahiye"
  exit 1
fi

echo "==> SYNC PULL (server → local)"
echo "    Remote DB: $DB_NAME @ $SSH_HOST"
echo "    Local DB:  $LOCAL_USER@$LOCAL_HOST:$LOCAL_PORT / $LOCAL_NAME"
echo "    Dump file: $LOCAL_DUMP"
echo

mkdir -p "$DOWNLOADS_DIR"

# -----------------------------------------------------------------------------
# Get dump
# -----------------------------------------------------------------------------
if [[ "$USE_HTTP" -eq 1 ]]; then
  [[ -n "$EXPORT_URL" ]] || { echo "ERROR: EXPORT_URL set karo remote-db.env mein"; exit 1; }
  [[ -n "$EXPORT_TOKEN" ]] || { echo "ERROR: EXPORT_TOKEN set karo remote-db.env mein"; exit 1; }
  echo "==> Downloading via PHP export..."
  curl -fL --connect-timeout 30 --max-time 3600 \
    "${EXPORT_URL}?token=${EXPORT_TOKEN}" \
    -o "$LOCAL_DUMP"
else
  echo "==> Dumping on server via SSH (502-safe)..."
  REMOTE_DUMP_NAME="${DB_NAME}_pull_${STAMP}.sql"
  expect <<EOF
set timeout 1200
log_user 1
spawn ssh -p ${SSH_PORT} -o StrictHostKeyChecking=accept-new ${SSH_USER}@${SSH_HOST} \
  {set -e
   DUMP=~/${REMOTE_DUMP_NAME}
   if command -v mysqldump >/dev/null 2>&1; then
     mysqldump -u '${DB_USER}' -p'${DB_PASS}' --single-transaction --quick '${DB_NAME}' > "\$DUMP"
   else
     mariadb-dump -u '${DB_USER}' -p'${DB_PASS}' --single-transaction --quick '${DB_NAME}' > "\$DUMP"
   fi
   ls -lh "\$DUMP"
   echo DUMP_OK}
expect {
  -re {(?i)password:} { send "${SSH_PASS}\r"; exp_continue }
  -re {(?i)passphrase} { send "${SSH_PASS}\r"; exp_continue }
  -re {DUMP_OK} { set ok 1 }
  timeout { puts "REMOTE_DUMP_TIMEOUT"; exit 1 }
  eof
}
if {![info exists ok]} { puts "REMOTE_DUMP_FAILED"; exit 1 }
catch wait result
if {[lindex \$result 3] != 0} { exit [lindex \$result 3] }

spawn scp -P ${SSH_PORT} -o StrictHostKeyChecking=accept-new \
  ${SSH_USER}@${SSH_HOST}:~/${REMOTE_DUMP_NAME} "$LOCAL_DUMP"
expect {
  -re {(?i)password:} { send "${SSH_PASS}\r"; exp_continue }
  -re {(?i)passphrase} { send "${SSH_PASS}\r"; exp_continue }
  eof
}
catch wait result
if {[lindex \$result 3] != 0} { exit [lindex \$result 3] }

spawn ssh -p ${SSH_PORT} -o StrictHostKeyChecking=accept-new ${SSH_USER}@${SSH_HOST} \
  {rm -f ~/${REMOTE_DUMP_NAME}; echo CLEAN_OK}
expect {
  -re {(?i)password:} { send "${SSH_PASS}\r"; exp_continue }
  -re {(?i)passphrase} { send "${SSH_PASS}\r"; exp_continue }
  -re {CLEAN_OK} {}
  eof
}
catch wait result
exit 0
EOF
fi

[[ -s "$LOCAL_DUMP" ]] || { echo "ERROR: dump empty/missing: $LOCAL_DUMP"; exit 1; }
ls -lh "$LOCAL_DUMP"

# -----------------------------------------------------------------------------
# Local import
# -----------------------------------------------------------------------------
echo "==> Recreate local database..."
"${MYSQL[@]}" -e "DROP DATABASE IF EXISTS \`${LOCAL_NAME}\`; CREATE DATABASE \`${LOCAL_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo "==> Importing into local (wait)..."
"${MYSQL[@]}" "$LOCAL_NAME" < "$LOCAL_DUMP"
echo "==> Import OK"

if [[ "$SKIP_SETUP" -eq 0 && -f "$SETUP_SQL" ]]; then
  echo "==> Running setup_tenant_database.sql..."
  "${MYSQL[@]}" "$LOCAL_NAME" < "$SETUP_SQL" || echo "WARN: setup script had errors (often OK if already applied)"
fi

if command -v php >/dev/null 2>&1; then
  (cd "$PROJECT_DIR" && php artisan config:clear >/dev/null 2>&1 || true)
  (cd "$PROJECT_DIR" && php artisan cache:clear >/dev/null 2>&1 || true)
fi

echo
echo "==> COMPLETE — local POS ready"
echo "    Run:  cd $PROJECT_DIR && php artisan serve --host=127.0.0.1 --port=8000"
echo "    Open: http://127.0.0.1:8000"
echo "    Dump kept at: $LOCAL_DUMP"
