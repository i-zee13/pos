@extends('layouts.app')

@section('content')
<div class="header">
    <div class="header-body">
        <div class="row">
            <div class="col">
                <h6 class="header-pretitle">Overview</h6>
                <h1 class="header-title">
                    <h2 class="_head01">Stock <span>Transfer</span></h2>
                </h1>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-4">
        <div class="card p-20">
            <h2 class="title border-bottom mb-15">Transfer <span>Details</span></h2>
            <div class="form-wrap p-0">
                <div class="row">
                    <div class="col-md-12 PB-10">
                        <label class="font13 mb-5">From Godown</label>
                        <div class="form-s2">
                            <select class="form-control formselect required" id="from_godown_id">
                                <option value="">Select Godown</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-12 PB-10">
                        <label class="font13 mb-5">To Godown</label>
                        <div class="form-s2">
                            <select class="form-control formselect required" id="to_godown_id">
                                <option value="">Select Godown</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-12 PB-10">
                        <label class="font13 mb-5">Date</label>
                        <div class="form-s2">
                            <input type="date" class="form-control" id="transfer_date" value="{{ date('Y-m-d') }}">
                        </div>
                    </div>
                    <div class="col-md-12 PB-10">
                        <label class="font13 mb-5">Reference #</label>
                        <div class="form-s2">
                            <input type="text" class="form-control" id="reference_no">
                        </div>
                    </div>
                    <div class="col-md-12">
                        <label class="font13 mb-5">Description</label>
                        <div class="form-s2">
                            <textarea rows="4" class="form-control" id="description"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-8">
        <div class="card p-20">
            <div class="row">
                <div class="col-md-6">
                    <h2 class="title font22 PT-10 mb-10">Transfer <span>Items</span></h2>
                </div>
            </div>

            <div class="right_Info">
                <div class="row inputfileds-top">
                    <div class="col-md-12">
                        <table class="ProductTable table" id="transferTable" width="100%">
                            <thead>
                                <tr>
                                    <th style="width: 80px;">ID</th>
                                    <th style="width: 250px;">Product</th>
                                    <th style="width: 120px;">QTY</th>
                                    <th style="width: 80px;">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input type="text" id="product_id" class="form-control" readonly>
                                    </td>
                                    <td>
                                        <div class="form-s2">
                                            <select class="form-control formselect" id="product_select">
                                                <option value="">Select Product</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td>
                                        <input type="number" id="transfer_qty" class="form-control" min="0">
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-primary" id="add_transfer_item">Add</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="row mt-3">
                    <div class="col-md-12 text-right">
                        <button class="btn btn-primary" id="save_transfer">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('js')
<script src="{{ asset('js/custom/stock_transfer.js') }}"></script>
@endpush

