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
                    <h2 class="_head01">Purchase <span>Management</span></h2>
                </h1>
            </div>
            <div class="col-auto">
                <ol class="breadcrumb">
                    <li><a href="#"><span>Purchase</span></a></li>
                    <li><span>Active</span></li>
                </ol>
            </div>
        </div>
    </div>


</div>
<div class="row">
    <div class="col-md-12">
        <div class="card">
            <div class="header">
                <!-- <a class="btn add_button openDataSidebarForAddingProduct"><i class="fa fa-plus"></i> New  Product</a> -->
                <h2>Purchase List</h2>
            </div>
            <!-- <div style="min-height: 400px" id="tblLoader">
                <img src="/images/loader.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
            </div> -->
            <div class="body" >
            <table class="table table-hover dt-responsive nowrap subCatsListTable" style="width:100%;" id="example">
                <thead>
                    <tr>
                        <th>Invoice #</th>
                        <th>Vendor Name</th>
                        <th>Paid</th>
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
            <tbody>
                @foreach($purchases as $purchase)
            <tr>

                    <td>{{Str::limit($purchase->invoice_no, 20)}}</td>
                    <td>{{$purchase->customer_name}} </td>
                    <td style="font-family: 'Rationale', sans-serif !important;font-size: 20px;">{{$purchase->paid_amount}} </td>
                    <td style="font-family: 'Rationale', sans-serif !important;font-size: 20px;">{{$purchase->total_invoice_amount}} </td>
                    <td>
                        <a id="{{$purchase->id}}" class="btn btn-default btn-line" href="{{route('purchase-edit' ,['id'=>$purchase->id])}}">Edit</a>
                        <!-- <button type="button" id="{{$purchase->id}}" class="btn btn-default red-bg  delete_product" name="Sub_cat" title="Delete">Delete</button> -->
                    </td>
                </tr>
                @endforeach
            </tbody>
            </table>
            </div>
        </div>
    </div>
</div>
@endsection
@push('js')
<!-- <script src="{{asset('js/custom/product.js')}}"> </script> -->
@endpush