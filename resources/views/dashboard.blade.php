@extends('layouts.app')

@section('content')


{{-- Inline styles taken from template for the MTD Sales blue card --}}
<style>
    .mtd-sale {
        background: linear-gradient(0deg, #0038ba 0%, #1e54d3 100%);
        padding: 15px;
        border-radius: 12px;
        color: #fff;
        height: 100%;
    }

    .mtd-sale-light {
        background: #3f3f3f !important;
    }

    .mtd-sale .btn {
        padding: 0;
        background: transparent;
        color: #fff;
    }

    .mtd-sale .btn svg {
        margin-top: -3px;
    }

    .mtd-sale .dropdown-menu {
        padding: 5px 0 0px 0 !important;
        border: none;
        box-shadow: 0px 0px 15px 0px rgba(82, 63, 105, 0.2);
        -webkit-box-shadow: 0px 0px 15px 0px rgba(82, 63, 105, 0.4);
        -moz-box-shadow: 0px 0px 15px 0px rgba(82, 63, 105, 0.4);
        -ms-box-shadow: 0px 0px 15px 0px rgba(82, 63, 105, 0.4);
        margin-top: 6px;
        min-width: 130px;
    }

    .mtd-sale .dropdown-item {
        padding: 3px 10px;
        color: #282828;
        font-size: 13px;
    }

    .mtd-sale .dropdown-item:hover {
        background-color: #f4f5fa;
        color: #0038ba;
    }

    .mtd-sale .bi-bar-chart-line {
        width: 22px;
        height: 22px;
        opacity: 0.75;
        margin-top: -3px;
    }

    .mtd-sale-val {
        padding-top: 30px;
        font-size: 15px;
        color: #c1caee;
        line-height: 1;
        margin-bottom: 0px;
    }

    .mtd-sale-val .divVal {
        font-size: 32px;
        color: #fff;
        display: block;
        font-family: 'Rationale', sans-serif !important;
        padding-top: 8px;
        line-height: 1;
    }

    .mtd-sale-val .divVal svg {
        width: 24px;
        height: 24px;
        margin-top: -5px;
        color: #32d376;
    }

    .mtd-Gross-val {
        padding-top: 10px;
        font-size: 13px;
        color: #aeb8e3;
    }

    .mtd-Gross-val span {
        font-size: 28px;
        color: #fff;
        display: block;
        font-family: 'Rationale', sans-serif !important;
        padding-top: 5px;
        line-height: 1;
    }

    .since-month {
        font-size: 13px;
        padding: 3px 8px;
        background-color: rgba(0, 0, 0, 0.3);
        margin-top: 10px;
        border-radius: 3px;
        display: inline-block;
    }

    .small-card-col-3 {
        max-width: 320px;
        width: 320px;
    }

    .small-card {
        max-width: 275px;
        width: 275px;
    }

    .Target-val {
        font-size: 18px;
        font-family: 'Rationale', sans-serif !important;
        line-height: 1;
        text-align: right;
    }

    .Target {
        background-color: #fff;
        box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.05);
        padding: 15px;
        border-radius: 12px;
        height: 100%;
        font-size: 14px;
    }

    .Target h2 {
        font-size: 18px;
    }

    .Target .bi-bullseye,
    .bi-graph-up-arrow,
    .bi-speedometer2,
    .small-card .bi,
    .bi-symmetry-vertical {
        margin-right: 10px;
        color: #0038ba;
        width: 20px;
        height: 20px;
        margin-top: -3px;
    }

    .progress-1,
    .progress-2 {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        margin: 20px auto;
    }

    .progress-1 i,
    .progress-2 i {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        transform: rotate(calc(45deg + calc(calc(360deg / var(--tlt-br-cnt)) * var(--i))));
    }

    .progress-1 i::after,
    .progress-2 i::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        background: #c4c4c4;
        width: 2px;
        height: 18px;
        border-radius: 999rem;
        transform: rotate(-45deg);
        transform-origin: top;
        opacity: 0;
        animation: barCreationAnimation 100ms ease forwards;
        animation-delay: calc(var(--i) * 15ms);
    }

    .progress-1 .selected1::after,
    .progress-2 .selected1::after {
        background: #0038ba;
    }

    .progress-1 .selected2::after,
    .progress-2 .selected2::after {
        background: #0038ba;
    }

    .percent-text {
        font-size: 32px;
        margin: 0;
        color: #0038ba;
        font-family: 'Rationale', sans-serif !important;
        line-height: 1;
        animation: barCreationAnimation 500ms ease forwards;
        animation-delay: calc(var(--tlt-br-cnt) * 15ms / 2);
    }

    .percent-text span {
        display: block;
        font-size: 13px;
        text-align: center;
        color: #282828;
        font-family: 'proximanova-light', sans-serif !important;
    }

    @keyframes barCreationAnimation {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    .PB-5 {
        padding-bottom: 5px;
    }

    .kpi-div {
        font-size: 13px;
    }

    .kpi-val {
        font-size: 17px;
        font-family: 'Rationale', sans-serif !important;
        line-height: 1;
        color: #0038ba;
    }

    .kpi-row {
        background-color: #f4f5fa;
        border-radius: 8px;
        margin: 0;
        padding: 6px 0;
        line-height: 1;
        margin-bottom: 7px;
    }

    .overflow-x {
        overflow-x: hidden;
        position: relative;
        padding-top: 0;
        padding-bottom: 0;
    }

    .overflow-x .ep-overflow {
        float: left;
        width: max-content;
        padding: 0 0 20px 0;
        min-width: 100%;
        display: inline-block;
        flex-wrap: unset;
        margin-right: 0;
        margin-left: 0;
    }

    .tabheading {
        font-size: 20px;
        margin-bottom: 10px;
    }

    .tabheading svg {
        width: 18px;
        height: 18px;
        margin-top: -3px;
        color: #000;
        margin-right: 5px;
        opacity: 0.45;
    }

    .top-products-wrapper {
        margin-top: 30px;
    }

    .top-products-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }

    .top-products-header h2 {
        margin: 0;
    }

    .top-products-view-all {
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #0038ba;
        cursor: pointer;
    }

    .top-products-row {
        overflow: hidden;
    }

    .product-card {
        padding: 0 12px 0 15px;
        position: relative;
        font-size: 13px;
        -webkit-transition: all 0.2s;
        -moz-transition: all 0.2s;
        transition: all 0.2s;
        -ms-transform: scale(0.96);
        -webkit-transform: scale(0.96);
        transform: scale(0.96);
        border: solid 1px #e8e8e8;
    }

    .product-card:hover {
        -webkit-transition: all 0.3s ease;
        -moz-transition: all 0.3s ease;
        transition: all 0.3s ease;
        -ms-transform: scale(1);
        -webkit-transform: scale(1);
        transform: scale(1);
        box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.25);
    }

    .product-card h3 {
        font-size: 14px;
        margin-bottom: 5px;
        margin-top: 10px;
        line-height: 20px;
        height: 42px;
        overflow: hidden;
        color: #282828;
        position: relative;
    }

    .product-card:before {
        background: #040725;
        position: absolute;
        width: 2px;
        height: 32px;
        left: 0px;
        top: 13px;
        content: '';
    }

    .PR-Thumb {
        margin: auto;
        display: block;
        text-align: center;
    }

    .PR-Thumb img {
        width: 130px;
        height: 130px;
        margin: auto;
    }

    .pr-st {
        background-color: #fbfbfb;
        border-top: solid 1px #040725;
        text-align: center;
        line-height: 1;
        margin-top: 5px;
    }

    .pr-st span {
        font-size: 20px;
        display: block;
        margin-bottom: 5px;
    }

    .pro-list .col {
        padding: 0 5px;
        max-width: 20%;
    }

    /* Core card and divisional reports styles copied from dashboard.css */
    .card {
        box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
        -webkit-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
        -moz-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
        -ms-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
        padding: 15px;
    }

    .card-heading {
        font-size: 20px;
        text-transform: uppercase;
        letter-spacing: 1px;
        position: relative;
    }

    .card-heading span {
        font-family: 'proximanova-light', sans-serif !important;
        font-weight: normal;
    }

    .card-heading:before {
        background: #0038ba;
        position: absolute;
        width: 2px;
        height: 18px;
        left: -15px;
        top: 2px;
        content: '';
    }

    .head-font {
        font-size: 14px;
    }

    .progressValue {
        font-size: 20px;
        margin-top: -2px;
        float: right;
        color: #0038ba;
        line-height: 1;
    }

    .progress {
        -webkit-box-shadow: none !important;
        background-color: rgba(120, 130, 140, .13);
        box-shadow: none !important;
        height: 6px;
        border-radius: 50px;
        margin-bottom: 8px;
        margin-top: 3px;
        overflow: hidden;
    }

    .font-digit {
        font-size: 18px;
        line-height: 1;
    }

    .divisional-reports {}

    .ex-avg-booking {
        font-size: 14px;
        padding: 0;
        color: #5f5f5f;
    }

    .ex-avg-booking span {
        display: block;
        line-height: 1;
        font-size: 25px;
        color: #282828;
    }

    .ex-avg-booking .avg-val {
        color: #282828;
        font-size: 25px;
        margin-bottom: 0;
        letter-spacing: 0;
    }

    .divisional-reports .font-digit {
        letter-spacing: normal;
        color: #0038ba;
    }

    .divisional-reports .font-digit b {
        font-size: 13px;
        color: #282828;
        letter-spacing: 0.5px;
        font-weight: normal;
        font-family: 'proximanova-light', sans-serif !important;
    }

    .total-progress {
        padding: 0px;
        margin-top: -8px;
    }

    .total-progress .progress {
        width: 110px;
        height: 110px;
        background: 0 0;
        position: relative;
    }

    .total-progress .progress::after {
        content: "";
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 8px solid #eee;
        position: absolute;
        top: 0;
        left: 0;
    }

    .total-progress .progress>span {
        width: 50%;
        height: 100%;
        overflow: hidden;
        position: absolute;
        top: 0;
        z-index: 1;
    }

    .total-progress .progress .progress-left {
        left: 0;
    }

    .total-progress .progress .progress-bar {
        width: 100%;
        height: 100%;
        background: 0 0;
        border-width: 8px;
        border-style: solid;
        position: absolute;
        top: 0;
    }

    .total-progress .progress .progress-left .progress-bar {
        left: 100%;
        border-top-right-radius: 80px;
        border-bottom-right-radius: 80px;
        border-left: 0;
        -webkit-transform-origin: center left;
        transform-origin: center left;
    }

    .total-progress .progress .progress-right {
        right: 0;
    }

    .total-progress .progress .progress-right .progress-bar {
        left: -100%;
        border-top-left-radius: 80px;
        border-bottom-left-radius: 80px;
        border-right: 0;
        -webkit-transform-origin: center right;
        transform-origin: center right;
    }

    .total-progress .progress .progress-value {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 5;
    }

    .total-progress .progress .progress-value .digitVal {
        font-family: Rationale, sans-serif !important;
        font-size: 32px;
        font-weight: normal;
        letter-spacing: normal;
        color: #0038ba;
        line-height: 1;
        text-align: center;
    }

    .total-progress .progress .progress-value .digitVal span {
        font-family: 'proximanova-semibold;', sans-serif !important;
        font-size: 13px;
        color: #282828;
        display: block;
    }

    .total-progress .progress-bar {
        background: linear-gradient(90deg, #fff 0, #fff 100%) !important;
    }

    .total-progress .progress-barColor {
        border-color: #0038ba;
    }

    .progress-bar-gray {
        background: linear-gradient(90deg, #008fe9 0%, #14a4ff 100%) !important;
    }

    .divisional-reports h4 .circle-b {
        width: 13px;
        height: 13px;
        background-color: #fff;
        border-radius: 50%;
        border: solid 3px #0038ba;
        display: inline-block;
    }

    .divisional-reports h4 .circle-g {
        border: solid 3px #14a4ff;
    }

    .dis-vs-value {
        font-size: 13px;
        letter-spacing: normal;
        color: #747674;
    }

    .dis-vs-value span {
        color: #0038ba;
        font-size: 15px;
    }

    .pr-reverse {
        transform: rotate(180deg);
    }

    .set-widthCol {
        flex: 0 0 31%;
        max-width: 31%;
    }
</style>
<link rel="stylesheet" href="{{ asset('css/dashboard-new.css') }}">
<div class="row _user-TS" style="margin-top:15px">
    <div class="col-md-12 _dashTOP"> <img class="_user_Pimage" src="images/avatar.svg" alt="">
        <h2 class="_head01">zee </h2>
        <p>Here’s what’s happening today.</p>
    </div>
</div>
<div>
    <div class="ep-overflow">
        <div class="row mr-0">
            <div class="col-md-3 small-card-col-3 pr-0">
                <div class="mtd-sale">
                    <div class="row">
                        <div class="col-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-bar-chart-line" viewBox="0 0 16 16">
                                <path
                                    d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2zm1 12h2V2h-2v12zm-3 0V7H7v7h2zm-5 0v-3H2v3h2z" />
                            </svg>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 mtd-sale-val">
                            <strong>MTD Sales</strong>
                            <div class="divVal">
                                <small>Rs.</small>
                                <span class="ttl_mtd_sale">Loading...</span>
                            </div>
                        </div>
                        <div class="col-12 mtd-Gross-val">
                            Total Units
                            <span class="ttl_units">Loading...</span>
                        </div>
                        <div class="col-12">
                            <div class="since-month ttl_growth">Loading...</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 small-card pr-0">
                <div class="mtd-sale mtd-sale-light">
                    <div class="row">
                        <div class="col-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="52.037" height="47.943"
                                viewBox="0 0 52.037 47.943" class="bi bi-bar-chart-line">
                                <g id="weight-scale" transform="translate(-8.995 -29.082)">
                                    <path id="Path_58205" data-name="Path 58205"
                                        d="M52.881,37.229H17.147A7.147,7.147,0,0,1,10,30.082H60.027A7.147,7.147,0,0,1,52.881,37.229Zm-24.5,0H40.629v6.126H28.377Zm29.607,38.8H12.042a2.042,2.042,0,0,1-2.015-2.371L13.52,47.3a4.594,4.594,0,0,1,4.548-3.945h33.89A4.594,4.594,0,0,1,56.507,47.3L60,73.655A2.042,2.042,0,0,1,57.985,76.025Z"
                                        fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-miterlimit="10" stroke-width="2" />
                                    <circle id="Ellipse_731" data-name="Ellipse 731" cx="11.231" cy="11.231"
                                        r="11.231" transform="translate(23.783 48.459)" fill="none"
                                        stroke="#fff" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-miterlimit="10" stroke-width="2" />
                                    <path id="Path_58206" data-name="Path 58206"
                                        d="M156.782,210.816v3.063m0,16.335v3.063m-11.231-11.231h3.063m16.335,0h3.063m-12.674,1.444a2.042,2.042,0,1,1,2.888,0A2.042,2.042,0,0,1,155.338,223.491Zm2.888-2.888,2.9-2.9"
                                        transform="translate(-121.768 -162.357)" fill="none" stroke="#fff"
                                        stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"
                                        stroke-width="2" />
                                </g>
                            </svg>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 mtd-sale-val">
                            <strong style="color:#eeeeee">Weight</strong>
                            <div class="divVal">
                                <span class="ttl_mtd_weight">Loading... </span>
                            </div>
                        </div>
                    </div>
                    <div class="mt-60 divisionDataRow" style="margin-top: 40px;">
                        <div class="row">
                            <div class="col-6">...</div>
                            <div class="col-6 Target-val">Loading...</div>
                        </div>
                        <div class="row">
                            <div class="col-6">...</div>
                            <div class="col-6 Target-val">Loading...</div>
                        </div>
                        <div class="row">
                            <div class="col-6">...</div>
                            <div class="col-6 Target-val">Loading...</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 small-card pl-0">
                <div class="Target">
                    <h2>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-up-arrow" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5Z" />
                        </svg>
                        Productivity
                    </h2>
                    <div class="row">
                        <div class="col-12">
                            <div class="progress-2"></div>
                        </div>
                    </div>
                    <div class="row PB-5">
                        <div class="col-6">TOTAL VISITS:</div>
                        <div class="col-6 Target-val visit_calls">Loading...</div>
                    </div>
                    <div class="row">
                        <div class="col-6">PRO. VISITS:</div>
                        <div class="col-6 Target-val productive_calls">Loading...</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 small-card  pl-0 pr-0">
                <div class="Target kpi-div">
                    <h2>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-speedometer2" viewBox="0 0 16 16">
                            <path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4zM3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.389.389 0 0 0-.029-.518z" />
                            <path fill-rule="evenodd" d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A7.988 7.988 0 0 1 0 10zm8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3z" />
                        </svg>
                        KPIs
                    </h2>
                    <div class="row kpi-row">
                        <div class="col pr-0 mt-auto mb-auto">AVG. SKUs/Order</div>
                        <div class="col-auto kpi-val avg_sku_per_order">Loading...</div>
                    </div>
                    <div class="row kpi-row">
                        <div class="col pr-0 mt-auto mb-auto">AVG. Bill Value</div>
                        <div class="col-auto kpi-val avg_bill_value">Loading...</div>
                    </div>
                    <div class="row kpi-row">
                        <div class="col pr-0 mt-auto mb-auto">AVG. Drop Size</div>
                        <div class="col-auto kpi-val avg_drop_size">Loading...</div>
                    </div>
                    <div class="row kpi-row">
                        <div class="col pr-0 mt-auto mb-auto">AVG. Time/Shop</div>
                        <div class="col-auto kpi-val avg_time_per_shop">Loading...</div>
                    </div>
                    <div class="row kpi-row">
                        <div class="col pr-0 mt-auto mb-auto">Plan Adherence</div>
                        <div class="col-auto kpi-val plan_adherence">Loading...</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Daily Sale Trend Chart Row --}}
    <div class="row" style="margin-top: 30px;">
        <div class="col-12">
            <div class="card" style="background-color: #fff; box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.05); padding: 20px; border-radius: 12px;">
                <h2 class="tabheading">
                    DAILY SALE TREND
                </h2>
                <div style="margin-bottom: 15px;">
                    <span style="font-size: 14px; color: #282828;">AVG. Sale/Day</span>
                    <span style="font-size: 18px; color: #0038ba; font-weight: 600; margin-left: 10px; font-family: 'Rationale', sans-serif !important;">170,770.02</span>
                </div>
                <div id="dailySaleTrendChart" style="height: 450px; width: 100%;"></div>
            </div>
        </div>
    </div>

    {{-- Top 5 Products Row --}}
    <div class="row top-products-wrapper">
        <div class="col-lg-12 col-md-12 col-sm-12 ">
            <div class="card BookedSales total-sale p-15">
                <div class="row m-0">
                    <h2 class="card-heading mb-15 ml-5">TOP <span>5 PRODUCTS</span>
                        <a href="#" class="top-products-view-all" style="float:right; font-size:13px;">VIEW ALL</a>
                    </h2>
                    <div class="col-12 position-relative p-0">
                        <div class="row pro-list top_products_list top-products-row">
                            <div class="col">
                                <div class="card product-card">
                                    <h3>Extreme 5Kg (MRP 2715)</h3>
                                    <div class="PR-Thumb">
                                        <img src="/images/product-placeholder.png" alt="Extreme 5Kg">
                                    </div>
                                    <div class="row pr-st product_units_0">
                                        <div class="col-12"><span>125.50 Ctns</span>Sales</div>
                                    </div>
                                </div>
                            </div>

                            <div class="col">
                                <div class="card product-card">
                                    <h3>Extreme 1Kg (MRP 545)</h3>
                                    <div class="PR-Thumb">
                                        <img src="/images/product-placeholder.png" alt="Extreme 1Kg">
                                    </div>
                                    <div class="row pr-st product_units_1">
                                        <div class="col-12"><span>57.40 Ctns</span>Sales</div>
                                    </div>
                                </div>
                            </div>

                            <div class="col">
                                <div class="card product-card">
                                    <h3>Select 5Kg (MRP 2245)</h3>
                                    <div class="PR-Thumb">
                                        <img src="/images/product-placeholder.png" alt="Select 5Kg">
                                    </div>
                                    <div class="row pr-st product_units_2">
                                        <div class="col-12"><span>45.00 Ctns</span>Sales</div>
                                    </div>
                                </div>
                            </div>

                            <div class="col">
                                <div class="card product-card">
                                    <h3>Premium 5Kg (MRP 2615)</h3>
                                    <div class="PR-Thumb">
                                        <img src="/images/product-placeholder.png" alt="Premium 5Kg">
                                    </div>
                                    <div class="row pr-st product_units_3">
                                        <div class="col-12"><span>39.00 Ctns</span>Sales</div>
                                    </div>
                                </div>
                            </div>

                            <div class="col">
                                <div class="card product-card">
                                    <h3>Premium 1Kg (MRP 525)</h3>
                                    <div class="PR-Thumb">
                                        <img src="/images/product-placeholder.png" alt="Premium 1Kg">
                                    </div>
                                    <div class="row pr-st product_units_4">
                                        <div class="col-12"><span>36.35 Ctns</span>Sales</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Booking vs Execution (step 1) --}}
    <div class="col-12 mb-20">
        <div class="card divisional-reports">
            <div class="row">
                        <div class="col-12">
                     <div class="row mr-0">
                         <div class="col-lg-4 set-widthCol">
                             <h2 class="card-heading">NET VS CREDIT<span>(SALE)</span></h2>
                            <div class="row">
                                <div class="col-12 pt-10">
                                    <div class="row">
                                        <div class="col-6 pr-0">
                                             <div class="col ex-avg-booking">Net Sale QTY (Rice)<span
                                                    class="avg-val"
                                                    id="bex_bookedUnits">20,924<small>
                                                        Units</small></span>
                                            </div>
                                        </div>
                                        <div class="col-6 pr-0">
                                             <div class="col ex-avg-booking">Credit Sale QTY (FFD)
                                                 <span class="avg-val"
                                                    id="bex_executedUnits">16,239<small>
                                                        Units</small></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 mt-20 PT-5">
                                    <div class="total-progress">
                                        <div class="progress mx-auto bookingExecProgress"
                                            data-value="78">
                                            <span class="progress-left">
                                                <span class="progress-bar progress-barColor"
                                                    style="transform: rotate(99.396deg);"></span>
                                            </span>
                                            <span class="progress-right">
                                                <span class="progress-bar progress-barColor"
                                                    style="transform: rotate(180deg);"></span>
                                            </span>
                                            <div
                                                class="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                                                <div class="digitVal"
                                                    id="bex_executionPercent">
                                                    77.61<small>%</small><span>Execution</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 pt-10">
                                    <div class="row">
                                        <div class="col-6 pr-0">
                                             <div class="col ex-avg-booking">Net Sale Value
                                                <span class="avg-val"
                                                    id="bex_booked_grs_value"
                                                    style="font-size: 20px;"><small>Rs.
                                                    </small>7,385,907</span>
                                            </div>
                                        </div>
                                        <div class="col-6 pr-0">
                                             <div class="col ex-avg-booking">Credit Sale Value
                                                <span class="avg-val"
                                                    id="bex_executed_grs_value"
                                                    style="font-size: 20px;"><small>Rs.
                                                    </small>6,252,736</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="bex_divisional"
                                    style="width: 100%; text-align: center">
                                    <div class="col-12 mb-20"
                                        style="width: 100%; text-align: center">
                                        <span class="head-font"><strong>Rice</strong><span
                                                class="progressValue">83%</span></span>
                                        <div class="progress">
                                            <div class="progress-bar" aria-valuenow="83"
                                                aria-valuemin="0" aria-valuemax="100"
                                                style="width: 83%" role="progressbar"> <span
                                                    class="sr-only">83% Complete
                                                    (success)</span>
                                            </div>
                                        </div>
                                        <div class="row font-digit">
                                            <div class="col pl-0 pr-0"><b>Booked:</b> 5,741
                                                <small>Units</small>
                                            </div>
                                            <div class="col pl-0 text-right"><b>Sold:</b>
                                                4,747
                                                <small>Units</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 mb-20"
                                        style="width: 100%; text-align: center">
                                        <span class="head-font"><strong>FFD</strong><span
                                                class="progressValue">82%</span></span>
                                        <div class="progress">
                                            <div class="progress-bar" aria-valuenow="82"
                                                aria-valuemin="0" aria-valuemax="100"
                                                style="width: 82%" role="progressbar"> <span
                                                    class="sr-only">82% Complete
                                                    (success)</span>
                                            </div>
                                        </div>
                                        <div class="row font-digit">
                                            <div class="col pl-0 pr-0"><b>Booked:</b> 13,980
                                                <small>Units</small>
                                            </div>
                                            <div class="col pl-0 text-right"><b>Sold:</b>
                                                11,492
                                                <small>Units</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 set-widthCol divisSalesGraphDiv"
                                                        style="border-left: solid 1px #e8e8e8; border-right: solid 1px #e8e8e8;">
                                                        <div class="chartjs-size-monitor">
                                                            <div class="chartjs-size-monitor-expand">
                                                                <div class=""></div>
                                                            </div>
                                                            <div class="chartjs-size-monitor-shrink">
                                                                <div class=""></div>
                                                            </div>
                                                        </div>
                                                        <h2 class="card-heading">DIVISIONAL SALES <span></span></h2>
                                                        <div class="row PT-15 PB-20">
                                                            <div class="col-6 text-right div1_name"
                                                                style="border-right:solid 1px #e8e8e8">
                                                                <h4> Net Sale <span class="circle-b"></span></h4>
                                                            </div>
                                                            <div class="col-6 div2_name">
                                                                <h4><span class="circle-b circle-g"></span> Credit Sale </h4>
                                                            </div>
                                                        </div>
                                                        <div class="divisionSoldDiv row font13 mt-15">
                                                            <div class="col text-right font-digit font16">4,747
                                                                <small>Units</small>
                                                            </div>
                                                            <div class="col-auto text-center p-0" style="width:100px;">
                                                                <strong>SOLD</strong>
                                                            </div>
                                                            <div class="col font-digit font16">11,492
                                                                <small>Units</small>
                                                            </div>
                                                        </div>
                                                        <div class="divisionRevenueDiv row font13 mt-15">
                                                            <div class="col text-right font-digit font16">Rs. 4,414,199
                                                            </div>
                                                            <div class="col-auto text-center p-0" style="width:100px;">
                                                                <strong>REVENUE</strong>
                                                            </div>
                                                            <div class="col font-digit font16">Rs. 1,838,537
                                                            </div>
                                                        </div>
                                                        <canvas class="mb-15 mt-30 chartjs-render-monitor"
                                                            id="divisional-sales" height="211"
                                                            style="display: block; height: 169px; width: 317px;"
                                                            width="396"></canvas>
                                                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>
