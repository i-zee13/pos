<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\Product;
use App\Models\ProductSale;
use App\Models\Sale;
use App\Models\Stock;
use App\Models\VendorStock;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Auth;


class SaleController extends Controller
{
   
    public function create()
    {   $invoice_no   =  'inv-'.Str::uuid()->toString();
        $current_date =   Carbon::today()->toDateString();
        $customers    =   Customer::where('customer_type',2)->select('id','customer_name', 'balance')->get();
        $products     =    Product::all();
        return view('sales.add',compact('customers','current_date','invoice_no','products'));
    }
    public function getVendors(){
        $customers      = Customer::where('customer_type',2)->get(); //1=vendor
        return response()->json([
            'msg'       => 'Vendor Fetched',
            'status'    => 'success',
            'customers' => $customers
        ]);
    }
    Public function saleInvoice(Request $request){
        // dd($request->all());
        if($request->hidden_invoice_id){
            Sale::where('purchase_invoice_id',$request->hidden_invoice_id)->delete();
            // Stock::where('purchase_invoice_id',$request->hidden_invoice_id)->delete();
            $invoice = Sale::where('id',$request->hidden_invoice_id)->first();
        }else{
            $invoice = new Sale();
        }
        $invoice->date                 = $request->invoice_date;
        $invoice->invoice_no           = $request->invoice_no;
        $invoice->customer_id          = $request->customer_id;
        $invoice->total_invoice_amount = $request->grand_total;
        $invoice->created_by           = Auth::id();
        if($invoice->save()){
            if(count($request->sales_product_array) > 0){
                foreach($request->sales_product_array as $sale_product){
                    // dd($sale_product['new_price']);
                    $sale                      = new ProductSale();
                    $sale->sale_price          = $sale_product['retail_price'];
                    $sale->sale_invoice_id     = $invoice->id;
                    $sale->product_id          = $sale_product['product_id'];
                    $sale->qty                 = $sale_product['qty'];
                    $sale->sale_total_amount   = $sale_product['amount'];
                    $sale->created_by          = Auth::id();
                    if($sale->save()){
                        $sale_products_array[] = $sale->product_id;
                        $check_stock           = VendorStock::where('product_id',$sale->product_id)->orderBy('id', 'DESC')->first();
                        if($check_stock){
                            $balance           =  $check_stock->balance; 
                        } 
                        $status = 0;    
                        $add_stock   =  new VendorStock();
                        if($request->hidden_invoice_id){
                            $stock   = VendorStock::where('purchase_invoice_id',$request->hidden_invoice_id)
                                            ->where('product_id',$sale->product_id)->orderBy('id', 'DESC')->first();
                            $in_hand = 0;
                            if($stock){ 
                                if($sale->qty > $stock->qty){
                                    $in_hand   = $sale->qty-$stock->qty;
                                    $balance   = $balance+$in_hand;
                                    $status    = 1;     //in 
                                }else if($stock->qty > $sale->qty){
                                    $in_hand = $stock->qty-$sale->qty;
                                    $balance     = $balance-$in_hand;
                                    $status      = 2;     //out 
                                }else if($sale->qty == $stock->qty){
                                    $in_hand     = $stock->qty;
                                    $balance     = $stock->balance;
                                    $status      = 1;     //in 
                                }
                                $add_stock->qty         = $in_hand;
                                $add_stock->status      = $status;      
                                $add_stock->balance     = $balance;
                            }else{
                                $add_stock->status      = 1;  //in    
                                $add_stock->balance     = $sale->qty+$balance;
                                $add_stock->qty         = $sale->qty;
                            }
                        }else{
                            $status                  =  2; //Out      
                            $add_stock->balance      =  $balance-$sale->qty;
                            $add_stock->qty          =  $sale->qty;
                            $add_stock->status       =  2; //Out
                        }
                        $add_stock->sale_invoice_id      =  $sale->sale_invoice_id;
                        $add_stock->product_unit_price   =   $sale_product['purchased_price'];
                        $add_stock->product_id           =  $sale->product_id;
                        $add_stock->vendor_id            =  $invoice->customer_id;
                        $add_stock->date                 =  $sale->created_at;
                        $add_stock->amount               =  $sale->sale_total_amount;
                        $add_stock->created_by           =  Auth::id();
                        if($add_stock->save()){
                            $company_stock               =  new Stock();
                            $company_stock->product_id   =  $add_stock->product_id;
                            $company_stock->amount       =  $add_stock->amount;
                            $company_stock->qty          =  $add_stock->qty;
                            $company_stock->status       =  2;    //out
                            $company_stock->balance      =  $add_stock->balance-$add_stock->qty;
                            $company_stock->created_by   =  Auth::id();
                            $company_stock->vendor_stock_id      = $add_stock->id;
                            $company_stock->product_unit_price   = $add_stock->product_unit_price;
                            $company_stock->sale_invoice_id  = $add_stock->sale_invoice_id;
                            $company_stock->save();
                            Product::where('id',$add_stock->product_id)->update([
                                'stock_balance' =>  $add_stock->balance,
                            ]);
                        }
                    }
                }
                 
                $customer_ledger = CustomerLedger::where('customer_id',$request->customer_id)->orderBy('id', 'DESC')->first();
                if($customer_ledger){
                    $balance           =   $customer_ledger->balance;
                }else{
                    $balance           =   0;
                }
                if($request->hidden_invoice_id){
                    $customer_ledger   =   CustomerLedger::where('sale_invoice_id',$request->hidden_invoice_id)->orderBy('id', 'DESC')->first();
                }else{
                    $customer_ledger   =   new  CustomerLedger();
                }
                $customer_ledger->cr          = $request->sale_total_amount;
                $customer_ledger->date        = $request->invoice_date;
                $customer_ledger->customer_id = $request->customer_id;
                $customer_ledger->dr          = $request->amount_paid;
                $customer_ledger->balance     = ($request->grand_total-$request->amount_paid); //balance
                $customer_ledger->created_by  = Auth::id();
                $customer_ledger->sale_invoice_id= $invoice->id;
                $customer_ledger->save();
                Customer::where('id',$request->customer_id)->update([
                    'balance' => $customer_ledger->balance,
                ]);
            }
            return response()->json([
                'msg'       =>  'Product Invoice has generated.',
                'status'    =>  'success',
            ]);
        }
    }
}
