<?php

namespace App\Console\Commands;

use App\Models\BatchStockMgt;
use App\Models\Company;
use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductPurchase;
use App\Models\ProductSale;
use App\Models\PurchaseInvoice;
use App\Models\Sale as SaleInvoice;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

/**
 * End-to-end batch identity test matching the browser test plan.
 */
class BatchIdentityFlowTestCommand extends Command
{
    protected $signature = 'stock:test-batch-identity {--keep : Keep test product/data}';

    protected $description = 'Purchase×2 different expiry → sale → purchase3 → delete sale → assert exact batch put-back';

    public function handle(): int
    {
        if (!Auth::id()) {
            $u = DB::table('users')->where('username', 'storeeo')->orWhere('email', 'storeeo')->value('id');
            if ($u) {
                Auth::loginUsingId($u);
            }
        }

        batch_ensure_allocations_table();

        $company = Company::first();
        if (!$company) {
            $this->error('No company');

            return 1;
        }

        $vendor = Customer::where('customer_type', 1)->orderBy('id')->first();
        $buyer = Customer::where('customer_type', 2)->orderBy('id')->first();
        if (!$vendor || !$buyer) {
            $this->error('Need vendor + customer');

            return 1;
        }

        $sku = 'BATCHID-'.time();
        $product = new Product();
        $product->company_id = $company->id;
        $product->product_name = $sku;
        $product->sale_price = 100;
        $product->old_purchase_price = 50;
        $product->stock_balance = 0;
        $product->created_by = Auth::id() ?? 1;
        $product->save();
        $this->info("Product #{$product->id} {$sku}");

        $exp1 = '2027-01-31';
        $exp2 = '2027-06-30';
        $exp3 = '2027-12-31';

        // P1: qty 5 @ 100 exp1
        $this->purchase($vendor->id, $product, 5, 100, $exp1);
        // P2: qty 10 @ 110 exp2
        $this->purchase($vendor->id, $product, 10, 110, $exp2);
        $this->assertBatches($product->id, [
            [$exp1, 5, 100],
            [$exp2, 10, 110],
        ], 'after 2 purchases');

        // Sale 3 → FEFO from exp1 → left 2 @100, 10 @110
        $saleInv = $this->sale($buyer->id, $product, 3, 150);
        $this->assertBatches($product->id, [
            [$exp1, 2, 100],
            [$exp2, 10, 110],
        ], 'after sale 3');

        // P3: qty 10 @ 120 exp3
        $this->purchase($vendor->id, $product, 10, 120, $exp3);
        $this->assertBatches($product->id, [
            [$exp1, 2, 100],
            [$exp2, 10, 110],
            [$exp3, 10, 120],
        ], 'after purchase 3');

        // Delete sale → must restore to exp1 (2+3=5), not latest
        $this->deleteSale($saleInv);
        $this->assertBatches($product->id, [
            [$exp1, 5, 100],
            [$exp2, 10, 110],
            [$exp3, 10, 120],
        ], 'after sale delete put-back');

        // Purchase return 2 from exp2 only
        $pr = (object) [
            'id' => 0,
            'product_id' => $product->id,
            'company_id' => $product->company_id,
            'purchase_price' => 110,
            'expiry_date' => $exp2,
            'qty' => 2,
        ];
        BatchWiseStockManagment(0, 0, $pr, 2, 2, 3, null);
        $product->stock_balance = max(0, (float) $product->stock_balance - 2);
        $product->save();
        $this->assertBatches($product->id, [
            [$exp1, 5, 100],
            [$exp2, 8, 110],
            [$exp3, 10, 120],
        ], 'after purchase return expiry-targeted');

        // New sale 6 → FEFO: take 5 from exp1 + 1 from exp2 → left 0/7/10
        $sale2 = $this->sale($buyer->id, $product, 6, 150);
        $this->assertBatches($product->id, [
            [$exp2, 7, 110],
            [$exp3, 10, 120],
        ], 'after sale 6 (exp1 emptied)');

        // Sale return 6 → restore exact allocations (5 to exp1, 1 to exp2)
        // Simulate sale return putback via delete of sale2 (same path as return for allocations)
        $this->deleteSale($sale2);
        $this->assertBatches($product->id, [
            [$exp1, 5, 100],
            [$exp2, 8, 110],
            [$exp3, 10, 120],
        ], 'after sale2 delete exact put-back');

        $this->info('ALL ASSERTIONS PASSED');

        if (!$this->option('keep')) {
            BatchStockMgt::where('product_id', $product->id)->delete();
            DB::table('stock_batch_allocations')->where('product_id', $product->id)->delete();
            $product->delete();
            $this->line('Cleaned test product');
        }

        return 0;
    }

