<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\VendorLedger;
use App\Models\Product;
use App\Models\ProductPurchase;
use App\Models\ProductReturns;
use App\Models\PurchaseReturn;
use App\Models\ReturnInvoice;
use App\Models\Stock;
use App\Models\VendorStock;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Auth;
use Mockery\Undefined;

class PurchaseReturnController extends Controller
{
    public function getVendorBalance(Request $request, $id)
    {
        $customer_balance =  Customer::where('id', $id)->value('balance');
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
    public function create()
    {
        $invoice_no          =   getPurchaseReturnNo();
        $parts               =   explode('-', $invoice_no);
        $invoice_first_part  =   $parts[0];
        $current_date        =   Carbon::today()->toDateString();
        $products            =   Product::selectRaw('products.*, (SELECT purchase_price FROM products_purchases WHERE product_id = products.id LIMIT 1) as unit_price')
            ->where('stock_balance', '>', 0)
            ->get();

        $customers           =   Customer::where('customer_type', 1)
            ->whereIn('id', function ($query) {
                $query->select('customer_id')
                    ->from('purchase_invoices')
                    ->groupBy('customer_id');
            })->get();

        return view('purchases.return.create', compact('customers', 'current_date', 'invoice_first_part', 'products', 'invoice_no'));
    }
    public function store(Request $request)
    {

        if ($request->hidden_invoice_id) {
            $invoice = ReturnInvoice::where('id', $request->hidden_invoice_id)->first();
        } else {
            $invoice = new ReturnInvoice();
            isEditable($request->customer_id);
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
        $invoice->invoice_remaining_amount_after_pay  =  $invoice->total_invoice_amount + $invoice->paid_amount;

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
        if ($invoice->save()) {
            if (count($request->returns_product_array) > 0) {
                foreach ($request->returns_product_array as $purchase_product) {
                    $flag = true;
                    if ($purchase_product['return_invoice_id'] > 0 && $purchase_product['return_invoice_id'] !=  "undefined") {
                        $purchased          =  ProductReturns::where('id', $purchase_product['return_invoice_id'])->first();
                        if ($purchased->qty == $purchase_product['qty']) {
                            $flag = false;
                        }
                    } else {
                        $purchased          =  new ProductReturns();
                    }
                    $purchased->purchase_price          = $purchase_product['purchased_price'];
                    $purchased->purchase_return_invoice_id     = $invoice->id;
                    $purchased->product_id              = $purchase_product['product_id'];
                    $purchased->vendor_id               = $request->customer_id;
                    $purchased->expiry_date             = $purchase_product['expiry_date'];
                    $purchased->product_return_total_amount  = $purchase_product['amount'];
                    $purchased->company_id              = Product::where('id', $purchase_product['product_id'])->value('company_id');
                    $purchased->qty                     = $purchase_product['qty'];
                    $purchased->product_discount        = $purchase_product['prod_discount'];
                    $purchased->sale_price              = $purchase_product['retail_price'];
                    $purchased->created_by              = Auth::id();
                    $previous_qty = ProductReturns::where('purchase_return_invoice_id', $request->hidden_invoice_id)
                        ->where('product_id', $purchased->product_id)
                        ->orderBy('id', 'Desc')
                        ->value('qty');
                    if ($purchased->save()) {
                        $purchased->invoice_no = $invoice->invoice_no;

                        $purchased_products_array[] = $purchased->id;
                        $check_stock           =  VendorStock::where('product_id', $purchased->product_id)->orderBy('id', 'DESC')->first();
                        $balance = 0;
                        $vendor_id = 0;
                        if ($check_stock) {
                            $vendor_id         =  $check_stock->vendor_id;
                            $balance           =  $check_stock->balance;
                        }
                        if ($flag) {
                            $change_qty_value   =   $purchased->qty;
                            $In_out_status      =   2;
                            if ($request->hidden_invoice_id) {
                                if ($previous_qty != 0) {
                                    if ($purchased->qty >=  $previous_qty) {
                                        $change_qty_value = $purchased->qty - $previous_qty;
                                        $In_out_status   = 2; // OUT
                                    } else {
                                        $change_qty_value = $previous_qty - $purchased->qty;
                                        $In_out_status = 1; // IN
                                    }
                                }
                            }
                            VendorStock::where('purchase_return_invoice_id', $purchased->purchase_return_invoice_id)->where('product_id', $purchased->product_id)->update([
                                'actual_qty' => 0,
                                'actual_status' => 0
                            ]);
                            $purchased->vendor_id  =  $invoice->customer_id;
                            $v_stock = updateStock($purchased, $balance, $change_qty_value, $In_out_status, 'purchase_return', 3);
                            StockManagment($v_stock->id, $purchased, $change_qty_value, $In_out_status, 'purchase_return');
                            if ($v_stock->save()) {
                                $purchased->vendor_stock_id = $v_stock->id;
                                Product::where('id', $v_stock->product_id)->update([
                                    'stock_balance' =>  $v_stock->balance,
                                ]);
                            }
                        }
                        $check_stock    = VendorStock::where('product_id', $purchased->product_id)->orderBy('id', 'DESC')->first();
                        if ($check_stock) {
                            $balance    =   $check_stock->balance;
                        } else {
                            $balance = 0;
                        }
                    }
                }
                if ($request->hidden_invoice_id) {
                    ProductReturns::where('purchase_return_invoice_id', $request->hidden_invoice_id)
                        ->whereNotIn('id', $purchased_products_array)
                        ->delete();
                }


                $customer_ledger = VendorLedger::where('customer_id', $request->customer_id)->orderBy('id', 'DESC')->first();
                if ($customer_ledger) {
                    $balance = $customer_ledger->balance;
                } else {
                    $balance =   0;
                }
                if ($request->hidden_invoice_id) {
                    $customer_ledger   =  VendorLedger::where('purchase_return_invoice_id', $request->hidden_invoice_id)->orderBy('id', 'DESC')->first();
                } else {
                    $customer_ledger   =  new  VendorLedger();
                }
                $customer_ledger->date       = $request->invoice_date;
                $customer_ledger->purchase_return_invoice_id = $invoice->id;
                $customer_ledger->trx_type   =  2; //Rerurn inv
                $customer_ledger->customer_id = $request->customer_id;
                $customer_ledger->paid_p_return_amount = $invoice->paid_amount;
                $customer_ledger->dr         = $total_dr;
                $customer_ledger->cr         = $request->service_charges ?? 0;
                if ($invoice->invoice_type ==  1 && $invoice->invoice_remaining_amount_after_pay == $invoice->amount_received) {
                    $customer_ledger->balance     =  0; //balance
                } else {
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
        if ($previous_qty > 0) {
            $v->qty         =  $previous_qty;
            $v->status      =   1;   //IN
            $v->balance     =   $balance + $v->qty;
        } else {
            $v->status      =    2;   // Out
            $v->qty         =   $return->qty;
            $v->balance     =   $balance - $v->qty;
        }
        $v->invoice_no           =  $return->invoice_no;

        $v->purchase_return_invoice_id =  $return->purchase_return_invoice_id;
        $v->product_unit_price   =  $return->purchase_price;
        $v->company_id           =  $return->company_id;
        $v->product_id           =  $return->product_id;
        $v->amount               =  $return->product_return_total_amount;
        $v->date                 =  $return->created_at;
        $v->created_by           =  Auth::id();
        $v->save();
        return $v;
    }
    public function getVendorBalnce(Request $request, $id)
    {
        if ($request->segment == 'purchase-return-edit') {
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
        $vs      = VendorStock::where('purchase_return_invoice_id', $request->return_invoice_id)
            ->where('product_id', $request->product_id)
            ->where('transaction_type', 3)->orderBy('id', 'DESC')
            ->first();
        if ($vs) {
            // VendorStock::where('purchase_return_invoice_id', $request->return_invoice_id)
            //     ->where('product_id', $request->product_id)->update([
            //         'actual_qty'    => 0,
            //         'actual_status' => 0
            //     ]);
            $v_stock = updateStock($vs, $vs->balance,  $request->qty, 1, 'purchase-return', 5);
            StockManagment($v_stock->id, $vs,  $request->qty, 1, 'purchase-return');

            if ($v_stock) {
                Product::where('id', $v_stock->product_id)->update([
                    'stock_balance' =>  $v_stock->balance,
                ]);
                ProductReturns::where('purchase_return_invoice_id', $request->return_invoice_id)
                    ->where('product_id', $request->product_id)->where('qty', $request->qty)
                    ->delete();
                return response()->json([
                    'msg'       => 'product removed',
                    'status'    => 'success',
                    'updated_stock' => $v_stock->balance
                ]);
            } else {
                return response()->json([
                    'msg'       => 'Not Updated at this moment',
                    'status'    => 'failed',
                ]);
            }
        }
    }

    public function list()
    {
        $current_date   =   date('Y-m-d');
        $purchases      =   ReturnInvoice::selectRaw('
                                                purchase_return_invoices.id ,
                                                purchase_return_invoices.invoice_no ,
                                                purchase_return_invoices.total_invoice_amount ,
                                                purchase_return_invoices.is_editable ,
                                                purchase_return_invoices.paid_amount ,
                                                purchase_return_invoices.date ,
                                                purchase_return_invoices.customer_id ,
                                                purchase_return_invoices.created_at ,
                                                purchase_return_invoices.paid_amount,
                                                (SELECT customer_name FROM customers WHERE id=purchase_return_invoices.customer_id) as customer_name')
            ->whereRaw("Date(created_at) = '$current_date'")
            ->orderBy('id', 'DESC')
            ->get();
        return view('purchases.return.list', compact('purchases'));
    }
    public function edit($id)
    {

        $customers          =     Customer::where('customer_type', 1)->select('id', 'customer_name', 'balance')->get();
        $products           =     Product::withoutTrashed()->get();
        $invoice            =     ReturnInvoice::where('id', $id)->first();
        $parts              =     explode('-', $invoice->invoice_no);
        $invoice_first_part =     $parts[0];
        $purchasd_products  =     ProductReturns::where('purchase_return_invoice_id', $id)
            ->selectRaw('products_returns.*')
            ->get();
        $get_vendor_ledger  = VendorLedger::where('customer_id', $invoice->customer_id)
            ->where('trx_type', '=', 1)
            ->where('purchase_return_invoice_id', $invoice->id)
            ->orderBy('id', 'DESC')->first();
        // dd($invoice->paid_amount);
        return view('purchases.return.create', compact('invoice', 'customers', 'products', 'customers', 'get_vendor_ledger', 'invoice_first_part'));
    }
    public function getPurchaseReturnProduct($id)
    {

        $products       =   ProductReturns::where('products_returns.purchase_return_invoice_id', $id)
            ->selectRaw('products_returns.*,
                                    (SELECT product_name FROM products WHERE id=products_returns.product_id) as product_name,
                                    (SELECT IFNULL(new_purchase_price,old_purchase_price)  FROM products WHERE id=products_returns.product_id) as purchase_price,
                                    (SELECT stock_balance FROM products WHERE id=products_returns.product_id) as stock_in_hand')->get();

        return response()->json([
            'msg'       => 'Vendor Fetched',
            'status'    => 'success',
            'products'  => $products
        ]);
    }
    public function printInvoice($invoice_id, $customer_id, $received_amount)
    {

        $invoiceId                  =   $invoice_id;
        $customerId                 =   $customer_id;
        $customer_balance           =   0;

        $invoice                    =   ReturnInvoice::where('id', $invoiceId)->where('customer_id', $customerId)
            ->selectRaw("purchase_return_invoices.*,
                                                        (SELECT customer_name FROM customers WHERE id ='$customerId') as customer_name
                                                        ")
            ->first();
        $invoice->received_amount   =   $received_amount ? $received_amount : $invoice->paid_amount;

        $products                   =   ProductReturns::where('purchase_return_invoice_id', $invoice_id)
            ->selectRaw("products_returns.*,
                                                          (SELECT product_name FROM products WHERE id=products_returns.product_id) as product_name")
            ->get();
        $ledgerCount      = VendorLedger::where('customer_id', $customerId)->count();
        $customer_balance = 0;
        if ($ledgerCount > 1) {
            $customer_balance = VendorLedger::where('customer_id', $customerId)
                ->orderBy('id', 'DESC')->skip(1)->value('balance');
        }

        return view('purchases.return.invoice', compact('invoice', 'products', 'customer_balance'));
    }
}
