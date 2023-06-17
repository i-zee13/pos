<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SalesReturnController extends Controller
{
    public function saleReturn(){
        $invoice_no   =   getSaleReturnNo();

        $current_date =   Carbon::today()->toDateString();
        $customers    =   Customer::where('customer_type', 1)
                            ->whereIn('id', function($query){
                                $query->select('customer_id')
                                    ->from('purchase_invoices')
                                    ->groupBy('customer_id');
                            })
                            ->get();
        $products     =   Product::all();
        return view('purchases.return',compact('customers','current_date','invoice_no','products'));
    }
}
