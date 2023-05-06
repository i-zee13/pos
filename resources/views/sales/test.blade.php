@extends('layouts.app')

<div id="product-cl-sec"> <a href="#" id="pl-close" class="close-btn-pl"></a>
    <div class="pro-header-text">Add <span>Product</span></div>
    <div class="se_cus-type form-wrap p-15">
        <div class="row">
            <div class="col-12">
                <div class="productSearch"><i class="fa fa-search"></i>
                    <input type="text" class="form-control" id="" placeholder="Search">
                </div>
            </div>
        </div>
    </div>
    <div class="pc-cartlist">
        <div class="overflow-plist">
            <div class="plist-content">
                <div class="_left-filter pt-0">
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <div class="card top_border p-15">
                                    <table class="AddProductTable" width="100%">
                                        <tbody>
                                            {{--<tr>
                                            <td width="80%"><div class="ProListDiv"><img class="PrList_img" src="images/product-img-005.jpg"  alt=""/>
                                                    <div class="PR_Name">3D CAR RALLY</div>
                                                </div></td>
                                            <td><button data-toggle="modal" data-target="#exampleModal123" class="btn btn-default mb-0">Add</button></td>
                                        </tr>--}}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="_cl-bottom">
        <button type="submit" class="btn btn-primary mr-2 btnAddProducts">Add</button>
        <button id="pl-close" type="submit" class="btn btn-cancel mr-2">Cancel</button>
    </div>
</div>
<div class="modal fade" id="itemModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content  top_border">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Add Detail <span></span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>
            </div>
            <div class="modal-body AddDetailPR">

                <input type="hidden" id="product_id">
                <div class="row">
                    <div class="col-md-4 PT-8 mb-15">Select Item: </div>
                    <div class="col-md-8 mb-15">
                        <div class="form-s2">
                            <select class="form-control formselect" id="productItems" onchange="itemUnitPrice(this);" placeholder="Select Item" style="width:100%">
                                <option selected>Select Item</option>

                            </select>
                        </div>
                    </div>
                    <div class="col-md-4 PT-8 mb-15">Add Quantity: </div>
                    <div class="col-md-8 mb-15">
                        <input type="number" id="itemQty" class="form-control" placeholder="" style="font-size:13px">
                    </div>
                    <div class="col-md-4 PT-8" style="padding-top: 2px">Unit Price:</div>
                    <div class="col-md-8">
                        <input type="text" id="itemUnitPrice" class="form-control" placeholder="" style="font-size:13px">
                    </div>
                </div>


            </div>
            <div class="modal-footer border-0" style="background-color: #f6f6f6">
                <button type="button" class="btn btn-primary confirmItemAdd">Confirm</button>
                <button type="submit" class="btn btn-cancel" data-dismiss="modal" aria-label="Close">Cancel</button>
            </div>
        </div>
    </div>
