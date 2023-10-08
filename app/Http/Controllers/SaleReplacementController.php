<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use App\Models\SaleReplacement;
use App\Models\SaleReturn;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Auth;

class SaleReplacementController extends Controller
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
        return view('sales.replacement.index', compact('sales'));
    }

    public function create(){
        $invoice_no          =   getSaleReturnNo();
        $parts               =   explode('-', $invoice_no);
        $invoice_first_part  =   $parts[0];
        $current_date        =   Carbon::today()->toDateString();
        $customers           =   Customer::where('customer_type', 2)->select('id', 'customer_name', 'balance')->get();
        $products            =   Product::where('stock_balance','!=',0)->get();

        return view('sales.replacement.create',compact('customers','current_date','invoice_first_part','products'));
    }
    public function store(Request $request)
    {
       
        if ($request->hidden_invoice_id) {
            $invoice = SaleReplacement::where('id', $request->hidden_invoice_id)->first();
            // $invoice->amount_received      =  $invoice->total_invoice_amount != $request->grand_total ?  $invoice->amount_received+$request->amount_received : $request->amount_received;
        } else {
            $invoice     = new SaleReplacement();
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
        $invoice->status               = $request->status;
        $invoice->created_by           = Auth::id();
        if ($invoice->save()) {

            if (count($request->sales_product_array) > 0) {
                $old_ids        = $request->existing_product_ids;
                foreach ($request->sales_product_array as $key => $sale_product) {
                  
                    $new_ids[]  = $sale_product['product_id'];
                    if ($sale_product['sale_prod_id'] > 0) {
                        $sale          =  ProductSale::where('id', $sale_product['sale_prod_id'])->first();
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
                    $previous_qty              = ProductSale::where('sale_invoice_id', $request->hidden_invoice_id)
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
                                $v          = $this->updateStock($previous_qty, $sale, $balance, $vendor_id, 'vendor');
                                $balance    =  $v->balance;
                            }
                        } 
                        $v_stock = $this->updateStock($previous_qty = 0, $sale, $balance, $vendor_id, 'vendor');

                        if ($v_stock->save()) {
                            $sale->vendor_stock_id = $v_stock->id;
                            if ($request->hidden_invoice_id) {
                                $old =  Stock::where('sale_invoice_id', $request->hidden_invoice_id)
                                    ->where('product_id', $sale->product_id)
                                    ->where('status', 2)
                                    ->orderBy('id', 'Desc')
                                    ->first();
                                if ($old) {
                                    $v_stock = $this->updateStock($old, $sale, $balance, $vendor_id, 'company');
                                }
                            }
                            $v_stock = $this->updateStock($old = 0, $sale, $balance, $vendor_id, 'company');

                            // $company_stock->balance              =  $balance - $sale->qty;
                            // $company_stock->qty                  =  $sale->qty;
                            // $company_stock->status               =  2; //Out
                            // $company_stock->product_id           =  $v_stock->product_id;
                            // $company_stock->amount               =  $v_stock->amount;
                            // $company_stock->qty                  =  $v_stock->qty;
                            // $company_stock->status               =  $v_stock->status;  //OUT
                            // $company_stock->balance              =  $v_stock->balance;
                            // $company_stock->created_by           =  Auth::id();
                            // $company_stock->vendor_stock_id      =  $v_stock->id;
                            // $company_stock->product_unit_price   =  $v_stock->product_unit_price;
                            // $company_stock->sale_invoice_id      =  $v_stock->sale_invoice_id;
                            // $company_stock->save();
                            Product::where('id', $v_stock->product_id)->update([
                                'stock_balance' =>  $v_stock->balance,
                            ]);
                        }
                    }
                }
               
                if ($request->hidden_invoice_id) {
                    ProductSale::where('sale_invoice_id', $request->hidden_invoice_id)
                        ->whereNotIn('id', $sale_products_array)
                        ->delete();
                    //     $ids_to_update = array_diff($old_ids, $new_ids);
                    //     if($ids_to_update){
                    //         $returns      = VendorStock::where('sale_invoice_id',$request->hidden_invoice_id)
                    //                                     ->where('status',2)->orderBy('id', 'DESC')
                    //                                     ->whereIn('product_id', $ids_to_update)->get();
                    //         if($returns){
                    //             foreach($returns  as $r){
                    //                 $stock_inHand                  = VendorStock::where('product_id',$r->product_id)
                    //                                                             ->orderBy('id','DESC')->value('balance');
                    //                 $v_stock                       =  new VendorStock();
                    //                 $v_stock->balance              =  $stock_inHand + $r->qty;
                    //                 $v_stock->qty                  =  $r->qty;
                    //                 $v_stock->status               =  1; //IN
                    //                 $v_stock->transaction_type     =  3; //Return
                    //                 $v_stock->sale_invoice_id      =  $r->sale_invoice_id;
                    //                 $v_stock->product_unit_price   =  $r->product_unit_price;
                    //                 $v_stock->product_id           =  $r->product_id;
                    //                 $v_stock->vendor_id            =  $r->vendor_id;
                    //                 $v_stock->date                 =  $sale->created_at;
                    //                 $v_stock->amount               =  $r->amount;
                    //                 $v_stock->created_by           =  Auth::id();
                    //                 if($v_stock->save()){
                    //                     $v_stock->vendor_stock_id = $v_stock->id;
                    //                     unset($v_stock->vendor_id);
                    //                     $stockData = $v_stock->toArray();
                    //                     Stock::insert($stockData);
                    //                     Product::where('id', $v_stock->product_id)->update([
                    //                         'stock_balance' =>  $v_stock->balance,
                    //                     ]);
                    //                 }
                    //             }
                    //     }

                    // }
                    // ->update(['some_column' => 'some_value']);
                    // VendorStock::where('sale_invoice_id',$request->hidden_invoice_id)->whereNotIn('product_id',)
                }

                $customer_ledger       =  CustomerLedger::where('customer_id', $request->customer_id)->orderBy('id', 'DESC')->first();
                if ($customer_ledger) {
                    $balance           =   $customer_ledger->balance;
                } else {
                    $balance           =   0;
                }
                if ($request->hidden_invoice_id) {
                    $customer_ledger   =   CustomerLedger::where('sale_invoice_id', $request->hidden_invoice_id)->orderBy('id', 'DESC')->first();
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
                $customer_ledger->sale_invoice_id = $invoice->id;
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

}
