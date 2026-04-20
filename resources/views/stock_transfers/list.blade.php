@extends('layouts.app')
@section('content')
    <div class="header">
        <div class="header-body">
            <div class="row">
                <div class="col">
                    <h6 class="header-pretitle">Overview</h6>
                    <h1 class="header-title">
                        <h2 class="_head01">Stock <span>Allocation</span></h2>
                    </h1>
                </div>
                <div class="col-auto">
                    <ol class="breadcrumb">
                        <li><a href="#"><span>Stock</span></a></li>
                        <li><span>Transfer</span></li>
                    </ol>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="header mb-0">
                    <h2>Stock Transfer List</h2>
                    <a href="{{ route('stock-transfers.create') }}" type="button" class="btn btn-primary mr-2 add-new-sale"
                        style="font-size: 13px;padding: 6px 11px 4px 9px;margin-top: -10px; float: right;">Add New</a>
                </div>

                <div class="body">
                    <table class="table table-hover dt-responsive nowrap subCatsListTable" style="width:100%;" id="example">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Items</th>
                                <th>Total Qty</th>
                                <th>Ref</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($transfers as $t)
                                <tr>
                                    <td>{{ $t->id }} ({{ \Carbon\Carbon::parse($t->created_at)->format('h:i A') }})</td>
                                    <td>{{ \Carbon\Carbon::parse($t->transfer_date)->format('d-m-Y') }}</td>
                                    <td><b>{{ $t->from_godown_name }}</b></td>
                                    <td><b>{{ $t->to_godown_name }}</b></td>
                                    <td>{{ count($t->items ?? []) }}</td>
                                    <td>{{ collect($t->items ?? [])->sum('qty') }}</td>
                                    <td>{{ $t->reference_no }}</td>
                                    <td>{{ $t->description }}</td>
                                    <td>
                                        <button class="btn btn-default print-transfer" data-transfer-id="{{ $t->id }}">Print</button>
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
        $('.print-transfer').on('click', function() {
            var transferId = $(this).attr('data-transfer-id');
            var printWindow = window.open("/print-stock-transfer/" + transferId);
            printWindow.onload = function() {
                printWindow.print();
            };
        })
    </script>
@endpush

