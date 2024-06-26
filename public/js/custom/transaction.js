/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!********************************************!*\
  !*** ./resources/js/custom/transaction.js ***!
  \********************************************/
var lastOp = "";
var action = '';
var ledger_balance = '';
var n = 0;
var customer_transaction_array = [];
var ledger_type = '';
var operation = '';
var total_amount = 0;
$(document).ready(function () {
  var segments = location.href.split('/');
  action = segments[3].replace(/[#?]+$/, '');
  operation = action.split('-')[0];
  ledger_type = action.split('-')[2];
  fetchLedgers();
  $(document).on('click', '.openDataSidebarForUpdateCustomerLedger', function () {
    $('input[id="action"]').val('');
    $('select option').removeAttr('disabled');
    $('.customer_id').select2();
    $('.add-more').empty();
    $('#saveTransactionForm')[0].reset();
    $('textarea[name="comment"]').val('');
    $('.customers').hide();
    $('.ProductTable').show();
    var this_btn = $(this);
    var id = this_btn.attr('customer-id');
    var customer_name = this_btn.attr('customer_name');
    var cr = this_btn.attr('cr');
    var dr = this_btn.attr('dr');
    var balance = this_btn.attr('balance');
    $.ajax({
      url: '/get-customer-transactions',
      type: 'post',
      data: {
        _token: $('meta[name="csrf_token"]').attr('content'),
        current_url: action,
        id: id,
        operation: operation
      },
      success: function success(response) {
        var balance_sum = 0;
        var dr_sum = 0;
        var cr_sum = 0;
        $('#transactionTable tbody').empty();
        $('.customer_balnce').val(response.customer.balance);
        response.transactions.forEach(function (data) {
          console.log(data);
          balance_sum += data.balance;
          cr_sum += data.cr;
          dr_sum += data.dr;
          if (action == operation + '-ledger-jama' && data.cr > 0) {
            $('#transactionTable tbody').append("\n                                <tr id='tr-".concat(data.id, "'>\n                                    <td>").concat(data.crv_no, "</td>\n                                    <td>").concat(data.cr, "</td>\n                                    <td>").concat(data.comment ? data.comment : 'NA', "</td>\n                                </tr>"));
          }
          if (action == operation + '-ledger-banam' && data.dr > 0) {
            console.log(data);
            $('#transactionTable tbody').append("\n                            <tr id='tr-".concat(data.id, "'>\n                                <td>").concat(data.cpv_no, "</td>\n                                <td>").concat(data.dr, "</td>\n                                <td>").concat(data.comment ? data.comment : 'NA', "</td>\n                            </tr>"));
          }
        });
        $('#transactionTable tbody').append("\n                <tr style=\"background: #152e4d;color: white;\">\n                    <td style=\"font-family:bold\" >Total:</td>\n                    <td colspan=\"2\">".concat(action == operation + '-ledger-jama' ? cr_sum : dr_sum, "</td>\n                </tr>\n            "));
        this_btn.closest('tr').find('.total_balance').text(action == operation + '-ledger-jama' ? cr_sum + 'CR' : dr_sum + 'DR');
        $('.add-more').append("\n                    <div class=\"row _head03\">\n                        <div class=\"col-6\"> \n                        <h5 class=\"\">".concat(customer_name, "</h5>\n                        </div>\n                        <div class=\"col-6\" style=\"text-align:right;\"> \n                        <span> <strong>Balance</strong> : ").concat(response.customer.balance > 0 ? response.customer.balance + ' <strong>DR</strong>' : response.customer.balance + ' <strong>CR</strong>', "</span>\n                        </div>\n                    </div>\n               \n                    <div class=\"row  remove_div\" >\n                        <div class=\"col-md-5 PB-10\">\n                            <div class=\"form-group focused\">\n                                <label class=\"control-label mb-10\">Add Amount *</label>\n                                <input type=\"hidden\" name=\"hidden_cust_balance[]\" value=\"").concat(response.customer.balance, "\">\n                                <input type=\"hidden\" name=\"hidden_cust_id[]\" value=\"").concat(id, "\">\n                                <input type=\"number\" name=\"amount[]\" class=\"form-control field-required amount\" id=\"amount_").concat(id, "\" required tabindex=\"2\" data-customer_id=\"").concat(id, "\">\n                            </div>\n                        </div>\n                        <div class=\"col-md-6 PB-10\">\n                            <div class=\"form-group focused\">\n                                <label class=\"control-label mb-10\">Remarks </label>\n                                <textarea name=\"comment[]\" class=\"form-control remarks_").concat(id, "\" rows=\"6\" tabindex=\"3\"></textarea>\n                            </div>\n                        </div>\n                        <div class=\"col-md-1 PB-10\" style=\"margin-top: 21px;\">\n                            <a type=\"button\" id=\"\" data-customer_id=\"").concat(id, "\" class=\"btn smBTN red-bg remove remove_btn_").concat(id, "\" data-index=\"\" data-quantity=\"\">Remove</a>\n                        </div>\n                    </div>\n                "));
        n++;
      }
    });
    $('input[id="operation"]').val('update');
    lastOp = 'update';
    $('#dataSidebarLoader').show();
    $('._cl-bottom').hide();
    $('.pc-cartlist').hide();
    $('#dataSidebarLoader').hide();
    $('._cl-bottom').show();
    $('.pc-cartlist').show();
    $('input[id="customer_id"]').val(id);
    $('input[id="hidden_balance"]').val(balance);
    $('.customer_name').text(customer_name + ' Details');
    $('input[name="cr"]').focus().val(cr).blur();
    $('input[name="dr"]').focus().val(dr).blur();
    $('input[name="balance"]').focus().val(balance >= 0 ? balance + ' DR' : -balance + ' CR').blur();
    openSidebar();
  });
  $(document).on('click', '.openDataSidebarForEditCustomerLedger', function () {
    $('select option').removeAttr('disabled');
    $('.customer_id').select2();
    $('.add-more').empty();
    $('#saveTransactionForm')[0].reset();
    $('textarea[name="comment"]').val('');
    $('.customers').hide();
    $('.ProductTable').show();
    $('#transactionTable tbody').empty();
    var this_btn = $(this);
    var id = this_btn.attr('customer-id');
    var customer_name = this_btn.attr('customer_name');
    var cr = this_btn.attr('cr');
    var dr = this_btn.attr('dr');
    var comment = this_btn.attr('comment');
    var balance = this_btn.attr('balance');
    var cr_dr = 0;
    if (action == operation + '-ledger-jama' && cr > 0) {
      balance = parseFloat(balance) + parseFloat(cr);
      cr_dr = cr;
    } else {
      balance = parseFloat(balance) - parseFloat(dr);
      cr_dr = dr;
    }
    $('.add-more').append("\n                <div class=\"row  remove_div\" >\n                    <div class=\"col-md-5 PB-10\">\n                        <div class=\"form-group focused\">\n                            <label class=\"control-label mb-10\">Add Amount *</label>\n                            <input type=\"hidden\" name=\"hidden_cust_balance[]\" value=\"".concat(balance, "\">\n                            <input type=\"hidden\" name=\"hidden_cust_id[]\" value=\"").concat(id, "\">\n                            <input type=\"number\" name=\"amount[]\" class=\"form-control field-required amount\" id=\"amount_").concat(id, "\" required tabindex=\"2\" data-customer_id=\"").concat(id, "\" value=\"").concat(cr_dr, "\">\n                        </div>\n                    </div>\n                    <div class=\"col-md-6 PB-10\">\n                        <div class=\"form-group focused\">\n                            <label class=\"control-label mb-10\">Remarks </label>\n                            <textarea name=\"comment[]\" class=\"form-control remarks_").concat(id, "\" rows=\"6\" tabindex=\"3\">").concat(comment, "</textarea>\n                        </div>\n                    </div>\n                    <div class=\"col-md-1 PB-10\" style=\"margin-top: 21px;\">\n                        <a type=\"button\" id=\"\" data-customer_id=\"").concat(id, "\" class=\"btn smBTN red-bg remove remove_btn_").concat(id, "\" data-index=\"\" data-quantity=\"\">Remove</a>\n                    </div>\n                </div>\n            "));
    n++;
    $('input[id="action"]').val('edit');
    lastOp = 'update';
    $('#dataSidebarLoader').show();
    $('._cl-bottom').hide();
    $('.pc-cartlist').hide();
    $('#dataSidebarLoader').hide();
    $('._cl-bottom').show();
    $('.pc-cartlist').show();
    $('input[id="customer_id"]').val(id);
    $('input[id="hidden_balance"]').val(balance);
    $('.customer_name').text(customer_name + ' Details');
    $('input[name="cr"]').focus().val(cr).blur();
    $('input[name="dr"]').focus().val(dr).blur();
    $('input[name="balance"]').focus().val(balance >= 0 ? balance + ' DR' : -balance + ' CR').blur();
    openSidebar();
  });
  $("#saveTransaction").on('click', function () {
    var current_action = $(this);
    saveTransaction(current_action, 'save');
    current_action.text('Save');
  });
  function saveTransaction(current_action, type) {
    var dirty = true;
    if (n == 0) {
      $('#notifDiv').fadeIn();
      $('#notifDiv').css('background', 'red');
      $('#notifDiv').text('Please Add at least One Customer.');
      setTimeout(function () {
        $('#notifDiv').fadeOut();
      }, 3000);
      return;
    }
    $('.amount').each(function () {
      if (!$(this).val()) {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please Add Amount.');
        setTimeout(function () {
          $('#notifDiv').fadeOut();
        }, 3000);
        dirty = false;
        return;
      }
    });
    if (dirty) {
      current_action.text('Processing...');
      current_action.attr('disabled', 'disabled');
      $('#saveTransaction').attr('disabled', 'disabled');
      $('#cancelSubCat').attr('disabled', 'disabled');
      $('#saveTransaction').text('Processing..');
      $('#saveTransactionForm').ajaxSubmit({
        type: "POST",
        url: '/transaction-store',
        cache: false,
        data: {
          current_url: action
        },
        success: function success(response) {
          if (response.status == "success") {
            if ($("#print-invoice").prop("checked")) {
              var zz = 0;
              if (action == operation + '-ledger-jama') {
                zz = 1;
              } else {
                zz = 2;
              }
              var printWindow = window.open("/print-transaction-invoice/" + response.transaction_id + '/' + response.customer_id + '/' + operation + '/' + zz);
              printWindow.onload = function () {
                printWindow.print();
              };
              location.reload();
            }
            $('#saveTransactionForm')[0].reset();
            console.log($('.voucher_no').val());
            $('.voucher_no').empty().val(response.voucher);
            closeSidebar();
            location.reload();
            fetchLedgers();
            $('#saveTransaction').removeAttr('disabled').text('Save');
            $('#cancelSubCat').removeAttr('disabled');
            $('#amount').val('');
            var msg = 'Transaction Successfully Updated';
            $('#notifDiv').fadeIn().text(msg).css('background', 'green');
            setTimeout(function () {
              $('#notifDiv').fadeOut();
            }, 3000);
          }
          if (response.status == "failed") {
            $('#saveTransaction').removeAttr('disabled');
            $('#cancelSubCat').removeAttr('disabled');
            $('#saveTransaction').text('Save');
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Not Updated at this moment');
            setTimeout(function () {
              $('#notifDiv').fadeOut();
            }, 3000);
          }
        },
        error: function error(err) {
          if (err.status == 422) {
            $.each(err.responseJSON.errors, function (i, error) {
              var el = $(document).find('[name="' + i + '"]');
              el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
            });
          }
        }
      });
    }
  }
  $(document).on('click', '.openDataSidebarForAddCustomerLedger', function () {
    // $('.customer_id').children(`option`).attr('disabled', false);
    $('select option').removeAttr('disabled');
    $('.customer_id').select2();
    $('#saveTransactionForm')[0].reset();
    $('.add-more').empty();
    $('.ProductTable').hide();
    $('.customers').show();
    $('#transactionTable tbody').empty();
    $('.customer_balnce').val('');
    $('textarea[name="comment"]').val('');
    $('.customer_id').val(0).trigger('change');
    var id = $(this).attr('customer-id');
    var customer_name = $(this).attr('customer_name');
    var cr = $(this).attr('cr');
    var dr = $(this).attr('dr');
    var balance = $(this).attr('balance');
    $('input[id="operation"]').val('update');
    lastOp = 'update';
    $('#dataSidebarLoader').show();
    $('._cl-bottom').hide();
    $('.pc-cartlist').hide();
    $('#dataSidebarLoader').hide();
    $('._cl-bottom').show();
    $('.pc-cartlist').show();
    $('input[id="customer_id"]').val(id);
    $('input[id="hidden_balance"]').val(balance);
    $('.customer_name').text(customer_name !== null && customer_name !== void 0 ? customer_name : 'Customer' + ' Details');
    $('input[name="cr"]').focus().val(cr).blur();
    $('input[name="dr"]').focus().val(dr).blur();
    $('input[name="balance"]').focus().val(balance >= 0 ? balance + ' DR' : -balance + ' CR').blur();
    openSidebar();
  });
});
function fetchLedgers() {
  $.ajax({
    type: 'post',
    url: '/get-ledgers-list',
    data: {
      _token: $('meta[name="csrf_token"]').attr('content'),
      current_url: action,
      operation: operation
    },
    success: function success(response) {
      $('.body').empty();
      $('.body').append("\n                    <table class=\"table table-hover dt-responsive nowrap subCatsListTable\" style=\"width:100%;\">\n                        <thead>\n                            <tr>\n                               <th>Voucher #</th>   \n                                <th>Name</th>\n                              <!--  <th>Balance</th> --!>\n                                <th>Total </th>\n                                <th>Remarks</th>\n                                <th>Dated</th>\n                                <th>Action</th>\n                            </tr>\n                        </thead>\n                    <tbody></tbody>\n                    </table>");
      $('.subCatsListTable tbody').empty();
      var sNo = 1;
      response.customers.forEach(function (element, key) {
        var _element$rec$0$total_, _element$rec$0$total_2, _element$crv_no, _element$cpv_no, _element$comment;
        var total_cr_dr = 0;
        var voucher = '';
        total_cr_dr = action == 'customer-ledger-jama' ? (_element$rec$0$total_ = element.rec[0].total_cr) !== null && _element$rec$0$total_ !== void 0 ? _element$rec$0$total_ : '0' : (_element$rec$0$total_2 = element.rec[0].total_dr) !== null && _element$rec$0$total_2 !== void 0 ? _element$rec$0$total_2 : '0';
        voucher = action == 'customer-ledger-jama' ? (_element$crv_no = element.crv_no) !== null && _element$crv_no !== void 0 ? _element$crv_no : '0' : (_element$cpv_no = element.cpv_no) !== null && _element$cpv_no !== void 0 ? _element$cpv_no : '0';
        ledger_balance = element['balance'] >= 0 ? element['balance'] + ' DR' : -element['balance'] + ' CR';
        $('.subCatsListTable tbody').append("\n                        <tr>\n                         <td> ".concat(voucher, "</td> \n                            <td> ").concat(element['customer_name'], "</td>\n                            <!-- <td class='total_balance'>").concat(ledger_balance, "</td> --!>\n                            <td>").concat(total_cr_dr, "</td>\n                            <td> ").concat((_element$comment = element['comment']) !== null && _element$comment !== void 0 ? _element$comment : 'NA', "</td>\n                            <td> ").concat(moment(element['date']).format('D MMM YYYY'), "</td>\n                            <td>\n                                <button  class=\"btn btn-default btn-line openDataSidebarForEditCustomerLedger ").concat(element.is_editable == 1 ? '' : 'd-none', "\"\n                                            customer-id=\"").concat(element['customer_id'], "\"\n                                            customer_name=\"").concat(element['customer_name'], "\"\n                                            cr=\"").concat(element['cr'], "\"\n                                            dr=\"").concat(element['dr'], "\"\n                                            balance=\"").concat(element['customer_balance'], "\"\n                                            comment=\"").concat(element['comment'], "\"\n                                    >Edit</button>\n                                    <button  class=\"btn btn-default btn-line openDataSidebarForUpdateCustomerLedger\"\n                                            customer-id=\"").concat(element['customer_id'], "\"\n                                            customer_name=\"").concat(element['customer_name'], "\"\n                                            cr=\"").concat(element['cr'], "\"\n                                            dr=\"").concat(element['dr'], "\"\n                                            balance=\"").concat(element['customer_balance'], "\"\n                                    >Add Payment</button>\n                            </td>\n                        </tr>"));
      });
      $('#tblLoader').hide();
      $('.body').fadeIn();
      $('.subCatsListTable').DataTable();
    }
  });
}
$('.customer_id').on('change', function () {
  var cust_bal = $('option:selected', this).attr('balance');
  var cus_name = $('option:selected', this).attr('cus_name');
  var customer_val = $(this).val();
  $('.hidden_balance').val(cust_bal);
  $('.customer_balnce').val(cust_bal);
  $('#customer_id').val($(this).val());
  if (customer_val > 0) {
    n++;
    $('.customer_balnce').val(cust_bal);
    $('.add-more').append("\n        <div class=\"row  remove_div\" >\n            <div class=\"row _head03\">\n                <div class=\"col-6\"> \n                    <h5 class=\"\">".concat(cus_name, "</h5>\n                </div>\n                <div class=\"col-6\" style=\"text-align:right;\"> \n                     <span> <strong>Balance</strong> : ").concat(cust_bal > 0 ? cust_bal + '<strong> DR</strong>' : cust_bal + ' <strong>CR</strong>', "</span>\n                </div>\n            </div> \n\n                <div class=\"col-md-5 PB-10\">\n                    <div class=\"form-group focused\">\n                        <label class=\"control-label mb-10\">Add Amount *</label>\n                        <input type=\"hidden\" name=\"hidden_cust_balance[]\" value=\"").concat(cust_bal, "\">\n                        <input type=\"hidden\" name=\"hidden_cust_id[]\" value=\"").concat(customer_val, "\">\n                        <input type=\"number\" name=\"amount[]\" class=\"form-control field-required amount nnnn\" id=\"amount_").concat(customer_val, "\" required tabindex=\"").concat(customer_val * 2 + 2, "\" data-customer_id=\"").concat(customer_val, "\">\n                    </div>\n                </div>\n                <div class=\"col-md-6 PB-10\">\n                    <div class=\"form-group focused\">\n                        <label class=\"control-label mb-10\">Remarks </label>\n                        <textarea name=\"comment[]\" class=\"form-control remarks_").concat(customer_val, "\" rows=\"6\"tabindex=\"").concat(customer_val * 2 + 3, "\"></textarea>\n                    </div>\n                </div>\n                <div class=\"col-md-1 PB-10\" style=\"margin-top: 21px;\">\n                    <a type=\"button\" id=\"\" data-customer_id=\"").concat(customer_val, "\" class=\"btn smBTN red-bg remove remove_btn_").concat(customer_val, "\" data-index=\"\" data-quantity=\"\">Remove</a>\n                </div>\n            </div>\n        "));
    $('.customer_id').children("option[value=\"".concat(customer_val, "\"]")).attr('disabled', true);
    setTimeout(function () {
      $('.customer_id').val('0');
      $('.customer_id').select2();
      $("#amount_".concat(customer_val)).focus();
    }, 500);
  }
});
$(document).on('click', ".remove", function () {
  var cus_id = $(this).attr('data-customer_id');
  // $(`.remove_btn_${cus_id}`).parent().parent().remove();
  $(this).closest('.remove_div').remove();
  // customer_transaction_array = customer_transaction_array.filter(x => x.customer_id != $(this).attr('data-customer_id'));
  n--;
  $('.customer_id').children('option[value="' + cus_id + '"]').attr('disabled', false);
  $(".customer_id").val('0');
  $(".customer_id").select2();
  var total_amount = 0;
  $('.amount').each(function () {
    var inputValue = parseFloat($(this).val());
    total_amount += inputValue;
  });
  $('.total_ledger_sum').text(total_amount);
});
$('.close').on('click', function () {
  $(this).remove();
});
$('#saveTransaction').on('focus', function () {
  $(this).css('background', 'green');
});
$('#saveTransaction').on('blur', function () {
  $(this).css('background', 'linear-gradient(90deg, #152e4d 0%, #152e4d 100%)');
});
$(document).on('click', '.btn-cancel', function () {
  if (n > 0) {
    $('#hidden_btn_to_open_modal').click();
  } else {
    closeSidebar();
  }
});
$(document).on('click', '.confirm_btn', function () {
  closeSidebar();
});
$(document).on('focusout', '.amount', function () {
  var total_amount = 0;
  $('.amount').each(function () {
    var inputValue = parseFloat($(this).val());
    total_amount += inputValue;
  });
  $('.total_ledger_sum').text(total_amount);
});
/******/ })()
;