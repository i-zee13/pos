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
let current_client_array  = [];
var p_price = '';
let total_return_qty = 0;
let paid_amount = 0;
let purchase_total_amount = 0;
let total_invoice_amount_after_paid = 0;
let vendor_ledger = 0;

$(document).ready(function () {
    getProducts();
    if (segments[3] == "stock-add") {
        //
        
    } else if (segments[3] == 'purchase-edit') {
        paid_amount             = $('#hidden_paid_amount').val();
        customer_id             = $('#curren_customer_id').val(); 
        var invoice_id          = $('#invoice_id').val(); 
        vendor_ledger           = JSON.parse($('#vendor_ledger').val()); 
        segment = segments[3];
        $.ajax({
            url: '/get-purchase-products/' + invoice_id,
            type: 'get',
            success: function (response) {
                response.products.forEach(function (product) {
                    total_return_qty += product.return_qty*product.purchase_price;
                    p_name = product.product_name;
                    purchase_total_amount += product.purchased_total_amount;
                    purchased_product_array.push({
                        'product_id'            : `${product.product_id}`,
                        'expiry_date'           : `${product.expiry_date}`,
                        'qty'                   : `${product.qty_after_return > 0 ? product.qty_after_return : product.qty}`,
                        'amount'                : `${product.purchased_total_amount}`,
                        'old_price'             : `${product.purchase_price}`,
                        'new_price'             : ``,
                        'p_name'                : `${product.product_name}`,
                        'purchase_invoice_id'   : `${product.purchase_invoice_id  }`,
                       
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
    var product_id          =  $(this).attr('id');
    var purchase_invoice_id =  $(this).attr('data-id');
    if(segments[3] == 'purchase-edit'){
        swal({
            title   : "Are you sure?",
            // text    : "",
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
    // this.parentNode.removeChild(this);

    //purchased_product_array.splice(purchased_product_array.indexOf(this),1);
    // $('#products').children('option[value="' + id + '"]').attr('disabled', false);
    // $(".existing_client").select2();
   

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
        // $('#notifDiv').fadeIn();
        // $('#notifDiv').css('background', 'red');
        // $('#notifDiv').text('Please Add Expiry Date of Product');
        // setTimeout(() => {
        //     $('#notifDiv').fadeOut();
        // }, 3000);
        // return;
    } else {
        expiry_date = $('.expiry_date').val();
    }
    purchased_product_array.push({
        'product_id' : `${product_id}`,
        'expiry_date': `${expiry_date}`,
        'qty'        : `${qty}`,
        'amount'     : `${amount}`,
        'new_price'  : `${new_price}`,
        'old_price'  : `${old_price}`,
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
                <td><input type="text" value="${qty}"  class="qty-input add-stock-input" data-id="${product_id}" data-value="${amount}"></td>
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
    // $('.new_dob').val('')
    p_name = '';
    // $('#purchse-form')[0].reset();
})
$(document).on('focusout', '.bar-code', function () {
    var data_variable = $(this).val();
    
    $('#purchase_price').val('');
    $('#product-name').val('');
    $('#qty').val('');
    $('#amount').val('');
    if(data_variable){
        var filter_product = product_list.filter(x => {
            const barcodeArray = x.barcode.split(',');
            return barcodeArray.includes(data_variable) || x.id == data_variable;
        });
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
//Saving Intake Client 
$("#save").on('click', function () {
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
            'grand_total'    : grand_total,
            'purchased_total': purchased_total,
        },
        success: function (response) {
            vendors = [];
            current_client_array = [];
            $('#form')[0].reset();
            $('#client_type').val(0).trigger('change');

            setTimeout(() => {
                window.location = "/purchases";
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
    var update_qty = $(this).val();
    var current_product_id = $(this).attr('data-id');
    var product_amount     = $(this).attr('data-value')
    var current_product_price = 0;
    var new_amount_of_purchase_product = 0;
    purchased_product_array.filter(function (data) {
        if(data.product_id == current_product_id){
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
        url     : '/get-vendor-balance/'+selected_index,
        type    : 'get',
        data    :   {
            segment:segment
         },
        success : function(response){
           // total_invoice_amount_after_paid = purchase_total_amount - paid_amount;
        //   
        //        previous_payable =  previous_payable_balance
        //    }else{
        // }
        if(segments[3] == 'purchase-edit'){
            if(vendor_ledger['return_invoice_id'] > 0){
                previous_payable =  vendor_ledger['balance']+vendor_ledger['dr']-purchase_total_amount
            }else{
                previous_payable =  vendor_ledger['balance']+vendor_ledger['dr']-vendor_ledger['cr'];
            }
        }else{
            previous_payable = response.customer_balance;
        }
            var previous_payable_text = previous_payable > 0 ? previous_payable + " CR" : previous_payable < 0  ? (-previous_payable) + " DR" : previous_payable;
            $('.previous_payable').text(previous_payable_text);
            $('.previous_payable').val(previous_payable);
            $('.paid_amount').text(vendor_ledger['dr']); 
            console.log(vendor_ledger['balance'])
            $('.remaning_amount').val(vendor_ledger['balance'])
            grandSum(previous_payable)
            $('.display').css('display','');
        }
    })
    var customer = vendors.filter(x => x.id == selected_index)
}
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
        $('.stock_balance').text(filter_product[0].stock_balance);
        p_name = filter_product[0].product_name;
        product_id = filter_product[0].id;
        $('.expiry_date').val(filter_product[0].expiry_date)
        $('.bar-code').val(filter_product[0].barcode);
    }

});
function getPurchases() {
    $.ajax({
        url: 'get-purchase-list',
        type: 'get',
        success: function (response) {
            $('.body').empty();
            $('.body').append(`
            <table class="table table-hover dt-responsive nowrap subCatsListTable" style="width:100%;">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Company</th>
                        <th>Bar Code</th>
                        <th>Product</th>
                        <th>Size</th>
                        <th>Action</th>
                    </tr>
                </thead>
            <tbody></tbody>
            </table>`);
            $('.subCatsListTable tbody').empty();
            var sNo = 1;
            response.data.forEach((element, key) => {
                $('.subCatsListTable tbody').append(`
                <tr>
                    <td>${key + 1}</td>
                    <td> ${element['company_name']}</td>
                    <td>${element['barcode']} </td>
                    <td> <img src="${element['product_icon'] ? '/storage/'.element['product_icon'] : '/images/product.png'}"  style="height:25px; width:25px;"> ${element['product_name']}</td>
                    <td>${element['size']} </td>
                    <td>
                        <button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateProduct">Edit</button>
                        <button type="button" id="${element['id']}" class="btn btn-default red-bg  delete_product" name="Sub_cat" title="Delete">Delete</button>
                    </td>
                </tr>`);
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.subCatsListTable').DataTable();
        }
    })

}
function grandSum(previous_payable){
    var sum = 0;
    purchased_product_array.forEach(function (data, key) {
        sum += parseFloat(data.amount)
    })
        purchased_total = sum;
    
        sum += parseFloat(previous_payable) 

    $('.grand-total').text(sum);
} 
