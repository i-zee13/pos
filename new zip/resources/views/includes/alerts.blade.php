@if (session('success'))
    <div class="alert alert-success" style="margin: 0px">
        <strong>Success</strong> {{ session('success') }}
    </div>
@endif

@if (session('failed'))
    <div class="alert alert-danger" style="margin: 0px">
        <strong>Failed</strong> {{ session('failed') }}
    </div>
@endif