var total_customers = 0;

var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
var numberReg = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
var lettersReg = /^(?![\s.]+$)[a-zA-Z\s.]*$/;
$('#datepicker, #datepicker2').datepicker({
    autoclose: true,
    todayHighlight: true,
    toggleActive: true,
    format: dateFormat
})
    .on('changeDate', function (ev) {
        $(this).datepicker('hide');
    });


function getdata() {

    $.ajax({
        url: '/geographical_data',
        success: function (response) {

            $("#gender").append(`<option value="0">Select Gender </option>`)
            $("#countries").append(`<option value="0">Select Country</option>`)
            $("#states").append(`<option value="0">Select State</option>`)
            $("#cities").append(`<option value="0">Select City</option>`)
            $("#postal_code").append(`<option value="0">Select postal</option>`)

            $("#country_Employment").append(`<option value="0">Select Country</option>`)
            $("#states_Employment").append(`<option value="0">Select State</option>`)
            $("#cities_Employment").append(`<option value="0">Select City</option>`)
            $("#postal_code_Employment").append(`<option value="0">Select postal</option>`)


            response.result.genders.forEach(data => {
                $("#gender").append(`<option value="${data.id}">${data.gender_name}</option>`)
            })
            response.result.countries.forEach(data => {
                $("#countries").append(
                    `<option data-id="${data.id}" value="${data.id}">${data.name}</option>`
                )
                $("#country_Employment").append(
                    `<option data-id="${data.id}" value="${data.id}">${data.name}</option>`
                )
            })

        },


    });
}

var invalidSave = [];
var idTaken;
var flag = true;
$(document).ready(function () {


    $("#save").on('click', function () {

        var first_name = $('input[name="first_name"]').val();
        var middle_name = $('input[name="middle_name"]').val();
        var last_name = $('input[name="last_name"]').val();
        var primary_cellphone = $('#primary_cellphone').val();
        var email = $('#email').val();
        var primary_landline = $("#primary_landline").val();
        let dirty2 = false;


        $('.client_required').each(function () {
            if (!$(this).val() || $(this).val == 0) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please provide all the required information (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                flag = false;
                return 0;
            }
        });

        if ($('select[name="client_type"]').val() == 0) {

            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;

        }
        if ($('select[name="acquisition_source"]').val() == 0) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;


        }
        if ($('select[name="life_cycle_stage"]').val() == 0) {

            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;

        }
        if ($('select[name="marital_status"]').val() == 0) {

            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;

        }
        if ($('select[name="employment_status"]').val() == 0) {

            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;

        }

        $('.letters').each(function () {
            if ($(this).val() != '' && (!lettersReg.test(first_name) || !lettersReg.test(last_name) || !lettersReg.test(middle_name))) {
                dirty2 = true;
            }
        });


        if (dirty2) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Enter Correct Name (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        if (primary_cellphone != '' && (!numberReg.test(primary_landline) || !numberReg.test(primary_cellphone))) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Enter Correct Cell Number (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        if (email != '' && !emailReg.test(email)) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Enter Valid Email (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        if ($('#primary_landline').val() != '' && ($('#primary_landline').val().length < 6 || $('#primary_cellphone').val().length < 6)) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Contacts Numbers should have atleast 6 characters');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
            $('#save').attr('disabled', 'disabled');
            $('.btn-cancel').attr('disabled', 'disabled');
            $('#save').text('Processing..');
        $.ajax({
            url: '/client',
            type: 'POST',
            data: $('#form').serialize(),
            success: function (id) {
                $('#form')[0].reset();
                setTimeout(() => {
                    window.location = "/client-view/" + id;
                    $('#notifDiv').fadeOut();
                }, 1500);
                if ("success") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Added successfully');

                } else {
                    $('#save').removeAttr('disabled');;
                    $('.btn-cancel').removeAttr('disabled');
                    $('#save').text('Save');
                }
            },
            error: function (e) {
                    $('#save').removeAttr('disabled', 'disabled');
                    $('.btn-cancel').removeAttr('disabled', 'disabled');
                    $('#save').text('Save');
            }
        });

    });

    getdata();
})

// Form Updation 

$("#update").on('click', function () {
    $('#update').text('Processing..');
    $.ajax({
        url: ` /client-update/${id}`,
        type: 'POST',
        data: $('#form').serialize(),
        success: function (id) {
                 $('#form')[0].reset();
            setTimeout(() => {
                window.location = "/clients";
                $('#notifDiv').fadeOut();
            }, 1500);
            if ("success") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Updated successfully');
            }
        },
        error: function (e) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please provide all the Required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
                $('#update').removeAttr('disabled', 'disabled');
                $('.btn-cancel').removeAttr('disabled', 'disabled');
                $('#update').text('Save');
        }
    });
});

var id;
function edit_client(client_id) {

    id = client_id;
    $.ajax({
           url: `/edit/${client_id}`,
           success: function (response) {
            window.location = "/client-edit/" + id;
        }
    });

}

// Country - State - City  Functions 

$(".countries").change(function () {

        $('#states').empty();
        $('#cities').empty();
        $('#postal_code').empty();
    var country_id = $(this).val();
    $.ajax({
        url: `/getStateAgainst_Country/${country_id}`,
        success: function (response) {
            $("#states").append(`<option value="0">Select State</option>`);
            response.states.forEach(data => {
            $("#states").append(`<option value="${data.id}">${data.name}</option>`)
            })
        }
    });
})
$("#states").change(function () {

            $('#cities').empty();
            $('#postal_code').empty();
    var city_id = $(this).val();
    $.ajax({
        url: `/getCityAgainst_States/${city_id}`,
        success: function (response) {
            $("#cities").append(`<option value="0">Select Cities</option>`);
            $('select[name="city_id"]').val('-1').trigger('change');
            response.cities.forEach(data => {
                $("#cities").append(`<option value="${data.id}">${data.name}</option>`)
            })
        }
    });
})

$("#cities").change(function () {

    $('#postal_code').empty();
    var city_id = $(this).val();
    $.ajax({
        url: `/getPostalcodeAgainst_City/${city_id}`,
        success: function (response) {
            $("#postal_code").append(`<option value="0">Select Postal Code</option>`);
            response.PostalCode.forEach(data => {
            $("#postal_code").append(`<option value="${data.id}">${data.postal_code}</option>`)
            })
        }
    });
})

$(".countries_Employment").change(function () {
            $('#states_Employment').empty();
            $('#cities_Employment').empty();
            $('#postal_code_Employment').empty();

    var country_id = $(this).val();
    $.ajax({
        url: `/getStateAgainst_Country/${country_id}`,
        success: function (response) {
            $("#states_Employment").append(`<option value="0">Select State</option>`);
            response.states.forEach(data => {
            $("#states_Employment").append(`<option value="${data.id}">${data.name}</option>`)
            })
        }
    });


})

$("#states_Employment").change(function () {

    $('#cities_Employment').empty();
    var city_id = $(this).val();
    $.ajax({
            url: `/getCityAgainst_States/${city_id}`,
            success: function (response) {
            $("#cities_Employment").append(`<option value="0">Select Cities</option>`);
            $('select[name="city_id"]').val('-1').trigger('change');
            response.cities.forEach(data => {
                $("#cities_Employment").append(`<option value="${data.id}">${data.name}</option>`)
            })
        }
    });
})

$("#cities_Employment").change(function () {
          $('#postal_code_Employment').empty();
    var city_id = $(this).val();
    $.ajax({
        url: `/getPostalcodeAgainst_City/${city_id}`,
        success: function (response) {
            $("#postal_code_Employment").append(`<option value="0">Select Postal Code</option>`);
            response.PostalCode.forEach(data => {
            $("#postal_code_Employment").append(`<option value="${data.id}">${data.postal_code}</option>`)
            })
        }
    });
})



