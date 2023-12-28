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
      $query_expiry        =  "";
      $where               =  " vs.transaction_type != 4";
      $group_order_by      =   "ORDER BY vs.id ASC";
      $current_date        =   date('Y-m-d');
      if (isset($request->company_id)) {
         $query      .= " AND vs.company_id =  $request->company_id";
      } 
       if (isset($request->product_id)) {
         $query      .= " AND vs.product_id = $request->product_id";
      } 
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
      if ($request->filter_by_value == '2') {
         // $where            =  " DATE(vs.created_at) BETWEEN '$request->start_date' AND '$request->end_date' AND vs.transaction_type != 4 ";
         $where            =  "DATE(vs.created_at) <= '$request->end_date' AND vs.transaction_type != 4";
         $group_order_by   =   "GROUP BY vs.product_id ORDER BY vs.id DESC";
      } else {
         $where            =  " DATE(vs.created_at) <= '$request->end_date' ";
         $group_order_by   =   "ORDER BY vs.id DESC";
      }
      if (isset($request->company_id)) {
         $query            = " vs.company_id =  $request->company_id AND $where";
      } else if (isset($request->product_id)) {
         $query            = " vs.product_id = $request->product_id AND $where";
      } else {
         $query            =  $where;
      }
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
                                    IFNULL((SELECT customer_name FROM customers WHERE id = (SELECT customer_id FROM sale_invoices WHERE sale_invoices.id=vs.sale_invoice_id)),'') AS customer_name
                                 FROM
                                 vendor_stocks vs
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
      $records          =  $this->SaleReportRecords($request, $current_date);
      return response()->json([
         'msg'     => 'Stock reports list fetched',
         'status'  => 'success',
         'stocks'  => $records
      ]);
   }
   public function SaleReportRecords($request, $current_date)
   {
      $query = " 1=1";
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
      }else{
         $query .=  " AND  DATE(ps.created_at) = '$current_date'";
      }
      if (isset($request->bill_no)) {
         $query       .=  " AND SUBSTRING_INDEX(si.invoice_no, '-', 1) = '$request->bill_no'";
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
                                 pr.sale_price
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
                                 pr.sale_price
                              FROM
                              sale_return_products as ps
                              LEFT JOIN sale_return_invoices si ON si.id = ps.sale_return_invoice_id
                              LEFT JOIN products pr ON pr.id = ps.product_id
                              LEFT JOIN companies co ON co.id = ps.company_id
                              WHERE
                              $query
                              ORDER BY si.invoice_no DESC
                  ");
        $replacement        =  DB::select("
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
        foreach($replacement as $rep){

            if($rep->product_type == 1 ){ //Return
                $returns[] = (object)[
                    'created' => $rep->created,
                    'product_name' => $rep->product_name,
                    'company_name' => $rep->company_name,
                    'invoice_no' => $rep->invoice_no,
                    'customer_id' => $rep->customer_id,
                    'customer_name' => $rep->customer_name,
                    'invoice_discount' => $rep->invoice_discount,
                    'invoice_type' => $rep->invoice_type,
                    'return_total_amount' => $rep->sale_total_amount,
                    'total_invoice_amount' => $rep->sale_total_amount,
                    'service_charges' => $rep->service_charges,
                    'qty' => $rep->qty,
                    'product_discount' => $rep->product_discount,
                    'product_id' => $rep->product_id,
                    'company_id' => $rep->company_id,
                    'product_type' => 2,
                ];
            }else{ //Sale

                $sales[]  = (object)[
                    'created' => $rep->created,
                    'product_name' => $rep->product_name,
                    'company_name' => $rep->company_name,
                    'invoice_no' => $rep->invoice_no,
                    'customer_id' => $rep->customer_id,
                    'customer_name' => $rep->customer_name,
                    'invoice_discount' => $rep->invoice_discount,
                    'invoice_type' => $rep->invoice_type,
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
      return ['sales' => $sales, 'sale_returns' => $returns ];
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
         'stocks'  => $records
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
      $saleRecords                     =  $this->SaleReportRecords($request, $closing_date);
      $customer_payment                =  DB::table("customer_ledger")->selectRaw("
                                             customer_id,
                                             IFNULL(cr,0) as cr,
                                             IFNULL(dr,0) as dr,
                                             trx_type
                                          ")
         ->whereRaw("
                                             DATE(created_at) = '$closing_date'
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
      $records->total_invoice_amount   =  collect($saleRecords['sales'])->SUM('total_invoice_amount');
      $records->total_invoice_discount =  collect($saleRecords['sales'])->SUM('invoice_discount');
      $records->total_service_charges  =  collect($saleRecords['sales'])->SUM('service_charges');
      $records->total_product_discount =  collect($saleRecords['sales'])->SUM('product_discount');
      $records->total_net_sales        =  collect($saleRecords['sales'])->WHERE('invoice_type', 1)->SUM('sale_total_amount');
      $records->total_credit_sales     =  collect($saleRecords['sales'])->WHERE('invoice_type', 2)->SUM('sale_total_amount');
      $records->customer_payment       =  collect($customer_payment)->WHERE('customer_id', '!=', 8)->WHERE('trx_type', 3)->SUM('dr');
      $records->vendor_payment         =  collect($vendor_payment)->SUM('dr');
      $records->ttl_cash_recovery      =  collect($customer_payment)->WHERE('customer_id', '!=', 8)->WHERE('trx_type', 3)->SUM('cr');
      $records->customer_ledger        =  $customer_payment;
      $records->vendor_ledger          =  $vendor_payment;
      $records->saleRecords            =  $saleRecords['sales'];


      // Vendor ko pay kr diye  => DR  ,,, jo system ny DENY hen wo = > CR
      // customer ny jo diyee  => DR  ,,,  jo system ny LENY hen wo = > CR

      return response()->JSON([
         'status'    => 'success',
         'records'   => $records
      ]);
   }
}
