<?php

namespace App\Console\Commands;

use App\Jobs\RunDatabaseBackupJob;
use App\Models\BackupLog;
use App\Services\DatabaseBackupService;
use Illuminate\Console\Command;

class BackupDatabasesCommand extends Command
{
    protected $signature = 'backup:databases {--scheduled : Log as schedule-triggered} {--sync : Run in-process (no queue worker)}';

    protected $description = 'Queue (or run) a multi-database mysqldump zip; optional rclone to Google Drive.';

    public function handle(): int
    {
        $databases = DatabaseBackupService::resolveDatabaseNamesFromConfig();
        if (empty($databases)) {
            $this->error('No databases to backup. Set BACKUP_DATABASES or DB_DATABASE in .env.');

            return 1;
        }

        $triggeredBy = $this->option('scheduled') ? 'schedule' : 'artisan';

        $driveUserId = app(\App\Services\GoogleDriveApiBackupUploader::class)->resolveEffectiveUserId(null);

        $log = BackupLog::create([
            'user_id' => $driveUserId,
            'databases' => $databases,
            'status' => 'pending',
            'triggered_by' => $triggeredBy,
        ]);

        if ($this->option('sync')) {
            app(DatabaseBackupService::class)->run($log);
            $log->refresh();
            $this->info('Backup finished with status: '.$log->status);

            return $log->status === 'completed' ? 0 : 1;
        }

        RunDatabaseBackupJob::dispatch($log->id);
        $this->info('Backup job queued (id '.$log->id.'). Ensure a worker is running: php artisan queue:work');

        return 0;
    }
}