// Start Side-Bars of Tabs  Functions 
var opp_name = '';
var last_operation = 'add';

$(document).on('click', '.openDataSidebarForAddingAddress', function () {

    $("#formSave_Btn").removeClass("save_document");
    $("#formSave_Btn").removeClass("save_employe");
    $("#formSave_Btn").removeClass("save_relation");
    $("#formSave_Btn").addClass("Save_address");
    $('#saveClientForm')[0].reset();
    $('.formselect').select2();

    if (last_operation == 'update') {

        $('input[name="primary_address"]').val('');
        $('input[name="primary_address"]').blur();

        $('input[name="house_no"]').val('');
        $('input[name="house_no"]').blur();

        $('input[name="primary_landline"]').val('');
        $('input[name="primary_landline"]').blur();

        $('input[name="primary_cellphone"]').val('');
        $('input[name="primary_cellphone"]').blur();

        $('select[name="address_type"]').val('');
        $('select[name="address_type"]').blur();
        $('#countries').empty();
        $('#states').empty();
        $('#cities').empty();
        getdata();
    }

        $('#opp_name').text('Address Information');
        $('.employe_form_div').hide();
        $('.martial_form_div').hide();
        $('.relatives_form_div').hide();
        $('.documents_form_div').hide();
        $('.address_form_div').show();
        openSidebar();
        last_operation = 'add';
        opp_name = 'address';
        $('#operation').val('add');
        $('#opp_name_input').val('address');
});

$(document).on('click', '.openDataSidebarForAddingEmpolyment', function () {

        $("#formSave_Btn").removeClass("save_document");
        $("#formSave_Btn").removeClass("Save_address");
        $("#formSave_Btn").removeClass("save_relation");
        $("#formSave_Btn").addClass("save_employe");
        $('#saveClientForm')[0].reset();
        $('.formselect').select2();

    if (last_operation == 'update') {
        $('input[name="company_name"]').val('');
        $('input[name="company_name"]').blur();

        $('input[name="company_contact_number"]').val('');
        $('input[name="company_contact_number"]').blur();

        $('input[name="job_title"]').val('');
        $('input[name="job_title"]').blur();

        $('select[name="employment_status"]').val('');
        $('select[name="employment_status"]').blur();

        $('input[name="office_no"]').val('');
        $('input[name="office_no"]').blur();

        $('input[name="street_address"]').val('');
        $('input[name="street_address"]').blur();

        $('#country_Employment').empty();
        $('#states_Employment').empty();
        $('#cities_Employment').empty();
        getdata();
    }

        $('#opp_name').text('Employment Information');
        $('.employe_form_div').show();
        $('.martial_form_div').hide();
        $('.relatives_form_div').hide();
        $('.documents_form_div').hide();
        $('.address_form_div').hide();
    openSidebar();
    last_operation = 'add';
    opp_name = 'employe';
        $('#operation').val('add');
        $('#opp_name_input').val('employe');
});

$(document).on('click', '.openDataSidebarForAddingDocument', function () {


        $("#formSave_Btn").removeClass("Save_address");
        $("#formSave_Btn").removeClass("save_employe");
        $("#formSave_Btn").removeClass("save_relation");
        $("#formSave_Btn").addClass("save_document");

        $('#saveClientForm')[0].reset();
        $('.formselect').select2();



    if (last_operation == 'update') {
        $('input[name="document_type"]').val('');
        $('input[name="document_type"]').blur();

        $('input[name="document_number"]').val('');
        $('input[name="document_number"]').blur();

        $('input[name="issuance_date"]').val('');
        $('input[name="issuance_date"]').blur();

        $('input[name="expiry_date"]').val('');
        $('input[name="expiry_date"]').blur();

    }

        $('#opp_name').text('Document Information');
        $('.employe_form_div').hide();
        $('.martial_form_div').hide();
        $('.relatives_form_div').hide();
        $('.documents_form_div').show();
        $('.address_form_div').hide();
        openSidebar();

    last_operation = 'add';
    opp_name = 'document';
        $('#operation').val('add');
        $('#opp_name_input').val('document');

        $("#front_img").empty();
        $('#front_img').append(`<input type="file"  name="doc_front_image" class="doc_front_image" accept="image/*" class="image" data-allowed-file-extensions="jpg png jpeg JPEG"/>`);
        $('.doc_front_image').dropify();


        $("#back_img").empty();
        $('#back_img').append('<input type="file" name="doc_back_image" class="doc_back_image"  accept="image/*" class="image" data-allowed-file-extensions="jpg png jpeg JPEG"/>');
        $('.doc_back_image').dropify();

    // $('.dropify').empty();
    // $('.dropify').append('<input type="file" name="doc_front_image" class="doc_back_image" class="dropify" />');
    // $('.doc_back_image').dropify();


});

$(document).on('click', '.openDataSidebarForAddingRelative', function () {
        $("#formSave_Btn").removeClass("save_document");
        $("#formSave_Btn").removeClass("Save_address");
        $("#formSave_Btn").removeClass("save_employe");
        $("#formSave_Btn").addClass("save_relation");


        $('#saveClientForm')[0].reset();
        $('.formselect').select2();

    if (last_operation == 'update') {
        $('input[name="secondary_contact_id"]').val('');
        $('input[name="secondary_contact_id"]').blur();


        $('select[name="relationship_type"]').val('');
        $('select[name="relationship_type"]').blur();
    }

        $('#opp_name').text('Relative Information');
        $('.employe_form_div').hide();
        $('.martial_form_div').hide();
        $('.relatives_form_div').show();
        $('.documents_form_div').hide();
        $('.address_form_div').hide();
        openSidebar();
        last_operation = 'add';
        opp_name = 'relative';
        $('#operation').val('add');
        $('#opp_name_input').val('relative');

});

// *** Updating Modules  START ... ***

