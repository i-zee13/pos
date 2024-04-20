/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************************************!*\
  !*** ./resources/js/custom/profit_report.js ***!
  \**********************************************/
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
  url = '/sales-profit-list';
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
      $('.teacher_attendance_list').append("\n                <table class=\"table table-hover dt-responsive nowrap TeacherAttendanceListTable\" style=\"width:100%;\">\n                    <thead>\n                        <tr>\n                            <th>Bill #</th>\n                            <th>Date</th>\n                            <th>Company Name</th>\n                            <th>Product Name</th>\n                            <th>Qty</th>\n                            <th>Cost Price</th>\n                            <th>Sale Price</th>\n                            <th>Profit</th>\n                        </tr>\n                    </thead><tbody>\n                </tbody>\n                </table>");
      $('.TeacherAttendanceListTable tbody').empty();
      if (response.sales.length == 0) {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'green');
        $('#notifDiv').text('No data available');
        setTimeout(function () {
          $('#notifDiv').fadeOut();
        }, 3000);
      }
      var total_profit = 0;
      var total_avg_profit = 0;
      var ttl_quantity = 0;
      var ttl_product_discount = 0;
      var ttl_invoice_discount = 0;
      var ttl_cost_product = 0;
      var ttl_sale_product = 0;
      var purchase_price = 0;
      response.sales.forEach(function (element, key) {
        var purchase_price = 0;
        if (element['product_purchased_price']) {
          purchase_price = element['product_purchased_price'];
        } else if (element['new_purchase_price']) {
          purchase_price = element['new_purchase_price'];
        } else {
          purchase_price = element['old_purchase_price'];
        }
        element['sale_price'] = element['sale_price'];
        var avg_profit = (element['sale_price'] - purchase_price) / purchase_price * 100;
        total_avg_profit += avg_profit;
        ttl_quantity += element['qty'] ? element['qty'] : 0;
        var cost_price = (purchase_price ? purchase_price : 0) * element['qty'];
        var sale_price = (element['sale_price'] ? element['sale_price'] : 0) * element['qty'];
        total_profit += (element['sale_price'] - purchase_price) * element['qty'];
        ttl_cost_product += cost_price;
        ttl_sale_product += sale_price;
        // ttl_cost_product += (element['old_purchase_price'] ? element['old_purchase_price'] : 0);
        // ttl_sale_product += element['sale_price'] ? element['sale_price'] : 0;
        ttl_invoice_discount += element['invoice_discount'] ? element['invoice_discount'] : 0;
        ttl_product_discount += element['product_discount'] ? element['product_discount'] : 0;
        var date = new Date(element.expire_date);
        var formattedDate = date.toDateString();
        var invoice_no = "";
        invoice_no = element.invoice_no.split('-');
        reportTable(invoice_no[0], element, purchase_price, avg_profit);
      });
      $('.TeacherAttendanceListTable').fadeIn();
      // sale_return_total(ttl_quantity,ttl_product_discount,total_profit,'Sale')
      $('.filter_name').empty();
      if ($('.product_id').val() != '') {
        $('.filter_name').html('Product: <span>' + $('.product_id option:selected').text() + '</span>');
      } else if ($('.company_id').val() != '' && $('.product_id').val() == '') {
        $('.filter_name').html('Company: <span>' + $('.company_id option:selected').text() + '</span>');
      }
      //Grand Total
      $('.TeacherAttendanceListTable tbody').append("\n            <tr style=\"background: #152e4d;border: solid 1px #dbdbdb;color: white\">\n                <td></td>\n                <td></td>\n                <td></td>\n                <td class=\"font18\">Grand Total :</td>\n                <td class=\"totalNo\"  style=\"font-family: 'Rationale', sans-serif !important;font-size: 25px;\"> ".concat(ttl_quantity, "</td>\n                <td class=\"totalNo\"  style=\"font-family: 'Rationale', sans-serif !important;font-size: 25px;\"> ").concat(addCommas(ttl_cost_product), "</td>\n                <td class=\"totalNo\"  style=\"font-family: 'Rationale', sans-serif !important;font-size: 25px;\"> ").concat(addCommas(ttl_sale_product), "</td>\n                <td class=\"totalNo\" colspan=\"2\">\n                    <span class=\"grand-total\" style=\"font-family: 'Rationale', sans-serif !important;font-size: 25px;\">").concat(addCommas(total_profit), " <span style=\"color: ").concat(total_avg_profit > 0 ? '#29f129' : 'red', ";font-size: 18px\">").concat(total_avg_profit.toFixed(2), "% </span></span>\n                </td>\n            </tr>\n        "));
      $('.ttl_sales').html('<span>Rs.</span>' + addCommas(total_profit) + " <span style=\"font-size: 28px\"> ( <span style=\"color: ".concat(total_avg_profit > 0 ? '#29f129' : 'red', ";font-size: 25px\">  ").concat(total_avg_profit.toFixed(2), "% </span> )</span>"));
      // $('.ttl_payment').html(total_profit ? addCommas(addCommas(parseInt(total_profit + ttl_invoice_discount + ttl_product_discount))) : 0);
      $('.ttl_payment').html(ttl_cost_product ? addCommas(ttl_cost_product) : 0);
      $('.ttl_quantity').html(ttl_quantity ? addCommas(ttl_quantity) : 0);
      $('.ttl_product_discount').html(ttl_sale_product ? addCommas(ttl_sale_product) : 0);
      $('.ttl_invoice_discount').html(ttl_invoice_discount ? addCommas(ttl_invoice_discount) : 0);
      $('.ttl_discount').html(ttl_product_discount ? addCommas(ttl_product_discount) : 0);
      $('.loader').hide();
      var title = 'Profit Report';
      // if (segments[3] == 'customer-reports') {
      //     title = 'Customer Report'
      // } else {
      //     title = 'Vendor Report'
      // }

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
          title: title,
          orientation: 'landscape',
          header: true,
          exportOptions: {
            alignment: 'left'
            // columns: ':visible:not(:last-child)',
          },

          customize: function customize(doc) {
            doc.content.splice(0, 1, {
              text: [{
                text: title,
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
                if (el.text == "Sale Total" || el.text == "Return Total") {
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
          title: title,
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
function reportTable(invoice_no, element, purchase_price, avg_profit) {
  $('.TeacherAttendanceListTable tbody').append("\n                    <tr>\n                        <td>".concat(invoice_no, "</td>\n                        <td>").concat(element['created'], "</td> \n                        <td>").concat(element['company_name'], "</td>\n                        <td>").concat(element['product_name'], "</td>\n                        <td style=\"font-family: 'Rationale', sans-serif !important;font-size: 16px;\">").concat(element['qty'], "</td>\n                        <td style=\"font-family: 'Rationale', sans-serif !important;font-size: 16px;\">").concat(purchase_price, "</td>\n                        <td style=\"font-family: 'Rationale', sans-serif !important;font-size: 16px;\">").concat(element['sale_price'], "</td>\n                        <td style=\"font-family: 'Rationale', sans-serif !important;font-size: 16px;\"><i  class=\"").concat(element['sale_price'] - purchase_price > 0 ? 'fa fa-arrow-up text-success' : 'fa fa-arrow-down text-danger', "\"></i>  <strong style=\"font-family: 'Rationale', sans-serif !important; font-size: 19px;\" >").concat(addCommas((element['sale_price'] - purchase_price) * element['qty']), "</strong> <span style=\"color: ").concat(avg_profit > 0 ? 'green' : 'red', ";\">").concat(avg_profit.toFixed(2), "% </span></td>\n                    </tr>"));
}
function sale_return_total(ttl_quantity, ttl_product_discount, total, flag) {
  $('.TeacherAttendanceListTable tbody').append("\n    <tr style=\"background:#eaf1fa ; color:#152e4d\" >\n        <th></th>\n        <th></th>\n        <th></th>\n        <th class=\"font18\" align=\"center\">".concat(flag, " Total</th>\n        <th class=\"totalNo\"   style=\"font-family: 'Rationale', sans-serif !important;font-size: 25px;\">").concat(ttl_quantity ? addCommas(ttl_quantity) : 0, "</th>\n        <th></th>\n        <th class=\"totalNo\"   style=\"font-family: 'Rationale', sans-serif !important;font-size: 25px;\">").concat(ttl_product_discount ? addCommas(ttl_product_discount) : 0, "</th>\n        <th class=\"totalNo\"   style=\"font-family: 'Rationale', sans-serif !important;font-size: 25px;\">").concat(total ? addCommas(total) : 0, "</th>\n    </tr>\n"));
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