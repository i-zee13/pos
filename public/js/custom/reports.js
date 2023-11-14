let deleteRef = '';
let batches = [];
let sessions = [];
let CurrentRef = '';
let report_segments = location.href.split('/');
let current_url = report_segments[3].replace(/[#?]+$/, '');
let trx_inv = false;
$(document).ready(function () {
    var currentDate = new Date();
    
    // Set start date to one month before the current date
    var startDate = new Date();
    startDate.setMonth(currentDate.getMonth() - 1);
    
    // Format dates to YYYY-MM-DD
    var formattedStartDate = startDate.toISOString().split('T')[0];
    var formattedEndDate = currentDate.toISOString().split('T')[0];
    
    // Set default values for the date inputs
    $('.start_date').val(formattedStartDate);
    $('.end_date').val(formattedEndDate);
});
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
    if ($('.vendor_id').val() == 0) {
        $('#notifDiv').fadeIn().css('background', 'red').text('Please Select Vendor First.');

        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return
    }
    CurrentRef = $(this);
    CurrentRef.attr('disabled', 'disabled');
    url = '/report-list'; 
    $(`#search-form`).ajaxSubmit({
        type: 'POST',
        url: url,
        data: {
            _token: $('meta[name="csrf_token"]').attr('content'),
            current_url: report_segments[3].replace(/[#?]+$/, '')
        },
        success: function (response) { 
            CurrentRef.attr('disabled', false);
            $('.loader').show();
            $('.teacher_attendance_list').empty();
            $('.teacher_attendance_list').append(`
                <table class="table table-hover dt-responsive nowrap TeacherAttendanceListTable" style="width:100%;">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Invoice</th>
                            <th>CR</th>
                            <th>DR</th> 
                            <th>Balance</th>
                            <th>Action</th>
                        </tr>
                    </thead><tbody>
                </tbody>
                </table>`);
            $('.TeacherAttendanceListTable tbody').empty();
            if (response.vendor.length == 0) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('No data available');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
            response.vendor.forEach((element, key) => {
                var label = 'N/A';
                var inv_id = '';
                var flag = false;
                trx_inv = false;
                if (element['sale_invoice_id'] != null && element['sale_invoice_id'] != 0) {
                    label = 'Sale Inv';
                    inv_id = element['sale_invoice_id'];
                } else if (element['purchase_invoice_id'] != null && element['purchase_invoice_id'] != 0) {
                    flag = true;
                    label = 'Purchase Inv';
                    inv_id = element['purchase_invoice_id'];
                } else if (element['sale_return_invoice_id'] != null && element['sale_return_invoice_id'] != 0) {
                    label = 'Sale Return Inv';
                    inv_id = element['sale_return_invoice_id'];
                } else if (element['product_replacement_invoice_id'] != null && element['product_replacement_invoice_id'] != 0) {
                    label = 'Product Replacement Inv';
                    inv_id = element['product_replacement_invoice_id'];
                } else if (element['purchase_return_invoice_id'] != null && element['purchase_return_invoice_id'] != 0) {
                    flag = true;
                    label = 'Return Inv';
                    inv_id = element['purchase_return_invoice_id'];
                } else if (element['crv_no'] != null && element['crv_no'] != 0) {
                    trx_inv = true;
                    label = 'Cash Receiving Voucher ( ' + element['comment'] + ' )';
                    inv_id = element['id'];
                } else if (element['cpv_no'] != null && element['cpv_no'] != 0) {
                    trx_inv = true; 
                    label = 'Cash Payment Voucher ( ' + element['comment'] + ' )';
                    inv_id = element['id'];
                }
                var date = new Date(element.created_at); 
                function formatAMPM(date) {
                    var hours   = date.getHours();
                    var minutes = date.getMinutes();
                    var ampm    = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // Handle midnight (0 hours)
                    minutes = minutes < 10 ? '0' + minutes : minutes; // Add leading zero for single digit minutes
                    var timeStr = ' (' + hours + ':' + minutes + ' ' + ampm + ')';
                    return timeStr;
                }
                var formattedDate = `${date.toDateString()} ${formatAMPM(date)}`; 
                if(current_url == 'vendor-reports'){
                    if(flag){
                        var ledger_bal = element['balance'] ? (element['balance'] < 0 ? element['balance'].toLocaleString('en-US') + ' DR' : element['balance'].toLocaleString('en-US') + ' CR') : '0';
                    }else{
                        var ledger_bal = element['balance'] ? (element['balance'] < 0 ? element['balance'].toLocaleString('en-US') + ' DR' : element['balance'].toLocaleString('en-US') + ' CR') : '0';
                    }
                }else{
                    if(flag){
                        var ledger_bal = element['balance'] ? (element['balance'] < 0 ? element['balance'].toLocaleString('en-US') + ' DR' : element['balance'].toLocaleString('en-US') + ' CR') : '0';
                    }else{
                        var ledger_bal = element['balance'] ? (element['balance'] < 0 ? element['balance'].toLocaleString('en-US') + ' CR' : element['balance'].toLocaleString('en-US') + ' DR') : '0';
                    }
                }
                $('.TeacherAttendanceListTable tbody').append(`
                    <tr> 
                        <td>${formattedDate}</td>
                        <td>${label}</td>
                        <td style="font-family: 'Rationale', sans-serif !important;font-size: 20px;">${element['cr'] ? element['cr'].toLocaleString('en-US') : '0'}</td>
                        <td style="font-family: 'Rationale', sans-serif !important;font-size: 20px;">${element['dr'] ? element['dr'].toLocaleString('en-US') : '0'}</td>
                        <td style="font-family: 'Rationale', sans-serif !important;font-size: 20px;">${ledger_bal}</td>
                        <td><a class="btn btn-default open-modal btn-line" 
                                data-inv-id="${inv_id}"
                                data-label="${label}"
                                data-id="${element['id']}"
                                data-commit = ${element['comment'] ?? 'NA'}
                                data-cr = ${element['cr']}
                                data-dr = ${element['dr']}
                                href="#">Detail </a> </td>                       
                    </tr>`);
            });
            $('.TeacherAttendanceListTable').fadeIn();
            $('.loader').hide();
            var title = '';
            if (report_segments[3] == 'customer-reports') {
                title = 'Customer Report'
            } else {
                title = 'Vendor Report'
            }
            if ($.fn.DataTable.isDataTable(".TeacherAttendanceListTable")) {
                $('.TeacherAttendanceListTable').DataTable().clear().destroy();
            }
            var table = $('.TeacherAttendanceListTable').DataTable({
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: 'Excel',
                        title: title,
                        exportOptions: {
                            // columns: ':visible:not(:last-child)',
                            format: {
                                body: function (innerHtml, rowIdx, colIdx, node) {
                                    return node.textContent;
                                }
                            }
                        },
                        customize: function (xlsx) {

                            //copy _createNode function from source
                            function _createNode(doc, nodeName, opts) {
                                var tempNode = doc.createElement(nodeName);

                                if (opts) {
                                    if (opts.attr) {
                                        $(tempNode).attr(opts.attr);
                                    }

                                    if (opts.children) {
                                        $.each(opts.children, function (key, value) {
                                            tempNode.appendChild(value);
                                        });
                                    }

                                    if (opts.text !== null && opts.text !== undefined) {
                                        tempNode.appendChild(doc.createTextNode(opts.text));
                                    }
                                }

                                return tempNode;
                            }

                        }
                    },

                ],

            })
        }
    });
});
$(document).on('click','.open-modal', function (event) {
     
    $('.cr').val($(this).data('cr'))
    $('.dr').val($(this).data('dr')) 
    $('.comment').val($(this).data('label')) 
     $('#itemModal').modal('show');
        event.preventDefault();
    
});
$('.reset-btn').on('click', function () {
    $('.vendor_id').val('').trigger('change');
    $('#search-form')[0].reset();
})