$(document).on('click', '.openDataSidebarForUpdateAddress', function () {
        $("#formSave_Btn").removeClass("save_document");
        $("#formSave_Btn").removeClass("save_employe");
        $("#formSave_Btn").removeClass("save_relation");
        $("#formSave_Btn").addClass("Save_address");


        $('#saveClientForm')[0].reset();
        $('.formselect').select2();

        $('#countries').empty();
        $('#states').empty();
        $('#cities').empty();
        $('#postal_code').empty();
        var id = $(this).attr('id');
        $('.employe_form_div').hide();
        $('.martial_form_div').hide();
        $('.relatives_form_div').hide();
        $('.documents_form_div').hide();
        $('.address_form_div').show();

        $('#opp_name').text('Update');
        $('#opp_id').val(id);
        openSidebar();
        last_operation = 'update';
        opp_name = 'address';
        $('#operation').val('update');
        $('#opp_name_input').val('address');
    $.ajax({
        type: 'GET',
        url: '/get-client-address/' + id,
        success: function (response) {



            $('#dataSidebarLoader').hide();
            $('._cl-bottom').show();
            $('.pc-cartlist').show();


            $('input[name="address_type"]').focus();
            $('input[name="address_type"]').val(response.address_type).trigger('change');
            $('input[name="address_type"]').blur();

            $('input[name="primary_address"]').focus();
            $('input[name="primary_address"]').val(response.primary_address);
            $('input[name="primary_address"]').blur();

            $('input[name="house_no"]').focus();
            $('input[name="house_no"]').val(response.house_no);
            $('input[name="house_no"]').blur();

            $('input[name="primary_landline"]').focus();
            $('input[name="primary_landline"]').val(response.primary_landline);
            $('input[name="primary_landline"]').blur();

            $('input[name="primary_cellphone"]').focus();
            $('input[name="primary_cellphone"]').val(response.primary_cellphone);
            $('input[name="primary_cellphone"]').blur();

            //Get Selected Countries
            $('#countries').empty();
            $.ajax({
                url: `/get-countries`,
                success: function (country) {
                    $('#countries').empty();
                    $('#countries').append(`<option value="-1" selected disabled>Select Country</option>`);
                    country.forEach((element) => {
                        $('#countries').append(`<option value="${element['id']}" ${response.country_id == element.id ? 'selected' : ''} >${element['name']}</option>`);
                    })
                },
                error: function (e) {
                    alert('error in fetching get countries')
                }
            })

            $('#states').empty();
            //Get Selected States Against Selected Country
            $.ajax({
                url: `/GetStatesagianstCountryforPostal/${response.country_id}`,
                success: function (query) {
                    $('#states').empty();
                    $('#states').append(`<option value="-1" selected disabled>Select State</option>`);
                    query.forEach((element) => {
                        $('#states').append(`<option value="${element['id']}" ${response.state_id == element.id ? 'selected' : ''} >${element['name']}</option>`);
                    })
                },
                error: function (e) {
                    alert('error in fetching States')
                }
            })

            //Get Selected Cities Against Selected States
            $('#cities').empty();
            $.ajax({
                url: `/GetCitiesagianstStatesforPostal/${response.state_id}`,
                success: function (querycitiespostal) {
                    $('#cities').empty();
                    $('#cities').append(`<option value="-1" selected disabled>Select City </option>`);
                    querycitiespostal.forEach((element) => {
                    $('#cities').append(`<option value="${element['id']}" ${response.city_id == element.id ? 'selected' : ''} >${element['name']}</option>`);
                    })
                },
                error: function (e) {
                    alert('error in fetching Cities')
                }
            })

            //Get Selected Postal Code Against Selected States
            $('#postal_code').empty();
            $.ajax({
                url: `/get-postal-code-against-cities/${response.city_id}`,
                success: function (data) {
                    console.log(data)
                    $('#postal_code').empty();
                    $('#postal_code').append(`<option value="-1" selected disabled>Select Postal Codes </option>`);
                    data.postalcodes.forEach((element) => {
                        $('#postal_code').append(`<option value="${element['id']}" ${response.postal_code == element.postal_code ? 'selected' : ''} >${element['postal_code']}</option>`);
                    })
                },
                error: function (e) {
                    alert('error in fetching Postal Code')
                }
            })
            //End Get Selected Postal Code Against Selected States


        }

    });
});

$(document).on('click', '.openDataSidebarForUpdateEmployment', function () {

            $("#formSave_Btn").removeClass("save_document");
            $("#formSave_Btn").removeClass("Save_address");
            $("#formSave_Btn").removeClass("save_relation");
            $("#formSave_Btn").addClass("save_employe");


            $('#saveClientForm')[0].reset();
            $('.formselect').select2();
            $('.countries_Employment').empty();
            $('#states_Employment').empty();
            $('#cities_Employment').empty();
            $('#postal_code_Employment').empty();

            var id = $(this).attr('id');
            $('.employe_form_div').show();
            $('.martial_form_div').hide();
            $('.relatives_form_div').hide();
            $('.documents_form_div').hide();
            $('.address_form_div').hide();

            $('#opp_name').text('employe');
            $('#opp_id').val(id);
            openSidebar();
            last_operation = 'update';
            opp_name = 'employe';
            $('#operation').val('update');
            $('#opp_name_input').val('employe');
    $.ajax({
        type: 'GET',
        url: '/get-client-emploment-info/' + id,
        success: function (response) {

            $('#dataSidebarLoader').hide();
            $('._cl-bottom').show();
            $('.pc-cartlist').show();

            $('input[name="company_name"]').focus();
            $('input[name="company_name"]').val(response.employment.company_name);
            $('input[name="company_name"]').blur();

            $('input[name="company_contact_number"]').focus();
            $('input[name="company_contact_number"]').val(response.employment.company_contact_number);
            $('input[name="company_contact_number"]').blur();

            $('input[name="job_title"]').focus();
            $('input[name="job_title"]').val(response.employment.job_title);
            $('input[name="job_title"]').blur();

            $('select[name="employment_status"]').focus();
            $('select[name="employment_status"]').val(response.employment.employment_status).trigger('change');
            $('select[name="employment_status"]').blur();

            $('input[name="office_no"]').focus();
            $('input[name="office_no"]').val(response.employment.office_no);
            $('input[name="office_no"]').blur();

            $('input[name="street_address"]').focus();
            $('input[name="street_address"]').val(response.employment.street_address);
            $('input[name="street_address"]').blur();

            //Get Selected Countries
            $.ajax({
                url: `/get-countries`,
                success: function (country) {

                    $('.countries_Employment').append(`<option value="-1" selected disabled>Select Country</option>`);
                    country.forEach((element) => {
                    $('.countries_Employment').append(`<option value="${element['id']}" ${response.employment.country_id2 == element.id ? 'selected' : ''} >${element['name']}</option>`);
                    })
                },
                error: function (e) {
                    alert('error in fetching get countries')
                }
            })


            //Get Selected States Against Selected Country
            $.ajax({
                url: `/GetStatesagianstCountryforPostal/${response.employment.country_id2}`,
                success: function (query) {

                    $('#states_Employment').append(`<option value="-1" selected disabled>Select State</option>`);
                    query.forEach((element) => {
                        $('#states_Employment').append(`<option value="${element['id']}" ${response.employment.state_id2 == element.id ? 'selected' : ''} >${element['name']}</option>`);
                    })
                },
                error: function (e) {
                    alert('error in fetching States')
                }
            })

            //Get Selected Cities Against Selected States
            $.ajax({
                url: `/GetCitiesagianstStatesforPostal/${response.employment.state_id2}`,
                success: function (querycitiespostal) {
                    $('#cities_Employment').append(`<option value="-1" selected disabled>Select City </option>`);
                    querycitiespostal.forEach((element) => {
                    $('#cities_Employment').append(`<option value="${element['id']}" ${response.employment.city_id2 == element.id ? 'selected' : ''} >${element['name']}</option>`);
                    })
                },
                error: function (e) {
                    alert('error in fetching Cities')
                }
            })

            //Get Selected Postal Code Against Selected States
            $.ajax({
                url: `/get-postal-code-against-cities/${response.employment.city_id2}`,
                success: function (data) {
                    console.log(data)
                    $('#postal_code_Employment').append(`<option value="-1" selected disabled>Select Postal Codes </option>`);
                    data.postalcodes.forEach((element) => {
                     $('#postal_code_Employment').append(`<option value="${element['id']}" ${response.employment.postal_code_id2 == element.id ? 'selected' : ''} >${element['postal_code']}</option>`);
                    })
                },
                error: function (e) {
                    alert('error in fetching Postal Code')
                }
            })
            //End Get Selected Postal Code Against Selected States


        }
    });
});

