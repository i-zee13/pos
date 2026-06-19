@extends('layouts.app')

@section('data-sidebar')
<div id="product-cl-sec">
    <a href="#" id="pl-close"  class="close-btn-pl"></a>
    <div class="pro-header-text">Google <span>Drive</span></div>
    <div class="pc-cartlist">
        <div class="overflow-plist">
            <div class="plist-content">
                <div class="_left-filter pt-0">
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <div class="card p-20 top_border mb-3" style="width: 100%">
                                    <h2 class="_head03">Drive <span>connection</span></h2>
                                    <p class="font12 text-muted mb-3" style="line-height: 1.5;">
                                        Connect the Google account where manual database backups should be uploaded. Google will generate the OAuth token; this app stores the refresh token encrypted.
                                    </p>
                                    @if($mailSetting && $mailSetting->hasConnectedGoogleDrive())
                                        <div class="alert alert-success mb-3">
                                            Connected as <strong>{{ $mailSetting->gmail }}</strong>
                                            @if($mailSetting->google_drive_connected_at)
                                                <br><small>Connected {{ $mailSetting->google_drive_connected_at->format('d M Y h:i A') }}</small>
                                            @endif
                                        </div>
                                        <form method="post" action="{{ route('backups.google.disconnect') }}" class="mb-0">
                                            @csrf
                                            <button type="submit" class="btn btn-default btn-line">Disconnect Google Drive</button>
                                        </form>
                                    @else
                                        <a href="{{ route('backups.google.connect') }}" class="btn btn-primary">
                                            <i class="fa fa-google"></i> Connect Google Drive
                                        </a>
                                    @endif
                                </div>

                                <form id="backupGmailForm" method="post" action="{{ route('backups.mail-settings.store') }}">
                                    @csrf
                                    <div id="floating-label" class="card p-20 top_border mb-3" style="width: 100%">
                                        <h2 class="_head03">Optional Gmail <span>credentials</span></h2>
                                        <p class="font12 text-muted mb-3" style="line-height: 1.5;">
                                            This is only for email/app-password settings. Drive upload uses the OAuth connection above, not your Gmail password.
                                        </p>
                                        <div class="form-wrap p-0">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Gmail address *</label>
                                                        <input type="email" name="gmail" class="form-control" required
                                                            value="{{ old('gmail', $mailSetting->gmail ?? '') }}"
                                                            placeholder="you@gmail.com"
                                                            autocomplete="username">
                                                    </div>
                                                </div>
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">App password</label>
                                                        <input type="password" name="app_password" class="form-control"
                                                            placeholder="{{ ($mailSetting && $mailSetting->hasStoredAppPassword()) ? 'Leave blank to keep existing app password' : '16-character app password' }}"
                                                            autocomplete="new-password">
                                                        @if($mailSetting && $mailSetting->hasStoredAppPassword())
                                                            <small class="text-muted">An app password is already saved. Enter a new one only if you want to replace it.</small>
                                                        @endif
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
        <button type="submit" form="backupGmailForm" class="btn btn-primary mr-2">Save</button>
        <button type="button" class="btn btn-cancel mr-2" id="pl-close-gmail-bottom">Cancel</button>
    </div>
</div>
@endsection

@section('content')

<div class="header">
    <div class="header-body">
        <div class="row">
            <div class="col">
                <h6 class="header-pretitle">System</h6>
                <h1 class="header-title">
                    <h2 class="_head01">Database <span>Backups</span></h2>
                </h1>
            </div>
            <div class="col-auto">
                <ol class="breadcrumb">
                    <li><a href="{{ route('home') }}"><span>Home</span></a></li>
                    <li><span>Backups</span></li>
                </ol>
            </div>
        </div>
    </div>
</div>

@if(session('success'))
    <div class="alert alert-success">{{ session('success') }}</div>
@endif
@if(session('error'))
    <div class="alert alert-danger">{{ session('error') }}</div>
