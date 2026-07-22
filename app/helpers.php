<?php

use App\Models\AdminSaleClose;
use App\Models\BatchStockMgt;
use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\Product;
use App\Models\ProductReplacement;
use App\Models\ProductReplacementInvoice;
use App\Models\PurchaseInvoice;
use App\Models\ReturnInvoice;
use App\Models\Sale as SaleInvoice; 
use App\Models\SaleReturn; 
use App\Models\StockManagment;
use App\Models\VendorLedger;
use App\Models\VendorStock;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stevebauman\Location\Facades\Location;


if (!function_exists('current_tenant_id')) {
    /**
     * Resolve the tenant_id of the currently logged-in user.
     * Returns null when nobody is authenticated (console, jobs, login screen).
     */
    function current_tenant_id()
    {
        if (Auth::check()) {
            $tenantId = Auth::user()->tenant_id ?? null;

            return $tenantId !== null ? (int) $tenantId : null;
        }

        return null;
    }
}
if (!function_exists('tenant_and')) {
    /**
     * Build a raw SQL fragment ` AND <alias.>tenant_id = X ` for splicing into
     * hand-written WHERE clauses. Returns an empty string when no tenant is
     * resolvable so legacy/console queries keep working unchanged.
     */
    function tenant_and($alias = null, $column = 'tenant_id')
    {
        $tenantId = current_tenant_id();
        if ($tenantId === null) {
            return '';
        }
        $prefix = $alias ? $alias.'.' : '';

        return " AND {$prefix}{$column} = ".(int) $tenantId.' ';
    }
}
if (!function_exists('tenant_where')) {
    /**
     * Build a raw SQL condition `<alias.>tenant_id = X` for use right after WHERE.
     * Returns `1=1` when no tenant is resolvable.
     */
    function tenant_where($alias = null, $column = 'tenant_id')
    {
        $tenantId = current_tenant_id();
        if ($tenantId === null) {
            return ' 1=1 ';
        }
        $prefix = $alias ? $alias.'.' : '';

        return " {$prefix}{$column} = ".(int) $tenantId.' ';
    }
}
if (!function_exists('sum_per_invoice')) {
    /**
     * Sum an invoice-level field once per invoice_no (max per group).
     * Fixes under-count when product lines carry different invoice_discount values.
     */
    function sum_per_invoice($collection, string $field, ?callable $invoiceFilter = null): float
    {
        return (float) collect($collection)
            ->groupBy('invoice_no')
            ->reduce(function (float $sum, $rows) use ($field, $invoiceFilter) {
                $row = $rows->first();
                if ($invoiceFilter && !$invoiceFilter($row)) {
                    return $sum;
                }

                return $sum + (float) $rows->max($field);
            }, 0.0);
    }
}
if (!function_exists('sys_customers')) {
    /**
     * Current tenant ke saare "system" customers ka map: [code => id].
     * Ek hi query, per-request memoized. Agar `system_code` column abhi mojood
     * nahi (SQL na chala ho) ya koi DB issue ho to khali array return hota hai
     * taake site na ruke (JS purane literal id par fallback kar lega).
     *
     * Codes: COUNTER_SALE, EXPENSE, NET_PURCHASE, NET_PURCHASE_RETURN
     */
    function sys_customers()
    {
        static $map = null;

        if ($map === null) {
            try {
                $map = Customer::whereNotNull('system_code')
                    ->pluck('id', 'system_code')
                    ->map(function ($id) { return (int) $id; })
                    ->toArray();
            } catch (\Throwable $e) {
                $map = [];
            }
        }

        return $map;
    }
}
if (!function_exists('sys_customer_id')) {
    /**
     * Resolve a "system" customer's id by its stable code for the current tenant.
     * Numeric IDs (e.g. Counter Sale = 8, Expense = 5) hardcode na karein; in ki
     * jagah yeh helper use karein taake har tenant apna apna system-customer use kare.
     */
    function sys_customer_id($code)
    {
        $map = sys_customers();

        return $map[$code] ?? null;
    }
}
if (!function_exists('provision_system_customers')) {
    /**
     * Logged-in user ke tenant ke liye 4 system customers ensure karein:
     * EXPENSE, COUNTER_SALE, NET_PURCHASE, NET_PURCHASE_RETURN.
     * Sab mojood hon to skip; jo missing hon sirf woh banayein.
     */
    function provision_system_customers()
    {
        $tenantId = current_tenant_id();
        if ($tenantId === null) {
            return [
                'status'  => 'error',
                'message' => 'Logged-in user par tenant_id set nahi. Pehle users.tenant_id set karein.',
            ];
        }

        $userId = Auth::id();
        $definitions = [
            ['name' => 'EXPENSE',             'type' => 2, 'code' => 'EXPENSE'],
            ['name' => 'Counter Sale',        'type' => 2, 'code' => 'COUNTER_SALE'],
            ['name' => 'NET PURCHASE',        'type' => 1, 'code' => 'NET_PURCHASE'],
            ['name' => 'NET PURCHASE RETURN', 'type' => 1, 'code' => 'NET_PURCHASE_RETURN'],
        ];
        $codes = array_column($definitions, 'code');

        try {
            $existing = Customer::whereNotNull('system_code')
                ->whereIn('system_code', $codes)
                ->pluck('system_code')
                ->all();
        } catch (\Throwable $e) {
            return [
                'status'  => 'error',
                'message' => 'customers.system_code column nahi mila. Pehle system_customers.sql chalayein.',
            ];
        }

        $missing = array_diff($codes, $existing);

        if ($missing === []) {
            return [
                'status'    => 'skipped',
                'message'   => 'Accounts already created for tenant '.$tenantId.'.',
                'tenant_id' => $tenantId,
                'accounts'  => $existing,
            ];
        }

        $created = [];
        foreach ($definitions as $def) {
            if (!in_array($def['code'], $missing, true)) {
                continue;
            }

            $customer = Customer::create([
                'tenant_id'     => $tenantId,
                'customer_name' => $def['name'],
                'customer_type' => $def['type'],
                'system_code'   => $def['code'],
                'created_by'    => $userId,
            ]);

            $created[] = $def['code'].' (id '.$customer->id.')';
        }

        return [
            'status'    => 'success',
            'message'   => 'System accounts created for tenant '.$tenantId.'.',
            'tenant_id' => $tenantId,
            'created'   => $created,
        ];
    }
}
if (!function_exists('system_accounts_ready')) {
    /**
     * Current tenant ke 4 system customers sab mojood hain ya nahi.
     */
    function system_accounts_ready()
    {
        $required = ['EXPENSE', 'COUNTER_SALE', 'NET_PURCHASE', 'NET_PURCHASE_RETURN'];
        $map = sys_customers();

        foreach ($required as $code) {
            if (empty($map[$code])) {
                return false;
            }
        }

        return true;
    }
}
if (!function_exists('fix_invoice_helper_case')) {
    /**
     * Linux (case-sensitive) par lowercase `app/invoice_helper.php` shim banata
     * hai jo asli `app/Invoice_helper.php` ko load karti hai. Composer/CMD ke
     * baghair case-mismatch error theek karne ke liye. Windows (case-insensitive)
     * par koi change nahi hota (capital file hi match ho jati hai).
     */
    function fix_invoice_helper_case()
    {
        $upper = app_path('Invoice_helper.php');
        $lower = app_path('invoice_helper.php');

        if (!file_exists($upper)) {
            return 'Source app/Invoice_helper.php not found; nothing to fix.';
        }
        if (file_exists($lower)) {
            return 'invoice_helper.php already available (no change needed).';
        }

        $ok = @file_put_contents($lower, "<?php\n\nrequire_once __DIR__ . '/Invoice_helper.php';\n");

        return $ok !== false
            ? 'OK: created lowercase shim app/invoice_helper.php'
            : 'FAILED: could not write app/invoice_helper.php (check app/ folder permissions).';
    }
}
if (!function_exists('timeZoneList')) {
    function timeZoneList()
    {
        $zones_array = array();
        $timestamp = time();
        $dummy_datetime_object = new DateTime();
        foreach (timezone_identifiers_list() as $key => $zone) {
            date_default_timezone_set($zone);
            $zones_array[$key]['zone'] = $zone;
            $zones_array[$key]['diff_from_GMT'] = 'UTC/GMT ' . date('P', $timestamp);
            $tz = new DateTimeZone($zone);
            $zones_array[$key]['offset'] = $tz->getOffset($dummy_datetime_object);
        }
        return $zones_array;
    }
}
if (!function_exists('GetCurrentLocation')) {
    function GetCurrentLocation()
    {
        $ip =   isset($_SERVER["REMOTE_ADDR"]) && $_SERVER["REMOTE_ADDR"] != '127.0.0.1' ? $_SERVER["REMOTE_ADDR"] : '103.255.4.42';
        return Location::get($ip);
    }
}
if (!function_exists('getInvoice')) {
    function getInvoice()
    {
        $year           = date('y');
        $invoice_no     = 1;
        $lastinvoice    = SaleInvoice::where('date', Carbon::today())->count();
        $invoice_no     = ($lastinvoice ? $lastinvoice + 1 : $invoice_no) . '-' . Carbon::today()->format('j-n-y');
        return $invoice_no;
    }
}

