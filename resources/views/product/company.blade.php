@extends('layouts.app')
@section('data-sidebar')
<div id="product-cl-sec">
    <a href="#" id="pl-close" class="close-btn-pl"></a>
    <div class="pro-header-text">New <span>Company</span></div>
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
                                <form style="display: flex;" id="saveMainCatForm">
                                    @csrf
                                    <input type="text" id="operation" hidden>
                                    <input type="text" name="company_id" hidden>
                                    <div id="floating-label" class="card p-20 top_border mb-3" style="width: 100%">
                                        <h2 class="_head03">Company <span>Details</span></h2>
                                        <div class="form-wrap p-0">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Company Name *</label>
                                                        <input type="text" name="company_name" class="form-control" required>
                                                    </div>
                                                </div>
                                                <!-- <div class="col-md-12">
                                                    <span>Upload Icon *</span>
                                                    <div class="upload-pic"></div>
                                                    <div class="img">
                                                        <input type="file" id="input-file-now" data-default-file="" class="dropify" name="company_icon" data-old_input="hidden_company_icon" accept="image/*" data-allowed-file-extensions="jpg png jpeg JPEG" />
                                                    </div>
                                                </div> -->
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
        <button type="submit" class="btn btn-primary mr-2" id="saveMainCat">Save</button>
        <button id="pl-close" type="submit" class="btn btn-cancel mr-2" id="cancelMainCat">Cancel</button>
    </div>
</div>
@endsection
@section('content')
<!-- HEADER -->
<div class="header ">
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
                    <h2 class="_head01">Company <span>Management</span></h2>
                </h1>
            </div>
            <div class="col-auto">
                <ol class="breadcrumb">
                    <li><a href="#"><span>Companies</span></a></li>
                    <li><span>Active</span></li>
                </ol>
                <!-- Button -->
                <!-- <a href="https://dashkit.goodthemes.co/index.html#!" class="btn btn-primary lift">
                        Create Report <i class="fa fa-car"></i>
                </a> -->
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <div class="card">
            <div class="header mb-0">
                <a class="btn add_button openDataSidebarForAddingCompany"><i class="fa fa-plus"></i> New Company</a>
                <h2>Companies</h2>
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
<script src="{{asset('js/custom/product.js')}}"> </script>
@endpush