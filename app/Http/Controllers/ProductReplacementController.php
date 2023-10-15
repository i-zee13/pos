<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\Product;
use App\Models\ProductReplacement;
use App\Models\ProductReplacementInvoice; 
use App\Models\SaleReturn;
use App\Models\Stock;
use App\Models\VendorStock;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Auth;

class ProductReplacementController extends Controller
{

    public function index()
    {
        $current_date   =   date('Y-m-d');
        $sales          =   ProductReplacementInvoice::selectRaw('product_replacment_invoices.* ,
                                        (SELECT cr FROM customer_ledger WHERE sale_invoice_id = product_replacment_invoices.id) as paid_amount,
                                        (SELECT customer_name FROM customers WHERE id=product_replacment_invoices.customer_id) as customer_name')
                                        ->whereRaw("Date(created_at) = '$current_date'")
                                        ->orderBy('id', 'DESC')
                                        ->get(); 
        return view('sales.replacement.index', compact('sales'));
    }

    public function create(){
        $invoice_no          =   getProductReplacementNo();
        $parts               =   explode('-', $invoice_no);
        $invoice_first_part  =   $parts[0];
        $current_date        =   Carbon::today()->toDateString();
        $customers           =   Customer::where('customer_type', 2)->select('id', 'customer_name', 'balance')->get();
        $products            =   Product::where('stock_balance','!=',0)->get();

        return view('sales.replacement.create',compact('customers','current_date','invoice_first_part','products','invoice_no'));
    }
    public function store(Request $request)
    {
    //    dd($request->all());
        if ($request->hidden_invoice_id) {
            $invoice = ProductReplacementInvoice::where('id', $request->hidden_invoice_id)->first();
            // $invoice->amount_received      =  $invoice->total_invoice_amount != $request->grand_total ?  $invoice->amount_received+$request->amount_received : $request->amount_received;
        } else {
            $invoice     = new ProductReplacementInvoice();
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
        $invoice->total_invoice_amount = ($request->product_net_total + $request->service_charges + $request->previous_receivable) - $request->invoice_discount  - $request->return_total;
        $invoice->invoice_remaining_amount_after_pay  =  $invoice->total_invoice_amount - $request->amount_received;
        $invoice->service_charges      = $request->service_charges;
        $invoice->invoice_discount     = $request->invoice_discount;
        $invoice->cash_return          = $request->cash_return;
        $invoice->product_return_total = $request->return_total;
        $invoice->product_net_total    = $request->product_net_total;
        $invoice->previous_receivable  = $request->previous_receivable;
        $invoice->is_editable          = 1;
        $invoice->status               = $request->status;
        $invoice->created_by           = Auth::id();
        if ($invoice->save()) {

            if (count($request->sales_product_array) > 0) {
                $old_ids        = $request->existing_product_ids;
                foreach ($request->sales_product_array as $key => $sale_product) {
                    $new_ids[]  = $sale_product['product_id'];
                    if ($sale_product['sale_prod_id'] > 0) {
                        $sale          =  ProductReplacement::where('id', $sale_product['sale_prod_id'])->first();
                    } else {
                        $sale          =  new ProductReplacement();
                    }
                    $sale->sale_price          = $sale_product['retail_price'];
                    $sale->product_replacement_invoice_id     = $invoice->id;
                    $sale->invoice_no          = $invoice->invoice_no;
                    $sale->company_id          = Product::where('id', $sale_product['product_id'])->value('company_id');
                    $sale->product_id          = $sale_product['product_id'];
                    $sale->qty                 = $sale_product['qty'];
                    $sale->sale_total_amount   = $sale_product['amount'];
                    $sale->product_discount    = $sale_product['prod_discount'];
                    $sale->product_type        = $sale_product['prod_type'];
                    $sale->expiry_date         = $sale_product['expiry_date'];
                    $sale->created_by          = Auth::id(); 
                    $previous_qty              = ProductReplacement::where('product_replacement_invoice_id', $request->hidden_invoice_id)
                                                            ->where('product_id', $sale->product_id)
                                                            ->orderBy('id', 'Desc')
                                                            ->value('qty');

                    if ($sale->save()) {
                        $sale_products_array[] = $sale->id;
                        $check_stock           =  VendorStock::where('product_id', $sale->product_id)->orderBy('id', 'DESC')->first();
                        $vendor_id             =  $check_stock->vendor_id;
                        if ($check_stock) {
                            $balance           =  $check_stock->balance;
                        } 
                        $sale->purchased_price = $sale_product['purchased_price'];
                        if ($request->hidden_invoice_id) {
                            if ($previous_qty > 0) {
                                $v          =  $this->updateStock($previous_qty, $sale, $balance, $vendor_id, 'vendor');
                                $balance    =  $v->balance;
                            }
                        } 
                        $v_stock = $this->updateStock($previous_qty = 0, $sale, $balance, $vendor_id, 'vendor');
                        if ($v_stock->save()) {
                            $sale->vendor_stock_id = $v_stock->id; 
                            // if ($request->hidden_invoice_id) {
                            //     $old =  VendorStock::where('product_replacement_invoice_id', $request->hidden_invoice_id)
                            //                                 ->where('product_id', $sale->product_id)
                            //                                 ->where('status', 2)
                            //                                 ->orderBy('id', 'Desc')
                            //                                 ->first();
                            //     if ($old) {
                            //         $v_stock = $this->updateStock($old, $sale, $balance, $vendor_id, 'company');
                            //     }
                            // }
                            // $v_stock = $this->updateStock($old = 0, $sale, $balance, $vendor_id, 'company');
                            Product::where('id', $v_stock->product_id)->update([
                                'stock_balance' =>  $v_stock->balance,
                            ]);
                        }
                    }
                }
               
                if ($request->hidden_invoice_id) {
                    ProductReplacement::where('product_replacement_invoice_id', $request->hidden_invoice_id)
                                    ->whereNotIn('id', $sale_products_array)
                                    ->delete();
                    
                }

                $customer_ledger       =  CustomerLedger::where('customer_id', $request->customer_id)->orderBy('id', 'DESC')->first();
                if ($customer_ledger) {
                    $balance           =   $customer_ledger->balance;
                } else {
                    $balance           =   0;
                }
                if ($request->hidden_invoice_id) {
                    $customer_ledger   =   CustomerLedger::where('product_replacement_invoice_id', $request->hidden_invoice_id)->orderBy('id', 'DESC')->first();
                    // $previous_recived  =   $customer_ledger->cr;
                } else {
                    $customer_ledger   =   new  CustomerLedger();
                    // $previous_recived  =   0;
                }
                $customer_ledger->cr          = $invoice->paid_amount; 
                $customer_ledger->date        = $request->invoice_date;
                $customer_ledger->customer_id = $request->customer_id;
                $customer_ledger->trx_type    = 1;  //Sale
                $customer_ledger->dr          = $invoice->total_invoice_amount;
                $customer_ledger->balance     = ($invoice->total_invoice_amount - $customer_ledger->cr); //balance
                $customer_ledger->created_by  = Auth::id();
                $customer_ledger->product_replacement_invoice_id = $invoice->id;
                $customer_ledger->save();
                Customer::where('id', $request->customer_id)->update([
                    'balance' => $customer_ledger->balance,
                ]);
            }
            // $pdf = PDF::loadView('invoice', compact('invoice'));
            // return $pdf->download('invoice.pdf');
            return response()->json([
                'msg'        =>  'Product Invoice has generated.',
                'status'     =>  'success',
                'invoice_id'  =>  $invoice->id,
                'customer_id' =>  $invoice->customer_id,
            ]);
        }
    }
    public function edit($id)
    {
        $invoice            =     ProductReplacementInvoice::where('id', $id)->first();
        $customers          =     Customer::where('customer_type', 2)->select('id', 'customer_name', 'balance')->get();
        $products           =     Product::where('stock_balance','!=',0)->get();
        $parts              =     explode('-', $invoice->invoice_no);
        $invoice_first_part =     $parts[0];
        $purchasd_products  =     ProductReplacement::where('product_replacement_invoice_id', $id)
                                                    ->selectRaw('product_replacements.*')
                                                    ->get();
        $get_customer_ledger  = CustomerLedger::where('customer_id', $invoice->customer_id)
                                                ->where('trx_type', '=', 1)
                                                ->where('product_replacement_invoice_id', $invoice->id)
                                                ->orderBy('id', 'DESC')->first();

        return view('sales.replacement.create', compact('invoice','products', 'customers', 'get_customer_ledger', 'invoice_first_part'));
    }

    public function getReplacmentProduct($id)
    {
        $products   =   ProductReplacement::where('product_replacement_invoice_id', $id)
                                            ->selectRaw('product_replacements.*,
                                                        (SELECT product_name FROM products WHERE id=product_replacements.product_id) as product_name,
                                                        (SELECT IFNULL(new_purchase_price,old_purchase_price)  FROM products WHERE id=product_replacements.product_id) as purchase_price,
                                                        (SELECT stock_balance FROM products WHERE id=product_replacements.product_id) as stock_in_hand')
                                            ->get();
        return response()->json([
            'msg'       => 'Sale Product Fetched',
            'status'    => 'success',
            'products'  => $products
        ]);
    }
    public function updateStock($previous_qty, $sale, $balance, $vendor_id, $type)
    {
        $old_record = '';
        $old_record          =  $sale;
        $v                   =  new VendorStock();
        $v->vendor_id        =  $vendor_id; 
        $v->transaction_type = $sale->product_type == 1 ? 3 : 2; 
        if($previous_qty > 0){
            $v->qty         =  $previous_qty;
            $v->status      =  $sale->product_type == 1 ? 2 : 1;   //Product_type 1 = Replace , 2 = New Sale  and Status 2 - Out  , 1- IN
            $v->balance     =   $sale->product_type == 1 ? $balance -  $v->qty : $balance +  $v->qty;
        }else{
            $v->status      =   $sale->product_type == 1 ? 1 : 2;   //Product_type 1 = Replace , 2 = New Sale  and Status 2 - Out  , 1- IN
            $v->qty         =   $sale->qty;
            $v->balance     =   $sale->product_type == 1 ? $balance +  $v->qty : $balance - $v->qty;
        }
        $v->product_replacement_invoice_id    =  $old_record != '' && !empty($old_record) ? $old_record->product_replacement_invoice_id  : $sale->product_replacement_invoice_id;
        $v->product_unit_price   =  $sale->purchased_price;
        $v->product_id           =  $old_record != '' && !empty($old_record) ? $old_record->product_id  : $sale->product_id;
        $v->date                 =  $old_record != '' && !empty($old_record) ? $old_record->created_at  : $sale->created_at;
        $v->amount               =  $old_record != '' && !empty($old_record) ? $old_record->sale_total_amount  : $sale->sale_total_amount;
        $v->created_by           =  Auth::id();
        $v->save();
        return $v;
    }

    public function deleteProduct(Request $request){
        return  deleteProduct($request);
    }
    public function getCustomerBalance(Request $request, $id){
        return  getCustomerBalance($request, $id);
    }

}
