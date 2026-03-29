let deleteRef = '';
let batches = [];
let sessions = [];
let CurrentRef = '';
let report_segments = location.href.split('/');
let current_url = report_segments[3].replace(/[#?]+$/, '');
let trx_inv = false;
$(document).ready(function () {

});
$('.search-btn').on('click', function () {
    var godown_id = $('.godown_id').val();
    if (!godown_id || godown_id == '') {
        $('#notifDiv').fadeIn().css('background', 'red').text('Please Select Godown First').focus();
        $('.godown_id').focus();
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return
    }
    CurrentRef = $(this);
    CurrentRef.attr('disabled', 'disabled');
    url = '/godown-ledger-list';
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
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Company</th>
                            <th>Godown</th>
                            <th>Stock Qty</th>
                            <th>Last Updated</th>
                        </tr>
                    </thead><tbody>
                </tbody>
                </table>`);
            $('.TeacherAttendanceListTable tbody').empty();
            if (response.reports.length == 0) {
                $('.TeacherAttendanceListTable tbody').append(`
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 20px;">
                            <strong>No stock available in this godown</strong>
                        </td>
                    </tr>
                `);
            }
            let totalStock = 0;
            response.reports.forEach((element, key, array) => {
                totalStock += parseFloat(element.p_qty || 0);
                var date = new Date(element.transaction_date);
                function formatAMPM(date) {
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    var timeStr = ' (' + hours + ':' + minutes + ' ' + ampm + ')';
                    return timeStr;
                }
                var formattedDate = `${date.toDateString()} ${formatAMPM(date)}`;
                godownDate(element, formattedDate)
            });
            
            // Update header with total stock
            var godownName = $('.godown_id option:selected').text();
            $('.godown-bal-div').html(`Total Stock: <strong>${totalStock.toFixed(2)}</strong> | ${godownName}`);
            
            $('.TeacherAttendanceListTable').fadeIn();
            $('.loader').hide();
            var title = 'Godown Stock Report - ' + godownName;

            if ($.fn.DataTable.isDataTable(".TeacherAttendanceListTable")) {
                $('.TeacherAttendanceListTable').DataTable().clear().destroy();
            }
            var table = $('.TeacherAttendanceListTable').DataTable({
               "bSort": true,
                 "bPaginate": true,
                 scrollX: false,
                 scrollY: '400px',
                 scrollCollapse: true,
                 dom: 'Bfrtip',
                buttons: [{
                        extend: 'excelHtml5',
                        text: 'Excel',
                        title: title,
                        exportOptions: {
                            format: {
                                body: function (innerHtml, rowIdx, colIdx, node) {
                                    return node.textContent;
                                }
                            }
                        },
                        customize: function (xlsx) {
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

            $('.TeacherAttendanceListTable tbody').append(`
                <tr style="background: #152e4d;border: solid 1px #dbdbdb;color: white">
                    <td class="font18" align="right" colspan="4"></td>
                    <td class="font18" align="center" style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">Total: ${totalStock.toFixed(2)}</td>
                    <td></td>
                </tr>
            `);
        }
    });
});
$(document).on('click', '.btn-detail', function (event) {
    var invoice_id = $(this).data('inv-id');
    var label = $(this).data('label');
    var inv_no = $(this).data('inv_no');

    if (inv_no.includes("Crv") || inv_no.includes("Cpv")) {
        $('.cr').val($(this).data('cr'))
        $('.dr').val($(this).data('dr'))
        $('.comment').val($(this).data('label'))
        $('#itemModal').modal('show');
        event.preventDefault();
    } else {
        window.location = `/detail/${invoice_id}/${label}`;
    }
});
$('.reset-btn').on('click', function () {
    $('#search-form')[0].reset();
    $('.godown_id').val('').trigger('change');
    $('.product_id').val('').trigger('change');
})

function godownDate(element, formattedDate) {
    tableHtml(element, formattedDate)
}

function tableHtml(element, formattedDate) {
    var RowHTML = ` <tr>
   <td>${element.product_id || 'N/A'}</td>
   <td style="font-weight:bold">${element.product_name || 'N/A'}</td>
   <td>${element.company_name || 'N/A'}</td>
   <td>${element.godown_name || 'N/A'} <small class="text-muted">(${element.godown_type || ''})</small></td>
   <td style="color:green;font-family: 'Rationale', sans-serif !important;font-size: 18px;font-weight:bold;">${parseFloat(element.p_qty || 0).toFixed(2)}</td>
   <td style="font-size: 13px;">${formattedDate}</td>
</tr>`;
    $('.TeacherAttendanceListTable tbody').append(RowHTML);
}
