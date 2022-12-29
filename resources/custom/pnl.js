$(document).ready(function() {
    var segments = location.href.split('/');

    if (segments[3] == 'PnL') {
        fetch_orders();
    } else if (segments[3] == 'reports') {
        fetchReports();
    } else if (segments[3] == 'pnl_history') {

    }

    $('.datepicker').datepicker({
        format: 'mm-dd-yyyy'
    });

    $('#example').DataTable();
    $('#example2').DataTable();
    $('#example3, #example4, #example5').DataTable();


    $(document).on('click', '.OpenSidebarforAddingCost', function() {
        openSidebar();

        $.ajax({
            type: 'GET',
            url: '/getInvoiceForPnl/' + $(this).attr('id'),
            success: function(response) {
                var response = JSON.parse(response);
                //    console.log(response);
                //    return;
                $('#dataSidebarLoader').hide();
                $('.add_cost_div').show();

                $('#pnl_cust_name').text(response.core.customer_name);
                $('#pnl_invoice_num').text(response.core.invoice_num);
                $('#pnl_invoice_date').text(response.core.issue_date);
                $('#pnl_invoice_value').text(number_format(response.core.order_value));
                $('#pnl_currency_type').text(response.core.currency);
                $('#sell_unit_price_head').text(`Sell Unit Price (${response.core.currency})`)
                $('.body_invoice_items').empty();
                $('.exchange_rate').val('');
                $('.exchange_rate').prop('readonly', (response.core.currency == 'PKR' ? true : ''));

                response.content.forEach(element => {
                    $('.body_invoice_items').append(` <tr><td class="pro_name_table">${element.pro_name}</td><td class="item_qty">${element.qty}</td><td class="unit_price" name="${element.unit_price}">${ response.core.currency_symbol + number_format(element.unit_price)}</td> <td class="converted_to_pkr" name="${(response.core.currency == "PKR" ? element.unit_price : '')}">${(response.core.currency == "Rs" ? "Rs "+number_format(element.unit_price) : '')}</td> <td><input type="number" class="Pro-COST cost_price" placeholder="0"></td> <td class="profit_loss">00</td> <td><button id="${element.id}" class="btn btn-default mb-0 add_cost_price" title="Add">Add</button></td>
                </tr>`);
                });
            }
        });
    });

    $(document).on('input', '.exchange_rate', function() {
        var exchange_rate = $(this).val();
        $('.unit_price').each(function() {
            $(this).parent().find('.converted_to_pkr').text("PKR " + number_format((parseFloat($(this).attr('name')) * exchange_rate).toFixed(2)));
            $(this).parent().find('.converted_to_pkr').attr('name', (parseFloat($(this).attr('name')) * exchange_rate).toFixed(2));
        });
        $('.cost_price').val('');
        $('.profit_loss').text('');
        $('.profit_loss').attr('name', '');
    });

    $(document).on('input', '.cost_price', function() {
        var cost_price = 0;
        if ($(this).val() == '') {
            cost_price = 0;
        } else {
            cost_price = $(this).val();
        }
        if ($(this).parent().parent().find('.converted_to_pkr').attr('name') == '') {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please enter exchange rate!');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            $(this).val('');
            return;
        } else {

            var value = parseFloat($(this).parent().parent().find('.item_qty').text()) * (parseFloat($(this).parent().parent().find('.converted_to_pkr').attr('name')) - parseFloat(cost_price));
            $(this).parent().parent().find('.profit_loss').text(number_format(value.toFixed(2)));
            $(this).parent().parent().find('.profit_loss').attr('name', value.toFixed(2));
            $('.add_cost_price').text('Add');
        }

    });

    $(document).on('click', '.add_cost_price', function() {
        var thisRef = $(this);
        thisRef.text('Add');
        var cost_price = thisRef.parent().parent().find('.cost_price').val();

        if (cost_price == '') {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please add cost price first!');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        thisRef.text('Added');
    });

    var data = [];
    $(document).on('click', '.open_modal_toAddCost', function() {
        var error = [];
        //Without Test
        data = [];
        var thisRef = $(this);
        $('.cost_price').each(function() {
            if ($(this).val() == '') {
                error.push(true);
            } else {
                data.push({
                    'pro_name': $(this).parent().parent().find('.pro_name_table').text(),
                    'price': $(this).parent().parent().find('.converted_to_pkr').attr('name'),
                    'cost_price': $(this).val(),
                    'profit_loss': $(this).parent().parent().find('.profit_loss').attr('name'),
                    'exchange_rate': $('.exchange_rate').val(),
                    'quantity': $(this).parent().parent().find('.item_qty').text(),
                    'id': $(this).parent().parent().find('.add_cost_price').attr('id')
                });
            }
        });
        if (error.includes(true)) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please add cost price of all items!');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        //$('#contentContainerDiv').removeClass('blur-div');
        $('.open_modal').click();
        //$('#contentContainerDiv').addClass('blur-div');
        $('.body_table_modal').empty();
        data.forEach(element => {
            $('.body_table_modal').append(` <tr><td>${element.pro_name}</td> <td>${element.quantity}</td><td>${number_format(element.price)}</td><td>${number_format(element.cost_price)}</td><td>${number_format(element.profit_loss)}</td></tr>`);
        });

    });

    $(document).on('click', '.add_bulk_cost_price', function() {
        var thisRef = $(this);
        thisRef.attr('disabled', 'disabled');
        thisRef.text('Please Wait...');
        $.ajax({
            type: 'POST',
            url: '/add_bulk_cost_price',
            data: {
                _token: $('meta[name="csrf_token"]').attr('content'),
                data: data
            },
            success: function(response) {
                var response = JSON.parse(response);
                thisRef.removeAttr('disabled');
                thisRef.text('Add Cost');
                $('.close_sideBar').removeAttr('disabled');
                if (response == '400') {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to Add Cost Price');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Saved Successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    if (response == '200') {

                    } else {
                        $('.close_sideBar').click();
                        $('.close_modal_pnl').click();
                        fetch_orders();
                    }
                }
            }
        });
    });


    let counter = 0;
    $(document).on('click', '#pills-contact-tab', function() {
        counter = 1;
        //$('.next_btn').attr('disabled', 'disabled');
        $('.next_btn').text('Generate');
        $('.previous_btn').removeAttr('disabled');
    });
    $(document).on('click', '#pills-home-tab', function() {
        counter = 0;
        $('.previous_btn').attr('disabled', 'disabled');
        //$('.next_btn').removeAttr('disabled');
        $('.next_btn').text('Next');
    });
    $(document).on('click', '.next_btn', function() {
        var thisRef = $(this);
        if (counter == 0) {
            counter = 1;
            $('#pills-home').removeClass('show active');
            $('#pills-contact').addClass('show active');
            $('#pills-contact-tab').addClass('active');
            $('#pills-home-tab').removeClass('active');
            //$(this).attr('disabled', 'disabled');
            $('.previous_btn').removeAttr('disabled');
            $(this).text('Generate');
        } else if (counter == 1) {
            //counter = 0;
            thisRef.text('Please Wait...');
            thisRef.attr('disabled', 'disabled');
            $.ajax({
                type: 'POST',
                url: '/save_pnl',
                data: {
                    _token: $('meta[name="csrf_token"]').attr('content'),
                    ttl_inv: $('#pnl_stat_ttlInv').attr('name'),
                    ttl_rev: $('#pnl_stat_ttlRev').attr('name'),
                    ttl_cost: $('#pnl_stat_ttlCst').attr('name'),
                    gp: $('#pnl_stat_gProf').attr('name'),
                    np: $('#pnl_stat_netProf').attr('name')
                },
                success: function(response) {
                    var response = JSON.parse(response);
                    thisRef.removeAttr('disabled');
                    thisRef.text('Generate');
                    if (response == 'failed') {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text('Failed to generate PNL');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    } else {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Saved Successfully');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }
                }
            });
        }
    });

    $(document).on('click', '.previous_btn', function() {
        if (counter == 1) {
            counter = 0;
            $('#pills-home').addClass('show active');
            $('#pills-contact').removeClass('show active');
            $('#pills-contact-tab').removeClass('active');
            $('#pills-home-tab').addClass('active');
            $(this).attr('disabled', 'disabled');
            //$('.next_btn').removeAttr('disabled');
            $('.next_btn').text('Next');
        }
    });

    $(document).on('click', '.viewInvoice', function() {
        $('#editPerformaFromInvoice').remove();
        $('#dateOfIssue').text("Loading..");
        $('#poNum').text("Loading..");
        $('#invoiceNum').text("Loading..");
        $('#companyName').text("Loading..");
        $('._order-price').html(`<span>Total Amount (PKR)</span>Loading..`);
        $('#poc').text("Loading..");
        $('#country').text("Loading..");
        $('#region').text("Loading..");
        $('.totalCtns').html("Loading..");
        $('.totalAmModal').html("Loading..");
        $('#notes').text("Loading..");
        $('#terms').text("Loading..");
        $('#editPerformaFromInvoice').attr('href', `/Orders/${$(this).attr('id')}/edit`);
        $('#downloadInvoicePDF').attr('href', '/invoice-pdf/?performa=' + $(this).attr('id'))
        $.ajax({
            type: 'GET',
            url: `/Orders/invoice/${$(this).attr('id')}`,
            success: function(response) {
                var data = JSON.parse(response);
                $('#dateOfIssue').text(data["basic_info"].issue_date);
                $('#poNum').text(data["basic_info"].po_num);
                $('#invoiceNum').text(data["basic_info"].invoice_num);
                $('#companyName').text(data["basic_info"].company);
                $('._order-price').html(`<span>Total Amount (${data["basic_info"].currency})</span>${data["basic_info"].currency} ${addCommas(data["basic_info"].total_amount)}`);
                $('#poc').text(data["basic_info"].poc);
                $('#country').text(data["basic_info"].country);
                $('#region').text(data["basic_info"].city);
                $('.totalAmModal').html(`${data["basic_info"].currency} ${addCommas(data["basic_info"].total_amount)}`);
                $('#notes').text(data["basic_info"].notes);
                $('#terms').text(data["basic_info"].terms);
                $('#dynamicRowProducts').empty();
                let ttlCtns = 0;
                data.contents.forEach(element => {
                    $('#dynamicRowProducts').append(`<div class="row _row-product">
                    <div class="col-12 p-0">
                        <div class="addItemCell PL-5">
                            <strong>${element.product}</strong><br>
                            ${element.product_description ? element.product_description : ''}
                        </div>
                        <div class="addItemCell2 _h25">${element.qty}</div>
                        <div class="addItemCelWEIGHT _h25">${element.weight_per_unit.toFixed(2)} Grams</div>
                        <div class="addItemCelWEIGHT _h25">${element.weight_per_ctn.toFixed(2)} KG</div>
                        <div class="addItemCellcbm _h25">${element.cbm.toFixed(4)}</div>
                        <div class="addItemCellcbm _h25">${element.total_cbm.toFixed(4)}</div>
                        <div class="addItemCell2 _h25">${data["basic_info"].currency} ${addCommas(element.unit_price.toFixed(2))}</div>
                        <div class="addItemCell3 _h25">${data["basic_info"].currency} ${addCommas(element.amount.toFixed(2))}</div>
                    </div>
                    <div class="col-12 p-0">
                        <div class="row m-0 mt-5">
                            <div class="itemCellpDes">${element.product_desc}</div>
                        </div>
                    </div>
                </div>`);
                    ttlCtns += element.qty;
                });
                $('.totalCtns').html(ttlCtns);
            }
        });
    });

    $(document).on('click', '.invoice_btn', function() {
        window.open($(this).attr('id'), '_blank');
    });

});

function number_format(nStr) {
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

function fetch_orders() {
    $.ajax({
        type: 'GET',
        url: '/GetPendingOrders',
        data: {
            _token: '{!! csrf_token() !!}'
        },
        success: function(response) {
            $('.body_pending_orders').empty();
            $('.body_entered_orders').empty();
            var response = JSON.parse(response);
            response.orders.forEach(element => {
                $('.body_pending_orders').append(`<tr> <td>${element.issue_date}</td> <td>${element.invoice_num}</td><td>${element.customer_name}</td> <td>${element.current_status}</td>  <td><button id="${element.id}" class="btn btn-default mb-0 viewInvoice" title="Delivery Challan" data-toggle="modal" data-target="#performaInvoiceModal">View Invoice</button> <button id="${element.id}" class="btn btn-default mb-0 OpenSidebarforAddingCost" title="Add Cost">Add Cost</button>  </td>  </tr>`);
            });

            response.entered_orders.forEach(element => {
                $('.body_entered_orders').append(`<tr> <td>${element.issue_date}</td><td>${element.invoice_num}</td><td>${element.customer_name}</td><td>${element.current_status}</td><td>${element.total_cost}</td><td><button id="${element.id}" class="btn btn-default mb-0 viewInvoice" title="View Invoice" data-toggle="modal" data-target="#performaInvoiceModal">View Invoice</button> </td>
            </tr>`);
            });

            $('#pnl_stat_ttlInv').text((response.stat.total_amount ? response.stat.total_invoices : 00));
            $('#pnl_stat_ttlRev').text((response.stat.total_amount ? number_format(response.stat.total_amount) : 00));
            $('#pnl_stat_ttlCst').text((response.stat.total_amount ? number_format(response.stat.total_cost) : 00));
            $('#pnl_stat_gProf').text((response.stat.total_amount ? number_format(parseFloat(response.stat.total_amount) - parseFloat(response.stat.total_cost)) : 00));
            $('#pnl_stat_netProf').text('Net Profit: ' + (response.stat.total_amount ? number_format(parseFloat(response.stat.total_amount) - parseFloat(response.stat.total_cost)) : 00));

            //Save PNL values
            $('#pnl_stat_ttlInv').attr('name', (response.stat.total_amount ? response.stat.total_invoices : 00));
            $('#pnl_stat_ttlRev').attr('name', (response.stat.total_amount ? response.stat.total_amount : 00));
            $('#pnl_stat_ttlCst').attr('name', (response.stat.total_amount ? response.stat.total_cost : 00));
            $('#pnl_stat_gProf').attr('name', (response.stat.total_amount ? parseFloat(response.stat.total_amount) - parseFloat(response.stat.total_cost) : 00));
            $('#pnl_stat_netProf').attr('name', (response.stat.total_amount ? parseFloat(response.stat.total_amount) - parseFloat(response.stat.total_cost) : 00));

            $('.pnl_loader').hide();
        }
    });
}

function fetchReports() {
    $.ajax({
        type: 'GET',
        url: '/GetPNLRepports',
        success: function(response) {
            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap reportTable" style="width:100%;"><thead><tr><th>S.No</th><th>Month/Year</th><th>Total Invoices</th><th>Total Revenue</th><th>Total Cost</th><th>Gross Profit</th><th>Profit/Loss</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.reportTable tbody').empty();
            var response = JSON.parse(response);
            //console.log(response); return;
            var sNo = 1;
            response.forEach(element => {
                $('.reportTable tbody').append(`<tr><td>${sNo++}</td><td>${element['month_name']}, ${element['year']}</td><td>${element['total_invoices']}</td><td>${number_format(element['total_amount'])}</td><td>${number_format(element['total_cost'])}</td><td>${number_format(parseFloat(element['total_amount']) - parseFloat(element['total_cost']))}</td><td>${element['profit_loss'] ? number_format(element['profit_loss']) : '0'}</td><td><button class="btn btn-default mb-0 invoice_btn" id="/fpdf/pnl_invoice.php?orders=${element['month']+'/'+element['year']}">Report</button></td></tr>`);
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.reportTable').DataTable();
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