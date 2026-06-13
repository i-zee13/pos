let deleteRef = '';
let batches = [];
let sessions = [];
let CurrentRef = '';
let report_segments = location.href.split('/');
let current_url = report_segments[3].replace(/[#?]+$/, '');
let trx_inv = false;

function ledgerNum(value) {
    var n = parseFloat(value);
    return isNaN(n) ? 0 : n;
}

function formatLedgerAmount(value) {
    return ledgerNum(value).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

function formatLedgerDate(value) {
    if (!value) {
        return '—';
    }
    if (typeof moment !== 'undefined') {
        return moment(value).format('DD MMM YYYY, h:mm A');
    }
    var date = new Date(value);
    if (isNaN(date.getTime())) {
        return String(value);
    }
    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}
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
    if (typeof reportPageLoader === 'function') reportPageLoader(true);
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
             
            var stock = ledgerNum($('.vendor_id option:selected').attr('data-balance'));
            var balanceType;
            if (current_url == 'customer-reports') {
                balanceType = stock > 0
                    ? `<span style="color: green;"> DR</span>`
                    : `<span style="color: red;"> CR</span>`;
            } else {
                balanceType = stock > 0
                    ? `<span style="color: red;"> CR</span>`
                    : `<span style="color: green;"> DR</span>`;
            }
            $('.prod-bal-div').html(`Previous Balance : ${formatLedgerAmount(Math.abs(stock))} ${balanceType}`); 
            $('.teacher_attendance_list').empty();
            $('.teacher_attendance_list').append(`
                <div class="report-slip-shell">
                  <div class="report-slip-scroll">
                    <table class="table table-hover dt-responsive nowrap TeacherAttendanceListTable" style="width:100%;">
                        <thead>
                            <tr>
                                <th hidden>Invoice #</th>
                                <th>Invoice #</th>
                                <th>Date</th>
                                <th>Comment</th>
                                <th style="color:red">Outgoing</th>
                                <th style="color:rgb(11, 246, 11)">Incoming</th>
                                <th>Balance</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                  </div>
                  <div class="report-slip-footer"></div>
                </div>`);
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
                totalCR += ledgerNum(element['cr']);
                totalDR += ledgerNum(element['dr']);
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
                var formattedDate = formatLedgerDate(element.created_at);
                var balNum = ledgerNum(element['balance']);
                if (current_url == 'vendor-reports') {
                    var ledger_bal = balNum < 0
                        ? formatLedgerAmount(Math.abs(balNum)) + ' DR'
                        : formatLedgerAmount(balNum) + ' CR';
                } else {
                    var ledger_bal = balNum < 0
                        ? formatLedgerAmount(Math.abs(balNum)) + ' CR'
                        : formatLedgerAmount(balNum) + ' DR';
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
                  "bSort": false,
                 "bPaginate": false,
                 scrollX: true,
                 scrollY: false,
                 scrollCollapse: false,
                 autoWidth: false,
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

            $('.report-slip-footer').html(`
              <div class="ledger-grand-total-bar">
                <div class="label">Grand Total :</div>
                <div class="val">${formatLedgerAmount(totalDR)}</div>
                <div class="val">${formatLedgerAmount(totalCR)}</div>
                <div class="val grand">${final_balance}</div>
              </div>
            `);
        },
        error: function () {
            if (CurrentRef) {
                CurrentRef.attr('disabled', false);
            }
        },
        complete: function () {
            if (typeof reportPageLoader === 'function') reportPageLoader(false);
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
    var comment = '';
    if((element.invoice_comment !='' &&  element.invoice_comment != null)){
      comment  = `<span class="comment"> ${element.invoice_comment}</span>`; 
    }else if((element.comment != '' && element.comment != null)){
        comment  = `<span class="comment"> ${element.comment}</span>`; 
    }
    console.log(comment)
    var crN = ledgerNum(element.cr);
    var drN = ledgerNum(element.dr);
    var balN = ledgerNum(element.balance);
    if (crN && drN) {
        // Both CR and DR present
        // First iteration: CR present, DR skipped 
        if (balN > 0) {
            var firstBalance = balN + crN;
            var secondBalance = balN;
        } else {
            var firstBalance = (balN - drN + crN) + drN;
            var secondBalance = balN;
        }
        var firstRowHTML = `
            <tr>
                <td hidden>${element.id}</td>
                <td class="ledger-inv-cell">${inv_no ?? 'NA'}</td>
                <td class="ledger-date-cell">${formattedDate}</td> 
                <td class="ledger-comment-cell">${comment}</td> 
                <td class="ledger-amount-cell">${formatLedgerAmount(drN)}</td>
                <td class="ledger-amount-cell">0</td>
                <td class="ledger-amount-cell">${formatLedgerAmount(firstBalance)}</td>
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
                <td class="ledger-inv-cell">${inv_no  ?? 'NA'}</td>
                <td class="ledger-date-cell">${formattedDate}</td> 
                <td class="ledger-comment-cell">${comment}</td>  
                <td class="ledger-amount-cell">0</td>
                <td class="ledger-amount-cell">${formatLedgerAmount(crN)}</td>
                <td class="ledger-amount-cell">${formatLedgerAmount(secondBalance)}</td>
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
        var crValue = crN ? formatLedgerAmount(crN) : '0';
        var drValue = drN ? formatLedgerAmount(drN) : '0';
         
        var balance_text = '';
        if (balN >= 0) {
            balance_text = formatLedgerAmount(balN) + "<span style='color:red;font-size: 16px;font-weight: bold;'> DR</span>";
        } else if (balN < 0) {
            balance_text = formatLedgerAmount(Math.abs(balN)) + "<span style='color:green;font-size: 16px;font-weight: bold;'> CR </span>";
        } else {
            balance_text = '0';
        }
        var rowHTML = `
            <tr>
                <td hidden>${element.id}</td>
                <td class="ledger-inv-cell">${inv_no  ?? 'NA'}</td>
                <td class="ledger-date-cell">${formattedDate}</td> 
                 <td class="ledger-comment-cell">${comment}</td>  
                <td class="ledger-amount-cell">${drValue}</td>
                <td class="ledger-amount-cell">${crValue}</td>
                <td class="ledger-amount-cell">${balance_text}</td>
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
    var crN = ledgerNum(element.cr);
    var drN = ledgerNum(element.dr);
    var balN = ledgerNum(element.balance);
    if (crN && drN) {
        // Both CR and DR present
        // First iteration: CR present, DR skipped 

        if (balN > 0) {
            var firstBalance = balN + drN;
            var secondBalance = balN;
        } else {
            var firstBalance = (balN - drN + crN) + drN;
            var secondBalance = balN;
        }
        tableHtml(element, inv_id, inv_no, formattedDate, label, element.cr, firstBalance, "cr")
        tableHtml(element, inv_id, inv_no, formattedDate, label, element.dr, secondBalance, "dr")

       
    } else {
        if (element.trx_type == 3) {
            // Only one of CR or DR present or neither
            var crValue = crN ? formatLedgerAmount(crN) : '0';
            var drValue = drN ? formatLedgerAmount(drN) : '0';
            var balance_text = '';
            if (balN >= 0) {
                balance_text = formatLedgerAmount(balN) + "<span style='color:green;font-size: 16px;font-weight: bold;'> CR </span>";
            } else if (balN < 0) {
                balance_text = formatLedgerAmount(Math.abs(balN)) + "<span style='color:red;font-size: 16px;font-weight: bold;'> DR</span>";
            } else {
                balance_text = '0';
            }

            var rowHTML = `
            <tr>
                <td hidden>${element.id}</td>
                <td class="ledger-inv-cell">${inv_no}</td>
                <td class="ledger-date-cell">${formattedDate}</td> 
                 <td class="ledger-comment-cell"><span class="ledger-comment-text">${element.comment ?? ''}</span></td>  
                <td class="ledger-amount-cell">${drValue}</td>
                <td class="ledger-amount-cell">${crValue}</td>
                <td class="ledger-amount-cell">${balance_text}</td>
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
            var crValue = crN ? formatLedgerAmount(crN) : '0';
            var drValue = 0;
            var paidReturn = ledgerNum(element.paid_p_return_amount);

            if (drN > 0) {
                drValue = paidReturn > 0 ? formatLedgerAmount(drN - paidReturn) : formatLedgerAmount(drN);
            }
            if (balN > 0) {
                var firstBalance = balN + paidReturn;
                var secondBalance = balN;
            } else {
                var firstBalance = balN + paidReturn;
                var secondBalance = balN;
            }
            if (crN) {
                tableHtml(element, inv_id, inv_no, formattedDate, label, crValue, firstBalance, "cr")
            } else if (paidReturn > 0 && drN > 0) {
                tableHtml(element, inv_id, inv_no, formattedDate, label, drValue, firstBalance, "dr")
                tableHtml(element, inv_id, inv_no, formattedDate, label, paidReturn, secondBalance, "dr_with_payment")
            } else {
                tableHtml(element, inv_id, inv_no, formattedDate, label, drValue, secondBalance, "dr")
            }

        }
    }
}

function tableHtml(element, inv_id, inv_no, formattedDate, label, dr_cr, balance, payment_flag = null) {
    var dr_val = 0;
    var cr_val = 0;
    var balN = ledgerNum(balance);
    var balance_text = '';
    if (balN >= 0) {
        balance_text = formatLedgerAmount(balN) + "<span style='color:green;font-size: 16px;font-weight: bold;'> CR </span>";
    } else if (balN < 0) {
        balance_text = formatLedgerAmount(Math.abs(balN)) + "<span style='color:red;font-size: 16px;font-weight: bold;'> DR</span>";
    } else {
        balance_text = '0';
    }
    if (payment_flag == 'dr' || payment_flag == 'dr_with_payment') {
        dr_val = typeof dr_cr === 'number' ? formatLedgerAmount(dr_cr) : dr_cr;
    } else if (payment_flag == 'cr') {
        cr_val = typeof dr_cr === 'number' ? formatLedgerAmount(dr_cr) : dr_cr;
    }
    var RowHTML = ` <tr>
   <td hidden>${element.id}</td>
   <td class="ledger-inv-cell">${inv_no}</td>
   <td class="ledger-date-cell">${formattedDate}</td>
    <td class="ledger-comment-cell"><span class="ledger-comment-text">${element.comment ?? ''}</span></td>  
   <td class="ledger-amount-cell">${dr_val}</td>
   <td class="ledger-amount-cell">${cr_val}</td>
   <td class="ledger-amount-cell">${balance_text}</td>
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
