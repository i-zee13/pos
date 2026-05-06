<?php

namespace App\Jobs;

use App\Models\BackupLog;
use App\Services\DatabaseBackupService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RunDatabaseBackupJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** @var int */
    public $backupLogId;

    public $timeout = 3600;

    public $tries = 1;

    public function __construct(int $backupLogId)
    {
        $this->backupLogId = $backupLogId;
    }

    public function handle(DatabaseBackupService $service): void
    {
        $log = BackupLog::find($this->backupLogId);
        if (! $log) {
            return;
        }

        $service->run($log);
    }

    public function failed(\Throwable $e): void
    {
        $log = BackupLog::find($this->backupLogId);
        if (! $log || $log->status === 'completed') {
            return;
        }

        $log->update([
            'status' => 'failed',
            'error_message' => $e->getMessage(),
            'completed_at' => now(),
        ]);
    }
}
