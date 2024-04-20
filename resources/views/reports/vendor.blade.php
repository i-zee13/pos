@extends('layouts.app')
@section('content')
<style>
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
</style>

<div class="modal fade" id="itemModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content  top-borderRed" style="border-top:3px solid #131d2a">
            <div class="modal-header" style="padding:15px">
                <h5 class="modal-title" id="exampleModalLabel">Vocher <span> Detail </span></h5>
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

                        <div class="col-md-6">
                            <label class="font12">CR </label>
                            <input type="text" autocomplete="off" class="form-control only_decimal_numerics cr" placeholder="0.00">
                        </div>
                        <div class="col-md-6">
                            <label class="font12">DR</label>
                            <input type="text" autocomplete="off" class="form-control only_decimal_numerics dr" placeholder="0.00">
                        </div>
                        <div class="col-md-12">
                            <label class="font12">Comment</label>
                            <textarea class="form-control comment" name="closing_comment" cols="20"></textarea>
                        </div>

                    </div>
                </div>
            </div>
            <div class="modal-footer border-0" style="padding-top:7px;padding-bottom:7px ">
                <!-- <button type="submit" class="btn btn-cancel" data-dismiss="modal" aria-label="Close">Close</button> -->

            </div>
        </div>
    </div>
</div>
<!-- Body -->
<div class="header-body">
    <div class="row  ">
        <div class="col">
            <!-- Pretitle -->
            <h6 class="header-pretitle">
                {{$ledger_for}}
            </h6>
            <!-- Title -->
            <h1 class="header-title">
                <h2 class="_head01">Reports<span> Management</span></h2>
            </h1>
        </div>
        <div class="col-auto">
            <ol class="breadcrumb">
                <li><a href="#"><span>{{$ledger_for}}</span></a></li>
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

                    <div class="col pr-0">

                        <div class="CL-Product inputmonth"><i class="fa fa-calendar-alt"></i>
                            <input type="date" autocomplete="off" class="form-control start_date" placeholder="Start Date" name="start_date">
                        </div>

                        <div class="CL-Product inputmonth"><i class="fa fa-calendar-alt"></i>
                            <input type="date" autocomplete="off" class="form-control end_date" placeholder="End Date" name="end_date" value="">
                        </div>
                        <div class="_cust_filter col-4">
                            <div class="form-s2">
                                <select class="form-control formselect vendor_id" name="vendor_id">
                                    <option value="">Select {{$ledger_for}}</option>
                                    @foreach($vendors as $vendor)
                                    <option value="{{$vendor->id}}">{{$vendor->id}} - {{$vendor->customer_name}}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>

                    </div>
                    <div class="col-auto pl-0">
                        <button type="button" class="btn btn-primary m-0 reset-btn"> Reset</button>
                    </div>
                    <div class="col-auto pl-0">
                        <button type="button" class="btn btn-primary m-0 search-btn"> Search</button>
                    </div>
                </div>
            </form>
            <div class="clearfix"></div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-12">
        <div class="card">
            <div class="header m-0">
                <h2>{{$ledger_for}} <span>Area</span></h2>
            </div>
            <div style="min-height: 400px; display: none;" class="loader">
                <img src="images/loading.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
            </div>
            <div class="body teacher_attendance_list">
                <div class="col-12 pb-10">
                    <div class="no-info">
                        <div class="m-auto"><strong> Please Filter Your {{$ledger_for}} Ledger !</strong></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
@push('js')
<script src="{{asset('js/custom/reports.js') }}"></script>
@endpush