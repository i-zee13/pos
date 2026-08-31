#!/usr/bin/env php
<?php
/**
 * Full SQLite CRUD smoke for purchase + sale (add / edit / delete product / delete invoice).
 * Run: php desktop/scripts/smoke-local-invoices-crud.php
 */
declare(strict_types=1);

$repo = dirname(__DIR__, 2);
require $repo . '/vendor/autoload.php';

$app = require $repo . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Http\Controllers\SaleController;
use App\Http\Controllers\StockController;
use App\Models\Company;
use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductPurchase;
use App\Models\ProductSale;
use App\Models\PurchaseInvoice;
use App\Models\Sale as SaleInvoice;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

function fail(string $msg, int $code = 1): void
{
    fwrite(STDERR, "FAIL: $msg\n");
    exit($code);
}

function ok(string $step, $payload = null): void
{
    $extra = $payload ? ' ' . json_encode($payload) : '';
    echo "OK $step$extra\n";
}

function assertSuccess($response, string $step): array
{
    $status = $response->getStatusCode();
    $payload = $response->getData(true);
    if ($status >= 400 || ($payload['status'] ?? '') !== 'success') {
        fail("$step HTTP=$status body=" . json_encode($payload));
    }
    ok($step, $payload);
    return $payload;
}

$tmpDir = sys_get_temp_dir() . '/storeeo-crud-' . getmypid();
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
$tmpBootstrapPhp = $tmpDir . '/desktop_sqlite_bootstrap.php';
$tmpBootstrapSql = $tmpDir . '/sqlite-bootstrap.sql';
copy($bootstrapPhp, $tmpBootstrapPhp);
copy($bootstrapSql, $tmpBootstrapSql);
passthru(PHP_BINARY . ' ' . escapeshellarg($tmpBootstrapPhp) . ' ' . escapeshellarg($dbPath), $code);
if ($code !== 0) {
    fail("bootstrap failed code=$code");
}
DB::reconnect('sqlite');

$user = User::query()->orderBy('id')->first() ?: fail('no user');
Auth::loginUsingId($user->id);

$company = Company::query()->first() ?: fail('no company');
$vendor = Customer::query()->where('customer_type', 1)->orderBy('id')->first() ?: fail('no vendor');
$customer = Customer::query()->where('customer_type', 2)->orderBy('id')->first();
if (!$customer) {
    $customer = new Customer();
    $customer->customer_name = 'Counter Sale';
    $customer->customer_type = 2;
    $customer->balance = 0;
    $customer->tenant_id = 1;
    $customer->created_by = $user->id;
    $customer->save();
}

$product = new Product();
$product->product_name = 'CRUD Test Product';
$product->company_id = $company->id;
$product->barcode = 'CRUD-' . time();
$product->old_purchase_price = 100;
$product->new_purchase_price = 100;
$product->sale_price = 150;
$product->stock_balance = 0;
$product->tenant_id = 1;
$product->created_by = $user->id;
$product->save();

$stock = app(StockController::class);
$saleCtrl = app(SaleController::class);

// --- PURCHASE ADD ---
$req = Request::create('/add-purchase-invoice', 'POST', [
    'invoice_date' => date('Y-m-d'),
    'invoice_no' => 'P-' . date('d-m-y'),
    'invoice_type' => 1,
    'customer_id' => $vendor->id,
    'amount_to_pay' => 1000,
    'amount_received' => 1000,
    'product_net_total' => 1000,
    'service_charges' => 0,
    'previous_receivable' => 0,
    'invoice_discount' => 0,
    'cash_return' => 0,
    'description' => 'crud purchase add',
    'purchased_product_array' => [[
        'purchase_prod_id' => 0,
        'product_id' => $product->id,
        'old_price' => '',
        'new_price' => 100,
        'sale_price' => 150,
        'expiry_date' => '',
        'qty' => 10,
        'prod_discount' => 0,
        'amount' => 1000,
        'p_name' => $product->product_name,
    ]],
]);
$req->setUserResolver(fn () => $user);
$purchaseAdd = assertSuccess($stock->purchaseInvoice($req), 'purchase.add');
$purchaseId = (int) $purchaseAdd['invoice_id'];
$pp = ProductPurchase::where('purchase_invoice_id', $purchaseId)->first() ?: fail('no products_purchases');
if ((float) Product::find($product->id)->stock_balance !== 10.0) {
    fail('stock after purchase add expected 10 got ' . Product::find($product->id)->stock_balance);
}