$(document).on('click', '.openDataSidebarForUpdateDocument', function () {
            $("#formSave_Btn").removeClass("Save_address");
            $("#formSave_Btn").removeClass("save_employe");
            $("#formSave_Btn").removeClass("save_relation");
            $("#formSave_Btn").addClass("save_document");




            $('#saveClientForm')[0].reset();
            $('.formselect').select2();
            var id = $(this).attr('id');
            $('.employe_form_div').hide();
            $('.martial_form_div').hide();
            $('.relatives_form_div').hide();
            $('.documents_form_div').show();
            $('.address_form_div').hide();

            $('#opp_name').text('document');
            $('#opp_id').val(id);
            openSidebar();
            last_operation = 'update';
            opp_name = 'document';
            $('#operation').val('update');
            $('#opp_name_input').val('document');

            $('.dropifyImgDiv').empty();
            $('.dropifyImgDiv').append('<input type="file" name="doc_front_image" class="doc_front_image" accept="image/*" class="image"  data-allowed-file-extensions="jpg png jpeg JPEG"/>');
            $('.doc_front_image').dropify();
    $.ajax({
        type: 'GET',
        url: '/get-client-document/' + id,
        success: function (response) {


            $('#dataSidebarLoader').hide();
            $('._cl-bottom').show();
            $('.pc-cartlist').show();

            $('select[name="document_type"]').focus();
            $('select[name="document_type"]').val(response.document.document_type).trigger('change');
            $('select[name="document_type"]').blur();

            $('input[name="document_number"]').focus();
            $('input[name="document_number"]').val(response.document.document_number);
            $('input[name="document_number"]').blur();

            // $('input[name="issuance_date"]').focus();
            $('input[name="issuance_date"]').val(response.document.issuance_date);
            // $('input[name="issuance_date"]').blur();

            // $('input[name="expiry_date"]').focus();
            $('input[name="expiry_date"]').val(response.document.expiry_date);
            // $('input[name="expiry_date"]').blur();


            var picture = response.base_url + response.document.doc_front_image;
            var input = `<input type="hidden"  name="doc_front_image_hidden" value="${response.document.doc_front_image}" /> <input data-old_input="doc_front_image_hidden" type="file" id="doc_front_image"  data-default-file="${picture}" class="dropify doc_front_image  front" name="doc_front_image" accept="image/*" class="image" data-id="${response.document.id}" value="${response.document.doc_front_image}" data-img-front="${response.document.doc_front_image}" data-allowed-file-extensions="jpg png jpeg JPEG"/>`

            $("#front_img").empty();
            $("#front_img").html(input)

            $('.doc_front_image').dropify();

            var back_img = response.base_url + response.document.doc_back_image;
            var input2 = `<input type="hidden"  name="doc_back_image_hidden" value="${response.document.doc_back_image}"/> <input type="file" data-old_input="doc_back_image_hidden" id="doc_back_image"  data-default-file="${back_img}" class="dropify doc_back_image back " name="doc_back_image" accept="image/*" class="image" data-id="${response.document.id}" value="${response.document.doc_back_image}" data-img-back="${response.document.doc_back_image}" data-allowed-file-extensions="jpg png jpeg JPEG"/>`

            $("#back_img").empty();
            $("#back_img").html(input2)

            $('.doc_back_image').dropify();

        }
    });
});

$(document).on('click', '.openDataSidebarForUpdateRelative', function () {

            $("#formSave_Btn").removeClass("save_document");
            $("#formSave_Btn").removeClass("Save_address");
            $("#formSave_Btn").removeClass("save_employe");
            $("#formSave_Btn").addClass("save_relation");


            $('#saveClientForm')[0].reset();
            $('.formselect').select2();
            var id = $(this).attr('id');
            var json = $(this).attr('data-json');
            var json = JSON.parse(json);
            $('.employe_form_div').hide();
            $('.martial_form_div').hide();
            $('.relatives_form_div').show();
            $('.documents_form_div').hide();
            $('.address_form_div').hide();

            $('#opp_name').text('relative');
            $('#opp_id').val(id);
            openSidebar();
            last_operation = 'update';
            opp_name = 'relative';
            $('#operation').val('update');
            $('#opp_name_input').val('relative');
            $('input[name="secondary_id"]').val(json.secondary_contact_id);

            $('select[name="relationship_type"]').focus();
            $('select[name="relationship_type"]').val(json.relationship_type);
            $('select[name="relationship_type"]').select2();

            $('input[name="first_name"]').focus();
            $('input[name="first_name"]').val(json.first_name);
            $('input[name="first_name"]').blur();


            $('input[name="middle_name"]').focus();
            $('input[name="middle_name"]').val(json.middle_name);
            $('input[name="middle_name"]').blur();



            $('input[name="last_name"]').focus();
            $('input[name="last_name"]').val(json.last_name);
            $('input[name="last_name"]').blur();


            $('select[name="re_gender_id"]').focus();
            $('select[name="re_gender_id"]').val(json.gender_id);
            $('select[name="re_gender_id"]').select2();

            $('input[name="email"]').focus();
            $('input[name="email"]').val(json.email);
            $('input[name="email"]').blur();



            $('input[name="home_phone_no"]').focus();
            $('input[name="home_phone_no"]').val(json.primary_landline);
            $('input[name="home_phone_no"]').blur();




            $('input[name="cell_phone_no"]').focus();
            $('input[name="cell_phone_no"]').val(json.primary_cellphone);
            $('input[name="cell_phone_no"]').blur();

});

var invalidSave = [];
// Validating All Modules == START  
$(document).on('click', '.Save_address', function () {

    // Validating All Modules == START  
    var primary_landline = $('.landline').val();
    var cellphone = $('.cellphone').val();

    $('.required_address').each(function () {
        if (!$(this).val()) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the Required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            invalidSave.push(true);

        } else {
            invalidSave.push(false);

        }
        if ($('.countries').val() == 0) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the Required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;

        }
    })
    if ((cellphone != '' && (!numberReg.test(cellphone))) || (primary_landline != '' && (!numberReg.test(primary_landline)))) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please enter Numeric Values (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            invalidSave.push(true);
        } else {
            invalidSave.push(false);
        }

    //END
            $('.Save_address').attr('disabled', 'disabled');
            $('.btn-cancel').attr('disabled', 'disabled');
            $('.Save_address').text('Processing..');

            $('#saveClientForm').ajaxSubmit({


        type: "POST",
        url: '/save-address',
        cache: false,
        success: function (response) {

            $('.Save_address').removeAttr('disabled');
            $('.btn-cancel').removeAttr('disabled');
            $('.Save_address').text('Save');
            if (response.status == "success") {
                fetchAllData();

                $('#notifDiv').text('Saved Successfully!');
                closeSidebar();

                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');

                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);


            } else if (response.status == "already_exist") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Already Exist!');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            } else if (response.status == "validate") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Already Exist!');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            } else {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Failed to save at the moment');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }

        },
        error: function (err) {
            $('.Save_address').removeAttr('disabled', 'disabled');
            $('.btn-cancel').removeAttr('disabled', 'disabled');
            $('.Save_address').text('Save');
        }
    });

});

