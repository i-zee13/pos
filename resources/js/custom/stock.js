import swal from 'sweetalert';

var segments = location.href.split('/');
var queryString = location.search;
let sale_total_amount = 0;
var result = 0;
var product_list = [];
var vendors = [];
var purchased_product_array = [];
var deleteRef = '';
var flag = false;
let previous_payable = 0;
let amount = 0;
let p_name = '';
let qty = '';
let product_id = '';
let new_price = '';
let old_price = '';
let customer_id = 0;
let purchased_total = 0;
let segment = '';
var deleteRef = '';
var expiry_date = '';
let existing_product_ids = [] ;
var p_price = '';
let total_return_qty = 0;
let paid_amount = 0;
let stock_in_hand = '';
let purchase_total_amount = 0;
let vendor_ledger = 0;
let service_charges = 0;
let invoice_discount = 0;
let sale_price = 0;
let data_variable = '';

$(document).ready(function () {
    $('.parent-div').show();
    $('#tblLoader').hide();
    $('#bar-code').focus();
    getProducts();
    if (segments[3] == "stock-add") {
        //
    } else if (segments[3] == 'purchase-edit') {
        var is_removable = true;
        if (queryString.includes('invoice=detail')) {
            is_removable = false;
          } else {
            is_removable = true;
          }
        paid_amount      = $('#hidden_paid_amount').val();
        customer_id      = $('#curren_customer_id').val();
        var invoice_id   = $('#hidden_invoice_id').val();
        vendor_ledger    = JSON.parse($('#customer_ledger').val());
        service_charges  = $('#service_charges').val();
        invoice_discount = $('#invoice_discount').val();
        segment          = segments[3];
        $.ajax({
            url: '/get-purchase-products/' + invoice_id,
            type: 'get',
            success: function (response) {
                console.log(response.products)
                response.products.forEach(function (product) {
                    total_return_qty        += product.return_qty * product.purchase_price;
                    p_name                   = product.product_name;
                    purchase_total_amount   += product.purchased_total_amount;
                    product_id               = product.product_id
                    purchased_product_array.push({
                        'purchase_prod_id'   : `${product.id}`,
                        'product_id'         : `${product.product_id}`,
                        'expiry_date'        : `${product.expiry_date}`,
                        'qty'                : `${product.qty_after_return > 0 ? product.qty_after_return : product.qty}`,
                        'amount'             : `${product.purchased_total_amount}`,
                        'old_price'          : `${product.purchase_price}`,
                        'new_price'          : ``,
                        'prod_discount'      : `${product.product_discount}`,
                        'p_name'             : `${product.product_name}`,
                        'purchase_invoice_id': `${product.purchase_invoice_id}`,
                        'stock_in_hand'      : `${product.stock_in_hand}`,
                        'purchased_price'    : `${product.purchase_price}`,
                        'sale_price'         : `${product.sale_price}`
                    });
                    $('.products').children(`option[value="${product.product_id}"]`).attr('disabled', true);
                })
                $(".products").val('0');
                $(".products").select2();
                $('.show_existing_div').show();
                var x = 0
                purchased_product_array.forEach(function (product, key) {
                    x++;
                    $('#designationsTable tbody').append(`
                        <tr id='tr-${product.product_id}'>
                            <td>${product.product_id}</td>
                            <td colspan="2">${product.p_name}</td>
                            <td ><input type="number" value="${product.old_price}" data-purchase="${product.old_price}" data-stock="${product.stock_in_hand}" class="inputSale price-input add-stock-input td-${product.product_id}"  data-id="${product.product_id}" data-value="${amount}" data-quantity="${product.qty}"  style="font-size: 13px" min="0"></td>
                            <td ><input type="number" value="${product.sale_price}" data-purchase="${product.sale_price}" data-stock="${stock_in_hand}" class="inputSale sale_price_input td-${product_id}"  data-id="${product_id}"   style="font-size: 13px;width:60" min="0"></td>
                             <td><input type="date" value="${product.expiry_date}" class="inputSale expiry_date expiry_input"  data-id="${product.product_id}" style="font-size: 13px;width: 95;" min="0" ></td>
                            <td>
                                <input type="number" value="${product.qty}" data-purchase="${product.old_price}" data-stock="${product.stock_in_hand}"
                                class="inputSale qty-input add-stock-input td-input-qty${product.product_id}"  data-id="${product.product_id}" data-value="${amount}" data-quantity="${product.qty}"
                                style="font-size: 13px" min="0" style=" width: 45;">
                            </td>
                            <td class='purchase-product-amount${product.product_id} add- S-input '>${product.prod_discount}</td>
                             <td class='purchase-product-amount${product.product_id} add- S-input '>${product.amount - product.prod_discount}</td>
                            <td><a type="button" id="${product.product_id}" data-id="${product.purchase_invoice_id}" class="btn smBTN red-bg remove_btn" data-index="" style="${!is_removable ? 'display:none' : ''}">Remove</a></td>
                        </tr>
                    `);
                })
                // $(`#tr-${product.product_id} .qty-input`).trigger('input');
            }
        })

    }
    getvendors();
    $('.add-more-btn').attr('href', '#');
    $('.new_form_field').addClass('required_client');
    $('#client_type').attr('disabled', true);
})

