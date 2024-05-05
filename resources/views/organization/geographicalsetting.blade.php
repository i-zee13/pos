@extends('layouts.app') @section('content')
<style>
    .search-date {
        float: left;
        font-size: 0.875rem;
        padding-top: 0.4375rem;
        padding-right: 0.625rem;
    }

    .form-s2 span {
        width: 100% !important;
    }
</style>
{{-- Delete Confirmation Modal --}}
<div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content top-borderRed">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Delete <span></span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="col-md-12">
                    <p class="delete-modal-body-text">Are you sure you want to delete?</p>
                </div>
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-primary confirm_delete">Yes</button>
                <button type="button" class="btn btn-cancel cancel_delete_modal" data-dismiss="modal"
                    aria-label="Close">No</button>
            </div>
        </div>
    </div>
    <button hidden data-toggle="modal" data-target="#deleteModal" id="hidden_btn_to_open_modal"></button>
</div>
<div id="product-cl-sec">
    <a href="#" id="pl-close" class="close-btn-pl"></a>
    <div class="pro-header-text">New <span id="page_title"></span></div>
    <div style="min-height: 400px" id="dataSidebarLoader" style="display: none">
        <img src="/images/loader.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
    </div>
    <div class="pc-cartlist">
        <div class="overflow-plist">
            <div class="plist-content">
                <div class="_left-filter">
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <form id="saveCountryForm">
                                    <input type="text" name="hidden_country_id" hidden />
                                    <input type="text" name="operation" id="operation" hidden>
                                    <div id="floating-label" class="card p-20 top_border mb-3">
                                        <h2 class="_head03">Country <span>Details</span></h2>
                                        <div class="form-wrap p-0">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Country Name*</label>
                                                        <input type="text" name="country_name" class="form-control">
                                                    </div>
                                                </div>
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Iso*</label>
                                                        <input type="text" name="iso" class="form-control">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <form id="saveStateForm" style="display: none">
                                    <input type="text" name="hidden_state_id" hidden />
                                    <input type="text" name="operation_state" id="operation_state" hidden>
                                    <div id="floating-label" class="card p-20 top_border mb-3">
                                        <h2 class="_head03">State <span>Details</span></h2>
                                        <div class="form-wrap p-0">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="form-s2 pt-19">
                                                        <select class="form-control formselect all_countries_form_state" placeholder="select Country*" name="country_id">
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">State Name*</label>
                                                        <input type="text" name="state_name" class="form-control">
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <form id="saveCityForm" style="display: none">
                                    <input type="text" name="hidden_city_id" hidden />
                                    <input type="text" name="operation_city" id="operation_city" hidden>
                                    <input type="text" name="hidden_city_state_id" id="hidden_city_state_id" hidden />
                                    <div id="floating-label" class="card p-20 top_border mb-3">
                                        <h2 class="_head03">Cities <span>Details</span></h2>
                                        <div class="form-wrap p-0">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="form-s2 pt-19">
                                                        <select class="form-control formselect all_countries_form" name="country_id">
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-s2 pt-19">
                                                        <select class="form-control formselect all_states_form" name="state_id">
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-12 PT-5">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">City Name*</label>
                                                        <input type="text" name="city_name" class="form-control" placeholder="">
                                                    </div>
                                                </div>
                                                <div class="col-md-12">
                                                    <label class="font11 mb-5">Show in Footer Menu? *</label>
                                                    <div class="row">
                                                        <div class="col-auto">
                                                            <div class="custom-control custom-radio">
                                                                <input class="custom-control-input yes" type="radio" name="show_in_footer_menu" id="yes" value="1">
                                                                <label class="custom-control-label font13" for="yes">Yes</label>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="custom-control custom-radio">
                                                                <input class="custom-control-input no" type="radio" name="show_in_footer_menu" id="no" value="0">
                                                                <label class="custom-control-label font13" for="no">No</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <form id="savePostalCodeForm" style="display: none">
                                    <input type="text" name="hidden_postal_id" hidden />
                                    <input type="text" name="operation_postalcode" id="operation_postalcode" hidden>
                                    <input type="text" name="hidden_postal_state_id" id="hidden_postal_state_id" hidden />
                                    <input type="text" name="hidden_postal_city_id" id="hidden_postal_city_id" hidden />
                                    <div id="floating-label" class="card p-20 top_border mb-3">
                                        <h2 class="_head03">Postal Code <span>Details</span></h2>
                                        <div class="form-wrap p-0">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="form-s2 pt-19">
                                                        <select class="form-control formselect all_countries_form_postal" name="country_id" id="all_countries_form_postal">
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-s2 pt-19">
                                                        <select class="form-control formselect all_states_form_postal" name="state_id" id="all_states_form_postal">
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-s2 pt-19">
                                                        <select class="form-control formselect all_cities_form_postal" name="city_id" id="all_cities_form_postal">
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Postal Code*</label>
                                                        <input type="text" name="postal_code" class="form-control" id="postal_code" maxlength="6">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="_cl-bottom">
        <button type="button" class="btn btn-primary mr-2" id="saveBtn">Save</button>
        <button id="pl-close" type="button" class="btn btn-cancel mr-2 cancelBtn">Cancel</button>
    </div>