</div>
@section('content')
<style>
    .OrderWrapper {
        padding: 0 !important;
    }

    .itemQTY {
        font-size: 12px;
        width: 70px;
        padding: 0px 5px;
        border: solid 1px #e6e6e6
    }

    .itemIMG {
        width: 32px;
        height: 32px;
        border: solid 1px #e5e5e5;
        margin-top: -5px;
        margin-bottom: -5px;
        margin-right: 5px;
        float: left
    }

    .productSearch {
        position: relative;
    }

    .productSearch input {
        height: 32px;
        border: solid 1px #eae9e9;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        padding-left: 30px;
        font-size: 13px;
        letter-spacing: 1px;
    }

    .productSearch .fa {
        position: absolute;
        top: 8px;
        left: 8px;
        color: #b5b5b5;
    }

    .AddProductTable {
        padding: 0;
        margin: 0
    }

    .AddProductTable tr {
        border-bottom: solid 1px #eeeeee
    }

    .AddProductTable td {
        padding-bottom: 7px;
        padding-top: 7px
    }

    .ProListDiv {
        padding: 0;
        display: table;
    }

    .ProListDiv .PR_Name {
        display: table-cell;
        vertical-align: middle;
        font-size: 14px;
        letter-spacing: 1px;
        line-height: 16px
    }

    .ProListDiv .PrList_img {
        width: 35px;
        height: 35px;
        margin-right: 8px;
        border: solid 1px #e0e0e0
    }

    .AddProductTable .btn-default {
        padding: 5px 8px;
        font-size: 13px;
        -webkit-border-radius: 0;
        -moz-border-radius: 0;
        border-radius: 0;
        -khtml-border-radius: 0;
        background: linear-gradient(90deg, #1e54d3 0%, #040725 100%);
        color: #fff;
        text-align: center;
        margin: 0;
        line-height: 1;
        min-width: 74px;
        letter-spacing: 1px;
        float: right;
        border: none !important
    }

    .AddDetailPR {
        padding: 25px;
        font-size: 14px
    }

    .AddDetailPR .form-control {
        height: 32px;
        border: solid 1px #dedede;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        padding: 0px 10px;
        font-size: 13px;
        letter-spacing: 1px;
    }

    .AddDetailPR select {
        border-radius: 0;
        padding: 0px 10px;
        height: 32px;
        border: solid 1px #dedede;
        font-size: 14px
    }

    .container-fluid {
        background-color: #f6f6f6;
    }

    .left-sidebox {
        -ms-flex: 420px;
        flex: 0 0 420px;
        max-width: 420px;
        padding-top: 15px;
        padding-bottom: 15px;
    }

    .sidebox-content {
        background-color: #fff;
        box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        width: 100%;
        min-height: calc(100vh - 30px);
    }

    .left_Info_ {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding-right: 5px;
        padding-top: 5px;
        padding-left: 15px;
    }

    .right-sidebox {
        padding-top: 15px;
        padding-right: 15px;
        padding-left: 5px;
        -ms-flex: 0 0 1056px;
        flex: 0 0 1056px;
        max-width: 1056px;
    }

    .right_Info {
        background-color: #fff;
        box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
        padding: 15px;
    }

    .title {
        position: relative;
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 10px;
        padding-bottom: 10px;
        display: inline-block;
        width: 100%;
        padding-top: 20px;
    }

    .title span {
        font-family: 'proximanova-light', sans-serif !important
    }

    .CompanyInfo {
        font-size: 14px;
        line-height: 26px;
    }

    .left-sidebox .form-s2 .select2-container .select2-selection--single,
    .left-sidebox .select2-container--default .select2-selection--multiple {
        height: 35px !important;
        border: 1px solid #dbdbdb;
        background-color: #ffffff;
    }

    .font22 {
        font-size: 22px !important
    }

    .total-amt-top {
        float: right
    }

    .custom-select-cs {
        width: 100px;
        border-radius: 0;
        width: 100px;
        border-radius: 0;
        margin-top: 11px;
        background-color: #f6f6f6;
        height: 28px;
    }

    .TAM-div {
        font-family: 'Rationale', sans-serif !important;
        font-size: 28px;
        line-height: 1;
        text-align: right;
    }

    .TAM-div small {
        display: block;
        font-size: 13px;
        font-family: 'proximanova-light', sans-serif !important;
        letter-spacing: 1px
    }

    .inputfileds-top {
        font-size: 14px;
        line-height: 30px;
        border-bottom: solid 1px #dbdbdb
    }

    .inputfileds,
    .inputfileds-top .custom-select-sm {
        font-size: 13px;
        line-height: normal;
        width: 110px;
        border-radius: 0;
        float: right;
        margin-left: 8px;
        border: solid 1px #dbdbdb;
        height: 28px;
        padding-left: 5px;
        padding-right: 5px;
        margin-bottom: 15px;
    }

    .datefileds {
        width: 125px;
    }

    .inputfileds::-webkit-calendar-picker-indicator {
        margin: 2px
    }

    .inputvalue {
        width: 110px;
        border-radius: 0;
        border: solid 1px #dbdbdb;
        background-color: #f6f6f6;
        height: 24px;
        padding-left: 5px;
        padding-right: 5px;
    }

    ._notesTER {
        font-size: 14px;
        border: none
    }

    .textarea-HA,
    .textarea-NOTES,
    .textarea-TERMS,
    .textarea-PMessage {
        border: solid 1px #dbdbdb;
        margin-top: 5px
    }

    .ProductTable {
        width: 100%;
        margin-top: 15px;
        line-height: normal
    }

    .ProductTable th {
        font-family: proximanova-semibold, sans-serif !important;
        background-color: #f6f6f6;
        border-bottom: solid 1px #f6f6f6;
        border-top: solid 1px #f6f6f6;
        border-right: solid 1px #f6f6f6;
        font-size: 12px;
        text-align: left;
        padding: 3px;
    }

    .ProductTable th,
    .ProductTable td {
        font-size: 12px;
        padding: 8px 5px;
        letter-spacing: normal
    }

    .ProductTable td {
        border-bottom: solid 1px #f6f6f6;
        border-right: solid 1px #f6f6f6;
        font-size: 12px;
        text-align: left;
    }

    .ProductTable td:first-child,
    .ProductTable th:first-child {
        border-left: solid 1px #f6f6f6;
    }

    .inputtable {
        border: solid 1px #dbdbdb;
        font-size: 12px;
        width: 70px;
        height: 24px;
    }

    ._order-delete {
        font-size: 15px;
        padding: 0px;
        margin: 0px;
        color: #ffffff;
    }

    ._order-delete .fa {
        color: #868686;
        padding: 0;
        margin: 0
    }

    ._order-delete:HOVER .fa {
        color: #f12300
    }

    .totalValues {
        font-size: 14px;
        font-family: proximanova-semibold, sans-serif !important;
    }

    .totalValues td {
        padding: 7px 0px 7px 7px
    }

    .totalNo {
        font-family: 'Rationale', sans-serif !important;
        font-size: 24px;
        line-height: 1
    }

    .td-pn {
        width: 210px;
    }

    .se_cus-type .form-control,
    .se_cus-type .form-s2 .select2-container .select2-selection--single,
    .AddDetailPR .form-s2 .select2-container .select2-selection--single {
        border: 1px solid #eeeeee;
        background-color: #fff;
    }

    .mb-15 {
        margin-bottom: 15px
    }

    .PT-8 {
        padding-top: 8px
    }


    @media (min-width: 1024px) {
        .left-sidebox {
            -ms-flex: 250px;
            flex: 0 0 250px;
            max-width: 250px;
            letter-spacing: normal
        }

        .right-sidebox {
            -ms-flex: 0 0 772px;
            flex: 0 0 772px;
            max-width: 772px;
        }

        .td-pn {
            width: 100px;
        }
    }

    @media (max-width: 1024px) {
        .CompanyInfo {
            line-height: 18px;
            font-size: 13px
        }

        .title {
            position: relative;
            font-size: 18px;
            margin-bottom: 8px;
            padding-bottom: 8px;
            padding-top: 8px;
        }
    }

    @media (min-width: 1280px) {
        .inputfileds-top {
            font-size: 13px
        }

        .inputfileds-top .col-auto {
            padding-left: 10px;
        }

        .left-sidebox {
            -ms-flex: 330px;
            flex: 0 0 330px;
            max-width: 330px;
            letter-spacing: normal
        }

        .right-sidebox {
            -ms-flex: 0 0 947px;
            flex: 0 0 947px;
            max-width: 947px;
        }

        .td-pn {
            width: 160px;
        }

    }

    @media (min-width: 1366px) {
        .left-sidebox {
            -ms-flex: 350px;
            flex: 0 0 350px;
            max-width: 350px;
        }

        .right-sidebox {
            -ms-flex: 0 0 999px;
            flex: 0 0 999px;
            max-width: 999px;
        }

        .td-pn {
            width: 190px;
        }
    }

    @media (min-width: 1440px) {
        .left-sidebox {
            -ms-flex: 380px;
            flex: 0 0 380px;
            max-width: 380px;
        }

        .right-sidebox {
            -ms-flex: 0 0 1044px;
            flex: 0 0 1044px;
            max-width: 1044px;
        }

    }
</style>
<div class="container-fluid">
    <div class="row">

        <div class="col-md-4 left-sidebox">

            <div class="sidebox-content">
                <div class="CT_sec">
                    <h2 class="title pt-0 mb-2 border-bottom">Invoice <span>Details</span></h2>
                    <!-- <div class="col-md-12 PB-10">
                        <label class="font13 mb-5">Invoice Type</label>
                        <div class="form-s2">
                            <select class="form-control formselect form_clear required" name="invoice_type" id="invoice_type" value="{{@$invoice->invoice_type}}" {{@$invoice->customer_id ? 'disabled' : ''}}>
                                <option value="1" {{@$invoice->invoice_type == 1 ? 'selected' : ''}}>Net Sale</option>
                                <option value="2" {{@$invoice->invoice_type == 2 ? 'selected' : ''}}>Add To Ledger</option>
                            </select>
                            @if (@$invoice->customer_id)
                            <input type="hidden" name="invoice_type" value="{{ @$invoice->invoice_type }}">
                            @endif
                        </div>
                    </div> -->
                    <!-- <div class="col-md-12 PB-10">
                        <label class="font13 mb-5">Invoice #</label>
                        <div class="form-s2">
                            <input type="text" id="" class="form-control required" placeholder="" name="invoice_no" value="{{@$invoice ? $invoice->invoice_no : $invoice_no}}">

                        </div>
                    </div> -->
                    <!-- <div class="col-md-12 PB-10">
                        <label class="font13 mb-5">Date</label>
                        <div class="form-s2">
                            <input type="Date" name="invoice_date" class="form-control new_dob new_form_field " value="{{@$invoice ? $invoice->created_at->format('Y-d-m') : $current_date}}">
                        </div>
                    </div> -->
                    <div class="form-wrap p-0">
                        <div class="row">
                            <div class="col-md-12">
                                <label class="font13 mb-5">Select Customer</label>
                                <div class="form-s2">
                                    <select class="form-control formselect form_clear required" placeholder="Select Customer" name="customer_id" id="customer_id" {{@$invoice->customer_id ? 'disabled' : ''}}>
                                        <option value="0">Select Customer</option>
                                        @foreach($customers as $customer)
                                        <option value="{{$customer->id}}" {{$customer->id == @$invoice->customer_id ? 'selected' : ''}}>{{$customer->customer_name}}</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>

                        </div>
                    </div>

                    <h2 class="title border-bottom">Company <span>Details</span></h2>
                    <div class="row CompanyInfo">
                        <div class="col-md-5 pr-0"><strong>Stock Balance:</strong> </div>
                        <div class="col-md-7"><span class="stock_balance">0</span></div>
                        <div class="col-md-5 pr-0"><strong>Retail Price:</strong></div>
                        <div class="col-md-7"><span class="retail_price">0</span></div>
                        <div class="col-md-5 pr-0"><strong>Previous Receivable :</strong> </div>
                        <div class="col-md-7"><span class="dashboard_avg_rev_perCust previous_payable">0</span></div>
                        <!-- <div class="col-md-5 pr-0"><strong>Country:</strong></div>
                        <div class="col-md-7"><span id="country"></span></div> -->
                    </div>
                    <!-- <h2 class="title m-0 pb-0">Shipping <span>Details</span></h2> -->
                </div>

                <!-- <div class="left_Info_">

                    <div class="row" style="margin-right:-5px; padding-bottom: 20px;">
                        <div class="col-md-12 PB-10">
                            <label class="font13 mb-5">Country Of Origin</label>
                            <div class="form-s2">
                                <select class="form-control formselect" placeholder="select Country Of Origin" name="country_of_origin">
                                    <option disabled selected>Select Country Of Origin</option>
                                    <option selected value="Pakistan">Pakistan</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-12 PB-10">
                            <label class="font13 mb-5">Port of Loading</label>
                            <div class="form-s2">
                                <select class="form-control formselect" placeholder="select Port of Loading" name="port_of_loading">
                                    <option disabled selected>Select Port of Loading</option>

                                    <option value=" ">Select Port of Lo </option>

                                </select>
                            </div>
                        </div>
                        <div class="col-md-12 PB-10">
                            <label class="font13 mb-5">Port of Discharge</label>
                            <div class="form-s2">
                                <select class="form-control formselect" placeholder="select Port of Discharge" name="port_of_discharge">
                                    <option disabled selected>Select Port of Discharge</option>

                                </select>
                            </div>
                        </div>
                        <div class="col-md-12 PB-10">
                            <label class="font13 mb-5">Mode of Shipment</label>
                            <div class="form-s2">
                                <select class="form-control formselect" placeholder="select Mode of Shipment" name="mode_of_shipment">
                                    <option disabled selected>Select Mode of Shipment</option>
                                    <option value="Sea">By Sea</option>
                                    <option value="Land">By Land</option>
                                    <option value="Air">By Air</option>
                                </select>
                            </div>
                        </div>


                        <div class="col-md-12 mb-20 nonFobDiv">
                            <label class="font12">Select Route</label>
                            <div class="form-s2">
                                <select class="form-control sd-type" name="shipping_route" multiple="multiple" style="width: 100%">

                                </select>
                            </div>
                        </div>



                        <div class="col-md-12 PB-10">
                            <label class="font13 mb-5">Shipped Via</label>
                            <div class="form-s2">
                                <select class="form-control formselect" placeholder="Select Shipped Via" name="shipment_company">
                                    <option disabled selected>Select Company Name</option>

                                </select>
                            </div>
                        </div>
                    </div>
                </div> -->


            </div>
        </div>

        <div class="col-md-8 right-sid ebox">

            <div class="row">
                <div class="col-6">
                    <h2 class="title font22 PT-10 mb-10">New <span>Order</span></h2>
                </div>
                <div class="col p-0 text-right">
                    <select class="custom-select custom-select-sm custom-select-cs" id="currencySelector">
                        <option sign="$" value="USD" selected>USD - United States Dollar
                        </option>
                        <option sign="EUR" value="EUR">EUR - Euro
                        </option>
                        <option sign="Rs" value="PKR">PKR - Pakistan Rupees
                        </option>
                        <option sign="HK$" value="HKD">HKD — Hong Kong dollar</option>
                        <option sign="AFN" value="AFN">AFN — Afghani</option>
                    </select>
                </div>
                <div class="col-auto PL-10">
                    <div class="total-amt-top">
                        <div class="TAM-div"><small>Amount Dues</small><span id="amount_due">0</span></div>
                    </div>
                </div>
            </div>

            <div class="right_Info">
                <div class="row inputfileds-top">
                    <div class="col-auto pr-0">Invoice #
                        <input type="text" id="" class="inputfileds required" placeholder="" name="invoice_no" value="{{@$invoice ? $invoice->invoice_no : $invoice_no}}">
                    </div>
                    <div class="col-auto pr-0">Date
                        <input type="Date" name="invoice_date" class="inputfileds datefileds new_dob new_form_field " value="{{@$invoice ? $invoice->created_at->format('Y-d-m') : $current_date}}">
                    </div>
                    <!-- <div class="col-auto pr-0">DOD <input type="Date" name="expected_delivery_date" class="inputfileds datefileds"> </div> -->
                    <!-- <div class="col-auto pr-0">PO.NO. <input type="text" class="inputfileds" id="poNumForm"></div> -->
                    <div class="col-auto pr-0">Invoice Type
                        <select class="custom-select custom-select-sm form_clear required" name="invoice_type" id="invoice_type" value="{{@$invoice->invoice_type}}" {{@$invoice->customer_id ? 'disabled' : ''}}>
                            <option value="1" {{@$invoice->invoice_type == 1 ? 'selected' : ''}}>Net Sale</option>
                            <option value="2" {{@$invoice->invoice_type == 2 ? 'selected' : ''}}>Add To Ledger</option>
                        </select>
                        @if (@$invoice->customer_id)
                        <input type="hidden" name="invoice_type" value="{{ @$invoice->invoice_type }}">
                        @endif
                    </div>
                </div>

                <div class="row">
                    <div class="col-12">
                        <table class="ProductTable" width="100%" border="0" cellspacing="0" cellpadding="0">
                            <thead>
                                <tr>
                                    <th class="td-pn">Product Name</th>
                                    <th class="td-bp">Packing</th>
                                    <th style="width:95px">NET WT (GMS)</th>
                                    <th style="width:70px">Total CTNs</th>
                                    <th style="width:90px">NET WT/CTN</th>
                                    <th style="width:90px">GR. WT/CTN</th>
                                    <th style="width:70px">QTY.</th>
                                    <th style="width:70px">Unit Price</th>
                                    <th class="td-pr">Total</th>
                                    <th style="width:28px;"></th>
                                </tr>
                            </thead>
                            <tbody id="productGrid">

                            </tbody>
                        </table>

                    </div>
                </div>

                <div class="row">
                    <div class="col-12"><button id="productlist01" class="btn add-product-line list-customer-products"><i class="fa fa-plus"> </i> Add a Product</button></div>
                </div>

                <div class="row">
                    <div class="col-12">
                        <table class="totalValues" width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td align="right">Discount%</td>
                                    <td style="width:112px"><input type="text" name="discount" id="discount" class="inputvalue" style="font-size: 13px" placeholder="0.00" onkeypress="return isNumber(event)"></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td align="right">Freight Charges</td>
                                    <td><input type="text" class="inputvalue" id="freight_charges" name="freight_charges" style="font-size: 13px" placeholder="0.00" onkeypress="return isNumber(event)"></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td align="right">Insurance Charges</td>
                                    <td><input type="text" class="inputvalue" id="insurance_charges" name="insurance_charges" style="font-size: 13px" placeholder="0.00" onkeypress="return isNumber(event)"></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td align="right">Genset Charges</td>
                                    <td><input type="text" class="inputvalue" id="genset_charges" name="genset_charges" style="font-size: 13px" placeholder="0.00" onkeypress="return isNumber(event)"></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style="border:solid 1px #dbdbdb">
                                    <td class="font18" align="right">Total:</td>
                                    <td class="totalNo" align="right"><span id="total_ctn">0</span><small>CTNS</small></td>
                                    <td class="totalNo" align="right"></td>
                                    <td class="totalNo" align="right"><small>USD.</small><span id="total_price">0</span></td>

                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>

                <div class="row _notesTER">
                    <div class="col-md-6">
                        Notes
                        <textarea class="textarea-NOTES" name="performa_notes" rows='2' placeholder="Enter Notes or bank transfer details" style="font-size: 13px"></textarea>
                    </div>

                    <div class="col-md-6">
                        Terms
                        <textarea class="textarea-TERMS" name="performa_terms" rows='2' placeholder="Enter your terms and conditions" style="font-size: 13px"></textarea>
                    </div>
                </div>

                <div style="background-color: #f6f6f6; padding:10px; margin-top: 15px; margin-bottom: 0px; text-align: right; margin-bottom: 1px">
                    <button type="submit" class="btn btn-primary mr-2" onclick="savePerforma();">Save</button>
                    <button id="pl-close" type="submit" class="btn btn-cancel mr-2">Cancel</button>
                </div>

            </div>
        </div>

    </div>
</div>

</div>
@endsection
@section('content')


@endsection