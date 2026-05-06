@extends('layouts.app')

@section('content')
<style>._cust_filter{height: 0px}</style>
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
                <div class="header mb-0" style="padding:15px 20px">
                    <!-- <a class="btn add_button openDataSidebarForAddingProduct"><i class="fa fa-plus"></i> New  Product</a> -->
                    <h2>Sales List</h2>
                    <a href="javascript:void(0)" type="button" class="btn btn-primary btn-line mr-2 reset-btn-sales"
                        style="font-size: 13px;padding: 6px 11px 4px 9px;margin-top: 1px; margin-right:5px; float: right;">Reset</a>
                    <a href="javascript:void(0)" type="button" class="btn btn-primary mr-2 search-btn-sales"
                        style="font-size: 13px;padding: 6px 11px 4px 9px;margin-top: 1px; margin-right:5px; float: right;">Search</a>
                    <div class="_cust_filter" style="font-size: 13px;float: right;">
                        <input type="date" class="form-control end_date" placeholder="To Date" name="end_date" style="height: 35px;box-shadow: none;">
                    </div>
                    <div class="_cust_filter" style="font-size: 13px;float: right;">
                        <input type="date" class="form-control start_date" placeholder="From Date" name="start_date" style="height: 35px;box-shadow: none;">
                    </div>
                    
                    <div class="_cust_filter" style="font-size: 13px;float: right;">
                        <div class="form-s2">
                            <select class="form-control formselect customer_id" name="customer_id">
                                <option value="">Select Customer</option>
                                @foreach($customers as $customer)
                                <option value="{{$customer->id}}">{{$customer->id}}-{{$customer->customer_name}}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="_cust_filter" style="font-size: 13px;float: right;">
                        <input type="text" class="form-control bill_no" placeholder="Bill #" name="bill_no" style="height: 35px;box-shadow: none;">
                    </div>

                </div>
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
    <script src="/js/custom/all-sales-list.js"></script>
    <script>
        
    </script>
@endpush
