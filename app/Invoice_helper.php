<?php

use App\Models\AdminSaleClose;
use App\Models\City;
use App\Models\Country;
use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\PostalCode;
use App\Models\Product;
use App\Models\ProductPurchase;
use App\Models\ProductReplacement;
use App\Models\ProductReplacementInvoice;
use App\Models\ProductReturns;
use App\Models\ProductSale;
use App\Models\PurchaseInvoice;
use App\Models\PurchaseReturn;
use App\Models\State;
use App\Models\Sale as SaleInvoice;
use App\Models\SaleReplacement;
use App\Models\SaleReturn;
use App\Models\SaleReturnProduct;
use App\Models\Stock;
use App\Models\Student;
use App\Models\VendorLedger;
use App\Models\VendorStock;
use Carbon\Carbon;
use Firebase\JWT\JWT;
use JetBrains\PhpStorm\Pure;
use Stevebauman\Location\Facades\Location;

if (!function_exists('getSaleInv')) {
    function getSaleInv($id)
        {
        $invoice                    =   SaleInvoice::where('id', $id)
                                                    ->selectRaw('sale_invoices.*,
                                                                (SELECT customer_name FROM customers WHERE id = sale_invoices.customer_id) as customer_name')
                                                    ->first();
        $invoice->status            =   'sale';
        $parts                      =    explode('-', $invoice->invoice_no);
        $invoice->first_part        =    $parts[0];
        $invoice->invoice_products  =    ProductSale::where('sale_invoice_id', $id)
                                                    ->selectRaw('products_sales.*, (SELECT product_name FROM products WHERE id = products_sales.product_id) as product_name')
                                                    ->get();
         
            return $invoice;
    }
}

if (!function_exists('getSaleReturnInv')) {
    function getSaleReturnInv($id)
        {
        $invoice                    =   SaleReturn::where('id', $id)
                                            ->selectRaw('sale_return_invoices.*,
                                                        (SELECT customer_name FROM customers WHERE id = sale_return_invoices.customer_id) as customer_name')
                                            ->first();
        $invoice->status            =   'sale-return';
        $parts                      =    explode('-', $invoice->invoice_no);
        $invoice->first_part        =    $parts[0];
        $invoice->invoice_products  =    SaleReturnProduct::where('sale_return_invoice_id', $id)
                                              ->selectRaw('sale_return_products.*, (SELECT product_name FROM products WHERE id = sale_return_products.product_id) as product_name')
                                              ->get();  
                return $invoice;
    }
}
