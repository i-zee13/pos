@extends('layouts.app')


@section('content')
<style>
  .sell360report {
    padding-bottom: 15px
  }

  .sell360report .card {
    background-color: #fff;
    border: none;
    padding: 10px 15px;
    margin: 15px 0px;
    border-radius: 0px;
    position: relative;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.2);
    background-image: url(images/distributor-bg.jpg);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100%;
    height: 100px
  }

  .sell360report h2 {
    font-size: 18px;
    padding-top: 15px;
    margin-bottom: 15px;
    display: block
  }

  .sell360report h4 {
    font-size: 18px;
    padding: 0;
    margin: 0;
    color: #282828
  }

  .sell360report h4 span {
    color: #282828;
    font-family: 'proximanova-regular', sans-serif !important;
    position: relative;
  }

  .sell360report .digit {
    font-size: 30px;
    font-weight: normal;
    line-height: normal;
    color: #282828;
    margin-bottom: 0;
    padding-bottom: 0;
    line-height: 1;
    font-family: 'Rationale', sans-serif !important;
    position: absolute;
    bottom: 10px;
    left: 15px
  }

  .sell360report .head-font {
    font-size: 16px
  }

  .sell360report .card .cardicon {
    width: 60px;
    height: 60px;
    position: absolute;
    top: 20px;
    right: 15px;
    filter: drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.2));
  }

  .action-btns {
    padding: 30px 30px 0px 30px
  }

  .action-btns .btn-primary {
    width: 100%;
    letter-spacing: 1px;
    font-size: 16px;
    padding-top: 20px;
    padding-bottom: 20px;
    margin-bottom: 30px;
    background: linear-gradient(90deg, #fff 0%, #fff 100%);
    border-color: #e3e3e3;
    color: #282828;
  }

  .action-btns .btn-primary:hover,
  .action-btns .btn-primary:focus {
    background: linear-gradient(90deg, #031a50 0%, #06205e 100%);
    color: #fff;
  }

  .action-btns .btn-primary i {
    position: absolute;
    right: 40px;
    top: 25px;
  }

  .add_button {
    letter-spacing: 1px;
    font-size: 14px;
    padding: 6px 12px;
    top: 48px;
    right: 15px;
  }

  #widget-meter {
    width: 90px;
    margin: 0 auto;
    position: absolute;
    top: -6px;
    right: 15px;
  }

  #widget-meter .needle,
  #widget-meter .needle-center {
    fill: #a6a6a6;
  }

  .label-percent {
    font-size: 22px;
    fill: #06205e;
    padding-top: 25px;
    font-family: 'Rationale', sans-serif !important;
  }

  .h_dash {
    position: relative;
    padding: 0;
  }

  .h_dash a {
    display: block;
    -webkit-box-shadow: 0px 0px 12px 0px rgba(79, 79, 79, 0.3);
    -moz-box-shadow: 0px 0px 12px 0px rgba(79, 79, 79, 0.3);
    box-shadow: 0px 0px 12px 0px rgba(79, 79, 79, 0.3);
    border-radius: 0px;
    height: 150px;
    width: 100%;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 30px;
    background-image: url(images/dash-card-bg.png);
    background-position: left bottom;
    background-size: 30%;
    background-repeat: no-repeat;
    background-color: #fff;
    -webkit-transition: all 0.15s;
    -moz-transition: all 0.15s;
    transition: all 0.15s;
  }

  .h_dash a::before {
    content: '';
    display: inline-block;
    width: 2px;
    height: 33px;
    background-color: #424242;
    position: absolute;
    bottom: 22px;
    left: 0;
  }

  .h_dash a:hover::before {
    background-color: white;
    /* Change to your desired hover color */
  }

  .HD-title {
    color: #282828;
    font-size: 18px;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: left;
    position: absolute;
    bottom: 15px;
    left: 15px;
    margin: 0;
    font-weight: 600;
    padding: 0;
    padding-bottom: 5px;
    letter-spacing: 1px
  }

  .f-light {
    font-weight: normal;
    font-size: 14px;
    display: block;
    font-family: 'proximanova-light', sans-serif !important;
    color: #787878
  }

  .h_dash a img {
    width: 55px;
    height: auto;
    display: inline-block;
    padding-top: 10px;
    padding-right: 10px;
    float: right;
  }

  .h_dash a:hover {
    -webkit-box-shadow: 0px 0px 15px 0px rgba(79, 79, 79, 0.5);
    -moz-box-shadow: 0px 0px 15px 0px rgba(79, 79, 79, 0.5);
    box-shadow: 0px 0px 15px 0px rgba(79, 79, 79, 0.5);
    background-size: 150%;
    -webkit-transition: all 0.2s;
    -moz-transition: all 0.2s;
    transition: all 0.2s;
  }

  .h_dash a:hover .HD-title {
    color: white;
  }

  /* .HD-title:hover {
    color: white;
  } */

  .follow_action {
    background-image: url(images/dash-card-bg.png);
    background-position: top right;
    background-repeat: no-repeat;
    background-size: 70%;
    background-color: rgba(255, 255, 255, 0.8);
    border-top: 3px solid #fff;
    padding: 15px;
    border-radius: 0px;
    text-align: center;
    margin-bottom: 40px;
    -webkit-box-shadow: 2px 2px 10px 0 rgba(79, 79, 79, .2);
    -moz-box-shadow: 2px 2px 10px 0 rgba(79, 79, 79, .2);
    box-shadow: 2px 2px 10px 0 rgba(79, 79, 79, .2);
    display: block;
    font-size: 15px;
    color: #282828;
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
    width: 100%;
    height: 200px;
    font-weight: 600;
    float: left;
  }

  .HomeHead {
    font-size: 20px;
    border-bottom: solid 2px #e3e3e3;
    padding-bottom: 10px;
    margin-bottom: 15px;
  }

  .DashHomeLink,
  .DashHomeLink:HOVER {
    text-decoration: none;
    display: block;
    transition: all 0.2s ease-in-out;
  }

  .seabinReport h4 {
    font-size: 20px;
    padding: 0;
    margin: 0;
    color: #001e35;
    letter-spacing: 1px;
  }

  .seabinReport h4 span {
    display: block;
    font-size: 15px;
    color: #888888;
    padding-top: 0px;
    position: relative;
    margin-top: 0px;
  }

  .seabinReport .card {
    background-color: #fff;
    border: none;
    padding: 10px 15px;
    margin: 15px 0px;
    border-radius: 0px;
    position: relative;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.2);
    background-image: url(images/bg-for-states-g.jpg);
    background-position: bottom left;
    background-repeat: no-repeat;
    background-size: auto;
    height: 110px;
  }
