let country;
let state;
let city;
let location_country;
let location_state;
let location_city;
let error_url;


$(document).ready(function () {
    geographical_data();
    getLocation();
    $(".save_form").on('click', function () {

        let dirty = false;
        let url_valitdation = false;
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        var email = $('#email').val();
        var numberReg = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
        var phone_number = $('#phone_number').val();
        var urlReg = /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
        var url_Fb = $('.url_fb').val();
        var url_insta = $('.url_insta').val();
        var url_linked_in = $('.url_linked_in').val();
        var url_twitter = $('.url_twitter').val();

        var url_youtube = $('.url_youtube').val();

        // if (urlReg.test(url_Fb) == false && url_Fb != '') {
        //     url_valitdation = true;
        //     error_url = "Facebook URL is Invalid"
        // }
        // if (urlReg.test(url_insta) == false && url_insta != '') {
        //     url_valitdation = true;
        //     error_url = "Instagram URL is Invalid"
        // }
        // if (urlReg.test(url_linked_in) == false && url_linked_in != '') {
        //     url_valitdation = true;
        //     error_url = "Linked In URL is Invalid"
        // }
        // if (urlReg.test(url_twitter) == false && url_twitter != '') {
        //     url_valitdation = true;
        //     error_url = "Twitter URL is Invalid"
        // }
        // if (urlReg.test(url_youtube) == false && url_youtube != '') {
        //     url_valitdation = true;
        //     error_url = "Youtube URL is Invalid"
        // }
        // if (url_valitdation) {
        //     $('#notifDiv').fadeIn();
        //     $('#notifDiv').css('background', 'red');
        //     $('#notifDiv').text(error_url);
        //     setTimeout(() => {
        //         $('#notifDiv').fadeOut();
        //     }, 3000);
        //     return;
        // }
        $('.required').each(function () {
            if (!$(this).val() || $(this).val() == 0) {
                dirty = true;
            }
        });
        if (dirty) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Fill All Required Fields (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        if (emailReg.test(email) == false && email != '') {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Enter Correct Email');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        } ///Verfiy Phone Number Format
        if (numberReg.test(phone_number) == false && phone_number != '') {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Enter Correct Phone Number ');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        // var postal_code_emp         = $('#all_postal_codes').val();
        // var postal_expression_emp   = /^[a-zA-Z0-9]{6}$/;
        // if (postal_expression_emp.test(postal_code_emp) == false && postal_code_emp != '') {
        //     $('#notifDiv').fadeIn();
        //     $('#notifDiv').css('background', 'red');
        //     $('#notifDiv').text('Enter Alpha Numeric Format of Postal Code');
        //     setTimeout(() => {
        //         $('#notifDiv').fadeOut();
        //     }, 3000);
        //     return;
        // }
        $('#form').ajaxSubmit({
            type: 'post',
            url: '/organization/store',
            success: function (response) {
                if (response.status == "error") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'Red');
                    $('#notifDiv').text('Logo Image Should Not be Empty');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
                if (response.status == "success") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'Green');
                    $('#notifDiv').text('Organization has been Addedd Successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 1500);
                    setTimeout(() => {
                        window.location = "/organization-detail";
                        $('#notifDiv').fadeOut();
                    }, 1000);
                }
            },
            error: function (e) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Not Added at this Moment');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
        })
    })
    $(document).on('click', '.openSideBarForAddingLocation', function () {
        $('input[name="location_id"').val('');

        $('input[name="location_name"]').val('');
        $('input[name="location_name"]').blur();

        $('input[name="phone_no"]').val('');
        $('input[name="phone_no"]').blur();

        $('input[name="location_address"]').val('');
        $('input[name="location_address"]').blur();

        $('input[name="location_email"]').val('');
        $('input[name="location_email"]').blur();

        $('input[name="longitude"]').val('');
        $('input[name="longitude"]').blur();


        $('input[name="latitude"]').val('');
        $('input[name="latitude"]').blur();

        $('input[name="location_postal_code_id"]').val('');
        $('input[name="location_postal_code_id"]').blur();

        $('#countries_2').val('0').trigger('change');
        $('#states_2').val('0').trigger('change');
        $('#cities_2').val('0').trigger('change');
        openSidebar();
    });
    $(document).on('click', '.openDataSidebarForUpdateLocation', function () {

        id = $(this).attr('id');
        $('#location_id').val(id);
        $.ajax({
            type: 'GET',
            url: '/get-location-form/' + id,
            success: function (response) {
                $('input[name="location_name"]').focus();
                $('input[name="location_name"]').val(response.location.location_name);
                $('input[name="location_name"]').blur();

                $('input[name="phone_no"]').focus();
                $('input[name="phone_no"]').val(response.location.phone_no);
                $('input[name="phone_no"]').blur();

                $('input[name="location_address"]').focus();
                $('input[name="location_address"]').val(response.location.address);
                $('input[name="location_address"]').blur();

                $('input[name="location_email"]').focus();
                $('input[name="location_email"]').val(response.location.email);
                $('input[name="location_email"]').blur();

                $('input[name="longitude"]').focus();
                $('input[name="longitude"]').val(response.location.longitude);
                $('input[name="longitude"]').blur();

                $('input[name="latitude"]').focus();
                $('input[name="latitude"]').val(response.location.latitude);
                $('input[name="latitude"]').blur();

                $('#hidden_location_country').val(response.location.country_id);
                $('#hidden_location_state').val(response.location.state_id);
                $('#hidden_location_city').val(response.location.city_id);
                location_country = $('#hidden_location_country').val();
                location_state = $('#hidden_location_state').val();
                location_city = $('#hidden_location_city').val();

                //Getting Countries For Multiple Location
                $.ajax({
                    url: '/get-countries',
                    success: function (response) {
                        $.when(response.result.countries.forEach(data => {
                            $("#countries_2").append(
                                `<option data-id="${data.id}" value="${data.id}">${data.name}</option>`
                            )
                        })).then(function () {
                            if (location_country) {
                                $('#countries_2').val(location_country).trigger('change');
                            }
                        })
                    }
                });
                $('input[name="location_postal_code_id"]').focus();
                $('input[name="location_postal_code_id"]').val(response.location.postal_code);
                $('input[name="location_postal_code_id"]').blur();
            }
        })
        openSidebar();
    });
    $(document).on('click', '#savelocationBtn', function () {

        let validate = false;
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        var numberReg = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
        var latitude = $('#latitude').val();
        var longitude = $('#longitude').val();
        var phone_no = $('#phone_no').val();
        var email = $('#location_email').val();
        $('.required_field').each(function () {
            if (!$(this).val()) {
                validate = true;
            }
        });
        if (validate) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Fill All Required Fields (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        if (emailReg.test(email) == false && email != '') {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Enter Correct Email');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        } ///Verfiy Latitude Format
        if (numberReg.test(latitude) == false && latitude != '') {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Enter Correct Latitude ');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        } ///Verfiy Longitude Format
        if (numberReg.test(longitude) == false && longitude != '') {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Enter Correct Longitude ');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        } ///Verfiy Phone Number Format
        if (numberReg.test(phone_no) == false && phone_no != '') {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Enter Correct Phone No ');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        $('#location_form').ajaxSubmit({
            url: '/organization-location/store',

            type: 'POST',
            success: function (response) {
                if (response.status == "success") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'Green');
                    $('#notifDiv').text('Location has been Addedd Successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    $('input[name="location_name"]').val('');
                    $('input[name="phone_no"]').val('');
                    $('input[name="location_email"]').val('');
                    $('input[name="location_address"]').val('');
                    $('input[name="latitude"]').val('');
                    $('input[name="longitude"]').val('');
                    $('input[name="location_postal_code_id"]').val('');

                    getLocation();
                    closeSidebar();
                }
            },
            error: function (e) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Not Added at this Moment');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
        });

    });

    function getLocation() {
        $('.locations').empty();

        $.ajax({
            type: 'GET',
            url: '/location-list',
            success: function (response) {
                $('.locations').append(`  
                <table id="table" width="100%" cellspacing="0" cellpadding="0" class="location_table">
                <thead>
                  <tr>
                    <th>Sr.no</th>
                    <th>Address</th>
                    <th>Phone No</th>
                    <th>Email</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>

                </tbody>
              </table>`)
                $('.location_table tbody').empty();
                response.location.forEach((element, key) => {
                    $('.location_table tbody').append(`
                            <tr>
                                <td> ${key + 1} </td>
                                <td> ${element.location_name}</td>
                                <td> ${element.phone_no}</td>
                                <td> ${element.email}</td>
                                <td> ${element.latitude}</td>
                                <td> ${element.longitude}</td>
                                <td><a id="${element['id']}"  class="btn btn-default btn-line m-b openDataSidebarForUpdateLocation">Edit</a>
                                  <a href="#"   id="${element['id']}" class="btn btn-default red-bg location_delete"  >Delete</a>
                                </td>
                            </tr> `)
                });
                $('.location_table').fadeIn();
                $('.location_table').DataTable();
                $('.loader').hide();

            }
        });
    }
    country = $('#hidden_country').val();
    state = $('#hidden_state').val();
    city = $('#hidden_city').val();

    function geographical_data() {
        $.ajax({
            url: '/get-countries',
            success: function (response) {
                $("#countries").append(`<option value="0">Select Country</option>`)
                $("#states").append(`<option value="0">Select State</option>`)
                $("#cities").append(`<option value="0">Select City</option>`)
                $("#postal_code").append(`<option value="0">Select Postal Code</option>`)
                $.when(response.result.countries.forEach(data => {
                    $("#countries").append(
                        `<option data-id="${data.id}" value="${data.id}">${data.name}</option>`
                    )
                })).then(function () {
                    if (country) {
                        $('#countries').val(country).trigger('change');
                    }
                })
                $("#countries_2").append(`<option value="0">Select Country</option>`)
                $("#states_2").append(`<option value="0">Select State</option>`)
                $("#cities_2").append(`<option value="0">Select City</option>`)
                $("#postal_code_2").append(`<option value="0">Select Postal Code</option>`)
                response.result.countries.forEach(data => {
                    $("#countries_2").append(
                        `<option data-id="${data.id}" value="${data.id}">${data.name}</option>`
                    )
                })
            },
        });
    }
    $(".countries").change(function () {
        $('#states').empty();
        $('#cities').empty();
        $('#postal_code').empty();
        var country_id = $(this).val();
        $.ajax({
            url: `/get-state-against-country/${country_id}`,
            success: function (response) {
                $("#states").append(`<option value="0">Select State</option>`);
                $.when(response.states.forEach(data => {
                    $("#states").append(`<option value="${data.id}">${data.name}</option>`)
                })).then(function () {
                    if (state) {
                        $('#states').val(state).trigger('change');
                    }
                })
            }
        });
    })
    $("#states").change(function () {
        $('#cities').empty();
        $('#postal_code').empty();
        var city_id = $(this).val();
        $.ajax({
            url: `/get-city-against-states/${city_id}`,
            success: function (response) {
                $("#cities").append(`<option value="0">Select Cities</option>`);
                $('select[name="city_id"]').val('-1').trigger('change');
                $.when(response.cities.forEach(data => {
                    $("#cities").append(`<option value="${data.id}">${data.name}</option>`)
                })).then(function () {
                    if (city) {
                        $('#cities').val(city).trigger('change');
                    }
                })
            }
        });
    })
    // Get Country & States of Location Module
    $(".countries_2").change(function () {
        $('#states_2').empty();
        $('#cities_2').empty();
        $('#postal_code_2').empty();
        var country_id = $(this).val();
        $.ajax({
            url: `/get-state-against-country/${country_id}`,
            success: function (response) {
                $("#states_2").append(`<option value="0">Select State</option>`);
                $.when(response.states.forEach(data => {
                    $("#states_2").append(`<option value="${data.id}">${data.name}</option>`)
                })).then(function () {
                    if (location_state) {
                        $('#states_2').val(location_state).trigger('change');
                    }
                });
            }
        });
    });
    $("#states_2").change(function () {
        $('#cities_2').empty();
        $('#postal_code_2').empty();
        var city_id = $(this).val();
        $.ajax({
            url: `/get-city-against-states/${city_id}`,
            success: function (response) {
                $("#cities_2").append(`<option value="0">Select Cities</option>`);
                $('select[name="location_city_id"]').val('-1').trigger('change');
                $.when(response.cities.forEach(data => {
                    $("#cities_2").append(`<option value="${data.id}">${data.name}</option>`)
                })).then(function () {
                    if (location_city) {
                        $('#cities_2').val(location_city).trigger('change');
                    }
                })
            }
        });
    });
    $(document).on('click', '.dropify-clear', function () {
        var old_input_name = $(this).parent().children('input').attr('data-old_input');
        $('input[name="' + old_input_name + '"]').val('');
    });
    $(document).on('click', '.location_delete', function () {
        var location_id = $(this).attr('id');
        swal({
            title: "Are you sure?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: '/location-delete/' + location_id,
                    type: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    success: function (response) {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Successfully deleted.');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                        getLocation();
                    }
                });
            } else {
                getLocation();
            }
        });
    })

})
