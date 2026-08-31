<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\VendorLedger;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; 

class TransactionController extends Controller
{
   public function customerLedger()
   {
      $operation    =   'customer';
      $current_date =   Carbon::today()->toDateString();
      $customers    =   Customer::where('customer_type', 2)->get();
      return view('transactions.customer', compact('current_date', 'customers', 'operation'));
   }
   public function vendorLedger()
   {
      $operation    =   'vendor';
      $current_date =   Carbon::today()->toDateString();
      $customers    =   Customer::where('customer_type', 1)->get();
      return view('transactions.vendor', compact('current_date', 'customers', 'operation'));
   }
   public function getLedgerPurchi()
   {
      $current_date =   Carbon::today()->toDateString();
      $customers    =   Customer::where('customer_type', 2)->get();
      return view('transactions.purchi', compact('current_date', 'customers'));
   }

   public function getCustomerLedgers(Request $request)
   { 
     $request['date'] = $request->date != null ? $request->date :  Carbon::today();
      if ($request->operation == 'vendor') {
         $customers  =  VendorLedger::selectRaw('vendor_ledger.*,
                                       (SELECT customer_name FROM customers WHERE id = vendor_ledger.customer_id) as customer_name,
                                       (SELECT balance FROM customers WHERE id = vendor_ledger.customer_id) as customer_balance')
                                       ->leftjoin(DB::raw('(SELECT customer_id, MAX(id) as max_id FROM vendor_ledger GROUP BY customer_id) as t'), function ($join) {
                                          $join->on('vendor_ledger.customer_id', '=', 't.customer_id')
                                             ->on('vendor_ledger.id', '=', 't.max_id');
                                       })->whereDate('date', $request->date ?? Carbon::today())
                                       ->groupby('vendor_ledger.customer_id')
                                       ->orderBy('vendor_ledger.id', 'DESC');
        
         if (str_contains($request->current_url, 'vendor-ledger-jama')) {
            $customers = $customers->where('cr', '>', 0)->where('crv_no', '!=', '')->get();
         } else {
            $customers = $customers->where('dr', '>', 0)->where('cpv_no', '!=', '')->whereNotIn('vendor_ledger.customer_id',[114])->get();
         }
         $customers   = collect($customers)->filter(function ($item) use($request) {
            $item->rec = $item->selectRaw('SUM(cr) as total_cr , SUM(dr) as total_dr')->where('trx_type', 3)
               ->whereDate('created_at', $request->date ?? Carbon::today())
               ->where('vendor_ledger.customer_id', $item->customer_id)
               ->orderBy('vendor_ledger.id', 'DESC')
               ->get();
            return $item;
         });
      } else {
         $customers  =  CustomerLedger::selectRaw('customer_ledger.*,
                                                 (SELECT customer_name FROM customers WHERE id = customer_ledger.customer_id) as customer_name,
                                                 (SELECT balance FROM customers WHERE id = customer_ledger.customer_id) as customer_balance')
                                       ->leftjoin(DB::raw('(SELECT customer_id, MAX(id) as max_id FROM customer_ledger GROUP BY customer_id) as t'), function ($join) {
                                          $join->on('customer_ledger.customer_id', '=', 't.customer_id')
                                             ->on('customer_ledger.id', '=', 't.max_id');
                                       })
                                       ->whereDate('date', "$request->date" ?? Carbon::today())
                                       ->groupby('customer_id')
                                       ->orderBy('customer_ledger.id', 'DESC');
         if (str_contains($request->current_url, 'customer-ledger-jama')) {
            $customers = $customers->where('cr', '>', 0)->where('crv_no', '!=', '')->get();
         } else {
            $customers = $customers->where('dr', '>', 0)->where('cpv_no', '!=', '')->get();
         }
         $customers   = collect($customers)->filter(function ($item) use($request){
            $item->rec = $item->selectRaw('SUM(cr) as total_cr , SUM(dr) as total_dr')->where('trx_type', 3)
               ->whereDate('created_at', $request->date ?? Carbon::today())
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
      try {
         if (empty($request->hidden_cust_id) || !is_array($request->hidden_cust_id)) {
            return response()->json([
               'msg'    => 'Please select a customer',
               'status' => 'failed',
            ], 422);
         }

         $ledger = null;

         if ($request->operation == 'vendor') {
            foreach ($request->hidden_cust_id as $key => $customer) {
               $balance = (float) (VendorLedger::where('customer_id', $customer)
                  ->where('is_editable', '!=', 1)
                  ->orderBy('id', 'desc')
                  ->value('balance') ?? 0);

               if ($request->action == 'edit') {
                  $ledger = VendorLedger::where('customer_id', $customer)
                     ->where('is_editable', 1)
                     ->where('trx_type', 3)
                     ->orderBy('created_at', 'desc')
                     ->first();
                  if (!$ledger) {
                     $ledger = new VendorLedger();
                  }
               } else {
                  $ledger = new VendorLedger();
                  isEditable($customer);
                  $balance = (float) (VendorLedger::where('customer_id', $customer)
                     ->where('is_editable', '!=', 1)
                     ->orderBy('id', 'desc')
                     ->value('balance') ?? 0);
               }

               $amount = (float) ($request->amount[$key] ?? 0);
               if ($request->amount_to == 1) {  //1 = CR Ledger-jama (payment to vendor)
                  $ledger->cpv_no  = getVendorCpvNo();
                  $ledger->balance = $balance - $amount;
                  $ledger->dr      = $amount;
                  $ledger->cr      = 0;
               } else { // DR Ledger-banam
                  $ledger->crv_no  = getVendorCrvNo();
                  $ledger->balance = $balance + $amount;
                  $ledger->cr      = $amount;
                  $ledger->dr      = 0;
               }

               $ledger->customer_id         = $customer;
               $ledger->trx_type            = 3;
               $ledger->is_editable         = 1;
               $ledger->is_deleted          = 0;
               // SQLite: purchase_invoice_id is NOT NULL
               $ledger->purchase_invoice_id = (int) ($ledger->purchase_invoice_id ?? 0);
               $ledger->comment             = $request->comment[$key] ?? '';
               $ledger->date                = $request->transaction_date ?: now()->toDateString();
               $ledger->created_by          = Auth::id() ?: 1;
               $ledger->created_at          = Carbon::now()->addMinutes(1);

               if ($ledger->save()) {
                  Customer::where('id', $customer)->update(['balance' => $ledger->balance]);
               }
            }
         } else {
            foreach ($request->hidden_cust_id as $key => $customer) {
               $balance = (float) (CustomerLedger::where('customer_id', $customer)
                  ->where('is_editable', '!=', 1)
                  ->orderBy('id', 'desc')
                  ->value('balance') ?? 0);

               if ($request->action == 'edit') {
                  $ledger = CustomerLedger::where('customer_id', $customer)
                     ->where('is_editable', 1)
                     ->where('trx_type', 3)
                     ->orderBy('created_at', 'desc')
                     ->first();
                  if (!$ledger) {
                     $ledger = new CustomerLedger();
                  }
               } else {
                  $ledger = new CustomerLedger();
                  isEditable($customer);
                  $balance = (float) (CustomerLedger::where('customer_id', $customer)
                     ->where('is_editable', '!=', 1)
                     ->orderBy('id', 'desc')
                     ->value('balance') ?? 0);
               }

               $amount = (float) ($request->amount[$key] ?? 0);
               if ($request->amount_to == 1) {     //1 = CR Ledger-jama (cash received)
                  $ledger->crv_no  = getCrvNo();
                  $ledger->balance = $balance - $amount;
                  $ledger->cr      = $amount;
                  $ledger->dr      = 0;
               } else {                            // DR Ledger-Banam
                  $ledger->cpv_no  = getCpvNo();
                  $ledger->balance = $balance + $amount;
                  $ledger->dr      = $amount;
                  $ledger->cr      = 0;
               }

               $ledger->customer_id      = $customer;
               $ledger->trx_type         = 3;
               $ledger->is_editable      = 1;
               $ledger->is_deleted       = 0;
               // SQLite: sale_invoice_id is NOT NULL — cash trx has no sale invoice
               $ledger->sale_invoice_id  = (int) ($ledger->sale_invoice_id ?? 0);
               $ledger->comment          = $request->comment[$key] ?? '';
               $ledger->date             = $request->transaction_date ?: now()->toDateString();
               $ledger->created_by       = Auth::id() ?: 1;
               $ledger->created_at       = Carbon::now()->addMinutes(1);

               if ($ledger->save()) {
                  Customer::where('id', $customer)->update(['balance' => $ledger->balance]);
               }
            }
         }

         if (!$ledger) {
            return response()->json([
               'msg'    => 'No transaction saved',
               'status' => 'failed',
            ], 500);
         }

         return response()->json([
            'msg'            => 'Ledger Updated',
            'status'         => 'success',
            'transaction_id' => $ledger->id,
            'customer_id'    => $ledger->customer_id,
         ]);
      } catch (\Throwable $e) {
         \Log::error('transaction-store failed: '.$e->getMessage(), [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
         ]);
         return response()->json([
            'msg'    => 'Transaction save failed: '.$e->getMessage(),
            'status' => 'failed',
         ], 500);
      }
   }
   public function saveTransaction(Request $request)
   {
      try {
         if ($request->type == 'print') {
            return response()->json([
               'msg'    => 'Ledger Updated',
               'status' => 'success',
            ]);
         }
         foreach ($request->customers as $key => $customer) {
            isEditable($customer['id']);
            $balance = (float) (CustomerLedger::where('customer_id', $customer['id'])
               ->orderBy('created_at', 'desc')
               ->value('balance') ?? 0);
            $ledger = new CustomerLedger();
            $ledger->crv_no = getCrvNo();
            $ledger->balance = $balance - (float) $customer['receiving_amount'];
            $ledger->cr = (float) $customer['receiving_amount'];
            $ledger->dr = 0;
            $ledger->customer_id = $customer['id'];
            $ledger->trx_type = 3;
            $ledger->is_editable = 1;
            $ledger->is_deleted = 0;
            $ledger->sale_invoice_id = 0; // SQLite NOT NULL
            $ledger->comment = 'Bulk';
            $ledger->date = now()->toDateString();
            $ledger->created_at = Carbon::now()->addMinutes(1);
            $ledger->created_by = Auth::id() ?: 1;
            if ($ledger->save()) {
               Customer::where('id', $customer['id'])->update(['balance' => $ledger->balance]);
            }
         }
         return response()->json([
            'msg'    => 'Ledger Updated',
            'status' => 'success',
         ]);
      } catch (\Throwable $e) {
         \Log::error('save-tranasctions failed: '.$e->getMessage());
         return response()->json([
            'msg'    => 'Transaction save failed: '.$e->getMessage(),
            'status' => 'failed',
         ], 500);
      }
   }
   public function getCustomerTransactions(Request $request)
   {
      if ($request->operation == 'vendor') {
         $transactions  =  VendorLedger::selectRaw('vendor_ledger.*,
                                                   (SELECT customer_name FROM customers WHERE id = vendor_ledger.customer_id) as customer_name')
            ->where('trx_type', 3)->whereDate('created_at', Carbon::today())->where('customer_id', $request->id)
            ->orderBy('vendor_ledger.id', 'ASC')
            ->get();
         $last_inserted  =  VendorLedger::where('customer_id', $request->id)->where('is_editable', 1)->first();
      } else {
         $transactions  =  CustomerLedger::selectRaw('customer_ledger.*,
                                                       (SELECT customer_name FROM customers WHERE id = customer_ledger.customer_id) as customer_name')
            ->where('trx_type', 3)->whereDate('created_at', Carbon::today())->where('customer_id', $request->id)
            ->orderBy('customer_ledger.id', 'ASC')
            ->get();
         $last_inserted  =  CustomerLedger::where('customer_id', $request->id)->where('is_editable', 1)->first();
      }
      $customer_balance =  Customer::where('id', $request->id)->orderBy('id', 'DESC')->first('balance');
      return response()->json([
         'status'        => 'success',
         'msg'           => 'Customers Fetched',
         'transactions'  => $transactions,
         'customer'      => $customer_balance,
         'last_inserted' => $last_inserted,
      ]);
   }
   public function printInvoice($transaction_id, $customer_id, $operation, $sro)
   {
      $transaction_id             =   $transaction_id;
      $customerId                 =   $customer_id;
      $customer_balance           =   0;
      $type           =   $sro;
      if ($operation == 'vendor') {
         $invoice  =  VendorLedger::selectRaw('vendor_ledger.*,
                                                (SELECT customer_name FROM customers WHERE id = vendor_ledger.customer_id) as customer_name')
            ->where('customer_id', $customer_id)->where('id', $transaction_id)
            ->orderBy('vendor_ledger.id', 'DESC')
            ->first();
         return view('transactions.vendor_print', compact('invoice', 'type'));
      } else {
         $invoice  =  CustomerLedger::selectRaw('customer_ledger.*,
                                                (SELECT customer_name FROM customers WHERE id = customer_ledger.customer_id) as customer_name')
            ->where('customer_id', $customer_id)->where('id', $transaction_id)
            ->orderBy('customer_ledger.id', 'DESC')
            ->first();
         return view('transactions.print', compact('invoice', 'type'));
      }
   }
   public function printPurchi(Request $request,$customers)
   {
         $customers      = json_decode($customers,true);
         $ledgerCount    = 0;  
         // $customers = CustomerLedger::where('customer_ledger.is_editable',1)->where('customer_ledger.comment','Bulk')
         //                                     // ->whereDate('customer_ledger.created_at', '!=', Carbon::today()->toDateString())
         //                                     ->join('customers','customer_ledger.customer_id','=','customers.id')
         //                                     ->select('customer_ledger.*','customers.customer_name')
         //                                     ->orderBy('customer_ledger.id', 'DESC')->get(); 
       return view('transactions.bulk-transaction-invoice', compact('customers'));
   }
}
