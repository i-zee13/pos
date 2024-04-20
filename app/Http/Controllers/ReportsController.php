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

require app_path('Invoice_helper.php');
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
      $select_expiry       =  "";
      $query               =  " 1=1";
      $inner_join_where    =  " 1=1";
      $query_expiry        =  "";
      $where               =  " vs.transaction_type != 4";
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
                           JOIN (
                              SELECT product_id, MAX(id) AS max_id
                              FROM `vendor_stocks` as vs
                              WHERE $inner_join_where
                              GROUP BY product_id
                          ) AS max_ids
                          ON vs.product_id = max_ids.product_id
                          AND vs.id = max_ids.max_id
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
      $inner_join_where    =  " 1=1";
      $select_query = ' 1=1';
      if (isset($request->company_id)) {
         $query      .= " AND vs.company_id =  $request->company_id";
      }
      if (isset($request->product_id)) {
         $query      .= " AND vs.product_id = $request->product_id";
      }
      if ($request->filter_by_value == '2') {
         // $where            =  " DATE(vs.created_at) BETWEEN '$request->start_date' AND '$request->end_date' AND vs.transaction_type != 4 ";
         $where            =  "DATE(vs.created_at) <= '$request->end_date' AND vs.transaction_type != 4";
         $group_order_by   =   "GROUP BY vs.product_id ORDER BY vs.id DESC";
      } else {
         $where            =  " DATE(vs.created_at) <= '$request->end_date' ";
         $group_order_by   =   "ORDER BY vs.id DESC";
         $select_query     =  "( SELECT SUM(purchased_total_amount)/ SUM(qty) as avg_product_value FROM products_purchases vs  WHERE $query ) as avg_product_value ";
      }

      $inner_join_where = $query;
      $query      .= " AND $where";
      $records             =  DB::select("
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
                                    product_unit_price AS p_price,
                                    (SELECT invoice_no FROM purchase_invoices where purchase_invoices.id =  vs.purchase_invoice_id) AS purchase_invoice_id,
                                    vs.qty AS qty,
                                    vs.transaction_type,
                                    vs.status,
                                    vs.product_id,
                                    (SELECT invoice_no FROM sale_invoices where sale_invoices.id =  vs.sale_invoice_id) AS sale_invoice_id,
                                    (SELECT customer_name FROM customers WHERE id = vs.vendor_id) AS vendor_name,
                                    IFNULL((SELECT customer_name FROM customers WHERE id = (SELECT customer_id FROM sale_invoices WHERE sale_invoices.id=vs.sale_invoice_id)),'') AS customer_name,
                                    $select_query
                                 FROM
                                 vendor_stocks vs
                                 JOIN (
                                    SELECT product_id, MAX(id) AS max_id
                                    FROM `vendor_stocks` as vs
                                    WHERE $inner_join_where
                                    GROUP BY product_id
                                ) AS max_ids
                                ON vs.product_id = max_ids.product_id
                                AND vs.id = max_ids.max_id
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
      $records          = ProfitReportRecords($request, $current_date);
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
      return ['sales' => $sales, 'sale_returns' => $returns, 'pr_paid_amount' => $purchase_return_paid_amount, 'pr_invc_amount' => $purchase_inv_paid_amount];
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
      // $closing_date                    =  "2023-10-07";
      $saleRecords                     =  $this->SaleReportRecords($request, $closing_date, 1);

      $customer_payment                =  DB::table("customer_ledger")->selectRaw("
                                             customer_id,
                                             IFNULL(cr,0) as cr,
                                             IFNULL(dr,0) as dr,
                                             trx_type
                                          ")
         ->whereRaw("DATE(created_at) = '$closing_date' AND customer_id != 5  
                                          ")->get();
      $vendor_payment                  =  DB::table("vendor_ledger")->selectRaw("
                                             customer_id as vendor_id,
                                             IFNULL(cr,0) as cr,
                                             IFNULL(dr,0) as dr,
                                             trx_type
                                          ")
         ->whereRaw("
                                             DATE(created_at) = '$closing_date' AND trx_type = 3
                                          ")->get();
      $records                         =  new stdClass();
      $records->total_pr_paid_amount   =  collect($saleRecords['pr_paid_amount'])->SUM('paid_amount'); //Purchase return invc payments
      $records->total_pr_invc_amount   =  collect($saleRecords['pr_invc_amount'])->SUM('paid_amount');  //Purchase invoice payment
      $records->total_invoice_amount   =  collect($saleRecords['sales'])->unique('invoice_no')->SUM('total_invoice_amount');
      $records->total_invoice_discount =  collect($saleRecords['sales'])->unique('invoice_no')->SUM('invoice_discount');
      $records->total_service_charges  =  collect($saleRecords['sales'])->unique('invoice_no')->SUM('service_charges');
      $records->total_product_discount =  collect($saleRecords['sales'])->SUM('product_discount');
      $records->total_net_sales        =  collect($saleRecords['sales'])->WHERE('invoice_type', 1)->SUM('sale_total_amount');
      $records->total_credit_sales     =  collect($saleRecords['sales'])->WHERE('invoice_type', 2)->SUM('sale_total_amount');


      $records->total_net_sale_invoice_amount           =  collect($saleRecords['sales'])->WHERE('invoice_type', 1)->SUM('sale_total_amount');
      $records->total_credit_sale_invoice_amount        =  collect($saleRecords['sales'])->WHERE('invoice_type', 2)->SUM('sale_total_amount');
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
      $records->customer_payment = collect($customer_payment)->whereNotIn('customer_id', [5, 8, 97, 170])->where('trx_type', 3)->sum('dr');
      //Expense
      $records->expense                =  collect($customer_payment)->WHERE('customer_id', 5)->WHERE('trx_type', 3)->SUM('dr');
      //Opening Balnce
      $records->openning_balance       =  collect($customer_payment)->WHERE('customer_id', 170)->WHERE('trx_type', 3)->SUM('cr');
      $records->vendor_payment         =  collect($vendor_payment)->SUM('dr');
      $records->ttl_cash_recovery      =  collect($customer_payment)->whereNotIn('customer_id', [5, 8, 97, 170])->WHERE('trx_type', 3)->SUM('cr');
      $records->ttl_vendor_cash_recovery   =  collect($vendor_payment)->WHERE('customer_id', '!=', 7)->WHERE('trx_type', 3)->SUM('cr');
      $records->customer_ledger        =  $customer_payment;
      $records->vendor_ledger          =  $vendor_payment;
      $records->saleRecords            =  $saleRecords['sales'];
      // dd($saleRecords['sales']);

      // Vendor ko pay kr diye  => DR  ,,, jo system ny DENY hen wo = > CR
      // customer ny jo diyee  => DR  ,,,  jo system ny LENY hen wo = > CR

      return response()->JSON([
         'status'    => 'success',
         'records'   => $records
      ]);
   }
}