if (!function_exists('getPurchaseInvoice')) {
    function getPurchaseInvoice()
    {
        $year        = date('y');
        $invoice_no  = 1;
        $lastinvoice = PurchaseInvoice::where('date', Carbon::today())->count();
        $invoice_no  = ($lastinvoice ? $lastinvoice + 1 : $invoice_no) . '-' . Carbon::now();

        return $invoice_no;
    }
}
if (!function_exists('getProductReplacementNo')) {
    function getProductReplacementNo()
    {
        $invoice_no    = 1;
        $lastinvoice   = ProductReplacementInvoice::where('date', Carbon::today())->count();

        $invoice_no    = ($lastinvoice ? $lastinvoice + 1 : $invoice_no) . '-' .Carbon::now();

        return $invoice_no;
    }
}
if (!function_exists('getSaleReturnNo')) {
    function getSaleReturnNo()
    {
        $invoice_no    = 1;
        $lastinvoice   = SaleReturn::where('date', Carbon::today())->count();

        $invoice_no    = ($lastinvoice ? $lastinvoice + 1 : $invoice_no) . '-' . Carbon::now();

        return $invoice_no;
    }
}
if (!function_exists('getPurchaseReturnNo')) {
    function getPurchaseReturnNo()
    {
        $invoice_no    = 1;
        $lastinvoice   = ReturnInvoice::where('date', Carbon::today())->count();
        $invoice_no    = ($lastinvoice ? $lastinvoice + 1 : $invoice_no) . '-' . Carbon::now();
        return $invoice_no;
    }
}
if (!function_exists('getCrvNo')) {
    function getCrvNo()
    {
        $invoice_no    = 1;
        $lastinvoice   = CustomerLedger::where('date', Carbon::today())->where('trx_type', 3)->where('cr', '>', 0)->count();

        $invoice_no    = 'Crv -' . ($lastinvoice ? $lastinvoice + 1 : $invoice_no) . '-' . Carbon::today()->format('j-n-y');

        return $invoice_no;
    }
}
if (!function_exists('getCpvNo')) {
    function getCpvNo()
    {
        $invoice_no    = 1;
        $lastinvoice   = CustomerLedger::where('date', Carbon::today())->where('trx_type', 3)->where('dr', '>', 0)->count();

        $invoice_no    = 'Cpv -' . ($lastinvoice ? $lastinvoice + 1 : $invoice_no) . '-' . Carbon::today()->format('j-n-y');

        return $invoice_no;
    }
}
if (!function_exists('getVendorCrvNo')) {
    function getVendorCrvNo()
    {
        $invoice_no    = 1;
        $lastinvoice   = VendorLedger::where('date', Carbon::today())->where('trx_type', 3)->where('cr', '>', 0)->count();
        $invoice_no    = 'Crv-' .  ($lastinvoice ? $lastinvoice + 1 : $invoice_no) . '-' . Carbon::today()->format('j-n-y');

        return $invoice_no;
    }
}
if (!function_exists('getVendorCpvNo')) {
    function getVendorCpvNo()
    {
        $invoice_no    = 1;
        $lastinvoice   = VendorLedger::where('date', Carbon::today())->where('trx_type', 3)->where('dr', '>', 0)->count();
        $invoice_no    = 'Cpv -' . ($lastinvoice ? $lastinvoice + 1 : $invoice_no) . '-' . Carbon::today()->format('j-n-y');

        return $invoice_no;
    }
}

