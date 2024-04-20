/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*********************************************!*\
  !*** ./resources/js/custom/stock_report.js ***!
  \*********************************************/
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
  if ($('.company_id').val() == 0 && $('.product_id').val() == 0) {
    $('#notifDiv').fadeIn().css('background', 'red').text('Please Select Company/Product First.');
    setTimeout(function () {
      $('#notifDiv').fadeOut();
    }, 3000);
    return;
  }
  CurrentRef = $(this);
  // CurrentRef.attr('disabled', 'disabled');
  url = '/stocks';
  $("#search-form").ajaxSubmit({
    type: 'POST',
    url: url,
    data: {
      _token: $('meta[name="csrf_token"]').attr('content'),
      current_url: segments[3]
    },
    success: function success(response) {
      CurrentRef.attr('disabled', false);
      $('.loader').show();
      $('.teacher_attendance_list').empty();
      $('.teacher_attendance_list').append("\n                <table class=\"table table-hover dt-responsive nowrap TeacherAttendanceListTable\" style=\"width:100%;\">\n                    <thead>\n                        <tr>\n                            <th hidden>id</th>\n                            <th>#</th>\n                            <th>Company Name</th>\n                            <th>Product Name</th> \n                            <th>Balance</th> \n                        </tr>\n                    </thead><tbody>\n                </tbody>\n                </table>");
      $('.TeacherAttendanceListTable tbody').empty();
      if (response.records.length == 0) {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'green');
        $('#notifDiv').text('No data available');
        setTimeout(function () {
          $('#notifDiv').fadeOut();
        }, 3000);
      }
      var total_balance = 0;
      response.records.forEach(function (element, key) {
        total_balance += element['balance'];
        var percentageValue = (element.sale_price - element.p_price) / element.p_price * 100;
        var date = new Date(element.expire_date);
        var formattedDate = date.toDateString();
        $('.TeacherAttendanceListTable tbody').append("\n                    <tr>\n                        <td hidden>".concat(element['id'], "</td>\n                        <td>").concat(key + 1, "</td>\n                        <td>").concat(element['company_name'], "</td>\n                        <td>").concat(element['product_name'], "</td>\n                        <td style=\"font-family: 'Rationale', sans-serif !important;font-size: 25px;\">").concat(element['balance'], "</td> \n                    </tr>"));
      });
      $('.TeacherAttendanceListTable tbody').append("\n            <tr style=\"background: #152e4d;border: solid 1px #dbdbdb;color: white\">\n                <td class=\"font18\" align=\"right\" colspan=\"2\"></td>\n                <td class=\"font18\" align=\"center\">Grand Total :</td>\n                <td class=\"totalNo\">\n                    <span class=\"grand-total\" style=\"font-family: 'Rationale', sans-serif !important;font-size: 25px;\">".concat(total_balance, "</span>\n                </td>\n            </tr>\n        "));
      $('.ttl_stock_in_hand').html(total_balance);
      $('.TeacherAttendanceListTable').fadeIn();
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
        dom: 'Bfrtip',
        buttons: [{
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
  $('.product_id').val('').trigger('change');
  $('#search-form')[0].reset();
  $('.teacher_attendance_list').empty();
  $('.teacher_attendance_list').append("\n            <div class=\"col-12 pb-10\">\n            <div class=\"no-info\">\n                <div class=\"m-auto\"><strong>Please Filter Your Stock Record !</strong></div>\n            </div>\n        </div>\n        ");
  $('.ttl_stock_in_hand').html(0);
});
/******/ })()
;