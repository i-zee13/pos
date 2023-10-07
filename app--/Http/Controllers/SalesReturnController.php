<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\Product;
use App\Models\SaleReturn;
use App\Models\SaleReturnProduct;
use App\Models\Stock;
use App\Models\VendorStock;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Auth;
use Illuminate\Support\Facades\Route;

class SalesReturnController extends Controller
{
    public function index()
    {
        $current_date   =   date('Y-m-d');
        $sales          =   SaleReturn::selectRaw('sale_return_invoices.* ,
                                        (SELECT cr FROM customer_ledger WHERE sale_invoice_id = sale_return_invoices.id) as paid_amount,
                                        (SELECT customer_name FROM customers WHERE id=sale_return_invoices.customer_id) as customer_name')
                                        ->whereRaw("Date(created_at) = '$current_date'")
                                        ->orderBy('id', 'DESC')
                                        ->get();
                                        
        return view('sales.return.index', compact('sales'));
    }
    public function create(){
       
        $invoice_no          =   getSaleReturnNo();
        $parts               =   explode('-', $invoice_no); 
        $invoice_first_part  =   $parts[0];
        $current_date        =   Carbon::today()->toDateString();
        $customers           =   Customer::where('customer_type', 2)->select('id', 'customer_name', 'balance')->get(); 
        $products            =   Product::get(); 
        
        return view('sales.return.create',compact('customers','current_date','invoice_first_part','products'));
    }
    public function store(Request $request)
    { 
       
        if ($request->hidden_invoice_id) {
            $invoice = SaleReturn::where('id', $request->hidden_invoice_id)->first();
        } else {
            $invoice     = new SaleReturn();
            isEditable($request->customer_id); 
        }

        $invoice->amount_received      = $request->amount_received;
        $invoice->date                 = $request->invoice_date;
        $invoice->invoice_no           = $request->invoice_no;
        $invoice->invoice_type         = $request->invoice_type;
        $invoice->customer_id          = $request->customer_id;

        // if ($request->invoice_type == 1) {
        //     $invoice->paid_amount      = $request->amount_to_pay;
        // } else {
        //     $invoice->paid_amount      = $request->amount_received ? $request->amount_received : 0;
        // }

        $invoice->total_invoice_amount = ($request->product_net_total + $request->service_charges ) - $request->invoice_discount - $request->amount_received;
        $invoice->invoice_remaining_amount_after_pay  =  $invoice->total_invoice_amount - $request->previous_receivable ;
     
        // $invoice->total_invoice_amount = ($request->product_net_total + $request->service_charges ) - $request->invoice_discount;
        // $invoice->invoice_remaining_amount_after_pay  =  $invoice->total_invoice_amount - $request->amount_received - $request->previous_receivable;
        
        $invoice->service_charges      = $request->service_charges;
        $invoice->invoice_discount     = $request->invoice_discount;
        $invoice->cash_return          = $request->cash_return;
        $invoice->product_net_total    = $request->product_net_total;
        $invoice->previous_receivable  = $request->previous_receivable;
        $invoice->is_editable          = 1;
        $invoice->status               = $request->invoice_type;
        $invoice->created_by           = Auth::id();
        if ($invoice->save()) {
            if (count($request->sales_product_array) > 0) { 
                foreach ($request->sales_product_array as $key => $sale_product) {
                    $new_ids[] = $sale_product['product_id'];
                    if ($sale_product['sale_prod_id'] > 0) {
                        $sale                  = SaleReturnProduct::where('id', $sale_product['sale_prod_id'])->first();
                    } else {
                        $sale                  = new SaleReturnProduct();
                    }
                    $sale->sale_price          = $sale_product['retail_price'];
                    $sale->sale_invoice_id     = $invoice->id;
                    $sale->invoice_no          = $invoice->invoice_no;
                    $sale->company_id          = Product::where('id', $sale_product['product_id'])->value('company_id');
                    $sale->product_id          = $sale_product['product_id'];
                    $sale->purchase_price      = $sale_product['purchased_price'];
                    $sale->qty                 = $sale_product['qty'];
                    $sale->sale_total_amount   = $sale_product['amount'];
                    $sale->product_discount    = $sale_product['prod_discount'];
                    $sale->created_by          = Auth::id();


                    $previous_qty = SaleReturnProduct::where('sale_invoice_id', $request->hidden_invoice_id)
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
                        $status = 0;
                        $sale->purchased_price = $sale_product['purchased_price'];
                        if ($request->hidden_invoice_id) { 
                            if ($previous_qty != 0) {
                                $v       = updateStock($previous_qty, $sale, $balance, $vendor_id, 'vendor');
                                $balance =  $v->balance;
                            }
                        }
                        $v_stock = updateStock($previous_qty = 0, $sale, $balance, $vendor_id, 'vendor');

                        if ($v_stock->save()) {
                            // $sale->vendor_stock_id = $v_stock->id;
                            // if ($request->hidden_invoice_id) {
                            //     $old =  Stock::where('sale_invoice_id', $request->hidden_invoice_id)
                            //                 ->where('product_id', $sale->product_id)
                            //                 ->where('status', 2)
                            //                 ->orderBy('id', 'Desc')
                            //                 ->first();
                            //     if ($old) {
                            //         $v_stock = updateStock($old, $sale, $balance, $vendor_id, 'company');
                            //     }
                            // }
                            // $v_stock =  updateStock($old = 0, $sale, $balance, $vendor_id, 'company');
                            Product::where('id', $v_stock->product_id)->update([
                                'stock_balance' =>  $v_stock->balance,
                            ]);
                        }
                    }
                }
                if ($request->hidden_invoice_id) {
                    SaleReturnProduct::where('sale_invoice_id', $request->hidden_invoice_id)
                        ->whereNotIn('id', $sale_products_array)
                        ->delete();
                } 
                if ($request->hidden_invoice_id) {
                    $customer_ledger   =   CustomerLedger::where('sale_return_invoice_id', $request->hidden_invoice_id)->orderBy('id', 'DESC')->first();
                } else {
                    $customer_ledger   =   new  CustomerLedger(); 
                } 
                // $customer_ledger->cr          = $invoice->paid_amount;           // sales
                $customer_ledger->cr          = $invoice->total_invoice_amount;  //Returs
                $customer_ledger->dr          = $invoice->amount_received;
                $customer_ledger->date        = $request->invoice_date;
                $customer_ledger->customer_id = $request->customer_id;
                $customer_ledger->trx_type    = 2;                     //Return
                if($invoice->invoice_type == 1 && $invoice->invoice_remaining_amount_after_pay == $invoice->amount_received){
                    $customer_ledger->balance     =  0; //balance
                }else{
                    $customer_ledger->balance     =  $request->previous_receivable - $invoice->total_invoice_amount; //balance
                }
            
                $customer_ledger->created_by  = Auth::id();
                $customer_ledger->sale_return_invoice_id = $invoice->id;
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
                  
        $customers          =     Customer::where('customer_type', 2)->select('id', 'customer_name', 'balance')->get();
        $products           =     Product::get();
        $invoice            =     SaleReturn::where('id', $id)->first();
        $parts              =     explode('-', $invoice->invoice_no);
        $invoice_first_part =     $parts[0];
        $purchasd_products  =     SaleReturnProduct::where('sale_invoice_id', $id)
                                                    ->selectRaw('sale_return_products.*')
                                                    ->get();
        $get_customer_ledger  = CustomerLedger::where('customer_id', $invoice->customer_id)
                                                ->where('trx_type', '=', 2)
                                                ->where('sale_return_invoice_id', $invoice->id)
                                                ->orderBy('id', 'DESC')->first(); 
        return view('sales.return.create', compact('invoice', 'customers', 'products', 'customers', 'get_customer_ledger', 'invoice_first_part'));
    }
    public function getReturnProduct($id)
    {
        $products   =   SaleReturnProduct::where('sale_invoice_id', $id)
            ->selectRaw('sale_return_products.*,
                                                (SELECT product_name FROM products WHERE id=sale_return_products.product_id) as product_name,
                                                (SELECT IFNULL(new_purchase_price,old_purchase_price)  FROM products WHERE id=sale_return_products.product_id) as purchase_price,
                                                (SELECT stock_balance FROM products WHERE id=sale_return_products.product_id) as stock_in_hand')
            ->get();
        return response()->json([
            'msg'       => 'Sale Product Fetched',
            'status'    => 'success',
            'products'  => $products
        ]);
    }
    public function printInvoice($invoice_id, $customer_id, $received_amount)
    {
          
        $invoiceId                  =   $invoice_id;
        $customerId                 =   $customer_id;
        $customer_balance           =   0;
        $invoice                    =   SaleReturn::where('id', $invoiceId)->where('customer_id', $customerId)
                                                    ->selectRaw("sale_return_invoices.*,
                                                        (SELECT customer_name FROM customers WHERE id ='$customerId') as customer_name,
                                                        (SELECT cr FROM customer_ledger WHERE sale_invoice_id='$invoice_id' AND customer_id='$customerId') as paid_amount
                                                        ")
                                                    ->first(); 
        $invoice->received_amount   =   $received_amount ? $received_amount : $invoice->paid_amount;
        $products                   =   SaleReturnProduct::where('sale_invoice_id', $invoice_id)
                                                    ->selectRaw("sale_return_products.*,
                                                    (SELECT product_name FROM products WHERE id=sale_return_products.product_id) as product_name")
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
}