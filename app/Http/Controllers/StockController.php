<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductPurchase;
use App\Models\PurchaseInvoice; 
use App\Models\VendorLedger;
use App\Models\VendorStock;
use Carbon\Carbon;
use Illuminate\Http\Request; 
use Auth; 

class StockController extends Controller
{
    public function create() {
        $invoice_no   =   getPurchaseInvoice();
        $parts        = explode('-', $invoice_no);
        $invoice_first_part   = $parts[0];
        $current_date =   Carbon::today()->toDateString();
        $customers    =   Customer::all();
        $products     =   Product::get();
        return view('purchases.add',compact('customers','current_date','products','invoice_no','invoice_first_part'));
    }
    public function getProduct(Request $request){
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
    public function getProducts(){
        $products     =    Product::withoutTrashed()->get();
            return response()->json([
                'msg'       =>  'Product Fetched for Stock',
                'status'    =>  'success',
                'products'  =>   $products
            ]);
    }
    public function updateStock($previous_qty, $sale, $balance, $vendor_id, $type)
    {
        $old_record = '';
        $old_record          =  $sale;
        $v                   =  new VendorStock();
        $v->vendor_id        =  $sale->vendor_id; 
        $v->transaction_type =  1;  //Purchase
        if($previous_qty > 0){
            $v->qty         =  $previous_qty;
            $v->status      =   2 ;   //Out
            $v->balance     =   $balance - $v->qty;
        }else{
            $v->status      =    1;   // IN
            $v->qty         =   $sale->qty;
            $v->balance     =   $balance +  $v->qty;
        } 
        $v->purchase_invoice_id  =  $sale->purchase_invoice_id;
        $v->product_unit_price   =  $sale->purchase_price;
        $v->company_id           =  $sale->company_id;
        $v->product_id           =  $sale->product_id;
        $v->date                 =  $sale->created_at;
        $v->amount               =   $sale->purchased_total_amount;
        $v->created_by           =  Auth::id();
        $v->save();
        return $v;
    }
     Public function purchaseInvoice(Request $request){ 
        if($request->hidden_invoice_id){ 
            $invoice = PurchaseInvoice::where('id',$request->hidden_invoice_id)->first();
        }else{
            isEditable($request->customer_id);
            $invoice = new PurchaseInvoice();
        }
        $invoice->date                 = $request->invoice_date;
        $invoice->invoice_no           = $request->invoice_no;
        $invoice->invoice_type         = $request->invoice_type;
        $invoice->customer_id          = $request->customer_id;
        if ($request->invoice_type == 1) {
            $invoice->paid_amount      = $request->amount_to_pay;
        } else {
            $invoice->paid_amount      = $request->amount_received ? $request->amount_received : 0;
        }
        $invoice->total_invoice_amount = ($request->product_net_total + $request->service_charges + $request->previous_receivable) - $request->invoice_discount;
        $invoice->invoice_remaining_amount_after_pay  =  $invoice->total_invoice_amount - $invoice->paid_amount;
        $invoice->service_charges      = $request->service_charges;
        $invoice->invoice_discount     = $request->invoice_discount;
        $invoice->cash_return          = $request->cash_return;
        $invoice->product_net_total    = $request->product_net_total;
        $invoice->previous_receivable  = $request->previous_receivable;
        $invoice->is_editable          = 1;
        $invoice->status               = $request->invoice_type;
        $invoice->description          = $request->description;
        $invoice->created_by           = Auth::id();
        
        
        if($invoice->save()){
            if(count($request->purchased_product_array) > 0){
                foreach($request->purchased_product_array as $purchase_product){ 
                    if ($purchase_product['purchase_prod_id'] > 0) {
                        $purchased          =  ProductPurchase::where('id', $purchase_product['purchase_prod_id'])->first();
                    }else{
                        $purchased          =  new ProductPurchase();
                    }
                    if($purchase_product['new_price'] != ''){ 
                        $purchased->purchase_price  = $purchase_product['new_price'];
                    }else{
                        $purchased->purchase_price  = $purchase_product['old_price'];
                    }

                    $purchased->purchase_invoice_id     = $invoice->id;
                    $purchased->product_id              = $purchase_product['product_id'];
                    $purchased->vendor_id               = $request->customer_id;
                    $purchased->expiry_date             = $purchase_product['expiry_date'];
                    $purchased->purchased_total_amount  = $purchase_product['amount'];
                    $purchased->company_id              = Product::where('id', $purchase_product['product_id'])->value('company_id');
                    $purchased->qty                     = $purchase_product['qty'];
                    $purchased->product_discount        = $purchase_product['prod_discount'];
                    $purchased->sale_price              = $purchase_product['sale_price']; 
                    $purchased->created_by              = Auth::id();
                    $previous_qty = ProductPurchase::where('purchase_invoice_id', $request->hidden_invoice_id)
                                                ->where('product_id', $purchased->product_id)
                                                ->orderBy('id', 'Desc')
                                                ->value('qty');
                    if($purchased->save()){
                        $purchased_products_array[] = $purchased->id;
                        $check_stock           =  VendorStock::where('product_id', $purchased->product_id)->orderBy('id', 'DESC')->first();
                        $balance = 0;
                        $vendor_id = 0;
                        if ($check_stock) {
                            $vendor_id         =  $check_stock->vendor_id;
                            $balance           =  $check_stock->balance;
                        }
                        $status = 0;
                        if ($request->hidden_invoice_id) {
                            if ($previous_qty != 0) {
                                $v          = $this->updateStock($previous_qty, $purchased, $balance, $vendor_id, 'vendor');
                                $balance    =  $v->balance;
                            }
                        }
                        $v_stock = $this->updateStock($previous_qty = 0, $purchased, $balance, $vendor_id, 'vendor');

                        if ($v_stock->save()) {
                            $purchased->vendor_stock_id = $v_stock->id; 
                            Product::where('id', $v_stock->product_id)->update([
                                'stock_balance' =>  $v_stock->balance,
                            ]);
                        }
                        //Update Product Price
                          $product              = Product::where('id',$purchased->product_id)->first();
                          $company_id           = $product->company_id;
                          $product->expiry_date = $purchased->expiry_date;
                          $product->sale_price  = $purchased->sale_price;
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
                        Product::where('id',$v_stock->product_id)->update([
                            'stock_balance' =>  $v_stock->balance,
                        ]);
                        // }
                    }
                }
                if ($request->hidden_invoice_id) {
                   ProductPurchase::where('purchase_invoice_id', $request->hidden_invoice_id)
                                    ->whereNotIn('id', $purchased_products_array)
                                    ->delete();
                }
                $customer_ledger = VendorLedger::where('customer_id',$request->customer_id)->orderBy('id', 'DESC')->first();
                if($customer_ledger){
                    $balance           =   $customer_ledger->balance;
                }else{
                    $balance           =   0;
                }
                if($request->hidden_invoice_id){
                    $customer_ledger   =  VendorLedger::where('purchase_invoice_id',$request->hidden_invoice_id)->orderBy('id', 'DESC')->first();
                }else{
                    $customer_ledger   =  new  VendorLedger();
                }
                $customer_ledger->date       = $request->invoice_date;
                $customer_ledger->purchase_invoice_id= $invoice->id;
                $customer_ledger->trx_type   = 1 ; //Purchase inc
                $customer_ledger->customer_id= $request->customer_id;
                $customer_ledger->cr         = $invoice->total_invoice_amount - $balance;
                $customer_ledger->dr         = $invoice->paid_amount;
                $customer_ledger->balance    = $invoice->total_invoice_amount- $invoice->paid_amount; //+balance

                $customer_ledger->created_by = Auth::id();
                $customer_ledger->save();  
                 Customer::where('id', $request->customer_id)->update([
                    'balance' => $customer_ledger->balance,
                ]);
                
            }
            return response()->json([
                'msg'       =>  'Product has added to Stock',
                'status'    =>  'success',
                'invoice_id'  =>  $invoice->id,
                'customer_id' =>  $invoice->customer_id,
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
        $current_date   =   date('Y-m-d');
        $purchases     =   PurchaseInvoice::selectRaw('
                                                purchase_invoices.id ,
                                                purchase_invoices.invoice_no ,
                                                purchase_invoices.total_invoice_amount ,
                                                purchase_invoices.product_net_total ,
                                                purchase_invoices.is_editable ,
                                                purchase_invoices.paid_amount ,
                                                purchase_invoices.date ,
                                                purchase_invoices.customer_id ,
                                                purchase_invoices.created_at ,
                                                (SELECT dr FROM vendor_ledger WHERE purchase_invoice_id = purchase_invoices.id) as paid_amount,
                                                (SELECT customer_name FROM customers WHERE id=purchase_invoices.customer_id) as customer_name')
                                            ->whereRaw("Date(created_at) = '$current_date'")
                                            ->orderBy('id', 'DESC')
                                            ->get(); 

        return view('purchases.list',compact('purchases'));
    }
    public function editPurchase($id){

        $customers          =     Customer::where('customer_type', 1)->select('id', 'customer_name', 'balance')->get();
        $products           =     Product::withoutTrashed()->get();
        $invoice            =     PurchaseInvoice::where('id',$id)->first();
        $parts              =     explode('-', $invoice->invoice_no);
        $invoice_first_part =     $parts[0];
        $purchasd_products  =     ProductPurchase::where('purchase_invoice_id', $id)
                                                ->selectRaw('products_purchases.*')
                                                ->get();
        $get_vendor_ledger  = VendorLedger::where('customer_id', $invoice->customer_id)
                                            ->where('trx_type','=',1)
                                            ->where('purchase_invoice_id', $invoice->id)
                                            ->orderBy('id', 'DESC')->first();
                    // dd($invoice->paid_amount);
        return view('purchases.add',compact('invoice','customers','products','customers','get_vendor_ledger', 'invoice_first_part'));
    }
    public function getPurchaseProduct($id){

        $products       =   ProductPurchase::where('products_purchases.purchase_invoice_id',$id)
                                    ->selectRaw('products_purchases.*,
                                    (SELECT product_name FROM products WHERE id=products_purchases.product_id) as product_name,
                                    (SELECT IFNULL(new_purchase_price,old_purchase_price)  FROM products WHERE id=products_purchases.product_id) as purchase_price,
                                    (SELECT stock_balance FROM products WHERE id=products_purchases.product_id) as stock_in_hand')->get();

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
            $customer_balance = VendorLedger::where('customer_id', $id)
                            ->whereDate('date', '!=', Carbon::today())
                            ->orderBy('id', 'DESC')
                            ->value('balance');
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
                    $out_stock->company_id  = $prod->company_id;
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
    public function printInvoice($invoice_id, $customer_id, $received_amount){

        $invoiceId                  =   $invoice_id;
        $customerId                 =   $customer_id;
        $customer_balance           =   0;
        $invoice                    =   PurchaseInvoice::where('id', $invoiceId)->where('customer_id', $customerId)
                                                    ->selectRaw("purchase_invoices.*,
                                                        (SELECT customer_name FROM customers WHERE id ='$customerId') as customer_name,
                                                        (SELECT cr FROM vendor_ledger WHERE purchase_invoice_id='$invoice_id' AND customer_id='$customerId') as paid_amount
                                                        ")
                                                    ->first();
        $invoice->received_amount   =   $received_amount ? $received_amount : $invoice->paid_amount;

        $products                   =   ProductPurchase::where('purchase_invoice_id', $invoice_id)
                                                    ->selectRaw("products_purchases.*,
                                                    (SELECT product_name FROM products WHERE id=products_purchases.product_id) as product_name")
                                                    ->get();
        $ledgerCount      = VendorLedger::where('customer_id', $customerId)->count();
        $customer_balance = 0;
        if ($ledgerCount > 1) {
            $customer_balance = VendorLedger::where('customer_id', $customerId) 
                ->orderBy('id', 'DESC')->skip(1)->value('balance');
        } 

        return view('purchases.invoice', compact('invoice', 'products', 'customer_balance'));
    } 
}