$(document).on('click', '.save_employe', function () {

    var company_contact_number = $('input[name="company_contact_number"]').val();

    var job_title = $('input[name="job_title"]').val();

    $('.required_employee').each(function () {
        if (!$(this).val() || $(this).val() == 0) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the Required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            invalidSave.push(true);
        } else {
            invalidSave.push(false);
        }

    });

    $('#saveClientForm').ajaxSubmit({
        type: "POST",
        url: '/save-employe',
        cache: false,
        success: function (response) {

            $('#save_employe').removeAttr('disabled');
            $('.btn-cancel').removeAttr('disabled');
            $('#save_employe').text('Save');
            if (response.status == "success") {
                fetchAllData();
                $('#notifDiv').text('Saved Successfully!');
                closeSidebar();

                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');

                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            } else if (response.status == "already_exist") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Already Exist!');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            } else {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Failed to save at the moment');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
        },
        error: function (e) {

            $('.save_employe').removeAttr('disabled', 'disabled');
            $('.btn-cancel').removeAttr('disabled', 'disabled');
            $('.save_employe').text('Save');
        }
    })
});
$(document).on('click', '.save_document', function () {


    var document_number = $('input[name="document_number"]').val();

    $('.required_document').each(function () {


        if ($(this).val() == '') {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the Required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);

            invalidSave.push(true);
        } else {
            invalidSave.push(false);
        }
    });

    if ((document_number != '' && (!numberReg.test(document_number)))) {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please enter Numeric Values (*)');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;

    }
    if ($('#operation').val() == "add") {
        if ($('.doc_front_image').val() == '' || $('.doc_back_image').val() == '') {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please  provide all the Required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
    }
    if ($('#input-file-front').attr('data-default-file') == '' || $('#input-file-back').attr('data-default-file') == '') {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please  provide all the Required information (*)');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    if ($('.issue_date').val() == '' || $('.expire_date').val() == '') {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please  provide all the Required information (*)');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return 0;
    }
 

    $('#save_document').attr('disabled', 'disabled');
    $('.btn-cancel').attr('disabled', 'disabled');
    $('#save_document').text('Processing..');

    $('#saveClientForm').ajaxSubmit({
        type: "POST",
        url: '/save-document',
        cache: false,
        success: function (response) {

            $('#save_document').removeAttr('disabled');
            $('.btn-cancel').removeAttr('disabled');
            $('#save_document').text('Save');
            if (response.status == "success") {
                fetchAllData();

                $('#notifDiv').text('Saved Successfully!');
                closeSidebar();

                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');

                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);

            } else if (response.status == "already_exist") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Already Exist!');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            } else if (response.status == "validate") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Image is Missing!');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            } else {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Failed to save at the moment');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }

        },
        error: function (e) {

            $('.save_relation').removeAttr('disabled', 'disabled');
            $('.btn-cancel').removeAttr('disabled', 'disabled');
            $('.save_relation').text('Save');
        }
    })
});
$(document).on('click', '.save_relation', function () {

    $('.required_relative').each(function () {
        if (!$(this).val() || $(this).val() == 0) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the Required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            invalidSave.push(true);
        } else {
            invalidSave.push(false);
        }
    })
    $('.save_relation').attr('disabled', 'disabled');
    $('.btn-cancel').attr('disabled', 'disabled');
    $('.save_relation').text('Processing..');

    $('#saveClientForm').ajaxSubmit({
        type: "POST",
        url: '/save-relation',
        cache: false,
        success: function (response) {

            $('.save_relation').removeAttr('disabled');
            $('.btn-cancel').removeAttr('disabled');
            $('.save_relation').text('Save');
            if (response.status == "success") {
                fetchAllData();

                $('#notifDiv').text('Saved Successfully!');

                closeSidebar();

                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');

                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);

            } else if (response.status == "already_exist") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Already Exist!');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            } else {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Failed to save at the moment');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
        },
        error: function (e) {

            $('.save_relation').removeAttr('disabled', 'disabled');
            $('.btn-cancel').removeAttr('disabled', 'disabled');
            $('.save_relation').text('Save');
        }
    });


})

// Validation All Modules == END
if (location.pathname != "/client-create" && location.pathname != "/clients") {
    fetchAllData();
}

// End Side-Bars Tabs functions


// Fetching All Data 
function fetchAllData() {
    $('.loader').show();
    $('.body_address').empty();
    $('.body_employe').empty();
    $('.body_document').empty();
    $('.body_relative').empty();

    var client_id = $('#student_id').val();


    $.ajax({
        type: 'GET',
        url: `/GetClient_AllData/${client_id}`,
        success: function (response) {


            $('.count_relatives').text(response.count_relatives);
            $(".count_address").text(response.count_address);
            $(".count_employment").text(response.count_employment);
            $(".count_document").text(response.count_document);



            $('.body_address').append(
                `<table class="table table-hover dt-responsive nowrap" id="addressTable" style="width:100%;">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Address</th>
                                <th>House #</th>
                                <th>Landline</th>
                                <th>Cellphone</th>
                                <th>Country</th>
                                <th>State</th>
                                <th>City</th>
                                <th>Postal Code</th>
                               
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                </table>`);
            $('#addressTable tbody').empty();
            response.client_address.forEach((element, key) => {
                $('#addressTable tbody').append(
                    `<tr>
                        <td>${key + 1}</td>
                        <td>${element['primary_address'] ? element['primary_address'] : 'NA'}</td>
                        <td>${element['house_no'] ? element['house_no'] : 'NA'}</td>
                        <td>${element['primary_landline'] ? element['primary_landline'] : 'NA'}</td>
                        <td>${element['primary_cellphone'] ? element['primary_cellphone'] : 'NA'}</td>
                        <td>${element['country'] ? element['country'] : 'NA'}</td>
                        <td>${element['state'] ? element['state'] : 'NA'}</td>
                        <td>${element['city'] ? element['city'] : 'NA'}</td>
                        <td>${element['postal_code'] ? element['postal_code'] : 'NA'}</td>
                      

                        <td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateAddress">Edit</button></td>
                    </tr>`);
            });
            $('.body_address').fadeIn();
            $('#addressTable').DataTable();




            $('.body_employe').append(
                `<table class="table table-hover dt-responsive nowrap" id="employeTable" style="width:100%;">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Company Name</th>
                                <th>Contact #</th>
                                <th>Job Title</th>
                                <th>Office #</th>
                                <th>Country</th>
                                <th>State</th>
                                <th>City</th>
                                <th>Postal Code</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                </table>`);
            $('#employeTable tbody').empty();
            response.client_employment_info.forEach((element, key) => {
                $('#employeTable tbody').append(
                    `<tr>
                        <td>${key + 1}</td>
                        <td>${element['company_name'] ? element['company_name'] : 'NA'}</td>
                        <td>${element['company_contact_number'] ? element['company_contact_number'] : 'NA'}</td>
                        <td>${element['job_title'] ? element['job_title'] : 'NA'}</td>
                        <td>${element['office_no'] ? element['office_no'] : 'NA'}</td>
                        <td>${element['country'] ? element['country'] : 'NA'}</td>
                        <td>${element['state'] ? element['state'] : 'NA'}</td>
                        <td>${element['city'] ? element['city'] : 'NA'}</td>
                        <td>${element['postal_code'] ? element['postal_code'] : 'NA'}</td>
                        <td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateEmployment">Edit</button></td>
                    </tr>`);
            });
            $('.body_employe').fadeIn();
            $('#employeTable').DataTable();





            $('.body_document').append(
                `<table class="table table-hover dt-responsive nowrap" id="documentTable" style="width:100%;">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Document Type</th>
                                <th>Document #</th>
                                <th>Issue Date</th>
                                <th>Expirey Date</th>
                                <th>Front Image</th>
                                <th>Back Image</th>
                               
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                </table>`);
            $('#documentTable tbody').empty();
            response.client_document.forEach((element, key) => {
                $('#documentTable tbody').append(`<tr>
                        <td>${key + 1}</td>
                        <td>${element['name'] ? element['name'] : 'NA'}</td>
                        <td>${element['document_number'] ? element['document_number'] : 'NA'}</td>
                        <td>${element['issuance_date'] ? element['issuance_date'] : 'NA'}</td>
                        <td>${element['expiry_date'] ? element['expiry_date'] : 'NA'}</td>
                        <td>
                            <a data-toggle="modal" data-target="#ViewCNICimg" class="btn p-0 frontimg"   onClick="openModel('${element['doc_front_image']}')">
                            <img src="/storage/${element['doc_front_image']}"  height="35px"> </a>
                            </td>
                        <td>
                            <a data-toggle="modal" data-target="#ViewCNICimg" class="btn p-0 backimg" data-imgback="/storage/${element['doc_back_image']}" onClick="openModel('${element['doc_back_image']}')" >
                            <img src="/storage/${element['doc_back_image']}" height="35px"></a>
                            </td>
                        <td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateDocument">Edit</button></td>
                    </tr>`);
            });
            $('.body_document').fadeIn();
            $('#documentTable').DataTable();


            $('.body_relative').append(
                `<table class="table table-hover dt-responsive nowrap" id="relativeTable" style="width:100%;">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Primary</th>
                                <th>Relationship</th>
                                <th>Secondary </th>
                                
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                </table>`);
            $('#relativeTable tbody').empty();

            response.client_relatives.forEach((element, key) => {

                $('#relativeTable tbody').append(
                    `<tr>
                        <td>${key + 1}</td>
                        <td>${element['primary_name']}</td>
                        <td>
                            ${element['relationship_type'] == 1 ? 'Father' : element['relationship_type'] == 2 ? 'Mother' :

                        element['relationship_type'] == 3 ? 'Son' : element['relationship_type'] == 4 ? 'Daughter' : element['relationship_type'] == 5 ? 'Brother' :
                            element['relationship_type'] == 6 ? 'Sister' : element['relationship_type'] == 7 ? 'Spouse' : element['relationship_type'] == 8 ? 'Legal Partner' :
                                element['relationship_type'] == 9 ? 'Relative' : element['relationship_type'] == 10 ? 'Friend' : 'Bussiness Partner'}
                        </td>
                        <td>${element['first_name'] ? element['first_name'] : 'NA'} ${element['middle_name'] ? element['middle_name'] : 'NA'} ${element['last_name'] ? element['last_name'] : 'NA'}</td>
                        <td><button data-json='${JSON.stringify(element)}' id="${element['client_relationships_id']}" class="btn btn-default btn-line openDataSidebarForUpdateRelative">Edit</button></td>
                    </tr>`);
            });
            $('.body_relative').fadeIn();
            $('#relativeTable').DataTable();

            $('.loader').hide();

        },

    });
}