if (!function_exists('isEditable')) {
     function isEditable($customer_id)
    {
        CustomerLedger::where('customer_id', $customer_id)
            
            ->where('is_editable', 1)
            ->update(['is_editable' => 0]);
        VendorLedger::where('customer_id', $customer_id)
            
            ->where('is_editable', 1)
            ->update(['is_editable' => 0]);
        //Sales
        SaleInvoice::where('customer_id', $customer_id)
            
            ->where('is_editable', 1)
            ->update(['is_editable' => 0]);
        SaleReturn::where('customer_id', $customer_id)
            
            ->where('is_editable', 1)
            ->update(['is_editable' => 0]);
        PurchaseInvoice::where('customer_id', $customer_id)
            
            ->where('is_editable', 1)
            ->update(['is_editable' => 0]);
        ReturnInvoice::where('customer_id', $customer_id)
          
            ->where('is_editable', 1)
            ->update(['is_editable' => 0]);
        ProductReplacementInvoice::where('customer_id', $customer_id)
          
            ->where('is_editable', 1)
            ->update(['is_editable' => 0]);

        return true;
    }
}
if (!function_exists('isClose')) {
    function isClose()
    {
        $closing_date   =   date('Y-m-d');
        $is_close       =   AdminSaleClose::selectRaw("is_closed")->whereRaw("closing_date = '$closing_date'")->value('is_closed');
        return $is_close;
    }
}
if (!function_exists('closeRoute')) {
    function closeRoute()
    {
        $close_routes   =   [ //index is class name and value is route
            'add-new-purchase'              =>  'stock-add',
            'add-purchase-return'           =>  'add-return',
            'add-new-sale'                  =>  'sale-add',
            'add-sale-return'               =>  'sale-return',
            'add-replacement'               =>  'sale-replacement-create',
            'customer-ledger-jama-banam'    =>  'NA',
            'vendor-ledger-jama-banam'      =>  'NA',
        ];
        return $close_routes;
    }
}
if (!function_exists('deleteProduct')) {
    function deleteProduct($request)
    {
        $vs  = VendorStock::where('product_replacement_invoice_id', $request->product_replacement_invoice_id)
            ->where('product_id', $request->product_id);
        $request->prod_type == 1 ?  $vs->where('status', 1) : $vs->where('status', 2);
        $vs = $vs->orderBy('id', 'DESC')->first();
        $in_out_status =  $request->prod_type == 1 ? 2 : 1;

        if ($vs) {
            $v_stock = updateStock($vs, $vs->balance, $request->qty, $in_out_status, 'replacement', 5, $request->prod_type);
            StockManagment($v_stock->id, $vs, $request->qty, $in_out_status, 'replacement');

            if ($v_stock) {
                Product::where('id', $v_stock->product_id)->update([
                    'stock_balance' =>  $v_stock->balance,
                ]);
                ProductReplacement::where('product_replacement_invoice_id', $request->product_replacement_invoice_id)
                    ->where('product_id', $request->product_id)->delete();
                return response()->json([
                    'msg'       => 'product removed',
                    'status'    => 'success',
                    'updated_stock' => $v_stock->balance
                ]);
            } else {
                return response()->json([
                    'msg'       => 'Not Updated at this moment',
                    'status'    => 'failed',
                ]);
            }
        }
    }
}
if (!function_exists('getCustomerBalance')) {
    function getCustomerBalance($request, $id)
    {
        if ($request->segment == 'product-replacement-edit') {
            $customer_count     =  CustomerLedger::where('customer_id', $id)->count();
            if ($customer_count > 1) {
                $customer_balance = CustomerLedger::where('customer_id', $id)
                    // ->whereDate('created_at', '!=', Carbon::today()->toDateString())
                    ->orderBy('id', 'DESC')->skip(1)->value('balance');
            } else {
                $customer_balance = 0;
            }
        } else {
            $customer_balance = Customer::where('id', $id)->value('balance');
        }

        return response()->json([
            'msg'               =>  'Vendor fetched',
            'status'            =>  'success',
            'customer_balance'  => $customer_balance
        ]);
    }
}

