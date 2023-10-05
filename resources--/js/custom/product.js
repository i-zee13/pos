var lastOp = "";
var barcode = '';
      import swal from 'sweetalert';
var deleteRef = '';
let products ='';
let companies = '';
let prod_name = '';
let action = '' 
$(document).ready(function() {
    
    var segments = location.href.split('/');
    action = segments[3];
    if (action == "products") {
        fetchproducts();
    }else {
        fetchcompanies();
    }
    $(document).on('click', '.openDataSidebarForAddingProduct', function() {
       
        // $('input[name="barcode"]').val(barcode).focus();
        $('.barcode_span').text(barcode);
        $('.dropify-clear').click();
        $('.dz-image-preview').remove();
        $('#dataSidebarLoader').hide(); 
        $('#product_id').val("");
        $('select[name="product_name"]').val("").blur();
        $('input[name="size"]').val("").blur();
        $('input[name="purchase_price"]').val("").blur();
        $('input[name="sale_price"]').val("");
        $('select[name="company_id"]').val("0").trigger('change');
        $('.dz-default').show();
        if (lastOp == "update") {
        $('.dropify-clear').click();
            $('select[name="product_name"]').val("").blur(); 
            $('input[name="size"]').val("").blur();
            $('input[name="purchase_price"]').val("").blur();
            $('input[name="sale_price"]').val("").blur();
        }
        selectize.clear();
        lastOp = 'add';

        if ($('#saveSubSecondaryServiceForm input[name="_method"]').length) {
            $('#saveSubSecondaryServiceForm input[name="_method"]').remove();
        } 
        $('input[id="operation"]').val('add');
        openSidebar();
    });
    $(document).on('click', '.openDataSidebarForUpdateProduct', function() {
     
        $('input[id="operation"]').val('update');
        lastOp  = 'update';
        $('#dataSidebarLoader').show();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();
        $('#secondary_services').empty();
        var id = $(this).attr('id');

        $('input[id="product_id"]').val(id);
        $.ajax({
            type: 'GET',
            url: '/get-sub-cat/'+id,
            success: function(response) {
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();
                $('.barcode_span').text(response.product.id);

                $('input[name="barcode"]').focus();
                $('input[name="barcode"]').val(response.product.barcode);
                $('input[name="barcode"]').blur();
                
                setTimeout(() => { 
                    selectize.setValue(id);
                    var selectedOption = selectize.getItem(id); 
                    $('#hidden_product_name').val($(selectedOption).text()); 
                }, 1000);
               
                $('.attribute').trigger('click');
                $('input[name="size"]').focus();
                $('input[name="size"]').val(response.product.size);
                $('input[name="size"]').blur();

                $('input[name="purchase_price"]').focus();
                $('input[name="purchase_price"]').val(response.product.old_purchase_price.toFixed(2));
                $('input[name="purchase_price"]').blur();

                $('input[name="sale_price"]').focus();
                $('input[name="sale_price"]').val(response.product.sale_price.toFixed(2));
                $('input[name="sale_price"]').blur();
 
                $.ajax({
                    url     :   `/get-companies`,
                    success :   function(subcat){
                        $('select[name="company_id"]').empty();
                        $('select[name="company_id"]').append(`<option value="0">Select Company</option>`);
                        subcat.companies.forEach(data => {
                            $('select[name="company_id"]').append(`<option value="${data.id}" ${response.product.company_id == data.id ? 'selected' : ''}>${data.company_name}</option>`).focus();
                        })
                    }
                })
                var input = `<input type="hidden"  name="hidden_product_icon" value="${response.product.product_icon}"/> 
                <input type="file" id="input-file-now" class="dropify"  name="product_icon" data-old_input="hidden_product_icon"  data-default-file = "/storage/${response.product.product_icon}" value="${response.product.product_icon}"  accept="image/*" data-allowed-file-extensions="jpg png jpeg JPEG"/>`
                $('.sub-img').empty();
                $('.sub-img').html(input);
                $('.dropify').dropify();
            }
        });
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
                setTimeout(() => { 
                    selectize.setValue(response.company.id); 
                    var selectedOption = selectize.getItem(response.company.id); 
                    $('#hidden_company_name').val($(selectedOption).text()); 
                }, 500);
                $('.company').trigger('click');
                // $('input[name="company_name"]').focus();
                // $('input[name="company_name"]').val(response.company.company_name);
                // $('input[name="company_name"]').blur();
                
                // var input = `<input type="hidden"  name="hidden_company_icon" value="${response.company.company_icon}"/> 
                // <input type="file" id="input-file-now" class="dropify"  name="company_icon" data-old_input="hidden_company_icon"  data-default-file = "/storage/${response.category.company_icon}" value="${response.category.company_icon}"  accept="image/*" data-allowed-file-extensions="jpg png jpeg JPEG"/>`
                // $('.img').empty();
                // $('.img').html(input);
                // $('.dropify').dropify();
                 
            }
        });
        openSidebar();
    });
    $(document).on('click', '#saveMainCat', function() {
        // if (!$('input[name="company_name"]').val()) {
        //     $('#notifDiv').fadeIn();
        //     $('#notifDiv').css('background', 'red');
        //     $('#notifDiv').text('Please provide all the required information (*)');
        //     setTimeout(() => {
        //         $('#notifDiv').fadeOut();
        //     }, 3000);
        //     return;
        // }
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
            data: {
                prod_name:prod_name
            },
            cache: false,
            success: function(response) {
                if(response.status == "duplicate") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Product Already Exist');
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

                    $('#notifDiv').text('Product have been updated successfully');
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
    $(document).on('click', '#saveProduct', function() { 
        let dirty = false;
        $('.field-required').each(function () {
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
        // if (!$('input[name="product_name"]').val() || !$('select[name="company_id"]').val()) {
        //     $('#notifDiv').fadeIn();
        //     $('#notifDiv').css('background', 'red');
        //     $('#notifDiv').text('Please provide all the required information (*)');
        //     setTimeout(() => {
        //         $('#notifDiv').fadeOut();
        //     }, 3000);
        //     return;
        // }

        $('#saveProduct').attr('disabled', 'disabled');
        $('#cancelSubCat').attr('disabled', 'disabled');
        $('#saveProduct').text('Processing..');
 

        $('#saveProductForm').ajaxSubmit({
            type   : "POST",
            url    : '/product-store',
            data :{
                prod_name:prod_name,
            },
            cache  : false,
            success: function(response) {
                if(response.msg == "duplicate") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text(response.duplicate_msg);
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    $('#saveProduct').removeAttr('disabled');
                    $('#cancelSubCat').removeAttr('disabled');
                    $('#saveProduct').text('Save');
                }
                if (response.status == "success") {
                    closeSidebar();
                    fetchproducts(); 
                    selectize.clear();
                    location.reload();
                    $('#saveProduct').removeAttr('disabled');
                    $('#cancelSubCat').removeAttr('disabled');
                    $('#saveProduct').text('Save');

                    var msg = 'Product have been updated successfully';
                    if ($('#operation').val() !== "update") {
                        $('#saveProduct').find("input[name='product_name']").val("");
                        $('#saveProduct').find("select[name='company_id']").val("0").trigger();
                        $('#saveProduct').find("input[name='publish_service']").prop('checked', false);
                        $('#saveProduct').find("select").val("0").trigger('change');
                    var msg = 'Product have been added successfully';
                    }

                    $('#notifDiv').fadeIn();
                    $('#notifDiv').text(msg)
                    $('#notifDiv').css('background', 'green');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }   
                if (response.status == "failed") {
                    $('#saveProduct').removeAttr('disabled');
                    $('#cancelSubCat').removeAttr('disabled');
                    $('#saveProduct').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add category at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
                if (response.status == "image_failed") {
                    $('#saveProduct').removeAttr('disabled');
                    $('#cancelSubCat').removeAttr('disabled');
                    $('#saveProduct').text('Save');
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
    $(document).on('click', '.delete_cat', function () {
    var id = $(this).attr('id');
    deleteRef = $(this);
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
            var id = $(this).attr('id');
            $.ajax({
                type: 'DELETE',
                url: '/company/'+id,
                data: {
                    _token: $('meta[name="csrf_token"]').attr('content'),
                    id: id
                },
                success: function (response) {
                    if (response.status == 'success') {
                        all_leads_list();
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Successfully deleted.');
                        fetchcompanies();
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
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
      
    })
    $(document).on('click', '.delete_product', function () {
        var id = $(this).attr('id');
        var status = $(this).attr('data-status');
        deleteRef = $(this);
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
                var id = $(this).attr('id');
                $.ajax({
                    type: 'POST',
                    url: '/product-delete/'+id,
                    data: {
                        _token: $('meta[name="csrf_token"]').attr('content'),
                        id: id,
                        status:status
                    },
                    success: function (response) {
                        if (response.status == 'success') {
                            $('#notifDiv').fadeIn().css('background', 'green').text(response.msg); 
                            fetchproducts();
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);
                        } else {
                            deleteRef.removeAttr('disabled');
                            deleteRef.text('Delete');
                            $('#notifDiv').fadeIn().css('background', 'red').text('Unable to delete at the moment'); 
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);
                        }
                    }
                });
            }
        });
        
    })
});
function fetchcompanies() {
    $.ajax({
        type    :     'GET',
        url     :     '/get-companies',
        success :     function(response) {
            companies =  response.companies;
                    $('.body').empty();
                    $('.body').append('<table class="table table-hover dt-responsive nowrap mainCatsListTable" style="width:100%;"><thead><tr><th>S.No</th><th>Icon</th><th>Name</th><th>Action</th></tr></thead><tbody></tbody></table>');
                    $('.mainCatsListTable tbody').empty();
                    // var response = JSON.parse(response);
                    var sNo = 1;
                    response.companies.forEach((element, key) => {
                        selectize.addOption({value:element.id,text:element.company_name});
                        $('.mainCatsListTable tbody').append(`
                        <tr>
                            <td>${key + 1}</td>
                            <td> <img src="${element['company_icon'] ? '/storage/'.element['company_icon'] : '/images/company.png'}"  style="height:25px; width:25px;"></td>
                            <td> ${element['company_name']}</td>
                            <td>
                                <button id=" ${element['id']} " class="btn btn-default btn-line openDataSidebarForUpdateCompany">Edit</button>
                            </td>
                        </tr>`);
                    });
                    $('#tblLoader').hide();
                    $('.body').fadeIn();
                    $('.mainCatsListTable').DataTable();
                }
    });
}
function fetchproducts() {
    $.ajax({
        type    : 'GET',
        url     : '/get-products',
        success : function(response) {
            products = response.data;
            barcode = response.barcode;
            products.forEach(element => {
                selectize.addOption({value:element.id,text:element.product_name});
            });
                    $('.body').empty();
                    $('.body').append(`
                    <table class="table table-hover dt-responsive nowrap subCatsListTable" style="width:100%;">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Company</th>
                                <th>Product</th>
                                <th>Size</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                    <tbody></tbody>
                    </table>`);
                    $('.subCatsListTable tbody').empty();
                    var sNo = 1; 
                    // $('.barcode').val(barcode).focus();
                    $('.barcode_span').text(barcode)
                    response.data.forEach((element,key) => { 
                        var delet_status  = ''; 
                        if(element.deleted_at == null){
                             delet_status = `<button type="button" id="${element['id'] }" class="btn btn-default red-bg  delete_product" name="Sub_cat" title="Delete" data-status ="delete">Delete</button>`
                        }else{
                             delet_status = `<button type="button" id="${element['id'] }" class="btn btn-default btn-line  delete_product" name="Sub_cat" title="Restore" data-status ="restore">Restore</button>`
                        }
                        $('.subCatsListTable tbody').append(`
                        <tr> 
                            <td>${element['barcode'] ? element['barcode'] : element['id']} </td>
                            <td> ${element['company_name']}</td>
                            <td> <img src="${element['product_icon'] ? '/storage/'.element['product_icon'] : '/images/product.png'}"  style="height:25px; width:25px;"> ${element['product_name']}</td>
                            <td>${element['size']} </td>
                            <td>
                                <button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateProduct">Edit</button>
                                ${delet_status}
                            </td>
                        </tr>`);
                       
                    });
                    $('#tblLoader').hide();
                    $('.body').fadeIn();
                    $('.subCatsListTable').DataTable();
                }
    });
}  
$(document).on('click', '.dropify-clear', function () {
    var old_input_name = $(this).parent().children('input').attr('data-old_input');
    $('input[name="' + old_input_name + '"]').val('');
});
var select = $('.company,.attribute').selectize({ 
    onFocus: function() {
        var $activeSelect = select[0].selectize;
        var $value        = $activeSelect.getValue(); 
        if ($value.length > 0) {
          var item = $activeSelect.getItem($value); 
          if(item) {
            var element        = document.querySelector('div.item');
            var innerHTMLValue = element.innerHTML;  
            $activeSelect.clear();
            $activeSelect.setTextboxValue(innerHTMLValue);
          }
        }
      }, 
    create:function(input,callback){
        prod_name = input;
        (action == "products") ?  $('#hidden_product_name').val(input) :  $('#hidden_company_name').val(input);
        // $('#hidden_product_name').val(input)
        callback({value:input,text:input})
        return; 
    },
});
var selectize = select[0].selectize;
$('.company,.attribute').on('click input',function(){  
    if (action == "products") {
        products.forEach(element => {
            selectize.addOption({value:element.id,text:element.product_name});
        });
    }else {
        companies.forEach(element => {
            selectize.addOption({value:element.id,text:element.company_name});
        });
    } 
});
 selectize.on('change', function onChange(id) {  
    var selectedOption  = selectize.getItem(id);
    prod_name           = $(selectedOption).text();  
    console.log(prod_name); 
    (action == "products") ? $('#hidden_product_name').val($(selectedOption).text()) : $('#hidden_company_name').val($(selectedOption).text());
    // $('#hidden_product_name').val($(selectedOption).text());
}); 
selectize.clear();

