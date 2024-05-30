@extends('layouts.app')
@section('data-sidebar')
<div id="product-cl-sec">
    <a href="#" id="pl-close" class="close-btn-pl"></a>
    <div class="pro-header-text">New <span>Product</span></div>
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
                                <form style="display: flex;" id="saveProductForm">
                                    @csrf
                                    <input type="text" id="operation" hidden>
                                    <input type="text" id="product_id" hidden name="hidden_product_id">
                                    <div id="floating-label" class="card p-20 top_border mb-3" style="width: 100%">
                                        <h2 class="_head03">Product <span>Details</span></h2>
                                        <div class="form-wrap p-0">
                                            <div class="row" id="item-container">
                                                <div class="col-md-6 PB-10 ">
                                                    <label class="font12 mb-0">Companies *</label>
                                                    <div class="form-s2 ">
                                                        <select class="form-control formselect field-required compaies" name="company_id">
                                                            <option value="0" selected> Select Company</option>
                                                            @foreach ($companies as $item)
                                                            <option value="{{ $item->id }}">{{ $item->company_name }}</option>
                                                            @endforeach
                                                        </select>
                                                    </div>
                                                </div>
                                                <style>
                                                    .fa-trash {
                                                        margin-top: 28px;
                                                        margin-left: 10px;
                                                        color: red;
                                                        cursor: pointer
                                                    }

                                                    .addBTN-act {
                                                        font-size: 13px;
                                                        background-color: #040725;
                                                        border: none;
                                                        -webkit-border-radius: 0;
                                                        -moz-border-radius: 0;
                                                        border-radius: 0;
                                                        -khtml-border-radius: 0;
                                                        box-shadow: 2px 2px 10px 0 rgba(79, 79, 79, .2);
                                                        padding: 6px 10px;
                                                        color: #fff !important;
                                                        float: right;
                                                        cursor: pointer;
                                                    }
                                                </style>
                                                <div class="row">
                                                    <div class="col-md-12 mt-25">
                                                        <h2 class="_head03">Add <span>Barcode</span><a onclick="addMoreItems()" class="btn addBTN-act"><i class="fa fa-plus"></i> New Barcode</a></h2>
                                                    </div>
                                                </div>
                                                <h6 class="_head03" style="padding-bottom: 0px; border-bottom: 0px">ID : <span class="barcode_span"></span></h6>
                                                <div class="row bar_code_div d-flex">
                                                    <div class="item-wrapper col-md-6 PB-10">
                                                        <div class="form-group">
                                                            <input type="text" name="barcode[]" class="form-control barcode" value="" />
                                                            <i class="fa fa-trash remove-item" aria-hidden="true" onclick="removeItem(this)"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-12 PB-10 ">
                                                    <label class="font12 mb-0">Products *</label>
                                                    <div class="form-s2">
                                                        <input type="hidden" id="hidden_product_name" name="hidden_product_name">

                                                        <!-- <select class="form-control formselect attribute" placeholder="select Designation" style="width:100%!important" name="attribute_id"> -->
                                                        <select id="MCategory" class="demo-default attribute" data-placeholder="Product name" name="product_name">

                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 PB-10">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Size *</label>
                                                        <input type="text" name="size" class="form-control field-required" required>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 PB-10">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Purchase Price *</label>
                                                        <input type="text" name="purchase_price" class="form-control field-required only_numerics" required>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 PB-10">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Sale Price *</label>
                                                        <input type="text" name="sale_price" class="form-control field-required only_numerics" required>
                                                    </div>
                                                </div>
                                            </div>
                                            <!--<div class="col-md-12">-->
                                            <!--    <span class="_head03 mt-10">Upload Icon *</span>-->
                                            <!--    <div class="upload-pic"></div>-->
                                            <!--    <div class="sub-img">-->
                                            <!--        <input type="file" id="input-file-now" data-default-file="" class="dropify" name="product_icon" accept="image/*" data-allowed-file-extensions="jpg png jpeg JPEG" />-->
                                            <!--    </div>-->
                                            <!--</div>-->
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
        <button type="submit" class="btn btn-primary mr-2 btn-product-add" id="saveProduct">Save</button>
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
                    <h2 class="_head01">Product <span>Management</span></h2>
                </h1>
            </div>
            <div class="col-auto">
                <ol class="breadcrumb">
                    <li><a href="#"><span>Products</span></a></li>
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
                <a class="btn add_button openDataSidebarForAddingProduct"><i class="fa fa-plus"></i> New Product</a>
                <h2>Product Areas</h2>
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
<script>
    function addMoreItems() {

        var newItem = $(".item-wrapper:first").clone();
        $(".bar_code_div").append(` 
        <div class="item-wrapper col-md-6 PB-10">
            <div class="form-group">
                <input type="text" name="barcode[]" class="form-control barcode" value="" />
                <i class="fa fa-trash remove-item" aria-hidden="true" onclick="removeItem(this)"></i>
            </div>
        </div>
        `);
    }

    function removeItem(button) {
        // Remove the parent item wrapper when the remove button is clicked
        $(button).closest('.item-wrapper').remove();
    }
</script>
@endpush