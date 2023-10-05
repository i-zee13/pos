var glob_type = '';
var deleteRef = '';
$(document).ready(function() {
    var segments = location.href.split('/');
    var lastopp = 'add';

    if (segments['3'] == 'currency') {
        fetchCurrencyList();
    }

    $(document).on('click', '.openDataSidebarForAddingCurrency', function() {
        openSidebar();
        $('#operation').val('add');
        $('#dataSidebarLoader').hide();
        $('.form_div').show();
        $('._cl-bottom').show();
        $('.pc-cartlist').show();
        if (lastopp == 'update') {
            $('input[name="title"]').val('');
            $('input[name="symbol"]').val('');
            $('input[name="details"]').val('');
        }
        lastopp = 'add';
    });

    $(document).on('click', '.openDataSidebarForUpdateCurrency', function() {
        openSidebar();
        $('#operation').val('update');
        lastopp = 'update';
        $('#dataSidebarLoader').show();
        $('.form_div').hide();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();
        $.ajax({
            type: 'GET',
            url: '/GetSelectedCurrency/' + $(this).attr('id'),
            success: function(response) {
                var response = JSON.parse(response);
                //    console.log(response);
                //    return;
                $('#dataSidebarLoader').hide();
                $('.form_div').show();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="title"]').focus();
                $('input[name="title"]').val(response.title);
                $('input[name="title"]').blur();

                $('input[name="symbol"]').focus();
                $('input[name="symbol"]').val(response.symbol);
                $('input[name="symbol"]').blur();

                $('input[name="details"]').focus();
                $('input[name="details"]').val(response.details);
                $('input[name="details"]').blur();

                $('input[name="hidden_currency_id"]').val(response.id);
            }
        });
    });

    $(document).on('click', '#saveCurrency', function() {
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

        $('#saveCurrencyForm').ajaxSubmit({
            type: "POST",
            url: '/save_currency',
            data: $('#saveCurrencyForm').serialize(),
            cache: false,
            success: function(response) {
                thisRef.removeAttr('disabled');
                $('#cancelCurrency').removeAttr('disabled');
                thisRef.text('Save');

                if (JSON.parse(response) == "success") {
                    $('#pl-close').click();
                    fetchCurrencyList();
                    if ($('#operation').val() == "update") {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Currency have been updated successfully');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    } else {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Currency have been added successfully');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                        $('input[name="title"]').val('');
                        $('input[name="symbol"]').val('');
                        $('input[name="details"]').val('');
                    }
                } else if (JSON.parse(response) == "already_exist") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Currency already exist!');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add Currency at the moment');
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

    $(document).on('click', '.delete_currency', function(){
        
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
            url: '/delete_currency/' + thisRef.attr('id'),
            data: {
                _token: $('meta[name="csrf_token"]').attr('content')
            },
            success: function(response) {
                if (JSON.parse(response) == 'success') {
                    fetchCurrencyList();
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

function fetchCurrencyList() {
    $.ajax({
        type: 'GET',
        url: '/GetCurrency',
        data: {
            _token: $('meta[name="csrf_token"]').attr('content')
        },
        success: function(response) {
            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap currencyListTable" style="width:100%;"><thead><tr><th>S.No</th><th>Title</th><th>Symbol</th><th>Details</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.currencyListTable tbody').empty();
            var response = JSON.parse(response);
            response.forEach((element,key) => {
                $('.currencyListTable tbody').append(`<tr><td>${key+1}</td><td>${element['title']}</td><td>${element['symbol']}</td><td>${element['details']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateCurrency">Edit</button><a id="${element['id']}" class="btn btn-default red-bg delete_currency" style="background: #e20000!important; color: #fff!important">Delete</a></td></tr>`);
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.currencyListTable').DataTable();
        }
    });
}