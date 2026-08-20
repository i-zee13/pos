<?php

namespace App\Console\Commands;

use App\Models\BatchStockMgt;
use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\Product;
use App\Models\ProductPurchase;
use App\Models\ProductReturns;
use App\Models\ProductSale;
use App\Models\PurchaseInvoice;
use App\Models\ReturnInvoice;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Models\SaleReturnProduct;
use App\Models\StockManagment;
use App\Models\User;
use App\Models\VendorLedger;
use App\Models\VendorStock;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Live invoice-level flow (same helper chain as controllers):
 * purchase x3 (different prices/expiries) → sale → purchase return → sale return
 * After each invoice: assert batch sum == product.stock_balance == latest vsm.balance,
 * print avg cost. Then hard-delete all test artifacts.
 * Does NOT run replacement.
 */
class LiveInvoiceBatchFlowCommand extends Command
{
    protected $signature = 'stock:live-invoice-flow {--keep : Do not delete test data}';

    protected $description = 'Create real test invoices (no replacement), verify batch+avg each step, then cleanup';

    protected array $failures = [];
    protected array $created = [
        'purchase_invoice_ids' => [],
        'sale_invoice_ids' => [],
        'purchase_return_ids' => [],
        'sale_return_ids' => [],
        'product_id' => null,
        'marker' => null,
    ];

