<<<<<<< HEAD
$(document).ready(function () {

    $(".datepicker").datepicker({
        format: "yyyy-mm-dd",
        startDate: "+0d"
    }).on('changeDate', function (e) {
        $(this).datepicker('hide');
    });

    //CurrentMonth
    // fetchDashboardReports($('.dashboard_filter').val());

    // $(document).on('change', '.dashboard_filter', function () {
    //     if ($(this).val() == 3) {
    //         $('.dashboard_date_filter').show();
    //     } else if ($(this).val() == 2) {
    //         $('.dashboard_date_filter').hide();
    //         fetchDashboardReports($(this).val());
    //     } else {
    //         $('.dashboard_date_filter').hide();
    //         fetchDashboardReports($(this).val());
    //     }
    // });

    // $(document).on('change', '#start_date', function () {
    //     if ($(this).val()) {
    //         if ($('#end_date').val()) {
    //             fetchDashboardReports($('.dashboard_filter').val(), $(this).val(), $('#end_date').val());
    //         }
    //     }
    // });

    // $(document).on('change', '#end_date', function () {
    //     if ($(this).val()) {
    //         if ($('#start_date').val()) {
    //             fetchDashboardReports($('.dashboard_filter').val(), $('#start_date').val(), $(this).val());
    //         }
    //     }
    // });


});

