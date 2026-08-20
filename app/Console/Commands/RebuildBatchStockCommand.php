<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Rebuild stock_batches_items from purchase/sale/return history (FIFO by expiry),
 * align ending qty to products.stock_balance, then dump weighted avg cost into
 * vendor_stock_managment (ttl_avg_cost / ttl_cost only — balances untouched).
 *
 * Expiry rules:
 * - Real expiry_date → keep separate FEFO buckets (mandatory).
 * - NULL / 0000-00-00 → no expiry; layers may share that key (purchase-based cost layers).
 */
class RebuildBatchStockCommand extends Command
{
    protected $signature = 'stock:rebuild-batches
                            {--dry-run : Simulate only; do not write}
                            {--product= : Rebuild a single product_id}
                            {--skip-avg : Do not update vendor_stock_managment averages}';

    protected $description = 'Rebuild batch stock from history (expiry-aware FIFO) and dump avg cost to stock management';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $onlyProduct = $this->option('product') !== null ? (int) $this->option('product') : null;
        $skipAvg = (bool) $this->option('skip-avg');

        $this->info($dryRun ? 'DRY RUN — no writes' : 'LIVE RUN — will rewrite stock_batches_items');

        // Snapshot other stock tables (must stay identical for qty)
        $before = $this->stockSnapshots();
        $this->line('Before: products_bal='.$before['products_bal'].' vsm_bal='.$before['vsm_bal'].' vs_rows='.$before['vs_cnt']);

        if (!$dryRun) {
            $bak = 'stock_batches_items_rebuild_bak_'.date('Ymd_His');
            DB::statement("CREATE TABLE {$bak} AS SELECT * FROM stock_batches_items");
            $this->info("Backup table created: {$bak}");
        }

        $productsQuery = DB::table('products as p')
            ->leftJoin('companies as c', 'c.id', '=', 'p.company_id')
            ->select(
                'p.id',
                'p.company_id',
                'p.product_name',
                'c.company_name',
                'p.stock_balance',
                'p.old_purchase_price',
                'p.new_purchase_price',
                'p.sale_price',
                'p.tenant_id'
            );
        if ($onlyProduct) {
            $productsQuery->where('p.id', $onlyProduct);
        }
        $products = $productsQuery->orderBy('p.id')->get();

        $stats = [
            'products' => 0,
            'matched' => 0,
            'gap_filled' => 0,
            'gap_trimmed' => 0,
            'batches_written' => 0,
            'avg_updated' => 0,
            'zero_stock_cleared' => 0,
        ];

        $rowsToInsert = [];
        $avgUpdates = []; // product_id => [avg, ttl_cost, balance]

        $bar = $this->output->createProgressBar($products->count());
        $bar->start();

        foreach ($products as $product) {
            $stats['products']++;
            $targetBal = round((float) ($product->stock_balance ?? 0), 6);
            $layers = $this->replayProduct((int) $product->id, (int) $product->company_id);

            $sum = 0.0;
            foreach ($layers as $layer) {
                $sum += $layer['balance'];
            }
            $sum = round($sum, 6);
            $gap = round($targetBal - $sum, 6);

            if ($gap > 0.0001) {
                $cost = $this->fallbackCost($product);
                $layers[] = [
                    'expiry' => '0000-00-00',
                    'unit_cost' => $cost,
                    'balance' => $gap,
                    'source' => 'gap_in',
                ];
                $stats['gap_filled']++;
            } elseif ($gap < -0.0001) {
                $this->trimLayers($layers, abs($gap));
                $stats['gap_trimmed']++;
            } else {
                $stats['matched']++;
            }

            // Drop empty
            $layers = array_values(array_filter($layers, function ($l) {
                return ($l['balance'] ?? 0) > 0.0001;
            }));

            if ($targetBal <= 0.0001) {
                if (empty($layers)) {
                    $stats['zero_stock_cleared']++;
                }
                // Still clear any replay leftovers if product shows 0
                $layers = [];
            }

            $ttlCost = 0.0;
            $ttlQty = 0.0;
            foreach ($layers as $layer) {
                $ttlCost += $layer['unit_cost'] * $layer['balance'];
                $ttlQty += $layer['balance'];
                $rowsToInsert[] = $this->buildBatchRow($product, $layer);
            }

            if ($ttlQty > 0.0001) {
                $avg = round($ttlCost / $ttlQty, 6);
                $avgUpdates[(int) $product->id] = [
                    'avg' => $avg,
                    'ttl_cost' => round($avg * $targetBal, 6),
                    'balance' => $targetBal,
                ];
            }

            $bar->advance();
        }
        $bar->finish();
        $this->newLine(2);