$('#datepicker , #datepicker2').datepicker({
    autoclose: true,
    todayHighlight: true,
    toggleActive: true,
    format: dateFormat
})
.on('changeDate', function (ev) {
    $(this).datepicker('hide');
});
$('.close').on('click', function () {

    $('.new_form_field').removeClass('required_client');
    $('.add-more-btn').attr('href', '#collapseExample');
    $(".add-more-btn").addClass("add_more_client");
    $('#collapseExample').removeClass('show');
    $(".add-more-btn").removeClass("save_client");
    $('.add-more-btn').text('Add More');
    $('.new_form_field').val('');

})
$(document).on('click', '.remove_btn', function () {
    deleteRef = $(this);
    var product_id = $(this).attr('id');
    var purchase_invoice_id = $(this).attr('data-id');
    if (segments[3] == 'purchase-edit') {
        swal({
            title: "Are you sure?",
            // text    : "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    var thisRef = $(this);
                    deleteRef.attr('disabled', 'disabled');
                    deleteRef.text('Processing...');
                    $.ajax({
                        type: 'DELETE',
                        url: '/delete-product-from-invoice',
                        data: {
                            _token: $('meta[name="csrf_token"]').attr('content'),
                            product_id: product_id,
                            purchase_invoice_id: purchase_invoice_id,
                        },
                        success: function (response) {
                            if (response.status == 'success') {
                                $('#notifDiv').fadeIn();
                                $('#notifDiv').css('background', 'green');
                                $('#notifDiv').text('Successfully removed.');
                                setTimeout(() => {
                                    $('#notifDiv').fadeOut();
                                }, 3000);
                                $("#tr-" + product_id).remove();
                                purchased_product_array = purchased_product_array.filter(x => x.product_id != product_id);
                                grandSum(previous_payable);
                            } else {
                                deleteRef.removeAttr('disabled');
                                deleteRef.text('Delete');
                                $('#notifDiv').fadeIn();
                                $('#notifDiv').css('background', 'red');
                                $('#notifDiv').text('Unable to delete at the moment');
                                setTimeout(() => {
                                    $('#notifDiv').fadeOut();
                                }, 3000);
                            }
                        }
                    });
                }
            });
    } else {
        $("#tr-" + product_id).remove();
        purchased_product_array = purchased_product_array.filter(x => x.product_id != product_id);
        $('.products').children('option[value="' + product_id + '"]').attr('disabled', false);
        $(".products").val('0');

        $(".products").select2();

        grandSum(previous_payable);
    } 
})
$('#add-product').on('click', function () {

    var is_in_array = purchased_product_array.filter(x => x.product_id == data_variable);
    if (is_in_array.length > 0) {
        for (var x = 1; x <= qty; x++) {
            is_in_array[0].qty++;
        }
        $('.td-input-qty' + data_variable).val(is_in_array[0].qty).trigger('input');
        $('#tr-' + data_variable).css('background', '#152e4d').addClass('text-white');
        var ss = data_variable
        setTimeout(function () {
            $('#tr-' + ss).css('background', '').removeClass('text-white');
        }, 1500);
    } else {
        if ($('#qty').val() == '') {
            $(this).focus();
            $('#qty').css('border-color', 'red');
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Add Qty for Product');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        } else {
            $('#qty').css('border-color', ''); // Reset the border color
        }
        if ($('.expiry_date').val() == '') { 
        } else {
            expiry_date   = $('.expiry_date').val();
        }
        var prod_discount = $('.discount').val();
        purchased_product_array.push({
            'prod_discount'     : prod_discount ? prod_discount : 0,
            'purchase_prod_id'  : ``,
            'product_id'        : `${product_id}`,
            'expiry_date'       : `${expiry_date}`,
            'qty'               : `${qty}`,
            'amount'            : `${amount}`,
            'new_price'         : `${new_price}`,
            'old_price'         : `${old_price}`,
            'sale_price'        : `${sale_price}`,
            'purchased_price'   : `${new_price ? new_price : old_price}`,
        });
        $('.products').children('option[value="' + product_id + '"]').attr('disabled', true);
        $(".products").val('0');
        $(".products").select2();
        $('.show_existing_div').show();
        var purchased_price = new_price ? new_price : old_price;

        let rowCount = $('#designationsTable tbody tr').length + 1;
        $('#designationsTable tbody').append(`
            <tr id='tr-${product_id}'>
                <td>${product_id}</td>
                <td colspan="2">${p_name}</td>
                <td ><input type="number" value="${purchased_price}" data-purchase="${purchased_price}" data-stock="${stock_in_hand}" class="inputSale price-input add-stock-input td-${product_id}"  data-id="${product_id}" data-value="${amount}" data-quantity="${qty}"  style="font-size: 13px;width:60" min="0"></td>
                <td ><input type="number" value="${sale_price}" data-purchase="${sale_price}" data-stock="${stock_in_hand}" class="inputSale sale_price_input  td-${product_id}"  data-id="${product_id}" data-value="${amount}" data-quantity="${qty}"  style="font-size: 13px;width:60" min="0"></td>
                <td><input type="date" value="${expiry_date}" class="inputSale expiry_date expiry_input"  data-id="${product_id}" style="font-size: 13px;width: 95;"   ></td>

                <td>
                    <input type="number" value="${qty}" data-purchase="${purchased_price}" data-stock="${stock_in_hand}"
                            class="inputSale qty-input add-stock-input td-input-qty${product_id}"  data-id="${product_id}" data-value="${amount}" data-quantity="${qty}"
                            style="font-size: 13px;width: 45;" min="0" >
                </td>
                <td><input type="number" value="${prod_discount}"  class="inputSale discount-input add-stock-input td-${prod_discount}"  data-id="${product_id}"  data-value="${amount}" data-quantity="${qty}"  style="font-size: 13px;width:45" min="0"></td>
                <td class='purchase-product-amount${product_id} add- S-input ' style="width: 60;">${amount - prod_discount}</td>
                <td><button type="button" id="${product_id}" class="btn smBTN red-bg remove_btn" data-index="">Remove</button></td>
            </tr>`
        );
        grandSum(previous_payable);
        $('#purchase_price').val('');
        $('#qty').val('');
        $('#amount').val('');
        $('#bar-code').val('');
        $('.products').val(0).trigger('change');
        $('#new_purchase_price').val('');

        $('#expiry_date').val('');
        p_name = '';
    }
    $('.purchase_price').val('');
    $('#qty').val('');
    $('#amount').val('');
    $('#bar-code').val('');
    $('.products').val(0).trigger('change');
    $('#new_purchase_price').val('');
    $('#retail_price').val('');
    $('#discount').val('');
    $('#bar-code').focus();
    qty             = '';
    data_variable   = '';
    $('.retail_price').text(0.0);
    $('.pp').text(0.0);

    $('.stock_balance').text(0);
    // $('#purchse-form')[0].reset();
})
$(document).on('focusout', '.bar-code', function () {
    data_variable = $(this).val();
    $('.purchase_price').val('');
    $('#product-name').val('');
    $('#qty').val('');
    $('#amount').val('');
    if (data_variable != '') {
        var filter_product = product_list.filter(x => (x.barcode == data_variable) || (x.id == data_variable));
        if (filter_product.length > 0) {
            $('#products').val(filter_product[0].id).trigger('change');
            // $('.retail_price').text(filter_product[0].sale_price);
            $('.purchase_price').val(filter_product[0].old_purchase_price);
            $('.stock_balance').text(filter_product[0].stock_balance);
            $('#new_sale_price').val(filter_product[0].sale_price) 
            p_name = filter_product[0].product_name;
            product_id = filter_product[0].id;
            retail_price = filter_product[0].sale_price; 
        } else {
            $('#products').val('0').trigger('change');
            $('#retail_price').val('');
            $('#expiry_date ').val('');
            if (data_variable) {
                $('#notifDiv').fadeIn().css('background', 'red').text('Product Not Found');
                // $('.bar-code').focus();
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000)
            }

        }
    }
    return 0;

}); 
$('#qty').on('input', function () {
    new_price = $('#new_purchase_price').val();
    old_price = $('#purchase_price').val();
    qty = $(this).val();
    var purchase_price = $('#purchase_price').val();
    if (new_price > 0) {
        amount = qty * new_price;
    } else {
        amount = qty * purchase_price;
    }
    $('#amount').val(amount);
})
 
