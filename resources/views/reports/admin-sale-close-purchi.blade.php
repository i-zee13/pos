@extends('layouts.app')
@section('content')
@php
    $closeDate = request('date', date('Y-m-d'));
    $is_close = isClose();
@endphp
<style>
    body {
        font-family: 'proximanova-light', sans-serif !important
    }

    .report .c-address-info div span,
    .c-address-info div span {
        font-size: 16px !important;
        margin-right: 10px !important;
        font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Urdu Typesetting', 'Arial', sans-serif !important;
    }

    .c-address-info {
        border-right: solid 0.0625rem #f4f4f4;
        font-size: 0.8125rem;
        height: auto;
    }

    .c-address-info div {
        margin-bottom: 8px !important;
        display: flex;
    }

    .c-address-info div span {
        width: 15.625rem;
        display: inline-block;
    }

    .c-address-info div strong {
        width: 14.25rem;
    }

    .digit {
        font-family: 'Rationale', sans-serif !important;
        font-size: 16px;
    }

    .f-17 {
        font-size: 17px
    }

    .Product-Filter {
        padding-bottom: 5px;
    }

    .CL-Product input {
        height: 32px !important;
    }
</style>

<div class="header-body">
    <div class="row">
        <div class="col">
            <h6 class="header-pretitle">Overview</h6>
            <h1 class="header-title">
                <h2 class="_head01">Sale Close <span>Purchi</span></h2>
            </h1>
        </div>
        <div class="col-auto">
            <ol class="breadcrumb">
                <li><a href="{{ route('admin-sale-close', ['date' => $closeDate]) }}" class="back-admin-close-link"><span>Admin Close</span></a></li>
                <li><span>Purchi</span></li>
            </ol>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-lg-12">
        <div class="Product-Filter">
            <form id="search-form">
                <div class="row">
                    <div class="col">
                        <div class="CL-Product inputmonth"><i class="fa fa-calendar-alt"></i>
                            <input type="date" autocomplete="off" class="form-control selected_date" value="{{ $closeDate }}" placeholder="Close Date">
                            <input type="hidden" value="{{ $closeDate }}" class="close_date">
                        </div>
                    </div>
                </div>
            </form>
            <div class="clearfix"></div>
        </div>
    </div>
</div>

<div class="card" style="padding: 0px">
    <div class="header m-0">
        <h2 style="width: 100%">Purchi <span>Detail</span>
            <a href="{{ route('admin-sale-close', ['date' => $closeDate]) }}" class="btn add_button back-admin-close-link" style="right: 230px!important;top:-2px!important">
                <i class="fa fa-arrow-left"></i> Back
            </a>
            <button class="btn add_button sale-close-btn-modal" data-toggle="modal" data-target="#close-modal" style="right: 115px!important;top:-2px!important" disabled>
                <i class="fa fa-check"></i>
                @if($is_close == 1)
                Sale Open
                @else
                Sale Close
                @endif
            </button>
            <a class="btn add_button" style="right: 0px!important;top:-2px!important" data-toggle="modal" data-target="#print-modal">
                <i class="fa fa-download"></i> Print DSR
            </a>
        </h2>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="body teacher_attendance_list">
                <div class="col-md-12">
                    <div class="row">
                        @include('reports.partials.admin-sale-close-purchi')
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@include('reports.partials.admin-sale-close-print-modal')
@include('reports.partials.admin-sale-close-modal')
@endsection

@push('js')
@include('reports.partials.admin-sale-close-print-scripts')
<script src="{{ asset('js/custom/admin-sale-close-date.js') }}"></script>
<script src="{{ asset('js/custom/admin-sale-close-modal.js') }}"></script>
<script src="{{ asset('js/custom/admin-sale-close-purchi.js') }}"></script>
@endpush
