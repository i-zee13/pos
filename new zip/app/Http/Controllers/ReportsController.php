<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\Product;
use App\Models\ProductSale;
use App\Models\Stock;
use App\Models\VendorLedger;
use Illuminate\Http\Request;
use DB;
use DateTime;
use stdClass;

require app_path('invoice_helper.php');
class ReportsController extends Controller
{

   public function customerReport()
   {
      $vendors   =   Customer::where('customer_type', 2)->get();
      return view('reports.vendor', compact('vendors'));
   }
   public function vendorReport()
   {
      $vendors   =   Customer::where('customer_type', 1)->get();
      return view('reports.vendor', compact('vendors'));
   }

   public function stockReport()
   {
      $companies  =   Company::select('id', 'company_name')->get();
      $products   =   Product::select('id', 'product_name')->get();
      return view('reports.stock', compact('companies', 'products'));
   }
   public function stockReportList(Request $request)
   {
      $query               =  " 1=1 ";
      $current_date        =   date('Y-m-d');
      if (isset($request->company_id)) {
         $query      .= " AND vs.company_id =  $request->company_id ";
      }
      if (isset($request->product_id)) {
         $query      .= " AND vs.product_id = $request->product_id ";
      }
      if (isset($request->expiry) && $request->expiry > 0  || $request->is_click == 0) { //is_click = 0 mean on page load get 3 months expires
         $query                .=  "AND batch_wise_balance > 0 ";
         $expiry_month         =   $request->is_click == 0 ? 3 :  $request->expiry;
         $dateTime             =   new DateTime($current_date);
         $expiry_limit_date    =   $dateTime->modify('+ '. $expiry_month .'month')->format('Y-m-d');
         $query               .=  " AND vs.expiry_date BETWEEN '$current_date' AND '$expiry_limit_date'";
         $records    = DB::select("
                                 SELECT
                                     vs.batch_wise_balance AS balance,
                                     vs.vs_id,
                                     IFNULL(
                                         (SELECT company_name FROM companies WHERE id = vs.company_id),
                                         ''
                                     ) AS company_name,
                                     IFNULL(
                                         (SELECT product_name FROM products WHERE id = vs.product_id),
                                         ''
                                     ) AS product_name, 
                                     vs.product_id,
                                     DATE_FORMAT(vs.expiry_date, '%d %b %Y') AS expiry_date
                                 FROM
                                   stock_batches_items vs
                                 WHERE
                                     $query
                             "); 
      } else {

         $records = DB::select("
                              SELECT
                              vs.balance AS balance,
                              vs.vs_id,
                              IFNULL(
                                 (SELECT company_name FROM companies WHERE id = vs.company_id),
                                 ''
                              ) AS company_name,
                              IFNULL(
                                 (SELECT product_name FROM products WHERE id = vs.product_id),
                                 ''
                              ) AS product_name,
                              IFNULL(
                                 (SELECT sale_price FROM products WHERE id = vs.product_id),
                                 ''
                                 ) AS sale_price,
                              vs.product_id 
                           FROM
                           vendor_stock_managment vs
                           WHERE
                           $query
                           ");
      }
      return response()->json([
         'msg'     =>   'Stock reports list fetched',
         'status'  =>   'success',
         'records' =>   $records
      ]);
   }
   public function old_stockReportList(Request $request)
   {
      $select_expiry       =  "";
      $query               =  " 1=1";
      $inner_join_where    =  " 1=1";
      $query_expiry        =  "";
      // $where               =  " vs.transaction_type != 4";
      $where               =  "1=1 ";
      // $group_order_by      =   "ORDER BY vs.id ASC";
      $group_order_by      =  "GROUP BY vs.product_id,vs.purchase_invoice_id ORDER BY vs.id DESC";

      $current_date        =   date('Y-m-d');
      if (isset($request->company_id)) {
         $query      .= " AND vs.company_id =  $request->company_id";
      }
      if (isset($request->product_id)) {
         $query      .= " AND vs.product_id = $request->product_id";
      }
      $inner_join_where = $query;
      $query      .= " AND $where";
      $max_id = '';

      // if (isset($request->start_date) != '' && isset($request->end_date) != '') {
      //    $query .= " AND DATE(vs.created_at) BETWEEN '$request->start_date' AND '$request->end_date'";
      // }else{
      //    $query .=  " AND  DATE(vs.created_at) = '$current_date'";

      // } 
      if (isset($request->expiry)) {
         $dateTime             =   new DateTime($current_date);
         if ($request->expiry == '1') {
            $expiry_limit_date =   $dateTime->modify('+1 month')->format('Y-m-d');
         } else {
            $expiry_limit_date =   $dateTime->modify('+2 month')->format('Y-m-d');
         }

         $select_expiry       =  "DATE_FORMAT(pp.expiry_date,'%d-%m-%Y') AS expiry_date,";
         $group_order_by      =  "GROUP BY vs.purchase_invoice_id,vs.product_id ORDER BY vs.id DESC";
         $query_expiry        =  "JOIN products_purchases pp ON vs.purchase_invoice_id = pp.purchase_invoice_id
                                 AND
                                 vs.product_id = pp.product_id
                                 AND
                                 pp.expiry_date BETWEEN '$current_date' AND '$expiry_limit_date'";
      } else {
         $max_id = "JOIN (
            SELECT product_id, MAX(id) AS max_id
            FROM `vendor_stocks` as vs
            WHERE $inner_join_where
            GROUP BY product_id
        ) AS max_ids
        ON vs.product_id = max_ids.product_id
        AND vs.id = max_ids.max_id";
      }


      $records       =  DB::select("
                           SELECT
                              vs.balance AS balance,
                              vs.id AS vs_id,
                              IFNULL(
                                 (SELECT company_name FROM companies WHERE id = vs.company_id),
                                 ''
                              ) as company_name,
                              IFNULL(
                                 (SELECT product_name FROM products WHERE id = vs.product_id),
                                 ''
                              ) AS product_name,
                              IFNULL(
                                 (SELECT sale_price FROM products WHERE id = vs.product_id),
                                 ''
                              ) as sale_price,
                              $select_expiry
                              product_unit_price AS p_price,
                              (SELECT invoice_no FROM purchase_invoices where purchase_invoices.id =  vs.purchase_invoice_id) AS purchase_invoice_id,
                              vs.qty AS qty,
                              vs.transaction_type,
                              vs.status,
                              vs.product_id,
                              (SELECT invoice_no FROM sale_invoices where sale_invoices.id =  vs.sale_invoice_id) AS sale_invoice_id,
                              (SELECT customer_name FROM customers WHERE id = vs.vendor_id) AS vendor_name,
                              IFNULL((SELECT customer_name FROM customers WHERE id = (SELECT customer_id FROM sale_invoices WHERE sale_invoices.id=vs.sale_invoice_id)),'') AS customer_name
                           FROM
                           vendor_stocks vs
                           $max_id    
                           $query_expiry
                           WHERE
                           $query
                           $group_order_by
                        ");
      return response()->json([
         'msg'     =>   'Stock reports list fetched',
         'status'  =>   'success',
         'records' =>   $records
      ]);
   }
   public function allStockValueReport()
   {
      $companies  =   Company::select('id', 'company_name')->get();
      $products   =   Product::select('id', 'product_name')->get();
      return view('reports.stock-value-report', compact('companies', 'products'));
   }
   public function fetchStockValueReport(Request $request)
   {
      $query               =  " 1=1";
      if (isset($request->company_id)) {
         $query      .= " AND vs.company_id =  $request->company_id";
      }
      if (isset($request->product_id)) {
         $query      .= " AND vs.product_id = $request->product_id";
      }
// ;      if ($request->filter_by_value == '2') {
         // $where            =  " DATE(vs.created_at) BETWEEN '$request->start_date' AND '$request->end_date' AND vs.transaction_type != 4 ";
         // $where            =  " DATE(vs.created_at) <= $request->end_date";
      // }
      //  else {
      //    $where            =  " DATE(vs.created_at) <= '$request->end_date' ";
      //    $group_order_by   =   "ORDER BY vs.id DESC";
      //    $select_query     =  "( SELECT SUM(purchased_total_amount)/ SUM(qty) as avg_product_value FROM products_purchases vs  WHERE $query ) as avg_product_value ";
      // }

      $records = DB::select("SELECT vs.balance AS balance, vs.vs_id,vs.product_id,vs.ttl_avg_cost,vs.ttl_cost,vs.purchase_price,
                                 IFNULL(
                                    (SELECT company_name FROM companies WHERE id = vs.company_id),'') AS company_name,
                                 IFNULL(
                                    (SELECT product_name FROM products WHERE id = vs.product_id),'') AS product_name,
                                 IFNULL(
                                    (SELECT sale_price FROM products WHERE id = vs.product_id),'') AS sale_price
                              FROM
                              vendor_stock_managment vs
                              WHERE
                              $query
                              ");
                              
      // dd($records);
      // $records             =  DB::select("
      //                            SELECT
      //                               vs.balance AS balance,
      //                               vs.id AS vs_id,
      //                               IFNULL(
      //                                  (SELECT company_name FROM companies WHERE id = vs.company_id),
      //                                  ''
      //                               ) as company_name,
      //                               IFNULL(
      //                                  (SELECT product_name FROM products WHERE id = vs.product_id),
      //                                  ''
      //                               ) AS product_name,
      //                               product_unit_price AS p_price,
      //                               (SELECT invoice_no FROM purchase_invoices where purchase_invoices.id =  vs.purchase_invoice_id) AS purchase_invoice_id,
      //                               vs.qty AS qty,
      //                               vs.transaction_type,
      //                               vs.status,
      //                               vs.product_id,
      //                               (SELECT invoice_no FROM sale_invoices where sale_invoices.id =  vs.sale_invoice_id) AS sale_invoice_id,
      //                               (SELECT customer_name FROM customers WHERE id = vs.vendor_id) AS vendor_name,
      //                               IFNULL((SELECT customer_name FROM customers WHERE id = (SELECT customer_id FROM sale_invoices WHERE sale_invoices.id=vs.sale_invoice_id)),'') AS customer_name,
      //                               $select_query
      //                            FROM
      //                            vendor_stocks vs
      //                            JOIN (
      //                               SELECT product_id, MAX(id) AS max_id
      //                               FROM `vendor_stocks` as vs
      //                               WHERE $inner_join_where
      //                               GROUP BY product_id
      //                           ) AS max_ids
      //                           ON vs.product_id = max_ids.product_id
      //                           AND vs.id = max_ids.max_id
      //                            WHERE
      //                            $query
      //                            $group_order_by
      //                         ");
    
      return response()->json([
         'msg'     =>   'Stock reports list fetched',
         'status'  =>   'success',
         'records' =>   $records
      ]);
   }
   //Expense Reports 
   public function expenseReport()
   { 
      $customer  =   Customer::where('id', 5)->first();
      return view('reports.expense', compact('customer'));
   }
   public function expenseReportList(Request $request)
   {
      $current_date     =  date('Y-m-d');
      $records          = ExpenseReportRecords($request, $current_date);
      return response()->json([
         'msg'     => 'Expense reports fetched',
         'status'  => 'success',
         'sales'  => $records
      ]);
   }
     //Profit Reports 
     public function stockProfitReport()
     {
        $companies  =   Company::select('id', 'company_name')->get();
        $products   =   Product::select('id', 'product_name')->get();
        $customers  =   Customer::select('id', 'customer_name')->where('customer_type', 2)->get();
        return view('reports.profit', compact('companies', 'products', 'customers'));
     }
   //Profit Reports 
   public function profitReport()
   {
      $companies  =   Company::select('id', 'company_name')->get();
      $products   =   Product::select('id', 'product_name')->get();
      $customers  =   Customer::select('id', 'customer_name')->where('customer_type', 2)->get();
      return view('reports.profit', compact('companies', 'products', 'customers'));
   }
   public function saleProfitReportList(Request $request)
   { 
      $current_date     =  date('Y-m-d');
      if($request->report_type == 1){
         $records       = ProfitReportRecords($request, $current_date);
      }else{
         $records       = StockProfitReport($request, $current_date);
      }
      return response()->json([
         'msg'     => 'Stock reports list fetched',
         'status'  => 'success',
         'sales'  => $records
      ]);
   }
   //Sales Reports 
   public function saleReport()
   {
      $companies  =   Company::select('id', 'company_name')->get();
      $products   =   Product::select('id', 'product_name')->get();
      $customers  =   Customer::select('id', 'customer_name')->where('customer_type', 2)->get();
      return view('reports.sale', compact('companies', 'products', 'customers'));
   }
   public function saleReportList(Request $request)
   {
      $current_date     =  date('Y-m-d');
      $records          =  $this->SaleReportRecords($request, $current_date, $is_admin_close = 0);
      return response()->json([
         'msg'     => 'Stock reports list fetched',
         'status'  => 'success',
         'stocks'  => $records
      ]);
   }
  public function SaleReportRecords($request, $current_date, $is_admin_close = null)
   {

      $query = " 1=1";
      $purchase_return_paid_amount = 0;
      $purchase_inv_paid_amount    = 0;
      $query .= " AND ps.deleted_at IS NULL";

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
      $sale_invoice_records->total_invoice_amount   =  collect($sales)->unique('invoice_no')->sum('total_invoice_amount'); 
      $sale_invoice_records->invoice_discount       =  collect($sales)->unique('invoice_no')->sum('invoice_discount'); 
      $sale_invoice_records->service_charges       =  collect($sales)->unique('invoice_no')->sum('service_charges');  
      
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
   //Purchase Report
   public function purchaseReport()
   {
      $companies  =   Company::select('id', 'company_name')->get();
      $products   =   Product::select('id', 'product_name')->get();
      $customers  =   Customer::select('id', 'customer_name')->where('customer_type', 1)->get();
      return view('reports.purchase', compact('companies', 'products', 'customers'));
   }
   public function purchaseReportList(Request $request)
   {
      $current_date     =  date('Y-m-d');
      $records          =  PurchaseReportList($request, $current_date);

      return response()->json([
         'msg'     => 'Purchase reports list fetched',
         'status'  => 'success',
         'reports'  => $records
      ]);
   }
   // Admin Sale Close
   public function adminSaleClose()
   {
      $companies  =   Company::select('id', 'company_name')->get();
      $products   =   Product::select('id', 'product_name')->get();
      $customers  =   Customer::select('id', 'customer_name')->where('customer_type', 2)->get();
      return view('reports.admin-sale-close', compact(['companies', 'products', 'customers']));
   }
    public function adminSaleCloseRecord($closing_date)
   {
      $request                         =  "";
    //   $closing_date                  =  "2025-02-09";
      // $closing_date                  =  "2023-10-07";
      $saleRecords                      =  $this->SaleReportRecords($request, $closing_date, 1);

      $customer_payment                =  DB::table("customer_ledger")->selectRaw("
                                             customer_id,
                                             IFNULL(cr,0) as cr,
                                             IFNULL(dr,0) as dr,
                                             trx_type
                                          ")
                                          ->whereRaw("DATE(created_at) = '$closing_date' AND  is_deleted = 0
                                          ")->get();
      $vendor_payment                  =  DB::table("vendor_ledger")->selectRaw("
                                             customer_id as vendor_id,
                                             IFNULL(cr,0) as cr,
                                             IFNULL(dr,0) as dr,
                                             trx_type
                                          ")->whereNull('purchase_return_invoice_id')
                                          ->whereRaw("DATE(created_at) = '$closing_date' AND  is_deleted = 0")->get(); 
                                       //  dd($saleRecords);
      $records                         =  new stdClass();
      //Opening Balnce
      $records->openning_balance       =  collect($customer_payment)->WHERE('customer_id', 170)->WHERE('trx_type', 3)->SUM('cr');

      $records->dawai       = collect($saleRecords['sales'])->whereIn('company_id', [35, 36])->sum('sale_total_amount');
      $records->dawai_r     = collect($saleRecords['sale_returns'])->whereIn('company_id', [35, 36])->sum('return_total_amount');
      
       $records->dawai      =  $records->dawai - $records->dawai_r;
      $records->dawai_qty   = collect($saleRecords['sales'])->whereIn('company_id', [35, 36])->sum('qty');

      $records->beej        = collect($saleRecords['sales'])->whereIn('company_id', [14, 60])->sum('sale_total_amount');
      $records->beej_qty    = collect($saleRecords['sales'])->whereIn('company_id', [14, 60])->sum('qty');

    //BEEJ RETURN 
     $records->beej_return  = collect($saleRecords['sale_returns'])->whereIn('company_id', [14, 60])->sum('return_total_amount');
     $records->beej         = $records->beej - $records->beej_return;


      $records->gandom   = collect($saleRecords['sales'])->whereIn('company_id', [39])->sum('sale_total_amount');
      $records->gandom_qty = collect($saleRecords['sales'])->whereIn('company_id', [39])->sum('qty');

      $records->kapas    = collect($saleRecords['sales'])->whereIn('company_id', [40])->sum('sale_total_amount');
      $records->kapas_qty = collect($saleRecords['sales'])->whereIn('company_id', [40])->sum('qty');

      $records->dhaan    = collect($saleRecords['sales'])->whereIn('company_id', [41])->sum('sale_total_amount');
      $records->dhaan_qty = collect($saleRecords['sales'])->whereIn('company_id', [41])->sum('qty');

      $records->dap_25kg = collect($saleRecords['sales'])->whereIn('company_id', [42])->sum('sale_total_amount');
      $records->dap_25kg_qty = collect($saleRecords['sales'])->whereIn('company_id', [42])->sum('qty');

      $records->dap      = collect($saleRecords['sales'])->whereIn('company_id', [4])->sum('sale_total_amount');
      $records->dap_qty = collect($saleRecords['sales'])->whereIn('company_id', [4])->sum('qty');

        $records->dap      = collect($saleRecords['sales'])->whereIn('company_id', [4])->sum('sale_total_amount');
        $records->dap_r      = collect($saleRecords['sale_returns'])->whereIn('company_id', [4])->sum('return_total_amount');
        $records->dap_qty_r = collect($saleRecords['sale_returns'])->whereIn('company_id', [4])->sum('qty');
        
      $records->tsp      = collect($saleRecords['sales'])->whereIn('company_id', [83])->sum('sale_total_amount');
      $records->tsp_qty  = collect($saleRecords['sales'])->whereIn('company_id', [83])->sum('qty');
 
        $records->tsp_r      = collect($saleRecords['sale_returns'])->whereIn('company_id', [83])->sum('return_total_amount');
        $records->tsp_qty_r  = collect($saleRecords['sale_returns'])->whereIn('company_id', [83])->sum('qty');
        $records->tsp             =   $records->tsp - $records->tsp_r;
        $records->tsp_qty         =   $records->tsp_qty- $records->tsp_qty_r;

      $records->dap             =   $records->dap - $records->dap_r;
      $records->dap_qty         =   $records->dap_qty- $records->dap_qty_r;
      $records->urea            =   collect($saleRecords['sales'])->whereIn('company_id', [3])->sum('sale_total_amount');
      $records->urea_return     =   collect($saleRecords['sale_returns'])->whereIn('company_id', [3])->sum('return_total_amount');
      
      $records->urea     = $records->urea - $records->urea_return;
      $records->urea_qty = collect($saleRecords['sales'])->whereIn('company_id', [3])->sum('qty') ?? 0;
      $records->urea_qty_r = collect($saleRecords['sale_returns'])->whereIn('company_id', [3])->sum('qty') ?? 0;

      $records->urea_qty = $records->urea_qty - $records->urea_qty_r;

      $records->can         = collect($saleRecords['sales'])->whereIn('company_id', [5])->sum('sale_total_amount');
      $records->can_qty     = collect($saleRecords['sales'])->whereIn('company_id', [5])->sum('qty');
      $records->can_r       = collect($saleRecords['sale_returns'])->whereIn('company_id', [5])->sum('return_total_amount');
      $records->can_qty_r   = collect($saleRecords['sale_returns'])->whereIn('company_id', [5])->sum('qty');
      $records->can         = $records->can - $records->can_r;
      $records->can_qty     = $records->can_qty- $records->can_qty_r;
      
      
      $records->np          = collect($saleRecords['sales'])->whereIn('company_id', [6])->sum('sale_total_amount');
      $records->np_qty      = collect($saleRecords['sales'])->whereIn('company_id', [6])->sum('qty');
      $records->np_r        = collect($saleRecords['sale_returns'])->whereIn('company_id', [6])->sum('return_total_amount');
      $records->np_qty_r    = collect($saleRecords['sale_returns'])->whereIn('company_id', [6])->sum('qty');
      $records->np          =  $records->np -  $records->np_r;
      $records->np_qty      =  $records->np_qty -  $records->np_qty_r;



      $records->ssp      = collect($saleRecords['sales'])->whereIn('company_id', [7])->sum('sale_total_amount');
      $records->ssp_qty = collect($saleRecords['sales'])->whereIn('company_id', [7])->sum('qty');

      $records->zarkhez  = collect($saleRecords['sales'])->whereIn('company_id', [8])->sum('sale_total_amount');
      $records->zarkhez_qty = collect($saleRecords['sales'])->whereIn('company_id', [8])->sum('qty');

      $records->sop      = collect($saleRecords['sales'])->where('company_id', 9)->sum('sale_total_amount');
      $records->sop_qty = collect($saleRecords['sales'])->where('company_id', 9)->sum('qty');

      $records->jimsam   = collect($saleRecords['sales'])->where('company_id', 10)->sum('sale_total_amount');
      $records->jimsam_qty = collect($saleRecords['sales'])->where('company_id', 10)->sum('qty');

      $records->sm_urea  = collect($saleRecords['sales'])->where('company_id', 11)->sum('sale_total_amount');
      $records->sm_urea_qty = collect($saleRecords['sales'])->where('company_id', 11)->sum('qty');

      $records->mop      = collect($saleRecords['sales'])->where('company_id', 12)->sum('sale_total_amount');
      $records->mop_qty = collect($saleRecords['sales'])->where('company_id', 12)->sum('qty');

      $ttl_sale                  = collect($saleRecords['sales'])->SUM('sale_total_amount');
    
 

      $records->total_pr_paid_amount   =  collect($saleRecords['pr_paid_amount'])->SUM('paid_amount'); //Purchase return invc payments
      $records->total_pr_invc_amount   =  collect($saleRecords['pr_invc_amount'])->SUM('paid_amount');  //Purchase invoice payment
      $records->total_invoice_amount   =  collect($saleRecords['sales'])->unique('invoice_no')->SUM('total_invoice_amount');
      $records->total_invoice_discount =  collect($saleRecords['sales'])->unique('invoice_no')->SUM('invoice_discount');
      $records->total_net_sale_discount=  collect($saleRecords['sales'])->unique('invoice_no')->where('customer_id',8)->SUM('invoice_discount');
      $records->total_service_charges  =  collect($saleRecords['sales'])->unique('invoice_no')->SUM('service_charges');
      $records->total_product_discount =  collect($saleRecords['sales'])->SUM('product_discount');
      $records->total_net_sales        =  collect($saleRecords['sales'])->WHERE('invoice_type', 1)->SUM('sale_total_amount');
      $records->total_credit_sales     =  collect($saleRecords['sales'])->WHERE('invoice_type', 2)->SUM('sale_total_amount');


      $records->total_net_sale_invoice_amount           =  collect($saleRecords['sales'])->WHERE('invoice_type', 1)->SUM('sale_total_amount');
      $records->total_credit_sale_invoice_amount        =  collect($saleRecords['sales'])->WHERE('invoice_type', 2)->unique('invoice_no')->SUM('sale_total_amount');
      $records->total_net_sale_returns_invoice_amount   =  collect($saleRecords['sale_returns'])->WHERE('invoice_type', 1)->SUM('total_invoice_amount');


      $records->total_credit_sales_amount_received     =  collect($saleRecords['sales'])->WHERE('invoice_type', 2)->unique('invoice_no')->SUM('paid_amount');
      //Returns 
      $records->total_return_invoice_amount   =  collect($saleRecords['sale_returns'])->SUM('total_invoice_amount');
      $records->total_return_invoice_discount =  collect($saleRecords['sale_returns'])->SUM('invoice_discount');
      $records->total_return_service_charges  =  collect($saleRecords['sale_returns'])->SUM('service_charges');
      $records->total_return_product_discount =  collect($saleRecords['sale_returns'])->SUM('product_discount');
      $records->total_net_sale_returns        =  collect($saleRecords['sale_returns'])->WHERE('invoice_type', 1)->SUM('return_total_amount');
      $records->total_credit_sale_returns     =  collect($saleRecords['sale_returns'])->WHERE('invoice_type', 2)->SUM('return_total_amount');
      $records->total_credit_sale_returns_amount_received     =  collect($saleRecords['sale_returns'])->WHERE('invoice_type', 2)->SUM('paid_amount');
      
      //END Returns
      $records->customer_payment            = collect($customer_payment)->whereNotIn('customer_id', [5, 8, 97, 170])->where('trx_type', 3)->sum('dr');
      //Expense     
      $records->expense                     =  collect($customer_payment)->WHERE('customer_id', 5)->WHERE('trx_type', 3)->SUM('dr');
    
    
      $records->vendor_payment             =  collect($vendor_payment)->WHERE('trx_type', 3)->SUM('dr');
      $records->ttl_cash_recovery          =  collect($customer_payment)->whereNotIn('customer_id', [5, 8, 97, 170])->WHERE('trx_type', 3)->SUM('cr');
      $records->ttl_vendor_cash_recovery   =  collect($vendor_payment)->WHERE('vendor_id', '!=', 7)->WHERE('trx_type', 3)->SUM('cr');
      $records->customer_ledger            =  $customer_payment;
      $records->vendor_ledger              =  $vendor_payment;
      $records->saleRecords                =  $saleRecords['sales'];
      // dd($saleRecords['sales']); 
      // $records->mutafirq_udhar_receive       =  collect($customer_payment)->whereNotIn('customer_id',[5, 8, 97, 170,48])->SUM('cr');
      $records->mutafirq_udhar_receive          =  collect($customer_payment)->whereNotIn('customer_id',[5,8,49,97,105,107,113,115,126,145,157,170,48,242])->SUM('cr');
      $records->ilyas_bakhtawar                 =  collect($customer_payment)->where('customer_id',105)->SUM('cr');
    
      $records->fazul_qadir_receive             =  collect($customer_payment)->where('customer_id',48)->SUM('cr');
      $records->shafiq_karyana_receive          =  collect($customer_payment)->where('customer_id',49) ->sum('cr');
      $records->abdul_ghaffar_ghar_receive      =  collect($customer_payment)->where('customer_id',107)->sum('cr');
      $records->ammar_abdullah_ghar_receive     =  collect($customer_payment) ->where('customer_id',113)->sum('cr');
      $records->imdad_khata_receive             =  collect($customer_payment)->where('customer_id',126)->sum('cr');
      $records->imran_niazi_receive             =  collect($customer_payment)->where('customer_id',145)->sum('cr');
      $records->sir_murtaza_sahib_receive       =  collect($customer_payment)->where('customer_id',157)->sum('cr');
      $records->master_khalid_faroq_shah_receive=  collect($customer_payment)->where('customer_id',242)->sum('cr');
      $records->karaya_dokan_receive            =  collect($customer_payment)->where('customer_id',115)->SUM('cr'); 
      $records->meezan_bank_jama                =  collect($vendor_payment)->where('vendor_id',429)->SUM('cr');
      $records->ubl_aftab_jama                  =  collect($vendor_payment)->where('vendor_id',437)->SUM('cr');
      $records->abdul_shakoor_exchange_jama     =  collect($vendor_payment)->where('vendor_id',33)->where('trx_type', 3)->SUM('cr');
     
      $records->mutafariq_udhar_banam          =  collect($customer_payment)->whereNotIn('customer_id',[5,8,49,97,114,115,356,107,113,126,145,157,170,48,242,413])->SUM('dr');
      $records->salries_banam                  =  collect($customer_payment)->where('customer_id',114)->SUM('dr'); 
      $records->fazul_qadir_banam              =  collect($customer_payment)->where('customer_id',48)->SUM('dr'); 
      $records->shafiq_karyana_banam           =  collect($customer_payment)->where('customer_id',49) ->sum('dr');
      $records->abdul_ghaffar_ghar_banam       =  collect($customer_payment)->where('customer_id',107)->sum('dr');
      $records->ammar_abdullah_ghar_banam      =  collect($customer_payment) ->where('customer_id',113)->sum('dr');
      $records->imdad_khata_banam              =  collect($customer_payment)->where('customer_id',126)->sum('dr');
      $records->imran_niazi_banam              =  collect($customer_payment)->where('customer_id',145)->sum('dr');
      $records->sir_murtaza_sahib_banam        =  collect($customer_payment)->where('customer_id',157)->sum('dr');
      $records->master_khalid_faroq_shah_banam =  collect($customer_payment)->where('customer_id',242)->sum('dr'); 
      $records->karaya_dokan_banam             =  collect($customer_payment)->where('customer_id',115)->SUM('dr');
      // $records->mutafariq_udhar_banam       =  collect($customer_payment)->whereNotIn('customer_id',[5,8,97,170,356,48])->SUM('dr'); 
     $excluded_vendors = [
          7,8, 9, 17,18,289,290, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 33, 34, 36,135, 138,346,
          278, 285,294 ,298, 264,288, 306, 311, 312, 315, 323, 340, 343, 366, 374, 377, 379, 387, 394,413,429,437,341,472
      ];

  // ✅ **Mapping Vendor IDs with Correct Column Names**
    $vendors = [
      346 => "gawara_khata",
      294 => "np_khareed",
      264 => "petrol_khata",
      33  => "abdul_shakoor_exchange",
      312 => "habib_bank_abdul_shakoor",
      394 => "dawaj_khareed",
      9   => "angro_fertilizer",
      17  => "fouji_fertilizer",
      289  => "dap_khata",
      290  => "angro_khata",
      18  => "fatima_flink_ventilators",
      34  => "wilkan_center_cotton",
      36  => "tcs_tcs_wadha", 
      135 => "sami_sami",
      138 => "nmlf",
      278 => "abl_ka",
      285 => "ubl_waqas", 
      298 => "bank_al_habib_ka",
      306 => "bop_card_loss",
      311 => "hbl_m_waqas",
      312 => "abdul_shakoor_habib_bank",
      315 => "sarhad_punjab_cash",
      323 => "alfalah_bank_card",
      340 => "tameerat_khata",
      343 => "baghban_chemical",
      472 => "prime_khata",
      366 => "imported_pura_khata",
      374 => "bop_bank",
      377 => "sonehri_bank",
      379 => "askari_bank",
      387 => "amanat_bank",
      20  => "wilkan_chemicals",
      19  => "swat_agro_chemicals",
      21  => "agro_lux",
      22  => "kenzo_ag",
      23  => "leader_ag",
      24  => "arsta",
      25  => "bayer",
      26  => "fmc",
      27  => "agro_mark", 
      29  => "advance_agro_tech",
      413 => "gandum_khareed_khata",
      341 => "land_company"
  ];
     $ttl_vendror_dr = 0;
     // Sum DR values for each vendor dynamically
     foreach ($vendors as $vendor_id => $column_name) {
         $records->$column_name = collect($vendor_payment)->where('vendor_id', $vendor_id)->sum('dr');
        //  if($column_name =='land_company'){
        //      dd( $records->$column_name,collect($vendor_payment)->where('vendor_id', $vendor_id)->sum('cr'));
        //  }
         $ttl_vendror_dr +=  $records->$column_name;
        
     }  
     
     $records->mcb_ka_jama  = collect($vendor_payment)->where('vendor_id', 288)->sum('cr');
     $records->mcb_ka       = collect($vendor_payment)->where('vendor_id', 288)->sum('dr');
     $records->beej_khareed = collect($vendor_payment)->where('vendor_id', 28)->where('trx_type', 3)->sum('dr');
     // Sum DR values for all non-excluded vendors
     $records->ttl_purchase_dr = collect($vendor_payment) ->whereNotIn('vendor_id', $excluded_vendors)->where('trx_type', 3) ->sum('dr'); 
         
        
      $records->open_khad           =  collect($customer_payment)->where('customer_id',356)->SUM('dr');
      $records->ttl_purchase_cr     =  collect($vendor_payment)->whereNotIn('vendor_id', [7,311,285,288,429,437,33])->WHERE('trx_type', 3)->sum('cr'); 
      $records->hbl_m_waqas_jama    =  collect($vendor_payment)->where('vendor_id', 311)->WHERE('trx_type', 3)->sum('cr'); 
      $records->ubl_m_waqas_jama    =  collect($vendor_payment)->where('vendor_id', 285)->WHERE('trx_type', 3)->sum('cr');     
      $records->meezan_bank_banam   =  collect($vendor_payment)->where('vendor_id',429)->SUM('dr');
     
      $records->ubl_aftab_banam     = collect($vendor_payment)->where('vendor_id',437)->SUM('dr');
      $records->customer_banam      = collect([
                                                $records->fazul_qadir_banam,
                                                $records->shafiq_karyana_banam,
                                                $records->abdul_ghaffar_ghar_banam,
                                                $records->ammar_abdullah_ghar_banam,
                                                $records->imdad_khata_banam,
                                                $records->imran_niazi_banam,
                                                $records->sir_murtaza_sahib_banam,
                                                $records->master_khalid_faroq_shah_banam
                                          ])->sum(); 
      $records->customer_receive    = collect([
                                             $records->fazul_qadir_receive,
                                             $records->shafiq_karyana_receive,
                                             $records->abdul_ghaffar_ghar_receive,
                                             $records->ammar_abdullah_ghar_receive,
                                             $records->imdad_khata_receive,
                                             $records->imran_niazi_receive,
                                             $records->sir_murtaza_sahib_receive,
                                             $records->master_khalid_faroq_shah_receive
                                       ])->sum();

      // Sum of all categorized sales
      $total_categorized_sales   = collect([ 
                                       $records->dawai,$records->beej, $records->gandom, $records->kapas, $records->dhaan,
                                       $records->dap_25kg, $records->dap, $records->urea, $records->can, $records->np, $records->tsp,
                                       $records->ssp, $records->zarkhez, $records->sop, $records->jimsam, 
                                       $records->sm_urea, $records->mop
                                    ])->sum();
      // Sum of all Bank Payment
 
                            
      // Final calculation:
      $ttl_sale               = $ttl_sale - $records->total_net_sale_returns - $records->total_invoice_discount - $records->total_product_discount- $records->total_credit_sale_returns;
      $records->mutafirq_sody = $ttl_sale - $total_categorized_sales; 
      $records->ttl_in        = $records->ilyas_bakhtawar+ $ttl_sale + $records->openning_balance + $records->mutafirq_udhar_receive + $records->customer_receive + $records->ubl_m_waqas_jama + $records->hbl_m_waqas_jama + $records->karaya_dokan_receive + $records->mcb_ka_jama + $records->meezan_bank_jama + $records->ubl_aftab_jama + $records->abdul_shakoor_exchange_jama;
      $records->ttl_out       = $ttl_vendror_dr + ($records->ttl_purchase_dr - $records->ttl_purchase_cr + $records->open_khad ) +  $records->mutafariq_udhar_banam +   $records->expense   + $records->beej_khareed + $records->customer_banam + $records->karaya_dokan_banam + $records->salries_banam + $records->mcb_ka +  $records->meezan_bank_banam +  $records->ubl_aftab_banam;
    //   dd($records->ttl_in - $records->ttl_out);
      $records->sody_khareed  = ($records->ttl_purchase_dr - $records->ttl_purchase_cr + $records->open_khad); 
    //  dd($records->sody_khareed, 'ttl vendor dr : '. $ttl_vendror_dr , 'ttl purchase dr : '. $records->ttl_purchase_dr , 'ttl purchase cr : '.$records->ttl_purchase_cr, 'open khad  : '. $records->open_khad , 'mutafariq udhar banam : '.  $records->mutafariq_udhar_banam ,  'Expense : '. $records->expense  , 'Return : '. $records->total_net_sale_returns   , 'beej : '. $records->beej_khareed, 'customer banam : '. $records->customer_banam);
     
     
     
      // Vendor ko pay kr diye  => DR  ,,, jo system ny DENY hen wo = > CR
      // customer ny jo diyee  => DR  ,,,  jo system ny LENY hen wo = > CR
 
      return response()->JSON([
         'status'    => 'success',
         'records'   => $records
      ]);
   }
}
