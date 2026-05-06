var lastOp = "";
var invalidSave = [];
$(document).ready(function() {

    fetchPorts();

    $(document).on('click', '.openDataSidebarForAddingPort', function() {
        $('input[name="port_id"]').val("");

        if (lastOp == "update") {
            $('input[type="text"], input[type="number"], input[type="email"]').each(function() {
                $(this).val("");
                $(this).blur();
            });
            $('select').each(function() {
                $(this).val("0");
            });
        }
        lastOp = 'add';

        if ($('#savePortForm input[name="_method"]').length) {
            $('#savePortForm input[name="_method"]').remove();
        }

        // $('.bulkUploadContainer').html(`<h2 class="_head03">Bulk <span>Upload</span></h2>
        // <div class="form-wrap p-0">
        //     <div class="row">
        //         <div class="col-md-12">
        //             <div class="form-group">
        //                 <input type="file" name="bulk_upload" class="form-control" accept=".xlsx" />
        //             </div>
        //         </div>
        //     </div>
        // </div>`);
        // $('.bulkUploadContainer').parent().show();

        $('input[id="operation"]').val('add');
        openSidebar();
    });

    $(document).on('click', '#savePort', function() {
        invalidSave = [];

        //if (!$('[name="bulk_upload"]').val()) {
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

        if (invalidSave.includes(true))
            return;
        //}

        $('#savePort').attr('disabled', 'disabled');
        $('#cancelPort').attr('disabled', 'disabled');
        $('#savePort').text('Processing..');

        var ajaxUrl = "/Ports";
        if ($('#operation').val() !== "add") {
            ajaxUrl = "/Ports/" + $('input[name="port_id"]').val();
        }
        var elem = $('#savePortForm');

        // if ($('[name="bulk_upload"]').val()) {
        //     ajaxUrl = "/BulkUploadPorts"
        //     elem = $('#bulkUploadForm');
        // }
        elem.ajaxSubmit({
            type: "POST",
            url: ajaxUrl,
            data: $('#savePortForm').serialize(),
            cache: false,
            success: function(response) {
                if (JSON.parse(response) == "success") {
                    fetchPorts();
                    $('#savePort').removeAttr('disabled');
                    $('#cancelPort').removeAttr('disabled');
                    $('#savePort').text('Save');

                    $('#notifDiv').text('Port have been updated successfully');
                    if ($('#operation').val() !== "update") {
                        $('input[type="text"], input[type="number"], input[type="email"]').each(function() {
                            if ($(this).attr('id') == "operation") {
                                return;
                            }
                            $(this).val("");
                            $(this).blur();
                        });
                        $('#savePortForm').find("select").val("0").trigger('change');
                        $('#notifDiv').text('Port have been added successfully');
                    }

                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#savePort').removeAttr('disabled');
                    $('#cancelPort').removeAttr('disabled');
                    $('#savePort').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add Port at the moment');
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


    $(document).on('change', '.excel_file_input', function() {
        var file = $('.excel_file_input')[0].files[0]
        if (file) {
            $('.file_name').text(file.name);
        }
    });

    $(document).on('click', '.upload_excel_file_ports', function() {
        if (!$('[name="file"]').val()) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Choose File!');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        $('.upload_excel_file_ports').attr('disabled', 'disabled');
        $('.upload_excel_file_ports').text('Processing...');
        $('.close_modal').attr('disabled', 'disabled');
        ajaxUrl = "/BulkUploadPorts"
        elem = $('#bulkUploadForm');
        elem.ajaxSubmit({
            type: "POST",
            url: ajaxUrl,
            //data: $('#savePortForm').serialize(),
            cache: false,
            success: function(response) {
                $('.upload_excel_file_ports').removeAttr('disabled');
                $('.close_modal').removeAttr('disabled');
                $('.upload_excel_file_ports').text('Bulk Upload');
                $('.file_name').text('Choose File');
                $('.excel_file_input').val('');
                if (JSON.parse(response) == "success") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').text('Added Successfully!');
                    $('#notifDiv').css('background', 'green');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    $('.close_modal').click();
                    fetchPorts();
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add Port at the moment');
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

    $(document).on('click', '.openDataSidebarForUpdatePort', function() {
        $('input[id="operation"]').val('update');
        lastOp = 'update';
        $('#dataSidebarLoader').show();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();

        var id = $(this).attr('id');
        $('input[name="port_id"]').val(id);

        if (!$('#savePortForm input[name="_method"]').length) {
            $('#savePortForm').append('<input name="_method" value="PUT" hidden />');
        }

        // $('.bulkUploadContainer').empty();
        // $('.bulkUploadContainer').parent().hide();

        $.ajax({
            type: 'GET',
            url: '/Ports/' + id,
            success: function(response) {
                var response = JSON.parse(response);
                console.log(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[type="text"], input[type="number"], input[type="email"], select').each(function() {
                    if (!response[$(this).attr('name')]) {
                        return;
                    }
                    $(this).focus();
                    $(this).val(response[$(this).attr('name')]);
                });
            }
        });

        openSidebar();
    });

    $(document).on('click', '.deletePort', function() {
        if (!window.confirm('Are you sure you want to delete this port?'))
            return;
        var shipperId = $(this).attr('id');
        var thisRef = $(this);
        thisRef.attr('disabled', 'disabled');
        thisRef.parent().ajaxSubmit({
            type: "POST",
            url: '/Ports/' + shipperId,
            data: thisRef.parent().serialize(),
            cache: false,
            success: function(response) {
                if (response) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Port have been deleted');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    thisRef.parent().parent().parent().remove();
                } else {
                    document.write(response);
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to delete the Port at this moment');
                    setTimeout(() => {
                        thisRef.removeAttr('disabled');
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        });
    });
});

function fetchPorts() {
    $.ajax({
        type: 'GET',
        url: '/GetPortsList',
        success: function(response) {
            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap portsTable" style="width:100%;"><thead><tr><th>S.No</th><th>Code</th><th>Name</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.portsTable tbody').empty();
            var response = JSON.parse(response);
            var sNo = 1;
            response.forEach(element => {
                $('.portsTable tbody').append('<tr><td>' + sNo++ + '</td><td>' + element['port_code'] + '</td><td>' + element['port_name'] + '</td><td><button id="' + element['id'] + '" class="btn btn-default btn-line openDataSidebarForUpdatePort">Edit</button><form id="deletePortForm" style="display: inline-block"><input type="text" name="_method" value="DELETE" hidden /><input type="text" name="_token" value="' + $('meta[name="csrf_token"]').attr('content') + '" hidden /><button type="button" id="' + element['id'] + '" class="btn btn-default red-bg deletePort" title="Delete">Delete</button></form></td></tr>');
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.portsTable').DataTable();
        }
    });
}