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

Auth::routes();
Route::group(['middleware' => ['auth']], function () { 
Route::Resource('/company'   ,App\Http\Controllers\CompanyController::class);
Route::Resource('/customer'  ,App\Http\Controllers\CustomerController::class);

Route::get('/'                    ,[App\Http\Controllers\HomeController::class,   'index'])->name('home');
Route::get('/home'                ,[App\Http\Controllers\HomeController::class,   'index'])->name('home');
Route::get('/get-companies'       ,[App\Http\Controllers\CompanyController::class, 'getCompanies'])->name('get-companies');
Route::get('/get-customers'       ,[App\Http\Controllers\CustomerController::class, 'getCustomers'])->name('get-customers');
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
Route::post('/add-purchase-invoice'     ,[App\Http\Controllers\StockController::class, 'purchaseInvoice'])->name('add-purchase-invoice');
Route::get('/purchases'                 ,[App\Http\Controllers\StockController::class, 'purchaseList'])->name('purchases');
Route::get('/purchase-edit/{id}'        ,[App\Http\Controllers\StockController::class, 'editPurchase'])->name('purchase-edit');
Route::get('/get-purchase-products/{id}'     ,[App\Http\Controllers\StockController::class, 'getPurchaseProduct'])->name('get-purchase-products');
Route::delete('/delete-product-from-invoice' ,[App\Http\Controllers\StockController::class, 'deleteProduct'])->name('delete-product');
// Purchase Returns / 
Route::get('/get-customer-balance-products/{id}'  ,[App\Http\Controllers\PurchaseReturnController::class, 'getVendorBalance'])->name('get-customer-balance');
Route::get('/purchase-return'                     ,[App\Http\Controllers\PurchaseReturnController::class, 'purchaseReturn'])->name('purchase-return');
Route::post('/add-purchase-return'                ,[App\Http\Controllers\PurchaseReturnController::class, 'addpurchaseReturn'])->name('add-purchase-return');

/** sale Routes */
Route::get('/sale-add'              ,[App\Http\Controllers\SaleController::class, 'create'])->name('sale-add');
Route::get('/get-customer'          ,[App\Http\Controllers\SaleController::class, 'getVendors'])->name('get-vendors');
Route::post('/add-sale-invoice'     ,[App\Http\Controllers\SaleController::class, 'saleInvoice'])->name('add-sale-invoice');
Route::get('/sales'                 ,[App\Http\Controllers\SaleController::class, 'saleList'])->name('sales');
Route::get('/sale-edit/{id}'        ,[App\Http\Controllers\SaleController::class, 'editsale'])->name('sale-edit');
Route::get('/get-sale-products/{id}',[App\Http\Controllers\SaleController::class, 'getSaleProduct'])->name('get-sale-products');
Route::get('/get-customer-balance/{id}' ,[App\Http\Controllers\SaleController::class, 'getCustomerBalance'])->name('get-customer-balance');

//Genrate invoice
Route::get('/invoice'               ,[App\Http\Controllers\SaleController::class, 'printInvoice'])->name('print-invoice');

//Transactions
Route::get('/customer-ledgers'          ,[App\Http\Controllers\TransactionController::class, 'customerLedger'])->name('customer-ledger');
Route::get('/get-customer-ledgers-list' ,[App\Http\Controllers\TransactionController::class, 'getCustomerLedgers'])->name('get-customer-ledger-list');
Route::post('/transaction-store'        ,[App\Http\Controllers\TransactionController::class, 'store'])->name('transaction-store');

});
