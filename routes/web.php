<?php
 
use App\Http\Controllers\AccessRights;
use App\Http\Controllers\AdminSaleCloseController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseReturnController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\StockController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\LedgerDetailControlller;
use App\Http\Controllers\ProductReplacementController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SalesReturnController;
use App\Http\Controllers\TransactionController;
use Illuminate\Http\Request;
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

// Route::post('/next-submit', function (Request $r) {
//     $name = $r->input('name');
//     // dd(3434); 
//         // Process the data (e.g., store in the database)
//         return response()->json([
//             'message' => 'Data received successfully',
//             'name' => $name,
//         ]);
// });
 

Route::get('/clear', function () {
    Artisan::call('config:cache');
    Artisan::call('cache:clear');
    Artisan::call('route:clear');
    Artisan::call('optimize:clear');
    Artisan::call('storage:link');

    return "All cache clear successfully";
});
  Route::get('/clear-config', function () {
    Artisan::call('config:clear');
    return "Configuration cache cleared!";
});
Route::get('/', function () {
    return redirect('/home');
});
Auth::routes();
Route::group(['middleware' => ['auth']], function () {
    Route::Resource('/company', CompanyController::class);
    Route::Resource('/customer', CustomerController::class);
    Route::Resource('/vendors', CustomerController::class);
    Route::Resource('/AccessRights',   AccessRights::class); 
    /**organization-CRUD Routes */
    Route::get('/organization',                 [OrganizationController::class, 'index'])->name('admin.organization');
    Route::post('/organization/store',          [OrganizationController::class, 'store'])->name('admin.organization.store');
    //Add Mulitiple Locations of Organization
    Route::post('/organization-location/store', [OrganizationController::class, 'storeLocaion'])->name('admin.organization-location');
    Route::get('/location-list',                [OrganizationController::class, 'locationList'])->name('admin.location-list');
    Route::get('/get-location-form/{id}',       [OrganizationController::class, 'getLocation'])->name('admin.get-location-form');
    Route::POST('/location-delete/{id}',        [OrganizationController::class, 'deleteLocation'])->name('admin.location-delete');

    /**End Organization  Routes */
    Route::get('/get-city-against-states/{id}',     [OrganizationController::class, 'getCityAgainst_States'])->name('admin.getCityAgainst_States');
    Route::get('/get-state-against-country/{id}',   [OrganizationController::class, 'getStateAgainst_Country'])->name('admin.getStateAgainst_Country');
    Route::get('/get-countries',                    [OrganizationController::class, 'getCountries'])->name('admin.getCountries');


    Route::get('/', [HomeController::class,   'index'])->name('home');
    Route::get('/home', [HomeController::class,   'index'])->name('home');
    Route::get('/get-companies', [CompanyController::class, 'getCompanies'])->name('get-companies');
    Route::post('/get-customers', [CustomerController::class, 'getCustomers'])->name('get-customers');
    /** Product Routes */
    Route::get('/products', [ProductController::class, 'index'])->name('products');
    Route::post('/product-store', [ProductController::class, 'store'])->name('product-store');
    Route::get('/get-products', [ProductController::class, 'getProducts'])->name('get-products');
    Route::get('/get-sub-cat/{catId}', [ProductController::class, 'getSubCatToUpdate'])->name('get-sub-cat');
    Route::post('/product-delete/{id}', [ProductController::class, 'deleteProduct'])->name('product-delete');
    Route::get('/get-product-stock/{prodcut_id}',    [ProductController::class, 'getProductStock'])->name('get-product-stock');

    // Start Shahid
    Route::get('/change-price', [ProductController::class, 'changePrice'])->name('change-price');
    Route::post('/get-company-products', [ProductController::class, 'getCompanyProducts'])->name('get-company-products');
    Route::put('/update-product/{id}', [ProductController::class, 'updateProduct'])->name('update-product');
    //End Shahid
    /** Stock Routes */
    Route::get('/stock-add',                            [StockController::class, 'create'])->name('stock-add');
    Route::get('/get-vendors',                          [StockController::class, 'getVendors'])->name('get-vendors');
    // Route::post('/get-product'           ,[StockController::class, 'getProduct'])->name('get-product');
    Route::get('/get-vendor-balance/{id}',              [StockController::class, 'getVendorBalance'])->name('get-vendor-balance');
    /** Purchase Routes */
    Route::post('/add-purchase-invoice',                [StockController::class, 'purchaseInvoice'])->name('add-purchase-invoice');
    Route::get('/purchases',                            [StockController::class, 'purchaseList'])->name('purchases');
    Route::get('/purchase-edit/{id}',                   [StockController::class, 'editPurchase'])->name('purchase-edit');
    Route::get('/get-purchase-products/{id}',           [StockController::class, 'getPurchaseProduct'])->name('get-purchase-products');
    Route::delete('/delete-product-from-invoice',       [StockController::class, 'deleteProduct'])->name('delete-product');
    Route::delete('/delete-purchase-invoice',           [StockController::class, 'deleteInvoice'])->name('delete-purchase-invoice');
    Route::get('/print-purchase-invoice/{invoice_id}/{customer_id}/{received_amount}', [StockController::class, 'printInvoice'])->name('print-purchase-invoice');

    // Purchase Returns /
    Route::get('/get-customer-balance-products/{id}',           [PurchaseReturnController::class, 'getVendorBalance'])->name('get-customer-balance');
    Route::get('/add-return',                                   [PurchaseReturnController::class, 'create'])->name('purchase-return.create');
    Route::get('/purchase-returns',                             [PurchaseReturnController::class, 'list'])->name('purchase-return.index');
    Route::post('/add-purchase-return-invoice',                 [PurchaseReturnController::class, 'store'])->name('purchase-return.store');
    Route::get('/get-vendor-balance-for-purchase-return/{id}',  [PurchaseReturnController::class, 'getVendorBalnce'])->name('purchase-return.get-vendor-balance');
    Route::delete('/delete-product-from-purchase-return',       [PurchaseReturnController::class, 'deleteProduct'])->name('purchase-return.delete-product');
    Route::get('/purchase-return-edit/{id}',                    [PurchaseReturnController::class, 'edit'])->name('purchase-return-edit');
    Route::get('/get-purchase-return-products/{id}',            [PurchaseReturnController::class, 'getPurchaseReturnProduct'])->name('get-purchase-return-products');
    Route::get('/print-purchase-return-invoice/{invoice_id}/{customer_id}/{received_amount}', [PurchaseReturnController::class, 'printInvoice'])->name('print-purchase-return-invoice');
    Route::delete('/delete-purchase-return-invoice',            [PurchaseReturnController::class, 'deleteInvoice'])->name('delete-purchase-return-invoice');

    /** sale Routes */
    Route::get('/sale-add',                     [SaleController::class, 'create'])->name('sale-add');
    Route::get('/get-customer',                 [SaleController::class, 'getVendors'])->name('get-customer');
    Route::post('/add-sale-invoice',            [SaleController::class, 'saleInvoice'])->name('add-sale-invoice');
    Route::get('/sales',                        [SaleController::class, 'saleList'])->name('sales');
    Route::get('/sale-edit/{id}',               [SaleController::class, 'editsale'])->name('sale-edit');
    Route::get('/sale-detail/{id}',             [SaleController::class, 'show'])->name('sale-detail');
    Route::get('/get-sale-products/{id}',       [SaleController::class, 'getSaleProduct'])->name('get-sale-products');
    Route::get('/get-customer-balance/{id}',    [SaleController::class, 'getCustomerBalance'])->name('get-customer-balance');
    Route::delete('/delete-product-from-sale',  [SaleController::class, 'deleteProduct'])->name('delete-product');
    Route::delete('/delete-sale-invoice',       [SaleController::class, 'deleteInvoice'])->name('delete-sale-invoice');


    // Sales Returns /
    // Route::get('/get-customer-balance-products/{id}'  ,[PurchaseReturnController::class, 'getVendorBalance'])->name('get-customer-balance');
    Route::get('/sale-return',                  [SalesReturnController::class, 'create'])->name('salereturn.create');
    Route::post('/add-sale-return-invoice',     [SalesReturnController::class, 'store'])->name('salereturn.store');
    Route::get('/sale-returns',                 [SalesReturnController::class, 'index'])->name('salereturn.index');
    Route::get('/edit-sale-return/{id}',        [SalesReturnController::class, 'edit'])->name('salereturn-edit');
    Route::get('/get-sale-return-products/{id}',[SalesReturnController::class, 'getReturnProduct'])->name('get-salereturn-products');
    Route::get('/print-salereturn-invoice/{invoice_id}/{customer_id}/{received_amount}', [SalesReturnController::class, 'printInvoice'])->name('print-salereturn-invoice');
    Route::delete('/delete-product-from-sale-return',[SalesReturnController::class, 'deleteProduct'])->name('sale-return-delete-product');
    Route::delete('/delete-sale-return-invoice',     [SalesReturnController::class, 'deleteInvoice'])->name('delete-purchase-invoice');

    // Route::post('/add-purchase-return'   ,[PurchaseReturnController::class, 'addpurchaseReturn'])->name('add-purchase-return');

    //Genrate invoice
    Route::get('/print-sale-invoice/{invoice_id}/{customer_id}/{received_amount}', [SaleController::class, 'printInvoice'])->name('print-sale-invoice');
    //Transactions

    Route::get('/customer-ledger-jama',     [TransactionController::class, 'customerLedger'])->name('customer-ledger-jama');
    Route::get('/customer-ledger-banam',    [TransactionController::class, 'customerLedger'])->name('customer-ledger-banam');
    Route::post('/get-ledgers-list',        [TransactionController::class, 'getCustomerLedgers'])->name('get-customer-ledger-list');
    //Vendor Transcations
    Route::get('/vendor-ledger-jama',       [TransactionController::class, 'vendorLedger'])->name('vendor-ledger-jama');
    Route::get('/vendor-ledger-banam',      [TransactionController::class, 'vendorLedger'])->name('vendor-ledger-banam');

    Route::post('/transaction-store',       [TransactionController::class, 'store'])->name('transaction-store');
    Route::post('/get-customer-transactions',   [TransactionController::class, 'getCustomerTransactions'])->name('getCustomerTransactions');
    Route::get('/vendor-ledgers',           [TransactionController::class, 'customerLedger'])->name('vendor-ledgers');
    Route::get('/customer-ledgers',         [TransactionController::class, 'customerLedger'])->name('customer-ledgers');
    Route::get('/print-transaction-invoice/{invoice_id}/{customer_id}/{operation}/{type}', [TransactionController::class, 'printInvoice'])->name('print-salereturn-invoice');
    //Multiple Transtaction of Customer
    Route::get('/ledger-purchi',            [TransactionController::class, 'getLedgerPurchi'])->name('ledger-purchi');
    Route::post('/save-tranasctions',       [TransactionController::class, 'saveTransaction'])->name('save-tranasctions');
    Route::get('/print-ledger-purchi/{customers?}',      [TransactionController::class, 'printPurchi'])->name('print-purchi');

    //Reports
    Route::get('/customer-reports',         [LedgerDetailControlller::class, 'customerReport'])->name('customer-reports');
    Route::get('/vendor-reports',           [LedgerDetailControlller::class, 'vendorReport'])->name('vendor-reports');
    Route::get('/detail/{id}/{label}',      [LedgerDetailControlller::class, 'ledgerDetail'])->name('ledger.detail');
    Route::post('/report-list',             [LedgerDetailControlller::class, 'reportList'])->name('report-list');
    //Product Ledeger
    Route::get('/product-reports',          [LedgerDetailControlller::class, 'productReports'])->name('product-reports');
    Route::post('/product-list',            [LedgerDetailControlller::class, 'productList'])->name('product-list');

    Route::get('/stock-reports',            [ReportsController::class, 'stockReport'])->name('stock-reports');
    Route::post('/stocks',                  [ReportsController::class, 'stockReportList'])->name('stock-report-list');

    //Sale Report
    Route::get('/sale-report',              [ReportsController::class, 'saleReport'])->name('sale-reports');
    Route::post('/sales-list',              [ReportsController::class, 'saleReportList'])->name('stock-report-list');
    //Purchase Report
    Route::get('/purchase-report',          [ReportsController::class, 'purchaseReport'])->name('purchase-reports');
    Route::post('/purchase-list',           [ReportsController::class, 'purchaseReportList'])->name('purchase-report-list');
    
    //Profit Report
    Route::get('/profit-report',            [ReportsController::class, 'profitReport'])->name('profit-reports');
    Route::post('/sales-profit-list',       [ReportsController::class, 'saleProfitReportList'])->name('profit-report-list');

    // //Total Stock Profit Report
    // Route::get('/stock-profit-report',  [ReportsController::class, 'profitReport'])->name('stock-profit-reports');
    // Route::post('/stock-profit-list',   [ReportsController::class, 'saleProfitReportList'])->name('stock-profit-report-list');
    //Expense Report
    Route::get('/expense-report',             [ReportsController::class, 'expenseReport'])->name('expense-report');
    Route::post('/expense-list',              [ReportsController::class, 'expenseReportList'])->name('expense-report-list');

    // All Sales List Fakahr
    Route::get('/all-sales-list',             [SaleController::class, 'allSalesList'])->name('all-sales-list');
    Route::post('/fetch-all-list-sale',       [SaleController::class, 'fetchAllSalesList'])->name('fetch-all-list-sale');

    // Stock Report Value
    Route::get('/stock-value-report',         [ReportsController::class, 'allStockValueReport'])->name('stock-value-report');
    Route::post('/fetch-stock-value-report',  [ReportsController::class, 'fetchStockValueReport'])->name('fetch-stock-value-report');

    // Sales Replacement /
    // Route::get('/get-customer-balance-products/{id}'  ,[PurchaseReturnController::class, 'getVendorBalance'])->name('get-customer-balance');
    Route::get('/product-replacement-create',                           [ProductReplacementController::class, 'create'])->name('ProductReplacement.create');
    Route::get('/product-replacement-edit/{id}',                        [ProductReplacementController::class, 'edit'])->name('ProductReplacement.edit');
    Route::get('/product-replacements',                                 [ProductReplacementController::class, 'index'])->name('ProductReplacement.index');
    Route::post('/store-product-replacement-invoice',                   [ProductReplacementController::class, 'store'])->name('ProductReplacement.store');
    Route::get('/get-products-replacements/{id}',                       [ProductReplacementController::class, 'getReplacmentProduct'])->name('ProductReplacement.get');
    Route::delete('/delete-product-replacement',                        [ProductReplacementController::class, 'deleteProduct'])->name('ProductReplacement.delete');
    Route::get('/get-customer-balance-for-product-replacement/{id}',    [ProductReplacementController::class, 'getCustomerBalance'])->name('ProductReplacement.get-customer-balance');
    Route::get('/print-replacement-invoice/{invoice_id}/{customer_id}/{received_amount}', [ProductReplacementController::class, 'printInvoice'])->name('print-replacement-invoice');
    Route::delete('/delete-replacement-invoice',                        [ProductReplacementController::class, 'deleteInvoice'])->name('delete-replacement-invoice');
    
    //INVOICE DELETE 
    Route::post('/delete-invoice', [HomeController::class, 'deleteInvoice'])->name('delete-invoice');

    // Admin Close Report Fakhar
    Route::get('/admin-sale-close',                     [ReportsController::class, 'adminSaleClose'])->name('admin-sale-close');
    Route::get('/sale-close-record/{closing_date}',     [ReportsController::class, 'adminSaleCloseRecord'])->name('sale-close-record');
    Route::post('/save-closing-cash',                   [AdminSaleCloseController::class, 'saveAdminSaleCloseRecord'])->name('save-closing-cash');
    Route::post('/update-closing-cash',                 [AdminSaleCloseController::class, 'updateAdminSaleCloseRecord'])->name('update-closing-cash');

     // User Profile
  Route::get('/profile',                    [ProfileController::class, 'index'])->name('admin.profile');
  Route::post('/update-user-password',      [ProfileController::class, 'update_user_password'])->name('admin.update-user-password');
  Route::post('/update-user-profile-pic',   [ProfileController::class, 'update_user_profile_pic'])->name('admin.update-user-profile-pic');
  
      Route::get('/ledger',                   [LedgerDetailControlller::class, 'ledger'])->name('ledger');
    Route::post('/get-ledgers',              [LedgerDetailControlller::class, 'getLedgers'])->name('get-ledgers');

  
});