</div>

<div class="row mt-2 mb-3">
    <div class="col-lg-6 col-md-6 col-sm-6 mt-auto mb-auto">
        <h2 class="_head01 mb-0">Geographical <span>Settings</span></h2>
    </div>
    <div class="col-lg-6 col-md-6 col-sm-6">
        <a href="#" id="productlist01" class="btn add_button openDataSidebarForAddingCountries"><i class="fa fa-plus mr-1"></i> <span>Add
                New</span></a>

    </div>
</div>
<style>
    .CL-Product {
        width: 348px;
        position: relative;
        float: left;
        padding-right: 15px;
    }

    .form-s2 .select2-container .select2-selection--single {
        border: 1px solid #ececec;
    }

    .Product-Filter .form-s2 .select2-container .select2-selection--single {
        background-color: white;
    }

    .header-tabs .add_button {
        right: 7px;
        top: 7px;
    }

    .header-tabs {
        height: 47px;
    }

    .Product-Filter {
        box-shadow: none;
        background-color: #f6f6f6;
        z-index: 2;
        position: relative;
        border-top: 1px solid #e9e9e9 !important;
    }
</style>
<div class="row">
    <div class="col-lg-12">
        <div class="header-tabs mb-0 position-relative">
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <a class="nav-item nav-link active" id="nav-country-tab" data-toggle="tab" href="#nav-country" role="tab" aria-controls="nav-country" aria-selected="true">Country
                    <span class="_cus-val total_countries"></span></a>
                <a class="nav-item nav-link" id="nav-province-tab" data-toggle="tab" href="#nav-province" role="tab" aria-controls="nav-province" aria-selected="false">Province/State <span class="_cus-val total_states">
                    </span></a>
                <a class="nav-item nav-link" id="nav-city-tab" data-toggle="tab" href="#nav-city" role="tab" aria-controls="nav-city " aria-selected="false">City</a>
                <a class="nav-item nav-link" id="nav-postal-tab" data-toggle="tab" href="#nav-postal-code" role="tab" aria-controls="nav-postal-code " aria-selected="false">Postal Code</a>
            </div>


        </div>
        <div class="Product-Filter border-0" style="padding: 12px 15px;">
            <div class="row">
                <div class="col-12">
                    <div class="search-date">Country:</div>
                    <div class="CL-Product" style="width:250px">
                        <div class="form-s2">
                            <select class="form-control formselect all_countries" name="all_countries">
                            </select>
                        </div>
                    </div>
                    <div class="search-date">State:</div>
                    <div class="CL-Product" style="width: 250px">
                        <div class="form-s2">
                            <select class="form-control formselect all_states" name="all_states">
                            </select>
                        </div>
                    </div>
                    <div class="search-date">City:</div>
                    <div class="CL-Product" style="width: 250px">
                        <div class="form-s2">
                            <select class="form-control formselect all_cities" name="all_cities">
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-12">
        <div class="card">
            <div class="body">
                <div class="tab-content" id="nav-tabContent">
                    <div class="tab-pane fade show active body_sales_agants" id="nav-country" role="tabpanel" aria-labelledby="nav-country-tab">
                        <div style="min-height: 400px" class="loader">
                            <img src="/images/loader.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
                        </div>
                        <div class="CountriesTbl">

                        </div>
                    </div>
                    <div class="tab-pane fade body_emp_staff" id="nav-province" role="tabpanel" aria-labelledby="nav-province-tab">
                        <div style="min-height: 400px" class="loader">
                            <img src="/images/loader.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
                        </div>
                        <div class="StatesTbl">

                        </div>
                    </div>


                    <div class="tab-pane fade body_emp_staff" id="nav-city" role="tabpanel" aria-labelledby="nav-city-tab">
                        <div style="min-height: 400px" class="loader">
                            <img src="/images/loader.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
                        </div>
                        <div class="CitiesTbl">

                        </div>
                    </div>
                    <div class="tab-pane fade body_emp_staff" id="nav-postal-code" role="tabpanel" aria-labelledby="nav-postal-tab">
                        <div style="min-height: 400px" class="loader">
                            <img src="/images/loader.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
                        </div>
                        <div class="PostalCodesTbl">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
@push('js')
<script src="{{asset('js/custom/geographical_setting.js')}}">
</script>

@endpush