///


if (location.pathname == "/clients") {
    fetchClientList();
}

$(document).on('click', '.customer_page_link', function () {
    var not_found = true;

    current_cust_active_page = parseFloat($(this).attr('name'));
    not_found = false;

    if (!not_found) {
        $('.cust_list_div').empty();
        $('.cust_grid_div').empty();
        all_cust[current_cust_active_page].map(function (element) {
            $('.cust_list_div').append(`<div class="Product-row">
            <div class="row">
            <div class="col colStyle" style="max-width:385px">
                <div style="display:table; margin-top: -5px; margin-bottom:-5px;">
                    <div class="_emp-D"><img
                            src="${element['picture'] ? response.base_url + element['picture'] : '/images/avatar.svg'}"
                            alt=""></div>
                    <div class="textMiddle">${element['first_name'] ? element['first_name'] : 'NA'} ${element['last_name'] ? element['last_name'] : 'NA'}</div>
                </div>
            </div>
            <div class="col colStyle" style="max-width:220px">
                <div class="pt-5">${element['country'] ? element['country'] : 'NA'}</div>
            </div>
            <div class="col colStyle" style="max-width:150px">
            <div class="pt-5">${(element['email'] ? element['email'] : 'NA')}</div>    </div>
            <div class="col colStyle" style="max-width:190px">
            <div class="pt-5">${element['life_cycle_stage'] == 1 ? 'Client' : element['life_cycle_stage'] == 2 ? 'Prospect' : element['life_cycle_stage'] == 3 ? 'Leads' : element['life_cycle_stage'] == 4 ? 'Churnned' : 'NA'}</div>

            </div>
            <div class="col colStyle" style="max-width:180px">
                <a  href="/client-view/${element['id']}" class="btn cusDetail">Detail</a>
                <a style="color: white" href="/client-edit/${element['id']}" class="btn cusDetail">Edit</a>
            </div>
        </div>
     </div>`);

            $('.cust_grid_div').append(` <div class="col-lg-3 col-md-4">
        <div class="_product-card ${element['is_active'] == '0' ? '_deactive-cus' : ''}">
         <img src="${element['profile_image'] ? base_url + element['profile_image'] : '/images/avatar.svg'}" alt="" >
            <h2 >${element['first_name'] ? element['first_name'] : 'NA'} ${element['last_name'] ? element['last_name'] : 'NA'}</h2> 
            <div class="con_info pt-0 PB-20">
                <p><i class="fa fa-phone-square"></i>${element['primary_cellphone'] ? element['primary_cellphone'] : 'NA'}</p>
                <p><i class="fa fa-envelope"></i>${(element['email'] ? element['email'] :
                    (element['email'] ? element['email'] : 'NA'))}</p>
                <p><i class="fa fa-globe"></i>${element['country'] ? element['country'] : 'NA'}</p>
    
                <div class="PT-20">
                      <a href="/client-view/${element['id']}" class="btn cusDetail-th">Detail</a>
                    <a style="color: white"href="/client-edit/${element['id']}" class="btn cusDetail-th ">Edit</a>
                </div>
                
                <div class="CountryName">${element['city'] ? element['city'] : element['city'] ? element['city'] : 'NA'}</div>

            </div>
    
        </div>
        </div>`);
        });
    }
})
var item = [];
var all_cust = [];
var item = [];
var current_action = 'client';


