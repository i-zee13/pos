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
    $('.sale-close-btn-modal').attr('disabled',true);
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
            if(ttl_in_hand > 0){
                $('.sale-close-btn-modal').removeAttr('disabled');
                $('.sale-close-btn-modal').attr('ttl_in_hand',ttl_in_hand);
            }
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
                            <th>Bill#</th>
                            <th>Customer Name</th>
                            <th>Company Name</th>
                            <th>Product Name</th>
                            <th>Qty</th>
                            <th>Discount</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            `);
            saleRecords.forEach(element => {
                var invoice_no          = "";
                invoice_no              = element.invoice_no.split('-');
                $('#saleRecordTable tbody').append(`
                    <tr>
                    <td>${invoice_no[0]}</td>
                    <td>${element['customer_name']}</td>
                    <td>${element['company_name']}</td>
                    <td>${element['product_name']}</td>
                    <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">${element['qty']}</td> 
                    <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">${element['product_discount']}</td> 
                    <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">${addCommas(element['total_invoice_amount'])}</td> 
                    </tr>
                `)
            });
            $('#saleRecordTable').fadeIn();
            $('#saleRecordTable').DataTable();
            $('.loader').hide();
        }
    });
}
$(document).on('click','.sale-close-btn-modal',function(){
    var ttl_in_hand =   $(this).attr('ttl_in_hand');
    if(ttl_in_hand > 0){
        $('.cash_in_hand').val(ttl_in_hand).attr('readonly',true);
        $('.ttl_cash_in_hand').val(ttl_in_hand);
    }
});
$(document).on('input','.closing_cash',function(){
    var closing_cash    =   ($(this).val());
    var ttl_cash_in_hand=   ($('.ttl_cash_in_hand').val());
    var cash_in_hand    =   ($('.cash_in_hand').val());
    if(closing_cash){
        if(closing_cash <= ttl_cash_in_hand){
            cash_in_hand    =   ttl_cash_in_hand - closing_cash;
            $('.cash_in_hand').val(cash_in_hand);
        }else{
            $('.cash_in_hand').val(ttl_cash_in_hand);
            $(this).val("");
            $('#notifDiv').fadeIn().css('background', 'red').text("Closing cash can't be greater than "+ttl_cash_in_hand);
            $(this).focus();
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return
        }
    }else{
        $('.cash_in_hand').val(ttl_cash_in_hand);
    }
});
$(document).on('click','.sale_open',function(){
    var currentRef = $(this);
    currentRef.text("Processing...");
    currentRef.attr('disabled',true);
    $.ajax({
        type    :   'POST',
        url     :   '/update-closing-cash',
        data    :   {
            _token      :   $('[name="csrf_token"]').attr('content'),
            close_date  :   $('.close_date').val(),
        },
        success :   function(response){
            currentRef.text("Open Sale");
            currentRef.attr('disabled',false);
            if(response.status == "success"){
                $('#notifDiv').fadeIn().css('background', 'green').text("Sale open successfully");
                setTimeout(() => {
                    window.location.reload();
                    $('#notifDiv').fadeOut();
                }, 3000);
                $('.cancel_sale_close_modal').click();
            }else{
                $('#notifDiv').fadeIn().css('background', 'red').text("Sale not open at this moment");
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
        }
    });
});
$(document).on('click','.sale_close',function(){
    var ttl_cash_in_hand=   $('.ttl_cash_in_hand').val();
    var closing_cash    =   $('.closing_cash').val();
    if(!closing_cash || closing_cash == ""){
        $('#notifDiv').fadeIn().css('background', 'red').text("Please fill out closing cash");
        $('.closing_cash').focus();
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    var currentRef = $(this);
    currentRef.text("Processing...");
    currentRef.attr('disabled',true);
    $.ajax({
        type    :   'POST',
        url     :   '/save-closing-cash',
        data    :   {
            _token              :   $('[name="csrf_token"]').attr('content'),
            close_date          :   $('.close_date').val(),
            ttl_cash_in_hand    :   $('.ttl_cash_in_hand').val(),
            closing_cash        :   $('.closing_cash').val(),
            closing_comment     :   $('.closing_comment').val(),
        },
        success :   function(response){
            currentRef.text("Close Sale");
            currentRef.attr('disabled',false);
            if(response.status == "success"){
                $('#notifDiv').fadeIn().css('background', 'green').text("Sale close successfully");
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                    window.location.reload();
                }, 3000);
                $('.cancel_sale_close_modal').click();
            }else if(response.closing_cash_null_0){
                $('#notifDiv').fadeIn().css('background', 'red').text("Closing cash can't be 0 or empty");
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }else{
                $('#notifDiv').fadeIn().css('background', 'red').text("Sale not close at this moment");
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
        }
    });

});
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