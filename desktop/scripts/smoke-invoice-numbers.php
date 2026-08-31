#!/usr/bin/env php
<?php
/** Verify daily invoice numbers increment: 1,2,3... */
declare(strict_types=1);

$repo = dirname(__DIR__, 2);
require $repo . '/vendor/autoload.php';
$app = require $repo . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\PurchaseInvoice;
use App\Models\Sale as SaleInvoice;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

$tmpDir = sys_get_temp_dir() . '/storeeo-invno-' . getmypid();
@mkdir($tmpDir, 0777, true);
$dbPath = $tmpDir . '/pos-local.sqlite';
touch($dbPath);

config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => $dbPath]);
DB::purge('sqlite');
DB::reconnect('sqlite');

copy($repo . '/database/desktop_sqlite_bootstrap.php', $tmpDir . '/desktop_sqlite_bootstrap.php');
copy($repo . '/desktop/assets/sqlite-bootstrap.sql', $tmpDir . '/sqlite-bootstrap.sql');
passthru(PHP_BINARY . ' ' . escapeshellarg($tmpDir . '/desktop_sqlite_bootstrap.php') . ' ' . escapeshellarg($dbPath), $code);
if ($code !== 0) {
    exit(1);
}
DB::reconnect('sqlite');
Auth::loginUsingId(User::query()->orderBy('id')->value('id'));

$today = now()->toDateString();

$a = getPurchaseInvoice($today);
PurchaseInvoice::create([
    'invoice_type' => 1,
    'invoice_no' => $a,
    'customer_id' => 1,
    'total_invoice_amount' => 1,
    'invoice_remaining_amount_after_pay' => 0,
    'product_net_total' => 1,
    'status' => 1,
    'is_editable' => 1,
    'created_by' => 1,
    'date' => $today,
]);
$b = getPurchaseInvoice($today);
PurchaseInvoice::create([
    'invoice_type' => 1,
    'invoice_no' => $b,
    'customer_id' => 1,
    'total_invoice_amount' => 1,
    'invoice_remaining_amount_after_pay' => 0,
    'product_net_total' => 1,
    'status' => 1,
    'is_editable' => 1,
    'created_by' => 1,
    'date' => $today,
]);
$c = getPurchaseInvoice($today);

$s1 = getInvoice($today);
SaleInvoice::create([
    'invoice_type' => 1,
    'invoice_no' => $s1,
    'customer_id' => 1,
    'total_invoice_amount' => 1,
    'invoice_remaining_amount_after_pay' => 0,
    'product_net_total' => 1,
    'status' => 1,
    'is_editable' => 1,
    'created_by' => 1,
    'date' => $today,
    'amount_received' => 0,
    'paid_amount' => 0,
]);
$s2 = getInvoice($today);

echo "purchase: $a -> $b -> $c\n";
echo "sale: $s1 -> $s2\n";

$ok = ((int) explode('-', $a)[0] === 1)
    && ((int) explode('-', $b)[0] === 2)
    && ((int) explode('-', $c)[0] === 3)
    && ((int) explode('-', $s1)[0] === 1)
    && ((int) explode('-', $s2)[0] === 2);

if (!$ok) {
    fwrite(STDERR, "FAIL: sequence not incrementing\n");
    exit(2);
}
echo "OK invoice numbers auto-increment\n";
exit(0);