function updateStock($sale, $balance, $qty_value, $In_out_status, $invoice_type, $transaction_type, $prod_type = null)
{
    $sale_price             = $sale->sale_unit_price ?? $sale->sale_price;
    $total_return_amount    =  $sale->total_sale_amount ?? $sale->return_total_amount;
    $product_unit_price     =  $sale->product_unit_price ?? $sale->purchase_price;

    $v                       =  new VendorStock();
    $v->vendor_id            =  $sale->vendor_id;
    // if ($transaction_type !== 1 || $transaction_type !== 3) {
    $v->customer_id          =  $sale->customer_id;
    // }
    $v->transaction_type     =  $transaction_type;
    $v->qty                  =  $qty_value;
    $v->status               =  $In_out_status;
    $v->balance              =  $In_out_status  == 2 ? $balance - $qty_value : $balance +  $qty_value;
    $v->actual_qty           =  $sale->qty;
    $v->invoice_no           =  $sale->invoice_no;
    $v->company_id           =  $sale->company_id;
    $v->product_id           =  $sale->product_id;
    $v->date                 =  $sale->created_at;
    $v->created_by           =  Auth::id();
    if ($transaction_type == 1) { //Purchase 
        $v->actual_status                   =  1; //IN
        $v->purchase_invoice_id             =  $sale->purchase_invoice_id;
        $v->product_unit_price              =  $sale->purchase_price;
        $v->total_purchase_amount           =  $sale->purchased_total_amount;
    } else if ($transaction_type == 2) {  //Sale
        $v->actual_status                   =  2; //OUT
        $v->sale_invoice_id                 =  $sale->sale_invoice_id;
        $v->sale_unit_price                 =  $sale_price;
        $v->total_sale_amount               =  $sale->sale_total_amount;
        $v->product_unit_price              =  $sale->purchase_price;
    } else if ($transaction_type == 3) {  //Purchase Return
        $v->actual_status                   =  2; //OUT
        $v->purchase_return_invoice_id      =  $sale->purchase_return_invoice_id;
        $v->product_unit_price              =  $sale->purchase_price;
        $v->total_purchase_amount           =  $sale->product_return_total_amount;
    } else if ($transaction_type == 4) {  //Sale Return
        $v->actual_status                   =  1; //IN
        $v->sale_return_id                  =  $sale->sale_return_invoice_id;
        $v->sale_unit_price                 =  $sale_price;
        $v->total_sale_amount               =  $total_return_amount;
        $v->product_unit_price              =  $product_unit_price;
    } else if ($transaction_type == 6) {  //Replacement
        $v->actual_status                   =   ($prod_type == 1) ? 1 : 2;
        $unit_prefix                        =   ($prod_type == 1) ? 'product' : 'sale';
        $total_prefix                       =   ($prod_type == 1) ? 'total_purchase' : 'total_sale';
        $v->{$unit_prefix . '_unit_price'}  =   $sale_price;
        $v->{$total_prefix . '_amount'}     =   $sale->sale_total_amount;
        $v->product_replacement_invoice_id  =   $sale->product_replacement_invoice_id;
    } else if ($transaction_type == 5) {  //Product Delete
        deleteProductFields($v, $sale, $invoice_type, $prod_type);
    }
    $v->save();
    return $v;
}
/**
 * Maintain expiry-aware batch layers + refresh avg cost on vendor_stock_managment.
 * Does NOT change vendor_stocks / products.stock_balance / invoice totals —
 * callers keep using updateStock() + StockManagment() for parent qty.
 *
 * transaction_type: 1 purchase, 2 sale, 3 purchase_return, 4 sale_return,
 *                   5 product_delete, 6 replacement
 * In_out_status: 1 = IN, 2 = OUT
 */
