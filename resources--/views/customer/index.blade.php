@extends('layouts.app')
@section('data-sidebar')
<div id="product-cl-sec">
    <a href="#" id="pl-close" class="close-btn-pl"></a>
    <div class="pro-header-text">New <span>{{$name}}</span></div>
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
                                <form style="display: flex;" id="savaCustomerForm">
                                    @csrf
                                    <input type="text" id="operation" hidden>
                                    <input type="text" name="customer_id" hidden>
                                    <div id="floating-label" class="card p-20 top_border mb-3" style="width: 100%">
                                        <h2 class="_head03">{{$name}} <span>Details</span></h2>
                                        <div class="form-wrap p-0">
                                            <div class="row">
                                                <!-- <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">{{$name}} Name *</label>
                                                        <input type="text" name="customer_name" class="form-control" required>
                                                    </div>
                                                </div> -->
                                                <div class="col-md-12 PB-10 ">
                                                    <label class="font12 mb-0">{{$name}} Name *</label>
                                                    <div class="form-s2">
                                                        <input type="hidden" id="hidden_customer_name" name="hidden_customer_name">
                                                        <select id="MCategory" class="demo-default customer_name" data-placeholder="Enter your Name" name="customer_name">

                                                        </select>
                                                    </div>
                                                </div>


                                            </div>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Phone# *</label>
                                                        <input type="text" name="phone_no" class="form-control" required>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Whatsapp# *</label>
                                                        <input type="text" name="whatsapp_no" class="form-control" required>
                                                    </div>
                                                </div>
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Cnic# *</label>
                                                        <input type="text" name="cnic_no" id="cnicInput" class="form-control" placeholder="XXXXX-XXXXXX-X">
                                                    </div>

                                                </div>

                                            </div>
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Address *</label>
                                                        <textarea name="address" class="form-control" rows="4"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <input class="custom-control-input vendor" type="radio" name="customer_type" id="vendor" value="1" {{$name == 'Vendor' ? 'checked' : ''}} hidden>
                                        <input class="custom-control-input customer" type="radio" name="customer_type" id="customer" value="2" {{$name == 'Customer' ? 'checked' : ''}} hidden>

                                        <!-- <h2 class="_head03 mt-10">Choose Type<span></span></h2>
                                        <div class="col-md-12">
                                            <div class="row">
                                                <div class="col-auto">
                                                    <div class="custom-control custom-radio">
                                                        <input class="custom-control-input vendor" type="radio" name="customer_type" id="vendor" value="1" {{$name == 'Vendor' ? 'checked' : ''}}>
                                                        <label class="custom-control-label font13" for="vendor">Vendor</label>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="custom-control custom-radio">
                                                        <input class="custom-control-input customer" type="radio" name="customer_type" id="customer" value="2" {{$name == 'Customer' ? 'checked' : ''}}>
                                                        <label class="custom-control-label font13" for="customer">Customer</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> -->
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
        <button type="submit" class="btn btn-primary mr-2" id="savaCustomer">Save</button>
        <button id="pl-close" type="submit" class="btn btn-cancel mr-2" id="cancelMainCat">Cancel</button>
    </div>
</div>
@endsection
@section('content')
<!-- HEADER -->
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
                    <h2 class="_head01">{{$name}} <span>Management</span></h2>
                </h1>
            </div>
            <div class="col-auto">
                <ol class="breadcrumb">
                    <li><a href="#"><span>{{$name}}</span></a></li>
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
                <a class="btn add_button openDataSidebarForAddingCustomer"><i class="fa fa-plus"></i> New {{$name}}</a>
                <h2>{{$name}}s</h2>
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
<script src="{{asset('js/custom/customer.js')}}"> </script>
<script>
   $('#cnicInput').on('input', function() {
        var cnic = $(this).val();
        cnic = cnic.replace(/-/g, ''); // Remove existing dashes
        cnic = cnic.replace(/\D/g, ''); // Remove non-digit characters

        var formattedCnic = '';
        for (var i = 0; i < cnic.length; i++) {
            if (i === 5 || i === 12) {
                formattedCnic += '-';
            }
            formattedCnic += cnic[i];
        }
        $(this).val(formattedCnic);
    });
</script>
@endpush