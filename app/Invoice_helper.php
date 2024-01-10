<?php

 
use App\Models\ProductPurchase;
use App\Models\ProductReplacement;
use App\Models\ProductReplacementInvoice;
use App\Models\ProductReturns;
use App\Models\ProductSale;
use App\Models\PurchaseInvoice;
use App\Models\ReturnInvoice;
use App\Models\Sale as SaleInvoice;
use App\Models\SaleReturn;
use App\Models\SaleReturnProduct;

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
if (!function_exists('getProductReplacementInv')) {
   function getProductReplacementInv($id)
   {
      $invoice                    =     ProductReplacementInvoice::where('id', $id)
         ->selectRaw('product_replacment_invoices.*,
                                                        (SELECT customer_name FROM customers WHERE id = product_replacment_invoices.customer_id) as customer_name')
         ->first();
      $invoice->status            =   'product-replacement';
      $parts                      =    explode('-', $invoice->invoice_no);
      $invoice->first_part        =    $parts[0];
      $invoice->invoice_products          =    ProductReplacement::where('product_replacement_invoice_id', $id)
         ->selectRaw('product_replacements.*, 
                                                            (SELECT product_name FROM products WHERE id = product_replacements.product_id) as product_name')

         ->get();
      return $invoice;
   }
}

if (!function_exists('getPurchaseInv')) {
   function getPurchaseInv($id)
   {


      $invoice                    =   PurchaseInvoice::where('id', $id)
         ->selectRaw('purchase_invoices.*,
                                                            (SELECT customer_name FROM customers WHERE id = purchase_invoices.customer_id) as customer_name')
         ->first();
      $invoice->status            =   'purchase';
      $parts                      =    explode('-', $invoice->invoice_no);
      $invoice->first_part        =    $parts[0];
      $invoice->invoice_products  =    ProductPurchase::where('purchase_invoice_id', $id)
         ->selectRaw('products_purchases.*, 
                                                        (SELECT product_name FROM products WHERE id = products_purchases.product_id) as product_name')
         ->get();
      return $invoice;
   }
}
if (!function_exists('getPurchaseReturnInv')) {
   function getPurchaseReturnInv($id)
   {
      $invoice                    =     ReturnInvoice::where('id', $id)->selectRaw('purchase_return_invoices.*,
                                                        (SELECT customer_name FROM customers WHERE id = purchase_return_invoices.customer_id) as customer_name')
         ->first();
      $invoice->status            =   'purchase-return';
      $parts                      =    explode('-', $invoice->invoice_no);
      $invoice->first_part        =    $parts[0];
      $invoice->invoice_products  =     ProductReturns::where('purchase_return_invoice_id', $id)
         ->selectRaw('products_returns.*, 
                                                    (SELECT product_name FROM products WHERE id = products_returns.product_id) as product_name')
         ->get();
      return $invoice;
   }
}
if (!function_exists('PurchaseReportRecords')) {
   function PurchaseReportRecords($request, $current_date)
   {
      $query            =  "";
      $where            =  " DATE(pp.created_at) = '$current_date'";
      if (isset($request->company_id)) {
         $query         = "$where AND pp.company_id = $request->company_id";
      } else if (isset($request->product_id)) {
         $query         = "$where AND pp.product_id = $request->product_id";
      } else if (isset($request->customer_id)) {
         $query         = "$where AND si.customer_id = $request->customer_id";
      } else if (isset($request->start_date) != '' && isset($request->end_date) != '') {
         $query         = "DATE(pp.created_at) BETWEEN '$request->start_date' AND '$request->end_date'";
      } else if (isset($request->bill_no)) {
         $query         =  "$where AND SUBSTRING_INDEX(si.invoice_no, '-', 1) = '$request->bill_no'";
      } else {
         $query         =  $where;
      }
      $records          =  DB::select("
                                SELECT 
                                   DATE_FORMAT(pp.created_at,'%d-%m-%Y %h:%i %p') as created,
                                   pr.product_name,
                                   co.company_name,
                                   pi.invoice_no,
                                   pi.customer_id,
                                   IFNULL((SELECT customer_name FROM customers WHERE id = pi.customer_id),'NA') as customer_name,
                                   IFNULL(pi.invoice_discount,0) AS invoice_discount,
                                   pi.invoice_type AS invoice_type,
                                   IFNULL(pp.purchased_total_amount+IFNULL(product_discount,0),0) AS purchased_total_amount,
                                   IFNULL(pi.total_invoice_amount,0) AS total_invoice_amount,
                                   IFNULL(pi.service_charges,0) AS service_charges,
                                   IFNULL(pp.qty,0) AS qty,
                                   IFNULL(pp.product_discount,0) AS product_discount,
                                   pp.product_id,
                                   pp.company_id
                                FROM 
                                products_purchases as pp
                                LEFT JOIN purchase_invoices pi ON pi.id = pp.purchase_invoice_id 
                                LEFT JOIN products pr ON pr.id = pp.product_id 
                                LEFT JOIN companies co ON co.id = pp.company_id 
                                WHERE 
                                $query
                                ORDER BY pi.invoice_no DESC
                          ");
      return $records;
   }
}
if (!function_exists('ProfitReportRecords')) {
   function ProfitReportRecords($request, $current_date)
   {
      $query = " 1=1";
      if (isset($request->company_id)) {
         $query .= " AND ps.company_id = $request->company_id";
      }
      if (isset($request->product_id)) {
         $query .= " AND ps.product_id = $request->product_id";
      }
      if (isset($request->customer_id)) {
         $query .= " AND si.customer_id = $request->customer_id";
      }
      if (isset($request->start_date) != '' && isset($request->end_date) != '') {
         $query .= " AND DATE(ps.created_at) BETWEEN '$request->start_date' AND '$request->end_date'";
      } else {
         $query .=  " AND  DATE(ps.created_at) = '$current_date'";
      }
      if (isset($request->bill_no)) {
         $query       .=  " AND SUBSTRING_INDEX(si.invoice_no, '-', 1) = '$request->bill_no'";
      }
      // IFNULL(si.invoice_discount/sum(ps.qty),0) AS divide_invoice_discount,
      $sales          =  DB::select("
                              SELECT
                                 DATE_FORMAT(ps.created_at,'%d-%m-%Y %h:%i %p') as created,
                                 pr.product_name,
                                 co.company_name,
                                 si.invoice_no,
                                 si.customer_id,
                                 IFNULL((SELECT customer_name FROM customers WHERE id = si.customer_id),'NA') as customer_name,
                              
                                 IFNULL(si.invoice_discount,0) AS invoice_discount,
                                 si.invoice_type AS invoice_type,
                                 IFNULL(ps.sale_total_amount+IFNULL(product_discount,0),0) AS sale_total_amount,
                                 IFNULL(si.total_invoice_amount,0) AS total_invoice_amount,
                                 IFNULL(si.service_charges,0) AS service_charges,
                                 IFNULL(ps.qty,0) AS qty,
                                 IFNULL(ps.sale_price - IFNULL(ps.product_discount,0),0) AS sale_price,
                                 ps.product_id,
                                 ps.company_id,
                                 pr.old_purchase_price,
                                 pr.new_purchase_price
                              FROM
                              products_sales as ps
                              LEFT JOIN sale_invoices si ON si.id = ps.sale_invoice_id
                              LEFT JOIN products pr ON pr.id = ps.product_id
                              LEFT JOIN companies co ON co.id = ps.company_id
                              WHERE
                              $query
                              ORDER BY si.invoice_no DESC
                        ");

      return $sales;
   }
} 
if (!function_exists('PurchaseReportList')) {
   function PurchaseReportList($request, $current_date)
   {
      $query = " 1=1";
      if (isset($request->company_id)) {
         $query .= " AND ps.company_id = $request->company_id";
      }
      if (isset($request->product_id)) {
         $query .= " AND ps.product_id = $request->product_id";
      }
      if (isset($request->customer_id)) {
         $query .= " AND si.customer_id = $request->customer_id";
      }
      if (isset($request->start_date) != '' && isset($request->end_date) != '') {
         $query .= " AND DATE(ps.created_at) BETWEEN '$request->start_date' AND '$request->end_date'";
      } else {
         $query .=  " AND  DATE(ps.created_at) = '$current_date'";
      }
      if (isset($request->bill_no)) {
         $query       .=  " AND SUBSTRING_INDEX(si.invoice_no, '-', 1) = '$request->bill_no'";
      }
      $sales          =  DB::select("
                              SELECT
                                 DATE_FORMAT(ps.created_at,'%d-%m-%Y %h:%i %p') as created,
                                 pr.product_name,
                                 co.company_name,
                                 si.invoice_no,
                                 si.customer_id,
                                 IFNULL((SELECT customer_name FROM customers WHERE id = si.customer_id),'NA') as customer_name,
                                 IFNULL(si.invoice_discount,0) AS invoice_discount,
                                 si.invoice_type AS invoice_type,
                                 IFNULL(ps.purchased_total_amount+IFNULL(product_discount,0),0) AS sale_total_amount,
                                 IFNULL(si.total_invoice_amount,0) AS total_invoice_amount,
                                 IFNULL(si.service_charges,0) AS service_charges,
                                 IFNULL(ps.qty,0) AS qty,
                                 IFNULL(ps.product_discount,0) AS product_discount,
                                 ps.product_id,
                                 ps.company_id,
                                 ps.purchase_price,
                                 pr.sale_price
                              FROM
                              products_purchases as ps
                              LEFT JOIN purchase_invoices si ON si.id = ps.purchase_invoice_id
                              LEFT JOIN products pr ON pr.id = ps.product_id
                              LEFT JOIN companies co ON co.id = ps.company_id
                              WHERE
                              $query
                              ORDER BY si.invoice_no ASC
                        ");
      $returns        =  DB::select("
                              SELECT
                                 DATE_FORMAT(ps.created_at,'%d-%m-%Y %h:%i %p') as created,
                                 pr.product_name,
                                 co.company_name,
                                 si.invoice_no,
                                 si.customer_id,
                                 IFNULL((SELECT customer_name FROM customers WHERE id = si.customer_id),'NA') as customer_name,
                                 IFNULL(si.invoice_discount,0) AS invoice_discount,
                                 si.invoice_type AS invoice_type, 
                                 IFNULL(si.total_invoice_amount,0) AS total_invoice_amount,
                                 IFNULL(si.service_charges,0) AS service_charges,
                                 IFNULL(ps.qty,0) AS qty,
                                 IFNULL(ps.product_discount,0) AS product_discount,
                                 ps.product_id,
                                 ps.company_id,
                                 pr.old_purchase_price,
                                 ps.purchase_price,
                                 pr.sale_price
                              FROM
                              products_returns as ps
                              LEFT JOIN purchase_return_invoices si ON si.id = ps.purchase_return_invoice_id
                              LEFT JOIN products pr ON pr.id = ps.product_id
                              LEFT JOIN companies co ON co.id = ps.company_id
                              WHERE
                              $query
                              ORDER BY si.invoice_no ASC
                  ");
                  return ['sales' => $sales, 'sale_returns' => $returns];
   }
}
