$(document).ready(function () {
    var segments = location.href.split('/');
    var notifications = [];

    $('#expiry_date').datepicker({
        format: 'yyyy-mm-dd'
    });

    $('#manufacturing_date').datepicker({
        format: 'yyyy-mm-dd'
    });


    fetchBatchList();


    var lastOp = "add";

    $(document).on('click', '.openDataSidebarForAddingEmployee', function () {
        

        if (lastOp == "update") {

            $('input[name="batch_id"]').val("");
            $('input[name="batch_id"]').blur();

            $('input[name="batch_type"]').val("");
            $('input[name="batch_type"]').blur();

            $('input[name="expiry_date"]').val("");
            $('input[name="expiry_date"]').blur();

            $('input[name="manufacturing_date"]').val("");
            $('input[name="manufacturing_date"]').blur();

            $('input[name="supplier"]').val("");
            $('input[name="supplier"]').blur();
        }
        $('#saveEmployee').text('Add');
        lastOp = 'add';
        $('#operation').val('add');
        openSidebar();
        $('#saveEmployeeForm').trigger('reset');
        $( "#supplier" ).val('').trigger('change');
        $( "#batch_status" ).val('').trigger('change');
        $( "#batch_type" ).val('').trigger('change');
    });

    $(document).on('click', '.openDataSidebarForUpdateEmployee', function () {
        $('#saveEmployee').text('Update');
        $('#operation').val('update');
        lastOp = 'update';
        $('#dataSidebarLoader').show();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();
        var id = $(this).attr('id');
        $('input[name="employee_updating_id"]').val(id)
        $.ajax({
            type: 'GET',
            url: '/batch/' + id,
            success: function (response) {
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();
                $('#uploadedImg').remove();
                $('input[name="batch_id"]').val(response.batch_id);
                $('input[name="batch_type"]').val(response.batch_type);
                $('input[name="manufacturing_date"]').val(response.batch_manufacturing_date);
                $('input[name="expiry_date"]').val(response.batch_expiry_date);
                $('input[name="remarks"]').val(response.remarks);
                var supplier_id = response.supplier_id;

                // $(`#supplier option[value=${supplier_id}]`).attr('selected','selected');
                var batchTypeOptionsArray = ['<option selected>Batch Type</option>', '<option>General Production</option>', '<option>Private Label</option>'];
                $('#batch_type').empty()
                batchTypeOptionsArray.forEach((option) => {
                    var state = option.includes(response.batch_type);
                 
                    if (state) {
                        $('#batch_type').append(`<option value="${response.batch_type}" selected>${response.batch_type}</option>`)
                    } else {
                        $('#batch_type').append(option);
                    }
                })
                var batchStatusOptionsArray = ['<option value="0" selected>Batch Status</option>', '<option value="New">New</option>', '<option value="closed">closed</option>', '  <option value="On Going">On Going</option>'];
                $('#batch_status').empty()
                batchStatusOptionsArray.forEach((option) => {
                    var state = option.includes(response.batch_status);
                 
                    if (state) {
                        $('#batch_status').append(`<option value="${response.batch_status}" selected>${response.batch_status}</option>`)
                    } else {
                        $('#batch_status').append(option);
                    }
                })
                $('#supplier').empty()
                $('#supplier').append(`<option value="1">Multifood Factory</option>`);
               
            }
        });
        openSidebar();
    });

    $(document).on('click', '#saveEmployee', function () {
        // if ($('#operation').val() == "add") {
        //     if (!$('input[name="password"]').val()) {
        //         $('#notifDiv').fadeIn();
        //         $('#notifDiv').css('background', 'red');
        //         $('#notifDiv').text('Please provide all the required information (*)');
        //         setTimeout(() => {
        //             $('#notifDiv').fadeOut();
        //         }, 3000);
        //         return;
        //     }
        // }
        if (!$('input[name="batch_id"]').val()) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        if ($('input[name="batch_status"]').find(':selected').val() == 0) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        $('#saveEmployee').attr('disabled', 'disabled');
        $('#cancelEmployee').attr('disabled', 'disabled');
        $('#saveEmployee').text('Processing..');
        var ajaxUrl = "/add-batch";

        if (lastOp !== "add") {
            ajaxUrl = "/update-batch/" + $('input[name="employee_updating_id"]').val();
        }

        $('#saveEmployeeForm').ajaxSubmit({
            type: "POST",
            url: ajaxUrl,
            data: $('#saveEmployeeForm').serialize(),
            cache: false,
            success: function (response) {
                if (response == 'success') {
                    fetchBatchList();
                    $('#saveEmployee').removeAttr('disabled');
                    $('#cancelEmployee').removeAttr('disabled');
                    $('#saveEmployee').text('Save');

                    if ($('#operation').val() !== "update") {
                        $('#saveEmployeeForm').find("input[type=text], textarea").not('#operation').val("");
                    }

                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Batch have been added successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    closeSidebar()
                } else {
                    $('#saveEmployee').removeAttr('disabled');
                    $('#cancelEmployee').removeAttr('disabled');
                    $('#saveEmployee').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add Batch at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    closeSidebar()
                }
            },
            error: function (err) {
                $('#saveEmployee').removeAttr('disabled');
                $('#cancelEmployee').removeAttr('disabled');
                $('#saveEmployee').text('Save');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Failed to add Batch at the moment');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                closeSidebar()
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function (i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                    });
                }
            }
        });
    });
});

function fetchBatchList() {
    $.ajax({
        type: 'GET',
        url: '/batch-list',
        success: function (response) {
            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap employeesListTable" style="width:100%"><thead><tr><th>Batch ID</th><th>Batch Name</th><th>Batch Type</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.employeesListTable tbody').empty();
            response.forEach(element => {
                $('.employeesListTable tbody').append(`<tr><td>${element['id']}</td><td>${element['batch_id']}</td><td>${element['batch_type']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateEmployee">Edit</button><button id="${element['id']}" onclick="deleteBatch(${element['id']})" class="btn btn-default empStatusChange" active="${element.active}">Delete</button></td></tr>`);
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.employeesListTable').DataTable();
        }
    });
}
function deleteBatch(id) {
    $.ajax({
        type: 'GET',
        url: `/delete-batch/${id}`,
        success: function (response) {
            if (response == 'success') {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Batch have been Deleted successfully');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                fetchBatchList();
            } else {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Something Went Wrong');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                fetchBatchList();
            }

        }
    });
}