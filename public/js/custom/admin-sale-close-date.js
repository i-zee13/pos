function getSelectedCloseDate() {
    var date = $('.selected_date').val() || $('.close_date').val();
    return date || '';
}

function setSelectedCloseDate(date) {
    if (!date) {
        return;
    }
    $('.selected_date').val(date);
    $('.close_date').val(date);
}

function initCloseDateFromQuery() {
    var params = new URLSearchParams(window.location.search);
    var date = params.get('date');
    if (date) {
        setSelectedCloseDate(date);
    }
}

function updateSaleCloseNavLinks(date) {
    date = date || getSelectedCloseDate();
    if (!date) {
        return;
    }
    var encoded = encodeURIComponent(date);
    $('.view-purchi-link').attr('href', '/admin-sale-close-purchi?date=' + encoded);
    $('.back-admin-close-link').attr('href', '/admin-sale-close?date=' + encoded);
}

function bindCloseDateAutoLoad(onDateChange) {
    initCloseDateFromQuery();
    var initialDate = getSelectedCloseDate();
    updateSaleCloseNavLinks(initialDate);
    if (initialDate) {
        onDateChange(initialDate);
    }

    $('.selected_date').on('change', function () {
        var date = $(this).val();
        if (!date) {
            return;
        }
        $('.close_date').val(date);
        updateSaleCloseNavLinks(date);
        onDateChange(date);
    });
}
