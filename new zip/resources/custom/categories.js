var lastOp = "";
var glob_type = '';
var deleteRef = '';
$(document).ready(function() {

    var segments = location.href.split('/');
    var action = segments[3];
    if (action == "sub-categories") {
        fetchSecondaryServices();
    }else {
        fetchMainCategories();
    }
    $(document).on('click', '.openDataSidebarForAddingSubCat', function() {
        $('.dropify-clear').click();
        $('.dz-image-preview').remove();
        $('#dataSidebarLoader').hide();
        $('input[name="service_name"]').val("");
        $('select[name="primary_service_id"]').val("0").trigger('change');


        $('.dz-default').show();
        if (lastOp == "update") {
        $('.dropify-clear').click();

            $('input[name="service_name"]').val("");
            $('input[name="service_name"]').blur();
            $('#primary_services').val("0").trigger('change');
            $('input[name="publish_service"]').prop('checked', false);
        
        }
        lastOp = 'add';

        if ($('#saveSubSecondaryServiceForm input[name="_method"]').length) {
            $('#saveSubSecondaryServiceForm input[name="_method"]').remove();
        }
         $('select[name="primary_service_id"]').val("-1");
         $('select[name="secondary_service_id"]').val("-1");
         $('input[name="publish_service"]').prop('checked', false);


        $('input[id="operation"]').val('add');
        openSidebar();
    });
    $(document).on('click', '.openDataSidebarForUpdateSubCat', function() {
        $('input[id="operation"]').val('update');
        lastOp = 'update';
        $('#dataSidebarLoader').show();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();
        $('#secondary_services').empty();
        var id = $(this).attr('id');

        $('input[id="sub_cat_id"]').val(id);
        $.ajax({
            type: 'GET',
            url: '/get-sub-cat/'+id,
            success: function(response) {
         
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="service_name"]').focus();
                $('input[name="service_name"]').val(response.sub_cat.service_name);
                $('input[name="service_name"]').blur();
                $.ajax({
                    url     :   `/get-primary-services`,
                    success :   function(subcat){
                        $('select[name="primary_service_id"]').append(`<option value="-1">Select Primary Services</option>`);
                        $('select[name="primary_service_id"]').empty();
                        subcat.forEach(data => {
                            $('select[name="primary_service_id"]').append(`<option value="${data.id}" ${response.sub_cat.primary_service_id == data.id ? 'selected' : ''}>${data.service_name}</option>`).focus();
                        })
                    }
                })
                if (response.sub_cat.publish ==1) {
                    $('.yes').prop('checked', true);
                }else{
                    $('.no').prop('checked', true);

                } 
                var input = `<input type="hidden"  name="hidden_service_icon" value="${response.sub_cat.service_icon}"/> 
                <input type="file" id="input-file-now" class="dropify"  name="service_icon" data-old_input="hidden_service_icon"  data-default-file = "/storage/${response.sub_cat.service_icon}" value="${response.sub_cat.service_icon}"  accept="image/*" data-allowed-file-extensions="jpg png jpeg JPEG"/>`
                $('.sub-img').empty();
                $('.sub-img').html(input);
                $('.dropify').dropify();
            }
        });

        openSidebar();
    });
    $(document).on('click', '.openDataSidebarForAddingMainCat', function() {
        $('.dropify-clear').click();
        $('input[name="main_cat_id"]').val("");
        $('input[name="service_name"]').val("");
        $('input[name="publish_service"]').prop('checked', false);
        $('#dataSidebarLoader').hide();
        $('.dz-image-preview').remove();
        $('.dz-default').show();
        if (lastOp == "update") {
            $('input[name="service_name"]').val("");
            $('input[name="service_name"]').blur();

            $('input[name="publish_service"]').prop('checked', false);
             
        }
        lastOp = 'add';

        if ($('#saveMainCatForm input[name="_method"]').length) {
            $('#saveMainCatForm input[name="_method"]').remove();
        }

        $('input[id="operation"]').val('add');
        openSidebar();
    });
    $(document).on('click', '.openDataSidebarForUpdateMainCat', function() {
        $('input[id="operation"]').val('update');
        lastOp = 'update';
        $('#dataSidebarLoader').show();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();

        var id = $(this).attr('id');
        $('input[name="main_cat_id"]').val(id);

        if (!$('#saveMainCatForm input[name="_method"]').length) {
            $('#saveMainCatForm').append('<input name="_method" value="PUT" hidden />');
        }

        $.ajax({
            type: 'GET',
            url: '/main-category/'+id,
            success: function(response) {
            // console.log(response.category);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="service_name"]').focus();
                $('input[name="service_name"]').val(response.category.service_name);
                $('input[name="service_name"]').blur();

                if (response.category.publish ==1) {
                    $('.yes').prop('checked', true);
                }else{
                    $('.no').prop('checked', true);

                } 
                var input = `<input type="hidden"  name="hidden_service_icon" value="${response.category.service_icon}"/> 
                <input type="file" id="input-file-now" class="dropify"  name="service_icon" data-old_input="hidden_service_icon"  data-default-file = "/storage/${response.category.service_icon}" value="${response.category.service_icon}"  accept="image/*" data-allowed-file-extensions="jpg png jpeg JPEG"/>`
                $('.img').empty();
                $('.img').html(input);
                $('.dropify').dropify();
                 
            }
        });

        openSidebar();
    });
    $(document).on('click', '#saveMainCat', function() {
        if (!$('input[name="service_name"]').val()) {
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

        var ajaxUrl = "/main-category";
        if ($('#operation').val() !== "add") {
            ajaxUrl = "/main-category/"+$('input[name="main_cat_id"]').val();
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
                    fetchMainCategories();
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
    $(document).on('click', '#saveSubCat', function() {
        if (!$('input[name="service_name"]').val() || !$('select[name="primary_service_id"]').val()) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        $('#saveSubCat').attr('disabled', 'disabled');
        $('#cancelSubCat').attr('disabled', 'disabled');
        $('#saveSubCat').text('Processing..');

        var ajaxUrl = "/save-sub-category";

        if ($('#operation').val() !== "add") {
            ajaxUrl = "/update-sub-cat/" + $('input[id="sub_cat_id"]').val();
        }

        $('#saveSubCatForm').ajaxSubmit({
            type: "POST",
            url: ajaxUrl,
            // data: $('#saveSubCatForm').serialize(),
            cache: false,
            success: function(response) {
                console.log(response)
                if(response.msg == "duplicate") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Category Already Exist');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    $('#saveSubCat').removeAttr('disabled');
                    $('#cancelSubCat').removeAttr('disabled');
                    $('#saveSubCat').text('Save');

                }
                if (response.status == "success") {
                    closeSidebar();
                    fetchSecondaryServices();
                    $('#saveSubCat').removeAttr('disabled');
                    $('#cancelSubCat').removeAttr('disabled');
                    $('#saveSubCat').text('Save');

                    var msg = 'Category have been updated successfully';
                    if ($('#operation').val() !== "update") {
                        $('#saveSubCatForm').find("input[name='service_name']").val("");
                        $('#saveSubCatForm').find("select[name='primary_service_id']").val("-1").trigger();
                        $('#saveSubCatForm').find("input[name='publish_service']").prop('checked', false);
                        $('#saveSubCatForm').find("select").val("0").trigger('change');
                    var msg = 'Category have been added successfully';
                    }

                    $('#notifDiv').fadeIn();
                    $('#notifDiv').text(msg)
                    $('#notifDiv').css('background', 'green');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }   
                if (response.status == "failed") {
                    $('#saveSubCat').removeAttr('disabled');
                    $('#cancelSubCat').removeAttr('disabled');
                    $('#saveSubCat').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add category at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
                if (response.status == "image_failed") {
                    $('#saveSubCat').removeAttr('disabled');
                    $('#cancelSubCat').removeAttr('disabled');
                    $('#saveSubCat').text('Save');
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
    $(document).on('click', '.delete_cat', function(){
        var id = $(this).attr('id');
        glob_type = $(this).attr('name');
        $('.confirm_delete').attr('id', id);
        deleteRef = $(this); 
        $('#hidden_btn_to_open_modal').click();
    })
    $(document).on('click', '.confirm_delete', function() {
        var categoryId = $(this).attr('id');
      
        var thisRef = $(this); 
        deleteRef.attr('disabled', 'disabled');
        var url = glob_type == 'main_cat' ? '/main-category/' + categoryId : glob_type == '/del-sub-cat/' + categoryId;
        var type = glob_type == 'main_cat' ? 'POST' : 'GET';
        $.ajax({
            type    :   type,
            url     :   url,
            data    :   deleteRef.parent().serialize(),
            cache   :   false,
            success :   function(response) { 
                        if (response) {
                            $('#notifDiv').fadeIn();
                            $('#notifDiv').css('background', 'green');
                            $('#notifDiv').text('Category have been deleted');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000); 
                            thisRef.removeAttr('disabled');
                            deleteRef.parent().parent().parent().remove();
                            $('.cancel_delete_modal').click();
                        } else {
                            document.write(response);
                            $('#notifDiv').fadeIn();
                            $('#notifDiv').css('background', 'red');
                            $('#notifDiv').text('Unable to delete the Service at this moment');
                            setTimeout(() => {
                                thisRef.removeAttr('disabled');
                                $('#notifDiv').fadeOut();
                            }, 3000);
                        }
            }
        });
    });
});
function fetchMainCategories() {
    $.ajax({
        type    :     'GET',
        url     :     '/get-categories',
        success :     function(response) {
                    $('.body').empty();
                    $('.body').append('<table class="table table-hover dt-responsive nowrap mainCatsListTable" style="width:100%;"><thead><tr><th>S.No</th><th>Service</th><th>Web Publish</th><th>Action</th></tr></thead><tbody></tbody></table>');
                    $('.mainCatsListTable tbody').empty();
                    // var response = JSON.parse(response);
                    var sNo = 1;
                    response.maincat.forEach((element, key) => {
                        $('.mainCatsListTable tbody').append(`
                        <tr>
                            <td>${key + 1}</td>
                            <td><img src="/storage/${element['service_icon']}" style="height:40px; width:40px;"> ${element['service_name']}</td>
                            <td> ${element['publish'] == 1 ? "Yes" :"No"}</td>
                            <td>
                                <button id=" ${element['id']} " class="btn btn-default btn-line openDataSidebarForUpdateMainCat">Edit</button>
                                <form id="deleteMainCategoryForm" style="display: inline-block">
                                        <input type="text" name="_method" value="DELETE" hidden />
                                        <input type="text" name="_token" value="${$('meta[name="csrf_token"]').attr('content')} " hidden /><button type="button" id="${ element['id'] }" class="btn btn-default red-bg deleteMainCategory delete_cat" name="main_cat" title="Delete">Delete</button>
                                </form>
                            </td>
                        </tr>`);
                    });
                    $('#tblLoader').hide();
                    $('.body').fadeIn();
                    $('.mainCatsListTable').DataTable();
                }
    });
}
function fetchSecondaryServices() {
    $.ajax({
        type    : 'GET',
        url     : '/get-sub-category',
        success : function(response) {
                    $('.body').empty();
                    $('.body').append('<table class="table table-hover dt-responsive nowrap subCatsListTable" style="width:100%;"><thead><tr><th>S.No</th><th>Service</th><th>Primary Service</th><th>Web Publish</th><th>Action</th></tr></thead><tbody></tbody></table>');
                    $('.subCatsListTable tbody').empty();
                    var sNo = 1;
                    response.data.forEach((element,key) => {
                        $('.subCatsListTable tbody').append(`
                        <tr>
                            <td>${key + 1}</td>
                            <td><img src="/storage/${element['service_icon']}" style="height:40px; width:40px;"> ${element['service_name']}</td>
                            <td> ${element['main_category']}</td>
                            <td> ${element['publish'] == 1 ? "Yes" : "No"}</td>
                            <td>
                                <button id=" ${element['id']} " class="btn btn-default btn-line openDataSidebarForUpdateSubCat">Edit</button>
                                <form id="deleteMainCategoryForm" style="display: inline-block">
                                        <input type="text" name="_method" value="DELETE" hidden />
                                        <input type="text" name="_token" value="${$('meta[name="csrf_token"]').attr('content')} " hidden /><button type="button" id="${ element['id'] }" class="btn btn-default red-bg deleteMainCategory delete_cat" name="Sub_cat" title="Delete">Delete</button>
                                </form>
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
                            `<option data-id="${data.id}" value="${data.id}">${data.service_name}</option>`
                        )
                    })
        }
    })
}
$("#primary_services").change(function () {
    $('#secondary_services').empty();
    var primary_service_id = $(this).val();
    
    $.ajax({
        url     :   `/get-sub-category-against-main-cat/${primary_service_id}`,
        success :   function(response){
            $("#secondary_services").focus();
            $("#secondary_services").append(`<option value="-1">Select Secondary Services</option>`);
            response.forEach(data => {
                $("#secondary_services").append(`<option value="${data.id}">${data.service_name}</option>`)
            })

        }
    })

})
$(document).on('click', '.dropify-clear', function () {
    var old_input_name = $(this).parent().children('input').attr('data-old_input');
    $('input[name="' + old_input_name + '"]').val('');
});

