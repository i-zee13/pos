#!/usr/bin/env php
<?php
/**
 * Smoke-test local (SQLite) purchase save path used by desktop app.
 * Run from repo root:
 *   php desktop/scripts/smoke-local-purchase.php
 */
declare(strict_types=1);

$repo = dirname(__DIR__, 2);
require $repo . '/vendor/autoload.php';

$app = require $repo . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Company;
use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductPurchase;
use App\Models\PurchaseInvoice;
use App\Models\User;
use App\Models\VendorLedger;
use App\Models\VendorStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

$tmpDir = sys_get_temp_dir() . '/storeeo-smoke-' . getmypid();
@mkdir($tmpDir, 0777, true);
$dbPath = $tmpDir . '/pos-local.sqlite';
@unlink($dbPath);
touch($dbPath);

config([
    'database.default' => 'sqlite',
    'database.connections.sqlite.database' => $dbPath,
    'database.connections.sqlite.prefix' => '',
]);
DB::purge('sqlite');
DB::reconnect('sqlite');

$bootstrapPhp = $repo . '/database/desktop_sqlite_bootstrap.php';
$bootstrapSql = $repo . '/desktop/assets/sqlite-bootstrap.sql';
if (!is_file($bootstrapPhp) || !is_file($bootstrapSql)) {
    fwrite(STDERR, "Missing bootstrap files\n");
    exit(1);
}
// Ensure bootstrap finds sql next to php script copy
$tmpBootstrapPhp = $tmpDir . '/desktop_sqlite_bootstrap.php';
$tmpBootstrapSql = $tmpDir . '/sqlite-bootstrap.sql';
copy($bootstrapPhp, $tmpBootstrapPhp);
copy($bootstrapSql, $tmpBootstrapSql);
// Patch bootstrap path: script looks for sql beside itself
passthru(PHP_BINARY . ' ' . escapeshellarg($tmpBootstrapPhp) . ' ' . escapeshellarg($dbPath), $code);
if ($code !== 0) {
    fwrite(STDERR, "Bootstrap failed code=$code\n");
    exit(1);
}

DB::reconnect('sqlite');

$user = User::query()->orderBy('id')->first();
if (!$user) {
    fwrite(STDERR, "No admin user after bootstrap\n");
    exit(1);
}
Auth::loginUsingId($user->id);

$company = Company::query()->first();
if (!$company) {
    $company = new Company();
    $company->company_name = 'Smoke Co';
    $company->tenant_id = 1;
    $company->created_by = $user->id;
    $company->save();
}

$vendor = Customer::query()->where('customer_type', 1)->orderBy('id')->first();
if (!$vendor) {
    $vendor = new Customer();
    $vendor->customer_name = 'NET PURCHASE';
    $vendor->customer_type = 1;
    $vendor->balance = 0;
    $vendor->tenant_id = 1;
    $vendor->created_by = $user->id;
    $vendor->save();
}

$product = Product::query()->first();
if (!$product) {
    $product = new Product();
    $product->product_name = 'emotions tissue';
    $product->company_id = $company->id;
    $product->barcode = 'SMOKE-' . time();
    $product->old_purchase_price = 210;
    $product->new_purchase_price = 210;
    $product->sale_price = 300;
    $product->stock_balance = 0;
    $product->tenant_id = 1;
    $product->created_by = $user->id;
    $product->save();
} else {
    $product->company_id = $product->company_id ?: $company->id;
    $product->save();
}

$req = Request::create('/add-purchase-invoice', 'POST', [
    'invoice_date' => date('Y-m-d'),
    'invoice_no' => '1-' . date('d-m-y'),
    'invoice_type' => 1,
    'customer_id' => $vendor->id,
    'amount_to_pay' => 2100,
    'amount_received' => 2100,
    'product_net_total' => 2100,
    'service_charges' => 0,
    'previous_receivable' => 0,
    'invoice_discount' => 0,
    'cash_return' => 0,
    'description' => 'smoke test',
    'purchased_product_array' => [[
        'purchase_prod_id' => 0,
        'product_id' => $product->id,
        'old_price' => '',
        'new_price' => 210,
        'sale_price' => 300,
        'expiry_date' => '',
        'qty' => 10,
        'prod_discount' => 0,
        'amount' => 2100,
        'p_name' => $product->product_name,
    ]],
]);
$req->setUserResolver(fn () => $user);

try {
    $controller = app(\App\Http\Controllers\StockController::class);
    $response = $controller->purchaseInvoice($req);
    $payload = $response->getData(true);
    $status = $response->getStatusCode();
    echo "HTTP $status\n";
    echo json_encode($payload, JSON_PRETTY_PRINT) . "\n";

    if ($status >= 400 || ($payload['status'] ?? '') !== 'success') {
        exit(2);
    }

    $vsCount = VendorStock::count();
    $vsmCount = DB::table('vendor_stock_managment')->count();
    $ppCount = ProductPurchase::count();
    $piCount = PurchaseInvoice::count();
    echo "OK purchase_invoices=$piCount products_purchases=$ppCount vendor_stocks=$vsCount vendor_stock_managment=$vsmCount\n";
    echo "DB=$dbPath\n";
    exit(0);
} catch (Throwable $e) {
    fwrite(STDERR, 'EXCEPTION: ' . $e->getMessage() . "\n");
    fwrite(STDERR, $e->getFile() . ':' . $e->getLine() . "\n");
    exit(3);
}