// --- PURCHASE EDIT (qty 10 -> 15) ---
$req = Request::create('/add-purchase-invoice', 'POST', [
    'hidden_invoice_id' => $purchaseId,
    'invoice_date' => date('Y-m-d'),
    'invoice_no' => 'P-' . date('d-m-y'),
    'invoice_type' => 1,
    'customer_id' => $vendor->id,
    'amount_to_pay' => 1500,
    'amount_received' => 1500,
    'product_net_total' => 1500,
    'service_charges' => 0,
    'previous_receivable' => 0,
    'invoice_discount' => 0,
    'cash_return' => 0,
    'description' => 'crud purchase edit',
    'purchased_product_array' => [[
        'purchase_prod_id' => $pp->id,
        'product_id' => $product->id,
        'old_price' => '',
        'new_price' => 100,
        'sale_price' => 150,
        'expiry_date' => '',
        'qty' => 15,
        'prod_discount' => 0,
        'amount' => 1500,
        'p_name' => $product->product_name,
    ]],
]);
$req->setUserResolver(fn () => $user);
assertSuccess($stock->purchaseInvoice($req), 'purchase.edit');
if ((float) Product::find($product->id)->stock_balance !== 15.0) {
    fail('stock after purchase edit expected 15 got ' . Product::find($product->id)->stock_balance);
}

// --- SALE ADD (qty 5) ---
$req = Request::create('/add-sale-invoice', 'POST', [
    'invoice_date' => date('Y-m-d'),
    'invoice_no' => 'S-' . date('d-m-y'),
    'invoice_type' => 1,
    'customer_id' => $customer->id,
    'amount_to_pay' => 750,
    'amount_received' => 750,
    'product_net_total' => 750,
    'service_charges' => 0,
    'previous_receivable' => 0,
    'invoice_discount' => 0,
    'cash_return' => 0,
    'description' => 'crud sale add',
    'sales_product_array' => [[
        'sale_prod_id' => 0,
        'product_id' => $product->id,
        'retail_price' => 150,
        'purchased_price' => 100,
        'qty' => 5,
        'prod_discount' => 0,
        'amount' => 750,
    ]],
]);
$req->setUserResolver(fn () => $user);
$saleAdd = assertSuccess($saleCtrl->saleInvoice($req), 'sale.add');
$saleId = (int) $saleAdd['invoice_id'];
$ps = ProductSale::where('sale_invoice_id', $saleId)->first() ?: fail('no products_sales');
if ((float) Product::find($product->id)->stock_balance !== 10.0) {
    fail('stock after sale add expected 10 got ' . Product::find($product->id)->stock_balance);
}

// --- SALE EDIT (qty 5 -> 3) ---
$req = Request::create('/add-sale-invoice', 'POST', [
    'hidden_invoice_id' => $saleId,
    'invoice_date' => date('Y-m-d'),
    'invoice_no' => SaleInvoice::find($saleId)->invoice_no,
    'invoice_type' => 1,
    'customer_id' => $customer->id,
    'amount_to_pay' => 450,
    'amount_received' => 450,
    'product_net_total' => 450,
    'service_charges' => 0,
    'previous_receivable' => 0,
    'invoice_discount' => 0,
    'cash_return' => 0,
    'description' => 'crud sale edit',
    'existing_product_ids' => [$product->id],
    'sales_product_array' => [[
        'sale_prod_id' => $ps->id,
        'product_id' => $product->id,
        'retail_price' => 150,
        'purchased_price' => 100,
        'qty' => 3,
        'prod_discount' => 0,
        'amount' => 450,
    ]],
]);
$req->setUserResolver(fn () => $user);
assertSuccess($saleCtrl->saleInvoice($req), 'sale.edit');
if ((float) Product::find($product->id)->stock_balance !== 12.0) {
    fail('stock after sale edit expected 12 got ' . Product::find($product->id)->stock_balance);
}

// --- SALE DELETE PRODUCT ---
$ps = ProductSale::where('sale_invoice_id', $saleId)->first();
$req = Request::create('/delete-sale-product', 'POST', [
    'sale_invoice_id' => $saleId,
    'product_id' => $product->id,
    'qty' => $ps->qty,
]);
$req->setUserResolver(fn () => $user);
assertSuccess($saleCtrl->deleteProduct($req), 'sale.deleteProduct');
if ((float) Product::find($product->id)->stock_balance !== 15.0) {
    fail('stock after sale product delete expected 15 got ' . Product::find($product->id)->stock_balance);
}

