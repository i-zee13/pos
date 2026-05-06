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
        options: echarts.util.reduce(posList, function (map, pos) {
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
    onChange: function () {
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
        formatter: '{c} ',
        //formatter: '{c}  {name{a}}',
        fontSize: 10,
        rich: {
            name: {
                textBorderColor: '#fff',
            }
        }
    }
};


var years = [];
var revenue = [];
$.ajax({
    type: 'POST',
    url: '/fetchDashboardMonthWiseGraph',
    data: {
        _token: $('[name="csrf_token"]').attr('content')
    },
    success: function (response) {
        var response = JSON.parse(response);
        //  console.log(response);
        //  return;
		response.forEach(element => {
            years.push(element['year']);
			revenue.push(Math.round(element['total_amount']));
		});

        option = {
            color: ['#040725', '#606060', '#fbd439', '#bdbdbd', '#282828'],
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
                    fontSize: 10
                }
            },
            legend: {
                data: ['Revenue History']
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
                        type: ['bar']
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
                left: '10',
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
                    data: years,
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
                        color: '#a0a0a0',
                        fontSize: 10
                    }
                },
                splitLine: {
                    show: true,
                }
            }],
            series: [{
                name: 'Revenue History',
                type: 'bar',
                barGap: 0,
                label: labelOption,
                data: revenue
            }]
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }

    }
});

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

