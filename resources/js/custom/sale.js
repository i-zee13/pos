import swal from 'sweetalert';

var segments = location.href.split('/');
var invalidSave = [];
var counter = 0;
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
let retail_price  = '';
var p_price = '';
let stock_in_hand = '';

$(document).ready(function () {
    getProducts();
    if (segments[3] == "stock-add") {
        //
        
    } else if (segments[3] == 'purchase-edit') {
        customer_id    = $('#curren_customer_id').val(); 
        var invoice_id = $('#invoice_id').val(); 
        segment = segments[3];
        $.ajax({
            url: '/get-purchase-products/' + invoice_id,
            type: 'get',
            success: function (response) {
                response.products.forEach(function (product) {
                    p_name = product.product_name;
                    purchased_product_array.push({
                        'product_id' : `${product.product_id}`,
                        'expiry_date': `${product.expiry_date}`,
                        'qty'        : `${product.qty}`,
                        'amount'     : `${product.purchased_total_amount}`,
                        'old_price'  : `${product.purchase_price}`,
                        'new_price'  : ``,
                        'p_name'     : `${product.product_name}`,
                        'purchase_invoice_id'     : `${product.purchase_invoice_id  }`,
                       
                    }); 
                $('.products').children(`option[value="${product.product_id}"]`).attr('disabled', true);
                })
                $(".products").val('0');
                $(".products").select2();
               
                $('.show_existing_div').show();
                var x=0
                purchased_product_array.forEach(function(product,key){
                    x++;
                     $('#designationsTable tbody').append(`
                        <tr id='tr-${product.product_id}'>
                            <td>${key+1}</td>
                            <td>${product.p_name}</td>
                            <td><input type="text" value="${product.qty}"  class="qty-input add-stock-input" data-id="${product.product_id}" data-value="${amount}"></td>
                            <td class='purchase-product-amount${product.product_id} add- S-input '>${product.amount}</td>
                            <td><a type="button" id="${product.product_id}" data-id="${product.purchase_invoice_id}" class="btn smBTN red-bg remove_btn" data-index="">Remove</a></td>
                        </tr>`);
                })
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
    $('#new_marital_status').val(0).trigger('change');
    $('#new_employment_status').val(0).trigger('change');
    $('#new_residence_status').val(0).trigger('change');
})
$(document).on('click', '.remove_btn', function () {
    deleteRef = $(this);
    var product_id          =  $(this).attr('id');
    var purchase_invoice_id =  $(this).attr('data-id');
    if(segments[3] == 'purchase-edit'){
        swal({
            title   : "Are you sure?",
            icon    : "warning",
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
    }else{
        $("#tr-" + product_id).remove();
        purchased_product_array = purchased_product_array.filter(x => x.product_id != product_id);
        $('.products').children('option[value="' + product_id + '"]').attr('disabled', false);
        $(".products").val('0');

        $(".products").select2();

        grandSum(previous_payable);
    }
   
})
$('#add-product').on('click', function () {
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
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please Add Expiry Date of Product');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    } else {
        expiry_date = $('.expiry_date').val();
    }
    purchased_product_array.push({
        'product_id'    : `${product_id}`,
        'expiry_date'   : `${expiry_date}`,
        'qty'           : `${qty}`,
        'amount'        : `${amount}`,
        'retail_price'  : `${retail_price}`,
        'stock_in_hand' :  stock_in_hand,
    });
    $('.products').children('option[value="' + product_id + '"]').attr('disabled', true);
    $(".products").val('0');
    $(".products").select2();
    $('.show_existing_div').show()
    let rowCount = $('#designationsTable tbody tr').length + 1;
    $('#designationsTable tbody').append(`
            <tr id='tr-${product_id}'>
                <td>${rowCount}</td>
                <td>${p_name}</td>
                <td><input type="number" value="${qty}"  class="qty-input add-stock-input td-input-qty${product_id}"  data-id="${product_id}" data-value="${amount}" data-quantity="${qty}"></td>
                <td><input type="number" value="${retail_price}"  class="price-input add-stock-input td-${product_id}"  data-id="${product_id}" data-value="${amount}" data-quantity="${qty}"></td>
                <td class='purchase-product-amount${product_id} add- S-input '>${amount}</td>
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
    $('#retail_price').val('');

    // $('.new_dob').val('')
    p_name = '';
    // $('#purchse-form')[0].reset();
})
$('.products').change(function () {
    var selected_product = $(this).val();
    $('#purchase_price').val('');
    $('#product-name').val('');
    $('#qty').val('');
    $('.bar-code').val('');
    $('#amount').val('');
    if(selected_product > 0){
        var filter_product = product_list.filter(x => x.id == selected_product)
        $('.retail_price').text(filter_product[0].sale_price);
        if(filter_product[0].new_purchase_price > 0){
            $('#purchase_price').val(filter_product[0].new_purchase_price);
        }else{
            $('#purchase_price').val(filter_product[0].old_purchase_price);
        }
        $('#retail_price').val(filter_product[0].sale_price);

        $('.stock_balance').text(filter_product[0].stock_balance);
        p_name        = filter_product[0].product_name;
        product_id    = filter_product[0].id;
        stock_in_hand = filter_product[0].stock_balance;
        $('.expiry_date').val(filter_product[0].expiry_date)
        $('.bar-code').val(filter_product[0].barcode);
    }

});
$(document).on('focusout', '.bar-code', function () {
    var data_variable = $(this).val();
    $('#purchase_price').val('');
    $('#product-name').val('');
    $('#qty').val('');
    $('#amount').val('');
    if(data_variable){
        var filter_product = product_list.filter(x => x.barcode == data_variable)
        $('#products').val(filter_product[0].id).trigger('change');
        // $('.retail_price').text(filter_product[0].sale_price);
        $('#purchase_price').val(filter_product[0].old_purchase_price);
        
        $('.stock_balance').text(filter_product[0].stock_balance);
        p_name = filter_product[0].product_name;
        product_id = filter_product[0].id;
        $('.expiry_date').val(filter_product[0].expiry_date)
    }
    // $.ajax({
    //     url   : `/get-product`,
    //     type  : 'post',
    //     data : {
    //         _token: $('meta[name="csrf_token"]').attr('content'),
    //         get_result_for:get_result_for,
    //         data_variable :data_variable
    //     },
    //     success : function(response) {
    //      $('#purchase_price').val(response.product.purchase_price);
    //          $('#product-name').val(response.product.product_name);
    //         p_name      = response.product.product_name;
    //         product_id  = response.product.id;
    //     } 

    // })
})
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
   
})
$("#save").on('click', function () {
    if(purchased_product_array.length == 0){
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please add at least one Product.');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000)
        return;
    }
   purchased_product_array.forEach(data => { 
    const qtyInput = $(`.td-input-qty${product_id}`);

    // Check if the input field is empty
    if (qtyInput.val().trim() === '') {
        qtyInput.focus();
        qtyInput.css('border','red')
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Qty Should not be Empty');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000)
        return;
    }
   });
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
    $('#notifDiv').fadeIn();
    $('#notifDiv').css('background', 'red');
    $('#notifDiv').text('saveh Hit');
    setTimeout(() => {
        $('#notifDiv').fadeOut();
    }, 3000)
    return;
    let dirty = false;
    $('.required').each(function () {
        if (!$(this).val() || $(this).val() == 0) {
            dirty = true;
        }
    });
    if (dirty) {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please provide all the required information (*)');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
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
    var grand_total = $('.grand-total').text();
    $('#save').attr('disabled', 'disabled');
    $('.btn-cancel').attr('disabled', 'disabled');
    $('#save').text('Processing..');
    $('#form').ajaxSubmit({
        url: '/add-purchase-invoice',
        type: 'post',
        data: {
            'purchased_product_array': purchased_product_array,
            'grand_total': grand_total,
            'purchased_total': purchased_total,
        },
        success: function (response) {
            vendors = [];
            current_client_array = [];
            $('#form')[0].reset();
            $('#client_type').val(0).trigger('change');

            setTimeout(() => {
                window.location = "/stock-add";
                $('#notifDiv').fadeOut();
            }, 1500);
            $('.formselect').select2();
            if ("success") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Added successfully');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                $('#save').removeAttr('disabled');;
                $('.btn-cancel').removeAttr('disabled');
                $('#save').text('Save');
            }
        },
        error: function (e) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Failed to save at the moment');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);

            $('#save').removeAttr('disabled');;
            $('.btn-cancel').removeAttr('disabled');
            $('#save').text('Save');

        }
    })

});
$(document).on('input', '.qty-input', function () {
    var update_qty         = $(this).val();
    var current_product_id = $(this).attr('data-id');
    var current_product_qty = '';
    var product_amount     = $(this).attr('data-value')
    var current_product_price = 0;
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
    purchased_product_array.filter(function (data) {
        if (data.product_id      == current_product_id) {
            p_price               = data.retail_price
            data.qty              = update_qty;
            current_product_qty   = data.stock_in_hand;
            current_product_price = p_price;
            if(update_qty > current_product_qty){
                $(`.td-input-qty${current_product_id}`).val('')
                $(`.td-input-qty${current_product_id}`).css('border-color', 'red');
                $(`.td-input-qty${current_product_id}`).focus();
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Qty should be less then '+current_product_qty);
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000); 
                $('.grand-total').text('0');
                return;
            }else{ 
                $(`.td-input-qty${current_product_id}`).css('border-color', '#dddddd');
                new_amount_of_purchase_product = update_qty * current_product_price;
                data.amount = new_amount_of_purchase_product;
                $(`.purchase-product-amount${current_product_id}`).text(new_amount_of_purchase_product)
                grandSum(previous_payable);
            }
        }
    })

})
$(document).on('input', '.price-input', function () {
    var retail_price          = $(this).val();
    var current_product_id    = $(this).attr('data-id');  
    var current_product_qty   = $(`#tr-${current_product_id}`).find('.qty-input').val();
    var new_amount_of_sale_product = 0;
    
    $(`.purchase-product-amount${current_product_id}`).empty();
    purchased_product_array.filter(function (data) { 
        if (data.product_id      == current_product_id) {
            data.retail_price    = retail_price;  
            data.qty = current_product_qty
                new_amount_of_sale_product = current_product_qty * retail_price;
                data.amount = new_amount_of_sale_product;
                $(`.purchase-product-amount${current_product_id}`).text(new_amount_of_sale_product)
                grandSum(previous_payable); 
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
                console.log(data)
                $("#products").append(`<option value="${data.id}" data-name="${data.product_name}" data-qty="${data.qty}">${data.product_name}</option>`)
                product_list.push(data);
            });
        }
    })
}
function getvendors() {
    $("#customer_id").empty();
    $.ajax({
        url: `/get-customer`,
        type: 'get',
        success: function (response) {
            $("#customer_id").append(`<option value="0">Select Customer</option>`)
            response.customers.forEach(data => {
                $("#customer_id").append(`<option value="${data.id}" data-name="${data.customer_name}" ${data.id == customer_id ? 'seleced' : ''}>${data.customer_name}</option>`)
                vendors.push(data);
            });
            $("#customer_id").val(customer_id).trigger('change');
        }
    })
}
$('.customer_id').change(function () {
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
            previous_payable = response.customer_balance;
            var previous_payable_text = previous_payable > 0 ? previous_payable + " DR" : previous_payable < 0  ? (-previous_payable) + " CR" : previous_payable;
            $('.previous_payable').text(previous_payable_text);
            $('.previous_payable').val(previous_payable);
            grandSum(previous_payable)
            $('.display').css('display','');
        }
    })
    var customer = vendors.filter(x => x.id == selected_index)
}
})
 
function grandSum(previous_payable){ 
    var sum = 0;
    purchased_product_array.forEach(function (data, key) {
        sum += parseFloat(data.amount)
    })
    purchased_total = sum;
    sum += parseFloat(previous_payable)
    $('.grand-total').text(sum);
}
function productRetailAmount(){
    retail_price = $('#retail_price').val();
    amount       = qty * retail_price;
    $('#amount').val(amount);
}