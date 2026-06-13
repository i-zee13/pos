@extends('layouts.app')
@section('content')
<style>
    body {
        font-family: 'proximanova-light', sans-serif !important
    }

    .report .c-address-info div span {
        font-size: 16px !important;
        margin-right: 10px !important;
        font-family: 'proximanova-light', sans-serif !important;
    }

    .table thead th {
        border-bottom: solid 0.0625rem #040725 !important;
    }

    .cp-stats-icon svg {
        opacity: 0.5;
    }

    .dash-dates a span {
        display: block;
        color: #282828;
        background-color: #e5e5e5;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        margin: 0 auto 5px auto;
        line-height: 2.5rem;
        font-size: 18px;
        font-family: 'Rationale', sans-serif !important;
        font-weight: normal;
    }

    .dash-dates .col {
        padding-left: 0.3125rem;
        padding-right: 0.3125rem;
    }

    @media (max-width: 1366px) {
        ._cust_filter {
            width: 159px;
        }
    }

    ._cust_filter {
        width: 250px !important;
    }

    .cp-stats {
        border-bottom: solid 0.125rem #152e4d;
        /*background-image: none !important;*/
        padding: 0.9375rem;
        font-size: 0.8125rem;
        background-size: 140% 100%;
        position: relative;
        letter-spacing: 0.0625rem;
        margin-bottom: 0rem;
        background-color: #fff;
        border-radius: 0rem;
        box-shadow: rgba(0, 0, 0, 0.16) 0rem 0.0625rem 0.25rem;
    }

    .cp-stats-value {
        margin-bottom: 0px;
        margin-top: 0px;
        font-size: 25px;
    }

    .cp-stats h5 span {
        font-weight: 100 !important;
        opacity: 0.5;
    }

    .Product-Filter {
        /*border-bottom: solid 2px white;*/
        padding-bottom: 5px;
    }

    .c-address-info {
        /* padding-top: 0.9375rem; */
        /* padding-bottom: 0.9375rem; */
        border-right: solid 0.0625rem #f4f4f4;
        font-size: 0.8125rem;
    }

    .c-address-info div {
        margin-bottom: 8px !important;
        display: flex;
    }

    .c-address-info div span {
        width: 15.625rem;
        display: inline-block;
    }

    .c-address-info svg {
        width: 1rem;
        height: 1rem;
        display: inline-block;
        margin-right: 0.625rem;
        margin-top: 0rem;
        opacity: 0.5;
    }

    .c-address-info div strong {
        width: 14.25rem;
    }

    .digit {
        font-family: 'Rationale', sans-serif !important;
        font-size: 16px;
    }

    #contentContainerDiv {
        height: 930px !important;
    }

    .c-address-info {
        height: auto;
    }

    .form-control:disabled,
    .form-control[readonly] {
        background-color: #fff !important;
    }

    .collapse-head {
        color: #424242;
        /* padding: 1.25rem 0rem; */
        position: relative;
        box-shadow: none;
        background: none;
        border-bottom: solid 0.0625rem #ededed;
        margin-bottom: 0.3125rem;
        /* padding: 0.625rem 0rem; */
    }

    .addBTN-act {
        font-size: 13px;
        background-color: #ececec;
        border: none;
        -webkit-border-radius: 0;
        -moz-border-radius: 0;
        border-radius: 0;
        -khtml-border-radius: 0;
        box-shadow: none !important;
        padding: 3px 12px;
        color: #040725 !important;
        float: right;
        cursor: pointer;
    }

    .schedule-height {
        height: 304px;
        padding-top: 5px;
        padding-bottom: 5px;
        overflow-y: auto;
    }

    .f-17 {
        font-size: 17px
    }

    #content-wrapper {
        width: 100%;
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        transition: all 0.3s;
        background-image: url(../images/dashboard-bg.jpg);
        background-position: top center;
        background-repeat: no-repeat;
        background-size: 100%;
    }
</style>
<!-- Body -->
<div class="header-body">
    <div class="row">
        <div class="col">
            <!-- Pretitle -->
            <h6 class="header-pretitle">
                Overview
            </h6>
            <!-- Title -->
            <h1 class="header-title">
                <h2 class="_head01">Sale<span> Close</span></h2>
            </h1>
        </div>
        <div class="col-auto">
            <ol class="breadcrumb">
                <li><a href="#"><span>Sale Close</span></a></li>
                <li><span>Active</span></li>
            </ol>
        </div>
    </div>
</div>


