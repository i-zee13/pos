#!/usr/bin/env bash
# =============================================================================
#  import-remote-db.sh
#  -------------------------------------------------------------------
#  Downloads folder se SQL dump uthata hai → server pe upload → DB import
#  → setup_tenant_database.sql (tenant + feature ALTERs) chalata hai.
#
#  Usage:
#    ./scripts/import-remote-db.sh storeeoa_atta_traders.sql
#    ./scripts/import-remote-db.sh my_dump.sql --skip-setup
#    ./scripts/import-remote-db.sh my_dump.sql --backup-first
#
#  Config: scripts/remote-db.env  (copy from remote-db.env.example)
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="${SCRIPT_DIR}/remote-db.env"
SETUP_SQL="${PROJECT_DIR}/setup_tenant_database.sql"

SKIP_SETUP=0
BACKUP_FIRST=0
DUMP_NAME=""

usage() {
  cat <<EOF
Usage: $0 <dump-filename.sql> [--skip-setup] [--backup-first]

  dump-filename   Sirf file ka naam (path auto: \$DOWNLOADS_DIR)
  --skip-setup    Sirf import; tenant/ALTER script mat chalao
  --backup-first  Import se pehle remote DB ka mysqldump backup lo

Example:
  $0 storeeoa_atta_traders.sql
  $0 atta.sql --backup-first
EOF
  exit 1
}

for arg in "$@"; do
  case "$arg" in
    --skip-setup) SKIP_SETUP=1 ;;
    --backup-first) BACKUP_FIRST=1 ;;
    -h|--help) usage ;;
    -*)
      echo "Unknown option: $arg"
      usage
      ;;
    *)
      if [[ -z "$DUMP_NAME" ]]; then
        DUMP_NAME="$arg"
      else
        echo "Extra argument: $arg"
        usage
      fi
      ;;
  esac
done

[[ -n "$DUMP_NAME" ]] || usage

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: Config nahi mili: $ENV_FILE"
  echo "Pehle banao:  cp scripts/remote-db.env.example scripts/remote-db.env"
  echo "Phir us mein SSH/DB values bharo."
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

: "${SSH_HOST:?SSH_HOST missing in remote-db.env}"
: "${SSH_PORT:?SSH_PORT missing in remote-db.env}"
: "${SSH_USER:?SSH_USER missing in remote-db.env}"
: "${SSH_PASS:?SSH_PASS missing in remote-db.env}"
: "${DB_NAME:?DB_NAME missing in remote-db.env}"
: "${DB_USER:?DB_USER missing in remote-db.env}"
: "${DB_PASS:?DB_PASS missing in remote-db.env}"

DOWNLOADS_DIR="${DOWNLOADS_DIR:-$HOME/Downloads}"
DOWNLOADS_DIR="${DOWNLOADS_DIR/#\~/$HOME}"
# Keep remote home as literal ~ (never expand to local Mac path)
REMOTE_DIR="${REMOTE_DIR:-~}"
if [[ "$REMOTE_DIR" == "$HOME" || "$REMOTE_DIR" == "/Users/"* ]]; then
  REMOTE_DIR="~"
fi
LOCAL_DUMP="${DOWNLOADS_DIR}/${DUMP_NAME}"

if [[ ! -f "$LOCAL_DUMP" ]]; then
  echo "ERROR: Dump nahi mili: $LOCAL_DUMP"
  echo "Downloads folder check karo: $DOWNLOADS_DIR"
  exit 1
fi

if [[ ! -f "$SETUP_SQL" ]]; then
  echo "ERROR: setup_tenant_database.sql nahi mili: $SETUP_SQL"
  exit 1
fi

if ! command -v expect >/dev/null 2>&1; then
  echo "ERROR: expect chahiye (macOS pe usually pehle se hota hai)."
  exit 1
fi

REMOTE_DUMP_NAME="$(basename "$DUMP_NAME")"
REMOTE_SETUP_NAME="setup_tenant_database.sql"
STAMP="$(date +%Y%m%d_%H%M%S)"
REMOTE_BACKUP_NAME="${DB_NAME}_backup_before_import_${STAMP}.sql"

echo "==> Dump:     $LOCAL_DUMP"
echo "==> Server:   ${SSH_USER}@${SSH_HOST}:${SSH_PORT}"
echo "==> Database: $DB_NAME"
echo "==> Setup:    $([ "$SKIP_SETUP" -eq 1 ] && echo SKIP || echo YES)"
echo

