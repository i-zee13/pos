var deleteRef = '';
var batches = [];
var sessions = [];
var CurrentRef = '';
var segments = location.href.split('/');
var allProductOptions = null;

function cacheProductOptions() {
    if (allProductOptions !== null) return;
    allProductOptions = $('.product_id').first().find('option').clone();
}

function filterProductsByCompany(companyId) {
    cacheProductOptions();
    var $product = $('.product_id').first();
    var current = $product.val();
    $product.empty();
    allProductOptions.each(function () {
        var $opt = $(this);
        var cid = $opt.data('company-id');
        if ($opt.val() === '' || !companyId || String(cid) === String(companyId)) {
            $product.append($opt.clone());
        }
    });
    if (current && $product.find('option[value="' + current + '"]').length) {
        $product.val(current);
    } else {
        $product.val('');
    }
    if ($product.hasClass('select2-hidden-accessible')) {
        $product.trigger('change.select2');
    }
}

function setAvgConsoleHtml(html) {
    $('#avgConsoleBody').html(html || '<p class="avg-hint">No breakdown available.</p>');
}

function setAvgConsoleMessage(msg) {
    setAvgConsoleHtml('<p class="avg-hint">' + msg + '</p>');
}

function fmtMoney(n) {
    var v = toNum(n);
    return addCommas(Number.isInteger(v) ? v : parseFloat(v.toFixed(4)));
}

