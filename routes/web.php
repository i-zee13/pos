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
// Purchase Returns / 
Route::get('/get-customer-balance-products/{id}'  ,[App\Http\Controllers\PurchaseReturnController::class, 'getVendorBalance'])->name('get-customer-balance');
Route::get('/purchase-return'                     ,[App\Http\Controllers\PurchaseReturnController::class, 'purchaseReturn'])->name('purchase-return');
Route::post('/add-purchase-return'                ,[App\Http\Controllers\PurchaseReturnController::class, 'addpurchaseReturn'])->name('add-purchase-return');

/** sale Routes */
Route::get('/sale-add'                  ,[App\Http\Controllers\SaleController::class, 'create'])->name('sale-add');
Route::get('/get-customer'              ,[App\Http\Controllers\SaleController::class, 'getVendors'])->name('get-vendors');
Route::post('/add-sale-invoice'         ,[App\Http\Controllers\SaleController::class, 'saleInvoice'])->name('add-sale-invoice');
Route::get('/sales'                     ,[App\Http\Controllers\SaleController::class, 'saleList'])->name('sales');
Route::get('/sale-edit/{id}'            ,[App\Http\Controllers\SaleController::class, 'editsale'])->name('sale-edit');
Route::get('/sale-detail/{id}'            ,[App\Http\Controllers\SaleController::class, 'show'])->name('sale-detail');
Route::get('/get-sale-products/{id}'    ,[App\Http\Controllers\SaleController::class, 'getSaleProduct'])->name('get-sale-products');
Route::get('/get-customer-balance/{id}' ,[App\Http\Controllers\SaleController::class, 'getCustomerBalance'])->name('get-customer-balance');
// Sales Returns / 
// Route::get('/get-customer-balance-products/{id}'  ,[App\Http\Controllers\PurchaseReturnController::class, 'getVendorBalance'])->name('get-customer-balance');
Route::get('/sale-return'                     ,[App\Http\Controllers\PurchaseReturnController::class, 'purchaseReturn'])->name('purchase-return');
// Route::post('/add-purchase-return'                ,[App\Http\Controllers\PurchaseReturnController::class, 'addpurchaseReturn'])->name('add-purchase-return');

//Genrate invoice
Route::get('/print-sale-invoice/{invoice_id}/{customer_id}/{received_amount}'       ,[App\Http\Controllers\SaleController::class, 'printInvoice'])->name('print-sale-invoice');
//Transactions
Route::get('/customer-ledgers'          ,[App\Http\Controllers\TransactionController::class, 'customerLedger'])->name('customer-ledgers');
Route::post('/get-ledgers-list'          ,[App\Http\Controllers\TransactionController::class, 'getCustomerLedgers'])->name('get-customer-ledger-list');
Route::post('/transaction-store'        ,[App\Http\Controllers\TransactionController::class, 'store'])->name('transaction-store');
Route::get('/vendor-ledgers'            ,[App\Http\Controllers\TransactionController::class, 'customerLedger'])->name('vendor-ledgers');

//Reports 
Route::get('/customer-reports'          ,[App\Http\Controllers\ReportsController::class, 'customerReport'])->name('customer-reports');
Route::get('/vendor-reports'            ,[App\Http\Controllers\ReportsController::class, 'vendorReport'])->name('vendor-reports');
Route::post('/report-list'              ,[App\Http\Controllers\ReportsController::class, 'reportList'])->name('report-list');

Route::get('/stock-reports'             ,[App\Http\Controllers\ReportsController::class, 'stockReport'])->name('stock-reports');
Route::post('/stocks'                   ,[App\Http\Controllers\ReportsController::class, 'stockReportList'])->name('stock-report-list');

//Sale Report
Route::get('/sale-report'               ,[App\Http\Controllers\ReportsController::class, 'saleReport'])->name('sale-reports');
Route::post('/sales-list'               ,[App\Http\Controllers\ReportsController::class, 'saleReportList'])->name('stock-report-list');


});