    public function handle(): int
    {
        $this->info('=== LIVE invoice batch/avg flow (no replacement) ===');
        $this->info('DB backup should already exist under DB/backups/');

        $user = User::where('name', 'like', '%storeeo%')->orWhere('email', 'like', '%storeeo%')->first()
            ?? User::orderBy('id')->first();
        if (!$user) {
            $this->error('No user to Auth::login');
            return 1;
        }
        Auth::login($user);
        $this->line('Auth as: '.$user->name.' (id='.$user->id.')');

        $vendorId = (int) (Customer::where('customer_type', 1)->where('id', '!=', 6)->orderBy('id')->value('id') ?? 9);
        $customerId = (int) (Customer::where('id', 8)->value('id') ?? Customer::where('customer_type', '!=', 1)->orderBy('id')->value('id') ?? 8);
        $companyId = (int) DB::table('companies')->orderBy('id')->value('id');

        $marker = 'LIVEBATCH_'.date('YmdHis');
        $this->created['marker'] = $marker;

        $product = new Product();
        $product->company_id = $companyId;
        $product->product_name = $marker;
        $product->barcode = $marker;
        $product->old_purchase_price = 100;
        $product->new_purchase_price = 100;
        $product->sale_price = 200;
        $product->stock_balance = 0;
        $product->created_by = $user->id;
        if (Schema::hasColumn('products', 'tenant_id')) {
            $product->tenant_id = $user->tenant_id ?? 1;
        }
        if (Schema::hasColumn('products', 'size')) {
            $product->size = '-';
        }
        $product->save();
        $this->created['product_id'] = $product->id;
        $this->info("Test product #{$product->id} {$marker} (company={$companyId})");

        $globalBefore = $this->globalSnapshot($product->id);

        try {
            // Purchase 1 — price 100, expiry A
            $this->step('PURCHASE #1 @100 exp 2028-03-01 qty 10', function () use ($product, $vendorId, $user) {
                $inv = $this->makePurchase($product, $vendorId, $user->id, 10, 100, 200, '2028-03-01', 'LB-P1-'.time());
                $this->created['purchase_invoice_ids'][] = $inv->id;
                $this->assertStockAligned($product->id, 10, 100.0);
            });

            // Purchase 2 — price 150, expiry B (different)
            $this->step('PURCHASE #2 @150 exp 2028-09-15 qty 10', function () use ($product, $vendorId, $user) {
                $inv = $this->makePurchase($product, $vendorId, $user->id, 10, 150, 200, '2028-09-15', 'LB-P2-'.time());
                $this->created['purchase_invoice_ids'][] = $inv->id;
                // weighted avg so far: (10*100+10*150)/20 = 125
                $this->assertStockAligned($product->id, 20, 125.0);
            });

            // Purchase 3 — price 120, same expiry as #1 (must be separate layer)
            $this->step('PURCHASE #3 @120 exp 2028-03-01 qty 5 (same expiry, different price)', function () use ($product, $vendorId, $user) {
                $inv = $this->makePurchase($product, $vendorId, $user->id, 5, 120, 200, '2028-03-01', 'LB-P3-'.time());
                $this->created['purchase_invoice_ids'][] = $inv->id;
                $layers = BatchStockMgt::where('product_id', $product->id)->where('batch_wise_balance', '>', 0)->count();
                $this->assertTrue($layers >= 3, "expected >=3 open layers, got {$layers}");
                // (1000+1500+600)/25 = 124
                $this->assertStockAligned($product->id, 25, 124.0);
            });

            // Sale 12 — FEFO should consume Mar expiry first (100 then 120), then Sep
            $this->step('SALE qty 12 (FEFO)', function () use ($product, $customerId, $user) {
                $inv = $this->makeSale($product, $customerId, $user->id, 12, 200, 'LB-S1-'.time());
                $this->created['sale_invoice_ids'][] = $inv->id;
                $this->assertStockAligned($product->id, 13, null); // avg recalculated from remaining
                $rows = BatchStockMgt::where('product_id', $product->id)->where('batch_wise_balance', '>', 0)->orderBy('expiry_date')->get();
                $this->line('  Remaining batches:');
                foreach ($rows as $r) {
                    $this->line("    exp={$r->expiry_date} bal={$r->batch_wise_balance} cost={$r->unit_cost_price}");
                }
            });

            // Purchase return 2 from remaining
            $this->step('PURCHASE RETURN qty 2', function () use ($product, $vendorId, $user) {
                $inv = $this->makePurchaseReturn($product, $vendorId, $user->id, 2, 150, '2028-09-15', 'LB-PR1-'.time());
                $this->created['purchase_return_ids'][] = $inv->id;
                $this->assertStockAligned($product->id, 11, null);
            });

            // Sale return 3 back in
            $this->step('SALE RETURN qty 3 @150 exp 2028-09-15', function () use ($product, $customerId, $user) {
                $inv = $this->makeSaleReturn($product, $customerId, $user->id, 3, 150, 200, '2028-09-15', 'LB-SR1-'.time());
                $this->created['sale_return_ids'][] = $inv->id;
                $this->assertStockAligned($product->id, 14, null);
            });

            $product->refresh();
            $avg = StockManagment::where('product_id', $product->id)->orderByDesc('id')->value('ttl_avg_cost');
            $this->info("FINAL product.bal={$product->stock_balance} ttl_avg_cost={$avg}");
            $this->printBatches($product->id);

            // Parent globals excluding test product movement should be consistent internally
            $this->assertTrue(
                abs($this->batchSum($product->id) - (float) $product->stock_balance) < 0.01,
                'final batch sum == product balance'
            );

        } catch (\Throwable $e) {
            $this->failures[] = $e->getMessage();
            $this->error('ABORT: '.$e->getMessage());
        }

        $keep = (bool) $this->option('keep');
        if ($keep) {
            $this->warn('KEEP mode — test data left in DB. Product='.$marker);
        } else {
            $this->cleanup($product->id);
            // Ensure no leftovers
            $left = Product::withTrashed()->where('product_name', $marker)->count();
            $leftB = BatchStockMgt::where('product_name', $marker)->count();
            $this->info("Cleanup leftovers products={$left} batches={$leftB}");
        }

        // Global tables: vendor_stocks/products for OTHER products should not be our concern;
        // we only created isolated product. Report created IDs for browser check if --keep.
        $this->line('Created purchase invoices: '.implode(',', $this->created['purchase_invoice_ids']));
        $this->line('Created sale invoices: '.implode(',', $this->created['sale_invoice_ids']));

        if (count($this->failures)) {
            foreach ($this->failures as $f) {
                $this->error('FAIL: '.$f);
            }
            return 1;
        }

        $this->info('ALL LIVE INVOICE FLOWS PASSED (batch + avg aligned each step).');
        return 0;
    }