function buildAvgConsoleHtml(records, meta, mode) {
    meta = meta || {};
    records = records || [];
    var isAvg = String(mode) === '1';
    var html = '';

    html += '<div class="avg-summary">';
    html += '<strong>Mode:</strong> ' + (isAvg ? 'By Average (purchase-weighted running avg — updates only on STOCK IN)' : 'By Last Price') + '<br>';
    html += '<strong>Products:</strong> ' + (meta.total_products != null ? meta.total_products : records.length);
    html += ' &nbsp;|&nbsp; <strong>Open Batches:</strong> ' + (meta.total_batches != null ? meta.total_batches : 0);
    html += '</div>';

    if (!records.length) {
        html += '<p class="avg-hint">Is filter pe koi stock record nahi mila.</p>';
        return html;
    }

    records.forEach(function (row, idx) {
        var name = (row.product_name || 'Product') + ' <span style="opacity:.75;font-weight:500">(' + (row.company_name || '') + ')</span>';
        var balance = toNum(row.balance);
        var batchList = row.batches || [];
        var cost = isAvg
            ? toNum(row.computed_avg != null ? row.computed_avg : row.ttl_avg_cost)
            : toNum(row.purchase_price);
        var value = cost * balance;
        var displayAvg = cost;

        html += '<div class="avg-product-block">';
        html += '<div class="avg-product-head">';
        html += '<div class="avg-product-title">' + (idx + 1) + '. ' + name + '</div>';
        html += '<div class="avg-rate-badge" data-avg-slot="' + idx + '"><span class="avg-rate-label">Avg Rate</span><span class="avg-rate-value">' + fmtMoney(displayAvg) + '</span></div>';
        html += '</div>';
        html += '<div class="avg-product-meta">Stock Qty (system): <strong>' + fmtMoney(balance) + '</strong>';
        html += ' &nbsp;|&nbsp; Open Batches: <strong>' + (row.batch_count != null ? row.batch_count : batchList.length) + '</strong></div>';

        if (!isAvg) {
            html += '<div class="avg-formula-note">Last purchase price use ho rahi hai (average nahi).</div>';
            html += '<div class="avg-result-box avg-result-flex">';
            html += '<div class="avg-result-left">';
            html += 'Unit Price = <span class="avg-big">' + fmtMoney(cost) + '</span><br>';
            html += 'Stock Value = ' + fmtMoney(cost) + ' × ' + fmtMoney(balance) + ' = <span class="avg-big">' + fmtMoney(value) + '</span>';
            html += '</div>';
            html += '<div class="avg-rate-badge large"><span class="avg-rate-label">Avg Rate</span><span class="avg-rate-value">' + fmtMoney(cost) + '</span></div>';
            html += '</div></div>';
            return;
        }

        html += '<div class="avg-formula-note"><strong>Formula (purchase IN only):</strong> (old_avg × old_qty + purchase_price × purchase_qty) ÷ (old_qty + purchase_qty). Sale pe avg change nahi hoti.</div>';

        if (!batchList.length) {
            html += '<div class="avg-empty">Open batch nahi — stored avg = <strong>' + fmtMoney(displayAvg) + '</strong>.</div>';
            html += '<div class="avg-result-box avg-result-flex">';
            html += '<div class="avg-result-left">Stock Value = ' + fmtMoney(displayAvg) + ' × ' + fmtMoney(balance) + ' = <span class="avg-big">' + fmtMoney(value) + '</span></div>';
            html += '<div class="avg-rate-badge large"><span class="avg-rate-label">Avg Rate</span><span class="avg-rate-value">' + fmtMoney(displayAvg) + '</span></div>';
            html += '</div></div>';
            return;
        }

        var sumQty = 0;
        var sumCost = 0;
        html += '<table class="avg-batch-table"><thead><tr>';
        html += '<th>#</th><th>Expiry Date</th><th>Qty</th><th>Rate (per unit)</th><th>Batch Value (Rate × Qty)</th>';
        html += '</tr></thead><tbody>';

        batchList.forEach(function (b, i) {
            var qty = toNum(b.batch_wise_balance);
            var rate = toNum(b.unit_cost_price);
            var line = toNum(b.line_cost != null ? b.line_cost : (rate * qty));
            sumQty += qty;
            sumCost += line;
            var exp = (b.expiry_date && b.expiry_date !== 'NO-EXPIRY') ? b.expiry_date : 'No Expiry';
            html += '<tr>';
            html += '<td>Batch ' + (i + 1) + '</td>';
            html += '<td>' + exp + '</td>';
            html += '<td>' + fmtMoney(qty) + '</td>';
            html += '<td>' + fmtMoney(rate) + '</td>';
            html += '<td><strong>' + fmtMoney(line) + '</strong></td>';
            html += '</tr>';
        });

        html += '</tbody><tfoot><tr>';
        html += '<td colspan="2">TOTAL (batches)</td>';
        html += '<td>' + fmtMoney(sumQty) + '</td>';
        html += '<td></td>';
        html += '<td>' + fmtMoney(sumCost) + '</td>';
        html += '</tr></tfoot></table>';

        var qtyDiff = Math.abs(sumQty - balance);
        if (qtyDiff > 0.02) {
            html += '<div class="avg-mismatch">';
            html += '<strong>MISMATCH:</strong> Batches total = <strong>' + fmtMoney(sumQty) + '</strong>';
            html += ' but Stock Qty = <strong>' + fmtMoney(balance) + '</strong>';
            html += ' (farq = ' + fmtMoney(sumQty - balance) + '). ';
            html += 'Fix: <code>php artisan stock:rebuild-batches --product=' + (row.product_id || '') + '</code>';
            html += '</div>';
        }

        var batchAvg = sumQty > 0 ? sumCost / sumQty : 0;
        if (batchAvg > 0 && Math.abs(batchAvg - displayAvg) > 0.0001) {
            html += '<div class="avg-mismatch">';
            html += 'Batch Σ-avg = <strong>' + fmtMoney(batchAvg) + '</strong> (info only). ';
            html += 'Stored avg = <strong>' + fmtMoney(displayAvg) + '</strong> — sale ke baad farq normal hai jab tak naya purchase na aaye.';
            html += '</div>';
        }

        html += '<div class="avg-result-box avg-result-flex">';
        html += '<div class="avg-result-left">';
        html += 'Stored Avg Rate = <span class="avg-big">' + fmtMoney(displayAvg) + '</span><br>';
        html += 'Stock Value = ' + fmtMoney(displayAvg) + ' × ' + fmtMoney(balance) + ' = <span class="avg-big">' + fmtMoney(value) + '</span>';
        html += '</div>';
        html += '<div class="avg-rate-badge large"><span class="avg-rate-label">Avg Rate</span><span class="avg-rate-value">' + fmtMoney(displayAvg) + '</span></div>';
        html += '</div></div>';
    });

    return html;
}

