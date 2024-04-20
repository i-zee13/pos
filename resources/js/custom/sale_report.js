let deleteRef = '';
let batches = [];
let sessions = [];
let CurrentRef = '';
let segments = location.href.split('/');
$('.search-btn').on('click', function () {
    var start_date = $('.start_date').val();
    var end_date = $('.end_date').val();
    if (start_date != '' && end_date == '') {
        $('#notifDiv').fadeIn().css('background', 'red').text('End Date should not be Empty').focus();
        $('.end_date').focus();
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return
    }
    if (end_date != '' && start_date == '') {
        $('#notifDiv').fadeIn().css('background', 'red').text('End Date should not be Empty');
        $('.start_date').focus();
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return
    }
    // if($('.company_id').val() == 0 && $('.product_id').val() == 0){
    //     $('#notifDiv').fadeIn().css('background', 'red').text('Please Select Company/Product First.');
    //     setTimeout(() => {
    //         $('#notifDiv').fadeOut();
    //     }, 3000);
    //     return
    // }
    CurrentRef = $(this);
    CurrentRef.text('Fetching...')
    CurrentRef.attr('disabled', 'disabled');
    url = '/sales-list';
    $(`#search-form`).ajaxSubmit({
        type: 'POST',
        url: url,
        data: {
            _token: $('meta[name="csrf_token"]').attr('content'),
            current_url: segments[3]
        },
        success: function (response) {
            CurrentRef.text('Search')
            CurrentRef.attr('disabled', false);
            $('.loader').show();
            $('.teacher_attendance_list').empty();
            $('.teacher_attendance_list').append(`
                <table class="table table-hover dt-responsive nowrap TeacherAttendanceListTable" style="width:100%;">
                    <thead>
                        <tr>
                            <th>Bill #</th>
                            <th>Date</th>
                            <th>Company Name</th>
                            <th>Product Name</th>
                            <th>Qty</th>
                            <th>Discount</th>
                            <th>Amount</th>

                        </tr>
                    </thead><tbody>
                </tbody>
                </table>`);



            $('.TeacherAttendanceListTable tbody').empty();
            if (response.stocks.length == 0) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('No data available');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
            var total_sales = 0;
            var ttl_quantity = 0;
            var ttl_product_discount = 0;
            var ttl_invoice_discount = 0;
            //Sale Return Variables
            var total_returns = 0;
            var ttl_return_quantity = 0;
            var ttl_return_product_discount = 0;
            var ttl_return_invoice_discount = 0;
            response.stocks.sales.forEach((element, key) => {
                total_sales += element['sale_total_amount'] ? element['sale_total_amount'] : 0;
                ttl_quantity += element['qty'] ? element['qty'] : 0;
                ttl_product_discount += element['product_discount'] ? element['product_discount'] : 0;
                ttl_invoice_discount += element['invoice_discount'] ? element['invoice_discount'] : 0;
                var date = new Date(element.expire_date);
                var formattedDate = date.toDateString();
                var invoice_no = "";
                invoice_no = element.invoice_no.split('-');
                reportTable(invoice_no[0], element)
            });
            $('.TeacherAttendanceListTable').fadeIn();
            sale_return_total(ttl_quantity, ttl_product_discount, total_sales, 'Sale')
            if (response.stocks.sale_returns.length > 0) {
                //Sale Returns
                response.stocks.sale_returns.forEach((element, key) => {
                    total_returns += element['return_total_amount'] ? element['return_total_amount'] : 0;
                    ttl_return_quantity += element['qty'] ? element['qty'] : 0;
                    ttl_return_product_discount += element['product_discount'] ? element['product_discount'] : 0;
                    ttl_return_invoice_discount += element['invoice_discount'] ? element['invoice_discount'] : 0;
                    var invoice_no = "";
                    invoice_no = element.invoice_no.split('-');
                    reportTable(invoice_no[0], element);
                });
                sale_return_total(ttl_return_quantity, ttl_return_product_discount, total_returns, 'Return');
            }
            var grand_total_discount = parseInt(ttl_invoice_discount + ttl_return_invoice_discount);
            var grand_qty = parseInt(ttl_quantity - ttl_return_quantity);
            //Grand Total
            $('.TeacherAttendanceListTable tbody').append(`
            <tr style="background: #152e4d;border: solid 1px #dbdbdb;color: white">
                <td colspan="3"></td> 
                <td class="font18">Grand Total :</td>
                <td class="totalNo"   style="font-family: 'Rationale', sans-serif !important;font-size: 25px;"> ${addCommas(parseInt(ttl_quantity - ttl_return_quantity))} </td>
                <td class="totalNo"  style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">  ${addCommas(parseInt(ttl_product_discount - ttl_return_product_discount))} </td>
                <td class="totalNo" colspan="2">
                    <span class="grand-total" style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">${addCommas(parseInt(total_sales - total_returns))}</span>
                </td>
            </tr>
        `);


            $('.ttl_sales').html('<span>Rs.</span>' + addCommas(total_sales - total_returns - grand_total_discount));
            // $('.ttl_payment').html(total_sales ? addCommas(addCommas(parseInt(total_sales + ttl_invoice_discount + ttl_product_discount))) : 0);
            $('.ttl_payment').html(total_sales ? addCommas(total_sales) : 0);
            $('.ttl_quantity').html(grand_qty ? addCommas(grand_qty) : 0);
            $('.ttl_product_discount').html(ttl_product_discount ? addCommas(ttl_product_discount) : 0);
            $('.ttl_invoice_discount').html(grand_total_discount ? addCommas(grand_total_discount) : 0);
            $('.ttl_discount').html(total_returns ? addCommas(total_returns) : 0);

            $('.loader').hide();
            var title = '';
            if (segments[3] == 'customer-reports') {
                title = 'Customer Report'
            } else {
                title = 'Vendor Report'
            }

            if ($.fn.DataTable.isDataTable(".TeacherAttendanceListTable")) {
                $('.TeacherAttendanceListTable').DataTable().clear().destroy();
            }
            var table = $('.TeacherAttendanceListTable').DataTable({
                "bSort": false,
                "bPaginate": false,
                scrollX: false,
                scrollY: '400px',
                scrollCollapse: true,
                dom: 'Bfrtip',
                buttons: [{
                        extend: 'pdfHtml5',
                        title: `Sale Report`,
                        orientation: 'landscape',
                        header: true,
                        exportOptions: {
                            alignment: 'left',
                            // columns: ':visible:not(:last-child)',
                        },
                        customize: function (doc) {
                            doc.content.splice(0, 1, {
                                text: [{
                                        text: `Sale Report`,
                                        bold: true,
                                        fontSize: 14,
                                        alignment: 'left'
                                    },
                                    // {
                                    //     text: 'Sale Report ',
                                    //     bold: false,
                                    //     fontSize: 14,
                                    //     alignment: 'left'
                                    // },
                                    // {
                                    //     text: `()`,
                                    //     bold: true,
                                    //     fontSize: 11,
                                    //     alignment: 'right',
                                    // }
                                ],
                                margin: [0, 0, 0, 12],
                            });
                            console.log(doc);
                            doc.pageMargins = [20, 12, 20, 12];
                            // doc.styles.tableBodyOdd.fillColor = "#FFA07A";
                            doc.styles.tableHeader.fillColor = "#E6E6E6";
                            doc.styles.tableFooter.fillColor = "#E6E6E6";
                            doc.styles.tableHeader.color = "black";
                            doc.styles.tableHeader.alignment = "left";
                            doc.styles.title.alignment = "left";
                            doc.content[1].table.widths = 'auto';
                            //cell border
                            var objLayout = {};
                            objLayout['hLineWidth'] = function (i) {
                                return 0.5;
                            };
                            objLayout['vLineWidth'] = function (i) {
                                return 0.5;
                            };
                            objLayout['hLineColor'] = function (i) {
                                return '#E6E6E6';
                            };
                            objLayout['vLineColor'] = function (i) {
                                return '#E6E6E6';
                            };
                            objLayout['paddingLeft'] = function (i) {
                                return 3;
                            };
                            objLayout['paddingRight'] = function (i) {
                                return 3;
                            };
                            objLayout['paddingTop'] = function (i) {
                                return 4;
                            };
                            objLayout['paddingBottom'] = function (i) {
                                return 4;
                            };
                            doc.content[1].layout = objLayout;

                            //cell border
                            age = table.column(3).data().toArray();

                            // testing for the background of the row
                            doc.content[1].table.body.forEach((element) => {
                                element.forEach((el) => {
                                    element.forEach((cell) => {
                                        cell.fillColor = 'white';
                                        cell.fontSize = '9';
                                    })
                                })
                            })
                            doc.content[1].table.body.forEach((element) => {
                                element.forEach((el) => {
                                    if (el.text == "Sale Total" || el.text == "Return Total") {
                                        element.forEach((cell) => {
                                            cell.fillColor = '#F2F2F2';
                                            cell.fontSize = '9';
                                            cell.bold = true;
                                        })
                                    }
                                })
                            })

                        }
                    },
                    {
                        title: 'Stock Report',
                        extend: 'excelHtml5',
                        exportOptions: {

                        },
                    },
                    {
                        extend: 'print',
                        text: 'Print',
                        title: title,
                        exportOptions: {
                            format: {
                                body: function (innerHtml, rowIdx, colIdx, node) {
                                    return node.textContent;
                                }
                            }
                        },
                        customize: function (win) {
                            // Change the default print title
                            $(win.document.body).find('h1').text(title);

                            // Add a footer with the current date and time
                            var date = new Date().toLocaleString();
                            $(win.document.body).append('<div style="text-align:center;font-size:10px;">' + date + '</div>');

                            // Remove the default DataTables styling from the print view
                            $(win.document.body).find('table').removeClass('display').addClass('table').css('font-size', 'inherit');
                        }
                    }
                ],

            })
        }
    });
});

