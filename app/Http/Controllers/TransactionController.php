<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerLedger;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Auth ,DB;

class TransactionController extends Controller
{
   Public function customerLedger(){
    $current_date =   Carbon::today()->toDateString();
    return view('transactions.customer',compact('current_date'));
   }
   public function getCustomerLedgers(){
      $customers  =  CustomerLedger::selectRaw('customer_ledger.*,
                                                (SELECT customer_name FROM customers WHERE id = customer_ledger.customer_id) as customer_name')
                                       ->join(DB::raw('(SELECT customer_id, MAX(id) as max_id FROM customer_ledger GROUP BY customer_id) as t'), function($join) {
                                       $join->on('customer_ledger.customer_id', '=', 't.customer_id')
                                          ->on('customer_ledger.id', '=', 't.max_id');
                                       })
                                       ->orderBy('customer_ledger.id', 'DESC')
                                       ->get();
                      
      return response()->json([
         'status' => 'success',
         'msg'    => 'Customers Fetched',
         'customers' => $customers
      ]);
   }
   public function store(Request $request)
   {
      $ledger              =   new CustomerLedger(); 
      $balance             =  preg_replace('/[^0-9]/', '', $request->balance); 
      if($request->amount_to == 1){  //1 = CR
         $ledger->cr       =  $request->recevie_amount;
         $ledger->balance  =  $balance-$request->recevie_amount;
      }else{ // DR
         $ledger->dr       =  $request->recevie_amount;
         $ledger->balance  =  $balance+$request->recevie_amount;
      }
      $ledger->customer_id =  $request->hidden_customer_id;
      $ledger->trx_type    =  1;    //transactions
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
