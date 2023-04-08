var lastOp = "";
var glob_type = '';
      import swal from 'sweetalert';
var deleteRef = '';
$(document).ready(function() {
    var segments = location.href.split('/');
    var action = segments[3];
    if (action == "customer-ledgers") {
        fetchCustomers();
    }else {
        fetchcompanies();
    }
    $(document).on('click', '.openDataSidebarForAddingProduct', function() {
        $('.dropify-clear').click();
        $('.dz-image-preview').remove();
        $('#dataSidebarLoader').hide();
        $('input[name="barcode"]').val("");
        $('input[name="product_name"]').val("");
        $('input[name="size"]').val("");
        $('input[name="purchase_price"]').val("");
        $('input[name="sale_price"]').val("");
        $('select[name="company_id"]').val("0").trigger('change');
        $('.dz-default').show();
        if (lastOp == "update") {
        $('.dropify-clear').click();

            $('input[name="product_name"]').val("");
            $('input[name="product_name"]').blur();
            $('input[name="barcode"]').val("");
            $('input[name="product_name"]').val("");
            $('input[name="size"]').val("");
            $('input[name="purchase_price"]').val("");
            $('input[name="sale_price"]').val("");
            
            $('#primary_services').val("0").trigger('change');
      
        
        }
        lastOp = 'add';

        if ($('#saveSubSecondaryServiceForm input[name="_method"]').length) {
            $('#saveSubSecondaryServiceForm input[name="_method"]').remove();
        }
         $('select[name="company_id"]').val("-1");
        $('input[id="operation"]').val('add');
        openSidebar();
    });
    $(document).on('click', '.openDataSidebarForUpdateCustomerLedger', function() {
        var id            =  $(this).attr('customer-id');
        var customer_name =  $(this).attr('customer_name');
        var cr            =  $(this).attr('cr');
        var dr            =  $(this).attr('dr');
        var balance       =  $(this).attr('balance');

        $('input[id="operation"]').val('update');
        lastOp = 'update';
        $('#dataSidebarLoader').show();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();
        $('#secondary_services').empty();

                $('input[id="customer_id"]').val(id);
       
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();
                
                $('.customer_name').text(customer_name+' Details');
                $('input[name="cr"]').focus().val(cr).blur();
                $('input[name="dr"]').focus().val(dr).blur();
                $('input[name="balance"]').focus().val(balance >= 0 ? balance + ' DR' : (-balance) + ' CR').blur();

           

        openSidebar();
    });
    $(document).on('click', '.openDataSidebarForAddingCompany', function() {
        $('.dropify-clear').click();
        $('input[name="company_id"]').val("");
        $('input[name="company_name"]').val("");
  
        $('#dataSidebarLoader').hide();
        $('.dz-image-preview').remove();
        $('.dz-default').show();
        if (lastOp == "update") {
            $('input[name="company_name"]').val("");
            $('input[name="company_name"]').blur();
        }
        lastOp = 'add';
        if ($('#saveMainCatForm input[name="_method"]').length) {
            $('#saveMainCatForm input[name="_method"]').remove();
        }
        $('input[id="operation"]').val('add');
        openSidebar();
    });
    $(document).on('click', '.openDataSidebarForUpdateCompany', function() {
        $('input[id="operation"]').val('update');
        lastOp = 'update';
        $('#dataSidebarLoader').show();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();

        var id = $(this).attr('id');
        $('input[name="company_id"]').val(id);
        if (!$('#saveMainCatForm input[name="_method"]').length) {
            $('#saveMainCatForm').append('<input name="_method" value="PUT" hidden />');
        }

        $.ajax({
            type: 'GET',
            url: '/company/'+id,
            success: function(response) {
            // console.log(response.company);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="company_name"]').focus();
                $('input[name="company_name"]').val(response.company.company_name);
                $('input[name="company_name"]').blur();
                
                var input = `<input type="hidden"  name="hidden_company_icon" value="${response.company.company_icon}"/> 
                <input type="file" id="input-file-now" class="dropify"  name="company_icon" data-old_input="hidden_company_icon"  data-default-file = "/storage/${response.category.company_icon}" value="${response.category.company_icon}"  accept="image/*" data-allowed-file-extensions="jpg png jpeg JPEG"/>`
                $('.img').empty();
                $('.img').html(input);
                $('.dropify').dropify();
                 
            }
        });

        openSidebar();
    });
    $(document).on('click', '#saveMainCat', function() {
        if (!$('input[name="company_name"]').val()) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        $('#saveMainCat').attr('disabled', 'disabled');
        $('#cancelMainCat').attr('disabled', 'disabled');
        $('#saveMainCat').text('Processing..');

        var ajaxUrl = "/company";
        if ($('#operation').val() !== "add") {
            ajaxUrl = "/company/"+$('input[name="company_id"]').val();
        }

        $('#saveMainCatForm').ajaxSubmit({
            type: "POST",
            url: ajaxUrl,
            data: $('#saveMainCatForm').serialize(),
            cache: false,
            success: function(response) {
                if(response.status == "duplicate") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Category Already Exist');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    $('#saveMainCat').removeAttr('disabled');
                    $('#cancelMainCat').removeAttr('disabled');
                    $('#saveMainCat').text('Save');
                }
                if (response.status == "success") {
                    fetchcompanies();
                    $('#saveMainCat').removeAttr('disabled');
                    $('#cancelMainCat').removeAttr('disabled');
                    $('#saveMainCat').text('Save');

                    $('#notifDiv').text('Category have been updated successfully');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    closeSidebar();
                } 
                 if (response.status == "failed") {

                    $('#saveMainCat').removeAttr('disabled');
                    $('#cancelMainCat').removeAttr('disabled');
                    $('#saveMainCat').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add category at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
                if (response.status == "image_failed") {
                    $('#saveMainCat').removeAttr('disabled');
                    $('#cancelMainCat').removeAttr('disabled');
                    $('#saveMainCat').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Image Should not be Empty');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
              
            },
            error: function(err) {
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function(i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                    });
                }
            }
        });

    });
    $(document).on('click', '#saveTransaction', function() {
        if (!$('input[name="recevie_amount"]').val() ) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Add Amount.');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        $('#saveTransaction').attr('disabled', 'disabled');
        $('#cancelSubCat').attr('disabled', 'disabled');
        $('#saveTransaction').text('Processing..');

        $('#saveTransactionForm').ajaxSubmit({
            type   : "POST",
            url    : '/transaction-store',
            cache  : false,
            success: function(response) {
                
                if (response.status == "success") {
                    closeSidebar();
                    fetchCustomers();
                    $('#saveTransaction').removeAttr('disabled').text('Save');
                    $('#cancelSubCat').removeAttr('disabled');
                    $$('#recevie_amount').val('');
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
            error: function(err) {
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function(i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                    });
                }
            }
        });

    });
  
});
function fetchcompanies() {
    $.ajax({
        type    :     'GET',
        url     :     '/get-companies',
        success :     function(response) {
                    $('.body').empty();
                    $('.body').append('<table class="table table-hover dt-responsive nowrap mainCatsListTable" style="width:100%;"><thead><tr><th>S.No</th><th>Icon</th><th>Name</th><th>Action</th></tr></thead><tbody></tbody></table>');
                    $('.mainCatsListTable tbody').empty();
                    // var response = JSON.parse(response);
                    var sNo = 1;
                    response.companies.forEach((element, key) => {
                        $('.mainCatsListTable tbody').append(`
                        <tr>
                            <td>${key + 1}</td>
                            <td> <img src="${element['company_icon'] ? '/storage/'.element['company_icon'] : '/images/company.png'}"  style="height:25px; width:25px;"></td>
                            <td> ${element['company_name']}</td>
                            <td>
                                <button id=" ${element['id']} " class="btn btn-default btn-line openDataSidebarForUpdateCompany">Edit</button>
                                 
                                <button type="button" id="${ element['id'] }" class="btn btn-default red-bg deleteMainCategory delete_cat" name="main_cat" title="Delete">Delete</button>
                                
                            </td>
                        </tr>`);
                    });
                    $('#tblLoader').hide();
                    $('.body').fadeIn();
                    $('.mainCatsListTable').DataTable();
                }
    });
}
function fetchCustomers() {
    $.ajax({
        type    : 'GET',
        url     : '/get-customer-ledgers-list',
        success : function(response) {
                    $('.body').empty();
                    $('.body').append(`
                    <table class="table table-hover dt-responsive nowrap subCatsListTable" style="width:100%;">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Name</th>
                                <th>Balance</th>
                                <th>Dated</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                    <tbody></tbody>
                    </table>`);
                    $('.subCatsListTable tbody').empty();
                    var sNo = 1;
                    response.customers.forEach((element,key) => {   
                        $('.subCatsListTable tbody').append(`
                        <tr>
                            <td>${key + 1}</td>
                            <td> ${element['customer_name']}</td>
                            <td>${element['balance'] >= 0 ? element['balance'] + ' DR' : (-element['balance']) + ' CR' } </td>
                            <td> ${moment(element['date']).format('D MMM YYYY')}</td>
                            
                            <td>
                                <button  class="btn btn-default btn-line openDataSidebarForUpdateCustomerLedger"
                                        customer-id="${element['customer_id']}" 
                                        customer_name="${element['customer_name']}" 
                                        cr="${element['cr']}" 
                                        dr="${element['dr']}" 
                                        balance="${element['balance']}" 
                                >Add Payment</button>
                            </td>
                        </tr>`);
                    });
                    $('#tblLoader').hide();
                    $('.body').fadeIn();
                    $('.subCatsListTable').DataTable();
                }
    });
}

function get_primary_services(){
    $.ajax({
        url     :   'get-primary-services',
        success :   function(response){
                      $("#primary_services").append(`<option value="0">Select Primary Services </option>`)
                      $("#secondary_services").append(`<option value="-1">Select Secondary Services</option>`);
                      response.forEach(data => {
                        $("#primary_services").append(
                            `<option data-id="${data.id}" value="${data.id}">${data.company_name}</option>`
                        )
                    })
        }
    })
}
$("#primary_services").change(function () {
    $('#secondary_services').empty();
    var primary_service_id = $(this).val();
    
    $.ajax({
        url     :   `/get-products-against-main-cat/${primary_service_id}`,
        success :   function(response){
            $("#secondary_services").focus();
            $("#secondary_services").append(`<option value="-1">Select Secondary Services</option>`);
            response.forEach(data => {
                $("#secondary_services").append(`<option value="${data.id}">${data.company_name}</option>`)
            })

        }
    })

})
$(document).on('click', '.dropify-clear', function () {
    var old_input_name = $(this).parent().children('input').attr('data-old_input');
    $('input[name="' + old_input_name + '"]').val('');
});
 