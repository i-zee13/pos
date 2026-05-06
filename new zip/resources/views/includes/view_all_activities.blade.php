@extends('layouts.master')
@section('content')
<div class="_activityEmp">
    <div class="_activityEmp-Head">
        <div class="row mt-2">
            <div class="col-lg-6 col-md-6 col-sm-6">
                <h2 class="_head01">Overall <span>Activity</span></h2>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6">
                <ol class="breadcrumb">
                    <li><a href="#"><span>Employee</span></a></li>
                    <li><span>Activity</span></li>
                </ol>
            </div>
            <div class="col-12 _activity-filter-EMP">
                <div class="_more-action __filter pr-0">
                    <div class="dropdown float-left">
                        <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Filter Activity
                            <span class="filters_count">(11/11)</span></button>
                        <form class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                            <div class="CC-Select">
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" name="activityFilterCb[]"
                                        class="custom-control-input filter_checkBox" checked id="900"
                                        name-attr="orders">
                                    <label class="custom-control-label" for="900">Order</label>
                                </div>
                            </div>
                            <div class="CC-Select">
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" name="activityFilterCb[]"
                                        class="custom-control-input filter_checkBox" checked id="901"
                                        name-attr="products">
                                    <label class="custom-control-label" for="901">Product</label>
                                </div>
                            </div>
                            <div class="CC-Select">
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" name="activityFilterCb[]"
                                        class="custom-control-input filter_checkBox" checked id="902"
                                        name-attr="customers">
                                    <label class="custom-control-label" for="902">Customer</label>
                                </div>
                            </div>
                            <div class="CC-Select">
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" name="activityFilterCb[]"
                                        class="custom-control-input filter_checkBox" checked id="903"
                                        name-attr="suppliers">
                                    <label class="custom-control-label" for="903">Supplier</label>
                                </div>
                            </div>
                            <div class="CC-Select">
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" name="activityFilterCb[]"
                                        class="custom-control-input filter_checkBox" checked id="904"
                                        name-attr="shippers">
                                    <label class="custom-control-label" for="904">Shippers</label>
                                </div>
                            </div>
                            <div class="CC-Select">
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" name="activityFilterCb[]"
                                        class="custom-control-input filter_checkBox" checked id="905" name-attr="tasks">
                                    <label class="custom-control-label" for="905">Task</label>
                                </div>
                            </div>
                            <div class="CC-Select">
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" name="activityFilterCb[]"
                                        class="custom-control-input filter_checkBox" checked id="906" name-attr="items">
                                    <label class="custom-control-label" for="906">Item</label>
                                </div>
                            </div>
                            <div class="CC-Select">
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" name="activityFilterCb[]"
                                        class="custom-control-input filter_checkBox" checked id="907" name-attr="pocs">
                                    <label class="custom-control-label" for="907">POC</label>
                                </div>
                            </div>
                            <div class="CC-Select">
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" name="activityFilterCb[]"
                                        class="custom-control-input filter_checkBox" checked id="908"
                                        name-attr="forwarders">
                                    <label class="custom-control-label" for="908">Forwarder</label>
                                </div>
                            </div>
                            <div class="CC-Select">
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" name="activityFilterCb[]"
                                        class="custom-control-input filter_checkBox" checked id="909"
                                        name-attr="employees">
                                    <label class="custom-control-label" for="909">Employee</label>
                                </div>
                            </div>
                            <div class="CC-Select">
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" name="activityFilterCb[]"
                                        class="custom-control-input filter_checkBox" checked id="910"
                                        name-attr="payments">
                                    <label class="custom-control-label" for="910">Payment</label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="form-s2 date-List EMP__List">
                        <select class="form-control formselect" id="emp_for_activity">
                            <option value="0" selected>All Users</option>
                            @foreach ($users as $emp)
                            <option value="{{$emp->id}}">{{$emp->name}}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="form-s2 date-List EMP__List" style="width: 140px!important">
                        <select class="form-control formselect" class="date_filter">
                            <option value="0" selected>All</option>
                            <option value="1">Yesterday</option>
                            <option value="2">Today</option>
                            <option value="3">Current Month</option>
                            <option value="4">Last Month</option>
                            <option value="5">Custom</option>
                        </select>
                    </div>
                    <div class="Datefilter-EMP custom_filter_div" style="display:none">
                        <div><input type="text" class="form-control filterStartDate datepicker" placeholder="Start Date"
                                style="font-size: 13px"></div>
                        <div><input type="text" class="form-control filterEndDate datepicker" placeholder="End Date"
                                style="font-size: 13px"></div>
                    </div>
                    <div class="S__Activity"> <a><i class="fa fa-search"></i></a>
                        <input type="search" placeholder="Search Activity" class="searchActivities">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="_activityEmp-timeline">
        <div class="row">
            <div class="col-md-12">
                <div class="FU-history overallAC pr-30">
                    <div style="min-height: 400px" id="tblLoader">
                        <img src="/images/loader.gif" width="30px" height="auto"
                            style="position: absolute; left: 50%; top: 45%;">
                    </div>
                    <ul class="Act-timeline all_activities">
                        {{-- <li>
                            <a href="employee-activities.html" class="btn-primary view-all-EA">View More Activities</a>
                        </li> --}}
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
