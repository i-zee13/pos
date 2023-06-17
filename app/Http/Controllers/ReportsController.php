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
      $query         =  Stock::selectRaw('
                              (SELECT expiry_date FROM products_purchases WHERE products_purchases.product_id = stocks.product_id Limit 1) as expire_date,
                                stocks.balance as stock_count, product_unit_price as p_price ,
                                 IFNULL(
                                    (SELECT company_name FROM companies WHERE id = stocks.company_id),
                                    ""
                                ) as company_name,
                                IFNULL(
                                    (SELECT product_name FROM products WHERE id = stocks.product_id),
                                    ""
                                ) as product_name');

      //   
      if (isset($request->company_id)) {
         $query         = $query->where('stocks.company_id', $request->company_id);
      }
      if (isset($request->product_id)) {
         $query         = $query->where('stocks.product_id', $request->product_id);
      }
      if ($request->start_date != '' && $request->end_date != '') {
         $query      = $query->whereBetween('stocks.created_at', [$request->start_date, $request->end_date]);
      }
      $query      = $query->groupBy('stocks.product_id')
         ->orderBy('stocks.balance', 'DESC')
         ->get();

      return response()->json([
         'msg'     => 'Stock reports list fetched',
         'status'  =>  'success',
         'stocks'  => $query
      ]);
   }

   //Sales Reports 

   public function saleReport()
   {
      $companies  =   Company::select('id', 'company_name')->get();
      $products   =   Product::select('id', 'product_name')->get();
      return view('reports.sale', compact('companies', 'products'));
   }
   public function saleReportList(Request $request)
   {
        dd($request->all());
      $query         =  ProductSale::SelectRaw('
                            products_sales.*,
                            (SELECT invoice_no FROM sale_invoices WHERE id = products_sales.sale_invoice_id) as invoice_no,
                              IFNULL(
                                 (SELECT company_name FROM companies WHERE id = (SELECT company_id FROM products WHERE id = products_sales.product_id)), "") AS company_name
                                   ,
                                IFNULL(
                                    (SELECT product_name FROM products WHERE id = products_sales.product_id),
                                    ""
                              ) as product_name
                         ');
      if (isset($request->company_id)) {
         $query         = $query->where('products_sales.company_id', $request->company_id);
      }
      if (isset($request->product_id)) {
         $query         = $query->where('products_sales.product_id', $request->product_id);
      }
      if ($request->start_date != '' && $request->end_date != '') {
         $query      = $query->whereBetween('products_sales.created_at', [$request->start_date, $request->end_date]);
      }
      $query      = $query->groupBy('products_sales.product_id')
         ->orderBy('products_sales.sale_total_amount', 'DESC')
         ->get();
      return response()->json([
         'msg'     => 'Stock reports list fetched',
         'status'  =>  'success',
         'stocks'  => $query
      ]);
   }
}
