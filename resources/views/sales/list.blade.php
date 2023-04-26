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
                <!-- <a class="btn add_button openDataSidebarForAddingProduct"><i class="fa fa-plus"></i> New  Product</a> -->
                <h2>Sales List</h2>
              <a href="{{route('sale-add')}}" type="submit" class="btn btn-primary mr-2" style="font-size: 13px;padding: 6px 11px 4px 9px;margin-top: -10px; float: right;">Add New</a>

            </div>
            <!-- <div style="min-height: 400px" id="tblLoader">
                <img src="/images/loader.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
            </div> -->
            <div class="body" >
            <table class="table table-hover dt-responsive nowrap subCatsListTable" style="width:100%;" id="example">
                <thead>
                    <tr>
                        <th>Invoice #</th>
                        <th>Customer Name</th>
                        <th>Received</th>
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
            <tbody>
                @foreach($sales as $sale)
            <tr>
                    <td>{{Str::limit($sale->invoice_no, 20)}}</td>
                    <td>{{$sale->customer_name}} </td>
                    <td style="font-family: 'Rationale', sans-serif !important;font-size: 20px;">{{$sale->paid_amount}} </td>
                    <td style="font-family: 'Rationale', sans-serif !important;font-size: 20px;">{{$sale->total_invoice_amount}} </td>
                    <td>
                        <a id="{{$sale->id}}" class="btn btn-default btn-line" href="{{route('sale-edit' ,['id'=>$sale->id])}}">Edit</a>
                        <button id="{{$sale->id}}" data-invoice="{{$sale->id}}" data-customer-id="{{$sale->customer_id}}" paid-amount="{{$sale->paid_amount}}" class="btn btn-default print-invoice">Print</button>
                        <!-- <button type="button" id="{{$sale->id}}" class="btn btn-default red-bg  delete_product" name="Sub_cat" title="Delete">Delete</button> -->
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
<script >
    $('.print-invoice').on('click',function(){
        var invoice_id  = $(this).attr('data-invoice');
        var customer_id = $(this).attr('data-customer-id');
        var invoice_id  = $(this).attr('data-invoice');
        var paid_amount = $(this).attr('paid-amount');
        window.open("/print-sale-invoice/"+invoice_id+'/'+customer_id+'/'+paid_amount).print();
    })
</script>
@endpush