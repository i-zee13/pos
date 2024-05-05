<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\Product;
use App\Models\ProductSale;
use App\Models\Sale as SaleInvoice;
use App\Models\StockManagment;
use App\Models\VendorStock;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Auth;

class SaleController extends Controller
{

    public function create()
    {
        $invoice_no   =     getInvoice();
        $parts        =     explode('-', $invoice_no);
        $invoice_first_part   = $parts[0];
        $current_date =   Carbon::today()->toDateString();
        $customers    =   Customer::where('customer_type', 2)->select('id', 'customer_name', 'balance')->get();
        $products     =   Product::get();
        return view('sales.test', compact('customers', 'current_date', 'invoice_no', 'products', 'invoice_first_part'));
    }
    public function getVendors()
    {
        $customers      = Customer::where('customer_type', 2)->get(); //1=vendor
        return response()->json([
            'msg'       => 'Vendor Fetched',
            'status'    => 'success',
            'customers' => $customers
        ]);
    }
    public function updateStock($sale, $balance, $qty_value, $In_out_status, $invoice_type, $transaction_type)
    {

        $v                      =  new VendorStock();
        $v->vendor_id           =   $sale->vendor_id;
        $v->transaction_type    =  $transaction_type;
        $v->qty                 =  $qty_value;
        $v->status              =  $In_out_status;   //IN
        $v->balance             =  $In_out_status == 2 ? $balance - $qty_value : $balance +  $qty_value;
        $v->actual_qty          =  $sale->qty;
        $v->invoice_no           =  $sale->invoice_no;
        $v->sale_invoice_id      =  $sale->sale_invoice_id;
        $v->company_id           =  $sale->company_id;
        $v->product_id           =  $sale->product_id;
        $v->date                 =  $sale->created_at;
        $v->sale_unit_price      =  $sale->sale_price;
        $v->created_by           =  Auth::id();
        if ($transaction_type == 1) { //Purchase
            $v->total_purchase_amount =  $sale->purchased_total_amount;
        } else if ($transaction_type == 2) {  //Sale
            $v->total_sale_amount    =  $sale->sale_total_amount;
        }
        $v->save();
        return $v;
    }
    public function StockManagment($vendor_stock_id, $purchase, $stock_qty, $In_out_status)
    {
        $stock = StockManagment::where('product_id', $purchase->product_id)
            ->where('company_id', $purchase->company_id)
            ->orderBy('id', 'DESC')->first();
        if (!$stock) {
            $stock = new StockManagment();
        }
        $stock->company_id  = $purchase->company_id;
        $stock->product_id  = $purchase->product_id;
        $balance            = $In_out_status == 2 ? $stock->balance - $stock_qty : $stock->balance +  $stock_qty;
        $stock->balance     = $balance;
        $stock->vs_id       = $vendor_stock_id;
        $stock->save();
    }
    public function saleInvoice(Request $request)
    {
        if ($request->hidden_invoice_id) {
            $invoice = SaleInvoice::where('id', $request->hidden_invoice_id)->first();
        } else {
            $invoice     = new SaleInvoice();
            isEditable($request->customer_id);
        }
        $invoice->amount_received      = $request->amount_received;
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
        $invoice->invoice_remaining_amount_after_pay  =  $invoice->total_invoice_amount - $request->amount_received;
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
            if (count($request->sales_product_array) > 0) {
                $old_ids        = $request->existing_product_ids;
                foreach ($request->sales_product_array as $key => $sale_product) {
                    $flag = true;
                    $new_ids[]  = $sale_product['product_id'];
                    if ($sale_product['sale_prod_id'] > 0) {
                        $sale          =  ProductSale::where('id', $sale_product['sale_prod_id'])->first();
                        if ($sale->qty == $sale_product['qty']) {
                            $flag = false;
                        }
                    } else {
                        $sale          =  new ProductSale();
                    }
                    $sale->sale_price          = $sale_product['retail_price'];
                    $sale->sale_invoice_id     = $invoice->id;
                    $sale->invoice_no          = $invoice->invoice_no;
                    $sale->company_id          = Product::where('id', $sale_product['product_id'])->value('company_id');
                    $sale->product_id          = $sale_product['product_id'];
                    $sale->qty                 = $sale_product['qty'];
                    $sale->sale_total_amount   = $sale_product['amount'];
                    $sale->product_discount    = $sale_product['prod_discount'];
                    $sale->created_by          = Auth::id();
                    $sale->purchase_price      = $sale_product['purchased_price'];
                    $previous_qty              = ProductSale::where('sale_invoice_id', $request->hidden_invoice_id)
                        ->where('product_id', $sale->product_id)
                        ->orderBy('id', 'Desc')
                        ->value('qty');
                    if ($sale->save()) {
                        $sale_products_array[] = $sale->id;
                        $balance = 0;
                        $check_stock           =  VendorStock::where('product_id', $sale->product_id)->orderBy('id', 'DESC')->first();
                        if ($check_stock) {
                            $vendor_id             =  $check_stock->vendor_id;
                            $balance           =  $check_stock->balance;
                        }
                        if ($flag) {
                            $change_qty_value   =   $sale->qty;
                            $In_out_status      =   2;
                            if ($request->hidden_invoice_id) {
                                if ($previous_qty != 0) {
                                    if ($sale->qty >=  $previous_qty) {
                                        $change_qty_value = $sale->qty - $previous_qty;
                                        $In_out_status = 2; // OUT
                                    } else {
                                        $change_qty_value = $previous_qty - $sale->qty;
                                        $In_out_status = 1; // IN
                                    }
                                }
                            }
                            VendorStock::where('sale_invoice_id', $sale->sale_invoice_id)->where('product_id', $sale->product_id)->update([
                                'actual_qty' => 0,
                                'actual_status' => 0
                            ]);
                            $sale->customer_id  =  $invoice->customer_id;
                            $v_stock = updateStock($sale, $balance, $change_qty_value, $In_out_status, 'sale', 2);
                            StockManagment($v_stock->id, $sale, $change_qty_value, $In_out_status, 'sale');

                            if ($v_stock->save()) {
                                $sale->vendor_stock_id = $v_stock->id;
                                Product::where('id', $v_stock->product_id)->update([
                                    'stock_balance' =>  $v_stock->balance,
                                ]);
                            }
                        }
                    }
                }
                if ($request->hidden_invoice_id) {
                    ProductSale::where('sale_invoice_id', $request->hidden_invoice_id)
                        ->whereNotIn('id', $sale_products_array)
                        ->delete();
                }

                $customer_ledger       =  CustomerLedger::where('customer_id', $request->customer_id)->orderBy('id', 'DESC')->first();
                if ($customer_ledger) {
                    $balance           =   $customer_ledger->balance;
                } else {
                    $balance           =   0;
                }
                // dd($balance);
                if ($request->hidden_invoice_id) {
                    $customer_ledger   =   CustomerLedger::where('sale_invoice_id', $request->hidden_invoice_id)->orderBy('id', 'DESC')->first();
                } else {
                    $customer_ledger   =   new  CustomerLedger();
                }
                $customer_ledger->cr          = $invoice->paid_amount;
                $customer_ledger->date        = $request->invoice_date;
                $customer_ledger->customer_id = $request->customer_id;
                $customer_ledger->trx_type    = 1;  //Sale
                $customer_ledger->dr          = $invoice->total_invoice_amount - ($request->hidden_invoice_id ? 0 :  $balance);
                $customer_ledger->balance     = ($invoice->total_invoice_amount - $customer_ledger->cr); //balance
                $customer_ledger->created_by  = Auth::id();
                $customer_ledger->sale_invoice_id = $invoice->id;
                $customer_ledger->save();
                Customer::where('id', $request->customer_id)->update([
                    'balance' => $customer_ledger->balance,
                ]);
            }
            return response()->json([
                'msg'        =>  'Product Invoice has generated.',
                'status'     =>  'success',
                'invoice_id'  =>  $invoice->id,
                'customer_id' =>  $invoice->customer_id,
            ]);
        }
    }
    public function saleList()
    {
        $current_date   =   date('Y-m-d');
        $sales     =   SaleInvoice::selectRaw('sale_invoices.* ,
                                        (SELECT cr FROM customer_ledger WHERE sale_invoice_id = sale_invoices.id) as paid_amount,
                                        (SELECT customer_name FROM customers WHERE id=sale_invoices.customer_id) as customer_name')
            ->whereRaw("Date(created_at) = '$current_date'")
            ->orderBy('id', 'DESC')
            ->get();
        // dd($sales);
        return view('sales.list', compact('sales'));
    }
    public function editSale($id)
    {
        $customers          =     Customer::where('customer_type', 2)->select('id', 'customer_name', 'balance')->get();
        $products           =     Product::get();
        $invoice            =     SaleInvoice::where('id', $id)->first();
        $parts              =     explode('-', $invoice->invoice_no);
        $invoice_first_part =     $parts[0];
        $purchasd_products  =     ProductSale::where('sale_invoice_id', $id)
            ->selectRaw('products_sales.*')
            ->get();
        $get_customer_ledger  = CustomerLedger::where('customer_id', $invoice->customer_id)
            ->where('trx_type', '=', 1)
            ->where('sale_invoice_id', $invoice->id)
            ->orderBy('id', 'DESC')->first();

        return view('sales.test', compact('invoice', 'customers', 'products', 'customers', 'get_customer_ledger', 'invoice_first_part'));
    }
    public function show($id)
    {
        $customers         =     Customer::where('customer_type', 2)->select('id', 'customer_name', 'balance')->get();
        $products          =     Product::where('stock_balance', '>', 0)->get();
        $invoice           =     SaleInvoice::where('id', $id)->first();
        $purchasd_products =     ProductSale::where('sale_invoice_id', $id)
            ->selectRaw('products_sales.*')
            ->get();
        $get_customer_ledger  = CustomerLedger::where('customer_id', $invoice->customer_id)
            ->where('trx_type', '=', 1)
            ->where('sale_invoice_id', $invoice->id)
            ->orderBy('id', 'DESC')->first();
        return view('sales.detail', compact('invoice', 'customers', 'products', 'customers', 'get_customer_ledger'));
    }
    public function printInvoice($invoice_id, $customer_id, $received_amount)
    {
        $invoiceId                  =   $invoice_id;
        $customerId                 =   $customer_id;
        $customer_balance           =   0;
        $invoice                    =   SaleInvoice::where('id', $invoiceId)->where('customer_id', $customerId)
            ->selectRaw("sale_invoices.*,
                                                        (SELECT customer_name FROM customers WHERE id ='$customerId') as customer_name,
                                                        (SELECT cr FROM customer_ledger WHERE sale_invoice_id='$invoice_id' AND customer_id='$customerId') as paid_amount
                                                        ")
            ->first();
        $invoice->received_amount   =   $received_amount ? $received_amount : $invoice->paid_amount;
        $products                   =   ProductSale::where('sale_invoice_id', $invoice_id)
            ->selectRaw("products_sales.*,
                                                    (SELECT product_name FROM products WHERE id=products_sales.product_id) as product_name")
            ->get();
        $ledgerCount      = CustomerLedger::where('customer_id', $customerId)->count();
        $customer_balance = 0;
        if ($ledgerCount > 1) {
            $customer_balance = CustomerLedger::where('customer_id', $customerId)
                // ->whereDate('created_at', '!=', Carbon::today()->toDateString())
                ->orderBy('id', 'DESC')->skip(1)->value('balance');
        }

        // $customer_balance = CustomerLedger::where('customer_id', $customerId)
        //                                     // ->whereDate('created_at', '!=', Carbon::today()->toDateString())
        //                                     ->orderBy('id', 'DESC')->value('balance');

        return view('sales.sale-invoice', compact('invoice', 'products', 'customer_balance'));
    }
    public function getSaleProduct($id)
    {
        $products   =   ProductSale::where('sale_invoice_id', $id)
            ->selectRaw('products_sales.*,
                                                (SELECT product_name FROM products WHERE id=products_sales.product_id) as product_name,
                                                (SELECT IFNULL(new_purchase_price,old_purchase_price)  FROM products WHERE id=products_sales.product_id) as purchase_price,
                                                (SELECT stock_balance FROM products WHERE id=products_sales.product_id) as stock_in_hand')
            ->get();
        return response()->json([
            'msg'       => 'Sale Product Fetched',
            'status'    => 'success',
            'products'  => $products
        ]);
    }
    public function getCustomerBalance(Request $request, $id)
    {
        if ($request->segment == 'sale-edit' || $request->segment == 'edit-sale-return') {
            $customer_count     =  CustomerLedger::where('customer_id', $id)->count();
            if ($customer_count > 1) {
                $customer_balance = CustomerLedger::where('customer_id', $id)
                    // ->whereDate('created_at', '!=', Carbon::today()->toDateString())
                    ->orderBy('id', 'DESC')->skip(1)->value('balance');
            } else {
                $customer_balance = 0;
            }
        } else {
            // $customer_balance = VendorLedger::where('customer_id',$id)->where('created_at','!=',Carbon::today()->toDateString())->orderBy('id', 'DESC')->value('balance');
            $customer_balance = Customer::where('id', $id)->value('balance');
        }

        return response()->json([
            'msg'               =>  'Vendor fetched',
            'status'            =>  'success',
            'customer_balance'  => $customer_balance
        ]);
    }
    public function allSalesList()
    {
        $customers  =   Customer::select('id', 'customer_name')->where('customer_type', 2)->get();
        return view('sales.all-list', compact('customers'));
    }
    public function fetchAllSalesList(Request $request)
    {
        $current_date   =   Date('Y-m-d');
        // $previous_date  =   new DateTime($previous_date);
        // $previous_date  =   $previous_date->modify('-1 day')->format('Y-m-d');
        if ($request->start_date != '' && $request->end_date != '') {
            $where      =   "DATE(created_at) BETWEEN '$request->start_date' AND '$request->end_date'";
        } else if ($request->customer_id != '') {
            $where      =   " customer_id = $request->customer_id";
        } else if ($request->bill_no != '') {
            $where      =   " SUBSTRING_INDEX(invoice_no, '-', 1) = '$request->bill_no'";
        } else {
            $where      =   " DATE(created_at) != '$current_date'";
        }
        $sales          =   SaleInvoice::selectRaw("
                                sale_invoices.*,DATE_FORMAT(created_at,'%d-%m-%Y %h:%i %p') as created,
                                (SELECT cr FROM customer_ledger WHERE sale_invoice_id = sale_invoices.id) as paid_amount,
                                (SELECT customer_name FROM customers WHERE id=sale_invoices.customer_id) as customer_name
                            ")->whereRaw("$where")->get();
        return response()->JSON([
            'status'    =>  'success',
            'sales'     =>  $sales
        ]);
    }
    public function deleteProduct(Request $request)
    {

        $vs      = VendorStock::where('sale_invoice_id', $request->sale_invoice_id)
            ->where('product_id', $request->product_id)
            ->where('transaction_type', 2)->orderBy('id', 'DESC')
            ->first();
        if ($vs) {
            $v_stock = updateStock($vs, $vs->balance, $request->qty, 1, 'sale', 5);
            StockManagment($v_stock->id, $vs, $request->qty, 1, 'sale');

            if ($v_stock) {
                Product::where('id', $v_stock->product_id)->update([
                    'stock_balance' =>  $v_stock->balance,
                ]);
                ProductSale::where('sale_invoice_id', $request->sale_invoice_id)
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
}
