<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Databases to include in one zip (same MySQL credentials as default connection)
    |--------------------------------------------------------------------------
    | Comma-separated in .env BACKUP_DATABASES=db1,db2. Empty = only default DB_DATABASE.
    */
    'databases' => array_values(array_filter(array_map('trim', explode(',', env('BACKUP_DATABASES', ''))))),

    'mysqldump_path' => env('MYSQLDUMP_PATH', ''),
    'retention_days' => (int) env('BACKUP_RETENTION_DAYS', 4),

    /*
    |--------------------------------------------------------------------------
    | Google Drive via rclone (recommended — same as scripts/backup-db-to-gdrive.ps1)
    |--------------------------------------------------------------------------
    | Set BACKUP_RCLONE_ENABLED=true after rclone is configured on the server.
    | Laravel runs: rclone copy <zip> <remote>:<path>/
    | You do NOT paste Google passwords into Laravel — rclone stores OAuth in its config.
    */
    'rclone' => [
        'enabled' => env('BACKUP_RCLONE_ENABLED', false),
        'binary' => env('BACKUP_RCLONE_BIN', 'rclone'),
        'remote' => env('BACKUP_RCLONE_REMOTE', 'gdrive'),
        'path' => env('BACKUP_RCLONE_PATH', 'POS DBs Backups'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Google Drive API (single admin account — .env only, no UI)
    |--------------------------------------------------------------------------
    | Generate OAuth client + refresh token once (outside this app), then set:
    | BACKUP_GOOGLE_DRIVE_API_ENABLED=true and the GOOGLE_DRIVE_* values below.
    | When enabled and fully filled, uploads use the Drive API instead of rclone.
    | Leave disabled to keep using rclone only.
    */
    'google_drive_api' => [
        'enabled' => env('BACKUP_GOOGLE_DRIVE_API_ENABLED', false),
        'client_id' => env('GOOGLE_DRIVE_CLIENT_ID', ''),
        'client_secret' => env('GOOGLE_DRIVE_CLIENT_SECRET', ''),
        'refresh_token' => env('GOOGLE_DRIVE_REFRESH_TOKEN', ''),
        'folder_id' => env('GOOGLE_DRIVE_FOLDER_ID', ''),
        'folder_name' => env('GOOGLE_DRIVE_FOLDER_NAME', 'POS DBs Backups'),
        // Optional external endpoint that returns a new refresh token JSON:
        // { "refresh_token": "1//...." }.
        // Used only when Google token endpoint returns invalid/expired refresh token.
        'refresh_token_rotate_url' => env('GOOGLE_DRIVE_REFRESH_ROTATE_URL', ''),
        'refresh_token_rotate_secret' => env('GOOGLE_DRIVE_REFRESH_ROTATE_SECRET', ''),
        // Scheduled/cron backups have no logged-in user — use this user's Drive token first.
        'fallback_user_id' => (int) env('BACKUP_GOOGLE_DRIVE_FALLBACK_USER_ID', 0),
    ],

];
