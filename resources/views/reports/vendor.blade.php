@extends('layouts.app')

@section('content')

<style>
    ._cust_filter {
        width: 188px;
        float: left;
        padding-right: 10px;
        margin-bottom: 15px;
    }

    .CL-Product {
        padding-right: 10px;
    }

    .btn-primary {
        box-shadow: none
    }

    .Product-Filter .form-s2 .select2-container .select2-selection--single {
        height: 32px !important;
    }

    .Product-Filter .form-s2 .select2-container--default .select2-selection--single .select2-selection__arrow {
        height: 30px;
    }

    .table ._cust_filter {
        width: 140px;
        margin: 0
    }

    .table ._cust_filter .select2-container--default .select2-selection--single .select2-selection__rendered {
        line-height: 24px;
        font-size: 12px;
    }

    .table ._cust_filter .form-s2 .select2-container .select2-selection--single {
        height: 25px !important;
    }

    .table ._cust_filter .form-s2 .select2-container--default .select2-selection--single .select2-selection__arrow {
        height: 25px;
    }

    .table td {
        padding: 5px 3px 5px 3px;
        line-height: 24px;
    }

    .table td .btn-default {
        padding-top: 6px;
        padding-bottom: 6px;
        margin: 0
    }
</style>
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
                    <h2 class="_head01">Reports<span> Management</span></h2>
                </h1>
            </div>
            <div class="col-auto">
                <ol class="breadcrumb">
                    <li><a href="#"><span>Vendors</span></a></li>
                    <li><span>Active</span></li>
                </ol>
            </div>
        </div>
    </div>


</div>

<div class="row">
    <div class="col-lg-12">
        <div class="Product-Filter">
            <div class="row">
                <div class="col pr-0">
                    <!-- <div class="CL-Product"><i class="fa fa-search"></i>
						<input type="text" class="form-control" placeholder="Search" style="width: 100%;" name="" id="" required="">
					</div> -->
                    <div class="_cust_filter">
                        <span class="btn_text">Select Client </span>
                        <label class="switch">
                            <input type="checkbox" class="show_btn" name="gradutation_switch_btn" value="0">
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="_cust_filter">
                        <div class="form-s2">
                            <select class="form-control formselect courses_to_search" placeholder="Select Vendor" name="course_id">
                                <option value="0">Select Vendor</option>

                            </select>
                        </div>
                    </div>

                    

                </div>
                <div class="col-auto pl-0">
                    <button type="button" class="btn btn-primary m-0" id="search"> Search</button>
                </div>

            </div>
            <div class="clearfix"></div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-12">
        <div class="card">
            <div class="body search_result_table">
                Please Search for Vendor
                <!-- <table class="table table-hover dt-responsive nowrap" id="example" style="width:100%">
					<thead>
						<tr>
							<th>Student Code</th>
							<th>Name</th> 
							<th>Email</th> 
							<th>REG. Date</th> 
							<th>Type</th> 
							<th>Desire Slot</th>
							<th>Instrutor</th>
							<th>Class</th>
							 
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>2559</td>
							<td>768 Distributor</td>
							<td>768 Distributor</td>
							<td>768 Distributor</td>
							<td>
								<div class="_cust_filter p-0">
									<div class="form-s2">
										<select class="form-control formselect" placeholder="Select Type">
											<option>Select Type</option>
											<option>Select Type 2</option>
											<option>Select Type 3</option>
										</select>
									</div>
								</div>
							</td>
							<td>
								<div class="_cust_filter p-0">
									<div class="form-s2">
										<select class="form-control formselect" placeholder="Select Type">
											<option>Select Type</option>
											<option>Select Type 2</option>
											<option>Select Type 3</option>
										</select>
									</div>
								</div>
							</td>
							<td>
								<div class="_cust_filter p-0">
									<div class="form-s2">
										<select class="form-control formselect" placeholder="Select Region">
											<option>Select Region</option>
										</select>
									</div>
								</div>
							</td>
							<td>
								<div class="_cust_filter p-0">
									<div class="form-s2">
										<select class="form-control formselect" placeholder="Select Zone/Area">
											<option>Select Zone/Area</option>
										</select>
									</div>
								</div>
							</td>
							 
							<td><a href="#" class="btn btn-default" title="Update">Update</a></td>
						</tr>

					</tbody>
				</table> -->


            </div>
        </div>

    </div>


</div>

@endsection