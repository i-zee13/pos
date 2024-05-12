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
use App\Models\SaleReplacement;
use App\Models\SaleReturn;
use App\Models\Stock;
use App\Models\StockManagment;
use App\Models\VendorLedger;
use App\Models\VendorStock;
use Carbon\Carbon;
use Firebase\JWT\JWT;
use Stevebauman\Location\Facades\Location;


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
        $invoice_no  = ($lastinvoice ? $lastinvoice + 1 : $invoice_no) . '-' . Carbon::today()->format('j-n-y');

        return $invoice_no;
    }
}
if (!function_exists('getProductReplacementNo')) {
    function getProductReplacementNo()
    {
        $invoice_no    = 1;
        $lastinvoice   = ProductReplacementInvoice::where('date', Carbon::today())->count();

        $invoice_no    = ($lastinvoice ? $lastinvoice + 1 : $invoice_no) . '-' . Carbon::today()->format('j-n-y');

        return $invoice_no;
    }
}
if (!function_exists('getSaleReturnNo')) {
    function getSaleReturnNo()
    {
        $invoice_no    = 1;
        $lastinvoice   = SaleReturn::where('date', Carbon::today())->count();

        $invoice_no    = ($lastinvoice ? $lastinvoice + 1 : $invoice_no) . '-' . Carbon::today()->format('j-n-y');

        return $invoice_no;
    }
}
if (!function_exists('getPurchaseReturnNo')) {
    function getPurchaseReturnNo()
    {
        $invoice_no    = 1;
        $lastinvoice   = ReturnInvoice::where('date', Carbon::today())->count();
        $invoice_no    = ($lastinvoice ? $lastinvoice + 1 : $invoice_no) . '-' . Carbon::today()->format('j-n-y');
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
            ->whereDate('created_at', Carbon::today())
            ->where('is_editable', 1)
            ->update(['is_editable' => 0]);
        VendorLedger::where('customer_id', $customer_id)
            ->whereDate('created_at', Carbon::today())
            ->where('is_editable', 1)
            ->update(['is_editable' => 0]);
        //Sales
        SaleInvoice::where('customer_id', $customer_id)
            ->whereDate('created_at', Carbon::today())
            ->where('is_editable', 1)
            ->update(['is_editable' => 0]);
        SaleReturn::where('customer_id', $customer_id)
            ->whereDate('created_at', Carbon::today())
            ->where('is_editable', 1)
            ->update(['is_editable' => 0]);
        PurchaseInvoice::where('customer_id', $customer_id)
            ->whereDate('created_at', Carbon::today())
            ->where('is_editable', 1)
            ->update(['is_editable' => 0]);
        ReturnInvoice::where('customer_id', $customer_id)
            ->whereDate('created_at', Carbon::today())
            ->where('is_editable', 1)
            ->update(['is_editable' => 0]);
        ProductReplacementInvoice::where('customer_id', $customer_id)
            ->whereDate('created_at', Carbon::today())
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
        $v->actual_status         =  1; //IN
        $v->purchase_invoice_id   =  $sale->purchase_invoice_id;
        $v->product_unit_price    =  $sale->purchase_price;
        $v->total_purchase_amount =  $sale->purchased_total_amount;
    } else if ($transaction_type == 2) {  //Sale
        $v->actual_status         =  2; //OUT
        $v->sale_invoice_id       =  $sale->sale_invoice_id;
        $v->sale_unit_price       =  $sale->sale_price;
        $v->total_sale_amount     =  $sale->sale_total_amount;
    } else if ($transaction_type == 3) {  //Purchase Return
        $v->actual_status         =  2; //OUT
        $v->purchase_return_invoice_id  =  $sale->purchase_return_invoice_id;
        $v->product_unit_price    =  $sale->purchase_price;
        $v->total_purchase_amount =  $sale->product_return_total_amount;
    } else if ($transaction_type == 4) {  //Sale Return
        $v->actual_status         =  1; //IN
        $v->sale_return_id        =  $sale->sale_return_invoice_id;
        $v->sale_unit_price       =  $sale->sale_price;
        $v->total_sale_amount     =  $sale->return_total_amount;
    } else if ($transaction_type == 6) {  //Replacement
        $v->actual_status   = ($prod_type == 1) ? 1 : 2;
        $unit_prefix        = ($prod_type == 1) ? 'product' : 'sale';
        $total_prefix       = ($prod_type == 1) ? 'total_purchase' : 'total_sale';
        $v->{$unit_prefix . '_unit_price'}  = $sale->sale_price;
        $v->{$total_prefix . '_amount'}     = $sale->sale_total_amount;
        $v->product_replacement_invoice_id  =  $sale->product_replacement_invoice_id;
    } else if ($transaction_type == 5) {  //Product Delete
        deleteProductFields($v, $sale, $invoice_type, $prod_type);
    }
    $v->save();
    return $v;
}
function BatchWiseStockManagment($vendor_stock_id, $purchase, $stock_qty, $In_out_status)
{
    $s      =  BatchStockMgt::where('product_id', $purchase->product_id)->where('expiry_date', $purchase->expiry_date)->orderBy('id', 'DESC')->first();
    if (!$s) {
        $s  =  new BatchStockMgt();
    }
    $s->company_id          =   $purchase->company_id;
    $s->product_id          =   $purchase->product_id;
    $s->expiry_date         =   $purchase->expiry_date;
    $s->qty                 =   $purchase->qty;
    $s->actual_qty          =   $purchase->qty;
    $s->actual_status       =   $In_out_status;
    $s->unit_cost_price     =   $purchase->unit_cost_price;
    $s->ttl_cost_price      =   $purchase->ttl_cost_price;
    $balance                =   $In_out_status == 2 ? $s->balance - $stock_qty : $s->balance +  $stock_qty;
    $s->total_balance       =   $balance;
    $s->batch_wise_balance  =   $balance;
    $s->vs_id               =   $vendor_stock_id;
    $s->save();
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
        $v->total_purchase_amount =  $sale->product_return_total_amount;
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
    $stock = StockManagment::where('product_id', $purchase->product_id)
        ->where('company_id', $purchase->company_id)
        ->orderBy('id', 'DESC')->first();
    if (!$stock) {
        $stock = new StockManagment();
    }
    $stock->company_id  = $purchase->company_id;
    $stock->product_id  = $purchase->product_id;
    $balance            = $In_out_status == 2 ? $stock->balance - $stock_qty : $stock->balance +  $stock_qty;
    $stock->balance     = $balance;
    $stock->vs_id       = $vendor_stock_id;
    $stock->save();
}
