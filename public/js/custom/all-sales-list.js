$(document).on('click', '.search-btn-sales', function () {
    $.ajax({
        type: 'post',
        url: '/fetch-all-list-sale',
        data: {
            _token: $('meta[name="csrf_token"]').attr('content'),
            start_date: $('.start_date').val(),
            end_date: $('.end_date').val(),
            bill_no: $('.bill_no').val(),
            customer_id: $('.customer_id').val(),
        },
        success: function (response) {
            $('.body').empty();
            $('.body').append(`
                <table class="table table-hover subCatsListTable all-sales-compact" style="width:100%;">
                    <thead>
                        <tr>
                            <th>Invoice #</th>
                            <th>Customer Name</th>
                            <th>Received</th>
                            <th>Product Net Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            `);
            $('.subCatsListTable tbody').empty();
            response.sales.forEach(function (sale) {
                var invoice = sale.invoice_no.split('-');
                $('.subCatsListTable tbody').append(`
                    <tr>
                        <td>${invoice[0]} (${sale.created})</td>
                        <td>${sale.customer_name}</td>
                        <td class="dt-amount">${addCommas(sale.paid_amount)}</td>
                        <td class="dt-amount">${addCommas(parseInt(sale.product_net_total) + (sale.service_charges) - (sale.invoice_discount))}</td>
                        <td>
                            <a class="btn btn-default ${sale.is_editable == 1 ? 'btn-line' : ''}"
                                href="/sale-edit/${sale.id}?invoice=detail">${sale.is_editable == 1 ? 'Edit' : 'Detail'}</a>
                            <button data-invoice="${sale.id}" data-customer-id="${sale.customer_id}"
                                paid-amount="${sale.paid_amount}"
                                class="btn btn-default print-invoice">Print</button>
                        </td>
                    </tr>
                `);
            });
            if (typeof initListDataTable === 'function') {
                initListDataTable('.subCatsListTable');
            } else {
                $('.subCatsListTable').DataTable({ responsive: false, autoWidth: false, bSort: false });
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

$(document).on('click', '.print-invoice', function () {
    var invoice_id = $(this).attr('data-invoice');
    var customer_id = $(this).attr('data-customer-id');
    var paid_amount = $(this).attr('paid-amount');
    var printWindow = window.open("/print-sale-invoice/" + invoice_id + '/' + customer_id + '/' + paid_amount);
    printWindow.onload = function () {
        printWindow.print();
    };
});

$(document).on('click', '.reset-btn-sales', function () {
    $('.bill_no').val('');
    $('.customer_id').val('').trigger('change');
    if (typeof resetReportDateRangePicker === 'function') {
        resetReportDateRangePicker('.all-sales-filter-form', 30);
    }
});

$(document).ready(function () {
    if (typeof initReportDateRangePicker === 'function') {
        initReportDateRangePicker('.all-sales-filter-form', 30);
    }
});
