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
    url = '/product-list';
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
                            <th hidden>Invoice #</th>
                            <th >Invoice #</th>
                            <th>Date</th>
                            <th>Invoice #</th> 
                            <th>Name</>
                            <th>IN</th> 
                            <th>OUT</th> 
                            <th>Balance</th>
                        </tr>
                    </thead><tbody>
                </tbody>
                </table>`);
            $('.TeacherAttendanceListTable tbody').empty();
            if (response.reports.length == 0) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('No data available');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
            let stock_in_hand = 0;
            let totalCR = 0;
            let totalDR = 0;
            let final_balance = 0;
            response.reports.forEach((element, key, array) => {
                if (key === array.length - 1) {
                    stock_in_hand = element.balance;
                }
                var label = 'N/A';
                var inv_id = '';
                var flag = false;
                trx_inv = false;
                totalCR += element['cr'] || 0;
                totalDR += element['dr'] || 0;
                if (element['sale_invoice_id'] != null && element['sale_invoice_id'] != 0) {
                    label = 'Sale Inv';
                    inv_id = element['sale_invoice_id'];
                } else if (element['purchase_invoice_id'] != null && element['purchase_invoice_id'] != 0) {
                    flag = true;
                    label = 'Purchase Inv';
                    inv_id = element['purchase_invoice_id'];
                } else if (element['sale_return_id'] != null && element['sale_return_id'] != 0) {
                    label = 'Sale Return Inv';
                    inv_id = element['sale_return_id'];
                } else if (element['product_replacement_invoice_id'] != null && element['product_replacement_invoice_id'] != 0) {

                    label = 'Product Replacement Inv';
                    inv_id = element['product_replacement_invoice_id'];
                } else if (element['purchase_return_invoice_id'] != null && element['purchase_return_invoice_id'] != 0) {
                    flag = true;
                    label = 'Return Inv';
                    inv_id = element['purchase_return_invoice_id'];
                }
                var date = new Date(element.created_at);

                function formatAMPM(date) {
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // Handle midnight (0 hours)
                    minutes = minutes < 10 ? '0' + minutes : minutes; // Add leading zero for single digit minutes
                    var timeStr = ' (' + hours + ':' + minutes + ' ' + ampm + ')';
                    return timeStr;
                }
                var formattedDate = `${date.toDateString()} ${formatAMPM(date)}`;
                productDate(element, inv_id, label, formattedDate)
            });
            $('.filter_name').empty();
            if ($('.product_id').val() != '') {
                $('.filter_name').html('Product: <span>' + $('.product_id option:selected').text() + '</span>');
            } else if ($('.company_id').val() != '' && $('.product_id').val() == '') {
                $('.filter_name').html('Company: <span>' + $('.company_id option:selected').text() + '</span>');

            }
            $('.TeacherAttendanceListTable').fadeIn();
            $('.loader').hide();
            var title = 'Product Report';

            if ($.fn.DataTable.isDataTable(".TeacherAttendanceListTable")) {
                $('.TeacherAttendanceListTable').DataTable().clear().destroy();
            }
            var table = $('.TeacherAttendanceListTable').DataTable({
                "ordering": false,
                "paging": false,
                dom: 'Bfrtip',
                buttons: [{
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

            $('.TeacherAttendanceListTable tbody').append(`
                <tr style="background: #152e4d;border: solid 1px #dbdbdb;color: white">
                    <td class="font18" align="right" colspan="3"></td>
                    <td class="font18" align="center">Grand Total :</td>
                    <td class="totalNo"   style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">${totalDR.toLocaleString('en-US')}</td>
                    <td class="totalNo"  style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">  ${totalCR.toLocaleString('en-US')} </td>
                    <td class="totalNo" >
                        <span class="grand-total" style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">${stock_in_hand}</span>
                    </td>
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
    $('.vendor_id').val('').trigger('change');
    $('#search-form')[0].reset();
})

function productDate(element, inv_id, label, formattedDate) {

    tableHtml(element, inv_id, formattedDate, label)
}

function tableHtml(element, inv_id, formattedDate, label) {
    var RowHTML = ` <tr>
   <td hidden>${element.id}</td>
   <td >${element.p_id}</td>
   <td>${formattedDate}</td> 
   <td style="font-weight:bold">${label} ${element.transaction_type == 5 ? '<span class="TS-delete">Deleted</span>': ''} </td> 
   <td>${element.customer_name}</td> 
    
   ${element.p_status} 
   <td style="color:${element.p_status ==  1 ? 'green'  : 'red' };font-family: 'Rationale', sans-serif !important;font-size: 18px;">${element.p_status == 1 ? element.p_qty : '-'} </td>
   <td style="color:${element.p_status ==  1 ? 'green'  : 'red' };font-family: 'Rationale', sans-serif !important;font-size: 18px;">${element.p_status == 2 ? element.p_qty : '-'} </td>
   <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${element.p_balance} <i  class=" ${element.p_status == 1 ? 'fa fa-arrow-up text-success' : 'fa fa-arrow-down text-danger'}"></i></td>
    
</tr>`;
    $('.TeacherAttendanceListTable tbody').append(RowHTML);

}
