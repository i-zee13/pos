$(document).ready(function() {
    fetchCompaniesList();
    var lastOp = "add";

    $(document).on('click', '.openDataSidebarForAddingCustomer', function() {
        if (lastOp == "update") {
            $('input[name="compName"]').val("");
            $('input[name="compName"]').blur();
            $('input[name="compName"]').val("");
            $('input[name="compName"]').blur();
            $('input[name="poc"]').val("");
            $('input[name="poc"]').blur();
            $('input[name="region"]').val("");
            $('input[name="region"]').blur();
            $('input[name="address"]').val("");
            $('input[name="address"]').blur();
            $('input[name="clientName"]').val("");
            $('input[name="clientName"]').blur();
            $('input[name="mobile"]').val("");
            $('input[name="mobile"]').blur();
            $('input[name="email"]').val("");
            $('input[name="email"]').blur();
            $('input[name="webpage"]').val("");
            $('input[name="webpage"]').blur();
            $('textarea[name="meeting_mins"]').val("");
            $('textarea[name="correspondence"]').val("");
            $('textarea[name="remarks"]').val("");

            $('#saveCustomerForm').find("select").val("0").trigger('change');
        }
        lastOp = 'add';
        if ($('#saveCustomerForm input[name="_method"]').length) {
            $('#saveCustomerForm input[name="_method"]').remove();
        }
        $('input[id="operation"]').val('add');
        openSidebar();

        $('#dropifyImgFrontDiv').empty();
        $('#dropifyImgFrontDiv').append('<div class="form-wrap p-0 pt-10"><div class="upload-pic font12 pb-1">Card Front</div><input type="file" name="card_front" id="card_front"/></div>');
        $('#card_front').dropify();

        $('#dropifyImgBackDiv').empty();
        $('#dropifyImgBackDiv').append('<div class="form-wrap p-0 pt-10"><div class="upload-pic font12 pb-1">Card Back</div><input type="file" name="card_back" id="card_back"/></div>');
        $('#card_back').dropify();
    });

    $(document).on('click', '.openDataSidebarForUpdateCustomer', function() {
        $('input[id="operation"]').val('update');
        lastOp = 'update';
        $('#dataSidebarLoader').show();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();

        var id = $(this).attr('id');
        $('input[name="customer_updating_id"]').val(id);
        if (!$('#saveCustomerForm input[name="_method"]').length) {
            $('#saveCustomerForm').append('<input name="_method" value="PUT" hidden />');
        }

        $('#dropifyImgFrontDiv').empty();
        $('#dropifyImgFrontDiv').append('<div class="form-wrap p-0 pt-10"><div class="upload-pic font12 pb-1">Card Front</div><input type="file" name="card_front" id="card_front"/></div>');

        $('#dropifyImgBackDiv').empty();
        $('#dropifyImgBackDiv').append('<div class="form-wrap p-0 pt-10"><div class="upload-pic font12 pb-1">Card Back</div><input type="file" name="card_back" id="card_back"/></div>');

        $.ajax({
            type: 'GET',
            url: '/ProspectCustomers/' + id,
            success: function(response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('textarea[name="meeting_mins"]').focus();
                $('textarea[name="meeting_mins"]').val(response.info.meeting_minutes);
                $('textarea[name="meeting_mins"]').blur();

                $('textarea[name="remarks"]').focus();
                $('textarea[name="remarks"]').val(response.info.remarks);
                $('textarea[name="remarks"]').blur();

                $('textarea[name="correspondence"]').focus();
                $('textarea[name="correspondence"]').val(response.info.correspondence);
                $('textarea[name="correspondence"]').blur();

                $('input[name="compName"]').focus();
                $('input[name="compName"]').val(response.info.company_name);
                $('input[name="compName"]').blur();

                $('input[name="poc"]').focus();
                $('input[name="poc"]').val(response.info.company_poc);
                $('input[name="poc"]').blur();

                $('input[name="mobile"]').focus();
                $('input[name="mobile"]').val(response.info.mobile_phone);
                $('input[name="mobile"]').blur();

                $('input[name="address"]').focus();
                $('input[name="address"]').val(response.info.address);
                $('input[name="address"]').blur();

                $('input[name="clientName"]').focus();
                $('input[name="clientName"]').val(response.info.client_name);
                $('input[name="clientName"]').blur();

                $('input[name="region"]').focus();
                $('input[name="region"]').val(response.info.region);
                $('input[name="region"]').blur();

                $('input[name="email"]').focus();
                $('input[name="email"]').val(response.info.email);
                $('input[name="email"]').blur();

                $('input[name="webpage"]').focus();
                $('input[name="webpage"]').val(response.info.webpage);
                $('input[name="webpage"]').blur();

                $('select[name="country"]').val(response.info.country).trigger('change');
                var cardBack = response.base_url + '/storage/prospect_customers/' + response.info.card_back;
                var cardFront = response.base_url + '/storage/prospect_customers/' + response.info.card_front;
                if (response.info.card_back) {
                    $.get(cardBack)
                        .done(function() {
                            $("#card_back").attr("data-height", '100px');
                            $("#card_back").attr("data-default-file", cardBack);
                            $('#card_back').dropify();
                        })
                } else {
                    $('#card_back').dropify();
                }
                if (response.info.card_front) {
                    $.get(cardFront)
                        .done(function() {
                            $("#card_front").attr("data-height", '100px');
                            $("#card_front").attr("data-default-file", cardFront);
                            $('#card_front').dropify();
                        })
                } else {
                    $('#card_front').dropify();
                }

            }
        });

        openSidebar();
    });

    $(document).on('click', '#saveCustomer', function() {

        // if (!$('input[name="compName"]').val() || !$('input[name="poc"]').val() || !$('input[name="clientName"]').val()) {
        //     $('#notifDiv').fadeIn();
        //     $('#notifDiv').css('background', 'red');
        //     $('#notifDiv').text('Please provide all the required information (*)');
        //     setTimeout(() => {
        //         $('#notifDiv').fadeOut();
        //     }, 3000);
        //     return;
        // }

        // $('#saveCustomer').attr('disabled', 'disabled');
        // $('#cancelCustomer').attr('disabled', 'disabled');
        // $('#saveCustomer').text('Processing..');

        var ajaxUrl = "/ProspectCustomers";

        if ($('#operation').val() !== "add") {
            ajaxUrl = "/ProspectCustomers/" + $('input[name="customer_updating_id"]').val();
        }
        $('#saveCustomerForm').append('<input name="total_pocs" value="' + totalPocs + '" hidden />');
        $('#saveCustomerForm').ajaxSubmit({
            type: "POST",
            url: ajaxUrl,
            cache: false,
            success: function(response) {
                if (JSON.parse(response) == "success") {
                    $('[name="total_pocs"]').remove();
                    fetchCompaniesList();
                    $('#saveCustomer').removeAttr('disabled');
                    $('#cancelCustomer').removeAttr('disabled');
                    $('#saveCustomer').text('Save');

                    $('#notifDiv').text('Customer have been updated successfully');
                    if ($('#operation').val() !== "update") {
                        $('#saveCustomerForm').find("input[type=text], textarea").val("");
                        $('#saveCustomerForm').find("select").val("0").trigger('change');
                        $('select[name="deliveryPorts"], select[name="documentTypes"]').val("").trigger('change');
                        $('#notifDiv').text('Customer have been added successfully');
                        $('.dropify-clear').click();
                    }

                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#saveCustomer').removeAttr('disabled');
                    $('#cancelCustomer').removeAttr('disabled');
                    $('#saveCustomer').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add customer at the moment');
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

    $(document).on('click', '.deleteCustomer', function() {
        var customerId = $(this).attr('id');
        var thisRef = $(this);
        thisRef.attr('disabled', 'disabled');
        thisRef.parent().ajaxSubmit({
            type: "POST",
            url: '/ProspectCustomers/' + customerId,
            data: thisRef.parent().serialize(),
            cache: false,
            success: function(response) {
                if (response) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Customer have been deleted');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    thisRef.parent().parent().parent().remove();
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to delete the customer at this moment');
                    setTimeout(() => {
                        thisRef.removeAttr('disabled');
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
    $(document).on('click', '.upload_excel_file_btn', function() {
        //alert('here'); return;
        var thisRef = $(this);
        thisRef.text('Processing...');
        thisRef.attr('disabled', 'disabled');
        $('.close_modal').attr('disabled', 'disabled');
        $('#upload_excel_form').ajaxSubmit({
            type: "POST",
            url: '/upload_excel',
            data: $('#upload_excel_form').serialize(),
            cache: false,
            success: function(response) {
                $('.upload_excel_file_btn').removeAttr('disabled');
                $('.close_modal').removeAttr('disabled');
                $('.upload_excel_file_btn').text('Bulk Upload');
                $('.file_name').text('Choose File');
                $('.excel_file_input').val('');

                //debugger;
                var response = JSON.parse(response);
                if (response.status == 'failed') {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add customers at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    if (response.not_upload_able == '') {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Customers added successfully.');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                        $('.close_modal').click();
                        fetchCompaniesList();
                    } else {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Customers added successfully.');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                        $('.excel_file_input').val('');
                        $('.error_message_div').show();
                        $('.not_uploadable_products_table').append('<table class="table table-hover dt-responsive nowrap" id="not_uploadable_products" style="width:100%;"><thead><tr><th>Company Name</th><th>POC Name</th><th>Client Name</th><th>Country</th></tr></thead><tbody></tbody></table>');
                        $('#not_uploadable_products tbody').empty();
                        jQuery.each(response.not_upload_able, function(i, val) {
                            var test = i;
                            $('#not_uploadable_products tbody').append(`<tr><td>${val.company_name}</td><td>${val.company_poc}</td><td>${val.client_name}</td><td>${val.country}</td></tr>`);
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

function fetchCompaniesList() {
    $.ajax({
        type: 'GET',
        url: '/GetProspectCustomersList',
        success: function(response) {
            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap companiesListTable" style="width:100%;"><thead><tr><th>Date</th><th>POC</th><th>Company Name</th><th>Client Name</th><th>Mobile Number</th><th>Country</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.companiesListTable tbody').empty();
            var response = JSON.parse(response);
            response.forEach(element => {
                $('.companiesListTable tbody').append('<tr><td>' + element['created_at'] + '</td><td>' + element['company_poc'] + '</td><td>' + element['company_name'] + '</td><td>' + element['client_name'] + '</td><td>' + element['mobile_phone'] + '</td><td>' + element['country'] + '</td><td><button id="' + element['id'] + '" class="btn btn-default btn-line openDataSidebarForUpdateCustomer">Edit</button><form id="deleteCustomerForm" style="display: inline-block"><input type="text" name="_method" value="DELETE" hidden /><input type="text" name="_token" value="' + $('input[name="tokenForAjaxReq"]').val() + '" hidden /><button type="button" id="' + element['id'] + '" class="btn btn-default red-bg deleteCustomer" title="Delete">Delete</button></form></td></tr>');
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.companiesListTable').DataTable();
        }
    });
}