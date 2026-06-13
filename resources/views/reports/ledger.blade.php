@extends('layouts.app')
@section('content')
<style>
tbody, td, tfoot, th, thead, tr {
    border: 0 solid;
    border-color: #040725;
}
    @keyframes lds-ring {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    .loader-div {
        position: absolute;
        display: inline-block;
        width: 50px;
        height: 50px;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }


    .card {
        box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
        -webkit-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
        -moz-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
        -ms-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
        padding: 15px;
    }

    .header-tabs .nav-tabs .nav-item.show .nav-link,
    .header-tabs .nav-tabs .nav-link,
    .header-tabs .nav-tabs .nav-link.active {
        font-size: 15px;
        padding: 12px 30px;
        text-transform: uppercase
    }

    .dashboard-date {
        width: 260px;
        float: right;
        margin-top: 4px;
        margin-right: 0px;
        position: relative;
    }

    .dashboard-date .fa {
        position: absolute;
        top: 10px;
        right: 0;
        font-size: 16px;
        color: #888888
    }

    .dashboard-date .form-control {
        border: 0;
        box-shadow: none;
        font-size: 18px;
        text-align: right;
        z-index: 3;
        background-color: transparent !important;
        padding-right: 20px;
    }


    .total-sale {
        padding: 20px !important;
        font-size: 13px !important;
        letter-spacing: 1px !important;
        margin-bottom: 20px !important;
    }

    .card-heading {
        font-size: 20px;
        text-transform: uppercase;
        letter-spacing: 1px;
        position: relative;
    }

    .card-heading span {
        font-family: 'proximanova-light', sans-serif !important;
        font-weight: normal !important;
    }

    .card-heading:before {
        background: #040725 !important;
        position: absolute !important;
        width: 2px !important;
        height: 18px !important;
        left: -15px !important;
        top: 2px !important;
        content: '' !important;
    }

    .total-sale .card-heading:before {
        left: -15px !important;
        top: 2px !important
    }

    .total-sale .total-amount {
        font-size: 42px;
        color: #040725;
        padding: 8px 0 8px 0;
    }

    .total-sale .total-amount span {
        color: #282828
    }

    .total-sale .total-amount .per-v {
        color: #24b314;
        font-size: 24px;
        margin-left: 10px;
    }

    .unit-v {
        padding-top: 5px;
        color: #606060;
    }

    .unit-v span,
    .total-val span {
        font-size: 30px;
        display: block;
        line-height: 1;
        color: #282828
    }

    .total-val {
        color: #606060;
        text-align: center;
        padding: 14px;
    }

    .total-val span {
        color: #040725;
        margin-bottom: 5px;
    }



    .view-all {
        float: right;
        font-size: 14px;
        color: #939393;
        margin-top: 3px;
    }

    .view-all:hover {
        color: #040725;
        text-decoration: none
    }

    .mh-100 {
        min-height: 100%;
    }

    .strength {
        background-color: #fbfbfb;
        text-align: center;
        font-size: 12px;
        padding-top: 15px;
        letter-spacing: 1px
    }

    .strength .Strength-val {
        display: block;
        font-size: 35px;
        color: #040725;
    }

    .strength .Strength-lab {
        display: block;
        background-color: #040725;
        color: #fff;
        padding: 4px
    }

    .emp-val-box {
        border: solid 1px #e5e5e5;
        border-top-color: #040725;
        padding: 15px 5px 5px 8px;
        font-size: 11px;
    }

    .emp-val-box span {
        display: block;
        font-size: 32px;
        color: #040725;
        padding: 15px 0px 27px 0px;
        line-height: 1
    }

    .emp-val-box img {
        position: absolute;
        width: 60px;
        height: 60px;
        top: 15px;
        right: 15px;
    }

    .evb-set {
        padding: 15px 10px 10px 10px !important;
        font-size: 12px !important;
        letter-spacing: normal;
    }

    .avg-booking {
        background-color: #fbfbfb;
        font-size: 14px;
        color: #5f5f5f;
        margin: 30px 0 0 0;
        padding: 15px;
    }

    .avg-booking span,
    .avg-state .col span {
        display: block;
        line-height: 1;
        font-size: 19px;
        margin-bottom: 5px;
        margin-top: 5px;
        color: #282828;
    }

    .avg-booking .avg-val {
        color: #040725;
        font-size: 30px;
        margin-bottom: 0;
        letter-spacing: 0;
    }

    .avg-state {
        margin: 0;
        color: #5f5f5f;
        font-size: 15px;
    }

    .avg-state .col {
        border: solid 1px #e8e8e8;
        text-align: center;
        padding: 10px;
    }

    .set-monthly {
        font-size: 13px !important;
        padding: 10px 15px !important;
    }

    .avg-booking span {
        font-size: 22px !important
    }

    .avg-booking .avg-val {
        font-size: 25px !important
    }


    .card-heading:before {
        background: #040725 !important;
        position: absolute !important;
        width: 2px !important;
        height: 18px !important;
        left: -15px !important;
        top: 2px !important;
        content: '' !important;
    }

    .total-sale .card-heading:before {
        left: -20px !important;
        top: 2px !important
    }

    .total-sale .total-amount {
        font-size: 42px;
        color: #040725;
        padding: 8px 0 8px 0;
    }

    .total-sale .total-amount span {
        color: #282828
    }

    .total-sale .total-amount .per-v {
        color: #24b314;
        font-size: 24px;
        margin-left: 10px;
    }

    .unit-v {
        padding-top: 5px;
        color: #606060;
    }

    .unit-v span,
    .total-val span {
        font-size: 30px;
        display: block;
        line-height: 1;
        color: #282828
    }

    .total-val {
        color: #606060;
        text-align: center;
        padding: 14px;
    }

    .total-val span {
        color: #040725;
        margin-bottom: 5px;
    }



    .view-all {
        float: right;
        font-size: 14px;
        color: #939393;
        margin-top: 3px;
    }

    .view-all:hover {
        color: #040725;
        text-decoration: none
    }

    .mh-100 {
        min-height: 100%;
    }

    .avg-booking {
        background-color: #fbfbfb;
        font-size: 14px;
        color: #5f5f5f;
        margin: 30px 0 0 0;
        padding: 15px;
    }

    .avg-booking .avg-val {
        color: #040725;
        font-size: 30px;
        margin-bottom: 0;
        letter-spacing: 0;
    }

    .avg-state {
        margin: 0;
        color: #5f5f5f;
        font-size: 15px;
    }

    .avg-state .col {
        border: solid 1px #e8e8e8;
        text-align: center;
        padding: 10px;
    }

    .avg-state-size {
        margin-top: 0px;
    }

    .avg-state-size .col {
        padding: 10px;
        font-size: 12px;
    }

    .avg-state-size span {
        font-size: 22px !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important
    }

    .emp-pic {
        width: 84px;
        height: 84px;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
        padding: 5px;
        margin: 15px auto 25px auto
    }

    .emp-pic .pic {
        width: 75px;
        height: 75px;
        border-radius: 50%;
        border: solid 2px #040725
    }

    .emp-pic .badge-icon {
        position: absolute;
        width: auto;
        height: 38px;
        top: 80px;
        left: 0;
        right: 0;
        margin: auto
    }

    .emp-tr {
        padding-top: 13px;
        padding-bottom: 2px;
        margin-bottom: 15px;
    }

    .emp-tr span {
        display: block
    }

    .emp-tr strong {
        width: 95px;
        display: inline-block;
    }

    .state-01 {
        font-size: 14px;
        border-top: solid 1px #040725;
        position: relative
    }

    .state-01 .col {
        padding-left: 5px;
        padding-right: 5px;
    }

    .top1-employee {
        position: relative;
        font-size: 14px;
        overflow: hidden;
        z-index: 5
    }

    .employee-bg {
        position: absolute;
        right: -140px;
        bottom: 0;
        filter: grayscale(1);
    }

    .employee-bg:before {
        background-image: radial-gradient(circle at center, rgba(0, 0, 0, 0) 25%, rgba(255, 255, 255, 0.2), #fff 60%);
        position: absolute;
        width: 101%;
        height: 101%;
        left: 0;
        top: 0;
        content: '';
        z-index: 2;
    }

    .employee-bg img {
        width: 100%;
        height: 100%;
        opacity: 0.1;
        z-index: -1
    }

    .head-font {
        font-size: 14px;
    }

    .progressValue {
        font-size: 20px;
        margin-top: -2px;
        float: right;
        color: #040725;
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
        line-height: 1
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

    .product-card:HOVER {
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
        text-align: center
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

    .pr-st .col-6 {
        padding: 10px;
    }

    .bg-shade {
        background-color: #f1f1f1;
    }

    .pro-list .col {
        padding: 0 5px;
        max-width: 20%;
    }

    .avg-booking-day {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .avg-booking-day h2 {
        font-size: 18px;
        color: #606060;
        line-height: 1;
        margin: 0
    }

    .avg-booking-day h2 span {
        font-size: 30px;
        display: block;
        color: #040725;
        padding-top: 2px;
    }

    .segmentType-value {
        font-size: 20px;
        line-height: 1;
        margin-top: 20px
    }

    .segmentType-value span {
        font-size: 32px;
        color: #040725;
        display: block
    }

    .timechart-div {
        position: absolute;
        top: -10px;
        right: 0;
    }

    .sticky-footer {
        z-index: 5;
    }

    .et-topsec {
        font-size: 13px;
    }

    .et-topsec .strength .Strength-val,
    .et-topsec .emp-val-box span {
        font-size: 25px
    }

    .et-topsec .strength .Strength-lab {
        font-size: 12px
    }

    .et-topsec .emp-val-box img {
        height: 50px;
        width: 50px;
    }

    .et-topsec .emp-val-box span {
        padding: 11px 0px 18px 0px;
    }


    .total-progress .progress::after {
        content: "";
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 8px solid #eee;
        position: absolute;
        top: 0;
        left: 0
    }

    .total-progress .progress>span {
        width: 50%;
        height: 100%;
        overflow: hidden;
        position: absolute;
        top: 0;
        z-index: 1
    }

    .total-progress .progress .progress-left {
        left: 0
    }

    .total-progress .progress .progress-bar {
        width: 100%;
        height: 100%;
        background: 0 0;
        border-width: 8px;
        border-style: solid;
        position: absolute;
        top: 0
    }

    .total-progress .progress .progress-left .progress-bar {
        left: 100%;
        border-top-right-radius: 80px;
        border-bottom-right-radius: 80px;
        border-left: 0;
        -webkit-transform-origin: center left;
        transform-origin: center left
    }

    .total-progress .progress .progress-right {
        right: 0
    }

    .total-progress .progress .progress-right .progress-bar {
        left: -100%;
        border-top-left-radius: 80px;
        border-bottom-left-radius: 80px;
        border-right: 0;
        -webkit-transform-origin: center right;
        transform-origin: center right
    }

    .total-progress .progress .progress-value {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 5
    }

    .total-progress .progress .progress-value .digitVal {
        /*font-family: Rationale, sans-serif !important;*/
        font-size: 32px;
        font-weight: normal;
        letter-spacing: normal;
        color: #040725;
        line-height: 1;
        text-align: center
    }

    .total-progress .progress .progress-value .digitVal span {
        font-family: 'proximanova-semibold;', sans-serif !important;
        font-size: 13px;
        color: #282828;
        display: block;
    }

    .total-progress .progress-bar {
        background: linear-gradient(90deg, #fff 0, #fff 100%) !important
    }

    .total-progress .progress-barColor {
        border-color: #040725
    }

    .map-section {
        height: 100vh;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0px;
    }

    .map-section::before {
        content: '';
        position: absolute;
        display: block;
        top: 0px;
        left: 0;
        z-index: 2;
        width: 100%;
        height: 120px;
        background: -moz-linear-gradient(top, rgba(255, 255, 255, 1) 11%, rgba(255, 255, 255, 0) 100%);
        background: -webkit-linear-gradient(top, rgba(255, 255, 255, 1) 11%, rgba(255, 255, 255, 0) 100%);
        background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 11%, rgba(255, 255, 255, 0) 100%);
    }

    .map-section::after {
        content: '';
        position: absolute;
        display: block;
        top: -5px;
        left: 0;
        z-index: 3;
        width: 100%;
        height: 70px;
        background: -moz-linear-gradient(top, rgba(255, 255, 255, 1) 11%, rgba(255, 255, 255, 0) 100%);
        background: -webkit-linear-gradient(top, rgba(255, 255, 255, 1) 11%, rgba(255, 255, 255, 0) 100%);
        background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 11%, rgba(255, 255, 255, 0) 100%);
    }

    .act-loc {
        color: #040725;
        font-size: 16px;
        padding-left: 10px;
    }

    .act-loc .fa {
        color: #040725;
        padding-right: 5px;
    }

    .map-top {
        z-index: 10;
        position: relative;
        padding: 20px
    }

    .map-top .dashboard-date {
        margin-top: -15px;
        margin-right: 0
    }

    .shift-overview .search-timeline {
        position: relative;
        height: 45px;
    }

    .shift-overview .search-timeline .CL-Product {
        background-color: #f3f3f3;
        width: 420px;
        margin: 0;
        padding: 8px;
        position: fixed;
        z-index: 10
    }

    .shift-overview .search-timeline .CL-Product .fa {
        left: 16px;
    }

    /*   ---------- productlist-----------*/


    .productcard {
        border-top: solid 2px #040725;
        box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
        -webkit-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
        -moz-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
        -ms-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
        background-color: #fff;
        position: relative;
        display: block;
        color: #282828;
        margin-bottom: 25px;
        -webkit-transition: all 0.2s ease-in-out;
        -moz-transition: all 0.2s ease-in-out;
        -o-transition: all 0.2s ease-in-out;
        transition: all 0.2s ease-in-out;
        padding-bottom: 5px;
        min-height: 172px;
    }

    .productcard:HOVER {
        text-decoration: none;
        color: #282828;
        box-shadow: 0px 0px 20px 0px rgba(82, 63, 105, 0.5);
        -webkit-box-shadow: 0px 0px 20px 0px rgba(82, 63, 105, 0.5);
        -moz-box-shadow: 0px 0px 20px 0px rgba(82, 63, 105, 0.5);
        -ms-box-shadow: 0px 0px 20px 0px rgba(82, 63, 105, 0.5);
        -webkit-transition: all 0.2s ease-in-out;
        -moz-transition: all 0.2s ease-in-out;
        -o-transition: all 0.2s ease-in-out;
        transition: all 0.2s ease-in-out;
        -ms-transform: scale(1.03);
        -webkit-transform: scale(1.03);
        transform: scale(1.03);
    }

    .productcard .pro-pic {
        width: 50px;
        height: 50px;
        position: relative;
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
        margin-top: 10px
    }

    .productcard .pro-pic img {
        width: 50px;
        height: 50px
    }

    .productcard h4 {
        font-size: 14px;
        padding-right: 10px;
        padding-top: 10px;
        margin-bottom: 5px;
    }

    .productcard p {
        margin-bottom: 3px;
        font-size: 12px;
        line-height: 1;
        color: #606060;
        letter-spacing: normal
    }

    .productcard p strong {
        margin-right: 2px;
    }

    .productcard .productvalue {
        font-size: 13px;
        padding-top: 5px;
    }

    .productcard .productvalue span {
        font-size: 18px;
        line-height: 1
    }

    .productcard .total-progress {
        padding: 0px;
        margin-top: -5px;
    }

    .productcard .total-progress .progress {
        width: 58px;
        height: 58px;
    }

    .productcard .total-progress .progress .progress-value .digitVal {
        font-size: 24px
    }

    .productcard .total-progress .progress .progress-value .digitVal span {
        font-size: 11px
    }

    .productcard .total-progress .progress::after,
    .productcard .total-progress .progress .progress-bar {
        border-width: 4px;
    }

    .dash-filter {
        width: 23px;
        height: 23px;
        margin-right: 15px;
        margin-top: 10px;
        cursor: pointer
    }

    .dash-filter img {
        width: 100%;
        height: auto;
    }

    .filter-select {
        padding-top: 9px;
        width: 350px
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

    .se_cus-type .form-control,
    .se_cus-type .form-s2 .select2-container .select2-selection--single {
        border: 1px solid #eeeeee;
        background-color: #fff;
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
        border: none !important
    }

    .filter-refine {
        padding-top: 10px
    }

    .filter-refine strong {
        font-size: 13px;
        margin-right: 10px;
    }

    .filter-refine .alert-color {
        background-color: #fff;
        border: solid 1px #dedede;
    }

    ._cl-bottom .btn {
        letter-spacing: 1px
    }

    .total-vals {
        border: solid 1px #e4e4e4;
        border-top: solid 1px #040725;
        text-align: center;
        margin: 0;
        font-size: 14px;
        margin-top: 25px;
    }

    .total-vals .col {
        border-right: solid 1px #e4e4e4;
        padding: 20px 8px 16px 8px;
    }

    .total-vals span {
        display: block;
        font-size: 30px;
        color: #040725;
        line-height: 1;
        padding-bottom: 10px;
    }

    .keytrend-lr {
        font-size: 15px
    }

    .keytrend-lr .col-12 {
        border-bottom: solid 1px #eaeaea;
        padding-top: 15px;
        padding-bottom: 15px;
    }

    .keytrend-lr span {
        float: right;
        color: #040725;
        font-size: 22px;
        line-height: 1;
        margin-top: -1px;
    }

    .top-pro-lr {
        padding-top: 15px;
        padding-bottom: 15px;
    }

    .top-pro-lr img {
        height: 45px;
        width: 45px
    }

    .top-pro-lr .progressValue {
        font-size: 22px
    }

    /*          ----  Divisional Reports      --------------- */
    .divisional-reports {}

    .head-blue {
        line-height: 1;
        font-size: 18px;
        color: #040725;
    }

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
        color: #040725
    }

    .divisional-reports .font-digit b {
        font-size: 13px;
        color: #282828;
        letter-spacing: 0.5px;
        font-weight: normal;
        font-family: 'proximanova-light', sans-serif !important;
    }

    .progress-bar-gray {
        background: linear-gradient(90deg, #008fe9 0%, #14a4ff 100%) !important;
    }

    .divisional-reports .profile-center .nav-pills .nav-link,
    .divisional-reports ._report-Head .nav-pills .nav-link {
        margin: 0;
        padding: 5px 20px;
    }

    .divisional-reports ._report-Head {
        width: auto;
        background-color: #fff;
        height: 35px;
        margin: 0;
        padding: 0;
        margin-top: -10px;
    }

    .divisional-reports h4 {
        font-size: 16px;
        margin: 0
    }

    .divisional-reports h4 .circle-b {
        width: 13px;
        height: 13px;
        background-color: #fff;
        border-radius: 50%;
        border: solid 3px #040725;
        display: inline-block;
    }

    .divisional-reports h4 .circle-g {
        border: solid 3px #14a4ff;
    }

    .dis-vs-value {
        font-size: 13px;
        letter-spacing: normal;
        color: #747674
    }

    .dis-vs-value span {
        color: #040725;
        font-size: 15px;
    }

    .pr-reverse {
        transform: rotate(180deg);
    }

    .set-widthCol {
        flex: 0 0 31%;
        max-width: 31%;
    }

    .shopclose {
        font-size: 13px;
        cursor: pointer;
        color: #040725 !important;
    }

    .shopclose .fa {
        font-size: 15px;
    }

    .shopclose:hover {
        color: #282828 !important;
        text-decoration: none;
    }

    .sc-visit-img {
        max-width: 600px;
        height: auto;
    }

    .top1-employee .avg-state span {
        letter-spacing: normal;
        font-size: 19px;
        margin-top: 9px;
    }

    .dash-order-list {
        border-bottom: solid 1px #efefef;
        font-size: 13px;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .dash-order-list h3 {
        font-size: 16px;
        margin-bottom: 3px;
        padding-top: 4px;
        color: #282828
    }

    .dash-order-list .dash-ord-price {
        font-size: 20px;
        color: #040725
    }

    .dash-order-list .btn-primary {
        letter-spacing: 1px;
        padding: 2px 18px;
        font-size: 13px;
        box-shadow: none;
        margin-top: 3px;
    }

    .dash-order-list .ord-d {
        display: block;
    }

    .dash-order-list .ord-d strong {
        padding-right: 15px;
    }

    .dash-order-list:hover {
        background-color: #f9f9f9
    }

    .posm-img {
        width: 118px;
        height: 118px;
        margin: 20px 17px 0px 0px;
    }

    .lb-data .lb-caption {
        font-size: 16px !important;
        font-family: proximanova-semibold !important;
    }

    .tab-inner-link {
        cursor: pointer;
        text-decoration: none !important;
        display: block;
        color: #282828
    }

    .tab-inner-link:hover {
        color: #040725
    }

    .min-h-auto {
        min-height: auto !important;
    }

    .set-icon-size img {
        width: 43px;
        height: 43px;
    }

    .PR-Thumb {
        height: auto;
        padding-bottom: 8px;
    }

    .overflow-scroll {
        overflow-y: auto;
        height: 283px;
        padding-right: 5px;
        overflow-x: hidden;
    }

    .lg-pr-15 {
        padding-right: 15px;
    }


    .mt-date {
        margin-top: -10px !important
    }

    .trending_emp_name {
        margin: 25px 0px;
        display: block
    }


    @media (max-width: 1280px) {
        .empvisits .col-6 {
            letter-spacing: normal;
            padding-left: 8px;
            padding-right: 8px;
        }
    }

    @media (max-width: 1024px) {
        ._report-Head .nav-pills .nav-link {
            font-size: 15px !important;
            padding: 5px 15px !important;
        }

        .keytrend-lr {
            letter-spacing: normal;
        }

        .top-units-list {
            letter-spacing: normal;
        }

        .productcard .pro-pic {
            width: 40px;
            height: 40px;
        }

        .productcard .pro-pic img {
            width: 40px;
            height: 40px
        }

        .productcard h4 {
            font-size: 13px;
            letter-spacing: 0;
        }

        .unit-v span {
            font-size: 22px;
        }

        .avg-booking-day h2 {
            font-size: 16px;
        }

        .set-icon-size .col {
            padding-left: 6px;
        }

        .ex-avg-booking .avg-val {
            font-size: 22px;
        }


        .pr-st span {
            font-size: 18px;
        }

        .pr-st {
            font-size: 11px;
        }

        .L-1024-overflow {
            width: 100%;
            overflow-x: scroll;
        }

        .p-1024-width {
            width: 1000px;
        }

        .evb-set {
            font-size: 10px !important;
        }

        .mt-date {
            margin-top: -5px !important
        }

        .product-card h3 {
            font-size: 12px;
            line-height: 17px;
            height: 36px;
            letter-spacing: normal;
        }

        .product-card:before {
            top: 10px;
        }
    }

    @media (max-width:992px) {
        .emp-val-box {
            padding: 15px 1px 5px 6px;
        }

        .avg-state {
            font-size: 13px !important;
        }

        .card-heading {
            letter-spacing: normal
        }
    }

    @media (max-width: 800px) {
        .lg-pr-15 {
            padding-right: 0;
        }

        .overflow-scroll {
            overflow-y: none;
            height: auto;
            padding-right: 0px;
            overflow-x: none;
        }

        .top-units-800 {
            padding-right: 0 !important;
            padding-bottom: 20px !important;
            padding-top: 20px !important;
        }

        .mb-30-L800 {
            margin-bottom: 30px;
        }

        .pr-0-L800 {
            padding-right: 0 !important;
        }

        .mr-0-L800 {
            margin-right: 0 !important;
        }

        .PR-WL800-set {
            max-width: 115px !important;
        }

        .NO-WL800-set {
            max-width: 40px !important;
            padding: 0;
        }

        .top-units-list {
            letter-spacing: 1px;
        }

        .total-sale .total-amount {
            font-size: 35px;
        }

        .unit-v span {
            font-size: 20px;
            letter-spacing: 0.5px;
        }

        .total-val span {
            font-size: 26px;
        }

        .avg-booking {
            margin: 15px 0 0 0;
        }

        .top1-employee {
            margin-top: 15px;
        }

        .top1-employee {
            margin-top: 15px;
            padding-top: 15px;
        }

        .set-widthCol {
            flex: 0 0 100%;
            max-width: 100%;
            margin-bottom: 30px;
        }

        .emp-val-box span {
            font-size: 28px;
        }

        .strength .Strength-val {
            font-size: 33px;
        }

        .top1-employee .avg-state span {
            font-size: 22px;
        }

        .total-val {
            padding: 10px;
        }

        .trending_emp_name {
            margin: 10px 0px;
            display: block
        }
    }

    .datepicker-dropdown.datepicker-orient-left:before,
    .datepicker-dropdown.datepicker-orient-left:after {
        right: 15px;
        left: auto;
    }

    .view-all-tab {
        margin: 0;
        position: absolute;
        right: 20px;
        top: 52px;
        font-size: 14px;
        color: #939393;
        cursor: pointer;
    }

    @media (max-width: 1366px) {
        ._cust_filter {
            width: 159px;
        }
    }

    .border-left {
        border-left: 1px solid #dee2e6 !important;
    }

    .dt-buttons .dt-button,
    .dt-buttons .dt-button:hover {
        background: linear-gradient(90deg, #040725 0%, #040725 100%) !important;
        border: none !important;
        color: #fff !important;
        outline: none !important;
        padding: 5px 10px !important;
        line-height: 1 !important;
        font-size: 13px !important;
        letter-spacing: 1px
    }

    .Product-Filter .btn-primary {
        font-size: 14px !important;
        padding: 4px 20px !important;
    }

    .no-info {
        border: 1px solid gray;
        display: flex;
        height: 12.125rem;
        opacity: 0.4;
        font-size: 0.9375rem;
        text-align: center;
    }

    ._cust_filter {
        width: 250px !important;
    }

    @media only screen and (max-width:575px) {
        .Product-Filter .col-auto {
            width: 100% !important;
        }

        ._cust_filter {
            width: 100% !important;
            padding: 0 !important;
        }

        .CL-Product {
            width: 100% !important;
            padding-right: 2px !important;
            margin: 0 !important;
        }

        .col-auto.hide {
            padding: 0 12px 0px !important;
        }

        .col-auto.hide .CL-Product.inputmonth.focused {
            margin-top: 10px !important;
        }

        .Product-Filter .btn-primary {
            margin-top: 10px !important;
        }
    }

    .CL-Product input {
        height: 31px !important;
    }

    .reset-btn {
        box-shadow: none;
    }

    .reset-btn:hover {
        color: white !important;
    }

    .Product-Filter .btn-primary {
        float: none;
    }

    .key-trend {
        background-color: #fbfbfb;
        border-bottom: solid 1px #eaeaea;
        padding: 10px;
        margin-bottom: 10px;
        font-size: 13px;
        color: #282828;
        display: block;
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        transition: all 0.3s;
        -ms-transform: scale(1);
        -webkit-transform: scale(1);
        transform: scale(1);
    }

    .key-trend:HOVER {
        background-color: #ffffff;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.25);
        text-decoration: none;
        border-bottom: solid 1px #0038ba;
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        transition: all 0.3s;
        -ms-transform: scale(1.02);
        -webkit-transform: scale(1.02);
        transform: scale(1.02);
        color: #282828;
    }

    .productivity {
        font-size: 15px;
        color: blue;
        /*font-family: 'Rationale';*/
        font-weight: 800;
        text-align: end;
    }

    .card-heading {
        font-size: 20px;
        text-transform: uppercase;
        letter-spacing: 1px;
        position: relative;
    }

    .grand_ttl_in,
    .grand_ttl_out,
    .ttl_inHand {
        font-size: 23px;
        /*font-family: 'Rationale';*/
        font-weight: bolder;
        color: #040725;
    }
.comment-box {
    margin: 0px;
    padding: 0px; 
        background-color: #f4f4f4;
        border-radius: 0px !important;
    }

    .comment-box .col {
        color: green;
    }
td {
    color: green;
        font-size: 14px; 
        /*font-family: 'Rationale';*/
        font-weight: bolder; 
    }
</style>
<!-- Body -->
<div class="header-body">
    <div class="row  ">
        <div class="col">
            <!-- Pretitle -->
            <h6 class="header-pretitle">
                Overview
            </h6>
            <!-- Title -->
            <h1 class="header-title">
                <h2 class="_head01">Daily<span> Ledger</span></h2>
            </h1>
        </div>
        <div class="col-auto">
            <ol class="breadcrumb">
                <li><a href="#"><span>Ledger</span></a></li>
                <li><span>Active</span></li>
            </ol>
        </div>
    </div>
</div>


<div class="row">
    <div class="col-lg-12">
        <div class="Product-Filter">
            <form id="search-form">
                <div class="row justify-content-between">

                    <div class="col-auto pr-0">
                        <div class="CL-Product inputmonth" style="width:250px;margin-left:11px;padding-top:0px"><i class="fa fa-calendar-alt" style="top: 8px"></i>
                            <input type="date" autocomplete="off" class="form-control date_wise" placeholder="Start Date" name="date_wise">
                        </div>
                    </div>
                    <div class="col-auto" style="float:right;">
                        <span class="ttl_inHand d-none">0.00</span>

                    </div>
                    <div class="col-auto" style="float:right;">
                    <button type="button" class="btn btn-primary" onclick="printSection()">Print </button>
                    <button type="button" class="btn btn-primary" onclick="downloadPDF()">PDF </button>
                    <!--    <button type="button" class="btn btn-primary m-0 search-btn"> Search</button>-->
                    <!--    <button type="button" class="btn btn-primary btn-line m-0 reset-btn" style="color:#040725 !important"> Reset</button>-->
                    </div>
                </div>
                <div class="row" style="margin-bottom: 10px;">

                </div>

            </form>
            <div class="clearfix"></div>
        </div>
    </div>
</div>

<!-- <div class="row">
    <div class="col-12">
        <div class="card total-sale">
            <div class="row">
                <div class="col-lg-7 col-md-12 ">
                    <div class="row">
                        <div class="col-12 position-relative">
                            <div class="timechart-div">
                                <canvas id="timechart" width="310" height="110"></canvas>
                            </div>

                            <h2 class="card-heading">Total <span> Profit</span></h2>
                            <div class="total-amount ttl_sales p-0"><span>Rs.</span> 0</div>
                        </div>
                        <div class="col-12">
                            <div class="row top_three_units_div">
                                <div class="col unit-v">Total Quantity<span class="ttl_quantity">0</span></div>
                                {{-- <div class="col unit-v">Total Units<span class="ttl_units">0</span> </div>
                                <div class="col unit-v">Total Net Revenue<span class="ttl_net_revenue">0.00</span></div> --}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-5 col-md-12">
                    <div class="row m-0">
                        <div class="col-6 total-val border-bottom"><span class="ttl_payment">0</span>
                            Total Cost</div>
                        <div class="col-6 total-val border-left border-bottom"><span class="ttl_product_discount">0</span> Total Sale</div>
                        <div class="col-6 total-val"><span class="ttl_invoice_discount">0</span> Total Invoice Discount</div>
                        <div class="col-6 total-val border-left"><span class="ttl_discount">0</span> Total Product Discount</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div> -->
<div class="row">
    <div class="col-md-12">
        <div class="" style="padding: 0px">

            <div style="min-height: 400px; display: none;" class="loader">
                <img src="images/loading.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
            </div>
            <div class="body " id="contentToPrint" >

                <div class="col-12 pb-10">
                    <div class="no-info">
                        <div class="m-auto"><strong> Select Date to Filter Your Ledger!</strong></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
@push('js')
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

<script>
   function downloadPDF() {
    const { jsPDF } = window.jspdf;
    var element = document.getElementById("contentToPrint");

    html2canvas(element, {
        scale: 3, // 🔥 Increase scale for higher quality
        useCORS: true
    }).then(canvas => {
        var imgData = canvas.toDataURL("image/png");

        // ✅ Use a larger paper size (A3) instead of A4
        var pdf = new jsPDF("p", "mm", [297, 420]); // A3 size (larger width & height)

        var imgWidth = 280; // Adjust width
        var imgHeight = (canvas.height * imgWidth) / canvas.width;

        var y = 10; // Top margin
        if (imgHeight > 410) { // If content exceeds one page
            var heightLeft = imgHeight;
            while (heightLeft > 0) {
                pdf.addImage(imgData, "PNG", 10, y, imgWidth, imgHeight);
                heightLeft -= 410;
                if (heightLeft > 0) {
                    pdf.addPage();
                    y = 10; // Reset Y position for next page
                }
            }
        } else {
            pdf.addImage(imgData, "PNG", 10, y, imgWidth, imgHeight);
        }

        pdf.save("Daily_Ledger.pdf");
    });
}

</script>

<script>
    $(document).ready(function() {
        fetchLedgers($(this).val());
        $(document).on('change', '.date_wise', function() {
            fetchLedgers($(this).val());
        })

        function fetchLedgers(select_date = null) {
            $.ajax({
                type: 'post',
                url: '/get-ledgers',
                data: {
                    _token: $('meta[name="csrf_token"]').attr('content'),
                    date: select_date,
                },
                success: function(response) {
                    let vendorTotal = 0;
                    let customerTotal = 0;
                    // Assuming response is JSON and contains customer_ledgers and vendor_ledgers
                    if (response) {
                        let ttl_receivings = response.mutafriq_udhar_receive;
                        let ttl_payments = response.mutafriq_udhar_banam;

                        console.log(ttl_receivings, ttl_payments)
                        $('.body').empty();
                        $('.body').append(`
                                <div class="row justify-content-between d-flex">  
                                    <div class="col-lg-6 col-md-12 mb-20 ">
                                        <div class="card mh-100">
                                            <div class="d-flex justify-content-between" style="border-bottom: 2px solid #040725;"> <h2 class="card-heading">Total <span>In</span></h2> <span class="grand_ttl_in">0.00</span> </div>
                                            <div class="ttl_in"> 
                                            </div>

                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-12 mb-20 ">
                                        <div class="card mh-100">
                                            <div class="d-flex justify-content-between" style="border-bottom: 2px solid #040725;"> <h2 class="card-heading">Total <span>Out</span></h2> <span class="grand_ttl_out">0.00</span> </div>
                                            <div class="ttl_out">

                                            </div>

                                        </div>
                                    </div>
                                </div>`);
                        // Clear existing tables if any
                        $('.ttl_in').empty();
                        $('.ttl_out').empty();
                        // Build Customer Table (Left)  
                        ttl_receivings = Array.isArray(ttl_receivings) ? ttl_receivings : Object.values(ttl_receivings);
                        console.log(ttl_receivings)
                        ttl_receivings.forEach((ledger, index) => {
                            let detailHtml = '';

                            // Check if there are details available
                            if (ledger.detail && ledger.detail.length > 0) {
                                detailHtml = `<div class="collapse" id="collapse_${index}">
                                                    <div class="card card-body comment-box">
                                                    <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Voucher #</th>
                                        <th>Comment</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>`;
                                ledger.detail.forEach(detail => {
                                    detailHtml += `
                                                           <tr>
                                            <td>${detail.crv_no ?? detail.invoice_no}</td>
                                            <td class="">${detail.comment}</td>
                                            <td class="">${addCommas(detail.amount)}</td>
                                        </tr>`;
                                });
                                detailHtml += ` </tbody>
                        </table></div></div>`;
                            }

                            // Append main customer entry with collapsible details
                            $('.ttl_in').append(`
                                    <a class="key-trend" data-toggle="collapse" href="#collapse_${index}" role="button" aria-expanded="false" aria-controls="collapse_${index}">
                                        <div class="row">
                                            <div class="col key-lab pr-0"><strong>${ledger.customer_name}</strong></div> 
                                            <div class="col key-val pl-0 productivity">${addCommas(ledger.total_amount)}</div>
                                        </div>
                                    </a>   
                                    ${detailHtml}
                                `);

                            customerTotal += parseFloat(ledger.total_amount) || 0; // Parse and add to total
                        });
                        ttl_payments = Array.isArray(ttl_payments) ? ttl_payments : Object.values(ttl_payments);


                        // Build Vendor Table (Right)   
                        ttl_payments.forEach((ledger, index) => {
                            let detailHtml = '';

                            // Check if there are details available
                            if (ledger.detail && ledger.detail.length > 0) {
                                detailHtml = `<div class="collapse" id="collapse_pay_${index}">
                                                    <div class="card card-body comment-box">
                                                    <table class="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th>Voucher #</th>
                                                                <th>Comment</th>
                                                                <th>Amount</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>`;
                                ledger.detail.forEach(detail => {
                                    detailHtml += ` 
                                        <tr>
                                            <td>${detail.cpv_no ?? detail.invoice_no}</td>
                                            <td class="">${detail.comment}</td>
                                            <td class="">${addCommas(detail.amount)}</td>
                                        </tr>`; 
                                                   
                                });
                                detailHtml += `</tbody>
                        </table></div></div>`;
                            }

                            // Append main vendor entry with collapsible details
                            $('.ttl_out').append(`
                                    <a class="key-trend" data-toggle="collapse" href="#collapse_pay_${index}" role="button" aria-expanded="false" aria-controls="collapse_pay_${index}">
                                        <div class="row">
                                            <div class="col key-lab pr-0"><strong>${ledger.customer_name}</strong></div> 
                                            <div class="col key-val pl-0 productivity">${addCommas(ledger.total_amount)}</div>
                                        </div>
                                    </a>   
                                    ${detailHtml}
                                `);

                            vendorTotal += parseFloat(ledger.total_amount) || 0; // Parse and add to total
                        });

                        $('.grand_ttl_out').html('Pkr ' + addCommas(vendorTotal));
                        $('.grand_ttl_in').html('Pkr ' + addCommas(customerTotal));
                        $(`.ttl_inHand`).removeClass('d-none').html('In Hand ' + addCommas(customerTotal - vendorTotal))
                    }

                },
                error: function(xhr, status, error) {
                    console.error("AJAX Error:", status, error);
                    $('#table-container').html("<p>Error fetching data.</p>"); // Handle errors
                }
            });
        } 
      
    });
    

    function printSection() { 
            
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
    .print-container {
        display: flex; /* Use flexbox to align elements side by side */
        justify-content: space-between; /* Distribute them properly */
        width: 100%;
    }
    .print-column {
        width: 48%; /* Each column takes half of the page */
        vertical-align: top; /* Aligns the content to the top */
        display: inline-block;
    }
    .no-break {
        page-break-inside: avoid; /* Prevent page breaks inside sections */
    }
    p, div {
        margin: 2px 0;
        padding: 0;
        line-height: 1.2;
        font-size: 14px;
        // font-family: Rationale, sans-serif;
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
                        </div>
                    </body>
                    </html>
                `);

            printWindow.document.close();
            printWindow.print();
        }
</script>
@endpush