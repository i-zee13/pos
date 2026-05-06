@extends('layouts.master')
@section('data-sidebar')
<div id="product-cl-sec">
    <a href="#" id="pl-close" class="close-btn-pl"></a>
    <div class="pro-header-text">Rights<span></span></div>
    <div style="min-height: 400px" id="dataSidebarLoader" style="display: none">
        <img src="/images/loader.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
    </div>
    <div class="pc-cartlist">
        <div class="overflow-plist">
            <div class="plist-content">
                <div class="_left-filter pt-0">
                    <div class="container">
                        <form style="width: 100%" id="saveRightsForm">
                            @csrf
                            <input type="text" id="operation" hidden>
                            <div class="row" id="employeesRow">
                                <div class="col-12">
                                    <div id="floating-label" class="card p-20 top_border mt-3 mb-3" style="width: 100%;">
                                        <h2 class="_head03">Employees <span>List</span></h2>
                                        <div class="form-wrap p-0">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <select name="employee_id" class="form-control">
                                                        @foreach ($employees as $emp)
                                                        <option value="{{ $emp->id }}">{{ $emp->username }}</option>
                                                        @endforeach
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div id="floating-label" class="card p-20 top_border mb-3" style="width: 100%;">
                                        <h2 class="_head03">Rights <span>List</span></h2>
                                        <div class="form-wrap p-0">
                                            <div class="row">
                                                <?php $counter = 0; ?>
                                                @foreach ($controllers as $acc)
                                                <div class="col-6" style="font-size: 9pt !important;">
                                                    <div class="custom-control custom-checkbox mr-sm-2">
                                                        <input type="checkbox" name="rights[]"
                                                            class="custom-control-input" value="{{ $acc->controller }}"
                                                            id="right-{{ $acc->id }}">
                                                        <label class="custom-control-label"
                                                            for="right-{{ $acc->id }}">{{ $acc->made_up_name }}</label>
                                                    </div>
                                                </div>
                                                <?php $counter++; ?>
                                                @endforeach
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
    <div class="_cl-bottom">
        <button type="submit" class="btn btn-primary mr-2" id="saveRights">Save</button>
        <button id="pl-close" type="submit" class="btn btn-cancel mr-2" id="cancelRights">Cancel</button>
    </div>
</div>
@endsection
@section('content')
<div class="row mt-2 mb-3">
    <div class="col-lg-6 col-md-6 col-sm-6">
        <h2 class="_head01">Rights <span>Management</span></h2>
    </div>
    <div class="col-lg-6 col-md-6 col-sm-6">
        <ol class="breadcrumb">
            <li><a href="#"><span>Access Rights</span></a></li>
            <li><span>Active</span></li>
        </ol>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <div class="card">
            <div class="header">
                <a class="btn add_button openDataSidebarForAddingAccessRights"><i class="fa fa-plus"></i> New Access
                    Rights</a>
                <h2>Access Rights List</h2>
            </div>
            <div style="min-height: 400px" id="tblLoader">
                <img src="/images/loader.gif" width="30px" height="auto"
                    style="position: absolute; left: 50%; top: 45%;">
            </div>
            <div class="body" style="display: none">
            </div>
        </div>
    </div>
</div>
@endsection
