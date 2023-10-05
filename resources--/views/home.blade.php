@extends('layouts.app')
 
@section('data-sidebar')
<style>
    .close-btn-pl {
        top: 0px;
        right: 0px;
        background-color: #101010
    }

    .close-btn-pl:after,
    .close-btn-pl:before {
        background-color: #fff;
        height: 20px;
        top: 5px
    }

    #product-cl-sec {
        right: -700px;
        opacity: 1;
        box-shadow: 0 1px 5px 0 rgba(45, 62, 80, .12);
        width: 735px
    }

    #product-cl-sec.active {
        right: 0px;
        opacity: 1;
        box-shadow: 0px 0px 100px 0px rgba(0, 0, 0, 0.5)
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
        background:linear-gradient(90deg, #161616 0%, #101010 100%);
        position: absolute
    }

    ._left-filter {
        padding-top: 0
    }

    .FU-history {
        margin-top: 0
    }

</style>
 
@endsection
 

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
        s
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
        color: #06205e;
      }

</style>
<div class="row _user-TS" style="margin-top:15px">
            <div class="col-md-12 _dashTOP"> <img class="_user_Pimage" src="images/avatar.svg" alt="">
              <h2 class="_head01">{{$message}}, Mr.{{Auth::user()->name}}</h2>
              <p>Here’s what’s happening today.</p>
            </div>
          </div>
          <div class="sell360report">
            <div class="row">
              <div class="col-md-4">
                <div class="card mt-0"> 
                  <!-- <img class="cardicon" src="images/today-order.svg" alt=""> -->
                  <h4>Total <span>Sale</span></h4>
                  <h2 class="digit"> 00 </h2>
                </div>
              </div> 
              <div class="col-md-4">
                <div class="card mt-0"> 
                  <!-- <img class="cardicon" src="images/today-order.svg" alt=""> -->
                  <h4>Total<span> Purchase</span></h4>
                  <h2 class="digit">00</h2>

                </div>
              </div> 
              <div class="col-md-4">
                <div class="card mt-0"> 
                  <!-- <img class="cardicon" src="images/target-monthly-icon.svg" alt=""> -->
                  <h4>Total <span>Expense</span></h4>
                  <h2 class="digit"><small></small> 00</h2>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 h_dash">
            <div class="row">
              <div class="col-3"><a href="{{route('sale-add')}}"><img src="{{asset('images/add-course.svg')}}" alt="" />
                  <h2 class="HD-title">Sale <span class="f-light">Incvoice</span></h2>
                </a> </div>
              <div class="col-3"><a href="{{route('stock-add')}}"><img src="{{asset('images/add-teacher.svg')}}" alt="" />
                  <h2 class="HD-title">Purchase <span class="f-light">Invoice</span></h2>
                </a> </div>
              <div class="col-3"><a href="{{route('purchase-return')}}"><img src="{{asset('images/add-students.svg')}}" alt="" />
                  <h2 class="HD-title">Replacement <span class="f-light">Purchases</span></h2>
                </a> </div>
                <div class="col-3"><a href="{{route('vendor-ledgers')}}"><img src="{{asset('images/enrollments-add.svg')}}" alt="" />
                  <h2 class="HD-title"> Vendor<span class="f-light">Payments</span></h2>
                </a> </div>
                <div class="col-3"><a href="{{route('customer-ledgers')}}"><img src="{{asset('images/quiz-list.svg')}}" alt="" />
                  <h2 class="HD-title">Customer <span class="f-light">Payments</span></h2>
                </a> </div>
              
              <div class="col-3"><a href="{{route('customer-reports')}}"><img src="{{asset('images/campaign-list.svg')}}" alt="" />
                  <h2 class="HD-title">Customer <span class="f-light">Reports </span></h2>
                </a> </div>
              <div class="col-3"><a href="{{route('customer-reports')}}"><img src="{{asset('images/complaint-list.svg')}}" alt="" />
                  <h2 class="HD-title">Vendor <span class="f-light">Reports</span></h2>
                </a> </div>                
              <!-- <div class="col-3"><a href="{{route('customer-reports')}}"><img src="{{asset('images/payment-manage.svg')}}" alt=""/>
                <h2 class="HD-title">Manage  <span class="f-light">Payments</span></h2>
              </a> </div> -->

            </div>
          </div>
  
@endsection