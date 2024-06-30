<?php

namespace App\Http\Controllers;

use App\Models\BatchStockMgt;
use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductPurchase;
use App\Models\PurchaseInvoice;
use App\Models\StockManagment;
use App\Models\VendorLedger;
use App\Models\VendorStock;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Auth;

class StockController extends Controller
{
    public function create()
    {
        $invoice_no   =   getPurchaseInvoice();
        $parts        = explode('-', $invoice_no);
        $invoice_first_part   = $parts[0];
        $current_date =   Carbon::today()->toDateString();
        $customers    =   Customer::all();
        $products     =   Product::get();
        return view('purchases.add', compact('customers', 'current_date', 'products', 'invoice_no', 'invoice_first_part'));
    }
    public function getProduct(Request $request)
    {
        if ($request->get_result_for == 1) {
            $product    =  Product::where('products.product_name', $request->data_variable)->first();
        } else {
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
        $products     =    Product::withoutTrashed()->get();
        return response()->json([
            'msg'       =>  'Product Fetched for Stock',
            'status'    =>  'success',
            'products'  =>   $products
        ]);
    }
    public function updateStock($sale, $balance, $qty_value, $In_out_status, $invoice_type, $transaction_type)
    {

        $v                      =  new VendorStock();
        $v->vendor_id           =  $sale->vendor_id;
        $v->transaction_type    =  $transaction_type;  //Purchase
        $v->qty                 =  $qty_value;
        $v->status              =  $In_out_status;   //Out
        $v->balance             =  $In_out_status == 2 ? $balance - $qty_value : $balance +  $qty_value;
        $v->actual_qty          =  $sale->qty;
        $v->invoice_no           =  $sale->invoice_no;
        $v->purchase_invoice_id  =  $sale->purchase_invoice_id;
        $v->product_unit_price   =  $sale->purchase_price;
        $v->company_id           =  $sale->company_id;
        $v->product_id           =  $sale->product_id;
        $v->date                 =  $sale->created_at;
        $v->date                 =  $sale->created_at;
        $v->total_purchase_amount =  $sale->purchased_total_amount;
        $v->created_by           =  Auth::id();
        $v->save();
        return $v;
    }
    public function StockManagment($vendor_stock_id, $purchase, $stock_qty, $In_out_status)
    {
        $stock = StockManagment::where('product_id', $purchase->product_id)
            ->where('company_id', $purchase->company_id)
            ->orderBy('id', 'DESC')->first();
        // if ($stock->vs_id == $vendor_stock_id) {
        // }

        if (!$stock) {
            $stock = new StockManagment();
        }
        $stock->vendor_id   = $purchase->vendor_id;
        $stock->company_id  = $purchase->company_id;
        $stock->product_id  = $purchase->product_id;
        $balance            = $In_out_status == 2 ? $stock->balance - $stock_qty : $stock->balance +  $stock_qty;
        $stock->balance     = $balance;
        $stock->vs_id       = $vendor_stock_id;
        $stock->save();
    }
    public function purchaseInvoice(Request $request)
    {
        // dd($request->all());
        if ($request->hidden_invoice_id) {
            $invoice = PurchaseInvoice::where('id', $request->hidden_invoice_id)->first();
        } else {
            isEditable($request->customer_id);
            $invoice = new PurchaseInvoice();
        }
        $invoice->date                 = $request->invoice_date;
        $invoice->invoice_no           = $request->invoice_no;
        $invoice->invoice_type         = $request->invoice_type;
        $invoice->customer_id          = $request->customer_id;
        if ($request->invoice_type == 1) {
            $invoice->paid_amount      = $request->amount_to_pay;
            $total_cr                  = $request->amount_to_pay;
        } else {
            $invoice->paid_amount      = $request->amount_received ? $request->amount_received : 0;
            $total_cr                  = ($request->product_net_total + $request->service_charges) - $request->invoice_discount;
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
        if ($invoice->save()) {
            if (count($request->purchased_product_array) > 0) {
                foreach ($request->purchased_product_array as $purchase_product) {
                    $flag = true;
                    if ($purchase_product['purchase_prod_id'] > 0) {
                        $purchased          =  ProductPurchase::where('id', $purchase_product['purchase_prod_id'])->first();
                        if ($purchased->qty == $purchase_product['qty']) {
                            $flag = false;
                        }
                    } else {
                        $purchased          =  new ProductPurchase();
                    }
                    if ($purchase_product['new_price'] != '') {
                        $purchased->purchase_price  = $purchase_product['new_price'];
                    } else {
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
                    if ($purchased->save()) {
                        $purchased->invoice_no = $invoice->invoice_no;

                        $purchased_products_array[] = $purchased->id;
                        $check_stock           =  VendorStock::where('product_id', $purchased->product_id)->orderBy('id', 'DESC')->first();
                        $balance   = 0;
                        $vendor_id = 0;
                        if ($check_stock) {
                            $vendor_id         =  $check_stock->vendor_id;
                            $balance           =  $check_stock->balance; //10
                        }
                        $status = 0;
                        $vs_id = 0;
                        $change_qty_value   =   $purchased->qty;
                        $In_out_status      =   1;
                        if ($flag) {
                            if ($request->hidden_invoice_id) {
                                if ($previous_qty != 0) {
                                    if ($purchased->qty >=  $previous_qty) {
                                        $change_qty_value = $purchased->qty - $previous_qty;
                                        $In_out_status = 1; // IN
                                    } else {
                                        $change_qty_value = $previous_qty - $purchased->qty; // 10 -8 = 2 if >0  OUT : IN 
                                        $In_out_status = 2; // OUT
                                    }
                                }
                            }
                            VendorStock::where('purchase_invoice_id',  $purchased->purchase_invoice_id)->where('product_id', $purchased->product_id)->update([
                                'actual_qty'    => 0,
                                'actual_status' => 0
                            ]);
                            $purchased->vendor_id  =  $invoice->customer_id;
                            $v_stock = updateStock($purchased, $balance, $change_qty_value, $In_out_status, 'purchase', 1);
                            $vs_id   = $v_stock->id;
                            StockManagment($v_stock->id, $purchased, $change_qty_value, $In_out_status, 'purchase');
                            if ($v_stock->save()) {
                                $purchased->vendor_stock_id = $v_stock->id;
                                Product::where('id', $v_stock->product_id)->update([
                                    'stock_balance' =>  $v_stock->balance,
                                ]);
                            }
                        }
                        BatchWiseStockManagment($vs_id,  $invoice->id, $purchased, $purchased->qty, $In_out_status, 1, $request->hidden_invoice_id);
                        //Update Product Price
                        $product              = Product::where('id', $purchased->product_id)->first();
                        $company_id           = $product->company_id;
                        $product->expiry_date = $purchased->expiry_date;
                        $product->sale_price  = $purchased->sale_price;
                        if ($purchase_product['new_price'] != '') {
                            $product->new_purchase_price = $purchase_product['new_price'];
                        } else {
                            $product->old_purchase_price  = $purchase_product['old_price'];
                        }
                        $product->updated_by = Auth::id();
                        $product->save();

                        $check_stock    = VendorStock::where('product_id', $purchased->product_id)->orderBy('id', 'DESC')->first();
                        if ($check_stock) {
                            $balance    =   $check_stock->balance;
                        } else {
                            $balance = 0;
                        }

                        // }
                    }
                }
                if ($request->hidden_invoice_id) {
                    ProductPurchase::where('purchase_invoice_id', $request->hidden_invoice_id)
                        ->whereNotIn('id', $purchased_products_array)
                        ->delete();
                }
                $customer_ledger = VendorLedger::where('customer_id', $request->customer_id)->orderBy('id', 'DESC')->first();
                if ($customer_ledger) {
                    $balance           =   $customer_ledger->balance;
                } else {
                    $balance           =   0;
                }
                // dd($balance);
                if ($request->hidden_invoice_id) {
                    $customer_ledger   =  VendorLedger::where('purchase_invoice_id', $request->hidden_invoice_id)->orderBy('id', 'DESC')->first();
                } else {
                    $customer_ledger   =  new  VendorLedger();
                }
                $customer_ledger->date       = $request->invoice_date;
                $customer_ledger->purchase_invoice_id = $invoice->id;
                $customer_ledger->trx_type   = 1; //Purchase inc
                $customer_ledger->is_editable   = 1;
                $customer_ledger->customer_id = $request->customer_id;
                $customer_ledger->cr         = $total_cr;
                $customer_ledger->dr         = $invoice->paid_amount;
                $customer_ledger->balance    = $invoice->total_invoice_amount - $invoice->paid_amount; //+balance

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
    public function getVendors()
    {

        $customers = Customer::where('customer_type', 1)->get(); //1=vendor
        return response()->json([
            'msg'       => 'Vendor Fetched',
            'status'    => 'success',
            'customers' => $customers
        ]);
    }
    public function purchaseList()
    {
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

        return view('purchases.list', compact('purchases'));
    }
    public function editPurchase($id)
    {

        $customers          =     Customer::where('customer_type', 1)->select('id', 'customer_name', 'balance')->get();
        $products           =     Product::withoutTrashed()->get();
        $invoice            =     PurchaseInvoice::where('id', $id)->first();
        $parts              =     explode('-', $invoice->invoice_no);
        $invoice_first_part =     $parts[0];
        $purchasd_products  =     ProductPurchase::where('purchase_invoice_id', $id)
            ->selectRaw('products_purchases.*')
            ->get();
        $get_vendor_ledger  = VendorLedger::where('customer_id', $invoice->customer_id)
            ->where('trx_type', '=', 1)
            ->where('purchase_invoice_id', $invoice->id)
            ->orderBy('id', 'DESC')->first();
        // dd($invoice->paid_amount);
        return view('purchases.add', compact('invoice', 'customers', 'products', 'customers', 'get_vendor_ledger', 'invoice_first_part'));
    }
    public function getPurchaseProduct($id)
    {

        $products       =   ProductPurchase::where('products_purchases.purchase_invoice_id', $id)
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
    public function getVendorBalance(Request $request, $id)
    {
        if ($request->segment == 'purchase-edit') {
            $customer_balance  =  VendorLedger::where('customer_id', $id)->where('is_editable', '!=', 1)->orderBy('id', 'DESC')->value('balance');
            if (!$customer_balance) {
                $customer_balance = 0;
            }
        } else {
            // $customer_balance = VendorLedger::where('customer_id',$id)->where('created_at','!=',Carbon::today()->toDateString())->orderBy('id', 'DESC')->value('balance');
            $customer_balance = Customer::where('id', $id)->value('balance');
        }
        return response()->json([
            'msg'       =>  'Vendor fetched',
            'status'    =>  'success',
            'customer_balance'  => $customer_balance
        ]);
    }
    public function deleteProduct(Request $request)
    {
        $prod = VendorStock::where('purchase_invoice_id', $request->purchase_invoice_id)
            ->where('product_id', $request->product_id)
            ->where('transaction_type', 1)->orderBy('id', 'DESC')->first();
        if ($prod) {

            $prod->actual_qty = $request->qty;
            $v_stock = updateStock($prod, $prod->balance,  $request->qty, 2, 'purchase', 5);
            BatchWiseDeleteProduct($request->purchase_invoice_id, $request->product_invoice_id, $request->qty, 2, 5);
            StockManagment($v_stock->id, $prod,  $request->qty, 2);

            if ($v_stock) {
                Product::where('id', $v_stock->product_id)->update([
                    'stock_balance' =>  $v_stock->balance,
                ]);
                ProductPurchase::where('purchase_invoice_id', $request->purchase_invoice_id)
                    ->where('product_id', $request->product_id)->delete();
                return response()->json([
                    'msg'       => 'product removed',
                    'status'    => 'success',
                ]);
            }
        } else {
            return response()->json([
                'msg'       => 'not remove',
                'status'    => 'failed',
            ]);
        }
    }
    public function printInvoice($invoice_id, $customer_id, $received_amount)
    {

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