function openAvgConsole() {
    $('#avgFormulaConsole').addClass('open').attr('aria-hidden', 'false');
    $('#avgConsoleToggle').addClass('active');
}

function closeAvgConsole() {
    $('#avgFormulaConsole').removeClass('open').attr('aria-hidden', 'true');
    $('#avgConsoleToggle').removeClass('active');
}

function toggleAvgConsole() {
    if ($('#avgFormulaConsole').hasClass('open')) {
        closeAvgConsole();
    } else {
        openAvgConsole();
    }
}

$(document).on('click', '#avgConsoleToggle', toggleAvgConsole);
$(document).on('click', '#avgConsoleClose', closeAvgConsole);

(function initAvgConsoleResize() {
    var $panel = $('#avgFormulaConsole');
    var $handle = $('#avgConsoleResize');
    if (!$panel.length || !$handle.length) return;

    var dragging = false;
    var minH = 160;
    var maxRatio = 0.92;

    function applyHeight(px) {
        var maxH = Math.floor(window.innerHeight * maxRatio);
        var h = Math.max(minH, Math.min(maxH, px));
        $panel.css('height', h + 'px');
        try { localStorage.setItem('avgConsoleHeight', String(h)); } catch (e) {}
    }

    function restoreHeight() {
        var saved = null;
        try { saved = localStorage.getItem('avgConsoleHeight'); } catch (e) {}
        if (saved) {
            applyHeight(parseInt(saved, 10));
        }
    }

    $handle.on('mousedown touchstart', function (e) {
        if (!$panel.hasClass('open')) return;
        dragging = true;
        $panel.addClass('resizing');
        e.preventDefault();
    });

    $(document).on('mousemove touchmove', function (e) {
        if (!dragging) return;
        var clientY = e.type.indexOf('touch') === 0
            ? (e.originalEvent.touches[0] && e.originalEvent.touches[0].clientY)
            : e.clientY;
        if (clientY == null) return;
        applyHeight(window.innerHeight - clientY);
    });

    $(document).on('mouseup touchend touchcancel', function () {
        if (!dragging) return;
        dragging = false;
        $panel.removeClass('resizing');
    });

    restoreHeight();
    var _open = openAvgConsole;
    openAvgConsole = function () {
        _open();
        restoreHeight();
    };
})();

