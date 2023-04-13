<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductPurchase;
use App\Models\PurchaseInvoice;
use App\Models\Stock;
use App\Models\VendorLedger;
use App\Models\VendorStock;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Auth;


class StockController extends Controller
{
  
    public function create()
    {   
        $current_date =   Carbon::today()->toDateString();
        $customers    =   Customer::all();
        $products     =   Product::all();
        return view('purchases.add',compact('customers','current_date','products'));
    }
    public function getProduct(Request $request)
    {
        if($request->get_result_for == 1){
            $product    =  Product::where('products.product_name', $request->data_variable)->first();
        }else{
            $product    =  Product::where('products.barcode', $request->data_variable)->first();
        }
        // Stock::where('product_id',)
                        return response()->json([
                            'msg'       =>  'Product Fetched for Stock',
                            'status'    =>  'success',
                            'product'   =>   $product
                        ]);
    }
    public function getProducts()
    {
        $products     =    Product::all();
            return response()->json([
                'msg'       =>  'Product Fetched for Stock',
                'status'    =>  'success',
                'products'  =>   $products
            ]);
    }
     Public function purchaseInvoice(Request $request){
        if($request->hidden_invoice_id){
            ProductPurchase::where('purchase_invoice_id',$request->hidden_invoice_id)->delete();
            // Stock::where('purchase_invoice_id',$request->hidden_invoice_id)->delete();
            $invoice = PurchaseInvoice::where('id',$request->hidden_invoice_id)->first();
        }else{
            $invoice = new PurchaseInvoice();
        }
        $invoice->date           = $request->invoice_date;
        $invoice->invoice_no     = $request->invoice_no;
        $invoice->customer_id    = $request->customer_id;
        $invoice->paid_amount    = $request->amount_paid;
        $invoice->total_invoice_amount = $request->grand_total;
        $invoice->created_by     = Auth::id();
        if($invoice->save()){
            if(count($request->purchased_product_array) > 0){
                foreach($request->purchased_product_array as $purchase_product){
                    // dd($purchase_product['new_price']);
                    $purchased   =   new ProductPurchase();
                    if($purchase_product['new_price'] != ''){
                        $purchased->purchase_price  = $purchase_product['new_price'];
                    }else{
                        $purchased->purchase_price  = $purchase_product['old_price'];
                    }
                    $purchased->purchase_invoice_id = $invoice->id;
                    $purchased->product_id      = $purchase_product['product_id'];
                    $purchased->vendor_id       = $request->customer_id;

                    $purchased_products_array[] = $purchased->product_id;

                    $purchased->expiry_date     = $purchase_product['expiry_date'];
                    $purchased->qty             = $purchase_product['qty'];
                    $purchased->purchased_total_amount =  $purchase_product['amount'];
                    $purchased->created_by      = Auth::id();
                    if($purchased->save()){
                          $product = Product::where('id',$purchased->product_id)->first();
                          $product->expiry_date = $purchased->expiry_date;
                          if($purchase_product['new_price'] != ''){
                              $product->new_purchase_price = $purchase_product['new_price'];
                        }else{
                            $product->old_purchase_price  = $purchase_product['old_price'];
                        }
                        $product->updated_by = Auth::id();
                        $product->save();
                        $check_stock    = VendorStock::where('product_id',$purchased->product_id)->orderBy('id', 'DESC')->first();
                        if($check_stock){
                            $balance    =   $check_stock->balance; 
                        }else{
                            $balance = 0;
                        } 
                        $status = 0;    
                        $add_stock   =  new VendorStock();
                        if($request->hidden_invoice_id){
                            $stock   = VendorStock::where('purchase_invoice_id',$request->hidden_invoice_id)
                                            ->where('product_id',$purchased->product_id)->orderBy('id', 'DESC')->first();
                            $in_hand = 0;
                            if($stock){ 
                                if($purchased->qty > $stock->qty){
                                    $in_hand   = $purchased->qty-$stock->qty;
                                    $balance   = $balance+$in_hand;
                                    $status    = 1;     //in 
                                }else if($stock->qty > $purchased->qty){
                                    $in_hand = $stock->qty-$purchased->qty;
                                    $balance     = $balance-$in_hand;
                                    $status      = 2;     //out 
                                }else if($purchased->qty == $stock->qty){
                                    $in_hand     = $stock->qty;
                                    $balance     = $stock->balance;
                                    $status      = 1;     //in 
                                }
                                $add_stock->qty         = $in_hand;
                                $add_stock->status      = $status;      
                                $add_stock->balance     = $balance;
                            }else{
                                $add_stock->status      = 1;  //in    
                                $add_stock->balance     = $purchased->qty+$balance;
                                $add_stock->qty         = $purchased->qty;
                            }
                        }else{
                                $status      = 1;      
                                $add_stock->balance     = $purchased->qty+$balance;
                                $add_stock->qty         = $purchased->qty;
                                $add_stock->status      =   $status;
                        }
                        $add_stock->transaction_type     = 1; //Purchase
                        $add_stock->purchase_invoice_id  = $purchased->purchase_invoice_id;
                        $add_stock->product_unit_price   = $purchased->purchase_price;
                        $add_stock->product_id  = $purchased->product_id;
                        $add_stock->vendor_id   = $invoice->customer_id;
                        $add_stock->date        = $purchased->created_at;
                        $add_stock->amount      = $purchased->purchased_total_amount;
                        $add_stock->created_by  =  Auth::id();
                        if($add_stock->save()){
                            $company_stock  =   new Stock();
                            $company_stock->vendor_stock_id      =  $add_stock->id;
                            $company_stock->product_id           =  $add_stock->product_id;
                            $company_stock->amount               =  $add_stock->amount;
                            $company_stock->purchase_invoice_id  =  $add_stock->purchase_invoice_id;
                            $company_stock->product_unit_price   =  $add_stock->product_unit_price;
                            $company_stock->qty                  =  $add_stock->qty;
                            $company_stock->status               =  1; //out
                            $company_stock->date                 =  $purchased->created_at;
                            $company_stock->balance              =  $add_stock->balance; 
                            $company_stock->created_by           =  Auth::id();
                            $company_stock->save();
                            // dd($purchased_products_array);
                        //    
                            // $deleted_product = Stock::where('purchase_invoice_id',$request->hidden_invoice_id)
                            //                 ->whereNotIn('product_id',$purchased_products_array)->where('status',1)->orderBy('id', 'DESC')->get();
                           
                            // if($deleted_product){
                            //     foreach($deleted_product as $prod){
                            //     $out_stock  =   new Stock();
                            //     $out_stock->product_id  = $prod->product_id;
                            //     $out_stock->date        = $prod->created_at;
                            //     $out_stock->amount      = $prod->amount;
                            //     $out_stock->purchase_invoice_id  = $prod->purchase_invoice_id;
                            //     $out_stock->product_unit_price   = $prod->product_unit_price;
                            //     $out_stock->qty         = $prod->qty;
                            //     $out_stock->status      =   2; //out
                            //     $out_stock->balance     = $prod->balance-$prod->qty;
                            //     $out_stock->created_by  =  Auth::id();
                            //     $out_stock->save();
                            //      }
                            //     }
                            Product::where('id',$add_stock->product_id)->update([
                                'stock_balance' =>  $add_stock->balance,
                            ]);
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
                if($request->hidden_invoice_id){
                    $customer_ledger   = VendorLedger::where('purchase_invoice_id',$request->hidden_invoice_id)->orderBy('id', 'DESC')->first();
                }else{
                    $customer_ledger   =  new  VendorLedger();
                }
                $customer_ledger->cr         = $request->purchased_total;
                // $customer_ledger->cr         = ($request->grand_total-$request->amount_paid)+$balance;
                $customer_ledger->date       = $request->invoice_date;
                $customer_ledger->purchase_invoice_id= $invoice->id;
                $customer_ledger->trx_type   = 1 ; //Purchase inc

                $customer_ledger->customer_id= $request->customer_id;
                $customer_ledger->dr         = $request->amount_paid;
                $customer_ledger->balance    = ($request->grand_total-$request->amount_paid); //+balance
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
    public function getVendors(){
    
        $customers = Customer::where('customer_type',1)->get(); //1=vendor
        return response()->json([
            'msg'       => 'Vendor Fetched',
            'status'    => 'success',
            'customers' => $customers
        ]);
    }
    public function purchaseList(){
        $purchases = PurchaseInvoice::selectRaw('purchase_invoices.*,
                        (SELECT dr FROM vendor_ledger WHERE purchase_invoice_id = purchase_invoices.id) as paid_amount,
                        (SELECT customer_name FROM customers WHERE id=purchase_invoices.customer_id) as customer_name')
                        ->whereIn('purchase_invoices.id', function ($query) {
                            $query->selectRaw('MAX(id)')
                                ->from('purchase_invoices')
                                ->whereDate('created_at', Carbon::today())
                                ->groupBy('customer_id');
                        })
                        ->orderBy('id', 'desc')
                        ->get();
        return view('purchases.list',compact('purchases'));
    }
    public function editPurchase($id){
        $customers          =   Customer::all();
        $products           =   Product::all();
        $invoice            =   PurchaseInvoice::where('id',$id)->first();
        $purchasd_products  =  ProductPurchase::where('purchase_invoice_id', $id)
                                                ->selectRaw('(SELECT balance FROM vendor_stocks WHERE vendor_id = products_purchases.vendor_id ORDER BY id DESC LIMIT 1) as balance, products_purchases.*')
                                                ->from('products_purchases')
                                                ->get();
        $get_vendor_ledger  = VendorLedger::where('customer_id', $invoice->customer_id)->where('trx_type','!=',1)->orderBy('id', 'DESC')->first();
        return view('purchases.edit',compact('invoice','customers','products','customers','get_vendor_ledger'));
    }
    public function getPurchaseProduct($id){
        $products   =   ProductPurchase::where('products_purchases.purchase_invoice_id',$id)
                                    ->selectRaw('products_purchases.*, (SELECT product_name FROM products WHERE id=products_purchases.product_id) as product_name')->get();
                                   
        return response()->json([
            'msg'       => 'Vendor Fetched',
            'status'    => 'success',
            'products'  => $products
        ]);
    }
    public function getVendorBalance(Request $request,$id){
        if($request->segment == 'purchase-edit'){
            $customer_count     =  VendorLedger::where('customer_id',$id)->count();
           if($customer_count > 1){
               $customer_balance = VendorLedger::where('customer_id',$id)
                                                ->where('created_at','!=',Carbon::today()->toDateString())
                                                ->orderBy('id', 'DESC')->value('balance');
           }else{
                $customer_balance = 0;
           }
        }else{
            // $customer_balance = VendorLedger::where('customer_id',$id)->where('created_at','!=',Carbon::today()->toDateString())->orderBy('id', 'DESC')->value('balance');
            $customer_balance = Customer::where('id',$id)->value('balance');
        }
         return response()->json([
            'msg'       =>  'Vendor fetched',
            'status'    =>  'success',
            'customer_balance'  => $customer_balance
        ]);
    }
    public function deleteProduct(Request $request){
          $prod = VendorStock::where('purchase_invoice_id',$request->purchase_invoice_id)
                        ->where('product_id',$request->product_id)
                        ->where('status',1)->orderBy('id', 'DESC')->first();
            if($prod){
                    $out_stock              = new VendorStock();
                    $out_stock->vendor_id   = $prod->vendor_id;
                    $out_stock->product_id  = $prod->product_id;
                    $out_stock->date        = $prod->created_at;
                    $out_stock->amount      = $prod->amount;
                    $out_stock->qty         = $prod->qty;
                    $out_stock->status      =  2; //out
                    $out_stock->balance     =  $prod->balance-$prod->qty;
                    $out_stock->created_by  =  Auth::id();
                    $out_stock->purchase_invoice_id  = $prod->purchase_invoice_id;
                    $out_stock->product_unit_price   = $prod->product_unit_price;
                    if($out_stock->save()){
                        $company_stock                       =  new Stock();
                        $company_stock->vendor_stock_id      =  $out_stock->id;
                        $company_stock->product_id           =  $out_stock->product_id;
                        $company_stock->amount               =  $out_stock->amount;
                        $company_stock->purchase_invoice_id  =  $out_stock->purchase_invoice_id;
                        $company_stock->product_unit_price   =  $out_stock->product_unit_price;
                        $company_stock->qty                  =  $out_stock->qty;
                        $company_stock->status               =  2; //out
                        $company_stock->date                 =  Carbon::now();
                        $company_stock->balance              =  $out_stock->balance; 
                        $company_stock->created_by           =  Auth::id();
                        $company_stock->save();
                        Product::where('id',$out_stock->product_id)->update([
                            'stock_balance' =>  $out_stock->balance,
                        ]);
                        ProductPurchase::where('purchase_invoice_id',$request->purchase_invoice_id)
                                         ->where('product_id',$request->product_id)->delete();
                        return response()->json([
                            'msg'       => 'product removed',
                            'status'    => 'success',
                        ]);
                    }
                }else{
                    return response()->json([
                        'msg'       => 'not remove',
                        'status'    => 'failed',
                    ]);
                }
       
    }

    //Purchase Returns 

     
}
