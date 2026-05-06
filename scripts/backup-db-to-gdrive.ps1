<#
.SYNOPSIS
  Daily multi-database backup: mysqldump each DB into one zip (date-based name) + rclone to Google Drive.

.PREREQUISITES
  1) rclone: https://rclone.org/downloads/ — add to PATH, then: rclone config (remote e.g. "gdrive")
  2) .env: DB_* credentials. Optional BACKUP_DATABASES=db1,db2,db3 (comma-separated). If omitted, DB_DATABASE is used alone.

.USAGE (Task Scheduler)
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "D:\path\to\pos\scripts\backup-db-to-gdrive.ps1"

  Optional:
    -Databases "db_a,db_b"   # overrides BACKUP_DATABASES / DB_DATABASE
    -RcloneRemote "gdrive" -RclonePath "POS DBs Backups"
    -MysqldumpPath "C:\xampp\mysql\bin\mysqldump.exe"
    -LocalRetentionDays 4

.ZIP NAME
  dbname_dd_mmm lowercase, e.g. pos_06_may.zip ; if file exists, appends _HHmmss before .zip
#>

param(
    [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot),
    [string]$EnvFile = "",
    [string]$Databases = "",
    [string]$MysqldumpPath = "",
    [string]$RcloneRemote = "gdrive",
    [string]$RclonePath = "POS DBs Backups",
    [string]$LocalBackupDir = "",
    [int]$LocalRetentionDays = 4
)

$ErrorActionPreference = "Stop"

if (-not $EnvFile) { $EnvFile = Join-Path $ProjectRoot ".env" }
if (-not (Test-Path $EnvFile)) { throw ".env not found: $EnvFile" }

if (-not $LocalBackupDir) { $LocalBackupDir = Join-Path $ProjectRoot "storage\app\db-backups" }
if (-not (Test-Path $LocalBackupDir)) { New-Item -ItemType Directory -Path $LocalBackupDir -Force | Out-Null }

function Get-EnvValue([string]$content, [string]$key) {
    foreach ($line in $content -split "`n") {
        $t = $line.Trim()
        if ($t -eq "" -or $t.StartsWith("#")) { continue }
        if ($t -match "^$key\s*=\s*(.*)$") {
            $v = $Matches[1].Trim()
            if (($v.StartsWith('"') -and $v.EndsWith('"')) -or ($v.StartsWith("'") -and $v.EndsWith("'"))) {
                $v = $v.Substring(1, $v.Length - 2)
            }
            return $v
        }
    }
    return ""
}

$envText = Get-Content -Raw -Path $EnvFile
$dbHost = Get-EnvValue $envText "DB_HOST"
$dbPort = Get-EnvValue $envText "DB_PORT"
$dbName = Get-EnvValue $envText "DB_DATABASE"
$dbUser = Get-EnvValue $envText "DB_USERNAME"
$dbPass = Get-EnvValue $envText "DB_PASSWORD"
$backupDbsEnv = Get-EnvValue $envText "BACKUP_DATABASES"

if (-not $dbName -or -not $dbUser) { throw "DB_DATABASE / DB_USERNAME missing in .env" }
if (-not $dbHost) { $dbHost = "127.0.0.1" }
if (-not $dbPort) { $dbPort = "3306" }

$dbList = @()
if ($Databases.Trim().Length -gt 0) {
    $dbList = @($Databases.Split(",") | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" })
} elseif ($backupDbsEnv.Trim().Length -gt 0) {
    $dbList = @($backupDbsEnv.Split(",") | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" })
} else {
    $dbList = @($dbName)
}

if ($dbList.Count -eq 0) { throw "No databases to backup." }

$mysqldump = $MysqldumpPath
if (-not $mysqldump) {
    $candidates = @(
        "C:\xampp\mysql\bin\mysqldump.exe",
        "C:\wamp64\bin\mysql\mysql8.0.31\bin\mysqldump.exe",
        "C:\wamp64\bin\mysql\mysql8.4.0\bin\mysqldump.exe",
        "C:\laragon\bin\mysql\mysql-8.0.30-winx64\bin\mysqldump.exe"
    )
    foreach ($c in $candidates) {
        if (Test-Path $c) { $mysqldump = $c; break }
    }
}
if (-not $mysqldump) {
    $fromPath = (Get-Command mysqldump -ErrorAction SilentlyContinue)
    if ($fromPath) { $mysqldump = $fromPath.Source }
}
if (-not $mysqldump -or -not (Test-Path $mysqldump)) {
    throw "mysqldump.exe not found. Pass -MysqldumpPath or install MySQL client / XAMPP."
}

$rcloneCmd = Get-Command rclone -ErrorAction SilentlyContinue
if (-not $rcloneCmd) {
    throw "rclone not in PATH. Install from https://rclone.org/downloads/"
}

$dt = Get-Date
$primaryDb = ($dbList | Select-Object -First 1)
$safeDb = ($primaryDb -replace '[^\w\-]', '_')
$datePart = $dt.ToString("dd_MMM").ToLowerInvariant()
$zipBase = "{0}_{1}" -f $safeDb, $datePart
$zipName = "$zipBase.zip"
$zipFile = Join-Path $LocalBackupDir $zipName
if (Test-Path $zipFile) {
    $zipName = "{0}_{1}.zip" -f $zipBase, $dt.ToString("HHmmss")
    $zipFile = Join-Path $LocalBackupDir $zipName
}

$tmpDir = Join-Path $LocalBackupDir ("tmp_" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $tmpDir -Force | Out-Null
$sqlPaths = @()

Write-Host "[backup] Databases: $($dbList -join ', ') @ ${dbHost}:${dbPort}"

$env:MYSQL_PWD = $dbPass
try {
    foreach ($db in $dbList) {
        $safe = ($db -replace '[^\w\-]', '_')
        $sqlFile = Join-Path $tmpDir "$safe.sql"
        Write-Host "[backup] Dumping $db ..."
        & $mysqldump --host=$dbHost --port=$dbPort --user=$dbUser --single-transaction --quick --routines --skip-lock-tables --default-character-set=utf8mb4 $db -r $sqlFile
        if ($LASTEXITCODE -ne 0) { throw "mysqldump failed for '$db' (exit $LASTEXITCODE)" }
        $sqlPaths += $sqlFile
    }
}
finally {
    Remove-Item Env:\MYSQL_PWD -ErrorAction SilentlyContinue
}

Write-Host "[backup] Zipping -> $zipName ..."
Compress-Archive -Path $sqlPaths -DestinationPath $zipFile -Force
Remove-Item -Recurse -Force $tmpDir

$remoteTarget = "$RcloneRemote`:$RclonePath/"
Write-Host "[backup] Uploading to $remoteTarget ..."
& rclone copy $zipFile $remoteTarget --progress --retries 3 --low-level-retries 10
if ($LASTEXITCODE -ne 0) { throw "rclone copy failed (exit $LASTEXITCODE)" }

Write-Host "[backup] Pruning local .zip files older than $LocalRetentionDays days..."
Get-ChildItem $LocalBackupDir -Filter "*.zip" -File | Where-Object {
    $_.LastWriteTime -lt (Get-Date).AddDays(-$LocalRetentionDays)
} | Remove-Item -Force

Write-Host "[backup] Done: $zipFile"
