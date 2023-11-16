<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\VendorLedger;
use Illuminate\Http\Request; 
require app_path('Invoice_helper.php');

class LedgerDetailControlller extends Controller
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
      $dateFilter    =  " 1=1";
      if ($request->start_date != '' && $request->end_date != '') {
         $dateFilter = " Date(created_at) BETWEEN '$request->start_date' AND '$request->end_date'";
      } 
      if (str_contains($request->current_url, 'vendor-reports')) {
         $query      =  VendorLedger::selectRaw('vendor_ledger.*,  DATE_FORMAT(created_at, "%h:%i %p") as formatted_created_at,
                                      IFNULL( CONCAT("PI ", (SELECT invoice_no FROM purchase_invoices WHERE purchase_invoices.id = vendor_ledger.purchase_invoice_id)) ,
                                             CONCAT("PR ", (SELECT invoice_no FROM purchase_return_invoices WHERE purchase_return_invoices.id = vendor_ledger.purchase_return_invoice_id))) AS invoice_no
                                       ')
                                       ->whereRaw("$dateFilter AND customer_id = $request->vendor_id")
                                      
                                       ->get();
     
      } else { 
         $query      = CustomerLedger::selectRaw('*, DATE_FORMAT(created_at, "%h:%i %p") as formatted_created_at,
                                                   COALESCE( CONCAT("SI ", (SELECT invoice_no FROM sale_invoices WHERE sale_invoices.id = customer_ledger.sale_invoice_id)) ,
                                                   CONCAT("SR ", (SELECT invoice_no FROM sale_return_invoices WHERE sale_return_invoices.id = customer_ledger.sale_return_invoice_id)),
                                                   CONCAT("SR ", (SELECT invoice_no FROM product_replacment_invoices WHERE product_replacment_invoices.id = customer_ledger.product_replacement_invoice_id))
                                                   ) AS invoice_no
                              
                                       ')->whereRaw("$dateFilter AND customer_id = $request->vendor_id")->get();
         // $query      =  CustomerLedger::whereRaw("$dateFilter AND customer_id = $request->vendor_id")->orderBy('id', 'DESC')->get();
      }
      return response()->json([
         'msg'       => 'Vendor reports list fetched',
         'status'    => 'success',
         'vendor'    => $query
      ]);
   }
   public function ledgerDetail($id)
   {
      $url     = request()->url();
      $parts   = explode('/', $url);
      $lastParameter = end($parts);

      $label = str_replace([' ', '%20'], '_', strtolower($lastParameter)); 
      if ($label === 'sale_inv') { 
         $invoice     = getSaleInv($id);  
      }elseif ($label == 'sale_return_inv') {
         $invoice     = getSaleReturnInv($id);
      } else if ($label == 'purchase_inv') {
         $invoice     = getPurchaseInv($id);
      } elseif ($label == 'return_inv') {
         $invoice     = getPurchaseReturnInv($id);
      } elseif ($label == 'product_replacement_inv') {
         $invoice     = getProductReplacementInv($id); 
         return view('reports.replacement-detail',compact('invoice'));
       } 
      return view('reports.detail',compact('invoice'));
   } 
}