function BatchWiseStockManagment($vendor_stock_id, $invoice_id, $purchase, $stock_qty, $In_out_status, $transaction_type, $existing_inv_id = null)
{
    $remainingQty = (float) $stock_qty;
    if ($remainingQty <= 0) {
        return;
    }

    $expiryDate = batch_normalize_expiry($purchase->expiry_date ?? null);
    $companyId = (int) ($purchase->company_id ?? 0);
    $productId = (int) ($purchase->product_id ?? 0);
    $txType = (int) $transaction_type;
    $isIn = ((int) $In_out_status === 1);
    $unitCostIn = round((float) ($purchase->purchase_price ?? 0), 6);
    $trxEnum = batch_trx_enum($txType);

    // OUT → FEFO. IN → exact expiry + unit-cost layer (never overwrite different rates).
    $strategy = $isIn ? 'exact' : 'fifo';

    $guard = 0;
    while ($remainingQty > 0.000001 && $guard < 100) {
        $guard++;

        $query = BatchStockMgt::where('product_id', $productId)
            ->where('company_id', $companyId);

        if ($strategy === 'fifo') {
            $query->where('batch_wise_balance', '>=', 1)
                ->orderByRaw("CASE WHEN expiry_date IS NULL OR expiry_date = '0000-00-00' THEN 1 ELSE 0 END ASC")
                ->orderBy('expiry_date', 'ASC')
                ->orderBy('id', 'ASC');
        } else {
            // exact: same expiry + same unit cost (do not overwrite different rates on same expiry)
            $query->where(function ($q) use ($expiryDate) {
                if ($expiryDate === '0000-00-00') {
                    $q->where(function ($q2) {
                        $q2->whereNull('expiry_date')->orWhere('expiry_date', '0000-00-00');
                    });
                } else {
                    $q->whereDate('expiry_date', $expiryDate);
                }
            })
                ->whereRaw('ABS(IFNULL(unit_cost_price,0) - ?) < 0.0001', [$unitCostIn])
                ->orderBy('id', 'DESC');
        }

        $s = $query->first();
        if (!$s) {
            if (!$isIn) {
                Log::warning('batch.out_without_available_batch', [
                    'product_id' => $productId,
                    'company_id' => $companyId,
                    'requested_qty' => $remainingQty,
                    'transaction_type' => $txType,
                ]);
                break;
            }
            // IN with no matching layer → create new expiry+cost bucket
            $s = new BatchStockMgt();
            $s->batch_id = 'B-'.$productId.'-'.uniqid();
            $s->company_name = batch_ascii(DB::table('companies')->where('id', $companyId)->value('company_name'));
            $s->product_name = batch_ascii(DB::table('products')->where('id', $productId)->value('product_name'));
            $s->mfg_date = '0000-00-00';
            $s->expiry_date = $expiryDate;
            $s->batch_wise_balance = 0;
            $s->unit_cost_price = $unitCostIn;
            $s->ttl_cost_price = 0;
            $s->created_by = (int) (Auth::id() ?? 0);
        }

        $existingBalance = (float) ($s->batch_wise_balance ?? 0);
        $appliedQty = $remainingQty;
        if (!$isIn) {
            if ($existingBalance <= 0.000001) {
                continue;
            }
            $appliedQty = min($remainingQty, $existingBalance);
        }

        $newBalance = $isIn
            ? round($existingBalance + $appliedQty, 6)
            : round($existingBalance - $appliedQty, 6);

        // Never overwrite an existing layer's unit cost on OUT / different-rate merge.
        $unitCost = (float) ($s->unit_cost_price ?? 0);
        if ($isIn && $unitCost <= 0) {
            $unitCost = $unitCostIn;
        }
        if ($isIn && !$s->exists) {
            $unitCost = $unitCostIn;
        }

        $s->company_id = $companyId;
        $s->product_id = $productId;
        $s->actual_qty = (float) ($purchase->qty ?? $appliedQty);
        $s->actual_status = (int) $In_out_status;
        $s->qty = (int) max(1, (int) round($appliedQty));
        $s->batch_wise_balance = $newBalance;
        $s->total_balance = 0;
        $s->vs_id = $vendor_stock_id;
        $s->trx_type = $trxEnum;
        $s->unit_cost_price = $unitCost;
        $s->ttl_cost_price = round($unitCost * max(0, $newBalance), 6);
        $s->avg_cost_price_per_unit = $newBalance > 0 ? $unitCost : 0;
        if ($isIn) {
            // Keep purchase identity on IN only (OUT must not erase purchase link)
            $s->invoice_id = $invoice_id;
            $s->invoice_product_id = $purchase->id ?? null;
            if (empty($s->expiry_date) || $s->expiry_date === '0000-00-00') {
                $s->expiry_date = $expiryDate;
            }
        }
        $s->save();

        // Only keep batches with qty >= 1. Scrap dust leftovers (< 1) so avg never uses them.
        $dustScrapped = 0.0;
        if ($newBalance > 0.000001 && $newBalance < 1) {
            $dustScrapped = $newBalance;
            try {
                $s->delete();
            } catch (\Throwable $e) {
                $s->batch_wise_balance = 0;
                $s->ttl_cost_price = 0;
                $s->save();
            }
            batch_scrap_dust_qty($productId, $companyId, $dustScrapped);
            $newBalance = 0;
        } elseif (!$isIn && $newBalance <= 0.000001) {
            // Drop empty noise rows after full OUT
            try {
                $s->delete();
            } catch (\Throwable $e) {
                // keep zero row if delete fails
            }
        }

        $remainingQty = round($remainingQty - $appliedQty, 6);
    }

    // Avg cost only — never touch vendor_stock_managment.balance (except dust scrap above)
    refreshVendorStockAvgCost($productId, $companyId);
}

if (!function_exists('batch_normalize_expiry')) {
    function batch_normalize_expiry($expiry): string
    {
        if ($expiry === null || $expiry === '' || $expiry === '0000-00-00' || $expiry === '0000-00-00 00:00:00') {
            return '0000-00-00';
        }

        return substr((string) $expiry, 0, 10);
    }
}

if (!function_exists('batch_trx_enum')) {
    function batch_trx_enum(int $txType): string
    {
        $map = [
            1 => 'purchase',
            2 => 'sale',
            3 => 'purchase_return',
            4 => 'sale_return',
            5 => 'product_delete',
            6 => 'replacement',
        ];

        return $map[$txType] ?? 'purchase';
    }
}

if (!function_exists('batch_ascii')) {
    function batch_ascii($value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        return preg_replace('/[^\x20-\x7E]/', '?', (string) $value);
    }
}

/**
 * Recalc ttl_avg_cost / ttl_cost from open batches with qty >= 1 only.
 * Fractional leftovers are ignored (and should be scrubbed).
 */
if (!function_exists('refreshVendorStockAvgCost')) {
    function refreshVendorStockAvgCost(int $productId, int $companyId): void
    {
        $agg = BatchStockMgt::where('product_id', $productId)
            ->where('company_id', $companyId)
            ->where('batch_wise_balance', '>=', 1)
            ->selectRaw('SUM(batch_wise_balance) AS qty, SUM(IFNULL(unit_cost_price,0) * batch_wise_balance) AS cost')
            ->first();

        $stock = StockManagment::where('product_id', $productId)
            ->where('company_id', $companyId)
            ->orderBy('id', 'DESC')
            ->first();
        if (!$stock) {
            return;
        }

        $qty = (float) ($agg->qty ?? 0);
        if ($qty >= 1) {
            $avg = round(((float) $agg->cost) / $qty, 6);
            $stock->ttl_avg_cost = $avg;
            $stock->ttl_cost = round($avg * (float) $stock->balance, 6);
        } else {
            $stock->ttl_avg_cost = 0;
            $stock->ttl_cost = 0;
        }
        $stock->save();
    }
}

/**
 * Write off sub-1 batch dust from product + latest VSM balance (keeps stock in sync).
 */