function reportTable(invoice_no, element) {
    $('.TeacherAttendanceListTable tbody').append(`
                    <tr>
                        <td>${element['invoice_no']}</td>
                        <td>${element['created']}</td>
                        <td>${element['company_name']}</td>
                        <td>${element['product_name']}</td>
                        <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">${element['qty']}</td>
                        <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">${element['product_discount'] ? element['product_discount'] : 0}</td>
                        <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">${addCommas(element['sale_total_amount'] ?? element['return_total_amount'])}</td>
                    </tr>`);
}

function sale_return_total(ttl_quantity, ttl_product_discount, total, flag) {
    $('.TeacherAttendanceListTable tbody').append(`
    <tr style="background:#eaf1fa ; color:#152e4d" >
        <th colspan="3"></th>
        <th class="font18" align="center">${flag} Total</th>
        <th class="totalNo"   style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">${ttl_quantity ? addCommas(ttl_quantity) : 0}</th>
        <th class="totalNo"   style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">${ttl_product_discount ? addCommas(ttl_product_discount) : 0}</th>
        <th class="totalNo"   style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">${total ? addCommas(total) : 0}</th>
    </tr>
`);
}
$('.company_id').on('change', function () {
    var company_id = $(this).val();
    var batch = batches.filter(x => x.company_id == company_id);
    if (batch) {
        $('.batch_id').empty();
        $('.batch_id').append(`<option value="">Select Batch Code</option>`);
        $('.session_id').empty();
        $('.session_id').append(`<option value="">Select Session Code</option>`)
        batch.forEach(data => {
            $('.batch_id').append(`<option value="${data.id}" >${data.batch_code}</option>`);
        });
    }
})

$('.reset-btn').on('click', function () {
    $('.company_id').val('').trigger('change');
    $('.product_id').val('').trigger('change');
    $('.customer_id').val('').trigger('change');
    $('input[name="bill_no"]').val('');
    $('.ttl_sales').html('<span>Rs.</span> 0');
    $('.ttl_payment').html(0);
    $('.ttl_quantity').html(0);
    $('.ttl_product_discount').html(0);
    $('.ttl_invoice_discount').html(0);
    // $('#search-form')[0].reset();
    $('.teacher_attendance_list').empty();
    $('.teacher_attendance_list').append(`
            <div class="col-12 pb-10">
            <div class="no-info">
                <div class="m-auto"><strong>Please Filter Your Sale Record !</strong></div>
            </div>
        </div>
        `);
})

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
