<?php
/**
 * Standalone DB export for shared hosting (Laravel 502 hone pe bhi kaam kar sakta hai
 * agar PHP files still run ho rahi hon).
 *
 * Upload: public_html/db-export.php  (ya document root)
 * Usage:  https://YOUR-DOMAIN/db-export.php?token=YOUR_SECRET
 *
 * Config: isi file ke neeche $CFG, YA same folder mein db-export.config.php
 *         (config file git mein mat daalo).
 *
 * DELETE this file after use if you don't want it permanently on the server.
 */

declare(strict_types=1);

// ---------------------------------------------------------------------------
// CONFIG — change token + DB before upload (or use db-export.config.php)
// ---------------------------------------------------------------------------
$CFG = [
    'token'    => 'CHANGE_ME_TO_LONG_RANDOM_SECRET',
    'db_host'  => 'localhost',
    'db_name'  => 'dottbfyw_shamastore',
    'db_user'  => 'dottbfyw_shamastore',
    'db_pass'  => 'CHANGE_ME',
    // optional: full path to mysqldump/mariadb-dump if not in PATH
    'dump_bin' => '', // e.g. '/usr/bin/mysqldump'
];

$configFile = __DIR__ . '/db-export.config.php';
if (is_file($configFile)) {
    $loaded = require $configFile;
    if (is_array($loaded)) {
        $CFG = array_merge($CFG, $loaded);
    }
}

$token = (string) ($_GET['token'] ?? '');
if ($CFG['token'] === 'CHANGE_ME_TO_LONG_RANDOM_SECRET' || $token === '' || !hash_equals((string) $CFG['token'], $token)) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Forbidden\n";
    exit;
}

@set_time_limit(0);
@ini_set('memory_limit', '512M');
@ini_set('zlib.output_compression', '0');

$stamp = date('Ymd_His');
$filename = $CFG['db_name'] . '_export_' . $stamp . '.sql';

header('Content-Type: application/sql; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Cache-Control: no-store');
header('X-Accel-Buffering: no');

while (ob_get_level() > 0) {
    ob_end_clean();
}

$host = escapeshellarg((string) $CFG['db_host']);
$name = escapeshellarg((string) $CFG['db_name']);
$user = escapeshellarg((string) $CFG['db_user']);
$pass = (string) $CFG['db_pass'];

$bins = array_values(array_filter([
    (string) ($CFG['dump_bin'] ?? ''),
    'mysqldump',
    'mariadb-dump',
]));

$dumped = false;
foreach ($bins as $bin) {
    $cmd = sprintf(
        '%s -h %s -u %s -p%s --single-transaction --quick --routines --triggers %s 2>/dev/null',
        escapeshellcmd($bin),
        $host,
        $user,
        escapeshellarg($pass),
        $name
    );

    // Prefer passthru if shell exec is allowed
    if (function_exists('passthru') && !in_array('passthru', array_map('trim', explode(',', (string) ini_get('disable_functions'))), true)) {
        $exit = 0;
        passthru($cmd, $exit);
        if ($exit === 0) {
            $dumped = true;
            break;
        }
    }

    if (function_exists('proc_open')) {
        $descriptors = [
            0 => ['pipe', 'r'],
            1 => ['pipe', 'w'],
            2 => ['pipe', 'w'],
        ];
        $proc = proc_open($cmd, $descriptors, $pipes);
        if (is_resource($proc)) {
            fclose($pipes[0]);
            $okBytes = 0;
            while (!feof($pipes[1])) {
                $chunk = fread($pipes[1], 8192);
                if ($chunk === false || $chunk === '') {
                    break;
                }
                $okBytes += strlen($chunk);
                echo $chunk;
                flush();
            }
            fclose($pipes[1]);
            fclose($pipes[2]);
            $code = proc_close($proc);
            if ($code === 0 && $okBytes > 0) {
                $dumped = true;
                break;
            }
        }
    }
}

if ($dumped) {
    exit;
}

// Fallback: pure PHP dump (slower; no views/routines — enough for emergency POS restore)
$mysqli = @new mysqli((string) $CFG['db_host'], (string) $CFG['db_user'], (string) $CFG['db_pass'], (string) $CFG['db_name']);
if ($mysqli->connect_errno) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo "DB connect failed: " . $mysqli->connect_error . "\n";
    exit;
}
$mysqli->set_charset('utf8mb4');

echo "-- Pure-PHP emergency dump\n";
echo "-- Generated: " . date('c') . "\n";
echo "SET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS=0;\n\n";

$tables = [];
$res = $mysqli->query('SHOW TABLES');
while ($row = $res->fetch_row()) {
    $tables[] = $row[0];
}
$res->free();

foreach ($tables as $table) {
    $safe = '`' . str_replace('`', '``', $table) . '`';
    $createRes = $mysqli->query("SHOW CREATE TABLE {$safe}");
    $createRow = $createRes->fetch_assoc();
    $createRes->free();
    $createSql = $createRow['Create Table'] ?? ($createRow['Create View'] ?? null);
    if (!$createSql) {
        continue;
    }

    echo "DROP TABLE IF EXISTS {$safe};\n";
    echo $createSql . ";\n\n";

    $data = $mysqli->query("SELECT * FROM {$safe}", MYSQLI_USE_RESULT);
    if (!$data) {
        continue;
    }

    $batch = [];
    $batchSize = 200;
    while ($row = $data->fetch_assoc()) {
        $vals = [];
        foreach ($row as $v) {
            if ($v === null) {
                $vals[] = 'NULL';
            } else {
                $vals[] = "'" . $mysqli->real_escape_string((string) $v) . "'";
            }
        }
        $batch[] = '(' . implode(',', $vals) . ')';
        if (count($batch) >= $batchSize) {
            echo "INSERT INTO {$safe} VALUES\n" . implode(",\n", $batch) . ";\n";
            $batch = [];
            flush();
        }
    }
    if ($batch) {
        echo "INSERT INTO {$safe} VALUES\n" . implode(",\n", $batch) . ";\n";
        flush();
    }
    $data->free();
    echo "\n";
}

echo "SET FOREIGN_KEY_CHECKS=1;\n";
$mysqli->close();