// Re-add sale line for invoice delete test
$req = Request::create('/add-sale-invoice', 'POST', [
    'invoice_date' => date('Y-m-d'),
    'invoice_no' => 'S2-' . date('d-m-y'),
    'invoice_type' => 1,
    'customer_id' => $customer->id,
    'amount_to_pay' => 300,
    'amount_received' => 300,
    'product_net_total' => 300,
    'service_charges' => 0,
    'previous_receivable' => 0,
    'invoice_discount' => 0,
    'cash_return' => 0,
    'description' => 'crud sale for invoice delete',
    'sales_product_array' => [[
        'sale_prod_id' => 0,
        'product_id' => $product->id,
        'retail_price' => 150,
        'purchased_price' => 100,
        'qty' => 2,
        'prod_discount' => 0,
        'amount' => 300,
    ]],
]);
$req->setUserResolver(fn () => $user);
$saleAdd2 = assertSuccess($saleCtrl->saleInvoice($req), 'sale.add2');
$saleId2 = (int) $saleAdd2['invoice_id'];

// --- SALE DELETE INVOICE ---
$req = Request::create('/delete-sale-invoice', 'POST', [
    'id' => $saleId2,
    'customer_id' => $customer->id,
]);
$req->setUserResolver(fn () => $user);
assertSuccess($saleCtrl->deleteInvoice($req), 'sale.deleteInvoice');
if (SaleInvoice::find($saleId2)) {
    fail('sale invoice still exists after delete');
}
if ((float) Product::find($product->id)->stock_balance !== 15.0) {
    fail('stock after sale invoice delete expected 15 got ' . Product::find($product->id)->stock_balance);
}

// --- PURCHASE DELETE PRODUCT (need a second purchase line or delete from remaining) ---
// Current stock 15 from purchase. Add another purchase of 5 then delete that product line.
$req = Request::create('/add-purchase-invoice', 'POST', [
    'invoice_date' => date('Y-m-d'),
    'invoice_no' => 'P2-' . date('d-m-y'),
    'invoice_type' => 1,
    'customer_id' => $vendor->id,
    'amount_to_pay' => 500,
    'amount_received' => 500,
    'product_net_total' => 500,
    'service_charges' => 0,
    'previous_receivable' => 0,
    'invoice_discount' => 0,
    'cash_return' => 0,
    'description' => 'crud purchase for product delete',
    'purchased_product_array' => [[
        'purchase_prod_id' => 0,
        'product_id' => $product->id,
        'old_price' => '',
        'new_price' => 100,
        'sale_price' => 150,
        'expiry_date' => '',
        'qty' => 5,
        'prod_discount' => 0,
        'amount' => 500,
        'p_name' => $product->product_name,
    ]],
]);
$req->setUserResolver(fn () => $user);
$p3 = assertSuccess($stock->purchaseInvoice($req), 'purchase.addForDeleteProduct');
$p3Id = (int) $p3['invoice_id'];

$req = Request::create('/delete-purchase-product', 'POST', [
    'purchase_invoice_id' => $p3Id,
    'product_id' => $product->id,
    'qty' => 5,
]);
$req->setUserResolver(fn () => $user);
assertSuccess($stock->deleteProduct($req), 'purchase.deleteProduct');
if ((float) Product::find($product->id)->stock_balance !== 15.0) {
    fail('stock after purchase product delete expected 15 got ' . Product::find($product->id)->stock_balance);
}

// --- PURCHASE DELETE INVOICE (original purchaseId still has 15) ---
$req = Request::create('/delete-purchase-invoice', 'POST', [
    'id' => $purchaseId,
    'customer_id' => $vendor->id,
]);
$req->setUserResolver(fn () => $user);
assertSuccess($stock->deleteInvoice($req), 'purchase.deleteInvoice');
if (PurchaseInvoice::find($purchaseId)) {
    fail('purchase invoice still exists after delete');
}
if ((float) Product::find($product->id)->stock_balance !== 0.0) {
    fail('stock after purchase invoice delete expected 0 got ' . Product::find($product->id)->stock_balance);
}

echo "\nALL CRUD SMOKE TESTS PASSED\n";
echo "DB=$dbPath\n";
exit(0);
