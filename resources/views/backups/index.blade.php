@extends('layouts.app')

@section('data-sidebar')
<div id="product-cl-sec">
    <a href="#" id="pl-close"  class="close-btn-pl"></a>
    <div class="pro-header-text">Google <span>account</span></div>
    <div class="pc-cartlist">
        <div class="overflow-plist">
            <div class="plist-content">
                <div class="_left-filter pt-0">
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <form id="backupGmailForm" method="post" action="{{ route('backups.mail-settings.store') }}">
                                    @csrf
                                    <div id="floating-label" class="card p-20 top_border mb-3" style="width: 100%">
                                        <h2 class="_head03">Gmail <span>credentials</span></h2>
                                        <p class="font12 text-muted mb-3" style="line-height: 1.5;">
                                            Use the Google account you want tied to backups. Create an <strong>App password</strong> under Google Account → Security → 2-Step Verification → App passwords (not your normal Gmail password). Values are stored <strong>encrypted</strong> on this server.
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
                        Databases in this run:
                        <strong>{{ implode(', ', $databases) }}</strong>
                        — configure <code>BACKUP_DATABASES</code> in <code>.env</code> (comma-separated) or rely on default <code>DB_DATABASE</code>.
                        Google Drive uses <strong>rclone</strong> when <code>BACKUP_RCLONE_ENABLED=true</code> (same remote as your nightly script).
                    </p>
                </div>
                <div class="d-flex flex-wrap align-items-center" style="gap: 8px;">
                    <button type="button" class="btn btn-default btn-line" onclick="openSidebar('#product-cl-sec'); return false;">
                        <i class="fa fa-google"></i> Gmail / app password
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
                            <th>DBs</th>
                            <th>Zip</th>
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
                                <td>{{ $log->created_at->format('Y-m-d H:i') }}</td>
                                <td>{{ $log->triggered_by }}@if($log->user_id) (user #{{ $log->user_id }}) @endif</td>
                                <td><small>{{ implode(', ', $log->databases ?? []) }}</small></td>
                                <td>{{ $log->zip_filename ?? '—' }}</td>
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
                {{ $logs->links() }}
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
