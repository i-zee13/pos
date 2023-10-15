<?php

use App\Models\AdminSaleClose;
use App\Models\City;
use App\Models\Country;
use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\PostalCode;
use App\Models\Product;
use App\Models\ProductPurchase;
use App\Models\ProductReplacement;
use App\Models\ProductReplacementInvoice;
use App\Models\PurchaseInvoice;
use App\Models\PurchaseReturn;
use App\Models\State;
use App\Models\Sale as SaleInvoice;
use App\Models\SaleReplacement;
use App\Models\SaleReturn;
use App\Models\Stock;
use App\Models\Student;
use App\Models\VendorLedger;
use App\Models\VendorStock;
use Carbon\Carbon;
use Firebase\JWT\JWT;
use JetBrains\PhpStorm\Pure;
use Stevebauman\Location\Facades\Location;

if(!function_exists('isStudentActive'))
{
        function isStudentActive($email) : bool
    {
        $doctor = Student::whereEmail($email)->IsActive()->exists();

        if($doctor)
        {
            return true;
        }
        return false;
    }
}
if(!function_exists('timeZoneList'))
{
    function timeZoneList()
    {
        $zones_array = array();
        $timestamp = time();
        $dummy_datetime_object = new DateTime();
        foreach(timezone_identifiers_list() as $key => $zone) {
            date_default_timezone_set($zone);
            $zones_array[$key]['zone'] = $zone;
            $zones_array[$key]['diff_from_GMT'] = 'UTC/GMT ' . date('P', $timestamp);
            $tz = new DateTimeZone($zone);
            $zones_array[$key]['offset'] = $tz->getOffset($dummy_datetime_object);
        }
        return $zones_array;
    }
}
if(!function_exists('GetCurrentLocation'))
{
    function GetCurrentLocation()
    {
        $ip =   isset($_SERVER["REMOTE_ADDR"]) && $_SERVER["REMOTE_ADDR"] != '127.0.0.1' ? $_SERVER["REMOTE_ADDR"] : '103.255.4.42';
        return Location::get($ip);
    }
}
if(!function_exists('GetCountryIdByName'))
{
    function GetCountryIdByName($country_name)
    {
        $country_id =   '';
        try {
            if($country_name != ''){
                $countries  =   Country::whereRaw("lower(name) = lower('{$country_name}')")->first();
                if ($countries) {
                    $country_id                     =    $countries->id;
                }
            }
        }catch (Exception $exception){
            //
        }
        return $country_id;
    }
}
if(!function_exists('GetStateIdByName'))
{
    function GetStateIdByName($state_name)
    {
        $state_id   =   '';
        try {
            if($state_name != ''){
                $states =   State::whereRaw("lower(name) = lower('{$state_name}')")->first();
                if ($states) {
                    $state_id   =    $states->id;
                }
            }
        }catch (Exception $exception){
            //
        }
        return $state_id;
    }
}
if(!function_exists('GetCityIdByName'))
{
    function GetCityIdByName($city_name)
    {
        $city_id   =   '';
        try {
            if($city_name != ''){
                $cities =   City::whereRaw("lower(name) = lower('{$city_name}')")->first();
                if ($cities) {
                    $city_id    =    $cities->id;
                }
            }
        }catch (Exception $exception){
            //
        }
        return $city_id;
    }
}
if(!function_exists('GetPostalCodeIdByName'))
{
    function GetPostalCodeIdByName($postal_code)
    {
        $postal_code_id   =   '';
        try {
            if($postal_code != ''){
                $postal_codes   =   PostalCode::whereRaw("lower(postal_code) = lower('{$postal_code}')")->first();
                if ($postal_codes) {
                    $postal_code_id =    $postal_codes->id;
                }
            }
        }catch (Exception $exception){
            //
        }
        return $postal_code_id;
    }
}

if(!function_exists('getZoomAccessToken'))
{
    function getZoomAccessToken()
    {
        $key = 'UYACpXEnBSrhiuKroMcBRuqkkiwTviHNovOf';
        $payload = array(
            "iss" => '2mO7bNcvRxyXMMWm01infA',
            'exp' => time() + 3600,
        );
        return JWT::encode($payload, $key);
    }
}

