$('#productlist01').click(function () {
    if ($('#product-cl-sec').hasClass('active')) {
        closeSidebar()
    } else {
        openSidebar()
    }
});
$("#pl-close, .close-sidebar, .overlay, .pl-close").on("click", function () {
    closeSidebar();
});

$(document).on("click", ".closeProductAddSidebar", function () {
    closeSidebar();
});

$(document).on("click", "#SN-close, .overlay-blure", function (e) {

    closeSubNav();
});

$(document).on("click", "#SN-close, .overlay-for-sidebar", function () {
    closeSidebar();
});

function closeSidebar() {
    $(".customer_form_div").removeClass("active");
    $(".poc_form_div").removeClass("active");
    $("#product-cl-sec").removeClass("active");
    $("#product-add").removeClass("active");
    $("#performaPreferences").removeClass("active");
    $(".overlay").removeClass("active");
    //$("body").toggleClass("no-scroll");
    $("#contentContainerDiv").removeClass("blur-div");
    $(".sticky-footer").removeClass("blur-div");
    $(".overlay-for-sidebar").css("display", "none");
    $("body").removeClass("no-scroll");
}

function openSidebar(element = "#product-cl-sec") {
    $(element).addClass("active");
    $(".overlay").addClass("active");
    $(".collapse.in").toggleClass("in");
    $("a[aria-expanded=true]").attr("aria-expanded", "false");
    $("body").toggleClass("no-scroll");
    $("#contentContainerDiv").addClass("blur-div");
    $(".sticky-footer").addClass("blur-div");
    $(".overlay-for-sidebar").css("display", "block");
}

var currentDate = new Date();

var startDate = new Date();
startDate.setMonth(currentDate.getMonth() - 1);

var formattedStartDate = startDate.toISOString().split('T')[0];
var formattedEndDate = currentDate.toISOString().split('T')[0];

$('.start_date').val(formattedStartDate);
$('.end_date').val(formattedEndDate);


$('#add-product').on('focus', function () {
    $(this).css('background', '#152e4d ');
});
$('#add-product').on('blur', function () {
    $(this).css('background', 'green');
});
$(document).on('mouseenter', '.show_purchase', function () {
    $('.pp').show();
}).on('mouseleave', '.show_purchase', function () {
    $('.pp').hide();
});

/**
 * Safe number for report totals.
 * Production MySQL/PDO often returns DECIMAL as strings in JSON.
 * Without this, JS `+=` concatenates ("4"+"8"="48") instead of summing.
 */
function toNum(value) {
    if (value === null || value === undefined || value === '') {
        return 0;
    }
    if (typeof value === 'string') {
        value = value.replace(/,/g, '').trim();
    }
    var n = parseFloat(value);
    return isNaN(n) || !isFinite(n) ? 0 : n;
}

function addCommas(nStr) {
    var n = toNum(nStr);
    // Keep money/qty readable (avoid long float tails like 0.914255049)
    n = Math.round(n * 10000) / 10000;

    let x = n.toString().split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';

    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    if (x2 === '.00') {
      x2 = '';
    }

    return x1 + x2;
}

/**
 * Shared Excel/PDF export buttons for ledger DataTables.
 * - Header: company brand (like invoice) + exported-by user
 * - Filename includes user name
 * - Skips hidden columns and any "Action" column (index may differ per table)
 */
function ledgerExportMessageTop() {
    var meta = window.EXPORT_META || {};
    var lines = [];
    if (meta.companyName) lines.push(meta.companyName);
    if (meta.companyAddress) lines.push(meta.companyAddress);
    if (meta.companyPhone) lines.push('Phone: ' + meta.companyPhone);
    if (meta.userName) lines.push('Exported by: ' + meta.userName);
    return lines.join('\n');
}

function ledgerExportFilename(title) {
    var meta = window.EXPORT_META || {};
    var user = (meta.userName || 'user').toString().replace(/[^\w\-]+/g, '_');
    var safeTitle = (title || 'Report').toString().replace(/[^\w\-]+/g, '_');
    var day = new Date().toISOString().slice(0, 10);
    return safeTitle + '_' + user + '_' + day;
}

