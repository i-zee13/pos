/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*******************************************************!*\
  !*** ./resources/js/custom/vendor_customer_report.js ***!
  \*******************************************************/
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
  if ($('.vendor_id').val() == 0) {
    $('#notifDiv').fadeIn().css('background', 'red').text('Please Select Vendor First.');
    setTimeout(function () {
      $('#notifDiv').fadeOut();
    }, 3000);
    return;
  }
  CurrentRef = $(this);
  CurrentRef.attr('disabled', 'disabled');
  url = '/report-list';
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
      $('.teacher_attendance_list').append("\n                <table class=\"table table-hover dt-responsive nowrap TeacherAttendanceListTable\" style=\"width:100%;\">\n                    <thead>\n                        <tr>\n                            <th>Date</th>\n                            <th>Transaction Type</th>\n                            <th>CR</th>\n                            <th>DR</th>\n                            <th>Balance</th>\n                        </tr>\n                    </thead><tbody>\n                </tbody>\n                </table>");
      $('.TeacherAttendanceListTable tbody').empty();
      if (response.vendor.length == 0) {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'green');
        $('#notifDiv').text('No data available');
        setTimeout(function () {
          $('#notifDiv').fadeOut();
        }, 3000);
      }
      response.vendor.forEach(function (element, key) {
        var date = new Date(element.created_at);
        var formattedDate = date.toDateString();
        $('.TeacherAttendanceListTable tbody').append("\n                    <tr>\n                        <td>".concat(formattedDate, "</td>\n                        <td>").concat(element['trx_type'] == 1 ? 'Purchase Invoice' : element['trx_type'] == 2 ? 'Return Invoice' : 'Payment', "</td>\n                        <td>").concat(element['cr'] ? element['cr'] : '0', "</td>\n                        <td>").concat(element['dr'] ? element['dr'] : '0', "</td>\n                        <td>").concat(element['balance'] ? element['balance'] : '0', "</td>\n                         \n                    </tr>"));
      });
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
          extend: 'excelHtml5',
          text: 'Excel',
          title: title,
          exportOptions: {
            // columns: ':visible:not(:last-child)',
            format: {
              body: function body(innerHtml, rowIdx, colIdx, node) {
                return node.textContent;
              }
            }
          },
          customize: function customize(xlsx) {
            //copy _createNode function from source
            function _createNode(doc, nodeName, opts) {
              var tempNode = doc.createElement(nodeName);
              if (opts) {
                if (opts.attr) {
                  $(tempNode).attr(opts.attr);
                }
                if (opts.children) {
                  $.each(opts.children, function (key, value) {
                    tempNode.appendChild(value);
                  });
                }
                if (opts.text !== null && opts.text !== undefined) {
                  tempNode.appendChild(doc.createTextNode(opts.text));
                }
              }
              return tempNode;
            }
          }
        }]
      });
    }
  });
});
//  $('.course_id').on('change',function(){
//     var course_id = $(this).val();
//     var batch =  batches.filter(x => x.course_id == course_id);
//     if(batch){
//         $('.batch_id').empty();
//         $('.batch_id').append(`<option value="">Select Batch Code</option>`);
//         $('.session_id').empty();
//         $('.session_id').append(`<option value="">Select Session Code</option>`)
//         batch.forEach(data => {
//             $('.batch_id').append(`<option value="${data.id}" >${data.batch_code}</option>`);
//         });
//     }
//  })

$('.reset-btn').on('click', function () {
  $('.vendor_id').val('').trigger('change');
  $('#search-form')[0].reset();
});
/******/ })()
;