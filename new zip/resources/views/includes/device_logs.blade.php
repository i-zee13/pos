@extends('layouts.master')
@section('content')

{{-- Modal --}}
<div class="modal fade bd-example-modal-sendMail" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title _head03" id="exampleModalLongTitle">Device <span>History</span></h5>
                <button type="button" class="close close_excel_modal" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body body_modal">
                {{-- <div id="floating-label" class="form-wrap p-10 pt-0 pb-0">
                    <div class="row">
                        
                    </div>
                </div> --}}
            </div>
        </div>
    </div>
</div>

<button type="button" hidden class="open_log_modal" data-toggle="modal"
    data-target=".bd-example-modal-sendMail"></button>


<div class="row mt-2 mb-3">
    <div class="col-lg-6 col-md-6 col-sm-6">
        <h2 class="_head01">Device <span>Management</span></h2>
    </div>
    <div class="col-lg-6 col-md-6 col-sm-6">
        <ol class="breadcrumb">
            <li><a href="#"><span>Users List</span></a></li>
            <li><span>Active</span></li>
        </ol>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <div class="card">
            <div class="header">
                <h2>Users List</h2>
            </div>
            <div class="body">
                <table class="table table-hover nowrap" id="example" style="width:100%">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>City</th>
                            <th>No. of Devices</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($users as $data)
                        <tr>
                            <td>{{$data->name ? $data->name : 'NA'}}</td>
                            <td>{{$data->email ? $data->email : 'NA'}}</td>
                            <td>{{$data->phone ? $data->phone : 'NA'}}</td>
                            <td>{{$data->city ? $data->city : 'NA'}}</td>
                            <td>{{$data->device_counts }}</td>
                            <td>
                                <button class="btn btn-default btn-line view_device_logs" id="{{$data->id}}">View Device
                                    History</button>
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
