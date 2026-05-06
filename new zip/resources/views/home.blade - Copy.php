@extends('layouts.app')
@section('content')
<style>
  .total-sale {
    padding: 20px;
    font-size: 13px;
    letter-spacing: 1px;
    margin-bottom: 20px;
    font-family: 'Rationale', sans-serif !important;
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
    background: #152e4d;
    position: absolute;
    width: 2px;
    height: 18px;
    left: -15px;
    top: 2px;
    content: '';
  }

  .total-sale .card-heading:before {
    left: -20px;
    top: 2px
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

  .total-sale {
    padding: 20px;
    font-size: 13px;
    letter-spacing: 1px;
    margin-bottom: 20px;
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

  .bg-shade {
    background-color: #f1f1f1;
  }

  .total-vals span {
    display: block;
    font-size: 30px;
    color: #152e4d;
    line-height: 1;
    padding-bottom: 10px;
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

  .HomeHead {
    font-size: 20px;
    border-bottom: solid 2px #e3e3e3;
    padding-bottom: 10px;
    margin-bottom: 15px;
  }

  ._head01 {
    font-size: 22px;
    color: #282828;
    font-weight: 600;
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
    <h2 class="_head01">{{$message}}, Mr.{{Auth::user()->name}} <span>👋</span></h2>
    <p>Here’s what’s happening today.</p>
  </div>
</div>
<div class="row">
  <div class="col-lg-8 col-md-8 col-sm-12 ">
    <div class="card BookedSales total-sale p-15">
      <div class="row m-0" id="primUnitWiseSale">
        <h2 class="card-heading mb-15 ml-5">Daily <span>Turn over</span></h2>
        <div class="col-12 position-relative p-0">
          <div class="total-progress" style="position:absolute; top:-15px; right: 15px">
            <div class="progress progressRounderLiveReport mx-auto" data-value="0"><span class="progress-left"> <span class="progress-bar progress-barColor"> </span> </span>
              <span class="progress-right"> <span class="progress-bar progress-barColor"></span> </span>
              <div class="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                <div class="digitVal">0<small>%</small><span>Profit</span></div>
              </div>
            </div>
          </div>
          <div class="total-amount PT-20" id="revenueLrOverview">
            <span>Rs.</span>
            <span class="empty-span" style="cursor: pointer;" data-amount="{{$ttl_in_hand}}">---</span> <span class="hide" style="display: none;">{{number_format($ttl_in_hand)}}</span>
            <span class="per-v"><i class="fa fa-long-arrow-alt-down" style="color: red"></i> 0% </span>
          </div>
        </div>
      </div>
      <div class="row total-vals border-right-0" id="visitsStats">
        <div class="col"><span class="empty-span" style="cursor: pointer;" data-amount="{{($total_sale - $ttl_sale_return)}}">---</span> <span class="hide" style="display: none;">{{number_format($total_sale - $total_net_sale_returns_invoice_amount)}}</span>Total Sale</div>
        <div class="col bg-shade"><span class="empty-span" style="cursor: pointer;" data-amount="{{$ttl_sale_return}}">---</span> <span class="hide" style="display: none;">{{number_format($total_net_sale_returns_invoice_amount)}}</span>Total Sale Returns</div>
        <div class="col"><span class="empty-span" style="cursor: pointer;" data-amount="{{$total_purchase}}">---</span> <span class="hide" style="display: none;">{{number_format($total_purchase)}}</span>Total Purchase</div>
        <div class="col bg-shade"><span class="empty-span" style="cursor: pointer;" data-amount="{{$expense}}">---</span> <span class="hide" style="display: none;">{{number_format($expense)}}</span>Total Expense</div>
      </div>
    </div>
  </div>
  <div class="col-12 col-xl-4">
    <div class="card card-fill" style="max-height: 278px;">
      <div class="card-header">
        <h4 class="card-header-title">
          Top 5 Customer Recoveries
        </h4>
        <a href="project-overview.html" class="small">View all</a>
      </div>
      <div class="card-body">
        <!-- List group -->
        <div class="list-group list-group-flush my-n3" style="max-height: 197px; overflow-y: auto;">
          @foreach($top5Receivables as $cust)
          <div class="list-group-item">
            <div class="row align-items-center">
              <div class="col"> 
                <img class="_user_Pimage" src="images/avatar.svg" alt=""> 
              
                <h5 class="mb-1">
                  <a href="project-overview.html">{{$cust->customer_name}}</a>
                </h5>
               
              </div>
              <div class="col-auto">
                <span class="card-text small text-body-secondary total-sale" style="font-weight: 600;">
                  {{number_format($cust->balance,2)}}
                </span> 
              </div>
            </div>
          </div>
          @endforeach
        </div>

      </div>
    </div>
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
@push('js')
<script src="https://cdnjs.cloudflare.com/ajax/libs/countup.js/2.0.7/countUp.umd.min.js"></script>

<script>
  $(document).ready(function() {
    (function ($) {
        $(window).on("load", function () {
            $(".list-group-flush").mCustomScrollbar({
                theme: "dark-2"
            });
        });
    })(jQuery);
    $(".empty-span").on("click", function() {
      const emptySpan = $(this); // Reference to the clicked empty-span
      const nextSpan = emptySpan.next(".hide"); // Select the next sibling with class 'hide'
      var totalAmount = $(this).attr('data-amount');
      // Hide the empty span and show the hide span
      emptySpan.hide();
      nextSpan.show();
      let count = 0; // Start counting from 0
      const options = {
        startVal: 0, // Start from 0
        decimalPlaces: 0, // No decimal places
        duration: 3, // Animation duration (in seconds)
      };

      const counter = new countUp.CountUp(nextSpan[0], totalAmount, options);

      // Start the counter
      if (!counter.error) {
        counter.start();
      } else {
        console.error(counter.error);
      }


















      //   const duration = 3000; // Animation duration in milliseconds
      //   const interval = 100; // Interval between each increment in milliseconds
      //   const step = Math.ceil(totalAmount / (duration / interval)); // Calculate the increment step

      //   const counter = setInterval(function () {
      //     count += step;

      //     if (count >= totalAmount) {
      //       count = totalAmount; // Cap the count at the totalAmount
      //       clearInterval(counter); // Stop the counter
      //     }

      //     nextSpan.text(`${count.toLocaleString()}`); // Format the number with commas
      //   }, interval);
    });

    // When the hide span (value) is clicked
    $(".hide").on("click", function() {
      const hideSpan = $(this); // Reference to the clicked hide span
      const prevSpan = hideSpan.prev(".empty-span"); // Select the previous sibling with class 'empty-span'

      // Hide the hide span and show the empty span
      hideSpan.hide();
      prevSpan.show();
    });
    $(".eye-icon").on("click", function() {
      const amountSpan = $(this).siblings(".amount");
      const isHidden = amountSpan.is(":hidden");

      if (isHidden) {
        amountSpan.show(); // Show the amount
      } else {
        amountSpan.hide(); // Hide the amount
      }
    });

    // Initially hide the amounts
    $(".amount").hide();
  });
</script>
@endpush