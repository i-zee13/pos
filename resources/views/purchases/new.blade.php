@extends('layouts.app')
 <div class="loader-div" id="tblLoader">
                            <div class="lds-ring" aria-role="none">
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                            </div>
                          </div>
<div class="parent-div" style="display:none">

    @section('content')
    <style>
        .container {
            max-width: 1370px;
        }

        select:focus>option:checked {
            background: #000 !important;
        }

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

        .inputSale {
            width: 90;
            border-radius: 0;
            border: solid 1px #dbdbdb;
            background-color: #f6f6f6;
            height: 24px;
            padding-left: 5px;
            padding-right: 5px;
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

        .form-s2 .select2-container .select2-selection--single {
            height: 30px !important;
            border: solid 1px #dbdbdb;
            background-color: #ffffff;
        }

        .form-s2 .select2-container--default .select2-selection--single .select2-selection__rendered {
            line-height: 30px !important;
            font-size: 13px;
        }

        .select2-container--default .select2-selection--single .select2-selection__arrow {
            top: 0px !important;
        }
    </style>
    <div class="container-fluid">
        <form id="form" enctype="multipart/form-data" class="">
            @csrf
            <div class="row">

                <input type="hidden" id="hidden_invoice_id" class="form-control " value="{{@$invoice->id}}" name="hidden_invoice_id">
                <input type="hidden" id="curren_customer_id" class="form-control " value="{{@$invoice->customer_id}}" name="customer_id">
                <input type="hidden" id="service_charges" class="form-control " value="{{@$invoice->service_charges}}" name="service_charges">
                <input type="hidden" id="customer_ledger" value="{{json_encode(@$get_customer_ledger)}}">
                <input type="hidden" name="previous_receivable" id="previous_receivable" value="">

                <input type="hidden" id="" value="1" name="form_status">
                <input type="hidden" id="stock_products" value="{{json_encode($products)}}">
                <div class="col-md-4 left-sidebox ">
                    <div class="sidebox-content text-white" style="background-color: #152e4d">
                        <div class="CT_sec">
                            <h2 class="title pt-0 mb-2 border-bottom">Invoice <span>Details</span></h2>
                            <div class="col-md-12 PB-10">
                                <label class="font13 mb-5">Invoice Type</label>
                                <div class="form-s2">
                                    <select class="form-control formselect form_clear required" name="invoice_type" id="invoice_type" value="{{@$invoice->invoice_type}}" {{@$invoice->customer_id ? 'disabled' : ''}}>
                                        <option value="1" {{@$invoice->invoice_type == 1 ? 'selected' : ''}}>Net Purchse</option>
                                        <option value="2" {{@$invoice->invoice_type == 2 ? 'selected' : ''}}>Add To Ledger</option>
                                    </select>
                                    @if (@$invoice->customer_id)
                                    <input type="hidden" name="invoice_type" value="{{ @$invoice->invoice_type }}">
                                    @endif
                                </div>
                            </div>
                            <div class="col-md-12 PB-10">
                                <label class="font13 mb-5">Invoice #</label>
                                <div class="form-s2">
                                    <input type="text" id="" class="form-control" value="{{@$invoice_first_part}}">
                                    <input type="hidden" id="" class="form-control required" placeholder="" name="invoice_no" value="{{@$invoice ? $invoice->invoice_no : $invoice_no}}">

                                </div>
                            </div>
                            <div class="col-md-12 PB-10">
                                <label class="font13 mb-5">Date</label>
                                <div class="form-s2">
                                    <input type="Date" name="invoice_date" class="form-control new_dob new_form_field " value="{{ @$invoice ? $invoice->date : $current_date }}">
                                </div>
                            </div>
                            <div class="form-wrap p-0">
                                <div class="row">
                                    <div class="col-md-12">
                                        <label class="font13 mb-5">Select Vendor</label>
                                        <div class="form-s2">
                                            <select class="form-control formselect form_clear  " placeholder="Select Customer" name="customer_id" id="customer_id" {{@$invoice->customer_id ? 'disabled' : ''}}>
                                                <option value="0">Select Customer</option>
                                                @foreach($customers as $customer)
                                                <option value="{{$customer->id}}" {{$customer->id == @$invoice->customer_id ? 'selected' : ''}}>{{$customer->id}} - {{$customer->customer_name}}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="form-wrap p-0">
                                <div class="row">
                                    <div class="col-md-12">
                                        <label class="font13 mb-5">Description</label>
                                        <div class="form-s2">
                                            <textarea rows="4"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <h2 class="title border-bottom">Invoice <span>Details</span></h2>
                            <div class="row CompanyInfo">
                                <!-- <div class="col-md-7 pr-0"><strong>Old Recived:</strong> </div>
                                <div class="col-md-5"><span class=" text-red">{{@$invoice->amount_received}}</span></div>
                                <div class="col-md-7 pr-0"><strong>Previous Paid :</strong></div>
                                <div class="col-md-5"><span class="">{{@$invoice->paid_amount}}</span></div> -->
                                <div class="col-md-7 pr-0"><strong class="previous_payable_heading">Previous Payable :</strong> </div>

                                <div class="col-md-5"><span class="dashboard_avg_rev_perCust {{ request()->query('invoice') == 'detail' ? '' : 'previous_payable' }}">{{ request()->query('invoice') == 'detail' ? $invoice->previous_receivable : '' }}</span></div>
                                <!-- <div class="col-md-7 pr-0"><strong>Country:</strong></div>
                        <div class="col-md-5"><span id="country"></span></div> -->
                            </div>
                            <!-- <h2 class="title m-0 pb-0">Shipping <span>Details</span></h2> -->
                        </div>


                    </div>
                </div>
                <div class="col-md-8 right-sid ebox">

                    <div class="row">
                        <div class="col-6">
                            <h2 class="title font22 PT-10 mb-10">{{Route::currentRouteName() == 'sale-edit' ? 'Sale' : 'New'}} <span>Invoice</span></h2>
                        </div>


                    </div>

                    <div class="right_Info">
                        <div class="row inputfileds-top">
                            <div class="row CompanyInfo">
                                <div class="col-md-3"><strong class="show_purchase">P.P:</strong> <span class="pp" style="display:none"></span></div>
                                <div class="col-md-5"><strong>Retail Price:</strong> <span class="retail_price ml-10" style="font-family: 'Rationale', sans-serif !important;font-size: 27px;color:red">0</span></div>

                                <div class="col-md-4 pr-0"><strong>Stock Balance:</strong><span class="stock_balance ml-10" style="font-family: 'Rationale', sans-serif !important;font-size: 27px;color:red">0</span></div>

                            </div>


                            <div class="infoDiv">
                                <form id="purchse-form">
                                    <div class="row">

                                        <input type="text" id="purchase_price" class="inputfileds  purchase_price " placeholder="" name="purchase_price" hidden>
                                        <input type="text" id="retail _price" class="inputfileds" placeholder="" name="ret ail_price" hidden>

                                        <input id="datepicker" type="hidden" class="inputfileds new_dob new_form_field expiry_date " name="expiry_date">


                                    </div>
                                </form>
                            </div>

                        </div>
                        <style>
                            .ProductTable tbody tr:hover td {
                                background: #152e4d !important;

                                color: white !important;
                            }
                        </style>
                        <div class="row">
                            <div class="col-12" id="table-container">
                                <table class="ProductTable table  " id="designationsTable" width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <thead>
                                        <tr>
                                            <th class="">ID</th>
                                            <th class="">Select Product</th>
                                            <th style="">QTY.</th>
                                            <th style="">Unit Price</th>
                                            <th style="">Discount</th>
                                            <th class="">Total</th>
                                            <th style="">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody id="productGrid">
                                        <tr>
                                            <td><input type="text" id="bar-code" class="inputSale bar-code" placeholder="" name="bar_code" data-attr='bar_code' tabindex="1" style="width: 50;"></td>
                                            <td>
                                                <div class="form-s2" style="width:165px">
                                                    <select class="inputfileds formselect products" name="product_name" id="products" tabindex="2" style="width: 150;">
                                                        <option value="0">Select Product *</option>
                                                        @foreach($products as $product)
                                                        <option value="{{$product->id}}">{{$product->id}}-{{$product->product_name}}</option>
                                                        @endforeach
                                                    </select>
                                                </div>
                                            </td>
                                            <td> <input type="text" id="qty" class="inputSale only_numerics" placeholder="" name="qty" tabindex="3" min="0"></td>
                                            <td><input type="number" id="retail_price" class="inputSale" placeholder="" name="retail_price" style="font-size: 13px;" readonly></td>
                                            <td><input type="number" id="discount" class="inputSale" placeholder="" name="discount" style="font-size: 13px;" tabindex="4" min="0"></td>
                                            <td class='add- S-input '><input type="text" id="amount" class="inputSale" placeholder="" name="amount" style="font-size: 13px;"></td>
                                            <td>
                                                <button type="button" id="add-product" class="btn btn-primary smBTN mr-2" tabindex="5" style="padding: 5px 15px 5px 15px; background:green">Add</button>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>

                            </div>
                        </div>

                        <!-- <div class="row">
                        <div class="col-12"><button id="productlist01" class="btn add-product-line list-customer-products"><i class="fa fa-plus"> </i> Add a Product</button></div>
                    </div> -->

                        <div class="row">
                            <div class="col-12">
                                <table class="totalValues" width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tbody>
                                        <tr class="th-to-hide">
                                            <td></td>
                                            <td></td>
                                            <td align="right">Net Total</td>

                                            <td> <input type="number" class="inputvalue product_net_total" name="product_net_total" style="font-size: 13px" placeholder="0.00" readonly></td>
                                        </tr>
                                        <tr class="th-to-hide">
                                            <td></td>
                                            <td></td>
                                            <td align="right">Service charges </td>
                                            <td style="width:112px"><input type="number" name="discount" id="discount" class="inputvalue service_charges_input" style="font-size: 13px" value="{{@$invoice->service_charges}}" placeholder="0.00" onkeypress="return isNumber(event)" data-id="" data-value="" min="0"></td>
                                        </tr>
                                        <tr class="previous_payable_tr" style="display:none">
                                            <td></td>
                                            <td></td>
                                            <td align="right" class="previous_payable_heading">Previous Payable</td>
                                            <td class="{{ request()->query('invoice') == 'detail' ? '' : 'previous_payable' }}">{{ request()->query('invoice') == 'detail' ? $invoice->previous_receivable : '0' }}</td>
                                        </tr>

                                        <tr class="th-to-hide">
                                            <td></td>
                                            <td></td>
                                            <td align="right">Disscount</td>
                                            <td> <input type="number" class="inputvalue " id="invoice_discount" name="invoice_discount" style="font-size: 13px" placeholder="0.00" min="0" value="{{@$invoice->invoice_discount}}"></td>

                                        </tr>
                                        <tr class="th-to-hide">
                                            <td></td>
                                            <td></td>
                                            <td align="right">Net Amount</td>

                                            <td>
                                                @if(request()->query('invoice') == 'detail')
                                                {{$invoice->invoice_remaining_amount_after_pay}}
                                                @else
                                                <input type="number" class="inputvalue  remaning_amount amount_pay_input " id="amount_ to_pay" name="amount_to_pay" style="font-size: 13px" placeholder="0.00" readonly value="{{@$invoice->paid_amount}}">
                                                @endif
                                            </td>
                                        </tr>

                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td align="right" class="cash-return">Cash Recived </td>
                                            <td><input type="number" class="inputvalue amount_received" id="amount_received" name="amount_received" style="font-size: 13px" placeholder="0.00" onkeypress="return isNumber(event)" value="{{@$invoice->amount_received}}"></td>
                                        </tr>


                                        <tr class="cash_return_tr" style="display:none">
                                            <td></td>
                                            <td></td>
                                            <td align="right">Cash Return</td>
                                            <td class="cash_return">{{@$invoice->cash_return}}</td>
                                        </tr>
                                        @if (Route::currentRouteName() == 'sale-edit')

                                        <tr class="th-to-hide" hidden>
                                            <td></td>
                                            <td></td>
                                            <td align="right">Paid</td>
                                            <td class="paid_amount">{{@$invoice->paid_amount}}</td>
                                        </tr>
                                        @endif
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr style="border:solid 1px #dbdbdb">
                                            <td class="font18" align="right">Grand Total:</td>
                                            <td class="totalNo" align="right">
                                                <!-- <span id="total_ctn">0</span><small>CTNS</small> -->
                                            </td>
                                            <td class="totalNo" align="right"></td>
                                            <td class="totalNo" align="right"><small>Pkr.</small>
                                                @if(request()->query('invoice') == 'detail')
                                                <span>{{$invoice->invoice_remaining_amount_after_pay}}</span>
                                                @else
                                                <span class="grand-total">0.00</span>
                                                @endif
                                            </td>

                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>

                        <!-- <div class="row _notesTER">
                        <div class="col-md-6">
                            Notes
                            <textarea class="t  extarea-NOTES" name="performa_notes" rows='2' placeholder="Enter Notes or bank transfer details" style="font-size: 13px"></textarea>
                        </div>

                        <div class="col-md-6">
                            Terms
                            <textarea class="textarea-TERMS" name="performa_terms" rows='2' placeholder="Enter your terms and conditions" style="font-size: 13px"></textarea>
                        </div>
                    </div> -->

                        <div style="background-color: #f6f6f6; padding:10px; margin-top: 15px; margin-bottom: 0px; text-align: right; margin-bottom: 1px" id="btns_div">
                            @if(request()->query('invoice') == 'detail')
                            <a href="{{route('sales')}}" type="submit" class="btn btn-primary" id="cancel">Back</a>
                            @else
                            <button type="button" id="save" class="btn btn-primary mr-2">Save</button>
                            <button type="button" id="print-invoice" class="btn btn-primary mr-2">Print</button>
                            <a href="{{route('sales')}}" type="submit" class="btn btn-cancel" id="cancel">Cancel</a>
                            @endif
                        </div>
                    </div>
                </div>

            </div>
        </form>
    </div>

</div>
</div>
@endsection
@push('js')
<script>
    var clients = JSON.parse('{!! json_encode($customers)  !!}');
</script>
<script src="{{mix('js/custom/stock.js')}}"> </script>

@endpush