@extends('layouts.app')

@section('content')

<div class="header">
    <div class="header-body">
        <div class="row">
            <div class="col">
                <h6 class="header-pretitle">System Backups</h6>
                <h1 class="header-title">
                    <h2 class="_head01">Backup <span>Logs</span></h2>
                </h1>
            </div>
            <div class="col-auto">
                <ol class="breadcrumb">
                    <li><a href="{{ route('home') }}"><span>Home</span></a></li>
                    <li><a href="{{ route('backups.index') }}"><span>DB Backups</span></a></li>
                    <li><span>Logs</span></li>
                </ol>
            </div>
        </div>
    </div>
</div>

<div class="row mb-3">
    <div class="col-md-12">
        <div class="card">
            <div class="header mb-0 d-flex flex-wrap align-items-center justify-content-between gap-2">
                <div>
                    <h2 class="mb-1">Latest activity</h2>
                    <p class="text-muted mb-0" style="font-size: 13px;">
                        Showing the latest 15 backup records, including queued, processing, completed, and failed runs.
                    </p>
                </div>
                <a href="{{ route('backups.index') }}" class="btn btn-primary" style="font-size: 13px; padding: 8px 14px;">
                    <i class="fa fa-database"></i> Take backup
                </a>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-12">
        <div class="card">
            <div class="body table-responsive">
                <table class="table table-hover backupLogsTable" style="width:100%;">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Started</th>
                            <th>Completed</th>
                            <th>Source</th>
                            <th>Databases</th>
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
                                <td>{{ optional($log->created_at)->format('d M Y h:i A') }}</td>
                                <td>
                                    @if($log->completed_at)
                                        {{ $log->completed_at->format('d M Y h:i A') }}
                                    @else
                                        <span class="text-muted">—</span>
                                    @endif
                                </td>
                                <td>{{ ucfirst($log->triggered_by) }}@if($log->user_id) (user #{{ $log->user_id }}) @endif</td>
                                <td style="max-width: 220px;">
                                    <small>{{ implode(', ', $log->databases ?: []) }}</small>
                                </td>
                                <td>
                                    @if($log->status === 'completed')
                                        <span class="badge badge-success">completed</span>
                                    @elseif($log->status === 'failed')
                                        <span class="badge badge-danger">failed</span>
                                    @elseif($log->status === 'processing')
                                        <span class="badge badge-warning">processing</span>
                                    @else
                                        <span class="badge badge-secondary">{{ $log->status }}</span>
                                    @endif
                                </td>
                                <td>
                                    @if($log->size_bytes)
                                        {{ number_format($log->size_bytes / 1024 / 1024, 2) }} MB
                                    @else
                                        <span class="text-muted">—</span>
                                    @endif
                                </td>
                                <td>
                                    @if($log->gdrive_uploaded)
                                        <span class="text-success">yes</span>
                                        @if($log->gdrive_remote_path)
                                            <br><small class="text-muted">{{ \Illuminate\Support\Str::limit($log->gdrive_remote_path, 40) }}</small>
                                        @endif
                                    @else
                                        <span class="text-muted">no</span>
                                    @endif
                                </td>
                                <td style="max-width: 280px;">
                                    @if($log->error_message)
                                        <small class="text-danger">{{ \Illuminate\Support\Str::limit($log->error_message, 150) }}</small>
                                    @else
                                        <small class="text-muted">—</small>
                                    @endif
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
                                <td colspan="10" class="text-center text-muted">No backup logs yet.</td>
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
    $('.backupLogsTable').DataTable({
        order: [[0, 'desc']],
        pageLength: 15,
        lengthChange: false
    });
</script>
@endpush
