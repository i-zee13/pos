var lastOp = "";
var action = '';
let ledger_balance = '';
let n = 0;
let customer_transaction_array = [];
let ledger_type = '';
let operation = '';
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
        var this_btn = $(this)
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
            success: function (response) {
                var balance_sum = 0;
                var dr_sum = 0;
                var cr_sum = 0;
                $('#transactionTable tbody').empty();
                $('.customer_balnce').val(response.customer.balance);
                response.transactions.forEach(data => {
                    balance_sum += data.balance;
                    cr_sum += data.cr;
                    dr_sum += data.dr;

                    if (action == operation + '-ledger-banam' && data.dr > 0) {
                        console.log(data.cr)
                        $('#transactionTable tbody').append(`
                                <tr id='tr-${data.id}'>
                                    <td>${data.cpv_no}</td> 
                                    <td>${data.dr}</td>
                                    <td>${data.comment}</td> 
                                    </tr>`
                        );
                    }
                    if (action == operation + '-ledger-jama' && data.cr > 0) {
                        $('#transactionTable tbody').append(`
                        <tr id='tr-${data.id}'>
                            <td>${data.crv_no}</td> 
                            <td>${data.cr}</td>
                            <td>${data.comment}</td> 
                            </tr>`
                        );
                    }

                });
                $('#transactionTable tbody').append(`
                <tr style="background: #152e4d;color: white;">  
                    <td style="font-family:bold">Total:</td>
                    <td colspan="2">${action == operation + '-ledger-banam' ? dr_sum : cr_sum}</td>
                   
                </tr>
            `);
                this_btn.closest('tr').find('.total_balance').text((action == operation + '-ledger-banam' ? dr_sum + 'DR' : cr_sum + 'CR'));
                $('.add-more').append(` 
                    <div class="row _head03">
                        <div class="col-6"> 
                        <h5 class="">${customer_name}</h5>
                        </div>
                        <div class="col-6" style="text-align:right;"> 
                        <span> <strong>Balance</strong> : ${response.customer.balance > 0 ? response.customer.balance + ' <strong>CR</strong>' : response.customer.balance + ' <strong>DR</strong>'}</span>
                        </div>
                    </div>
                    <div class="row  remove_div" >
                        <div class="col-md-5 PB-10">
                            <div class="form-group focused">
                                <label class="control-label mb-10">Add Amount *</label>
                                <input type="hidden" name="hidden_cust_balance[]" value="${response.customer.balance}">
                                <input type="hidden" name="hidden_cust_id[]" value="${id}">
                                <input type="number" name="amount[]" class="form-control field-required amount" id="amount_${id}" required tabindex="2" data-customer_id="${id}">
                            </div>
                        </div>
                        <div class="col-md-6 PB-10">
                            <div class="form-group focused">
                                <label class="control-label mb-10">Remarks </label>
                                <textarea name="comment[]" class="form-control remarks_${id}" rows="6" tabindex="3"></textarea>
                            </div>
                        </div>
                        <div class="col-md-1 PB-10" style="margin-top: 21px;">
                            <a type="button" id="" data-customer_id="${id}" class="btn smBTN red-bg remove remove_btn_${id}" data-index="" data-quantity="">Remove</a>
                        </div>
                    </div>
                `);
               
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
        $('input[name="balance"]').focus().val(balance >= 0 ? balance + ' DR' : (-balance) + ' CR').blur();

        openSidebar();
    });
    $(document).on('click', '.openDataSidebarForEditCustomerLedger', function() {

        $('select option').removeAttr('disabled');
        $('.customer_id').select2();
        $('.add-more').empty();
        $('#saveTransactionForm')[0].reset();
        $('textarea[name="comment"]').val('');
        $('.customers').hide();
        $('.ProductTable').show();
        $('#transactionTable tbody').empty();
        var this_btn = $(this)
        var id            =  this_btn.attr('customer-id');
        var customer_name =  this_btn.attr('customer_name');
        var cr            =  this_btn.attr('cr');
        var dr            =  this_btn.attr('dr');
        var balance       =  this_btn.attr('balance');
        var commit       =  this_btn.attr('commit');
        if(action == operation+'-ledger-jama' &&  cr > 0) {
            balance  =  parseFloat(balance) - parseFloat(cr);
            var amount =  cr ;
        }else{
            balance =  parseFloat(balance) + parseFloat(dr);
            var amount =  dr ;
        }
        $('.add-more').append(`
                <div class="row  remove_div" >
                    <div class="col-md-5 PB-10">
                        <div class="form-group focused">
                            <label class="control-label mb-10">Add Amount *</label>
                            <input type="hidden" name="hidden_cust_balance[]" value="${balance}">
                            <input type="hidden" name="hidden_cust_id[]" value="${id}">
                            <input type="number" name="amount[]" class="form-control field-required amount" id="amount_${id}" required tabindex="2" data-customer_id="${id}" value="${amount}">
                        </div>
                    </div>
                    <div class="col-md-6 PB-10">
                        <div class="form-group focused">
                            <label class="control-label mb-10">Remarks </label>
                            <textarea name="comment[]" class="form-control remarks_${id}" rows="6" tabindex="3">${commit}</textarea>
                        </div>
                    </div>
                    <div class="col-md-1 PB-10" style="margin-top: 21px;">
                        <a type="button" id="" data-customer_id="${id}" class="btn smBTN red-bg remove remove_btn_${id}" data-index="" data-quantity="">Remove</a>
                    </div>
                </div>
            `);
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
        $('.customer_name').text(customer_name+' Details');
        $('input[name="cr"]').focus().val(cr).blur();
        $('input[name="dr"]').focus().val(dr).blur();
        $('input[name="balance"]').focus().val(balance >= 0 ? balance + ' CR' : (-balance) + ' DR').blur();

        openSidebar();
    });
    $("#saveTransaction").on('click', function () {
        var current_action = $(this);
        saveTransaction(current_action, 'save');
        current_action.text('Save')
        // $('#hidden_btn_to_open_modal').click(); 
    });
    function saveTransaction(current_action, type) {
        var dirty = true;
        if (n == 0) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Add at least One Customer.');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        $('.amount').each(function () {
            if (!$(this).val()) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please Add Amount.');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                dirty = false;
                return;
            }
        })
        if (dirty) {
            current_action.text('Processing...')
            current_action.attr('disabled', 'disabled');
            $('#saveTransaction').attr('disabled', 'disabled');
            $('#cancelSubCat').attr('disabled', 'disabled');
            $('#saveTransaction').text('Processing..');
            $('#saveTransactionForm').ajaxSubmit({
                type: "POST",
                url: '/transaction-store',
                cache: false,
                data: {
                    current_url: action,
                },
                success: function (response) {
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

                        }
                        location.reload();
                        $('#saveTransactionForm')[0].reset();
                        console.log($('.voucher_no').val())
                        $('.voucher_no').empty().val(response.voucher)
                        closeSidebar();
                        fetchLedgers();
                        $('#saveTransaction').removeAttr('disabled').text('Save');
                        $('#cancelSubCat').removeAttr('disabled');
                        $('#amount').val('');
                        var msg = 'Transaction Successfully Updated';
                        $('#notifDiv').fadeIn().text(msg).css('background', 'green');

                        setTimeout(() => {
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
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }
                },
                error: function (err) {
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
        $('.customer_name').text(customer_name ?? 'Vendor' + ' Details');
        $('input[name="cr"]').focus().val(cr).blur();
        $('input[name="dr"]').focus().val(dr).blur();
        $('input[name="balance"]').focus().val(balance >= 0 ? balance + ' DR' : (-balance) + ' CR').blur();

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
        success: function (response) {
            $('.body').empty();
            $('.body').append(`
                    <table class="table table-hover dt-responsive nowrap subCatsListTable" style="width:100%;">
                        <thead>
                            <tr>
                                <th>Voucher #</th>
                                <th>Name</th>
                              <!--  <th>Balance</th> --!>
                                <th>Total </th>
                                <th>Remarks</th>
                                <th>Dated</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                    <tbody></tbody>
                    </table>`);
            $('.subCatsListTable tbody').empty();
            var sNo = 1;
            response.customers.forEach((element, key) => {
                var total_cr_dr = 0;
                var voucher = '';
                if (operation == 'vendor') {
                    total_cr_dr = action == 'vendor-ledger-banam' ? element.rec[0].total_dr ?? '0' : element.rec[0].total_cr ?? '0';
                    voucher     = action == 'vendor-ledger-banam' ? element.cpv_no ?? '0' : element.crv_no ?? '0'
                    ledger_balance = element['balance'] >= 0 ? element['balance'] + ' CR' : (-element['balance']) + ' DR'
                }
                $('.subCatsListTable tbody').append(`
                                <tr>
                                    <td>${voucher}</td> 
                                    <td>${element['customer_name']}</td>
                                    <!-- <td class='total_balance'>${ledger_balance}</td> -->
                                    <td>${total_cr_dr}</td>
                                    <td>${element['comment'] ?? 'NA'}</td>
                                    <td>${moment(element['date']).format('D MMM YYYY')}</td> 
                                    <td>
                                    <button  class="btn btn-default btn-line openDataSidebarForEditCustomerLedger ${element.is_editable == 1 ? '' : 'd-none'}"
                                            customer-id="${element['customer_id']}"
                                            customer_name="${element['customer_name']}"
                                            cr="${element['cr']}"
                                            dr="${element['dr']}"
                                            commit="${element['comment'] ?? 'NA'}"
                                            balance="${element['balance']}"
                                    >Edit</button>
                                        <button class="btn btn-default btn-line openDataSidebarForUpdateCustomerLedger"
                                                customer-id="${element['customer_id']}" 
                                                customer_name="${element['customer_name']}" 
                                                cr="${element['cr']}" 
                                                dr="${element['dr']}" 
                                                balance="${element['customer_balance']}" 
                                        >Add Payment</button>
                                    </td>
                                </tr>
                            `); 
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
    var customer_val = $(this).val()
    $('.hidden_balance').val(cust_bal);
    $('.customer_balnce').val(cust_bal)
    $('#customer_id').val($(this).val());
    if (customer_val > 0) {
        n++
        $('.customer_balnce').val(cust_bal)
        $('.add-more').append(` 
        <div class="row  remove_div" >
        <div class="row _head03">
            <div class="col-6"> 
                <h5 class="">${cus_name}</h5>
            </div>
            <div class="col-6" style="text-align:right;"> 
                <span> <strong>Balance</strong> : ${cust_bal  > 0 ? cust_bal  + '<strong> CR</strong>' : cust_bal  + ' <strong>DR</strong>'}</span>
            </div>
         </div> 
           
                <div class="col-md-5 PB-10">
                    <div class="form-group focused">
                        <label class="control-label mb-10">Add Amount *</label>
                        <input type="hidden" name="hidden_cust_balance[]" value="${cust_bal}">
                        <input type="hidden" name="hidden_cust_id[]" value="${customer_val}">
                        <input type="number" name="amount[]" class="form-control field-required amount" id="amount_${customer_val}" required tabindex="2" data-customer_id="${customer_val}">
                    </div>
                </div>
                <div class="col-md-6 PB-10">
                    <div class="form-group focused">
                        <label class="control-label mb-10">Remarks </label>
                        <textarea name="comment[]" class="form-control remarks_${customer_val}" rows="6" tabindex="3"></textarea>
                    </div>
                </div>
                <div class="col-md-1 PB-10" style="margin-top: 21px;">
                    <a type="button" id="" data-customer_id="${customer_val}" class="btn smBTN red-bg remove remove_btn_${customer_val}" data-index="" data-quantity="">Remove</a>
                </div>
            </div>
        `);
        $('.customer_id').children(`option[value="${customer_val}"]`).attr('disabled', true);
        setTimeout(() => {
            $('.customer_id').val('0'); $('.customer_id').select2();
            $(`#amount_${customer_val}`).focus();
        }, 500);

    }

});
$(document).on('click', `.remove`, function () {
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
})
$('.close').on('click', function () {
    $(this).remove();
})
$('#saveTransaction').on('focus', function () {
    $(this).css('background', 'green');
});
$('#saveTransaction').on('blur', function () {
    $(this).css('background', 'linear-gradient(90deg, #152e4d 0%, #152e4d 100%)');
});
$(document).on('click', '.btn-cancel', function () {
    if (n > 0) {
        $('#hidden_btn_to_open_modal').click();
    } else { closeSidebar(); }
})
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

})   