    protected function makePurchase(Product $product, int $vendorId, int $userId, float $qty, float $cost, float $sale, string $expiry, string $invoiceNo): PurchaseInvoice
    {
        $invoice = new PurchaseInvoice();
        $invoice->date = date('Y-m-d');
        $invoice->invoice_no = $invoiceNo;
        $invoice->invoice_type = 1;
        $invoice->customer_id = $vendorId;
        $invoice->paid_amount = $qty * $cost;
        $invoice->total_invoice_amount = $qty * $cost;
        $invoice->invoice_remaining_amount_after_pay = 0;
        $invoice->service_charges = 0;
        $invoice->invoice_discount = 0;
        $invoice->cash_return = 0;
        $invoice->product_net_total = $qty * $cost;
        $invoice->previous_receivable = 0;
        $invoice->is_editable = 1;
        $invoice->status = 1;
        $invoice->description = 'LIVEBATCH TEST';
        $invoice->created_by = $userId;
        if (Schema::hasColumn('purchase_invoices', 'tenant_id')) {
            $invoice->tenant_id = $product->tenant_id ?? 1;
        }
        $invoice->save();

        $purchased = new ProductPurchase();
        $purchased->purchase_invoice_id = $invoice->id;
        $purchased->product_id = $product->id;
        $purchased->vendor_id = $vendorId;
        $purchased->company_id = $product->company_id;
        $purchased->purchase_price = $cost;
        $purchased->sale_price = $sale;
        $purchased->expiry_date = $expiry;
        $purchased->qty = $qty;
        $purchased->purchased_total_amount = $qty * $cost;
        $purchased->product_discount = 0;
        $purchased->created_by = $userId;
        if (Schema::hasColumn('products_purchases', 'tenant_id')) {
            $purchased->tenant_id = $product->tenant_id ?? 1;
        }
        $purchased->save();
        $purchased->invoice_no = $invoiceNo;

        $check = VendorStock::where('product_id', $product->id)->orderByDesc('id')->first();
        $balance = $check ? (float) $check->balance : 0;
        $purchased->vendor_id = $vendorId;
        $vStock = updateStock($purchased, $balance, $qty, 1, 'purchase', 1);
        StockManagment($vStock->id, $purchased, $qty, 1, 'purchase');
        if ($vStock->save()) {
            Product::where('id', $product->id)->update([
                'stock_balance' => $vStock->balance,
                'new_purchase_price' => $cost,
                'sale_price' => $sale,
                'expiry_date' => $expiry,
            ]);
        }
        BatchWiseStockManagment($vStock->id, $invoice->id, $purchased, $qty, 1, 1, null);

        // minimal vendor ledger
        $vl = new VendorLedger();
        $vl->date = date('Y-m-d');
        $vl->purchase_invoice_id = $invoice->id;
        $vl->trx_type = 1;
        $vl->is_editable = 1;
        $vl->is_deleted = 0;
        $vl->comment = 'LIVEBATCH';
        $vl->customer_id = $vendorId;
        $vl->cr = $qty * $cost;
        $vl->dr = $qty * $cost;
        $vl->balance = 0;
        $vl->created_by = $userId;
        if (Schema::hasColumn('vendor_ledger', 'tenant_id')) {
            $vl->tenant_id = $product->tenant_id ?? 1;
        }
        $vl->save();

        return $invoice;
    }

