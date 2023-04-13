<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\VendorLedger;
use Illuminate\Http\Request;

class ReportsController extends Controller
{
   
   
   public function customerReport(){
      $vendors   =   Customer::where('customer_type',2)->get();
       return view('reports.vendor',compact('vendors'));
     }
   public function vendorReport(){
    $vendors   =   Customer::where('customer_type',1)->get();
     return view('reports.vendor',compact('vendors'));
   }
   public function reportList(Request $request){
      if($request->current_url == 'vendor-reports'){
         $query    =  VendorLedger::where('customer_id',$request->vendor_id);
      }else{
         $query    =  CustomerLedger::where('customer_id',$request->vendor_id);
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
}
