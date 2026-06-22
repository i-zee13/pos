function enableSaleCloseButton(records) {
    $('.sale-close-btn-modal').attr('disabled', true);

    var credit_sale_receivings = records.total_credit_sales_amount_received;
    var credit_return_payments = records.total_credit_sale_returns_amount_received;
    var vendor_payment = records.vendor_payment;
    var customer_payment = records.customer_payment;
    var openning_balance = records.openning_balance;
    var expense = records.expense;
    var total_net_sale_returns_invoice_amount = records.total_net_sale_returns_invoice_amount;
    var total_net_sale_invoice_amount = records.total_net_sale_invoice_amount;
    var total_net_sale_discount = records.total_net_sale_discount;
    var total_pr_paid_amount = records.total_pr_paid_amount;
    var total_pr_invc_amount = records.total_pr_invc_amount;
    var vendor_cash_recovery = records.ttl_vendor_cash_recovery;
    var ttl_cash_recovery = records.ttl_cash_recovery + credit_sale_receivings + vendor_cash_recovery + openning_balance;
    var total_payments = vendor_payment + customer_payment + credit_return_payments + total_pr_paid_amount + total_pr_invc_amount + expense;
    var ttl_in_hand = ((total_net_sale_invoice_amount + ttl_cash_recovery) - total_net_sale_discount - total_payments) - total_net_sale_returns_invoice_amount;

    if (ttl_in_hand > 0) {
        $('.sale-close-btn-modal').removeAttr('disabled');
        $('.sale-close-btn-modal').attr('ttl_in_hand', ttl_in_hand);
    }
}

$(document).on('click', '.sale-close-btn-modal', function () {
    var ttl_in_hand = $(this).attr('ttl_in_hand');
    if (ttl_in_hand > 0) {
        $('.cash_in_hand').val(ttl_in_hand).attr('readonly', true);
        $('.ttl_cash_in_hand').val(ttl_in_hand);
    }
});

$(document).on('input', '.closing_cash', function () {
    var closing_cash = ($(this).val());
    var ttl_cash_in_hand = ($('.ttl_cash_in_hand').val());
    if (closing_cash) {
        if (closing_cash <= ttl_cash_in_hand) {
            $('.cash_in_hand').val(ttl_cash_in_hand - closing_cash);
        } else {
            $('.cash_in_hand').val(ttl_cash_in_hand);
            $(this).val("");
            $('#notifDiv').fadeIn().css('background', 'red').text("Closing cash can't be greater than " + ttl_cash_in_hand);
            $(this).focus();
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
        }
    } else {
        $('.cash_in_hand').val(ttl_cash_in_hand);
    }
});

$(document).on('click', '.sale_open', function () {
    var currentRef = $(this);
    currentRef.text("Processing...");
    currentRef.attr('disabled', true);
    $.ajax({
        type: 'POST',
        url: '/update-closing-cash',
        data: {
            _token: $('[name="csrf_token"]').attr('content'),
            close_date: $('.close_date').val(),
        },
        success: function (response) {
            currentRef.text("Open Sale");
            currentRef.attr('disabled', false);
            if (response.status == "success") {
                $('#notifDiv').fadeIn().css('background', 'green').text("Sale open successfully");
                setTimeout(() => {
                    window.location.reload();
                    $('#notifDiv').fadeOut();
                }, 3000);
                $('.cancel_sale_close_modal').click();
            } else {
                $('#notifDiv').fadeIn().css('background', 'red').text("Sale not open at this moment");
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
        }
    });
});

$(document).on('click', '.sale_close', function () {
    var closing_cash = $('.closing_cash').val();
    if (!closing_cash || closing_cash == "") {
        $('#notifDiv').fadeIn().css('background', 'red').text("Please fill out closing cash");
        $('.closing_cash').focus();
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    var currentRef = $(this);
    currentRef.text("Processing...");
    currentRef.attr('disabled', true);
    $.ajax({
        type: 'POST',
        url: '/save-closing-cash',
        data: {
            _token: $('[name="csrf_token"]').attr('content'),
            close_date: $('.close_date').val(),
            ttl_cash_in_hand: $('.ttl_cash_in_hand').val(),
            closing_cash: $('.closing_cash').val(),
            closing_comment: $('.closing_comment').val(),
        },
        success: function (response) {
            currentRef.text("Close Sale");
            currentRef.attr('disabled', false);
            if (response.status == "success") {
                $('#notifDiv').fadeIn().css('background', 'green').text("Sale close successfully");
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                    window.location.reload();
                }, 3000);
                $('.cancel_sale_close_modal').click();
            } else if (response.closing_cash_null_0) {
                $('#notifDiv').fadeIn().css('background', 'red').text("Closing cash can't be 0 or empty");
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            } else {
                $('#notifDiv').fadeIn().css('background', 'red').text("Sale not close at this moment");
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
        }
    });
});
