var lastOp = "";
var glob_type = '';
var deleteRef = '';
$(document).ready(function() {

    var segments = location.href.split('/');
    var action = segments[3];
    if (action == "banks") {
        fetchBanks();
    }
    $(document).on('click', '.openDataSidebarForAddingBank', function() {
        $('.dropify-clear').click();
        $('select[name="account_type"]').val('1').trigger('change');
        $('input[name="bank_acc_id"]').val("");
        // $('select[name="bank_id"]').val('1').trigger('change');
        $('input[name="bank_name"]').val("");
        $('input[name="acc_title"]').val("");
        $('input[name="acc_number"]').val("");
        $('input[name="open_balance"]').val("");
        $('input[name="publish_service"]').prop('checked', false);
        $('#dataSidebarLoader').hide();
        $('.dz-image-preview').remove();
        $('.dz-default').show();
        if (lastOp == "update") {
            $('select[name="account_type"]').val('1').trigger('change');
            // $('select[name="bank_id"]').val('1').trigger('change');

            $('input[name="bank_name"]').val("");
            $('input[name="bank_name"]').blur();

            $('input[name="acc_title"]').val("");
            $('input[name="acc_title"]').blur();

            $('input[name="acc_number"]').val("");
            $('input[name="acc_number"]').blur();
            
            $('input[name="open_balance"]').val("");
            $('input[name="open_balance"]').blur();

            $('input[name="publish_service"]').prop('checked', false);
             
        }
        openSidebar();
    });
    $(document).on('click', '.openDataSidebarForUpdateBank', function() {
        $('#dataSidebarLoader').show();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();

        var id = $(this).attr('id');
        $('input[name="bank_acc_id"]').val(id);
        $.ajax({
            type: 'GET',
            url: '/edit-bank/'+id,
            success: function(response) {
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();
                $('select[name="account_type"]').val(response.bank.account_type).trigger('change');
                // $('select[name="bank_id"]').val(response.bank.bank_id).trigger('change');


                
                $('input[name="bank_name"]').focus();
                $('input[name="bank_name"]').val(response.bank.bank_name);
                $('input[name="bank_name"]').blur();

                $('input[name="acc_title"]').focus();
                $('input[name="acc_title"]').val(response.bank.acc_title);
                $('input[name="acc_title"]').blur();

                $('input[name="acc_number"]').focus();
                $('input[name="acc_number"]').val(response.bank.acc_number);
                $('input[name="acc_number"]').blur();

                $('input[name="open_balance"]').focus();
                $('input[name="open_balance"]').val(response.bank.open_balance);
                $('input[name="open_balance"]').blur();

                // if (response.category.publish ==1) {
                //     $('.yes').prop('checked', true);
                // }else{
                //     $('.no').prop('checked', true);

                // } 
               
            }
        });

        openSidebar();
    });
    $(document).on('click', '#saveBank', function() {
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
       
        $('#saveBank').attr('disabled', 'disabled');
        $('#cancelBank').attr('disabled', 'disabled');
        $('#saveBank').text('Processing..');

        $('#saveBankForm').ajaxSubmit({
            type: "POST",
            url : '/save-bank',
            success: function(response) {
                if(response.status == "validation_error") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the required information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    $('#saveBank').removeAttr('disabled');
                    $('#cancelBank').removeAttr('disabled');
                    $('#saveBank').text('Save');
                }
                if(response.status == "duplicate") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Account# Already Exist with This Bank');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    $('#saveBank').removeAttr('disabled');
                    $('#cancelBank').removeAttr('disabled');
                    $('#saveBank').text('Save');
                }
                if (response.status == "success") {
                    fetchBanks();
                    $('#saveBankForm')[0].reset();

                    $('#saveBank').removeAttr('disabled');
                    $('#cancelBank').removeAttr('disabled');
                    $('#saveBank').text('Save');

                    $('#notifDiv').text('Bank Account have been updated successfully');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    closeSidebar();
                } 
                 if (response.status == "failed") {

                    $('#saveBank').removeAttr('disabled');
                    $('#cancelBank').removeAttr('disabled');
                    $('#saveBank').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add Bank at the moment');
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
    $(document).on('click', '.delete-bank', function(){
        var id = $(this).attr('id');
        glob_type = $(this).attr('name');
        $('.confirm_delete').attr('id', id);
        deleteRef = $(this); 
        $('#hidden_btn_to_open_modal').click();
    })
    $(document).on('click', '.confirm_delete', function() {
        var bankId = $(this).attr('id');
        var thisRef = $(this); 
        deleteRef.attr('disabled', 'disabled');
        $.ajax({
            type    :   'get',
            url     :   '/del-bank/'+bankId,
            data    :   deleteRef.parent().serialize(),
            cache   :   false,
            success :   function(response) { 
                        if (response) {
                            $('#notifDiv').fadeIn();
                            $('#notifDiv').css('background', 'green');
                            $('#notifDiv').text('Bank has been deleted');
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
function fetchBanks() {
    $.ajax({
        type    :     'GET',
        url     :     '/get-banks',
        success :     function(response) {
                    $('.body').empty();
                    $('.body').append(`
                    <table class="table table-hover dt-responsive nowrap BanksListTable" style="width:100%;">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Type</th>
                                <th>Acc Title</th>
                                <th>Account #</th>
                                <th>Opening Bal</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>`);
                    $('.BanksListTable tbody').empty();
                    // var response = JSON.parse(response);
                    var sNo = 1;
                    response.banks.forEach((element, key) => {
                        $('.BanksListTable tbody').append(`
                        <tr>
                            <td>${key + 1}</td>
                            <td>${element['account_type']==1 ? 'Bank Account' : ' Payment Gateway Account'}</td>
                        
                            <td>${element['acc_title']}</td>
                            <td>${element['acc_number']}</td>
                            <td>${element['open_balance']}</td>
                            <td>
                                <button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateBank">Edit</button>
                                <form id="deleteBankegoryForm" style="display: inline-block">
                                        <input type="text" name="_method" value="DELETE" hidden />
                                        <input type="text" name="_token" value="${$('meta[name="csrf_token"]').attr('content')} " hidden /><button type="button" id="${ element['id'] }" class="btn btn-default red-bg deleteBankegory delete-bank" name="del-bank" title="Delete">Delete</button>
                                </form>
                            </td>
                        </tr>`);
                    });
                    $('#tblLoader').hide();
                    $('.body').fadeIn();
                    $('.BanksListTable').DataTable();
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
                            `<option data-id="${data.id}" value="${data.id}">${data.bank_name}</option>`
                        )
                    })
        }
    })
}

$(document).on('click', '.dropify-clear', function () {
    var old_input_name = $(this).parent().children('input').attr('data-old_input');
    $('input[name="' + old_input_name + '"]').val('');
});