function sortResults(array, prop, asc) {
    array.sort(function (a, b) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
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
=======
// $(document).ready(function () {

//     $(".datepicker").datepicker({
//         format: "yyyy-mm-dd",
//         startDate: "+0d"
//     }).on('changeDate', function (e) {
//         $(this).datepicker('hide');
//     });

//     //CurrentMonth
//     fetchDashboardReports($('.dashboard_filter').val());

//     $(document).on('change', '.dashboard_filter', function () {
//         if ($(this).val() == 3) {
//             $('.dashboard_date_filter').show();
//         } else if ($(this).val() == 2) {
//             $('.dashboard_date_filter').hide();
//             fetchDashboardReports($(this).val());
//         } else {
//             $('.dashboard_date_filter').hide();
//             fetchDashboardReports($(this).val());
//         }
//     });

//     $(document).on('change', '#start_date', function () {
//         if ($(this).val()) {
//             if ($('#end_date').val()) {
//                 fetchDashboardReports($('.dashboard_filter').val(), $(this).val(), $('#end_date').val());
//             }
//         }
//     });

//     $(document).on('change', '#end_date', function () {
//         if ($(this).val()) {
//             if ($('#start_date').val()) {
//                 fetchDashboardReports($('.dashboard_filter').val(), $('#start_date').val(), $(this).val());
//             }
//         }
//     });


// });

// function fetchDashboardReports(month = null, start_date = null, end_date = null) {
//     $('.dashboard_avg_rev').text('Loading...');
//     $('.dashboard_ttl_orders').text('Loading...');
//     $('.dashboard_active_cust').text('Loading...');
//     $('.dashboard_avg_rev_perCust').text('Loading...');
//     $('.dashboard_outstanding_paymnet').text('Loading...');
//     $('.dashboard_amount_rec').text('Loading...');
//     $('.dashboard_pend_amt').text('Loading...');
//     $('.dashboard_avg_revPerDay').text('Loading...');
//     $('.dashboard_avg_revPerOrder').text('Loading...');
//     $('.dashboard_avg_orderPerDay').text('Loading...');
//     $('.dashboard_avg_weightPerOrder').text('Loading...');
//     $('.dashboard_avg_deliveryTime').text('Loading...');
//     $('#top_products_tbody').empty();
//     $('.country_data_div').empty();
//     $.ajax({
//         type: 'POST',
//         url: '/fetchDashboardReports',
//         data: {
//             _token: $('[name="csrf_token"]').attr('content'),
//             month: month,
//             start_date: start_date,
//             end_date: end_date
//         },
//         success: function (response) {
//             var response = JSON.parse(response);
//             // console.log(response);
//             $('.dashboard_avg_rev').text("PKR " + (response.reports.total_revenue ? addCommas(Math.round(response.reports.total_revenue)) : 0));

//             $('.dashboard_ttl_orders').text(response.reports.total_orders ? addCommas(response.reports.total_orders) : 0);
//             $('.dashboard_active_cust').text(response.active_customers ? (response.active_customers).length : 0);

//             var avg_rev_per_cust = (parseFloat(response.reports.total_revenue) / parseFloat((response.active_customers).length)).toFixed(2);
//             $('.dashboard_avg_rev_perCust').text("PKR " + (isNaN(avg_rev_per_cust) ? 0 : addCommas(Math.round(avg_rev_per_cust))));

//             $('.dashboard_outstanding_paymnet').text(" PKR " + (response.reports.total_revenue ? addCommas(Math.round(response.reports.total_revenue)) : 0));
//             $('.dashboard_amount_rec').text(" PKR " + (response.reports.payment_rec ? addCommas(Math.round(response.reports.payment_rec)) : 0));

//             var pending_amt = parseFloat(response.reports.total_revenue ? response.reports.total_revenue : 0) - parseFloat(response.reports.payment_rec ? response.reports.payment_rec : 0);
//             $('.dashboard_pend_amt').text(" PKR " + addCommas(Math.round(pending_amt)));

//             var avg_rev_per_day = (month == 1 ? (parseFloat(response.reports.total_revenue) / parseFloat(response.current_month_days)).toFixed(2) : (month == 2 ? (parseFloat(response.reports.total_revenue) / parseFloat(response.last_month_days)).toFixed(2) : (month == 3 ? (parseFloat(response.reports.total_revenue) / parseFloat(response.custom_days)).toFixed(2) : (parseFloat(response.reports.total_revenue) / parseFloat(response.reports.total_days)).toFixed(2))));
//             $('.dashboard_avg_revPerDay').text("PKR " + (isNaN(avg_rev_per_day) ? 0 : addCommas(Math.round(avg_rev_per_day))));

//             var avg_rev_perOrder = (parseFloat(response.reports.total_revenue) / parseFloat(response.reports.total_orders)).toFixed(2);
//             $('.dashboard_avg_revPerOrder').text("PKR " + (isNaN(avg_rev_perOrder) ? 0 : addCommas(Math.round(avg_rev_perOrder))));

//             var avg_order_per_day = (month == 1 ? (parseFloat(response.reports.total_orders) / parseFloat(response.current_month_days)).toFixed(2) : (month == 2 ? (parseFloat(response.reports.total_orders) / parseFloat(response.last_month_days)).toFixed(2) : (month == 3 ? (parseFloat(response.reports.total_orders) / parseFloat(response.custom_days)).toFixed(2) : (parseFloat(response.reports.total_orders) / parseFloat(response.reports.total_days)).toFixed(2))));
//             $('.dashboard_avg_orderPerDay').text(isNaN(avg_order_per_day) ? 0 : addCommas(parseFloat(avg_order_per_day).toFixed(2)));

//             var avg_weight_perOrder = (parseFloat(response.reports.total_weight) / parseFloat(response.reports.total_orders)).toFixed(2);
//             $('.dashboard_avg_weightPerOrder').text(isNaN(avg_weight_perOrder) ? 0 + ' KGs' : addCommas(parseFloat(avg_weight_perOrder).toFixed(2)) + ' KGs');

//             response.top_products.forEach(element => {
//                 $('#top_products_tbody').append(`<tr>
//                 <td> ${element['product_name']} </td>
//                 <td> ${addCommas(Math.round(element['avg_qty'])) + ' CTNs'} </td>
//                 <td> ${addCommas(Math.round(element['avg_new_weight']))+' KGs'} </td>
//                 <td> ${addCommas(Math.round(element['total_price']))} </td>
//             </tr>`);
//             });

//             var countries = [];
//             response.top_countries.forEach(elem => {
//                 if (!elem.cust_country || elem.cust_country == "")
//                     return
//                 let countryExist = countries.find(x => x.country.toLowerCase() == elem.cust_country.toLowerCase());
//                 if (!countryExist) {
//                     countries.push({
//                         'country': elem['cust_country'],
//                         'amount': parseFloat(elem['total_amount']),
//                         'counts': parseFloat(elem['counts']),
//                         'total_orders': elem['total_orders']
//                     });
//                 } else {
//                     countryExist.amount += parseFloat(elem['total_amount'])
//                     countryExist.total_orders += parseFloat(elem['total_orders'])
//                 }
//             });

//             countries = countries.slice().sort((a, b) => b.amount - a.amount);
//             countries = countries.slice(0, 10);

//             var counter = 0;
//             var total = countries.reduce((sum, val) => sum + val.amount, 0)
//             countries.forEach(element => {
//                 if (counter <= 10) {
//                     var percentage = (parseFloat(element['amount']) / parseFloat(total)) * 100;
//                     percentage = Math.round(percentage);
//                     $('.country_data_div').append(`<div class="_dash-prog">
//                     <h5>${element['country']}</h5>
//                     <div class="progress-w-percent">
//                         <span class="progress-value">${percentage}% </span>
//                         <div class="progress">
//                             <div class="progress-bar" role="progressbar" style="width:${percentage}%;" aria-valuenow="${percentage}"
//                                 aria-valuemin="0" aria-valuemax="100"></div>
//                         </div>
//                     </div>
//                 </div>`);
//                 }

//                 counter++;
//             })

//             var total_del_days = 0;
//             var total_entrier = 0;
//             $.map(response.avg_delivery_time, function (item) {
//                 total_del_days += parseFloat(item.difference);
//                 total_entrier++;
//             });
//             var avg_delivery_time = total_del_days / total_entrier;
//             $('.dashboard_avg_deliveryTime').text((isNaN(avg_delivery_time) ? 'NA' : avg_delivery_time.toFixed(2)) + ' Days');

//         }
//     });
// }

// function sortResults(array, prop, asc) {
//     array.sort(function (a, b) {
//         if (asc) {
//             return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
//         } else {
//             return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
//         }
//     });
// }

// function addCommas(nStr) {
//     nStr += '';
//     x = nStr.split('.');
//     x1 = x[0];
//     x2 = x.length > 1 ? '.' + x[1] : '';
//     var rgx = /(\d+)(\d{3})/;
//     while (rgx.test(x1)) {
//         x1 = x1.replace(rgx, '$1' + ',' + '$2');
//     }
//     return x1 + x2;
// }
>>>>>>> 54a890dbae7ebe1d21d1ea9167252afc505b5715