if(!function_exists('getInvoice'))
{
    function getInvoice()
{
    $year        = date('y');
    $invoice_no  = 1;
    // $lastinvoice = SaleInvoice::latest()->first();
    $lastinvoice         = SaleInvoice::where('date',Carbon::today())->count();
    // if ($lastinvoice) {
    //     // $lastinvoiceDate = $lastinvoice->created_at->format('Y-m-d'); 
    //     // if ($lastinvoiceDate === $today) {
    //     //     // Invoice was created today, extract the invoice number
    //     //     $invoice_no = intval(explode('-', $lastinvoice->invoice_no)[0]);
    //     // }
    // }
    
    // Increment the invoice number and append the year
    $invoice_no = ($lastinvoice ? $lastinvoice+1 : $invoice_no) . '-' . Carbon::today()->format('j-n-y');
    return $invoice_no;
}

}

if(!function_exists('getPurchaseInvoice'))
{
    function getPurchaseInvoice()
    {
        $year        = date('y');
        $invoice_no  = 1;
        $lastinvoice = PurchaseInvoice::where('date',Carbon::today())->count();
        $invoice_no  = ($lastinvoice ? $lastinvoice+1 : $invoice_no) . '-' . Carbon::today()->format('j-n-y');
       
            return $invoice_no;
 
    }
}
if(!function_exists('getProductReplacementNo'))
{
    function getProductReplacementNo()
    { 
        $invoice_no    = 1;
        $lastinvoice   = ProductReplacementInvoice::where('date',Carbon::today())->count();
       
        $invoice_no    = ($lastinvoice ? $lastinvoice+1 : $invoice_no) . '-' . Carbon::today()->format('j-n-y');
      
        return $invoice_no; 
    }
}
if(!function_exists('getSaleReturnNo'))
{
    function getSaleReturnNo()
    { 
        $invoice_no    = 1;
        $lastinvoice   = SaleReturn::where('date',Carbon::today())->count();
       
        $invoice_no    = ($lastinvoice ? $lastinvoice+1 : $invoice_no) . '-' . Carbon::today()->format('j-n-y');
      
        return $invoice_no; 
    }
}
if(!function_exists('getPurchaseReturnNo'))
{
    function getPurchaseReturnNo()
    { 
        $invoice_no    = 1;
        $lastinvoice   = PurchaseReturn::where('date',Carbon::today())->count(); 
        $invoice_no    = ($lastinvoice ? $lastinvoice + 1 : $invoice_no) . '-' . Carbon::today()->format('j-n-y');
        return $invoice_no; 
    }
}
if(!function_exists('getCrvNo'))
{
    function getCrvNo()
    { 
        $invoice_no    = 1;
        $lastinvoice   = CustomerLedger::where('date',Carbon::today())->where('trx_type',3)->where('cr','>',0)->count();
       
        $invoice_no    = 'Crv -'. ($lastinvoice ? $lastinvoice+1 : $invoice_no) . '-' . Carbon::today()->format('j-n-y');
    
        return $invoice_no; 
    }
}
if(!function_exists('getCpvNo'))
{
    function getCpvNo()
    { 
        $invoice_no    = 1;
        $lastinvoice   = CustomerLedger::where('date',Carbon::today())->where('trx_type',3)->where('dr','>',0)->count();
       
        $invoice_no    = 'Cpv -'. ($lastinvoice ? $lastinvoice+1 : $invoice_no) . '-' . Carbon::today()->format('j-n-y');
      
        return $invoice_no; 
    }
}
if(!function_exists('getVendorCrvNo'))
{
    function getVendorCrvNo()
    { 
        $invoice_no    = 1;
        $lastinvoice   = VendorLedger::where('date',Carbon::today())->where('trx_type',3)->where('cr','>',0)->count();
        $invoice_no    = 'Crv-'.  ($lastinvoice ? $lastinvoice+1 : $invoice_no) . '-' . Carbon::today()->format('j-n-y');
       
        return $invoice_no; 
    }
}
if(!function_exists('getVendorCpvNo'))
{
    function getVendorCpvNo()
    { 
        $invoice_no    = 1;
        $lastinvoice   = VendorLedger::where('date',Carbon::today())->where('trx_type',3)->where('dr','>',0)->count();
        $invoice_no    = 'Cpv -'. ($lastinvoice ? $lastinvoice+1 : $invoice_no) . '-' . Carbon::today()->format('j-n-y');
      
        return $invoice_no; 
    }
}
if(!function_exists('updateStock')){
    function updateStock($previous_qty, $sale, $balance, $vendor_id, $type)
    {
        $v                   =  new VendorStock();
        $v->vendor_id        =  $vendor_id ?  $vendor_id  : 0; 
        $v->transaction_type =  3;  //Purchase
        if($previous_qty > 0){
            $v->qty         =  $previous_qty;
            $v->status      =   2 ;   //Out
            $v->balance     =   $balance - $v->qty;
        }else{
            $v->status      =    1;   // IN
            $v->qty         =   $sale->qty;
            $v->balance     =   $balance +  $v->qty;
        } 
        $v->sale_return_id       =  $sale->sale_return_invoice_id;
        $v->product_unit_price   =  $sale->purchase_price;
        $v->company_id           =  $sale->company_id;
        $v->product_id           =  $sale->product_id;
        $v->date                 =  $sale->created_at;
        $v->amount               =  $sale->return_total_amount;
        $v->created_by           =  Auth::id();
        $v->save();
        return $v;
    }
}
if(!function_exists('isEditable'))
{
    function isEditable($customer_id)
    { 
        
        CustomerLedger::where('customer_id',$customer_id)
                        ->whereDate('created_at', Carbon::today()) 
                        ->where('is_editable', 1) 
                        ->update(['is_editable' => 0]);
        //Sales
        SaleInvoice::where('customer_id',$customer_id)
                    ->whereDate('created_at', Carbon::today()) 
                    ->where('is_editable', 1) 
                    ->update(['is_editable' => 0]);
        SaleReturn::where('customer_id',$customer_id)
                    ->whereDate('created_at', Carbon::today()) 
                    ->where('is_editable', 1) 
                    ->update(['is_editable' => 0]);
        PurchaseInvoice::where('customer_id',$customer_id)
                    ->whereDate('created_at', Carbon::today()) 
                    ->where('is_editable', 1) 
                    ->update(['is_editable' => 0]);
        PurchaseReturn::where('customer_id',$customer_id)
                    ->whereDate('created_at', Carbon::today()) 
                    ->where('is_editable', 1) 
                    ->update(['is_editable' => 0]);
        ProductReplacementInvoice::where('customer_id',$customer_id)
                    ->whereDate('created_at', Carbon::today()) 
                    ->where('is_editable', 1) 
                    ->update(['is_editable' => 0]);
        
            return true;
    }
}
if(!function_exists('isClose')){
    function isClose(){
        $closing_date   =   date('Y-m-d');   
        $is_close       =   AdminSaleClose::selectRaw("is_closed")->whereRaw("closing_date = '$closing_date'")->value('is_closed');
        return $is_close;
    }
}
if(!function_exists('closeRoute')){
    function closeRoute(){
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
if(!function_exists('deleteProduct')){
     function deleteProduct($request){
        
         $prod  = VendorStock::where('product_replacement_invoice_id',$request->product_replacement_invoice_id)
                      ->where('product_id',$request->product_id);
        $request->prod_type == 1 ?  $prod->where('status',1) : $prod->where('status',2);
        $prod = $prod->orderBy('id', 'DESC')->first(); 
          if($prod){
                  $out_stock              = new VendorStock();
                  $out_stock->vendor_id   = $prod->vendor_id;
                  $out_stock->product_id  = $prod->product_id;
                  $out_stock->date        = $prod->created_at;
                  $out_stock->amount      = $prod->amount;
                  $out_stock->qty         = $prod->qty;
                  $out_stock->status      = $request->prod_type == 1 ?  2 : 1; // 1- In , 2 - Out
                  $out_stock->balance     = $request->prod_type == 1 ? $prod->balance-$prod->qty : $prod->balance+$prod->qty; 
                  $out_stock->created_by  = Auth::id();
                  $out_stock->product_replacement_invoice_id  = $prod->product_replacement_invoice_id;
                  $out_stock->product_unit_price   = $prod->product_unit_price;
                  if($out_stock->save()){ 
                      Product::where('id',$out_stock->product_id)->update([
                          'stock_balance' =>  $out_stock->balance,
                      ]);
                     ProductReplacement::where('product_replacement_invoice_id',$request->product_replacement_invoice_id)
                                       ->where('product_id',$request->product_id)->delete();
                      return response()->json([
                          'msg'       => 'product removed',
                          'status'    => 'success',
                      ]);
                  }
              }else{
                  return response()->json([
                      'msg'       => 'not remove',
                      'status'    => 'failed',
                  ]);
              } 
  }
}
if(!function_exists('getCustomerBalance')){
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