    protected function makeSale(Product $product, int $customerId, int $userId, float $qty, float $salePrice, string $invoiceNo): Sale
    {
        $invoice = new Sale();
        $invoice->date = date('Y-m-d');
        $invoice->invoice_no = $invoiceNo;
        $invoice->invoice_type = 1;
        $invoice->customer_id = $customerId;
        $invoice->paid_amount = $qty * $salePrice;
        $invoice->total_invoice_amount = $qty * $salePrice;
        $invoice->invoice_remaining_amount_after_pay = 0;
        $invoice->service_charges = 0;
        $invoice->invoice_discount = 0;
        $invoice->cash_return = 0;
        $invoice->product_net_total = $qty * $salePrice;
        $invoice->previous_receivable = 0;
        $invoice->is_editable = 1;
        $invoice->status = 1;
        $invoice->created_by = $userId;
        if (Schema::hasColumn('sale_invoices', 'tenant_id')) {
            $invoice->tenant_id = $product->tenant_id ?? 1;
        }
        // fill common required cols if present
        foreach (['description' => 'LIVEBATCH TEST'] as $c => $v) {
            if (Schema::hasColumn('sale_invoices', $c)) {
                $invoice->{$c} = $v;
            }
        }
        $invoice->save();

        $costStamp = (float) ($product->new_purchase_price ?: $product->old_purchase_price);
        $sale = new ProductSale();
        $sale->sale_invoice_id = $invoice->id;
        $sale->invoice_no = $invoiceNo;
        $sale->company_id = $product->company_id;
        $sale->product_id = $product->id;
        $sale->qty = $qty;
        $sale->sale_price = $salePrice;
        $sale->purchase_price = $costStamp;
        $sale->sale_total_amount = $qty * $salePrice;
        $sale->product_discount = 0;
        $sale->expiry_date = BatchStockMgt::where('product_id', $product->id)->where('batch_wise_balance', '>', 0)->orderBy('expiry_date')->value('expiry_date');
        $sale->created_by = $userId;
        if (Schema::hasColumn('products_sales', 'tenant_id')) {
            $sale->tenant_id = $product->tenant_id ?? 1;
        }
        $sale->save();

        $check = VendorStock::where('product_id', $product->id)->orderByDesc('id')->first();
        $balance = $check ? (float) $check->balance : 0;
        $sale->customer_id = $customerId;
        $vStock = updateStock($sale, $balance, $qty, 2, 'sale', 2);
        StockManagment($vStock->id, $sale, $qty, 2, 'sale');
        if ($vStock->save()) {
            Product::where('id', $product->id)->update(['stock_balance' => $vStock->balance]);
        }
        BatchWiseStockManagment($vStock->id, $invoice->id, $sale, $qty, 2, 2, null);

        $cl = new CustomerLedger();
        $cl->date = date('Y-m-d');
        $cl->sale_invoice_id = $invoice->id;
        $cl->trx_type = 1;
        $cl->is_deleted = 0;
        $cl->comment = 'LIVEBATCH';
        $cl->customer_id = $customerId;
        $cl->cr = $qty * $salePrice;
        $cl->dr = $qty * $salePrice;
        $cl->balance = 0;
        $cl->created_by = $userId;
        if (Schema::hasColumn('customer_ledger', 'tenant_id')) {
            $cl->tenant_id = $product->tenant_id ?? 1;
        }
        $cl->save();

        return $invoice;
    }

