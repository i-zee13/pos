<?php
/**
 * Put this file on Windows Desktop, then run (Storeeo POS closed):
 *
 * "C:\Users\ZEEHAN COMPUTERS\AppData\Local\Programs\Storeeo POS\resources\php\php.exe" "%USERPROFILE%\Desktop\reset-invoices.php"
 *
 * Clears invoices/stock/ledgers. Keeps products, companies, customers.
 */
declare(strict_types=1);

$db = (getenv('APPDATA') ?: '') . DIRECTORY_SEPARATOR . 'StoreeoPOS' . DIRECTORY_SEPARATOR . 'database' . DIRECTORY_SEPARATOR . 'pos-local.sqlite';

if (!is_file($db)) {
    fwrite(STDERR, "DB not found: $db\n");
    exit(1);
}

$tables = [
    'purchase_invoices',
    'products_purchases',
    'sale_invoices',
    'products_sales',
    'purchase_return_invoices',
    'return_invoices',
    'products_returns',
    'sale_return_invoices',
    'sale_return_products',
    'product_replacment_invoices',
    'product_replacements',
    'stocks',
    'vendor_stocks',
    'vendor_stock_managment',
    'stock_batches_items',
    'stock_batch_allocations',
    'godowns_stocks',
    'stock_transfers',
    'stock_transfer_items',
    'customer_ledger',
    'vendor_ledger',
    'customer_transactions',
    'vendor_transactions',
    'bulk_transactions',
    'installments',
    'admin_sale_close',
];

$pdo = new PDO('sqlite:' . $db);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->exec('PRAGMA foreign_keys = OFF');

$ok = 0;
$skip = 0;
foreach ($tables as $table) {
    try {
        $pdo->exec('DELETE FROM "' . $table . '"');
        $ok++;
        echo "cleared: $table\n";
    } catch (Throwable $e) {
        $skip++;
        echo "skip: $table (" . $e->getMessage() . ")\n";
    }
}

try {
    $names = "'" . implode("','", $tables) . "'";
    $pdo->exec("DELETE FROM sqlite_sequence WHERE name IN ($names)");
} catch (Throwable $e) {
    // ignore
}

$pdo->exec('UPDATE customers SET balance = 0');
$pdo->exec('UPDATE products SET stock_balance = 0');
$pdo->exec('PRAGMA foreign_keys = ON');

$products = (int) $pdo->query('SELECT COUNT(*) FROM products')->fetchColumn();
$customers = (int) $pdo->query('SELECT COUNT(*) FROM customers')->fetchColumn();
$companies = (int) $pdo->query('SELECT COUNT(*) FROM companies')->fetchColumn();
$purchases = (int) $pdo->query('SELECT COUNT(*) FROM purchase_invoices')->fetchColumn();
$sales = (int) $pdo->query('SELECT COUNT(*) FROM sale_invoices')->fetchColumn();

echo "\nOK reset done (cleared=$ok skipped=$skip)\n";
echo "Kept: products=$products customers=$customers companies=$companies\n";
echo "Invoices left: purchase=$purchases sale=$sales (should be 0)\n";
echo "DB: $db\n";