if (!function_exists('batch_scrap_dust_qty')) {
    function batch_scrap_dust_qty(int $productId, int $companyId, float $dustQty): void
    {
        $dustQty = round($dustQty, 6);
        if ($dustQty <= 0.000001) {
            return;
        }

        DB::update(
            'UPDATE products SET stock_balance = GREATEST(0, ROUND(IFNULL(stock_balance,0) - ?, 6)) WHERE id = ?',
            [$dustQty, $productId]
        );

        $vs = StockManagment::where('product_id', $productId)
            ->where('company_id', $companyId)
            ->orderBy('id', 'DESC')
            ->first();
        if ($vs) {
            $vs->balance = max(0, round(((float) $vs->balance) - $dustQty, 6));
            $vs->save();
        }

        Log::info('batch.scrap_fractional_dust', [
            'product_id' => $productId,
            'company_id' => $companyId,
            'dust_qty' => $dustQty,
        ]);
    }
}


function deleteProductFields($v, $sale, $type, $prod_type = null)
{
    $v->actual_qty           =  $sale->actual_qty;

    if ($type == 'purchase') {
        $v->actual_status         =  2; //OUT
        $v->purchase_invoice_id   =  $sale->purchase_invoice_id;
        $v->product_unit_price    =  $sale->product_unit_price;
        $v->total_purchase_amount =  $sale->total_purchase_amount;
    } else if ($type == 'sale') {
        $v->actual_status         =  1; //IN
        $v->sale_invoice_id       =  $sale->sale_invoice_id;
        $v->sale_unit_price       =  $sale->sale_unit_price;
        $v->total_sale_amount     =  $sale->total_sale_amount;
    } else if ($type == 'purchase-return') {
        $v->actual_status         =  1; //IN
        $v->purchase_return_invoice_id  =  $sale->purchase_return_invoice_id;
        $v->product_unit_price    =  $sale->product_unit_price;
        $v->total_purchase_amount =  $sale->total_purchase_amount;
    } else if ($type == 'sale-return') {  //Sale Return
        $v->actual_status         =  2; //OUT
        $v->sale_return_id        =  $sale->sale_return_id;
        $v->sale_unit_price       =  $sale->sale_unit_price;
        $v->total_sale_amount     =  $sale->total_sale_amount;
    } else if ($type == 'replacement') {  //Sale Replacement
        $v->actual_status   = ($prod_type == 1) ? 2 : 1;   // 2 = OUT , 1 - IN
        $unit_prefix        = ($prod_type == 1) ? 'product' : 'sale';
        $total_prefix       = ($prod_type == 1) ? 'total_purchase' : 'total_sale';
        $v->{$unit_prefix . '_unit_price'}  = $sale->sale_unit_price;
        $v->{$total_prefix . '_amount'}     = $sale->total_sale_amount;
        $v->product_replacement_invoice_id  =  $sale->product_replacement_invoice_id;
    }
}
function StockManagment($vendor_stock_id, $purchase, $stock_qty, $In_out_status)
{
 
    // $prod   = DB::select("SELECT 
    //                         IFNULL(SUM(batch_wise_balance), 0) AS ttl_balance,
    //                         IFNULL(SUM(ttl_cost_price), 0) AS ttl_cost
    //                     FROM stock_batches_items 
    //                     WHERE product_id = $purchase->product_id")[0];   
    $stock = StockManagment::where('product_id', $purchase->product_id)
                            ->where('company_id', $purchase->company_id)
                            ->orderBy('id', 'DESC')->first();
    if (!$stock) {
        $stock                  = new StockManagment();  
        $stock->company_name    = DB::table('companies')->where('id', $purchase->company_id)->value('company_name');
        $stock->product_name    = DB::table('products')->where('id', $purchase->product_id)->value('product_name');
    }
    $stock->company_id      = $purchase->company_id;
    $stock->product_id      = $purchase->product_id;
    $stock->purchase_price  = $purchase->purchase_price;
    $balance                = $In_out_status == 2 ? $stock->balance - $stock_qty : $stock->balance +  $stock_qty;
    $stock->balance         = $balance;
    $stock->vs_id           = $vendor_stock_id;
    
    // $stock->ttl_avg_cost = $prod->ttl_cost > 0 ? $prod->ttl_cost / $prod->ttl_balance : 0;
    $stock->save();  
    return $stock;
}
function BatchWiseDeleteProduct($delete_for, $product, $qty, $in_out, $type)
{
    if (empty($product)) {
        return;
    }

    // Reuse central batch manager so delete flow follows same FIFO/reverse-FIFO rules.
    BatchWiseStockManagment(
        0,
        0,
        $product,
        $qty,
        $in_out,
        5, // delete rollback transaction marker
        null
    );
}

function customerLedger($request,$column){
    $balance                     =  CustomerLedger::where('customer_id', $request->customer_id)->orderBy('id', 'DESC')->value('balance');
    
    $c                           =  CustomerLedger::where($column, $request->id)->orderBy('id', 'DESC')->first();
    $bbalance                    =  $column == 'sale_return_invoice_id' ?  abs(((-$balance) + $c->dr) - $c->cr) :  ($balance + $c->cr) - $c->dr;
    $cust_ldr                    =  new  CustomerLedger();
    $cust_ldr->cr                =  0;
    $cust_ldr->date              =  $c->invoice_date;
    $cust_ldr->customer_id       =  $c->customer_id;
    $cust_ldr->trx_type          =  4; //Delete Invoice   
    $cust_ldr->is_deleted        =  1; //Delete Invoice    
    $cust_ldr->comment           =  'Sale Invoice Deleted '; 
    $cust_ldr->cr                =  $c->dr;
    $cust_ldr->balance           =  $bbalance; 
    $cust_ldr->created_by        =  Auth::id(); 
    $cust_ldr->save();
    $c->is_deleted               =  1; //Delete Invoice    
    $c->save();

    Customer::where('id', $request->customer_id)->update([
        'balance' => $cust_ldr->balance,
    ]); 
}

