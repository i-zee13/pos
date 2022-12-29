var acceptedFileTypes = "image/*"; //dropzone requires this param be a comma separated list
    var fileList = new Array;
    var i = 0;
    var callForDzReset = false;
    let allCustomersList = null;
    let idTaken = false;
    let activeCustomerForUpdate = -1;
    var totalPocs = 1;
    var deleteable_arr = [];
    var existing_array = [];
    var allItems = [];
    var assignSamples = [];
    var searchArray = [];
    var filter_array = [];

    var multiple_phone_nums = [];
    var address_array = [];
    var total_records = 0;
    var all_pocs = [];
    var current_active_page = 1;
    var totalPages = 0;
    var base_url = '';
    var AllPOCArray = [];
    var searchArray = [];

    var current_action = '';
    var multiple_cust_phone_nums = [];
    var cust_address_array = [];
    var total_customers = 0;
    var total_cust_pages = 0;
    var cust_base_url = '';
    var all_cust = [];
    var current_cust_active_page = 1;

    var glob_type = '';
    var deleteRef = '';

    $(document).ready(function() {
                $("#datepicker").datepicker({
                    format: dateFormat
                }).on('changeDate', function(e) {
                    $(this).datepicker('hide');
                });

                var segments = location.href.split('/');
                var action = segments[3];
                var imageURL = '';
                if (action !== 'CustomerProfile' && action != 'DocumentTypes' && action != 'AcquisitionSource' && action != 'customer_sampling' && action != 'price_quotation' && action != 'manage_poc') {
                    fetchPOCList();
                    fetchCompaniesList().then(x => {
                        const uniqueCompetitions = [...new Set(x.map(item => item.competition))];
                        uniqueCompetitions.forEach(element => {
                            if (!element)
                                return;
                            var newOption = new Option(element, element, false, false);
                            $("#competitionSelect2").append(newOption);
                        });
                    });
                    
                    $('.dropifyImgDiv').empty();
                    $('.dropifyImgDiv').append('<input type="file" name="profile_pic" id="profile_pic" class="dropify" data-default-file="/images/avatar-img.jpg"/>');
                    $('#profile_pic').dropify();

                    $('.cardFrontDiv').empty();
                    $('.cardFrontDiv').append('<div class="upload-pic font12 pb-1">Card Front</div><input type="file" name="card_front" id="card_front"/>');
                    $('#card_front').dropify();

                    $('.cardBackDiv').empty();
                    $('.cardBackDiv').append('<div class="upload-pic font12 pb-1">Card Front</div><input type="file" name="card_back" id="card_back"/>');
                    $('#card_back').dropify();

                } else if (action == 'DocumentTypes') {
                    fetchDocumentTypeList();
                } else if (action == 'AcquisitionSource') {
                    fetchAcquisitionList();
                } else if (action == 'customer_sampling') {
                    fetchAllItems();
                    fetchCustomerSampling();
                } else if (action == 'price_quotation') {
                    fetchAllItems();
                    fetchQuotePrices();
                } else if (action == 'manage_poc') {
                    fetchPOCList();
                    $('.dropifyImgDiv').empty();
                    $('.dropifyImgDiv').append('<input type="file" name="profile_pic" id="profile_pic" class="dropify" data-default-file="/images/avatar-img.jpg"/>');
                    $('#profile_pic').dropify();

                    $('.cardFrontDiv').empty();
                    $('.cardFrontDiv').append('<div class="upload-pic font12 pb-1">Card Front</div><input type="file" name="card_front" id="card_front"/>');
                    $('#card_front').dropify();

                    $('.cardBackDiv').empty();
                    $('.cardBackDiv').append('<div class="upload-pic font12 pb-1">Card Front</div><input type="file" name="card_back" id="card_back"/>');
                    $('#card_back').dropify();
                } else {
                    fetchCompanyInfoForUpdate($('#companyIdForUpdate').val());
                }

                if (action == "Assignments") {
                    $('#viewAssign').attr('disabled', true)
                    let customersAssigned = [];
                    let deletedAssignments = [];
                    assignmentCustomers.filter(x => x.assigned_to).forEach(y => {
                        customersAssigned.push({
                            customer: y,
                            employee_id: y.assigned_to,
                            already_added: true
                        })
                    });

                    $(document).on('click', '.assignCustomer', function() {
                        if (!$('#empForAssignment').val()) {
                            $('#notifDiv').fadeIn();
                            $('#notifDiv').css('background', 'red');
                            $('#notifDiv').text('Please select an employee');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);
                            return;
                        }
                        $(this).attr('disabled', true);
                        $(this).removeClass('assignCustomer');
                        $(this).text('Assigned');
                        customersAssigned.push({
                            "customer": assignmentCustomers.find(x => x.id == $(this).attr('customer')),
                            "employee_id": $('#empForAssignment').val(),
                            'already_added': false
                        });
                        $('#viewAssign').text("View Assignments");
                        $('#viewAssign').removeAttr('disabled');
                        $(this).text('Assigned');
                    });

                    let assignments = [];

                    $('#empForAssignment').change(function() {
                        if (customersAssigned.find(x => x.employee_id == $(this).val())) {
                            $('#viewAssign').text("View Assignments");
                            $('#viewAssign').removeAttr('disabled');
                        } else {
                            $('#viewAssign').text("No Assignments");
                            $('#viewAssign').attr('disabled', true);
                        }
                    });

                    $('#viewAssign').click(function() {
                        assignments = customersAssigned.filter(x => x.employee_id == $('#empForAssignment').val());
                        renderAssignmentsInModal(assignments);
                    });

                    $(document).on('input', '#searchAssignment', function() {
                        if (!$(this).val())
                            renderAssignmentsInModal(assignments)
                        else
                            renderAssignmentsInModal(assignments.filter(x => (x.customer.company_name.toLowerCase().includes($(this).val().toLowerCase()) || (x.customer.customer_type && x.customer.customer_type.toLowerCase().includes($(this).val().toLowerCase())) || (x.customer.country && x.customer.country.toLowerCase().includes($(this).val().toLowerCase())) || (x.customer.life_cycle_stage && x.customer.life_cycle_stage.toLowerCase().includes($(this).val().toLowerCase())))));
                    })

                    $(document).on('click', '.deleteCustomerAssignment', function() {
                        deletedAssignments.push({
                            employee_id: $('#empForAssignment').val(),
                            'customer_id': $(this).attr('customer-id')
                        })

                        customersAssigned = customersAssigned.filter(x => x.employee_id == $('#empForAssignment').val() && x.customer.id != $(this).attr('customer-id'));

                    })

                    $(document).on('click', '#saveAssignments', function() {
                        if (!customersAssigned.filter(x => x.already_added == false).length && !deletedAssignments.length) {
                            $('#notifDiv').fadeIn();
                            $('#notifDiv').css('background', 'red');
                            $('#notifDiv').text('Please create an assignment');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);
                            return;
                        }
                        $(this).attr('disabled', true)
                        ajaxer('/SaveCustomerAssignment', 'POST', {
                            _token: $('meta[name="csrf_token"]').attr('content'),
                            assignments: customersAssigned,
                            removed: deletedAssignments
                        }).then(x => {
                            $(this).text("Saved");
                            location.reload();
                        })
                    })

                    function renderAssignmentsInModal(assignments) {
                        $('#assignmentsModal').empty();
                        assignments.forEach(x => {
                            $('#assignmentsModal').append(`<div class="col-12 alert alert-color cus-ass-list" role="alert">
                                <div class="row">
                                    <div class="col mb-5"><strong>Customer Name:</strong> ${x.customer.company_name} </div>
                                    <div class="col mb-5"><strong>Customer Type:</strong> ${x.customer.customer_type ? x.customer.customer_type : "NA"}</div>
                                </div>
                                <div class="row">
                                    <div class="col"><strong>Life Cycle Stage:</strong> ${x.customer.customer_type ? x.customer.customer_type : "NA"}</div>
                                    <div class="col"><strong>Country:</strong> ${x.customer.country ? x.customer.country : "NA"}</div>
                                </div>
                                <button type="button" class="close alert_close deleteCustomerAssignment" data-dismiss="alert" aria-label="Close" customer-id="${x.customer.id}">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>`)
                        });
                    }
                }

                var lastOp = "add";

                $('[name="life_cycle_stage"]').change(function() {
                    if ($(this).val() == "prospect") {
                        $('#prospectDataDiv').css('display', '');
                    } else {
                        $('#prospectDataDiv').css('display', 'none');
                    }
                });

                $(document).on('input', '[name="compId"]', function() {
                    let compId = $(this).val();
                    if (compId[compId.length - 1] == " ") {
                        $(this).val(compId.substr(0, compId.length - 1))
                        return;
                    }
                    if (allCustomersList.filter(x => x.id != activeCustomerForUpdate).find(x => x.company_id && x.company_id.toLowerCase() == compId.toLowerCase())) {
                        $('#idTakenError').show()
                        idTaken = true;
                    } else {
                        idTaken = false
                        $('#idTakenError').hide()
                    }
                });

                $(document).on('click', '#addNewCompetition', function() {
                    $('#competitionName').val("")
                });

                $('#saveCompetition').click(function() {
                    var newOption = new Option($('#competitionName').val(), $('#competitionName').val(), false, false);
                    $("#competitionSelect2").append(newOption);

                    $("#competitionSelect2").val($('#competitionName').val());
                    $("#competitionSelect2").trigger("change");

                    $(".AddDynamicCompetitionModal .close").click();
                });


                $(document).on('click', '.openDataSidebarForAddingAgency', function() {
                    $('#dataSidebarLoader').hide();
                    $('#prospectDataDiv').css('display', 'none')
                    activeCustomerForUpdate = -1;
                    $('.required').css('border', '0');
                    if (lastOp == "update") {
                        $('input:not([name="_token"])').val("");
                        $('input').blur();
                        $('textarea').val("");

                        $('#saveAgencyForm').find("select").val("0").trigger('change');
                        $('[name="life_cycle_stage"]').val("prospect").trigger('change');
                        $('select[name="deliveryPorts"], select[name="documentTypes"]').val("").trigger('change');
                        $('#idTakenError').hide();
                        idTaken = false;

                        multiple_cust_phone_nums = [];
                        cust_address_array = [];
                        $('.customer_phone_num_div').empty();
                        $('.customer_phone_num_div').append(` <div class="col-md-6">
                    <div class="form-group phone-SL div_parent">
                        <div class="col-auto p-0">
                            <select class="custom-select custom-select-sm cust_phone_type">
                                <option selected disabled value="-1">Type</option>
                                <option value="business">Business</option>
                                <option value="mobile">Mobile</option>
                                <option value="whatsapp">WhatsApp</option>
                            </select>
                        </div>
                        <div class="col p-0">
                            <a class="closeBTN remove_phone_num" style="color:white !important"><i class="fa fa-times"></i></a>
                            <input class="phoneinput cust_phone_number" type="text" placeholder="0000000000">
                        </div>
                    </div>
                </div>`);
                    }
                    // fetchCompaniesList();
                    $('.dz-preview').remove();
                    lastOp = 'add';
                    if ($('#saveAgencyForm input[name="_method"]').length) {
                        $('#saveAgencyForm input[name="_method"]').remove();
                    }
                    $('input[id="operation"]').val('add');
                    $('input[class="operation_docs"]').val('add');

                    $('#dynamicContacts').empty();

                    $('#dropifyImgDiv').empty();
                    $('#dropifyImgDiv').append('<input type="file" name="compPicture" id="companyPic" class="dropify" />');
                    $('#companyPic').dropify();

                    $('#cardFrontDiv').empty();
                    $('#cardFrontDiv').append('<div class="upload-pic font12 pb-1">Card Front</div><input type="file" name="card_front" id="card_front"/>');
                    $('#card_front').dropify();

                    $('#cardBackDiv').empty();
                    $('#cardBackDiv').append('<div class="upload-pic font12 pb-1">Card Front</div><input type="file" name="card_back" id="card_back"/>');
                    $('#card_back').dropify();


                    $('.agency_form').show();
                    $('.poc_form').hide();
                    $('.agency_form_div').addClass("active");
                    $('.poc_form_div').removeClass("active");
                    $(".overlay").addClass("active");
                    $(".collapse.in").toggleClass("in");
                    $("a[aria-expanded=true]").attr("aria-expanded", "false");
                    $("body").toggleClass("no-scroll");
                    $("#contentContainerDiv").addClass("blur-div");
                    $(".sticky-footer").addClass("blur-div");
                    $(".overlay-for-sidebar").css("display", "block");

                });

                $(document).on('click', '.openDataSidebarForAddingDocumentType', function() {
                    if (lastOp == "update") {
                        $('input[name="document_type_name"]').val("");
                        $('input[name="document_type_name"]').blur();
                    }
                    lastOp = 'add';
                    if ($('#saveDocumentTypeForm input[name="_method"]').length) {
                        $('#saveDocumentTypeForm input[name="_method"]').remove();
                    }
                    $('input[id="operation"]').val('add');
                    openSidebar();
                });

                $(document).on('click', '.openDataSidebarForAddingAcquisition', function() {
                    $('#dataSidebarLoader').hide();
                    $('.required').css('border', '0');
                    $('.required').parent().css('border', '0');
                    if (lastOp == "update") {
                        $('input:not([name="_token"])').val("");
                        $('input').blur();
                        $('textarea').val("");

                        $('#saveAcquisitionSourceForm').find("select").val("0").trigger('change');
                    }
                    lastOp = 'add';
                    $('#operation').val('add');
                    openSidebar();
                });

                $(document).on('click', '.opensideBarToAddContact', function() {
                    $('#dataSidebarLoader').hide();
                    $('#contact_type').empty();
                    $('#genders').empty();
                    $('.all_countries').empty();
                    $('#agency_id').empty();
                    $.ajax({
                        url:`/get-contact-types`,
                        success: function (response) {
                            $('#contact_type').append(`<option value="-1" selected disabled>Select Contact Type</option>`);
                            response.forEach((element) => {
                                $('#contact_type').append(`<option value="${element['id']}" >${element['contact_name']}</option>`);
                            })
                        },
                        error: function (e) {
                            alert('error in fetching get countries')
                        }
                    });
                    $.ajax({
                        url:`/get-genders`,
                        success: function (response) {
                            $('#genders').append(`<option value="-1" selected disabled>Select Gender</option>`);
                            response.forEach((element) => {
                                $('#genders').append(`<option value="${element['id']}" >${element['gender_name']}</option>`);
                            })
                        },
                        error: function (e) {
                            alert('error in fetching get countries')
                        }
                    });
                    $.ajax({
                        url:`/get-countries`,
                        success: function (response) {
                            $('.all_countries').append(`<option value="-1" selected disabled>Select Country</option>`);
                            response.forEach((element) => {
                                $('.all_countries').append(`<option value="${element['id']}" >${element['name']}</option>`);
                            })
                        },
                        error: function (e) {
                            alert('error in fetching get countries')
                        }
                    });
                    ///Agency show if employe status is employed
                    $('.employement_status').change(function(){
                        var status_id = $(this).val();
                        if(status_id == 1){
                            $('.agency_id').hide();
                            $('.agency_select').removeClass('required');
                        }else{
                            $('.agency_id').show();
                            $('.agency_select').addClass('required');
                        }
                    })
                    //debugger;
                    if (lastOp == "update") {
                        $('input:not([name="_token"])').val("");
                        $('input').blur();
                        $('#saveContactForm').find("select").val("-1").trigger('change');
                        $('.agency_id').hide();
                        multiple_phone_nums = [];
                        address_array = [];
                        $('.phone_nums_div').empty();
                        $('.phone_nums_div').append(` <div class="col-md-6">
                    <div class="form-group phone-SL">
                        <div class="col-auto p-0">
                            <select class="custom-select custom-select-sm phone_type">
                                <option selected disabled value="-1">Type</option>
                                <option value="Cell Phone">Cell Phone</option>
                                <option value="Landline">Landline</option>
                                <option value="Office">Office</option>
                            </select>
                        </div>
                        <div class="col p-0">
                            <a class="closeBTN remove_phone_num" style="color:white !important"><i class="fa fa-times"></i></a>
                            <input class="phoneinput poc_phone_number" type="text" placeholder="0000000000">
                            <input class="econtact_id" name="econtact_id" type="hidden" value="0">
                        </div>
                    </div>
                </div>`);

                        $('.dropifyImgDiv').empty();
                        $('.dropifyImgDiv').append('<input type="file" name="profile_pic" id="profile_pic" class="dropify" data-default-file="/images/avatar-img.jpg"/>');
                        $('#profile_pic').dropify();

                        $('.cardFrontDiv').empty();
                        $('.cardFrontDiv').append('<div class="upload-pic font12 pb-1">Card Front</div><input type="file" name="card_front" id="card_front"/>');
                        $('#card_front').dropify();

                        $('.cardBackDiv').empty();
                        $('.cardBackDiv').append('<div class="upload-pic font12 pb-1">Card Front</div><input type="file" name="card_back" id="card_back"/>');
                        $('#card_back').dropify();
                    }
                    $('.operation').val('add');
                    lastOp = 'add';


                    $('input[id="operation"]').val('add');
                    //openSidebar();
                    $('.agency_form').hide();
                    $('.poc_form').show();
                    $('.agency_form_div').removeClass("active");
                    $('.poc_form_div').addClass("active");
                    $(".overlay").addClass("active");
                    $(".collapse.in").toggleClass("in");
                    $("a[aria-expanded=true]").attr("aria-expanded", "false");
                    $("body").toggleClass("no-scroll");
                    $("#contentContainerDiv").addClass("blur-div");
                    $(".sticky-footer").addClass("blur-div");
                    $(".overlay-for-sidebar").css("display", "block");
                });
    //Get All Countries
            
    $('.all_countries').empty();
    $('.all_states').empty();
    $('.all_cities').empty();
    $('.all_postal_codes').empty();
    $.ajax({
        url:`/get-countries`,
        success: function (response) {
            $('.all_countries').append(`<option value="-1" selected disabled>Select Country</option>`);
            response.forEach((element) => {
                $('.all_countries').append(`<option value="${element['id']}" >${element['name']}</option>`);
            })
        },
        error: function (e) {
            alert('error in fetching get countries')
        }
    });
    //End Get All Countries
    //Get All States Against Selected Country
    $('.all_countries').change(function(){
        $('.all_states').empty();
        var country_id = $(this).val();
        $.ajax({
            url: `/GetStatesagianstCountryforPostal/${country_id}`,
            success: function (query) {
                $('.all_states').append(`<option value="-1" selected disabled>Select State</option>`);
                query.forEach((element) => {
                    $('.all_states').append(`<option value="${element['id']}">${element['name']}</option>`);
                })
            },
            error: function (e) {
                alert('error in fetching States')
            }
        })
    })
    //End Get All States Against Selected Country
    //Get All Cities Against Selected States
    $('.all_states').change(function(){
        $('.all_cities').empty();
        var state_id = $(this).val();
        $.ajax({
            url:`/GetCitiesagianstStatesforPostal/${state_id}`,
            success: function (querycitiespostal) {
                $('.all_cities').append(`<option value="-1" selected disabled>Select City </option>`);
                querycitiespostal.forEach((element) => {
                    $('.all_cities').append(`<option value="${element['id']}">${element['name']}</option>`);
                })
            },
            error: function (e) {
                alert('error in fetching Cities')
            }
        })
    })
    //End Get All Cities Against Selected States
    //Get All Postal Codes Against Selected City
    $('.all_cities').change(function(){
        $('.all_postal_codes').empty();
        var city_id = $(this).val();
        $.ajax({
            url:`/get-postal-code-against-cities/${city_id}`,
            success: function (response) {
                $('.all_postal_codes').append(`<option value="-1" selected disabled>Select Postal Codes </option>`);
                response.postalcodes.forEach((element) => {
                    $('.all_postal_codes').append(`<option value="${element['postal_code']}">${element['postal_code']}</option>`);
                })
            },
            error: function (e) {
                alert('error in fetching Postal Code')
            }
        })
    })
    //End Get All Postal Codes Against Selected City


                $(document).on('click', '.openDataSidebarForUpdateAgency', function() {
                    $('.all_countries').empty();
                    $('.all_states').empty();
                    $('.all_cities').empty();
                    $('.all_postal_codes').empty();
                    idTaken = false;
                    $('#idTakenError').hide();
                    $('.required').css('border', '0');
                    $('input[id="operation"]').val('update');
                    $('input[class="operation_docs"]').val('update');
                    lastOp = 'update';
                    $('#dataSidebarLoader').show();
                    $('._cl-bottom').hide();
                    $('.pc-cartlist').hide();
                    callForDzReset = false;

                    var id = $(this).attr('id');
                    $('input[name="product_updating_id"]').val(id);
                    if (!$('#saveAgencyForm input[name="_method"]').length) {
                        $('#saveAgencyForm').append('<input name="_method" value="PUT" hidden />');
                    }

                    $('#dropifyImgDiv').empty();
                    $('#dropifyImgDiv').append('<input type="file" name="compPicture" id="companyPic" class="dropify" />');

                    $('#cardFrontDiv').empty();
                    $('#cardFrontDiv').append('<input type="file" name="card_front" id="card_front" class="dropify" />');

                    $('#cardBackDiv').empty();
                    $('#cardBackDiv').append('<input type="file" name="card_back" id="card_back" class="dropify" />');

                    $('.dz-preview').remove();
                    activeCustomerForUpdate = id;
                    $.ajax({
                        type: 'GET',
                        url: '/Customer/' + id,
                        success: function(response) {
                            var response = JSON.parse(response);
                            $('#dataSidebarLoader').hide();
                            $('._cl-bottom').show();
                            $('.pc-cartlist').show();
                            $('#uploadedImg').remove();

                            $('input[name="company_name"]').focus();
                            $('input[name="company_name"]').val(response.info.company_name);
                            $('input[name="company_name"]').blur();

                            $('input[name="company_contact_number"]').focus();
                            $('input[name="company_contact_number"]').val(response.info.company_contact_number);
                            $('input[name="company_contact_number"]').blur();

                            $('input[name="business_phone_no"]').focus();
                            $('input[name="business_phone_no"]').val(response.info.business_phone);
                            $('input[name="business_phone_no"]').blur();

                            $('input[name="email"]').focus();
                            $('input[name="email"]').val(response.info.email);
                            $('input[name="email"]').blur();

                            $('input[name="website_url"]').focus();
                            $('input[name="website_url"]').val(response.info.website_url);
                            $('input[name="website_url"]').blur();



                            $('select[name="business_type"]').val(response.info.business_type).trigger('change');

                            //Get Selected Countries
                            $.ajax({
                                url:`/get-countries`,
                                success: function (responsecountry) {
                                    $('.all_countries').append(`<option value="-1" selected disabled>Select Country</option>`);
                                    responsecountry.forEach((element) => {
                                        $('.all_countries').append(`<option value="${element['id']}" ${response.info.country_id == element.id ? 'selected' : ''} >${element['name']}</option>`);
                                    })
                                },
                                error: function (e) {
                                    alert('error in fetching get countries')
                                }
                            })
                            //End Get selected Countries

                            //Get Selected States Against Selected Country
                            $.ajax({
                                url: `/GetStatesagianstCountryforPostal/${response.info.country_id}`,
                                success: function (query) {
                                    $('.all_states').append(`<option value="-1" selected disabled>Select State</option>`);
                                    query.forEach((element) => {
                                        $('.all_states').append(`<option value="${element['id']}" ${response.info.state_id == element.id ? 'selected' : ''} >${element['name']}</option>`);
                                    })
                                },
                                error: function (e) {
                                    alert('error in fetching States')
                                }
                            })
                            //End Get Selected States Against Selected Country

                            //Get Selected Cities Against Selected States
                            $.ajax({
                                url:`/GetCitiesagianstStatesforPostal/${response.info.state_id}`,
                                success: function (querycitiespostal) {
                                    $('.all_cities').append(`<option value="-1" selected disabled>Select City </option>`);
                                    querycitiespostal.forEach((element) => {
                                        $('.all_cities').append(`<option value="${element['id']}" ${response.info.city_id == element.id ? 'selected' : ''} >${element['name']}</option>`);
                                    })
                                },
                                error: function (e) {
                                    alert('error in fetching Cities')
                                }
                            })
                            //End Get Selected Cities Against Selected States

                            //Get Selected Postal Code Against Selected States
                            $.ajax({
                                url:`/get-postal-code-against-cities/${response.info.city_id}`,
                                success: function (data) {
                                    $('.all_postal_codes').append(`<option value="-1" selected disabled>Select Postal Codes </option>`);
                                    data.postalcodes.forEach((element) => {
                                        $('.all_postal_codes').append(`<option value="${element['postal_code']}" ${response.info.postal_code == element.postal_code ? 'selected' : ''} >${element['postal_code']}</option>`);
                                    })
                                },
                                error: function (e) {
                                    alert('error in fetching Postal Code')
                                }
                            })
                            //End Get Selected Postal Code Against Selected States

                            $('input[name="office_no"]').focus();
                            $('input[name="office_no"]').val(response.info.office_no);
                            $('input[name="office_no"]').blur();

                            $('input[name="street_address"]').focus();
                            $('input[name="street_address"]').val(response.info.street_address);
                            $('input[name="street_address"]').blur();

                            $('select[name="country"]').val(response.info.country).trigger('change');

                            // $('select[name="acqSource"]').val((response.info.customer_acquisition_source ? response.info.customer_acquisition_source : 0)).trigger('change');
                            // $('select[name="life_cycle_stage"]').val(response.info.life_cycle_stage).trigger('change');
                            // $('select[name="competitionDD"]').val((response.info.competition ? response.info.competition : 0)).trigger('change');
                            // $('select[name="contact_status"]').val((response.info.contact_status ? response.info.contact_status : 0)).trigger('change');

                            // if (response.info.life_cycle_stage == "prospect") {
                            //     $('#prospectDataDiv').css('display', '');
                            // } else {
                            //     $('#prospectDataDiv').css('display', 'none');
                            // }
                            //
                            // var picture = response.base_url + '/storage/company/' + response.info.picture;
                            // if (picture) {
                            //     $.get(picture)
                            //         .done(function() {
                            //             $("#companyPic").attr("data-height", '100px');
                            //             $("#companyPic").attr("data-default-file", picture);
                            //             $('#companyPic').dropify();
                            //         }).fail(function() {
                            //             $('#companyPic').dropify();
                            //         })
                            // } else {
                            //     $('#companyPic').dropify();
                            // }
                            //
                            // var cardFront = response.base_url + '/storage/company/' + response.info.card_front;
                            // if (cardFront) {
                            //     $.get(cardFront)
                            //         .done(function() {
                            //             $("#card_front").attr("data-height", '100px');
                            //             $("#card_front").attr("data-default-file", cardFront);
                            //             $('#card_front').dropify();
                            //         }).fail(function() {
                            //             $('#card_front').dropify();
                            //         })
                            // } else {
                            //     $('#card_front').dropify();
                            // }
                            //
                            // var card_back = response.base_url + '/storage/company/' + response.info.card_back;
                            // if (card_back) {
                            //     $.get(card_back)
                            //         .done(function() {
                            //             $("#card_back").attr("data-height", '100px');
                            //             $("#card_back").attr("data-default-file", card_back);
                            //             $('#card_back').dropify();
                            //         }).fail(function() {
                            //             $('#card_back').dropify();
                            //         })
                            // } else {
                            //     $('#card_back').dropify();
                            // }

                            // $('select[name="deliveryPorts"]').val(JSON.parse(response.info.port_id)).trigger("change");
                            // $('select[name="documentTypes"]').val(JSON.parse(response.info.documents_id)).trigger("change");
                            // $('select[name="interested_in_product"]').val(JSON.parse(response.info.interested_in_product)).trigger("change");
                            // $('select[name="interested_in_category"]').val(JSON.parse(response.info.interested_in_category)).trigger("change");
                            // $('textarea[name="description"]').val(response.info.remarks);

                            multiple_cust_phone_nums = [];
                            $('.customer_phone_num_div').empty();

                            if (response.info.business_phone) {
                                var business_phones = response.info.business_phone.split(",");
                                business_phones.forEach(element => {

                                    multiple_cust_phone_nums.push({
                                        'type': 'business',
                                        'number': element
                                    });
                                    $('.customer_phone_num_div').append(` <div class="col-md-6">
                                <div class="form-group phone-SL div_parent">
                                    <div class="col-auto p-0">
                                        <select class="custom-select custom-select-sm cust_phone_type">
                                            <option selected disabled value="-1">Type</option>
                                            <option selected value="business">Business</option>
                                            <option value="mobile">Mobile</option>
                                            <option value="whatsapp">WhatsApp</option>
                                        </select>
                                    </div>
                                    <div class="col p-0">
                                        <a class="closeBTN remove_phone_num" style="color:white !important"><i class="fa fa-times"></i></a>
                                        <input class="phoneinput cust_phone_number" value="${element}" type="text" placeholder="0000000000">
                                    </div>
                                </div>
                            </div>`);
                                });
                            }

                            if (response.info.mobile_phone) {
                                var mobile_phones = response.info.mobile_phone.split(",");
                                mobile_phones.forEach(element => {

                                    multiple_cust_phone_nums.push({
                                        'type': 'mobile',
                                        'number': element
                                    });
                                    $('.customer_phone_num_div').append(` <div class="col-md-6">
                                <div class="form-group phone-SL div_parent">
                                    <div class="col-auto p-0">
                                        <select class="custom-select custom-select-sm cust_phone_type">
                                            <option selected disabled value="-1">Type</option>
                                            <option value="business">Business</option>
                                            <option selected value="mobile">Mobile</option>
                                            <option value="whatsapp">WhatsApp</option>
                                        </select>
                                    </div>
                                    <div class="col p-0">
                                        <a class="closeBTN remove_phone_num" style="color:white !important"><i class="fa fa-times"></i></a>
                                        <input class="phoneinput cust_phone_number" value="${element}" type="text" placeholder="0000000000">
                                    </div>
                                </div>
                            </div>`);
                                });
                            }

                            if (response.info.whatsapp_phone) {
                                var whatsapp_phones = response.info.whatsapp_phone.split(",");
                                whatsapp_phones.forEach(element => {

                                    multiple_cust_phone_nums.push({
                                        'type': 'whatsapp',
                                        'number': element
                                    });
                                    $('.customer_phone_num_div').append(` <div class="col-md-6">
                                <div class="form-group phone-SL div_parent">
                                    <div class="col-auto p-0">
                                        <select class="custom-select custom-select-sm cust_phone_type">
                                            <option selected disabled value="-1">Type</option>
                                            <option value="business">Business</option>
                                            <option value="mobile">Mobile</option>
                                            <option selected value="whatsapp">WhatsApp</option>
                                        </select>
                                    </div>
                                    <div class="col p-0">
                                        <a class="closeBTN remove_phone_num" style="color:white !important"><i class="fa fa-times"></i></a>
                                        <input class="phoneinput cust_phone_number" value="${element}" type="text" placeholder="0000000000">
                                    </div>
                                </div>
                            </div>`);
                                });
                            }
                            $('.doc_key').val(response.info.doc_key);
                            $('.operation_docs').val(response.info.doc_key);
                            var mockFile = "";
                            response.cust_images.forEach(element => {
                                mockFile = {
                                    name: response.image_url + element.cust_images,
                                    size: 12345
                                };
                                myDropzone.options.addedfile.call(myDropzone, mockFile);
                                // And to show the thumbnail of the file:
                                myDropzone.options.thumbnail.call(myDropzone, mockFile, response.image_url + element.cust_images);
                            });

                            $('[name="compId"]').focus()
                            $('input').blur();

                            setTimeout(function() {
                                $('.dz-image').find('img').css('width', '100%');
                                $('.dz-image').find('img').css('height', '100%');
                                // $('.address').focus();
                                // $('.city').focus();
                                // $('.code').focus();
                                // $('.state').focus();
                            }, 500)


                        }
                    });

                    $('.agency_form').show();
                    $('.poc_form').hide();
                    $('.agency_form_div').addClass("active");
                    $('.poc_form_div').removeClass("active");
                    $(".overlay").addClass("active");
                    $(".collapse.in").toggleClass("in");
                    $("a[aria-expanded=true]").attr("aria-expanded", "false");
                    $("body").toggleClass("no-scroll");
                    $("#contentContainerDiv").addClass("blur-div");
                    $(".sticky-footer").addClass("blur-div");
                    $(".overlay-for-sidebar").css("display", "block");
                });

                $(document).on('click', '.openDataSidebarForUpdateDocumentType', function() {
                    $('input[id="operation"]').val('update');
                    lastOp = 'update';
                    $('#dataSidebarLoader').show();
                    $('._cl-bottom').hide();
                    $('.pc-cartlist').hide();

                    var id = $(this).attr('id');
                    $('#document_update_id').val(id);
                    $.ajax({
                        type: 'GET',
                        url: '/get_selected_documnetType/' + id,
                        success: function(response) {
                            var response = JSON.parse(response);
                            // console.log(response);
                            $('#dataSidebarLoader').hide();
                            $('._cl-bottom').show();
                            $('.pc-cartlist').show();
                            $('#uploadedImg').remove();

                            $('input[name="document_type_name"]').focus();
                            $('input[name="document_type_name"]').val(response.document_name);
                            $('input[name="document_type_name"]').blur();

                        }
                    });

                    openSidebar();
                });

                $(document).on('click', '.openDataSidebarForUpdateAcquisition', function() {
                    $('input[id="operation"]').val('update');
                    lastOp = 'update';
                    $('#dataSidebarLoader').show();
                    $('._cl-bottom').hide();
                    $('.pc-cartlist').hide();

                    var id = $(this).attr('id');
                    $('#hidden_AcquisitionSource').val(id);
                    $.ajax({
                        type: 'GET',
                        url: '/get_selected_AcquisitionSource/' + id,
                        success: function(response) {
                            var response = JSON.parse(response);
                            // console.log(response);
                            $('#dataSidebarLoader').hide();
                            $('._cl-bottom').show();
                            $('.pc-cartlist').show();

                            $('input[name="name"]').focus();
                            $('input[name="name"]').val(response.name);
                            $('input[name="name"]').blur();

                            $('input[name="year"]').focus();
                            $('input[name="year"]').val(response.year);
                            $('input[name="year"]').blur();

                            $('input[name="cost"]').focus();
                            $('input[name="cost"]').val(response.cost);
                            $('input[name="cost"]').blur();

                            $('select[name="type"]').val(response.type).trigger('change');

                        }
                    });

                    openSidebar();
                });


                $(document).on('click', '#saveDocumentType', function() {
                    
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
                        $('#notifDiv').text('Please provide all the required Information (*)');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                        return;
                    }
                    
                    $('#saveDocumentType').attr('disabled', 'disabled');
                    $('#cancelDocumentType').attr('disabled', 'disabled');
                    $('#saveDocumentType').text('Processing..');

                    var ajaxUrl = "/save_document_type";

                    $('#saveDocumentTypeForm').ajaxSubmit({
                        type: "POST",
                        url: ajaxUrl,
                        data: $('#saveDocumentTypeForm').serialize(),
                        cache: false,
                        success: function(response) {
                            $('#saveDocumentType').removeAttr('disabled');
                            $('#cancelDocumentType').removeAttr('disabled');
                            $('#saveDocumentType').text('Save');

                            if (JSON.parse(response) == "success") {
                                $('input[name="document_type_name"]').val('');
                                $('#pl-close').click();
                                fetchDocumentTypeList();
                                if ($('#operation').val() == "update") {
                                    $('#notifDiv').fadeIn();
                                    $('#notifDiv').css('background', 'green');
                                    $('#notifDiv').text('Document Type have been updated successfully');
                                    setTimeout(() => {
                                        $('#notifDiv').fadeOut();
                                    }, 3000);
                                } else {
                                    $('#notifDiv').fadeIn();
                                    $('#notifDiv').css('background', 'green');
                                    $('#notifDiv').text('Document Type have been added successfully');
                                    setTimeout(() => {
                                        $('#notifDiv').fadeOut();
                                    }, 3000);
                                }
                            } else if (JSON.parse(response) == "already_exist") {
                                $('#notifDiv').fadeIn();
                                $('#notifDiv').css('background', 'red');
                                $('#notifDiv').text('Document Type already exist!');
                                setTimeout(() => {
                                    $('#notifDiv').fadeOut();
                                }, 3000);
                            } else {
                                $('#notifDiv').fadeIn();
                                $('#notifDiv').css('background', 'red');
                                $('#notifDiv').text('Failed to add document type at the moment');
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

                $(document).on('click', '#saveAcquisition', function() {
                    var verif = [];
                    $('.required').each(function() {
                        $(this).css("border", "0px solid red");
                        if ($(this).val() == "") {
                            $(this).css("border", "1px solid red");
                            verif.push(false);
                        } else if ($(this).val() == "0" || $(this).val() == null) {
                            $(this).parent().css("border", "1px solid red");
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

                    $('#saveAcquisition').attr('disabled', 'disabled');
                    $('#cancelAcquisition').attr('disabled', 'disabled');
                    $('#saveAcquisition').text('Processing..');

                    $('#saveAcquisitionSourceForm').ajaxSubmit({
                        type: "POST",
                        url: '/saveAcquisitionSource',
                        data: $('#saveAcquisitionSourceForm').serialize(),
                        cache: false,
                        success: function(response) {
                            $('#saveAcquisition').removeAttr('disabled');
                            $('#cancelAcquisition').removeAttr('disabled');
                            $('#saveAcquisition').text('Save');

                            if (JSON.parse(response) == "success") {
                                $('#pl-close').click();
                                fetchAcquisitionList();
                                if ($('#operation').val() == "update") {
                                    $('#notifDiv').fadeIn();
                                    $('#notifDiv').css('background', 'green');
                                    $('#notifDiv').text('Acquisition Type have been updated successfully');
                                    setTimeout(() => {
                                        $('#notifDiv').fadeOut();
                                    }, 3000);
                                } else {
                                    $('#notifDiv').fadeIn();
                                    $('#notifDiv').css('background', 'green');
                                    $('#notifDiv').text('Acquisition Type have been added successfully');
                                    setTimeout(() => {
                                        $('#notifDiv').fadeOut();
                                    }, 3000);
                                    $('select[name="type"]').val('0').trigger('change');
                                    $('input[name="name"]').val('');
                                    $('input[name="year"]').val('');
                                    $('input[name="cost"]').val('');
                                }
                            } else if (JSON.parse(response) == "already_exist") {
                                $('#notifDiv').fadeIn();
                                $('#notifDiv').css('background', 'red');
                                $('#notifDiv').text('Acquisition Type already exist!');
                                setTimeout(() => {
                                    $('#notifDiv').fadeOut();
                                }, 3000);
                            } else {
                                $('#notifDiv').fadeIn();
                                $('#notifDiv').css('background', 'red');
                                $('#notifDiv').text('Failed to add Acquisition type at the moment');
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
                    if (!confirm("This customer will be deleted permanently?")) {
                        return;
                    }
                    var customerId = $(this).attr('id');
                    var thisRef = $(this);
                    thisRef.attr('disabled', 'disabled');
                    thisRef.parent().ajaxSubmit({
                        type: "POST",
                        url: '/Customer/' + customerId,
                        data: thisRef.parent().serialize(),
                        cache: false,
                        success: function(response) {
                            if (JSON.parse(response) == "success") {
                                closeSidebar();
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


                $(document).on('click', '.deleteDocumentType', function(){
                    var id = $(this).attr('id');
                    glob_type = $(this).attr('name');
                    $('.confirm_delete').attr('id', id);
                    deleteRef = $(this); 
                    $('#hidden_btn_to_open_modal').click();
                })

                $(document).on('click', '.deleteAcquisition', function(){
                    var id = $(this).attr('id');
                    glob_type = $(this).attr('name');
                    $('.confirm_delete').attr('id', id);
                    deleteRef = $(this); 
                    $('#hidden_btn_to_open_modal').click();
                })

                $(document).on('click', '.confirm_delete', function() {
                    var id = $(this).attr('id');
                    var thisRef = $(this);
                    deleteRef.attr('disabled', 'disabled');
                    deleteRef.text('Processing...');
                    var url = glob_type == 'acquistion' ? '/deleteAcquisition/'+id : '/deleteDocumentType/'+id;
                    var type = glob_type == 'acquistion' ? 'POST' : 'GET'
                    $.ajax({
                        type: type,
                        url: url,
                        data: {
                            _token: $('meta[name="csrf_token"]').attr('content')
                        },
                        success: function(response) {
                            deleteRef.removeAttr('disabled');
                            deleteRef.text('Delete');
                            if (JSON.parse(response) == 'success') {
                                deleteRef.parent().parent().remove();
                                $('.cancel_delete_modal').click();
                                $('#notifDiv').fadeIn();
                                $('#notifDiv').css('background', 'green');
                                $('#notifDiv').text('Document Type deleted successfully');
                                setTimeout(() => {
                                    $('#notifDiv').fadeOut();
                                }, 3000);
                            } else {
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


                $(document).on('click', '.uploadblukcust', function() {
                    $('.uploaded_customers_table').hide();
                    $('.uploaded_data_div').hide();
                });

                $(document).on('click', '.bulk_upload_btn', function() {
                    
                    var action_current  =   $('.dynamic_search').attr('data-current_action');
                    if (action_current == 'customer') {
                        $('.sample_download_link').attr('href', '/download_sample_agency');
                        $('.error_message_div').hide();
                        $('.not_uploadable_customers_table').empty();
                    } else {
                        $('.sample_download_link').attr('href', '/download_sample_contact');
                        $('.error_contact_message_div').hide();
                        $('.not_uploadable_poc_table').empty();
                    }
                })

                //Excel Sheet Input Change Action
                $(document).on('change', '.excel_file_input', function() {
                    var file = $('.excel_file_input')[0].files[0]
                    if (file) {
                        $('.file_name').text(file.name);
                    }
                });

                //Excel Sheet Input Change for Contact Action
                $(document).on('change', '.contact_excel_file_input', function() {
                    var file = $('.contact_excel_file_input')[0].files[0]
                    if (file) {
                        $('.file_name').text(file.name);
                    }
                });

                //Save Agency Excel Sheet
                $(document).on('click', '.upload_excel_file_btn', function() {
                    var error = false;
                    current_action = $('.dynamic_search').attr('data-current_action');

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
                        type: "POST",
                        url: '/upload_agency_bulk',
                        cache: false,
                        success: function(response) {
                            thisRef.removeAttr('disabled');
                            thisRef.text('Upload');
                            $('.file_name').text('Choose File');
                            $('.excel_file_input').val('');
                            $('.error_message_div').hide();
                            $('.not_uploadable_customers_table').empty();
                            if (response.status == 'failed') {
                                $('#notifDiv').fadeIn();
                                $('#notifDiv').css('background', 'red');
                                $('#notifDiv').text('Failed to add Agency at the moment');
                                setTimeout(() => {
                                    $('#notifDiv').fadeOut();
                                }, 3000);
                            } else {
                                fetchCompaniesList();
                                $('#notifDiv').fadeIn();
                                $('#notifDiv').css('background', 'green');
                                $('#notifDiv').text('Added Successfully');
                                setTimeout(() => {
                                    $('#notifDiv').fadeOut();
                                }, 3000);
                            }

                            if (response.duplicate_data.length > 0) {
                                $('.error_message_div').show();
                                $('.not_uploadable_customers_table').append('<table class="table table-hover dt-responsive nowrap" id="not_uploadable_customers" style="width:100%;"><thead><tr><th>Excel S.No</th><th>Business Type</th><th>Company Name</th><th>Reason</th></tr></thead><tbody></tbody></table>');
                                $('#not_uploadable_customers tbody').empty();
                                response.duplicate_data.forEach((element, key) => {
                                    $('#not_uploadable_customers tbody').append(`<tr><td>${element['count']+1}</td><td>${element['business_type'] ? element['business_type'] : ''} </td><td>${element['company_name']}</td><td>${element['reason'] ? element['reason'] : ''}</td></tr>`);
                                });
                                $('#not_uploadable_customers').DataTable();
                            } else {
                                $('.close_modal').click();
                            }
                        }
                    });
                });

                //Save Contact Excel Sheet
                $(document).on('click', '.upload_contact_excel_file_btn', function() {
                    var error = false;
                    current_action = $('.dynamic_search').attr('data-current_action');
                    if ($('.contact_excel_file_input').get(0).files.length === 0) {
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
                    $('#upload_contact_excel_form').ajaxSubmit({
                        type: "POST",
                        url: '/upload-contacts-bulk',
                        cache: false,
                        success: function(response) {
                            thisRef.removeAttr('disabled');
                            thisRef.text('Upload');
                            $('.file_name').text('Choose File');
                            $('.contact_excel_file_input').val('');
                            $('.error_contact_message_div').hide();
                            $('.not_uploadable_poc_table').empty();
                            if (response.status == 'failed') {
                                $('#notifDiv').fadeIn();
                                $('#notifDiv').css('background', 'red');
                                $('#notifDiv').text('Failed to add Contact at the moment');
                                setTimeout(() => {
                                    $('#notifDiv').fadeOut();
                                }, 3000);
                            } else {
                                fetchPOCList();
                                $('#notifDiv').fadeIn();
                                $('#notifDiv').css('background', 'green');
                                $('#notifDiv').text('Added Successfully');
                                setTimeout(() => {
                                    $('#notifDiv').fadeOut();
                                }, 3000);
                            }

                            if (response.duplicate_data.length > 0) {
                                $('.error_contact_message_div').show();
                                $('.not_uploadable_poc_table').append('<table class="table table-hover dt-responsive nowrap" id="not_uploadable_contacts" style="width:100%;"><thead><tr><th>Excel S.No</th><th>Employment_status</th><th>Name</th><th>Contact No.</th><th>Reason</th></tr></thead><tbody></tbody></table>');
                                $('#not_uploadable_contacts tbody').empty();
                                response.duplicate_data.forEach((element, key) => {
                                    $('#not_uploadable_contacts tbody').append(`<tr><td>${element['count']+1}</td><td>${element['employee_status'] ? element['employee_status'] : ''} </td><td>${element['name']}</td><td>${element['contact_no']}</td><td>${element['reason'] ? element['reason'] : ''}</td></tr>`);
                                });
                                $('#not_uploadable_contacts').DataTable();
                            } else {
                                $('.close_modal').click();
                            }
                        }
                    });
                });


                $(document).on('change', 'input[name="cust_image"]', function() {
                    // $(document).on('change', 'input[name="testing"]', function(){
                    const file = this.files[0];
                    toBase64(file).then(x => {
                        imageURL = x;
                    })
                });

                //Save customers Dropdown
                $(document).on('click', '.save_cust_from_modal', function() {
                    var id = $(this).attr('id');
                    var thisRef = $(this);
                    var type = thisRef.parent().parent().find($('select[name="typeFromModal"]')).val();
                    var parent_comp = thisRef.parent().parent().find($('select[name="parentCompnayModal"]')).val();
                    var country = thisRef.parent().parent().find($('select[name="countryModal"]')).val();
                    var doc_type = thisRef.parent().parent().find($('select[name="documentTypesModal"]')).val();
                    var del_port = thisRef.parent().parent().find($('select[name="deliveryPortsModal"]')).val();
                    var acq_source = thisRef.parent().parent().find($('select[name="acqSourceModal"]')).val();
                    if (country == 0 || country == null || acq_source == 0 || acq_source == null) {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text('Please Select Country and Acquisition Source');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                        return;
                    }
                    thisRef.attr('disabled', 'disabled');
                    $.ajax({
                        type: 'POST',
                        url: '/saveCustomersDropdownValues',
                        data: {
                            _token: $('input[name="_token"]').val(),
                            id: id,
                            type: type,
                            parent_comp: parent_comp,
                            country: country,
                            doc_type: doc_type,
                            del_port: del_port,
                            acq_source: acq_source,
                            imageURL: imageURL
                        },
                        success: function(response) {
                            var response = JSON.parse(response);
                            thisRef.text('Save');
                            thisRef.removeAttr('disabled');
                            if (response == 'failed') {
                                $('#notifDiv').fadeIn();
                                $('#notifDiv').css('background', 'red');
                                $('#notifDiv').text('Failed to save at the moment');
                                setTimeout(() => {
                                    $('#notifDiv').fadeOut();
                                }, 3000);
                            } else {
                                thisRef.parent().parent().remove();
                                imageURL = '';
                            }
                        }
                    });
                });


                $(document).on('input', '#search_custmers', function() {
                    if ($(this).val().length > 0) {
                        $('#tblLoader').show();
                        $('.data_div').hide();
                        fetchSearchResult($(this).val());
                    }
                    if ($(this).val() == '') {
                        $('#tblLoader').show();
                        $('.data_div').hide();
                        //fetchCompaniesList();
                        fetchSearchResult($(this).val());
                    }
                    //$('.data_div').show();
                });

                $(document).on('click', '.open_task_modal', function() {
                    $('.task_modal_title').text($(this).attr('taskTitle'));
                    $('.mom_div').text($(this).attr('mom'));
                    $('.modal_created_by').text($(this).attr('createdBy'));
                    $('.modal_due_date').text($(this).attr('dueDate'));
                    $('.modal_due_time').text($(this).attr('time'));
                    $('.status_modal').removeClass('status_modal _TOverdue Tdone Tpending').addClass('status_modal');
                    //$('.created_by_pic_modal').attr('src', $(this).attr('created_by_pic'));
                    //alert($(this).attr('createdByPic'));
                    $('.created_by_pic_modal').attr('src', ($(this).attr('createdByPic') ? $(this).attr('createdByPic').replace('./', '/') : '/images/avatar.svg'));
                    //{{ Auth::user()->picture ? str_replace('./', '/', Auth::user()->picture) : '/images/avatar.svg' }}

                    $('.status_modal').addClass(($(this).attr('completedAt') ? "Tdone" : (moment($(this).attr('dueDate'), 'Y-M-D').format('Y-M-D') < moment().format('Y-M-D') ? "_TOverdue" : "Tpending")));
                    $('.status_modal').text(($(this).attr('completedAt') ? "Done" : (moment($(this).attr('dueDate'), 'Y-M-D').format('Y-M-D') < moment().format('Y-M-D') ? "Overdue" : "Pending")));

                });



                $(document).on('change', '.select_product_sample', function() {
                    $(".select_product_sample option[value='0']").remove();
                    var product_val = $(this).val();
                    var items = [];
                    $('.select_item_sample').empty();
                    //$('.select_item_sample').append('<option value="0" disabled selected>Select Item*</option>');
                    items = allItems.filter(function(x) {
                        return x.product_id == product_val;
                    });
                    items.forEach(element => {
                        $('.select_item_sample').append(`<option value="${element['id']}" name="${element['standrad_unit_price']}" selected>${element['name']}</option>`);
                    });
                     //console.log(allItems);
                });

                $(document).on('click', '.add_sample_to_table', function() {
                            var id_found = false;

                            if ($('.select_product_sample').val() == 0 || $('.select_product_sample').val() == null || $('.select_item_sample').val() == 0 || $('.select_item_sample').val() == null || $('.select_customer_sample').val() == 0 || $('.select_customer_sample').val() == null) {
                                $('#notifDiv').fadeIn();
                                $('#notifDiv').css('background', 'red');
                                $('#notifDiv').text('Please Select all fields!');
                                setTimeout(() => {
                                    $('#notifDiv').fadeOut();
                                }, 3000);
                                return;
                            }

                            assignSamples.find(x => {
                                if (x.product_id == $(`${action == 'price_quotation' ? '.quotation_dropdown_product' : '.sampling_dropdown_product'}`).val() && x.item_id == $(`${action == 'price_quotation' ? '.quotation_dropdown_item' : '.sampling_dropdown_item'}`).val() && x.customer_id == $('.select_customer_sample').val()) {
                                    id_found = true;
                                }
                            });

                            if (id_found) {
                                $('#notifDiv').fadeIn();
                                $('#notifDiv').css('background', 'red');
                                $('#notifDiv').text('Record already Exist!');
                                setTimeout(() => {
                                    $('#notifDiv').fadeOut();
                                }, 3000);
                                return;
                            }
                            assignSamples.push({
                                'product_id': $(`${action == 'price_quotation' ? '.quotation_dropdown_product' : '.sampling_dropdown_product'}`).val(),
                                'product_name': $(`${action == 'price_quotation' ? '.quotation_dropdown_product' : '.sampling_dropdown_product'}`).find('option:selected').text(),
                                'item_id': $(`${action == 'price_quotation' ? '.quotation_dropdown_item' : '.sampling_dropdown_item'}`).val(),
                                'item_name': $(`${action == 'price_quotation' ? '.quotation_dropdown_item' : '.sampling_dropdown_item'}`).find('option:selected').text(),
                                'item_price': $(`${action == 'price_quotation' ? '.quotation_dropdown_item' : '.sampling_dropdown_item'}`).find('option:selected').attr('name'),
                                'customer_id': $('.select_customer_sample').val(),
                                'customer_name': $('.select_customer_sample').find('option:selected').text()
                            });

                            $('.sampleTableBody').empty();
                            assignSamples.forEach(element => {
                                        $('.sampleTableBody').append(`<tr><td>${element['product_name']}</td><td>${element['item_name']}</td><td>${element['customer_name']}</td>${action == 'price_quotation' ? `<td><input name="quote_unit_price" value="${element['item_price']}" type="number" class="form-control" style="max-width:100px !important"/></td>` : ''}<td><button type="button" id="${element['product_id']+'/'+element['item_id']+'/'+element['customer_id']}" class="btn btn-default red-bg remove_sample" title="Remove">Remove</button></td></tr>`);
            });
            //console.log(assignSamples);
        });

        $(document).on('click', '.remove_sample', function () {
            var thisRef = $(this).attr('id').split('/');
            assignSamples = assignSamples.filter(x => !(x.item_id == thisRef[1] && x.customer_id == thisRef[2]));
            $(this).parent().parent().remove();
            // console.log(assignSamples);
        });

        $(document).on('input', 'input[name="quote_unit_price"]', function () {
            //debugger;
            var ids = $(this).parent().parent().find('.remove_sample').attr('id').split('/');
            var value = $(this).val();

            assignSamples.find(x => {
                if (x.product_id == ids[0] && x.item_id == ids[1] && x.customer_id == ids[2]) {
                    x.item_price = value;
                }
            });
            //console.log(assignSamples);
        });

        $(document).on('click', '.save_sampling', function () {
            if (!assignSamples.length) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please Add Samples First!');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }

            var error = [];
            $(this).parent().parent().find('input[name="quote_unit_price"]').each(function () {
                //debugger;
                if ($(this).val() == '' || $(this).val() == '0') {
                    error.push(true);
                } else {
                    error.push(false);
                }
            });

            if (jQuery.inArray(true, error) != -1) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Price Cannot be 0 or null!');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }

            // if($('input[name="transaction_id"]').val() == '' || $('input[name="courier"]').val() == ''){
            //     $('#notifDiv').fadeIn();
            //     $('#notifDiv').css('background', 'red');
            //     $('#notifDiv').text('Please fill all fields with(*)!');
            //     setTimeout(() => {
            //         $('#notifDiv').fadeOut();
            //     }, 3000);
            //     return;
            // }
            var thisRef = $(this);
            thisRef.text('Processing...');
            thisRef.attr('disabled', 'disabled');
            $.ajax({
                type: 'POST',
                url: '/save_customer_sampling',
                data: {
                    _token: $('input[name="_token"]').val(),
                    assign_samples: assignSamples,
                    delivery_date: $('.expected_delivery_date').val(),
                    transaction_id: $('input[name="transaction_id"]').val(),
                    courier: $('input[name="courier"]').val(),
                    remarks: $('#sampleRemarks').val(),
                    action: action
                },
                success: function (response) {
                    var response = JSON.parse(response);
                    thisRef.text('Save');
                    thisRef.removeAttr('disabled');
                    if (response == 'success') {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Added Successfully!');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                        $('input[name="transaction_id"]').val('');
                        $('input[name="courier"]').val('');
                        $('#sampleRemarks').val('');
                        assignSamples = [];
                        $('.sampleTableBody').empty();
                        $('.select_product_sample').val(0).trigger('change');
                        $('.select_customer_sample').val(0).trigger('change');
                        $('.select_item_sample').empty();
                        $('.select_item_sample').append('<option value="0" disabled selected>Select Item*</option>');
                        if (action == 'customer_sampling') {
                            fetchCustomerSampling();
                        } else {
                            fetchQuotePrices();
                        }
                    } else {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text('Failed to add samples at the moment!');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }
                }
            });

        });

        $(document).on('click', '.view_sample', function () {
            $('.show_sample_loader').show();
            $('.show_sampleTableBody').empty();
            $('#exp_DD').val('');
            $('#show_transaction_id').val('');
            $('#show_courier').val('');
            $('#show_sample').val('');
            var thisRef = $(this).attr('id').split('/');
            $.ajax({
                type: 'GET',
                url: '/FetchSampleDate',
                data: {
                    'date': thisRef[0],
                    'customer': thisRef[1]
                },
                success: function (response) {
                    var response = JSON.parse(response);
                    // console.log(response);
                    $('.show_sample_loader').hide();
                    response.forEach(element => {
                        $('.show_sampleTableBody').append(`<tr><td>${element['product_name'] ? element['product_name'] : 'NA'}</td><td>${element['item_name']}</td><td>${element['customer_name'] ? element['customer_name'] : 'NA'}</td><td>${element['transaction_id']}</td><td>${element['courier']}</td></tr>`);
                    });
                }
            });
        });

        $(document).on('click', '.add_quote_btn', function () {
            if (action == 'price_quotation') {
                $('input[name="transaction_id"]').parent().parent().hide();
                $('input[name="courier"]').parent().parent().hide();
            } else {
                $('input[name="transaction_id"]').parent().parent().show();
                $('input[name="courier"]').parent().parent().show();
            }
        })

        $(document).on('click', '.view_quote', function () {
            $('.view_quote_table thead tr:eq(3)').hide();
            $('.view_quote_table thead tr:eq(4)').hide();
            $('.show_sample_loader').show();
            $('.show_sampleTableBody').empty();
            $('#exp_DD').val('');
            $('#show_transaction_id').val('');
            $('#show_courier').val('');
            $('#show_sample').val('');
            var thisRef = $(this).attr('id').split('/');
            $('.export_as_excel').attr('href', `/download_price_quote/${thisRef[0]}/${thisRef[1]}`);
            $.ajax({
                type: 'GET',
                url: '/FetchQuotePriceData',
                data: {
                    'date': thisRef[0],
                    'customer': thisRef[1]
                },
                success: function (response) {
                    var response = JSON.parse(response);
                    // console.log(response);
                    $('.show_sample_loader').hide();
                    response.forEach(element => {
                        $('.show_sampleTableBody').append(`<tr><td>${element['product_name'] ? element['product_name'] : 'NA'}</td><td>${element['item_name']}</td><td>${element['customer_name'] ? element['customer_name'] : 'NA'}</td><td>${element['quote_price'] ? addCommas(element['quote_price']) : 'NA'}</td></tr>`);
                    });
                }
            });
        });


        $(document).on('change', '#select_customer_filter', function () {
            trigger_customer_filter($(this).val());
        });

        $(document).on('click', '.active_deactive_btn', function () {
            var thisRef = $(this);
            $('.modal_customer_name').text(thisRef.attr('name'));
            $('.modal_activation_save').attr('id', thisRef.attr('id'));
            $(`input[name=activation_checkBox][value='${thisRef.attr('activation')}']`).prop("checked", true);
        });

        $(document).on('click', '.modal_activation_save', function () {
            var thisRef = $(this);
            thisRef.attr('disabled', 'disabled');
            thisRef.text('Processing...');
            $.ajax({
                type: 'POST',
                url: '/customer_active_deactive',
                data: {
                    _token: $('input[name="_token"]').val(),
                    id: thisRef.attr('id'),
                    action: $("input[name='activation_checkBox']:checked").val()
                },
                success: function (response) {
                    var response = JSON.parse(response);
                    thisRef.text('Save');
                    thisRef.removeAttr('disabled');
                    if (response == 'success') {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Successfully added!');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                        fetchCompaniesList();
                        $('.close_activation_modal').click();
                    } else {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text('Failed to perform at the moment!');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }
                }
            });
        })



        //POC Start
        $(document).on('click', '.add_another_number', function () {

            var type_faulty = [];
            var number_faulty = [];
            $('.phone_type').each(function () {
                if ($(this).val() == '-1' || $(this).val() == null) {
                    type_faulty.push(false);
                } else {
                    type_faulty.push(true);
                }
            })

            if (jQuery.inArray(false, type_faulty) != -1) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Select Phone Type.');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }

            $('.poc_phone_number').each(function () {
                if ($(this).val() == '' || $(this).val() == null) {
                    number_faulty.push(false);
                } else {
                    number_faulty.push(true);
                }
            })

            if (jQuery.inArray(false, number_faulty) != -1) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Phone Number.');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }

            multiple_phone_nums = [];
            $('.phone-SL').each(function () {
                multiple_phone_nums.push({
                    'type': $(this).find('.phone_type').val(),
                    'number': $(this).find('.poc_phone_number').val(),
                    'phone_id': $(this).find('.econtact_id').val()
                });
            });

            $('.phone_nums_div').append(` <div class="col-md-6">
                <div class="form-group phone-SL">
                    <div class="col-auto p-0">
                        <select class="custom-select custom-select-sm phone_type">
                            <option selected disabled value="-1">Type</option>
                            <option value="Cell Phone">Cell Phone</option>
                            <option value="Landline">Landline</option>
                            <option value="Office">Office</option>
                        </select>
                    </div>
                    <div class="col p-0">
                        <a class="closeBTN remove_phone_num" style="color:white !important"><i class="fa fa-times"></i></a>
                        <input class="phoneinput poc_phone_number" type="text" placeholder="0000000000">
                        <input class="econtact_id" name="econtact_id" type="hidden" value="0">
                    </div>
                </div>
            </div>`);
            //console.log(multiple_phone_nums);
        })

        $(document).on('click', '.remove_phone_num', function () {
            var type = $(this).parent().parent().find('.phone_type').val();
            var number = $(this).parent().parent().find('.poc_phone_number').val();
            multiple_phone_nums = multiple_phone_nums.filter(x => !(x.type == type && x.number == number));
            $(this).parent().parent().parent().remove();
            //console.log(multiple_phone_nums);
        })

        $(document).on('click', '.save_poc_detail', function () {
            var emailReg            =   /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            var numberReg           =   /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
            var nameReg             =   /^[A-Za-z]+$/;
            var first_name          =   $('#first_name').val();
            var middle_name         =   $('#middle_name').val();
            var last_name           =   $('#last_name').val();
            var contact_cellphone   =   $('#contact_cellphone').val();
            var official_email      =   $('#official_email').val();
            var personal_email      =   $('#personal_email').val();
            var error = [];
            $('.required').each(function () {
                $(this).css('border', '0px solid red');
                $(this).parent().css('border', '0px solid red');
                if ($(this).val() == '') {
                    $(this).css('border', '0px solid red');
                    error.push(true);
                } else if ($(this).val() == '-1' || $(this).val() == null) {
                    $(this).parent().css('border', '0px solid red');
                    error.push(true);
                } else {
                    error.push(false);
                }
            });

            if (jQuery.inArray(true, error) != -1) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please provide all the required Information (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }

            multiple_phone_nums = [];
            $('.phone-SL').each(function () {
                var test = $(this).find(".phone_type option:selected").val();
                var test2 = $(this).find('.poc_phone_number').val();
                if ($(this).find(".phone_type option:selected").val() != null && $(this).find('.poc_phone_number').val() != '' && $(this).find('.econtact_id').val() !='') {
                    multiple_phone_nums.push({
                        'type': $(this).find(".phone_type option:selected").val(),
                        'number': $(this).find('.poc_phone_number').val(),
                        'phone_id': $(this).find('.econtact_id').val()
                    });
                }
            });


            if (!multiple_phone_nums.length) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please Phone Numbers.');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            ///Verfiy First Name Format
            if (nameReg.test(first_name)==false) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct First Name');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            ///Verfiy middle Name Format
            // if (nameReg.test(middle_name)==false) {
            //     $('#notifDiv').fadeIn();
            //     $('#notifDiv').css('background', 'red');
            //     $('#notifDiv').text('Enter Correct Middle Name');
            //     setTimeout(() => {
            //         $('#notifDiv').fadeOut();
            //     }, 3000);
            //     return;
            // }
            ///Verfiy last Name Format
            if (nameReg.test(last_name)==false) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Last Name');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            ///Verfiy Contact Cellphone Format
            if (numberReg.test(contact_cellphone)==false) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Contact No.');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            ///Verfiy Official Email Format
            if (emailReg.test(official_email)==false) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Official Email');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            ///Verfiy Personal Email Format
            if (emailReg.test(personal_email)==false) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Personal Email');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            
            var thisRef = $(this);
            thisRef.text('Processing...');
            thisRef.attr('disabled', 'disabled');
            $('.cancel_poc').attr('disabled', 'disabled');
            $('#saveContactForm').ajaxSubmit({
                type: "POST",
                url: '/save_company_poc',
                cache: false,
                data: {
                    multiple_phone_nums: multiple_phone_nums
                },
                success: function (response) {
                    $('.cancel_poc').removeAttr('disabled');
                    thisRef.removeAttr('disabled');
                    thisRef.text('Save');
                    if (JSON.parse(response) == 'success') {
                        $('.phone_nums_div').empty();
                        $('.phone_nums_div').append(` <div class="col-md-6">
                            <div class="form-group phone-SL">
                                <div class="col-auto p-0">
                                    <select class="custom-select custom-select-sm phone_type">
                                        <option selected disabled value="-1">Type</option>
                                        <option value="Cell Phone">Cell Phone</option>
                                        <option value="Landline">Landline</option>
                                        <option value="Office">Office</option>
                                    </select>
                                </div>
                                <div class="col p-0">
                                    <a class="closeBTN remove_phone_num" style="color:white !important"><i class="fa fa-times"></i></a>
                                    <input class="phoneinput poc_phone_number" type="text" placeholder="0000000000">
                                    <input class="econtact_id" name="econtact_id" type="hidden" value="0">
                                </div>
                            </div>
                        </div>`);
                        $('#saveContactForm').empty;
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Save Successfully');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);

                        // callForDzReset = true;
                        // myDropzone.removeAllFiles(true);
                        closeSidebar();
                        fetchPOCList();
                    }  else {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text('Unable to save at the moment!');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }
                }
            });


        })

        $(document).on('click', '.poc_page_link', function () {
            var not_found = true;

            current_active_page = parseFloat($(this).attr('name'));
            not_found = false;


            if (!not_found) {
                $('.list_view_div').empty();
                $('.grid_view_div').empty();
                all_pocs[current_active_page].map(function (element) {
                    $('.list_view_div').append(`<div class="Product-row ${element['status'] == 'deactive' ? '_deactive-cus' : ''}">
                    <div class="row">
                        <div class="col colStyle" style="max-width:255px">
                            <div style="display:table; margin-top:-5px; margin-bottom:-5px">
                                <div class="_emp-D"><img src="${element['profile_image'] ? base_url+element['profile_image'] : '/images/avatar.svg'}" alt=""></div>
                                <div class="textMiddle">${element['first_name'] + ' ' + element['last_name']}</div>
                            </div>
                        </div>
                        <div class="col colStyle" style="max-width:180px">
                            <div class="pt-5"> ${element['contact_cellphone']}</div>
                        </div>
                        <div class="col colStyle" style="max-width:200px">
                            <div class="pt-5"> ${element['email']}</div>
                        </div>
                        <div class="col colStyle" style="max-width:300px">
                            <div class="pt-5"> ${element['company_name'] ? element['company_name'] : element['employment_status']=='1' ? "Freelance" : "NA"}</div>
                        </div>
                        <div class="col colStyle" style="max-width:195px">
                            <button
                                class="btn cusDetail openSideBarToUpdatePoc" id="${element['id']}">Edit
                            </button>
                        </div>
                
                    </div>
                </div>`);

                    $('.grid_view_div').append(`<div class="col-lg-3 col-md-4">
                    <div class="_product-card ${element['status'] == 'deactive' ? '_deactive-cus' : ''}"> 
                        <div class="con_info pt-0 _EMP-pr">
                            <img src="${element['profile_image'] ? base_url+element['profile_image'] : '/images/avatar.svg'}" alt="">
                            <h2>${element['first_name'] + ' ' + element['last_name']}</h2>
                            <p><i class="fa fa-phone-square"></i> ${element['contact_cellphone']}</p>
                            <p><i class="fa fa-envelope"></i> ${element['email']}</p>
                            <p><i class="fa fa-building"></i>${element['company_name'] ? element['company_name'] : element['employment_status']=='1' ? "Freelance" : "NA"}</p>
                            <div class="PT-5">
                                <button id="${element['id']}" class="btn cusDetail-th openSideBarToUpdatePoc">Edit</button>
                            </div>
                            <div class="CountryName">${element['city']}</div>
                        </div>
                    </div>
                </div>`);
                });
            }

        })
        $(document).on('click', '.openSideBarToUpdatePoc', function () {
            $('.all_countries').empty();
            $('#genders').empty();
            $('#contact_type').empty();
            $('.all_countries').empty();
            $('.all_states').empty();
            $('.all_cities').empty();
            $('.all_postal_codes').empty();
            $('.operation').val('update');
            lastOp = 'update';
            $('#dataSidebarLoader').show();
            $('._cl-bottom').hide();
            $('.pc-cartlist').hide();

            $('.dropifyImgDiv').empty();
            $('.dropifyImgDiv').append('<input type="file" name="profile_pic" id="profile_pic" class="dropify" />');

            $('.cardFrontDiv').empty();
            $('.cardFrontDiv').append('<input type="file" name="card_front" id="card_front" class="dropify" />');

            $('.cardBackDiv').empty();
            $('.cardBackDiv').append('<input type="file" name="card_back" id="card_back" class="dropify" />');

            var id = $(this).attr('id');
            $('.poc_update_id').val(id);
            $.ajax({
                type: 'GET',
                url: '/get_selected_POC/' + id,
                success: function (response) {
                    var response = JSON.parse(response);
                    
                    $('#dataSidebarLoader').hide();
                    $('.pc-cartlist').show();
                    $('._cl-bottom').show();
                    //console.log(response.poc);
                    
                    $('input[name="first_name"]').focus();
                    $('input[name="first_name"]').val(response.poc.first_name);
                    $('input[name="first_name"]').blur();

                    $('input[name="middle_name"]').focus();
                    $('input[name="middle_name"]').val(response.poc.middle_name);
                    $('input[name="middle_name"]').blur();

                    $('input[name="last_name"]').focus();
                    $('input[name="last_name"]').val(response.poc.last_name);
                    $('input[name="last_name"]').blur();

                    // $('input[name="dob"]').focus();x
                    $('input[name="dob"]').val(response.poc.dob);
                    // $('input[name="dob"]').blur();
                    
                    $('select[name="employment_status"]').val(response.poc.employment_status).trigger('change');

                    $('input[name="official_email"]').focus();
                    $('input[name="official_email"]').val(response.poc.official_email);
                    $('input[name="official_email"]').blur();

                    $('input[name="personal_email"]').focus();
                    $('input[name="personal_email"]').val(response.poc.email);
                    $('input[name="personal_email"]').blur();

                    $('input[name="contact_cellphone"]').focus();
                    $('input[name="contact_cellphone"]').val(response.poc.contact_cellphone);
                    $('input[name="contact_cellphone"]').blur();

                    $('input[name="office_no"]').focus();
                    $('input[name="office_no"]').val(response.poc.office_no);
                    $('input[name="office_no"]').blur();

                    $('input[name="business_address"]').focus();
                    $('input[name="business_address"]').val(response.poc.business_address);
                    $('input[name="business_address"]').blur();

                    $('select[name="customer_id"]').val(response.poc.agency_id).trigger('change');

                    multiple_phone_nums = [];
                    $('.phone_nums_div').empty();

                    if (response.poc_econtact) {
                        response.poc_econtact.forEach(element => { 
                            $('.phone_nums_div').append(` <div class="col-md-6">
                                <div class="form-group phone-SL">
                                    <div class="col-auto p-0">
                                        <select class="custom-select custom-select-sm phone_type">
                                            <option selected disabled value="-1">Type</option>
                                            <option value="Cell Phone" ${element.econtact_type == "Cell Phone" ? 'selected' : ''} data-id="${element.id}">Cell Phone</option>
                                            <option value="Landline" ${element.econtact_type == "Landline" ? 'selected' : ''} data-id="${element.id}">Landline</option>
                                            <option value="Office" ${element.econtact_type == "Office" ? 'selected' : ''} data-id="${element.id}">Office</option>
                                        </select>
                                        <input hidden class="econtact_id" name="econtact_id" value="${element.id}" type="text" />
                                    </div>
                                    <div class="col p-0">
                                        <a type="button" class="closeBTN del_econtact" style="color:white !important;cursor:pointer" id=${element.id}><i class="fa fa-times"></i></a>
                                        <input class="phoneinput poc_phone_number" value="${element.contact_value}" type="text" placeholder="0000000000">
                                    </div>
                                </div>
                            </div>`);
                        });
                    }
                    ///Agency show if employe status is employed
                    $('.employement_status').change(function(){
                        var status_id = $(this).val();
                        if(status_id == 1){
                            $('.agency_id').hide();
                            $('.agency_select').removeClass('required');
                            $('select[name="customer_id"]').val('-1').trigger('change');
                        }else{
                            $('.agency_id').show();
                            $('.agency_select').addClass('required');
                        }
                    })
                    $.ajax({
                        url:`/get-contact-types`,
                        success: function (responsecontact) {
                            $('#contact_type').append(`<option value="-1" selected disabled>Select Contact Type</option>`);
                            responsecontact.forEach((element) => {
                                $('#contact_type').append(`<option value="${element['id']}" ${response.poc.contact_type == element.id ? 'selected' : ''} >${element['contact_name']}</option>`);
                            })
                        },
                        error: function (e) {
                            alert('error in fetching get Contact Types')
                        }
                    });
                    $.ajax({
                        url:`/get-genders`,
                        success: function (responsegender) {
                            $('#genders').append(`<option value="-1" selected disabled>Select Gender</option>`);
                            responsegender.forEach((element) => {
                                $('#genders').append(`<option value="${element['id']}" ${response.poc.gender_id == element.id ? 'selected' : ''} >${element['gender_name']}</option>`);
                            })
                        },
                        error: function (e) {
                            alert('error in fetching get Genders')
                        }
                    });
                    //Get Selected Countries
                    $.ajax({
                        url:`/get-countries`,
                        success: function (responsecountry) {
                            $('.all_countries').append(`<option value="-1" selected disabled>Select Country</option>`);
                            responsecountry.forEach((element) => {
                                $('.all_countries').append(`<option value="${element['id']}" ${response.poc.country_id == element.id ? 'selected' : ''} >${element['name']}</option>`);
                            })
                        },
                        error: function (e) {
                            alert('error in fetching get countries')
                        }
                    })
                    //End Get selected Countries

                    //Get Selected States Against Selected Country
                    $.ajax({
                        url: `/GetStatesagianstCountryforPostal/${response.poc.country_id}`,
                        success: function (query) {
                            $('.all_states').append(`<option value="-1" selected disabled>Select State</option>`);
                            query.forEach((element) => {
                                $('.all_states').append(`<option value="${element['id']}" ${response.poc.state_id == element.id ? 'selected' : ''} >${element['name']}</option>`);
                            })
                        },
                        error: function (e) {
                            alert('error in fetching States')
                        }
                    })
                    //End Get Selected States Against Selected Country

                    //Get Selected Cities Against Selected States
                    $.ajax({
                        url:`/GetCitiesagianstStatesforPostal/${response.poc.state_id}`,
                        success: function (querycitiespostal) {
                            $('.all_cities').append(`<option value="-1" selected disabled>Select City </option>`);
                            querycitiespostal.forEach((element) => {
                                $('.all_cities').append(`<option value="${element['id']}" ${response.poc.city_id == element.id ? 'selected' : ''} >${element['name']}</option>`);
                            })
                        },
                        error: function (e) {
                            alert('error in fetching Cities')
                        }
                    })
                    //End Get Selected Cities Against Selected States

                    //Get Selected Postal Code Against Selected States
                    $.ajax({
                        url:`/get-postal-code-against-cities/${response.poc.city_id}`,
                        success: function (data) {
                            $('.ss').append(`<option value="-1" selected disabled>Select Postal Codes </option>`);
                            data.postalcodes.forEach((element) => {
                                $('.all_postal_codes').append(`<option value="${element['postal_code']}" ${response.poc.postal_code == element.postal_code ? 'selected' : ''} >${element['postal_code']}</option>`);
                            })
                        },
                        error: function (e) {
                            alert('error in fetching Postal Code')
                        }
                    })
                    //End Get Selected Postal Code Against Selected States
                    var cardFront = response.base_url + response.poc.card_front;
                    if (cardFront) {
                        $('.ext_card_front').val(response.poc.card_front);
                        $.get(cardFront)
                            .done(function () {
                                $("#card_front").attr("data-height", '100px');
                                $("#card_front").attr("data-default-file", cardFront);
                                $('#card_front').dropify();
                            }).fail(function () {
                                $('#card_front').dropify();
                            })
                    } else {
                        $('.ext_card_front').val(null);
                        $('#card_front').dropify();
                    }

                    var card_back = response.base_url + response.poc.card_back;
                    if (card_back) {
                        $('.ext_card_back').val(response.poc.card_back);
                        $.get(card_back)
                            .done(function () {
                                $("#card_back").attr("data-height", '100px');
                                $("#card_back").attr("data-default-file", card_back);
                                $('#card_back').dropify();
                            }).fail(function () {
                                $('#card_back').dropify();
                            })
                    } else {
                        $('.ext_card_back').val(null);
                        $('#card_back').dropify();
                    }

                    var profile_pic = response.base_url + response.poc.profile_image;
                    if (profile_pic) {
                        $('.ext_profile').val(response.poc.profile_image);
                        $.get(profile_pic)
                            .done(function () {
                                $("#profile_pic").attr("data-height", '100px');
                                $("#profile_pic").attr("data-default-file", profile_pic);
                                $('#profile_pic').dropify();
                            }).fail(function () {
                                $('#profile_pic').dropify();
                            })
                    } else {
                        $('.ext_profile').val(null);
                        $('#profile_pic').dropify();
                    }


                    setTimeout(() => {
                        $('.address').focus();
                        $('.city').focus();
                        $('.code').focus();
                    }, 500);
                }
            });
            $('.agency_form').hide();
            $('.poc_form').show();
            $('.agency_form_div').removeClass("active");
            $('.poc_form_div').addClass("active");
            $(".overlay").addClass("active");
            $(".collapse.in").toggleClass("in");
            $("a[aria-expanded=true]").attr("aria-expanded", "false");
            $("body").toggleClass("no-scroll");
            $("#contentContainerDiv").addClass("blur-div");
            $(".sticky-footer").addClass("blur-div");
            $(".overlay-for-sidebar").css("display", "block");
            
            //openSidebar();
        })
        // Delete E-Number from Econtact Table
        $(document).on('click', '.del_econtact', function () {
            var id = $(this).attr('id');
            $('.confirm_delete').attr('id', id);
            deleteRef = $(this);
            $('#hidden_btn_to_open_modal').click();
        })
        $(document).on('click', '.confirm_delete', function () {
            var thisRef = $(this);
            deleteRef.attr('disabled', 'disabled');
            deleteRef.text('Processing...');
            var id = $(this).attr('id');
            $.ajax({
                type: 'POST',
                url: '/delete-econtact-number',
                data: {
                    _token: $('meta[name="csrf_token"]').attr('content'),
                    id: id
                },
                success: function (response) {
                    if (response.msg == 'success') {
                        deleteRef.parent().parent().parent().remove();
                        $('.cancel_delete_modal').click();
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Successfully Deleted.');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                        return;
                    }
                }
            });
        });
        //Open Modal
        $(document).on('click', '.change_status', function () {
            $('.modal_poc_name').text($(this).attr('name'));
            $(`input[name=radio_status][value='${$(this).text()}']`).prop("checked", true);
            $('.save_status').attr('id', $(this).attr('id'));
        });

        $(document).on('click', '.save_status', function () {
            var status = $('input[name="radio_status"]:checked').val();
            var thisRef = $(this);
            thisRef.attr('disabled', 'disabled');
            thisRef.text('Processing...');
            $.ajax({
                type: 'POST',
                url: '/changePOCStatus/' + thisRef.attr('id'),
                data: {
                    _token: $('input[name="_token"]').val(),
                    status: status,
                    current_action: current_action
                },
                success: function (response) {
                    thisRef.removeAttr('disabled');
                    thisRef.text('Save');
                    if (JSON.parse(response) == 'success') {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Saved Successfully');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                        if (current_action == 'customer') {
                            fetchCompaniesList();
                        } else {
                            fetchPOCList();
                        }
                        $('.close').click();
                    } else {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text('Unable to save at the moment');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }
                }
            });
        })
        //POC End





        $(document).on('click', '.add_another_cust_contact', function () {

            var type_faulty = [];
            var number_faulty = [];
            $('.cust_phone_type').each(function () {
                if ($(this).val() == '-1' || $(this).val() == null) {
                    type_faulty.push(false);
                } else {
                    type_faulty.push(true);
                }
            })

            if (jQuery.inArray(false, type_faulty) != -1) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Select Phone Type.');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }

            $('.cust_phone_number').each(function () {
                if ($(this).val() == '' || $(this).val() == null) {
                    number_faulty.push(false);
                } else {
                    number_faulty.push(true);
                }
            })

            if (jQuery.inArray(false, number_faulty) != -1) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Phone Number.');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }

            multiple_cust_phone_nums = [];
            $('.div_parent').each(function () {
                multiple_cust_phone_nums.push({
                    'type': $(this).find('.cust_phone_type').val(),
                    'number': $(this).find('.cust_phone_number').val(),
                    'phone_id': $(this).find('.econtact_id').val()
                });
            });

            $('.customer_phone_num_div').append(` <div class="col-md-6">
                <div class="form-group phone-SL div_parent">
                    <div class="col-auto p-0">
                        <select class="custom-select custom-select-sm cust_phone_type">
                            <option selected disabled value="-1">Type</option>
                            <option value="business">Business</option>
                            <option value="mobile">Mobile</option>
                            <option value="whatsapp">WhatsApp</option>
                        </select>
                    </div>
                    <div class="col p-0">
                        <a class="closeBTN remove_phone_num" style="color:white !important"><i class="fa fa-times"></i></a>
                        <input class="phoneinput cust_phone_number" type="text" placeholder="0000000000">
                    </div>
                </div>
            </div>`);
            // console.log(multiple_cust_phone_nums);
        })

        $(document).on('click', '#saveAgency', function () {
            $('.required_agency').css('border', '0px')
            $('.select2-container').css('border', '0px')
            if (idTaken) {
                return;
            }
            
            var emailReg        =   /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            var numberReg       =   /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
            var urlReg          =   /(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,63}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?/;
            // var lettersReg      =   /^[a-zA-Z ]*$/;
            var company_number  =   $('#company_number').val();
            var business_number =   $('#business_number').val();
            var email           =   $('#email').val();
            var url             =   $('#url').val();
            var company_name    =   $('#company_name').val();
            let dirty = false;
            $('.required_agency').each(function () {
                if (!$(this).val() || $(this).val() == 0) {
                    dirty = true;
                    if ($(this).hasClass('formselect') || $(this).hasClass('sd-type') ) {
                        $(this).parent().find('.select2-container').css('border', '0px solid red');
                    }else{
                        $(this).css('border', '0px solid red');
                    }   
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
            ///Verfiy URL Format
            // if (lettersReg.test(company_name)==false) {
            //     $('#notifDiv').fadeIn();
            //     $('#notifDiv').css('background', 'red');
            //     $('#notifDiv').text('Enter Correct Company Name');
            //     setTimeout(() => {
            //         $('#notifDiv').fadeOut();
            //     }, 3000);
            //     return;
            // } 
            ///Verfiy Company Number Format
            if (numberReg.test(company_number)==false) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Company Number');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            ///Verfiy Business Number Format
            if (numberReg.test(business_number)==false) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Business Number');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            ///Verfiy Email Format
            if (emailReg.test(email)==false) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Email');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            ///Verfiy URL Format
            if ( urlReg.test(url)==false) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct URL');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            } 
            $('#saveAgency').attr('disabled', 'disabled');
            $('#cancelAgency').attr('disabled', 'disabled');
            $('#saveAgency').text('Processing..');

            var ajaxUrl = "/Customer";

            if ($('#operation').val() !== "add") {
                ajaxUrl = "/Customer/" + $('input[name="product_updating_id"]').val();
            }
            $('#saveAgencyForm').ajaxSubmit({
                type: "POST",
                url: ajaxUrl,
                cache: false,
                data: {
                    // 'existing_ids': ($('#operation').val() !== "add" ? existing_array : ''),
                    // 'delete_able_ids': ($('#operation').val() !== "add" ? deleteable_arr : ''),
                    // multiple_cust_phone_nums: multiple_cust_phone_nums,
                    // cust_address_array: cust_address_array
                },
                success: function (response) {
                    $('#saveAgency').removeAttr('disabled');
                    $('#cancelAgency').removeAttr('disabled');
                    $('#saveAgency').text('Save');
                    if (response.msg == "already_exist") {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text('Agency Already Exist!');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }
                    if (JSON.parse(response).code == 200) {
                        if (action == 'CustomerProfile') {
                            fetchCompanyInfoForUpdate($('input[name="product_updating_id"]').val());
                        } else {
                            fetchCompaniesList();
                        }
                        if ($('#operation').val() == "update") {
                            closeSidebar();
                            $('.added_customer').text($('input[name="compName"]').val());
                            $('.save_poc_against_cust').attr('id', JSON.parse(response).customer_id);
                            $('.open_poc_modal').click();
                            $('#saveAgencyForm').find("input[type=text], textarea").val("");
                            $('#saveAgencyForm').find("select").val("0").trigger('change');
                            $('select[name="deliveryPorts"], select[name="documentTypes"]').val("").trigger('change');
                            $('.dropify-clear').click();
                            $('#notifDiv').fadeIn();
                            $('#notifDiv').css('background', 'green');
                            $('#notifDiv').text('Agency have been Updated successfully');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);
                        }else {
                            closeSidebar();
                            $('#notifDiv').fadeIn();
                            $('#notifDiv').css('background', 'green');
                            $('#notifDiv').text('Agency have been Added successfully');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);
                        }
                        callForDzReset = true;
                        myDropzone.removeAllFiles(true);
                        closeSidebar();
                    } else {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text('Failed to add Agency at the moment');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }
                }
            });

        });

        $(document).on('click', '.save_poc_against_cust', function () {
            var thisRef = $(this);
            if ($('.already_added_poc_for_customer').val() == '0' || $('.already_added_poc_for_customer').val() == null) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please Select POC first!');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            thisRef.attr('disabled', 'disabled');
            thisRef.text('Processing...');
            $.ajax({
                type: 'POST',
                url: '/savePOCAgainstCust/' + thisRef.attr('id'),
                data: {
                    _token: $('input[name="_token"]').val(),
                    poc_id: $('.already_added_poc_for_customer').val()
                },
                success: function (response) {
                    thisRef.removeAttr('disabled');
                    thisRef.text('Save');
                    if (JSON.parse(response) == 'success') {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Saved Successfully');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                        fetchCompaniesList();
                        $('.close').click();
                    } else {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text('Unable to save at the moment');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }
                }
            });
        });

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
                        <div class="col colStyle" style="max-width:343px">
                            <div style="display:table; margin-top: -5px; margin-bottom:-5px;">
                                <div class="_emp-D"><img
                                        src="${element['picture'] ? response.base_url+element['picture'] : '/images/company-icon.svg'}"
                                        alt=""></div>
                                <div class="textMiddle">${element['company_name'] ? element['company_name'] : 'NA'}</div>
                            </div>
                        </div>
                        <div class="col colStyle" style="max-width:220px">
                            <div class="pt-5">${element['country']}</div>
                        </div>
                        <div class="col colStyle" style="max-width:190px">
                            <div class="pt-5">${element['agency_email'] ? element['agency_email'] : 'NA'}</div>
                        </div>
                        <div class="col colStyle" style="max-width:195px">
                            <div class="pt-5">${element['agency_business_phone'] ? element['agency_business_phone'] : 'NA'}</div>
                        </div>
                        <div class="col colStyle" style="max-width:195px">
                            <div class="pt-5">${element['business_type']=='1' ? "Real Estate Agency"  : (element['business_type']=='2' ? "Mortgage Broker"  :  (element['business_type']=='3' ? "Lender"  : (element['business_type']=='4' ? "Bank"  : "NA")))}</div>
                        </div>
                        <div class="col colStyle" style="max-width:180px">
                           
                            <a style="color: white" id="${element['id']}" class="btn cusDetail openDataSidebarForUpdateAgency">Edit</a>
                        </div>
                    </div>
                </div>`);

                    $('.cust_grid_div').append(`<div class="col-lg-3 col-md-4">
                    <div class="_product-card">
                        <h2>${element['company_name'] ? element['company_name'] : 'NA'}</h2> 
                        <div class="con_info pt-0 PB-20">
                            <p><i class="fa fa-phone-square"></i>${element['agency_business_phone'] ? element['agency_business_phone']: 'NA'}</p>
                            <p><i class="fa fa-envelope"></i>${(element['agency_email'] ? element['agency_email'] : 'NA')}</p>
                            <p><i class="fa fa-globe"></i>${element['country']}</p>
                    
                            <div class="PT-20">
                                
                                <a style="color: white" id="${element['id']}" class="btn cusDetail-th openDataSidebarForUpdateAgency">Edit</a>
                            </div>
                
                            <div class="CountryName">${element['city']}</div>
                        </div>
                
                    </div>
                </div>`);
                });
            }
        })
        //Customer End 

        //Dynamic Search And Filter
        $(document).on('input', '.dynamic_search', function () {
            current_action  =   $(this).attr('data-current_action');
            if ($(this).val().length > 0) {
                rendersearch($(this).val().toLowerCase(), $('.dynamic_filter').val());
            }
            if ($(this).val() == '') {
                rendersearch($(this).val().toLowerCase(), $('.dynamic_filter').val());
            }
        })

        $(document).on('change', '.dynamic_filter', function () {
            current_action  =   $(this).attr('data-current_action');
            rendersearch($('.dynamic_search').val().toLowerCase(), $(this).val());
        })

    });

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    function fetchCompanyInfoForUpdate(id) {
        $.ajax({
            type: 'GET',
            url: '/Customer/' + id,
            success: function (response) {
                var response = JSON.parse(response);
                $('.nam-title').text(response.info.company_name);
                $('.con_info strong').remove();
                $('.con_info p:eq(0)').append('<strong>' + (response.info.first_name + " " + response.info.last_name) + '</strong>');
                $('.con_info p:eq(1)').append('<strong>' + response.info.business_phone + '</strong>');
                $('.con_info p:eq(2)').append('<strong>' + (response.info.city ? response.info.city : "NA") + '</strong>');
                $('.con_info p:eq(3)').append('<strong>' + (response.info.country).toUpperCase() + '</strong>');

                // $('._cut-img img').attr('src', '/storage/company/' + response.info.picture);

                $('#tblLoader').hide();
                $('#contentDiv').fadeIn();
                $('#contentDiv').find('table').css('width', '100%');
            }
        });
    }

    function fetchCompaniesList() {
        var random_string = makeid(50);
        allCustomersList = [];
        $('.dynamic_search').val('');
         $('.dynamic_filter').val(0).trigger('change');
        if ($('.dynamic_filter').val() != '0') {
            $('.dynamic_filter').val(0).trigger('change');
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
                url: '/GetCustomersList',
                data: {
                    random_string: random_string
                },
                success: function (response) {
                    $('.data_div').empty();
                    $('.data_div').show();
                    $('.tblLoader').hide();
                    var response = JSON.parse(response);
                    $('.select_type_for_bulk').empty();
                    $('.select_acquisition_for_bulk').empty();
                    $('.select_type_for_bulk').append('<option value="0" selected disabled>Select Type*</option>');
                    $('.select_acquisition_for_bulk').append('<option value="0" selected disabled>Select Acquisition Source*</option>');
                    allCustomersList = response.customer;
                    $('.doc_key').val(random_string);
                    $('.operation_docs').val(random_string);

                    total_customers = response.customer.length;
                    $('.count_customers').text(total_customers);
                    var recsPerPage = 12;
                    total_cust_pages = Math.ceil(total_customers / recsPerPage);
                    var offset = 0;
                    var pageNo = 0;
                    var current_records = 0;
                    var array_items_count = 0;
                    var total_indexes = 0;

                    fetchPagination(total_cust_pages, current_records, 'customer');
                    $('.pagination_cust').append(`<li name="-1" class="page-item customer_page_link disabled previous"><a class="page-link" tabindex="-1">Previous</a></li>`);
                    var i;
                    for (i = 1; i <= total_cust_pages; i++) {
                      
                        $('.pagination_cust').append(`<li name="${i}" class="page-item customer_page_link ${i <= 1 ? 'active' : ''}"><a class="page-link">${i}</a></li>`);
                        all_cust.push({})
                    }
                    $('.pagination_cust').append('<li class="page-item customer_page_link next" name="+1"><a class="page-link">Next</a></li>');
                    //cust_base_url = response.base_url;
                    var test = [];
                    response.customer.forEach(element => {
                        current_records++;
                        array_items_count++;
                        if (current_records <= 12) {
                            $('.cust_list_div').append(`<div class="Product-row " >
                            <div class="row">
                                <div class="col colStyle" style="max-width:343px">
                                    <div style="display:table; margin-top: -5px; margin-bottom:-5px;">
                                        <div class="_emp-D"><img
                                                src="${element['picture'] ? response.base_url+element['picture'] : '/images/company-icon.svg'}"
                                                alt=""></div>
                                        <div class="textMiddle">${element['company_name'] ? element['company_name'] : 'NA'}</div>
                                    </div>
                                </div>
                                <div class="col colStyle" style="max-width:220px">
                                    <div class="pt-5">${element['country']}</div>
                                </div>
                                <div class="col colStyle" style="max-width:190px">
                                    <div class="pt-5">${element['agency_email'] ? element['agency_email'] : 'NA'}</div>
                                </div>
                                <div class="col colStyle" style="max-width:195px">
                                    <div class="pt-5">${element['agency_business_phone'] ? element['agency_business_phone'] : 'NA'}</div>
                                </div>
                                <div class="col colStyle" style="max-width:195px">
                                    <div class="pt-5">${element['business_type']=='1' ? "Real Estate Agency"  : (element['business_type']=='2' ? "Mortgage Broker"  :  (element['business_type']=='3' ? "Lender"  : (element['business_type']=='4' ? "Bank"  : "NA")))}</div>
                                </div>
                                <div class="col colStyle" style="max-width:180px">
                                   
                                    <a style="color: white" id="${element['id']}" class="btn cusDetail openDataSidebarForUpdateAgency">Edit</a>
                                </div>
                            </div>
                        </div>`);

                            $('.cust_grid_div').append(` <div class="col-lg-3 col-md-4">
                            <div class="_product-card ">
                                <h2>${element['company_name'] ? element['company_name'] : 'NA'}</h2> 
                                <div class="con_info pt-0 PB-20">
                                    <p><i class="fa fa-phone-square"></i>${element['agency_business_phone'] ? element['agency_business_phone']: 'NA'}</p>
                                    <p><i class="fa fa-envelope"></i>${(element['agency_email'] ? element['agency_email'] : 'NA')}</p>
                                    <p><i class="fa fa-globe"></i>${element['country']}</p>
                        
                                    <div class="PT-20">
                                        
                                        <a style="color: white" id="${element['id']}" class="btn cusDetail-th openDataSidebarForUpdateAgency">Edit</a>
                                    </div>
                        
                                    <div class="CountryName">${element['city']}</div>
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

    function capitalize(s) {
        return s.toLowerCase().replace(/\b./g, function (a) {
            return a.toUpperCase();
        });
    };

    function fetchDocumentTypeList() {
        $.ajax({
            type: 'GET',
            url: '/GetDocumentTypeList',
            success: function (response) {
                $('.body_document').empty();
                $('.body_document').append('<table class="table table-hover dt-responsive nowrap" id="DocumentTypeListTable" style="width:100%;"><thead><tr><th>ID</th><th>Document Name</th><th>Action</th></tr></thead><tbody></tbody></table>');
                $('#DocumentTypeListTable tbody').empty();
                var response = JSON.parse(response);
                response.forEach(element => {
                    $('#DocumentTypeListTable tbody').append('<tr><td>' + element['id'] + '</td><td>' + element['document_name'] + '</td><td><button id="' + element['id'] + '" class="btn btn-default btn-line openDataSidebarForUpdateDocumentType">Edit</button><button type="button" id="' + element['id'] + '" class="btn btn-default red-bg deleteDocumentType" name="doc_type" title="Delete">Delete</button></td></tr>');
                });
                $('#tblLoader').hide();
                $('.body_document').fadeIn();
                $('#DocumentTypeListTable').DataTable();
            }
        });
    }

    function cust_dropdowns_forModal() {
        $('select[name="parentCompnayModal"]').empty();
        $('select[name="typeFromModal"]').empty();
        $('select[name="documentTypesModal"]').empty();
        $('select[name="deliveryPortsModal"]').empty();

        $('select[name="parentCompnayModal"]').append(`<option value="0" selected disabled>Select Parent Company</option>`);
        $('select[name="typeFromModal"]').append(`<option value="0" selected disabled>Select Customer Type</option>`);

        JSON.parse($('#hidden_comp_name').val()).forEach(element => {
            $('select[name="parentCompnayModal"]').append(`<option value="${element['id']}">${element['company_name']}</option>`);
        });
        JSON.parse($('#hidden_cust_type').val()).forEach(element => {
            $('select[name="typeFromModal"]').append(`<option value="${element['id']}">${element['type_name']}</option>`);
        });
        JSON.parse($('#hidden_doc_type').val()).forEach(element => {
            $('select[name="documentTypesModal"]').append(`<option value="${element['id']}">${element['document_name']}</option>`);
        });
        JSON.parse($('#hidden_del_port').val()).forEach(element => {
            $('select[name="deliveryPortsModal"]').append(`<option value="${element['id']}">${element['port_name'] + (element['port_code'])}</option>`);
        });

        $('select[name="parentCompnayModal"]').select2({
            dropdownParent: $('#bulkUploadModal')
        });
        $('select[name="typeFromModal"]').select2({
            dropdownParent: $('#bulkUploadModal')
        });
        $('select[name="documentTypesModal"]').select2({
            dropdownParent: $('#bulkUploadModal')
        });
        $('select[name="deliveryPortsModal"]').select2({
            dropdownParent: $('#bulkUploadModal')
        });
        $('select[name="acqSourceModal"]').select2({
            dropdownParent: $('#bulkUploadModal')
        });
        $('select[name="countryModal"]').select2({
            dropdownParent: $('#bulkUploadModal')
        });
    }

    function fetchSearchResult(str) {

        $('.data_div').empty();
        $('.data_div').show();
        $('#tblLoader').hide();
        if (str == '') {
            searchArray = allCustomersList;
        } else {
            searchArray = allCustomersList.filter(function (x) {
                return (x.company_name ? x.company_name.toLowerCase().includes(str) : '') || (x.first_name ? x.first_name.toLowerCase().includes(str) : '') || (x.last_name ? x.last_name.toLowerCase().includes(str) : '') || (x.country ? x.country.toLowerCase().includes(str) : '') || (x.business_phone ? x.business_phone.toLowerCase().includes(str) : '') || (x.whatsapp_phone ? x.whatsapp_phone.toLowerCase().includes(str) : '') || (x.mobile_phone ? x.mobile_phone.toLowerCase().includes(str) : '') || (x.email ? x.email.toLowerCase().includes(str) : '');
            });
        }
        searchArray.forEach(element => {
            $('.data_div').append(`<div class="col-lg-3 col-md-4">  <div class="_customerP-card ${element['is_active'] == 1 ? '' : '_deactive-cus active_deactive_btn'}" ${element['is_active'] == 1 ? '' : `data-toggle="modal" data-target="#active_deactive" id="${element.id}" name="${element.company_name}" activation="${element.is_active}"`}><h2>${element.company_name}</h2><div class="con_info pt-0"><p><i class="fa fa-user"> </i> ${element.first_name + " " + (element['last_name'] ? element['last_name'] : '')}</p><p><i class="fa fa-phone-square"> </i> ${element.phone}</p><p><i class="fa fa-envelope"></i> ${(element.email ? element.email : '')}</p><p><i class="fa fa-globe"> </i> ${element.country}</p><a href="/Correspondence/create/${element.id}" class="btn-primary">Details</a><button id="${element.id}" class="btn-primary btn-line openDataSidebarForUpdateAgency">Edit</button><button class="btn-primary btn-line active_deactive_btn" id="${element.id}" name="${element.company_name}" activation="${element.is_active}" ${element['is_active'] == 1 ? `data-toggle="modal" data-target="#active_deactive"` : ''}><i class="fa fa-circle"></i> ${element['is_active'] == 1 ? 'Active' : 'Deactive'}</button><div class="CountryName">Pakistan</div></div></div></div>`);
        });
        trigger_customer_filter($('#select_customer_filter').val());
    }

    function fetchAcquisitionList() {
        $.ajax({
            type: 'GET',
            url: '/GetAcquisitionTypeList',
            success: function (response) {
                $('.body').empty();
                $('.body').append('<table class="table table-hover dt-responsive nowrap AcquisitionTypeListTable" style="width:100%;"><thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Action</th></tr></thead><tbody></tbody></table>');
                $('.AcquisitionTypeListTable tbody').empty();
                var response = JSON.parse(response);
                response.forEach(element => {
                    $('.AcquisitionTypeListTable tbody').append(`<tr><td>${element['id']}</td><td>${element['name']}</td><td>${element['type'] ? element['type'] : ''}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateAcquisition">Edit</button><button type="button" id="${element['id']}" class="btn btn-default red-bg deleteAcquisition" name="acquistion" title="Delete">Delete</button></td></tr>`);
                });
                $('#LoaderAcquisitionSource').hide();
                $('.body').fadeIn();
                $('.AcquisitionTypeListTable').DataTable();
            }
        });
    }

    function fetchAllItems() {
        $('#tblLoader').fadeIn();
        $('.body').hide();
        $.ajax({
            type: 'GET',
            url: '/FetchAllItems',
            success: function (response) {
                allItems = JSON.parse(response);
            }
        });
    }

    function fetchCustomerSampling() {
        $('#tblLoader').fadeIn();
        $('.body').hide();
        $.ajax({
            type: 'GET',
            url: '/fetchCustomerSampling',
            success: function (response) {
                var response = JSON.parse(response);
                $('.body').empty();
                $('.body').append('<table class="table table-hover dt-responsive nowrap customerSampleTable" style="width:100%;"><thead><tr><th>Date</th><th>Customer</th><th>Total Samples</th><th>Action</th></tr></thead><tbody></tbody></table>');
                $('.customerSampleTable tbody').empty();
                response.forEach(element => {
                    $('.customerSampleTable tbody').append(`<tr><td>${element['date']}</td><td>${element['customer_name'] ? element['customer_name'] : 'NA'}</td><td>${element['total_samples']}</td><td><button id="${element['date']+'/'+element['customer_id']}" class="btn btn-default btn-line view_sample" data-toggle="modal" data-target=".display_sampling">View Samples</button></td></tr>`);
                });
                $('#tblLoader').hide();
                $('.body').fadeIn();
                $('.customerSampleTable').DataTable();
            }
        });
    }

    function fetchQuotePrices() {
        $('#tblLoader').fadeIn();
        $('.body').hide();
        $.ajax({
            type: 'GET',
            url: '/fetchQuotePrices',
            success: function (response) {
                var response = JSON.parse(response);
                $('.body').empty();
                $('.body').append('<table class="table table-hover dt-responsive nowrap customerSampleTable" style="width:100%;"><thead><tr><th>Date</th><th>Customer</th><th>Total Quotations</th><th>Action</th></tr></thead><tbody></tbody></table>');
                $('.customerSampleTable tbody').empty();
                response.forEach(element => {
                    $('.customerSampleTable tbody').append(`<tr><td>${element['date']}</td><td>${element['customer_name'] ? element['customer_name'] : 'NA'}</td><td>${element['total_quotations']}</td><td><button id="${element['date']+'/'+element['customer_id']}" class="btn btn-default btn-line view_quote" data-toggle="modal" data-target=".display_quotations">View Quote</button></td></tr>`);
                });
                $('#tblLoader').hide();
                $('.body').fadeIn();
                $('.customerSampleTable').DataTable();
            }
        });
    }

    function trigger_customer_filter(filter) {
        $('.data_div').empty();
        $('.data_div').show();
        $('#tblLoader').hide();
        if (filter == 0 && $('#search_custmers').val() == '') {
            filter_array = allCustomersList;
        } else if (filter == 0 && $('#search_custmers').val() != '') {
            filter_array = searchArray;
        } else if (filter == 'deactive') {
            if ($('#search_custmers').val().length > 2) {
                filter_array = searchArray.filter(function (x) {
                    return x.is_active == 0;
                });
            } else {
                filter_array = allCustomersList.filter(function (x) {
                    return x.is_active == 0;
                });
            }
        } else if (filter == 'active') {
            if ($('#search_custmers').val().length > 2) {
                filter_array = searchArray.filter(function (x) {
                    return x.is_active == 1;
                });
            } else {
                filter_array = allCustomersList.filter(function (x) {
                    return x.is_active == 1;
                });
            }
        } else {
            if ($('#search_custmers').val().length > 2) {
                filter_array = searchArray.filter(function (x) {
                    return x.life_cycle_stage.toLowerCase() == filter;
                });
            } else {
                filter_array = allCustomersList.filter(function (x) {
                    return x.life_cycle_stage.toLowerCase() == filter;
                });
            }

        }
        filter_array.forEach(element => {
            $('.data_div').append(`<div class="col-lg-3 col-md-4">  <div class="_customerP-card ${element['is_active'] == 1 ? '' : '_deactive-cus active_deactive_btn'}" ${element['is_active'] == 1 ? '' : `data-toggle="modal" data-target="#active_deactive" id="${element.id}" name="${element.company_name}" activation="${element.is_active}"`}> <h2>${element.company_name}</h2><div class="con_info pt-0"><p><i class="fa fa-user"> </i> ${element.first_name + " " + (element['last_name'] ? element['last_name'] : '')}</p><p><i class="fa fa-phone-square"> </i> ${element.phone}</p><p><i class="fa fa-envelope"></i> ${(element.email ? element.email : '')}</p><p><i class="fa fa-globe"> </i> ${element.country}</p><a href="/Correspondence/create/${element.id}" class="btn-primary">Details</a><button id="${element.id}" class="btn-primary btn-line openDataSidebarForUpdateAgency">Edit</button><button class="btn-primary btn-line active_deactive_btn" id="${element.id}" name="${element.company_name}" activation="${element.is_active}" ${element['is_active'] == 1 ? `data-toggle="modal" data-target="#active_deactive"` : ''}><i class="fa fa-circle"></i> ${element['is_active'] == 1 ? 'Active' : 'Deactive'}</button><div class="CountryName">Pakistan</div></div></div></div>`);
        });
    }

    function fetchPOCList() {
        $('.tblLoader').fadeIn();
        $('.list_view_div').empty();
        $('.grid_view_div').empty();
        $('.cust_list_div').empty();
        $('.cust_grid_div').empty();
        $('.search_poc').val('');
        $('.poc_type_filter').val(0).trigger('change');

        $('.pagination_poc').empty();
        $.ajax({
            type: 'GET',
            url: '/fetchCustomersPOC',
            success: function (response) {
                var response = JSON.parse(response);
                //debugger
                $('.list_view_div').empty();

                AllPOCArray = response.poc;
                total_records = response.poc.length;
                $('.count_poc').text(total_records);
                var recsPerPage = 12;
                totalPages = Math.ceil(total_records / recsPerPage);
                offset = 0;
                var pageNo = 0;
                var current_records = 0;
                var array_items_count = 0;
                var total_indexes = 0;

                fetchPagination(totalPages, current_records, 'poc');
                // $('.pagination_poc').append(`<li name="-1" class="page-item poc_page_link disabled previous"><a class="page-link" tabindex="-1">Previous</a></li>`);
                // var i;
                // for (i = 1; i <= totalPages; i++) {
                //     $('.pagination_poc').append(`<li name="${i}" class="page-item poc_page_link ${i <= 1 ? 'active' : ''}"><a class="page-link">${i}</a></li>`);
                //     all_pocs.push({})
                // }
                // $('.pagination_poc').append('<li class="page-item poc_page_link next" name="+1"><a class="page-link">Next</a></li>');

                base_url = response.base_url;
                var test = [];
                response.poc.forEach(element => {
                    current_records++;
                    array_items_count++;
                    if (current_records <= 12) {
                        $('.list_view_div').append(`<div class="Product-row ">
                        <div class="row">
                            <div class="col colStyle" style="max-width:255px">
                                <div style="display:table; margin-top:-5px; margin-bottom:-5px">
                                    <div class="_emp-D"><img src="/images/avatar.svg" alt=""></div>
                                    <div class="textMiddle">${element['first_name'] + ' ' + element['last_name']}</div>
                                </div>
                            </div>
                            <div class="col colStyle" style="max-width:180px">
                                <div class="pt-5"> ${element['contact_cellphone']}</div>
                            </div>
                            <div class="col colStyle" style="max-width:200px">
                                <div class="pt-5"> ${element['email']}</div>
                            </div>
                            <div class="col colStyle" style="max-width:300px">
                                <div class="pt-5"> ${element['company_name'] ? element['company_name'] : element['employment_status']=='1' ? "Freelance" : "NA"}</div>
                            </div>
                            <div class="col colStyle" style="max-width:195px">
                            <button
                                    class="btn cusDetail openSideBarToUpdatePoc" id="${element['id']}" data-country-ids>Edit
                            </button>
                            </div>
                    
                        </div>
                    </div>`);

                        $('.grid_view_div').append(`<div class="col-lg-3 col-md-4">
                        <div class="_product-card"> 
                            <div class="con_info pt-0 _EMP-pr">
                                <img src="${element['profile_image'] ? base_url+element['profile_image'] : '/images/avatar.svg'}" alt="">
                                <h2>${element['first_name'] + ' ' + element['last_name']}</h2>
                                <p><i class="fa fa-phone-square"></i> ${element['contact_cellphone']}</p>
                                <p><i class="fa fa-envelope"></i> ${element['email']}</p>
                                <p><i class="fa fa-building"></i>${element['company_name'] ? element['company_name'] : element['employment_status']=='1' ? "Freelance" : "NA"}</p>
                                <div class="PT-5">
                                    <button id="${element['id']}" class="btn cusDetail-th openSideBarToUpdatePoc">Edit</button>
                                </div>
                                <div class="CountryName">${element['city']}</div>
                            </div>
                        </div>
                    </div>`);
                    }
                    test.push(element);
                    all_pocs[total_indexes] = test;
                    if (array_items_count == 12) {
                        array_items_count = 0;
                        test = [];
                        total_indexes++;
                    }
                });
                $('.tblLoader').hide();
            }
        });
    }

    function rendersearch(search = null, type = null) {

        if (current_action == 'customer') {
            $('.cust_list_div').empty();
            $('.cust_grid_div').empty();
            $('.list_view_div').empty();
            $('.grid_view_div').empty();
            $('.pagination_cust').empty();


            if (search == '') {
                searchArray = allCustomersList;
            } else {
                searchArray = allCustomersList.filter(function (x) {
                    return (x.company_name ? x.company_name.toLowerCase().includes(search) : '') || (x.agency_email ? x.agency_email.toLowerCase().includes(search) : '') || (x.first_name ? x.first_name.toLowerCase().includes(search) : '') || (x.company_id ? x.company_id.toLowerCase().includes(search) : '') || (x.life_cycle_stage ? x.life_cycle_stage.toLowerCase().includes(search) : '');
                });
            }

            if (type == '1') {
                searchArray = searchArray.filter(function (x) {
                    return x.business_type == 1;
                });
            } else if (type == '2') {
                searchArray = searchArray.filter(function (x) {
                    return x.business_type == 2;
                });
            }else if (type == '3') {
                searchArray = searchArray.filter(function (x) {
                    return x.business_type == 3;
                });
            }else if (type == '4') {
                searchArray = searchArray.filter(function (x) {
                    return x.business_type == 4;
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
            fetchPagination(total_cust_pages, current_records, 'customer');
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
                    $('.cust_list_div').append(`<div class="Product-row ">
                    <div class="row">
                        <div class="col colStyle" style="max-width:385px">
                            <div style="display:table; margin-top: -5px; margin-bottom:-5px;">
                                <div class="_emp-D"><img
                                        src="${element['picture'] ? response.base_url+element['picture'] : '/images/company-icon.svg'}"
                                        alt=""></div>
                                <div class="textMiddle">${element['company_name'] ? element['company_name'] : 'NA'}</div>
                            </div>
                        </div>
                        <div class="col colStyle" style="max-width:220px">
                            <div class="pt-5">${element['country']}</div>
                        </div>
                        <div class="col colStyle" style="max-width:190px">
                            <div class="pt-5">${element['agency_email'] ? element['agency_email'] : 'NA'}</div>
                        </div>
                        <div class="col colStyle" style="max-width:190px">
                            <div class="pt-5">${element['agency_business_phone'] ? element['agency_business_phone'] : 'NA'}</div>
                        </div>
                        <div class="col colStyle" style="max-width:195px">
                            <div class="pt-5">${element['business_type']=='1' ? "Real Estate Agency"  : (element['business_type']=='2' ? "Mortgage Broker"  :  (element['business_type']=='3' ? "Lender"  : (element['business_type']=='4' ? "Bank"  : "NA")))}</div>
                        </div>
                        <div class="col colStyle" style="max-width:180px">
                           
                            <a style="color: white" id="${element['id']}" class="btn cusDetail openDataSidebarForUpdateAgency">Edit</a>
                        </div>
                    </div>
                </div>`);

                    $('.cust_grid_div').append(`<div class="col-lg-3 col-md-4">
                    <div class="_product-card ">
                        <h2>${element['company_name'] ? element['company_name'] : 'NA'}</h2> 
                        <div class="con_info pt-0 PB-20">
                            <p><i class="fa fa-phone-square"></i>${element['agency_business_phone'] ? element['agency_business_phone']: 'NA'}</p>
                            <p><i class="fa fa-envelope"></i>${(element['agency_email'] ? element['agency_email'] : 'NA')}</p>
                            <p><i class="fa fa-globe"></i>${element['country']}</p>
                
                            <div class="PT-20">
                                
                                <a style="color: white" id="${element['id']}" class="btn cusDetail-th openDataSidebarForUpdateAgency">Edit</a>
                            </div>
                
                            <div class="CountryName">${element['city']}</div>
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

        } else {
            $('.list_view_div').empty();
            $('.grid_view_div').empty();
            $('.cust_list_div').empty();
            $('.cust_grid_div').empty();
            $('.pagination_poc').empty();
            if (search == '') {
                searchArray = AllPOCArray;
            } else {
                searchArray = AllPOCArray.filter(function (x) {
                    return (x.first_name ? x.first_name.toLowerCase().includes(search) : '') || (x.last_name ? x.last_name.toLowerCase().includes(search) : '')   || (x.contact_cellphone ? x.contact_cellphone.toLowerCase().includes(search) : '') || (x.email ? x.email.toLowerCase().includes(search) : '') || (x.company_name ? x.company_name.toLowerCase().includes(search) : '');
                });
            }

            if (type == '1') {
                searchArray = searchArray.filter(function (x) {
                    return x.employment_status == 1;
                })
            }else if(type == '2') {
                searchArray = searchArray.filter(function (x) {
                    return x.employment_status == 2;
                });
            }

            var recsPerPage = 12;
            totalPages = Math.ceil(searchArray.length / recsPerPage);
            $('.count_poc').text(searchArray.length);
            offset = 0;
            var pageNo = 0;
            var current_records = 0;
            var array_items_count = 0;
            var total_indexes = 0;
            var test = [];
            fetchPagination(totalPages, current_records, 'poc');
            $('.pagination_poc').append(`<li name="-1" class="page-item poc_page_link disabled previous"><a class="page-link" tabindex="-1">Previous</a></li>`);
            var i;
            for (i = 1; i <= totalPages; i++) {
                $('.pagination_poc').append(`<li name="${i}" class="page-item poc_page_link ${i <= 1 ? 'active' : ''}"><a class="page-link">${i}</a></li>`);
                all_pocs.push({})
            }
            $('.pagination_poc').append('<li class="page-item poc_page_link next" name="+1"><a class="page-link">Next</a></li>');

            searchArray.forEach(element => {
                current_records++;
                array_items_count++;
                if (current_records <= 12) {
                    $('.list_view_div').append(`<div class="Product-row">
                    <div class="row">
                        <div class="col colStyle" style="max-width:255px">
                            <div style="display:table; margin-top:-5px; margin-bottom:-5px">
                                <div class="_emp-D"><img src="${element['profile_image'] ? response.base_url+element['profile_image'] : '/images/avatar.svg'}" alt=""></div>
                                <div class="textMiddle">${element['first_name'] + ' ' + element['last_name']}</div>
                            </div>
                        </div>
                        <div class="col colStyle" style="max-width:180px">
                                <div class="pt-5"> ${element['contact_cellphone']}</div>
                        </div>
                        <div class="col colStyle" style="max-width:200px">
                            <div class="pt-5"> ${element['email']}</div>
                        </div>
                        <div class="col colStyle" style="max-width:300px">
                            <div class="pt-5"> ${element['company_name'] ? element['company_name'] : element['employment_status']=='1' ? "Freelance" : "NA"}</div>
                        </div>
                        <div class="col colStyle" style="max-width:195px">
                            <button
                                class="btn cusDetail openSideBarToUpdatePoc" id="${element['id']}">Edit
                            </button>
                        </div>
                
                    </div>
                </div>`);

                    $('.grid_view_div').append(`<div class="col-lg-3 col-md-4">
                    <div class="_product-card"> 
                        <div class="con_info pt-0 _EMP-pr">
                            <img src="${element['profile_image'] ? base_url+element['profile_image'] : '/images/avatar.svg'}" alt="">
                            <h2>${element['first_name'] + ' ' + element['last_name']}</h2>
                            <p><i class="fa fa-phone-square"></i> ${element['contact_cellphone']}</p>
                            <p><i class="fa fa-envelope"></i> ${element['email']}</p>
                            <p><i class="fa fa-building"></i>${element['company_name'] ? element['company_name'] : element['employment_status']=='1' ? "Freelance" : "NA"}</p>
                            <div class="PT-5">
                                <button id="${element['id']}" class="btn cusDetail-th openSideBarToUpdatePoc">Edit</button>
                            </div>
                            <div class="CountryName">${element['city']}</div>
                        </div>
                    </div>
                </div>`);
                }


                test.push(element);
                all_pocs[total_indexes] = test;
                if (array_items_count == 12) {
                    array_items_count = 0;
                    test = [];
                    total_indexes++;
                }

            });
        }


    }


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



    var item = [];

    function fetchPagination(pageLen = null, curPage = null, type = null) {

        item = [];
        for (var i = 1; i <= pageLen; i++) {
            item.push(i);
        }
        render(pageLen, curPage, item, true, type);
    }

    function render(pageLen = null, curPage, item, first, type) {
        if (type == 'customer') {
            $('#cust_holder').empty();
        } else if (!type) {
            if (current_action == 'customer') {
                $('#cust_holder').empty();
            } else {
                $('#poc_holder').empty();
            }
        } else {
            $('#poc_holder').empty();
        }
        //debugger
        var html = '',
            separatorAdded = false;
        for (var i in item) {
            if (isPageInRange(curPage, i, pageLen, 2, 2)) {
                html += '<li class="' + (type == "customer" ? 'customer_page_link' : (!type ? (current_action == 'customer' ? 'customer_page_link' : 'poc_page_link') : 'poc_page_link')) + '" name="' + i + '" ' + (type == "customer" ? 'data-page' : (!type ? (current_action == 'customer' ? 'data-page' : 'data-page-poc') : 'data-page-poc')) + '="' + i + '">' + item[i] + '</li>';
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
        if (type == 'customer') {
            var holder = document.querySelector('#cust_holder');
            holder.innerHTML = html;
            document.querySelector('#cust_holder>li[data-page="' + curPage + '"]') ? document.querySelector('#cust_holder>li[data-page="' + curPage + '"]').classList.add('active') : '';
        } else if (!type) {
            if (current_action == 'customer') {
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
                if (!e.target.getAttribute((type == "customer" ? 'data-page' : 'data-page-poc'))) {
                    // no relevant item clicked (you could however offer expand here )
                    return;
                }
                curPage = parseInt(e.target.getAttribute((type == "customer" ? 'data-page' : 'data-page-poc')));
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