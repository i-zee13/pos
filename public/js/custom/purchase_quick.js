/* global swal */

(function () {
  var purchased_product_array = [];
  var companies = [];
  var nextBarcodeSeed = null;

  function csrf() {
    return document.querySelector('meta[name="csrf_token"]')?.getAttribute('content') || '';
  }

  function money(n) {
    n = parseFloat(n || 0);
    if (isNaN(n)) n = 0;
    return n;
  }

  function toast(msg, ok) {
    var n = $('#notifDiv');
    n.stop(true, true).fadeIn().css('background', ok ? 'green' : 'red').text(msg);
    setTimeout(function () { n.fadeOut(); }, 2500);
  }

  function loadCompanies() {
    $.ajax({
      url: '/get-companies',
      type: 'GET',
      success: function (res) {
        companies = res.companies || [];
        var sel = $('#company_id');
        sel.empty().append('<option value="">Select Company</option>');
        companies.forEach(function (c) {
          sel.append('<option value="' + c.id + '">' + c.company_name + '</option>');
        });
      }
    });
  }

  function loadVendors() {
    $.ajax({
      url: '/get-vendors',
      type: 'GET',
      success: function (res) {
        var sel = $('#customer_id');
        sel.empty().append('<option value="">Select Vendor</option>');
        (res.customers || res.vendors || res.data || []).forEach(function (v) {
          var name = v.customer_name || v.vendor_name || v.name || ('Vendor #' + v.id);
          sel.append('<option value="' + v.id + '">' + v.id + '-' + name + '</option>');
        });
      }
    });
  }

  function loadNextBarcode() {
    $.ajax({
      url: '/get-products',
      type: 'GET',
      success: function (res) {
        // ProductController::getProducts returns { barcode: maxId+1 }
        nextBarcodeSeed = res.barcode || null;
      }
    });
  }

  function recalcTotals() {
    var sum = 0;
    purchased_product_array.forEach(function (p) {
      sum += money(p.amount) - money(p.prod_discount);
    });
    $('.product_net_total').val(sum);
    $('.net_total_text').text(sum.toFixed(2));

    // keep a simple "cash_return" as paid - net (for invoice_type=1 it must not be less)
    var paid = money($('#amount_received').val());
    var cashReturn = paid - sum;
    $('.cash_return_input').val(cashReturn);
  }

  function renderTable() {
    var tbody = $('#items_table tbody');
    tbody.empty();
    purchased_product_array.forEach(function (p, idx) {
      var amount = (money(p.amount) - money(p.prod_discount));
      tbody.append(
        '<tr>' +
          '<td>' + p.product_id + '</td>' +
          '<td>' + (p.p_name || '') + '</td>' +
          '<td>' + p.qty + '</td>' +
          '<td>' + money(p.old_price).toFixed(2) + '</td>' +
          '<td>' + money(p.sale_price).toFixed(2) + '</td>' +
          '<td>' + money(p.prod_discount).toFixed(2) + '</td>' +
          '<td>' + amount.toFixed(2) + '</td>' +
          '<td><button type="button" class="btn btn-sm btn-danger qp-remove" data-idx="' + idx + '">Remove</button></td>' +
        '</tr>'
      );
    });
    recalcTotals();
  }

  function buildFullProductName() {
    var name = ($('#product_name').val() || '').trim();
    var variant = ($('#variant').val() || '').trim();
    if (variant) return name + ' ' + variant;
    return name;
  }

  function createProductThenAddLine(typeAfterCreate) {
    var companyId = $('#company_id').val();
    var productName = buildFullProductName();
    var barcode = ($('#barcode').val() || '').trim();
    var qty = money($('#qty').val());
    var purchasePrice = money($('#purchase_price').val());
    var salePrice = money($('#sale_price').val());
    var discount = money($('#discount').val());

    if (!companyId) return toast('Please select company', false);
    if (!productName) return toast('Please enter product name', false);
    if (!qty || qty <= 0) return toast('Qty must be greater than 0', false);
    if (!purchasePrice || purchasePrice < 0) return toast('Please enter purchase price', false);

    // Ensure we always pass something for barcode_span to satisfy existing controller logic
    var barcodeSpan = barcode || (nextBarcodeSeed ? String(nextBarcodeSeed) : String(Date.now()));

    $.ajax({
      url: '/product-store',
      type: 'POST',
      data: {
        _token: csrf(),
        hidden_product_id: 0,
        company_id: companyId,
        hidden_product_name: productName,
        purchase_price: purchasePrice,
        sale_price: salePrice || purchasePrice,
        size: '',
        // ProductController expects barcode to be an array in duplicate check (whereIn)
        barcode: [barcodeSpan],
        // keep barcode_span too for compatibility with existing logic
        barcode_span: barcodeSpan
      },
      success: function (res) {
        if (res.status !== 'success') {
          return toast(res.duplicate_msg || 'Unable to create product', false);
        }

        var productId = (parseInt(res.next_product_id, 10) || 0) - 1;
        if (productId <= 0) {
          return toast('Product created but id not detected', false);
        }

        // Bump barcode seed for next product
        if (nextBarcodeSeed) nextBarcodeSeed = nextBarcodeSeed + 1;

        purchased_product_array.push({
          purchase_prod_id: 0,
          product_id: String(productId),
          expiry_date: '', // mobile mode: no expiry
          qty: String(qty),
          amount: String(qty * purchasePrice),
          old_price: String(purchasePrice),
          new_price: '',
          prod_discount: String(discount),
          p_name: productName,
          purchase_invoice_id: '',
          stock_in_hand: '',
          purchased_price: String(purchasePrice),
          sale_price: String(salePrice || purchasePrice)
        });

        renderTable();
        toast('Item added', true);

        // reset line inputs (keep company selection)
        $('#product_name').val('');
        $('#variant').val('');
        $('#barcode').val('');
        $('#qty').val(1);
        $('#purchase_price').val('');
        $('#sale_price').val('');
        $('#discount').val(0);

        if (typeAfterCreate) {
          submitInvoice(typeAfterCreate);
        }
      },
      error: function () {
        toast('Error while creating product', false);
      }
    });
  }

  function validateInvoice() {
    if (!$('#invoice_date').val()) return 'Please select invoice date';
    if (!$('#customer_id').val()) return 'Please select vendor';
    if (purchased_product_array.length < 1) return 'Please add at least one item';
    var invoiceType = $('#invoice_type').val();
    var net = money($('.product_net_total').val());
    var paid = money($('#amount_received').val());
    if (invoiceType === '1' && paid < net) return 'Paid amount can not be less than total invoice amount';
    return '';
  }

  function submitInvoice(type) {
    var err = validateInvoice();
    if (err) return toast(err, false);

    var btn = type === 'print' ? $('#print') : $('#save');
    btn.attr('disabled', 'disabled').text('Processing...');

    $.ajax({
      url: '/add-purchase-invoice',
      type: 'POST',
      data: {
        _token: csrf(),
        invoice_type: $('#invoice_type').val(),
        invoice_no: $('input[name="invoice_no"]').val(),
        invoice_date: $('#invoice_date').val(),
        customer_id: $('#customer_id').val(),
        previous_receivable: $('#previous_receivable').val() || 0,
        service_charges: $('.service_charges_input').val() || 0,
        invoice_discount: $('#invoice_discount').val() || 0,
        product_net_total: $('.product_net_total').val() || 0,
        amount_received: $('#amount_received').val() || 0,
        amount_to_pay: $('#amount_received').val() || 0, // for invoice_type=1 purchaseInvoice reads amount_to_pay
        cash_return: $('.cash_return_input').val() || 0,
        description: $('#description').val(),
        purchased_product_array: purchased_product_array,
        existing_product_ids: []
      },
      success: function (response) {
        toast('Added successfully', true);
        var received_amount = String(money($('#amount_received').val() || 0));
        if (type === 'print') {
          var printWindow = window.open("/print-purchase-invoice/" + response.invoice_id + '/' + response.customer_id + '/' + received_amount);
          printWindow.onload = function () { printWindow.print(); };
        }
        setTimeout(function () { window.location = "/stock-add-quick"; }, 1200);
      },
      error: function () {
        toast('Failed to save at the moment', false);
        btn.removeAttr('disabled').text(type === 'print' ? 'Save & Print' : 'Save');
      }
    });
  }

  $(document).ready(function () {
    loadCompanies();
    loadVendors();
    loadNextBarcode();

    $('#amount_received').on('input', recalcTotals);

    $('#add_item').on('click', function () {
      createProductThenAddLine(null);
    });

    $(document).on('click', '.qp-remove', function () {
      var idx = parseInt($(this).attr('data-idx'), 10);
      purchased_product_array.splice(idx, 1);
      renderTable();
    });

    $('#save').on('click', function () { submitInvoice('save'); });
    $('#print').on('click', function () { submitInvoice('print'); });
  });
})();

