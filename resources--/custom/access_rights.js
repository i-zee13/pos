$(document).ready(function() {

    fetchAccessRights();
    var lastOp = "add";
    var currentEmpId = 0;

    $(document).on('click', '.openDataSidebarForAddingAccessRights', function() {
        $('#dataSidebarLoader').hide();
        $('[name="rights[]"]').prop('checked', false);
        $('input[id="operation"]').val('add');
        openSidebar();
        $('#employeesRow').show();
    });

    $(document).on('click', '.openDataSidebarForUpdateAccessRights', function() {
        $('[name="rights[]"]').prop('checked', false);

        $('#dataSidebarLoader').show();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();

        $('input[id="operation"]').val('update');
        openSidebar();

        $('#employeesRow').hide();

        currentEmpId = $(this).attr('id');
        $.ajax({
            type: "GET",
            url: 'AccessRights/' + currentEmpId,
            success: function(response) {
                var response = JSON.parse(response);
                response.forEach(element => {
                    $('input[value="' + element["controller_right"] + '"]').prop('checked', true);
                });

                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();
            }
        });

    });

    $(document).on('click', '#saveRights', function() {

        $('#saveRights').attr('disabled', 'disabled');
        $('#cancelRights').attr('disabled', 'disabled');
        $('#saveRights').text('Processing..');

        var ajaxUrl = "/AccessRights";
        if ($('#operation').val() !== "add") {
            ajaxUrl = "/AccessRights/" + currentEmpId;
        }

        $('#saveRightsForm').ajaxSubmit({
            type: $('#operation').val() !== "add" ? "PUT" : "POST",
            url: ajaxUrl,
            data: $('#saveRightsForm').serialize(),
            cache: false,
            success: function(response) {
                if (JSON.parse(response) == "success") {
                    fetchAccessRights();
                    $('#saveRights').removeAttr('disabled');
                    $('#cancelRights').removeAttr('disabled');
                    $('#saveRights').text('Save');

                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Access Rights have been assigned successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else if (JSON.parse(response) == "exist") {
                    $('#saveRights').removeAttr('disabled');
                    $('#cancelRights').removeAttr('disabled');
                    $('#saveRights').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Rights already given. Please update this employee\'s existing rights');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#saveRights').removeAttr('disabled');
                    $('#cancelRights').removeAttr('disabled');
                    $('#saveRights').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add rights at the moment');
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

    $(document).on('click', '.deleteAccessRight', function() {
        var typeId = $(this).attr('id');
        var thisRef = $(this);
        thisRef.attr('disabled', 'disabled');
        $.ajax({
            type: "GET",
            url: '/revokeAccRight/' + typeId,
            data: thisRef.parent().serialize(),
            cache: false,
            success: function(response) {
                if (JSON.parse(response) == "success") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Access Rights have been revoked');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    thisRef.parent().parent().remove();
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to revoke rights at this moment');
                    setTimeout(() => {
                        thisRef.removeAttr('disabled');
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        });
    });

});

function fetchAccessRights() {
    $.ajax({
        type: 'GET',
        url: '/listAllRights',
        success: function(response) {
            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap rightsTable" style="width:100%;"><thead><tr><th>S.No</th><th>Employee</th><th>Total Rights</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.rightsTable tbody').empty();
            var response = JSON.parse(response);
            var sNo = 1;
            response.forEach(element => {
                $('.rightsTable tbody').append('<tr><td>' + sNo++ + '</td><td>' + element['name'] + '</td><td>' + element['total_rights'] + '</td><td><button id="' + element['employee_id'] + '" class="btn btn-default btn-line openDataSidebarForUpdateAccessRights">Update</button><button type="button" id="' + element['employee_id'] + '" class="btn btn-default red-bg deleteAccessRight" title="Revoke">Revoke</button></td></tr>');
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.rightsTable').DataTable()
        }
    });
}