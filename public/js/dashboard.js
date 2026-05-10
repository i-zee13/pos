$(document).ready(function () {

    $(".datepicker").datepicker({
        format: "yyyy-mm-dd",
        startDate: "+0d"
    }).on('changeDate', function (e) {
        $(this).datepicker('hide');
    });

    //CurrentMonth
    // fetchDashboardReports($('.dashboard_filter').val());

    // $(document).on('change', '.dashboard_filter', function () {
    //     if ($(this).val() == 3) {
    //         $('.dashboard_date_filter').show();
    //     } else if ($(this).val() == 2) {
    //         $('.dashboard_date_filter').hide();
    //         fetchDashboardReports($(this).val());
    //     } else {
    //         $('.dashboard_date_filter').hide();
    //         fetchDashboardReports($(this).val());
    //     }
    // });

    // $(document).on('change', '#start_date', function () {
    //     if ($(this).val()) {
    //         if ($('#end_date').val()) {
    //             fetchDashboardReports($('.dashboard_filter').val(), $(this).val(), $('#end_date').val());
    //         }
    //     }
    // });

    // $(document).on('change', '#end_date', function () {
    //     if ($(this).val()) {
    //         if ($('#start_date').val()) {
    //             fetchDashboardReports($('.dashboard_filter').val(), $('#start_date').val(), $(this).val());
    //         }
    //     }
    // });


});

function sortResults(array, prop, asc) {
    array.sort(function (a, b) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
}

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