        $stats['batches_written'] = count($rowsToInsert);

        if ($dryRun) {
            $this->table(
                ['Metric', 'Value'],
                collect($stats)->map(fn ($v, $k) => [$k, $v])->values()->all()
            );
            $this->warn('Dry run complete — no DB changes.');
            return 0;
        }

        // MyISAM has no transactions — build into temp table, then atomic RENAME swap.
        DB::statement('DROP TABLE IF EXISTS stock_batches_items_rebuild_new');
        DB::statement('CREATE TABLE stock_batches_items_rebuild_new LIKE stock_batches_items');

        foreach (array_chunk($rowsToInsert, 300) as $chunk) {
            DB::table('stock_batches_items_rebuild_new')->insert($chunk);
        }

        $newCount = (int) DB::table('stock_batches_items_rebuild_new')->count();
        if ($newCount !== count($rowsToInsert)) {
            $this->error("Temp insert mismatch: expected ".count($rowsToInsert)." got {$newCount}. Aborting swap.");
            return 1;
        }

        if ($onlyProduct) {
            DB::table('stock_batches_items')->where('product_id', $onlyProduct)->delete();
            $productRows = DB::table('stock_batches_items_rebuild_new')->where('product_id', $onlyProduct)->get();
            foreach ($productRows as $row) {
                $arr = (array) $row;
                unset($arr['id']);
                DB::table('stock_batches_items')->insert($arr);
            }
            DB::statement('DROP TABLE IF EXISTS stock_batches_items_rebuild_new');
        } else {
            DB::statement('RENAME TABLE stock_batches_items TO stock_batches_items_rebuild_old_swap, stock_batches_items_rebuild_new TO stock_batches_items');
            DB::statement('DROP TABLE IF EXISTS stock_batches_items_rebuild_old_swap');
        }

        if (!$skipAvg) {
            foreach ($avgUpdates as $productId => $avg) {
                $latestId = DB::table('vendor_stock_managment')
                    ->where('product_id', $productId)
                    ->orderByDesc('id')
                    ->value('id');
                if (!$latestId) {
                    continue;
                }
                DB::table('vendor_stock_managment')->where('id', $latestId)->update([
                    'ttl_avg_cost' => $avg['avg'],
                    'ttl_cost' => $avg['ttl_cost'],
                    'updated_at' => now(),
                ]);
                $stats['avg_updated']++;
            }
        }
        $after = $this->stockSnapshots();
        $qtyOk = abs($before['products_bal'] - $after['products_bal']) < 0.01
            && abs($before['vsm_bal'] - $after['vsm_bal']) < 0.01
            && $before['vs_cnt'] === $after['vs_cnt'];

        // Verify batch sum vs products
        $verify = DB::selectOne("
            SELECT
              COUNT(*) AS n,
              SUM(CASE WHEN ABS(IFNULL(b.batch_sum,0) - IFNULL(p.stock_balance,0)) < 0.01 THEN 1 ELSE 0 END) AS matched,
              SUM(CASE WHEN ABS(IFNULL(b.batch_sum,0) - IFNULL(p.stock_balance,0)) >= 0.01 THEN 1 ELSE 0 END) AS mismatched
            FROM products p
            LEFT JOIN (
              SELECT product_id, SUM(batch_wise_balance) batch_sum
              FROM stock_batches_items GROUP BY product_id
            ) b ON b.product_id = p.id
            WHERE IFNULL(p.stock_balance,0) <> 0 OR IFNULL(b.batch_sum,0) <> 0
        ");

        $this->table(
            ['Metric', 'Value'],
            collect($stats)->map(fn ($v, $k) => [$k, $v])->values()->all()
        );
        $this->info("Batch vs products.stock_balance → matched={$verify->matched} mismatched={$verify->mismatched}");
        $this->info($qtyOk
            ? 'SAFE: products / vendor_stock_managment / vendor_stocks qty unchanged.'
            : 'WARNING: other stock table totals changed — investigate!');

        return $qtyOk ? 0 : 1;
    }

    protected function stockSnapshots(): array
    {
        return [
            'products_bal' => (float) DB::table('products')->sum('stock_balance'),
            'vsm_bal' => (float) DB::table('vendor_stock_managment')->sum('balance'),
            'vs_cnt' => (int) DB::table('vendor_stocks')->count(),
            'batch_cnt' => (int) DB::table('stock_batches_items')->count(),
            'batch_bal' => (float) DB::table('stock_batches_items')->sum('batch_wise_balance'),
        ];
    }

