
import swal from 'sweetalert';

var segments = location.href.split('/');
var result = 0;
var product_list = [];
var vendors = [];
var returns_product_array = [];
var deleteRef = '';
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
let retail_price  = '';
var p_price = '';
let stock_in_hand = '';
let stock_products = '' ;
let customer_ledger = '' ;
let existing_product_ids = [] ;
let service_charges = 0;
let invoice_discount = 0;
let data_variable  = '';
$(document).ready(function () {

    $('.parent-div').show();
    $('#tblLoader').hide();
    $('#bar-code').focus();
    stock_products    = JSON.parse($('#stock_products').val());
    customer_ledger   = JSON.parse($('#customer_ledger').val());
    vendors = JSON.parse($('#vendors').val());
    getProducts();
    $('.display').show();
   if (segments[3] == 'purchase-return-edit') {
        customer_id      = $('#curren_customer_id').val();
        var invoice_id   = $('#hidden_invoice_id').val();
        service_charges  = $('#service_charges').val();
        invoice_discount = $('#invoice_discount').val();
        segment          = segments[3];
        $.ajax({
            url: '/get-purchase-return-products/' + invoice_id,
            type: 'get',
            success: function (response) {
                response.products.forEach(function (product) {

                    existing_product_ids.push(product.product_id);
                    p_name = product.product_name;
                    returns_product_array.push({
                        'product_id'         : `${product.product_id}`,
                        'prod_discount'      : `${product.product_discount}`,
                        'expiry_date'        : `${product.expiry_date}`,
                        'qty'                : `${product.qty}`,
                        'amount'             : `${product.product_return_total_amount}`,
                        'retail_price'       : `${product.sale_price}`,
                        'stock_in_hand'      : `${product.stock_in_hand}`,
                        'purchased_price'    : `${product.purchase_price}`,
                        'p_name'             : `${product.product_name}`,
                        'return_invoice_id'  : `${product.return_invoice_id}`,
                    });
                })
                $('.display').show();
                $('.show_existing_div').show();
                var x=0
                returns_product_array.forEach(function(product,key){
                    x++;

                    tableHtml(product.product_id, product.p_name,product.expiry_date,product.retail_price,product.purchased_price,product.stock_in_hand,product.amount,product.qty,  product.prod_discount)
                })
            }
        })
    }
    getvendors();
    $('.add-more-btn').attr('href', '#');
    $('.new_form_field').addClass('required_client');
})
$('#add-product').on('click', function () {
    var is_in_array = returns_product_array.filter(x => x.product_id == data_variable);
    if(is_in_array.length > 0){
        for(var x =1 ; x <= qty ; x++){
            is_in_array[0].qty++;
        }
        $('.td-input-qty' + data_variable).val(is_in_array[0].qty).trigger('input');
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
        returns_product_array.push({
            'return_invoice_id'    :   '',
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
        let rowCount = $('#designationsTable tbody tr').length + 1;
        tableHtml(product_id, p_name, expiry_date, retail_price, purchased_price, stock_in_hand, amount, qty, prod_discount)
        grandSum(previous_payable,service_charges);
        $('.show_existing_div').show()
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
    var return_invoice_id =  $(this).attr('data-id');
    var q               =  $(this).attr('data-quantity');
     if(segments[3] == 'edit-purchase-return' && return_invoice_id != undefined){
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
                    url: '/delete-product-from-purchase-return',
                    data: {
                        _token           : $('meta[name="csrf_token"]').attr('content'),
                        product_id       : product_id,
                        return_invoice_id: return_invoice_id,
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
                            returns_product_array = returns_product_array.filter(x => x.product_id != product_id);
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
        returns_product_array = returns_product_array.filter(x => x.product_id != product_id);
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
   var filter_product = product_list.filter(x => x.barcode == data_variable);
   if(filter_product.length > 0){
       $('#products').val(filter_product[0].id).trigger('change');
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
       setTimeout(() => {
           $('#notifDiv').fadeOut();
       }, 3000)
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
    if(returns_product_array.length == 0){
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please add at least one Product.');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000)
        return;
    }
    let hasEmptyQty = false;

    returns_product_array.forEach(data => {
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

    if (returns_product_array.length < 1) {
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
        url  : '/add-purchase-return-invoice',
        type : 'post',
        data : {
                'cash_return'        :  result,
                'service_charges'    :  $('.service_charges_input').val(),
                'grand_total'        :  $('.grand-total').text(),
                'sale_total_amount'  :  sale_total_amount,
                'status'             :  1, //status
                'returns_product_array':  returns_product_array,
                'existing_product_ids': existing_product_ids
            },
        success: function (response) {
            if ("success") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Added successfully');
                var received_amount = $('.amount_received').val().trim() > 0 ? $('.amount_received').val().trim() : 0;
                if(type == 'print'){
                    var printWindow    = window.open("/print-purchase-return-invoice/" + response.invoice_id + '/' + response.customer_id + '/' + received_amount);
                    printWindow.onload = function() {
                    printWindow.print();
                    };

                }
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                    window.location     = "/add-return";
                }, 1500);
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

    var update_qty            = $(this).val();
    var current_product_id    = $(this).attr('data-id');
    var current_product_price = 0;
    $('.amount_received').val($('.paid_amount').text());
    setTimeout(() => {
        $('.amount_received').trigger('input');
    }, 500);

    var new_amount_of_purchase_product = 0;
    if(update_qty < 0){
        $(this).val('')
        $(this) .css('border-color', 'red');
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
    returns_product_array.filter(function (data) {
        if (data.product_id      == current_product_id) {
            p_price               = data.retail_price
            data.qty              = update_qty;
            current_product_qty   = data.stock_in_hand;
            current_product_price = p_price;
                $(`.td-input-qty${current_product_id}`).css('border-color', '#dddddd');
                new_amount_of_purchase_product = update_qty * current_product_price;
                data.amount      = new_amount_of_purchase_product-data.prod_discount;
                $(`.purchase-product-amount${current_product_id}`).text(data.amount)
                getStockRetail(data.product_id);
                grandSum(previous_payable,service_charges,invoice_discount);
        }
    })

})
$(document).on('input', '.price-input', function () {
    $('.amount_received').val($('.paid_amount').text());
    setTimeout(() => {
        $('.amount_received').trigger('input');
    }, 500);
    var retail_price        = $(this).val();
    var current_product_id  = $(this).attr('data-id');
    var current_product_qty = $(`.tr-${current_product_id}`).find('.qty-input').val();
    var new_amount_of_sale_product = 0;
    $(`.purchase-product-amount${current_product_id}`).empty();
    returns_product_array.filter(function (data) {
        if (data.product_id == current_product_id) {
            data.qty            = current_product_qty
            new_amount_of_sale_product = current_product_qty * retail_price;
            data.amount         = new_amount_of_sale_product - data.prod_discount;
            data.retail_price   = retail_price;
            getStockRetail(data.product_id);
            $(`.purchase-product-amount${current_product_id}`).text(data.amount)
            grandSum(previous_payable, service_charges);
        }
    })

})  
$(document).on('input', '.discount-input', function () {
    var p_discount            = $(this).val();
    var current_product_id    = $(this).attr('data-id');
    var current_product_qty   = $(`.tr-${current_product_id}`).find('.qty-input').val();
    var current_product_qty   = $(`.tr-${current_product_id}`).find('.qty-input').val();
    var new_amount_of_sale_product = 0;
    $('.amount_received').val($('.paid_amount').text());
    setTimeout(() => {
        $('.amount_received').trigger('input');
    }, 500);
    $(`.purchase-product-amount${current_product_id}`).empty();
    returns_product_array.filter(function (data) {
        if (data.product_id      == current_product_id) {
            data.prod_discount   = p_discount;
            data.qty             = current_product_qty
            new_amount_of_sale_product = (current_product_qty * data.retail_price)-p_discount;
            data.amount = new_amount_of_sale_product;
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
        $("#customer_id").append("<option value=\"0\">Select Vendor</option>");
        console.log(vendors)
       vendors.forEach(function (data) {
        console.log(data);
        $("#customer_id").append(`<option value="${data.id}" data-name="${data.customer_name}" ${data.id == customer_id ? 'seleced' : ''}>${data.id}-${data.customer_name}</option>`)

        $("#customer_id").val(customer_id).trigger('change');
      }) 
  }
$('#customer_id').change(function () {
    var total_paid_for_net_sale = 0;
    if($(this).val()==6){
        returns_product_array.forEach(function (data, key) {
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
            url     : '/get-vendor-balance-for-purchase-return/'+selected_index,
            type    : 'get',
            data    :   {
                segment:segment
            },
            success : function(response){
                previous_payable          = response.customer_balance;
                $('#previous_receivable').val(previous_payable);
                var previous_payable_text = previous_payable >= 0 ? previous_payable.toLocaleString('en-US') + " CR" : previous_payable < 0  ? (-previous_payable.toLocaleString('en-US')) + " DR" : previous_payable.toLocaleString('en-US');
                $('.previous_payable_heading').empty();
                $('.previous_payable_heading').text(previous_payable >= 0 ? 'Previous Receivable' : 'Previous Payable');
                $('.previous_payable').text(previous_payable_text);
                $('.previous_payable').val(previous_payable);
                grandSum(previous_payable,service_charges,invoice_discount)
                if (segments[3] == "purchase-edit") {
                    $('.paid_amount').text(customer_ledger['cr']);
                }
                $('.display').css('display','');
            }
        })
    var customer = vendors.filter(x => x.id == selected_index);

    }
})
function grandSum(previous_payable=0,service_charges=0,discount=0){
    var sum = 0;
    returns_product_array.forEach(function (data, key) {
       //console.log(data);
        sum += parseFloat(data.amount)
    });
    $('.product_net_total').val(sum);
    sum -= parseFloat(previous_payable)

    sum += parseFloat(service_charges ? service_charges : 0);
    sale_total_amount = sum-invoice_discount;
    setTimeout(() => {
        $('.grand-total').text(sale_total_amount -  $('.paid_amount').text()).toLocaleString('en-US');
        $('.amount_pay_input').val(sale_total_amount -  $('.paid_amount').text());
    }, 500);
    if(parseFloat($('.amount_pay_input').val()) < 0) {
      $('.th-hide').hide();
      $('.cash-return').text('Cash Pay');
    }else{
        $('.th-hide').show();
        $('.cash-return').text('Cash Pay');
    }
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
        $('.cash_return').text(result.toLocaleString('en-US'))
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
  })
  function tableHtml(product_id, p_name, expiry_date, retail_price, purchased_price, stock_in_hand, amount, qty, prod_discount,invoice_id=0) {
    $('#designationsTable tbody').append(`
    <tr class='tr-${product_id}'>
        <td>${product_id}</td>
        <td>${p_name}</td>
        <td><input type="date" value="${expiry_date}" class="inputSale   expiry_input"  data-id="${product_id}" style="font-size: 13px;width: 95;" min="0" ></td>
        <td><input type="number" value="${qty}"  data-retail="${retail_price}" data-purchase="${purchased_price}" data-stock="${stock_in_hand}"  class="inputSale qty-input add-stock-input td-input-qty${product_id}"   data-id="${product_id}" data-value="${amount}" data-quantity="${qty}"  style="font-size: 13px;width:50" min="0"></td>
        <td><input type="number" value="${retail_price}" data-retail="${retail_price}" data-purchase="${purchased_price}" data-stock="${stock_in_hand}" class="inputSale price-input add-stock-input td-${product_id}"  data-id="${product_id}" data-value="${amount}" data-quantity="${qty}"  s tyle="font-size: 13px" min="0"></td>
        <td><input type="number" value="${prod_discount}"  class="inputSale discount-input add-stock-input td-${prod_discount}"  data-id="${product_id}" data-value="${amount}" data-quantity="${qty}"    style="font-size: 13px;width:50" min="0"></td>
        <td class='purchase-product-amount${product_id} add- S-input ' >${amount - prod_discount}</td>
        <td><button type="button" id="${product_id}" class="btn smBTN red-bg remove_btn"   data-quantity="${qty}" data-invoice-id="${invoice_id}">Remove</button></td>
        </tr>`
    );
}
