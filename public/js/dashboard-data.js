//var ctx = document.getElementById("myChart").getContext('2d');
//var myChart = new Chart(ctx, {
//   options:{
// 
//      legend: { display: false },
//                scales: {
//                    yAxes: [{
//                        display: false,
//                        gridLines: {
//                            color: "#eef2f9",
//                            drawBorder: false,
//                            offsetGridLines: true,
//                            drawTicks: false
//                        },
//                        ticks: {
//                            display: false,
//                        },
//                    }],
//                    xAxes: [{
//                        barPercentage: 1,
//                        categoryPercentage: 1,
//                        barThickness: 10,
//                        maxBarThickness: 10,
//                        gridLines: {
//                            display:false,
//                            drawBorder: false,
//                        },ticks: {
//                            display:false
//                        },
//
//                    }]
//                },
//	      },
//						
// type: 'bar',
//  data: {
//    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
//    datasets: [{
//      label: 'Sales',
//      data: [12, 19, 3, 17, 28, 24, 7, 15, 30, 25, 11, 45],
//      backgroundColor: "#040725"   
//    }]
//  }
//});			
//			


$(document).ready(function() {

    $("#datepicker1").datepicker({
        format: "yyyy-mm-dd"
    });
    $("#datepicker2").datepicker({
        format: "yyyy-mm-dd"
    });
    $(".start_date").datepicker({
        format: "yyyy-mm-dd"
    });
    $(".end_date").datepicker({
        format: "yyyy-mm-dd"
    });


    $(document).on('click', '.open_report_bar', function() {
        fetchReportingData(location.href.split('/')[5].replace('#', ''), $('#reporting_filter').val());
    });

    $(document).on('change', '#reporting_filter', function() {
        if ($(this).val() != 4) {
            $('.selectCustom_date_div').hide();
            $('.end_date').val() == '';
            $('.start_date').val() == '';
            fetchReportingData(location.href.split('/')[5].replace('#', ''), $(this).val());
        } else {
            $('.selectCustom_date_div').css('display', 'flex');
        }
    });

    $(document).on('change', '.start_date', function() {
        if ($('.end_date').val() != '') {
            fetchReportingData(location.href.split('/')[5].replace('#', ''), $('#reporting_filter').val(), $(this).val(), $('.end_date').val());
        }
    });
    $(document).on('change', '.end_date', function() {
        if ($('.start_date').val() != '') {
            fetchReportingData(location.href.split('/')[5].replace('#', ''), $('#reporting_filter').val(), $('.start_date').val(), $(this).val());
        }
    });

});



function legendClickCallback(event) {
    event = event || window.event;

    var target = event.target || event.srcElement;
    while (target.nodeName !== 'LI') {
        target = target.parentElement;
    }
    var parent = target.parentElement;
    var chartId = parseInt(parent.classList[0].split("-")[0], 10);
    var chart = Chart.instances[chartId];
    var index = Array.prototype.slice.call(parent.children).indexOf(target);
    var meta = chart.getDatasetMeta(0);
    console.log(index);
    var item = meta.data[index];

    if (item.hidden === null || item.hidden === false) {
        item.hidden = true;
        target.classList.add('hidden');
    } else {
        target.classList.remove('hidden');
        item.hidden = null;
    }
    chart.update();
}

