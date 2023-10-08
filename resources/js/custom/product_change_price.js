import { forIn } from "lodash";

let deleteRef = '';
let filterd_products_list = [];
let sessions = [];
let CurrentRef = '';
let segments = location.href.split('/');
$('.search-btn').on('click', function () {
    if($('.company_id').val() == 0 ){
        $('#notifDiv').fadeIn().css('background', 'red').text('Please Select Company/Product First.');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return
    }
    var product_id = $('.product_id').val();

    CurrentRef = $(this);
    CurrentRef.text('Fetching...')
    CurrentRef.attr('disabled', 'disabled');
    var filtered_Array      = [];
    if(product_id){
        filtered_Array      =   filterd_products_list.filter(x => x.id == product_id);
    }else{
        filtered_Array      =   filterd_products_list;
    }
    ProductTable(filtered_Array);
    setTimeout(function() {
        CurrentRef.text('Search');
        CurrentRef.attr('disabled', false);
    }, 500);
});
function ProductTable(filtered_Array) {
    $('.no-info').addClass('d-none');
    $('.products-table').empty();
    $('.products-table').append(`
        <table class="table table-hover dt-responsive nowrap productTable" style="width:100%;">
            <thead>
                <tr>
                    <th>ID#</th>
                    <th>Product Name</th>
                    <th>Purchase Price</th>
                    <th>New Price</th>
                    <th>Profit</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `);

    filtered_Array.forEach((element, key) => {
        $('.productTable tbody').append(`
            <tr data-product-id="${element.id}">
                <td>${key + 1}</td>
                <td>${element.product_name}</td>
                <td class="${key + 1}-purchase-price">${element.old_purchase_price}</td>
                <td><input type="number" min='0' class="inputvalue only_numerics" value="${element.sale_price}"  data-purchase="${element.old_purchase_price}"  data-id="${key + 1}" name="sale_price" tabindex="3" min="0"></td>
                <td class="${key + 1}-profit"></td>
                <td><button type="button" class="btn btn-primary smBTN mr-2 add-new-price" tabindex="8" style="padding: 5px 15px 5px 15px; background:green" data-id="${key + 1}">Add</button></td>
            </tr>
        `);
        percentage(key + 1,element.sale_price,element.old_purchase_price);

    });
}

$('.company_id').on('change', function () {
    var company_id = $(this).val();
    var csrfToken = $('meta[name="csrf-token"]').attr('content');
    if(company_id > 0){
        $.ajax({
            url     : "/get-company-products",
            method  : "POST",
            headers : {
                'X-CSRF-TOKEN': csrfToken
            },
            data: { company_id: company_id },
            success: function (data) {
                filterd_products_list = data.products;
                var productDropdown = $(".product_id");
                productDropdown.empty().append('<option value="">Select Product</option>');
                $.each(data.products, function (key, value) {
                    productDropdown.append('<option value="' + value.id + '">' + value.id + '-' + value.product_name + '</option>');
                });
            },
            error: function (error) {
                console.error("Error:", error);
            }
        });
    }

})

$(document).on('keyup', 'input[name="sale_price"]', function() {
    var dataId = $(this).data('id');
    var salePrice = parseFloat($(this).val());
    var purchasePrice = parseFloat($(this).data('purchase'));
    percentage(dataId,salePrice,purchasePrice)

});

function percentage(dataId, salePrice = 0, purchasePrice = 0) {
    var percentageValue = ((salePrice - purchasePrice) / purchasePrice) * 100;
    var result = percentageValue < 0 ? 1 : 0;
    var iconClass = percentageValue > 0 ? 'fa fa-arrow-up text-success' : 'fa fa-arrow-down text-danger';

    $('.' + dataId + '-profit').html('<i class="' + iconClass + '"></i> ' + parseFloat(percentageValue).toFixed(2) + '%');
}


$(document).on('click', '.add-new-price', function() {

    var $button = $(this);
    var $row = $button.closest('tr');
    var csrfToken = $('meta[name="csrf-token"]').attr('content');
    var productId = $row.data('product-id');
    var $input = $row.find('input[name="sale_price"]');
    $input.on('keyup', function() {
        $input.css('border-color', '');
    });
    var salePrice = $input.val();
    if (salePrice === '') {
        $input.css('border-color', 'red');
        return;
    }
    $('button').attr('disabled', 'disabled');
    $.ajax({
        url: '/update-product/' + productId,
        method: 'PUT',
        headers : {
            'X-CSRF-TOKEN': csrfToken
        },
        data: {
            salePrice: salePrice
        },
        success: function(response) {
            $('button').attr('disabled', false);
            // $('.inputvalue').val('');
            $input.css('border-color', '');
            var dataId = $button.attr('data-id');
            var newSalePrice = response.products.sale_price;
            $('.' + dataId + '-sale-price').text(newSalePrice);
            $('#notifDiv').fadeIn().css('background', 'green').text('Product Price Updated Success!');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
        }
    });
});


$('.reset-btn').on('click', function () {
    window.location.reload(true);

    // $('.company_id').val('').trigger('change');
    // $('#search-form')[0].reset();
    // $('.teacher_attendance_list').empty();
    // $('.teacher_attendance_list').append(`
    //         <div class="col-12 pb-10">
    //         <div class="no-info">
    //             <div class="m-auto"><strong>Please Filter Your Stock Record !</strong></div>
    //         </div>
    //     </div>
    //     `);
})
function addCommas(nStr) {
    nStr += "";
    x = nStr.split(".");
    x1 = x[0];
    x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
}

