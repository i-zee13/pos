<?php
/**
 * Find why TTL IN HAND vs purchi میزان differ on one day (e.g. 280 Rs).
 *
 * Run on the LIVE server (same DB the shop uses):
 *   php desktop/scripts/diagnose-sale-close-gap.php 2026-08-31
 *   php artisan tinker  →  include ... (or copy to project root and run)
 *
 * Or from project root:
 *   php desktop/scripts/diagnose-sale-close-gap.php 31-08-2026
 */

use Illuminate\Support\Facades\DB;

require __DIR__ . '/../../vendor/autoload.php';
$app = require __DIR__ . '/../../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$raw = $argv[1] ?? '2026-08-31';
if (preg_match('/^(\d{2})-(\d{2})-(\d{4})$/', $raw, $m)) {
    $date = "{$m[3]}-{$m[2]}-{$m[1]}";
} else {
    $date = $raw;
}

$counterId = 8;
try {
    if (function_exists('sys_customer_id')) {
        $counterId = (int) (sys_customer_id('COUNTER_SALE') ?: 8);
    }
} catch (Throwable $e) {
    // keep 8
}

echo "=== Sale Close gap diagnose ===\n";
echo "date={$date}  COUNTER_SALE customer_id={$counterId}\n\n";

$tenantSql = '';
if (function_exists('tenant_and')) {
    // helpers often expect alias; skip if not usable in raw scripts
}

$sales = DB::table('sale_invoices')
    ->whereDate('date', $date)
    ->whereNull('deleted_at')
    ->orderBy('id')
    ->get([
        'id', 'invoice_no', 'customer_id', 'invoice_type',
        'invoice_discount', 'product_discount', 'paid_amount',
        'total_invoice_amount', 'organization_id',
    ]);

echo "sale_invoices rows: " . $sales->count() . "\n";

$byInvoice = $sales->groupBy('invoice_no');
$sumInvoiceDiscount = 0.0;
$sumCounterDiscount = 0.0;
$sumProductDiscount = 0.0;

echo "\n-- Invoices with invoice_discount > 0 --\n";
foreach ($byInvoice as $invNo => $rows) {
    $row = $rows->first();
    $invDisc = (float) $rows->max('invoice_discount');
    $prodDisc = (float) $rows->sum('product_discount');
    $sumInvoiceDiscount += $invDisc;
    $sumProductDiscount += $prodDisc;
    $isCounter = (int) $row->customer_id === $counterId;
    if ($isCounter) {
        $sumCounterDiscount += $invDisc;
    }
    if ($invDisc > 0.009 || $prodDisc > 0.009) {
        $flag = $isCounter ? ' [COUNTER_SALE]' : '';
        echo sprintf(
            "  inv=%s cust=%s type=%s inv_disc=%s prod_disc=%s paid=%s total=%s%s\n",
            $invNo,
            $row->customer_id,
            $row->invoice_type,
            $invDisc,
            $prodDisc,
            $row->paid_amount,
            $row->total_invoice_amount,
            $flag
        );
    }
}

echo "\nSUMS (per invoice_no for inv_disc):\n";
echo "  total_invoice_discount = {$sumInvoiceDiscount}\n";
echo "  total_net_sale_discount (counter only) = {$sumCounterDiscount}\n";
echo "  total_product_discount (line sum) = {$sumProductDiscount}\n";
echo "  *** If gap is ~280, check whether total_net_sale_discount equals that gap ***\n";

echo "\n-- Exact amount 280 anywhere that day --\n";
$hit280 = $byInvoice->filter(function ($rows) {
    return abs((float) $rows->max('invoice_discount') - 280) < 0.02
        || abs((float) $rows->sum('product_discount') - 280) < 0.02;
});
if ($hit280->isEmpty()) {
    echo "  (no sale invoice discount exactly 280)\n";
} else {
    foreach ($hit280 as $invNo => $rows) {
        $row = $rows->first();
        echo "  inv={$invNo} cust={$row->customer_id} inv_disc={$rows->max('invoice_discount')} prod_disc={$rows->sum('product_discount')}\n";
    }
}

// Ledger crumbs of 280
echo "\n-- customer_ledger cr/dr = 280 on {$date} --\n";
try {
    $cl = DB::table('customer_ledger')
        ->whereDate('date', $date)
        ->where(function ($q) {
            $q->where('cr', 280)->orWhere('dr', 280)
                ->orWhere('cr', 280.00)->orWhere('dr', 280.00);
        })
        ->whereNull('deleted_at')
        ->get(['id', 'customer_id', 'trx_type', 'cr', 'dr', 'sale_invoice_id', 'description']);
    if ($cl->isEmpty()) {
        // looser: abs near 280
        $cl = DB::table('customer_ledger')
            ->whereDate('date', $date)
            ->whereNull('deleted_at')
            ->where(function ($q) {
                $q->whereBetween('cr', [279.5, 280.5])->orWhereBetween('dr', [279.5, 280.5]);
            })
            ->get(['id', 'customer_id', 'trx_type', 'cr', 'dr', 'sale_invoice_id', 'description']);
    }
    if ($cl->isEmpty()) {
        echo "  (none)\n";
    } else {
        foreach ($cl as $r) {
            echo "  id={$r->id} cust={$r->customer_id} trx={$r->trx_type} cr={$r->cr} dr={$r->dr} sale_inv={$r->sale_invoice_id} {$r->description}\n";
        }
    }
} catch (Throwable $e) {
    echo "  customer_ledger skip: {$e->getMessage()}\n";
}

echo "\n-- vendor_ledger cr/dr ≈ 280 on {$date} --\n";
try {
    $vl = DB::table('vendor_ledger')
        ->whereDate('date', $date)
        ->whereNull('deleted_at')
        ->where(function ($q) {
            $q->whereBetween('cr', [279.5, 280.5])->orWhereBetween('dr', [279.5, 280.5]);
        })
        ->get(['id', 'vendor_id', 'trx_type', 'cr', 'dr', 'purchase_invoice_id']);
    if ($vl->isEmpty()) {
        echo "  (none)\n";
    } else {
        foreach ($vl as $r) {
            echo "  id={$r->id} vendor={$r->vendor_id} trx={$r->trx_type} cr={$r->cr} dr={$r->dr}\n";
        }
    }
} catch (Throwable $e) {
    echo "  vendor_ledger skip: {$e->getMessage()}\n";
}

echo "\nDone. Compare total_net_sale_discount with (میزان - TTL IN HAND).\n";
echo "Screenshot gap was 258520 - 258240 = 280.\n";
