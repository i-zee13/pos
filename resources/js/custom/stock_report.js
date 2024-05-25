let deleteRef = '';
let batches = [];
let sessions = [];
let CurrentRef = '';
let segments = location.href.split('/');
$('.search-btn').on('click', function () {
    var start_date = $('.start_date').val();
    var end_date = $('.end_date').val();
    if (start_date != '' && end_date == '') {
        $('#notifDiv').fadeIn().css('background', 'red').text('End Date should not be Empty').focus();
        $('.end_date').focus();
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return
    }
    if (end_date != '' && start_date == '') {
        $('#notifDiv').fadeIn().css('background', 'red').text('End Date should not be Empty');
        $('.start_date').focus();
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return
    }
    if ($('.company_id').val() == 0 && $('.product_id').val() == 0) {
        $('#notifDiv').fadeIn().css('background', 'red').text('Please Select Company/Product First.');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return
    }
    CurrentRef = $(this);
    // CurrentRef.attr('disabled', 'disabled');
    url = '/stocks';
    $(`#search-form`).ajaxSubmit({
        type: 'POST',
        url: url,
        data: {
            _token: $('meta[name="csrf_token"]').attr('content'),
            current_url: segments[3]
        },
        success: function (response) {

            CurrentRef.attr('disabled', false);
            $('.loader').show();
            $('.teacher_attendance_list').empty();
            $('.teacher_attendance_list').append(`
                <table class="table table-hover dt-responsive nowrap TeacherAttendanceListTable" style="width:100%;">
                    <thead>
                        <tr>
                            <th hidden>id</th>
                            <th>#</th>
                            <th>Company Name</th>
                            <th>Product Name</th> 
                            <th>Expiry</th>
                            <th>Balance</th> 
                        </tr>
                    </thead><tbody>
                </tbody>
                </table>`);
            $('.TeacherAttendanceListTable tbody').empty();
            if (response.records.length == 0) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('No data available');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
            let total_balance = 0;
            response.records.forEach((element, key) => {
                total_balance += element['balance'];
                var percentageValue = (element.sale_price - element.p_price) / element.p_price * 100;
                var date = new Date(element.expire_date);
                var formattedDate = date.toDateString();
                $('.TeacherAttendanceListTable tbody').append(`
                    <tr>
                        <td hidden>${element['id']}</td>
                        <td>${key+1}</td>
                        <td>${element['company_name'] }</td>
                        <td>${element['product_name'] }</td>
                        <td>${element['expiry_date'] ? element['expiry_date'] : 'NA' }</td>
                        <td style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">${element['balance']}</td> 
                    </tr>`);
            });
            $('.TeacherAttendanceListTable tbody').append(`
            <tr style="background: #152e4d;border: solid 1px #dbdbdb;color: white">
                <td class="font18" align="right" colspan="3"></td>
                <td class="font18" align="center">Grand Total :</td>
                <td class="totalNo">
                    <span class="grand-total" style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">${total_balance}</span>
                </td>
            </tr>
        `);
            $('.ttl_stock_in_hand').html(total_balance);
            $('.TeacherAttendanceListTable').fadeIn();
            $('.loader').hide();
            var title = '';
            if (segments[3] == 'customer-reports') {
                title = 'Customer Report'
            } else {
                title = 'Vendor Report'
            }

            if ($.fn.DataTable.isDataTable(".TeacherAttendanceListTable")) {
                $('.TeacherAttendanceListTable').DataTable().clear().destroy();
            }
            var table = $('.TeacherAttendanceListTable').DataTable({
                dom: 'Bfrtip',
                buttons: [{
                        title: 'Stock Report',
                        extend: 'excelHtml5',
                        exportOptions: {

                        },
                    },
                    {
                        extend: 'print',
                        text: 'Print',
                        title: title,
                        exportOptions: {
                            format: {
                                body: function (innerHtml, rowIdx, colIdx, node) {
                                    return node.textContent;
                                }
                            }
                        },
                        customize: function (win) {
                            // Change the default print title
                            $(win.document.body).find('h1').text(title);

                            // Add a footer with the current date and time
                            var date = new Date().toLocaleString();
                            $(win.document.body).append('<div style="text-align:center;font-size:10px;">' + date + '</div>');

                            // Remove the default DataTables styling from the print view
                            $(win.document.body).find('table').removeClass('display').addClass('table').css('font-size', 'inherit');
                        }

                    }
                ],

            })

        }
    });
});
$('.company_id').on('change', function () {
    var company_id = $(this).val();
    var batch = batches.filter(x => x.company_id == company_id);
    if (batch) {
        $('.batch_id').empty();
        $('.batch_id').append(`<option value="">Select Batch Code</option>`);
        $('.session_id').empty();
        $('.session_id').append(`<option value="">Select Session Code</option>`)
        batch.forEach(data => {
            $('.batch_id').append(`<option value="${data.id}" >${data.batch_code}</option>`);
        });
    }
})

$('.reset-btn').on('click', function () {
    $('.company_id').val('').trigger('change');
    $('.product_id').val('').trigger('change');
    $('#search-form')[0].reset();
    $('.teacher_attendance_list').empty();
    $('.teacher_attendance_list').append(`
            <div class="col-12 pb-10">
            <div class="no-info">
                <div class="m-auto"><strong>Please Filter Your Stock Record !</strong></div>
            </div>
        </div>
        `);

    $('.ttl_stock_in_hand').html(0);
})
