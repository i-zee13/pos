@php $systemAccountsReady = system_accounts_ready(); @endphp
<div class="card mb-30" id="system-accounts">
    <div class="header"><h2>System <span> Accounts</span></h2></div>
    <div class="body PT-15">
        <p class="mb-15 text-muted" style="font-size:14px;">Expense, Counter Sale, Net Purchase, Net Purchase Return — tenant <code>{{ current_tenant_id() ?? '—' }}</code></p>
        @if($systemAccountsReady)
        <p class="text-success mb-15 system-accounts-status"><i class="fa fa-check-circle"></i> Accounts already created.</p>
        @endif
        <button type="button" id="btn-seed-system-customers" class="btn {{ $systemAccountsReady ? 'btn-secondary' : 'btn-primary' }}" {{ $systemAccountsReady ? 'disabled' : '' }}>
            {{ $systemAccountsReady ? 'Accounts Already Created' : 'Create System Accounts' }}
        </button>
    </div>
</div>
@push('js')
<script>
$(document).ready(function () {
    if (!$('#btn-seed-system-customers').length || $('#btn-seed-system-customers').data('bound')) return;
    $('#btn-seed-system-customers').data('bound', true).on('click', function () {
        if ($(this).prop('disabled')) return;
        var $btn = $(this).prop('disabled', true).text('Creating...');
        $.ajax({
            url: '/seed-system-customers', type: 'GET',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            success: function (r) {
                if (r.status === 'success' || r.status === 'skipped') {
                    $('#notifDiv').fadeIn().css('background', r.status === 'success' ? 'green' : '#6c757d').text(r.message);
                    $btn.removeClass('btn-primary').addClass('btn-secondary').prop('disabled', true).text('Accounts Already Created');
                } else {
                    $('#notifDiv').fadeIn().css('background', 'red').text(r.message || 'Failed');
                    $btn.prop('disabled', false).text('Create System Accounts');
                }
                setTimeout(function () { $('#notifDiv').fadeOut(); }, 4000);
            },
            error: function () {
                $('#notifDiv').fadeIn().css('background', 'red').text('Request failed.');
                $btn.prop('disabled', false).text('Create System Accounts');
                setTimeout(function () { $('#notifDiv').fadeOut(); }, 4000);
            }
        });
    });
});
</script>
@endpush
