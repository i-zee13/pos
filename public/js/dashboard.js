/**
 * Legacy dashboard helpers (kept conflict-free).
 * Analytics dashboard uses /js/custom/analytics.js
 */
$(document).ready(function () {
    if ($('.datepicker').length) {
        $('.datepicker').datepicker({
            format: 'yyyy-mm-dd'
        }).on('changeDate', function () {
            $(this).datepicker('hide');
        });
    }
});
