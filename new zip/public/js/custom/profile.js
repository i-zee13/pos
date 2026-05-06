
//Change Password User Profile
$(document).on('click', '#update-user-password', function() {
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
        type    :   "POST",
        url     :   "/update-user-password",
        data    :   $('#saveEditProfileForm').serialize(),
        cache   :   false,
        success :   function(response) {
            $("#update-user-password").removeAttr('disabled');
            $("#update-user-password").text('Save Changes');
            if (response.status == "success") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Updated successfully');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                location.reload();
            } else if (response.status == "failed") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Unable to update');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            } else if (response.status == "empty") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please provide all the required information (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            } else {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Incorrect Current Password');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
        }
    });
});
//Change Picture User Profile
$(document).on('click', '#save-user-profile-pic', function() {
    $(this).text('PROCESSING....');
    $(this).attr("disabled", "disabled");
    $('#saveEditProfilePictureForm').ajaxSubmit({
        type    :   "POST",
        url     :   "/update-user-profile-pic",
        data    :   $('#saveEditProfilePictureForm').serialize(),
        cache   :   false,
        success :   function(response) {
            $("#save-user-profile-pic").removeAttr('disabled');
            $("#save-user-profile-pic").text('Save');
            if (response.status == "success") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Updated successfully');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                location.reload();
            } else if (response.status == "failed") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Unable to update');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            } else if (response.status == "empty") {
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