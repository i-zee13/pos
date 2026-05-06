let dateTimeFormat      =  "yyyy-mm-dd hh:ii";
let dateFormat          =  "yyyy-mm-dd";
let timeFormat          =  "hh:ii";
var primary_id          =   '';
var secondary_id        =   '';
var fetch_documents     =   [];
var fetch_relations     =   [];
var form_id_document    =   [];
var form_id_relation    =   [];
var country_id_em       =   0;
var state_id_em         =   0;
var city_id_em          =   0;
var postal_code_id_em   =   0;
var country_id_mar      =   0;
var state_id_mar        =   0;
var city_id_mar         =   0;
var default_country_id  =   0;
var country_id_client   =   0;
var state_id_client     =   0;
var city_id_client      =   0;
var postal_code_id_client = 0;
var country_id_poa      =   0;
var state_id_poa        =   0;
var city_id_poa         =   0;
var postal_code_id_poa  =   0;
var guar_country_id     =   0;
var guar_state_id       =   0;
var guar_city_id        =   0;
var guar_postal_code_id =   0;
var option_countries    =   ''
let current_year        =   new Date();
let full_year           =   current_year.getFullYear();
// var maxBirthdayDate =   new Date();
// maxBirthdayDate.setFullYear(maxBirthdayDate.getFullYear() - 18);
// alert(maxBirthdayDate.getFullYear())
function datepicker(cls='form-datepicker'){
    $(`.${cls}`).datepicker({
        format      :   dateFormat,
        // changeYear  :   true,
        // yearRange   :   "1950:"+maxBirthdayDate.getFullYear(),  
    })
}
$(document).ready(function(){ 
    //datepicker2
    datepicker();
    //  ///after refresh open current tab
    // $('a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
    //     localStorage.setItem('activetab', $(e.target).attr('href'));
    // });
    // var activetab = localStorage.getItem('activetab');
    // if(activetab){
    //     $('.nav-pills a[href="' + activetab + '"]').tab('show');
    // }
    ///end after refresh open current tab
    if($('#v-pills-01-tab').hasClass('active')){
        $('#v-pills-02-tab').addClass('disable-click');
        $('#v-pills-03-tab').addClass('disable-click');
        $('#v-pills-04-tab').addClass('disable-click');
        $('#v-pills-05-tab').addClass('disable-click');
        $('#v-pills-06-tab').addClass('disable-click');
        $('#v-pills-07-tab').addClass('disable-click');
        $('#v-pills-08-tab').addClass('disable-click');
        $('#v-pills-09-tab').addClass('disable-click');
        $('#v-pills-10-tab').addClass('disable-click');
        $('#v-pills-11-tab').addClass('disable-click');
        $('#v-pills-12-tab').addClass('disable-click');
    }
    $('#employee_form').hide();
    $('#marital_form').hide();
    $('#job_title_hide').hide();
    $('#marital_first_name_hide').hide();
    $('.guardian_form').hide();
    default_country_id      = $('#default_country').val();
    country_id_client       = $('#client_country').val();
    state_id_client         = $('#client_state').val();
    city_client             = $('#client_city').val();
    postal_code_id_client   = $('#client_postal_code').val();
    country_id_poa          = $('#poa_country').val();
    state_id_poa            = $('#poa_state').val();
    city_poa                = $('#poa_city').val();
    postal_code_id_poa      = $('#poa_postal_code').val();
    guar_country_id         = $('#guar_country_id').val();
    guar_state_id           = $('#guar_state_id').val();
    guar_city_id            = $('#guar_city_id').val();
    guar_postal_code_id     = $('#guar_postal_code_id').val();
    // Sno for Wills
})
$.when($.ajax({
    url:`/intake/get-all-countries`,
    success: function (response) {
        $('.all_countries_client').empty();
        $('.all_countries_client').append(`<option value="-1" selected disabled>Select Country</option>`);
        response.countries.forEach((country) => {
            $('.all_countries_client').append(`<option value="${country['id']}" >${country['name']}</option>`);
        });
    },
    error: function (response) {
        alert('error in fetching get countries')
    }
})).then(function (){
    if(country_id_client){
        $('.all_countries_client').val(country_id_client).trigger('change');  
    }else{
        $('.all_countries_client').val(default_country_id).trigger('change');
    }
});
$('.all_countries_client').change(function(){
    $('.all_states_client').empty();
    var country_id = $(this).val();
    $.ajax({
        url: `/intake/get-states-against-countries/${country_id}`,
        success: function (e) {
            $('.all_states_client').empty();
            $('.all_states_client').append(`<option value="-1" selected disabled>Select State</option>`);
            $.when(e.states.forEach((state) => {
                $('.all_states_client').append(`<option value="${state['id']}" >${state['name']}</option>`);
            })).then(function(){
                if(state_id_client){
                    $('.all_states_client').val(state_id_client).trigger('change');
                }   
            });
        },
        error: function (e) {
            alert('error in fetching States')
        }
    })
})
// All Cities against states
$('.all_states_client').change(function(){
    $('.all_cities_client').empty();
    var state_id = $(this).val();
    $.ajax({
        url:`/intake/get-cities-against-states/${state_id}`,
        success: function (f) {
            $('.all_cities_client').empty();
            $('.all_cities_client').append(`<option value="-1" selected disabled>Select City </option>`);
            f.cities.forEach((city) => {
                $('.all_cities_client').append(`<option value="${city['id']}" >${city['name']}</option>`);
            })
            if(city_client){
                $('.all_cities_client').val(city_client).trigger('change');
            }
        },
        error: function (f) {
            alert('error in fetching Cities')
        }
    })
})
////Guardian
$.when($.ajax({
    url:`/intake/get-all-countries`,
    success: function (response) {
        $('.all_countries_guar').empty();
        $('.all_countries_guar').append(`<option value="-1" selected disabled>Select Country</option>`);
        response.countries.forEach((country) => {
            $('.all_countries_guar').append(`<option value="${country['id']}" >${country['name']}</option>`);
        });
    },
    error: function (response) {
        alert('error in fetching get countries')
    }
})).then(function (){
    if(guar_country_id){
        $('.all_countries_guar').val(guar_country_id).trigger('change');  
    }else{
        $('.all_countries_guar').val(default_country_id).trigger('change');
    }
});
$('.all_countries_guar').change(function(){
    $('.all_states_guar').empty();
    var country_id = $(this).val();
    $.ajax({
        url: `/intake/get-states-against-countries/${country_id}`,
        success: function (e) {
            $('.all_states_guar').empty();
            $('.all_states_guar').append(`<option value="-1" selected disabled>Select State</option>`);
            $.when(e.states.forEach((state) => {
                $('.all_states_guar').append(`<option value="${state['id']}" >${state['name']}</option>`);
            })).then(function(){
                if(guar_state_id){
                    $('.all_states_guar').val(guar_state_id).trigger('change');
                }   
            });
        },
        error: function (e) {
            alert('error in fetching States')
        }
    })
})
// All Cities against states
$('.all_states_guar').change(function(){
    $('.all_cities_guar').empty();
    var state_id = $(this).val();
    $.ajax({
        url:`/intake/get-cities-against-states/${state_id}`,
        success: function (f) {
            $('.all_cities_guar').empty();
            $('.all_cities_guar').append(`<option value="-1" selected disabled>Select City </option>`);
            f.cities.forEach((city) => {
                $('.all_cities_guar').append(`<option value="${city['id']}" >${city['name']}</option>`);
            })
            if(guar_city_id){
                $('.all_cities_guar').val(guar_city_id).trigger('change');
            }
        },
        error: function (f) {
            alert('error in fetching Cities')
        }
    })
})
if($('#intake_form_type').val() == 5){
    $('#beneficiary_type_div').css('display','block');
    $('#beneficiary_types').addClass('required_poa');
    $(document).on('click','#previous_funeral_save',function(){
        $('#v-pills-11-tab').addClass('active');
        $('#v-pills-11').addClass('active');
        $('#v-pills-11').addClass('show');
        $('#v-pills-12-tab').removeClass('active');
        $('#v-pills-12').removeClass('active');
        $('#v-pills-12').removeClass('show'); 
    })
    $(document).on('click','#previous_distributed_save',function(){
        $('#v-pills-10-tab').addClass('active');
        $('#v-pills-10').addClass('active');
        $('#v-pills-10').addClass('show');
        $('#v-pills-11-tab').removeClass('active');
        $('#v-pills-11').removeClass('active');
        $('#v-pills-11').removeClass('show'); 
    })
    
    $(document).on('click','#previous_assets_save',function(){
        $('#v-pills-05-tab').addClass('active');
        $('#v-pills-05').addClass('active');
        $('#v-pills-05').addClass('show');
        $('#v-pills-10-tab').removeClass('active');
        $('#v-pills-10').removeClass('active');
        $('#v-pills-10').removeClass('show'); 
    })
    $(document).on('click','#previous_guardian_save',function(){
        $('#v-pills-06-tab').addClass('active');
        $('#v-pills-06').addClass('active');
        $('#v-pills-06').addClass('show');
        $('#v-pills-09-tab').removeClass('active');
        $('#v-pills-09').removeClass('active');
        $('#v-pills-09').removeClass('show'); 
    })
    $(document).on('click','#previous-poa-btn',function(){
        $('#v-pills-01-tab').addClass('active');
        $('#v-pills-01').addClass('active');
        $('#v-pills-01').addClass('show');
        $('#v-pills-06-tab').removeClass('active');
        $('#v-pills-06').removeClass('active');
        $('#v-pills-06').removeClass('show');
    })
}
if($('#intake_form_type').val() <= 4){
    $(document).on('click','#previous-form2',function(){
        $('#v-pills-01-tab').addClass('active');
        $('#v-pills-01').addClass('active');
        $('#v-pills-01').addClass('show');
        $('#v-pills-02-tab').removeClass('active');
        $('#v-pills-02').removeClass('active');
        $('#v-pills-02').removeClass('show');
    })
    $(document).on('click','#previous-form3',function(){
        $('#v-pills-02-tab').addClass('active');
        $('#v-pills-02').addClass('active');
        $('#v-pills-02').addClass('show');
        $('#v-pills-03-tab').removeClass('active');
        $('#v-pills-03').removeClass('active');
        $('#v-pills-03').removeClass('show');
    })
    $(document).on('click','#previous-form4',function(){
        $('#v-pills-04-tab').addClass('active');
        $('#v-pills-04').addClass('active');
        $('#v-pills-04').addClass('show');
        $('#v-pills-05-tab').removeClass('active');
        $('#v-pills-05').removeClass('active');
        $('#v-pills-05').removeClass('show');
    })
    $(document).on('click','#previous_capacity_form',function(){
        $('#v-pills-03-tab').addClass('active');
        $('#v-pills-03').addClass('active');
        $('#v-pills-03').addClass('show');
        $('#v-pills-04-tab').removeClass('active');
        $('#v-pills-04').removeClass('active');
        $('#v-pills-04').removeClass('show');
    })
    $(document).on('click','#previous-form5',function(){
        $('#v-pills-05-tab').addClass('active');
        $('#v-pills-05').addClass('active');
        $('#v-pills-05').addClass('show');  
        $('#v-pills-06-tab').removeClass('active');
        $('#v-pills-06').removeClass('active');
        $('#v-pills-06').removeClass('show');
    })
    $(document).on('click','#previous_consent_save',function(){
        $('#v-pills-05-tab').addClass('active');
        $('#v-pills-05').addClass('active');
        $('#v-pills-05').addClass('show');
        $('#v-pills-07-tab').removeClass('active');
        $('#v-pills-07').removeClass('active');
        $('#v-pills-07').removeClass('show');
    })
    
    $(document).on('click','#previous_email_template_save',function(){
        $('#v-pills-07-tab').addClass('active');
        $('#v-pills-07').addClass('active');
        $('#v-pills-07').addClass('show');
        $('#v-pills-08-tab').removeClass('active');
        $('#v-pills-08').removeClass('active');
        $('#v-pills-08').removeClass('show');
    })
}
if($('#intake_form_type').val() > 5){
    $(document).on('click','#previous-form4',function(){
        $('#v-pills-01-tab').addClass('active');
        $('#v-pills-01').addClass('active');
        $('#v-pills-01').addClass('show');
        $('#v-pills-05-tab').removeClass('active');
        $('#v-pills-05').removeClass('active');
        $('#v-pills-05').removeClass('show');
    })
    $(document).on('click','#previous-form5',function(){
        $('#v-pills-05-tab').addClass('active');
        $('#v-pills-05').addClass('active');
        $('#v-pills-05').addClass('show');
        $('#v-pills-06-tab').removeClass('active');
        $('#v-pills-06').removeClass('active');
        $('#v-pills-06').removeClass('show');
    })
}
    $('#form1').on('click',function(){
        var emailReg            =   /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        var numberReg           =   /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
        var lettersReg          =   /^(?![\s.]+$)[a-zA-Z\s.]*$/;
        var primary_landline    =   $('#primary_landline').val();
        var primary_cellphone   =   $('#primary_cellphone').val();
        var email               =   $('#email').val();
        var p_first             =   $('#first_name').val();
        var p_middle            =   $('#middle_name').val();
        var p_last              =   $('#last_name').val();
        let dirty               =   false;
        let count_input         =   0;
        let client_input_name   =   '';
        let current_client_input=   '';
            $('.required_client').each(function () {
                if (!$(this).val() || $(this).val() == 0) {
                    if( dirty == false){
                        $(this).focus();
                    }
                    dirty = true;
                    if ($(this).hasClass('formselect')) {
                        $(this).parent().find('.select2-selection--single').css('border', '1px solid red');
                    }else{
                        $(this).css('border', '1px solid red');
                        current_client_input = $(this);
                    }
                    
                    client_input_name = $(this).attr('client-data-name');
                    count_input++; 
                }else{
                    $(this).css('border', '1px solid #e5e5e5');
                    $(this).parent().find('.select2-selection--single').css('border', '1px solid #e5e5e5');
                }
            });
            if (dirty && count_input >=2) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Fill All Required Fields (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (count_input <= 1 && client_input_name != '') {
                $(current_client_input).focus();
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text(`Required ${client_input_name}`);
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return; 
            }
            if (lettersReg.test(p_first)==false && p_first != '') {
                $('#first_name').focus();
                $('#first_name').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct First Name');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (lettersReg.test(p_middle)==false && p_middle != '') {
                $('#middle_name').focus();
                $('#middle_name').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Middle Name');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (lettersReg.test(p_last)==false && p_last != '') {
                $('#last_name').focus();
                $('#last_name').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Last Name');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            ///Verfiy Primary Number Format
            if (numberReg.test(primary_landline)==false && primary_landline != '') {
                $('#primary_landline').focus();
                $('#primary_landline').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Home Phone Number');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            ///Verfiy CellPhone Number Format
            if (numberReg.test(primary_cellphone)==false && primary_cellphone != '') {
                $('#primary_cellphone').focus();
                $('#primary_cellphone').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Cell Phone Number');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            ///Verfiy Email Format
            if (emailReg.test(email)==false && email != '') {
                $('#email').focus();
                $('#email').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Email');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            var postal_code = $('#postal_codes_client').val();
            var postal_expression = /^[a-zA-Z0-9]{6}$/;
            if (postal_expression.test(postal_code) == false && postal_code != '') {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Alpha Numeric Format of Postal Code');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }

        $('#savePrimaryClient').ajaxSubmit({
            type    :   'POST',
            url     :   '/intake/save-client',
            success :   function(response){
                if(response.msg=='success'){
                    $('.form-progress-bar').css('width','20%');
                    $('.form-progress-bar').text('20%');
                    $('#hidden_client_id').val(response.client.id);
                    $('#v-pills-01-tab').removeClass('active');
                    $('#v-pills-01').removeClass('active');
                    $('#v-pills-01').removeClass('show');
                    if($('#intake_form_type').val() <= 4){
                        $('#v-pills-02-tab').addClass('active');
                        $('#v-pills-02').addClass('active');
                        $('#v-pills-02').addClass('show');
                        $('#v-pills-02-tab').removeClass('disable-click');
                        $('#v-pills-03-tab').addClass('disable-click');
                        $('#v-pills-05-tab').addClass('disable-click');
                        $('#v-pills-06-tab').addClass('disable-click');
                    }else if($('#intake_form_type').val() == 5){
                        $('#v-pills-06-tab').addClass('active');
                        $('#v-pills-06').addClass('active');
                        $('#v-pills-06').addClass('show');
                        $('#v-pills-06-tab').removeClass('disable-click');
                        $('#v-pills-09-tab').addClass('disable-click');
                        $('#v-pills-10-tab').addClass('disable-click');
                        $('#v-pills-11-tab').addClass('disable-click');
                        $('#v-pills-12-tab').addClass('disable-click');
                    }else{
                        $('#v-pills-05-tab').addClass('active');
                        $('#v-pills-05').addClass('active');
                        $('#v-pills-05').addClass('show');
                        $('#v-pills-05-tab').removeClass('disable-click');
                        $('#v-pills-06-tab').addClass('disable-click');
                        $('#v-pills-02-tab').addClass('disable-click');
                        $('#v-pills-03-tab').addClass('disable-click');
                    }
                    $('#employee_status').val(response.client.employment_status).trigger('change');
                    $('#marital_status').val(response.client.marital_status).trigger('change');
                    client_employment();
                    clients_all_documents();
                    // $('#notifDiv').fadeIn();
                    // $('#notifDiv').css('background', 'green');
                    // $('#notifDiv').text('Data Added');
                    // setTimeout(() => {
                    //     $('#notifDiv').fadeOut();
                    // }, 3000);
                }else if(response.msg == "already_exists"){
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Email Already Exists');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }else if(response.msg == "dob_not_18"){
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Minimum DOB is 18 Years');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }else{
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not Added at this moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            },
            error   :   function(e){
                $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not Added at this Moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
            }   
        })
    });
    ///Employee Form show if employee status is 1 OR 3
    $('#employee_status').change(function(){
        var status_id = $(this).val();
        if(status_id == 1 || status_id == 3){
            $('#employee_form').show();
            $('#job_title_hide').show();
            $('.employee_info').addClass('employee_required');
        }else{
            $('.employee_info').removeClass('employee_required');
            $('#employee_form').hide();
            $('#job_title_hide').hide();
        }
    })
    $('#form2').on('click',function(){
        var numberReg               =   /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
        var company_contact_number  =   $('#company_contact_number').val();

        let dirty_employee          =   false;
        let employee_count_input    =   0;
        let employee_input_name     =   '';
        let current_employee_input  =   '';
            $('.employee_required').each(function () {
                if (!$(this).val() || $(this).val() == 0) {
                    if(dirty_employee == false){
                        $(this).focus();
                    }
                    dirty_employee = true;
                    if ($(this).hasClass('formselect')) {
                        $(this).parent().find('.select2-selection--single').css('border', '1px solid red');
                    }else{
                        $(this).css('border', '1px solid red');
                        current_employee_input = $(this);
                    }
                    employee_input_name = $(this).attr('data-employee-name');
                    employee_count_input++; 
                }else{
                    $(this).css('border', '1px solid #e5e5e5');
                    $(this).parent().find('.select2-selection--single').css('border', '1px solid #e5e5e5');
                }
            });
            if (dirty_employee && employee_count_input >=2) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Fill All Required Fields (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (employee_count_input <= 1 && employee_input_name != '') {
                $(current_employee_input).focus();
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text(`Required ${employee_input_name}`);
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return; 
            }
            ///Verfiy Company Contact Number Format
            if (numberReg.test(company_contact_number)==false && company_contact_number != '') {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Company Contact Number');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            var postal_code_emp         = $('#all_postal_codes').val();
            var postal_expression_emp   = /^[a-zA-Z0-9]{6}$/;
            if (postal_expression_emp.test(postal_code_emp) == false && postal_code_emp != '') {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Alpha Numeric Format of Postal Code');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            $('#SaveClientEmployeeInfo').ajaxSubmit({
                type    :   'POST',
                url     :   '/intake/save-client-employee-info',
                success :   function(response){
                    client_employment();
                    if(response.insert_employee=='Employment Info Added'){
                        $('.form-progress-bar').css('width','40%');
                        $('.form-progress-bar').text('40%');
                        $('#v-pills-02-tab').removeClass('active');
                        $('#v-pills-02').removeClass('active');
                        $('#v-pills-02').removeClass('show');
                        if($('#intake_form_type').val() <= 4){
                            $('#v-pills-03-tab').addClass('active');
                            $('#v-pills-03').addClass('active');
                            $('#v-pills-03').addClass('show');
                            $('#v-pills-03-tab').removeClass('disable-click');
                            $('#v-pills-04-tab').addClass('disable-click');
                            $('#v-pills-05-tab').addClass('disable-click');
                            $('#v-pills-06-tab').addClass('disable-click');
                        }
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Employment Info Added');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }else if(response.update_employee=='Employee Occupation Status Update'){
                        $('.form-progress-bar').css('width','40%');
                        $('.form-progress-bar').text('40%');
                        $('#v-pills-02-tab').removeClass('active');
                        $('#v-pills-02').removeClass('active');
                        $('#v-pills-02').removeClass('show');
                        if($('#intake_form_type').val() <= 4){
                            $('#v-pills-03-tab').addClass('active');
                            $('#v-pills-03').addClass('active');
                            $('#v-pills-03').addClass('show');
                            $('#v-pills-03-tab').removeClass('disable-click');
                            $('#v-pills-04-tab').addClass('disable-click');
                            $('#v-pills-05-tab').addClass('disable-click');
                            $('#v-pills-06-tab').addClass('disable-click');
                        }
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Employee Occupation Status Update');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }else{
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text('Not Added at this moment');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }
                },
                error   :   function(e){
                    $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text('Not Added at this Moment');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                }   
            })   
    })
    ///Marital Form show if Marital status is 1 OR 3
    $('#marital_status').change(function(){
        var status_id = $(this).val();
        if(status_id == 1 || status_id == 3){
            $('#marital_form').show();
            $('#marital_first_name_hide').show();
            $('.marital_info').addClass('marital_required');
        }else{
            $('#marital_form').hide();
            $('#marital_first_name_hide').hide();
            $('.marital_info').removeClass('marital_required');
        }
    })
    $('#form3').on('click',function(){
        var numberReg      =   /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
        var emailReg       =   /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        var lettersReg     =   /^(?![\s.]+$)[a-zA-Z\s.]*$/;
        var cell_phone_no  =   $('#mar_cell_phone_no').val();
        var home_phone_no  =   $('#mar_home_phone_no').val();
        var s_email        =   $('#mar_email').val();
        var s_first        =   $('#mar_first_name').val();
        var s_middle       =   $('#mar_middle_name').val();
        var s_last         =   $('#mar_last_name').val();
        let marital_count_input    =   0;
        let marital_input_name     =   '';
        let current_marital_input  =   '';
        let dirty_marital          =   false;
            $('.marital_required').each(function () {
                if (!$(this).val() || $(this).val() == 0) {
                    if( dirty_marital == false){
                        $(this).focus();
                    }
                    dirty_marital = true;
                    if ($(this).hasClass('formselect')) {
                        $(this).parent().find('.select2-selection--single').css('border', '1px solid red');
                    }else{
                        $(this).css('border', '1px solid red');
                        current_marital_input = $(this);
                    }
                    marital_input_name = $(this).attr('data-marital-name');
                    marital_count_input++; 
                }else{
                    $(this).css('border', '1px solid #e5e5e5');
                    $(this).parent().find('.select2-selection--single').css('border', '1px solid #e5e5e5');
                }
            });
            if (dirty_marital && marital_count_input >=2) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Fill All Required Fields (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (marital_count_input <= 1 && marital_input_name != '') {
                $(current_marital_input).focus();
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text(`Required ${marital_input_name}`);
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return; 
            }
            if (lettersReg.test(s_first)==false  && s_first != '') {
                $('#mar_first_name').focus();
                $('#mar_first_name').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct First Name');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (lettersReg.test(s_middle)==false  && s_middle != '') {
                $('#mar_middle_name').focus();
                $('#mar_middle_name').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Middle Name');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (lettersReg.test(s_last)==false  && s_last != '') {
                $('#mar_last_name').focus();
                $('#mar_last_name').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Last Name');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            ///Verfiy Primary Number Format
            if (numberReg.test(home_phone_no)==false && home_phone_no != '') {
                $('#mar_home_phone_no').focus();
                $('#mar_home_phone_no').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Home Phone Number');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            ///Verfiy CellPhone Number Format
            if (numberReg.test(cell_phone_no)==false  && cell_phone_no != '') {
                $('#mar_cell_phone_no').focus();
                $('#mar_cell_phone_no').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Cell Phone Number');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            ///Verfiy Email Format
            if (emailReg.test(s_email)==false  && s_email != '') {
                $('#mar_email').focus();
                $('#mar_email').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Email');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            $('#SaveClientMaritalInfo').ajaxSubmit({
                type    :   'POST',
                url     :   '/intake/save-client-marital-info',
                success :   function(response){
                    client_marital_details();
                    if(response.insert_marital=='Spouse Info Added'){
                        $('.form-progress-bar').css('width','60%');
                        $('.form-progress-bar').text('60%');
                        $('#v-pills-03-tab').removeClass('active');
                        $('#v-pills-03').removeClass('active');
                        $('#v-pills-03').removeClass('show');
                        if($('#intake_form_type').val() <= 4){
                            // $('#v-pills-05-tab').addClass('active');
                            // $('#v-pills-05').addClass('active');
                            // $('#v-pills-05').addClass('show');
                            $('#v-pills-04-tab').addClass('active');
                            $('#v-pills-04').addClass('active');
                            $('#v-pills-04').addClass('show');
                            $('#v-pills-04-tab').removeClass('disable-click');
                            // $('#v-pills-05-tab').addClass('disable-click');
                            $('#v-pills-06-tab').addClass('disable-click');
                        }
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Marital Details Added');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }else if(response.update_marital=='Client Marital Status Update'){
                        $('.form-progress-bar').css('width','60%');
                        $('.form-progress-bar').text('60%');
                        $('#v-pills-03-tab').removeClass('active');
                        $('#v-pills-03').removeClass('active');
                        $('#v-pills-03').removeClass('show');
                        if($('#intake_form_type').val() <= 4){
                            $('#v-pills-04-tab').addClass('active');
                            $('#v-pills-04').addClass('active');
                            $('#v-pills-04').addClass('show');
                            $('#v-pills-04-tab').removeClass('disable-click');
                            // $('#v-pills-05-tab').addClass('disable-click');
                            $('#v-pills-06-tab').addClass('disable-click');
                        }
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Marital Status Updated');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }else{
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text('Not Added at this moment');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }
                },
                error   :   function(e){
                    $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text('Not Added at this Moment');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                }   
            })   
    })
    //Guardian Form Show if status 1
    $('#guardian_status').change(function(){
        var guardian_id = $(this).val();
        if(guardian_id == 1){
            $('.guardian_form').show();
            $('.guardian_info').addClass('guardian_required');
        }else{
            $('.guardian_info').removeClass('guardian_required');
            $('.guardian_form').hide();
        }
    })
    $('#guardian_save').on('click',function(){
        var emailReg            =   /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        var numberReg           =   /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
        var lettersReg          =   /^(?![\s.]+$)[a-zA-Z\s.]*$/;
        var g_landline          =   $('#guar_home_phone_no').val();
        var g_cellphone         =   $('#guar_cell_phone_no').val();
        var g_email             =   $('#guar_email').val();
        var g_first             =   $('#guar_first_name').val();
        var g_middle            =   $('#guar_middle_name').val();
        var g_last              =   $('#guar_last_name').val();
        let guardian_count_input    =   0;
        let guardian_input_name     =   '';
        let current_guardian_input  =   '';
        let dirty_guardian          =   false;
            $('.guardian_required').each(function () {
                if (!$(this).val()) {
                    if( dirty_guardian == false){
                        $(this).focus();
                    }
                    dirty_guardian = true;
                    if ($(this).hasClass('formselect')) {
                        $(this).parent().find('.select2-selection--single').css('border', '1px solid red');
                    }else{
                        $(this).css('border', '1px solid red');
                        current_guardian_input = $(this);
                    }
                    guardian_input_name = $(this).attr('data-guardian-name');
                    guardian_count_input++; 
                }else{
                    $(this).css('border', '1px solid #e5e5e5');
                    $(this).parent().find('.select2-selection--single').css('border', '1px solid #e5e5e5');
                }
            });
            if (dirty_guardian && guardian_count_input >=2) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Fill All Required Fields (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (guardian_count_input <= 1 && guardian_input_name != '') {
                $(current_guardian_input).focus();
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text(`Required ${guardian_input_name}`);
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return; 
            }
        if (lettersReg.test(g_first)==false && g_first != '') {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Enter Correct First Name');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        if (lettersReg.test(g_middle)==false && g_middle != '') {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Enter Correct Middle Name');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        if (lettersReg.test(g_last)==false && g_last != '') {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Enter Correct Last Name');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        ///Verfiy Primary Number Format
        if (numberReg.test(g_landline)==false && g_landline != '') {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Enter Correct Home Phone Number');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        ///Verfiy CellPhone Number Format
        if (numberReg.test(g_cellphone)==false && g_cellphone != '') {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Enter Correct Cell Phone Number');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        ///Verfiy Email Format
        if (emailReg.test(g_email)==false && g_email != '') {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Enter Correct Email');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        $('#SaveGuardiansFrom').ajaxSubmit({
            type    :  'POST',
            url     :  '/intake/save-guardian-info',
            success : function(e){
                if(e.msg=='guardian_added'){
                    if(e.guardian_id == 0){
                        $('#guradian_details_id').val(e.pre_guardian_id);
                    }else{
                        $('#guradian_details_id').val(e.guardian_id);
                    }
                    $('#v-pills-09-tab').removeClass('active');
                    $('#v-pills-09').removeClass('active');
                    $('#v-pills-09').removeClass('show');
                    $('.form-progress-bar').css('width','40%');
                    $('.form-progress-bar').text('40%');
                    $('#v-pills-05-tab').addClass('active');
                    $('#v-pills-05').addClass('active');
                    $('#v-pills-05').addClass('show');
                    $('#v-pills-05-tab').removeClass('disable-click');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Guardian Added');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }else if(e.msg == "dob_not_18"){
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Minimum DOB is 18 Years');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }else{
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not Added at this Moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        })      
    })
    //Assets Form
    $('#assets_save').on('click',function(){
        let assets_count_input    =   0;
        let assets_input_name     =   '';
        let current_assets_input  =   '';
        let dirty_assets          =   false;
            $('.assets_required').each(function () {
                if (!$(this).val() || $(this).val() == 0) {
                    if( dirty_assets == false){
                        $(this).focus();
                    }
                    dirty_assets = true;
                    $(this).css('border', '1px solid red');
                    current_assets_input = $(this);
                    assets_input_name = $(this).attr('data-assets-name');
                    assets_count_input++; 
                }else{
                    $(this).css('border', '1px solid #e5e5e5');
                }
            });
            if (dirty_assets && assets_count_input >=2) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Fill All Required Fields (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (assets_count_input <= 1 && assets_input_name != '') {
                $(current_assets_input).focus();
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text(`Required ${assets_input_name}`);
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return; 
            }
        $('#SaveWillAssetsFrom').ajaxSubmit({
            type    :  'POST',
            url     :  '/intake/save-will-assets',
            success : function(e){
                if(e.msg=='will_assets_added'){
                    $('#v-pills-10-tab').removeClass('active');
                    $('#v-pills-10').removeClass('active');
                    $('#v-pills-10').removeClass('show');
                    $('.form-progress-bar').css('width','60%');
                    $('.form-progress-bar').text('60%');
                    $('#v-pills-11-tab').addClass('active');
                    $('#v-pills-11').addClass('active');
                    $('#v-pills-11').addClass('show');
                    $('#v-pills-11-tab').removeClass('disable-click');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Assets Added');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }else{
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not Added at this Moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        }) 
    })
    // Estate Distributed Form
    $('#distributed_save').on('click',function(){
        let distributed_count_input    =   0;
        let distributed_input_name     =   '';
        let current_distributed_input  =   '';
        let dirty_distributed          =   false;
            $('.distributed_required').each(function () {
                if (!$(this).val() || $(this).val() == 0) {
                    if( dirty_distributed == false){
                        $(this).focus();
                    }
                    dirty_distributed = true;
                    $(this).css('border', '1px solid red');
                    current_distributed_input = $(this);
                    distributed_input_name = $(this).attr('data-distributed-name');
                    distributed_count_input++; 
                }else{
                    $(this).css('border', '1px solid #e5e5e5');
                }
            });
            if (dirty_distributed && distributed_count_input >=2) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Fill All Required Fields (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (distributed_count_input <= 1 && distributed_input_name != '') {
                $(current_distributed_input).focus();
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text(`Required ${distributed_input_name}`);
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return; 
            }
        $('#SaveWillDistributedForm').ajaxSubmit({
            type    :  'POST',
            url     :  '/intake/save-will-estate-distributed',
            success : function(e){
                if(e.msg=='will_estate_distributed_added'){
                    $('#v-pills-11-tab').removeClass('active');
                    $('#v-pills-11').removeClass('active');
                    $('#v-pills-11').removeClass('show');
                    $('.form-progress-bar').css('width','80%');
                    $('.form-progress-bar').text('80%');
                    $('#v-pills-12-tab').addClass('active');
                    $('#v-pills-12').addClass('active');
                    $('#v-pills-12').addClass('show');
                    $('#v-pills-12-tab').removeClass('disable-click');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Assets Added');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }else{
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not Added at this Moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        }) 
    })
    // Funeral Rites Form
    $('#funeral_save').on('click',function(){
        let funeral_count_input    =   0;
        let funeral_input_name     =   '';
        let current_funeral_input  =   '';
        let dirty                  =   false;
            $('.funeral_required').each(function () {
                if (!$(this).val() || $(this).val() == 0) {
                    if( dirty == false){
                        $(this).focus();
                    }
                    dirty = true;
                    $(this).css('border', '1px solid red');
                    current_funeral_input = $(this);
                    funeral_input_name = $(this).attr('data-funeral-name');
                    funeral_count_input++; 
                }else{
                    $(this).css('border', '1px solid #e5e5e5');
                }
            });
            if (dirty && funeral_count_input >=2) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Fill All Required Fields (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (funeral_count_input <= 1 && funeral_input_name != '') {
                $(current_funeral_input).focus();
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text(`Required ${funeral_input_name}`);
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return; 
            }
        $('#SaveWillFuneralRitesForm').ajaxSubmit({
            type    :  'POST',
            url     :  '/intake/intake-form-status-update',
            success : function(e){
                if(e.msgEmail=='funeral_rites_added'){
                    window.location = "/intake/thankyou";
                    $('.form-progress-bar').css('width','100%');
                    $('#v-pills-12-tab').removeClass('disable-click');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Funeral & Burial Rites Added');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }else{
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not Added at this Moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        }) 
    })
    // Capacity Form
    $('#capacity_form').on('click',function(){
        var tenancy_type        =   $('input[name="tenancy_type"]:checked').val();
        var property_status     =   $('input[name="property_status"]:checked').val();
        var home_buyer          =   $('input[name="home_buyer"]:checked').val();
        var spouse_owned_home   =   $('input[name="spouse_owned_home"]:checked').val();
        if(tenancy_type == undefined){
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Select At-Least One Tenancy Type');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        if(property_status == undefined){
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Select At-Least One Property Status');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        if(home_buyer == undefined){
            $(home_buyer).css('border','1px solid red');
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Select At-Least One Home Buyer');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        if(spouse_owned_home == undefined){
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Select At-Least One Spouse Ever Owned a Home');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        $('#SaveCapacityForm').ajaxSubmit({
            type    :  'POST',
            url     :  '/intake/save-client-capacity',
            success:function(e){
                if(e.msg=='Capacity_Added'){
                    if($('#intake_form_type').val() <= 4){
                        $('#v-pills-04-tab').removeClass('active');
                        $('#v-pills-04').removeClass('active');
                        $('#v-pills-04').removeClass('show');
                        $('.form-progress-bar').css('width','70%');
                        $('.form-progress-bar').text('70%');
                        $('#v-pills-05-tab').addClass('active');
                        $('#v-pills-05').addClass('active');
                        $('#v-pills-05').addClass('show');
                        $('#v-pills-05-tab').removeClass('disable-click');
                        
                    }else{
                        $('.form-progress-bar').css('width','40%');
                        $('.form-progress-bar').text('40%');
                    }
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Capacity Added');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }else{
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not Added at this Moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        })
    })
    // Consent Form
    $('#consent_save').on('click',function(){
        var canada_183_days         =   $('input[name="canada_183_days"]:checked').val();
        if(canada_183_days == undefined){
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Select At-Least One Physically Present');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
                return;
        }
        $('#SaveConsentForm').ajaxSubmit({
            type    :  'POST',
            url     :  '/intake/save-client-consent-info',
            success:function(e){
                if(e.msg=='Consent_Added'){
                    if($('#intake_form_type').val() <= 4){
                        $('#v-pills-07-tab').removeClass('active');
                        $('#v-pills-07').removeClass('active');
                        $('#v-pills-07').removeClass('show');
                        $('.form-progress-bar').css('width','90%');
                        $('.form-progress-bar').text('90%');
                        $('#v-pills-13-tab').addClass('active');
                        $('#v-pills-13').addClass('active');
                        $('#v-pills-13').addClass('show');
                        $('#v-pills-13-tab').removeClass('disable-click');
                    }
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Consent Added');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }else{
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not Added at this Moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        })
    })
    // Realtor Form
    $('#realtor_save').on('click',function(){
        var emailReg            =   /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        var numberReg           =   /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
        var lettersReg          =   /^(?![\s.]+$)[a-zA-Z\s.]*$/;
        var r_primary_cellphone =   $('#realtor_primary_cellphone').val();
        var r_email             =   $('#realtor_email').val();
        var r_first             =   $('#realtor_first_name').val();
        var r_middle            =   $('#realtor_middle_name').val();
        var r_last              =   $('#realtor_last_name').val();
        let dirty_realtor       =   false;
        let count_input_r       =   0;
        let realtor_input_name  =   '';
        let current_realtor_input=  '';
            $('.required_realtor').each(function () {
                if (!$(this).val() || $(this).val() == 0) {
                    if(dirty_realtor == false){
                        $(this).focus();
                    }
                    dirty_realtor = true;
                    if ($(this).hasClass('formselect')) {
                        $(this).parent().find('.select2-selection--single').css('border', '1px solid red');
                    }else{
                        $(this).css('border', '1px solid red');
                        current_realtor_input = $(this);
                    }
                    
                    realtor_input_name = $(this).attr('realtor-data-name');
                    count_input_r++; 
                }else{
                    $(this).css('border', '1px solid #e5e5e5');
                    $(this).parent().find('.select2-selection--single').css('border', '1px solid #e5e5e5');
                }
            });
            if (dirty_realtor && count_input_r >=2) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Fill All Required Fields (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (count_input_r <= 1 && realtor_input_name != '') {
                $(current_realtor_input).focus();
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text(`Required ${realtor_input_name}`);
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return; 
            }
            if (lettersReg.test(r_first)==false && r_first != '') {
                $('#realtor_first_name').focus();
                $('#realtor_first_name').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct First Name');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (lettersReg.test(r_middle)==false && r_middle != '') {
                $('#realtor_middle_name').focus();
                $('#realtor_middle_name').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Middle Name');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (lettersReg.test(r_last)==false && r_last != '') {
                $('#realtor_last_name').focus();
                $('#realtor_last_name').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Last Name');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            ///Verfiy CellPhone Number Format
            if (numberReg.test(r_primary_cellphone)==false && r_primary_cellphone != '') {
                $('#realtor_primary_cellphone').focus();
                $('#realtor_primary_cellphone').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Cell Phone Number');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            ///Verfiy Email Format
            if (emailReg.test(r_email)==false && r_email != '') {
                $('#realtor_email').focus();
                $('#realtor_email').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Email');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
        $('#SaveRealtorForm').ajaxSubmit({
            type    :  'POST',
            url     :  '/intake/save-realtor-info',
            success:function(e){
                if(e.insert_realtor=='Realtor Added'){
                    if($('#intake_form_type').val() <= 4){
                        $('#v-pills-13-tab').removeClass('active');
                        $('#v-pills-13').removeClass('active');
                        $('#v-pills-13').removeClass('show');
                        $('.form-progress-bar').css('width','90%');
                        $('.form-progress-bar').text('90%');
                        $('#v-pills-14-tab').addClass('active');
                        $('#v-pills-14').addClass('active');
                        $('#v-pills-14').addClass('show');
                        $('#v-pills-14-tab').removeClass('disable-click');
                    }
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Realtor Added');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }else{
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not Added at this Moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        })
    })
    $('#mortgage_save').on('click',function(){
        var emailReg            =   /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        var numberReg           =   /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
        var lettersReg          =   /^(?![\s.]+$)[a-zA-Z\s.]*$/;
        var mo_primary_cellphone =   $('#mortgage_primary_cellphone').val();
        var mo_email             =   $('#mortgage_email').val();
        var mo_first             =   $('#mortgage_first_name').val();
        var mo_middle            =   $('#mortgage_middle_name').val();
        var mo_last              =   $('#mortgage_last_name').val();
        let dirty_mortgage       =   false;
        let count_input_mo       =   0;
        let mortgage_input_name  =   '';
        let current_mortgage_input=  '';
            $('.required_mortgage').each(function () {
                if (!$(this).val() || $(this).val() == 0) {
                    if(dirty_mortgage == false){
                        $(this).focus();
                    }
                    dirty_mortgage = true;
                    if ($(this).hasClass('formselect')) {
                        $(this).parent().find('.select2-selection--single').css('border', '1px solid red');
                    }else{
                        $(this).css('border', '1px solid red');
                        current_mortgage_input = $(this);
                    }
                    
                    mortgage_input_name = $(this).attr('mortgage-data-name');
                    count_input_mo++; 
                }else{
                    $(this).css('border', '1px solid #e5e5e5');
                    $(this).parent().find('.select2-selection--single').css('border', '1px solid #e5e5e5');
                }
            });
            if (dirty_mortgage && count_input_mo >=2) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Fill All Required Fields (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (count_input_mo <= 1 && mortgage_input_name != '') {
                $(current_mortgage_input).focus();
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text(`Required ${mortgage_input_name}`);
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return; 
            }
            if (lettersReg.test(mo_first)==false && mo_first != '') {
                $('#mortgage_first_name').focus();
                $('#mortgage_first_name').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct First Name');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (lettersReg.test(mo_middle)==false && mo_middle != '') {
                $('#mortgage_middle_name').focus();
                $('#mortgage_middle_name').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Middle Name');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (lettersReg.test(mo_last)==false && mo_last != '') {
                $('#mortgage_last_name').focus();
                $('#mortgage_last_name').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Last Name');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            ///Verfiy CellPhone Number Format
            if (numberReg.test(mo_primary_cellphone)==false && mo_primary_cellphone != '') {
                $('#mortgage_primary_cellphone').focus();
                $('#mortgage_primary_cellphone').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Cell Phone Number');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            ///Verfiy Email Format
            if (emailReg.test(mo_email)==false && mo_email != '') {
                $('#mortgage_email').focus();
                $('#mortgage_email').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Email');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
        $('#SaveMortgageForm').ajaxSubmit({
            type    :  'POST',
            url     :  '/intake/save-mortgage-info',
            success:function(e){
                if(e.insert_mortgage=='Mortgage Added'){
                    if($('#intake_form_type').val() <= 4){
                        $('#v-pills-14-tab').removeClass('active');
                        $('#v-pills-14').removeClass('active');
                        $('#v-pills-14').removeClass('show');
                        $('.form-progress-bar').css('width','90%');
                        $('.form-progress-bar').text('90%');
                        $('#v-pills-08-tab').addClass('active');
                        $('#v-pills-08').addClass('active');
                        $('#v-pills-08').addClass('show');
                        $('#v-pills-08-tab').removeClass('disable-click');
                    }
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Mortgage Added');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }else{
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not Added at this Moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        })
    })
    // Email Template Form
    $('#email_template_save').on('click',function(){
        if($('#property_insurance').val() == ''){
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Add Property Insurance');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
                return;
        }
        $('#SaveEmailTemplateForm').ajaxSubmit({
            type    :  'POST',
            url     :  '/intake/intake-form-status-update',
            success:function(e){
                if(e.msg == 'update_status'){
                    window.location = "/intake/thankyou";
                }else if(e.status == 'mortgage_doc_error'){
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Kindly Uplaod Mortgage Instrcution');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000); 
                }else if(e.status == 'void_doc_error'){
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Kindly Uplaod Void Cheque');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000); 
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not Added at this Moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000); 
                }
            },
            error:function(e){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Not Added at this Moment');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
        })
    })
    $('#form4').on('click',function(){
        $('#form4').addClass('save_documents');
        let document_count_input    =   0;
        let document_input_name     =   '';
        let current_document_input  =   '';
        let dirty_document          =   false;
            $('.required_document').each(function () {
                if (!$(this).val() || $(this).val() == 0) {
                    if(dirty_document == false){
                        $(this).focus();
                    }
                    dirty_document = true;
                    if ($(this).hasClass('formselect')) {
                        $(this).parent().find('.select2-selection--single').css('border', '1px solid red');
                        $(this).parent().parent().parent().find('.dropify-wrapper').css('border', '1px solid red');
                    }else{
                        $(this).css('border', '1px solid red');
                        current_document_input = $(this);
                    }
                    document_input_name = $(this).attr('data-document-name');
                    document_count_input++; 
                }else{
                    $(this).css('border', '1px solid #e5e5e5');
                    $(this).parent().find('.select2-selection--single').css('border', '1px solid #e5e5e5');
                    $(this).parent().parent().parent().find('.dropify-wrapper').css('border', '1px solid #e5e5e5');
                }
            });
            if (dirty_document && document_count_input >=2) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Fill All Required Fields (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (document_count_input <= 1 && document_input_name != '') {
                $(current_document_input).focus();
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text(`Required ${document_input_name}`);
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return; 
            }
        save_document();
    })
    function save_document(){
        if($('#form4').hasClass('save_documents')){
            form_id_document =   'saveDocuments',
            url     =   '/intake/save-client-document'
        }
        if($('.edit-document').hasClass('update-documents')){
            var id  = $('.update-documents').attr('data-id');
            // Validations
            let edit_document_count_input    =   0;
            let edit_document_input_name     =   '';
            let current_edit_document_input  =   '';
            let dirty_edit_document          =   false;
                $(`.required_document_${id}`).each(function () {
                    if (!$(this).val() || $(this).val() == 0) {
                        if(dirty_edit_document == false){
                            $(this).focus();
                        }
                        dirty_edit_document = true;
                        $(this).css('border', '1px solid red');
                        $(this).parent().parent().parent().find('.dropify-wrapper').css('border', '1px solid red');
                        current_edit_document_input = $(this);
                        edit_document_input_name = $(this).attr('data-document-name');
                        edit_document_count_input++; 
                    }else{
                        $(this).css('border', '1px solid #e5e5e5');
                        $(this).parent().parent().parent().find('.dropify-wrapper').css('border', '1px solid #e5e5e5');
                    }
                });
                if (dirty_edit_document && edit_document_count_input >=2) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Fill All Required Fields (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    return;
                }
                if (edit_document_count_input <= 1 && edit_document_input_name != '') {
                    $(current_edit_document_input).focus();
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text(`Required ${edit_document_input_name}`);
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    return; 
                }
            form_id_document =   `updateDocuments-${id}`
            url     =   '/intake/save-client-document'
        }
        $('.save_documents').attr('disabled', true);
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'blue');
        $('#notifDiv').text('Uploading documents...');
        $(`#${form_id_document}`).ajaxSubmit({
            type    :   'POST',
            url     :    url,
            headers :   {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            cache   :   false,
            success :   function(e){
                $('.save_documents').attr('disabled', false);
                if(e.msg == 'success'){
                    $('#saveDocuments')[0].reset();
                    $('select[name="document_type"]').val("0").trigger('change');
                    $('select[name="document_type"]').parent().find('.select2-selection--single').css('border','1px solid #e5e5e5');
                    $('.dropify-preview').css('display','none');
                    $('.dropify-wrapper').css('border','2px solid #e5e5e5');
                    if($('#intake_form_type').val() <= 4){
                        $('.form-progress-bar').css('width','80%');
                        $('.form-progress-bar').text('80%');
                    }else if($('#intake_form_type').val() == 5){
                        $('.form-progress-bar').css('width','60%');
                        $('.form-progress-bar').text('60%');
                    }else{
                        $('.form-progress-bar').css('width','40%');
                        $('.form-progress-bar').text('40%');
                    }
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Document Added');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    clients_all_documents();
                }
                else if(e.status == "front_image_error"){
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Kindly Upload Document Front Image');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
                else if(e.status == "back_image_error"){
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Kindly Upload Document Back Image');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
                else if(e.msg == "already_exists"){
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Document Already Exists');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
                else{
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not Added at this Moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            },
            error   :   function(e){
                $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not Added at this Moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
            }
        })
    }
    $('#form5').on('click',function(){
        $('#form5').addClass('save_poa');
        var emailReg        =   /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        var numberReg       =   /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
        var lettersReg      =   /^(?![\s.]+$)[a-zA-Z\s.]*$/;
        var home_phone_no   =   $('#home_phone_no').val();
        var cell_phone_no   =   $('#cell_phone_no').val();
        var email_poa       =   $('#email_poa').val();
        var s_first         =   $('#first_name_poa').val();
        var s_middle        =   $('#middle_name_poa').val();
        var s_last          =   $('#last_name_poa').val();
        let poa_count_input    =   0;
        let poa_input_name     =   '';
        let current_poa_input  =   '';
        let dirty_poa          =   false;
            $('.required_poa').each(function () {
                if (!$(this).val() || $(this).val() == 0) {
                    if(dirty_poa == false){
                        $(this).focus();
                    }
                    dirty_poa = true;
                    if ($(this).hasClass('formselect')) {
                        $(this).parent().find('.select2-selection--single').css('border', '1px solid red');
                    }else{
                        $(this).css('border', '1px solid red');
                        current_poa_input = $(this);
                    }
                    poa_input_name = $(this).attr('data-poa-name');
                    poa_count_input++;
                }else{
                    $(this).css('border', '1px solid #e5e5e5');
                    $(this).parent().find('.select2-selection--single').css('border', '1px solid #e5e5e5');
                }
            });
            if (dirty_poa && poa_count_input >=2) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Fill All Required Fields (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (poa_count_input <= 1 && poa_input_name != '') {
                $(current_poa_input).focus();
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text(`Required ${poa_input_name}`);
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return; 
            }
            if (lettersReg.test(s_first)==false && s_first != '') {
                $('#first_name_poa').focus();
                $('#first_name_poa').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct First Name');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (lettersReg.test(s_middle)==false  && s_middle != '') {
                $('#middle_name_poa').focus();
                $('#middle_name_poa').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Middle Name');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (lettersReg.test(s_last)==false && s_last != '') {
                $('#last_name_poa').focus();
                $('#last_name_poa').css('border', '1px solid red');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Last Name');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            save_relation();
    })
    function save_relation(){
            if($('#form5').hasClass('save_poa')){
                form_id_relation =   'savePOA';
                url_relation     =   '/intake/save-client-relation';
            }
            if($('.edit-relation').hasClass('update-poa')){
                var id_relation  =   $('input[name=client_relation_id]').val();
                // Validations
                let edit_poa_count_input    =   0;
                let edit_poa_input_name     =   '';
                let current_edit_poa_input  =   '';
                let dirty_edit_poa          =   false;
                $(`.required_poa_${id_relation}`).each(function () {
                    if (!$(this).val() || $(this).val() == 0) {
                        if(dirty_edit_poa == false){
                            $(this).focus();
                        }
                        dirty_edit_poa = true;
                        $(this).css('border', '1px solid red');
                        current_edit_poa_input = $(this);
                        edit_poa_input_name = $(this).attr('data-poa-name');
                        edit_poa_count_input++; 
                    }else{
                        $(this).css('border', '1px solid #e5e5e5');
                    }
                });
                if (dirty_edit_poa && edit_poa_count_input >=2) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Fill All Required Fields (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    return;
                }
                if (edit_poa_count_input <= 1 && edit_poa_input_name != '') {
                    $(current_edit_poa_input).focus();
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text(`Required ${edit_poa_input_name}`);
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    return; 
                }
                form_id_relation =   `updatePOA-${id_relation}`;
                url_relation     =   '/intake/save-client-relation';
            }
            $('.save_poa').attr('disabled', true);
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'blue');
            if($('#intake_form_type').val() == 5){
            $('#notifDiv').text('Adding Beneficiary...');
            }else{
                $('#notifDiv').text('Adding Nominee...');
            }
            $(`#${form_id_relation}`).ajaxSubmit({
            type    :   'POST',
            url     :   url_relation,
            headers :   {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            cache   :   false,
            success :   function(e){
                $('.save_poa').attr('disabled', false);
                if(e.msg=='relation_added'){ 
                    $('.all_cities_poa').empty();
                    $('#savePOA')[0].reset();
                    $('select[name="beneficiary_type"],select[name="relationship_type"],select[name="re_gender_id"]').val("0").trigger('change');
                    $('select[name="beneficiary_type"],select[name="relationship_type"],select[name="re_gender_id"]').parent().find('.select2-selection--single').css('border','1px solid #e5e5e5');
                    
                    if($('#intake_form_type').val() <= 4){
                        $('.form-progress-bar').css('width','90%');
                        $('.form-progress-bar').text('90%');
                    }else if($('#intake_form_type').val() == 5){
                        $('.form-progress-bar').css('width','20%');
                        $('.form-progress-bar').text('20%');
                    }else{
                        $('.form-progress-bar').css('width','80%');
                        $('.form-progress-bar').text('80%');
                    }
                    $('#v-pills-06-tab').addClass('active');
                    $('#v-pills-06').addClass('active');
                    $('#v-pills-06').addClass('show');
                    $('#v-pills-05-tab').removeClass('active');
                    $('#v-pills-05').removeClass('show');
                    $('#v-pills-05').removeClass('active');
                    $('#v-pills-05-tab').removeClass('disable-click');
                    
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    if($('#intake_form_type').val() == 5){
                        $('#notifDiv').text('Beneficiary Added');
                    }else{
                        $('#notifDiv').text('Nominee Added');
                    }
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    clients_all_relations();
                    if($('#ben_age').val() > 18){
                        $('#s_no_doc').text('03');
                        $('#sno_doc').text('03');
                        $('#s_no_assets').text('04');
                        $('#sno_assets').text('04');
                        $('#s_no_disposition').text('05');
                        $('#sno_disposition').text('05');
                        $('#s_no_rites').text('06');
                        $('#sno_rites').text('06');
                    }else{
                        $('#s_no_doc').text('04');
                        $('#sno_doc').text('04');
                        $('#s_no_assets').text('05');
                        $('#sno_assets').text('05');
                        $('#s_no_disposition').text('06');
                        $('#sno_disposition').text('06');
                        $('#s_no_rites').text('07');
                        $('#sno_rites').text('07');
                    }
                }else if(e.msg== 'already_exists'){
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    if($('#intake_form_type').val() == 5){
                        $('#notifDiv').text('Beneficiary Already Exist');
                    }else{
                        $('#notifDiv').text('Nominee Already Exist');
                    }
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }else if(e.msg == "dob_not_18"){
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Minimum DOB is 18 Years');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
                else if(e.msg="Failed"){
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not Added at this Moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not Added at this Moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            },
            error   :   function(e){
                $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not Added at this Moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
            }
        })
    }
    //Delete Document and Relation
    $(document).on('click', '.delete-document-relation',function () {
        var id       = $(this).attr('id');
        $('.confirm_delete').attr('id', id);
        deleteRef    = $(this);
        glob_type    = $(this).attr('name');
        $('#hidden_btn_to_open_modal').click();
        primary_id   =   $(this).attr('data-primary-id');
        secondary_id =   $(this).attr('data-secondary-id');
    })
    $(document).on('click', '.confirm_delete', function () {
        var thisRef  = $(this);
        deleteRef.attr('disabled', 'disabled');
        deleteRef.text('Processing...');
        var id       = $(this).attr('id');
        $.ajax({
            type     :   'POST',
            url      :   `/intake/delete-document-relation`,
            headers  :   {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            data: {
                type            :   glob_type,
                id              :   id,
                primary_id      :   primary_id,
                secondary_id    :   secondary_id,
            },
            success  :   function(response){
                $('.cancel_delete_modal').click();
                if(response.msg=='document_deleted'){
                    clients_all_documents();
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Document Deleted');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }else if(response.msg=='relation_deleted'){
                    clients_all_relations();
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    if($('#intake_form_type').val() == 5){
                        $('#notifDiv').text('Beneficiary Deleted');
                    }else{
                        $('#notifDiv').text('Nominee Deleted');
                    }
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }else if(response.msg=='relation_not_deleted'){
                    clients_all_relations();
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Sorry! Not Deleted, Nominee Have Many Relations.');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }else{
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not Delete at this Moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            },
            error   :   function(e){
                $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not Delete at this Moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
            }
            
        })
    })
    
    $(document).on('click','.view-document',function(){
        $('.document_collapse').removeClass('show');
        var current_click = $(this).attr('aria-controls');
        $('.view-documents').show();
        $('.edit-documents').hide();
        $('.edit-document').text('Edit');
        $('.edit-document').removeClass('update-documents');
        $('.edit-document').addClass('collapsed');
        $('.edit-document').attr('aria-expanded', 'false');
        // $('.view-document').removeClass('collapsed');
        // $('.view-document').attr('aria-expanded', 'true');
        // var current_id = $(this).attr('data-id');
        // $(`#collapseExample-${current_id}`).addClass('show');
    })
    $(document).on('click','.edit-document',function(){
        $('.document_collapse').removeClass('show');
        $('.edit-document').removeClass('update-documents');
        $('.edit-document').text('Edit');
        $('.view-document').addClass('collapsed');
        $('.view-document').attr('aria-expanded', 'false');
        $('.edit-document').removeClass('collapsed');
        $('.edit-document').attr('aria-expanded', 'true');
        var current_id = $(this).attr('data-id');
        $(`#collapseExample-${current_id}`).addClass('show');
        $('.view-documents').hide();
        var current_click = $(this).attr('id');
        $('input[name=client_document_id]').val($(this).attr('data-id'));
        if($(this).attr('aria-expanded')=='true'){
            $(`#${current_click}`).addClass('update-documents');
            $(`#${current_click}`).text('Update');
        }
        $('.edit-documents').show();
    })
    $(document).on('click','.update-documents',function(){
        save_document();
        $('.edit-document').removeClass('update-documents');
    })
function clients_all_documents(){
    $('.collapse_all_documents').empty();
    var client_id        =   $('#client_id').val();
    var intake_form_id   =   $('#intake_form_id_doc').val();
    $.ajax({
        type    :   'get',
        url     :   `/intake/clients-all-documents/${client_id}`,
        data    :   {
            intake_form_id  :   intake_form_id
        },  
        success :   function(response){
            var counter     = 0;
            var records     = 0;
            fetch_documents = response.fetch_rows_doc;
            // if(fetch_documents >= 2){
            //     $('.form-progress-bar').css('width','60%');
            //     $('.form-progress-bar').text('60%');
            //     $('#v-pills-01-tab').removeClass('active');
            //     $('#v-pills-01').removeClass('active');
            //     $('#v-pills-06-tab').removeClass('active');
            //     $('#v-pills-06').removeClass('active');
            //     $('#v-pills-05').addClass('active');
            //     $('#v-pills-05-tab').addClass('active');
            //     $('#v-pills-05-tab').removeClass('disable-click');
            // }
            var document_type;
                response.client_documents.forEach((element, key) => {
                    counter = element['id'];
                    var options_doc =   `<option value="0">Select Document Type</option>`;
                    response.all_documents.forEach((documents, key) => {
                        options_doc +=`
                            <option value="${documents['id']}" ${documents['id'] == element['document_type'] ? 'selected' : ''}>${documents['document_verification_name']}</option>
                        `;
                    });
                    $('.collapse_all_documents').append(`
                    <div class="col-12 collapseInfo">
                        <h2>Document: ${element['document_type_name']}
                        <button class="btn w-btn collapse-btn view-document" data-toggle="collapse" href="#collapseExample-${counter}" role="button" aria-expanded="false"
                        aria-controls="collapseExample-${counter}" data-id="${element['id']}" id="view-button-${element['id']}" style="margin-left:5px">View Detail <i
                        class="fa fa-angle-down"></i></button>
                        <button class="btn w-btn collapse-btn delete-action delete-document-relation" name="delete_document" id="${element['id']}" style="margin-left:5px">Remove</button> 
                        <button type="button" class="btn w-btn collapse-btn edit-document" data-toggle="collapse" href="#collapseExample-${counter}" role="button" aria-expanded="false"
                        aria-controls="collapseExample-${counter}" data-id="${element['id']}" id="edit-document-${element['id']}">Edit</button> 
                        </h2>
                        <div class="collapse w-100 document_collapse" id="collapseExample-${counter}">
                            <div class="form-wrap pb-30 view-documents" id="view-documents">
                                <div class="row m-0">
                                    <div class="col-md-4 p-col-R p-col-L">
                                        <div class="infoDiv">
                                            <label class="control-label">Document Number</label>
                                            <p><strong>${element['document_number']}</strong></p>
                                        </div>
                                    </div>
                                    <div class="col-md-4 p-col-R p-col-L">
                                        <div class="infoDiv">
                                            <label class="control-label">Documnet Issuance Date</label>
                                            <p><strong>${element['issuance_date'] ? element['issuance_date'] : 'NA'}</strong></p>
                                        </div>
                                    </div>
                                    <div class="col-md-4 p-col-R p-col-L">
                                        <div class="infoDiv">
                                            <label class="control-label">Document Expiry Date</label>
                                            <p><strong>${element['expiry_date']}</strong></p>
                                        </div>
                                    </div>
                                    <div class="col-md-6 p-col-L p-col-R">
                                        <div class="infoDiv">
                                            <label class="control-label">Document Front Image</label>
                                            <img src="/storage/${element['doc_front_image']}" class="document-img-collapse">
                                        </div>
                                    </div>
                                    <div class="col-md-6 p-col-L p-col-R">
                                        <div class="infoDiv">
                                            <label class="control-label">Document Back Image</label>
                                            <img src="/storage/${element['doc_back_image']}" class="document-img-collapse">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-wrap pb-30 edit-documents" id="edit-documents" >
                                <form id="updateDocuments-${element.id}">
                                <input type="hidden" name="client_document_id" value="${element.id}">
                                <input type="hidden" name="client_id" value="${element.student_id}">
                                <input type="hidden" name="intake_form_id" value="${element.client_intake_form_id}">
                                <div class="row document_input_row_${element.id}">
                                    <div class="col-md-6">
                                        <label>Document Type *</label>
                                        <div class="form-group">
                                            <select class="custom-select custom-select-sm required_document_${element['id']} all_document_types" id="document_type" name="document_type" data-document-name="Document Type">
                                                ${options_doc}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label>Document Number (ID #) *</label>
                                        <div class="form-group">
                                            <input type="text" id="document_number" name="document_number" value="${element['document_number']}" class="form-control required_document_${element['id']}" placeholder=""
                                                style="font-size: 13px" data-document-name="Document Number">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label>Document Issuance Date</label>
                                        <div class="form-group">
                                            <input type="text" id="datepicker2" name="document_issuance_date" value="${element['issuance_date']}" class="form-control form-datepicker"
                                                placeholder="" style="font-size: 13px" >
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label>Document Expiry Date *</label>
                                        <div class="form-group">
                                            <input type="text" id="datepicker3" name="document_expiry_date" value="${element['expiry_date']}" class="form-control form-datepicker required_document_${element['id']}"
                                                placeholder="" style="font-size: 13px" data-document-name="Document Expiry Date">
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-wrap p-0">
                                                    <label class="font11 mb-5">Document Front Image *</label>
                                                    <div class="upload-pic"></div>
                                                    <input type="hidden" name="hidden_doc_front_image" value="${element['doc_front_image'] ? element['doc_front_image'] : ''}"> 
                                                    <input type="file" id="input-file-now" name="document_front_image" data-default-file="/storage/${element['doc_front_image']}"
                                                        class="dropify dropifidocs-${element['id']}" accept="image/jpg, image/png, image/jpeg, image/JPEG"  data-allowed-file-extensions="jpg png jpeg JPEG"  data-document-name="Document Front Image "/>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-wrap p-0">
                                                    <label class="font11 mb-5">Document Back Image *</label>
                                                    <div class="upload-pic"></div> 
                                                    <input type="hidden" name="hidden_doc_back_image" value="${element['doc_back_image'] ? element['doc_back_image'] : ''}"> 
                                                    <input type="file" id="input-file-now" name="document_back_image" data-default-file="/storage/${element['doc_back_image']}"
                                                        class="dropify dropifidocs-${element['id']}" accept="image/jpg, image/png, image/jpeg, image/JPEG"  data-allowed-file-extensions="jpg png jpeg JPEG"  data-document-name="Document Back Image"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    `);
                    datepicker();
                    $(`.dropifidocs-${element['id']}`).dropify();
                    $(`#collapseExample-${counter}`).removeClass('show');
                    $(`.document_input_row_${element['id']} .required_document_${element['id']}`).on('input keyup change',function(){
                        if($(this).hasClass(`required_document_${element['id']}`) && ($(this).val() == '' || $(this).val() == 0) ){
                            $(this).css('border', '1px solid red');
                            // $(this).parent().parent().parent().find('.dropify-wrapper').css('border', '1px solid red');
                        }else{
                            $(this).css('border', '1px solid #e5e5e5');
                            // $(this).parent().parent().parent().find('.dropify-wrapper').css('border', '1px solid #e5e5e5');
                        }
                    })
                    records++;
                });
                
                if(records >= 2){
                    //if($('#intake_form_type') <= 4)
                    {
                        $('#document-next-button').removeAttr('disabled');
                        $('#document-next-button').on('click',function(){
                            if($('#intake_form_type').val() <= 4){
                                $('.form-progress-bar').css('width','80%');
                                $('.form-progress-bar').text('80%');
                                $('#v-pills-05-tab').removeClass('active');
                                $('#v-pills-05').removeClass('active');
                                $('#v-pills-05').removeClass('show');
                                $('#v-pills-07-tab').addClass('active');
                                $('#v-pills-07').addClass('active');
                                $('#v-pills-07').addClass('show');
                                $('#v-pills-07-tab').removeClass('disable-click');
                            }else if($('#intake_form_type').val() == 5){
                                $('#v-pills-05-tab').removeClass('active');
                                $('#v-pills-05').removeClass('active');
                                $('#v-pills-05').removeClass('show');
                                $('#v-pills-10-tab').addClass('active');
                                $('#v-pills-10').addClass('active');
                                $('#v-pills-10').addClass('show');
                                $('#v-pills-10-tab').removeClass('disable-click');
                                $('.form-progress-bar').css('width','60%');
                                $('.form-progress-bar').text('60%');
                            }else{
                                $('#v-pills-05-tab').removeClass('active');
                                $('#v-pills-05').removeClass('active');
                                $('#v-pills-05').removeClass('show');
                                $('#v-pills-06-tab').addClass('active');
                                $('#v-pills-06').addClass('active');
                                $('#v-pills-06').addClass('show');
                                $('#v-pills-06-tab').removeClass('disable-click');
                                $('.form-progress-bar').css('width','60%');
                                $('.form-progress-bar').text('60%');
                            }
                        })
                    }
                }else{
                    $('#realstate-finish-button').attr('disabled',true); 
                    $('#document-next-button').attr('disabled',true); 
                }
        }
    })
}
    $(document).on('click','.view-relation',function(){
        $('.relation_collapse').removeClass('show');
        var current_click = $(this).attr('id');
        $('.view-relations').show();
        $('.edit-relations').hide();
        $('.edit-relation').text('Edit');
        $('.edit-relation').removeClass('update-poa');
        $('.edit-relation').addClass('collapsed');
        $('.edit-relation').attr('aria-expanded', 'false');
    })
    $(document).on('click','.edit-relation',function(){
        $('.relation_collapse').removeClass('show');
        $('.edit-relation').removeClass('update-poa');
        $('.edit-relation').text('Edit');
        $('.view-relation').addClass('collapsed');
        $('.view-relation').attr('aria-expanded', 'false');
        $('.edit-relation').removeClass('collapsed');
        $('.edit-relation').attr('aria-expanded', 'true');
        $('.view-relations').hide();
        var current_id = $(this).attr('aria-controls');
        $(`#${current_id}`).addClass('show');
        var current_click = $(this).attr('id');
        $('input[name=client_relation_id]').val($(this).attr('data-id'));
        if($(this).attr('aria-expanded')=='true'){
            $(`#${current_click}`).addClass('update-poa');
            $(`#${current_click}`).text('Update');
        }
        $('.edit-relations').show();
    })
    $(document).on('click','.update-poa',function(){
        save_relation();
        $('.edit-relation').removeClass('update-poa');
    })
function clients_all_relations(){
    $('.collapse_all_poa').empty();
    var client_id           =   $('#client_id').val();
    var intake_form_type    =   $('#intake_form_type').val();
    var intake_form_id      =   $('#intake_forms_id').val();
    $.ajax({
        type    :   'get',
        url     :   `/intake/clients-all-relations/${intake_form_id}`,
        async   :   false,
        success :   function(response){
            var counter_r   = 0;
            var records_r   = 0;
            fetch_relations = response.fetch_rows_rel;
            if(typeof response.client_relations != 'undefined' && response.client_relations.length > 0){
                response.client_relations.forEach((element, key) => {
                    counter_r = element['id'];

                    var option_genders =   `<option value="0">Select Gender</option>`;
                    response.genders.forEach((gender, key) => {
                        option_genders +=`
                            <option value="${gender['id']}" ${gender['id'] == element['gender_id'] ? 'selected' : ''}>${gender['gender_name']}</option>
                        `;
                    });
                    $('.collapse_all_poa').append(`
                    <div class="col-12 collapseInfo">
                        <h2>${intake_form_type==5 ? 'Beneficiary' : 'Nominee'}: ${element['first_name']} ${element['middle_name'] ? element['middle_name'] : ''} ${element['last_name']}
                            <button class="btn w-btn collapse-btn view-relation" data-toggle="collapse" href="#collapseExample-${counter_r}" role="button" aria-expanded="false"
                            aria-controls="collapseExample-${counter_r}" data-id="${element['id']}" style="margin-left:5px">View Detail <i
                            class="fa fa-angle-down"></i></button>
                            <button class="btn w-btn collapse-btn delete-action delete-document-relation" name="delete_relation" id="${element['intake_poanwills_id']}" 
                            data-primary-id="${element['client_id']}" data-secondary-id="${element['secondary_client_id']}"  style="margin-left:5px">Remove</button> 
                            <button type="button" class="btn w-btn collapse-btn edit-relation" data-toggle="collapse" href="#collapseExample-${counter_r}" role="button" aria-expanded="false"
                        aria-controls="collapseExample-${counter_r}" data-id="${element['intake_poanwills_id']}" id="edit-document-${element['id']}">Edit</button>
                        </h2>
                        <div class="collapse w-100 relation_collapse" id="collapseExample-${counter_r}">
                            <div class="form-wrap pb-30 view-relations" id="view-relations">
                                <div class="row m-0">
                                ${intake_form_type==5 ? `
                                <div class="col-md-4 p-col-R p-col-L">
                                    <div class="infoDiv">
                                        <label class="control-label">Type</label>
                                        <p><strong>
                                                ${
                                                    element['secondary_client_type'] == "4" ? 'Beneficiary' :
                                                    element['secondary_client_type'] == "5" ? 'Executor' :
                                                    element['secondary_client_type'] == "3" ? 'Beneficiary & Executor' :
                                                    '' 
                                                }
                                            </strong>
                                        </p>
                                    </div>
                                </div>` :''}
                                    <div class="col-md-4 p-col-R p-col-L">
                                        <div class="infoDiv">
                                            <label class="control-label">${intake_form_type==5 ? 'Beneficiary' : 'Nominee'}</label>
                                            <p><strong>${element['first_name']} ${element['middle_name'] ? element['middle_name'] : ''} ${element['last_name']}</strong></p>
                                        </div>
                                    </div>
                                    <div class="col-md-4 p-col-R p-col-L">
                                        <div class="infoDiv">
                                            <label class="control-label">Relation</label>
                                            <p>
                                                <strong>
                                                    ${
                                                        element['secondary_relationship_type']   == 1   ? 'Father'  : element['secondary_relationship_type'] == 2  ? 'Mother' :
                                                        element['secondary_relationship_type']   == 3   ? 'Son'     : element['secondary_relationship_type'] == 4  ? 'Daughter' :
                                                        element['secondary_relationship_type']   == 5   ? 'Brother' : element['secondary_relationship_type'] == 6  ? 'Sister' :
                                                        element['secondary_relationship_type']   == 7   ? 'Spouse'  : element['secondary_relationship_type'] == 8  ? 'Legal Partner' :
                                                        element['secondary_relationship_type']   == 9   ? 'Relative': element['secondary_relationship_type'] == 10 ? 'Friend' : 'Bussiness Partner'
                                                    }
                                                
                                                </strong>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="col-md-4 p-col-R p-col-L">
                                        <div class="infoDiv">
                                            <label class="control-label">Gender</label>
                                            <p><strong>${element['gender_name']}</strong></p>
                                        </div>
                                    </div>
                                    <div class="col-md-4 p-col-R p-col-L">
                                        <div class="infoDiv">
                                            <label class="control-label">DOB</label>
                                            <p><strong>${element['dob'] ? element['dob'] : '0000-00-00'}</strong></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-wrap pb-30 edit-relations" id="edit-relations" >
                                <form id="updatePOA-${element.intake_poanwills_id}" >
                                    <input type="hidden" name="client_relation_id" value="">
                                    <input type="hidden" name="client_id" value="${element.client_id}">
                                    <input type="hidden" name="secondary_id" value="${element.secondary_client_id}">
                                    <input type="hidden" name="gender_id" value="${element.primary_gender_id}">
                                    <input type="hidden" name="intake_form_id" value="${intake_form_id}">
                                    <input type="hidden" name="intake_form_type" value="${intake_form_type}">
                                    <input type="hidden" name="intake_poanwills_id" value="${element.intake_poanwills_id}">
                                    <input type="hidden" name="operation" id="operation" value="update">
                                    
                                <div class="row poa_input_row_${element.intake_poanwills_id}">
                                    ${intake_form_type==5 ? `
                                        <div class="col-lg-6 col-md-6" id="beneficiary_type_div" >
                                            <label>Beneficiary Type *</label>
                                            <div class="form-group">
                                                <select class="form-control" id="beneficiary_types" name="beneficiary_type" style="font-size: 13px" data-poa-name="Beneficiary Type">
                                                    <option value="0">Select Beneficiary Type</option>
                                                    <option value="4" ${element.secondary_client_type == "4" ? 'selected' : ''}>Beneficiary</option>
                                                    <option value="5" ${element.secondary_client_type == "5" ? 'selected' : ''}>Executor</option>
                                                    <option value="3" ${element.secondary_client_type == "3" ? 'selected' : ''}>Beneficiary & Executor</option>
                                                </select>
                                            </div>
                                        </div>
                                        ` : ''
                                    }
                                    ${intake_form_type==6 ? `<input type="hidden" name="beneficiary_type" value="1">` : ''}
                                    ${intake_form_type==7 ? `<input type="hidden" name="beneficiary_type" value="2">` : ''}
                                    <div class="col-lg-6 col-md-6">
                                        <label>First Name *</label>
                                        <div class="form-group">
                                            <input type="text" id="first_name" value="${element.first_name}" name="first_name" class="form-control required_poa_${element.intake_poanwills_id}" placeholder=""
                                                style="font-size: 13px" data-poa-name="First Name">
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6">
                                        <label>Middle Name</label>
                                        <div class="form-group">
                                            <input type="text" id="middle_name" value="${element.middle_name ? element.middle_name : ''}" name="middle_name" class="form-control" placeholder=""
                                                style="font-size: 13px">
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6">
                                        <label>Last Name *</label>
                                        <div class="form-group">
                                            <input type="text" id="last_name" value="${element.last_name ? element.last_name : ''}" name="last_name" class="form-control required_poa_${element.intake_poanwills_id}" placeholder=""
                                                style="font-size: 13px" data-poa-name="Last Name">
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6">
                                        <label>DOB</label>
                                        <div class="form-group">
                                            <input type="text" id="datepicker" name="dob" value="${element.dob ? element.dob : ''}" class="form-control form-datepicker" placeholder=""
                                                style="font-size: 13px">
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6">
                                        <label>Relationship Type *</label>
                                        <div class="form-group">
                                            <select class="custom-select custom-select-sm required_poa_${element.intake_poanwills_id}" name="relationship_type" data-poa-name="Relationship Type">
                                                <option selected value="0">Select Relationship Type</option>
                                                <option value="1" ${element.secondary_relationship_type==1   ? 'selected' : ''}>Father</option>
                                                <option value="2" ${element.secondary_relationship_type==2   ? 'selected' : ''}>Mother</option>
                                                <option value="3" ${element.secondary_relationship_type==3   ? 'selected' : ''}>Son</option>
                                                <option value="4" ${element.secondary_relationship_type==4   ? 'selected' : ''}>Daughter</option>
                                                <option value="5" ${element.secondary_relationship_type==5   ? 'selected' : ''}>Brother</option>
                                                <option value="6" ${element.secondary_relationship_type==6   ? 'selected' : ''}>Sister</option>
                                                <option value="7" ${element.secondary_relationship_type==7   ? 'selected' : ''}>Spouse</option>
                                                <option value="8" ${element.secondary_relationship_type==8   ? 'selected' : ''}>Legal Partner</option>
                                                <option value="9" ${element.secondary_relationship_type==9   ? 'selected' : ''}>Relative</option>
                                                <option value="10" ${element.secondary_relationship_type==10 ? 'selected' : ''}>Friend</option>
                                                <option value="11" ${element.secondary_relationship_type==11 ? 'selected' : ''}>Business Partner</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6">
                                        <label>Gender *</label>
                                        <div class="form-group">
                                            <select class="custom-select custom-select-sm all_genders required_poa_${element.intake_poanwills_id}" name="re_gender_id" id="re_gender_id" data-poa-name="Gender">
                                                    ${option_genders}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    `);
                    datepicker();
                    $( `.poa_input_row_${element.intake_poanwills_id} .required_poa_${element.intake_poanwills_id}`).on('input keyup change',function(){
                        if($(this).hasClass(`required_poa_${element.intake_poanwills_id}`) && ($(this).val() == '' || $(this).val() == 0) ){
                            $(this).css('border', '1px solid red');
                        }else{
                            $(this).css('border', '1px solid #e5e5e5');
                        }
                    })
                    $(`#collapseExample-${counter_r}`).removeClass('show');
                    
                    if($('#intake_form_type').val()== 5 && ( element.secondary_relationship_type == 3 || element.secondary_relationship_type == 4) ){
                        var ben_dob     =   new Date(element.dob);
                        var ben_dob_year=   ben_dob.getFullYear();
                        var check_dob   =   full_year - ben_dob_year;
                        $('#ben_age').val(check_dob);
                        if(check_dob > 18 || poa_age == ''){
                            $('#v-pills-09-tab').hide();
                            $('#v-pills-09').removeClass('show');
                        }else{
                            $('#v-pills-09-tab').show();
                            $('#v-pills-09').addClass('show');
                        }
                    }else{
                        $('#v-pills-09-tab').hide();
                        $('#v-pills-09').removeClass('show');
                    }
                    records_r++;
                });
                if(records_r >= 1){
                    var poa_age     =   $('#ben_age').val();
                    $('#poa-next-button').removeAttr('disabled');
                    $('#poa-next-button').on('click',function(){
                        if(poa_age > 18 || poa_age == ''){    
                            $('#v-pills-05-tab').addClass('active');
                            $('#v-pills-05').addClass('active');
                            $('#v-pills-05').addClass('show');
                            $('#v-pills-05-tab').removeClass('disable-click');
                            $('#v-pills-09-tab').removeClass('active');
                            $('#v-pills-09').removeClass('active');
                            $('#v-pills-09').removeClass('show'); 
                            $('#v-pills-09-tab').addClass('disable-click');
                            $(document).on('click','#previous-form4',function(){
                                $('#v-pills-06-tab').addClass('active');
                                $('#v-pills-06').addClass('active');
                                $('#v-pills-06').addClass('show');
                                $('#v-pills-05-tab').removeClass('active');
                                $('#v-pills-05').removeClass('active');
                                $('#v-pills-05').removeClass('show');
                                $('#v-pills-09-tab').removeClass('active');
                                $('#v-pills-09').removeClass('active');
                                $('#v-pills-09').removeClass('show');
                            })
                        }else{
                            var have_guardian = $('#have_guardian').val();
                            $('#guardian_status').val(have_guardian).trigger('change');
                            $('#v-pills-09-tab').addClass('active');
                            $('#v-pills-09').addClass('active');
                            $('#v-pills-09').addClass('show');
                            $('#v-pills-09-tab').removeClass('disable-click');
                            $('#v-pills-05-tab').removeClass('active');
                            $('#v-pills-05').removeClass('active');
                            $('#v-pills-05').removeClass('show');
                            $('#v-pills-05-tab').addClass('disable-click');
                            $(document).on('click','#previous-form4',function(){
                                $('#v-pills-09-tab').addClass('active');
                                $('#v-pills-09').addClass('active');
                                $('#v-pills-09').addClass('show');
                                $('#v-pills-05-tab').removeClass('active');
                                $('#v-pills-05').removeClass('active');
                                $('#v-pills-05').removeClass('show');
                                $('#v-pills-06-tab').removeClass('active');
                                $('#v-pills-06').removeClass('active');
                                $('#v-pills-06').removeClass('show');
                            })      
                        } 
                        $('#v-pills-06-tab').removeClass('active');
                        $('#v-pills-06').removeClass('show');
                        $('#v-pills-06').removeClass('active');
                        $('#v-pills-10-tab').addClass('disable-click');        
                        $('#v-pills-11-tab').addClass('disable-click');        
                        $('#v-pills-12-tab').addClass('disable-click');        
                    })
                    $('#poa-finish-button').removeAttr('disabled');
                    $('#poa-finish-button').on('click',function(){
                        $('.form-progress-bar').css('width','100%');
                        $('.form-progress-bar').text('100%');
                        var intake_key = $('#intake_key').val();
                        $.ajax({
                            method   : 'POST',
                            url      : '/intake/intake-form-status-update',
                            headers  :   {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                            data     : {
                                intake_key  :   intake_key,
                            },
                            success:function(e){
                                    window.location = "/intake/thankyou";    
                            }
                        })    
                    })
                }else{
                    $('#poa-next-button').attr('disabled', true);
                    $('#poa-finish-button').attr('disabled',true); 
                }
            }else{
                $('#poa-next-button').attr('disabled', true);
                $('#poa-finish-button').attr('disabled',true);
                $('#v-pills-09-tab').hide();
                $('#v-pills-09').removeClass('show');          
                $('#s_no_doc').text('03');
                $('#sno_doc').text('03');
                $('#s_no_assets').text('04');
                $('#sno_assets').text('04');
                $('#s_no_disposition').text('05');
                $('#sno_disposition').text('05');
                $('#s_no_rites').text('06');    
                $('#sno_rites').text('06');
                
            }
        }
    });
    return true;
}
if($('#intake_form_type').val() >=4){
    clients_all_relations()
    clients_all_documents();
    // if($('#ben_age').val() > 18){            
    //     $('#s_no_doc').text('03');
    //     $('#sno_doc').text('03');
    //     $('#s_no_assets').text('04');
    //     $('#sno_assets').text('04');
    //     $('#s_no_disposition').text('05');
    //     $('#sno_disposition').text('05');
    //     $('#s_no_rites').text('06');
    //     $('#sno_rites').text('06');
    // }
}
function client_employment(){
    var client_id  =   $('#client_id').val();
    $.ajax({
        type    :   'get',
        url     :   `/intake/client-employment-info/${client_id}`,
        success :   function(response){
            response.client_employment.forEach((element, key) => {
                $('#employment_id').val(element.id);
                $('#employee_status').val(element.client_occupation).trigger('change');
                $('#job_title').val(element.job_title);
                $('#company_name').val(element.company_name);
                $('#company_contact_number').val(element.company_contact_number);
                $('#office_no').val(element.office_no);
                $('#street_address').val(element.street_address);
                $('#country_id').val(element.country_id2);
                $('#state_id').val(element.state_id2);
                $('#city_id').val(element.city_id2);
                $('#postal_code_id').val(element.postal_code);
                $('#all_postal_codes').val(element.postal_code);
                $('#all_countries').val(element.country_id2).trigger('change');
                country_id_em      = $('#country_id').val();
                state_id_em        = $('#state_id').val();
                city_id_em         = $('#city_id').val();
                postal_code_id_em  = $('#postal_code_id').val();
            })  
        }
    })
}
if($('#intake_form_type').val() <= 4){
    
    $.when($.ajax({
        url:`/intake/get-all-countries`,
        success: function (response) {
            $('.all_countries').empty();
            $('.all_countries').append(`<option value="-1" selected disabled>Select Country</option>`);
            response.countries.forEach((country) => {
                $('.all_countries').append(`<option value="${country['id']}">${country['name']}</option>`);
            });
        },
        error: function (response) {
            alert('error in fetching get countries')
        }
    })).then(function(){
        
        client_employment();
        if(country_id_em){
            $('.all_countries').val(country_id_em).trigger('change');
        }else{
            $('.all_countries').val(default_country_id).trigger('change');
        }
    });
}
    // All States against Country
            $('.all_countries').change(function(){
                $('.all_states').empty();
                var country_id = $(this).val();
                $.ajax({
                    url: `/intake/get-states-against-countries/${country_id}`,
                    success: function (e) {
                        $('.all_states').empty();
                        $('.all_states').append(`<option value="-1" selected disabled>Select State</option>`);
                        $.when(e.states.forEach((state) => {
                            $('.all_states').append(`<option value="${state['id']}" >${state['name']}</option>`);
                        })).then(function(){
                            if(state_id_em){
                                $('.all_states').val(state_id_em).trigger('change');
                            }    
                        });
                    },
                    error: function (e) {
                        alert('error in fetching States')
                    }
                })
            })
            // All Cities against states
            $('.all_states').change(function(){
                $('.all_cities').empty();
                var state_id = $(this).val();
                $.ajax({
                    url:`/intake/get-cities-against-states/${state_id}`,
                    success: function (f) {
                        $('.all_cities').empty();
                        $('.all_cities').append(`<option value="-1" selected disabled>Select City </option>`);
                        f.cities.forEach((city) => {
                            $('.all_cities').append(`<option value="${city['id']}" >${city['name']}</option>`);
                        })
                        if(city_id_em){
                            $('.all_cities').val(city_id_em).trigger('change');
                        }
                    },
                    error: function (f) {
                        alert('error in fetching Cities')
                    }
                })
            })
            $('.all_cities').change(function(){
                $('.all_postal_codes').empty();
                var city_id = $(this).val();
                $.ajax({
                    url:`/intake/get-postalcode-against-cities/${city_id}`,
                    success: function (g) {
                        $('.all_postal_codes').empty();
                        $('.all_postal_codes').append(`<option value="-1" selected disabled>Select Postal Codes </option>`);
                        g.postalcodes.forEach((postal_code) => {
                            $('.all_postal_codes').append(`<option value="${postal_code['id']}" ${postal_code_id_em ==  postal_code['id'] ? 'selected' : '' }>${postal_code['postal_code']}</option>`);
                        })
                    },
                    error: function (g) {
                        alert('error in fetching Postal Code')
                    }
                })
            })

function client_marital_details(){
    var client_id  =   $('#client_id').val();
    $.ajax({
        type    :   'get',
        url     :   `/intake/client-marital-details/${client_id}`,
        success :   function(response){
            if( response.client_marital) {
                $('#sec_id').val(response.client_marital.secondary_contact_id);
                $('#relationship_type').val(response.client_marital.relationship_type);
                $('#relationship_id').val(response.client_marital.relationship_id);
                $('#marital_status').val(response.client_marital.primary_marital_status).trigger('change');
                $('#mar_first_name').val(response.client_marital.first_name);
                $('#mar_middle_name').val(response.client_marital.middle_name);
                $('#mar_last_name').val(response.client_marital.last_name);
                $('#mar_re_gender_id').val(response.client_marital.gender_id).trigger('change');
                $('#mar_email').val(response.client_marital.email);
                $('#mar_home_phone_no').val(response.client_marital.primary_landline);
                $('#mar_cell_phone_no').val(response.client_marital.primary_cellphone);
                $('#country_id_mari').val(response.client_marital.country_id);
                $('#state_id_mari').val(response.client_marital.state_id);
                $('#city_id_mari').val(response.client_marital.city_id);
                $('#postal_code_id_mar').val(response.client_marital.postal_code);
                $('#postal_codes_marital').val(response.client_marital.postal_code);
                $('#all_countries_marital').val(response.client_marital.country_id).trigger('change');
                country_id_mar      = $('#country_id_mari').val();
                state_id_mar        = $('#state_id_mari').val();
                city_id_mar         = $('#city_id_mari').val();
            }
        }
    })
}
    
    $.when($.ajax({
        url:`/intake/get-all-countries`,
        success: function (response) {
            $('.all_countries_marital').empty();
            $('.all_countries_marital').append(`<option value="-1" selected disabled>Select Country</option>`);
            response.countries.forEach((country) => {
                $('.all_countries_marital').append(`<option value="${country['id']}">${country['name']}</option>`);
            });
        },
        error: function (response) {
            alert('error in fetching get countries')
        }
    })).then(function(){
        client_marital_details();
        if(country_id_mar){
            $('.all_countries_marital').val(country_id_mar).trigger('change');
        }else{
            $('.all_countries_marital').val(default_country_id).trigger('change');
        }
    });
    // All States against Country
            $('.all_countries_marital').change(function(){
                $('.all_states_marital').empty();
                var country_id = $(this).val();
                $.ajax({
                    url: `/intake/get-states-against-countries/${country_id}`,
                    success: function (e) {
                        $('.all_states_marital').empty();
                        $('.all_states_marital').append(`<option value="-1" selected disabled>Select State</option>`);
                        $.when(e.states.forEach((state) => {
                            $('.all_states_marital').append(`<option value="${state['id']}" >${state['name']}</option>`);
                        })).then(function(){
                            if(state_id_mar){
                                $('.all_states_marital').val(state_id_mar).trigger('change');
                            }    
                        });
                    },
                    error: function (e) {
                        alert('error in fetching States')
                    }
                })
            })
            // All Cities against states
            $('.all_states_marital').change(function(){
                $('.all_cities_marital').empty();
                var state_id = $(this).val();
                $.ajax({
                    url:`/intake/get-cities-against-states/${state_id}`,
                    success: function (f) {
                        $('.all_cities_marital').empty();
                        $('.all_cities_marital').append(`<option value="-1" selected disabled>Select City </option>`);
                        f.cities.forEach((city) => {
                            $('.all_cities_marital').append(`<option value="${city['id']}" >${city['name']}</option>`);
                        })
                        if(city_id_mar){
                            $('.all_cities_marital').val(city_id_mar).trigger('change');
                        }
                    },
                    error: function (f) {
                        alert('error in fetching Cities')
                    }
                })
            })
// OnKeyUp function for all form fields
    // Client Required 
    $('.client_input_row .required_client').on('input keyup change',function(){
        if($(this).hasClass('required_client') && ($(this).val() == '' || $(this).val() == 0) ){
            $(this).css('border', '1px solid red');
            $(this).parent().find('.select2-selection--single').css('border', '1px solid red');
        }else{
            $(this).css('border', '1px solid #e5e5e5');
            $(this).parent().find('.select2-selection--single').css('border', '1px solid #e5e5e5');
        }
    })
    // Employment Required
    $('.employment_input_row .employee_info').on('input keyup change',function(){
        if($(this).hasClass('employee_info') && ($(this).val() == '' || $(this).val() == 0) ){
            $(this).css('border', '1px solid red');
            $(this).parent().find('.select2-selection--single').css('border', '1px solid red');
        }else{
            $(this).css('border', '1px solid #e5e5e5');
            $(this).parent().find('.select2-selection--single').css('border', '1px solid #e5e5e5');
        }
    })
    // Marital Required
    $('.marital_input_row .marital_info').on('input keyup change',function(){
        if($(this).hasClass('marital_info') && ($(this).val() == '' || $(this).val() == 0) ){
            $(this).css('border', '1px solid red');
            $(this).parent().find('.select2-selection--single').css('border', '1px solid red');
        }else{
            $(this).css('border', '1px solid #e5e5e5');
            $(this).parent().find('.select2-selection--single').css('border', '1px solid #e5e5e5');
        }
    })
    // Document Required
    $('.document_input_row .required_document').on('input keyup change',function(){
        if($(this).hasClass('required_document') && ($(this).val() == '' || $(this).val() == 0) ){
            $(this).css('border', '1px solid red');
            if($(this).hasClass('formselect')){
                $(this).parent().find('.select2-selection--single').css('border', '1px solid red');
            }
        }else{
            $(this).css('border', '1px solid #e5e5e5');
            if($(this).hasClass('formselect')){
                $(this).parent().find('.select2-selection--single').css('border', '1px solid #e5e5e5');
            }
        }
    })
    // POA Required
    $('.poa_input_row .required_poa').on('input keyup change',function(){
        if($(this).hasClass('required_poa') && ($(this).val() == '' || $(this).val() == 0) ){
            $(this).css('border', '1px solid red');
            if($(this).hasClass('formselect')){
                $(this).parent().find('.select2-selection--single').css('border', '1px solid red');
            }
        }else{
            $(this).css('border', '1px solid #e5e5e5');
            if($(this).hasClass('formselect')){
                $(this).parent().find('.select2-selection--single').css('border', '1px solid #e5e5e5');
            }
        }
    })
    // Will Assets Required
    $('.assets-input-row .assets_required').on('input keyup change',function(){
        if($(this).hasClass('assets_required') && ($(this).val() == '' || $(this).val() == 0) ){
            $(this).css('border', '1px solid red');
        }else{
            $(this).css('border', '1px solid #e5e5e5');
        }
    })
    // Will Distributed Required
    $('.distributed-input-row .distributed_required').on('input keyup change',function(){
        if($(this).hasClass('distributed_required') && ($(this).val() == '' || $(this).val() == 0) ){
            $(this).css('border', '1px solid red');
        }else{
            $(this).css('border', '1px solid #e5e5e5');
        }
    })
    // Will Funeral & Burial Rites Required
    $('.funeral-input-row .funeral_required').on('input keyup change',function(){
        if($(this).hasClass('funeral_required') && ($(this).val() == '' || $(this).val() == 0) ){
            $(this).css('border', '1px solid red');
        }else{
            $(this).css('border', '1px solid #e5e5e5');
        }
    })
    // Will Guardian Required
    $('.guardian-input-row .guardian_info').on('input keyup change',function(){
        if($(this).hasClass('guardian_info') && ($(this).val() == '') ){
            $(this).css('border', '1px solid red');
            if($(this).hasClass('formselect')){
                $(this).parent().find('.select2-selection--single').css('border', '1px solid red');
            }
        }else{
            $(this).css('border', '1px solid #e5e5e5');
            if($(this).hasClass('formselect')){
                $(this).parent().find('.select2-selection--single').css('border', '1px solid #e5e5e5');
            }
        }
    })
    // Realestate Agent Required
    $('.realestate-agent .required_realtor').on('input keyup change',function(){
        if($(this).hasClass('required_realtor') && ($(this).val() == '' || $(this).val() == 0) ){
            $(this).css('border', '1px solid red');
        }else{
            $(this).css('border', '1px solid #e5e5e5');
        }
    })
    // Mortgage Agent Required
    $('.mortgage_agent .required_mortgage').on('input keyup change',function(){
        if($(this).hasClass('required_mortgage') && ($(this).val() == '' || $(this).val() == 0) ){
            $(this).css('border', '1px solid red');
        }else{
            $(this).css('border', '1px solid #e5e5e5');
        }
    })
    
// End OnKeyUp 