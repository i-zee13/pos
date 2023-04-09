@extends('layouts.app')
@section('data-sidebar')
<div id="product-cl-sec">
    <a href="#" id="pl-close" class="close-btn-pl"></a>
    <div class="pro-header-text">New <span>Ledger</span></div>
    <div style="min-height: 400px" id="dataSidebarLoader" style="display: none">
        <img src="/images/loader.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
    </div>
    <div class="pc-cartlist">
        <div class="overflow-plist">
            <div class="plist-content">
                <div class="_left-filter ">
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <form style="display: flex;" id="saveTransactionForm">
                                    @csrf
                                    <input type="text" id="operation" hidden>
                                    <input type="text" id="customer_id" hidden name="hidden_vendor_id">
                                    <input type="text" id="hidden_balance" hidden name="hidden_balance">

                                    <div id="floating-label" class="card p-20 top_border mb-3" style="width: 100%">
                                        <h2 class="_head03 customer_name">Vendor <span>Details</span></h2>
                                        <div class="form-wrap p-0">
                                            <div class="row">
                                            <div class="col-md-6 PB-10">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Date</label>
                                                        <input autocomplete="off" id="datepicker" type="text" class="form-control " name="transaction_date" value="{{$current_date}}">

                                                    </div>
                                                </div>
                                                <div class="col-md-6 PB-10">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Payable Balance</label>
                                                        <input type="text" name="balance" class="form-control" readonly>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <!-- <div class="col-md-6 PB-10">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">CR</label>
                                                        <input type="text" name="cr" class="form-control " readonly>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 PB-10">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">DR</label>
                                                        <input type="text" name="dr" class="form-control " readonly>
                                                    </div>
                                                </div> -->
                                               
                                                <div class="col-md-12 PB-10">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Amount *</label>
                                                        <input type="text" name="amount" class="form-control field-required" id="amount" required>
                                                    </div>
                                                </div>
                                                <h2 class="_head03 ">Amout <span>To</span></h2>
                                                <div class="col-md-12 ml-3">
                                                <div class="row">
                                                    <div class="col-auto pl-0">
                                                        <div class="custom-control custom-radio">
                                                            <input class="custom-control-input cr" type="radio" name="amount_to" id="cr" value="1" >
                                                            <label class="custom-control-label font13" for="cr">Cr</label>
                                                        </div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="custom-control custom-radio">
                                                            <input class="custom-control-input dr" type="radio" name="amount_to" id="dr" value="0" checked>
                                                            <label class="custom-control-label font13" for="dr">Dr</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="_cl-bottom">
        <button type="submit" class="btn btn-primary mr-2" id="saveTransaction">Save</button>
        <button id="pl-close" type="submit" class="btn btn-cancel mr-2" id="cancelSubCat">Cancel</button>
    </div>
</div>
@endsection
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
                    <h2 class="_head01">Ledger<span> Management</span></h2>
                </h1>
            </div>
            <div class="col-auto">
                <ol class="breadcrumb">
                    <li><a href="#"><span>Vendors</span></a></li>
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
                <!-- <a class="btn add_button openDataSidebarForAddingProduct"><i class="fa fa-plus"></i> Add New</a> -->
                <h2>Vendors Areas</h2>
            </div>
            <div style="min-height: 400px" id="tblLoader">
                <img src="/images/loader.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
            </div>
            <div class="body" style="display: none">
            </div>
        </div>
    </div>
</div>
@endsection
@push('js')
<script src="{{asset('js/custom/transaction.js')}}"> </script>
@endpush