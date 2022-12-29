$(document).ready(function() {
    var segments = location.href.split('/');
    var notifications = [];

    $('#datepicker').datepicker({
        format: 'yyyy-mm-dd'
    });

    if (segments[3] != 'Profile' && segments[3] != 'device_logs') {
        fetchEmployeesList();
    }
    $('.profile-pic').dropify();


    var lastOp = "add";

    $(document).on('click', '.openDataSidebarForAddingEmployee', function() {
        
        $('#dataSidebarLoader').hide();
        $('#saveEmployeeForm')[0].reset();
        $('.formselect').select2();
        if (lastOp == "update") {

            $('input[name="name"]').val("");
            $('input[name="name"]').blur();

            $('input[name="phone"]').val("");
            $('input[name="phone"]').blur();

            $('input[name="email"]').val("");
            $('input[name="email"]').blur();

            $('input[name="sin"]').val("");
            $('input[name="sin"]').blur();

            $('input[name="city"]').val("");
            $('input[name="city"]').blur();

            $('input[name="state"]').val("");
            $('input[name="state"]').blur();

            $('input[name="address"]').val("");
            $('input[name="address"]').blur();

            $('input[name="username"]').val("");
            $('input[name="username"]').blur();

            $('input[name="hiring"]').val("");

            $('input[name="salary"]').val("");
            $('input[name="salary"]').blur();

            $('select[name="country"]').val(0).trigger('change');
            $('select[name="designation"]').val(0).trigger('change');
            $('select[name="reporting"]').val(0).trigger('change');
            $('select[name="department"]').val(0).trigger('change');
        }
        lastOp = 'add';
        $('#operation').val('add');
        $('.operation').val('add');
        openSidebar();
        $('#dropifyImgDiv').empty();
        $('#dropifyImgDiv').append('<input type="file" name="employeePicture" id="employeePicture" />');
        $('#employeePicture').dropify();
    });

    $(document).on('click', '.openDataSidebarForUpdateEmployee', function() {
        $('#saveEmployeeForm')[0].reset();
        $('.formselect').select2();
        $('#operation').val('update');
        lastOp = 'update';
        $('#dataSidebarLoader').show();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();

        $('#dropifyImgDiv').empty();
        $('#dropifyImgDiv').append('<input type="file" name="employeePicture" id="employeePicture" />');

        var id = $(this).attr('id');
        console.log( $('#employee_updating_id').val(id));
        $('#employee_updating_id').val(id)
        $.ajax({
            type: 'GET',
            url: '/Employee/' + id,
            success: function(response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();
                $('#uploadedImg').remove();

                $('input[name="name"]').focus();
                $('input[name="name"]').val(response.employee.name);
                $('input[name="name"]').blur();

                $('input[name="phone"]').focus();
                $('input[name="phone"]').val(response.employee.phone);
                $('input[name="phone"]').blur();

                $('input[name="email"]').focus();
                $('input[name="email"]').val(response.employee.email);
                $('input[name="email"]').blur();

                $('input[name="sin"]').focus();
                $('input[name="sin"]').val(response.employee.sin);
                $('input[name="sin"]').blur();

                $('input[name="city"]').focus();
                $('input[name="city"]').val(response.employee.city);
                $('input[name="city"]').blur();

                $('input[name="state"]').focus();
                $('input[name="state"]').val(response.employee.state);
                $('input[name="state"]').blur();

                $('input[name="address"]').focus();
                $('input[name="address"]').val(response.employee.address);
                $('input[name="address"]').blur();

                $('input[name="username"]').focus();
                $('input[name="username"]').val(response.employee.username);
                $('input[name="username"]').blur();

                $('input[name="hiring"]').val(response.employee.hiring);

                $('input[name="salary"]').focus();
                $('input[name="salary"]').val(response.employee.salary);
                $('input[name="salary"]').blur();

                $('select[name="country"]').val(response.employee.country).trigger('change');
                $('select[name="designation"]').val(response.employee.designation).trigger('change');
                $('select[name="reporting"]').val(response.employee.reporting_to).trigger('change');
                $('select[name="department"]').val(response.employee.department_id).trigger('change');

                var imgUrl = response.base_url + response.employee.picture;
                $("#employeePicture").attr("data-height", '100px');
                $("#employeePicture").attr("data-default-file", imgUrl);
                $('#employeePicture').dropify();
            }
        });

        openSidebar();
    });

    $(document).on('click', '#saveEmployee', function() {
        if ($('#operation').val() == "add") {
            if (!$('input[name="password"]').val()) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please provide all the required information (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
        }
        if (!$('input[name="name"]').val() || !$('select[name="city"]').val() || !$('input[name="username"]').val() || $('select[name="country"]').val() == 0 || $('select[name="designation"]').val() == 0 || $('select[name="department"]').val() == 0) {
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
        var ajaxUrl = "/register";

        if ($('#operation').val() !== "add") {
            ajaxUrl = "/UpdateEmployee/" + $('input[name="employee_updating_id"]').val();
        }

        $('#saveEmployeeForm').ajaxSubmit({
            type: "POST",
            url: ajaxUrl,
            data: $('#saveEmployeeForm').serialize(),
            cache: false,
            success: function(response) {
                if (response) {
                    fetchEmployeesList();
                    $('#saveEmployee').removeAttr('disabled');
                    $('#cancelEmployee').removeAttr('disabled');
                    $('#saveEmployee').text('Save');

                    if ($('#operation').val() !== "update") {
                        $('#saveEmployeeForm').find("input[type=text], textarea").not('#operation').val("");
                        $('#saveEmployeeForm').find("select").val("0").trigger('change');
                        $('.dropify-clear').click();
                    }

                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Employee have been added successfully');
                    setTimeout(() => {
                        location.reload();
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#saveEmployee').removeAttr('disabled');
                    $('#cancelEmployee').removeAttr('disabled');
                    $('#saveEmployee').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add Employee at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            },
            error: function(err) {
                $('#saveEmployee').removeAttr('disabled');
                $('#cancelEmployee').removeAttr('disabled');
                $('#saveEmployee').text('Save');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Failed to add Employee at the moment');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function(i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                    });
                }
            }
        });
    });



    //Change Password User Profile
    $(document).on('click', '#update_userpassword', function() {
        if ($('#current_password').val() != "" || $('#new_password').val() != "" || $('#confirm_password').val() != "") {
            if ($('#new_password').val() != $('#confirm_password').val()) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('New Password and Confirm Password does not match!');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if ($('#new_password').val().length < 6 || $('#confirm_password').val().length < 6) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('New Password and Confirm Password should have atleast 6 characters');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
        }

        $(this).text('PROCESSING....');
        $(this).attr("disabled", "disabled");
        $('#saveEditProfileForm').ajaxSubmit({
            type: "POST",
            url: "/update_user_password",
            data: $('#saveEditProfileForm').serialize(),
            cache: false,
            success: function(response) {
                $("#update_userpassword").removeAttr('disabled');
                $("#update_userpassword").text('Save Changes');
                if (JSON.parse(response) == "success") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Updated successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    location.reload();
                } else if (JSON.parse(response) == "failed") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to update');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else if (JSON.parse(response) == "empty") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please fill all fields.');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Password does not match.');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        });
    });

    //Change Picture User Profile
    $(document).on('click', '#save_pic_user_profile', function() {
        $(this).text('PROCESSING....');
        $(this).attr("disabled", "disabled");
        $('#saveEditProfilePictureForm').ajaxSubmit({
            type: "POST",
            url: "/update_user_profile_pic",
            data: $('#saveEditProfilePictureForm').serialize(),
            cache: false,
            success: function(response) {
                $("#save_pic_user_profile").removeAttr('disabled');
                $("#save_pic_user_profile").text('Save');
                if (JSON.parse(response) == "success") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Updated successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    location.reload();
                } else if (JSON.parse(response) == "failed") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to update');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else if (JSON.parse(response) == "empty") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please select picture to upload.');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        });
    });

    //Get user Notifications
    $(document).on('click', '#tab4', function() {
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
            url: '/notif_pref_against_emp/' + id,
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
                                var value = $(this).val();
                                if (notifications.find(x => x["code"] == element['notification_code_id'])) {
                                    notifications.find(x => {
                                        if (x["code"] == element['notification_code_id']) {
                                            if (x["properties"].includes(value)) {
                                                x["properties"].splice(x["properties"].indexOf(value), 1);
                                            } else {
                                                x["properties"].push(value);
                                            }
                                        }
                                    });
                                } else {
                                    notifications.push({
                                        code: element['notification_code_id'],
                                        properties: [$(this).val()]
                                    });
                                }
                            }
                        } else {
                            $(this).prop('checked', (element['web'] == "1" ? true : false));
                            if (element["web"] == "1") {
                                var value = $(this).val();
                                if (notifications.find(x => x["code"] == element['notification_code_id'])) {
                                    notifications.find(x => {
                                        if (x["code"] == element['notification_code_id']) {
                                            if (x["properties"].includes(value)) {
                                                x["properties"].splice(x["properties"].indexOf(value), 1);
                                            } else {
                                                x["properties"].push(value);
                                            }
                                        }
                                    });
                                } else {
                                    notifications.push({
                                        code: element['notification_code_id'],
                                        properties: [$(this).val()]
                                    });
                                }
                            }
                        }
                    });
                });
            }
        });
    });

    //Employee checkboxes
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
        //console.log(notifications);
    });

    $(document).on('click', '.empStatusChange', function() {
        let status = $(this).attr('active') == "1" ? "0" : "1";
        $(this).attr('disabled', true)
        ajaxer('/ChangeEmpStatus', 'POST', {
            "_token": $('meta[name="csrf_token"]').attr('content'),
            'id': $(this).attr('id'),
            'status': status
        }).then(x => {
            $(this).removeAttr('disabled')
            $(this).text(status == "1" ? "Deactive" : "Active");
            $(this).attr("active", status);
        })
    });

    //Save Employee notifications
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
            url: '/save_pref_against_emp',
            data: {
                _token: $('input[name="_token"]').val(),
                emp_id: emp_id,
                notifications: notifications
            },
            success: function(response) {
                $('#update_emp_pref').removeAttr('disabled');
                $('.consignment_box').removeAttr('disabled');
                $('.complains_box').removeAttr('disabled');
                $('.suggestions_box').removeAttr('disabled');
                $('#update_emp_pref').text('Save');
                if (JSON.parse(response) == "success") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Saved Successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to save at the moment!');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }

            }
        });
    });
    
    $(document).on('click', '.view_device_logs', function(){
        $('.body_modal').empty();
        var thisRef = $(this);
        thisRef.text('Processing...');
        thisRef.attr('disabled', 'disabled');
        $.ajax({
            type: 'GET',
            url: '/GetDeviceLogs/' + thisRef.attr('id'),
            success: function(response) {
                var response = JSON.parse(response);
                thisRef.text('View Device History');
                thisRef.removeAttr('disabled');
                $('.open_log_modal').click();
                $('.body_modal').append('<table class="table table-hover dt-responsive nowrap device_logs_table" style="width:100%"><thead><tr><th>Emp ID</th><th>Device Id</th><th>Model</th><th>App Version</th><th>Action</th></tr></thead><tbody></tbody></table>');
                $('.device_logs_table tbody').empty(); 
                response.forEach(element => { 
                    $('.device_logs_table tbody').append(`<tr><td>${element['user_id']}</td><td>${element['device_id']}</td><td>${element['device_model']}</td><td>${element['app_version']}</td><td><button user="${element['user_id']}" id="${element['device_id']}" class="btn btn-default device_activation ${element['is_active'] == 1 ? "red-bg" : ""}" current_status="${element['is_active']}">${element['is_active'] == 1 ? "Deactivate" : "Activate"}</button></td></tr>`);
                }); 
                $('.device_logs_table').DataTable();
            }
        });
    });

    $(document).on('click', '.device_activation', function(){
        var thisRef = $(this);
        var current_status = thisRef.attr('current_status');
        var device_id = thisRef.attr('id');
        var user = thisRef.attr('user');
        thisRef.attr('disabled', 'disabled'); 
        $.ajax({
            type: 'POST',
            url: '/update_device_activation',
            data: {
                _token: $('input[name="_token"]').val(),
                device_id: device_id,
                current_status: current_status,
                user: user
            },
            success: function(response) {
                thisRef.removeAttr('disabled');
                
                if (JSON.parse(response) == "success") {
                    $('.close_excel_modal').click();
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Saved Successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to update at the moment!');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }

            }
        });
    })

});

function fetchEmployeesList() {
    $.ajax({
        type: 'GET',
        url: '/EmployeesList',
        success: function(response) {
            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap employeesListTable" style="width:100%"><thead><tr><th>Emp ID</th><th>Employee Name</th><th>Phone</th><th>Designation</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.employeesListTable tbody').empty();
            var response = JSON.parse(response);
            response.forEach(element => {
                $('.employeesListTable tbody').append(`<tr><td>${element['id']}</td><td>${element['name']}</td><td>${element['phone'] ? element['phone'] : '-'}</td><td>${element['designation_name']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateEmployee">Edit</button><button id="${element['id']}" class="btn btn-default empStatusChange" active="${element.active}">${(element['active'] == "0" ? "Active" : "Deactive")}</button><button id="${element['id']}" class="btn btn-default" title="Profile" disabled>Profile</button></td></tr>`);
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.employeesListTable').DataTable();
        }
    });
}