@extends('layouts.app')
@section('content')
<style>
    .lds-ring {
        display: inline-block;
        position: relative;
        width: 47px;
        height: 47px;
        animation: lds-ring 10s linear infinite;
    }

    .lds-ring div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 34px;
        height: 34px;
        margin: 6px;
        border: 6px solid #152e4d;
        border-radius: 50%;
        animation: lds-ring 1.5s cubic-bezier(.7, .1, .3, .9) infinite;
        border-color: transparent;
        border-top-color: #152e4d;
    }

    .lds-ring :nth-child(1) {
        animation-delay: -0.1s;
        opacity: 0.8;
    }

    .lds-ring :nth-child(2) {
        animation-delay: -0.2s;
        opacity: 0.6;
    }

    .lds-ring :nth-child(3) {
        animation-delay: -0.3s;
        opacity: 0.4;
    }

    .lds-ring :nth-child(4) {
        animation-delay: -0.4s;
        opacity: 0.2;
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

    .dashboard-date .form-control,
    .total-sale .total-amount,
    .unit-v span,
    .total-val span,
    .key-trend .key-val,
    .strength .Strength-val,
    .emp-val-box span,
    .avg-booking span,
    .avg-state .col span,
    .font-digit,
    .progressValue,
    .pr-st span,
    .avg-booking-day h2 span,
    .segmentType-value,
    .empsale,
    .sale-pu span,
    .empvisits span,
    .total-bs .total-amount,
    .pr-unit-v span,
    .total-VO span,
    .total-time,
    .total-stime .time-s span,
    .key-tr-list span,
    .sale-val span,
    .productcard .productvalue span,
    .total-vals span,
    .keytrend-lr span,
    .ex-avg-booking span,
    .dis-vs-value,
    .dash-order-list .dash-ord-price {
        font-family: 'Rationale', sans-serif !important;
        font-size: 18px;

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

    .CL-Product {
        width: 230px;
        position: relative;
        float: left;
        margin-left: 10px;
        padding-top: 8px;
    }

    .CL-Product input {
        height: 32px;
        border: solid 1px #dedede;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        padding-left: 30px;
        font-size: 13px;
        letter-spacing: 1px
    }

    .CL-Product .fa {
        position: absolute;
        top: 16px;
        left: 8px;
        color: #b5b5b5
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
        background: #152e4d !important;
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
        color: #152e4d;
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
        color: #152e4d;
        margin-bottom: 5px;
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
        border-bottom: solid 1px #152e4d;
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        transition: all 0.3s;
        -ms-transform: scale(1.02);
        -webkit-transform: scale(1.02);
        transform: scale(1.02);
        color: #282828;
    }

    .key-trend .key-lab {
        font-size: 15px;
        padding-top: 3px
    }

    .key-trend .key-growth {
        font-size: 12px;
        text-align: center;
        padding-top: 3px
    }

    .key-trend .key-val {
        font-size: 24px;
        line-height: 1;
        text-align: right
    }

    .view-all {
        float: right;
        font-size: 14px;
        color: #939393;
        margin-top: 3px;
    }

    .view-all:hover {
        color: #152e4d;
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
        color: #152e4d;
    }

    .strength .Strength-lab {
        display: block;
        background-color: #152e4d;
        color: #fff;
        padding: 4px
    }

    .emp-val-box {
        border: solid 1px #e5e5e5;
        border-top-color: #152e4d;
        padding: 15px 5px 5px 8px;
        font-size: 11px;
    }

    .emp-val-box span {
        display: block;
        font-size: 32px;
        color: #152e4d;
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
        color: #152e4d;
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
        border: solid 2px #152e4d
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
        padding-bottom: 0px;
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
        border-top: solid 1px #152e4d;
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
        color: #152e4d;
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
        background: #152e4d;
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
        border-top: solid 1px #152e4d;
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
        color: #152e4d;
        padding-top: 2px;
    }

    .segmentType-value {
        font-size: 20px;
        line-height: 1;
        margin-top: 20px
    }

    .segmentType-value span {
        font-size: 32px;
        color: #152e4d;
        display: block
    }

    .timechart-div {
        position: absolute !important;
        top: -10px !important;
        right: 0 !important;
    }

    .sticky-footer {
        z-index: 5;
    }


    /* +++++++++  employee page   ++++++++++++ */
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@800&display=swap');

    .employeecard {
        border-top: solid 2px #152e4d;
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
    }

    .employeecard:HOVER {
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

    .emp-sno,
    .ser-no {
        font-size: 60px;
        color: #f4f4f4;
        letter-spacing: normal;
        line-height: 1;
        font-family: 'Poppins', sans-serif;
        font-weight: 800;
        position: absolute;
        right: 0;
        top: 0;
    }

    .pl-25 {
        padding-left: 25px;
    }

    .employeecard .emp-pic {
        width: 55px;
        height: 55px;
        padding: 2px;
        position: relative;
        margin: 10px auto 10px auto;
    }

    .employeecard .emp-pic .pic {
        width: 50px;
        height: 50px;
        border: solid 1px #152e4d;
    }

    .employeecard .emp-pic .badge-icon {
        position: absolute;
        width: auto;
        height: 25px;
        top: 40px;
    }

    .employeecard h4 {
        font-size: 14px;
        padding-top: 17px;
        padding-right: 10px;
    }

    .employeecard h4 span {
        display: block;
        color: #8e8e8e;
        font-size: 13px;
        padding-top: 5px;
    }

    .empsale {
        font-size: 22px;
        padding: 2px;
        border: solid 1px #eeeeee;
        text-align: center;
        margin: 0px 15px 8px 15px;
        line-height: 1
    }

    .empsale span {
        color: #152e4d;
    }

    .sale-pu {
        font-size: 12px;
        color: #666666;
        text-align: center;
        padding: 0 5px;
        letter-spacing: 0.5px;
    }

    .sale-pu span {
        font-size: 20px;
        color: #282828;
        display: block;
        line-height: 1
    }

    .empvisits {
        padding-top: 7px;
        line-height: 1;
    }

    .empvisits .col-6 {
        background-color: #f7f7f7;
        font-size: 12px;
        line-height: 1.3;
        letter-spacing: 0.5px;
        border: solid 1px #fff;
        padding-top: 8px;
        padding-bottom: 4px;
        padding-left: 10px;
        padding-right: 10px;
    }

    .empvisits span {
        font-size: 18px;
        float: right;
        margin-top: -2px;
        line-height: 1
    }

    /* ----------- Employee Shift Overview ----------- */

    .emp-shift-overview {
        padding-left: 180px;
    }

    .shift-overview {
        color: #535353;
        z-index: 7;
        padding: 0px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 450px;
        margin: 0
    }

    .shift-overview-detail {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0px 15px 15px 15px;
    }

    .shift-overview .shift-overview-top {
        width: inherit;
        padding: 15px 15px 0px 15px;
    }

    .shift-overview .card-heading {
        font-size: 18px !important;
    }

    .shift-overview ._report-Head {
        padding-top: 0;
        padding-bottom: 0;
        width: auto;
        background-color: #fff;
        height: 44px;
        margin: 0;
        margin-top: 12px;
        border-top: solid 1px #efefef
    }

    .shift-overview .top-pr-list .progress {
        margin-top: 4px;
    }

    .card-heading:before {
        left: -15px !important;
        top: 2px !important
    }

    .back-btn {
        float: right;
        font-size: 13px;
        color: #fff;
        margin-top: -2px;
        background-color: #152e4d;
        line-height: 1;
        padding: 5px 11px
    }

    .back-btn:hover {
        background-color: #152e4d;
        color: #fff;
        text-decoration: none
    }

    .emp-info {
        font-size: 14px
    }

    .emp-info p {
        margin: 0
    }

    .emp-info p strong {
        width: 68px;
        display: inline-block
    }

    .emp-info .emp-pic {
        width: 68px;
        height: 68px;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
        padding: 4px;
        margin: 0
    }

    .emp-info .emp-pic .pic {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: solid 2px #152e4d
    }

    .emp-info .emp-pic .badge-icon {
        position: absolute;
        width: auto;
        height: 25px;
        top: 50px;
        left: 0;
        right: 0;
        margin: auto
    }

    .emp-info h4 {
        font-size: 16px;
        margin-bottom: 5px;
    }

    .emp-info h4 span {
        display: block;
        color: #535353;
        padding-top: 5px;
        font-size: 14px;
    }

    .emp_status {
        position: absolute;
        right: 15px;
        top: 7px;
        border: solid 1px #e8e8e8;
        padding: 5px 10px 5px 25px;
        font-size: 13px;
        line-height: 1;
        letter-spacing: 1px
    }

    .emp_status span {
        position: absolute;
        top: 6px;
        left: 10px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #5db353;
    }

    .total-bs {
        background-color: #fbfbfb;
        padding-top: 20px;
        padding-bottom: 15px;
        border-bottom: solid 1px #efefef;
    }

    .total-bs .total-amount {
        font-size: 28px;
        color: #152e4d;
        padding: 4px 0 10px 0;
        border-bottom: solid 1px #e1e1e1;
        line-height: 1;
        margin-bottom: 10px;
    }

    .total-bs .total-amount span {
        color: #282828
    }

    .total-bs .total-amount .per-v {
        color: #24b314;
        font-size: 18px;
        margin-left: 20px;
    }

    .pr-unit-v {
        font-size: 13px;
        line-height: 1;
        text-align: center;
        margin-bottom: 10px;
    }

    .pr-unit-v .col {
        padding-left: 5px;
        padding-right: 5px
    }

    .pr-unit-v span {
        font-size: 22px;
        display: block;
        color: #282828;
        padding-bottom: 5px;
    }

    .total-VO {
        font-size: 15px;
        line-height: 1;
        margin: 15px 0 0 0
    }

    .total-VO span {
        font-size: 22px;
        display: block;
        color: #282828;
        padding-bottom: 8px;
    }

    .total-VO .icon-emp-vo {
        background-color: #fff;
        border: solid 1px #e1e1e1;
        width: 50px;
        height: 50px;
        padding: 9px;
    }

    .total-VO .icon-emp-vo img {
        width: 30px;
        height: 30px
    }

    .total-stime {
        padding-top: 20px;
        padding-bottom: 15px;
    }

    .total-stime .total-time {
        font-size: 24px;
        color: #152e4d;
        margin-bottom: 6px;
        line-height: 1
    }

    .total-stime .total-time small {
        color: #282828
    }

    .total-stime .time-s {
        border: solid 1px #ececec;
        border-top: solid 1px #152e4d;
        font-size: 13px;
        line-height: 1;
        text-align: center;
        margin: 0;
    }

    .total-stime .time-s .col {
        padding: 8px 5px
    }

    .total-stime .time-s span {
        font-size: 20px;
        display: block;
        color: #282828;
        padding-top: 10px;
        letter-spacing: normal;
        text-align: center;
    }

    .total-stime .time-icon {
        position: absolute;
        width: 52px;
        height: 52px;
        right: 15px
    }

    .bggray {
        background-color: #f3f3f3;
    }

    .total-stime .btn-primary {
        width: 100%;
        margin: 10px 0 0 0;
        text-transform: uppercase;
        letter-spacing: 1px;
        padding: 5px;
        line-height: 1
    }

    .key-tr-list {
        font-size: 14px;
        border-bottom: solid 1px #ebebeb;
        padding: 7px 15px 6px 15px;
    }

    .key-tr-list span {
        float: right;
        font-size: 20px;
        margin-top: 0;
        color: #152e4d;
        line-height: 1;
    }

    .top-pr-list {
        padding-top: 10px;
        padding-bottom: 10px;
        border-bottom: solid 1px #ebebeb
    }

    .top-pr-list img {
        width: 40px;
        height: 40px;
        border: solid 1px #ebebeb
    }

    .top-pr-list .progress {
        margin-bottom: 0px;
        margin-top: 8px;
    }

    .top-pr-list .progressValue {
        margin-top: 0
    }

    .total-progress {
        padding: 0px;
        margin-top: -8px;
    }

    .total-progress .progress {
        width: 110px;
        height: 110px;
        background: 0 0;
        position: relative
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
        font-family: Rationale, sans-serif !important;
        font-size: 32px;
        font-weight: normal;
        letter-spacing: normal;
        color: #152e4d;
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
        border-color: #152e4d
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
        color: #152e4d;
        font-size: 16px;
        padding-left: 10px;
    }

    .act-loc .fa {
        color: #152e4d;
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

    .map-b-act {
        position: absolute;
        bottom: 30px;
        left: 30px;
        width: 580px;
        z-index: 15;
        background-color: #f3f3f3;
        box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
        -webkit-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
        -moz-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
        -ms-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
    }

    .map-b-act a {
        text-align: center;
        font-size: 14px;
        display: block;
        background-color: #fff;
        width: 144px;
        padding: 10px;
        font-family: 'proximanova-semibold;', sans-serif !important;
        color: #282828;
    }

    .map-b-act a:hover,
    .map-b-act a.active {
        text-decoration: none;
        color: #fff;
        background-color: #152e4d
    }

    .map-b-act a:hover img,
    .map-b-act a.active img {
        filter: invert(100)
    }

    .map-b-act a img {
        width: 20px;
        height: 20px;
        display: block;
        margin: auto;
        margin-bottom: 5px;
    }

    .shift-overview .FU-history .Act-timeline {
        margin-left: 115px;
        border-left: 1px solid #152e4d;
    }

    .shift-overview .FU-history .Act-timeline li {
        margin-bottom: 15px
    }

    .shift-overview .FU-history .Act-timeline li .dateFollowUP {
        text-align: center
    }

    .shift-overview .FU-history .Act-timeline .historyDiv {
        margin-top: 8px;
        margin-bottom: 5px;
        padding: 6px 10px;
    }

    .shift-overview .FU-history .Act-timeline .historyDiv::before {
        top: 41px;
        left: -4px;
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
        border-top: solid 2px #152e4d;
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
        width: 60px;
        height: 60px;
        position: relative;
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
        margin-top: 10px
    }

    .productcard .pro-pic img {
        width: 60px;
        height: 60px
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
        background: linear-gradient(90deg, #1e54d3 0%, #152e4d 100%);
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
        border-top: solid 1px #152e4d;
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
        color: #152e4d;
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
        color: #152e4d;
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

    .CL-Product {
        width: 230px;
        position: relative;
        float: left;
        margin-left: 10px;
        padding-top: 8px;
    }

    .CL-Product input {
        height: 32px;
        border: solid 1px #dedede;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        padding-left: 30px;
        font-size: 13px;
        letter-spacing: 1px
    }

    .CL-Product .fa {
        position: absolute;
        top: 16px;
        left: 8px;
        color: #b5b5b5
    }

    .total-sale {
        padding: 20px;
        font-size: 13px;
        letter-spacing: 1px;
        margin-bottom: 20px;
    }

    .card-heading {
        font-size: 20px !important;
        text-transform: uppercase !important;
        letter-spacing: 1px !important;
        position: relative !important;
    }

    .card-heading span {
        font-family: 'proximanova-light', sans-serif !important;
        font-weight: normal !important;
    }

    .card-heading:before {
        background: #152e4d !important;
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
        color: #152e4d;
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
        color: #152e4d;
        margin-bottom: 5px;
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
        border-bottom: solid 1px #152e4d;
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        transition: all 0.3s;
        -ms-transform: scale(1.02);
        -webkit-transform: scale(1.02);
        transform: scale(1.02);
        color: #282828;
    }

    .key-trend .key-lab {
        font-size: 15px;
        padding-top: 3px
    }

    .key-trend .key-growth {
        font-size: 12px;
        text-align: center;
        padding-top: 3px
    }

    .key-trend .key-val {
        font-size: 24px;
        line-height: 1;
        text-align: right
    }

    .view-all {
        float: right;
        font-size: 14px;
        color: #939393;
        margin-top: 3px;
    }

    .view-all:hover {
        color: #152e4d;
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
        color: #152e4d;
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
        border: solid 2px #152e4d
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
        border-top: solid 1px #152e4d;
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
        color: #152e4d;
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
        background: #152e4d;
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
        border-top: solid 1px #152e4d;
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
        color: #152e4d;
        padding-top: 2px;
    }

    .segmentType-value {
        font-size: 20px;
        line-height: 1;
        margin-top: 20px
    }

    .segmentType-value span {
        font-size: 32px;
        color: #152e4d;
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


    /* +++++++++  employee page   ++++++++++++ */
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@800&display=swap');

    .employeecard {
        border-top: solid 2px #152e4d;
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
    }

    .employeecard:HOVER {
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

    .emp-sno,
    .ser-no {
        font-size: 60px;
        color: #f4f4f4;
        letter-spacing: normal;
        line-height: 1;
        font-family: 'Poppins', sans-serif;
        font-weight: 800;
        position: absolute;
        right: 0;
        top: 0;
    }

    .pl-25 {
        padding-left: 25px;
    }

    .employeecard .emp-pic {
        width: 55px;
        height: 55px;
        padding: 2px;
        position: relative;
        margin: 10px auto 10px auto;
    }

    .employeecard .emp-pic .pic {
        width: 50px;
        height: 50px;
        border: solid 1px #152e4d;
    }

    .employeecard .emp-pic .badge-icon {
        position: absolute;
        width: auto;
        height: 25px;
        top: 40px;
    }

    .employeecard h4 {
        font-size: 14px;
        padding-top: 17px;
        padding-right: 10px;
    }

    .employeecard h4 span {
        display: block;
        color: #8e8e8e;
        font-size: 13px;
        padding-top: 5px;
    }

    .empsale {
        font-size: 22px;
        padding: 2px;
        border: solid 1px #eeeeee;
        text-align: center;
        margin: 0px 15px 8px 15px;
        line-height: 1
    }

    .empsale span {
        color: #152e4d;
    }

    .sale-pu {
        font-size: 12px;
        color: #666666;
        text-align: center;
        padding: 0 5px;
        letter-spacing: 0.5px;
    }

    .sale-pu span {
        font-size: 20px;
        color: #282828;
        display: block;
        line-height: 1
    }

    .empvisits {
        padding-top: 7px;
        line-height: 1;
    }

    .empvisits .col-6 {
        background-color: #f7f7f7;
        font-size: 12px;
        line-height: 1.3;
        letter-spacing: 0.5px;
        border: solid 1px #fff;
        padding-top: 8px;
        padding-bottom: 4px;
        padding-left: 10px;
        padding-right: 10px;
    }

    .empvisits span {
        font-size: 18px;
        float: right;
        margin-top: -2px;
        line-height: 1
    }

    /* ----------- Employee Shift Overview ----------- */

    .emp-shift-overview {
        padding-left: 180px;
    }

    .shift-overview {
        color: #535353;
        z-index: 7;
        padding: 0px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 450px;
        margin: 0
    }

    .shift-overview-detail {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0px 15px 15px 15px;
    }

    .shift-overview .shift-overview-top {
        width: inherit;
        padding: 15px 15px 0px 15px;
    }

    .shift-overview .card-heading {
        font-size: 18px;
    }

    .shift-overview ._report-Head {
        padding-top: 0;
        padding-bottom: 0;
        width: auto;
        background-color: #fff;
        height: 44px;
        margin: 0;
        margin-top: 12px;
        border-top: solid 1px #efefef
    }

    .shift-overview ._report-Head .nav-pills .nav-link {
        font-size: 16px;
        padding: 5px 20px;
    }

    .emp-info .emp-pic {
        width: 68px;
        height: 68px;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
        padding: 4px;
        margin: 0
    }

    .emp-info .emp-pic .pic {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: solid 2px #152e4d
    }

    .emp-info .emp-pic .badge-icon {
        position: absolute;
        width: auto;
        height: 25px;
        top: 50px;
        left: 0;
        right: 0;
        margin: auto
    }

    .emp-info h4 {
        font-size: 16px;
        margin-bottom: 5px;
    }

    .emp-info h4 span {
        display: block;
        color: #535353;
        padding-top: 5px;
        font-size: 14px;
    }

    .emp_status {
        position: absolute;
        right: 15px;
        top: 7px;
        border: solid 1px #e8e8e8;
        padding: 5px 10px 5px 25px;
        font-size: 13px;
        line-height: 1;
        letter-spacing: 1px
    }

    .emp_status span {
        position: absolute;
        top: 6px;
        left: 10px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #5db353;
    }

    .total-bs {
        background-color: #fbfbfb;
        padding-top: 20px;
        padding-bottom: 15px;
        border-bottom: solid 1px #efefef;
    }

    .total-bs .total-amount {
        font-size: 28px;
        color: #152e4d;
        padding: 4px 0 10px 0;
        border-bottom: solid 1px #e1e1e1;
        line-height: 1;
        margin-bottom: 10px;
    }

    .total-bs .total-amount span {
        color: #282828
    }

    .total-bs .total-amount .per-v {
        color: #24b314;
        font-size: 18px;
        margin-left: 20px;
    }

    .pr-unit-v {
        font-size: 13px;
        line-height: 1;
        text-align: center;
        margin-bottom: 10px;
    }

    .pr-unit-v .col {
        padding-left: 5px;
        padding-right: 5px
    }

    .pr-unit-v span {
        font-size: 22px;
        display: block;
        color: #282828;
        padding-bottom: 5px;
    }

    .total-VO {
        font-size: 15px;
        line-height: 1;
        margin: 15px 0 0 0
    }

    .total-VO span {
        font-size: 22px;
        display: block;
        color: #282828;
        padding-bottom: 8px;
    }

    .total-VO .icon-emp-vo {
        background-color: #fff;
        border: solid 1px #e1e1e1;
        width: 50px;
        height: 50px;
        padding: 9px;
    }

    .total-VO .icon-emp-vo img {
        width: 30px;
        height: 30px
    }

    .total-stime {
        padding-top: 20px;
        padding-bottom: 15px;
    }

    .total-stime .total-time {
        font-size: 24px;
        color: #152e4d;
        margin-bottom: 6px;
        line-height: 1
    }

    .total-stime .total-time small {
        color: #282828
    }

    .total-stime .time-s {
        border: solid 1px #ececec;
        border-top: solid 1px #152e4d;
        font-size: 13px;
        line-height: 1;
        text-align: center;
        margin: 0;
    }

    .total-stime .time-s .col {
        padding: 8px 5px
    }

    .total-stime .time-s span {
        font-size: 20px;
        display: block;
        color: #282828;
        padding-top: 10px;
        letter-spacing: normal;
        text-align: center;
    }

    .total-stime .time-icon {
        position: absolute;
        width: 52px;
        height: 52px;
        right: 15px
    }

    .bggray {
        background-color: #f3f3f3;
    }

    .total-stime .btn-primary {
        width: 100%;
        margin: 10px 0 0 0;
        text-transform: uppercase;
        letter-spacing: 1px;
        padding: 5px;
        line-height: 1
    }

    .key-tr-list {
        font-size: 14px;
        border-bottom: solid 1px #ebebeb;
        padding: 7px 15px 6px 15px;
    }

    .key-tr-list span {
        float: right;
        font-size: 20px;
        margin-top: 0;
        color: #152e4d;
        line-height: 1;
    }

    .top-pr-list {
        padding-top: 10px;
        padding-bottom: 10px;
        border-bottom: solid 1px #ebebeb
    }

    .top-pr-list img {
        width: 40px;
        height: 40px;
        border: solid 1px #ebebeb
    }

    .top-pr-list .progress {
        margin-bottom: 0px;
        margin-top: 8px;
    }

    .top-pr-list .progressValue {
        margin-top: 0
    }

    .total-progress {
        padding: 0px;
        margin-top: -8px;
    }

    .total-progress .progress {
        width: 110px;
        height: 110px;
        background: 0 0;
        position: relative
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
        font-family: Rationale, sans-serif !important;
        font-size: 32px;
        font-weight: normal;
        letter-spacing: normal;
        color: #152e4d;
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
        border-color: #152e4d
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
        color: #152e4d;
        font-size: 16px;
        padding-left: 10px;
    }

    .act-loc .fa {
        color: #152e4d;
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

    .map-b-act {
        position: absolute;
        bottom: 30px;
        left: 30px;
        width: 525px;
        z-index: 15;
        background-color: #f3f3f3;
        box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
        -webkit-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
        -moz-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
        -ms-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.2);
    }

    .map-b-act a {
        text-align: center;
        font-size: 12px;
        letter-spacing: normal;
        display: block;
        background-color: #fff;
        width: 110px;
        padding: 8px 5px;
        font-family: 'proximanova-semibold;', sans-serif !important;
        color: #282828;
    }

    .map-b-act a:hover,
    .map-b-act a.active {
        text-decoration: none;
        color: #fff !important;
        background-color: #152e4d
    }

    .map-b-act a:hover img,
    .map-b-act a.active img {
        filter: invert(100)
    }

    .map-b-act a img {
        width: 20px;
        height: 20px;
        display: block;
        margin: auto;
        margin-bottom: 5px;
    }

    .shift-overview .FU-history .Act-timeline {
        margin-left: 115px;
        border-left: 1px solid #152e4d;
    }

    .shift-overview .FU-history .Act-timeline li {
        margin-bottom: 15px
    }

    .shift-overview .FU-history .Act-timeline li .dateFollowUP {
        text-align: center
    }

    .shift-overview .FU-history .Act-timeline .historyDiv {
        margin-top: 8px;
        margin-bottom: 5px;
        padding: 6px 10px;
    }

    .shift-overview .FU-history .Act-timeline .historyDiv::before {
        top: 41px;
        left: -4px;
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
        border-top: solid 2px #152e4d;
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
        background: linear-gradient(90deg, #1e54d3 0%, #152e4d 100%);
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
        border-top: solid 1px #152e4d;
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
        color: #152e4d;
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
        color: #152e4d;
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
        color: #152e4d;
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
        color: #152e4d
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
        border: solid 3px #152e4d;
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
        color: #152e4d;
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
        color: #152e4d !important;
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
        color: #152e4d
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
        color: #152e4d
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

        .key-trend .key-lab {
            font-size: 14px;
        }

        .key-trend .key-val {
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
        display: flex;
        height: 8.125rem;
        opacity: 0.4;
        font-size: 0.9375rem;
        text-align: center;
    }

    ._cust_filter {
        width: 250px !important;
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
                <h2 class="_head01">Stock<span> Report</span></h2>
            </h1>
        </div>
        <div class="col-auto">
            <ol class="breadcrumb">
                <li><a href="#"><span>Stock</span></a></li>
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
                    <div class="col-auto" style="margin-left:0px">
                        <div class="CL-Product inputmonth" style="width:210px;margin-left:11px;padding-top:0px;display:none"><i class="fa fa-calendar-alt" style="top: 8px"></i>
                            <input type="date" autocomplete="off" class="form-control " placeholder="Start Date" name="start_date" value="{{date('Y-m-d')}}">
                        </div>
                        <div class="CL-Product inputmonth" style="width:210px;margin-left: 0px;padding-top:0px"><i class="fa fa-calendar-alt" style="top: 8px"></i>
                            <input type="date" autocomplete="off" class="form-control" placeholder="End Date" name="end_date" value="{{date('Y-m-d')}}" readonly>
                        </div>
                    </div>
                    <div class="col pr-0" style="padding-left:0px">
                        <div class="_cust_filter col-3" style="width: 210px!important">
                            <div class="form-s2">
                                <select class="form-control formselect company_id" name="company_id">
                                    <option value="">Select Company</option>
                                    @foreach($companies as $company)
                                    <option value="{{$company->id}}">{{$company->id}}-{{$company->company_name}}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="_cust_filter col-3" style="width: 210px!important">
                            <div class="form-s2">
                                <select class="form-control formselect product_id" name="product_id">
                                    <option value="">Select Product</option>
                                    @foreach($products as $company)
                                    <option value="{{$company->id}}">{{$company->id}}-{{$company->product_name}}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="_cust_filter col-3" style="width: 210px!important">
                            <div class="form-s2">
                                <select class="form-control formselect expiry-select" name="expiry">
                                    <option value="">Select Expiry</option>
                                    <option value="1">With In One Month</option>
                                    <option value="2">With In Two Month</option>
                                </select>
                            </div>
                        </div>
                        <style>
                            .CL-Product input {
                                height: 31px !important;
                            }
                        </style>

                    </div>

                    <!-- <div class="row" style="margin-bottom: 10px;margin-left:0px"> -->
                    {{-- <div class="col-auto" style="padding: 0px">
                        <div class="CL-Product inputmonth" style="width:250px;margin-left:11px;padding-top:0px"><i class="fa fa-calendar-alt" style="top: 8px"></i>
                            <input type="date" autocomplete="off" class="form-control " placeholder="Start Date" name="start_date">
                        </div>
                        <div class="CL-Product inputmonth" style="width:250px;margin-left: 0px;padding-top:0px"><i class="fa fa-calendar-alt" style="top: 8px"></i>
                            <input type="date" autocomplete="off" class="form-control" placeholder="End Date" name="end_date">
                        </div>
                             </div> --}}

                    <div class="col-auto p-0">
                        <style>
                            .reset-btn {
                                box-shadow: none;
                            }

                            .reset-btn:hover {
                                color: white !important;
                            }
                        </style>
                        <button type="button" class="btn btn-primary btn-line m-0 reset-btn" style="color:#152e4d !important"> Reset</button>
                    </div>
                    <div class="col-auto pl-0">
                        <button type="button" class="btn btn-primary m-0 search-btn btn-product-add"> Search</button>
                    </div>
                    <!-- </div> -->
                </div>
            </form>
            <div class="clearfix"></div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-12">
        <div class="card total-sale">
            <div class="row">
                <div class="col-lg-7 col-md-12 ">
                    <div class="row">
                        <div class="col-12 position-relative">
                            {{-- <div class="timechart-div">
                                <canvas id="timechart" width="310" height="110"></canvas>
                            </div> --}}

                            <h2 class="card-heading">Total <span> Stock In Hand</span></h2>
                            <div class="total-amount ttl_stock_in_hand p-0">0</div>
                        </div>
                        {{-- <div class="col-12">
                            <div class="row top_three_units_div">
                                <div class="col unit-v">Total Quantity<span class="ttl_quantity">0</span></div>
                                <div class="col unit-v">Total Units<span class="ttl_units">0</span> </div>
                                <div class="col unit-v">Total Net Revenue<span class="ttl_net_revenue">0.00</span></div>
                            </div>
                        </div> --}}
                    </div>
                </div>
                <!-- <div class="col-lg-5 col-md-12">
                    <div class="row m-0">
                        <div class="col-6 total-val border-bottom"><span class="ttl_stock_in">0</span>Total Stock In</div>
                        <div class="col-6 total-val border-left border-bottom"><span class="ttl_stock_out">0</span> Total Stock Out</div>
                        <div class="col-6 total-val"><span class="ttl_invoice_discount">0</span> Total Return Stock</div>
                        <div class="col-6 total-val border-left">
                            {{-- <span class="expiry_date">00-00-0000</span> Expiry Date --}}
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-12">
        <div class="card" style="padding: 0px">
            <div class="header m-0">
                <h2 style="width: 100%">Stock <span>List</span>
                    <p style="text-align: right;margin:-20px 0px 0px 0px;font-size: 15px;" class="filter_name"></p>
                </h2>

            </div>
            <div style="min-height: 400px; display: none;" class="loader">
                <img src="images/loading.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
            </div>
            <div class="body teacher_attendance_list">
                <div class="col-12 pb-10">
                    <div class="no-info">
                        <div class="m-auto"><strong> Please Filter Your Stock Record !</strong></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
@push('js')
<script src="{{asset('js/custom/stock_report.js') }}"></script>
@endpush