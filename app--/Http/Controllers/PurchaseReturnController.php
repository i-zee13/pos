<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\VendorLedger;
use App\Models\Product;
use App\Models\ProductPurchase;
use App\Models\ProductReturns;
use App\Models\ReturnInvoice;
use App\Models\Stock;
use App\Models\VendorStock;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Auth;


class PurchaseReturnController extends Controller
{
    public function getVendorBalance(Request $request,$id){
        // $customer_balance = VendorLedger::where('customer_id',$id)->where('created_at','!=',Carbon::today()->toDateString())->orderBy('id', 'DESC')->value('balance');
        $customer_balance   =   Customer::where('id',$id)->value('balance');
        $product_balances = VendorStock::select('product_id', 'product_unit_price', 'balance')
                                        ->where('vendor_id', $id)
                                        ->whereIn('id', function ($query) use ($id) {
                                            $query->selectRaw('MAX(id)')
                                                ->from('vendor_stocks')
                                                ->whereColumn('product_id', 'vendor_stocks.product_id')
                                                ->where('vendor_id', $id)
                                                ->groupBy('product_id');
                                        })
                                        ->get();

                                // $product_balances        =   VendorStock::selectRaw('product_id,product_unit_price,sum(balance) as sum')
                                //             ->where('vendor_id',$id) 
                                //             ->groupBy('product_id')
                                //             ->get();
         return response()->json([
            'msg'         =>  'Vendor fetched',
            'status'      =>  'success',
            'product_ids' => $product_balances,
            'customer_balance'  => $customer_balance
        ]);
    }
    public function create(){
        $invoice_no          =   getPurchaseReturnNo();
        $parts               =   explode('-', $invoice_no); 
        $invoice_first_part  =   $parts[0];
        $current_date        =   Carbon::today()->toDateString();
        $products            =   Product::all();
        $customers           =   Customer::where('customer_type', 1)
                                            ->whereIn('id', function($query){
                                                $query->select('customer_id')
                                                    ->from('purchase_invoices')
                                                    ->groupBy('customer_id');
                                            })
                                ->get();
        return view('purchases.return.create',compact('customers','current_date','invoice_first_part','products'));
    }
    Public function store(Request $request){
        if($request->hidden_invoice_id){
            ProductReturns::where('return_invoice_id ',$request->hidden_invoice_id)->delete();
            // Stock::where('return_invoice_id ',$request->hidden_invoice_id)->delete();
            $invoice = ReturnInvoice::where('id',$request->hidden_invoice_id)->first();
        }else{
            $invoice = new ReturnInvoice();
        }
        $invoice->date           = $request->invoice_date;
        $invoice->invoice_no     = $request->invoice_no;
        $invoice->customer_id    = $request->customer_id;
        $invoice->total_invoice_amount = $request->grand_total;
        $invoice->created_by     = Auth::id();
        if($invoice->save()){
            if(count($request->purchased_product_array) > 0){
                foreach($request->purchased_product_array as $purchase_product){
                    $returns   =   new ProductReturns();
                    if($purchase_product['new_price'] != ''){
                        $returns->purchase_price  = $purchase_product['new_price'];
                    }else{
                        $returns->purchase_price  = $purchase_product['old_price'];
                    }
                    $returns->return_invoice_id = $invoice->id;
                    $returns->product_id      = $purchase_product['product_id'];
                    $returns_products_array[] = $returns->product_id;

                    $returns->expiry_date     = $purchase_product['expiry_date'];
                    $returns->qty             = $purchase_product['qty'];
                    $returns->purchased_total_amount =  $purchase_product['amount'];
                    $returns->created_by      = Auth::id();
                    if($returns->save()){
                        $check_stock    = VendorStock::where('product_id',$returns->product_id)->orderBy('id', 'DESC')->first();
                        if($check_stock){
                            $balance    =   $check_stock->balance; 
                        }else{
                            $balance = 0;
                        } 
                        $status = 0;    
                        $add_stock   =  new VendorStock();
                        if($request->hidden_invoice_id){
                            $stock   = VendorStock::where('return_invoice_id ',$request->hidden_invoice_id)
                                            ->where('product_id',$returns->product_id)->orderBy('id', 'DESC')->first();
                            $in_hand = 0;
                            if($stock){ 
                                if($returns->qty > $stock->qty){
                                    $in_hand   = $returns->qty-$stock->qty;
                                    $balance   = $balance-$in_hand;
                                    $status    = 2;     //out 
                                }else if($stock->qty > $returns->qty){
                                    $in_hand     = $stock->qty-$returns->qty;
                                    $balance     = $balance-$in_hand;
                                    $status      = 2;     //out 
                                }else if($returns->qty == $stock->qty){
                                    $in_hand     = $stock->qty;
                                    $balance     = $stock->balance;
                                    $status      = 1;     //in 
                                }
                                $add_stock->qty         = $in_hand;
                                $add_stock->status      = $status;      
                                $add_stock->balance     = $balance;
                            }else{
                                $add_stock->status      = 1;  //in    
                                $add_stock->balance     = $returns->qty+$balance;
                                $add_stock->qty         = $returns->qty;
                            }
                        }else{
                            $status      = 2 ; //out      
                            $add_stock->balance     = $balance-$returns->qty;
                            $add_stock->qty         = $returns->qty;
                            $add_stock->status      = $status;
                        }
                        $add_stock->transaction_type     =  3; //Returns
                        $add_stock->return_invoice_id    = $returns->return_invoice_id ;
                        $add_stock->product_unit_price   = $returns->purchase_price;
                        $add_stock->product_id           = $returns->product_id;
                        $add_stock->vendor_id            = $invoice->customer_id;
                        $add_stock->date                 = $returns->created_at;
                        $add_stock->amount               = $returns->purchased_total_amount;
                        $add_stock->created_by           =  Auth::id();
                        if($add_stock->save()){
                            $company_stock  =   new Stock();
                            $company_stock->vendor_stock_id  =  $add_stock->id;
                            $company_stock->product_id       =  $add_stock->product_id;
                            $company_stock->amount           =  $add_stock->amount;
                            $company_stock->qty              =  $add_stock->qty;
                            $company_stock->status           =  2; //out
                            $company_stock->balance          =  $add_stock->balance-$add_stock->qty;
                            $company_stock->created_by       =  Auth::id();
                            $company_stock->return_invoice_id   = $add_stock->return_invoice_id ;
                            $company_stock->product_unit_price  = $add_stock->product_unit_price;
                            $company_stock->save();
                            Product::where('id',$add_stock->product_id)->update([
                                'stock_balance' =>  $add_stock->balance,
                            ]);
                            // ProductPurchase::where('vendor_id',$invoice->customer_id)->where('product_id',$add_stock->product_id)->update([
                            //     'return_qty' =>  $add_stock->qty,
                            //     'qty_after_return' =>  ,
                                
                            // ])
                        }
                    }
                }
                 
                $customer_ledger = VendorLedger::where('customer_id',$request->customer_id)->orderBy('id', 'DESC')->first();
                if($customer_ledger){
                    // $credit  = $customer_ledger->credit;  //Out from System and Paid to Vendor;
                    // $debit   = $customer_ledger->debit;  //Insert to  System and Paid from Vendor/Cusomer;
                    $balance = $customer_ledger->balance;
                }else{
                    // $previous_cash_out  = 0;
                    // $previous_cash_in   = 0;
                    $balance        =   0;
                }
            
                $customer_ledger   =  new  VendorLedger();
               
                $customer_ledger->dr         = $request->purchased_total;
                // $customer_ledger->cr         = ($request->grand_total-$request->amount_paid)+$balance;
                $customer_ledger->date       = $request->invoice_date;
                $customer_ledger->return_invoice_id = $invoice->id;
                $customer_ledger->customer_id= $request->customer_id;
                $customer_ledger->trx_type   = 2 ; //Purchase inc

                // $customer_ledger->dr         = $request->amount_paid;
                $customer_ledger->balance    = ($balance-$request->purchased_total); //+balance
                $customer_ledger->created_by = Auth::id();
                $customer_ledger->save();
                Customer::where('id',$request->customer_id)->update([
                    'balance' => $customer_ledger->balance,
                ]);
                // $vendor          =  Customer::where('id',$request->customer_id)->first();
                // if($vendor){
                //     $vendor->credit     = $request->grand_total-$request->amount_paid;
                //     $vendor->debit      = $request->amount_paid;
                //     $vendor->updated_by = Auth::id();
                //     $vendor->save();
                    
                // }
            }
            return response()->json([
                'msg'       =>  'Product has added to Stock',
                'status'    =>  'success',
            ]);
        }
    }
}