# -----------------------------------------------------------------------------
# Upload dump (+ setup sql)
# -----------------------------------------------------------------------------
echo "==> Uploading files..."
expect <<EOF
set timeout 600
spawn scp -P ${SSH_PORT} -o StrictHostKeyChecking=accept-new \
  "$LOCAL_DUMP" "$SETUP_SQL" ${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/
expect {
  -re {(?i)password:} { send "${SSH_PASS}\r"; exp_continue }
  -re {(?i)passphrase} { send "${SSH_PASS}\r"; exp_continue }
  eof
}
catch wait result
exit [lindex \$result 3]
EOF

echo "==> Upload done."
echo

# -----------------------------------------------------------------------------
# Remote: optional backup + import + tenant setup
# -----------------------------------------------------------------------------
echo "==> Importing on server (is mein time lag sakta hai)..."

REMOTE_CMDS="set -e
cd ~
ls -lh '${REMOTE_DUMP_NAME}' '${REMOTE_SETUP_NAME}'
"

if [[ "$BACKUP_FIRST" -eq 1 ]]; then
  REMOTE_CMDS+="
echo '==> Remote backup...'
mysqldump -u '${DB_USER}' -p'${DB_PASS}' '${DB_NAME}' > '${REMOTE_BACKUP_NAME}' || mariadb-dump -u '${DB_USER}' -p'${DB_PASS}' '${DB_NAME}' > '${REMOTE_BACKUP_NAME}'
ls -lh '${REMOTE_BACKUP_NAME}'
"
fi

REMOTE_CMDS+="
echo '==> Importing dump...'
if command -v mariadb >/dev/null 2>&1; then
  mariadb -u '${DB_USER}' -p'${DB_PASS}' '${DB_NAME}' < '${REMOTE_DUMP_NAME}'
else
  mysql -u '${DB_USER}' -p'${DB_PASS}' '${DB_NAME}' < '${REMOTE_DUMP_NAME}'
fi
echo IMPORT_OK
"

if [[ "$SKIP_SETUP" -eq 0 ]]; then
  REMOTE_CMDS+="
echo '==> Running setup_tenant_database.sql...'
if command -v mariadb >/dev/null 2>&1; then
  mariadb -u '${DB_USER}' -p'${DB_PASS}' '${DB_NAME}' < '${REMOTE_SETUP_NAME}'
else
  mysql -u '${DB_USER}' -p'${DB_PASS}' '${DB_NAME}' < '${REMOTE_SETUP_NAME}'
fi
echo SETUP_OK
"
fi

REMOTE_CMDS+="
echo '==> Verify...'
if command -v mariadb >/dev/null 2>&1; then
  mariadb -u '${DB_USER}' -p'${DB_PASS}' '${DB_NAME}' -e \"
    SELECT 'tables' AS chk, COUNT(*) AS val FROM information_schema.tables WHERE table_schema='${DB_NAME}'
    UNION ALL
    SELECT 'users missing tenant', COUNT(*) FROM users WHERE tenant_id IS NULL
    UNION ALL
    SELECT 'system customers', COUNT(*) FROM customers WHERE system_code IN ('EXPENSE','COUNTER_SALE','NET_PURCHASE','NET_PURCHASE_RETURN');
  \"
else
  mysql -u '${DB_USER}' -p'${DB_PASS}' '${DB_NAME}' -e \"
    SELECT 'tables' AS chk, COUNT(*) AS val FROM information_schema.tables WHERE table_schema='${DB_NAME}'
    UNION ALL
    SELECT 'users missing tenant', COUNT(*) FROM users WHERE tenant_id IS NULL
    UNION ALL
    SELECT 'system customers', COUNT(*) FROM customers WHERE system_code IN ('EXPENSE','COUNTER_SALE','NET_PURCHASE','NET_PURCHASE_RETURN');
  \"
fi

echo '==> Cleaning uploaded files...'
rm -f ~/'${REMOTE_DUMP_NAME}' ~/'${REMOTE_SETUP_NAME}' ~/import_remote_db_run.sh ~/run_setup_only.sh
echo CLEANUP_OK
echo ALL_DONE
"

# Upload runner + execute via non-interactive ssh command (no fragile prompt match)
REMOTE_SCRIPT_LOCAL="$(mktemp)"
printf '%s\n' "$REMOTE_CMDS" > "$REMOTE_SCRIPT_LOCAL"
# normalize LF
perl -pi -e 's/\r$//' "$REMOTE_SCRIPT_LOCAL" 2>/dev/null || true

expect <<EOF
set timeout 900
log_user 1

spawn scp -P ${SSH_PORT} -o StrictHostKeyChecking=accept-new \
  "$REMOTE_SCRIPT_LOCAL" ${SSH_USER}@${SSH_HOST}:~/import_remote_db_run.sh
expect {
  -re {(?i)password:} { send "${SSH_PASS}\r"; exp_continue }
  -re {(?i)passphrase} { send "${SSH_PASS}\r"; exp_continue }
  eof
}
catch wait result
if {[lindex \$result 3] != 0} { exit [lindex \$result 3] }

# Run remote script directly (avoids stuck interactive prompt matching)
spawn ssh -p ${SSH_PORT} -o StrictHostKeyChecking=accept-new ${SSH_USER}@${SSH_HOST} \
  {bash ~/import_remote_db_run.sh; echo RUN_EXIT:\$?; rm -f ~/import_remote_db_run.sh}
expect {
  -re {(?i)password:} { send "${SSH_PASS}\r"; exp_continue }
  -re {(?i)passphrase} { send "${SSH_PASS}\r"; exp_continue }
  -re {RUN_EXIT:0} { set ok 1 }
  -re {RUN_EXIT:[1-9][0-9]*} { puts "REMOTE_SCRIPT_FAILED"; exit 1 }
  timeout { puts "REMOTE_TIMEOUT"; exit 1 }
  eof
}
if {![info exists ok]} {
  puts "REMOTE_DID_NOT_CONFIRM_SUCCESS"
  exit 1
}
catch wait result
exit [lindex \$result 3]
EOF

rm -f "$REMOTE_SCRIPT_LOCAL"

echo
echo "==> COMPLETE"
echo "    Dump imported into: $DB_NAME"
if [[ "$SKIP_SETUP" -eq 0 ]]; then
  echo "    Tenant/feature setup: applied"
fi
echo "    Uploaded dump/setup files: deleted from server after success"
echo "    Next: server pe .env DB_* check karke app open karo."
