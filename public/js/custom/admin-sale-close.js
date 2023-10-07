$(document).ready(function(){
    var close_date  =   $('.close_date').val();
    SaleCloseRecord(close_date);
});
function SaleCloseRecord(close_date){
    $('.ttl_sale').text('Loading...');
    $('.ttl_payments').text('Loading...');
    $('.ttl_received').text('Loading...');
    $('.ttl_in_hand').text('Loading...');
    $('.net_sale').text('Loading...');
    $('.credit_sale').text('Loading...');
    $('.discount').text('Loading...');
    $('.service_charges').text('Loading...');
    $('.total_sales').text('Loading...');
    $('.cash_recovery').text('Loading...');
    $('.customer_payments').text('Loading...');
    $('.vendor_payments').text('Loading...');
    $('.total_payments').text('Loading...');
    $('.cash_in_hand').text('Loading...');
    $.ajax({
        url     :   `/sale-close-record/${close_date}`,
        success :   function(response){
            var records                 =   response.records;
            var saleRecords             =   records.saleRecords;
            var vendor_ledger           =   records.vendor_payment;
            var customer_ledger         =   records.customer_payment;
            var total_invoice_amount    =   records.total_invoice_amount;
            var total_invoice_discount  =   records.total_invoice_discount;
            var total_product_discount  =   records.total_product_discount;
            var total_net_sales         =   records.total_net_sales;
            var total_credit_sales      =   records.total_credit_sales;
            var total_service_charges   =   records.total_service_charges;
            var total_discount          =   total_invoice_discount+total_product_discount;
            var total_sales             =   ((total_net_sales+total_credit_sales+total_service_charges)-(total_discount));
            var vendor_payment          =   records.vendor_payment;
            var customer_payment        =   records.customer_payment;
            var ttl_cash_recovery       =   records.ttl_cash_recovery;
            var total_payments          =   vendor_payment+customer_payment;
            var ttl_in_hand             =   ((total_invoice_amount+ttl_cash_recovery)-total_payments);
            var cash_in_hand            =   ((total_sales+ttl_cash_recovery)-total_payments);

            $('.ttl_sale').text(addCommas(parseFloat(total_invoice_amount).toFixed(2)));
            $('.ttl_payments').text(addCommas(parseFloat(total_payments).toFixed(2)));
            $('.ttl_received').text(addCommas(parseFloat(ttl_cash_recovery).toFixed(2)));
            $('.ttl_in_hand').text(addCommas(parseFloat(ttl_in_hand).toFixed(2)));

            $('.net_sale').text(addCommas(parseFloat(total_net_sales).toFixed(2)));
            $('.credit_sale').text(addCommas(parseFloat(total_credit_sales).toFixed(2)));
            $('.discount').text(addCommas(parseFloat(total_discount).toFixed(2)));
            $('.service_charges').text(addCommas(parseFloat(total_service_charges).toFixed(2)));
            $('.total_sales').text(addCommas(parseFloat(total_sales).toFixed(2)));

            $('.cash_recovery').text(addCommas(parseFloat(ttl_cash_recovery).toFixed(2)));

            $('.vendor_payments').text(addCommas(parseFloat(vendor_payment).toFixed(2)));
            $('.customer_payments').text(addCommas(parseFloat(customer_payment).toFixed(2)));
            $('.total_payments').text(addCommas(parseFloat(vendor_payment+customer_payment).toFixed(2)));

            $('.cash_in_hand').text(addCommas(parseFloat(cash_in_hand).toFixed(2)));

            $('.total_sale_table').empty();
            $('.total_sale_table').append(`
                <table class="table table-hover dt-responsive nowrap" id="saleRecordTable" style="width:100%;">
                    <thead>
                        <tr>
                            <th>SR#</th>
                            <th>Customer Name</th>
                            <th>Company Name</th>
                            <th>Product Name</th>
                            <th>Qty</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            `);
            $('#saleRecordTable tbody').append(`

            `)
        }
    });
}
function addCommas(nStr) {
    nStr += "";
    x = nStr.split(".");
    x1 = x[0];
    x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
  }