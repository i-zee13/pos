<?php

namespace App\Console\Commands;

use App\Models\UserBackupMailSetting;
use App\Services\GoogleDriveApiBackupUploader;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class RefreshGoogleDriveTokensCommand extends Command
{
    protected $signature = 'backup:refresh-drive-tokens';

    protected $description = 'Proactively refresh connected Google Drive OAuth tokens so backups never fail on an expired token.';

    public function handle(GoogleDriveApiBackupUploader $uploader): int
    {
        $ok = 0;
        $failed = 0;

        // Per-user connected Drive accounts (all tenants; runs without auth context).
        $settings = UserBackupMailSetting::query()
            ->whereNotNull('google_drive_refresh_token_encrypted')
            ->get();

        foreach ($settings as $setting) {
            try {
                $uploader->keepAlive((int) $setting->user_id);
                $ok++;
            } catch (\Throwable $e) {
                $failed++;
                Log::warning('backup.gdrive_keepalive_failed', [
                    'user_id' => $setting->user_id,
                    'message' => $e->getMessage(),
                ]);
            }
        }

        // .env / integration based admin token (single account), if configured.
        if ($uploader->isConfigured(null)) {
            try {
                $uploader->keepAlive(null);
                $ok++;
            } catch (\Throwable $e) {
                $failed++;
                Log::warning('backup.gdrive_keepalive_failed', ['user_id' => 'admin', 'message' => $e->getMessage()]);
            }
        }

        $this->info("Google Drive token keep-alive done. refreshed={$ok}, failed={$failed}");

        return 0;
    }
}
