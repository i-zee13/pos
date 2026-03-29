@extends('layouts.app')
@section('content')
<style>
     .TS-delete {
        background: #d71919;
        border-color: #e71717;
        color: #ffffff;
        border-radius: 2px;
        padding: 4px 4px;
        font-size: 9px;
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
        width: 218px !important;
    }

    @media (max-width: 1366px) {
        ._cust_filter {
            width: 159px;
        }
    }
    @media only screen and (max-width:575px) {
        .Product-Filter .col-auto {
            width: 100% !important;
        }

        ._cust_filter {
            margin-bottom: 0px;
            margin-top: 10px;
            width: 100% !important;
            padding: 0 !important;
        }

        .CL-Product {
            width: 100% !important;
            padding-right: 2px !important;
            margin: 0 !important;
        }

        .col-auto {
            padding: 0 12px 0px !important;
        }

        .col-auto .CL-Product.inputmonth.focused {
            margin-top: 10px !important;
        }

        .Product-Filter .btn-primary {
            margin-top: 10px !important;
        }
    }
     .btn-outline-primary:hover {
        background-color: #152e4d;
        border-color: #152e4d;
        color: #fff;
    }
     .btn-outline-primary {
        border-color: #152e4d;
        color: #152e4d;
        padding:5px;
        font-size: 12px;
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
                <h2 class="_head01">Godown<span> Stock</span></h2>
            </h1>
        </div>
        <div class="col-auto">
            <ol class="breadcrumb">
                <li><a href="#"><span>Stock Allocation</span></a></li>
                <li><span>Ledger</span></li>
            </ol>
        </div>
    </div>
</div>


<div class="row">
    <div class="col-lg-12">
        <div class="Product-Filter">
            <form id="search-form">
                <div class="row">

                    <div class="col-auto pr-0">

                        <div class="_cust_filter">
                            <div class="form-s2">
                                <select class="form-control formselect godown_id" name="godown_id" id="godown_id">
                                    <option value="">All Godowns</option>
                                    @foreach($godowns as $godown)
                                    <option value="{{$godown->id}}">{{$godown->name}} ({{$godown->type}})</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>

                        <div class="_cust_filter">
                            <div class="form-s2">
                                <select class="form-control formselect product_id" name="product_id">
                                    <option value="">Select Product</option>
                                    @foreach($products as $product)
                                    <option value="{{$product->id}}">{{$product->id}}-{{$product->product_name}}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>

                        <div class="col-auto p-0" style="float:right;">
                        <style>
                            .reset-btn {
                                box-shadow: none;
                            }

                            .reset-btn:hover {
                                color: white !important;
                            }

                            .Product-Filter .btn-primary {
                                float: none;
                            }
                        </style>
                        <button type="button" class="btn btn-primary btn-line m-0 reset-btn" style="color:#152e4d !important"> Reset</button>
                        <button type="button" class="btn btn-primary m-0 search-btn"> Search</button>
                    </div>
                    </div>

                </div>
                <div class="row" style="margin-bottom: 10px;">

                   

                    
                    
                </div>
            </form>
            <div class="clearfix"></div>
        </div>
    </div>
</div>
 
<div class="row">
    <div class="col-md-12">
        <div class="card" style="padding: 0px">
            <div class="header m-0">
                <h2>Godown <span>Stock</span></h2>
                 <span class="godown-bal-div">Select Godown to View Stock</span>
            </div>
            <div style="min-height: 400px; display: none;" class="loader">
                <img src="images/loading.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
            </div>
            <div class="body teacher_attendance_list">
                <div class="col-12 pb-10">
                    <div class="no-info">
                        <div class="m-auto"><strong> Please Select a Godown to View Stock !</strong></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
@push('js')
<script src="{{asset('js/custom/godown_report.js') }}"></script>
@endpush
