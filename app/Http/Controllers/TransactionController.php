<?php

namespace App\Http\Controllers;

use App\Models\CustomerLedger;
use App\Models\VendorLedger;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Auth ,DB;
use Illuminate\Support\Facades\Route;

class TransactionController extends Controller
{
   Public function customerLedger(){
    $current_date =   Carbon::today()->toDateString();
    if(Route::currentRouteName() == 'vendor-ledgers'){
      return view('transactions.vendor',compact('current_date'));
    }else{
      return view('transactions.customer',compact('current_date'));
    }
   }
   public function getCustomerLedgers(Request $request){
      if($request->current_url == 'vendor-ledgers'){
         $customers  =  VendorLedger::selectRaw('vendor_ledger.*,
                                                (SELECT customer_name FROM customers WHERE id = vendor_ledger.customer_id) as customer_name')
                                       ->join(DB::raw('(SELECT customer_id, MAX(id) as max_id FROM vendor_ledger GROUP BY customer_id) as t'), function($join) {
                                          $join->on('vendor_ledger.customer_id', '=', 't.customer_id')
                                             ->on('vendor_ledger.id', '=', 't.max_id');
                                       })
                                       ->orderBy('vendor_ledger.id', 'DESC')
                                       ->get();
       }else{
         $customers  =  CustomerLedger::selectRaw('customer_ledger.*,
                                                   (SELECT customer_name FROM customers WHERE id = customer_ledger.customer_id) as customer_name')
                                          ->join(DB::raw('(SELECT customer_id, MAX(id) as max_id FROM customer_ledger GROUP BY customer_id) as t'), function($join) {
                                          $join->on('customer_ledger.customer_id', '=', 't.customer_id')
                                             ->on('customer_ledger.id', '=', 't.max_id');
                                          })
                                          ->orderBy('customer_ledger.id', 'DESC')
                                          ->get();
            }
                      
      return response()->json([
         'status' => 'success',
         'msg'    => 'Customers Fetched',
         'customers' => $customers
      ]);
   }
   public function store(Request $request)
   {
      $balance                =    $request->hidden_balance; 
      if($request->hidden_vendor_id){
         $ledger              =   new VendorLedger(); 
         $ledger->customer_id =  $request->hidden_vendor_id;
         if($request->amount_to == 1){  //1 = CR
            $ledger->balance  =  $balance+$request->amount;
         }else{ // DR
            $ledger->balance  =  $balance-$request->amount;
         }
      }else{
         $ledger              =   new CustomerLedger(); 
         $ledger->customer_id =  $request->hidden_customer_id;
         if($request->amount_to == 1){  //1 = CR
            $ledger->balance  =  $balance-$request->amount;
         }else{ // DR
            $ledger->balance  =  $balance+$request->amount;
         }
      }
      if($request->amount_to == 1){  
         $ledger->cr       =  $request->amount;
      }else{  
         $ledger->dr       =  $request->amount;
      }
      $ledger->trx_type    =  3;    //transactions
      $ledger->date        =  $request->transaction_date;  
      $ledger->created_by  =  Auth::user()->id;
      if($ledger->save()){
         return response()->json([
               'msg'   => 'Ledger Updated',
               'status'=>  'success',
               ]);
      }else{
         return response()->json([
               'msg'   => 'Ledger Not Updated',
               'status'=>  'failed',
               ]);
      }
           
        
   }
}
