#!/usr/bin/env bash
# =============================================================================
#  pos-local-menu.sh — local POS + sync "buttons" (terminal menu)
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_DIR"

while true; do
  cat <<EOF

========================================
  POS LOCAL MENU
========================================
  1) Start local POS (php artisan serve)
  2) Sync PULL  (server → local)   [502-safe SSH]
  3) Sync PUSH  (local → server)
  4) Import local dump from Downloads
  5) Upload db-export.php to server
  q) Quit
========================================
EOF
  read -r -p "Choose: " choice
  case "$choice" in
    1)
      echo "Open http://127.0.0.1:8000"
      php artisan serve --host=127.0.0.1 --port=8000
      ;;
    2)
      "$SCRIPT_DIR/sync-pull-from-server.sh"
      ;;
    3)
      read -r -p "Backup remote first? [y/N] " bak
      if [[ "${bak:-N}" =~ ^[Yy]$ ]]; then
        "$SCRIPT_DIR/sync-push-to-server.sh" --backup-first
      else
        "$SCRIPT_DIR/sync-push-to-server.sh"
      fi
      ;;
    4)
      read -r -p "Dump filename in Downloads (e.g. atta.sql): " dump
      "$SCRIPT_DIR/import-local-db.sh" "$dump"
      ;;
    5)
      "$SCRIPT_DIR/upload-db-export.php.sh"
      ;;
    q|Q)
      exit 0
      ;;
    *)
      echo "Invalid choice"
      ;;
  esac
done