$('.search-btn').on('click', function () {
    var start_date = $('.start_date').val();
    var end_date = $('.end_date').val();
    if (start_date != '' && end_date == '') {
        $('#notifDiv').fadeIn().css('background', 'red').text('End Date should not be Empty').focus();
        $('.end_date').focus();
        setTimeout(function () {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    if (end_date != '' && start_date == '') {
        $('#notifDiv').fadeIn().css('background', 'red').text('Start Date should not be Empty');
        $('.start_date').focus();
        setTimeout(function () {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    // Company alone is enough — shows all products of that company
    if ($('.company_id').val() == 0 && $('.product_id').val() == 0 && $('.expiry-select').val() == '') {
        $('#notifDiv').fadeIn().css('background', 'red').text('Please Select Company/Product First.');
        setTimeout(function () {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    CurrentRef = $(this);
    CurrentRef.attr('disabled', 'disabled');
    url = '/fetch-stock-value-report';
    $("#search-form").ajaxSubmit({
        type: 'POST',
        url: url,
        data: {
            _token: $('meta[name="csrf_token"]').attr('content'),
            current_url: segments[3]
        },
        success: function success(response) {
            CurrentRef.attr('disabled', false);

            var filter_selected = $('.filter_by_value').val();
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
                      <th>Unit Cost</th>
                      <th>Batches</th>
                      <th>QTY</th>
                      <th>Balance</th>
                  </tr>
              </thead><tbody>
          </tbody>
          </table>`);
            $('.TeacherAttendanceListTable tbody').empty();
            if (!response.records || response.records.length == 0) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('No data available');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
            let total_balance = 0;
            var last_balance = 0;
            var ttl_qty_purchase = 0;
            (response.records || []).forEach((element, key) => {
                var cost = 0;
                var amount = 0;
                if (filter_selected == 1) {
                    // Prefer live computed avg from API when present
                    cost = toNum(element.computed_avg != null ? element.computed_avg : element.ttl_avg_cost);
                    amount = cost * toNum(element.balance);
                } else {
                    amount = toNum(element.purchase_price) * toNum(element.balance);
                    cost = toNum(element.purchase_price);
                }
                last_balance += toNum(amount);
                total_balance += toNum(element['balance']);
                ttl_qty_purchase += toNum(element.qty);
                var balance = toNum(element.balance);
                var batchCount = element.batch_count != null ? element.batch_count : 0;
                $('.TeacherAttendanceListTable tbody').append(`
              <tr>
                  <td hidden>${element['id'] || element['vs_id'] || ''}</td>
                  <td>${key+1}</td>
                  <td>${element['company_name'] }</td>
                  <td>${element['product_name'] }</td>
                  <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">${cost ? addCommas(cost) : 0}</td>
                  <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">${batchCount}</td>
                  <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">${addCommas(balance)}</td>
                  <td style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">${addCommas(amount)}</td>
              </tr>`);
            });
            $('.TeacherAttendanceListTable tbody').append(`
              <tr style="background: #152e4d;border: solid 1px #dbdbdb;color: white">
                  <td class="font18" align="right" ></td>
                  <td class="font18" align="center" colspan="4">Grand Total :</td>
                  <td class="totalNo">
                      <span class="grand-total" style="font-family: 'Rationale', sans-serif !important;font-size: 25px;">${addCommas(total_balance)}</span>
                  </td>
                  <td class="totalNo">
                      <span class="grand-total" style="font-family: 'Rationale', sans-serif !important;font-size: 25px;color:#7CFFB2;">${addCommas(last_balance)}</span>
                  </td>
              </tr>
          `);
            $('.TeacherAttendanceListTable').fadeIn();
            $('.loader').hide();

            var meta = response.meta || {};
            $('.ttl_stock_in_hand').html(last_balance ? '<span>Rs. </span>' + addCommas(last_balance) : '<span>Rs. </span>' + 0);
            $('.ttl_products').html(meta.total_products != null ? addCommas(meta.total_products) : (response.records ? response.records.length : 0));
            $('.ttl_batches').html(meta.total_batches != null ? addCommas(meta.total_batches) : 0);

            setAvgConsoleHtml(buildAvgConsoleHtml(response.records || [], meta, filter_selected));
            if (filter_selected == 1) {
                openAvgConsole();
            }

            var title = '';
            if (segments[3] == 'customer-reports') {
                title = 'Customer Report';
            } else {
                title = 'Vendor Report';
            }
            if ($.fn.DataTable.isDataTable(".TeacherAttendanceListTable")) {
                $('.TeacherAttendanceListTable').DataTable().clear().destroy();
            }
            var table = $('.TeacherAttendanceListTable').DataTable({
                "bSort": false,
                "bPaginate": false,
                scrollX: false,
                scrollY: '400px',
                scrollCollapse: true,
                dom: 'Bfrtip',
                buttons: [{
                        extend: 'pdfHtml5',
                        title: `Stock Report`,
                        orientation: 'landscape',
                        header: true,
                        exportOptions: {
                            alignment: 'left',
                        },
                        customize: function (doc) {
                            doc.content.splice(0, 1, {
                                text: [{
                                        text: `Stock Report`,
                                        bold: true,
                                        fontSize: 14,
                                        alignment: 'left'
                                    },
                                ],
                                margin: [0, 0, 0, 12],
                            });
                            doc.pageMargins = [20, 12, 20, 12];
                            doc.styles.tableHeader.fillColor = "#E6E6E6";
                            doc.styles.tableFooter.fillColor = "#E6E6E6";
                            doc.styles.tableHeader.color = "black";
                            doc.styles.tableHeader.alignment = "left";
                            doc.styles.title.alignment = "left";
                            doc.content[1].table.widths = 'auto';
                            var objLayout = {};
                            objLayout['hLineWidth'] = function (i) {
                                return 0.5;
                            };
                            objLayout['vLineWidth'] = function (i) {
                                return 0.5;
                            };
                            objLayout['hLineColor'] = function (i) {
                                return '#E6E6E6';
                            };
                            objLayout['vLineColor'] = function (i) {
                                return '#E6E6E6';
                            };
                            objLayout['paddingLeft'] = function (i) {
                                return 3;
                            };
                            objLayout['paddingRight'] = function (i) {
                                return 3;
                            };
                            objLayout['paddingTop'] = function (i) {
                                return 4;
                            };
                            objLayout['paddingBottom'] = function (i) {
                                return 4;
                            };
                            doc.content[1].layout = objLayout;

                            doc.content[1].table.body.forEach((element) => {
                                element.forEach((el) => {
                                    element.forEach((cell) => {
                                        cell.fillColor = 'white';
                                        cell.fontSize = '9';
                                    })
                                })
                            })
                            doc.content[1].table.body.forEach((element) => {
                                element.forEach((el) => {
                                    if (el.text == "Total") {
                                        element.forEach((cell) => {
                                            cell.fillColor = '#F2F2F2';
                                            cell.fontSize = '9';
                                            cell.bold = true;
                                        })
                                    }
                                })
                            })

                        }
                    },
                    {
                        title: 'Stock Report',
                        extend: 'excelHtml5',
                        exportOptions: {}
                    }, {
                        extend: 'print',
                        text: 'Print',
                        title: title,
                        exportOptions: {
                            format: {
                                body: function body(innerHtml, rowIdx, colIdx, node) {
                                    return node.textContent;
                                }
                            }
                        },
                        customize: function customize(win) {
                            $(win.document.body).find('h1').text(title);
                            var date = new Date().toLocaleString();
                            $(win.document.body).append('<div style="text-align:center;font-size:10px;">' + date + '</div>');
                            $(win.document.body).find('table').removeClass('display').addClass('table').css('font-size', 'inherit');
                        }
                    }
                ]
            });
        },
        error: function () {
            CurrentRef.attr('disabled', false);
            $('.loader').hide();
            setAvgConsoleMessage('Request failed. Please try Search again.');
            openAvgConsole();
        }
    });
});

$('.company_id').on('change', function () {
    var company_id = $(this).val();
    filterProductsByCompany(company_id);

    var batch = batches.filter(function (x) {
        return x.company_id == company_id;
    });
    if (batch) {
        $('.batch_id').empty();
        $('.batch_id').append("<option value=\"\">Select Batch Code</option>");
        $('.session_id').empty();
        $('.session_id').append("<option value=\"\">Select Session Code</option>");
        batch.forEach(function (data) {
            $('.batch_id').append("<option value=\"".concat(data.id, "\" >").concat(data.batch_code, "</option>"));
        });
    }
});

$('.reset-btn').on('click', function () {
    $('.company_id,.expiry-select,.product_id').val('').trigger('change');
    filterProductsByCompany('');
    $('#search-form')[0].reset();
    $('.ttl_stock_in_hand').html('<span>Rs. </span>0');
    $('.ttl_products').html('0');
    $('.ttl_batches').html('0');
    setAvgConsoleMessage('Company / Product select karke <strong>By Average</strong> + Search karen — yahan har product ka batch-wise hisaab table mein dikhega.');
    closeAvgConsole();
    $('.teacher_attendance_list').empty();
    $('.teacher_attendance_list').append("\n            <div class=\"col-12 pb-10\">\n            <div class=\"no-info\"> <div class=\"m-auto\"><strong>Please Filter Your Stock Record !</strong></div>\n            </div>\n        </div>\n        ");
});

function addCommas(nStr) {
    nStr += "";
    x = nStr.split(".");
    x1 = x[0];
    x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
}

function toNum(v) {
    if (v === null || v === undefined || v === '') return 0;
    var n = parseFloat(String(v).replace(/,/g, ''));
    return isNaN(n) ? 0 : n;
}
