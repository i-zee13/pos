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
   public function reportList(Request $request)
   {
      if ($request->current_url == 'vendor-reports') {
         $query    =  VendorLedger::where('customer_id', $request->vendor_id);
      } else {
         $query    =  CustomerLedger::where('customer_id', $request->vendor_id);
      }
      if ($request->start_date != '' && $request->end_date != '') {
         $query = $query->whereBetween('vendor_ledger.created_at', [$request->start_date, $request->end_date]);
      }
      $vendor = $query->get();
      return response()->json([
         'msg'     => 'Vendor reports list fetched',
         'status'  =>  'success',
         'vendor'  => $vendor
      ]);
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
      $query_expiry        =  "";
      $where               =  " DATE(vs.created_at) BETWEEN '$request->start_date' AND '$request->end_date' AND vs.transaction_type != 4";
      $group_order_by      =   "ORDER BY vs.balance DESC";
      if (isset($request->company_id)) {
         $query      = " vs.company_id =  $request->company_id AND $where";
      }
      else if (isset($request->product_id)) {
         $query      = " vs.product_id = $request->product_id AND $where";
      }
      else if (isset($request->expiry)) {
         $current_date        =   date('Y-m-d');
         $dateTime            =   new DateTime($current_date);
         if($request->expiry == '1'){
            $expiry_limit_date=   $dateTime->modify('+1 month')->format('Y-m-d');
         }else{
            $expiry_limit_date=   $dateTime->modify('+2 month')->format('Y-m-d');
         }
         $select_expiry       =  "DATE_FORMAT(pp.expiry_date,'%d-%m-%Y') AS expiry_date,";
         $query               =  "1=1";
         $group_order_by      =  "GROUP BY vs.purchase_invoice_id,vs.product_id ORDER BY vs.id DESC";
         $query_expiry        =  "JOIN products_purchases pp ON vs.purchase_invoice_id = pp.purchase_invoice_id 
                                 AND 
                                 vs.product_id = pp.product_id 
                                 AND 
                                 pp.expiry_date BETWEEN '$current_date' AND '$expiry_limit_date'";
      }else{
         $query      =  $where;
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

   public function allStockValueReport(){
      $companies  =   Company::select('id', 'company_name')->get();
      $products   =   Product::select('id', 'product_name')->get();
      return view('reports.stock-value-report', compact('companies', 'products'));
   }
   public function fetchStockValueReport(Request $request){
      if($request->filter_by_value == '2'){
         $where            =  " DATE(vs.created_at) BETWEEN '$request->start_date' AND '$request->end_date' AND vs.transaction_type != 4 ";
         $group_order_by   =   "GROUP BY vs.product_id ORDER BY vs.id DESC";
      }else{
         $where            =  " DATE(vs.created_at) BETWEEN '$request->start_date' AND '$request->end_date' AND vs.transaction_type = 1 ";
         $group_order_by   =   "";
      }
      if (isset($request->company_id)) {
         $query            = " vs.company_id =  $request->company_id AND $where";
      }
      else if (isset($request->product_id)) {
         $query            = " vs.product_id = $request->product_id AND $where";
      }
      else{
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

   
   //Sales Reports 

   public function saleReport(){
      $companies  =   Company::select('id','company_name')->get();
      $products   =   Product::select('id','product_name')->get();
      $customers  =   Customer::select('id','customer_name')->where('customer_type',2)->get();
         return view('reports.sale',compact('companies','products','customers'));
   }
   public function saleReportList(Request $request){ 
      $current_date     =  date('Y-m-d');
      $query            =  "";
      $where            =  " DATE(ps.created_at) = '$current_date'";
      if (isset($request->company_id)) {
         $query         = "$where AND ps.company_id = $request->company_id";
      }else if (isset($request->product_id)) {
         $query         = "$where AND ps.product_id = $request->product_id";
      }else if (isset($request->customer_id)) {
         $query         = "$where AND si.customer_id = $request->customer_id";
      }else if ($request->start_date != '' && $request->end_date != '') {
         $query         = "DATE(ps.created_at) BETWEEN '$request->start_date' AND '$request->end_date'";
      }else if($request->bill_no){
         $query         =  "$where AND SUBSTRING_INDEX(si.invoice_no, '-', 1) = '$request->bill_no'";
      }else{
         $query         =  $where;
      }
      $records          =  DB::select("
                              SELECT 
                                 DATE_FORMAT(ps.created_at,'%d-%m-%Y %h:%i %p') as created,
                                 IFNULL(
                                    (SELECT company_name FROM companies WHERE id = (SELECT company_id FROM products WHERE id = ps.product_id)), '') AS company_name
                                       ,
                                    IFNULL(
                                       (SELECT product_name FROM products WHERE id = ps.product_id),
                                       ''
                                 ) as product_name,
                                 si.invoice_no,
                                 si.invoice_discount AS invoice_discount,
                                 ps.sale_total_amount AS sale_total_amount,
                                 ps.qty AS qty,
                                 ps.product_discount AS product_discount
                              FROM 
                              products_sales as ps
                              LEFT JOIN sale_invoices si ON si.id = ps.sale_invoice_id 
                              WHERE 
                              $query
                              ORDER BY si.invoice_no DESC
                        ");
      return response()->json([
         'msg'     => 'Stock reports list fetched',
         'status'  => 'success',
         'stocks'  => $records
      ]);
   }
}