    protected function makePurchaseReturn(Product $product, int $vendorId, int $userId, float $qty, float $cost, string $expiry, string $invoiceNo): ReturnInvoice
    {
        $invoice = new ReturnInvoice();
        $invoice->date = date('Y-m-d');
        $invoice->invoice_no = $invoiceNo;
        $invoice->invoice_type = 1;
        $invoice->customer_id = $vendorId;
        $invoice->paid_amount = $qty * $cost;
        $invoice->total_invoice_amount = $qty * $cost;
        $invoice->invoice_remaining_amount_after_pay = 0;
        $invoice->service_charges = 0;
        $invoice->invoice_discount = 0;
        $invoice->cash_return = 0;
        $invoice->product_net_total = $qty * $cost;
        $invoice->previous_receivable = 0;
        $invoice->is_editable = 1;
        $invoice->status = 1;
        $invoice->created_by = $userId;
        if (Schema::hasColumn('purchase_return_invoices', 'description')) {
            $invoice->description = 'LIVEBATCH TEST';
        }
        if (Schema::hasColumn('purchase_return_invoices', 'tenant_id')) {
            $invoice->tenant_id = $product->tenant_id ?? 1;
        }
        $invoice->save();

        $ret = new ProductReturns();
        $ret->purchase_return_invoice_id = $invoice->id;
        $ret->product_id = $product->id;
        $ret->vendor_id = $vendorId;
        $ret->company_id = $product->company_id;
        $ret->purchase_price = $cost;
        $ret->sale_price = $product->sale_price;
        $ret->expiry_date = $expiry;
        $ret->qty = $qty;
        $ret->product_return_total_amount = $qty * $cost;
        $ret->product_discount = 0;
        $ret->created_by = $userId;
        if (Schema::hasColumn('products_returns', 'tenant_id')) {
            $ret->tenant_id = $product->tenant_id ?? 1;
        }
        $ret->save();
        $ret->invoice_no = $invoiceNo;

        $check = VendorStock::where('product_id', $product->id)->orderByDesc('id')->first();
        $balance = $check ? (float) $check->balance : 0;
        $ret->vendor_id = $vendorId;
        $vStock = updateStock($ret, $balance, $qty, 2, 'purchase_return', 3);
        StockManagment($vStock->id, $ret, $qty, 2, 'purchase_return');
        if ($vStock->save()) {
            Product::where('id', $product->id)->update(['stock_balance' => $vStock->balance]);
        }
        BatchWiseStockManagment($vStock->id, $invoice->id, $ret, $qty, 2, 3, null);

        return $invoice;
    }

    protected function makeSaleReturn(Product $product, int $customerId, int $userId, float $qty, float $cost, float $salePrice, string $expiry, string $invoiceNo): SaleReturn
    {
        $invoice = new SaleReturn();
        $invoice->date = date('Y-m-d');
        $invoice->invoice_no = $invoiceNo;
        $invoice->invoice_type = 1;
        $invoice->customer_id = $customerId;
        $invoice->paid_amount = $qty * $salePrice;
        $invoice->total_invoice_amount = $qty * $salePrice;
        $invoice->invoice_remaining_amount_after_pay = 0;
        $invoice->service_charges = 0;
        $invoice->invoice_discount = 0;
        $invoice->cash_return = 0;
        $invoice->product_net_total = $qty * $salePrice;
        $invoice->previous_receivable = 0;
        $invoice->is_editable = 1;
        $invoice->status = 1;
        $invoice->created_by = $userId;
        if (Schema::hasColumn('sale_return_invoices', 'description')) {
            $invoice->description = 'LIVEBATCH TEST';
        }
        if (Schema::hasColumn('sale_return_invoices', 'tenant_id')) {
            $invoice->tenant_id = $product->tenant_id ?? 1;
        }
        $invoice->save();

        $line = new SaleReturnProduct();
        $line->sale_return_invoice_id = $invoice->id;
        $line->invoice_no = $invoiceNo;
        $line->company_id = $product->company_id;
        $line->product_id = $product->id;
        $line->purchase_price = $cost;
        $line->sale_price = $salePrice;
        $line->expiry_date = $expiry;
        $line->qty = $qty;
        $line->return_total_amount = $qty * $salePrice;
        $line->product_discount = 0;
        $line->created_by = $userId;
        if (Schema::hasColumn('sale_return_products', 'tenant_id')) {
            $line->tenant_id = $product->tenant_id ?? 1;
        }
        $line->save();
        $line->invoice_no = $invoiceNo;

        $check = VendorStock::where('product_id', $product->id)->orderByDesc('id')->first();
        $balance = $check ? (float) $check->balance : 0;
        $line->customer_id = $customerId;
        $vStock = updateStock($line, $balance, $qty, 1, 'sale_return', 4);
        StockManagment($vStock->id, $line, $qty, 1, 'sale_return');
        if ($vStock->save()) {
            Product::where('id', $product->id)->update(['stock_balance' => $vStock->balance]);
        }
        BatchWiseStockManagment($vStock->id, $invoice->id, $line, $qty, 1, 4, null);

        return $invoice;
    }

