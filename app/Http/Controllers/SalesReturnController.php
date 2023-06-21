<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SalesReturnController extends Controller
{
    public function saleReturn(){
       
        $invoice_no          =   getSaleReturnNo();
        $parts               =   explode('-', $invoice_no);
        $invoice_first_part  =   $parts[0];
        $current_date        =   Carbon::today()->toDateString();
        $customers           =   Customer::where('customer_type', 2)->select('id', 'customer_name', 'balance')->get();
        $products            =   Product::get(); 
        return view('sales.return',compact('customers','current_date','invoice_no','products'));
    }
}
