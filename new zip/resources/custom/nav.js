var notif_ids = [];
$(document).on('click', '#NotiFications', function() {
    $('.notifications_list').each(function() {
        notif_ids.push($(this).attr('id'));
    });
    $.ajax({
        type: 'POST',
        url: '/Notifications/readFourNotifs',
        data: {
            _token: $('meta[name="csrf_token"]').attr('content'),
            notif_ids: notif_ids
        }
    });
});