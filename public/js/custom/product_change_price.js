/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*****************************************************!*\
  !*** ./resources/js/custom/product_change_price.js ***!
  \*****************************************************/
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
    $('#notifDiv').fadeIn().css('background', 'red').text('End Date should not be Empty');
    $('.start_date').focus();
    setTimeout(function () {
      $('#notifDiv').fadeOut();
    }, 3000);
    return;
  }
  // if($('.company_id').val() == 0 && $('.product_id').val() == 0){
  //     $('#notifDiv').fadeIn().css('background', 'red').text('Please Select Company/Product First.');
  //     setTimeout(() => {
  //         $('#notifDiv').fadeOut();
  //     }, 3000);
  //     return
  // }
  CurrentRef = $(this);
  CurrentRef.text('Fetching...');
  CurrentRef.attr('disabled', 'disabled');
  url = '/sales-list';
  $("#search-form").ajaxSubmit({
    type: 'POST',
    url: url,
    data: {
      _token: $('meta[name="csrf_token"]').attr('content'),
      current_url: segments[3]
    },
    success: function success(response) {
      CurrentRef.text('Search');
      CurrentRef.attr('disabled', false);
      $('.loader').show();
      $('.teacher_attendance_list').empty();
      $('.teacher_attendance_list').append("\n                <table class=\"table table-hover dt-responsive nowrap TeacherAttendanceListTable\" style=\"width:100%;\">\n                    <thead>\n                        <tr>\n                            <th>Bill #</th>\n                            <th>Sale Date</th>\n                            <th>Company Name</th>\n                            <th>Product Name</th>\n                            <th>Qty</th> \n                            <th>Discount</th> \n                            <th>Amount</th> \n\n                        </tr>\n                    </thead><tbody>\n                </tbody>\n                </table>");
      $('.TeacherAttendanceListTable tbody').empty();
      if (response.stocks.length == 0) {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'green');
        $('#notifDiv').text('No data available');
        setTimeout(function () {
          $('#notifDiv').fadeOut();
        }, 3000);
      }
      var total_sales = 0;
      var ttl_quantity = 0;
      var ttl_product_discount = 0;
      var ttl_invoice_discount = 0;
      response.stocks.forEach(function (element, key) {
        total_sales += element['sale_total_amount'] ? element['sale_total_amount'] : 0;
        ttl_quantity += element['qty'] ? element['qty'] : 0;
        ttl_product_discount += element['product_discount'] ? element['product_discount'] : 0;
        ttl_invoice_discount += element['invoice_discount'] ? element['invoice_discount'] : 0;
        var date = new Date(element.expire_date);
        var formattedDate = date.toDateString();
        var invoice_no = "";
        invoice_no = element.invoice_no.split('-');
        $('.TeacherAttendanceListTable tbody').append("\n                    <tr>\n                        <td>".concat(invoice_no[0], "</td>\n                        <td>").concat(element['created'], "</td>\n                        <td>").concat(element['company_name'], "</td>\n                        <td>").concat(element['product_name'], "</td>\n                        <td style=\"font-family: 'Rationale', sans-serif !important;font-size: 16px;\">").concat(element['qty'], "</td> \n                        <td style=\"font-family: 'Rationale', sans-serif !important;font-size: 16px;\">").concat(element['product_discount'] ? element['product_discount'] : 0, "</td> \n                        <td style=\"font-family: 'Rationale', sans-serif !important;font-size: 16px;\">").concat(addCommas(element['sale_total_amount']), "</td> \n                    </tr>"));
      });
      $('.ttl_payment').html('<span>Rs.</span>' + total_sales ? addCommas(total_sales) : 0);
      $('.ttl_sales').html(total_sales ? addCommas('<span>Rs. </span>' + addCommas(parseInt(total_sales - ttl_invoice_discount))) : '<span>Rs. 0</span>');
      $('.ttl_quantity').html(ttl_quantity ? addCommas(ttl_quantity) : 0);
      $('.ttl_product_discount').html(ttl_product_discount ? addCommas(ttl_product_discount) : 0);
      $('.ttl_invoice_discount').html(ttl_invoice_discount ? addCommas(ttl_invoice_discount) : 0);
      $('.ttl_discount').html(addCommas(parseInt(ttl_invoice_discount) + parseInt(ttl_product_discount)));
      $('.TeacherAttendanceListTable').fadeIn();
      $('.TeacherAttendanceListTable tbody').append("\n                <tr style=\"background-color: #f6f6f6\">\n                    <th></th>\n                    <th></th>\n                    <th></th>\n                    <th>Total</th>\n                    <th style=\"font-family: 'Rationale', sans-serif !important;font-size: 18px;\">".concat(ttl_quantity ? addCommas(ttl_quantity) : 0, "</th>\n                    <th style=\"font-family: 'Rationale', sans-serif !important;font-size: 18px;\">").concat(ttl_product_discount ? addCommas(ttl_product_discount) : 0, "</th>\n                    <th style=\"font-family: 'Rationale', sans-serif !important;font-size: 18px;\">").concat(total_sales ? addCommas(total_sales) : 0, "</th>\n                </tr>\n            "));
      $('.loader').hide();
      var title = '';
      if (segments[3] == 'customer-reports') {
        title = 'Customer Report';
      } else {
        title = 'Vendor Report';
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
          title: "Sale Report",
          orientation: 'landscape',
          header: true,
          exportOptions: {
            alignment: 'left'
            // columns: ':visible:not(:last-child)',
          },

          customize: function customize(doc) {
            doc.content.splice(0, 1, {
              text: [{
                text: "Sale Report",
                bold: true,
                fontSize: 14,
                alignment: 'left'
              }
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

              margin: [0, 0, 0, 12]
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
            doc.content[1].table.body.forEach(function (element) {
              element.forEach(function (el) {
                element.forEach(function (cell) {
                  cell.fillColor = 'white';
                  cell.fontSize = '9';
                });
              });
            });
            doc.content[1].table.body.forEach(function (element) {
              element.forEach(function (el) {
                if (el.text == "Order Booker" || el.text == "Total:") {
                  element.forEach(function (cell) {
                    cell.fillColor = '#F2F2F2';
                    cell.fontSize = '9';
                    cell.bold = true;
                  });
                }
              });
            });
          }
        }, {
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
        }]
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
  $('.company_id').val('').trigger('change');
  $('#search-form')[0].reset();
  $('.teacher_attendance_list').empty();
  $('.teacher_attendance_list').append("\n            <div class=\"col-12 pb-10\">\n            <div class=\"no-info\">\n                <div class=\"m-auto\"><strong>Please Filter Your Stock Record !</strong></div>\n            </div>\n        </div>\n        ");
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
/******/ })()
;