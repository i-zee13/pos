#!/usr/bin/env bash
# =============================================================================
#  upload-db-export.php.sh
#  Uploads scripts/server-dropins/db-export.php (+ optional config) to server.
#
#  Usage:
#    ./scripts/upload-db-export.php.sh
#    ./scripts/upload-db-export.php.sh public_html
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/remote-db.env"
DROPIN_DIR="${SCRIPT_DIR}/server-dropins"
PHP_FILE="${DROPIN_DIR}/db-export.php"
CFG_EXAMPLE="${DROPIN_DIR}/db-export.config.example.php"

REMOTE_PUBLIC="${1:-public_html}"

[[ -f "$ENV_FILE" ]] || { echo "ERROR: $ENV_FILE missing"; exit 1; }
[[ -f "$PHP_FILE" ]] || { echo "ERROR: $PHP_FILE missing"; exit 1; }

# shellcheck disable=SC1090
source "$ENV_FILE"

: "${SSH_HOST:?}"
: "${SSH_PORT:?}"
: "${SSH_USER:?}"
: "${SSH_PASS:?}"
: "${DB_NAME:?}"
: "${DB_USER:?}"
: "${DB_PASS:?}"

EXPORT_TOKEN="${EXPORT_TOKEN:-}"
if [[ -z "$EXPORT_TOKEN" ]]; then
  EXPORT_TOKEN="$(openssl rand -hex 24 2>/dev/null || date +%s | shasum | awk '{print $1}')"
  echo "==> Generated EXPORT_TOKEN (save in remote-db.env):"
  echo "    EXPORT_TOKEN=$EXPORT_TOKEN"
fi

TMP_CFG="$(mktemp)"
cat > "$TMP_CFG" <<EOF
<?php
return [
    'token'   => '${EXPORT_TOKEN}',
    'db_host' => 'localhost',
    'db_name' => '${DB_NAME}',
    'db_user' => '${DB_USER}',
    'db_pass' => '${DB_PASS}',
];
EOF

echo "==> Uploading db-export.php → ~/${REMOTE_PUBLIC}/"
expect <<EOF
set timeout 120
spawn scp -P ${SSH_PORT} -o StrictHostKeyChecking=accept-new \
  "$PHP_FILE" "$TMP_CFG" ${SSH_USER}@${SSH_HOST}:~/${REMOTE_PUBLIC}/
expect {
  -re {(?i)password:} { send "${SSH_PASS}\r"; exp_continue }
  -re {(?i)passphrase} { send "${SSH_PASS}\r"; exp_continue }
  eof
}
catch wait result
exit [lindex \$result 3]
EOF

# Rename config on remote
expect <<EOF
set timeout 60
spawn ssh -p ${SSH_PORT} -o StrictHostKeyChecking=accept-new ${SSH_USER}@${SSH_HOST} \
  {mv ~/${REMOTE_PUBLIC}/$(basename "$TMP_CFG") ~/${REMOTE_PUBLIC}/db-export.config.php; ls -la ~/${REMOTE_PUBLIC}/db-export.php ~/${REMOTE_PUBLIC}/db-export.config.php; echo UPLOAD_OK}
expect {
  -re {(?i)password:} { send "${SSH_PASS}\r"; exp_continue }
  -re {(?i)passphrase} { send "${SSH_PASS}\r"; exp_continue }
  -re {UPLOAD_OK} { set ok 1 }
  eof
}
if {![info exists ok]} { exit 1 }
catch wait result
exit [lindex \$result 3]
EOF

rm -f "$TMP_CFG"

# Persist token hint into remote-db.env if missing
if ! grep -q '^EXPORT_TOKEN=' "$ENV_FILE" 2>/dev/null; then
  {
    echo ""
    echo "# For ./scripts/sync-pull-from-server.sh --http"
    echo "EXPORT_TOKEN=${EXPORT_TOKEN}"
    echo "EXPORT_URL=https://YOUR-DOMAIN/db-export.php"
  } >> "$ENV_FILE"
  echo "==> Appended EXPORT_TOKEN to remote-db.env — EXPORT_URL apna domain set karo"
fi

echo
echo "==> DONE"
echo "    Test URL: https://YOUR-DOMAIN/db-export.php?token=${EXPORT_TOKEN}"
echo "    Note: agar site pe 502 hai to yeh PHP bhi fail ho sakti hai."
echo "    Us case mein SSH sync use karo: ./scripts/sync-pull-from-server.sh"
echo "    Example config reference: $CFG_EXAMPLE"
