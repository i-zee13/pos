var glob_type = '';
var deleteRef = '';
$(document).ready(function() {
    var segments = location.href.split('/');
    var lastopp = 'add';

    if (segments['3'] == 'accounts') {
        fetchAccountList();
    }

    $(document).on('click', '.openDataSidebarForAddingAccount', function() {
        openSidebar();
        $('#operation').val('add');
        $('#dataSidebarLoader').hide();
        $('.form_div').show();
        $('._cl-bottom').show();
        $('.pc-cartlist').show();
        if (lastopp == 'update') {
            $('input[name="bank_name"]').val('');
            $('input[name="account_name"]').val('');
            $('input[name="account_num"]').val('');
            $('input[name="opening_bal"]').val('');
        }
        lastopp = 'add';
    });

    $(document).on('click', '.openDataSidebarForUpdateAccount', function() {
        openSidebar();
        $('#operation').val('update');
        lastopp = 'update';
        $('#dataSidebarLoader').show();
        $('.form_div').hide();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();
        $.ajax({
            type: 'GET',
            url: '/GetSelectedAccount/' + $(this).attr('id'),
            success: function(response) {
                var response = JSON.parse(response);
                //    console.log(response);
                //    return;
                $('#dataSidebarLoader').hide();
                $('.form_div').show();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="bank_name"]').focus();
                $('input[name="bank_name"]').val(response.bank_name);
                $('input[name="bank_name"]').blur();

                $('input[name="account_name"]').focus();
                $('input[name="account_name"]').val(response.account_name);
                $('input[name="account_name"]').blur();

                $('input[name="account_num"]').focus();
                $('input[name="account_num"]').val(response.account_num);
                $('input[name="account_num"]').blur();

                $('input[name="opening_bal"]').focus();
                $('input[name="opening_bal"]').val(response.opening_bal);
                $('input[name="opening_bal"]').blur();

                $('input[name="hidden_account_id"]').val(response.id);
            }
        });
    });

    $(document).on('click', '#saveAccount', function() {
        var thisRef = $(this);
        var verif = [];
        $('.required').each(function() {
            $(this).css("border", "0px solid red");
            if ($(this).val() == "") {
                $(this).css("border", "1px solid red");
                verif.push(false);
            } else {
                verif.push(true);
            }
        });

        if (verif.includes(false)) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        thisRef.attr('disabled', 'disabled');
        thisRef.text('Processing...');

        $('#saveAccountForm').ajaxSubmit({
            type: "POST",
            url: '/save_account',
            data: $('#saveAccountForm').serialize(),
            cache: false,
            success: function(response) {
                thisRef.removeAttr('disabled');
                $('#cancelAccount').removeAttr('disabled');
                thisRef.text('Save');

                if (JSON.parse(response) == "success") {
                    $('#pl-close').click();
                    fetchAccountList();
                    if ($('#operation').val() == "update") {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Account have been updated successfully');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    } else {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Account have been added successfully');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                        $('input[name="bank_name"]').val('');
                        $('input[name="account_name"]').val('');
                        $('input[name="account_num"]').val('');
                        $('input[name="opening_bal"]').val('');
                    }
                } else if (JSON.parse(response) == "already_exist") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Account already exist!');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add account at the moment');
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

    $(document).on('click', '.delete_account', function(){
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
            url: '/delete_account/' + thisRef.attr('id'),
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

});

function fetchAccountList() {
    $.ajax({
        type: 'GET',
        url: '/GetBankAccounts',
        data: {
            _token: $('meta[name="csrf_token"]').attr('content')
        },
        success: function(response) {
            //console.log(response);
            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap accountsListTable" style="width:100%;"><thead><tr><th>ID</th><th>Bank Name</th><th>Account Name</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.accountsListTable tbody').empty();
            var response = JSON.parse(response);
            response.forEach(element => {
                $('.accountsListTable tbody').append(`<tr><td>${element['id']}</td><td>${element['bank_name']}</td><td>${element['account_name']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateAccount">Edit</button><a id="${element['id']}" class="btn btn-default red-bg delete_account" style="background: #e20000!important; color: #fff!important">Delete</a></td></tr>`);
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.accountsListTable').DataTable();
        }
    });
}