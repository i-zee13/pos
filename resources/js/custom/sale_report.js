let deleteRef = '';
let batches = [];
let sessions = [];
let CurrentRef = '';
let segments = location.href.split('/');
$('.search-btn').on('click', function () {
    var start_date  = $('.start_date').val();
    var end_date    = $('.end_date').val();
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
                            <th>Sale Date</th>
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
            var total_sales             = 0;
            var ttl_quantity            = 0;
            var ttl_product_discount    = 0;
            var ttl_invoice_discount    = 0;
            response.stocks.forEach((element, key) => {
                total_sales             += element['sale_total_amount'] ? element['sale_total_amount'] : 0;
                ttl_quantity            += element['qty'] ? element['qty'] : 0;
                ttl_product_discount    += element['product_discount'] ? element['product_discount'] : 0;
                ttl_invoice_discount    += element['invoice_discount'] ? element['invoice_discount'] : 0;
                var date                = new Date(element.expire_date);
                var formattedDate       = date.toDateString();
                var invoice_no          = "";
                invoice_no              = element.invoice_no.split('-');
                $('.TeacherAttendanceListTable tbody').append(`
                    <tr>
                        <td>${invoice_no[0]}</td>
                        <td>${element['created']}</td>
                        <td>${element['company_name']}</td>
                        <td>${element['product_name']}</td>
                        <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">${element['qty']}</td> 
                        <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">${element['product_discount'] ? element['product_discount'] : 0}</td> 
                        <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">${addCommas(element['sale_total_amount'])}</td> 
                    </tr>`);
            });
            $('.ttl_payment').html('<span>Rs.</span>'+total_sales ? addCommas(total_sales) : 0);
            $('.ttl_sales').html(total_sales ? addCommas('<span>Rs. </span>'+addCommas(parseInt(total_sales - ttl_invoice_discount))) : '<span>Rs. 0</span>');
            $('.ttl_quantity').html(ttl_quantity ? addCommas(ttl_quantity) : 0);
            $('.ttl_product_discount').html(ttl_product_discount ? addCommas(ttl_product_discount) : 0);
            $('.ttl_invoice_discount').html(ttl_invoice_discount ? addCommas(ttl_invoice_discount) : 0);
            $('.ttl_discount').html(addCommas(parseInt(ttl_invoice_discount) + parseInt(ttl_product_discount)));
            $('.TeacherAttendanceListTable').fadeIn();
            $('.TeacherAttendanceListTable tbody').append(`
                <tr style="background-color: #f6f6f6">
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>Total</th>
                    <th style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${ttl_quantity ? addCommas(ttl_quantity) : 0}</th>
                    <th style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${ttl_product_discount ? addCommas(ttl_product_discount) : 0}</th>
                    <th style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${total_sales ? addCommas(total_sales) : 0}</th>
                </tr>
            `);
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
                "bSort"     : false,
                "bPaginate" : false,
                scrollX     : false,
                scrollY     : '400px',
                scrollCollapse: true,
                dom: 'Bfrtip',
                buttons: [
                    {
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
                            objLayout['hLineWidth'] = function (i) { return 0.5; };
                            objLayout['vLineWidth'] = function (i) { return 0.5; };
                            objLayout['hLineColor'] = function (i) { return '#E6E6E6'; };
                            objLayout['vLineColor'] = function (i) { return '#E6E6E6'; };
                            objLayout['paddingLeft'] = function (i) { return 3; };
                            objLayout['paddingRight'] = function (i) { return 3; };
                            objLayout['paddingTop'] = function (i) { return 4; };
                            objLayout['paddingBottom'] = function (i) { return 4; };
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
                                    if (el.text == "Order Booker" || el.text == "Total:") {
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
    $('#search-form')[0].reset();
    $('.teacher_attendance_list').empty();
    $('.teacher_attendance_list').append(`
            <div class="col-12 pb-10">
            <div class="no-info">
                <div class="m-auto"><strong>Please Filter Your Stock Record !</strong></div>
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