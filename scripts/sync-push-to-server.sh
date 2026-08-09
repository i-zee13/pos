#!/usr/bin/env bash
# =============================================================================
#  sync-push-to-server.sh
#  -------------------------------------------------------------------
#  Local DB → server (mysqldump local, phir import-remote flow jaisa).
#
#  Usage:
#    ./scripts/sync-push-to-server.sh
#    ./scripts/sync-push-to-server.sh --skip-setup
#    ./scripts/sync-push-to-server.sh --backup-first
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="${SCRIPT_DIR}/remote-db.env"
DOTENV="${PROJECT_DIR}/.env"
DOWNLOADS_DIR="${DOWNLOADS_DIR:-$HOME/Downloads}"
DOWNLOADS_DIR="${DOWNLOADS_DIR/#\~/$HOME}"

EXTRA_ARGS=()
for arg in "$@"; do
  EXTRA_ARGS+=("$arg")
done

[[ -f "$ENV_FILE" ]] || { echo "ERROR: $ENV_FILE missing"; exit 1; }
[[ -f "$DOTENV" ]] || { echo "ERROR: $DOTENV missing"; exit 1; }

# shellcheck disable=SC1090
source "$ENV_FILE"

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

STAMP="$(date +%Y%m%d_%H%M%S)"
DUMP_NAME="${LOCAL_NAME}_push_${STAMP}.sql"
LOCAL_DUMP="${DOWNLOADS_DIR}/${DUMP_NAME}"

mkdir -p "$DOWNLOADS_DIR"

echo "==> SYNC PUSH (local → server)"
echo "    Local:  $LOCAL_USER@$LOCAL_HOST:$LOCAL_PORT / $LOCAL_NAME"
echo "    Dump:   $LOCAL_DUMP"
echo

DUMP_CMD=(mysqldump -h "$LOCAL_HOST" -P "$LOCAL_PORT" -u "$LOCAL_USER" --single-transaction --quick)
if [[ -n "$LOCAL_PASS" ]]; then
  DUMP_CMD+=(-p"$LOCAL_PASS")
fi
DUMP_CMD+=("$LOCAL_NAME")

echo "==> Dumping local DB..."
"${DUMP_CMD[@]}" > "$LOCAL_DUMP"
ls -lh "$LOCAL_DUMP"

echo "==> Uploading + importing on server..."
"${SCRIPT_DIR}/import-remote-db.sh" "$DUMP_NAME" "${EXTRA_ARGS[@]}"

echo
echo "==> PUSH COMPLETE"
