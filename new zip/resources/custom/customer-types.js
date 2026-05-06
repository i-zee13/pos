var glob_type = '';
var deleteRef = '';
$(document).ready(function() {

    fetchCustomerTypes();
    var lastOp = "add";

    $(document).on('click', '.openDataSidebarForAddingCustomerType', function() {
        if (lastOp == "update") {
            $('input[name="type_name"]').val("");
            $('input[name="type_name"]').blur();
            $('input[name="discount"]').val(0);
        }
        lastOp = 'add';
        $('input[id="operation"]').val('add');
        openSidebar();
    });

    $(document).on('click', '.openDataSidebarForUpdateCustomerType', function() {
        $('input[id="operation"]').val('update');
        lastOp = 'update';
        $('#dataSidebarLoader').show();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();
        openSidebar();
        var id = $(this).attr('id');
        $('input[name="customer_type_updating_id"]').val(id);
        $.ajax({
            type: 'GET',
            url: '/GetCustomerTypeInfo/' + id,
            success: function(response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();
                $('#uploadedImg').remove();

                $('input[name="type_name"]').focus();
                $('input[name="type_name"]').val(response.type_name);
                $('input[name="type_name"]').blur();

                $('input[name="discount"]').focus();
                $('input[name="discount"]').val(response.discount);
                $('input[name="discount"]').blur();
            }
        });
    });

    $(document).on('click', '#saveCustomerType', function() {
        $('.validationErrors').remove();
        if (!$('input[name="type_name"]').val() || !$('input[name="discount"]').val()) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        $('#saveCustomerType').attr('disabled', 'disabled');
        $('#cancelCustomerType').attr('disabled', 'disabled');
        $('#saveCustomerType').text('Processing..');

        var ajaxUrl = "/SaveCustomerType";
        if ($('#operation').val() !== "add") {
            ajaxUrl = "/UpdateCustomerType/" + $('input[name="customer_type_updating_id"]').val();
        }

        $('#saveCustomerTypeForm').ajaxSubmit({
            type: "POST",
            url: ajaxUrl,
            data: $('#saveCustomerTypeForm').serialize(),
            cache: false,
            success: function(response) {
                if (JSON.parse(response) == "success") {
                    fetchCustomerTypes();

                    if ($('#operation').val() !== "update") {
                        $('#saveCustomerTypeForm').find("input[type=text], textarea").val("");
                        $('#saveCustomerTypeForm').find("input[type=number]").val(0);
                    }

                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Customer type have been added successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to update customer type at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
                $('#saveCustomerType').removeAttr('disabled');
                $('#cancelCustomerType').removeAttr('disabled');
                $('#saveCustomerType').text('Save');
            },
            error: function(err) {
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function(i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after($('<small class="validationErrors" style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                    });
                }
                $('#saveCustomerType').removeAttr('disabled');
                $('#cancelCustomerType').removeAttr('disabled');
                $('#saveCustomerType').text('Save');
            }
        });

    });

    $(document).on('click', '.deleteCustomerType', function(){
        var id = $(this).attr('id');
        glob_type = $(this).attr('name');
        $('.confirm_delete').attr('id', id);
        deleteRef = $(this); 
        $('#hidden_btn_to_open_modal').click();
    })

    $(document).on('click', '.confirm_delete', function() {
        var typeId = $(this).attr('id');
        var thisRef = $(this);
        deleteRef.attr('disabled', 'disabled');
        deleteRef.parent().ajaxSubmit({
            type: "POST",
            url: '/DeleteCustomerType/' + typeId,
            data: deleteRef.parent().serialize(),
            cache: false,
            success: function(response) {
                if (JSON.parse(response) == "success") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Customer Type have been deleted');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    deleteRef.parent().parent().parent().remove();
                    $('.cancel_delete_modal').click();
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to delete the customer type at this moment');
                    setTimeout(() => {
                        deleteRef.removeAttr('disabled');
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        });
    });
});

function fetchCustomerTypes() {
    $.ajax({
        type: 'GET',
        url: '/GetCustomerTypes',
        success: function(response) {
            $('.body_types').empty();
            $('.body_types').append('<table class="table table-hover dt-responsive nowrap" id="custTypesTable" style="width:100%;"><thead><tr><th>ID</th><th>Type Name</th><th>Discount (%)</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#custTypesTable tbody').empty();
            var response = JSON.parse(response);
            response.forEach(element => {
                $('#custTypesTable tbody').append('<tr><td>' + element['id'] + '</td><td>' + element['type_name'] + '</td><td>' + element['discount'] + '</td><td><button id="' + element['id'] + '" class="btn btn-default btn-line openDataSidebarForUpdateCustomerType">Edit</button><form id="deleteCustomerTypeForm" style="display: inline-block"><input type="text" name="_method" value="DELETE" hidden /><input type="text" name="_token" value="' + $('input[name="tokenForAjaxReq"]').val() + '" hidden /><button type="button" id="' + element['id'] + '" class="btn btn-default red-bg deleteCustomerType" title="Delete">Delete</button></form></td></tr>');
            });
            $('#tblLoader').hide();
            $('.body_types').fadeIn();
            $('#custTypesTable').DataTable();
        }
    });
}