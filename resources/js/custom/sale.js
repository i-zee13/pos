import { filter, update } from 'lodash';
import swal from 'sweetalert';

var segments = location.href.split('/');
var queryString = location.search;

var invalidSave = [];
var result = 0;
var product_list = [];
var vendors = [];
var sales_product_array = [];
var deleteRef = '';
var flag = false;
let previous_payable = 0;
let amount = 0;
let p_name = '';
let qty = '';
let product_id = '';
let purchased_price = '';
let customer_id = 0;
let sale_total_amount = 0;
let segment = '';
var deleteRef = '';
var expiry_date = '';
let retail_price  = 0;
var p_price = '';
let stock_in_hand = '';
let stock_products = '' ;
let customer_ledger = '' ;
let existing_product_ids = [] ;
let service_charges = 0;
let invoice_discount = 0;
let previous_paid = 0;
let data_variable  = '';
$(document).ready(function () {

    $('.parent-div').show();
    $('#tblLoader').hide();
    $('#bar-code').focus();
    stock_products    = JSON.parse($('#stock_products').val());
    customer_ledger   = JSON.parse($('#customer_ledger').val());
    getProducts();
    $('.display').show();
    if (segments[3] == "stock-add") {

        setTimeout(() => {
            $('#customer_id').val('8').trigger('change');
        }, 2000);

        //

    } else if (segments[3] == 'sale-edit') {
        var is_removable = true;
        if (queryString.includes('invoice=detail')) {
            is_removable = false;
          } else {
            is_removable = true;
          }
        customer_id      = $('#curren_customer_id').val();
        var invoice_id   = $('#hidden_invoice_id').val();
        service_charges  = $('#service_charges').val();
        invoice_discount = $('#invoice_discount').val();
        segment          = segments[3];
        $.ajax({
            url: '/get-sale-products/' + invoice_id,
            type: 'get',
            success: function (response) {
                response.products.forEach(function (product) {
                    existing_product_ids.push(product.product_id);
                    p_name = product.product_name;
                    sales_product_array.push({
                        'sale_prod_id'       : `${product.id}`,
                        'product_id'         : `${product.product_id}`,
                        'prod_discount'      : `${product.product_discount}`,
                        'expiry_date'        : `${product.expiry_date}`,
                        'qty'                : `${product.qty}`,
                        'amount'             : `${product.sale_total_amount}`,
                        'retail_price'       : `${product.sale_price}`,
                        'stock_in_hand'      : `${product.stock_in_hand}`,
                        'purchased_price'    : `${product.purchase_price}`,
                        'p_name'             : `${product.product_name}`,
                        'sale_invoice_id'    : `${product.sale_invoice_id}`,
                    });
                // $('.products').children(`option[value="${product.product_id}"]`).attr('disabled', true);
                })
                // $(".products").val('0');
                // $(".products").select2();
                $('.display').show();
                $('.show_existing_div').show();
                var x=0
                sales_product_array.forEach(function(product,key){
                    // console.log(product)
                    x++;
                     $('#designationsTable tbody').append(`
                        <tr id='tr-${product.product_id}'>
                            <td>${product.product_id}</td>
                            <td>${product.p_name}</td>
                            <td><input type="number" value="${product.qty}"  data-retail="${product.retail_price}" data-purchase="${product.purchased_price}" data-stock="${product.stock_in_hand}" class="inputSale qty-input add-stock-input td-input-qty${product.product_id}" data-id="${product.product_id}" data-value="${product.amount}" data-quantity="${product.qty}"  min="0"></td>
                            <td><input type="number" value="${product.retail_price}"  data-retail="${product.retail_price}" data-purchase="${product.purchased_price}" data-stock="${product.stock_in_hand}" class="inputSale price-input add-stock-input td-${product.product_id}"  data-id="${product.product_id}" data-value="${product.amount}" data-quantity="${product.qty}"  min="0"></td>
                            <td><input type="number" value="${product.prod_discount}"  class="inputSale discount-input add-stock-input td-${product.product_id}"  data-id="${product.product_id}" data-value="${product.amount}" data-quantity="${product.qty}"  style="font-size: 13px" min="0"></td>
                            <td class='purchase-product-amount${product.product_id} add- S-input '>${product.amount}</td>
                            <td><a type="button" id="${product.product_id}" data-id="${product.sale_invoice_id}" class="btn smBTN red-bg remove_btn" data-index="" data-quantity="${product.qty}" style="${!is_removable ? 'display:none' : ''}">Remove</a></td>
                        `);
                })
            }
        })
    }
    getvendors();
    $('.add-more-btn').attr('href', '#');
    $('.new_form_field').addClass('required_client');
})
$('#add-product').on('click', function () {
    var is_in_array = sales_product_array.filter(x => x.product_id == data_variable);
    if(is_in_array.length > 0){
        for(var x =1 ; x <= qty ; x++){
            is_in_array[0].qty++;
        }
        // $('.qty-input').val(sales_product_array[0].qty);
        $('.td-input-qty' + data_variable).val(is_in_array[0].qty).trigger('input');
        $('#tr-'+ data_variable).css('background','#152e4d').addClass('text-white');
      var ss = data_variable
        setTimeout(function() {
            $('#tr-' + ss).css('background', '').removeClass('text-white');
          }, 1500);
    }else{
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
        var prod_discount = $('#discount').val();
        expiry_date       = $('.expiry_date').val();
        sales_product_array.push({
            'sale_prod_id'    :   '',
            'prod_discount'   :   prod_discount ? prod_discount: 0,
            'product_id'      :  `${product_id}`,
            'expiry_date'     :  `${expiry_date}`,
            'qty'             :  `${qty}`,
            'amount'          :  `${amount-prod_discount}`,
            'retail_price'    :  `${retail_price}`,
            'stock_in_hand'   :   stock_in_hand,
            'purchased_price' :   purchased_price,

        });
        $('.amount_received').val($('.paid_amount').text());
        setTimeout(() => {
            $('.amount_received').trigger('input');
        }, 500);
        // $('.products').children('option[value="' + product_id + '"]').attr('disabled', true);
        // $(".products").val('0');
        // $(".products").select2();
        let rowCount = $('#designationsTable tbody tr').length + 1;
        $('#designationsTable tbody').append(`
                <tr id='tr-${product_id}'>
                    <td>${product_id}</td>
                    <td>${p_name}</td>
                    <td><input type="number" value="${qty}"  data-retail="${retail_price}" data-purchase="${purchased_price}" data-stock="${stock_in_hand}"  class="inputSale qty-input add-stock-input td-input-qty${product_id}"  data-id="${product_id}" data-value="${amount}" data-quantity="${qty}"  style="font-size: 13px" min="0"></td>
                    <td><input type="number" value="${retail_price}" data-retail="${retail_price}" data-purchase="${purchased_price}" data-stock="${stock_in_hand}" class="inputSale price-input add-stock-input td-${product_id}"  data-id="${product_id}" data-value="${amount}" data-quantity="${qty}"  style="font-size: 13px" min="0"></td>
                    <td><input type="number" value="${prod_discount}"  class="inputSale discount-input add-stock-input td-${prod_discount}"  data-id="${product_id}" data-value="${amount}" data-quantity="${qty}"  style="font-size: 13px" min="0"></td>
                    <td class='purchase-product-amount${product_id} add- S-input ' >${amount-prod_discount}</td>
                    <td><button type="button" id="${product_id}" class="btn smBTN red-bg remove_btn" data-index="" data-quantity="${qty}">Remove</button></td>
                    </tr>`
                    );
        grandSum(previous_payable,service_charges);
        $('.show_existing_div').show()



        // var invoice_type = $('#invoice_type').val();
        // $('#invoice_type').val(invoice_type).trigger('change');
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
    data_variable = '';
    qty = '';
    $('.retail_price').text(0.0);
    $('.pp').text(0.0);

    $('.stock_balance').text(0);

});

// $('#invoice_type').change(function(){
//     if($(this).val()==1){
//         $('#customer_id').removeClass('required')
//         $('#customer_id').val('8').trigger('change');
//     }else{
//         $('#customer_id').addClass('required')
//         $('#customer_id').val('0').trigger('change');
//     }
//     var total_paid_for_net_sale = 0;
//     if($(this).val() == '1'){
//         sales_product_array.forEach(function (data, key) {
//             total_paid_for_net_sale += parseFloat(data.amount)
//         });
//     }
//     $('.amount_pay_input').val(total_paid_for_net_sale);
// });
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
    $('#new_marital_status').val(0).trigger('change');
    $('#new_employment_status').val(0).trigger('change');
    $('#new_residence_status').val(0).trigger('change');
})
$(document).on('click', '.remove_btn', function () {
    deleteRef = $(this);
    var product_id      =  $(this).attr('id');
    var sale_invoice_id =  $(this).attr('data-id');
    var q               =  $(this).attr('data-quantity');
     if(segments[3] == 'sale-edit' && sale_invoice_id != undefined){
        swal({
            title   : "Are you sure?",
            icon    : "warning",
            buttons : true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                var thisRef = $(this);
                deleteRef.attr('disabled', 'disabled');
                deleteRef.text('Processing...');
                $.ajax({
                    type: 'DELETE',
                    url: '/delete-product-from-sale',
                    data: {
                        _token: $('meta[name="csrf_token"]').attr('content'),
                        product_id: product_id,
                        sale_invoice_id: sale_invoice_id,
                        qty: q
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
                            sales_product_array = sales_product_array.filter(x => x.product_id != product_id);
                            grandSum(previous_payable,service_charges);
                            var filter_product = product_list.filter(x => x.id == product_id);
                            filter_product[0].stock_balance = response.updated_stock;
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
    }else{

        $("#tr-" + product_id).remove();
        sales_product_array = sales_product_array.filter(x => x.product_id != product_id);
        // $('.products').children('option[value="' + product_id + '"]').attr('disabled', false);
        // $(".products").val('0');

        // $(".products").select2();
        $('.amount_received').val($('.paid_amount').text());
        setTimeout(() => {
            $('.amount_received').trigger('input');
        }, 500);
        grandSum(previous_payable,service_charges);
    }
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
$('.products').change(function () {
    var selected_product = $(this).val();
    data_variable = $(this).val();
    $('.purchase_price').val('');
    $('#product-name').val('');
    $('#qty').val('');
    $('.bar-code').val('');
    $('#amount').val('');
    if(selected_product > 0){
        var filter_product = product_list.filter(x => x.id == selected_product)
        $('.retail_price').text(filter_product[0].sale_price);
        if(filter_product[0].new_purchase_price > 0){
            $('.pp').text(filter_product[0].new_purchase_price);
            $('.purchase_price').val(filter_product[0].new_purchase_price);
        }else{
            $('.pp').text(filter_product[0].old_purchase_price);
            $('.purchase_price').val(filter_product[0].old_purchase_price);
        }
        $('#retail_price').val(filter_product[0].sale_price);

        $('.stock_balance').text(filter_product[0].stock_balance);
        p_name          = filter_product[0].product_name;
        product_id      = filter_product[0].id;
        stock_in_hand   = filter_product[0].stock_balance;
        purchased_price = filter_product[0].old_purchase_price;
        $('.expiry_date').val(filter_product[0].expiry_date)
        $('.bar-code').val(filter_product[0].barcode);

    }

});
$(document).on('focusout', '.bar-code', function () {
    data_variable = $(this).val();
    $('.purchase_price').val('');
    $('#product-name').val('');
    $('#qty').val('');
    $('#amount').val('');
    if(data_variable != ''){
        var filter_product = product_list.filter(x => (x.barcode == data_variable) || (x.id == data_variable));
        if(filter_product.length > 0){
            $('#products').val(filter_product[0].id).trigger('change');
            // $('.retail_price').text(filter_product[0].sale_price);
            $('.purchase_price').val(filter_product[0].old_purchase_price);
            $('.stock_balance').text(filter_product[0].stock_balance);
            p_name      = filter_product[0].product_name;
            product_id  = filter_product[0].id;
        }else{
            $('#products').val('0').trigger('change');
            $('#retail_price').val('');
            $('.expiry_date ').val('');
            if(data_variable){
                $('#notifDiv').fadeIn().css('background', 'red').text('Product Not Found');
            // $('.bar-code').focus();
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000)
            }

        }
    }
        return 0 ;

});

$('#qty').on('input', function () {
    qty          = $(this).val();
    if(qty > stock_in_hand){
        $(this).val('')
        $('#qty').css('border-color', 'red');
        $(this).focus();
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Qty should be less then '+stock_in_hand);
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    productRetailAmount();

});
$("#save").on('click', function () {
    var current_action = $(this);
    saleSave(current_action,'save');
    current_action.text('Save')
    // $('#hidden_btn_to_open_modal').click();
});
$('.save_status').on('click',function(){
    var if_print     = $(this).attr('btn-value');
    var ser_chargses = $('.service_charges_input').val();
    var grand_total  = $('.grand-total').text();
    var status       = $('input[name="radio_status"]:checked').val();
    $(this).attr('disabled', 'disabled');
    $(this).text('Processing..');
});
$("#print-invoice").on('click',function(){
    var current_action = $(this);
    saleSave(current_action,'print');
    current_action.text('Print')
})
function saleSave(current_action,type){
    let dirty = false;
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
    if(sales_product_array.length == 0){
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please add at least one Product.');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000)
        return;
    }
    let hasEmptyQty = false;

    sales_product_array.forEach(data => {
        const qtyInput = $(`.td-input-qty${data.product_id}`);
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

    if (sales_product_array.length < 1) {
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
        $('#notifDiv').text('Received amount can not less then total invoice amount');
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
        url  : '/add-sale-invoice',
        type : 'post',
        data : {
                'cash_return'        :  result,
                'service_charges'    :  $('.service_charges_input').val(),
                'grand_total'        :  $('.grand-total').text(),
                'sale_total_amount'  :  sale_total_amount,
                'status'             :  1, //status
                'sales_product_array':  sales_product_array,
                'existing_product_ids': existing_product_ids
            },
        success: function (response) {

            if ("success") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Added successfully');
                var received_amount = $('.amount_received').val().trim();
                    received_amount = received_amount ? received_amount : 0 ;
                if(type == 'print'){
                    var printWindow    = window.open("/print-sale-invoice/" + response.invoice_id + '/' + response.customer_id + '/' + received_amount);
                    printWindow.onload = function() {
                    printWindow.print();
                    };
                    // setTimeout(() => {
                    //     window.location.reload();
                    //     },1000);
                }
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                    window.location     = "/sale-add";
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
$('.save_status').on('click',function(){
    var if_print     = $(this).attr('btn-value');
    var ser_chargses = $('.service_charges_input').val();
    var grand_total  = $('.grand-total').text();
    var status       = $('input[name="radio_status"]:checked').val();
    $(this).attr('disabled', 'disabled');
    $(this).text('Processing..');
    $('#form').ajaxSubmit({
        url  : '/add-sale-invoice',
        type : 'post',
        data : {
                'service_charges'    :  $('.service_charges_input').val(),
                'invoice_discount'   :  $('.invoice_discount').val(),
                'grand_total'        :  $('.grand-total').text(),
                'sale_total_amount'  :  sale_total_amount,
                'status'             :  1, //status
                'sales_product_array':  sales_product_array,
                'existing_product_ids': existing_product_ids
            },
        success: function (response) {
            current_action.removeAttr('disabled');
            $('.btn-cancel').removeAttr('disabled');
            if ("success") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Added successfully');
                 var received_amount = $('.amount_received').val().trim();
                if(type == 'print'){
                    window.open("/print-sale-invoice/"+response.invoice_id+'/'+response.customer_id+'/'+received_amount).print();
                }
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                   if(type == 'print'){
                    // var printContent        = $('.printdiv').html();
                        // var originalContent     = document.body.innerHTML;
                        // document.body.innerHTML = printContent;
                        // window.print();
                        // document.body.innerHTML = originalContent;
                        // console.log(received_amount);
                        // window.location     = "/print-sale-invoice/"+response.invoice_id+'/'+response.customer_id+'/'+received_amount;
                    }else{
                        window.location     = "/sale-add";
                    }
                }, 1500);
                vendors = [];
                $('#form')[0].reset();
                $('#client_type').val(0).trigger('change');
                $('.formselect').select2();

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
            $('#save').text('Save');

        }
    })
})
$(document).on('input', '.qty-input', function () {

    var update_qty            = $(this).val();
    var current_product_id    = $(this).attr('data-id');
    var current_product_qty   = '';
    var product_amount        = $(this).attr('data-value')
    var current_product_price = 0;
    $('.amount_received').val($('.paid_amount').text());
    setTimeout(() => {
        $('.amount_received').trigger('input');
    }, 500);

    var new_amount_of_purchase_product = 0;
    if(update_qty < 0){
        $(this).val('')
        $(this).css('border-color', 'red');
        $(this).focus();
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Qty should be greater then 0.');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    $(`.purchase-product-amount${current_product_id}`).empty();
    sales_product_array.filter(function (data) {
        if (data.product_id      == current_product_id) {
            p_price               = data.retail_price
            data.qty              = update_qty;
            current_product_qty   = data.stock_in_hand;
            current_product_price = p_price;
            if(parseInt(update_qty) > parseInt(current_product_qty)){
                // update_qty      = update_qty.replace(update_qty, current_product_qty)
                $(`.td-input-qty${current_product_id}`).val(current_product_qty).css('border-color', 'red').focus();
                $('#notifDiv').fadeIn().css('background', 'red').text('Qty should be less then '+current_product_qty);
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                $('.grand-total').text('0');
                return;
            }else{

                $(`.td-input-qty${current_product_id}`).css('border-color', '#dddddd');
                new_amount_of_purchase_product = update_qty * current_product_price;
                data.amount      = new_amount_of_purchase_product-data.prod_discount;
                var invoice_type = $('#invoice_type').val();
                // $('#invoice_type').val(invoice_type).trigger('change');
                $(`.purchase-product-amount${current_product_id}`).text(data.amount)
                getStockRetail(data.product_id)
                grandSum(previous_payable,service_charges,invoice_discount);
            }
        }
    })

})
$('body').on('click', '.ProductTable tr', function() {

    var htmlContent = $(this).html();
    var r_price     = $(this).find('td input').data('retail');
    var stock       = $(this).find('td input').data('stock');
    var purchase    = $(this).find('td input').data('purchase');

    $('.retail_price').text(r_price);
    $('.pp').text(purchase);

    $('.stock_balance').text(stock);
  });
// $('body').on('mouseleave', '.ProductTable tr', function() {
// $('.retail_price').text(0);
// $('.stock_balance').text(0);
// });

$(document).on('input', '.price-input', function () {
    $('.amount_received').val($('.paid_amount').text());
    setTimeout(() => {
        $('.amount_received').trigger('input');
    }, 500);
    var retail_price          = $(this).val();
    var current_product_id    = $(this).attr('data-id');
    var current_product_qty   = $(`#tr-${current_product_id}`).find('.qty-input').val();
    var new_amount_of_sale_product = 0;

    $(`.purchase-product-amount${current_product_id}`).empty();
    sales_product_array.filter(function (data) {
        if (data.product_id      == current_product_id) {
            data.retail_price    = retail_price;
            data.qty = current_product_qty
                new_amount_of_sale_product = current_product_qty * retail_price;
                data.amount = new_amount_of_sale_product-data.prod_discount;
                getStockRetail(data.product_id)
                $(`.purchase-product-amount${current_product_id}`).text(data.amount)
                grandSum(previous_payable,service_charges);
        }
    })

})
$(document).on('input', '.discount-input', function () {
    var p_discount            = $(this).val();
    var current_product_id    = $(this).attr('data-id');
    var current_product_qty   = $(`#tr-${current_product_id}`).find('.qty-input').val();
    var current_product_qty   = $(`#tr-${current_product_id}`).find('.qty-input').val();
    var new_amount_of_sale_product = 0;
    $('.amount_received').val($('.paid_amount').text());
    setTimeout(() => {
        $('.amount_received').trigger('input');
    }, 500);
    $(`.purchase-product-amount${current_product_id}`).empty();
    sales_product_array.filter(function (data) {
        if (data.product_id == current_product_id) {
            data.prod_discount          = p_discount;
            data.qty                    = current_product_qty
            new_amount_of_sale_product  = (current_product_qty * data.retail_price) - p_discount;
            data.amount                 = new_amount_of_sale_product;
            $(`.purchase-product-amount${current_product_id}`).text(data.amount)
            grandSum(previous_payable,service_charges);
        }
    })
})
function getProducts() {
        $("#products").empty();
        $("#products").append(`<option value="0">Select Product</option>`)
        stock_products.forEach(data => {
            $("#products").append(`<option value="${data.id}" data-name="${data.product_name}" data-qty="${data.qty}">${data.id}-${data.product_name}</option>`)
            product_list.push(data);
        });
}
function getvendors() {
    $("#customer_id").empty();
    $.ajax({
        url : `/get-customer`,
        type: 'get',
        success: function (response) {
            $("#customer_id").append(`<option value="0">Select Customer</option>`)
            response.customers.forEach(data => {
                $("#customer_id").append(`<option value="${data.id}" data-name="${data.customer_name}" ${data.id == customer_id ? 'seleced' : ''}>${data.id}-${data.customer_name}</option>`)
                vendors.push(data);
            });
            $("#customer_id").val(customer_id).trigger('change');
        }
    })
}
$('#customer_id').change(function () {
    var total_paid_for_net_sale = 0;
    if($(this).val()==8){
        // $('#invoice_type').val('1').trigger('change');
        sales_product_array.forEach(function (data, key) {
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
    // $('.current_balance').text('0').trigger('change');
    var selected_index = $(this).val();
    if(selected_index > 0){
        $.ajax({
            url     : '/get-customer-balance/'+selected_index,
            type    : 'get',
            data    :   {
                segment:segment
            },
            success : function(response){
                previous_payable          = response.customer_balance;
                $('#previous_receivable').val(previous_payable);
                var previous_payable_text = previous_payable >= 0 ? previous_payable + " DR" : previous_payable < 0  ? (-previous_payable) + " CR" : previous_payable;
                $('.previous_payable_heading').empty();
                $('.previous_payable_heading').text(previous_payable >= 0 ? 'Previous Receivable' : 'Previous Payable');
                $('.previous_payable').text(previous_payable_text);
                $('.previous_payable').val(previous_payable);
                grandSum(previous_payable,service_charges,invoice_discount)
                if (segments[3] == "sale-edit") {
                    $('.paid_amount').text(customer_ledger['cr']);

                    // $('.remaning_amount').val(customer_ledger['balance'])
                }

                $('.display').css('display','');
            }
        })
    var customer = vendors.filter(x => x.id == selected_index);
    // $('#invoice_type').val('2').trigger('change');

    }
})
function grandSum(previous_payable=0,service_charges=0,discount=0){
    var sum = 0;
    sales_product_array.forEach(function (data, key) {
        // console.log(data);
        sum += parseFloat(data.amount)
    });

    $('.product_net_total').val(sum);
    // sale_total_amount = sum-invoice_discount;
    sum += parseFloat(previous_payable ? previous_payable : 0);
    sum += parseFloat(service_charges ? service_charges : 0);

    sale_total_amount = sum-invoice_discount;
    $('.grand-total').text(sale_total_amount -  $('.paid_amount').text());
    $('.amount_pay_input').val(sale_total_amount -  $('.paid_amount').text());
    // $('.amount_pay_input').val(sale_total_amount) ;

    if(parseFloat($('.amount_pay_input').val()) < 0) {
      $('.th-hide').hide();
      $('.cash-return').text('Cash Return');
    }else{
        $('.th-hide').show();
        $('.cash-return').text('Cash Received');
    }

    // setTimeout(function(){ if($('.grand-total').text() == $('.paid_amount').text()){
    //    $('.th-to-hide').hide();
    //    $('.amount_received').val($('.amount_pay_input').val());
    // }else{
    //    $('.th-to-hide').show();
    // }}, 300);
}
function productRetailAmount(){
    retail_price = $('#retail_price').val();
    amount       =  qty * retail_price ;
    // console.log(retail_price,qty)
    $('#amount').val(amount);
}
$(document).on('input','.amount_received',function(){
     if($(this).val()){
         result = $(this).val() - $('.amount_pay_input').val();
        $('.cash_return').text(result)
     }
})
$('.service_charges_input').on('input',function(){
    service_charges = $(this).val();
  grandSum(previous_payable,$(this).val());
})
$('#invoice_discount').on('input',function(){
    var service = 0;
    invoice_discount = $(this).val();
    $('.amount_received').val($('.paid_amount').text());
    setTimeout(() => {
        $('.amount_received').trigger('input');
    }, 500);
    grandSum(previous_payable,service_charges,$(this).val());
});
$('#add-product').on('focus', function() {
$(this).css('background','#152e4d ');
});
$('#add-product').on('blur', function() {
$(this).css('background','green');
});
$(document).on('mouseenter', '.show_purchase', function() {
$('.pp').show();
}).on('mouseleave', '.show_purchase', function() {
    $('.pp').hide();
  });