function fetchClientList() {
    var random_string = makeid(50);
    allCustomersList = [];
    $('.dynamic_search').val('');
    $('.dynamic_filter').val(0).trigger('change');
    if ($('.dynamic_filter').val() != '0') {
        $('.dynamic_filter').val(0).trigger('change');
        rendersearch('', 0);
        $('.count_customers').text(total_customers);

    }
    $('.tblLoader').fadeIn();
    $('.cust_list_div').empty();
    $('.cust_grid_div').empty();
    $('.list_view_div').empty();
    $('.grid_view_div').empty();


    $('.pagination_cust').empty();
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: '/client-list',
            data: {
                random_string: random_string
            },
            success: function (response) {
                $('.data_div').empty();
                $('.data_div').show();
                $('.tblLoader').hide();
                var response = JSON.parse(response);


                allCustomersList = response.client;
                $('.doc_key').val(random_string);
                $('.operation_docs').val(random_string);

                total_customers = response.client.length;
                $('.count_customers').text(total_customers);
                var recsPerPage = 12;
                total_cust_pages = Math.ceil(total_customers / recsPerPage);
                var offset = 0;
                var pageNo = 0;
                var current_records = 0;
                var array_items_count = 0;
                var total_indexes = 0;

                fetchPagination(total_cust_pages, current_records, 'client');
                $('.pagination_cust').append(`<li name="-1" class="page-item customer_page_link disabled previous"><a class="page-link" tabindex="-1">Previous</a></li>`);
                var i;
                for (i = 1; i <= total_cust_pages; i++) {
                    $('.pagination_cust').append(`<li name="${i}" class="page-item customer_page_link ${i <= 1 ? 'active' : ''}"><a class="page-link">${i}</a></li>`);
                    all_cust.push({})
                }
                $('.pagination_cust').append('<li class="page-item customer_page_link next" name="+1"><a class="page-link">Next</a></li>');
                //cust_base_url = response.base_url;
                var test = [];
                response.client.forEach(element => {

                    current_records++;
                    array_items_count++;
                    if (current_records <= 12) {
                        $('.cust_list_div').append(`<div class="Product-row " >
                        <div class="row">
                            <div class="col colStyle" style="max-width:385px">
                                <div style="display:table; margin-top: -5px; margin-bottom:-5px;">
                                    <div class="_emp-D"><img
                                            src="${element['picture'] ? response.base_url + element['picture'] : '/images/avatar.svg'}"
                                            alt=""></div>
                                    <div class="textMiddle">${element['first_name'] ? element['first_name'] : 'NA'} ${element['last_name'] ? element['last_name'] : 'NA'}</div>
                                </div>
                            </div>
                            <div class="col colStyle" style="max-width:220px">
                                <div class="pt-5">${element['country'] ? element['country'] : 'NA'}</div>
                            </div>
                           
                            <div class="col colStyle" style="max-width:150px">
                            <div class="pt-5">${(element['email'] ? element['email'] : (element['email'] ? element['email'] : 'NA'))}</div>    </div>
                            <div class="col colStyle" style="max-width:190px">
                            <div class="pt-5">${element['life_cycle_stage'] == 1 ? 'Client' : element['life_cycle_stage'] == 2 ? 'Prospect' : element['life_cycle_stage'] == 3 ? 'Leads' : element['life_cycle_stage'] == 4 ? 'Churnned' : 'NA'}</div>
                        </div>
                            <div class="col colStyle" style="max-width:180px">
                                <a  href="/client-view/${element['id']}" class="btn cusDetail">Detail</a>
                                <a style="color: white" href="/client-edit/${element['id']}" class="btn cusDetail">Edit</a>
                            </div>
                        </div>
                     </div>`);

                        $('.cust_grid_div').append(` <div class="col-lg-3 col-md-4">
                        <div class="_product-card ${element['is_active'] == '0' ? '_deactive-cus' : ''}">
                         <img src="${element['profile_image'] ? base_url + element['profile_image'] : '/images/avatar.svg'}" alt="" >
                            <h2 >${element['first_name'] ? element['first_name'] : 'NA'} ${element['last_name'] ? element['last_name'] : 'NA'}</h2> 
                            <div class="con_info pt-0 PB-20">
                                <p><i class="fa fa-phone-square"></i>${element['primary_cellphone'] ? element['primary_cellphone'] : 'NA'}</p>
                                <p><i class="fa fa-envelope"></i>${(element['email'] ? element['email'] :
                                (element['email'] ? element['email'] : 'NA'))}</p>
                                <p><i class="fa fa-globe"></i>${element['country'] ? element['country'] : 'NA'}</p>
                    
                                <div class="PT-20">
                                      <a href="/client-view/${element['id']}" class="btn cusDetail-th">Detail</a>
                                    <a style="color: white"href="/client-edit/${element['id']}" class="btn cusDetail-th ">Edit</a>
                                </div>

                                <div class="CountryName">${element['city'] ? element['city'] : element['city'] ? element['city'] : 'NA'}</div>

                            </div>
                    
                        </div>
                    </div>`);
                    }
                    test.push(element);
                    all_cust[total_indexes] = test;
                    if (array_items_count == 12) {
                        array_items_count = 0;
                        test = [];
                        total_indexes++;
                    }
                });

                resolve(allCustomersList);
            }
        });
    })
}

function rendersearch(search = null, type = null) {
    if (current_action == 'client') {
        $('.cust_list_div').empty();
        $('.cust_grid_div').empty();
        $('.list_view_div').empty();
        $('.grid_view_div').empty();
        $('.pagination_cust').empty();



        if (search == '') {
            searchArray = allCustomersList;
        } else {
            searchArray = allCustomersList.filter(function (x) {
                return (x.city ? x.city.toLowerCase().includes(search) : '') || (x.first_name ? x.first_name.toLowerCase().includes(search) : '') || (x.last_name ? x.last_name.toLowerCase().includes(search) : '') || (x.email ? x.email.toLowerCase().includes(search) : '');
            });
        }

        if (type == '1') {

            searchArray = searchArray.filter(function (x) {
                return x.life_cycle_stage == 1;
            });
        } else if (type == '2') {
            searchArray = searchArray.filter(function (x) {
                return x.life_cycle_stage == 2;
            });
        } else if (type == '3') {
            searchArray = searchArray.filter(function (x) {
                return x.life_cycle_stage == 3;
            });
        } else if (type == '4') {
            searchArray = searchArray.filter(function (x) {
                return x.life_cycle_stage == 4;
            });
        }

        var recsPerPage = 12;
        total_cust_pages = Math.ceil(searchArray.length / recsPerPage);
        $('.count_customers').text(searchArray.length);
        var offset = 0;
        var pageNo = 0;
        var current_records = 0;
        var array_items_count = 0;
        var total_indexes = 0;

        fetchPagination(total_cust_pages, current_records, 'client');
        $('.pagination_cust').append(`<li name="-1" class="page-item customer_page_link disabled previous"><a class="page-link" tabindex="-1">Previous</a></li>`);
        var i;
        for (i = 1; i <= total_cust_pages; i++) {
            $('.pagination_cust').append(`<li name="${i}" class="page-item customer_page_link ${i <= 1 ? 'active' : ''}"><a class="page-link">${i}</a></li>`);
            all_cust.push({})
        }
        $('.pagination_cust').append('<li class="page-item customer_page_link next" name="+1"><a class="page-link">Next</a></li>');
        var test = [];
        searchArray.forEach(element => {
            current_records++;
            array_items_count++;
            if (current_records <= 12) {
                $('.cust_list_div').append(`<div class="Product-row " >
                <div class="row">
                    <div class="col colStyle" style="max-width:385px">
                        <div style="display:table; margin-top: -5px; margin-bottom:-5px;">
                            <div class="_emp-D"><img
                                    src="${element['picture'] ? response.base_url + element['picture'] : '/images/avatar.svg'}"
                                    alt=""></div>
                            <div class="textMiddle">${element['first_name'] ? element['first_name'] : 'NA'} ${element['last_name'] ? element['last_name'] : 'NA'}</div>
                        </div>
                    </div>
                    <div class="col colStyle" style="max-width:220px">
                        <div class="pt-5">${element['country'] ? element['country'] : 'NA'}</div>
                    </div>
                   
                    <div class="col colStyle" style="max-width:150px">
                    <div class="pt-5">${(element['email'] ? element['email'] : 'NA')}</div>    </div>
                    <div class="col colStyle" style="max-width:190px">
                    <div class="pt-5">${element['life_cycle_stage'] == 1 ? 'Client' : element['life_cycle_stage'] == 2 ? 'Prospect' : element['life_cycle_stage'] == 3 ? 'Leads' : element['life_cycle_stage'] == 4 ? 'Churnned' : 'NA'}</div>

                    </div>
                    <div class="col colStyle" style="max-width:180px">
                        <a  href="/client-view/${element['id']}" class="btn cusDetail">Detail</a>
                        <a style="color: white" href="/client-edit/${element['id']}" class="btn cusDetail">Edit</a>
                    </div>
                </div>
             </div>`);

                $('.cust_grid_div').append(` <div class="col-lg-3 col-md-4">
                        <div class="_product-card ${element['is_active'] == '0' ? '_deactive-cus' : ''}">
                         <img src="${element['profile_image'] ? base_url + element['profile_image'] : '/images/avatar.svg'}" alt="" >
                            <h2 >${element['first_name'] ? element['first_name'] : 'NA'} ${element['last_name'] ? element['last_name'] : 'NA'}</h2> 
                            <div class="con_info pt-0 PB-20">
                                <p><i class="fa fa-phone-square"></i>${element['primary_cellphone'] ? element['primary_cellphone'] : 'NA'}</p>
                                <p><i class="fa fa-envelope"></i>${(element['email'] ? element['email'] :
                                    (element['email'] ? element['email'] : 'NA'))}</p>
                                <p><i class="fa fa-globe"></i>${element['country'] ? element['country'] : 'NA'}</p>
                    
                                <div class="PT-20">
                                      <a href="/client-view/${element['id']}" class="btn cusDetail-th">Detail</a>
                                    <a style="color: white"href="/client-edit/${element['id']}" class="btn cusDetail-th ">Edit</a>
                                </div>

                                <div class="CountryName">${element['city'] ? element['city'] : element['city'] ? element['city'] : 'NA'}</div>

                            </div>
                    
                        </div>
                    </div>`);
            }
            test.push(element);
            all_cust[total_indexes] = test;
            if (array_items_count == 12) {
                array_items_count = 0;
                test = [];
                total_indexes++;
            }
        });

    }


}


