#!/usr/bin/env php
<?php
/**
 * Clear invoice / stock / ledger data; keep products, companies, customers.
 *
 * Desktop default DB:
 *   php desktop/scripts/reset-local-invoices.php
 *
 * Custom sqlite path:
 *   php desktop/scripts/reset-local-invoices.php /path/to/pos-local.sqlite
 *
 * Force without prompt:
 *   php desktop/scripts/reset-local-invoices.php --yes
 */
declare(strict_types=1);

$repo = dirname(__DIR__, 2);
$sqlFile = $repo . '/DB/reset-invoices-keep-masters-sqlite.sql';
if (!is_file($sqlFile)) {
    fwrite(STDERR, "Missing $sqlFile\n");
    exit(1);
}

$args = array_slice($argv, 1);
$yes = in_array('--yes', $args, true) || in_array('-y', $args, true);
$args = array_values(array_filter($args, fn ($a) => !in_array($a, ['--yes', '-y'], true)));

$dbPath = $args[0] ?? null;
if (!$dbPath) {
    $home = getenv('HOME') ?: '';
    // mac/linux smoke path fallback; Windows AppData when run under Wine/WSL is rare —
    // prefer explicit path. Also try common Electron userData on this machine.
    $candidates = array_filter([
        getenv('STOREEO_SQLITE') ?: null,
        $home . '/Library/Application Support/StoreeoPOS/database/pos-local.sqlite',
        $home . '/.config/StoreeoPOS/database/pos-local.sqlite',
        $repo . '/desktop/app-local/database/pos-local.sqlite',
        $repo . '/database/pos-local.sqlite',
    ]);
    foreach ($candidates as $c) {
        if (is_file($c)) {
            $dbPath = $c;
            break;
        }
    }
}

if (!$dbPath || !is_file($dbPath)) {
    fwrite(STDERR, "SQLite DB not found. Pass path:\n  php desktop/scripts/reset-local-invoices.php /path/to/pos-local.sqlite\n");
    exit(1);
}

echo "DB: $dbPath\n";
echo "Will DELETE invoices/stock/ledgers and ZERO customer+product balances.\n";
echo "Will KEEP: products, companies, customers rows.\n";
if (!$yes) {
    echo "Type YES to continue: ";
    $line = trim((string) fgets(STDIN));
    if ($line !== 'YES') {
        echo "Aborted.\n";
        exit(0);
    }
}

$sql = file_get_contents($sqlFile);
$pdo = new PDO('sqlite:' . $dbPath);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Run statement-by-statement; ignore missing optional tables
$buf = '';
$ok = 0;
$skip = 0;
foreach (preg_split("/\r\n|\n|\r/", $sql) as $line) {
    $trim = ltrim($line);
    if ($trim === '' || str_starts_with($trim, '--')) {
        continue;
    }
    $buf .= $line . "\n";
    if (!str_ends_with(rtrim($line), ';')) {
        continue;
    }
    $stmt = trim($buf);
    $buf = '';
    if ($stmt === '') {
        continue;
    }
    try {
        $pdo->exec($stmt);
        $ok++;
    } catch (Throwable $e) {
        $msg = strtolower($e->getMessage());
        if (
            str_contains($msg, 'no such table') ||
            str_contains($msg, 'no such column')
        ) {
            $skip++;
            continue;
        }
        fwrite(STDERR, 'ERROR: ' . $e->getMessage() . "\nSTMT: $stmt\n");
        exit(2);
    }
}

$products = (int) $pdo->query('SELECT COUNT(*) FROM products')->fetchColumn();
$customers = (int) $pdo->query('SELECT COUNT(*) FROM customers')->fetchColumn();
$companies = (int) $pdo->query('SELECT COUNT(*) FROM companies')->fetchColumn();
$purchases = (int) $pdo->query('SELECT COUNT(*) FROM purchase_invoices')->fetchColumn();
$sales = (int) $pdo->query('SELECT COUNT(*) FROM sale_invoices')->fetchColumn();

echo "OK statements=$ok skipped_missing=$skip\n";
echo "Kept: products=$products customers=$customers companies=$companies\n";
echo "Cleared counts: purchase_invoices=$purchases sale_invoices=$sales\n";
exit(0);
