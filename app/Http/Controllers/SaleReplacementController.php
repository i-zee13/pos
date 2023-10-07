<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use App\Models\SaleReplacement;
use App\Models\SaleReturn;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Auth;

class SaleReplacementController extends Controller
{

    public function index()
    {
        $current_date   =   date('Y-m-d');
        $sales          =   SaleReturn::selectRaw('sale_return_invoices.* ,
                                        (SELECT cr FROM customer_ledger WHERE sale_invoice_id = sale_return_invoices.id) as paid_amount,
                                        (SELECT customer_name FROM customers WHERE id=sale_return_invoices.customer_id) as customer_name')
                                        ->whereRaw("Date(created_at) = '$current_date'")
                                        ->orderBy('id', 'DESC')
                                        ->get();

        return view('sales.replacement.index', compact('sales'));
    }

    public function create(){
        $invoice_no          =   getSaleReturnNo();
        $parts               =   explode('-', $invoice_no);
        $invoice_first_part  =   $parts[0];
        $current_date        =   Carbon::today()->toDateString();
        $customers           =   Customer::where('customer_type', 2)->select('id', 'customer_name', 'balance')->get();
        $products            =   Product::where('stock_balance','!=',0)->get();

        return view('sales.replacement.create',compact('customers','current_date','invoice_first_part','products'));
    }


}
