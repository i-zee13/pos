@extends('layouts.app')
<div style="min-height: 400px" id="tblLoader">
    <img src="/images/loader.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
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
            max-width: 320px;
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

    @media (min-width: 768px) {
        .col-md-8 {
            flex: 0 0 auto;
            width: 70.66667%;
        }
    }
</style>
<div class="parent-div">
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
                <div class="col-md-4 left-sidebox">
                    <div class="sidebox-content text-white" style="background-color: #152e4d">
                        <div class="CT_sec">
                            <h2 class="title pt-0 mb-2 border-bottom">Invoice <span>Details</span></h2>
                            <div class="col-md-12 PB-10">
                                <label class="font13 mb-5">Invoice Type</label>
                                <div class="form-s2">
                                    <select class="form-control formselect form_clear required" name="invoice_type" id="invoice_type" value="{{@$invoice->invoice_type}}" {{@$invoice->customer_id ? 'disabled' : ''}}>
                                        <option value="1" {{@$invoice->invoice_type == 1 ? 'selected' : ''}}>Net Sale</option>
                                        <option value="2" {{@$invoice->invoice_type == 2 ? 'selected' : ''}}>Add To Ledger</option>
                                    </select>
                                    @if (@$invoice->customer_id)
                                    <input type="hidden" name="invoice_type" value="{{@$invoice->invoice_type }}">
                                    @endif
                                </div>
                            </div>
                            <div class="col-md-12 PB-10">
                                <label class="font13 mb-5">Invoice #</label>
                                <div class="form-s2">
                                    <input type="text" id="" class="form-control" value="{{@$invoice->first_part}}">
                                </div>
                            </div>
                            <div class="col-md-12 PB-10">
                                <label class="font13 mb-5">Date</label>
                                <div class="form-s2">
                                    <input type="Date" name="invoice_date" class="form-control new_dob new_form_field " value="{{$invoice->date}}">
                                </div>
                            </div>
                            <div class="form-wrap p-0">
                                <div class="row">
                                    <div class="col-md-12">
                                        <label class="font13 mb-5">Customers *</label>
                                        <div class="form-s2">
                                            <input type="text" name="customer_id" class="form-control" value="{{ @$invoice->customer_name}}">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h2 class="title border-bottom">{{ @$invoice->customer_name}} <span>Ledger</span></h2>
                            <div class="row CompanyInfo">
                                <div class="col-md-7 pr-0"><strong class="previous_payable_heading">Previous Receivable :</strong> </div>
                                <div class="col-md-5"><span class="dashboard_avg_rev_perCust">{{ $invoice->previous_receivable }}</span></div>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="col-md-8 right-sid ebox">

                    <div class="row">
                        <div class="col-6">
                            <h2 class="title font22 PT-10 mb-10">{{$invoice->customer_name}} <span>Invoice</span></h2>
                        </div>

                    </div>

                    <div class="right_Info">
                        <div class="row inputfileds-top">
                            <div class="row CompanyInfo">
                                <div class="col-md-3"><strong class="show_purchase">P.P:</strong> <span class="pp" style="display:none"></span></div>
                                <div class="col-md-5"><strong>Retail Price:</strong> <span class="retail_price ml-10" style="font-family: 'Rationale', sans-serif !important;font-size: 27px;color:red">0</span></div>
                                <div class="col-md-4 pr-0"><strong>Stock Balance:</strong><span class="stock_balance ml-10" style="font-family: 'Rationale', sans-serif !important;font-size: 27px;color:red">0</span></div>
                                <!-- <div class="col-md-3 pr-0"><strong>Replace:</strong><input type="checkbox" name="replacement_checbox" class="replacement_checbox"></div> -->
                            </div>
                        </div>
                        <style>
                            .ProductTable tbody tr:hover td {
                                background: #152e4d !important;
                                color: white !important;
                            }
                        </style>
                        <div class="row">
                            <div class="row">
                                <div class="col-2">
                                    <h5 class="title PT-10 in-out" style=" background-color: green; ">IN</h2>
                                </div>
                            </div>
                            <div class="col-12" id="table-container" style="min-height:150px;">
                                <table class="ProductTable table designationsTable" id="designationsTable" width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <thead>
                                        <tr>
                                            <th class="">ID</th>
                                            <th class="">Select Product</th>
                                            <th style="">Expiry D.</th>
                                            <th style="">QTY.</th>
                                            <th style="">Unit Price</th>
                                            <th style="">Discount</th>
                                            <th class="">Total</th>

                                        </tr>
                                    </thead>
                                    <tbody id="productGrid" class="parent_body in_table">
                                        @foreach($invoice->invoice_products as $product)
                                        @if($product->product_type == 1)
                                        <tr id='tr-{{ $product->product_id }}'>
                                            <td>{{ $product->product_id }}</td>
                                            <td>{{ $product->product_name }}</td>
                                            <td> <input readonly type="date" id="expiry_date" class="inputSale expiry_date" value="{{ $product->expiry_date }}" name="expiry_date " tabindex="5" style=" width: 95;"></td>
                                            <td> <input readonly type="number" value="{{$product->qty}}" class="inputSale qty-input add-stock-input " min="0"></td>
                                            <td> <input readonly type="number" value="{{ $product->sale_price }}" class="inputSale price-input add-stock-input td-{{ $product->product_id }}" min="0"></td>
                                            <td> <input readonly type="number" value="{{ $product->product_discount }}" class="inputSale discount-input add-stock-input td-{{ $product->product_id }}" style="font-size: 13px" min="0"></td>
                                            <td class='purchase-product-amount{{ $product->product_id }} add-S-input'>{{$product->sale_total_amount}} </td>
                                        </tr>
                                        @endif
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="row">
                            <div class="row">
                                <style>
                                    .in-out {
                                        width: 60px;
                                        font-size: 15px;
                                        font-family: 'Courier New', Courier, monospace;

                                        margin-bottom: 0px;
                                        margin-top: 9px;
                                        color: white;
                                        padding: 0px 0px 8px 17px;
                                    }
                                </style>
                                <div class="col-2">
                                    <h5 class="title PT-10 in-out" style=" background-color: red; ">OUT</h2>
                                </div>
                            </div>
                            <div class="col-12" id="table-container">
                                <table class="ProductTable table designationsTable" id="designationsTable" width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <thead>
                                        <tr>
                                            <th class="">ID</th>
                                            <th class="">Select Product</th>
                                            <th style="">Expiry D.</th>
                                            <th style="">QTY.</th>
                                            <th style="">Unit Price</th>
                                            <th style="">Discount</th>
                                            <th class="">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody id="productGrid" class="parent_body out_table">
                                    <tbody id="productGrid" class="parent_body in_table">
                                        @foreach($invoice->invoice_products as $product)
                                        @if($product->product_type == 2)
                                        <tr id='tr-{{ $product->product_id }}'>
                                            <td>{{ $product->product_id }}</td>
                                            <td>{{ $product->product_name }}</td>
                                            <td> <input readonly type="date" id="expiry_date" class="inputSale expiry_date" value="{{ $product->expiry_date }}" name="expiry_date " tabindex="5" style=" width: 95;"></td>
                                            <td> <input readonly type="number" value="{{$product->qty}}" class="inputSale qty-input add-stock-input " min="0"></td>
                                            <td> <input readonly type="number" value="{{ $product->sale_price }}" class="inputSale price-input add-stock-input td-{{ $product->product_id }}" min="0"></td>
                                            <td> <input readonly type="number" value="{{ $product->product_discount }}" class="inputSale discount-input add-stock-input td-{{ $product->product_id }}" style="font-size: 13px" min="0"></td>
                                            <td class='purchase-product-amount{{ $product->product_id }} add-S-input'>{{$product->sale_total_amount}} </td>

                                        </tr>
                                        @endif
                                        @endforeach
                                    </tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div> 
                        <div class="row">
                            <div class="col-12">
                                <table class="totalValues" width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tbody>
                                        <tr class="th-to-hide">
                                            <td></td>
                                            <td></td>
                                            <td align="right">Return Total</td>
                                            <td> <input readonly type="number" class="inputvalue product_net_total" name="product_net_total" style="font-size: 13px" value="{{$invoice->product_return_total}}" readonly></td>
                                        </tr>
                                        <tr class="th-to-hide">
                                            <td></td>
                                            <td></td>
                                            <td align="right">Sale Total</td>
                                            <td> <input readonly type="number" class="inputvalue product_net_total" name="product_net_total" style="font-size: 13px" value="{{$invoice->product_net_total}}" readonly></td>
                                        </tr>
                                        <tr class="th-to-hide">
                                            <td></td>
                                            <td></td>
                                            <td align="right">Service charges </td>
                                            <td style="width:112px"><input readonly type="number" name="discount" id="discount" class="inputvalue service_charges_input" style="font-size: 13px" value="{{@$invoice->service_charges}}" placeholder="0.00" data-id="" data-value="" min="0"></td>
                                        </tr>
                                        <tr class="previous_payable_tr" @if ($invoice->invoice_type != 2) style="display:none" @endif >
                                            <td></td>
                                            <td></td>
                                            <td align="right" class="previous_payable_heading">{{ $invoice->previous_receivable > 0 ? 'Previous Payable' : 'Previous Receivable' }}</td>
                                            <td class=" ">{{ $invoice->previous_receivable }} {{$invoice->previous_receivable > 0 ? 'DR' : 'CR'}}</td>
                                        </tr>

                                        <tr class="th-to-hide">
                                            <td></td>
                                            <td></td>
                                            <td align="right">Disscount</td>
                                            <td> <input readonly type="number" class="inputvalue " id="invoice_discount" name="invoice_discount" style="font-size: 13px" placeholder="0.00" min="0" value="{{@$invoice->invoice_discount}}"></td>

                                        </tr>
                                        <tr class="th-to-hide">
                                            <td></td>
                                            <td></td>
                                            <td align="right">Net Amount</td>

                                            <td>
                                                <input type="number" class="inputvalue  remaning_amount amount_pay_input " id="amount_ to_pay" name="amount_to_pay" style="font-size: 13px" placeholder="0.00" readonly value="{{$invoice->invoice_remaining_amount_after_pay}}">

                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td align="right" class="cash-return">Cash Recived </td>
                                            <td><input type="number" class="inputvalue amount_received" id="amount_received" name="amount_received" style="font-size: 13px" placeholder="0.00" value="{{@$invoice->amount_received ?? 0}}"></td>
                                        </tr>


                                        <tr class="cash_return_tr" style="display:none">
                                            <td></td>
                                            <td></td>
                                            <td align="right">Cash Return</td>
                                            <td class="cash_return">{{@$invoice->cash_return}}</td>
                                        </tr>
                                        @if (Route::currentRouteName() == 'salereturn-edit')

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
                                                <span class="grand-total">0</span>
                                                @endif
                                            </td>

                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                        <div style="background-color: #f6f6f6; padding:10px; margin-top: 15px; margin-bottom: 0px; text-align: right; margin-bottom: 1px" id="btns_div">
                            <a href="#" type="submit" class="btn btn-primary" id="backButton">Back</a>
                            <button type="button" id="{{$invoice->id}}" data-invoice="{{$invoice->id}}" data-customer-id="{{$invoice->customer_id}}" paid-amount="{{$invoice->paid_amount}}" class="btn-primary print-invoice">Print</button>

                        </div>
                    </div>
                </div>

            </div>
        </form>
    </div>
</div>
@endsection

@push('js')
<script>
    $(document).ready(function() {
        $('.parent-div').show();
        $('#tblLoader').hide();
        document.getElementById('backButton').addEventListener('click', function() {
            window.history.back();
        });
        $('.print-invoice').on('click', function() {
            var invoice_id = $(this).attr('data-invoice');
            var customer_id = $(this).attr('data-customer-id');
            var invoice_id = $(this).attr('data-invoice');
            var paid_amount = $(this).attr('paid-amount');
            var printWindow = window.open("/print-replacement-invoice/" + invoice_id + '/' + customer_id + '/' +
                paid_amount);
            printWindow.onload = function() {
                printWindow.print();
                // printWiwndow.close();
            };
        })
    });
</script>

@endpush