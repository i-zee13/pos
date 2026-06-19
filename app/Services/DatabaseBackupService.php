<?php

namespace App\Services;

use App\Models\BackupLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
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

        $tenantId = $this->resolveTenantIdForBackup($backupLog);
        $tenantScoped = $this->shouldUseTenantScopedDump($backupLog, $tenantId);

        if ($tenantScoped && $tenantId === null) {
            $this->fail($backupLog, 'Tenant backup requires tenant_id on the user or backup log.');

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
        $importMode = $this->tenantImportMode();

        try {
            foreach ($databases as $dbName) {
                $dbName = (string) $dbName;
                if ($dbName === '') {
                    continue;
                }
                $safeFile = preg_replace('/[^\w\-]/', '_', $dbName) ?: 'database';
                if ($tenantScoped && $tenantId !== null) {
                    $safeFile .= '_tenant_'.$tenantId;
                }
                $sqlRel = $tmpRelative.'/'.$safeFile.'.sql';
                $sqlAbs = storage_path('app/'.$sqlRel);

                if ($tenantScoped && $tenantId !== null) {
                    $this->runTenantScopedMysqldump($mysqldump, $host, $port, $user, $password, $dbName, $sqlAbs, $tenantId, $importMode);
                } else {
                    $this->runFullMysqldump($mysqldump, $host, $port, $user, $password, $dbName, $sqlAbs);
                }

                $this->assertImportableSqlFile($sqlAbs, $tenantScoped, $importMode);
                $sqlFiles[] = $sqlAbs;
            }

            if (count($sqlFiles) === 0) {
                $this->fail($backupLog, 'No valid database names in backup list.');

                return;
            }

            $zipBase = $this->buildZipBaseName($database, $tenantScoped ? $tenantId : null);
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

            if ($tenantScoped && $tenantId !== null) {
                $zip->addFromString('RESTORE.txt', $this->buildRestoreReadme($database, $tenantId, $importMode));
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

    protected function tenantImportMode(): string
    {
        $mode = strtolower(trim((string) config('backup.tenant_import_mode', 'merge')));

        return $mode === 'fresh' ? 'fresh' : 'merge';
    }

    protected function resolveTenantIdForBackup(BackupLog $backupLog): ?int
    {
        if ($backupLog->tenant_id !== null) {
            return (int) $backupLog->tenant_id;
        }

        if ($backupLog->user_id) {
            $tenantId = User::where('id', $backupLog->user_id)->value('tenant_id');
            if ($tenantId !== null) {
                return (int) $tenantId;
            }
        }

        return null;
    }

    protected function shouldUseTenantScopedDump(BackupLog $backupLog, ?int $tenantId): bool
    {
        if ($backupLog->triggered_by === 'schedule') {
            return false;
        }

        return $tenantId !== null;
    }

    protected function runFullMysqldump(string $binary, string $host, string $port, string $user, string $password, string $database, string $outputFile): void
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
            '--add-drop-table',
            '--result-file='.$outputFile,
            $database,
        ];

        $this->executeMysqldump($cmd, $password, $database);
    }

    protected function runTenantScopedMysqldump(
        string $binary,
        string $host,
        string $port,
        string $user,
        string $password,
        string $database,
        string $outputFile,
        int $tenantId,
        string $importMode
    ): void {
        $this->writeTenantBackupHeader($outputFile, $database, $tenantId, $importMode);

        $skipTables = array_flip(array_map('strtolower', config('backup.skip_tables', [])));
        $referenceTables = array_flip(array_map('strtolower', config('backup.reference_tables', [])));
        $tables = $this->listDatabaseTables($database);
        $dumpedTables = 0;
        $useDropTable = $importMode === 'fresh';

        foreach ($tables as $table) {
            $tableKey = strtolower($table);
            if (isset($skipTables[$tableKey])) {
                continue;
            }

            $structureArgs = ['--no-data'];
            if ($useDropTable) {
                $structureArgs[] = '--add-drop-table';
            }

            $this->runMysqldumpTable($binary, $host, $port, $user, $password, $database, $table, $outputFile, $structureArgs, true, ! $useDropTable);
            $dumpedTables++;

            if ($this->tableHasColumn($table, 'tenant_id')) {
                if ($importMode === 'merge') {
                    file_put_contents(
                        $outputFile,
                        "\n-- Replace tenant {$tenantId} rows in `{$table}`\nDELETE FROM `{$table}` WHERE `tenant_id` = {$tenantId};\n",
                        FILE_APPEND
                    );
                }

                $this->runMysqldumpTable($binary, $host, $port, $user, $password, $database, $table, $outputFile, [
                    '--no-create-info',
                    '--where=tenant_id='.$tenantId,
                ], true);
            } elseif (isset($referenceTables[$tableKey]) && $importMode === 'fresh') {
                $this->runMysqldumpTable($binary, $host, $port, $user, $password, $database, $table, $outputFile, [
                    '--no-create-info',
                ], true);
            }
        }

        if ($dumpedTables === 0) {
            throw new \RuntimeException('No tables were included in tenant backup for '.$database.'.');
        }

        file_put_contents($outputFile, "\nSET FOREIGN_KEY_CHECKS=1;\n", FILE_APPEND);
    }

    protected function runMysqldumpTable(
        string $binary,
        string $host,
        string $port,
        string $user,
        string $password,
        string $database,
        string $table,
        string $outputFile,
        array $extraArgs,
        bool $append,
        bool $sanitizeStructureForMerge = false
    ): void {
        $partFile = $append ? $outputFile.'.part.tmp' : $outputFile;

        $cmd = array_merge([
            $binary,
            '--host='.$host,
            '--port='.$port,
            '--user='.$user,
            '--single-transaction',
            '--quick',
            '--skip-lock-tables',
            '--default-character-set=utf8mb4',
            '--result-file='.$partFile,
        ], $extraArgs, [$database, $table]);

        $this->executeMysqldump($cmd, $password, $database.'.'.$table);

        if ($append) {
            if (is_file($partFile)) {
                $content = file_get_contents($partFile);
                if ($content !== false && $content !== '') {
                    if ($sanitizeStructureForMerge) {
                        $content = preg_replace('/^DROP TABLE IF EXISTS .*;\s*\r?\n/m', '', $content) ?? $content;
                        $content = preg_replace('/^CREATE TABLE `/m', 'CREATE TABLE IF NOT EXISTS `', $content) ?? $content;
                    }
                    file_put_contents($outputFile, $content, FILE_APPEND);
                }
                @unlink($partFile);
            }
        }
    }

    protected function executeMysqldump(array $cmd, string $password, string $label): void
    {
        $env = $password !== '' ? ['MYSQL_PWD' => $password] : null;

        $process = new Process($cmd, base_path(), $env);
        $process->setTimeout(3600);
        $process->run();

        if (! $process->isSuccessful()) {
            throw new \RuntimeException('mysqldump failed for '.$label.': '.$process->getErrorOutput().$process->getOutput());
        }
    }

    protected function writeTenantBackupHeader(string $outputFile, string $database, int $tenantId, string $importMode): void
    {
        $now = now()->toDateTimeString();
        $modeLabel = $importMode === 'fresh' ? 'fresh (empty DB restore)' : 'merge (inject into existing multi-tenant DB)';
        $header = <<<SQL
-- POS tenant backup (import-ready)
-- Database: {$database}
-- Tenant ID: {$tenantId}
-- Import mode: {$modeLabel}
-- Generated: {$now}

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO';

SQL;

        file_put_contents($outputFile, $header);
    }

    protected function buildRestoreReadme(string $database, int $tenantId, string $importMode): string
    {
        $sqlFile = preg_replace('/[^\w\-]/', '_', $database).'_tenant_'.$tenantId.'.sql';

        if ($importMode === 'fresh') {
            return implode("\r\n", [
                'POS Tenant Backup — Fresh Restore',
                '=================================',
                '',
                'Use on an EMPTY database only.',
                'This file DROPs tables and recreates them with tenant '.$tenantId.' data.',
                '',
                '  mysql -u USER -p empty_db < '.$sqlFile,
            ])."\r\n";
        }

        return implode("\r\n", [
            'POS Tenant Backup — Merge / Inject Restore',
            '============================================',
            '',
            'Safe for a LIVE shared database with multiple tenants.',
            '',
            'What this file does:',
            '- Does NOT drop tables or delete other tenants.',
            '- Ensures tables exist (CREATE TABLE IF NOT EXISTS).',
            '- For each tenant table: DELETE rows WHERE tenant_id='.$tenantId.' then INSERT backup rows.',
            '',
            'Import into your existing POS database:',
            '  mysql -u USER -p '.$database.' < '.$sqlFile,
            '',
            'Other tenants (different tenant_id) are not touched.',
            'Shared reference tables (countries, cities, etc.) are not overwritten in merge mode.',
        ])."\r\n";
    }

    protected function assertImportableSqlFile(string $path, bool $tenantScoped, string $importMode): void
    {
        if (! is_file($path)) {
            throw new \RuntimeException('Backup SQL file was not created.');
        }

        $size = filesize($path) ?: 0;
        if ($size < 128) {
            throw new \RuntimeException('Backup SQL file is too small to be importable.');
        }

        $sample = file_get_contents($path, false, null, 0, 65536);
        if ($sample === false || stripos($sample, 'CREATE TABLE') === false) {
            throw new \RuntimeException('Backup SQL file is missing CREATE TABLE statements and may not import.');
        }

        if ($tenantScoped && stripos($sample, 'FOREIGN_KEY_CHECKS=0') === false) {
            throw new \RuntimeException('Tenant backup SQL is missing import guards.');
        }

        if ($tenantScoped && $importMode === 'merge' && stripos($sample, 'DELETE FROM') === false) {
            throw new \RuntimeException('Merge tenant backup is missing tenant DELETE statements.');
        }
    }

    protected function listDatabaseTables(string $database): array
    {
        $rows = DB::select('SHOW TABLES');
        $key = 'Tables_in_'.$database;
        $tables = [];

        foreach ($rows as $row) {
            $table = $row->{$key} ?? null;
            if (is_string($table) && $table !== '') {
                $tables[] = $table;
            }
        }

        sort($tables);

        return $tables;
    }

    protected function tableHasColumn(string $table, string $column): bool
    {
        try {
            return Schema::hasColumn($table, $column);
        } catch (\Throwable $e) {
            return false;
        }
    }

    protected function buildZipBaseName(string $databaseName, ?int $tenantId = null): string
    {
        $dt = new \DateTimeImmutable('now');
        $db = preg_replace('/[^\w\-]/', '_', $databaseName) ?: 'db';
        $datePart = strtolower($dt->format('d_M'));
        $tenantPart = $tenantId !== null ? '_tenant'.$tenantId : '';

        return $db.$tenantPart.'_'.$datePart;
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
