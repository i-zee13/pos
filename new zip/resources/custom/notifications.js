$(document).ready(function() {
    var segments = location.href.split('/');
    var action = segments[3];
    var notifications = [];
    var notif_ids = [];
    var filterDate = 0;
    var filterStartDate = '';
    var filterEndDate = '';

    if (action !== "" && action !== "home") {
        // $('.notifications_list_all').each(function() {
        //     notif_ids.push($(this).attr('id'));
        // });

        // $.ajax({
        //     type: 'POST',
        //     url: '/read_notif_four',
        //     data: {
        //         _token: $('input[name="_token"]').val(),
        //         notif_ids: notif_ids
        //     },
        //     success: function(response) {
        //         var response = JSON.parse(response);
        //         //console.log(response);
        //     }
        // });
    }
    if(action == 'ViewAllNotifications'){
        fetchALlNotifications();
    }

    $(document).on('change', '#employee_id', function() {
        $('#table_notif').show();
        $('#update_emp_pref').attr('disabled', 'disabled');
        $('.consignment_box').attr('disabled', 'disabled');
        $('.complains_box').attr('disabled', 'disabled');
        $('.suggestions_box').attr('disabled', 'disabled');
        $('#update_emp_pref').text('Processing..');
        $('.check_box').prop('checked', false);
        var id = $('#employee_id').val();
        $.ajax({
            type: 'GET',
            url: '/Notifications/' + id,
            success: function(response) {
                $('#update_emp_pref').removeAttr('disabled');
                $('.consignment_box').removeAttr('disabled');
                $('.complains_box').removeAttr('disabled');
                $('.suggestions_box').removeAttr('disabled');
                $('#update_emp_pref').text('Save');
                var response = JSON.parse(response);
                notifications = [];
                response.forEach(element => {
                    $('input[id="' + element['notification_code_id'] + '"]').each(function() {
                        if ($(this).val() == "email") {
                            $(this).prop('checked', (element['email'] == "1" ? true : false));
                            if (element["email"] == "1") {
                                notifications.push({
                                    code: element['notification_code_id'],
                                    properties: ["email"]
                                });
                            }
                        } else {
                            $(this).prop('checked', (element['web'] == "1" ? true : false));
                            if (element["web"] == "1") {
                                notifications.push({
                                    code: element['notification_code_id'],
                                    properties: ["web"]
                                });
                            }
                        }
                    });
                });
            }
        });
    });

    $(document).on('click', '.check_box', function() {
        var id = $(this).attr('id');
        var value = $(this).val();
        if (notifications.find(x => x["code"] == id)) {
            notifications.find(x => {
                if (x["code"] == id) {
                    if (x["properties"].includes(value)) {
                        x["properties"].splice(x["properties"].indexOf(value), 1);
                    } else {
                        x["properties"].push(value);
                    }
                }
            });
        } else {
            notifications.push({
                code: id,
                properties: [$(this).val()]
            });
        }
    });

    $(document).on('click', '#update_emp_pref', function() {

        if ($('#employee_id').val() == 0 || $('#employee_id').val() == null) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please select Employee');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        if (notifications == "") {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Check Notification First');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        var emp_id = $('#employee_id').val();

        $('#update_emp_pref').attr('disabled', 'disabled');
        $('.consignment_box').attr('disabled', 'disabled');
        $('.complains_box').attr('disabled', 'disabled');
        $('.suggestions_box').attr('disabled', 'disabled');
        $('#update_emp_pref').text('Processing..');
        $.ajax({
            type: 'POST',
            url: '/Notifications',
            data: {
                _token: $('input[name="_token"]').val(),
                emp_id: emp_id,
                notifications: notifications
            },
            success: function(response) {
                if (JSON.parse(response) == "success") {
                    $('#update_emp_pref').removeAttr('disabled');
                    $('.consignment_box').removeAttr('disabled');
                    $('.complains_box').removeAttr('disabled');
                    $('.suggestions_box').removeAttr('disabled');
                    $('#update_emp_pref').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Saved Successfully');
                    $('#employee_id').val(0).trigger('change');
                    $('.check_box').prop('checked', false);
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#update_emp_pref').removeAttr('disabled');
                    $('.consignment_box').removeAttr('disabled');
                    $('.complains_box').removeAttr('disabled');
                    $('.suggestions_box').removeAttr('disabled');
                    $('#update_emp_pref').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to save at the moment!');
                    $('#employee_id').val(0).trigger('change');
                    $('.check_box').prop('checked', false);
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }

            }
        });
    });

    $(document).on('change', '.notif_date_filter', function(){
        filterDate = $(this).val();
        if($(this).val() == 5){
            $('.notif_custom_div').show();
        }else{
            $('.notif_custom_div').hide();
            fetchALlNotifications(filterDate, filterStartDate, filterEndDate);
        }
    });

    $(document).on('change', '.notif_start_date', function(){
        filterStartDate = $(this).val();
        if(filterEndDate){
            fetchALlNotifications(filterDate, filterStartDate, filterEndDate);
        } 
    });

    $(document).on('change', '.notif_end_date', function(){
        filterEndDate = $(this).val()
        if(filterStartDate){
            fetchALlNotifications(filterDate, filterStartDate, filterEndDate);
        }
    });

    var searchQuery = '';
    $(document).on('input', '.searchNotif', function(){
        if($(this).val() == ''){
            searchQuery = null;
            $('.emp-name').unmark(searchQuery);
            $('.time_interval').unmark(searchQuery);
            $('.heading-up').unmark(searchQuery);
            $('._description').unmark(searchQuery);
            $('._action').unmark(searchQuery);
            $('.heading_dw').unmark(searchQuery);
        }else{
            $('.emp-name').unmark(searchQuery);
            $('.time_interval').unmark(searchQuery);
            $('.heading-up').unmark(searchQuery);
            $('._description').unmark(searchQuery);
            $('._action').unmark(searchQuery);
            $('.heading_dw').unmark(searchQuery);
            searchQuery = $(this).val();
        }
        searchWords(searchQuery);
    });


});

