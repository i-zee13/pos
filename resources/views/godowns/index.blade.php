@extends('layouts.app')

@section('data-sidebar')
<div id="product-cl-sec">
    <a href="#" id="pl-close" class="close-btn-pl"></a>
    <div class="pro-header-text">New <span>Godown</span></div>
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
                                <form style="display: flex;" id="saveGodownForm">
                                    @csrf
                                    <input type="text" id="operation" hidden>
                                    <input type="text" name="godown_id" hidden>
                                    <div id="floating-label" class="card p-20 top_border mb-3" style="width: 100%">
                                        <h2 class="_head03">Godown <span>Details</span></h2>
                                        <div class="form-wrap p-0">
                                            <div class="row">
                                                <div class="col-md-12 PB-10 ">
                                                    <label class="font12 mb-0">Name *</label>
                                                    <div class="form-s2">
                                                        <input type="hidden" id="hidden_godown_name" name="hidden_godown_name">
                                                        <select id="MCategory" class="demo-default godown_name" data-placeholder="Godown name" name="name">
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-12 PB-10">
                                                    <label class="font12 mb-0">Code</label>
                                                    <input type="text" name="code" class="form-control">
                                                </div>
                                                <div class="col-md-12 PB-10">
                                                    <label class="font12 mb-0">Type *</label>
                                                    <div class="form-s2">
                                                        <select name="type" class="form-control">
                                                            <option value="shop">Shop</option>
                                                            <option value="warehouse">Warehouse</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-12 PB-10">
                                                    <div class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="godown_active" name="is_active" checked>
                                                        <label class="custom-control-label font13" for="godown_active">Active</label>
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
        <button type="button" class="btn btn-primary mr-2" id="saveGodown">Save</button>
        <button id="pl-close" type="button" class="btn btn-cancel mr-2">Cancel</button>
    </div>
</div>
@endsection

@section('content')
<div class="header ">
    <div class="header-body">
        <div class="row">
            <div class="col">
                <h6 class="header-pretitle">Overview</h6>
                <h1 class="header-title">
                    <h2 class="_head01">Stock Allocation <span>Godowns</span></h2>
                </h1>
            </div>
            <div class="col-auto">
                <ol class="breadcrumb">
                    <li><a href="#"><span>Stock Allocation</span></a></li>
                    <li><span>Godowns</span></li>
                </ol>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-12">
        <div class="card">
            <div class="header mb-0">
                <a class="btn add_button openDataSidebarForAddingGodown"><i class="fa fa-plus"></i> New Godown</a>
                <h2>Godowns</h2>
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
<script src="{{ asset('js/custom/godown.js') }}"></script>
@endpush

