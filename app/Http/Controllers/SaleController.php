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
use Illuminate\Support\Str;
use Auth;
use Laravel\Ui\Presets\React;

class SaleController extends Controller
{
   
    public function create()
    {   $invoice_no   =  'inv-'.Str::uuid()->toString();
        $current_date =   Carbon::today()->toDateString();
        $customers    =   Customer::where('customer_type',2)->select('id','customer_name', 'balance')->get();
        $products     =   Product::where('stock_balance','>','0')->get();
        return view('sales.add',compact('customers','current_date','invoice_no','products'));
    }
    public function getVendors(){
        $customers      = Customer::where('customer_type',2)->get(); //1=vendor
        return response()->json([
            'msg'       => 'Vendor Fetched',
            'status'    => 'success',
            'customers' => $customers
        ]);
    }
    Public function saleInvoice(Request $request){
        dd($request->all());
        if($request->hidden_invoice_id){
            // Stock::where('purchase_invoice_id',$request->hidden_invoice_id)->delete();
            $invoice = SaleInvoice::where('id',$request->hidden_invoice_id)->first();
        }else{
            $invoice = new SaleInvoice();
        }
        $invoice->date                 = $request->invoice_date;
        $invoice->invoice_no           = $request->invoice_no;
        $invoice->customer_id          = $request->customer_id;
        $invoice->total_invoice_amount = $request->grand_total+$request->service_charges;
        $invoice->service_charges      = $request->service_charges;
        $invoice->status               = $request->status;
        $invoice->created_by           = Auth::id();
        if($invoice->save()){
            if(count($request->sales_product_array) > 0){
                foreach($request->sales_product_array as $sale_product){
                    // dd($sale_product['new_price']);
                    $sale                      = new ProductSale();
                    $sale->sale_price          = $sale_product['retail_price'];
                    $sale->sale_invoice_id     = $invoice->id;
                    $sale->product_id          = $sale_product['product_id'];
                    $sale->qty                 = $sale_product['qty'];
                    $sale->sale_total_amount   = $sale_product['amount'];
                    $sale->created_by          = Auth::id();
                    if($sale->save()){
                        $sale_products_array[] = $sale->product_id;
                        $check_stock           =  VendorStock::where('product_id',$sale->product_id)->orderBy('id', 'DESC')->first();
                        $vendor_id             =    $check_stock->vendor_id;
                        if($check_stock){
                            $balance           =  $check_stock->balance; 
                        } 
                        $status = 0;    
                        $v_stock   =  new VendorStock();
                        if($request->hidden_invoice_id){
                            $stock   = VendorStock::where('purchase_invoice_id',$request->hidden_invoice_id)
                                                   ->where('product_id',$sale->product_id)->orderBy('id', 'DESC')->first();
                            $in_hand = 0;
                            if($stock){ 
                                if($sale->qty > $stock->qty){
                                    $in_hand   = $sale->qty-$stock->qty;
                                    $balance   = $balance+$in_hand;
                                    $status    = 1;     //in 
                                }else if($stock->qty > $sale->qty){
                                    $in_hand = $stock->qty-$sale->qty;
                                    $balance     = $balance-$in_hand;
                                    $status      = 2;     //out 
                                }else if($sale->qty == $stock->qty){
                                    $in_hand     = $stock->qty;
                                    $balance     = $stock->balance;
                                    $status      = 1;     //in 
                                }
                                $v_stock->qty         = $in_hand;
                                $v_stock->status      = $status;      
                                $v_stock->balance     = $balance;
                            }else{
                                $v_stock->status      = 1;  //in    
                                $v_stock->balance     = $sale->qty+$balance;
                                $v_stock->qty         = $sale->qty;
                            }
                        }else{
                            $status                =  2; //Out      
                            $v_stock->balance      =  $balance-$sale->qty;
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
                        if($v_stock->save()){
                            $company_stock               =  new Stock();
                            $company_stock->product_id   =  $v_stock->product_id;
                            $company_stock->amount       =  $v_stock->amount;
                            $company_stock->qty          =  $v_stock->qty;
                            $company_stock->status       =  2;    //out
                            $company_stock->balance      =  $v_stock->balance;
                            $company_stock->created_by   =  Auth::id();
                            $company_stock->vendor_stock_id      = $v_stock->id;
                            $company_stock->product_unit_price   = $v_stock->product_unit_price;
                            $company_stock->sale_invoice_id      = $v_stock->sale_invoice_id;
                            $company_stock->save();
                            Product::where('id',$v_stock->product_id)->update([
                                'stock_balance' =>  $v_stock->balance,
                            ]);
                        }
                    }
                }
                 
                $customer_ledger        =  CustomerLedger::where('customer_id',$request->customer_id)->orderBy('id', 'DESC')->first();
                if($customer_ledger){
                    $balance           =   $customer_ledger->balance;
                }else{
                    $balance           =   0;
                }
                if($request->hidden_invoice_id){
                    $customer_ledger   =   CustomerLedger::where('sale_invoice_id',$request->hidden_invoice_id)->orderBy('id', 'DESC')->first();
                }else{
                    $customer_ledger   =   new  CustomerLedger();
                }
                $customer_ledger->cr          = $invoice->total_invoice_amount;
                $customer_ledger->date        = $request->invoice_date;
                $customer_ledger->customer_id = $request->customer_id;
                $customer_ledger->dr          = $request->amount_paid;
                $customer_ledger->balance     = ($invoice->total_invoice_amount-$request->amount_paid); //balance
                $customer_ledger->created_by  = Auth::id();
                $customer_ledger->sale_invoice_id= $invoice->id;
                $customer_ledger->save();
                Customer::where('id',$request->customer_id)->update([
                    'balance' => $customer_ledger->balance,
                ]);
            }
            // $pdf = PDF::loadView('invoice', compact('invoice'));
            // return $pdf->download('invoice.pdf');
            return response()->json([
                'msg'        =>  'Product Invoice has generated.',
                'status'     =>  'success',
                'invoice_id' =>  $invoice->id,
                'customer_id'=>  $invoice->customer_id, 
            ]);
        }
    }
    public function saleList(){
      $sales     =   SaleInvoice::selectRaw('sale_invoices.* ,
                                        (SELECT dr FROM customer_ledger WHERE sale_invoice_id = sale_invoices.id) as paid_amount,
                                        (SELECT customer_name FROM customers WHERE id=sale_invoices.customer_id) as customer_name')
                                    ->whereIn('sale_invoices.id', function ($query) {
                                        $query->selectRaw('MAX(id)')
                                            ->from('sale_invoices')
                                            ->whereDate('created_at', Carbon::today())
                                            ->groupBy('customer_id');
                                    })
                                    ->orderBy('id', 'desc')
                                    ->get();

        return view('sales.list',compact('sales'));

    }
    public function editSale($id){
        $customers         =     Customer::where('customer_type',2)->select('id','customer_name','balance')->get();
        $products          =     Product::where('stock_balance','>',0)->get();
        $invoice           =     SaleInvoice::where('id',$id)->first();
        $purchasd_products =     ProductSale::where('sale_invoice_id',$id)
                                 ->selectRaw('products_sales.*')
                                 ->get();
        $get_customer_ledger  = CustomerLedger::where('customer_id', $invoice->customer_id)->orderBy('id', 'DESC')->first();

        return view('sales.add',compact('invoice','customers','products','customers','get_customer_ledger'));
    }
    public function printInvoice(Request $request){
        $invoiceId = $request->input('invoice_id');
        $customerId = $request->input('customer_id');
    
        $invoice = SaleInvoice::where('id',$invoiceId)->where('customer_id',$customerId)
                         ->selectRaw('sale_invoices.*,(SELECT customer_name FROM customers WHERE id ='.$customerId.') as customer_name')->first(); 
    
        return view('sales.invoice', compact('invoice'));
    }
    public function getSaleProduct($id){
        $products   =   ProductSale::where('sale_invoice_id',$id)
                                    ->selectRaw('products_sales.*,
                                     (SELECT product_name FROM products WHERE id=products_sales.product_id) as product_name,
                                     (SELECT stock_balance FROM products WHERE id=products_sales.product_id) as stock_in_hand')->get();
        return response()->json([
            'msg'       => 'Sale Product Fetched',
            'status'    => 'success',
            'products'  => $products
        ]);

    }
    public function getCustomerBalance(Request $request,$id){
        if($request->segment == 'sale-edit'){
            $customer_count     =  CustomerLedger::where('customer_id',$id)->count();
           if($customer_count > 1){
               $customer_balance = CustomerLedger::where('customer_id',$id)->where('customer_type',2)
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
}
