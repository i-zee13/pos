var deleteRef = '';
var batches = [];
var sessions = [];
var CurrentRef = '';
var segments = location.href.split('/');
$('.search-btn').on('click', function () {
  var start_date  = $('.start_date').val();
  var end_date    = $('.end_date').val();
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
  if ($('.company_id').val() == 0 && $('.product_id').val() == 0 && $('.expiry-select').val() == '') {
    $('#notifDiv').fadeIn().css('background', 'red').text('Please Select Company/Product First.');
    setTimeout(function () {
      $('#notifDiv').fadeOut();
    }, 3000);
    return;
  }
  CurrentRef  = $(this);
  CurrentRef.attr('disabled', 'disabled');
  url         = '/stocks';
  $("#search-form").ajaxSubmit({
    type: 'POST',
    url : url,
    data: {
      _token: $('meta[name="csrf_token"]').attr('content'),
      current_url: segments[3]
    },
    success: function success(response) {
      CurrentRef.attr('disabled', false);
      $('.loader').show();
      $('.teacher_attendance_list').empty();
      $('.teacher_attendance_list').append(`
        <table class="table table-hover dt-responsive nowrap StockListTable" style="width:100%;">
          <thead>
            <tr>
              <th>#</th>
              <th>Invoice #</th>
              ${$('.company_id').val() != '' ? `<th>Product Name</th>` : ''}
              ${$('.expiry-select').val() != '' ? `
              <th>Product Name</th>
              <th>Expiry Date</th>
              `:`
              <th>Rate</th>
              <th>In</th>
              <th>Out</th>
              `}
              <th>Balance</th>
            </tr>
          </thead>
          <tbody> </tbody>
        </table>
      `);
      $('.StockListTable tbody').empty();
      if (response.records.length == 0) {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'green');
        $('#notifDiv').text('No data available');
        setTimeout(function () {
          $('#notifDiv').fadeOut();
        }, 3000);
      }
      var last_balance    = 0;
      var stock_in        = 0;
      var stock_out       = 0;
      var stock_in_row    = "";
      var stock_out_row   = "";
      var Pinvoice         = '';
      var Sinvoice         = '';
      response.records.forEach(function (element, key) {
        if($('.expiry-select').val() != ''){
          last_balance      += element.balance;
        }else{
          last_balance      = element.balance;
        }
        var date          = new Date(element.expire_date);
        var formattedDate = date.toDateString();
        stock_in_row      = '';
        stock_out_row     = '';
        if(element.status == 1){
          Pinvoice        = element.purchase_invoice_id ? element.purchase_invoice_id.split('-'):'NA';
          stock_in        += element.qty;
          stock_in_row   = `<tr>
                              <td>${key+1}</td>
                              <td>${Pinvoice[0]} (${element.vendor_name ? element.vendor_name : "NA"})</td>
                              ${$('.company_id').val() != '' ? `<td>${element.product_name ? element.product_name : 'NA'}</td>` : ''}
                              ${$('.expiry-select').val() != '' ? 
                              `
                              <td>${element.product_name ? element.product_name : 'NA'}</td>
                              <td>${element.expiry_date ? element.expiry_date : 'NA'}</td>
                              ` 
                              : `
                              <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">${element.p_price ? addCommas(element.p_price) : 0}</td>
                              <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">${element.qty ? addCommas(element.qty) : 0}</td>
                              <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">0</td>
                              `}
                              <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">${element.balance ? addCommas(element.balance) : 0}</td>
                            </tr>`;
        }
        if(element.status == 2){
          Sinvoice        = element.sale_invoice_id.split('-');
          stock_out       += element.qty;
          stock_out_row   = `<tr>
                              <td>${key+1}</td>
                              <td>${Sinvoice[0]} (${element.customer_name ? element.customer_name : "NA"})</td>
                              ${$('.company_id').val() != '' ? `<td>${element.product_name ? element.product_name : 'NA'}</td>` : ''}
                              ${$('.expiry-select').val() != '' ? 
                              `
                              <td>${element.product_name ? element.product_name : 'NA'}</td>
                              <td>${element.expiry_date ? element.expiry_date : 'NA'}</td>
                              ` 
                              : `
                              <td></td>
                              <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">0</td>
                              <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">${element.qty ? addCommas(element.qty) : 0}</td>
                              `}
                              <td style="font-family: 'Rationale', sans-serif !important;font-size: 16px;">${element.balance ? addCommas(element.balance) : 0}</td>
                            </tr>`;
        }
        $('.StockListTable tbody').append(`
          ${stock_in_row}
          ${stock_out_row}
        `)
      });
      $('.StockListTable tbody').append(`
        <tr style="background-color: #f6f6f6">
            <th></th>
            <th></th>
            ${$('.company_id').val() != '' ? `<th></th>` : ''}
            ${$('.expiry-select').val() != '' ? `
            <th></th>
            <th>Total</th>
            ` : `
            <th>Total</th>
            <th style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${stock_in ? addCommas(stock_in) : '0'}</th>
            <th style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${stock_out ? addCommas(stock_out) : '0'}</th>
            `}
            <th style="font-family: 'Rationale', sans-serif !important;font-size: 18px;">${last_balance ? addCommas(last_balance) : 0}</th>
        </tr>
      `);
      $('.filter_name').empty();
      if($('.product_id').val() != ''){
        $('.filter_name').html('Product: <span>'+$('.product_id option:selected').text()+'</span>');
      }
      $('.StockListTable').fadeIn();
      $('.loader').hide();
      $('.ttl_stock_in_hand').html(last_balance ? addCommas(last_balance) : 0);
      if($('.expiry-select').val() != ''){
        $('.ttl_stock_in').html(0);
        $('.ttl_stock_out').html(0);
      }else{
        $('.ttl_stock_in').html(stock_in ? addCommas(stock_in) : 0);
        $('.ttl_stock_out').html(stock_out ? addCommas(stock_out) : 0);
      }
      var title = '';
      if (segments[3] == 'customer-reports') {
        title = 'Customer Report';
      } else {
        title = 'Vendor Report';
      }
      if ($.fn.DataTable.isDataTable(".StockListTable")) {
        $('.StockListTable').DataTable().clear().destroy();
      }
      var table       = $('.StockListTable').DataTable({
        "bSort"       : false,
        "bPaginate"   : false,
        scrollX       : false,
        scrollY       : '400px',
        scrollCollapse: true,
        dom           : 'Bfrtip',
        buttons: [
          {
            extend    : 'pdfHtml5',
            title     : `Stock Report`,
            orientation: 'landscape',
            header    : true,
            exportOptions: {
                alignment: 'left',
                // columns: ':visible:not(:last-child)',
            },
            customize: function (doc) {
                doc.content.splice(0, 1, {
                    text: [{
                      text: `Stock Report`,
                      bold: true,
                      fontSize: 14,
                      alignment: 'left'
                    },
                    // {
                    //     text: 'Sale Report ',
                    //     bold: false,
                    //     fontSize: 14,
                    //     alignment: 'left'
                    // },
                    // {
                    //     text: `()`,
                    //     bold: true,
                    //     fontSize: 11,
                    //     alignment: 'right',
                    // }
                ],
                    margin: [0, 0, 0, 12],
                });
                console.log(doc);
                doc.pageMargins = [20, 12, 20, 12];
                // doc.styles.tableBodyOdd.fillColor = "#FFA07A";
                doc.styles.tableHeader.fillColor = "#E6E6E6";
                doc.styles.tableFooter.fillColor = "#E6E6E6";
                doc.styles.tableHeader.color = "black";
                doc.styles.tableHeader.alignment = "left";
                doc.styles.title.alignment = "left";
                doc.content[1].table.widths = 'auto';
                //cell border
                var objLayout = {};
                objLayout['hLineWidth'] = function (i) { return 0.5; };
                objLayout['vLineWidth'] = function (i) { return 0.5; };
                objLayout['hLineColor'] = function (i) { return '#E6E6E6'; };
                objLayout['vLineColor'] = function (i) { return '#E6E6E6'; };
                objLayout['paddingLeft'] = function (i) { return 3; };
                objLayout['paddingRight'] = function (i) { return 3; };
                objLayout['paddingTop'] = function (i) { return 4; };
                objLayout['paddingBottom'] = function (i) { return 4; };
                doc.content[1].layout = objLayout;

                //cell border
                age = table.column(3).data().toArray();

                // testing for the background of the row
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
            // Change the default print title
            $(win.document.body).find('h1').text(title);

            // Add a footer with the current date and time
            var date = new Date().toLocaleString();
            $(win.document.body).append('<div style="text-align:center;font-size:10px;">' + date + '</div>');

            // Remove the default DataTables styling from the print view
            $(win.document.body).find('table').removeClass('display').addClass('table').css('font-size', 'inherit');
          }
        }]
      });
    }
  });
});
$('.company_id').on('change', function () {
  var company_id = $(this).val();
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
  $('#search-form')[0].reset();
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