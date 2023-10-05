var glob_type = '';
var deleteRef = '';
var dtrecord = '';
var city_sate_id = '';

$(document).ready(function () {
    fetchAttributelist();
    $(document).on('click', '#nav-country-tab', function () {
        $('.Product-Filter').hide();
        $('#productlist01').removeClass('openDataSidebarForAddingAttributeValue');
        $('#productlist01').addClass('openDataSidebarForAddingAttribute');
    });
    $(document).on('click', '#nav-province-tab', function () {
        $('.Product-Filter').hide();
        $('#productlist01').addClass('openDataSidebarForAddingAttributeValue');
        $('#productlist01').removeClass('openDataSidebarForAddingAttribute');
    });
    ///Open Attribute Form
    $(document).on('click', '.openDataSidebarForAddingAttribute', function () {
        $('#dataSidebarLoader').hide();
        $('#saveAttributeForm').show();
        $('#saveAttributeValueForm').hide();
        $('#saveBtn').addClass('saveAttribute');
        $('#saveBtn').removeClass('updateAttribute');
        $('#saveBtn').removeClass('saveAttributeValue');
        $('#saveBtn').removeClass('updateAttributeValue');
        $('input[name="attribute_name"]').focus();
        $('input[name="attribute_name"]').val('');
        $('input[name="attribute_name"]').blur();
        $('#operation').val('add_attribute');
        $('#page_title').text('Attribute');
        $('#operation_state').val('');

    });
    $(document).on('click', '.openDataSidebarForUpdateAttribute', function () {
        openSidebar();
        $('#saveAttributeForm').hide();
        $('#saveAttributeValueForm').hide();
        $('#saveBtn').addClass('saveAttribute');
        $('#saveBtn').removeClass('saveAttributeValue');
        $('#operation').val('update_attribute');
        $('#page_title').text('Attribute');
        $('#dataSidebarLoader').show();
        var id = $(this).attr('id');
        $.ajax({
            type: 'GET',
            url: '/get-attribute/' + id,
            success: function (response) {
               console.log(response);
                $('#dataSidebarLoader').hide();
                $('input[name="attribute_name"]').focus();
                $('input[name="attribute_name"]').val(response.attribute.name);
                $('input[name="attribute_name"]').blur();
                $('input[name="hidden_attribute_id"]').val(response.attribute.id);
                $('#saveAttributeForm').show();
                $('#saveAttributeValueForm').hide();
            }
        });

    });
    ///OpenAttribute Value Form
    $(document).on('click', '.openDataSidebarForAddingAttributeValue', function () {
        $('#dataSidebarLoader').hide();
        $('#saveAttributeForm').hide();
        $('#saveAttributeValueForm').show();
        $('#saveBtn').removeClass('saveAttribute');
        $('#saveBtn').addClass('saveAttributeValue');
        $('#operation_state').val('add_attribute_value');
        $('#operation').val('');
        $('select[name="attribute_id"]').val(0).trigger('change');
        $('input[name="attribute_value"]').focus();
        $('input[name="attribute_value"]').val('');
        $('input[name="attribute_value"]').blur();
        $('#page_title').text('Attribute Value');

    });
    $(document).on('click', '.openDataSidebarForUpdateAttributeValue', function () {
        openSidebar();
        $('#saveAttributeForm').hide();
        $('#saveAttributeValueForm').hide();
        $('#saveBtn').addClass('saveAttributeValue');
        $('#saveBtn').removeClass('saveAttribute');
        $('#operation_state').val('update_attribute_value');
        $('#dataSidebarLoader').show();
        $('#page_title').text('Attribute Value');
        var id = $(this).attr('id');
        $.ajax({
            type: 'GET',
            url: '/get-attribute-value/' + id,
            success: function (response) {
                $('#dataSidebarLoader').hide();
                $('select[name="attribute_id"]').val(response.attribute.attribute_id).trigger('change');
                $('input[name="attribute_value"]').focus();
                $('input[name="attribute_value"]').val(response.attribute.attribute_value);
                $('input[name="attribute_value"]').blur();
                $('input[name="hidden_attributevalue_id"]').val(response.attribute.id);
                $('#saveAttributeValueForm').show();
                $('#saveAttributeForm').hide();
            }
        });
    });
    //Attribute Save
    $(document).on('click', '.saveAttribute', function () {
        if (!$('input[name="attribute_name"]').val()) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        $(`#saveAttributeForm`).ajaxSubmit({
            type: 'POST',
            url: '/save-attribute',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
            },
            success: function (response) {
                if (response.status == "success") {
                    $('#pl-close').click();
                    var operation = $('#operation').val()
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Added successfully');
                    fetchAttributelist();
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else if (response.msg == "already_exist") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Record Already Exist');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add at this moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            },
            error: function (e) {
                notification(`error`, `Somthing Went Wrong`);
            }
        })


        // save_attribute();
    })
    $(document).on('click', '.saveAttributeValue', function () {
        if (!$('select[name="attribute_id"]').val() || $('select[name="attribute_id"]').val() == 0 || !$('input[name="attribute_value"]').val()) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        $(`#saveAttributeValueForm`).ajaxSubmit({
            type: 'POST',
            url: '/save-attribute-value',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
            },
            success: function (response) {
                if (response.status == "success") {
                    $('#pl-close').click();
                    var operation = $('#operation').val()
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Added successfully');
                    fetchAttributelist();
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else if (response.msg == "already_exist") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Record Already Exist');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add at this moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            },
            error: function (e) {
                notification(`error`, `Somthing Went Wrong`);
            }
        })

    })
    //Delete Geographical Data
    $(document).on('click', '.delete_attribute', function () {
        var id = $(this).attr('id');
        glob_type = $(this).attr('name');
        $('.confirm_delete').attr('id', id);
        deleteRef = $(this);
        $('#hidden_btn_to_open_modal').click();
    })
    $(document).on('click', '.confirm_delete', function () {
        var thisRef = $(this);
        deleteRef.attr('disabled', 'disabled');
        deleteRef.text('Processing...');
        var id = $(this).attr('id');
        $.ajax({
            type: 'POST',
            url: '/delete-attribute',
            data: {
                _token: $('meta[name="csrf_token"]').attr('content'),
                type: glob_type,
                id: id
            },
            success: function (response) {
                if (response.status == 'success') {
                    fetchAttributelist();
                    deleteRef.parent().parent().remove();
                    $('.cancel_delete_modal').click();
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Successfully deleted.');
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
    });
    function fetchAttributelist() {
        $('.loader').show();
        $('.AttributeTbl').empty();
        $('.AttributeValueTbl').empty();
        $('.Product-Filter').hide();
        $.ajax({
            type: 'GET',
            url: '/get-all-Attributes',
            data: {
                // _token: $('meta[name="csrf_token"]').attr('content')
            },
            success: function (response) {
     
                $('.total_attributes').text(response.total_attributes);
                $('.total_attribute_values').text(response.total_attribute_value);
                $('.AttributeTbl').append('<table class="table table-hover dt-responsive nowrap attributesListTable" style="width:100%;"><thead><tr><th>S.No</th><th>Name</th><th>Action</th></tr></thead><tbody></tbody></table>');
                $('.attributesListTable tbody').empty();
                $('.loader').hide();
                response.attributes.forEach((element, key) => {
                    $('.attributesListTable tbody').append(`
                    <tr>
                        <td>${key + 1}</td>
                        <td>${element['name']}</td>
                        <td>
                            <button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateAttribute">Edit</button>
                            <button id="${element['id']}" class="btn btn-default red-bg delete_attribute" name="attribute">Delete</button>
                        </td>
                    </tr>`);
                });
                $('.attributesListTable').fadeIn();
                $('.attributesListTable').DataTable();
    
             
                $('.AttributeValueTbl').append('<table class="table table-hover dt-responsive nowrap attribute_value_ListTable" style="width:100%;"><thead><tr><th>S.No</th><th>Value</th><th>Attribute</th><th>Action</th></tr></thead><tbody></tbody></table>');
                $('.attribute_value_ListTable tbody').empty();
                response.attribute_value.forEach((element, key) => {
                    $('.attribute_value_ListTable tbody').append(`
                    <tr>
                        <td>${key + 1}</td>
                        <td>${element['attribute_value']}</td>
                        <td>${element['attribute_name']}</td>
                        <td>
                            <button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateAttributeValue">Edit</button>
                            <button id="${element['id']}" class="btn btn-default red-bg delete_attribute" name="attribute_value" style="background: #e20000!important; color: #fff!important">Delete</button>
                        </td>
                    </tr>`);
                });
                $('.attribute_value_ListTable').fadeIn();
                $('.attribute_value_ListTable').DataTable();

                //All Attribute in select Boxs For Edit or Add State
                $('.all_attributes').empty();
                $('.all_attributes').append(`<option value="0">Select Attribute*</option>`);
                response.attributes.forEach((element) => {
                    $('.all_attributes').append(`<option value="${element['id']}" >${element['name']}</option>`);
                });
                
                $('.loader').hide();
            }
        });
    }
});

