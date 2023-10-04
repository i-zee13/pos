const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .js('resources/js/custom/customer.js', 'public/js/custom')
    .js('resources/js/custom/product.js', 'public/js/custom')
    .js('resources/js/custom/stock.js', 'public/js/custom')
    .js('resources/js/custom/purchase_returns.js', 'public/js/custom')
    .js('resources/js/custom/sale.js', 'public/js/custom')
    .js('resources/js/custom/transaction.js', 'public/js/custom')
    .js('resources/js/custom/vendor_customer_report.js', 'public/js/custom')
    .js('resources/js/custom/stock_report.js', 'public/js/custom')
    .js('resources/js/custom/sale_report.js', 'public/js/custom')
    .js('resources/js/custom/sale_return.js', 'public/js/custom')
    .js('resources/js/custom/vendor_transaction.js', 'public/js/custom')
    .js('resources/js/custom/purchase.js', 'public/js/custom')
    .js('resources/js/custom/purchase_return.js', 'public/js/custom')
    .js('resources/js/custom/sale_replacement.js', 'public/js/custom')



    .vue()
    .sass('resources/sass/app.scss', 'public/css');
