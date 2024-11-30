<?php

namespace App\Http\Controllers;

use App\Models\ProductReplacementInvoice;
use App\Models\PurchaseInvoice;
use App\Models\Sale;
use App\Models\SaleReturn;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use stdClass;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $current_time = Carbon::now();
        $message = '';
        $current_date = date('Y-m-d');
        if ($current_time->hour < 12) {
            $message = 'Good Morning';
        } elseif ($current_time->hour >= 12 && $current_time->hour < 18) {
            $message = 'Good Afternoon';
        } else {
            $message = 'Good Evening';
        }
        //get total sale from sale_invoice table 
        // $total_sale_amount      = Sale::whereDate('date', $current_date)->sum('product_net_total');
        // $total_sale_return      = SaleReturn::whereDate('date', $current_date)->sum('product_net_total');
        // $total_discount_amount  = Sale::whereDate('date', $current_date)->sum('invoice_discount');
        // $total_replacement_net  = ProductReplacementInvoice::whereDate('date', $current_date)
        //                                                     ->select(DB::raw('SUM(product_net_total - product_return_total) as total_discount_amount'))
        //                                                     ->value('total_discount_amount');
        // $total_sale             = ($total_sale_amount - $total_discount_amount)-$total_sale_return + $total_replacement_net;

        $total_purchase         = PurchaseInvoice::whereDate('date', $current_date)->sum('paid_amount');  
        $saleRecords            =  SaleReportRecords(null,$current_date,1); 

        
        $total_sales            =  collect($saleRecords['sales'])->SUM('sale_total_amount'); 
        $total_invoice_discount =  collect($saleRecords['sales'])->unique('invoice_no')->SUM('invoice_discount');
        $total_product_discount =  collect($saleRecords['sales'])->SUM('product_discount');
        $total_service_charges  =  collect($saleRecords['sales'])->unique('invoice_no')->SUM('service_charges');
        $ttl_sale_return        =  collect($saleRecords['sale_returns'])->SUM('total_invoice_amount'); //zee

        $total_sale                =  ($total_sales + $total_service_charges) - ($total_product_discount + $total_invoice_discount);

        $vendor_ldgr            =  DB::table("vendor_ledger")->selectRaw("customer_id as vendor_id,IFNULL(cr,0) as cr,IFNULL(dr,0) as dr,trx_type")->whereRaw("DATE(created_at) = '$current_date' AND trx_type = 3 AND is_deleted = 0")->get(); 
        $customer_ldgr          =  DB::table("customer_ledger")->selectRaw("customer_id, IFNULL(cr,0) as cr,IFNULL(dr,0) as dr,trx_type")->whereRaw("DATE(created_at) = '$current_date'")->get();
      
        $total_pr_paid_amount      =  collect($saleRecords['pr_paid_amount'])->SUM('paid_amount'); //Purchase return invc payments //zee
        $total_pr_invc_amount      =  collect($saleRecords['pr_invc_amount'])->SUM('paid_amount');  //Purchase invoice payment //zee
        $total_net_sale_discount   =  collect($saleRecords['sales'])->unique('invoice_no')->where('customer_id',8)->SUM('invoice_discount'); //zee
    
        // $total_sale_amount                             =  collect($saleRecords['sales'])->SUM('product_net_total'); //zeee
        $total_net_sale_invoice_amount                 =  collect($saleRecords['sales'])->WHERE('invoice_type', 1)->SUM('sale_total_amount'); //zeee
        $total_credit_sales_amount_received            =  collect($saleRecords['sales'])->WHERE('invoice_type', 2)->unique('invoice_no')->SUM('paid_amount'); //zee
        $total_net_sale_returns_invoice_amount         =  collect($saleRecords['sale_returns'])->WHERE('invoice_type', 1)->SUM('total_invoice_amount'); //zee
        $total_credit_sale_returns_amount_received     =  collect($saleRecords['sale_returns'])->WHERE('invoice_type', 2)->SUM('paid_amount'); //zee
        //END Returns
        $customer_payment           =  collect($customer_ldgr)->whereNotIn('customer_id', [5, 8, 97, 170])->where('trx_type', 3)->sum('dr'); //zee
        //Expense 
        $expense                    =  collect($customer_ldgr)->WHERE('customer_id', 5)->WHERE('trx_type', 3)->SUM('dr'); //zee 
        //Opening Balnce
        $vendor_payment             =  collect($vendor_ldgr)->SUM('dr'); //zee
        $openning_balance           =  collect($customer_ldgr)->WHERE('customer_id', 170)->WHERE('trx_type', 3)->SUM('cr');  //zee
        $ttl_cash_recovery          =  collect($customer_ldgr)->whereNotIn('customer_id', [5, 8, 97, 170])->WHERE('trx_type', 3)->SUM('cr'); //zee
        $ttl_vendor_cash_recovery   =  collect($vendor_ldgr)->WHERE('customer_id', '!=', 7)->WHERE('trx_type', 3)->SUM('cr'); //zee
    
        $ttl_cash_recovery          =    $ttl_cash_recovery + $ttl_vendor_cash_recovery + $total_credit_sales_amount_received + $openning_balance;
        $ttl_payments               =    $vendor_payment + $customer_payment + $total_credit_sale_returns_amount_received + $total_pr_paid_amount + $total_pr_invc_amount + $expense;
        $ttl_in_hand                =    ($total_net_sale_invoice_amount + $ttl_cash_recovery ) - $total_net_sale_discount - $ttl_payments - $total_net_sale_returns_invoice_amount;
        return view('home', compact('message', 'total_sale','ttl_sale_return','ttl_in_hand', 'total_purchase','expense'));
    }
    
}