function ledgerExportColumns(idx, data, node) {
    var $th = $(node);
    if ($th.attr('hidden') !== undefined || $th.prop('hidden')) {
        return false;
    }
    var label = $.trim($th.text()).toLowerCase();
    if (label === 'action') {
        return false;
    }
    return true;
}

function ledgerExportButtons(title) {
    var messageTop = ledgerExportMessageTop();
    var filename = ledgerExportFilename(title);
    var meta = window.EXPORT_META || {};

    var commonExport = {
        columns: ledgerExportColumns,
        format: {
            body: function (innerHtml, rowIdx, colIdx, node) {
                return node ? node.textContent : innerHtml;
            }
        }
    };

    return [
        {
            extend: 'excelHtml5',
            text: 'Excel',
            title: title,
            filename: filename,
            messageTop: messageTop,
            exportOptions: commonExport
        },
        {
            extend: 'pdfHtml5',
            text: 'PDF',
            title: title,
            filename: filename,
            orientation: 'landscape',
            pageSize: 'A4',
            exportOptions: commonExport,
            customize: function (doc) {
                var headerLines = [];
                if (meta.companyName) {
                    headerLines.push({ text: meta.companyName, bold: true, fontSize: 16, alignment: 'center' });
                }
                if (meta.companyAddress) {
                    headerLines.push({ text: meta.companyAddress, fontSize: 9, alignment: 'center', margin: [0, 2, 0, 0] });
                }
                if (meta.companyPhone) {
                    headerLines.push({ text: 'Phone: ' + meta.companyPhone, fontSize: 9, alignment: 'center', margin: [0, 1, 0, 0] });
                }
                headerLines.push({ text: title, bold: true, fontSize: 12, alignment: 'center', margin: [0, 8, 0, 0] });
                if (meta.userName) {
                    headerLines.push({ text: 'Exported by: ' + meta.userName, fontSize: 9, alignment: 'center', margin: [0, 2, 0, 0] });
                }

                doc.content.splice(0, 1, {
                    stack: headerLines,
                    margin: [0, 0, 0, 12]
                });

                doc.pageMargins = [20, 20, 20, 20];
                if (doc.styles && doc.styles.tableHeader) {
                    doc.styles.tableHeader.fillColor = '#E6E6E6';
                    doc.styles.tableHeader.color = 'black';
                    doc.styles.tableHeader.alignment = 'left';
                }
                var tableNode = doc.content.find(function (c) { return c.table; });
                if (tableNode) {
                    tableNode.layout = {
                        hLineWidth: function () { return 0.5; },
                        vLineWidth: function () { return 0.5; },
                        hLineColor: function () { return '#E6E6E6'; },
                        vLineColor: function () { return '#E6E6E6'; },
                        paddingLeft: function () { return 3; },
                        paddingRight: function () { return 3; },
                        paddingTop: function () { return 4; },
                        paddingBottom: function () { return 4; }
                    };
                }
            }
        }
    ];
}
 

$(document).on('click', '.btn-invoice-delete', function() {
    deleteRef       = $(this);
    var id          = deleteRef.attr('id');
    var route       = deleteRef.attr('route');
    var invoice_for = deleteRef.attr('invoice-for');
    var id          = deleteRef.attr('id');
    var customer_id = deleteRef.attr('data-customer-id');
console.log(customer_id)
    swal({
            title: "Are you sure?",
            // text    : "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => { 
            deleteRef.attr('disabled', 'disabled');
            deleteRef.text('Processing...');
            if (willDelete) {
                $.ajax({
                    type: 'delete',
                    url: route,
                    data: {
                        _token      : $('meta[name="csrf_token"]').attr('content'),
                        id          : id,
                        route       : route,
                        invoice_for : invoice_for,
                        customer_id : customer_id
                    },
                    success: function(r) {
                        if (r.status == 'success') {
                            deleteRef.closest('tr').remove();
                            $('#notifDiv').fadeIn().css('background', 'green').text('Invoice deleted Successfully !');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);
                        } else {
                            $('#notifDiv').fadeIn().css('background', 'red').text('Not deleted at this moment !');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);
                        }
                    }
                })
            }
        });

})