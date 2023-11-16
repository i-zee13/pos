@extends('layouts.app')
@section('data-sidebar')
{{-- Confirmation Modal --}}
<div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" data-backdrop="static" data-keyboard="false" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content top-borderRed">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Confirmation <span></span></h5>
                <!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button> -->
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-12 form-div">
                        <strong id="modal-text">Are you sure you want to Confirm?</strong>
                    </div>
                </div>
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-primary yes-btn confirm_btn" data-dismiss="modal">Yes</button>
                <button type="submit" class="btn w-btn btn-cancel cancel_delete_modal no-btn" data-dismiss="modal" aria-label="Close">No</button>
            </div>
        </div>
    </div>
    <button hidden data-toggle="modal" data-target="#deleteModal" id="hidden_btn_to_open_modal"></button>
</div>
<div id="product-cl-sec">
    <a href="#" id="pl-close" class="close-btn-pl"></a>
    <div class="pro-header-text">Cash <span>{{request()->segment(1) == 'customer-ledger-jama' ? 'Received' : 'Payment' }}</span></div>
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
                                    <input type="text" hidden value="{{$operation}}" name="operation">
                                    <input type="text" hidden name="action" id="action">
                                    <input type="text" id="customer_id" hidden name="hidden_customer_id">
                                    <input type="text" id="hidden_balance" hidden name="hidden_balance">
                                    <div id="floating-label" class="card p-20 top_border mb-3" style="width: 100%">
                                        <h2 class="_head03 customer_name">Customer <span>Details</span></h2>
                                        <div class="form-wrap p-0">
                                            <div class="row">
                                                <div class="col-md-12 PB-10 customers" style="display: none;">
                                                    <label class="font12 mb-0">Customers *</label>
                                                    <div class="form-s2 ">
                                                        <select class="form-control formselect field-required customer_id" name="customer_id" tabindex="1">
                                                            <option value="0" selected> Select Customer</option>
                                                            @foreach($customers as $customer)
                                                            <option value="{{ $customer->id }}" balance='{{$customer->balance}}' cus_name='{{$customer->customer_name}}'>{{$customer->id}}-{{$customer->customer_name}}</option>
                                                            @endforeach
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 PB-10">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Date</label>
                                                        <input autocomplete="off" type="date" class="form-control " name="transaction_date" value="{{$current_date}}">

                                                    </div>
                                                </div>
                                                <div class="col-md-6 PB-10">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Balance</label>
                                                        <input type="text" name="balance" class="form-control customer_balnce" readonly>
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
                                                    <table class="ProductTable table " id="transactionTable" width="100%" border="0" cellspacing="0" cellpadding="0">
                                                        <thead>
                                                            <tr>
                                                                <th class="">Voucher #</th>
                                                                <th class="">{{request()->segment(1) == $operation.'-ledger-jama' ? 'CR' : 'DR' }}</th>
                                                                <th class="">Remarks</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody id="productGrid">
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div class="row add-more">

                                                </div>
                                                <!-- <div class="col-md-4 PB-10">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">{{request()->segment(1) == 'customer-ledger-jama' ? 'CRV #' : 'CPV' }}</label>
                                                        <input type="text" name="voucher_no" class="form-control field-required voucher_no" id="voucher_no" value="">
                                                    </div>
                                                </div> -->
                                                <!-- <div class="col-md-8 PB-10">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Add Amount *</label>
                                                        <input type="text" name="amount" class="form-control field-required" id="amount" required tabindex="2">
                                                    </div>
                                                </div>
                                                <div class="col-md-12 PB-10">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Remarks </label>
                                                        <textarea name="comment" class="form-control" rows="6" tabindex="3"></textarea>
                                                    </div>
                                                </div> -->

                                                
                                                <table class="table">
                                                    <tr style="background: #152e4d;color: white;">
                                                        <td style="font-family:bold">Total:</td>
                                                        <td colspan="2" class="total_ledger_sum"></td>
                                                    </tr>
                                                </table>
                                                <h2 class="_head03 ">To <span>Print</span></h2>
                                                <div class="row status-sh">
                                                    <div class="col-12">
                                                        <div class="custom-control custom-radio">
                                                            <input class="custom-control-input" type="checkbox" id="print-invoice" value="1" data-id="print-invoice" name="print_invoice">
                                                            <label class="custom-control-label font13 he ad-sta" for="print-invoice">Print</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-12 ml-3" hidden>
                                                    <div class="row">
                                                        <div class="col-auto pl-0">
                                                            <div class="custom-control custom-radio">
                                                                <input class="custom-control-input cr" type="radio" name="amount_to" id="cr" value="1" {{request()->segment(1) == $operation.'-ledger-jama' ? 'checked' : '' }}>
                                                                <label class="custom-control-label font13" for="cr">Cr</label>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="custom-control custom-radio">
                                                                <input class="custom-control-input dr" type="radio" name="amount_to" id="dr" value="0" {{request()->segment(1) == $operation.'-ledger-banam' ? 'checked' : '' }}>
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
        <!-- <button type="button" id="print-invoice" class="btn btn-primary mr-2" tabindex="4">Print</button> -->
        <button type="submit" class="btn btn-primary mr-2" id="saveTransaction" tabindex="5">Save</button>
        <button type="button" class="btn btn-cancel mr-2" id="cancelSubCat">Cancel</button>
    </div>
</div>
@endsection
@section('content')
<?php $transc_for  = request()->segment(1) == 'customer-reports' ? 'Customer' : 'Vendor' ;  ?>

<style>
    .remove_div {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .remove_div ._head03 {
        margin: 0;
    }

    .remove_div span {
        margin-left: auto;
        /* Pushes cust_bal to the right */
    }
</style>
<div class="header">
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
                    <h2 class="_head01">Transaction<span> Management</span></h2>
                </h1>
            </div>
            <div class="col-auto">
                <ol class="breadcrumb">
                    <li><a href="#"><span>Customers</span></a></li>
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
                <a class="btn add_button openDataSidebarForAddCustomerLedger customer-ledger-jama-banam"><i class="fa fa-plus"></i> Add New</a>
                <h2>Customer {{request()->segment(1) == 'customer-ledger-jama' ? ' Jama ( جمع )' : ' Banam ( بنام )'}}</h2>
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