    protected function assertStockAligned(int $productId, float $expectedQty, ?float $expectedAvg): void
    {
        $product = Product::find($productId);
        $batchSum = $this->batchSum($productId);
        $vsm = StockManagment::where('product_id', $productId)->orderByDesc('id')->first();
        $vsmBal = $vsm ? (float) $vsm->balance : 0;
        $avg = $vsm ? (float) $vsm->ttl_avg_cost : 0;

        $this->line("  product.bal={$product->stock_balance} batch_sum={$batchSum} vsm.bal={$vsmBal} avg={$avg}");

        $this->assertTrue(abs((float) $product->stock_balance - $expectedQty) < 0.01, "product bal expected {$expectedQty}");
        $this->assertTrue(abs($batchSum - $expectedQty) < 0.01, "batch sum expected {$expectedQty}");
        $this->assertTrue(abs($vsmBal - $expectedQty) < 0.01, "vsm bal expected {$expectedQty}");
        if ($expectedAvg !== null) {
            $this->assertTrue(abs($avg - $expectedAvg) < 0.05, "avg expected ~{$expectedAvg} got {$avg}");
        }
        $this->assertTrue($avg > 0 || $expectedQty < 0.01, 'avg cost should be > 0 when stock > 0');
        $this->printBatches($productId);
    }

    protected function printBatches(int $productId): void
    {
        $rows = BatchStockMgt::where('product_id', $productId)->where('batch_wise_balance', '>', 0)->orderBy('expiry_date')->orderBy('unit_cost_price')->get();
        foreach ($rows as $r) {
            $this->line("    [batch] exp={$r->expiry_date} bal={$r->batch_wise_balance} cost={$r->unit_cost_price} ttl={$r->ttl_cost_price}");
        }
    }

    protected function batchSum(int $productId): float
    {
        return (float) BatchStockMgt::where('product_id', $productId)->sum('batch_wise_balance');
    }

    protected function cleanup(int $productId): void
    {
        $this->warn('Cleaning test invoices + stock rows...');
        $pids = $this->created['purchase_invoice_ids'];
        $sids = $this->created['sale_invoice_ids'];
        $prids = $this->created['purchase_return_ids'];
        $srids = $this->created['sale_return_ids'];

        if ($srids) {
            SaleReturnProduct::whereIn('sale_return_invoice_id', $srids)->forceDelete();
            SaleReturn::whereIn('id', $srids)->forceDelete();
            CustomerLedger::whereIn('sale_return_invoice_id', $srids)->delete();
        }
        if ($prids) {
            ProductReturns::whereIn('purchase_return_invoice_id', $prids)->forceDelete();
            ReturnInvoice::whereIn('id', $prids)->forceDelete();
            VendorLedger::whereIn('purchase_return_invoice_id', $prids)->delete();
        }
        if ($sids) {
            ProductSale::whereIn('sale_invoice_id', $sids)->forceDelete();
            Sale::whereIn('id', $sids)->forceDelete();
            CustomerLedger::whereIn('sale_invoice_id', $sids)->delete();
        }
        if ($pids) {
            ProductPurchase::whereIn('purchase_invoice_id', $pids)->forceDelete();
            PurchaseInvoice::whereIn('id', $pids)->forceDelete();
            VendorLedger::whereIn('purchase_invoice_id', $pids)->delete();
        }

        BatchStockMgt::where('product_id', $productId)->delete();
        StockManagment::where('product_id', $productId)->delete();
        VendorStock::where('product_id', $productId)->delete();
        Product::withTrashed()->where('id', $productId)->forceDelete();
        if ($this->created['marker']) {
            Product::withTrashed()->where('product_name', $this->created['marker'])->forceDelete();
        }
    }

    protected function step(string $name, callable $fn): void
    {
        $this->line("--- {$name} ---");
        $fn();
        $this->info("OK {$name}");
    }

    protected function assertTrue(bool $ok, string $msg): void
    {
        if (!$ok) {
            throw new \RuntimeException($msg);
        }
    }

    protected function globalSnapshot(int $excludeProductId): array
    {
        return [
            'products_bal' => (float) DB::table('products')->where('id', '!=', $excludeProductId)->sum('stock_balance'),
        ];
    }
}
