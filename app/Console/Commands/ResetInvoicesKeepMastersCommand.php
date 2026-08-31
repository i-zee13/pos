<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ResetInvoicesKeepMastersCommand extends Command
{
    protected $signature = 'pos:reset-invoices
                            {--yes : Run without confirmation}
                            {--force : Alias of --yes}';

    protected $description = 'Clear invoices/stock/ledgers; keep products, companies, customers';

    /** @var list<string> */
    private array $tables = [
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

    public function handle(): int
    {
        $this->warn('This deletes ALL purchase/sale/return/replacement invoices, stock & ledgers.');
        $this->info('Keeps: products, companies, customers (balances/stock_balance → 0).');

        if (!$this->option('yes') && !$this->option('force')) {
            if (!$this->confirm('Continue?', false)) {
                $this->line('Aborted.');
                return self::SUCCESS;
            }
        }

        $driver = DB::getDriverName();
        $cleared = 0;
        $missing = 0;

        if ($driver === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0');
        } elseif ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = OFF');
        }

        try {
            foreach ($this->tables as $table) {
                if (!Schema::hasTable($table)) {
                    $missing++;
                    continue;
                }
                if ($driver === 'mysql') {
                    DB::table($table)->truncate();
                } else {
                    DB::table($table)->delete();
                    try {
                        DB::table('sqlite_sequence')->where('name', $table)->delete();
                    } catch (\Throwable $e) {
                        // sqlite_sequence may not exist
                    }
                }
                $cleared++;
                $this->line("  cleared: {$table}");
            }

            if (Schema::hasTable('customers')) {
                DB::table('customers')->update(['balance' => 0]);
            }
            if (Schema::hasTable('products')) {
                DB::table('products')->update(['stock_balance' => 0]);
            }
        } finally {
            if ($driver === 'mysql') {
                DB::statement('SET FOREIGN_KEY_CHECKS=1');
            } elseif ($driver === 'sqlite') {
                DB::statement('PRAGMA foreign_keys = ON');
            }
        }

        $this->info("Done. cleared={$cleared} missing_tables={$missing}");
        return self::SUCCESS;
    }
}
