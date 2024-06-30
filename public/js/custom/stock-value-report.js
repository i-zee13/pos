var deleteRef = '';
var batches = [];
var sessions = [];
var CurrentRef = '';
var segments = location.href.split('/');
$('.search-btn').on('click', function () {
    var start_date = $('.start_date').val();
    var end_date = $('.end_date').val();
    if (start_date != '' && end_date == '') {
        $('#notifDiv').fadeIn().css('background', 'red').text('End Date should not be Empty').focus();
        $('.end_date').focus();
        setTimeout(function () {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    if (end_date != '' && start_date == '') {
        $('#notifDiv').fadeIn().css('background', 'red').text('Start Date should not be Empty');
        $('.start_date').focus();
        setTimeout(function () {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    if ($('.company_id').val() == 0 && $('.product_id').val() == 0 && $('.expiry-select').val() == '') {
        $('#notifDiv').fadeIn().css('background', 'red').text('Please Select Company/Product First.');
        setTimeout(function () {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    CurrentRef = $(this);
    CurrentRef.attr('disabled', 'disabled');
    url = '/fetch-stock-value-report';
    $("#search-form").ajaxSubmit({
        type: 'POST',
        url: url,
        data: {
            _token: $('meta[name="csrf_token"]').attr('content'),
            current_url: segments[3]
        },
        success: function success(response) {
            CurrentRef.attr('disabled', false);
            
            CurrentRef.attr('disabled', false);
            var filter_selected = $('input[name="filter_by_value"]:checked').val();
            $('.loader').show();
            $('.teacher_attendance_list').empty();
            $('.teacher_attendance_list').append(`
          <table class="table table-hover dt-responsive nowrap TeacherAttendanceListTable" style="width:100%;">
              <thead>
                  <tr>
                      <th hidden>id</th>
                      <th>#</th>
                      <th>Company Name</th>
                      <th>Product Name</th> 
                      <th>Unit Cost</th>
                       <th>QTY</th>
                      <th>Balance</th> 
                  </tr>
              </thead><tbody>
          </tbody>
          </table>`);
            $('.TeacherAttendanceListTable tbody').empty();
            if (response.records.length == 0) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('No data available');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
            let total_balance = 0;
            var last_balance = 0;
            var ttl_qty_purchase = 0;
            response.records.forEach((element, key) => {
                var cost = 0;
                var amount = 0;
                if (filter_selected == 1) {
                    amount = element.ttl_avg_cost * parseInt(element.balance);
                    // last_balance += parseInt(element.balance) * parseInt(element.avg_product_value);
                    cost = element.ttl_avg_cost;
                } else {
                    amount = element.purchase_price * parseInt(element.balance);
                    // last_balance += parseInt(element.balance) * parseInt(element.p_price);
                    cost = element.purchase_price;
                }
                last_balance += amount;
                total_balance += element['balance'];
                ttl_qty_purchase += element.qty;
                var percentageValue = (element.sale_price - element.p_price) / element.p_price * 100;
                var date = new Date(element.expire_date);
                var formattedDate = date.toDateString();
                $('.TeacherAttendanceListTable tbody').append(`
              <tr>
                  <td hidden>${element['id']}</td>
                  <td>${key+1}</td>
                  <td>${element['company_name'] }</td>
                  <td>${element['product_name'] }</td>
                  <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">${cost ? addCommas(cost.toFixed(2)) : 0}</td>
                   <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">${addCommas(element.balance.toFixed(2))}</td>
                  <td style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">${addCommas(amount.toFixed(2))}</td> 
              </tr>`);
            });
            // if (filter_selected == 1) {
            //     console.log(last_balance, ttl_qty_purchase);
            //     last_balance = parseFloat(last_balance / ttl_qty_purchase).toFixed(3);
            // }
            $('.TeacherAttendanceListTable tbody').append(`
              <tr style="background: #152e4d;border: solid 1px #dbdbdb;color: white">
                  <td class="font18" align="right" ></td>
                  <td class="font18" align="center" colspan="3">Grand Total :</td>
                  <td class="totalNo">
                      <span class="grand-total" style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">${addCommas(total_balance.toFixed(2))}</span>
                  </td>
                  <td class="totalNo">
                      <span class="grand-total" style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">${addCommas(last_balance.toFixed(2))}</span>
                  </td>
              </tr>
          `);
            $('.ttl_stock_in_hand').html(total_balance);
            $('.TeacherAttendanceListTable').fadeIn();
            $('.loader').hide();

            $('.ttl_stock_in_hand').html(last_balance ? '<span>Rs. </span>' + addCommas(last_balance.toFixed(2)) : '<span>Rs. </span>' + 0);
            $('.ttl_products').html(response.records.length ? addCommas(response.records.length) : 0);
            if ($('.expiry-select').val() != '') {
                $('.ttl_stock_in').html(0);
                $('.ttl_stock_out').html(0);
            } else {
                $('.ttl_stock_in').html(stock_in ? addCommas(stock_in) : 0);
                $('.ttl_stock_out').html(stock_out ? addCommas(stock_out) : 0);
            }
            var title = '';
            if (segments[3] == 'customer-reports') {
                title = 'Customer Report';
            } else {
                title = 'Vendor Report';
            }
            if ($.fn.DataTable.isDataTable(".StockListTable")) {
                $('.StockListTable').DataTable().clear().destroy();
            }
            var table = $('.StockListTable').DataTable({
                "bSort": false,
                "bPaginate": false,
                scrollX: false,
                scrollY: '400px',
                scrollCollapse: true,
                dom: 'Bfrtip',
                buttons: [{
                        extend: 'pdfHtml5',
                        title: `Stock Report`,
                        orientation: 'landscape',
                        header: true,
                        exportOptions: {
                            alignment: 'left',
                            // columns: ':visible:not(:last-child)',
                        },
                        customize: function (doc) {
                            doc.content.splice(0, 1, {
                                text: [{
                                        text: `Stock Report`,
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
                                    if (el.text == "Total") {
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
                        exportOptions: {}
                    }, {
                        extend: 'print',
                        text: 'Print',
                        title: title,
                        exportOptions: {
                            format: {
                                body: function body(innerHtml, rowIdx, colIdx, node) {
                                    return node.textContent;
                                }
                            }
                        },
                        customize: function customize(win) {
                            // Change the default print title
                            $(win.document.body).find('h1').text(title);

                            // Add a footer with the current date and time
                            var date = new Date().toLocaleString();
                            $(win.document.body).append('<div style="text-align:center;font-size:10px;">' + date + '</div>');

                            // Remove the default DataTables styling from the print view
                            $(win.document.body).find('table').removeClass('display').addClass('table').css('font-size', 'inherit');
                        }
                    }
                ]
            });
        }
    });
});
$('.company_id').on('change', function () {
    var company_id = $(this).val();
    var batch = batches.filter(function (x) {
        return x.company_id == company_id;
    });
    if (batch) {
        $('.batch_id').empty();
        $('.batch_id').append("<option value=\"\">Select Batch Code</option>");
        $('.session_id').empty();
        $('.session_id').append("<option value=\"\">Select Session Code</option>");
        batch.forEach(function (data) {
            $('.batch_id').append("<option value=\"".concat(data.id, "\" >").concat(data.batch_code, "</option>"));
        });
    }
});
$('.reset-btn').on('click', function () {
    $('.company_id,.expiry-select,.product_id').val('').trigger('change');
    $('#search-form')[0].reset();
    $('.teacher_attendance_list').empty();
    $('.teacher_attendance_list').append("\n            <div class=\"col-12 pb-10\">\n            <div class=\"no-info\"> <div class=\"m-auto\"><strong>Please Filter Your Stock Record !</strong></div>\n            </div>\n        </div>\n        ");
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
