(function () {
    var mode = 'daily';
    var trendChart = null;
    var flowChart = null;
    var mixChart = null;
    var gaugeCharts = {};
    var loading = false;

    function money(n) {
        if (typeof addCommas === 'function') {
            return addCommas(n);
        }
        var x = Number(n) || 0;
        return x.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }

    function showLoader(on) {
        loading = !!on;
        var $loader = $('#tblLoader');
        var $page = $('#analyticsPage');
        var $content = $('#contentContainerDiv');
        if (on) {
            $loader.show();
            $page.addClass('blur-div');
            $content.addClass('blur-div');
            $('#analyticsDate, #analyticsMonth, .analytics-modes .btn').prop('disabled', true);
        } else {
            $loader.hide();
            $page.removeClass('blur-div').show();
            $content.removeClass('blur-div');
            $('#analyticsDate, #analyticsMonth, .analytics-modes .btn').prop('disabled', false);
        }
    }

    function setMode(next) {
        mode = next;
        $('.analytics-modes .btn').removeClass('active');
        $('.analytics-modes .btn[data-mode="' + mode + '"]').addClass('active');
        if (mode === 'monthly') {
            $('#dailyPickerWrap').hide();
            $('#monthlyPickerWrap').show();
            $('#trendTitle').text('Daily Sale Trend');
        } else {
            $('#dailyPickerWrap').show();
            $('#monthlyPickerWrap').hide();
            $('#trendTitle').text('Hourly Sale Trend');
        }
        loadSummary();
    }

    function buildQuery() {
        if (mode === 'monthly') {
            return {
                mode: 'monthly',
                month: $('#analyticsMonth').val() || new Date().toISOString().slice(0, 7)
            };
        }
        return {
            mode: 'daily',
            date: $('#analyticsDate').val() || new Date().toISOString().slice(0, 10)
        };
    }

    function renderKpis(kpis) {
        $('[data-kpi]').each(function () {
            var key = $(this).data('kpi');
            var val = kpis[key];
            if (key === 'invoice_count') {
                $(this).text(val == null ? '0' : val);
            } else {
                $(this).text(money(val));
            }
        });

        $('[data-kpi-change]').each(function () {
            var key = $(this).data('kpi-change');
            var pct = kpis[key];
            if (pct == null) {
                $(this).text('').removeClass('up down');
                return;
            }
            var arrow = pct > 0 ? '↑ ' : (pct < 0 ? '↓ ' : '');
            $(this).text(arrow + Math.abs(pct) + '%')
                .toggleClass('up', pct > 0)
                .toggleClass('down', pct < 0);
        });
    }

    function renderSplit(split, snapshot) {
        $('[data-split]').each(function () {
            $(this).text(money(split[$(this).data('split')]));
        });
        $('[data-snap]').each(function () {
            $(this).text(money(snapshot[$(this).data('snap')]));
        });
    }

    function gaugeOptions(value) {
        var v = Math.max(0, Math.min(100, Number(value) || 0));
        return {
            chart: {
                type: 'solidgauge',
                backgroundColor: 'transparent',
                height: 150,
                margin: [0, 0, 0, 0]
            },
            title: null,
            pane: {
                center: ['50%', '70%'],
                size: '130%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: '#eef1f5',
                    innerRadius: '70%',
                    outerRadius: '100%',
                    shape: 'arc',
                    borderWidth: 0
                }
            },
            exporting: { enabled: false },
            tooltip: { enabled: false },
            yAxis: {
                min: 0,
                max: 100,
                stops: [
                    [0.3, '#d64545'],
                    [0.55, '#c4a35a'],
                    [0.85, '#0038ba']
                ],
                lineWidth: 0,
                tickWidth: 0,
                minorTickInterval: null,
                tickAmount: 2,
                labels: { enabled: false }
            },
            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: -18,
                        borderWidth: 0,
                        useHTML: true,
                        format: '<div style="text-align:center"><span style="font-size:22px;font-family:Rationale,sans-serif;color:#0038ba;font-weight:700">{y}%</span></div>'
                    },
                    innerRadius: '70%',
                    radius: '100%'
                }
            },
            credits: { enabled: false },
            series: [{
                name: 'Score',
                data: [v]
            }]
        };
    }

    function renderGauges(performance) {
        var map = {
            profit_margin: 'gaugeProfit',
            cash_share: 'gaugeCash',
            collection: 'gaugeCollection',
            return_control: 'gaugeReturns'
        };
        (performance || []).forEach(function (item) {
            var id = map[item.key];
            if (!id || !document.getElementById(id)) return;
            if (gaugeCharts[id]) {
                gaugeCharts[id].series[0].points[0].update(Number(item.value) || 0, true);
            } else {
                gaugeCharts[id] = Highcharts.chart(id, gaugeOptions(item.value));
            }
            var $card = $('#' + id).closest('.gauge-card');
            $card.find('.gauge-label').text(item.label || '');
            $card.find('.gauge-hint').text(item.hint || '');
        });
    }

    function renderFlow(kpis, split) {
        kpis = kpis || {};
        split = split || {};
        var categories = ['Net Sales', 'Cash Recoveries', 'Purchases', 'Expense', 'Sale Returns', 'Vendor Pay'];
        var values = [
            Number(kpis.net_sales) || 0,
            Number(kpis.cash_recoveries) || 0,
            Number(kpis.purchases) || 0,
            Number(kpis.expense) || 0,
            Number(kpis.sale_returns) || 0,
            Number(split.vendor_payments) || 0
        ];
        var colors = ['#0038ba', '#1aa35c', '#c4a35a', '#d64545', '#8896a8', '#5aa6a0'];

        if (flowChart) {
            flowChart.destroy();
        }

        if (!document.getElementById('flowChart')) return;

        flowChart = Highcharts.chart('flowChart', {
            chart: { type: 'column', backgroundColor: 'transparent' },
            title: { text: null },
            xAxis: {
                categories: categories,
                labels: { style: { fontSize: '11px', color: '#6b7a90', fontWeight: '600' } },
                lineColor: '#eef1f5',
                tickLength: 0
            },
            yAxis: {
                title: { text: null },
                gridLineColor: '#eef1f5',
                labels: { style: { color: '#8896a8' } }
            },
            legend: { enabled: false },
            credits: { enabled: false },
            tooltip: {
                pointFormatter: function () {
                    return '<b>Rs. ' + money(this.y) + '</b>';
                }
            },
            plotOptions: {
                column: {
                    borderRadius: 4,
                    pointPadding: 0.15,
                    groupPadding: 0.08,
                    colorByPoint: true,
                    colors: colors
                }
            },
            series: [{
                name: 'Amount',
                data: values
            }]
        });
    }

    function renderTrend(points) {
        var categories = (points || []).map(function (p) { return p.label; });
        var values = (points || []).map(function (p) { return Number(p.value) || 0; });

        if (trendChart) {
            trendChart.destroy();
        }

        trendChart = Highcharts.chart('trendChart', {
            chart: { type: 'areaspline', backgroundColor: 'transparent' },
            title: { text: null },
            xAxis: {
                categories: categories,
                labels: { style: { fontSize: '10px', color: '#8896a8' } },
                lineColor: '#eef1f5',
                tickColor: '#eef1f5'
            },
            yAxis: {
                title: { text: null },
                gridLineColor: '#eef1f5',
                labels: { style: { color: '#8896a8' } }
            },
            legend: { enabled: false },
            credits: { enabled: false },
            tooltip: {
                pointFormatter: function () {
                    return '<b>Rs. ' + money(this.y) + '</b>';
                }
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.18,
                    marker: { radius: 3, fillColor: '#0038ba' },
                    lineWidth: 2
                }
            },
            series: [{
                name: 'Sales',
                data: values,
                color: '#0038ba',
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, 'rgba(0,56,186,0.35)'],
                        [1, 'rgba(0,56,186,0.02)']
                    ]
                }
            }]
        });
    }

    function renderMix(mix) {
        var rows = mix || [];
        var $bars = $('#mixBars');
        if (!rows.length) {
            $bars.html('<div class="text-muted">No data</div>');
        } else {
            $bars.html(rows.map(function (m) {
                return '<div class="mix-bar-row">' +
                    '<div class="mix-bar-head"><span>' + (m.name || '-') + '</span><span class="pct">' + (m.pct || 0) + '%</span></div>' +
                    '<div class="mix-bar-track"><div class="mix-bar-fill" style="width:' + (m.pct || 0) + '%"></div></div>' +
                    '<div class="mix-bar-meta"><span>Gross Sales</span><span>Rs. ' + money(m.value) + '</span></div>' +
                    '</div>';
            }).join(''));
        }

        var labels = rows.map(function (m) { return m.name; });
        var values = rows.map(function (m) { return Number(m.value) || 0; });
        var canvas = document.getElementById('mixChart');
        if (!canvas || typeof Chart === 'undefined') return;

        if (mixChart) {
            mixChart.destroy();
        }

        mixChart = new Chart(canvas.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: labels.length ? labels : ['No data'],
                datasets: [{
                    data: values.length ? values : [1],
                    backgroundColor: ['#0038ba', '#1e54d3', '#3d7ea6', '#5aa6a0', '#c4a35a', '#d64545', '#6b7a90', '#243447'],
                    borderWidth: 0
                }]
            },
            options: {
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (ctx) {
                                return ' ' + (ctx.label || '') + ': Rs. ' + money(ctx.raw);
                            }
                        }
                    }
                },
                cutout: '62%'
            }
        });
    }

    function renderProductCards(rows) {
        var $wrap = $('#topProductCards');
        if (!rows || !rows.length) {
            $wrap.html('<div class="text-muted">No products in this period</div>');
            return;
        }
        $wrap.html(rows.slice(0, 8).map(function (p) {
            return '<div class="product-card-an">' +
                '<div class="pc-name">' + (p.name || '-') + '</div>' +
                '<div class="pc-amount">' + money(p.amount) + '</div>' +
                '<div class="pc-qty">' + money(p.qty) + ' Qty · Sales</div>' +
                '</div>';
        }).join(''));
    }

    function renderTable(selector, rows, columns) {
        var $body = $(selector);
        if (!rows || !rows.length) {
            $body.html('<tr><td colspan="' + columns.length + '">No data</td></tr>');
            return;
        }
        var html = rows.map(function (row) {
            var cells = columns.map(function (col) {
                var val = row[col.key];
                if (col.money) val = money(val);
                return '<td class="' + (col.num ? 'num' : '') + '">' + (val == null ? '-' : val) + '</td>';
            }).join('');
            return '<tr>' + cells + '</tr>';
        }).join('');
        $body.html(html);
    }

    function loadSummary() {
        if (loading) return;
        showLoader(true);
        $.ajax({
            url: '/analytics/summary',
            method: 'GET',
            data: buildQuery(),
            success: function (res) {
                if (res.meta) {
                    $('#metaCompany').text(res.meta.company_name || '-');
                    $('#metaUser').text(res.meta.user_name || '-');
                    $('#periodLabel').text(res.meta.label || '');
                }
                renderKpis(res.kpis || {});
                renderSplit(res.split || {}, res.snapshot || {});
                renderGauges(res.performance || []);
                renderTrend(res.trend || []);
                renderFlow(res.kpis || {}, res.split || {});
                renderMix(res.mix || []);
                renderProductCards(res.top_products || []);
                renderTable('#topCustomersBody', res.top_customers, [
                    { key: 'name' },
                    { key: 'invoices', num: true },
                    { key: 'amount', num: true, money: true }
                ]);
                renderTable('#topReceivablesBody', res.top_receivables, [
                    { key: 'customer_name' },
                    { key: 'balance', num: true, money: true }
                ]);
            },
            error: function () {
                $('#notifDiv').fadeIn().css('background', 'red').text('Failed to load analytics');
                setTimeout(function () { $('#notifDiv').fadeOut(); }, 3000);
            },
            complete: function () {
                showLoader(false);
            }
        });
    }

    $(document).ready(function () {
        $('.analytics-modes').on('click', '.btn', function () {
            var next = $(this).data('mode');
            if (next && next !== mode) setMode(next);
        });
        $('#analyticsDate').on('change', function () {
            if (mode === 'daily') loadSummary();
        });
        $('#analyticsMonth').on('change', function () {
            if (mode === 'monthly') loadSummary();
        });
        setMode('daily');
        setTimeout(function () {
            if (loading) {
                $('#tblLoader').show();
                $('#analyticsPage').addClass('blur-div');
            }
        }, 1600);
    });
})();
