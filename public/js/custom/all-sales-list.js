$(document).on('click','.search-btn-sales',function(){
    $.ajax({
        type: 'post',
        url     : `/fetch-all-list-sale`,
        data    : {
            _token: $('meta[name="csrf_token"]').attr('content'),
            start_date  :   $('.start_date').val(),
            end_date    :   $('.end_date').val(),
            bill_no     :   $('.bill_no').val(),
            customer_id :   $('.customer_id').val(),
        },
        success : function(response){
            $('.body').empty();
            $('.body').append(`
                <table class="table table-hover dt-responsive nowrap subCatsListTable" style="width:100%;">
                    <thead>
                        <tr>
                            <th>Invoice #</th>
                            <th>Customer Name</th>
                            <th>Received</th>
                            <th>Product Net Total</th>
                            <!-- <th>Invoice Total</th> -->
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            `);
            $('.subCatsListTable tbody').empty();
            response.sales.forEach(sale => {    
                var invoice = sale.invoice_no.split('-');
                $('.subCatsListTable tbody').append(`
                    <tr>
                        <td>${invoice[0]} (${sale.created})</td>
                        <td>${sale.customer_name}</td>
                        <td style="font-family: 'Rationale', sans-serif !important;font-size: 20px;">
                            ${addCommas(sale.paid_amount)} </td>
                        <td style="font-family: 'Rationale', sans-serif !important;font-size: 20px;">
                            ${addCommas(parseInt(sale.product_net_total) + (sale.service_charges) - (sale.invoice_discount))}
                        </td>
                        <!-- <td style="font-family: 'Rationale', sans-serif !important;font-size: 20px;">${sale.total_invoice_amount} </td> -->
                        <td>

                            <a id="$sale->id"
                                class="btn btn-default ${sale.is_editable == 1 ? 'btn-line' : ''}"
                                href="${sale.is_editable == 1 ? '/sale-edit/'+sale.id : '/sale-detail/'+sale.id}">${sale.is_editable == 1 ? 'Edit' : 'Detail'}</a>
                            <!-- <a id="${sale.id}" class="btn btn-default " href="route('sale-detail', ['id' => $sale->id])">Detail</a> -->
                            <button id="${sale.id}" data-invoice="${sale.id}"
                                data-customer-id="${sale.customer_id}"
                                paid-amount="${sale.paid_amount}"
                                class="btn btn-default print-invoice">Print</button>
                            <!-- <button type="button" id="${sale.id}" class="btn btn-default red-bg  delete_product" name="Sub_cat" title="Delete">Delete</button> -->
                        </td>
                    </tr>
                `);
            });
            $('.subCatsListTable').fadeIn();
            $('.subCatsListTable').DataTable();
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
$(document).on('click','.print-invoice', function() {
    var invoice_id = $(this).attr('data-invoice');
    var customer_id = $(this).attr('data-customer-id');
    var invoice_id = $(this).attr('data-invoice');
    var paid_amount = $(this).attr('paid-amount');
    var printWindow = window.open("/print-sale-invoice/" + invoice_id + '/' + customer_id + '/' +
        paid_amount);
    printWindow.onload = function() {
        printWindow.print();
        // printWindow.close();
    };
});
$(document).on('click','.reset-btn-sales',function(){
    $('.end_date,.start_date,.bill_no').val("");
    $('.customer_id').val("").trigger('change');
});