<div class="row">
    <div class="col-lg-12">
        <div class="Product-Filter">
            <form id="search-form">
                <div class="row">
                    <div class="col">
                        <div class="CL-Product inputmonth"><i class="fa fa-calendar-alt"></i>
                            <input type="date" autocomplete="off" class="form-control selected_date" value="{{date('d-M-Y')}}" placeholder="Close Date">
                            <input type="hidden" value="{{date('Y-m-d')}}" class="close_date">
                        </div>

                        <style>
                            .CL-Product input {
                                height: 32px !important;
                            }
                        </style>
                        <style>
                            .reset-btn {
                                box-shadow: none;
                            }

                            .reset-btn:hover {
                                color: white !important;
                            }
                        </style>
                        <div class="col-auto pl-0">
                            <button type="button" class="btn btn-primary m-0 search-btn"> Search</button>
                        </div>
                    </div>

                </div>
            </form>
            <div class="clearfix"></div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-3 mb-30">
        <div class="card cp-stats">
            <div class="cp-stats-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" height="16" fill="currentColor" class="bi bi-bar-chart-line" viewBox="0 0 16 16">
                    <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2zm1 12h2V2h-2v12zm-3 0V7H7v7h2zm-5 0v-3H2v3h2z"></path>
                </svg>
            </div>
            <h5 class="text-muted"><span>TTL</span><br><b>SALES</b></h5>
            <h3 class="cp-stats-value ttl_sale">Loading...</h3>

        </div>
    </div>

    <div class="col-md-3 mb-30">
        <div class="card cp-stats">
            <div class="cp-stats-icon"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                    <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                    <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                </svg></div>
            <h5 class="text-muted"><span>TTL</span><br><b>Payments</b></h5>
            <h3 class="cp-stats-value ttl_payments">Loading...</h3>

        </div>
    </div>

    <div class="col-md-3 mb-30">
        <div class="card cp-stats">
            <div class="cp-stats-icon"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-wallet" viewBox="0 0 16 16">
                    <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1z" />
                </svg>
                <span>
            </div>
            <h5 class="text-muted"><span>TTL</span><br><b>Cash Recovery</b></h5>
            <h3 class="cp-stats-value ttl_received">Loading...</h3>

        </div>
    </div>

    <div class="col-md-3 mb-30">
        <div class="card cp-stats">
            <div class="cp-stats-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-speedometer2" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4zM3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.389.389 0 0 0-.029-.518z"></path>
                    <path fill-rule="evenodd" d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A7.988 7.988 0 0 1 0 10zm8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3z"></path>
                </svg>
            </div>
            <h5 class="text-muted"><span>TTL</span><br><b>IN HAND</b></h5>
            <h3 class="cp-stats-value ttl_in_hand">Loading...</h3>

        </div>
    </div>
</div>

