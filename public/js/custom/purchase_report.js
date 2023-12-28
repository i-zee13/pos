/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!************************************************!*\
  !*** ./resources/js/custom/purchase_report.js ***!
  \************************************************/
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
  url = '/purchase-list';
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
      $('.teacher_attendance_list').append("\n                <table class=\"table table-hover dt-responsive nowrap TeacherAttendanceListTable\" style=\"width:100%;\">\n                    <thead>\n                        <tr>\n                            <th></th>\n                            <th>Date</th>\n                            <th>Company Name</th>\n                            <th>Product Name</th>\n                            <th>P.Price</th>\n                            <th>Qty</th>\n                            <th>Amount</th>\n                        </tr>\n                    </thead><tbody>\n                </tbody>\n                </table>");
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
      //Sale Return Variables
      var total_returns = 0;
      var ttl_return_quantity = 0;
      var ttl_return_product_discount = 0;
      var ttl_return_invoice_discount = 0;
      response.stocks.sales.forEach(function (element, key) {
        total_sales += element['total_invoice_amount'] ? element['total_invoice_amount'] : 0;
        ttl_quantity += element['qty'] ? element['qty'] : 0;
        ttl_product_discount += element['product_discount'] ? element['product_discount'] : 0;
        ttl_invoice_discount += element['invoice_discount'] ? element['invoice_discount'] : 0;
        var date = new Date(element.expire_date);
        var formattedDate = date.toDateString();
        var invoice_no = "";
        invoice_no = element.invoice_no.split('-');
        reportTable(invoice_no[0], element);
      });
      $('.TeacherAttendanceListTable').fadeIn();
      sale_return_total(ttl_quantity, ttl_product_discount, total_sales, 'Purchase');
      if (response.stocks.sale_returns.length > 0) {
        //Sale Returns
        response.stocks.sale_returns.forEach(function (element, key) {
          total_returns += element['total_invoice_amount'] ? element['total_invoice_amount'] : 0;
          ttl_return_quantity += element['qty'] ? element['qty'] : 0;
          ttl_return_product_discount += element['product_discount'] ? element['product_discount'] : 0;
          ttl_return_invoice_discount += element['invoice_discount'] ? element['invoice_discount'] : 0;
          var invoice_no = "";
          invoice_no = element.invoice_no.split('-');
          reportTable(invoice_no[0], element);
        });
        sale_return_total(ttl_return_quantity, ttl_return_product_discount, total_returns, 'Return');
      }
      //Grand Total
      $('.TeacherAttendanceListTable tbody').append("\n            <tr style=\"background: #152e4d;border: solid 1px #dbdbdb;color: white\">\n                <td></td>\n                <td></td>\n                <td></td>\n                <td class=\"font18\">Grand Total :</td>\n                <td class=\"totalNo\"   style=\"font-family: 'Rationale', sans-serif !important;font-size: 25px;\"> - </td>\n                <td class=\"totalNo\"  style=\"font-family: 'Rationale', sans-serif !important;font-size: 25px;\">  ".concat(addCommas(parseInt(ttl_product_discount - ttl_return_product_discount)), " </td>\n                <td class=\"totalNo\" colspan=\"2\">\n                    <span class=\"grand-total\" style=\"font-family: 'Rationale', sans-serif !important;font-size: 25px;\">").concat(addCommas(parseInt(total_sales - total_returns)), "</span>\n                </td>\n            </tr>\n        "));
      $('.ttl_sales').html('<span>Rs.</span>' + addCommas(total_sales - total_returns));
      // $('.ttl_payment').html(total_sales ? addCommas(addCommas(parseInt(total_sales + ttl_invoice_discount + ttl_product_discount))) : 0);
      $('.ttl_payment').html(total_sales ? addCommas(total_sales) : 0);
      $('.ttl_quantity').html(ttl_quantity ? addCommas(ttl_quantity) : 0);
      $('.ttl_product_discount').html(ttl_product_discount ? addCommas(ttl_product_discount) : 0);
      $('.ttl_discount').html(ttl_invoice_discount ? addCommas(ttl_invoice_discount) : 0);
      $('.ttl_invoice_discount').html(total_returns ? addCommas(total_returns) : 0);
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
                if (el.text == "Purchase Total" || el.text == "Return Total") {
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
function reportTable(invoice_no, element) {
  $('.TeacherAttendanceListTable tbody').append("\n                    <tr>\n                        <td></td>\n                        <td>".concat(element['created'], "</td>\n                        <td>").concat(element['company_name'], "</td>\n                        <td>").concat(element['product_name'], "</td>\n                        <td style=\"font-family: 'Rationale', sans-serif !important;font-size: 16px;\">").concat(element['purchase_price'] ? element['purchase_price'] : 0, "</td>\n                        <td style=\"font-family: 'Rationale', sans-serif !important;font-size: 16px;\">").concat(element['qty'], "</td>\n                        <td style=\"font-family: 'Rationale', sans-serif !important;font-size: 16px;\">").concat(addCommas(element['total_invoice_amount']), "</td>\n                    </tr>"));
}
function sale_return_total(ttl_quantity, ttl_product_discount, total, flag) {
  $('.TeacherAttendanceListTable tbody').append("\n    <tr style=\"background:#eaf1fa ; color:#152e4d\" >\n        <th></th>\n        <th></th>\n        <th></th>\n        <th class=\"font18\" align=\"center\">".concat(flag, " Total</th>\n        <th class=\"totalNo\"   style=\"font-family: 'Rationale', sans-serif !important;font-size: 25px;\"> - </th>\n        <th class=\"totalNo\"   style=\"font-family: 'Rationale', sans-serif !important;font-size: 25px;\">").concat(ttl_quantity ? addCommas(ttl_quantity) : 0, "</th>\n        <th class=\"totalNo\"   style=\"font-family: 'Rationale', sans-serif !important;font-size: 25px;\">").concat(total ? addCommas(total) : 0, "</th>\n    </tr>\n"));
}
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
  $('.teacher_attendance_list').append("\n            <div class=\"col-12 pb-10\">\n            <div class=\"no-info\">\n                <div class=\"m-auto\"><strong>Please Filter Your Purchase Record !</strong></div>\n            </div>\n        </div>\n        ");
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