function capitalize(s) {
    return s.toLowerCase().replace(/\b./g, function (a) {
        return a.toUpperCase();
    });
};


function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}



function fetchPagination(pageLen = null, curPage = null, type = null) {

    item = [];
    for (var i = 1; i <= pageLen; i++) {
        item.push(i);
    }
    render(pageLen, curPage, item, true, type);
}



function render(pageLen = null, curPage, item, first, type) {
    if (type == 'client') {
        $('#cust_holder').empty();
    } else if (!type) {
        if (current_action == 'client') {
            $('#cust_holder').empty();
        } else {
            $('#poc_holder').empty();
        }
    } else {
        $('#poc_holder').empty();
    }
    //debugger
    var html = '';
    separatorAdded = false;
    for (var i in item) {
        if (isPageInRange(curPage, i, pageLen, 2, 2)) {
            html += '<li class="' + (type == "client" ? 'customer_page_link' : (!type ? (current_action == 'client' ? 'customer_page_link' : 'poc_page_link') : 'poc_page_link')) + '" name="' + i + '" ' + (type == "client" ? 'data-page' : (!type ? (current_action == 'client' ? 'data-page' : 'data-page-poc') : 'data-page-poc')) + '="' + i + '">' + item[i] + '</li>';
            // as we added a page, we reset the separatorAdded
            separatorAdded = false;
        } else {
            if (!separatorAdded) {
                // only add a separator when it wasn't added before
                html += '<li class="separator" />';
                separatorAdded = true;
            }
        }
    }
    if (type == 'client') {
        var holder = document.querySelector('#cust_holder');
        holder.innerHTML = html;
        document.querySelector('#cust_holder>li[data-page="' + curPage + '"]') ? document.querySelector('#cust_holder>li[data-page="' + curPage + '"]').classList.add('active') : '';
    } else if (!type) {
        if (current_action == 'client') {
            var holder = document.querySelector('#cust_holder');
            holder.innerHTML = html;
            document.querySelector('#cust_holder>li[data-page="' + curPage + '"]') ? document.querySelector('#cust_holder>li[data-page="' + curPage + '"]').classList.add('active') : '';
        } else {
            var holder = document.querySelector('#poc_holder');
            holder.innerHTML = html;
            document.querySelector('#poc_holder>li[data-page-poc="' + curPage + '"]') ? document.querySelector('#poc_holder>li[data-page-poc="' + curPage + '"]').classList.add('active') : '';
        }
    } else {
        var holder = document.querySelector('#poc_holder');
        holder.innerHTML = html;
        document.querySelector('#poc_holder>li[data-page-poc="' + curPage + '"]') ? document.querySelector('#poc_holder>li[data-page-poc="' + curPage + '"]').classList.add('active') : '';
    }

    if (first) {
        holder.addEventListener('click', function (e) {
            if (!e.target.getAttribute((type == "client" ? 'data-page' : 'data-page-poc'))) {
                // no relevant item clicked (you could however offer expand here )
                return;
            }
            curPage = parseInt(e.target.getAttribute((type == "client" ? 'data-page' : 'data-page-poc')));
            render(pageLen, curPage, item);
        });
    }
}

function isPageInRange(curPage, index, maxPages, pageBefore, pageAfter) {
    if (index <= 1) {
        // first 2 pages
        return true;
    }
    if (index >= maxPages - 2) {
        // last 2 pages
        return true;
    }
    if (index >= curPage - pageBefore && index <= curPage + pageAfter) {
        return true;
    }
}
//Dynamic Search And Filter
$(document).on('input', '.dynamic_search', function () {

    if ($(this).val().length > 0) {

        rendersearch($(this).val(), $('.dynamic_filter').val());
    }
    if ($(this).val() == '') {

        rendersearch($(this).val(), $('.dynamic_filter').val());
    }
})

$(document).on('change', '.dynamic_filter', function () {

    rendersearch($('.dynamic_search').val(), $(this).val());
})

//Function to Open Images in Model
function openModel(id) {
    
    $('.preview  .modal-body').html('<img src="/storage/' + `${id}` + '" class="cnicCardimg" />');
};

$(document).ready(function () {


    $(document).on('click', '.dropify-clear', function () {

        var old_input_name = $(this).parent().children('input').attr('data-old_input');
        $('input[name="' + old_input_name + '"]').val('');
        $(this).parent().children('input').val('')

    })
})
$(document).on('click', '.confirm_delete', function () {

    var id = $(this).attr('data-id');
    var image = $(this).attr('data-image');

    $.ajax({
        type: "POST",
        url: '/remove-doc-images/' + id,
        data: {

            image: image,
        },
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content') },
        success: function (response) {
            if (response.status == 'success') {
                $('.cancel_delete_modal').click();
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Successfully deleted.');
                fetchAllData();
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
$('.bulk_upload_btn').on('click', function () {

    $('.error_message_div').hide();
    $('.not_uploadable_client_table').empty();
    $('.excel_file_input').val('');
    $('.file_name').text('Choose File');
})
$('.upload_excel_file_btn').on('click', function () {
    //Validate if InputFile is Empty
    if ($('.excel_file_input').get(0).files.length === 0) {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please Upload File');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    var thisRef = $(this);
    thisRef.text('Processing...');
    thisRef.attr('disabled', 'disabled');
    $('#upload_excel_form').ajaxSubmit({
        type: 'POST',
        url: '/upload-excel-file',
        success: function (response) {
            thisRef.removeAttr('disabled');
            thisRef.text('Upload');
            $('.file_name').text('Choose File');
            $('.excel_file_input').val('');
            $('.error_message_div').hide();
            $('.not_uploadable_client_table').empty();
            if (response.status == 'failed') {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Failed to add clients at the moment');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            } else {
                fetchClientList();
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Added Successfully');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
            if (response.not_uploaded.length > 0) {
                $('.error_message_div').show();
                $('.not_uploadable_client_table').append(`
                    <table class="table table-hover dt-responsive nowrap" id="not_uploadable_clients" style="width:100%;">
                        <thead>
                            <tr>
                                <th>Excel S.No</th>
                                <th>Primary Address</th>
                                <th>Reason</th>
                            </tr>
                        </thead>
                                 <tbody></tbody>
                    </table>`
                );
                $('#not_uploadable_clients tbody').empty();
                response.not_uploaded.forEach(element => {
                    $('#not_uploadable_clients tbody').append(`
                                <tr>
                                    <td>${element.count + 1}</td>
                                    <td>${element.primary_address}</td>
                                    <td>${element.reason}</td>
                                </tr> `)
                })
                
                $('#not_uploadable_clients').DataTable();
            } else {
                $('.close_modal').click();
            }
        },
        error: function (e) {
        }
    })
})
//Excel Sheet Input Change Action
$(document).on('change', '.excel_file_input', function () {
    var file = $('.excel_file_input')[0].files[0]
    if (file) {
        $('.file_name').text(file.name);
    }
});