</style>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Rationale&display=swap');

  ._head01 {
    font-size: 22px;
    color: #282828;
    font-weight: 600;
  }

  .R-Heading {
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    font-size: 22px;
    letter-spacing: 5px;
    padding-left: 10px;
    line-height: 1;
    width: 347px;
    position: absolute;
    left: -155px;
    top: 200px
  }

  .open-Report,
  .open-ReportHOVER {
    font-size: 18px;
    text-align: center;
    color: #fff !important;
    padding: 10px 8px 18px 8px;
    display: block
  }

  .RB_bar {
    color: #fff;
    height: 100vh;
    width: 40px;
    background: linear-gradient(90deg, #2aa4d3 0%, #001e35 100%);
    position: absolute
  }

  ._left-filter {
    padding-top: 0
  }

  .FU-history {
    margin-top: 0
  }

  .seabinReport {
    padding-bottom: 15px
  }

  .seabinReport .card {
    background-color: #fff;
    border: none;
    padding: 10px 15px;
    margin: 15px 0px;
    border-radius: 0px;
    position: relative;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.2);
    background-image: url(images/bg-for-states-g.jpg);
    background-position: bottom left;
    background-repeat: no-repeat;
    background-size: auto;
    height: 110px
  }

  .seabinReport .card:before {
    background: #152e4d;
    position: absolute;
    width: 2px;
    height: 35px;
    left: 0px;
    top: 14px;
    content: '';
  }

  .seabinReport h2 {
    font-size: 18px;
    padding-top: 15px;
    margin-bottom: 15px;
    display: block
  }

  .seabinReport h4 {
    font-size: 20px;
    padding: 0;
    margin: 0;
    color: #001e35;
    letter-spacing: 1px
  }

  .seabinReport h4 span {
    display: block;
    font-size: 15px;
    color: #888888;
    padding-top: 0px;
    position: relative;
    margin-top: 0px
  }

  .seabinReport .digit {
    font-size: 35px;
    font-weight: normal;
    line-height: normal;
    color: #282828;
    margin-bottom: 0;
    padding-bottom: 0;
    line-height: 1;
    font-family: 'Rationale', sans-serif !important;
    position: absolute;
    bottom: 10px;
    right: 15px
  }

  .seabinReport .head-font {
    font-size: 16px
  }

  .seabinReport .card .cardicon {
    width: 50px;
    position: absolute;
    top: 15px;
    right: 15px
  }

  ._user_Pimage {
    border: solid 1px #001e35;
  }

  .TopTagItem {
    background-color: #fff;
    padding-top: 15px;
    padding-bottom: 15px;
    margin-bottom: 30px;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.2);
  }

  .TopTagItem h2 {
    margin-bottom: 15px;
    line-height: 1;
    color: #001e35;
    font-size: 16px;
    padding-top: 10px;
    font-weight: 600;
  }

  .TopTagItem .digit {
    font-size: 22px;
    font-weight: normal;
    line-height: normal;
    line-height: 1;
    font-family: 'Rationale', sans-serif !important;
    color: #282828;
    padding-bottom: 10px
  }

  .Vdigit {
    font-size: 35px;
    color: #001e35;
    display: block;
    padding-bottom: 10px
  }

  .TopTagItem h3 {
    color: #fff;
    font-size: 13px;
    letter-spacing: 1px;
    text-align: center;
    padding: 5px;
    background-color: #001e35;
    margin-bottom: 0
  }

  .TopTagItem h3 span {
    font-family: 'Rationale', sans-serif !important;
    font-size: 17px;
    font-weight: normal
  }

  .TopTagItem .row {
    margin-left: 10px;
    margin-right: 10px
  }

  .TopTagItem .col {
    max-width: 20%;
    padding-left: 5px;
    padding-right: 5px;
    ;
    padding-top: 10px;
    text-align: center;
    border-right: solid 1px #e3e3e3
  }

  ._dashTOP {
    padding-top: 0
  }

  .btnActivView {
    border: solid 1px #001e35;
    font-size: 13px;
    padding: 1px 10px;
    margin: 10px 0 5px 0px;
    border-radius: 0;
    background: #001e35;
    color: #fff;
    letter-spacing: 1px;
    display: inline-block
  }

  .btnActivView:HOVER {
    border: solid 1px #282828;
    background: #282828;
    color: #fff;
    text-decoration: none
  }

  .view-all-EA:HOVER {
    background: linear-gradient(90deg, #282828 0%, #282828 100%);
    border: solid 1px #282828
  }

  .HomeHead {
    font-size: 20px;
    border-bottom: solid 2px #e3e3e3;
    padding-bottom: 10px;
    margin-bottom: 15px;
  }

  .NoAct .btn-primary {
    border: none
  }

  .DashHomeLink,
  .DashHomeLink:HOVER {
    text-decoration: none;
    display: block;
    transition: all 0.2s ease-in-out;
  }

  .DashHomeLink:HOVER .card {
    box-shadow: 2px 2px 15px 0 rgba(79, 79, 79, .5);

  }

  .DashHomeLink:HOVER {
    margin-top: -5px;
    transition: all 0.2s ease-in-out;
  }

  .follow_action {
    background-image: url(images/dash-card-bg.png);
    background-position: top right;
    background-repeat: no-repeat;
    background-size: 70%;
    background-color: rgba(255, 255, 255, 0.8);
    border-top: 3px solid #fff;
    padding: 15px;
    border-radius: 0px;
    text-align: center;
    margin-bottom: 40px;
    -webkit-box-shadow: 2px 2px 10px 0 rgba(79, 79, 79, .2);
    -moz-box-shadow: 2px 2px 10px 0 rgba(79, 79, 79, .2);
    box-shadow: 2px 2px 10px 0 rgba(79, 79, 79, .2);
    display: block;
    font-size: 15px;
    color: #282828;
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
    width: 100%;
    height: 200px;
    font-weight: 600;
    float: left
  }

  .follow_action:HOVER {
    border-top: 3px solid #001e35;
    color: #001e35;
    text-decoration: none;
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
    -webkit-box-shadow: 2px 2px 20px 0 rgba(79, 79, 79, .3);
    -moz-box-shadow: 2px 2px 20px 0 rgba(79, 79, 79, .3);
    box-shadow: 2px 2px 20px 0 rgba(79, 79, 79, .3);
    background-position: top right;
    margin-top: -5px;
    color: white
  }

  .follow_action span {
    margin: auto;
    width: 100%
  }

  .follow_action .img-svg img {
    width: 60px;
    height: auto;
    display: block;
    margin: auto;
    margin-bottom: 10px
  }

  ._user-TS {
    margin-bottom: 15px;
  }

  ._dashTOP {
    padding-bottom: 15px;
    padding-right: 0;
    padding-top: 15px
  }

  ._dashTOP ._head01 {
    font-size: 22px;
    padding-top: 7px;
    margin-bottom: 10px;
    margin-top: 0
  }

  ._dashTOP span {
    color: #001e35
  }

  ._dashTOP p {
    margin: 0;
    display: block
  }

  ._user_Pimage {
    width: 38px;
    height: 38px;
    border: solid 1px #152e4d;
    background-color: #FFF;
    padding: 1px;
    border-radius: 50%;
    float: left;
    margin-right: 10px
  }

  .seabinReport .todaysale {
    margin: 0;
    padding: 0;
    position: absolute;
    letter-spacing: 0.5px;
    top: 12px;
    right: 15px;
    font-family: 'Rationale', sans-serif;
    font-size: 22px;
  }

  .seabinReport .todaysale span {
    color: #001e35;
    font-size: 16px;
  }

  .seabinReport .todaysale .grayc,
  .grayc {
    color: #7f7f7f !important;
    font-size: 22px !important;
    font-weight: 200 !important
  }

  .TopTagItem img {
    width: 75%;
    height: auto;
    margin-bottom: 10px;
  }

  .TopTagItem .grayc {
    padding-left: 10px;
    padding-right: 10px;
  }

  .no-info {
    display: flex;
    height: 9rem;
    opacity: 0.4;
    font-size: 0.9375rem;
    text-align: center;
    background-color: #fff;
    border-radius: var(--border-radius);
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
    border: solid 0.0625rem rgba(0, 0, 0, 0.1);
  }

  .m-auto {
    margin: auto !important;
  }
</style>

<div class="row _user-TS" style="margin-top:15px">
  <div class="col-md-12 _dashTOP"> <img class="_user_Pimage" src="images/avatar.svg" alt="">
    <h2 class="_head01">{{$message}}, Mr.{{Auth::user()->name}}</h2>
    <p>Here’s what’s happening today.</p>
  </div>
</div>
<div class=" seabinReport">
  <div class="row">
    <div class="col-md-4"> <a class="DashHomeLink" href="#">
        <div class="card mt-0">
          <h4>Todays <span>Sale</span></h4>
          <h2 class="digit"><small>Pkr.</small>{{number_format($total_sale)}} </h2>
        </div>
      </a> </div>
    <div class="col-md-4"> <a class="DashHomeLink" href="#">
        <div class="card mt-0">
          <h4>Todays <span>Purchase</span></h4>
          <h2 class="digit"><small>Pkr.</small>{{number_format($total_purchase)}} </h2>
        </div>
      </a> </div>
    <div class="col-md-4"> <a class="DashHomeLink" href="#">
        <div class="card mt-0">
          <h4>Todays <span>Expense</span></h4>
          <h2 class="digit"><small>Pkr.</small>{{number_format(00)}} </h2>
        </div>
      </a> </div>

  </div>
</div>
<div class="col-12 h_dash">
  <div class="col-lg-12 col-md-12 col-sm-12">
    <h2 class="_head01 HomeHead">Shortcuts <span></span></h2>
  </div>
  <div class="row">
    <!-- <div class="col-4"> <a href="/admin/register" class="follow_action d-flex align-content-center flex-wrap"><span class="img-svg"><img src="/images/employee-dash-icon.svg" alt="">Add New Employee</span></a> </div> -->
    <div class="col-md-3"><a href="{{route('sale-add')}}" class="follow_action "><img src="{{asset('images/add-course.svg')}}" alt="" />
        <h2 class="HD-title">Sale <span class="f-light">Incvoice</span></h2>
      </a> </div>
    <div class="col-md-3"><a href="{{route('stock-add')}}" class="follow_action "><img src="{{asset('images/add-teacher.svg')}}" alt="" />
        <h2 class="HD-title">Purchase <span class="f-light">Invoice</span></h2>
      </a> </div>
    <div class="col-md-3"><a href="{{route('ProductReplacement.create')}}" class="follow_action "><img src="{{asset('images/add-students.svg')}}" alt="" />
        <h2 class="HD-title">Replacement <span class="f-light">Purchases</span></h2>
      </a> </div>
    <div class="col-md-3"><a href="{{route('vendor-ledgers')}}" class="follow_action "><img src="{{asset('images/enrollments-add.svg')}}" alt="" />
        <h2 class="HD-title"> Vendor<span class="f-light">Payments</span></h2>
      </a> </div>
    <div class="col-md-3"><a href="{{route('customer-ledgers')}}" class="follow_action "><img src="{{asset('images/quiz-list.svg')}}" alt="" />
        <h2 class="HD-title">Customer <span class="f-light">Payments</span></h2>
      </a> </div>

    <div class="col-md-3"><a href="{{route('customer-reports')}}" class="follow_action "><img src="{{asset('images/campaign-list.svg')}}" alt="" />
        <h2 class="HD-title">Customer <span class="f-light">Reports </span></h2>
      </a> </div>
    <div class="col-md-3"><a href="{{route('customer-reports')}}" class="follow_action "><img src="{{asset('images/complaint-list.svg')}}" alt="" />
        <h2 class="HD-title">Vendor <span class="f-light">Reports</span></h2>
      </a> </div>
    <!-- <div class="col-md-3"><a href="{{route('customer-reports')}}" class="follow_action "><img src="{{asset('images/payment-manage.svg')}}" alt=""/>
                <h2 class="HD-title">Manage  <span class="f-light">Payments</span></h2>
              </a> </div> -->

  </div>
</div>

@endsection