    protected function normalizeExpiry($expiry): string
    {
        if ($expiry === null || $expiry === '' || $expiry === '0000-00-00' || $expiry === '0000-00-00 00:00:00') {
            return '0000-00-00';
        }
        return substr((string) $expiry, 0, 10);
    }

    /**
     * @return array<int, array{expiry:string,unit_cost:float,balance:float,source:string}>
     */
    protected function replayProduct(int $productId, int $companyId): array
    {
        $events = [];

        $purchases = DB::table('products_purchases')
            ->where('product_id', $productId)
            ->whereNull('deleted_at')
            ->orderBy('created_at')
            ->orderBy('id')
            ->get(['id', 'qty', 'purchase_price', 'expiry_date', 'created_at', 'purchase_invoice_id']);
        foreach ($purchases as $row) {
            $events[] = [
                'at' => $row->created_at,
                'id' => (int) $row->id,
                'seq' => 1,
                'dir' => 'in',
                'qty' => (float) $row->qty,
                'cost' => (float) $row->purchase_price,
                'expiry' => $this->normalizeExpiry($row->expiry_date),
                'source' => 'purchase',
                'ref' => (int) $row->id,
            ];
        }

        $sales = DB::table('products_sales')
            ->where('product_id', $productId)
            ->whereNull('deleted_at')
            ->orderBy('created_at')
            ->orderBy('id')
            ->get(['id', 'qty', 'created_at']);
        foreach ($sales as $row) {
            $events[] = [
                'at' => $row->created_at,
                'id' => (int) $row->id,
                'seq' => 2,
                'dir' => 'out',
                'qty' => (float) $row->qty,
                'cost' => 0.0,
                'expiry' => '0000-00-00',
                'source' => 'sale',
                'ref' => (int) $row->id,
            ];
        }

        $pReturns = DB::table('products_returns')
            ->where('product_id', $productId)
            ->whereNull('deleted_at')
            ->orderBy('created_at')
            ->orderBy('id')
            ->get(['id', 'qty', 'purchase_price', 'expiry_date', 'created_at']);
        foreach ($pReturns as $row) {
            $events[] = [
                'at' => $row->created_at,
                'id' => (int) $row->id,
                'seq' => 3,
                'dir' => 'out',
                'qty' => (float) $row->qty,
                'cost' => (float) $row->purchase_price,
                'expiry' => $this->normalizeExpiry($row->expiry_date),
                'source' => 'purchase_return',
                'ref' => (int) $row->id,
            ];
        }

        $sReturns = DB::table('sale_return_products')
            ->where('product_id', $productId)
            ->whereNull('deleted_at')
            ->orderBy('created_at')
            ->orderBy('id')
            ->get(['id', 'qty', 'purchase_price', 'expiry_date', 'created_at']);
        foreach ($sReturns as $row) {
            $events[] = [
                'at' => $row->created_at,
                'id' => (int) $row->id,
                'seq' => 4,
                'dir' => 'in',
                'qty' => (float) $row->qty,
                'cost' => (float) $row->purchase_price,
                'expiry' => $this->normalizeExpiry($row->expiry_date),
                'source' => 'sale_return',
                'ref' => (int) $row->id,
            ];
        }

        // product_type 1 = given out (OUT), else taken in (IN) — matches replacement controller
        $replacements = DB::table('product_replacements')
            ->where('product_id', $productId)
            ->whereNull('deleted_at')
            ->orderBy('created_at')
            ->orderBy('id')
            ->get(['id', 'qty', 'purchase_price', 'expiry_date', 'created_at', 'product_type']);
        foreach ($replacements as $row) {
            $events[] = [
                'at' => $row->created_at,
                'id' => (int) $row->id,
                'seq' => 5,
                'dir' => ((int) $row->product_type === 1) ? 'out' : 'in',
                'qty' => (float) $row->qty,
                'cost' => (float) $row->purchase_price,
                'expiry' => $this->normalizeExpiry($row->expiry_date),
                'source' => 'replacement',
                'ref' => (int) $row->id,
            ];
        }

        usort($events, function ($a, $b) {
            $c = strcmp((string) $a['at'], (string) $b['at']);
            if ($c !== 0) {
                return $c;
            }
            if ($a['seq'] !== $b['seq']) {
                return $a['seq'] <=> $b['seq'];
            }
            return $a['id'] <=> $b['id'];
        });

        $layers = [];
        foreach ($events as $event) {
            if ($event['qty'] <= 0) {
                continue;
            }
            if ($event['dir'] === 'in') {
                $this->addIn($layers, $event['expiry'], $event['cost'], $event['qty'], $event['source']);
            } else {
                $this->takeOut($layers, $event['qty']);
            }
        }

        return $layers;
    }