$("#save").on('click', function () {
    var current_action = $(this);
    saleSave(current_action,'save');
    current_action.text('Save')

});
$("#print-invoice").on('click',function(){
    var current_action = $(this);
    saleSave(current_action,'print');
    current_action.text('Print')
})
function saleSave(current_action,type){
    let dirty = false;
    var grand_total  = $('.grand-total').text();
    if (purchased_product_array.length < 1) {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please Add Minimum 01 Product');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    $('.required').each(function () {
        if (!$(this).val() || $(this).val() == 0) {
            // console.log($(this).val())
            dirty = true;
        }
    });
    if($('#customer_id').val() == 0){
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please select Customer first (*)');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    if (dirty) {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please provide all the required information (*)');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }

    let hasEmptyQty = false;

    purchased_product_array.forEach(data => {
        console.log(data)
        var qtyInput = $(`.td-input-qty${data.product_id}`);
        if (qtyInput.val().trim() === '' || qtyInput.val().trim() === '0') {
            qtyInput.css('border-color','red');
            qtyInput.focus();
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Qty Should not be Empty or Zero');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000)
            hasEmptyQty = true;
            return false;
        }
    });
    if (hasEmptyQty) {
        return;
    }
    if($('.amount_pay_input').val() == ''){
        $('.amount_pay_input').focus();
        $('.amount_pay_input').css('border-color', 'red');
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Amount Pay is required.');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000)
        return;
    }

    if (purchased_product_array.length < 1) {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please Add Minimum 01 Product');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    if($('#invoice_type').val() == '1' && ($('.amount_received').val() == '' || parseInt($('.amount_received').val()) < parseInt($('.amount_pay_input').val()))){
        $('.amount_received').focus();
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Paid amount can not less then total invoice amount');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }

    current_action.text('Processing...')
    current_action.attr('disabled', 'disabled');
    $('.btn-cancel').attr('disabled', 'disabled');
    // $('#print-invoice').attr('disabled', 'disabled');
    $('#save').attr('disabled', 'disabled');
    $('#form').ajaxSubmit({
        url     : '/add-purchase-invoice',
        type    : 'post',
        data    : {
                    'cash_return'               :   $('.cash_return').text(),
                    'description'               :   $('#description').val(),
                    'service_charges'           :   $('.service_charges_input').val(),
                    'grand_total'               :   $('.grand-total').text(),
                    'purchased_total'           :   purchased_total,
                    'status'                    :   2, //status
                    'purchased_product_array'   :   purchased_product_array,
                    'existing_product_ids'      :   existing_product_ids
            },
        success: function (response) {
            if ("success") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Added successfully');
                var received_amount = $('.amount_received').val().trim();
                    received_amount = received_amount ? received_amount : 0 ;
                if(type == 'print'){
                    var printWindow    = window.open("/print-purchase-invoice/" + response.invoice_id + '/' + response.customer_id + '/' + received_amount);
                    printWindow.onload = function() {
                    printWindow.print();
                    };
                    // setTimeout(() => {
                    //     window.location.reload();
                    //     },1000);
                }
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                    window.location     = "/stock-add";
                }, 1500);
                // $('#form')[0].reset();
                // $('#client_type').val(0).trigger('change');
                // $('.formselect').select2();

            }else{
                current_action.removeAttr('disabled');
                $('.btn-cancel').removeAttr('disabled');
                $('#print-invoice').removeAttr('disabled');
            }
        },
        error: function (e) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Failed to save at the moment');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);

            current_action.removeAttr('disabled');;
            $('.btn-cancel').removeAttr('disabled');
            $('#save').attr('disabled', 'disabled');
            current_action.text('Save')
        }
    })
}
$(document).on('input', '.qty-input', function () {

    var update_qty          = $(this).val();
    var current_product_id  = $(this).attr('data-id');
    var product_amount      = $(this).attr('data-value')
    var current_product_price = 0;
    var new_amount_of_purchase_product = 0;
    purchased_product_array.filter(function (data) {
        if (data.product_id == current_product_id) {
            data.qty = update_qty;
        }
        if (data.new_price != '') {
            p_price = data.new_price
        } else {
            p_price = data.old_price
        }
        if (data.product_id == current_product_id) {
            current_product_price = p_price;
            new_amount_of_purchase_product = update_qty * current_product_price;
            data.amount = new_amount_of_purchase_product;
            $(`.purchase-product-amount${current_product_id}`).empty();
            $(`.purchase-product-amount${current_product_id}`).text(new_amount_of_purchase_product)
        }
    })
    grandSum(previous_payable);

})
$(document).on('input', '.expiry_input', function () {
    var update_date          = $(this).val();
    var current_product_id   = $(this).attr('data-id');
    purchased_product_array.filter(function (data) {
        if (data.product_id == current_product_id) {
            data.expiry_date = update_date;
        }
    })
})