function vendorLedger($request,$column){
    $balance                     =      VendorLedger::where('customer_id', $request->customer_id)->orderBy('id', 'DESC')->value('balance');
    $c                           =      VendorLedger::where($column, $request->id)->orderBy('id', 'DESC')->first();
    $cust_ldr                    =      new  VendorLedger();
    if($column == 'purchase_return_invoice_id'){
        $comment                 =      ($request->deleting_product == 1 ? 'Product' : 'Purchase Return Invoice') .' Deleted';
        $cust_ldr->cr            =      $c->dr;
        $cust_ldr->dr            =      0;
        $cust_ldr->purchase_return_invoice_id =  $c->purchase_return_invoice_id;
    }else{
        $comment                 =      ($request->deleting_product == 1 ? 'Product' : 'Purchase Invoice') .' Deleted';
        $cust_ldr->dr            =      $c->cr;
        $cust_ldr->cr            =      0;
        $cust_ldr->purchase_invoice_id   =  $c->purchase_invoice_id;
    }
    
    $cust_ldr->balance           = ($balance + $c->dr) - $c->cr;  
    $cust_ldr->date              =  $c->invoice_date;
    $cust_ldr->customer_id       =  $c->customer_id;
    $cust_ldr->trx_type          =  4; //Delete Invoice    
    $cust_ldr->is_deleted        =  1; //Delete Invoice    
    $cust_ldr->comment           =  $comment; 
    $cust_ldr->created_by        =  Auth::id(); 
    $cust_ldr->save();
    $c->is_deleted                =  1; //Delete Invoice    
    $c->save();
    Customer::where('id', $request->customer_id)->update([
        'balance' => $cust_ldr->balance,
    ]);
}

