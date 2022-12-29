var segments = location.href.split('/');
var last_operation = 'add';
var opp_name = '';
var glob_type = '';
var deleteRef = '';
var settingData = [];

$(document).ready(function () {
    fetchAllData();

    $(document).on('click', '.openDataSidebarForAddingExchangeRate', function () {
        $('#dataSidebarLoader').hide();
        if (last_operation == 'update') {
            $('input[name="exchangeRate"]').val('');
            $('input[name="exchangeRate"]').blur();
        }
        $('#opp_name').text('Designation');
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').show();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        $('.relation_form_div').hide();
        $('.documentVerification_form_div').hide();
        openSidebar();
        last_operation = 'add';

        $('[name="date_from"], [name="date_till"]').datepicker({
            format: "yyyy-mm-dd",
            endDate: '+0d'
        });

        opp_name = 'exchange_rates';
        $('#operation').val('add');
        $('#opp_name_input').val('exchange_rates');
    });



    $(document).on('click', '.openDataSidebarForAddingDesignation', function () {
        $('#dataSidebarLoader').hide();
        if (last_operation == 'update') {
            $('input[name="designation_name"]').val('');
            $('input[name="designation_name"]').blur();

            $('.custom_checkbox').prop('checked', false);
        }
        $('#opp_name').text('Designation');
        $('.designation_form_div').show();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        $('.relation_form_div').hide();
        $('.documentVerification_form_div').hide();


        openSidebar();
        last_operation = 'add';
        opp_name = 'designation';
        $('#operation').val('add');
        $('#opp_name_input').val('designation');
    });

    $(document).on('click', '.openDataSidebarForAddingDepartment', function () {
        $('#dataSidebarLoader').hide();
        if (last_operation == 'update') {
            $('input[name="department_name"]').val('');
            $('input[name="department_name"]').blur();
        }
        $('#opp_name').text('Department');
        $('.designation_form_div').hide();
        $('.department_form_div').show();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        $('.relation_form_div').hide();
        $('.documentVerification_form_div').hide();

        openSidebar();
        last_operation = 'add';
        opp_name = 'department';
        $('#operation').val('add');
        $('#opp_name_input').val('department');
    });

    $(document).on('click', '.openDataSidebarForAddingAssets', function () {
        $('#dataSidebarLoader').hide();
        if (last_operation == 'update') {
            $('input[name="asset_name"]').val('');
            $('input[name="asset_name"]').blur();
        }
        $('#opp_name').text('Asset Type');
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').show();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        $('.relation_form_div').hide();
        $('.documentVerification_form_div').hide();

        openSidebar();
        last_operation = 'add';
        opp_name = 'assets';
        $('#operation').val('add');
        $('#opp_name_input').val('assets');
    });

    $(document).on('click', '.openDataSidebarForAddingCustType', function () {
        $('#dataSidebarLoader').hide();
        if (last_operation == 'update') {
            $('input[name="customer_type"]').val('');
            $('input[name="customer_type"]').blur();

            $('input[name="discount"]').val('');
            $('input[name="discount"]').blur();
        }
        $('#opp_name').text('Customer Type');
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').show();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        $('.relation_form_div').hide();
        $('.documentVerification_form_div').hide();

        openSidebar();
        last_operation = 'add';
        opp_name = 'cust_type';
        $('#operation').val('add');
        $('#opp_name_input').val('cust_type');
    });

    $(document).on('click', '.openDataSidebarForAddingCompanyInfo', function () {
        $('#dataSidebarLoader').hide();
        if (last_operation == 'update') {
            $('input[name="business_title"]').val('');
            $('input[name="business_title"]').blur();

            $('input[name="business_number"]').val('');
            $('input[name="business_number"]').blur();

            $('input[name="business_email"]').val('');
            $('input[name="business_email"]').blur();

            $('input[name="postal_code"]').val('');
            $('input[name="postal_code"]').blur();

            $('input[name="business_address"]').val('');
            $('input[name="business_address"]').blur();
        }
        $('#opp_name').text('Company Information');
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').show();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        $('.relation_form_div').hide();
        $('.documentVerification_form_div').hide();
        openSidebar();
        last_operation = 'add';
        opp_name = 'company_info';
        $('#operation').val('add');
        $('#opp_name_input').val('company_info');
    });


    $(document).on('click', '.openDataSidebarForAddingNewPallet', function () {
        $('#dataSidebarLoader').hide();
        $('input[name="pallet_name"]').val('');
        $('input[name="pallet_name"]').blur();

        $('input[name="empty_pallet_weight"]').val('');
        $('input[name="empty_pallet_weight"]').blur();

        $('input[name="pallet_length"]').val('');
        $('input[name="pallet_length"]').blur();

        $('input[name="pallet_width"]').val('');
        $('input[name="pallet_width"]').blur();

        $('#opp_name').text('Pallet Information');
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').show();
        $('.ContactTypes').hide();
        openSidebar();
        last_operation = 'add';
        opp_name = 'pallet_info';
        $('#operation').val('add');
        $('#opp_name_input').val('pallet');
    });


    $(document).on('click', '.openDataSidebarForAddingContactTypes', function () {
        $('#dataSidebarLoader').hide();
        // $('#contact_type_flag').show();
        if (last_operation == 'update') {
            $('input[name="contact_name"]').val('');
            $('input[name="contact_name"]').blur();
            $('#contact_type_flag').val(0).trigger('change');
            $('.custom_checkbox').prop('checked', false);
        }
        $('#opp_name').text('Contact Types');

        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').show();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        $('.relation_form_div').hide();
        $('.documentVerification_form_div').hide();

        openSidebar();
        last_operation = 'add';
        opp_name = 'contact_types';
        $('#operation').val('add');
        $('#opp_name_input').val('contact_types');
    });
    $(document).on('click', '.openDataSidebarForAddingGenderType', function () {
        $('#dataSidebarLoader').hide();
        if (last_operation == 'update') {
            $('input[name="gender_name"]').val('');
            $('input[name="gender_name"]').blur();

        }
        $('#opp_name').text('Gender Information');
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.gender_form_div').show();
        $('.documentVerification_form_div').hide();
        $('.relation_form_div').hide();
        $('.residence_form_div').hide();

        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        openSidebar();
        last_operation = 'add';
        opp_name = 'gender';
        $('#operation').val('add');
        $('#opp_name_input').val('gender');
    });

    $(document).on('click', '.openDataSidebarForAddingRelation', function () {
        $('#dataSidebarLoader').hide();
        if (last_operation == 'update') {
            $('input[name="relation_name"]').val('');
            $('input[name="relation_name"]').blur();

        }
        $('#opp_name').text('Relation Information');
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.relation_form_div').show();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        $('.documentVerification_form_div').hide();

        openSidebar();
        last_operation = 'add';
        opp_name = 'relation';
        $('#operation').val('add');
        $('#opp_name_input').val('relation');
    });


    $(document).on('click', '.openDataSidebarForAddingLanguage', function () {
        $('#dataSidebarLoader').hide();
        if (last_operation == 'update') {
            $('input[name="language_name"]').val('');
            $('input[name="language_name"]').blur();

        }
        $('#opp_name').text('Language Information');
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.relation_form_div').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.documentVerification_form_div').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').show();
        openSidebar();
        last_operation = 'add';
        opp_name = 'property';
        $('#operation').val('add');
        $('#opp_name_input').val('property');
    });
    
    $(document).on('click', '.openDataSidebarForAddingResidenceStatus', function () {
        $('#dataSidebarLoader').hide();
        if (last_operation == 'update') {
            $('input[name="residence_name"]').val('');
            $('input[name="residence_name"]').blur();

        }
        $('#opp_name').text('Residence Information');
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.relation_form_div').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.documentVerification_form_div').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         
        $('.residence_form_div').show();

        openSidebar();
        last_operation = 'add';
        opp_name = 'residence';
        $('#operation').val('add');
        $('#opp_name_input').val('residence');
    });


    $(document).on('click', '.openDataSidebarForAddingDocumentVerification', function () {
        $('#dataSidebarLoader').hide();
        if (last_operation == 'update') {
            $('input[name="document_verification_name"]').val('');
            $('input[name="document_verification_name"]').blur();

        }
        $('#opp_name').text('Verification Document');
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.relation_form_div').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.documentVerification_form_div').show();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        openSidebar();
        last_operation = 'add';
        opp_name = 'document_verification_name';

        $('#operation').val('add');
        $('#opp_name_input').val('document_verification_name');
        $('#dropifyImgDiv').empty();
        $('#dropifyImgDiv').append('<input type="file" name="employeePicture" id="employeePicture" />');
        $('#employeePicture').dropify();


    });



    $(document).on('click', '.openDataSidebarForUpdateDesignation', function () {
        var id = $(this).attr('id');
        $('#dataSidebarLoader').show();
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        $('.relation_form_div').hide();
        $('.documentVerification_form_div').hide();

        $('#opp_name').text('Designation');
        $('#opp_id').val(id);
        $('.custom_checkbox').prop('checked', false);
        openSidebar();
        last_operation = 'update';
        opp_name = 'designation';
        $('#operation').val('update');
        $('#opp_name_input').val('designation');
        $.ajax({
            type: 'GET',
            url: '/GetDesignation/' + id,
            success: function (response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="designation_name"]').focus();
                $('input[name="designation_name"]').val(response.designation);
                $('input[name="designation_name"]').blur();

                if (response.designation_rights) {
                    $('.custom_checkbox').each(function () {
                        if (JSON.parse(response.designation_rights).includes($(this).attr('id'))) {
                            $(this).prop('checked', true);
                        }
                    });
                }

                if (response.pnl_access) {
                    $('.custom_checkbox').each(function () {
                        if ($(this).attr('id') == 'pnl_access') {
                            $(this).prop('checked', true);
                        }
                    });
                }

                $('.designation_form_div').show();
                $('.department_form_div').hide();
                $('.assets_form_div').hide();
                $('.custType_form_div').hide();
                $('.exchangeRateDiv').hide();
                $('.CompanyInfoDiv').hide();


            }
        });
    });

    $(document).on('click', '.openDataSidebarForUpdatedepartment', function () {
        var id = $(this).attr('id');
        $('#dataSidebarLoader').show();
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        $('.relation_form_div').hide();
        $('.documentVerification_form_div').hide();

        $('#opp_name').text('Department');
        $('#opp_id').val(id);
        openSidebar();
        last_operation = 'update';
        opp_name = 'department';
        $('#operation').val('update');
        $('#opp_name_input').val('department');
        $.ajax({
            type: 'GET',
            url: '/GetDepartment/' + id,
            success: function (response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="department_name"]').focus();
                $('input[name="department_name"]').val(response.department);
                $('input[name="department_name"]').blur();

                $('.designation_form_div').hide();
                $('.department_form_div').show();
                $('.assets_form_div').hide();
                $('.custType_form_div').hide();
                $('.exchangeRateDiv').hide();
                $('.CompanyInfoDiv').hide();
            }
        });
    });

    $(document).on('click', '.openDataSidebarForUpdateassets', function () {
        var id = $(this).attr('id');
        $('#dataSidebarLoader').show();
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        $('.relation_form_div').hide();
        $('.documentVerification_form_div').hide();

        $('#opp_name').text('Asset Types');
        $('#opp_id').val(id);
        openSidebar();
        last_operation = 'update';
        opp_name = 'assets';
        $('#operation').val('update');
        $('#opp_name_input').val('assets');
        $.ajax({
            type: 'GET',
            url: '/GetAssets/' + id,
            success: function (response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="asset_name"]').focus();
                $('input[name="asset_name"]').val(response.asset_name);
                $('input[name="asset_name"]').blur();

                $('.designation_form_div').hide();
                $('.department_form_div').hide();
                $('.assets_form_div').show();
                $('.custType_form_div').hide();
                $('.exchangeRateDiv').hide();
                $('.CompanyInfoDiv').hide();
                $('.PalletInfoDiv').hide();
                $('.ContactTypes').hide();
                $('.gender_form_div').hide();
                $('.language_form_div').hide();
         $('.residence_form_div').hide();           
                $('.relation_form_div').hide();
                $('.documentVerification_form_div').hide();
            }
        });
    });

    $(document).on('click', '.openDataSidebarForUpdateCustType', function () {
        var id = $(this).attr('id');
        $('#dataSidebarLoader').show();
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        $('.relation_form_div').hide();
        $('.documentVerification_form_div').hide();

        $('#opp_name').text('Customer Type');
        $('#opp_id').val(id);
        openSidebar();
        last_operation = 'update';
        opp_name = 'cust_type';
        $('#operation').val('update');
        $('#opp_name_input').val('cust_type');
        $.ajax({
            type: 'GET',
            url: '/GetCustType/' + id,
            success: function (response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="customer_type"]').focus();
                $('input[name="customer_type"]').val(response.type_name);
                $('input[name="customer_type"]').blur();

                $('input[name="discount"]').focus();
                $('input[name="discount"]').val(response.discount);
                $('input[name="discount"]').blur();

                $('.designation_form_div').hide();
                $('.department_form_div').hide();
                $('.assets_form_div').hide();
                $('.custType_form_div').show();
                $('.exchangeRateDiv').hide();
                $('.CompanyInfoDiv').hide();
            }
        });
    });

    $(document).on('click', '.openDataSidebarForUpdateExchangeRate', function () {
        var id = $(this).attr('id');
        $('#dataSidebarLoader').hide();
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').show();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        $('.relation_form_div').hide();
        $('.documentVerification_form_div').hide();

        $('.required_exchange_rate').val("");
        $('#opp_name').text('Customer Type');
        $('#opp_id').val(id);

        $('[name="date_from"], [name="date_till"]').datepicker('destroy');
        openSidebar();
        last_operation = 'update';
        opp_name = 'exchange_rates';
        $('#operation').val('update');
        $('#opp_name_input').val('exchange_rate');
        $.ajax({
            type: 'GET',
            url: '/GetRate/' + id,
            success: function (response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="exchange_rate"]').focus();
                $('input[name="exchange_rate"]').val(response.exchange_rate);
                $('input[name="exchange_rate"]').blur();

                $('input[name="date_from"]').focus();
                $('input[name="date_from"]').val(response.date_from);
                $('input[name="date_from"]').blur();

                $('input[name="date_till"]').focus();
                $('input[name="date_till"]').val(response.date_till);
                $('input[name="date_till"]').blur();

                $('[name="date_from"], [name="date_till"]').datepicker({
                    format: "yyyy-mm-dd",
                    endDate: '+0d'
                });

                $('[name="currency"]').val(response.currency)

                $('.designation_form_div').hide();
                $('.department_form_div').hide();
                $('.assets_form_div').hide();
                $('.custType_form_div').hide();
                $('.exchangeRateDiv').show();
                $('.CompanyInfoDiv').hide();
            }
        });
    });

    $(document).on('click', '.openDataSidebarForUpdateCompanyInfo', function () {
        var id = $(this).attr('id');
        $('#dataSidebarLoader').show();
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        $('.relation_form_div').hide();
        $('.documentVerification_form_div').hide();

        $('.required_exchange_rate').val("");
        $('#opp_name').text('Company Information');
        $('#opp_id').val(id);

        openSidebar();
        last_operation = 'update';
        opp_name = 'company_info';
        $('#operation').val('update');
        $('#opp_name_input').val('company_info');
        $.ajax({
            type: 'GET',
            url: '/GetCompanyInfor/' + id,
            success: function (response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="business_title"]').focus();
                $('input[name="business_title"]').val(response.business_title);
                $('input[name="business_title"]').blur();

                $('input[name="business_number"]').focus();
                $('input[name="business_number"]').val(response.business_number);
                $('input[name="business_number"]').blur();

                $('input[name="business_email"]').focus();
                $('input[name="business_email"]').val(response.business_email);
                $('input[name="business_email"]').blur();

                $('input[name="postal_code"]').focus();
                $('input[name="postal_code"]').val(response.postal_code);
                $('input[name="postal_code"]').blur();

                $('input[name="business_address"]').focus();
                $('input[name="business_address"]').val(response.business_address);
                $('input[name="business_address"]').blur();

                $('.designation_form_div').hide();
                $('.department_form_div').hide();
                $('.assets_form_div').hide();
                $('.custType_form_div').hide();
                $('.exchangeRateDiv').hide();
                $('.CompanyInfoDiv').show();
            }
        });
    });



    $(document).on('click', '.openDataSidebarForUpdatePalletInfo', function () {

        var id = $(this).attr('id');
        $('#dataSidebarLoader').show();
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        $('.relation_form_div').hide();
        $('.documentVerification_form_div').hide();

        $('.required_exchange_rate').val("");
        $('#opp_name').text('Company Information');
        $('#opp_id').val(id);

        openSidebar();
        last_operation = 'update';
        opp_name = 'pallet_info';
        $('#operation').val('update');
        $('#opp_name_input').val('pallet');
        $.ajax({
            type: 'GET',
            url: '/GetPalletInfo/' + id,
            success: function (response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="pallet_name"]').focus();
                $('input[name="pallet_name"]').val(response.name);
                $('input[name="pallet_name"]').blur();

                $('input[name="empty_pallet_weight"]').focus();
                $('input[name="empty_pallet_weight"]').val(response.empty_pallet_weight);
                $('input[name="empty_pallet_weight"]').blur();

                $('input[name="pallet_length"]').focus();
                $('input[name="pallet_length"]').val(response.length);
                $('input[name="pallet_length"]').blur();

                $('input[name="pallet_width"]').focus();
                $('input[name="pallet_width"]').val(response.width);
                $('input[name="pallet_width"]').blur();

                $('.designation_form_div').hide();
                $('.department_form_div').hide();
                $('.assets_form_div').hide();
                $('.custType_form_div').hide();
                $('.exchangeRateDiv').hide();
                $('.CompanyInfoDiv').hide();
                $('.PalletInfoDiv').show();
                $('.ContactTypes').hide();
            }
        });
    });


    $(document).on('click', '.openDataSidebarForUpdateContactTypes', function () {
        // $('#contact_type_flag').hide();
        var id = $(this).attr('id');
        $('#dataSidebarLoader').show();
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        $('.relation_form_div').hide();
        $('.documentVerification_form_div').hide();
        $('#opp_name').text('Contact Types');
        $('#opp_id').val(id);
        openSidebar();
        last_operation = 'update';
        opp_name = 'contact_types';
        $('#operation').val('update');
        $('#opp_name_input').val('contact_types');
        $.ajax({
            type: 'GET',
            url: '/GetContact_types/' + id,
            success: function (response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="contact_name"]').focus();
                $('input[name="contact_name"]').val(response.contact_name);
                $('input[name="contact_name"]').blur();
                $('#contact_type_flag').val(response.contact_type_flag).trigger('change');

                $('.designation_form_div').hide();
                $('.department_form_div').hide();
                $('.assets_form_div').hide();
                $('.custType_form_div').hide();
                $('.exchangeRateDiv').hide();
                $('.CompanyInfoDiv').hide();
                $('.PalletInfoDiv').hide();
                $('.ContactTypes').show();
                $('.gender_form_div').hide();
                $('.language_form_div').hide();
         $('.residence_form_div').hide();           
                $('.relation_form_div').hide();
                $('.documentVerification_form_div').hide();

            }
        });
    });

    $(document).on('click', '.openDataSidebarForUpdateGender', function () {
        var id = $(this).attr('id');

        $('#dataSidebarLoader').hide();
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').show();
        $('.relation_form_div').hide();


        $('#opp_name').text('Gender');
        $('#opp_id').val(id);
        openSidebar();
        last_operation = 'update';
        opp_name = 'gender';
        $('#operation').val('update');
        $('#opp_name_input').val('gender');
        $.ajax({
            type: 'GET',
            url: '/GetGender/' + id,
            success: function (response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="gender_name"]').focus();
                $('input[name="gender_name"]').val(response.gender_name);
                $('input[name="gender_name"]').blur();

                $('.designation_form_div').hide();
                $('.department_form_div').hide();
                $('.assets_form_div').hide();
                $('.custType_form_div').hide();
                $('.exchangeRateDiv').hide();
                $('.CompanyInfoDiv').hide();
                $('.PalletInfoDiv').hide();
                $('.ContactTypes').hide();
                $('.gender_form_div').show();
                $('.relation_form_div').hide();


            }
        });
    });


    $(document).on('click', '.openDataSidebarForUpdateRelation', function () {
        var id = $(this).attr('id');
        $('#dataSidebarLoader').hide();
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        $('.relation_form_div').show();


        $('#opp_name').text('relation');
        $('#opp_id').val(id);
        openSidebar();
        last_operation = 'update';
        opp_name = 'relation';
        $('#operation').val('update');
        $('#opp_name_input').val('relation');
        // $.ajax({
        //     type: 'GET',
        //     url: '/GetRelation/' + id,
        //     success: function(response) {
        //         var response = JSON.parse(response);
        //         $('#dataSidebarLoader').hide();
        //         $('._cl-bottom').show();
        //         $('.pc-cartlist').show();

        //         $('input[name="relation_name"]').focus();
        //         $('input[name="relation_name"]').val(response.relation_name);
        //         $('input[name="relation_name"]').blur();

        //         $('.designation_form_div').hide();
        //         $('.department_form_div').hide();
        //         $('.assets_form_div').hide();
        //         $('.custType_form_div').hide();
        //         $('.exchangeRateDiv').hide();
        //         $('.CompanyInfoDiv').hide();
        //         $('.relation_form_div').show();
        //     }
        // });
        $('#dataSidebarLoader').hide();
        $('._cl-bottom').show();
        $('.pc-cartlist').show();

        $('input[name="relation_name"]').focus();
        $('input[name="relation_name"]').val($(this).attr('data-name'));
        $('input[name="relation_name"]').blur();

        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        $('.relation_form_div').show();
    });


    $(document).on('click', '.openDataSidebarForUpdateLanguage', function () {
        var id = $(this).attr('id');
        $('#dataSidebarLoader').hide();
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        $('.documentVerification_form_div').hide();


        $('#opp_name').text('relation');
        $('#opp_id').val(id);
        openSidebar();
        last_operation = 'update';
        opp_name = 'property';
        $('#operation').val('update');
        $('#opp_name_input').val('property');
        $.ajax({
            type: 'GET',
            url: '/GetProperty/' + id,
            success: function (response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="language_name"]').focus();
                $('input[name="language_name"]').val(response.language_name);
                $('input[name="language_name"]').blur();

                $('.designation_form_div').hide();
                $('.department_form_div').hide();
                $('.assets_form_div').hide();
                $('.custType_form_div').hide();
                $('.exchangeRateDiv').hide();
                $('.CompanyInfoDiv').hide();
                $('.language_form_div').show();
            }
        });
    });


    $(document).on('click', '.openDataSidebarForUpdateDocumentVerification', function () {
        var id = $(this).attr('id');
        $('#dataSidebarLoader').hide();
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
         $('.residence_form_div').hide();
        $('.documentVerification_form_div').show();


        $('#opp_name').text('document verification');
        $('#opp_id').val(id);
        openSidebar();
        $('#dropifyImgDiv').empty();
        $('#dropifyImgDiv').append('<input type="file" name="employeePicture" id="employeePicture" />');
        $('#employeePicture').dropify();

        last_operation = 'update';
        opp_name = 'document_verification_name';
        $('#operation').val('update');
        $('#opp_name_input').val('document_verification_name');
        $.ajax({
            type: 'GET',
            url: '/GetDocumentVerification/' + id,
            success: function (response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="document_verification_name"]').focus();
                $('input[name="document_verification_name"]').val(response.document_verification_name);
                $('input[name="document_verification_name"]').blur();

                $('.designation_form_div').hide();
                $('.department_form_div').hide();
                $('.assets_form_div').hide();
                $('.custType_form_div').hide();
                $('.exchangeRateDiv').hide();
                $('.CompanyInfoDiv').hide();
                $('.language_form_div').hide();
         $('.residence_form_div').hide();            
            }
        });
    });

    $(document).on('click', '.openDataSidebarForUpdateDocumentVerification', function () {
        var id = $(this).attr('id');
        $('#dataSidebarLoader').hide();
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').hide();
        
        $('.relation_form_div').hide();
      
         $('.residence_form_div').hide();
        
        $('.documentVerification_form_div').show();


        $('#opp_name').text('document verification');
        $('#opp_id').val(id);
        openSidebar();
        $('#dropifyImgDiv').empty();
        $('#dropifyImgDiv').append('<input type="file" name="employeePicture" id="employeePicture" />');
        $('#employeePicture').dropify();

        last_operation = 'update';
        opp_name = 'document_verification_name';
        $('#operation').val('update');
        $('#opp_name_input').val('document_verification_name');
        $.ajax({
            type: 'GET',
            url: '/GetDocumentVerification/' + id,
            success: function (response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="document_verification_name"]').focus();
                $('input[name="document_verification_name"]').val(response.document_verification_name);
                $('input[name="document_verification_name"]').blur();

                $('.designation_form_div').hide();
                $('.department_form_div').hide();
                $('.assets_form_div').hide();
                $('.custType_form_div').hide();
                $('.exchangeRateDiv').hide();
                $('.CompanyInfoDiv').hide();
                $('.language_form_div').hide();
         $('.residence_form_div').hide();            
            }
        });
    });
    $(document).on('click', '.openDataSidebarForUpdateResidence', function () {
        var id = $(this).attr('id');
        $('#dataSidebarLoader').hide();
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.assets_form_div').hide();
        $('.custType_form_div').hide();
        $('.exchangeRateDiv').hide();
        $('.CompanyInfoDiv').hide();
        $('.PalletInfoDiv').hide();
        $('.ContactTypes').hide();
        $('.gender_form_div').hide();
        $('.language_form_div').hide();
         $('.residence_form_div').show();
        
        $('.relation_form_div').hide();
        
        $('.documentVerification_form_div').hide();


        $('#opp_name').text('Residence Status');
        $('#opp_id').val(id);
        openSidebar();
      

        last_operation = 'update';
        opp_name = 'residence';
        $('#operation').val('update');
        $('#opp_name_input').val('residence');
        $.ajax({
            type: 'GET',
            url: '/GetResidence-status/' + id,
            success: function (response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="residence_name"]').focus();
                $('input[name="residence_name"]').val(response.residence_name);
                $('input[name="residence_name"]').blur();

                $('.designation_form_div').hide();
                $('.department_form_div').hide();
                $('.assets_form_div').hide();
                $('.custType_form_div').hide();
                $('.exchangeRateDiv').hide();
                $('.CompanyInfoDiv').hide();
                $('.language_form_div').hide();         
            }
        });
    });


    



    $(document).on('click', '#saveBtn', function () {


        var invalidSave = [];
        var designation_rights = [];
        var pnl_access = 0
        if (opp_name == 'designation') {
            $('.required_designation').each(function () {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the design information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
            $('.custom_checkbox').each(function () {
                if ($(this).prop('checked') && $(this).val() != 'pnl_access') {
                    designation_rights.push($(this).attr('id'));
                }
                if ($(this).prop('checked') && $(this).val() == 'pnl_access') {
                    pnl_access = 1;
                }

            });
        } else if (opp_name == 'department') {
            $('.required_department').each(function () {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the dept information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
        } else if (opp_name == 'assets') {
            $('.required_asset_name').each(function () {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the Asset information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
        }else if (opp_name == 'residence') {
            $('.required_residence').each(function () {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the cuctom information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
        }  else if (opp_name == 'cust_type') {
            $('.required_customer_type').each(function () {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the cuctom information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
        } else if (opp_name == 'company_info') {
            var business_email = $('input[name="business_email"]').val();
            var business_number = $('input[name="business_number"]').val();
            var postal_code = $('input[name="postal_code"]').val();
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            var numberReg = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
            var postal_expression = /^[a-zA-Z0-9]{6}$/;
            $('.required_company_info').each(function () {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the company information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
            if (emailReg.test(business_email) == false) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Email');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                invalidSave.push(true);
            } else {
                invalidSave.push(false);
            }
            if (numberReg.test(business_number) == false) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Enter Correct Number');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                invalidSave.push(true);
            } else {
                invalidSave.push(false);
            }
            if (postal_expression.test(postal_code) == false) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Provide Correct Format of Postal Code');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                invalidSave.push(true);
            } else {
                invalidSave.push(false);
            }

        } else if (opp_name == 'gender') {
            $('.required_gender').each(function () {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the Gender information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
        } else if (opp_name == 'property') {
            $('.required_property').each(function () {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the Property information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
        } else if (opp_name == 'relation') {
            $('.required_relation').each(function () {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the Relation information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
        }
        else if (opp_name == 'document_verification_name') {
            $('.required_documentverification').each(function () {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the verif information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
        } else if (opp_name == 'pallet_info') {
            $('.required_pallet_info').each(function () {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the fsdfsdf information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
        } else if (opp_name == 'contact_types') {
            $('.required_contact_types').each(function () {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the required information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
        } else {
            $('.required_exchange_rate').each(function () {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the exchange information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
        }

        if (invalidSave.includes(true))
            return;

        $('#saveBtn').attr('disabled', 'disabled');
        $('#btn-cancel').attr('disabled', 'disabled');
        $('#saveBtn').text('Processing..');

        $('#saveSettingsForm').ajaxSubmit({
            type: "POST",
            url: '/save_settings',
            data: {
                designation_rights: designation_rights,
                pnl_access: pnl_access
            },
            cache: false,
            success: function (response) {
                $('#saveBtn').removeAttr('disabled');
                $('#btn-cancel').removeAttr('disabled');
                $('#saveBtn').text('Save');

                if (JSON.parse(response) == "success") {
                    fetchAllData();
                    $('#notifDiv').text('Saved Successfully!');
                    if ($('#operation').val() == "add") {
                        $('input[name="designation_name"]').val('');
                        $('input[name="department_name"]').val('');
                        $('input[name="asset_name"]').val('');
                        $('input[name="customer_type"]').val('');
                        $('input[name="discount"]').val('');
                        $('input[name="business_title"]').val('');
                        $('input[name="business_number"]').val('');
                        $('input[name="business_email"]').val('');
                        $('input[name="postal_code"]').val('');
                        $('input[name="business_address"]').val('');
                        $('input[name="pallet_name"]').val('');
                        $('input[name="empty_pallet_weight"]').val('');
                        $('input[name="pallet_length"]').val('');
                        $('input[name="pallet_width"]').val('');
                        $('input[name="contact_name"]').val('');
                        $('input[name="gender_name"]').val('');
                        $('input[name="relation_name"]').val('');
                        $('input[name="language_name"]').val('');
                        $('input[name="document_verification_name"]').val('');
                        $('input[name="residence_name"]').val('');
                        $('.custom_checkbox').prop('checked', false);
                    }
                    //  debugger;
                    closeSidebar();

                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else if (JSON.parse(response) == "already_exist") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Already Exist!');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else if (JSON.parse(response) == "email_already_exist") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Email Already Exist!');
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
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function (i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                    });
                }
            }
        });

    });


    $(document).on('click', '.delete_settings', function () {
        var id = $(this).attr('id');
        glob_type = $(this).attr('name');
        $('.confirm_delete').attr('id', id);
        deleteRef = $(this);
        $('#hidden_btn_to_open_modal').click();
    })

    $(document).on('click', '.confirm_delete', function () {
        var thisRef = $(this);
        thisRef.attr('disabled', 'disabled');
        thisRef.text('Processing...');
        var id = $(this).attr('id');
        $('.cancel_delete_modal').attr('disabled', 'disabled');
        deleteRef.attr('disabled', 'disabled');
        deleteRef.text('Processing...');
        $.ajax({
            type: "POST",
            url: '/delete_from_settings',
            data: {
                _token: $('meta[name="csrf_token"]').attr('content'),
                type: glob_type,
                id: id
            },
            cache: false,
            success: function (response) {
                thisRef.removeAttr('disabled');
                deleteRef.removeAttr('disabled');
                thisRef.text('Yes');
                $('.cancel_delete_modal').removeAttr('disabled');
                if (JSON.parse(response) == "success") {

                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Deleted successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    fetchAllData();
                    $('.cancel_delete_modal').click();

                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add delete at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            },
            error: function (err) {
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function (i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                    });
                }
            }
        });
    });

});

function fetchAllData() {
    $('.loader').show();
    $('.body_designations').empty();
    $('.body_departments').empty();
    $('.body_assets').empty();
    $('.body_cust_type').empty();
    $('.exchangeRatesDiv').empty();
    $('.CompanyInfoTableDiv').empty();
    $('.PalletsInfoTableDiv').empty();
    $('.ContactTypesTableDiv').empty();
    $('.body_gender').empty();
    $('.body_relation').empty();
    $('.body_language').empty();
    $('.body_document_verification').empty();
    $('.ResidenceTableDiv').empty();

    $.ajax({
        type: 'GET',
        url: '/GetSettingsData',
        success: function (response) {
            var response = JSON.parse(response);
            settingData = response;
            
            $('.body_designations').append('<table class="table table-hover dt-responsive nowrap" id="designationsTable" style="width:100%;"><thead><tr><th>ID</th><th>Designation</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#designationsTable tbody').empty();
            response.designations.forEach(element => {
                $('#designationsTable tbody').append(`<tr><td>${element['id']}</td><td>${element['designation']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateDesignation">Edit</button></td></tr>`);
            });
            $('.body_designations').fadeIn();
            $('#designationsTable').DataTable();


            $('.body_departments').append('<table class="table table-hover dt-responsive nowrap" id="departmentsTable" style="width:100%;"><thead><tr><th>ID</th><th>Department</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#departmentsTable tbody').empty();
            response.departments.forEach(element => {
                $('#departmentsTable tbody').append(`<tr><td>${element['id']}</td><td>${element['department']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdatedepartment">Edit</button></td></tr>`);
            });
            $('.body_departments').fadeIn();
            $('#departmentsTable').DataTable();


            $('.body_assets').append('<table class="table table-hover dt-responsive nowrap" id="assetsTypeTable" style="width:100%;"><thead><tr><th>ID</th><th>Type</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#assetsTypeTable tbody').empty();
            response.assets.forEach(element => {
                $('#assetsTypeTable tbody').append(`<tr><td>${element['id']}</td><td>${element['asset_name']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateassets">Edit</button></td></tr>`);
            });
            $('.body_assets').fadeIn();
            $('#assetsTypeTable').DataTable();

            $('.body_cust_type').append('<table class="table table-hover dt-responsive nowrap" id="custTypeTable" style="width:100%;"><thead><tr><th>ID</th><th>Type</th><th>Discount</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#custTypeTable tbody').empty();
            response.cust_type.forEach(element => {
                $('#custTypeTable tbody').append(`<tr><td>${element['id']}</td><td>${element['type_name']}</td><td>${element['discount']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateCustType">Edit</button></td></tr>`);
            });
            $('.body_cust_type').fadeIn();
            $('#custTypeTable').DataTable();

            $('.exchangeRatesDiv').append('<table class="table table-hover dt-responsive nowrap" id="exchangeRateTbl" style="width:100%;"><thead><tr><th>From</th><th>Till</th><th>Currency</th><th>Rate</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#exchangeRateTbl tbody').empty();
            response.rates.forEach(element => {
                $('#exchangeRateTbl tbody').append(`<tr><td>${element['date_from']}</td><td>${element['date_till']}</td><td>${element['currency']}</td><td>${element['exchange_rate']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateExchangeRate">Edit</button><button id="${element['id']}" class="btn btn-default red-bg delete_settings" name="rates">Delete</button></td></tr>`);
            });
            $('.exchangeRatesDiv').fadeIn();
            $('#exchangeRateTbl').DataTable();

            $('.CompanyInfoTableDiv').append('<table class="table table-hover dt-responsive nowrap" id="CompanyInfoTable" style="width:100%;"><thead><tr><th>Title</th><th>Number</th><th>Email</th><th>Postal Code</th><th>Address</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#CompanyInfoTable tbody').empty();
            response.company_info.forEach(element => {
                $('#CompanyInfoTable tbody').append(`<tr><td>${element['business_title']}</td><td>${element['business_number']}</td><td>${element['business_email']}</td><td>${element['postal_code']}</td><td>${element['business_address']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateCompanyInfo">Edit</button></td></tr>`);
            });
            $('.CompanyInfoTableDiv').fadeIn();
            $('#CompanyInfoTable').DataTable();

            $('.PalletsInfoTableDiv').append('<table class="table table-hover dt-responsive nowrap" id="PalletsInfoTable" style="width:100%;"><thead><tr><th>Pallet</th><th>Dimensions</th><th>Weight</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#PalletsInfoTable tbody').empty();
            response.pallets_info.forEach(element => {
                $('#PalletsInfoTable tbody').append(`<tr><td>${element['name']}</td><td>${element['length']}x${element['width']}</td><td>${element['empty_pallet_weight']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdatePalletInfo">Edit</button><button id="${element['id']}" class="btn btn-default red-bg delete_settings" name="pallets">Delete</button></td></tr>`);
            });
            $('.PalletsInfoTableDiv').fadeIn();
            $('#PalletsInfoTable').DataTable();

            $('.ContactTypesTableDiv').append('<table class="table table-hover dt-responsive nowrap" id="contactTypesTable" style="width:100%;"><thead><tr><th>ID</th><th>Contact</th><th>Type</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#contactTypesTable tbody').empty();
            response.contact_types.forEach(element => {
                $('#contactTypesTable tbody').append(`<tr><td>${element['id']}</td><td>${element['contact_name']}</td><td>${element['contact_type_flag']==1 ? 'Client' : element['contact_type_flag']==2 ? 'Realtor' : element['contact_type_flag']==3 ? 'Mortgage Agent' : element['contact_type_flag']==4 ? 'Banker' : element['contact_type_flag']==5 ? 'Lender' : 'NA'}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateContactTypes">Edit</button></td></tr>`);
            });
            $('.ContactTypesTableDiv').fadeIn();
            $('#contactTypesTable').DataTable();

            $('.body_gender').append('<table class="table table-hover dt-responsive nowrap" id="genderTypeTable" style="width:100%;"><thead><tr><th>ID</th><th>Gender</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#genderTypeTable tbody').empty();
            response.genders.forEach(element => {
                $('#genderTypeTable tbody').append(`<tr><td>${element['id']}</td><td>${element['gender_name']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateGender">Edit</button></td></tr>`);
            });
            $('.body_gender').fadeIn();
            $('#genderTypeTable').DataTable();

            $('.body_relation').append('<table class="table table-hover dt-responsive nowrap" id="relationTypeTable" style="width:100%;"><thead><tr><th>ID</th><th>Relationship</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#relationTypeTable tbody').empty();
            response.relationship_types.forEach(element => {
                $('#relationTypeTable tbody').append(`<tr><td>${element['id']}</td><td>${element['relation_name']}</td><td><button id="${element['id']}" data-name="${element['relation_name']}" class="btn btn-default btn-line openDataSidebarForUpdateRelation">Edit</button></td></tr>`);
            });
            $('.body_relation').fadeIn();
            $('#relationTypeTable').DataTable();

            $('.body_language').append('<table class="table table-hover dt-responsive nowrap" id="LanguageTable" style="width:100%;"><thead><tr><th>ID</th><th>Language</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#LanguageTable tbody').empty();
            response.languages.forEach(element => {
                $('#LanguageTable tbody').append(`<tr><td>${element['id']}</td><td>${element['language_name']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateLanguage">Edit</button></td></tr>`);
            });
            $('.body_language').fadeIn();
            $('#LanguageTable').DataTable();

            $('.body_document_verification').append('<table class="table table-hover dt-responsive nowrap" id="document_verificationTypeTable" style="width:100%;"><thead><tr><th>ID</th><th>Title</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#document_verificationTypeTable tbody').empty();
            response.document_verifications.forEach(element => {
                $('#document_verificationTypeTable tbody').append(`<tr><td>${element['id']}</td><td>${element['document_verification_name']}</td><td><button id="${element['id']}" data-name="${element['document_verification_name']}" class="btn btn-default btn-line openDataSidebarForUpdateDocumentVerification">Edit</button></td></tr>`);
            });
            $('.body_document_verification').fadeIn();
            $('#document_verificationTypeTable').DataTable();

            $('.ResidenceTableDiv').append('<table class="table table-hover dt-responsive nowrap" id="residence" style="width:100%;"><thead><tr><th>ID</th><th>Name</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#residence tbody').empty();
            response.residence_status.forEach(element => {
                $('#residence tbody').append(`<tr><td>${element['id']}</td><td>${element['residence_name']}</td><td><button id="${element['id']}" data-name="${element['residence_name']}" class="btn btn-default btn-line openDataSidebarForUpdateResidence">Edit</button></td></tr>`);
            });
            $('.ResidenceTableDiv').fadeIn();
            $('#residence').DataTable();

            $('.loader').hide();
        }
    });
}
