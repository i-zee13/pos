<?php

namespace App\Console\Commands;

use App\Models\BatchStockMgt;
use App\Models\Product;
use App\Models\StockManagment;
use App\Models\VendorStock;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Isolated BatchWise flow tests. Creates a disposable product, runs
 * purchase / sale / purchase_return / sale_return / replacement against
 * BatchWiseStockManagment only, asserts expiry+FEFO, proves parent stock
 * tables are unchanged, then deletes all test rows.
 */
class TestBatchStockFlowsCommand extends Command
{
    protected $signature = 'stock:test-batch-flows';

    protected $description = 'Unit-test batch/expiry flows without disturbing parent stock tables; cleans up after';

    protected array $failures = [];

    public function handle(): int
    {
        $this->info('=== BatchWise flow tests (isolated) ===');

        $companyId = (int) DB::table('companies')->orderBy('id')->value('id');
        if (!$companyId) {
            $this->error('No company found.');
            return 1;
        }

        $marker = 'BATCHTEST_'.date('YmdHis');
        $parentBefore = $this->parentSnapshot();

        $product = new Product();
        $product->company_id = $companyId;
        $product->product_name = $marker;
        $product->old_purchase_price = 100;
        $product->new_purchase_price = 100;
        $product->sale_price = 150;
        $product->stock_balance = 0;
        $product->size = '-';
        if (\Illuminate\Support\Facades\Schema::hasColumn('products', 'tenant_id')) {
            $product->tenant_id = DB::table('products')->whereNotNull('tenant_id')->value('tenant_id') ?? 1;
        }
        // Fill any other NOT NULL columns with safe defaults if present
        foreach (['created_by' => 0, 'barcode' => $marker, 'product_code' => $marker] as $col => $val) {
            if (\Illuminate\Support\Facades\Schema::hasColumn('products', $col)) {
                $product->{$col} = $val;
            }
        }
        $product->save();
        $productId = (int) $product->id;
        $this->line("Test product id={$productId} name={$marker}");

        // Seed a vendor_stock_managment row so avg refresh has a target (balance stays 0)
        $vsm = new StockManagment();
        $vsm->vs_id = 0;
        $vsm->vendor_id = 0;
        $vsm->company_id = $companyId;
        $vsm->product_id = $productId;
        $vsm->company_name = 'TEST';
        $vsm->product_name = $marker;
        $vsm->purchase_price = 100;
        $vsm->sale_price = 150;
        $vsm->ttl_avg_cost = 0;
        $vsm->ttl_cost = 0;
        $vsm->amount = 0;
        $vsm->balance = 0;
        $vsm->created_by = 0;
        if (\Illuminate\Support\Facades\Schema::hasColumn('vendor_stock_managment', 'tenant_id')) {
            $vsm->tenant_id = $product->tenant_id ?? 1;
        }
        $vsm->save();
        $vsmId = (int) $vsm->id;

        try {
            // --- 1) PURCHASE IN: two expiry layers, different costs ---
            $this->flow('PURCHASE', function () use ($productId, $companyId) {
                $p1 = $this->lineObj($productId, $companyId, 10, 100, '2028-01-15');
                BatchWiseStockManagment(0, 900001, $p1, 10, 1, 1, null);
                $p2 = $this->lineObj($productId, $companyId, 5, 120, '2028-06-30');
                BatchWiseStockManagment(0, 900002, $p2, 5, 1, 1, null);
                // same expiry different cost → second layer
                $p3 = $this->lineObj($productId, $companyId, 2, 110, '2028-01-15');
                BatchWiseStockManagment(0, 900003, $p3, 2, 1, 1, null);

                $rows = $this->openBatches($productId);
                $this->assertTrue(count($rows) === 3, 'purchase should create 3 layers (expiry+cost)');
                $this->assertTrue(abs($this->batchSum($productId) - 17) < 0.001, 'purchase batch sum=17');
                $early = collect($rows)->firstWhere('expiry_date', '2028-01-15');
                $this->assertTrue($early !== null, 'expiry 2028-01-15 exists');
            });

            // --- 2) SALE OUT: FEFO burns earlier expiry first ---
            $this->flow('SALE FEFO', function () use ($productId, $companyId) {
                $sale = $this->lineObj($productId, $companyId, 12, 100, null);
                BatchWiseStockManagment(0, 900010, $sale, 12, 2, 2, null);
                // Took 10+2 from 2028-01-15 layers (100 and 110), left 0 on those; 5 remain on 2028-06-30
                $sum = $this->batchSum($productId);
                $this->assertTrue(abs($sum - 5) < 0.001, "after sale FEFO sum should be 5, got {$sum}");
                $rows = $this->openBatches($productId);
                foreach ($rows as $r) {
                    $this->assertTrue($r->expiry_date === '2028-06-30', 'remaining stock must be later expiry 2028-06-30');
                    $this->assertTrue(abs((float) $r->unit_cost_price - 120) < 0.001, 'remaining cost 120');
                }
            });

            // --- 3) PURCHASE RETURN OUT ---
            $this->flow('PURCHASE RETURN', function () use ($productId, $companyId) {
                $ret = $this->lineObj($productId, $companyId, 1, 120, '2028-06-30');
                BatchWiseStockManagment(0, 900020, $ret, 1, 2, 3, null);
                $sum = $this->batchSum($productId);
                $this->assertTrue(abs($sum - 4) < 0.001, "after PR sum=4, got {$sum}");
            });

            // --- 4) SALE RETURN IN ---
            $this->flow('SALE RETURN', function () use ($productId, $companyId) {
                $sr = $this->lineObj($productId, $companyId, 3, 120, '2028-06-30');
                BatchWiseStockManagment(0, 900030, $sr, 3, 1, 4, null);
                $sum = $this->batchSum($productId);
                $this->assertTrue(abs($sum - 7) < 0.001, "after SR sum=7, got {$sum}");
            });

            // --- 5) REPLACEMENT OUT then IN ---
            $this->flow('REPLACEMENT', function () use ($productId, $companyId) {
                $out = $this->lineObj($productId, $companyId, 2, 120, '2028-06-30');
                BatchWiseStockManagment(0, 900040, $out, 2, 2, 6, null);
                $this->assertTrue(abs($this->batchSum($productId) - 5) < 0.001, 'replacement OUT → 5');
                $in = $this->lineObj($productId, $companyId, 2, 130, '2029-01-01');
                BatchWiseStockManagment(0, 900041, $in, 2, 1, 6, null);
                $this->assertTrue(abs($this->batchSum($productId) - 7) < 0.001, 'replacement IN → 7');
                $hasNewExp = collect($this->openBatches($productId))->contains(function ($r) {
                    return $r->expiry_date === '2029-01-01';
                });
                $this->assertTrue($hasNewExp, 'replacement IN kept new expiry 2029-01-01');
            });

            // --- 6) DELETE rollback (trx 5) OUT ---
            $this->flow('PRODUCT DELETE OUT', function () use ($productId, $companyId) {
                $d = $this->lineObj($productId, $companyId, 1, 120, '2028-06-30');
                BatchWiseStockManagment(0, 0, $d, 1, 2, 5, null);
                $this->assertTrue(abs($this->batchSum($productId) - 6) < 0.001, 'delete OUT → 6');
            });

            // Parent tables must be untouched by BatchWise-only calls
            $parentAfter = $this->parentSnapshot();
            $this->assertTrue(
                abs($parentBefore['products_bal'] - $parentAfter['products_bal']) < 0.01,
                'products.stock_balance sum unchanged'
            );
            $this->assertTrue(
                abs($parentBefore['vsm_bal'] - $parentAfter['vsm_bal']) < 0.01,
                'vendor_stock_managment.balance sum unchanged'
            );
            $this->assertTrue(
                $parentBefore['vs_cnt'] === $parentAfter['vs_cnt'],
                'vendor_stocks row count unchanged'
            );
            $this->assertTrue(
                VendorStock::where('product_id', $productId)->count() === 0,
                'no vendor_stocks rows created for test product'
            );

            // Test product stock_balance still 0 (we never called updateStock)
            $product->refresh();
            $this->assertTrue(abs((float) $product->stock_balance) < 0.001, 'test product.stock_balance still 0');

        } finally {
            // Cleanup ALL test artifacts
            BatchStockMgt::where('product_id', $productId)->delete();
            StockManagment::where('product_id', $productId)->delete();
            VendorStock::where('product_id', $productId)->delete();
            Product::where('id', $productId)->forceDelete();
            // safety: any leftover by name
            Product::where('product_name', $marker)->forceDelete();
            $this->info("Cleanup done for product {$productId} / {$marker}");
        }

        if (count($this->failures)) {
            $this->error('FAILURES:');
            foreach ($this->failures as $f) {
                $this->error(' - '.$f);
            }
            return 1;
        }

        $this->info('ALL BATCH FLOW TESTS PASSED. Parent stock tables undisturbed. Test data deleted.');
        return 0;
    }

