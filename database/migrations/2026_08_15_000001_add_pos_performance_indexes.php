<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Composite indexes for sale/stock hot paths.
 * Does not change application behaviour — only query plans.
 */
class AddPosPerformanceIndexes extends Migration
{
    public function up()
    {
        // vendor_stocks: latest balance by product + sale-line lookups
        $this->addIndexIfMissing('vendor_stocks', 'vendor_stocks_tenant_product_id_index', ['tenant_id', 'product_id', 'id']);
        $this->addIndexIfMissing('vendor_stocks', 'vendor_stocks_product_id_id_index', ['product_id', 'id']);
        $this->addIndexIfMissing('vendor_stocks', 'vendor_stocks_sale_invoice_product_index', ['sale_invoice_id', 'product_id']);

        // customer_ledger
        $this->addIndexIfMissing('customer_ledger', 'customer_ledger_tenant_customer_id_index', ['tenant_id', 'customer_id', 'id']);
        $this->addIndexIfMissing('customer_ledger', 'customer_ledger_customer_id_id_index', ['customer_id', 'id']);
        $this->addIndexIfMissing('customer_ledger', 'customer_ledger_sale_invoice_id_index', ['sale_invoice_id']);
        $this->addIndexIfMissing('customer_ledger', 'customer_ledger_tenant_customer_editable_index', ['tenant_id', 'customer_id', 'is_editable']);

        // vendor_ledger (isEditable)
        $this->addIndexIfMissing('vendor_ledger', 'vendor_ledger_tenant_customer_editable_index', ['tenant_id', 'customer_id', 'is_editable']);
        $this->addIndexIfMissing('vendor_ledger', 'vendor_ledger_customer_editable_index', ['customer_id', 'is_editable']);

        // sale invoices
        $this->addIndexIfMissing('sale_invoices', 'sale_invoices_tenant_date_index', ['tenant_id', 'date']);
        $this->addIndexIfMissing('sale_invoices', 'sale_invoices_date_index', ['date']);
        $this->addIndexIfMissing('sale_invoices', 'sale_invoices_tenant_customer_editable_index', ['tenant_id', 'customer_id', 'is_editable']);
        $this->addIndexIfMissing('sale_invoices', 'sale_invoices_customer_editable_index', ['customer_id', 'is_editable']);

        // other invoice tables touched by isEditable()
        $this->addIndexIfMissing('sale_return_invoices', 'sale_return_invoices_tenant_customer_editable_index', ['tenant_id', 'customer_id', 'is_editable']);
        $this->addIndexIfMissing('sale_return_invoices', 'sale_return_invoices_customer_editable_index', ['customer_id', 'is_editable']);
        $this->addIndexIfMissing('purchase_invoices', 'purchase_invoices_tenant_customer_editable_index', ['tenant_id', 'customer_id', 'is_editable']);
        $this->addIndexIfMissing('purchase_invoices', 'purchase_invoices_customer_editable_index', ['customer_id', 'is_editable']);
        $this->addIndexIfMissing('purchase_return_invoices', 'purchase_return_invoices_tenant_customer_editable_index', ['tenant_id', 'customer_id', 'is_editable']);
        $this->addIndexIfMissing('purchase_return_invoices', 'purchase_return_invoices_customer_editable_index', ['customer_id', 'is_editable']);
        $this->addIndexIfMissing('product_replacment_invoices', 'product_replacment_invoices_tenant_customer_editable_index', ['tenant_id', 'customer_id', 'is_editable']);
        $this->addIndexIfMissing('product_replacment_invoices', 'product_replacment_invoices_customer_editable_index', ['customer_id', 'is_editable']);

        // products_sales / batch FEFO
        $this->addIndexIfMissing('products_sales', 'products_sales_sale_invoice_id_index', ['sale_invoice_id']);
        $this->addIndexIfMissing('stock_batches_items', 'stock_batches_items_tenant_product_company_expiry_index', ['tenant_id', 'product_id', 'company_id', 'expiry_date']);
        $this->addIndexIfMissing('stock_batches_items', 'stock_batches_items_product_expiry_index', ['product_id', 'expiry_date']);
    }

    public function down()
    {
        $indexes = [
            'vendor_stocks' => [
                'vendor_stocks_tenant_product_id_index',
                'vendor_stocks_product_id_id_index',
                'vendor_stocks_sale_invoice_product_index',
            ],
            'customer_ledger' => [
                'customer_ledger_tenant_customer_id_index',
                'customer_ledger_customer_id_id_index',
                'customer_ledger_sale_invoice_id_index',
                'customer_ledger_tenant_customer_editable_index',
            ],
            'vendor_ledger' => [
                'vendor_ledger_tenant_customer_editable_index',
                'vendor_ledger_customer_editable_index',
            ],
            'sale_invoices' => [
                'sale_invoices_tenant_date_index',
                'sale_invoices_date_index',
                'sale_invoices_tenant_customer_editable_index',
                'sale_invoices_customer_editable_index',
            ],
            'sale_return_invoices' => [
                'sale_return_invoices_tenant_customer_editable_index',
                'sale_return_invoices_customer_editable_index',
            ],
            'purchase_invoices' => [
                'purchase_invoices_tenant_customer_editable_index',
                'purchase_invoices_customer_editable_index',
            ],
            'purchase_return_invoices' => [
                'purchase_return_invoices_tenant_customer_editable_index',
                'purchase_return_invoices_customer_editable_index',
            ],
            'product_replacment_invoices' => [
                'product_replacment_invoices_tenant_customer_editable_index',
                'product_replacment_invoices_customer_editable_index',
            ],
            'products_sales' => [
                'products_sales_sale_invoice_id_index',
            ],
            'stock_batches_items' => [
                'stock_batches_items_tenant_product_company_expiry_index',
                'stock_batches_items_product_expiry_index',
            ],
        ];

        foreach ($indexes as $table => $names) {
            foreach ($names as $name) {
                $this->dropIndexIfExists($table, $name);
            }
        }
    }

    /**
     * @param  list<string>  $columns
     */
    protected function addIndexIfMissing(string $table, string $index, array $columns): void
    {
        if (! Schema::hasTable($table)) {
            return;
        }

        foreach ($columns as $column) {
            if (! Schema::hasColumn($table, $column)) {
                return;
            }
        }

        if ($this->indexExists($table, $index)) {
            return;
        }

        try {
            Schema::table($table, function (Blueprint $blueprint) use ($columns, $index) {
                $blueprint->index($columns, $index);
            });
        } catch (\Throwable $e) {
            // Duplicate / unsupported engine — skip so migrate stays safe on shared hosting.
        }
    }

    protected function dropIndexIfExists(string $table, string $index): void
    {
        if (! Schema::hasTable($table) || ! $this->indexExists($table, $index)) {
            return;
        }

        try {
            Schema::table($table, function (Blueprint $blueprint) use ($index) {
                $blueprint->dropIndex($index);
            });
        } catch (\Throwable $e) {
            // ignore
        }
    }

    protected function indexExists(string $table, string $index): bool
    {
        $schema = DB::getDatabaseName();
        $row = DB::selectOne(
            'SELECT 1 AS ok FROM information_schema.statistics
             WHERE table_schema = ? AND table_name = ? AND index_name = ?
             LIMIT 1',
            [$schema, $table, $index]
        );

        return $row !== null;
    }
}