function fetchALlNotifications(date = null, start_date = null, end_date = null){
    //$('#tblLoader').fadeIn();
    //$('.body').hide();
    $('.notificationList').empty();
    $.ajax({
        type: 'GET',
        url: '/fetchAllNotifications',
        data: {
            date: date,
            start_date: start_date,
            end_date: end_date
        },
        success: function(response) {
            var response = JSON.parse(response);
            var today = new Date();
            var date2 = "2019-10-25 12:03:55";
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date+' '+time;
            var start = moment(dateTime);
            response.notifications.forEach(element => {
                var duration = (moment.duration(moment(start).diff(moment(element.created_at))).get("days") ? moment.duration(moment(start).diff(moment(element.created_at))).get("days") + " days ago" : (moment.duration(moment(start).diff(moment(element.created_at))).get("hours") ? moment.duration(moment(start).diff(moment(element.created_at))).get("hours") + " hours ago" : (moment.duration(moment(start).diff(moment(element.created_at))).get("minutes") ? moment.duration(moment(start).diff(moment(element.created_at))).get("minutes") + " minutes ago" : (moment.duration(moment(start).diff(moment(element.created_at))).get("seconds") + " seconds ago"))));
                $('.notificationList').append(` 
                <li>
                    <div class="row">
                        <div class="col-3"><img class="NotiImg" src="${ element.picture ? response.url+'/'+element.picture : '/images/avatar.svg' }" alt="">
                        <h4 class="emp-name">${element.created_by}</h4><small class="time_interval">${ duration }</small>
                        </div>
                        <div class="col-9 border-left">
                        <h4><span class="blue-text heading-up">${(element.order_id ? "Order " : (element.customer_id ? 'Customer' : (element.supplier_id ? 'Supplier' : (element.prospect_customer_id ? 'Prospect Customer' : 'Item'))))}</span></h4>
                       <span class="heading_dw"> ${(element.order_id ? "Order " : (element.customer_id ? 'Customer' : (element.supplier_id ? 'Supplier' : (element.prospect_customer_id ? 'Prospect Customer' : 'Item'))))}</span> <strong class="_action">${element._name}</strong> <span class="_description">${element.message}</span>
                        </div>
                    </div>
                </li>`);
            });
        }
    });
}

function searchWords(searchQuery){
    $('.emp-name').mark(searchQuery);
    $('.time_interval').mark(searchQuery);
    $('.heading-up').mark(searchQuery);
    $('._description').mark(searchQuery);
    $('._action').mark(searchQuery);
    $('.heading_dw').mark(searchQuery);
}