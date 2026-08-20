@php
    $systemAccountsReady = system_accounts_ready();
@endphp
<div class="card mb-30" id="system-accounts">
    <div class="header">
        <h2>System <span> Accounts</span></h2>
    </div>
    <div class="body PT-15">
        <p class="mb-15 text-muted" style="font-size:14px;">
            Naye tenant ke liye yeh 4 default accounts banate hain:
            <strong>Expense</strong>, <strong>Counter Sale</strong>, <strong>Net Purchase</strong>, <strong>Net Purchase Return</strong>.
            Sirf aap ke tenant (<code>tenant_id: {{ current_tenant_id() ?? '—' }}</code>) ke liye apply hoga.
        </p>
        @if($systemAccountsReady)
        <p class="text-success mb-15 system-accounts-status"><i class="fa fa-check-circle"></i> Accounts already created — sab set hain.</p>
        @else
        <p class="text-muted mb-15 system-accounts-status" style="display:none;"></p>
        @endif
        <button type="button"
            id="btn-seed-system-customers"
            class="btn {{ $systemAccountsReady ? 'btn-secondary' : 'btn-primary' }}"
            {{ $systemAccountsReady ? 'disabled' : '' }}>
            {{ $systemAccountsReady ? 'Accounts Already Created' : 'Create System Accounts' }}
        </button>
    </div>
</div>

@push('js')
<script>
$(document).ready(function () {
    if (!$('#btn-seed-system-customers').length || $('#btn-seed-system-customers').data('bound')) {
        return;
    }
    $('#btn-seed-system-customers').data('bound', true);

    $('#btn-seed-system-customers').on('click', function () {
        if ($(this).prop('disabled')) {
            return;
        }
        var $btn = $(this);
        $btn.prop('disabled', true).text('Creating...');
        $.ajax({
            url: '/seed-system-customers',
            type: 'GET',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            success: function (response) {
                if (response.status === 'success' || response.status === 'skipped') {
                    var bg = response.status === 'success' ? 'green' : '#6c757d';
                    $('#notifDiv').fadeIn().css('background', bg).text(response.message);
                    $btn.removeClass('btn-primary').addClass('btn-secondary')
                        .prop('disabled', true).text('Accounts Already Created');
                    $('.system-accounts-status')
                        .removeClass('text-muted').addClass('text-success')
                        .html('<i class="fa fa-check-circle"></i> Accounts already created — sab set hain.')
                        .show();
                } else {
                    $('#notifDiv').fadeIn().css('background', 'red').text(response.message || 'Could not create accounts.');
                    $btn.prop('disabled', false).text('Create System Accounts');
                }
                setTimeout(function () { $('#notifDiv').fadeOut(); }, 4000);
            },
            error: function () {
                $('#notifDiv').fadeIn().css('background', 'red').text('Request failed. Login check karein ya page refresh karein.');
                $btn.prop('disabled', false).text('Create System Accounts');
                setTimeout(function () { $('#notifDiv').fadeOut(); }, 4000);
            }
        });
    });
});
</script>
@endpush