<div class="card" style="padding: 0px">
    <div class="header m-0">
        <h2 style="width: 100%">Sale Close <span>Detail</span>
            <button class="btn add_button sale-close-btn-modal" data-toggle="modal" data-target="#close-modal" style="right: 0px!important;top:-2px!important">
                <i class="fa fa-check"></i>
                @php
                $is_close = isClose();
                @endphp
                @if($is_close == 1)
                Sale Open
                @else
                Sale Close
                @endif
            </button>
            <a class="btn add_button" style="margin-right: 8%!important;top:-2px!important" data-toggle="modal" data-target="#print-modal">
                <i class="fa fa-download"></i> Print DSR
            </a>
        </h2>

    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="body teacher_attendance_list">
                <div class="col-md-12">
                    <div class="row">
                        <div class="col-md-4 demo-y" style="max-height: 430px">
                            <div class="c-address-info">
                                <div class="net_sale_div" style="display: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                                        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span> Net Sale: </span>
                                    <strong class="digit net_sale">Loading...</strong>
                                </div>
                                <div class="credit_sale_div" style="display: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                                        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span> Credit Sale: </span>
                                    <strong class="digit credit_sale">Loading...</strong>
                                </div>
                                <div class="discount_div" style="display: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-paperclip" viewBox="0 0 16 16">
                                        <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z" />
                                    </svg>
                                    <span> Discount: </span>
                                    <strong class="digit discount">Loading...</strong>
                                </div>
                                <div class="service_charges_div" style="border-bottom: 1px solid #f4f4f4;display: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-credit-card-2-front" viewBox="0 0 16 16">
                                        <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2z" />
                                        <path d="M2 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span> Service Charges: </span>
                                    <strong class="digit service_charges">Loading...</strong>
                                </div>
                                <div style="border-bottom: 1px solid #f4f4f4;color: white;background: #152e4d">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                                        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span> <b>Total Sale:</b> </span>
                                    <strong class="digit total_sales f-17">Loading...</strong>
                                </div>

                                <!-- Returns -->
                                <div class="total_sale_returns_div" style="display: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                                        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span> Net Sale Return: </span>
                                    <strong class="digit total_sale_returns">Loading...</strong>
                                </div>
                                <div class="total_credit_sale_returns_div" style="display: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                                        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span> Credit Sale Return: </span>
                                    <strong class="digit total_credit_sale_returns">Loading...</strong>
                                </div>
                                <div class="return_discount_div" style="display: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-paperclip" viewBox="0 0 16 16">
                                        <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z" />
                                    </svg>
                                    <span> Discount: </span>
                                    <strong class="digit return_discount">Loading...</strong>
                                </div>
                                <div style="border-bottom: 1px solid #f4f4f4;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-credit-card-2-front" viewBox="0 0 16 16">
                                        <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2z" />
                                        <path d="M2 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span> Service Charges: </span>
                                    <strong class="digit return_service_charges">Loading...</strong>
                                </div>
                                <div style="border-bottom: 1px solid #f4f4f4;color: white;background: #152e4d">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                                        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span> <b>Total Returns:</b> </span>
                                    <strong class="digit total_returns f-17">Loading...</strong>
                                </div>


                                <!-- ENd Returns -->
                                <div class="openning_balance_div" style="display: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                                        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span> Openning Balance: </span>
                                    <strong class="digit openning_balance">Loading...</strong>
                                </div>
                                <div class="credit_sale_receivings_div" style="display: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                                        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span> Credit Sale Recovery: </span>
                                    <strong class="digit credit_sale_receivings">Loading...</strong>
                                </div>
                                <div class="customer_recovery_div" style="display: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                                        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span> Customer Recovery: </span>
                                    <strong class="digit customer_recovery">Loading...</strong>
                                </div>
                                <div class="vendor_recovery_div" style="display: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                                        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span> Vendor Recovery: </span>
                                    <strong class="digit vendor_recovery">Loading...</strong>
                                </div>
                                <div style="border-bottom: 1px solid #f4f4f4;color: white;background: #152e4d">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wallet" viewBox="0 0 16 16">
                                        <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1z" />
                                    </svg>
                                    <span> <b>Total Recovery:</b> </span>
                                    <strong class="digit cash_recovery f-17 ">Loading...</strong>
                                </div>
                                <div class="total_pr_invc_amount_div" style="display: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                                        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span> Credit P.Inv Payment: </span>
                                    <strong class="digit total_pr_invc_amount">Loading...</strong>
                                </div>
                                <div class="credit_return_payment_div" style="display: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                                        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span> Credit S.Return Payment: </span>
                                    <strong class="digit credit_return_payment">Loading...</strong>
                                </div>
                                <div class="total_pr_paid_amount_div" style="display: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                                        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span> Credit P.Return Payment: </span>
                                    <strong class="digit total_pr_paid_amount">Loading...</strong>
                                </div>

                                <div class="customer_payments_div" style="display: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                                        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span> Customer Payment: </span>
                                    <strong class="digit customer_payments">Loading...</strong>
                                </div>
                                <div style="border-bottom: 1px solid #f4f4f4;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                                        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span> Vendor Payment: </span>
                                    <strong class="digit vendor_payments">Loading...</strong>
                                </div>
                                <div class="expense_div" style="border-bottom: 1px solid #f4f4f4;display:none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                                        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span> Expense : </span>
                                    <strong class="digit expense">Loading...</strong>
                                </div>
                                <div class="total_payments_div" style="border-bottom: 3px solid #f4f4f4;color: white;background: #152e4d;display:none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                                        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span> <b>Total Payments:</b> </span>
                                    <strong class="digit total_payments f-17">Loading...</strong>
                                </div>
                                <div class="cash_in_hand_div" style="display: none;color: white;background: #152e4d">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wallet2" viewBox="0 0 16 16">
                                        <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
                                    </svg>
                                    <span> <b>Cash IN Hand:</b> </span>
                                    <strong class="digit cash_in_hand">Loading...</strong>
                                </div>

                            </div>
                        </div>
                        <div class="col-md-8" id="contentToPrint" style="direction: rtl;display: contents;">

                            <div class="col-md-4 report" style="direction: rtl;">
                                <div class="c-address-info ">
                                    <div class="mutafariq_udhar_banam_div" style="display: none;">
                                        <span>متفرق ادھار : </span>
                                        <strong class="digit"></strong>
                                        <strong class="digit mutafariq_udhar_banam">Loading...</strong>
                                    </div>
                                    <div class="ubl_aftab_banam_div" style="display: none;">
                                        <span>UBL آفتاب : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit ubl_aftab_banam">Loading...</strong>
                                    </div>
                                    <div class="ubl_waqas_div" style="display: none;">
                                        <span>UBL وقاص : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit ubl_waqas">Loading...</strong>
                                    </div>
                                    <div class="petrol_khata_div" style="display: none;">
                                        <span>پٹرول : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit petrol_khata">Loading...</strong>
                                    </div>
                                    <div class="fazul_qadir_banam_div" style="display: none;">
                                        <span>فضل القادر : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit fazul_qadir_banam">Loading...</strong>
                                    </div>
                                    <div class="shafiq_karyana_banam_div" style="display: none;">
                                        <span>شفیق کریانہ : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit shafiq_karyana_banam">Loading...</strong>
                                    </div>
                                    <div class="abdul_ghaffar_ghar_banam_div" style="display: none;">
                                        <span>عبدالغفار گھر : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit abdul_ghaffar_ghar_banam">Loading...</strong>
                                    </div>
                                    <div class="ammar_abdullah_ghar_banam_div" style="display: none;">
                                        <span>عمار عبداللہ گھر : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit ammar_abdullah_ghar_banam">Loading...</strong>
                                    </div>
                                    <div class="imdad_khata_banam_div" style="display: none;">
                                        <span>امداد کھاتہ : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit imdad_khata_banam">Loading...</strong>
                                    </div>
                                    <div class="imran_niazi_banam_div" style="display: none;">
                                        <span>عمران نیازی : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit imran_niazi_banam">Loading...</strong>
                                    </div>
                                    <div class="salries_banam_div" style="display: none;">
                                        <span>تنخواہ ملازمین</span>
                                        <strong class="digit"></strong>

                                        <strong class="digit salries_banam">Loading...</strong>
                                    </div>
                                    <div class="sir_murtaza_sahib_banam_div" style="display: none;">
                                        <span>سر مرتضیٰ صاحب </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit sir_murtaza_sahib_banam">Loading...</strong>
                                    </div>
                                    <div class="master_khalid_faroq_shah_banam_div" style="display: none;">
                                        <span>ماسٹر خالد فاروق شاہ : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit master_khalid_faroq_shah_banam">Loading...</strong>
                                    </div>
                                    <!-- All Vendor Names -->
                                    <div class="fouji_fertilizer_div" style="display: none;">
                                        <span>فوجی فرٹیلائزرز</span>
                                        <strong class="digit"></strong>

                                        <strong class="digit fouji_fertilizer">Loading...</strong>
                                    </div>
                                      <div class="dap_khata_div" style="display: none;">
                                        <span>ڈی اے پی کھاتہ</span>
                                        <strong class="digit"></strong>

                                        <strong class="digit dap_khata">Loading...</strong>
                                    </div>
                                      <div class="angro_khata_div" style="display: none;">
                                        <span>یوریا کھاتہ</span>
                                        <strong class="digit"></strong>

                                        <strong class="digit angro_khata">Loading...</strong>
                                    </div>
                                    <div class="land_company_div" style="display: none;">
                                        <span>مائی لینڈ کمپنی</span>
                                        <strong class="digit"></strong>

                                        <strong class="digit land_company">Loading...</strong>
                                    </div>
                                    <div class="angro_fertilizer_div" style="display: none;">
                                        <span>اینگرو کھاد : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit angro_fertilizer">Loading...</strong>
                                    </div>
                                    <div class="np_khareed_div" style="display: none;">
                                      <span>خرید NP</span>
                                        <strong class="digit"></strong>

                                        <strong class="digit np_khareed">Loading...</strong>
                                    </div>
                                    <div class="gandum_khareed_khata_div" style="display: none;">
                                       <span>گندم خرید کھاتہ</span>
                                        <strong class="digit"></strong>

                                        <strong class="digit gandum_khareed_khata">Loading...</strong>
                                    </div>
                                    <div class="fazul_qadir_div" style="display: none;">
                                        <span>فضل القادر : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit fazul_qadir">Loading...</strong>
                                    </div>
                                    <div class="abdul_shakoor_exchange_div" style="display: none;">
                                        <span>نقد رقم شہر دکان </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit abdul_shakoor_exchange">Loading...</strong>
                                    </div>
                                    <div class="habib_bank_abdul_shakoor_div" style="display: none;">
                                        <span>حبیب بینک عبدالشکور : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit habib_bank_abdul_shakoor">Loading...</strong>
                                    </div>
                                     <div class="meezan_bank_banam_div" style="display: none;">
                                        <span>میزان بینک عبدالشکور</span>
                                        <strong class="digit"></strong>

                                        <strong class="digit meezan_bank_banam">Loading...</strong>
                                    </div>
                                    <div class="bop_bank_div" style="display: none;">
                                        <span>BOP الیاس : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit bop_bank">Loading...</strong>
                                    </div>
                                      <div class="bop_waqas_div" style="display: none;">
                                        <span>BOP وقاص : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit bop_waqas">Loading...</strong>
                                    </div>
                                    <div class="hbl_m_waqas_div" style="display: none;">
                                        <span>HBL وقاص : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit hbl_m_waqas">Loading...</strong>
                                    </div>
                                    <div class="mcb_ka_div" style="display: none;">
                                        <span>MCB کوٹ ادو : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit mcb_ka">Loading...</strong>
                                    </div>
                                    <div class="abl_ka_div" style="display: none;">
                                        <span>ABL کوٹ ادو : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit abl_ka">Loading...</strong>
                                    </div>
                                    <div class="bank_al_habib_ka_div" style="display: none;">
                                        <span>بینک الحبیب : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit bank_al_habib_ka">Loading...</strong>
                                    </div>
                                    <div class="sonehri_bank_div" style="display: none;">
                                        <span>سنہری بینک :</span>
                                        <strong class="digit"></strong>

                                        <strong class="digit sonehri_bank">Loading...</strong>
                                    </div>
                                    <div class="kisan_card_bop_div" style="display: none;">
                                        <span>کسان کارڈ BOP :</span>
                                        <strong class="digit"></strong>

                                        <strong class="digit kisan_card_bop">Loading...</strong>
                                    </div>
                                    <div class="tameerat_khata_div" style="display: none;">
                                        <span>تعمیرات کھاتہ</span>
                                        <strong class="digit"></strong>

                                        <strong class="digit tameerat_khata">Loading...</strong>
                                    </div>
                                    <div class="wilkan_chemicals_div" style="display: none;">
                                        <span>ویلکان کیمیکلز : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit wilkan_chemicals">Loading...</strong>
                                    </div>
                                    <div class="baghban_chemical_div" style="display: none;">
                                        <span>باغبان کیمیکلز </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit baghban_chemical">Loading...</strong>
                                    </div>
                                    <div class="prime_khata_div" style="display: none;">
                                        <span>پرائم کھاتہ </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit prime_khata">Loading...</strong>
                                    </div>
                                    <div class="gawara_khata_div" style="display: none;">
                                        <span> گوارا خرید کھاتہ  </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit gawara_khata">Loading...</strong>
                                    </div>
                                    <div class="swat_agro_chemicals_div" style="display: none;">
                                        <span>سوات ایگرو کیمیکلز : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit swat_agro_chemicals">Loading...</strong>
                                    </div>
                                    <div class="agro_lux_div" style="display: none;">
                                        <span>ایگرو لکس : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit agro_lux">Loading...</strong>
                                    </div>
                                    <div class="kenzo_ag_div" style="display: none;">
                                        <span>کینزو اے جی : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit kenzo_ag">Loading...</strong>
                                    </div>
                                    <div class="leader_ag_div" style="display: none;">
                                        <span>لیڈر اے جی : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit leader_ag">Loading...</strong>
                                    </div>
                                    <div class="bayer_div" style="display: none;">
                                        <span>Bayer : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit bayer">Loading...</strong>
                                    </div>
                                    <div class="fmc_div" style="display: none;">
                                        <span>FMC : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit fmc">Loading...</strong>
                                    </div>
                                    <div class="agro_mark_div" style="display: none;">
                                        <span>ایگرو مارک : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit agro_mark">Loading...</strong>
                                    </div>
                                    <div class="beej_khareed_div" style="display: none;">
                                        <span>بیج : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit beej_khareed">Loading...</strong>
                                    </div>
                                    <div class="sody_khareed_div" style="display: none;">
                                        <span><b> سودے خرید : </b> </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit sody_khareed">Loading...</strong>
                                    </div>
                                    <div class="bank_payments_div" style="display: none;">
                                        <span>بینک :</span>
                                        <strong class="digit"></strong>

                                        <strong class="digit bank_payments">Loading...</strong>
                                    </div>
                                    <div class="expense_div" style="border-bottom: 1px solid #f4f4f4;display:none">
                                        <span>دکان خرچہ : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit expense">Loading...</strong>
                                    </div>
                                     <div class="karaya_dokan_banam_div" style="display: none;">
                                        <span>کرایہ دکان: </span>
                                        <strong class="digit"></strong> 
                                        <strong class="digit karaya_dokan_banam">Loading...</strong>
                                    </div>
                                    <div style="border-bottom: 1px solid #f4f4f4;color: white; border-bottom: 1px solid #f4f4f4;background: #152e4d;">
                                        <span> کل نکاس : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit ttl_out f-17"></strong>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 report" style="direction: rtl;">
                                <div class="c-address-info">
                                    <div class="openning_balance_div" style="display: none;">
                                        <span> نقد دکان : </span>
                                        <strong class="digit"></strong>
                                        <strong class="digit openning_balance">Loading...</strong>
                                    </div>
                                    <div class="abdul_shakoor_exchange_jama_div" style="display: none;">
                                        <span>نقد رقم شہر دکان </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit abdul_shakoor_exchange_jama">Loading...</strong>
                                    </div>
                                       <div class="karaya_dokan_receive_div" style="display: none;">
                                        <span>کرایہ دکان: </span>
                                        <strong class="digit"></strong> 
                                        <strong class="digit karaya_dokan_receive">Loading...</strong>
                                    </div>
                                    <div class="mutafirq_udhar_receive_div" style="display: none;">
                                        <span>متفرق ادھار : </span>
                                        <strong class="digit"></strong>
                                        <strong class="digit mutafirq_udhar_receive">Loading...</strong>
                                    </div>
                                     <div class="mcb_ka_jama_div" style="display: none;">
                                        <span>MCB کوٹ ادو: </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit mcb_ka_jama">Loading...</strong>
                                    </div>
                                    <div class="meezan_bank_jama_div" style="display: none;">
                                        <span>میزان بینک عبدالشکور</span>
                                        <strong class="digit"></strong>

                                        <strong class="digit meezan_bank_jama">Loading...</strong>
                                    </div>
                                    <div class="hbl_m_waqas_jama_div" style="display: none;">
                                        <span>HBL وقاص : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit hbl_m_waqas_jama">Loading...</strong>
                                    </div>
                                    <div class="ubl_m_waqas_jama_div" style="display: none;">
                                        <span>UBL وقاص : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit ubl_m_waqas_jama">Loading...</strong>
                                    </div>
                                    <div class="ilyas_bakhtawar_div" style="display: none;">
                                        <span>الیاس بختاور : </span>
                                        <strong class="digit"></strong>
                                        <strong class="digit ilyas_bakhtawar">Loading...</strong>
                                    </div>
                                    <div class="fazul_qadir_recive_div" style="display: none;">
                                        <span>فضل القادر : </span>
                                        <strong class="digit"></strong>
                                        <strong class="digit fazul_qadir_recive">Loading...</strong>
                                    </div>
                                    <div class="shafiq_karyana_receive_div" style="display: none;">
                                        <span>شفیق کریانہ : </span>
                                        <strong class="digit"></strong>
                                        <strong class="digit shafiq_karyana_receive">Loading...</strong>
                                    </div>
                                    <div class="abdul_ghaffar_ghar_receive_div" style="display: none;">
                                        <span>عبدالغفار گھر : </span>
                                        <strong class="digit"></strong>
                                        <strong class="digit abdul_ghaffar_ghar_receive">Loading...</strong>
                                    </div>
                                    <div class="ammar_abdullah_ghar_receive_div" style="display: none;">
                                        <span>عمار عبداللہ گھر : </span>
                                        <strong class="digit"></strong>
                                        <strong class="digit ammar_abdullah_ghar_receive">Loading...</strong>
                                    </div>
                                    <div class="imdad_khata_receive_div" style="display: none;">
                                        <span>امداد کھاتہ : </span>
                                        <strong class="digit"></strong>
                                        <strong class="digit imdad_khata_receive">Loading...</strong>
                                    </div>
                                    <div class="imran_niazi_receive_div" style="display: none;">
                                        <span>عمران نیازی : </span>
                                        <strong class="digit"></strong>
                                        <strong class="digit imran_niazi_receive">Loading...</strong>
                                    </div>
                                    <div class="sir_murtaza_sahib_receive_div" style="display: none;">
                                        <span>سر مرتضیٰ صاحب : </span>
                                        <strong class="digit"></strong>
                                        <strong class="digit sir_murtaza_sahib_receive">Loading...</strong>
                                    </div>
                                    <div class="master_khalid_faroq_shah_receive_div" style="display: none;">
                                        <span>ماسٹر خالد فاروق شاہ : </span>
                                        <strong class="digit"></strong>
                                        <strong class="digit master_khalid_faroq_shah_receive">Loading...</strong>
                                    </div>

                                    <div class="mutafirq_sody_div" style="display: none;">
                                        <span>متفرق سودے</span>
                                        <strong class="digit"></strong>
                                        <strong class="digit mutafirq_sody">Loading...</strong>
                                    </div>
                                     <div class="ubl_aftab_jama_div" style="display: none;">
                                        <span>UBL آفتاب : </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit ubl_aftab_jama">Loading...</strong>
                                    </div>
                                    <div class="dawai_div" style="display: none;">

                                        <span> دوائی: </span>
                                        <strong class="digit dawai_qty">Loading...</strong>
                                        <strong class="digit dawai">Loading...</strong>
                                    </div>
                                    <div class="beej_div" style="display: none;">
                                        <span> بیج: </span>
                                        <strong class="digit beej_qty">Loading...</strong>
                                        <strong class="digit beej">Loading...</strong>
                                    </div>
                                    <div class="gandom_div" style="display: none;">
                                        <span>گندم : </span>
                                        <strong class="digit gandom_qty">Loading...</strong>
                                        <strong class="digit gandom">Loading...</strong>
                                    </div>
                                    <div class="gandum_khareed_khata_receive_div" style="display: none;">
                                        <span>گندم خرید کھاتہ : </span>
                                        <strong class="digit"></strong>
                                        <strong class="digit gandum_khareed_khata_receive">Loading...</strong>
                                    </div>
                                    <div class="kapas_div" style="display: none;">
                                        <span>بنولہ </span>
                                        <strong class="digit kapas_qty">Loading...</strong>
                                        <strong class="digit kapas">Loading...</strong>
                                    </div>
                                    <div class="dhaan_div" style="display: none;">
                                        <span>دھان : </span>
                                        <strong class="digit dhaan_qty">Loading...</strong>
                                        <strong class="digit dhaan">Loading...</strong>
                                    </div>
                                    <div class="dap_25kg_div" style="display: none;">
                                        <span>ڈی اے پی 25 کلو :</span>
                                        <strong class="digit dap_25kg_qty">Loading...</strong>
                                        <strong class="digit dap_25kg">Loading...</strong>
                                    </div>
                                    <div class="dap_div" style="display: none;">
                                        <span>ڈی اے پی :</span>
                                        <strong class="digit dap_qty">Loading...</strong>
                                        <strong class="digit dap">Loading...</strong>
                                    </div>
                                    <div class="urea_div" style="display: none;">
                                        <span>یوریا : </span>
                                        <strong class="digit urea_qty">Loading...</strong>
                                        <strong class="digit urea">Loading...</strong>
                                    </div>
                                     <div class="tsp_div" style="display: none;">
                                        <span>ٹی ایس پی </span>
                                        <strong class="digit tsp_qty">Loading...</strong>
                                        <strong class="digit tsp">Loading...</strong>
                                    </div>
                                    <div class="can_div" style="display: none;">
                                        <span>گوارہ : </span>
                                        <strong class="digit can_qty">Loading...</strong>
                                        <strong class="digit can">Loading...</strong>
                                    </div>
                                    <div class="np_div" style="display: none;">
                                        <span>نائیڑوفاس : </span>
                                        <strong class="digit np_qty">Loading...</strong>
                                        <strong class="digit np">Loading...</strong>
                                    </div>
                                    <div class="ssp_div" style="display: none;">
                                        <span>ایس ایس پی :</span>
                                        <strong class="digit ssp_qty">Loading...</strong>
                                        <strong class="digit ssp">Loading...</strong>
                                    </div>
                                    <div class="zarkhez_div" style="display: none;">
                                        <span>زرخیز : </span>
                                        <strong class="digit zarkhez_qty">Loading...</strong>
                                        <strong class="digit zarkhez">Loading...</strong>
                                    </div>
                                    <div class="sop_div" style="display: none;">
                                        <span>ایس او پی : </span>
                                        <strong class="digit sop_qty">Loading...</strong>
                                        <strong class="digit sop">Loading...</strong>
                                    </div>
                                    <div class="jimsam_div" style="display: none;">
                                        <span>جپسم : </span>
                                        <strong class="digit jimsam_qty">Loading...</strong>
                                        <strong class="digit jimsam">Loading...</strong>
                                    </div>
                                    <div class="mop_div" style="display: none;">
                                        <span>ایم او پی : </span>
                                        <strong class="digit mop_qty">Loading...</strong>
                                        <strong class="digit mop">Loading...</strong>
                                    </div>
                                 
                                    <div style="border-bottom: 1px solid #f4f4f4;color: white; border-bottom: 1px solid #f4f4f4;background: #152e4d;">
                                        <span> <b> کل آمد : </b> </span>
                                        <strong class="digit"></strong>
                                        <strong class="digit ttl_in f-17"></strong>
                                    </div>
                                    <div>
                                        <span> <b> کل نکاس : </b> </span>
                                        <strong class="digit"></strong>

                                        <strong class="digit ttl_out f-17"></strong>
                                    </div>

                                    <div class="total_meezan_div" style="border-bottom: 1px solid #f4f4f4;color: white; border-bottom: 1px solid #f4f4f4;background: #152e4d;">
                                        <span> کل میزان : </span>
                                        <strong class="digit"></strong>
                                        <strong class="digit total_meezan f-17"></strong>
                                    </div>
                                </div>



                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {{-- Close modal --}}
    <div class="modal fade" id="close-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        @php
        $is_close = isClose();
        @endphp
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content top-borderRed" style="border-top:3px solid #131d2a">
                <div class="modal-header" style="padding:15px">
                    <h5 class="modal-title" id="exampleModalLabel">Admin Sale <span>@if($is_close == 1) Open @else Close @endif</span></h5>
                </div>
                <div class="modal-body" style="padding:7px 15px 15px 15px">
                    <div id="col-md-12">
                        <style>
                            .cash_in_hand,
                            .closing_cash {
                                box-shadow: none !important;
                                height: 35px !important
                            }

                            textarea {
                                box-shadow: none !important;
                                height: auto;
                            }
                        </style>
                        <div class="row">
                            @if($is_close == 1)
                            <p>Are you Sure you want to open Sale</p>
                            @else
                            <div class="col-md-6">
                                <label class="font12">Cash IN Hand*</label>
                                <input type="text" autocomplete="off" class="form-control only_decimal_numerics cash_in_hand" placeholder="Cash In Hand">
                                <input type="hidden" value="" class="ttl_cash_in_hand" name="ttl_cash_in_hand">
                            </div>
                            <div class="col-md-6">
                                <label class="font12">Closing Cash*</label>
                                <input type="text" autocomplete="off" class="form-control only_decimal_numerics closing_cash" placeholder="Closing Cash">
                            </div>
                            <div class="col-md-12">
                                <label class="font12">Closing Comment</label>
                                <textarea class="form-control closing_comment" name="closing_comment" cols="20"></textarea>
                            </div>
                            @endif
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0" style="padding-top:7px;padding-bottom:7px ">
                    @if($is_close == 1)
                    <button type="button" class="btn btn-primary sale_open">Sale Open</button>
                    @else
                    <button type="button" class="btn btn-primary sale_close">Sale Close</button>
                    @endif
                    <button type="button" class="btn btn-cancel cancel_sale_close_modal" data-dismiss="modal" aria-label="Close">Cancel</button>
                </div>
            </div>
        </div>
        <button hidden data-toggle="modal" data-target="#close-modal" id="hidden_btn_to_open_sale_close_modal"></button>
    </div>
    {{-- Print  modal --}}
    <div class="modal fade" id="print-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content top-borderRed" style="border-top:3px solid #131d2a">
                <div class="modal-header" style="padding:15px">
                    <h5 class="modal-title" id="exampleModalLabel">Cash Detail <span></span></h5>
                </div>
                <div class="modal-body" style="padding:7px 15px 15px 15px">
                    <div id="col-md-12">
                        <style>
                            .cash_in_hand,
                            .closing_cash {
                                box-shadow: none !important;
                                height: 35px !important
                            }

                            textarea {
                                box-shadow: none !important;
                                height: auto;
                            }

                            .value_input {
                                padding: 2px;
                                margin: 0 !important;
                                font-size: 12px;
                                box-shadow: none;
                                height: 20px;
                                width: 100px;
                            }

                            .odd td span,
                            #grandTotal {
                                font-family: 'Rationale', sans-serif !important;
                                font-size: 18px;
                            }
                        </style>
                        <div class="row">

                            <div class="col-md-12" id="printModal">
                                <!-- Print Modal -->

                                <table class="table dataTable no-footer" id="assign-to-table" style="width: 100%;" role="grid" aria-describedby="assign-to-table_info">
                                    <thead>
                                        <tr role="row">
                                            <th class="sorting" tabindex="0" aria-controls="assign-to-table" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" style="width: 333px;">Cash</th>
                                            <th class="sorting" tabindex="0" aria-controls="assign-to-table" rowspan="1" colspan="1" aria-label="QTY: activate to sort column ascending" style="width: 302px;">Count</th>
                                            <th class="sorting" tabindex="0" aria-controls="assign-to-table" rowspan="1" colspan="1" aria-label="Action: activate to sort column ascending" style="width: 183px;">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr role="row" class="odd">
                                            <td><b>5000 X</b></td>
                                            <td><input type="text" class="form-control value_input only_numerics value-1" id="val5000" value="" oninput="calculate(this,5000)"></td>
                                            <td><span id="result5000">____</span></td>
                                        </tr>
                                        <tr role="row" class="odd">
                                            <td>1000 X</td>
                                            <td><input type="text" class="form-control value_input only_numerics value-1" id="val1000" value="" oninput="calculate(this,1000)"></td>
                                            <td><span id="result1000">____</span></td>
                                        </tr>
                                        <tr role="row" class="odd">
                                            <td>500 X</td>
                                            <td><input type="text" class="form-control value_input only_numerics value-1" id="val500" value="" oninput="calculate(this,500)"></td>
                                            <td><span id="result500">____</span></td>
                                        </tr>
                                        <tr role="row" class="odd">
                                            <td>100 X</td>
                                            <td><input type="text" class="form-control value_input only_numerics value-1" id="val100" value="" oninput="calculate(this,100)"></td>
                                            <td><span id="result100">____</span></td>
                                        </tr>
                                        <tr role="row" class="odd">
                                            <td>50 X</td>
                                            <td><input type="text" class="form-control value_input only_numerics value-1" id="val50" value="" oninput="calculate(this,50)"></td>
                                            <td><span id="result50">____</span></td>
                                        </tr>
                                        <tr role="row" class="odd">
                                            <td>20 X</td>
                                            <td><input type="text" class="form-control value_input only_numerics value-1" id="val20" value="" oninput="calculate(this,20)"></td>
                                            <td><span id="result20">____</span></td>
                                        </tr>
                                        <tr role="row" class="odd">
                                            <td>10 X</td>
                                            <td><input type="text" class="form-control value_input only_numerics value-1" id="val10" value="" oninput="calculate(this,10)"></td>
                                            <td><span id="result10">____</span></td>
                                        </tr>
                                        <tr style="color: white;background: #132a46;font-family:'Rationale', sans-serif !important">
                                            <td colspan="2"><strong style="float: right;font-family: 'Rationale', sans-serif !important;font-size: 18px;">Total:</strong></td>
                                            <td><strong><span id="grandTotal">0</span></strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0" style="padding-top:7px;padding-bottom:7px ">
                    <button type="button" class="btn btn-primary" onclick="printSection()">Print </button>
                    <button type="button" class="btn btn-cancel cancel_sale_close_modal" data-dismiss="modal" aria-label="Close">Cancel</button>
                </div>
            </div>
        </div>
        <button hidden data-toggle="modal" data-target="#print-modal" id="hidden_btn_to_open_sale_close_modal"></button>
    </div>
    @endsection
    @push('js')
    <script>
      
        function addcoma(nStr) {
            nStr = parseFloat(nStr); // Convert to float 
            if (Number.isInteger(nStr)) {
                return nStr.toLocaleString(); // If it's a whole number, just format with commas
            } else {
                return nStr.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
        }

        function calculateTotal() {
            let total = 0;
            let values = [5000, 1000, 500, 100, 50, 20, 10]; // Denominations

            values.forEach(value => {
                let resultElement = document.getElementById(`result${value}`);
                let cleanValue = resultElement.innerText.replace(/,/g, ""); // Remove commas
                total += parseFloat(cleanValue) || 0; // Sum up all results
            });

            $("#grandTotal").html(`${addcoma(total)}`); // Update total display
        }


        // Calculate Values and Print
        function calculate(inputElement, value) {
            let inputVal = parseFloat(inputElement.value) || 0;
            $(`#result${value}`).html(`${addcoma(inputVal * value)}`)
            calculateTotal()
        }

        function printSection() {
            let grandTotal = $("#grandTotal").text();
            var v5000   = document.getElementById("val5000").value || 0;
            var v1000   = document.getElementById("val1000").value || 0;
            var v500    = document.getElementById("val500").value || 0;
            var v100    = document.getElementById("val100").value || 0;
            var v50     = document.getElementById("val50").value || 0;
            var v20     = document.getElementById("val20").value || 0;
            var v10     = document.getElementById("val10").value || 0;
            var content = document.getElementById("contentToPrint").innerHTML;
            var printWindow = window.open('', '', 'height=600,width=800');
            var today = new Date();
            var formattedDate = today.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short', // "Feb"
                year: 'numeric' // "2025"
            }).replace(',', '');
            content = content.replace(/\.\d+/g, '');

            var TopContent = `<p><b>Date : ${formattedDate} <b></p>  `;



            var bottomContent = `
                            <br>
                            <div> 
                              <table border="1" class="table table-bordered">  <thead>
                                <tr>
                                <th>Denomination</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                              ${v5000 > 0 ? `
                                    <tr>
                                    <td>5000</td>
                                    <td>${v5000}</td>
                                    <td>${addcoma(v5000 * 5000)}</td>
                                    </tr>` : ''}

                                ${v1000 > 0 ? `
                                    <tr>
                                    <td>1000</td>
                                    <td>${v1000}</td>
                                    <td>${addcoma(v1000 * 1000)}</td>
                                    </tr>` : ''}

                                ${v500 > 0 ? `
                                    <tr>
                                    <td>500</td>
                                    <td>${v500}</td>
                                    <td>${addcoma(v500 * 500)}</td>
                                    </tr>` : ''}

                                ${v100 > 0 ? `
                                    <tr>
                                    <td>100</td>
                                    <td>${v100}</td>
                                    <td>${addcoma(v100 * 100)}</td>
                                    </tr>` : ''}

                                ${v50 > 0 ? `
                                    <tr>
                                    <td>50</td>
                                    <td>${v50}</td>
                                    <td>${addcoma(v50 * 50)}</td>
                                    </tr>` : ''}

                                ${v20 > 0 ? `
                                    <tr>
                                    <td>20</td>
                                    <td>${v20}</td>
                                    <td>${addcoma(v20 * 20)}</td>
                                    </tr>` : ''}

                                ${v10 > 0 ? `
                                    <tr>
                                    <td>10</td>
                                    <td>${v10}</td>
                                    <td>${addcoma(v10 * 10)}</td>
                                    </tr>` : ''}
                            </tbody>
                            <tfoot>  <tr>
                                <td colspan="2" align="right">Total</td>  <td>${grandTotal}</td>
                                </tr>
                            </tfoot>
                            </table>
                            </div>
                        `;

            printWindow.document.write(`
                                <html>
                                <head>
                                    <title>Print</title>
                                    <style>
                                        @media print {
                                            body {
                                                margin: 20px;
                                                font-family: Arial, sans-serif;
                                            }
                                            .no-break {
                                                page-break-inside: avoid; /* Prevent breaking inside */
                                            }
                                            p, div {
                                                margin: 2px 0;  /* Reduce space between lines */
                                                padding: 0;     /* Remove padding */
                                                line-height: 1.2; /* Reduce extra spacing */
                                                font-size: 14px; /* Adjust text size */
                                                display: block;
                                                font-family : Rationale, sans-serif;
                                            }
                                        }
                                    </style>
                            `);

            // **Include all styles from the current document**
            var allStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
            allStyles.forEach(style => {
                printWindow.document.write(style.outerHTML);
            });

            printWindow.document.write(`
                    </head>
                    <body>
                        <div class="no-break">
                            ${TopContent}
                            ${content}
                            ${bottomContent}
                        </div>
                    </body>
                    </html>
                `);

            printWindow.document.close();
            printWindow.print();
        }

        (function($) {
            $(window).on("load", function() {
                $(".demo-y").mCustomScrollbar({
                    theme: "dark-2"
                });
            });
        })(jQuery);
    </script>
    <script src="{{ asset('js/custom/admin-sale-close.js') }}"></script>
    @endpush