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
        $customer_balance =  Customer::where('id',$id)->value('balance');
        $product_balances =  VendorStock::select('product_id', 'product_unit_price', 'balance')
                                        ->where('vendor_id', $id)
                                        ->whereIn('id', function ($query) use ($id) {
                                            $query->selectRaw('MAX(id)')
                                                ->from('vendor_stocks')
                                                ->whereColumn('product_id', 'vendor_stocks.product_id')
                                                ->where('vendor_id', $id)
                                                ->groupBy('product_id');
                                        })
                                        ->get();

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
        $products            =   Product::selectRaw('products.*, (SELECT purchase_price FROM products_purchases WHERE product_id = products.id) as unit_price')
                                                                    ->where('stock_balance', '>', 0)
                                                                    ->get();
 
        $customers           =   Customer::where('customer_type', 1)
                                            ->whereIn('id', function($query){
                                                $query->select('customer_id')
                                                    ->from('purchase_invoices')
                                                    ->groupBy('customer_id');
                                            })->get();
        return view('purchases.return.create',compact('customers','current_date','invoice_first_part','products','invoice_no'));
    }
    Public function store(Request $request){
        if($request->hidden_invoice_id){
            $invoice = ReturnInvoice::where('id',$request->hidden_invoice_id)->first();
        }else{
            $invoice = new ReturnInvoice();
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
        $invoice->total_invoice_amount = ($request->product_net_total + $request->service_charges) - $request->invoice_discount;
        $invoice->invoice_remaining_amount_after_pay  =  $invoice->total_invoice_amount - $invoice->paid_amount;

        $total_dr       =   $invoice->total_invoice_amount +  $invoice->paid_amount  - $request->service_charges;

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
            if(count($request->returns_product_array) > 0){
                foreach($request->returns_product_array as $purchase_product){

                    $new_ids[] = $purchase_product['product_id'];
                    if ($purchase_product['purchase_prod_id'] > 0) {
                        $purchased          =  ProductReturns::where('id', $purchase_product['return_invoice_id'])->first();
                    }else{
                        $purchased          =  new ProductReturns();
                    }
                    $purchased->purchase_price          = $purchase_product['purchased_price'];
                    $purchased->return_invoice_id     = $invoice->id;
                    $purchased->product_id              = $purchase_product['product_id'];
                    $purchased->vendor_id               = $request->customer_id;
                    $purchased->expiry_date             = $purchase_product['expiry_date'];
                    $purchased->product_return_total_amount  = $purchase_product['amount'];
                    $purchased->company_id              = Product::where('id', $purchase_product['product_id'])->value('company_id');
                    $purchased->qty                     = $purchase_product['qty'];
                    $purchased->product_discount        = $purchase_product['prod_discount'];
                    $purchased->sale_price              = $purchase_product['retail_price'];
                    $purchased->created_by              = Auth::id();
                    $previous_qty = ProductReturns::where('return_invoice_id', $request->hidden_invoice_id)
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
                        $check_stock    = VendorStock::where('product_id',$purchased->product_id)->orderBy('id', 'DESC')->first();
                        if($check_stock){
                            $balance    =   $check_stock->balance;
                        }else{
                            $balance = 0;
                        }
                        Product::where('id',$v_stock->product_id)->update([
                            'stock_balance' =>  $v_stock->balance,
                        ]);
                    }
                }
                if ($request->hidden_invoice_id) {
                    ProductReturns::where('return_invoice_id', $request->hidden_invoice_id)
                                    ->whereNotIn('id', $purchased_products_array)
                                    ->delete();
                }
                $customer_ledger = VendorLedger::where('customer_id',$request->customer_id)->orderBy('id', 'DESC')->first();
                if($customer_ledger){
                    $balance = $customer_ledger->balance;
                }else{
                    $balance =   0;
                }
                if($request->hidden_invoice_id){
                    $customer_ledger   =  VendorLedger::where('return_invoice_id',$request->hidden_invoice_id)->orderBy('id', 'DESC')->first();
                }else{
                    $customer_ledger   =  new  VendorLedger();
                }
                $customer_ledger->date       = $request->invoice_date;
                $customer_ledger->return_invoice_id= $invoice->id;
                $customer_ledger->trx_type   =  2; //Rerurn inv
                $customer_ledger->customer_id= $request->customer_id;
                $customer_ledger->dr         = $total_dr;
                $customer_ledger->cr         = $request->service_charges ?? 0;
                if($invoice->invoice_type == 1 && $invoice->invoice_remaining_amount_after_pay == $invoice->amount_received){
                    $customer_ledger->balance     =  0; //balance
                }else{
                    $customer_ledger->balance     =  $request->previous_receivable - $total_dr +  $customer_ledger->cr; //balance
                }
                $customer_ledger->created_by = Auth::id();
                $customer_ledger->save();
                 Customer::where('id', $request->customer_id)->update([
                    'balance' => $customer_ledger->balance,
                ]);

            }
            return response()->json([
                'msg'         =>  'Product has added to Stock',
                'status'      =>  'success',
                'invoice_id'  =>  $invoice->id,
                'customer_id' =>  $invoice->customer_id,
            ]);
        }
    }
    public function updateStock($previous_qty, $return, $balance, $vendor_id, $type)
    {
        $v                   =  new VendorStock();
        $v->vendor_id        =  $return->vendor_id;
        $v->transaction_type =  3;  //Return
        if($previous_qty > 0){
            $v->qty         =  $previous_qty;
            $v->status      =   1 ;   //IN
            $v->balance     =   $balance + $v->qty;
        }else{
            $v->status      =    2;   // Out
            $v->qty         =   $return->qty;
            $v->balance     =   $balance - $v->qty;
        }
        $v->return_invoice_id    =  $return->return_invoice_id;
        $v->product_unit_price   =  $return->purchase_price;
        $v->company_id           =  $return->company_id;
        $v->product_id           =  $return->product_id;
        $v->amount               =  $return->product_return_total_amount;
        $v->date                 =  $return->created_at;
        $v->created_by           =  Auth::id();
        $v->save();
        return $v;
    }
    public function getVendorBalnce(Request $request,$id){
        if ($request->segment == 'edit-purchase-return') {
            $customer_count     =  VendorLedger::where('customer_id', $id)->count();
            if ($customer_count > 1) {
                $customer_balance = VendorLedger::where('customer_id', $id)
                    ->orderBy('id', 'DESC')->skip(1)->value('balance');
            } else {
                $customer_balance = 0;
            }
        } else {
            $customer_balance = Customer::where('id', $id)->value('balance');
        }

        return response()->json([
            'msg'               =>  'Vendor fetched',
            'status'            =>  'success',
            'customer_balance'  => $customer_balance
        ]);

    }

    public function deleteProduct(Request $request)
    {
               $vs      = VendorStock::where('return_invoice_id', $request->return_invoice_id)
                                    ->where('product_id',$request->product_id)
                                    ->where('qty', $request->qty)
                                    ->where('status', 2)->orderBy('id', 'DESC')
                                    ->first();
            if($vs){
                $stock_inHand                  = VendorStock::where('product_id', $request->product_id)
                                                             ->orderBy('id', 'DESC')->value('balance');
                $v_stock                       =  new VendorStock();
                $v_stock->balance              =  $stock_inHand + $request->qty;
                $v_stock->qty                  =  $request->qty;
                $v_stock->status               =  1; //IN
                $v_stock->transaction_type     =  3; //Return
                $v_stock->return_invoice_id    =  $request->return_invoice_id;
                $v_stock->product_unit_price   =  $vs->product_unit_price;
                $v_stock->product_id           =  $request->product_id;
                $v_stock->vendor_id            =  $vs->vendor_id;
                $v_stock->date                 =  Carbon::now();
                $v_stock->amount               =  $vs->amount;
                $v_stock->created_by           =  Auth::id();
                if ($v_stock->save()) {
                    Product::where('id', $v_stock->product_id)->update([
                        'stock_balance' =>  $v_stock->balance,
                    ]);
                    ProductReturns::where('return_invoice_id', $request->return_invoice_id)
                                    ->where('product_id',$request->product_id)->where('qty', $request->qty)
                                    ->delete();
                    return response()->json([
                        'msg'       => 'product removed',
                        'status'    => 'success',
                        'updated_stock' => $v_stock->balance
                    ]);
                }else{
                    return response()->json([
                        'msg'       => 'Not Updated at this moment',
                        'status'    => 'failed',
                    ]);
                }
        }
    }
}
