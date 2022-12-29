var lastOp = "";
var glob_type = '';
var deleteRef = '';
$(document).ready(function() {

    fetchForwarder();

    $(document).on('click', '.openDataSidebarForAddingForwarder', function() {
        $('input[name="forwarder_id"]').val("");
        if (lastOp == "update") {
            $('input[type="text"], input[type="number"], input[type="email"], select').each(function() {
                $(this).val("");
                $(this).blur();
            });
            $('select[name="country"]').val('0').trigger('change');
        }
        lastOp = 'add';
        if ($('#saveForwarderForm input[name="_method"]').length) {
            $('#saveForwarderForm input[name="_method"]').remove();
        }
        $('input[id="operation"]').val('add');
        openSidebar();
    });

    $(document).on('click', '.openDataSidebarForUpdateForwarder', function() {
        $('input[id="operation"]').val('update');
        lastOp = 'update';
        $('#dataSidebarLoader').show();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();

        var id = $(this).attr('id');
        $('input[name="forwarder_id"]').val(id);
        // debugger;
        // if (!$('#saveForwarderForm input[name="_method"]').length) {
        //     $('#saveForwarderForm').append('<input name="_method" value="PUT" hidden />');
        // }

        $.ajax({
            type: 'GET',
            url: '/GetForwarder/' + id,
            success: function(response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();
                $('input[type="text"], input[type="number"], input[type="email"], select').each(function() {
                    if (!response[$(this).attr('name')]) {
                        return;
                    }
                    $(this).focus();
                    $(this).val(response[$(this).attr('name')]);
                    $(this).val(response[$(this).attr('name')]).trigger('change');
                });
            }
        });
        openSidebar();
    });

    $(document).on('click', '#saveForwarder', function() {
        invalidSave = [];

        $('.required').each(function() {
            if (!$(this).val()) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please provide all the required information (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                invalidSave.push(true);
            } else {
                invalidSave.push(false);
            }
        });

        var check_email = false;
        if ($('input[name="email"]').val() != '') {
            if (!validateEmail($('input[name="email"]').val())) {
                check_email = false;
            } else {
                check_email = true;
            }
        } else {
            check_email = true;
        }

        if (!check_email) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Invalid email format');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        if (invalidSave.includes(true))
            return;

        $('#saveForwarder').attr('disabled', 'disabled');
        $('#cancelForwarder').attr('disabled', 'disabled');
        $('#saveForwarder').text('Processing..');

        //alert($('[name="method"]').length);

        $('#saveForwarderForm').ajaxSubmit({
            type: "POST",
            url: '/save_forwarder',
            data: $('#saveForwarderForm').serialize(),
            cache: false,
            success: function(response) {
                if (JSON.parse(response) == "success") {
                    fetchForwarder();
                    $('#saveForwarder').removeAttr('disabled');
                    $('#cancelForwarder').removeAttr('disabled');
                    $('#saveForwarder').text('Save');

                    $('#notifDiv').text('Forwarder have been updated successfully');
                    if ($('#operation').val() !== "update") {
                        $('input[type="text"], input[type="number"], input[type="email"]').each(function() {
                            if ($(this).attr('id') == "operation") {
                                return;
                            }
                            $(this).val("");
                            $(this).blur();
                        });
                        $('#saveForwarderForm').find("select").val("0").trigger('change');
                        $('#notifDiv').text('Forwarder have been added successfully');
                        $('#pl-close').click();
                    }

                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#saveForwarder').removeAttr('disabled');
                    $('#cancelForwarder').removeAttr('disabled');
                    $('#saveForwarder').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add Forwarder at the moment');
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

    $(document).on('click', '.deleteForwarder', function(){
        var id = $(this).attr('id');
        glob_type = $(this).attr('name');
        $('.confirm_delete').attr('id', id);
        deleteRef = $(this); 
        $('#hidden_btn_to_open_modal').click();
    })

    $(document).on('click', '.confirm_delete', function() {
        var thisRef = $(this);
        deleteRef.attr('disabled', 'disabled');
        deleteRef.text('Processing...');
        $.ajax({
            type: 'GET',
            url: '/deleteForwarder/' + thisRef.attr('id'),
            data: {
                _token: $('meta[name="csrf_token"]').attr('content')
            },
            success: function(response) {
                if (JSON.parse(response) == 'success') {
                    //fetchAccountList();
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

    $(document).on('change', '.excel_file_input', function() {
        var file = $('.excel_file_input')[0].files[0]
        if (file) {
            $('.file_name').text(file.name);
        }
    });

    //Upload Excel
    $(document).on('click', '.upload_excel_file_forwarder', function() {
        //alert('here'); return;
        var thisRef = $(this);
        thisRef.text('Processing...');
        thisRef.attr('disabled', 'disabled');
        $('.close_modal').attr('disabled', 'disabled');
        $('#upload_excel_form_forwarder').ajaxSubmit({
            type: "POST",
            url: '/upload_excel_forwarder',
            data: $('#upload_excel_form_forwarder').serialize(),
            cache: false,
            success: function(response) {
                $('.upload_excel_file_forwarder').removeAttr('disabled');
                $('.close_modal').removeAttr('disabled');
                $('.upload_excel_file_forwarder').text('Bulk Upload');
                $('.file_name').text('Choose File');
                $('.excel_file_input').val('');

                var response = JSON.parse(response);
                if (response.status == 'failed') {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add forwarders at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    if (response.not_upload_able == '') {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Forwarders added successfully.');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                        $('.close_modal').click();
                        fetchForwarder();
                    } else {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Forwarders added successfully.');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                        $('.excel_file_input').val('');
                        $('.error_message_div').show();
                        $('.not_uploadable_products_table').append('<table class="table table-hover dt-responsive nowrap" id="not_uploadable_products" style="width:100%;"><thead><tr><th>Company Name</th><th>POC Name</th><th>Email</th><th>Country</th></tr></thead><tbody></tbody></table>');
                        $('#not_uploadable_products tbody').empty();
                        jQuery.each(response.not_upload_able, function(i, val) {
                            var test = i;
                            $('#not_uploadable_products tbody').append(`<tr><td>${val.company_name}</td><td>${val.poc}</td><td>${val.email}</td><td>${val.country}</td></tr>`);
                        });
                        $('#tblLoader').hide();
                        $('.body').fadeIn();
                        $('#not_uploadable_products').DataTable();
                    }
                }

            },
            error: function(err) {
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function(i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after($('<small class="validationErrors" style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                    });
                }
            }
        });
    });

});

function fetchForwarder() {
    $.ajax({
        type: 'GET',
        url: '/GetForwarderList',
        success: function(response) {
            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap forwarderTable" style="width:100%;"><thead><tr><th>S.No</th><th>Company Name</th><th>POC</th><th>City</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.forwarderTable tbody').empty();
            var response = JSON.parse(response);
            var sNo = 1;
            response.forEach(element => {
                $('.forwarderTable tbody').append('<tr><td>' + sNo++ + '</td><td>' + element['company_name'] + '</td><td>' + element['poc'] + '</td><td>' + (element['city'] ? element['city'] : "NA") + '</td><td><button id="' + element['id'] + '" class="btn btn-default btn-line openDataSidebarForUpdateForwarder">Edit</button><button type="button" id="' + element['id'] + '" class="btn btn-default red-bg deleteForwarder" name="forwarder" title="Delete">Delete</button></td></tr>');
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.forwarderTable').DataTable();
        }
    });
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}