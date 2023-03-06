<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;


class SaleController extends Controller
{
   
    public function create()
    {   $invoice_no   =  'inv-'.Str::uuid()->toString();
        $current_date =   Carbon::today()->toDateString();
        $customers    =   Customer::where('customer_type',2)->select('id','customer_name', 'balance')->get();
        $products     =    Product::all();
        return view('sales.add',compact('customers','current_date','invoice_no','products'));
    }
    public function getVendors(){
        $customers      = Customer::where('customer_type',2)->get(); //1=vendor
        return response()->json([
            'msg'       => 'Vendor Fetched',
            'status'    => 'success',
            'customers' => $customers
        ]);
    }
}
