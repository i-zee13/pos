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
                            <th hidden>Invoice #</th>
                            <th>Invoice #</th>
                            <th>Date</th>
                            <th>Debit</th>
                            <th>Credit</th>
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
            let totalCR = 0;
            let totalDR = 0;
            let final_balance = 0;
            response.vendor.forEach((element, key) => {
                var label = 'N/A';
                var inv_id = '';
                var inv_no = '';
                var flag = false;
                trx_inv = false;
                totalCR += element['cr'] || 0;
                totalDR += element['dr'] || 0;
                if (element['sale_invoice_id'] != null && element['sale_invoice_id'] != 0) {
                    inv_no = element['invoice_no'];
                    label = 'Sale Inv';
                    inv_id = element['sale_invoice_id'];
                } else if (element['purchase_invoice_id'] != null && element['purchase_invoice_id'] != 0) {
                    flag = true;
                    inv_no = element['invoice_no'];
                    label = 'Purchase Inv';
                    inv_id = element['purchase_invoice_id'];
                } else if (element['sale_return_invoice_id'] != null && element['sale_return_invoice_id'] != 0) {
                    inv_no = element['invoice_no'];
                    label = 'Sale Return Inv';
                    inv_id = element['sale_return_invoice_id'];
                } else if (element['product_replacement_invoice_id'] != null && element['product_replacement_invoice_id'] != 0) {
                    inv_no = element['invoice_no'];
                    label = 'Product Replacement Inv';
                    inv_id = element['product_replacement_invoice_id'];
                } else if (element['purchase_return_invoice_id'] != null && element['purchase_return_invoice_id'] != 0) {
                    flag = true;
                    inv_no = element['invoice_no'];
                    label = 'Return Inv';
                    inv_id = element['purchase_return_invoice_id'];
                } else if (element['crv_no'] != null && element['crv_no'] != 0) {
                    trx_inv = true;
                    inv_no = element['crv_no'];
                    label = 'Cash Receiving Voucher ( ' + element['comment'] + ' )';
                    inv_id = element['id'];
                } else if (element['cpv_no'] != null && element['cpv_no'] != 0) {
                    trx_inv = true;
                    inv_no = element['cpv_no'];
                    label = 'Cash Payment Voucher ( ' + element['comment'] + ' )';
                    inv_id = element['id'];
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
                if (current_url == 'vendor-reports') {
                    if (flag) {
                        var ledger_bal = element['balance'] ? (element['balance'] < 0 ? element['balance'].toLocaleString('en-US') + ' DR' : element['balance'].toLocaleString('en-US') + ' CR') : '0';
                    } else {
                        var ledger_bal = element['balance'] ? (element['balance'] < 0 ? element['balance'].toLocaleString('en-US') + ' DR' : element['balance'].toLocaleString('en-US') + ' CR') : '0';
                    }
                } else {
                    if (flag) {
                        var ledger_bal = element['balance'] ? (element['balance'] < 0 ? element['balance'].toLocaleString('en-US') + ' DR' : element['balance'].toLocaleString('en-US') + ' CR') : '0';
                    } else {
                        var ledger_bal = element['balance'] ? (element['balance'] < 0 ? element['balance'].toLocaleString('en-US') + ' CR' : element['balance'].toLocaleString('en-US') + ' DR') : '0';
                    }
                }
                final_balance = ledger_bal
                ledger_bal = ledger_bal.replace('-', '');
                if (report_segments[3] == 'customer-reports') {
                    customer_Data(element, inv_no, inv_id, label, formattedDate)
                } else {
                    vendor_Data(element, inv_no, inv_id, label, formattedDate)
                }
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
                    <td class="font18" align="right"></td>
                    <td class="font18" align="center">Grand Total :</td>
                    <td class="totalNo"   style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">${totalDR.toLocaleString('en-US')}</td>
                    <td class="totalNo"  style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">  ${totalCR.toLocaleString('en-US')} </td>
                    <td class="totalNo" colspan="2">
                        <span class="grand-total" style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">${final_balance}</span>
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

function customer_Data(element, inv_no, inv_id, label, formattedDate) {
    if (element.cr && element.dr) {
        // Both CR and DR present
        // First iteration: CR present, DR skipped 
        if (element.balance > 0) {
            var firstBalance = (element.balance + parseFloat(element.cr));
            var secondBalance = element.balance;
            console.log(firstBalance, secondBalance);
        } else {
            var firstBalance = (element.balance - parseFloat(element.dr) + parseFloat(element.cr)) + parseFloat(element.dr);
            console.log((element.balance - parseFloat(element.dr) + parseFloat(element.cr)));
            var secondBalance = element.balance;
        }
        var firstRowHTML = `
            <tr>
                <td hidden>${element.id}</td>
                <td>${inv_no}</td>
                <td>${formattedDate}</td> 
                <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${element.dr.toLocaleString('en-US')}</td>
                <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">0</td>
                <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${firstBalance.toLocaleString('en-US')}</td>
                <td><a class="btn btn-default btn-detail  btn-line"
                        data-inv-id="${inv_id}"
                        data-inv_no="${inv_no}"
                        data-label="${label}"
                        data-id="${element.id}"
                        data-commit="${element.comment ?? 'NA'}"
                        data-cr="${element.cr}"
                        data-dr="${element.dr}"
                        href="javascript:void(0)">Detail</a></td>
            </tr>`;
        $('.TeacherAttendanceListTable tbody').append(firstRowHTML);

        // Second iteration: CR skipped, DR present


        var secondRowHTML = `
            <tr>
                <td hidden>${element.id}</td>
                <td>${inv_no}</td>
                <td>${formattedDate}</td> 
                <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">0</td>
                <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${element.cr.toLocaleString('en-US')}</td>
                <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${secondBalance.toLocaleString('en-US')}</td>
                <td><a class="btn btn-default btn-detail  btn-line"
                        data-inv-id="${inv_id}"
                        data-inv_no="${inv_no}"
                        data-label="${label}"
                        data-id="${element.id}"
                        data-commit="${element.comment ?? 'NA'}"
                        data-cr="${element.cr}"
                        data-dr="${element.dr}"
                        href="javascript:void(0)">Detail</a></td>
            </tr>`;
        $('.TeacherAttendanceListTable tbody').append(secondRowHTML);
    } else {

        // Only one of CR or DR present or neither
        var crValue = element.cr ? element.cr.toLocaleString('en-US') : '0';
        var drValue = element.dr ? element.dr.toLocaleString('en-US') : '0';

        var balance_text = '';
        if (element.balance >= 0) {
            balance_text = (element.balance).toLocaleString('en-US') + "<span style='color:red;font-size: 16px;font-weight: bold;'> DR</span>";
        } else if (element.balance < 0) {
            balance_text = (-element.balance).toLocaleString('en-US') + "<span style='color:green;font-size: 16px;font-weight: bold;'> CR </span>";
        } else {
            balance_text = element.balance.toLocaleString('en-US');
        }
        var rowHTML = `
            <tr>
                <td hidden>${element.id}</td>
                <td>${inv_no}</td>
                <td>${formattedDate}</td> 
                <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${drValue}</td>
                <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${crValue}</td>
                <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${balance_text}</td>
                <td><a class="btn btn-default btn-detail  btn-line"
                        data-inv-id="${inv_id}"
                        data-inv_no="${inv_no}"
                        data-label="${label}"
                        data-id="${element.id}"
                        data-commit="${element.comment ?? 'NA'}"
                        data-cr="${element.cr}"
                        data-dr="${element.dr}"
                        href="javascript:void(0)">Detail</a></td>
            </tr>`;
        $('.TeacherAttendanceListTable tbody').append(rowHTML);
    }
}

function vendor_Data(element, inv_no, inv_id, label, formattedDate) {
    if (element.cr && element.dr) {
        // Both CR and DR present
        // First iteration: CR present, DR skipped 

        if (element.balance > 0) {
            var firstBalance = (parseFloat(element.balance) + parseFloat(element.dr));
            var secondBalance = element.balance;
        } else {
            var firstBalance = (element.balance - parseFloat(element.dr) + parseFloat(element.cr)) + parseFloat(element.dr);
            var secondBalance = element.balance;
        }
        tableHtml(element, inv_id, inv_no, formattedDate, label, element.cr, firstBalance, "cr")
        tableHtml(element, inv_id, inv_no, formattedDate, label, element.dr, secondBalance, "dr")

        // var firstRowHTML = `
        //     <tr>
        //         <td hidden>${element.id}</td>
        //         <td>${inv_no}</td>
        //         <td>${formattedDate}</td> 
        //         <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">0</td>
        //         <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${element.cr.toLocaleString('en-US')}</td>
        //         <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${firstBalance.toLocaleString('en-US')}</td>
        //         <td><a class="btn btn-default btn-detail  btn-line"
        //                 data-inv-id="${inv_id}"
        //                 data-inv_no="${inv_no}"
        //                 data-label="${label}"
        //                 data-id="${element.id}"
        //                 data-commit="${element.comment ?? 'NA'}"
        //                 data-cr="${element.cr}"
        //                 data-dr="${element.dr}"
        //                 href="javascript:void(0)">Detail</a></td>
        //     </tr>`;
        // $('.TeacherAttendanceListTable tbody').append(firstRowHTML);

        // Second iteration: CR skipped, DR present


        // var secondRowHTML = `
        //     <tr>
        //         <td hidden>${element.id}</td>
        //         <td>${inv_no}</td>
        //         <td>${formattedDate}</td> 
        //         <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${element.dr.toLocaleString('en-US')}</td>
        //         <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">0</td>
        //         <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${secondBalance.toLocaleString('en-US')}</td>
        //         <td><a class="btn btn-default btn-detail  btn-line"
        //                 data-inv-id="${inv_id}"
        //                 data-inv_no="${inv_no}"
        //                 data-label="${label}"
        //                 data-id="${element.id}"
        //                 data-commit="${element.comment ?? 'NA'}"
        //                 data-cr="${element.cr}"
        //                 data-dr="${element.dr}"
        //                 href="javascript:void(0)">Detail</a></td>
        //     </tr>`;
        // $('.TeacherAttendanceListTable tbody').append(secondRowHTML);
    } else {
        if (element.trx_type == 3) {
            // Only one of CR or DR present or neither
            var crValue = element.cr ? element.cr.toLocaleString('en-US') : '0';
            var drValue = element.dr ? element.dr.toLocaleString('en-US') : '0';
            // var balance_text = element.balance >= 0 ? element.balance.toLocaleString('en-US') + "<span style='color:green;font-size: 16px;font-weight: bold;'> CR </span>" : element.balance < 0 ? element.balance.toLocaleString('en-US') + "<span style='color:red;font-size: 16px;font-weight: bold;'> DR</span>" : element.balance.toLocaleString('en-US');
            var balance_text = '';
            if (element.balance >= 0) {
                balance_text = element.balance.toLocaleString('en-US') + "<span style='color:green;font-size: 16px;font-weight: bold;'> CR </span>";
            } else if (element.balance < 0) {
                balance_text = (-element.balance).toLocaleString('en-US') + "<span style='color:red;font-size: 16px;font-weight: bold;'> DR</span>";
            } else {
                balance_text = element.balance.toLocaleString('en-US');
            }

            var rowHTML = `
            <tr>
                <td hidden>${element.id}</td>
                <td>${inv_no}</td>
                <td>${formattedDate}</td> 
                <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${drValue}</td>
                <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${crValue}</td>
                <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${balance_text}</td>
                <td><a class="btn btn-default btn-detail btn-line"
                        data-inv-id="${inv_id}"
                        data-inv_no="${inv_no}"
                        data-label="${label}"
                        data-id="${element.id}"
                        data-commit="${element.comment ?? 'NA'}"
                        data-cr="${element.cr}"
                        data-dr="${element.dr}"
                        href="javascript:void(0)">Detail</a></td>
            </tr>`;
            $('.TeacherAttendanceListTable tbody').append(rowHTML);
        } else {
            // Only one of CR or DR present or neither
            var crValue = element.cr ? element.cr.toLocaleString('en-US') : '0';
            var drValue = 0;

            if (element.dr > 0) {
                drValue = element.paid_p_return_amount > 0 ? (element.dr - element.paid_p_return_amount).toLocaleString('en-US') : element.dr.toLocaleString('en-US');
            }
            if (element.balance > 0) {
                var firstBalance = element.balance + element.paid_p_return_amount;
                var secondBalance = element.balance;
            } else {
                var firstBalance = (parseFloat(element.balance) + parseFloat(element.paid_p_return_amount));
                var secondBalance = element.balance;
            }
            if (element.cr) {
                tableHtml(element, inv_id, inv_no, formattedDate, label, crValue, firstBalance, "cr")
            } else if (element.paid_p_return_amount > 0 && element.dr > 0) {
                tableHtml(element, inv_id, inv_no, formattedDate, label, drValue, firstBalance, "dr")
                tableHtml(element, inv_id, inv_no, formattedDate, label, element.paid_p_return_amount, secondBalance, "dr_with_payment")
            } else {
                tableHtml(element, inv_id, inv_no, formattedDate, label, drValue, secondBalance, "dr")
            }

        }
    }
}

function tableHtml(element, inv_id, inv_no, formattedDate, label, dr_cr, balance, payment_flag = null) {
    var dr_val = 0;
    var cr_val = 0;
    var balance_text = balance >= 0 ? balance.toLocaleString('en-US') + " <span style='color:green;font-size: 16px;font-weight: bold;'> CR </span>" : balance < 0 ? balance.toLocaleString('en-US') + " <span style='color:red;font-size: 16px;font-weight: bold;'> DR </span>" : balance.toLocaleString('en-US');
    var balance_text = '';
    if (balance >= 0) {
        balance_text = balance.toLocaleString('en-US') + "<span style='color:green;font-size: 16px;font-weight: bold;'> CR </span>";
    } else if (balance < 0) {
        balance_text = (-balance).toLocaleString('en-US') + "<span style='color:red;font-size: 16px;font-weight: bold;'> DR</span>";
    } else {
        balance_text = balance.toLocaleString('en-US');
    }
    if (payment_flag == 'dr' || payment_flag == 'dr_with_payment') {
        console.log(payment_flag)
        dr_val = dr_cr.toLocaleString('en-US');
    } else if (payment_flag == 'cr') {
        cr_val = dr_cr.toLocaleString('en-US');
    }
    var RowHTML = ` <tr>
   <td hidden>${element.id}</td>
   <td>${inv_no}</td>
   <td>${formattedDate}</td> 
   <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${dr_val}</td>
   <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${cr_val}</td>
   <td style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${balance_text}</td>
   <td><a class="btn btn-default btn-detail  btn-line"
           data-inv-id="${inv_id}"
           data-inv_no="${inv_no}"
           data-label="${label}"
           data-id="${element.id}"
           data-commit="${element.comment ?? 'NA'}"
           data-cr="${element.cr}"
           data-dr="${element.dr}"
           href="javascript:void(0)">Detail</a></td>
</tr>`;
    $('.TeacherAttendanceListTable tbody').append(RowHTML);

}
