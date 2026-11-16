@extends('layouts.app')
@section('content')
<style>
    tbody tr:hover td {
        background: red !important;
        color: #282828 !important;
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

    .inputSale {
        width: 90;
        border-radius: 0;
        border: solid 1px #dbdbdb;
        background-color: #f6f6f6;
        height: 24px;
        padding-left: 5px;
        padding-right: 5px;
    }

    .row-amount-words {
        display: none;
        color: #5F5F5F;
        font-family: system-ui, -apple-system, sans-serif !important;
        font-size: 11px;
        font-weight: 700;
        line-height: 1.3;
        white-space: normal;
    }

    .grand-amount-words {
        display: none;
        color: #fff !important;
        font-family: system-ui, -apple-system, sans-serif !important;
        font-size: 13px;
        font-weight: 700;
        line-height: 1.35;
        white-space: normal;
        text-align: left;
    }

    .TeacherAttendanceListTable th:nth-child(1),
    .TeacherAttendanceListTable td:nth-child(1) {
        width: 55px !important;
        max-width: 55px;
    }
    .TeacherAttendanceListTable th:nth-child(2),
    .TeacherAttendanceListTable td:nth-child(2) {
        width: 18% !important;
        max-width: 200px;
    }
    .TeacherAttendanceListTable th:nth-child(3),
    .TeacherAttendanceListTable td:nth-child(3) {
        width: 90px !important;
        max-width: 100px;
        white-space: nowrap;
    }
    .TeacherAttendanceListTable th:nth-child(4),
    .TeacherAttendanceListTable td:nth-child(4) {
        width: 110px !important;
        max-width: 120px;
        white-space: nowrap;
    }
    .TeacherAttendanceListTable th:nth-child(5),
    .TeacherAttendanceListTable td:nth-child(5) {
        width: auto !important;
        min-width: 200px;
    }
    .TeacherAttendanceListTable th:nth-child(6),
    .TeacherAttendanceListTable td:nth-child(6) {
        width: 90px !important;
        max-width: 100px;
        white-space: nowrap;
        text-align: center;
    }

    .TeacherAttendanceListTable tfoot td {
        vertical-align: middle;
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
                Customer
            </h6>
            <!-- Title -->
            <h1 class="header-title">
                <h2 class="_head01">Ledger<span> Management</span></h2>
            </h1>
        </div>
        <div class="col-auto">
            <ol class="breadcrumb">
                <li><a href="#"><span>Customer</span></a></li>
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
                        <div class="_cust_filter col-6">
                            <div class="form-s2">
                                <select class="form-control formselect customer_id" name="customer_id">
                                    <option value="0">Select Customer</option>
                                    @foreach($customers as $customer)
                                    <option value="{{$customer->id}}" cust-name="{{$customer->customer_name}}" balance="{{$customer->balance}}">{{$customer->id}} - {{$customer->customer_name}}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>

                    </div>
                    <div class="col-auto pl-0">
                        <button type="button" class="btn btn-primary m-0 reset-btn"> Reset</button>
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
                <h2>Customer <span>Area</span></h2>
            </div>
            <div style="min-height: 400px; display: none;" class="loader">
                <img src="images/loading.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
            </div>
            <div class="body teacher_attendance_list">
                <div class="col-12 pb-10 empty_div">
                    <div class="no-info">
                        <div class="m-auto"><strong> Please Filter Your Customer Ledger !</strong></div>
                    </div>
                </div>
                <table class="table table-hover dt-responsive nowrap TeacherAttendanceListTable" style="width:100%; display:none">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Balance</th>
                            <th>Recived</th>
                            <th>In Words</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                    <tfoot>
                <tr style="background: #00216d;border: solid 1px #dbdbdb;color: white">
                    <td class="font18" align="right" colspan="2"></td>
                    <td class="font18" align="center">Grand Total :</td>
                    <td class="totalNo">
                        <span class="total-purchi" style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">0.00</span>
                    </td>
                    <td class="font18" align="left">
                        <div class="grand-amount-words"></div>
                    </td>
                    <td></td>
                </tr>
             </tfoot>
                </table>
            </div>
            <div style="background-color: #f6f6f6; padding:10px; margin-top: 15px; margin-bottom: 0px; text-align: right; margin-bottom: 1px" id="btns_div">

                <button type="button" id="btn_save" class="btn btn-primary mr-2">Save</button>
                <button type="button" id="print-invoice" class="btn btn-primary mr-2">Print</button>
                <a href="{{route('home')}}" type="submit" class="btn btn-cancel" id="cancel">Cancel</a>

            </div>
        </div>
    </div>
</div>
@endsection
@push('js')
<script src="{{asset('js/custom/customer_purchi.js') }}?v=5"></script>
@endpush