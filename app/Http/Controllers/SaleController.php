<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\Product;
use App\Models\ProductSale;
use App\Models\Sale as SaleInvoice;
use App\Models\Stock;
use App\Models\VendorStock;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Auth;
use Laravel\Ui\Presets\React;
use stdClass;

class SaleController extends Controller
{

    public function create()
    {
        $invoice_no   =   getInvoice();
        $parts        = explode('-', $invoice_no);
        $invoice_first_part   = $parts[0];
        $current_date =   Carbon::today()->toDateString();
        $customers    =   Customer::where('customer_type', 2)->select('id', 'customer_name', 'balance')->get();
        $products     =   Product::get();
        return view('sales.test', compact('customers', 'current_date', 'invoice_no', 'products','invoice_first_part'));
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
    public function updateStock($v_stock, $stock, $sale, $balance)
    {
        if ($stock) {
            if ($stock->qty > $sale->qty) {
                $in_hand   = $stock->qty - $sale->qty;
                $balance   = $balance + $in_hand;
                $status    = 1;     //in 
            } else if ($sale->qty > $stock->qty) {
                $in_hand     = $sale->qty - $stock->qty;
                $balance     = $balance - $in_hand;
                $status      = 2;     //out 
            } else if ($sale->qty == $stock->qty) {
                $in_hand     = $stock->qty;
                $balance     = $stock->balance;
                $status      = 0;     //in 
            }
            $v_stock->qty         = $in_hand;
            $v_stock->status      = $status;
            $v_stock->balance     = $balance;
        } else {
            $v_stock->status      = 2;  //Out    
            $v_stock->balance     = $balance - $sale->qty;
            $v_stock->qty         = $sale->qty;
        }
        return $v_stock;
    }

    public function saleInvoice(Request $request)
    {

        // dd($request->all());
        if ($request->hidden_invoice_id) {
            $invoice = SaleInvoice::where('id', $request->hidden_invoice_id)->first();
            // $invoice->amount_received      =  $invoice->total_invoice_amount != $request->grand_total ?  $invoice->amount_received+$request->amount_received : $request->amount_received; 
        } else {
            $invoice     = new SaleInvoice();
             SaleInvoice::where('customer_id', $request->customer_id)
                        ->whereDate('created_at', Carbon::today())
                        ->where('invoice_type',2)
                        ->where('is_editable',1)
                        ->orderBy('customer_id','DESC')->update(['is_editable'=>0]);

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
        $invoice->total_invoice_amount = ($request->product_net_total + $request->service_charges + $request->previous_receivable)- $request->invoice_discount;
        $invoice->invoice_remaining_amount_after_pay  =  $invoice->total_invoice_amount-$request->amount_received;
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
                $ids = $request->existing_product_ids;
                foreach ($request->sales_product_array as $key => $sale_product) {
                    if ($sale_product['sale_prod_id'] > 0) {
                        $sale          =  ProductSale::where('id', $sale_product['sale_prod_id'])->first();
                    } else {
                        $sale          =  new ProductSale();
                    }
                    $sale->sale_price          = $sale_product['retail_price'];
                    $sale->sale_invoice_id     = $invoice->id;
                    $sale->product_id          = $sale_product['product_id'];
                    $sale->qty                 = $sale_product['qty'];
                    $sale->sale_total_amount   = $sale_product['amount'];
                    $sale->product_discount   = $sale_product['prod_discount'];
                    $sale->created_by          = Auth::id();
                    if ($sale->save()) {
                        $sale_products_array[] = $sale->id;
                        $check_stock           =  VendorStock::where('product_id', $sale->product_id)->orderBy('id', 'DESC')->first();
                        $vendor_id             =  $check_stock->vendor_id;
                        if ($check_stock) {
                            $balance           =  $check_stock->balance;
                        }
                        $status = 0;
                        $v_stock   =  new VendorStock();
                        if ($request->hidden_invoice_id) {
                            $stock   = VendorStock::where('sale_invoice_id', $request->hidden_invoice_id)
                                ->where('product_id', $sale->product_id)->orderBy('id', 'DESC')->first();
                            $in_hand = 0;
                            $v_stock = $this->updateStock($v_stock,$stock, $sale, $balance);  
                        } else {
                            $status                =  2; //Out      
                            $v_stock->balance      =  $balance - $sale->qty;
                            $v_stock->qty          =  $sale->qty;
                            $v_stock->status       =  2; //Out
                        }
                        $v_stock->transaction_type     =  2; //sale
                        $v_stock->sale_invoice_id      =  $sale->sale_invoice_id;
                        $v_stock->product_unit_price   =  $sale_product['purchased_price'];
                        $v_stock->product_id           =  $sale->product_id;
                        $v_stock->vendor_id            =  $vendor_id;
                        $v_stock->date                 =  $sale->created_at;
                        $v_stock->amount               =  $sale->sale_total_amount;
                        $v_stock->created_by           =  Auth::id();
                        if ($v_stock->save()) {
                            $company_stock             =  new Stock();

                            if ($request->hidden_invoice_id) {
                                $stock   = Stock::where('sale_invoice_id', $request->hidden_invoice_id)
                                    ->where('product_id', $sale->product_id)->orderBy('id', 'DESC')->first();
                                $in_hand = 0;
                                $v_stock = $this->updateStock($v_stock,$stock, $sale, $balance);   
                            } else {
                                $status                =  2; //Out      
                                $v_stock->balance      =  $balance - $sale->qty;
                                $v_stock->qty          =  $sale->qty;
                                $v_stock->status       =  2; //Out
                            }


                            $company_stock->product_id   =  $v_stock->product_id;
                            $company_stock->amount       =  $v_stock->amount;
                            $company_stock->qty          =  $v_stock->qty;
                            $company_stock->status       =  $v_stock->status;    //out
                            $company_stock->balance      =  $v_stock->balance;
                            $company_stock->created_by   =  Auth::id();
                            $company_stock->vendor_stock_id      = $v_stock->id;
                            $company_stock->product_unit_price   = $v_stock->product_unit_price;
                            $company_stock->sale_invoice_id      = $v_stock->sale_invoice_id;
                            $company_stock->save();
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
                'invoice_id' =>  $invoice->id,
                'customer_id' =>  $invoice->customer_id,
            ]);
        }
    }
    public function saleList()
    {
        $sales     =   SaleInvoice::selectRaw('sale_invoices.* ,
                                        (SELECT cr FROM customer_ledger WHERE sale_invoice_id = sale_invoices.id) as paid_amount,
                                        (SELECT customer_name FROM customers WHERE id=sale_invoices.customer_id) as customer_name')
            ->whereDate('created_at', Carbon::today())
            ->orderBy('id', 'DESC')
            ->get();
        return view('sales.list', compact('sales'));
    }
    public function editSale($id)
    {
        $customers          =     Customer::where('customer_type', 2)->select('id', 'customer_name', 'balance')->get();
        $products           =     Product::where('stock_balance', '>', 0)->get();
        $invoice            =     SaleInvoice::where('id', $id)->first();
        $parts              =     explode('-', $invoice->invoice_no);
        $invoice_first_part =     $parts[0];
        $purchasd_products  =     ProductSale::where('sale_invoice_id', $id)
                                                ->selectRaw('products_sales.*')
                                                ->get();
        $get_customer_ledger  = CustomerLedger::where('customer_id', $invoice->customer_id)
                                                ->where('trx_type', '=', 1)
                                                ->where('sale_invoice_id',$invoice->id)
                                                ->orderBy('id', 'DESC')->first(); 
        return view('sales.test', compact('invoice', 'customers', 'products', 'customers', 'get_customer_ledger','invoice_first_part'));
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
                                                ->where('sale_invoice_id',$invoice->id)
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
                                           
        return view('sales.sale-invoice', compact('invoice', 'products','customer_balance'));
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
        if ($request->segment == 'sale-edit') {
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
}