    protected function addIn(array &$layers, string $expiry, float $cost, float $qty, string $source): void
    {
        $cost = round(max(0, $cost), 6);
        // Same expiry + same cost → merge; different cost stays separate layer (FIFO-authentic)
        foreach ($layers as &$layer) {
            if ($layer['expiry'] === $expiry && abs($layer['unit_cost'] - $cost) < 0.0001) {
                $layer['balance'] = round($layer['balance'] + $qty, 6);
                return;
            }
        }
        unset($layer);
        $layers[] = [
            'expiry' => $expiry,
            'unit_cost' => $cost,
            'balance' => round($qty, 6),
            'source' => $source,
        ];
    }

    protected function takeOut(array &$layers, float $qty): void
    {
        $remaining = $qty;
        // FEFO: real expiries first (ASC), unknown expiry (0000-00-00) last
        usort($layers, function ($a, $b) {
            $aUnk = $a['expiry'] === '0000-00-00';
            $bUnk = $b['expiry'] === '0000-00-00';
            if ($aUnk !== $bUnk) {
                return $aUnk ? 1 : -1;
            }
            $c = strcmp($a['expiry'], $b['expiry']);
            if ($c !== 0) {
                return $c;
            }
            return $a['unit_cost'] <=> $b['unit_cost'];
        });

        foreach ($layers as &$layer) {
            if ($remaining <= 0.0001) {
                break;
            }
            if ($layer['balance'] <= 0.0001) {
                continue;
            }
            $take = min($layer['balance'], $remaining);
            $layer['balance'] = round($layer['balance'] - $take, 6);
            $remaining = round($remaining - $take, 6);
        }
        unset($layer);
        // If remaining > 0, history sold more than purchased — gap trim/fill later vs products.stock_balance
    }

    protected function trimLayers(array &$layers, float $qty): void
    {
        $this->takeOut($layers, $qty);
    }

    protected function fallbackCost(object $product): float
    {
        $new = (float) ($product->new_purchase_price ?? 0);
        if ($new > 0) {
            return $new;
        }
        $old = (float) ($product->old_purchase_price ?? 0);
        if ($old > 0) {
            return $old;
        }
        $last = DB::table('products_purchases')
            ->where('product_id', $product->id)
            ->whereNull('deleted_at')
            ->orderByDesc('id')
            ->value('purchase_price');

        return (float) ($last ?? 0);
    }

    protected function buildBatchRow(object $product, array $layer): array
    {
        $balance = round((float) $layer['balance'], 6);
        $unit = round((float) $layer['unit_cost'], 6);
        $now = now()->format('Y-m-d H:i:s');

        return [
            'tenant_id' => $product->tenant_id,
            'batch_id' => 'RB-'.$product->id.'-'.substr(md5($layer['expiry'].'|'.$unit.'|'.$balance), 0, 10),
            'invoice_id' => 0,
            'invoice_product_id' => 0,
            'vs_id' => 0,
            'trx_type' => 'purchase',
            'company_id' => $product->company_id,
            'product_id' => $product->id,
            'company_name' => $this->toLatin1($product->company_name),
            'product_name' => $this->toLatin1($product->product_name),
            'mfg_date' => '0000-00-00',
            'expiry_date' => $layer['expiry'],
            'qty' => (int) max(1, (int) round($balance)),
            'actual_qty' => (int) max(1, (int) round($balance)),
            'actual_status' => 1,
            'batch_wise_balance' => $balance,
            'total_balance' => 0,
            'unit_cost_price' => $unit,
            'ttl_cost_price' => round($unit * $balance, 6),
            'avg_cost_price_per_unit' => $unit,
            'created_by' => 0,
            'created_at' => $now,
            'updated_by' => null,
            'updated_at' => $now,
        ];
    }

    /**
     * stock_batches_items is latin1/MyISAM — keep names ASCII-safe for inserts.
     */
    protected function toLatin1($value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        return preg_replace('/[^\x20-\x7E]/', '?', (string) $value);
    }
}
