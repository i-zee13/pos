<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\VendorLedger;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Auth, DB;
use Illuminate\Support\Facades\Route;

class TransactionController extends Controller
{
   public function customerLedger()
   {
      $operation    =   'customer';
      $current_date =   Carbon::today()->toDateString();
      $customers    =   Customer::where('customer_type', 2)->get(); 
      return view('transactions.customer', compact('current_date','customers','operation'));
      
   }
   public function vendorLedger()
   {
      $operation    =   'vendor';
      $current_date =   Carbon::today()->toDateString();
      $customers    =   Customer::where('customer_type', 1)->get();
      return view('transactions.vendor', compact('current_date','customers','operation'));
      
   }

   public function getCustomerLedgers(Request $request)
   {
     
      if ($request->operation == 'vendor') {
         $customers  =  VendorLedger::selectRaw('vendor_ledger.*,
                                       (SELECT customer_name FROM customers WHERE id = vendor_ledger.customer_id) as customer_name')
                                       ->leftjoin(DB::raw('(SELECT customer_id, MAX(id) as max_id FROM vendor_ledger GROUP BY customer_id) as t'), function ($join) {
                                          $join->on('vendor_ledger.customer_id', '=', 't.customer_id')
                                             ->on('vendor_ledger.id', '=', 't.max_id');
                                       })->whereDate('created_at', Carbon::today())
                                       ->groupby('customer_id')
                                       ->orderBy('vendor_ledger.id', 'DESC')
                                       ->get();
         $customers   = collect($customers)->filter(function ($item) {
                                       $item->rec = $item->selectRaw('SUM(cr) as total_cr , SUM(dr) as total_dr')->where('trx_type', 3)
                                          ->whereDate('created_at', Carbon::today())
                                          ->where('customer_id', $item->customer_id)
                                          ->get();
                                       return $item;
                        });
 
      } else {
         $customers  =  CustomerLedger::selectRaw('customer_ledger.*,
                                                 (SELECT customer_name FROM customers WHERE id = customer_ledger.customer_id) as customer_name')
                                          ->leftjoin(DB::raw('(SELECT customer_id, MAX(id) as max_id FROM customer_ledger GROUP BY customer_id) as t'), function ($join) {
                                             $join->on('customer_ledger.customer_id', '=', 't.customer_id')
                                                ->on('customer_ledger.id', '=', 't.max_id');
                                          })
                                          ->whereDate('created_at', Carbon::today())
                                          ->groupby('customer_id')
                                          ->orderBy('customer_ledger.id', 'DESC');  
         if($request->current_url == 'customer-ledger-jama'){
            $customers = $customers->where('cr','>',0)->where('crv_no','!=','')->get();
         }else{ 
            $customers = $customers->where('dr','>',0)->get();
         } 
                                          
         $customers   = collect($customers)->filter(function ($item) {
                                 $item->rec = $item->selectRaw('SUM(cr) as total_cr , SUM(dr) as total_dr')->where('trx_type', 3)
                                    ->whereDate('created_at', Carbon::today())
                                    ->where('customer_id', $item->customer_id)
                                    ->orderBy('customer_ledger.id', 'DESC')
                                    ->get();
                                       return $item;
                                    });
        
      } 
      return response()->json([
         'status'    => 'success',
         'msg'       => 'Customers Fetched',
         'customers' => $customers
      ]);
   }
   public function store(Request $request)
   {   
      if ($request->operation == 'vendor') {
         // $ledger              =   new VendorLedger();
         // $ledger->customer_id =  $request->hidden_vendor_id;
         // if ($request->amount_to == 1) {  //1 = CR
         //    $ledger->balance  =  $balance + $request->amount;
         // } else { // DR
         //    $ledger->balance  =  $balance - $request->amount;
         // }
         foreach ($request->hidden_cust_id as $key => $customer) {  
            // isEditable($customer);
            $balance                =   $request->hidden_cust_balance[$key];
            if($request->operation == 'vendor'){
               $ledger              =   new VendorLedger(); 
               if ($request->amount_to == 1) {  //1 = CR Ledger-jama
                  $ledger->cpv_no   =  getVendorCpvNo();
                  $ledger->balance  =  $balance - $request->amount[$key]; // minus jo mny dena hy .
                  $ledger->dr       =  $request->amount[$key];  
               } else { // DR Ledger-banam  
                  $ledger->crv_no   =  getVendorCrvNo(); 
                  $ledger->balance  =  $balance + $request->amount[$key];  // plus jo mny lena hy
                  $ledger->cr       =  $request->amount[$key];
               }
            }
            $ledger->customer_id    =   $customer;
            $ledger->trx_type       =   3;
            $ledger->is_editable    =   1;
            $ledger->comment        =   $request->comment[$key];    //Remarks of Payment
            $ledger->date           =   $request->transaction_date;
            $ledger->created_by     =   Auth::user()->id; 
            if($ledger->save()){ 
               Customer::where('id', $customer)->update([ 'balance' => $ledger->balance]);
            }
         }
      } else {
         
         foreach ($request->hidden_cust_id as $key => $customer) { 
            $balance                =   $request->hidden_cust_balance[$key];
            if($request->operation == 'vendor'){
               $ledger              =   new VendorLedger(); 
               isEditable($customer);
               if ($request->amount_to == 1) {  //1 = DR Ledger-jama
                  $ledger->crv_no   =  getVendorCrvNo();
                  $ledger->balance  =  $balance - $request->amount[$key]; // minus jo mny dena hy .
                  $ledger->dr       =  $request->amount[$key];  
               } else { // CR  Ledger-banam
                  $ledger->cpv_no   =  getVendorCpvNo(); 
                  $ledger->balance  =  $balance + $request->amount[$key];  // plus jo mny lena hy
                  $ledger->cr       =  $request->amount[$key];
               }
            }else{
               if($request->action == 'edit'){
                  $ledger              = CustomerLedger::where('customer_id',$customer)->first();
               }else{
                  $ledger              =   new CustomerLedger();
                  isEditable($customer);
               }
               if ($request->amount_to == 1) {     //1 = CR Ledger-jama
                  $ledger->crv_no   =  getCrvNo(); 
                  $ledger->balance  =  $balance - $request->amount[$key];
                  $ledger->cr       =  $request->amount[$key];
              
               } else {                            // DR Ledger-Banam
                  $ledger->cpv_no   =  getCpvNo();
                  $ledger->balance  =  $balance + $request->amount[$key];
                  $ledger->dr       =  $request->amount[$key];
               }
            }
            $ledger->customer_id =   $customer;
            $ledger->trx_type    =   3;
            $ledger->is_editable =   1;
            $ledger->comment     =   $request->comment[$key];    //Remarks of Payment
            $ledger->date        =   $request->transaction_date;
            $ledger->created_by  =   Auth::user()->id;
            if($ledger->save()){
               // dd($ledger);
               Customer::where('id', $customer)->update([ 'balance' => $ledger->balance]);
            }
           
         }
      }
      return response()->json([
         'msg'            =>  'Ledger Updated',
         'status'         =>  'success',
         'transaction_id' =>  $ledger->id,
         'customer_id'    =>  $ledger->customer_id,
      ]);
   }
   public function getCustomerTransactions(Request $request)
   {
      if($request->operation == 'vendor'){
         $transactions  =  VendorLedger::selectRaw('vendor_ledger.*,
                                                   (SELECT customer_name FROM customers WHERE id = vendor_ledger.customer_id) as customer_name')
                                          ->where('trx_type', 3)->whereDate('created_at', Carbon::today())->where('customer_id', $request->id)
                                          ->orderBy('vendor_ledger.id', 'ASC')
                                          ->get(); 

      }else{
          $transactions  =  CustomerLedger::selectRaw('customer_ledger.*,
                                                       (SELECT customer_name FROM customers WHERE id = customer_ledger.customer_id) as customer_name')
                                             ->where('trx_type', 3)->whereDate('created_at', Carbon::today())->where('customer_id', $request->id)
                                            ->orderBy('customer_ledger.id', 'ASC')
                                             ->get();
         $last_inserted  =  CustomerLedger::where('customer_id',$request->id)->where('is_editable',1)->first();
      }
     $customer_balance =  Customer::where('id',$request->id)->orderBy('id', 'DESC')->first('balance');
      return response()->json([
         'status' => 'success',
         'msg'    => 'Customers Fetched',
         'transactions' => $transactions,
         'last_inserted' => $last_inserted ,
         'customer' => $customer_balance 
      ]);
   }
   public function printInvoice($transaction_id, $customer_id,$operation ,$sro)
   {
      $transaction_id             =   $transaction_id;
      $customerId                 =   $customer_id;
      $customer_balance           =   0;
      if($operation =='vendor'){
         $invoice  =  VendorLedger::selectRaw('vendor_ledger.*,
                                                (SELECT customer_name FROM customers WHERE id = vendor_ledger.customer_id) as customer_name')
                                       ->where('customer_id', $customer_id)->where('id', $transaction_id)
                                       ->orderBy('vendor_ledger.id', 'DESC')
                                       ->first();
        return view('transactions.vendor_print', compact('invoice', 'type'));

      }else{
         $invoice  =  CustomerLedger::selectRaw('customer_ledger.*,
                                                (SELECT customer_name FROM customers WHERE id = customer_ledger.customer_id) as customer_name')
                                       ->where('customer_id', $customer_id)->where('id', $transaction_id)
                                       ->orderBy('customer_ledger.id', 'DESC')
                                       ->first();
         return view('transactions.print', compact('invoice', 'type'));
      }
   }
}