    protected function flow(string $name, callable $fn): void
    {
        $this->line("--- {$name} ---");
        try {
            $fn();
            $this->info("OK {$name}");
        } catch (\Throwable $e) {
            $this->failures[] = "{$name}: ".$e->getMessage();
            $this->error("FAIL {$name}: ".$e->getMessage());
        }
    }

    protected function assertTrue(bool $cond, string $msg): void
    {
        if (!$cond) {
            throw new \RuntimeException($msg);
        }
    }

    protected function lineObj(int $productId, int $companyId, float $qty, float $cost, ?string $expiry): object
    {
        return (object) [
            'id' => random_int(1000000, 9999999),
            'product_id' => $productId,
            'company_id' => $companyId,
            'qty' => $qty,
            'purchase_price' => $cost,
            'sale_price' => $cost + 20,
            'expiry_date' => $expiry,
        ];
    }

    protected function openBatches(int $productId)
    {
        return DB::table('stock_batches_items')
            ->where('product_id', $productId)
            ->where('batch_wise_balance', '>', 0)
            ->orderBy('expiry_date')
            ->orderBy('id')
            ->get();
    }

    protected function batchSum(int $productId): float
    {
        return (float) DB::table('stock_batches_items')
            ->where('product_id', $productId)
            ->sum('batch_wise_balance');
    }

    protected function parentSnapshot(): array
    {
        return [
            'products_bal' => (float) DB::table('products')->sum('stock_balance'),
            'vsm_bal' => (float) DB::table('vendor_stock_managment')->sum('balance'),
            'vs_cnt' => (int) DB::table('vendor_stocks')->count(),
        ];
    }
}
