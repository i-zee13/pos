<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\Product;
use App\Models\VendorLedger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
require app_path('Invoice_helper.php');

class LedgerDetailControlller extends Controller
{
   public function customerReport()
   {
      $ledger_for = 'Customer';
      $vendors   =   Customer::where('customer_type', 2)->get();
      return view('reports.vendor', compact('vendors', 'ledger_for'));
   }
   public function vendorReport()
   {
      $ledger_for = 'Vendor';
      $vendors   =   Customer::where('customer_type', 1)->get();
      return view('reports.vendor', compact('vendors', 'ledger_for'));
   }
   public function productReports()
   {
      $ledger_for = 'Product';
      $companies  =   Company::select('id', 'company_name')->get();
      $products   =   Product::select('id', 'product_name','stock_balance')->get();
      return view('reports.product', compact('products', 'companies', 'ledger_for'));
   }
   public function productList(Request $request)
   {
      $current_date     =  date('Y-m-d');
      $records          =  ProductReportList($request, $current_date);

      return response()->json([
         'msg'     => 'Product report list fetched',
         'status'  => 'success',
         'reports'  => $records
      ]);
   }
   public function reportList(Request $request)
   {
      $dateFilter    =  " 1=1";
      if ($request->start_date != '' && $request->end_date != '') {
         $dateFilter = " Date(created_at) BETWEEN '$request->start_date' AND '$request->end_date'";
      }
      if (str_contains($request->current_url, 'vendor-reports')) {
         $query      =  VendorLedger::selectRaw('vendor_ledger.*,  DATE_FORMAT(created_at, "%h:%i %p") as formatted_created_at,
                                      IFNULL( CONCAT("PI ", (SELECT invoice_no FROM purchase_invoices WHERE purchase_invoices.id = vendor_ledger.purchase_invoice_id)) ,
                                             CONCAT("PR ", (SELECT invoice_no FROM purchase_return_invoices WHERE purchase_return_invoices.id = vendor_ledger.purchase_return_invoice_id))) AS invoice_no
                                       ')
            ->whereRaw("$dateFilter AND customer_id = $request->vendor_id")

            ->get();
      } else {
         $query      = CustomerLedger::selectRaw('*, 
                                    DATE_FORMAT(created_at, "%h:%i %p") as formatted_created_at, 
                                    (SELECT sale_invoices.description 
                                        FROM sale_invoices 
                                        WHERE sale_invoices.id = customer_ledger.sale_invoice_id 
                                        LIMIT 1) as invoice_comment,
                                    COALESCE(
                                        CONCAT("SI ", (SELECT invoice_no FROM sale_invoices WHERE sale_invoices.id = customer_ledger.sale_invoice_id LIMIT 1)),
                                        CONCAT("SR ", (SELECT invoice_no FROM sale_return_invoices WHERE sale_return_invoices.id = customer_ledger.sale_return_invoice_id LIMIT 1)),
                                        CONCAT("PR ", (SELECT invoice_no FROM product_replacment_invoices WHERE product_replacment_invoices.id = customer_ledger.product_replacement_invoice_id LIMIT 1))
                                    ) AS invoice_no'
                                )->whereRaw("$dateFilter AND customer_id = ?", [$request->vendor_id])->get();                                      

            if ($query->isEmpty()) {
                // Fetch the last 10 entries if the initial query is empty
              $lastDebitId = CustomerLedger::where('customer_id', $request->vendor_id)
                           ->where('dr', '>', 0)
                           ->orderBy('created_at', 'desc')
                           ->value('id');
                       
                       $query = CustomerLedger::selectRaw('*, 
                                                           DATE_FORMAT(created_at, "%h:%i %p") as formatted_created_at, 
                                                           (SELECT sale_invoices.description 
                                                               FROM sale_invoices 
                                                               WHERE sale_invoices.id = customer_ledger.sale_invoice_id 
                                                               LIMIT 1) as invoice_comment,
                                                           COALESCE(
                                                               CONCAT("SI ", (SELECT invoice_no FROM sale_invoices WHERE sale_invoices.id = customer_ledger.sale_invoice_id LIMIT 1)),
                                                               CONCAT("SR ", (SELECT invoice_no FROM sale_return_invoices WHERE sale_return_invoices.id = customer_ledger.sale_return_invoice_id LIMIT 1)),
                                                               CONCAT("PR ", (SELECT invoice_no FROM product_replacment_invoices WHERE product_replacment_invoices.id = customer_ledger.product_replacement_invoice_id LIMIT 1))
                                                           ) AS invoice_no'
                                                       )
                           ->where('customer_id', $request->vendor_id)
                           ->where('id', '>=', $lastDebitId)
                           ->limit(5)
                           ->get();
            }
                                       // dd($query);
         // $query      =  CustomerLedger::whereRaw("$dateFilter AND customer_id = $request->vendor_id")->orderBy('id', 'DESC')->get();
      }
      return response()->json([
         'msg'       => 'Vendor reports list fetched',
         'status'    => 'success',
         'vendor'    => $query
      ]);
   }
   public function ledger()
   {
      return view('reports.ledger');
   }
   public function ledgerDetail($id)
   {
      $url     = request()->url();
      $parts   = explode('/', $url);
      $lastParameter = end($parts);

      $label = str_replace([' ', '%20'], '_', strtolower($lastParameter));
      if ($label === 'sale_inv') {
         $invoice     = getSaleInv($id);
      } elseif ($label == 'sale_return_inv') {
         $invoice     = getSaleReturnInv($id);
      } else if ($label == 'purchase_inv') {
         $invoice     = getPurchaseInv($id);
      } elseif ($label == 'return_inv') {
         $invoice     = getPurchaseReturnInv($id);
      } elseif ($label == 'product_replacement_inv') {
         $invoice     = getProductReplacementInv($id);
         return view('reports.replacement-detail', compact('invoice'));
      }
      return view('reports.detail', compact('invoice'));
   }
    public function getLedgersOld(Request $req)
   {

      $customerLgr = DB::table("customer_ledger")
                 ->selectRaw("
                  customer_id,comment,
                  (SELECT customer_name FROM customers WHERE id = customer_id) as name,
                  SUM(IFNULL(cr, 0)) as cr, 
                  SUM(IFNULL(dr, 0)) as dr
              ")
         ->when(current_tenant_id(), function ($q, $t) { return $q->where('tenant_id', $t); })
         ->whereRaw("DATE(created_at) = ? AND is_deleted = 0 AND customer_id NOT IN (5,8,49,97,105,107,113,126,145,157,170,48,242,356)", [$req->date])
         ->groupBy("customer_id")
         ->get();

      $vendorLgr = DB::table("vendor_ledger")
         ->selectRaw("
          customer_id,comment,
          (SELECT customer_name FROM customers WHERE id = customer_id) as name,
          SUM(IFNULL(cr, 0)) as cr, 
          SUM(IFNULL(dr, 0)) as dr
      ")
         ->when(current_tenant_id(), function ($q, $t) { return $q->where('tenant_id', $t); })
         ->whereNull('purchase_return_invoice_id')
         ->whereRaw("DATE(created_at) = ? AND is_deleted = 0 AND customer_id != 167", [$req->date])
         ->groupBy("customer_id")
         ->get();


      $mutafriq_udhar_receive = []; // Initialize as an empty array
      $mutafriq_udhar_jama = [];    // Initialize as an empty array

      foreach ($customerLgr as $ledger) {
         if ($ledger->cr > 0) {
            $mutafriq_udhar_receive[] = [
               'id' => $ledger->customer_id,
               'name' => $ledger->name,
               'comment' => $ledger->comment,
               'amount' => $ledger->cr,
               'type' => 'customer',
            ];
         }
         if ($ledger->dr > 0) {
            $mutafriq_udhar_jama[] = [
               'id' => $ledger->customer_id,
               'name' => $ledger->name,
                 'comment' => $ledger->comment,
               'amount' => $ledger->dr,
               'type' => 'customer',
            ];
         }
      }

    //   foreach ($vendorLgr as $ledger) {
    //      if ($ledger->cr > 0) {
    //         $mutafriq_udhar_receive[] = [
    //           'id' => $ledger->customer_id,
    //           'name' => $ledger->name,
    //           'amount' => $ledger->cr,
    //           'type' => 'vendor',
    //         ];
    //      }
    //      if ($ledger->dr > 0) {
    //         $mutafriq_udhar_jama[] = [
    //           'id' => $ledger->customer_id,
    //           'name' => $ledger->name,
    //           'amount' => $ledger->dr,
    //           'type' => 'vendor',
    //         ];
    //      }
    //   }



      return response()->json([
         'mutafriq_udhar_jama' => $mutafriq_udhar_jama,
         'mutafriq_udhar_receive' => $mutafriq_udhar_receive,
      ]);
   }
    public function getLedgers(Request $req)
   {

      $customerLgr = DB::table("customer_ledger as cl")
         ->join("customers as c", "c.id", "=", "cl.customer_id")
         ->when(current_tenant_id(), function ($q, $t) { return $q->where('cl.tenant_id', $t); })
         ->selectRaw("
                              cl.customer_id,
                            
(SELECT IFNULL(description, 'NA') FROM sale_invoices WHERE sale_invoices.id = cl.sale_invoice_id) as si_comment,
                              (SELECT invoice_no FROM sale_invoices WHERE sale_invoices.id = cl.sale_invoice_id) AS invoice_no,
                              cl.sale_invoice_id,
                              cl.cpv_no,
                              cl.crv_no,
                              cl.sale_return_invoice_id,
                              c.customer_name,
                              cl.id,
                              cl.comment,
                              IFNULL(cl.cr, 0) as cr,
                              IFNULL(cl.dr, 0) as dr
                           ")
         ->whereRaw("DATE(cl.created_at) = ? AND cl.is_deleted = 0", [$req->date])
         ->whereNotIn("cl.customer_id", [5, 8, 49, 97, 105, 107, 115,113, 126, 145, 157, 170, 48, 242, 356])
         ->orderBy("cl.customer_id")
         ->get();

      // Transform data into the desired structure
      $formattedData = [];
     $cr = [];
$dr = [];

foreach ($customerLgr as $entry) {
    $customerId = $entry->customer_id;

    // Process Credit (CR)
    if ($entry->cr > 0) {
        if (!isset($cr[$customerId])) {
            $cr[$customerId] = [
                'customer_name' => $entry->customer_name,
                'total_amount' => 0, // Total credits
                'status' => 'in',
                'detail' => []
            ];
        }
        $cr[$customerId]['total_amount'] += $entry->cr; // Add only credit amount

        // Store details
        $cr[$customerId]['detail'][] = [
            'id' => $entry->id,
            'sale_invoice_id' => $entry->sale_invoice_id,
            'cpv_no' => $entry->cpv_no,
            'crv_no' => $entry->crv_no,
            'invoice_no' => $entry->invoice_no ? 'si-' . explode('-', $entry->invoice_no)[0] : null,

             'comment' => $entry->sale_invoice_id > 0 ?  $entry->si_comment :  $entry->comment,
            'amount' => $entry->cr // Store credit amount
        ];
    }

    // Process Debit (DR)
    if ($entry->dr > 0) {
        if (!isset($dr[$customerId])) {
            $dr[$customerId] = [
                'customer_name' => $entry->customer_name,
                'total_amount' => 0, // Total debits
                'status' => 'out',
                'detail' => []
            ];
        }
        $dr[$customerId]['total_amount'] += $entry->dr; // Add only debit amount

        // Store details
        $dr[$customerId]['detail'][] = [
            'id' => $entry->id,
            'sale_invoice_id' => $entry->sale_invoice_id,
            'invoice_no' => $entry->invoice_no ? 'si-' . explode('-', $entry->invoice_no)[0] : null,

            'cpv_no' => $entry->cpv_no,
            'crv_no' => $entry->crv_no,
            'comment' => $entry->sale_invoice_id > 0 ?  $entry->si_comment :  $entry->comment,
            'amount' => $entry->dr // Store debit amount
        ];
    }
}


      return response()->json([
         'mutafriq_udhar_banam' => $dr,
         'mutafriq_udhar_receive' => $cr,
      ]);
   }
   public function allCustomerLedger()
   {
     $whereNotIN = [105,107,115,170,5,47,48,49,114,126,157,242,271,356];

      $credit_customers = Customer::where('customer_type', 2)->where('balance', '>', 0)->get(); 
      $debit_customers  = Customer::where('customer_type', 2)->where('balance', '<', 0)->get(); 
      
      $total_credit     = Customer::where('customer_type', 2)->where('balance', '>', 0)->whereNotIn('id',$whereNotIN)->sum('balance');
      $total_debit      = Customer::where('customer_type', 2)->where('balance', '<', 0)->whereNotIn('id',$whereNotIN)->sum('balance'); 
      return view('reports.all-customer-ledger', compact('credit_customers', 'debit_customers', 'total_debit', 'total_credit'));
   }
}
