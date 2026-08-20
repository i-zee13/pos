<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ScrubFractionalBatchesCommand extends Command
{
    protected $signature = 'stock:scrub-fractional-batches
                            {--min=1 : Keep only batches with balance >= this qty}
                            {--dry-run : Show what would be deleted without changing data}';

    protected $description = 'Remove open batch leftovers with qty < 1 and sync product/VSM balances + avg cost';

    public function handle(): int
    {
        $min = (float) $this->option('min');
        if ($min <= 0) {
            $this->error('--min must be > 0');

            return 1;
        }

        $dry = (bool) $this->option('dry-run');
        $rows = DB::select("
            SELECT id, product_id, company_id,
                   ROUND(batch_wise_balance, 6) AS qty,
                   ROUND(IFNULL(unit_cost_price, 0), 6) AS rate
            FROM stock_batches_items
            WHERE batch_wise_balance > 0
              AND batch_wise_balance < ?
            ORDER BY product_id, id
        ", [$min]);

        $this->info('Fractional open batches (< '.$min.'): '.count($rows));
        if (count($rows) === 0) {
            return 0;
        }

        $byProduct = [];
        foreach ($rows as $r) {
            $pid = (int) $r->product_id;
            if (!isset($byProduct[$pid])) {
                $byProduct[$pid] = [
                    'company_id' => (int) $r->company_id,
                    'dust_qty' => 0.0,
                    'ids' => [],
                ];
            }
            $byProduct[$pid]['dust_qty'] += (float) $r->qty;
            $byProduct[$pid]['ids'][] = (int) $r->id;
        }

        $this->info('Affected products: '.count($byProduct));
        foreach (array_slice($byProduct, 0, 15, true) as $pid => $info) {
            $name = DB::table('products')->where('id', $pid)->value('product_name');
            $this->line("  #{$pid} {$name} — remove ".count($info['ids']).' batch(es), dust_qty='.round($info['dust_qty'], 6));
        }
        if (count($byProduct) > 15) {
            $this->line('  ... and '.(count($byProduct) - 15).' more');
        }

        if ($dry) {
            $this->warn('Dry run — no changes made.');

            return 0;
        }

        // Backup table (once)
        $bak = 'stock_batches_frac_bak_'.date('Ymd_His');
        if (!Schema::hasTable($bak)) {
            DB::statement("CREATE TABLE `{$bak}` AS SELECT * FROM stock_batches_items WHERE batch_wise_balance > 0 AND batch_wise_balance < {$min}");
            $this->info("Backup: {$bak}");
        }

        DB::beginTransaction();
        try {
            $ids = array_map(function ($r) {
                return (int) $r->id;
            }, $rows);
            foreach (array_chunk($ids, 200) as $chunk) {
                DB::table('stock_batches_items')->whereIn('id', $chunk)->delete();
            }

            foreach ($byProduct as $pid => $info) {
                $dust = round($info['dust_qty'], 6);
                $cid = $info['company_id'];

                DB::update('UPDATE products SET stock_balance = GREATEST(0, ROUND(stock_balance - ?, 6)) WHERE id = ?', [$dust, $pid]);

                $vs = DB::table('vendor_stock_managment')
                    ->where('product_id', $pid)
                    ->where('company_id', $cid)
                    ->orderByDesc('id')
                    ->first();
                if ($vs) {
                    $newBal = max(0, round(((float) $vs->balance) - $dust, 6));
                    DB::table('vendor_stock_managment')->where('id', $vs->id)->update(['balance' => $newBal]);
                }

                if (function_exists('refreshVendorStockAvgCost')) {
                    refreshVendorStockAvgCost($pid, $cid);
                }
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error($e->getMessage());

            return 1;
        }

        $left = DB::table('stock_batches_items')
            ->where('batch_wise_balance', '>', 0)
            ->where('batch_wise_balance', '<', $min)
            ->count();
        $this->info("Done. Remaining fractional open batches: {$left}");

        return 0;
    }
}