function fetchReportingData(id, filter = null, start_date = null, end_date = null) {
    $('.total_revenue_report').text('Loading...');
    $('.current_month_rev_report').text('Loading...');
    $('.avg_rev_quarter_report').text('Loading...');
    $('.outstanding_payment_report').text('Loading...');
    $('.avg_payment_day_report').text('Loading...');
    $('.last_payment_date_report').text('Loading...');
    $('.last_payment_report').text('Loading...');
    $('.total_payments_report').text('Loading...');
    $('.total_orders_report').text('Loading...');
    $('.completed_orders_report').text('Loading...');
    $('.pending_orders_report').text('Loading...');
    $('.avg_order_val_report').text('Loading...');
    $('.avg_pro_order_report').text('Loading...');
    $('.avg_qty_order_report').text('Loading...');
    $('.current_month_orders_report').text('Loading...');
    $('.dispatched_orders_report').text('Loading...');
    $('.avg_fulfiltime_order_report').text('Loading...');
    $.ajax({
        type: 'GET',
        url: '/reporting/' + id,
        data: {
            filter: filter,
            start_date: start_date,
            end_date: end_date
        },
        success: function(response) {
            var response = JSON.parse(response);

            var avg_rev_per_quarter = (((response.customer_report.q1 ? parseFloat(response.customer_report.q1) : 0) + (response.customer_report.q2 ? parseFloat(response.customer_report.q2) : 0) + (response.customer_report.q3 ? parseFloat(response.customer_report.q3) : 0) + (response.customer_report.q4 ? parseFloat(response.customer_report.q4) : 0)) / 4);

            $('.total_revenue_report').text("PKR " + (response.customer_report.total_revenue ? addCommas(response.customer_report.total_revenue) : 0));
            $('.current_month_rev_report').text("PKR " + addCommas(Math.round(response.customer_report.current_month_revenue ? response.customer_report.current_month_revenue : 0)));
            $('.avg_rev_quarter_report').text("PKR " + addCommas(Math.round(avg_rev_per_quarter)));


            $('.outstanding_payment_report').text("PKR " + addCommas(Math.round(parseFloat(response.customer_report.total_revenue ? response.customer_report.total_revenue : 0) - parseFloat((response.customer_report.total_paid_amount ? response.customer_report.total_paid_amount : 0)))));

            $('.avg_payment_day_report').text("PKR " + Math.round(response.avg_payment_per_day));

            $('.last_payment_date_report').text("PKR " + response.customer_report.last_payment_date ? response.customer_report.last_payment_date : 0);
            $('.last_payment_report').text("PKR " + addCommas(Math.round(response.customer_report.last_payment ? response.customer_report.last_payment : 0)));

            $('.total_payments_report').text(addCommas(response.customer_report.total_orders));

            $('.total_orders_report').text(addCommas(response.customer_report.total_orders));
            $('.completed_orders_report').text(addCommas(response.customer_report.completed_orders));
            $('.pending_orders_report').text(addCommas(response.customer_report.pending_orders));
            $('.avg_order_val_report').text("PKR " + (response.customer_report.overall_avg_revenue ? addCommas(Math.round(response.customer_report.overall_avg_revenue)) : 0));

            var average_pro_per_order = (parseFloat(response.customer_report.total_products) / parseFloat(response.customer_report.total_orders)).toFixed(2);

            $('.avg_pro_order_report').text(isNaN(average_pro_per_order) ? 0 : addCommas(parseFloat(average_pro_per_order).toFixed(2)));

            var average_qty_per_order = (parseFloat(response.customer_report.total_qty) / parseFloat(response.customer_report.total_orders)).toFixed(2);
            $('.avg_qty_order_report').text(isNaN(average_qty_per_order) ? 0 : addCommas((parseFloat(average_qty_per_order).toFixed(2))));

            $('.current_month_orders_report').text(addCommas(response.customer_report.current_month_orders));
            $('.dispatched_orders_report').text(addCommas(response.customer_report.dispatched_orders));
            $('.avg_fulfiltime_order_report').text('NA');
            var paid_invoices = parseFloat(response.customer_report.paid_orders ? response.customer_report.paid_orders : 0);
            var unpaid_invoices = parseFloat(response.customer_report.total_orders) - parseFloat(response.customer_report.paid_orders ? response.customer_report.paid_orders : 0);

            var total_products = 0;
            response.top_products.map(function(value) {
                return total_products += value['count'];
            });

            renderInvoiceChart(paid_invoices, unpaid_invoices);
            renderPaymentModeChart(response.customer_report.cash_payments, response.customer_report.cheque_payments);
            renderProductWiseChart(response.top_products, total_products);
            renderCategoryWiseChart(response.top_categories);


        }
    })
}

function renderInvoiceChart(paid_invoices, unpaid_invoices) {
    var ctx = document.getElementById("invoicechart").getContext('2d');

    var chartData = [paid_invoices, unpaid_invoices];
    var chartLabels = ['Paid Invoices', 'Pending Invoices'];

    var chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: chartLabels,
            datasets: [{
                backgroundColor: [
                    "#040725",
                    "#282828",
                ],
                data: chartData
            }]
        },
        options: {
            legend: {
                display: false
            },
            legendCallback: function(chart) {
                var text = [];
                text.push('<ul class="0-legend">');
                var ds = chart.data.datasets[0];
                var sum = ds.data.reduce(function add(a, b) {
                    return a + b;
                }, 0);
                for (var i = 0; i < ds.data.length; i++) {
                    text.push('<li>');
                    var perc = Math.round(100 * ds.data[i] / sum, 0);
                    text.push('<span style="background-color:' + ds.backgroundColor[i] + '">' + '</span>' + chart.data.labels[i] + ' (' + ds.data[i] + ') (' + (isNaN(perc) ? 0 : perc) + '%)');
                    text.push('</li>');
                }
                text.push('</ul>');
                return text.join("");
            }
        }
    });

    var myLegendContainer = document.getElementById("legend");
    // generate HTML legend
    myLegendContainer.innerHTML = chart.generateLegend();
    // bind onClick event to all LI-tags of the legend
    var legendItems = myLegendContainer.getElementsByTagName('li');
    for (var i = 0; i < legendItems.length; i += 1) {
        legendItems[i].addEventListener("click", legendClickCallback, false);
    }
}

