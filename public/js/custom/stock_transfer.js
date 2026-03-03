var transferItems = [];

$(document).ready(function () {
    loadGodowns();

    $('#product_select').change(function () {
        var selected = $(this).find('option:selected');
        var productId = selected.val();
        var stock = parseFloat(selected.data('stock')) || 0;

        $('#product_id').val(productId);

        // Find already added qty for this product in current transfer
        var existing = transferItems.find(function (i) { return i.product_id == productId; });
        var alreadyQty = existing ? parseFloat(existing.qty) || 0 : 0;
        var remaining = stock - alreadyQty;

        // Set max qty based on remaining stock in hand
        if (remaining > 0) {
            $('#transfer_qty')
                .attr('max', remaining)
                .attr('placeholder', 'Max: ' + remaining);
        } else {
            $('#transfer_qty')
                .removeAttr('max')
                .attr('placeholder', 'No stock left for this product');
        }

        $('#transfer_qty').val('');
    });

    // Hard-limit input so it cannot exceed stock in hand
    $('#transfer_qty').on('input', function () {
        var max = parseFloat($(this).attr('max'));
        var val = parseFloat($(this).val());
        if (!isNaN(max) && !isNaN(val) && val > max) {
            $(this).val(max);
        }
    });

    $('#add_transfer_item').on('click', function () {
        var productId = $('#product_id').val();
        var productText = $('#product_select option:selected').text();
        var qty = parseFloat($('#transfer_qty').val());
        var max = parseFloat($('#transfer_qty').attr('max'));
        var selected = $('#product_select').find('option:selected');
        var stock = parseFloat(selected.data('stock')) || 0;

        if (!productId) {
            $('#notifDiv').fadeIn().css('background', 'red').text('Please select a product');
            setTimeout(() => $('#notifDiv').fadeOut(), 3000);
            return;
        }
        if (!qty || qty <= 0) {
            $('#notifDiv').fadeIn().css('background', 'red').text('Please enter quantity');
            setTimeout(() => $('#notifDiv').fadeOut(), 3000);
            return;
        }
        // Calculate total qty for this product in current transfer
        var existing = transferItems.find(function (i) { return i.product_id == productId; });
        var alreadyQty = existing ? parseFloat(existing.qty) || 0 : 0;
        var newTotal = alreadyQty + qty;

        if (!isNaN(max) && qty > max) {
            $('#notifDiv').fadeIn().css('background', 'red').text('Quantity cannot exceed stock in hand');
            setTimeout(() => $('#notifDiv').fadeOut(), 3000);
            $('#transfer_qty').val(max);
            return;
        }
        if (stock && newTotal > stock) {
            $('#notifDiv').fadeIn().css('background', 'red').text('Total quantity for this product cannot exceed stock in hand');
            setTimeout(() => $('#notifDiv').fadeOut(), 3000);
            // Set remaining allowed qty as helper
            var remaining = stock - alreadyQty;
            if (remaining > 0) {
                $('#transfer_qty').val(remaining);
            }
            return;
        }

        if (existing) {
            existing.qty = newTotal;
        } else {
            transferItems.push({
                product_id: productId,
                product_name: productText,
                qty: qty
            });
        }

        renderItemsTable();

        // reset row
        $('#product_id').val('');
        $('#product_select').val('');
        $('#transfer_qty').val('').removeAttr('max').attr('placeholder', '');
    });

    $('#save_transfer').on('click', function () {
        var fromGodown = $('#from_godown_id').val();
        var toGodown = $('#to_godown_id').val();
        var date = $('#transfer_date').val();

        if (!fromGodown || !toGodown) {
            $('#notifDiv').fadeIn().css('background', 'red').text('Please select both From and To godowns');
            setTimeout(() => $('#notifDiv').fadeOut(), 3000);
            return;
        }
        if (fromGodown === toGodown) {
            $('#notifDiv').fadeIn().css('background', 'red').text('From and To godown cannot be same');
            setTimeout(() => $('#notifDiv').fadeOut(), 3000);
            return;
        }
        if (!date) {
            $('#notifDiv').fadeIn().css('background', 'red').text('Please select transfer date');
            setTimeout(() => $('#notifDiv').fadeOut(), 3000);
            return;
        }
        if (transferItems.length === 0) {
            $('#notifDiv').fadeIn().css('background', 'red').text('Please add at least one item');
            setTimeout(() => $('#notifDiv').fadeOut(), 3000);
            return;
        }

        $.ajax({
            url: '/stock-transfers',
            type: 'POST',
            data: {
                _token: $('meta[name="csrf_token"]').attr('content'),
                from_godown_id: fromGodown,
                to_godown_id: toGodown,
                transfer_date: date,
                reference_no: $('#reference_no').val(),
                description: $('#description').val(),
                items: transferItems
            },
            success: function () {
                $('#notifDiv').fadeIn().css('background', 'green').text('Stock transfer saved');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                    window.location.reload();
                }, 1500);
            },
            error: function () {
                $('#notifDiv').fadeIn().css('background', 'red').text('Error while saving transfer');
                setTimeout(() => $('#notifDiv').fadeOut(), 3000);
            }
        });
    });

    $('#from_godown_id').on('change', function () {
        var godownId = $(this).val();
        loadProductsForGodown(godownId);
        // reset selected product & items when changing source godown
        transferItems = [];
        renderItemsTable();
        $('#product_id').val('');
        $('#product_select').val('');
        $('#transfer_qty').val('');
    });
});

function loadGodowns() {
    $.ajax({
        url: '/godowns',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.godowns) {
                response.godowns.forEach(function (g) {
                    $('#from_godown_id').append(`<option value="${g.id}">${g.name}</option>`);
                    $('#to_godown_id').append(`<option value="${g.id}">${g.name}</option>`);
                });
            }
        }
    });
}

function loadProductsForGodown(godownId) {
    $('#product_select').empty().append('<option value=\"\">Select Product</option>');
    $('#product_id').val('');

    if (!godownId) {
        return;
    }

    $.ajax({
        url: '/godown-products/' + godownId,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            var products = response.products || [];
            if (products.length) {
                products.forEach(function (p) {
                    var label = p.id + ' - ' + p.product_name + ' (Stock: ' + p.stock + ')';
                    $('#product_select').append(
                        `<option value="${p.id}" data-stock="${p.stock}">${label}</option>`
                    );
                });
            }
        }
    });
}

function renderItemsTable() {
    var tbody = $('#transferTable tbody');
    tbody.find('tr:not(:first)').remove();

    transferItems.forEach(function (item, index) {
        tbody.append(`
            <tr>
                <td>${item.product_id}</td>
                <td>${item.product_name}</td>
                <td>${item.qty}</td>
                <td><button type="button" class="btn btn-sm btn-danger" onclick="removeTransferItem(${index})">Remove</button></td>
            </tr>
        `);
    });
}

function removeTransferItem(index) {
    transferItems.splice(index, 1);
    renderItemsTable();
}

