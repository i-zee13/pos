<?php

namespace App\Services;

use App\Models\BackupLog;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;
use ZipArchive;

class DatabaseBackupService
{
    public function run(BackupLog $backupLog): void
    {
        $backupLog->refresh();
        if ($backupLog->status === 'completed') {
            return;
        }

        $backupLog->update(['status' => 'processing']);

        $databases = $backupLog->databases;
        if (empty($databases)) {
            $this->fail($backupLog, 'No databases configured for backup.');

            return;
        }

        $connName = config('database.default');
        $conn = config("database.connections.{$connName}");
        $host = $conn['host'] ?? '127.0.0.1';
        $port = (string) ($conn['port'] ?? '3306');
        $user = $conn['username'] ?? '';
        $password = (string) ($conn['password'] ?? '');
        $database = $conn['database'] ?? '';

        if ($user === '' || $database === '') {
            $this->fail($backupLog, 'Database connection is missing username or database.');

            return;
        }

        $mysqldump = $this->resolveMysqldumpBinary();
        if (! $mysqldump) {
            $this->fail($backupLog, 'mysqldump executable not found. Set MYSQLDUMP_PATH in .env or install MySQL client.');

            return;
        }

        Storage::disk('local')->makeDirectory('db-backups');
        $tmpRelative = 'db-backups/tmp_'.$backupLog->id;
        $tmpAbs = storage_path('app/'.$tmpRelative);
        if (is_dir($tmpAbs)) {
            $this->deleteDirectory($tmpAbs);
        }
        Storage::disk('local')->makeDirectory($tmpRelative);

        $sqlFiles = [];

        try {
            foreach ($databases as $dbName) {
                $dbName = (string) $dbName;
                if ($dbName === '') {
                    continue;
                }
                $safeFile = preg_replace('/[^\w\-]/', '_', $dbName) ?: 'database';
                $sqlRel = $tmpRelative.'/'.$safeFile.'.sql';
                $sqlAbs = storage_path('app/'.$sqlRel);
                $this->runMysqldump($mysqldump, $host, $port, $user, $password, $dbName, $sqlAbs);
                $sqlFiles[] = $sqlAbs;
            }

            if (count($sqlFiles) === 0) {
                $this->fail($backupLog, 'No valid database names in backup list.');

                return;
            }

            $zipBase = $this->buildZipBaseName($database);
            $zipFilename = $zipBase.'.zip';
            $zipRel = 'db-backups/'.$zipFilename;
            $zipAbs = storage_path('app/'.$zipRel);

            if (file_exists($zipAbs)) {
                $zipFilename = $zipBase.'_'.date('His').'.zip';
                $zipRel = 'db-backups/'.$zipFilename;
                $zipAbs = storage_path('app/'.$zipRel);
            }

            $zip = new ZipArchive();
            if ($zip->open($zipAbs, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
                $this->fail($backupLog, 'Could not create zip file.');

                return;
            }

            foreach ($sqlFiles as $path) {
                $zip->addFile($path, basename($path));
            }
            $zip->close();

            $this->deleteDirectory($tmpAbs);

            $size = @filesize($zipAbs) ?: 0;
            $gdriveOk = false;
            $gdrivePath = null;

            $uploader = app(GoogleDriveApiBackupUploader::class);
            $driveUserId = $backupLog->user_id ? (int) $backupLog->user_id : null;
            $useDriveApi = $uploader->isConfigured($driveUserId);

            if ($useDriveApi) {
                try {
                    $gdrivePath = $uploader->uploadZip($zipAbs, $zipFilename, $driveUserId);
                    $gdriveOk = true;
                } catch (\Throwable $e) {
                    Log::warning('backup.google_drive_api_failed', ['message' => $e->getMessage(), 'log_id' => $backupLog->id]);
                }
            } elseif (config('backup.rclone.enabled')) {
                try {
                    $gdrivePath = $this->uploadWithRclone($zipAbs, $zipFilename);
                    $gdriveOk = true;
                } catch (\Throwable $e) {
                    Log::warning('backup.rclone_failed', ['message' => $e->getMessage(), 'log_id' => $backupLog->id]);
                }
            }

            $uploadExpected = $useDriveApi || config('backup.rclone.enabled');
            $errorMessage = null;
            if (! $gdriveOk && $uploadExpected) {
                $errorMessage = $useDriveApi
                    ? 'Local backup OK; Google Drive API upload failed (see laravel.log).'
                    : 'Local backup OK; Google Drive upload failed (see laravel.log).';
            }

            $backupLog->update([
                'zip_filename' => $zipFilename,
                'local_relative_path' => $zipRel,
                'status' => 'completed',
                'size_bytes' => $size,
                'gdrive_uploaded' => $gdriveOk,
                'gdrive_remote_path' => $gdrivePath,
                'error_message' => $errorMessage,
                'completed_at' => now(),
            ]);

            $this->pruneLocalBackups();
        } catch (\Throwable $e) {
            $this->deleteDirectory($tmpAbs);
            $this->fail($backupLog, $e->getMessage());
            throw $e;
        }
    }

    public static function resolveDatabaseNamesFromConfig(): array
    {
        $list = config('backup.databases', []);
        $list = array_values(array_filter(array_map('trim', $list)));
        if (! empty($list)) {
            return $list;
        }
        $conn = config('database.default');
        $db = config("database.connections.{$conn}.database");

        return $db ? [(string) $db] : [];
    }

    protected function buildZipBaseName(string $databaseName): string
    {
        $dt = new \DateTimeImmutable('now');
        $db = preg_replace('/[^\w\-]/', '_', $databaseName) ?: 'db';
        $datePart = strtolower($dt->format('d_M'));

        return $db.'_'.$datePart;
    }

    protected function pruneLocalBackups(): void
    {
        $days = (int) config('backup.retention_days', 4);
        if ($days < 1) {
            $days = 4;
        }

        $cutoff = (new \DateTimeImmutable('now'))->modify('-'.$days.' days')->getTimestamp();
        $backupDir = storage_path('app/db-backups');
        if (! is_dir($backupDir)) {
            return;
        }

        foreach (glob($backupDir.DIRECTORY_SEPARATOR.'*.zip') ?: [] as $zipFile) {
            $mtime = @filemtime($zipFile);
            if ($mtime !== false && $mtime < $cutoff) {
                @unlink($zipFile);
            }
        }
    }

    protected function runMysqldump(string $binary, string $host, string $port, string $user, string $password, string $database, string $outputFile): void
    {
        $cmd = [
            $binary,
            '--host='.$host,
            '--port='.$port,
            '--user='.$user,
            '--single-transaction',
            '--quick',
            '--routines',
            '--skip-lock-tables',
            '--default-character-set=utf8mb4',
            '--result-file='.$outputFile,
            $database,
        ];

        $env = $password !== '' ? ['MYSQL_PWD' => $password] : null;

        $process = new Process($cmd, base_path(), $env);
        $process->setTimeout(3600);
        $process->run();

        if (! $process->isSuccessful()) {
            throw new \RuntimeException('mysqldump failed for '.$database.': '.$process->getErrorOutput().$process->getOutput());
        }
    }

    protected function uploadWithRclone(string $zipAbsolutePath, string $zipFilename): string
    {
        $bin = config('backup.rclone.binary', 'rclone');
        $remote = rtrim((string) config('backup.rclone.remote', 'gdrive'), ':');
        $path = trim((string) config('backup.rclone.path', 'POS-Backups/pos-db'), '/');
        $destination = $remote.':'.$path.'/';

        $process = new Process([$bin, 'copy', $zipAbsolutePath, $destination, '--retries', '3', '--low-level-retries', '10'], base_path(), null, null, 3600);
        $process->run();

        if (! $process->isSuccessful()) {
            throw new \RuntimeException('rclone: '.$process->getErrorOutput().$process->getOutput());
        }

        return $path.'/'.$zipFilename;
    }

    protected function resolveMysqldumpBinary(): ?string
    {
        $configured = config('backup.mysqldump_path');
        if (is_string($configured) && $configured !== '' && is_file($configured)) {
            return $configured;
        }

        $candidates = [
            'C:\\xampp\\mysql\\bin\\mysqldump.exe',
            'C:\\wamp64\\bin\\mysql\\mysql8.0.31\\bin\\mysqldump.exe',
            'C:\\wamp64\\bin\\mysql\\mysql8.4.0\\bin\\mysqldump.exe',
            'C:\\laragon\\bin\\mysql\\mysql-8.0.30-winx64\\bin\\mysqldump.exe',
        ];

        foreach ($candidates as $c) {
            if (is_file($c)) {
                return $c;
            }
        }

        $which = $this->findInPath('mysqldump');
        if ($which) {
            return $which;
        }
        if (PHP_OS_FAMILY === 'Windows' && is_file('C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe')) {
            return 'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe';
        }

        return null;
    }

    protected function findInPath(string $name): ?string
    {
        $paths = explode(PATH_SEPARATOR, (string) getenv('PATH'));
        $ext = PHP_OS_FAMILY === 'Windows' ? ['.exe', '.bat', ''] : [''];
        foreach ($paths as $dir) {
            foreach ($ext as $suffix) {
                $file = rtrim($dir, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.$name.$suffix;
                if (is_file($file)) {
                    return $file;
                }
            }
        }

        return null;
    }

    protected function fail(BackupLog $backupLog, string $message): void
    {
        $backupLog->update([
            'status' => 'failed',
            'error_message' => $message,
            'completed_at' => now(),
        ]);
    }

    protected function deleteDirectory(string $dir): void
    {
        if (! is_dir($dir)) {
            return;
        }
        $items = array_diff(scandir($dir), ['.', '..']);
        foreach ($items as $item) {
            $p = $dir.DIRECTORY_SEPARATOR.$item;
            if (is_dir($p)) {
                $this->deleteDirectory($p);
            } else {
                @unlink($p);
            }
        }
        @rmdir($dir);
    }
}
