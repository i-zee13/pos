<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\VendorLedger;
use Illuminate\Http\Request; 
use App\Invoice_helper;

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

      if ($request->current_url == 'vendor-reports') {
         $query      =  VendorLedger::whereRaw("$dateFilter AND customer_id = $request->vendor_id")->orderBy('id', 'DESC')->get();
      } else {
         $query      =  CustomerLedger::whereRaw("$dateFilter AND customer_id = $request->vendor_id")->orderBy('id', 'DESC')->get();
      }
      return response()->json([
         'msg'       => 'Vendor reports list fetched',
         'status'    => 'success',
         'vendor'    => $query
      ]);
   }
   public function ledgerDetail($id)
   {
      $url = request()->url();
      $parts = explode('/', $url);
      $lastParameter = end($parts);

      $label = str_replace([' ', '%20'], '_', strtolower($lastParameter)); 
      if ($label === 'sale_inv') { 
         $invoice     = getSaleInv($id);  
      }elseif ($label == 'sale_return_inv') {
         $invoice     = getSaleReturnInv($id);
      } else if ($label == 'purchase_inv') {
         // 'Sale Return Inv'
      } elseif ($label == 'return_inv') {
         // 'Product Replace'
      } elseif ($label == 'product_replacement_inv') {
         // 'Return Inv'
       }
     
      return view('reports.detail',compact('invoice'));
   }
}