@endif
@if($errors->any())
    <div class="alert alert-danger">
        <ul class="mb-0 pl-3">
            @foreach($errors->all() as $err)
                <li>{{ $err }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="row mb-3">
    <div class="col-md-12">
        <div class="card">
            <div class="header mb-0 d-flex flex-wrap align-items-center justify-content-between gap-2">
                <div>
                    <h2 class="mb-1">Take backup</h2>
                    <p class="text-muted mb-0" style="font-size: 13px;">
                        Tenant backup (merge mode): only your shop data — safe to inject into existing DB without touching other tenants.
                        Tenant {{ current_tenant_id() ?? '—' }} · databases: <strong>{{ implode(', ', $databases) }}</strong>.
                        Nightly schedule without a tenant still dumps the full database.
                    </p>
                </div>
                <div class="d-flex flex-wrap align-items-center" style="gap: 8px;">
                    <button type="button" class="btn btn-default btn-line" onclick="openSidebar('#product-cl-sec'); return false;">
                        <i class="fa fa-google"></i> Google Drive
                    </button>
                    <form action="{{ route('backups.store') }}" method="post" class="m-0">
                        @csrf
                        <button type="submit" class="btn btn-primary" style="font-size: 13px; padding: 8px 14px;">
                            <i class="fa fa-database"></i> Take backup now
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-12">
        <div class="card">
            <div class="header mb-0">
                <h2>Backup log</h2>
            </div>
            <div class="body table-responsive">
                <table class="table table-hover backupLogsTable" style="width:100%;">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>When</th>
                            <th>Source</th>
                           
                           
                            <th>Status</th>
                            <th>Size</th>
                            <th>Drive</th>
                            <th>Note</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($logs as $log)
                            <tr>
                                <td>{{ $log->id }}</td>
                                <td>{{ $log->created_at->isoFormat('ddd, Do MMM') }}</td>
                                <td>{{ $log->triggered_by }}@if($log->user_id) (user #{{ $log->user_id }}) @endif</td>
                              
                                
                                <td>
                                    @if($log->status === 'completed')
                                        <span class="badge badge-success">completed</span>
                                    @elseif($log->status === 'failed')
                                        <span class="badge badge-danger">failed</span>
                                    @else
                                        <span class="badge badge-secondary">{{ $log->status }}</span>
                                    @endif
                                </td>
                                <td>
                                    @if($log->size_bytes)
                                        {{ number_format($log->size_bytes / 1024 / 1024, 2) }} MB
                                    @else
                                        —
                                    @endif
                                </td>
                                <td>
                                    @if($log->gdrive_uploaded)
                                        <span class="text-success">yes</span>
                                    @else
                                        <span class="text-muted">no</span>
                                    @endif
                                </td>
                                <td style="max-width: 260px;">
                                    <small class="text-muted">{{ \Illuminate\Support\Str::limit($log->error_message, 120) }}</small>
                                </td>
                                <td>
                                    @if($log->isDownloadable())
                                        <a class="btn btn-default btn-line btn-sm" href="{{ route('backups.download', $log) }}">Download</a>
                                    @else
                                        <span class="text-muted">—</span>
                                    @endif
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="10" class="text-center text-muted">No backups yet.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
                
            </div>
        </div>
    </div>
</div>

@endsection

@push('js')
<script>
     $('#tblLoader').hide();
      $('.body').fadeIn();
      $('.backupLogsTable').DataTable();
    $(document).on('click', '#pl-close-gmail, #pl-close-gmail-bottom', function() {
        closeSidebar();
    });
    
function closeSidebar() {
    $(".customer_form_div").removeClass("active");
    $(".poc_form_div").removeClass("active");
    $("#product-cl-sec").removeClass("active");
    $("#product-add").removeClass("active");
    $("#performaPreferences").removeClass("active");
    $(".overlay").removeClass("active");
    //$("body").toggleClass("no-scroll");
    $("#contentContainerDiv").removeClass("blur-div");
    $(".sticky-footer").removeClass("blur-div");
    $(".overlay-for-sidebar").css("display", "none");
    $("body").removeClass("no-scroll");
}
</script>
@endpush
