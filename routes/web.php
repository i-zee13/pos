<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });
Route::get('/clear', function () {
    Artisan::call('config:cache');
    Artisan::call('cache:clear');
    Artisan::call('route:clear');
    Artisan::call('optimize:clear');
    return "All cache clear successfully";
});
// Route::get('/route-clear', function () {
//     return "Route cache cleared successfully";
// });
// Route::get('/view-clear', function () {
//     Artisan::call('route:clear');
//     return "View cache cleared successfully";
// });
// Route::get('/config-cache', function () {
//     return "Config cache successfully";
// });
// Route::get('/all-cache-clear', function () {
//     return "All cache clear successfully";
// });

Route::get('/', function () {
    return redirect('/home');
});
Auth::routes();
Route::group(['middleware' => ['auth']], function () {
Route::Resource('/company'        ,App\Http\Controllers\CompanyController::class);
Route::Resource('/customer'       ,App\Http\Controllers\CustomerController::class);
Route::Resource('/vendors'        ,App\Http\Controllers\CustomerController::class);

Route::get('/'                    ,[App\Http\Controllers\HomeController::class,   'index'])->name('home');
Route::get('/home'                ,[App\Http\Controllers\HomeController::class,   'index'])->name('home');
Route::get('/get-companies'       ,[App\Http\Controllers\CompanyController::class, 'getCompanies'])->name('get-companies');
Route::post('/get-customers'      ,[App\Http\Controllers\CustomerController::class, 'getCustomers'])->name('get-customers');
/** Product Routes */
Route::get('/products'            ,[App\Http\Controllers\ProductController::class, 'index'])->name('products');
Route::post('/product-store'      ,[App\Http\Controllers\ProductController::class, 'store'])->name('product-store');
Route::get('/get-products'        ,[App\Http\Controllers\ProductController::class, 'getProducts'])->name('get-products');
Route::get('/get-sub-cat/{catId}' ,[App\Http\Controllers\ProductController::class, 'getSubCatToUpdate'])->name('get-sub-cat');
Route::post('/product-delete/{id}',[App\Http\Controllers\ProductController::class, 'deleteProduct'])->name('product-delete');
// Start Shahid
Route::get('/change-price'         ,[App\Http\Controllers\ProductController::class, 'changePrice'])->name('change-price');




//End Shahid
/** Stock Routes */
Route::get('/stock-add'                 ,[App\Http\Controllers\StockController::class, 'create'])->name('stock-add');
Route::get('/get-vendors'               ,[App\Http\Controllers\StockController::class, 'getVendors'])->name('get-vendors');
// Route::post('/get-product'           ,[App\Http\Controllers\StockController::class, 'getProduct'])->name('get-product');
Route::get('/get-vendor-balance/{id}'   ,[App\Http\Controllers\StockController::class, 'getVendorBalance'])->name('get-vendor-balance');
/** Purchase Routes */
Route::post('/add-purchase-invoice'          ,[App\Http\Controllers\StockController::class, 'purchaseInvoice'])->name('add-purchase-invoice');
Route::get('/purchases'                      ,[App\Http\Controllers\StockController::class, 'purchaseList'])->name('purchases');
Route::get('/purchase-edit/{id}'             ,[App\Http\Controllers\StockController::class, 'editPurchase'])->name('purchase-edit');
Route::get('/get-purchase-products/{id}'     ,[App\Http\Controllers\StockController::class, 'getPurchaseProduct'])->name('get-purchase-products');
Route::delete('/delete-product-from-invoice' ,[App\Http\Controllers\StockController::class, 'deleteProduct'])->name('delete-product');
Route::get('/print-purchase-invoice/{invoice_id}/{customer_id}/{received_amount}'       ,[App\Http\Controllers\StockController::class, 'printInvoice'])->name('print-purchase-invoice');

// Purchase Returns /
Route::get('/get-customer-balance-products/{id}'  ,[App\Http\Controllers\PurchaseReturnController::class, 'getVendorBalance'])->name('get-customer-balance');
Route::get('/add-return'                     ,[App\Http\Controllers\PurchaseReturnController::class, 'create'])->name('purchase-return.create');
Route::get('/purchase-returns'                     ,[App\Http\Controllers\PurchaseReturnController::class, 'list'])->name('purchase-return.index');
Route::post('/add-purchase-return'                ,[App\Http\Controllers\PurchaseReturnController::class, 'store'])->name('purchase-return.store');

/** sale Routes */
Route::get('/sale-add'                    ,[App\Http\Controllers\SaleController::class, 'create'])->name('sale-add');
Route::get('/get-customer'                ,[App\Http\Controllers\SaleController::class, 'getVendors'])->name('get-vendors');
Route::post('/add-sale-invoice'           ,[App\Http\Controllers\SaleController::class, 'saleInvoice'])->name('add-sale-invoice');
Route::get('/sales'                       ,[App\Http\Controllers\SaleController::class, 'saleList'])->name('sales');
Route::get('/sale-edit/{id}'              ,[App\Http\Controllers\SaleController::class, 'editsale'])->name('sale-edit');
Route::get('/sale-detail/{id}'            ,[App\Http\Controllers\SaleController::class, 'show'])->name('sale-detail');
Route::get('/get-sale-products/{id}'      ,[App\Http\Controllers\SaleController::class, 'getSaleProduct'])->name('get-sale-products');
Route::get('/get-customer-balance/{id}'   ,[App\Http\Controllers\SaleController::class, 'getCustomerBalance'])->name('get-customer-balance');
Route::delete('/delete-product-from-sale' ,[App\Http\Controllers\SaleController::class, 'deleteProduct'])->name('delete-product');

// Sales Returns /
// Route::get('/get-customer-balance-products/{id}'  ,[App\Http\Controllers\PurchaseReturnController::class, 'getVendorBalance'])->name('get-customer-balance');
Route::get('/sale-return'                  ,[App\Http\Controllers\SalesReturnController::class, 'create'])->name('salereturn.create');
Route::post('/add-sale-return-invoice'     ,[App\Http\Controllers\SalesReturnController::class, 'store'])->name('salereturn.store');
Route::get('/sale-returns'                 ,[App\Http\Controllers\SalesReturnController::class, 'index'])->name('salereturn.index');
Route::get('/edit-sale-return/{id}'        ,[App\Http\Controllers\SalesReturnController::class, 'edit'])->name('salereturn-edit');
Route::get('/get-sale-return-products/{id}',[App\Http\Controllers\SalesReturnController::class, 'getReturnProduct'])->name('get-salereturn-products');
Route::get('/print-salereturn-invoice/{invoice_id}/{customer_id}/{received_amount}'  ,[App\Http\Controllers\SalesReturnController::class, 'printInvoice'])->name('print-salereturn-invoice');

// Route::post('/add-purchase-return'                ,[App\Http\Controllers\PurchaseReturnController::class, 'addpurchaseReturn'])->name('add-purchase-return');

//Genrate invoice
Route::get('/print-sale-invoice/{invoice_id}/{customer_id}/{received_amount}'       ,[App\Http\Controllers\SaleController::class, 'printInvoice'])->name('print-sale-invoice');
//Transactions
    Route::get('/customer-ledger-jama'      ,[App\Http\Controllers\TransactionController::class, 'customerLedger'])->name('customer-ledger-jama');
    Route::get('/customer-ledger-banam'     ,[App\Http\Controllers\TransactionController::class, 'customerLedger'])->name('customer-ledger-banam');
Route::post('/get-ledgers-list'         ,[App\Http\Controllers\TransactionController::class, 'getCustomerLedgers'])->name('get-customer-ledger-list');
//Vendor Transcations
    Route::get('/vendor-ledger-jama'      ,[App\Http\Controllers\TransactionController::class, 'vendorLedger'])->name('vendor-ledger-jama');
    Route::get('/vendor-ledger-banam'     ,[App\Http\Controllers\TransactionController::class, 'vendorLedger'])->name('vendor-ledger-banam');

Route::post('/transaction-store'        ,[App\Http\Controllers\TransactionController::class, 'store'])->name('transaction-store');
Route::post('/get-customer-transactions' ,[App\Http\Controllers\TransactionController::class, 'getCustomerTransactions'])->name('getCustomerTransactions');
Route::get('/vendor-ledgers'            ,[App\Http\Controllers\TransactionController::class, 'customerLedger'])->name('vendor-ledgers');
Route::get('/customer-ledgers'          ,[App\Http\Controllers\TransactionController::class, 'customerLedger'])->name('customer-ledgers');
Route::get('/print-transaction-invoice/{invoice_id}/{customer_id}/{operation}/{type}' ,[App\Http\Controllers\TransactionController::class, 'printInvoice'])->name('print-salereturn-invoice');

//Reports
Route::get('/customer-reports'          ,[App\Http\Controllers\ReportsController::class, 'customerReport'])->name('customer-reports');
Route::get('/vendor-reports'            ,[App\Http\Controllers\ReportsController::class, 'vendorReport'])->name('vendor-reports');
Route::post('/report-list'              ,[App\Http\Controllers\ReportsController::class, 'reportList'])->name('report-list');

Route::get('/stock-reports'             ,[App\Http\Controllers\ReportsController::class, 'stockReport'])->name('stock-reports');
Route::post('/stocks'                   ,[App\Http\Controllers\ReportsController::class, 'stockReportList'])->name('stock-report-list');

//Sale Report
Route::get('/sale-report'               ,[App\Http\Controllers\ReportsController::class, 'saleReport'])->name('sale-reports');
Route::post('/sales-list'               ,[App\Http\Controllers\ReportsController::class, 'saleReportList'])->name('stock-report-list');

// All Sales List Fakahr
Route::get('/all-sales-list',[App\Http\Controllers\SaleController::class, 'allSalesList'])->name('all-sales-list');
Route::post('/fetch-all-list-sale',[App\Http\Controllers\SaleController::class, 'fetchAllSalesList'])->name('fetch-all-list-sale');

// Stock Report Value
Route::get('/stock-value-report',[App\Http\Controllers\ReportsController::class, 'allStockValueReport'])->name('stock-value-report');
Route::post('/fetch-stock-value-report',[App\Http\Controllers\ReportsController::class, 'fetchStockValueReport'])->name('fetch-stock-value-report');

// Sales Replacement /
// Route::get('/get-customer-balance-products/{id}'  ,[App\Http\Controllers\PurchaseReturnController::class, 'getVendorBalance'])->name('get-customer-balance');
Route::get('/sale-replacement-create'   ,[App\Http\Controllers\SaleReplacementController::class, 'create'])->name('salereplacement.create');
Route::get('/sale-replacements'         ,[App\Http\Controllers\SaleReplacementController::class, 'index'])->name('salereplacement.index');



});
