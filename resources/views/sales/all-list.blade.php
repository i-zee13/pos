@extends('layouts.app')

@section('content')
    <div class="header">
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
                        <h2 class="_head01">Sale <span>Management</span></h2>
                    </h1>
                </div>
                <div class="col-auto">
                    <ol class="breadcrumb">
                        <li><a href="#"><span>Sale</span></a></li>
                        <li><span>Active</span></li>
                    </ol>
                </div>
            </div>
        </div>


    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="header mb-0">
                    <h2>Sales List</h2>
                </div>
                <form class="all-sales-filter-form Product-Filter" onsubmit="return false;">
                    <div class="all-sales-filter-bar">
                        <div class="_cust_filter">
                            <input type="text" class="form-control bill_no" placeholder="Bill #" name="bill_no">
                        </div>
                        <div class="_cust_filter">
                            <div class="form-s2">
                                <select class="form-control formselect customer_id" name="customer_id">
                                    <option value="">Select Customer</option>
                                    @foreach($customers as $customer)
                                    <option value="{{$customer->id}}">{{$customer->id}}-{{$customer->customer_name}}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="report-date-range">
                            <i class="fa fa-calendar-alt" title="Pick start date, then end date"></i>
                            <input type="text" autocomplete="off" class="form-control report-range-display" readonly placeholder="Start date – End date">
                            <input type="hidden" class="start_date" name="start_date">
                            <input type="hidden" class="end_date" name="end_date">
                        </div>
                        <button type="button" class="btn btn-line reset-btn reset-btn-sales">Reset</button>
                        <button type="button" class="btn btn-primary search-btn-sales">Search</button>
                    </div>
                </form>
                <!-- <div style="min-height: 400px" id="tblLoader">
                    <img src="/images/loader.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
                </div> -->
                <div class="body">
                    
                </div>
            </div>
        </div>
    </div>
@endsection
@push('js')
    <script src="/js/custom/all-sales-list.js?v=1.2"></script>
    <script>
        
    </script>
@endpush