    private function purchase(int $vendorId, Product $product, float $qty, float $price, string $exp): void
    {
        $inv = new PurchaseInvoice();
        $inv->date = date('Y-m-d');
        $inv->invoice_no = 'T-P-'.uniqid();
        $inv->invoice_type = 1;
        $inv->customer_id = $vendorId;
        $inv->paid_amount = $qty * $price;
        $inv->total_invoice_amount = $qty * $price;
        $inv->product_net_total = $qty * $price;
        $inv->created_by = Auth::id() ?? 1;
        $inv->save();

        $line = new ProductPurchase();
        $line->purchase_invoice_id = $inv->id;
        $line->product_id = $product->id;
        $line->company_id = $product->company_id;
        $line->vendor_id = $vendorId;
        $line->qty = $qty;
        $line->purchase_price = $price;
        $line->sale_price = $product->sale_price;
        $line->expiry_date = $exp;
        $line->purchased_total_amount = $qty * $price;
        $line->created_by = Auth::id() ?? 1;
        $line->save();
        $line->invoice_no = $inv->invoice_no;

        $balance = (float) $product->fresh()->stock_balance;
        $v = updateStock($line, $balance, $qty, 1, 'purchase', 1);
        StockManagment($v->id, $line, $qty, 1, 'purchase');
        $v->save();
        Product::where('id', $product->id)->update(['stock_balance' => $v->balance]);
        BatchWiseStockManagment($v->id, $inv->id, $line, $qty, 1, 1, null);
        $product->refresh();
    }

    private function sale(int $customerId, Product $product, float $qty, float $price): SaleInvoice
    {
        $inv = new SaleInvoice();
        $inv->date = date('Y-m-d');
        $inv->invoice_no = 'T-S-'.uniqid();
        $inv->invoice_type = 1;
        $inv->customer_id = $customerId;
        $inv->paid_amount = $qty * $price;
        $inv->total_invoice_amount = $qty * $price;
        $inv->product_net_total = $qty * $price;
        $inv->created_by = Auth::id() ?? 1;
        $inv->save();

        $line = new ProductSale();
        $line->sale_invoice_id = $inv->id;
        $line->invoice_no = $inv->invoice_no;
        $line->product_id = $product->id;
        $line->company_id = $product->company_id;
        $line->qty = $qty;
        $line->sale_price = $price;
        $line->purchase_price = $product->old_purchase_price ?? 0;
        $line->sale_total_amount = $qty * $price;
        $line->created_by = Auth::id() ?? 1;
        $line->save();

        $balance = (float) $product->fresh()->stock_balance;
        $line->customer_id = $customerId;
        $v = updateStock($line, $balance, $qty, 2, 'sale', 2);
        StockManagment($v->id, $line, $qty, 2, 'sale');
        $v->save();
        Product::where('id', $product->id)->update(['stock_balance' => $v->balance]);
        BatchWiseStockManagment($v->id, $inv->id, $line, $qty, 2, 2, null);
        $product->refresh();

        return $inv;
    }

    private function deleteSale(SaleInvoice $inv): void
    {
        $lines = ProductSale::where('sale_invoice_id', $inv->id)->get();
        foreach ($lines as $line) {
            $balance = (float) Product::where('id', $line->product_id)->value('stock_balance');
            $line->customer_id = $inv->customer_id;
            // mirror controller: stock IN then batch putback
            $v = updateStock($line, $balance, $line->qty, 1, 'sale', 2);
            StockManagment($v->id, $line, $line->qty, 1, 'sale');
            $v->save();
            Product::where('id', $line->product_id)->update(['stock_balance' => $v->balance]);
            BatchWiseDeleteProduct($inv->id, $line, $line->qty, 1, 5);
        }
    }

    private function assertBatches(int $productId, array $expected, string $label): void
    {
        $rows = BatchStockMgt::where('product_id', $productId)
            ->where('batch_wise_balance', '>', 0)
            ->orderByRaw("CASE WHEN expiry_date IS NULL OR expiry_date = '0000-00-00' THEN 1 ELSE 0 END ASC")
            ->orderBy('expiry_date')
            ->orderBy('id')
            ->get();

        $got = $rows->map(function ($r) {
            return [
                substr((string) $r->expiry_date, 0, 10),
                round((float) $r->batch_wise_balance, 4),
                round((float) $r->unit_cost_price, 4),
            ];
        })->values()->all();

        $this->line("--- {$label} ---");
        foreach ($got as $g) {
            $this->line('  '.$g[0].' qty='.$g[1].' rate='.$g[2]);
        }

        if (count($got) !== count($expected)) {
            throw new \RuntimeException("{$label}: batch count got ".count($got).' expected '.count($expected));
        }
        foreach ($expected as $i => $e) {
            if ($got[$i][0] !== $e[0] || abs($got[$i][1] - $e[1]) > 0.001 || abs($got[$i][2] - $e[2]) > 0.001) {
                throw new \RuntimeException("{$label}: row {$i} got ".json_encode($got[$i]).' expected '.json_encode($e));
            }
        }
        $this->info("OK: {$label}");
    }
}
