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
                    <h2 class="_head01">Return <span>Management</span></h2>
                </h1>
            </div>
            <div class="col-auto">
                <ol class="breadcrumb">
                    <li><a href="#"><span>Returns</span></a></li>
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
                <h2>Purchase List</h2>
              <a href="{{route('stock-add')}}" type="submit" class="btn btn-primary mr-2 add-new-purchase" style="font-size: 13px;padding: 6px 11px 4px 9px;margin-top: -10px; float: right;">Add New</a>

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
                @php  $parts              =     explode('-', $purchase->invoice_no);
                      $invoice_first_part =     $parts[0];
                       @endphp
            <tr> 
                    <td>{{$invoice_first_part}} ({{ $purchase->created_at->format('h:i A') }})</td>
                    <td>{{$purchase->customer_name}} </td>
                    <td style="font-family: 'Rationale', sans-serif !important;font-size: 20px;">{{$purchase->paid_amount ? $purchase->paid_amount : 0.00}} </td>
                    <td style="font-family: 'Rationale', sans-serif !important;font-size: 20px;">{{$purchase->total_invoice_amount}} </td>
                    <td>
                    <a id="{{$purchase->id}}" class="btn btn-default {{$purchase->is_editable== 1 ? 'btn-line'  : '' }}" href="{{$purchase->is_editable== 1 ? route('purchase-return-edit' ,['id'=>$purchase->id]) : route('purchase-edit' ,['id'=>$purchase->id ,'invoice' => 'detail'])}}">{{$purchase->is_editable== 1  ? 'Edit'  : "Detail" }}</a>

                        <!-- <button type="button" id="{{$purchase->id}}" class="btn btn-default red-bg  delete_product" name="Sub_cat" title="Delete">Delete</button> -->
                        <button id="{{$purchase->id}}" data-invoice="{{$purchase->id}}" data-customer-id="{{$purchase->customer_id}}"
                         paid-amount="{{$purchase->paid_amount}}" class="btn btn-default print-invoice">Print</button>
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

    <script>
        $('.print-invoice').on('click', function() {
            var invoice_id = $(this).attr('data-invoice');
            var customer_id = $(this).attr('data-customer-id');
            var invoice_id = $(this).attr('data-invoice');
            var paid_amount = $(this).attr('paid-amount');
            var printWindow = window.open("/print-purchase-return-invoice/" + invoice_id + '/' + customer_id + '/'+paid_amount);
            printWindow.onload = function() {
                printWindow.print();
                // printWindow.close();
            };
        })
    </script>
@endpush