function SaleReportRecords($request = null, $current_date, $is_admin_close = null)
   {

      $query = " 1=1";
      $purchase_return_paid_amount = 0;
      $purchase_inv_paid_amount    = 0;
      $query .= " AND ps.deleted_at IS NULL";
      $query .= tenant_and('ps');

      if (isset($request->company_id)) {
         $query .= " AND ps.company_id = $request->company_id";
      }
      if (isset($request->product_id)) {
         $query .= " AND ps.product_id = $request->product_id";
      }
      if (isset($request->customer_id)) {
         $query .= " AND si.customer_id = $request->customer_id";
      }
      if (isset($request->start_date) != '' && isset($request->end_date) != '') {
         $query .= " AND DATE(ps.created_at) BETWEEN '$request->start_date' AND '$request->end_date'";
      } else {
         $query .=  " AND  DATE(ps.created_at) = '$current_date'";
      }
      if (isset($request->bill_no)) {
         $query       .=  " AND SUBSTRING_INDEX(si.invoice_no, '-', 1) = '$request->bill_no'";
      }
      if ($is_admin_close == 1) {
         $purchase_return_paid_amount =  DB::select("
                                                   SELECT
                                                   ps.paid_amount
                                                   FROM
                                                   purchase_return_invoices as ps
                                                   WHERE
                                                   $query
                                                   ORDER BY ps.invoice_no DESC
                                                   ");
         $purchase_inv_paid_amount =  DB::select("
                                                   SELECT
                                                   ps.paid_amount
                                                   FROM
                                                   purchase_invoices as ps
                                                   WHERE
                                                   $query
                                                   ORDER BY ps.invoice_no DESC
                                                   ");
      }
      
      $sales          =  DB::select("
                              SELECT
                                 DATE_FORMAT(ps.created_at,'%d-%m-%Y %h:%i %p') as created,
                                 pr.product_name,
                                 co.company_name,
                                 si.invoice_no,
                                 si.customer_id,
                                 IFNULL((SELECT customer_name FROM customers WHERE id = si.customer_id),'NA') as customer_name,
                                 IFNULL(si.invoice_discount,0) AS invoice_discount,
                                 si.invoice_type AS invoice_type,
                                 IFNULL(ps.sale_total_amount+IFNULL(product_discount,0),0) AS sale_total_amount,
                                 IFNULL(si.total_invoice_amount,0) AS total_invoice_amount,
                                 IFNULL(si.service_charges,0) AS service_charges,
                                 IFNULL(ps.qty,0) AS qty,
                                 IFNULL(ps.product_discount,0) AS product_discount,
                                 ps.product_id,
                                 ps.company_id,
                                 pr.old_purchase_price,
                                 pr.sale_price,
                                 si.paid_amount,
                                 product_net_total
                              FROM
                              products_sales as ps
                              LEFT JOIN sale_invoices si ON si.id = ps.sale_invoice_id
                              LEFT JOIN products pr ON pr.id = ps.product_id
                              LEFT JOIN companies co ON co.id = ps.company_id
                              WHERE
                              $query
                              ORDER BY si.invoice_no DESC
                        ");
      $sale_invoice_records                         =  new stdClass();
      $sale_invoice_records->total_invoice_amount   =  sum_per_invoice($sales, 'total_invoice_amount');
      $sale_invoice_records->invoice_discount       =  sum_per_invoice($sales, 'invoice_discount');
      $sale_invoice_records->service_charges       =  sum_per_invoice($sales, 'service_charges');  
      
      $returns        =  DB::select("
                              SELECT
                                 DATE_FORMAT(ps.created_at,'%d-%m-%Y %h:%i %p') as created,
                                 pr.product_name,
                                 co.company_name,
                                 si.invoice_no,
                                 si.customer_id,
                                 IFNULL((SELECT customer_name FROM customers WHERE id = si.customer_id),'NA') as customer_name,
                                 IFNULL(si.invoice_discount,0) AS invoice_discount,
                                 si.invoice_type AS invoice_type,
                                 IFNULL(ps.return_total_amount+IFNULL(product_discount,0),0) AS return_total_amount,
                                 IFNULL(si.total_invoice_amount,0) AS total_invoice_amount,
                                 IFNULL(si.service_charges,0) AS service_charges,
                                 IFNULL(ps.qty,0) AS qty,
                                 IFNULL(ps.product_discount,0) AS product_discount,
                                 ps.product_id,
                                 ps.company_id,
                                 pr.old_purchase_price,
                                 pr.sale_price,
                                 si.paid_amount,
                                 product_net_total

                              FROM
                              sale_return_products as ps
                              LEFT JOIN sale_return_invoices si ON si.id = ps.sale_return_invoice_id
                              LEFT JOIN products pr ON pr.id = ps.product_id
                              LEFT JOIN companies co ON co.id = ps.company_id
                              WHERE
                              $query
                              ORDER BY si.invoice_no DESC
                  ");
      $replacement    =  DB::select("
                                    SELECT
                                       DATE_FORMAT(ps.created_at,'%d-%m-%Y %h:%i %p') as created,
                                       pr.product_name,
                                       co.company_name,
                                       si.invoice_no,
                                       si.customer_id,
                                       IFNULL((SELECT customer_name FROM customers WHERE id = si.customer_id),'NA') as customer_name,
                                       IFNULL(si.invoice_discount,0) AS invoice_discount,
                                       si.invoice_type AS invoice_type,
                                       IFNULL(ps.sale_total_amount+IFNULL(product_discount,0),0) AS sale_total_amount,
                                       IFNULL(si.total_invoice_amount,0) AS total_invoice_amount,
                                       IFNULL(si.service_charges,0) AS service_charges,
                                       IFNULL(ps.qty,0) AS qty,
                                       IFNULL(ps.product_discount,0) AS product_discount,
                                       ps.product_id,
                                       ps.company_id,
                                       ps.product_type
                                    FROM
                                    product_replacements as ps
                                    LEFT JOIN product_replacment_invoices si ON si.id = ps.product_replacement_invoice_id
                                    LEFT JOIN products pr ON pr.id = ps.product_id
                                    LEFT JOIN companies co ON co.id = ps.company_id
                                    WHERE
                                    $query
                                    ORDER BY si.invoice_no DESC
                        ");

      foreach ($replacement as $rep) {
         if ($rep->product_type == 1) { //Return
            $returns[] = (object)[
               'created' => $rep->created,
               'product_name' => $rep->product_name,
               'company_name' => $rep->company_name,
               'invoice_no' => $rep->invoice_no,
               'customer_id' => $rep->customer_id,
               'customer_name' => $rep->customer_name,
               'invoice_discount' => $rep->invoice_discount,
               'invoice_type' => $rep->invoice_type,
               'product_net_total' => $rep->sale_total_amount,
               'return_total_amount' => $rep->sale_total_amount,
               'total_invoice_amount' => $rep->sale_total_amount,
               'service_charges' => $rep->service_charges,
               'qty' => $rep->qty,
               'product_discount' => $rep->product_discount,
               'product_id' => $rep->product_id,
               'company_id' => $rep->company_id,
               'product_type' => 2,
            ];
         } else { //Sale

            $sales[]  = (object)[
               'created' => $rep->created,
               'product_name' => $rep->product_name,
               'company_name' => $rep->company_name,
               'invoice_no' => $rep->invoice_no,
               'customer_id' => $rep->customer_id,
               'customer_name' => $rep->customer_name,
               'invoice_discount' => $rep->invoice_discount,
               'invoice_type' => $rep->invoice_type,
               'product_net_total' => $rep->sale_total_amount,
               'sale_total_amount' => $rep->sale_total_amount,
               'total_invoice_amount' => $rep->sale_total_amount,
               'service_charges' => $rep->service_charges,
               'qty' => $rep->qty,
               'product_discount' => $rep->product_discount,
               'product_id' => $rep->product_id,
               'company_id' => $rep->company_id,
               'product_type' => 2,
            ];
         }
      }
      return ['sales' => $sales, 'sale_returns' => $returns, 'pr_paid_amount' => $purchase_return_paid_amount, 'pr_invc_amount' => $purchase_inv_paid_amount,'sale_invoice_record' => $sale_invoice_records];
   }

if (!function_exists('purchi_config')) {
    /**
     * Merged purchi layout config: organization.purchi_config JSON overrides config/admin_close_purchi.php
     */
    function purchi_config(): array
    {
        $defaults = config('admin_close_purchi', []);
        try {
            $org = \App\Models\Organization::first();
            if (!$org || empty($org->purchi_config)) {
                return $defaults;
            }
            $stored = $org->purchi_config;
            if (is_string($stored)) {
                $stored = json_decode($stored, true);
            }
            if (!is_array($stored)) {
                return $defaults;
            }

            return array_replace_recursive($defaults, $stored);
        } catch (\Throwable $e) {
            return $defaults;
        }
    }
}

if (!function_exists('purchi_use_dynamic')) {
    /** Revert: UPDATE organization SET purchi_use_dynamic = 0 */
    function purchi_use_dynamic(): bool
    {
        try {
            $org = \App\Models\Organization::first();

            return $org && (int) ($org->purchi_use_dynamic ?? 0) === 1;
        } catch (\Throwable $e) {
            return false;
        }
    }
}