$(document).on('input', '.sale_price_input', function () {
    var update_price          = $(this).val();
    var current_product_id   = $(this).attr('data-id');
    purchased_product_array.filter(function (data) {
        if (data.product_id == current_product_id) {
            data.sale_price = update_price;
        }
    })
})
function getProducts() {
    $("#products").empty();
    $.ajax({
        url: `/get-products`,
        type: 'get',
        success: function (response) {
            $("#products").append(`<option value="0">Select Product</option>`)
            response.data.forEach(data => {
                $("#products").append(`<option value="${data.id}" data-name="${data.product_name}">${data.product_name}</option>`)
                product_list.push(data);
            });
        }
    })
}
function getvendors() {
    $("#customer_id").empty();
    $.ajax({
        url: `/get-vendors`,
        type: 'get',
        success: function (response) {
            $("#customer_id").append(`<option value="0">Select Vendor</option>`)
            response.customers.forEach(data => {
                $("#customer_id").append(`<option value="${data.id}" data-name="${data.customer_name}" ${data.id == customer_id ? 'seleced' : ''}>${data.id} - ${data.customer_name}</option>`)
                vendors.push(data);
            });
            $("#customer_id").val(customer_id).trigger('change');
        }
    })
}
$('.customer_id').change(function () {
    var total_paid_for_net_sale = 0;
    if($(this).val()==7){
        // $('#invoice_type').val('1').trigger('change');
        purchased_product_array.forEach(function (data, key) {
            total_paid_for_net_sale += parseFloat(data.amount)
        });
        $('#invoice_type').val('1').trigger('change');
        $('.cash_return_tr').show();
        $('.previous_payable_tr').hide();
    }else{
        $('#invoice_type').val('2').trigger('change');
        $('.previous_payable_tr').show();
        $('.cash_return_tr').hide();

    }
    $('.amount_pay_input').val(total_paid_for_net_sale);
    var selected_index = $(this).val();
    if (selected_index > 0) {
        $.ajax({
            url: '/get-vendor-balance/' + selected_index,
            type: 'get',
            data: {
                segment: segment
            },
            success: function (response) {
                previous_payable          = response.customer_balance;
                $('#previous_receivable').val(previous_payable);
                var previous_payable_text = previous_payable >= 0 ? previous_payable + " CR" : previous_payable < 0  ? (-previous_payable) + " DR" : previous_payable;
                $('.previous_payable_heading').empty();
                $('.previous_payable_heading').text(previous_payable >= 0 ? 'Previous Receivable' : 'Previous Payable');
                $('.previous_payable').text(previous_payable_text);
                $('.previous_payable').val(previous_payable);
                grandSum(previous_payable,service_charges,invoice_discount)
                if (segments[3] == "purchase-edit") {
                    $('.paid_amount').text(customer_ledger['cr']);

                    // $('.remaning_amount').val(customer_ledger['balance'])
                }

                // if (segments[3] == 'purchase-edit') {
                //     if (vendor_ledger['return_invoice_id'] > 0) {
                //         previous_payable = vendor_ledger['balance'] + vendor_ledger['dr'] - purchase_total_amount
                //     } else {
                //         previous_payable = vendor_ledger['balance'] + vendor_ledger['dr'] - vendor_ledger['cr'];
                //     }
                // } else {
                //     previous_payable = response.customer_balance;
                // }
                // var previous_payable_text = previous_payable > 0 ? previous_payable + " CR" : previous_payable < 0 ? (-previous_payable) + " DR" : previous_payable;
                // $('.previous_payable').text(previous_payable_text);
                // $('.previous_payable').val(previous_payable);
                // $('.paid_amount').text(vendor_ledger['dr']);
                // console.log(vendor_ledger['balance'])
                // $('.remaning_amount').val(vendor_ledger['balance'])
                // grandSum(previous_payable)
                // $('.display').css('display', '');
            }
        })
        vendors.filter(x => x.id == selected_index)
    }
})
$('.products').change(function () {
    var selected_product = $(this).val();
    $('.purchase_price').val('');
    $('#product-name').val('');
    $('#new_purchase_price').val('');
    $('#qty').val('');
    $('#discount').val('');
    $('.bar-code').val('');
    $('#amount').val('');
    if (selected_product > 0) {
        var filter_product = product_list.filter(x => x.id == selected_product)
        console.log(filter_product);
        $('.retail_price').text(filter_product[0].sale_price);
        if (filter_product[0].new_purchase_price > 0) {
            $('.purchase_price').val(filter_product[0].new_purchase_price);
        } else {
            $('.purchase_price').val(filter_product[0].old_purchase_price);
        }
        $('.stock_balance').text(filter_product[0].stock_balance);
        p_name          = filter_product[0].product_name;
        product_id      = filter_product[0].id;
        stock_in_hand   = filter_product[0].stock_balance; 
        sale_price   = filter_product[0].sale_price; 

        $('#new_sale_price').val(filter_product[0].sale_price) 
        $('#expiry_date').val(filter_product[0].expiry_date)
        $('.bar-code').val(filter_product[0].barcode);
    }

}); 
$(document).on('input', '.price-input', function () { 
    $('.amount_received').val($('.paid_amount').text());
    setTimeout(() => {
        $('.amount_received').trigger('input');
    }, 500);
    var retail_price        = $(this).val();
    var current_product_id  = $(this).attr('data-id');
    var current_product_qty = $(`#tr-${current_product_id}`).find('.qty-input').val();
    var new_amount_of_sale_product = 0;

    $(`.purchase-product-amount${current_product_id}`).empty();
    purchased_product_array.filter(function (data) {
        if (data.product_id == current_product_id) {
            data.qty            = current_product_qty
            new_amount_of_sale_product = current_product_qty * retail_price;
            data.amount         = new_amount_of_sale_product - data.prod_discount;
            data.retail_price   = retail_price;
            getStockRetail(data.product_id)
            $(`.purchase-product-amount${current_product_id}`).text(data.amount)
            grandSum(previous_payable, service_charges);
        }
    })

})
function getStockRetail(p_id){
    var filter_product = product_list.filter(x => x.id == p_id)

    $('.retail_price').text(filter_product[0].sale_price);

    $('#retail_price').val(filter_product[0].sale_price);

    $('.stock_balance').text(filter_product[0].stock_balance);
    if(filter_product[0].new_purchase_price > 0){
        $('.pp').text(filter_product[0].new_purchase_price);
    }else{
        $('.pp').text(filter_product[0].old_purchase_price);
    }

}
$(document).on('input', '.discount-input', function () {
    var p_discount = $(this).val();
    var current_product_id = $(this).attr('data-id');
    var current_product_qty = $(`#tr-${current_product_id}`).find('.qty-input').val();
    var new_amount_of_sale_product = 0;
    console.log(current_product_qty)
    $('.amount_received').val($('.paid_amount').text());
    setTimeout(() => {
        $('.amount_received').trigger('input');
    }, 500);
    $(`.purchase-product-amount${current_product_id}`).empty();
    purchased_product_array.filter(function (data) {
        console.log(data);
        if (data.product_id == current_product_id) {
            data.prod_discount = p_discount;
            data.qty = current_product_qty;
            new_amount_of_sale_product = (current_product_qty * (data.new_price ? data.new_price : data.old_price)) - p_discount;
            data.amount = new_amount_of_sale_product;
            $(`.purchase-product-amount${current_product_id}`).text(data.amount)
            grandSum(previous_payable, service_charges);
        }
    })
})
$('#invoice_discount').on('input', function () {
    var service = 0;
    invoice_discount = $(this).val();
    $('.amount_received').val($('.paid_amount').text());
    
    grandSum(previous_payable, service_charges, $(this).val());
})
$('.service_charges_input').on('input', function () {
    service_charges = $(this).val();
    grandSum(previous_payable, $(this).val());
})
$(document).on('input','.amount_received',function(){
    if($(this).val()){
        result = $(this).val() - $('.amount_pay_input').val();
       $('.cash_return').text(result)
    }
})
function grandSum(previous_payable = 0, service_charges = 0, discount = 0) {
    var sum = 0;
    purchased_product_array.forEach(function (data, key) {
        sum += parseFloat(data.amount)
    });
    $('.product_net_total').val(sum);
    // sale_total_amount = sum-invoice_discount;
    sum += parseFloat(previous_payable ? previous_payable : 0);
    sum += parseFloat(service_charges ? service_charges : 0);
    sale_total_amount = sum - invoice_discount; 
    $('.grand-total').text(sale_total_amount - $('.paid_amount').text());
    $('.amount_pay_input').val(sale_total_amount - $('.paid_amount').text()); 
    purchased_total = sum;
    if (parseFloat($('.amount_pay_input').val()) < 0) {
        $('.th-hide').hide();
        $('.cash-return').text('Cash Return');
    } else {
        $('.th-hide').show();
        $('.cash-return').text('Cash Received');
    } 
    setTimeout(() => {
        $('.amount_received').trigger('input');
    }, 500);
}
$(document).on('mouseenter', '.show_purchase', function() {
    $('.pp').show();
    }).on('mouseleave', '.show_purchase', function() {
        $('.pp').hide();
      });