function renderPaymentModeChart(cash, cheque) {
    var ctx = document.getElementById("PaymentMode");
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Cash", "Cheque "],
            datasets: [{
                label: 'Payment Mode',
                data: [cash, cheque],
                backgroundColor: [
                    '#040725', '#282828',
                ],
                borderColor: [
                    '#fff', '#fff',
                ],
                borderWidth: 1
            }]
        },
        options: {
            rotation: 1 * Math.PI,
            circumference: 1 * Math.PI
        }
    });
}

function renderCategoryWiseChart(categories) {

    var ctx = document.getElementById('myChart').getContext('2d');
    var names = [];
    var values = [];
    $.map(categories, function(item) {
        names.push(item.service_name);
        values.push(item.counts);
    });

    var myChart = new Chart(ctx, {
        type: 'pie', //polarArea   doughnut   pie
        data: {
            labels: names,
            datasets: [{
                label: '# of Votes',
                data: values,
                backgroundColor: [
                    '#040725', '#002b8f', '#1052eb', '#282828', '#7a7a7a', '#b4b4b4'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },

            legend: {
                position: 'right'
            },

            scales: {
                xAxes: [{
                    ticks: {
                        display: false //this will remove only the label
                    }
                }]
            }
        }
    });

}

function renderProductWiseChart(products, total_products) {
    var names = [];
    var values = [];
    var percentages = [];

    $.map(products, function(item) {
        names.push(item.product_name);
        values.push(item.count);
        percentages.push(((parseFloat(item.count) / parseFloat(total_products)) * 100).toFixed(2));
    });

    products = products.slice().sort((a, b) => b.values - a.values);
    products = products.slice(0, 10);

    var dom = document.getElementById("e_chart_1");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    var posList = [
        'left', 'right', 'top', 'bottom',
        'inside',
        'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
        'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
    ];

    app.configParameters = {
        rotate: {
            min: -90,
            max: 90
        },
        align: {
            options: {
                left: 'left',
                center: 'center',
                right: 'right'
            }
        },
        verticalAlign: {
            options: {
                top: 'top',
                middle: 'middle',
                bottom: 'bottom'
            }
        },
        position: {
            options: echarts.util.reduce(posList, function(map, pos) {
                map[pos] = pos;
                return map;
            }, {})
        },
        distance: {
            min: 0,
            max: 100
        }
    };

    app.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15,
        onChange: function() {
            var labelOption = {
                normal: {
                    rotate: app.config.rotate,
                    align: app.config.align,
                    verticalAlign: app.config.verticalAlign,
                    position: app.config.position,
                    distance: app.config.distance
                }
            };
            myChart.setOption({
                series: [{
                    label: labelOption
                }, {
                    label: labelOption
                }, {
                    label: labelOption
                }, {
                    label: labelOption
                }]
            });
        }
    };


    var labelOption = {
        normal: {
            show: true,
            position: app.config.position,
            distance: app.config.distance,
            align: app.config.align,
            verticalAlign: app.config.verticalAlign,
            rotate: app.config.rotate,
            formatter: '{c}',
            //formatter: '{c} {name{a}}',
            fontSize: 10,
            rich: {
                name: {
                    textBorderColor: '#fff',

                }
            }
        }
    };

    option = {
        color: ['#040725', '#282828'],
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(33,33,33,1)',
            borderRadius: 0,
            padding: 5,
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: 'rgba(33,33,33,1)'
                }
            },
            textStyle: {
                color: '#fff',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: "'Roboto', sans-serif",
                fontSize: 12
            }
        },
        legend: {
            data: ['Product']
        },
        toolbox: {
            show: false,
            orient: 'vertical',
            left: 'right',
            padding: 0,
            margin: 0,
            top: 'center',
            feature: {
                mark: {
                    show: true
                },
                dataView: {
                    show: true,
                    readOnly: true
                },
                magicType: {
                    show: true,
                    type: ['line', 'bar', 'stack', 'tiled']
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: false
                }
            }
        },
        grid: {
            left: '0',
            right: '0',
            top: '35px',
            bottom: '0',
            containLabel: true
        },
        calculable: true,
        type: 'value',
        axisLine: {
            show: true
        },
        xAxis: [{
                type: 'category',
                axisTick: {
                    show: true
                },
                data: names,
                axisLine: {
                    show: true
                },
                axisLabel: {
                    textStyle: {
                        color: '#a0a0a0'
                    }
                },
            }

        ],

        yAxis: [{
            type: 'value',
            axisLine: {
                show: true
            },
            axisLabel: {
                textStyle: {
                    color: '#a0a0a0'
                }
            },
            splitLine: {
                show: true,
            }
        }],
        series: [{
            name: 'Sales',
            type: 'bar',
            barGap: 0,
            label: labelOption,
            data: values
        }, {
            name: 'percentage',
            type: 'line',
            label: labelOption,
            data: percentages
        }]
    };;
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}