@endsection
@push('js')
{{-- Highcharts Scripts --}}
<link rel="stylesheet" type="text/css" href="/css/highcharts-css.css">
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/data.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>


 
<script src="/js/meter-d3.min.js"></script>
<script src="/js/custom/meter-d3.min.js"></script>
<script src="/js/master.js?v=1768826959"></script>
<script src="/js/custom/nav.js?v=1.2.0"></script>
<script src="https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js"></script>
<script src="/js/timechart.js"></script>
<script src="/js/popper.min.js"></script>
<script src="/js/bootstrap.min.js"></script>
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/data.js"></script>
<script src="https://code.highcharts.com/modules/drilldown.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>
<script src="https://matco.sell360.app/js/custom/homePageReport/home-matco.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        Highcharts.chart('dailySaleTrendChart', {
            chart: {
                type: 'areaspline',
                backgroundColor: 'transparent'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: ['02-Jan', '03-Jan', '05-Jan', '06-Jan', '07-Jan', '08-Jan', '09-Jan', '10-Jan', '12-Jan', '13-Jan', '16-Jan'],
                labels: {
                    style: {
                        color: '#282828',
                        fontSize: '12px'
                    }
                },
                gridLineColor: '#e0e0e0'
            },
            yAxis: {
                title: {
                    text: ''
                },
                labels: {
                    style: {
                        color: '#282828',
                        fontSize: '12px'
                    }
                },
                gridLineColor: '#e0e0e0'
            },
            plotOptions: {
                areaspline: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, 'rgba(0, 56, 186, 0.3)'],
                            [1, 'rgba(0, 56, 186, 0.05)']
                        ]
                    },
                    lineColor: '#0038ba',
                    lineWidth: 2,
                    marker: {
                        enabled: true,
                        radius: 4,
                        fillColor: '#0038ba',
                        lineColor: '#fff',
                        lineWidth: 2
                    }
                }
            },
            series: [{
                name: 'Daily Sales',
                data: [150000, 450000, 80000, 120000, 180000, 220000, 100000, 50000, 150000, 200000, 120000]
            }],
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            }
        });
    });
    function initDivisSalesChart(zain = 0, shahi = 0) {
        // Re-create canvas to avoid reusing an old Chart.js instance
        $('#divisional-sales').remove();
        $('.divisSalesGraphDiv').append(
            `<canvas class="mb-15 mt-30" id="divisional-sales" height="160"></canvas>`
        );

        var data = {
            datasets: [{
                data: [
                    shahi,
                    zain
                ],
                backgroundColor: [
                    "#14a4ff",
                    "#0038ba",
                ],
                label: '' // for legend
            }],
            labels: [
                "",
                ""
            ],
        };

        // Use the canvas 2D context (Chart.js does not accept a jQuery object)
        var ctx = document.getElementById('divisional-sales').getContext('2d');

        new Chart(ctx, {
            data: data,
            type: 'pie',

            options: {
            tooltips: {
                enabled: false
            },

            legend: {
                display: false,
                position: 'bottom',
                labels: {
                    fontColor: "#282828",
                    boxWidth: 20,
                    usePointStyle: true,
                    padding: 25,
                    fontSize: 13,
                }
            },


            plugins: {
                labels: {
                    // render 'label', 'value', 'percentage', 'image' or custom function, default is 'percentage'
                    render: 'percentage',

                    // precision for percentage, default is 0
                    precision: 0,

                    // identifies whether or not labels of value 0 are displayed, default is false
                    showZero: true,

                    // font size, default is defaultFontSize
                    fontSize: 18,

                    // font color, can be color array for each data or function for dynamic color, default is defaultFontColor
                    fontColor: '#fff',

                    // font style, default is defaultFontStyle
                    fontStyle: 'normal',

                    // font family, default is defaultFontFamily
                    fontFamily: "'Rationale'",

                    // draw text shadows under labels, default is false
                    textShadow: true,

                    // text shadow intensity, default is 6
                    shadowBlur: 5,

                    // text shadow X offset, default is 3
                    shadowOffsetX: -2,

                    // text shadow Y offset, default is 3
                    shadowOffsetY: 2,

                    // text shadow color, default is 'rgba(0,0,0,0.3)'
                    shadowColor: 'rgba(0,0,0,0.40)',

                    // draw label in arc, default is false
                    // bar chart ignores this
                    // arc: true,

                    // position to draw label, available value is 'default', 'border' and 'outside'
                    // bar chart ignores this
                    // default is 'default'
                    position: 'default',

                    // draw label even it's overlap, default is true
                    // bar chart ignores this
                    overlap: true,

                    // show the real calculated percentages from the values and don't apply the additional logic to fit the percentages to 100 in total, default is false
                    showActualPercentages: true,

                    // set images when `render` is 'image'
                    images: [{
                        src: '',
                        width: 16,
                        height: 16
                    }],

                    // add padding when position is `outside`
                    // default is 2
                    outsidePadding: 4,

                    // add margin of text when position is `outside` or `border`
                    // default is 2
                    textMargin: 4
                }
            }
        });
    }

    // Initialize the chart once the DOM (and canvas) is ready
    document.addEventListener('DOMContentLoaded', function () {
        // Use the same sample values currently shown in the NET VS CREDIT card
        initDivisSalesChart(4747, 11492);
    });
</script>

 

<script>
    function httpPermissionsList(type, url, formData) {
        var self = this;
        return new Promise(function(resolve, reject) {
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
                },
                url: url,
                type: type,
                cache: false,
                contentType: false,
                processData: false,
                data: formData,
                success: function(e) {
                    resolve(e);
                },
                error: function(err) {
                    console.log(err);
                    if (err.status == 422 || err.status == 500) {
                        self.notification('error', 'Some Error Occured, please try again.');
                    }
                }
            });
        });
    }

    function getMonthNumber(month) {
        // Convert the month name to a number (e.g., 'Oct' to 10)
        var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        return months.indexOf(month.toLowerCase()) + 1;
    }

    function GetEmployeeLinePermissionsList(qs = '', start_date_id = '') {
        httpPermissionsList('GET', `/GetEmployeeLinePermissionsList?${qs}`).then((e) => {
            reportData.data = JSON.parse(e);
            SetRegionsDropDown(start_date_id);
        });
    }

    function onDateChange(start_date_id, end_date_id) {
        setTimeout(function() {
            console.log(start_date_id);
            let start_date = $(`#${start_date_id}`).val();
            let end_date = $(`#${end_date_id}`).val();
            if (start_date && end_date && start_date != '' && end_date != '') {
                let qs = `type=date&start_date=${start_date}&end_date=${end_date}`;
                GetEmployeeLinePermissionsList(qs, start_date_id);
            }
        }, 100);

    }

    function onMonthChange(start_month_id, end_month_id = null) {
        setTimeout(function() {
            let start_date = $(`#${start_month_id}`).val();
            let end_date = $(`#${end_month_id}`).val();
            // console.log(start_month_id+ ' => ' + start_date+ ` <==> ${end_month_id} =>` +end_date)
            if (start_date && start_date != '') {
                if (end_month_id) {
                    if (end_date && end_date != '') {

                        var inputDate = start_date;
                        var dateParts = inputDate.split('-');
                        var day = 1;
                        var month = dateParts[0];
                        var year = parseInt(dateParts[1]);
                        var firstDayOfMonth = new Date(year, getMonthNumber(month) - 1, day);
                        firstDayOfMonth.setMonth(firstDayOfMonth.getMonth() + 1);
                        firstDayOfMonth.setDate(0);
                        var lastDayOfMonth = firstDayOfMonth.getDate();

                        let qs = `type=month&start_date=01-${start_date}&end_date=${lastDayOfMonth}-${end_date}`;
                        GetEmployeeLinePermissionsList(qs, start_month_id);
                    }
                } else if (!end_month_id) {
                    let qs = `type=month&start_date=01-${start_date}`;
                    GetEmployeeLinePermissionsList(qs, start_month_id);
                }

            }
        }, 150);
    }

    //Vlidation for report forms
    $(document).ready(function() {
        $('.validateform').on('submit', function(event) {
            event.preventDefault();
            checkValidity = true;
            var form = this;
            $(form).find('.required').filter(function() {
                if ($(this).val() == '') {
                    checkValidity = false;
                }
            });
            if (checkValidity) {
                console.log('Form is valid. Submitting...');
                form.submit();
                // Uncomment this line to submit the form
            } else {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please provide all the required information (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                console.log('Validation Error:');
            }
        });
    });
 
    function httpPermissionsList(type, url, formData) {
        var self = this;
        return new Promise(function(resolve, reject) {
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
                },
                url: url,
                type: type,
                cache: false,
                contentType: false,
                processData: false,
                data: formData,
                success: function(e) {
                    resolve(e);
                },
                error: function(err) {
                    console.log(err);
                    if (err.status == 422 || err.status == 500) {
                        self.notification('error', 'Some Error Occured, please try again.');
                    }
                }
            });
        });
    }

    function getMonthNumber(month) {
        // Convert the month name to a number (e.g., 'Oct' to 10)
        var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        return months.indexOf(month.toLowerCase()) + 1;
    }

    function GetEmployeeLinePermissionsList(qs = '', start_date_id = '') {
        httpPermissionsList('GET', `/GetEmployeeLinePermissionsList?${qs}`).then((e) => {
            reportData.data = JSON.parse(e);
            SetRegionsDropDown(start_date_id);
        });
    }

    function onDateChange(start_date_id, end_date_id) {
        setTimeout(function() {
            console.log(start_date_id);
            let start_date = $(`#${start_date_id}`).val();
            let end_date = $(`#${end_date_id}`).val();
            if (start_date && end_date && start_date != '' && end_date != '') {
                let qs = `type=date&start_date=${start_date}&end_date=${end_date}`;
                GetEmployeeLinePermissionsList(qs, start_date_id);
            }
        }, 100);

    }

    function onMonthChange(start_month_id, end_month_id = null) {
        setTimeout(function() {
            let start_date = $(`#${start_month_id}`).val();
            let end_date = $(`#${end_month_id}`).val();
            // console.log(start_month_id+ ' => ' + start_date+ ` <==> ${end_month_id} =>` +end_date)
            if (start_date && start_date != '') {
                if (end_month_id) {
                    if (end_date && end_date != '') {

                        var inputDate = start_date;
                        var dateParts = inputDate.split('-');
                        var day = 1;
                        var month = dateParts[0];
                        var year = parseInt(dateParts[1]);
                        var firstDayOfMonth = new Date(year, getMonthNumber(month) - 1, day);
                        firstDayOfMonth.setMonth(firstDayOfMonth.getMonth() + 1);
                        firstDayOfMonth.setDate(0);
                        var lastDayOfMonth = firstDayOfMonth.getDate();

                        let qs = `type=month&start_date=01-${start_date}&end_date=${lastDayOfMonth}-${end_date}`;
                        GetEmployeeLinePermissionsList(qs, start_month_id);
                    }
                } else if (!end_month_id) {
                    let qs = `type=month&start_date=01-${start_date}`;
                    GetEmployeeLinePermissionsList(qs, start_month_id);
                }

            }
        }, 150);
    }

    //Vlidation for report forms
    $(document).ready(function() {
        $('.validateform').on('submit', function(event) {
            event.preventDefault();
            checkValidity = true;
            var form = this;
            $(form).find('.required').filter(function() {
                if ($(this).val() == '') {
                    checkValidity = false;
                }
            });
            if (checkValidity) {
                console.log('Form is valid. Submitting...');
                form.submit();
                // Uncomment this line to submit the form
            } else {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please provide all the required information (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                console.log('Validation Error:');
            }
        });
    });
</script>
@endpush