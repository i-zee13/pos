 

let lastOp = '';

$(document).ready(function () {
    fetchGodowns();

    $(document).on('click', '.openDataSidebarForAddingGodown', function () {
        $('#dataSidebarLoader').hide();
        $('input[name="godown_id"]').val('');
        $('input[name="code"]').val('');
        $('select[name="type"]').val('shop');
        $('#godown_active').prop('checked', true);

        if (lastOp === 'update') {
            $('input[name="code"]').val('').blur();
        }

        lastOp = 'add';
        if ($('#saveGodownForm input[name=\"_method\"]').length) {
            $('#saveGodownForm input[name=\"_method\"]').remove();
        }
        $('input[id=\"operation\"]').val('add');
        openSidebar();
    });

    $(document).on('click', '.openDataSidebarForUpdateGodown', function () {
        $('input[id=\"operation\"]').val('update');
        lastOp = 'update';
        $('#dataSidebarLoader').show();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();

        const id = $(this).attr('id');
        $('input[name=\"godown_id\"]').val(id);

        if (!$('#saveGodownForm input[name=\"_method\"]').length) {
            $('#saveGodownForm').append('<input name=\"_method\" value=\"PUT\" hidden />');
        }

        $.ajax({
            type: 'GET',
            url: `/godowns/${id}`,
            success: function (response) {
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                // name selectize value
                if (window.godownSelectize) {
                    const optionId = response.id;
                    if (!godownSelectize.options[optionId]) {
                        godownSelectize.addOption({ value: optionId, text: response.name });
                    }
                    godownSelectize.setValue(optionId);
                    $('#hidden_godown_name').val(response.name);
                } else {
                    $('select.godown_name').html(
                        `<option value=\"${response.name}\" selected>${response.name}</option>`
                    );
                }

                $('input[name=\"code\"]').val(response.code || '');
                $('select[name=\"type\"]').val(response.type || 'shop');
                $('#godown_active').prop('checked', !!response.is_active);
            }
        });

        openSidebar();
    });

    $(document).on('click', '#saveGodown', function () {
        const op = $('input[id=\"operation\"]').val();
        const godownId = $('input[name=\"godown_id\"]').val();
        const form = $('#saveGodownForm')[0];
        const formData = new FormData(form);

        if (window.godownSelectize) {
            const selectedText = godownSelectize.getItem(godownSelectize.getValue()).text();
            formData.set('name', selectedText);
        }

        // Explicitly send a boolean-compatible value for is_active
        formData.set('is_active', $('#godown_active').is(':checked') ? 1 : 0);

        const url = op === 'update' && godownId ? `/godowns/${godownId}` : '/godowns';

        $.ajax({
            type: 'POST',
            url,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function () {
                $('#notifDiv').fadeIn().css('background', 'green').text('Godown saved successfully');
                setTimeout(() => $('#notifDiv').fadeOut(), 3000);
                closeSidebar();
                fetchGodowns();
            },
            error: function () {
                $('#notifDiv').fadeIn().css('background', 'red').text('Error while saving godown');
                setTimeout(() => $('#notifDiv').fadeOut(), 3000);
            }
        });
    });
});

let godownSelectize = null;

function initGodownSelectize() {
    const $select = $('select.godown_name');
    if (!$select.length || godownSelectize) return;

    godownSelectize = $select.selectize({
        create: true,
        persist: false,
        valueField: 'value',
        labelField: 'text',
        searchField: 'text',
        options: [],
        onChange: function (value) {
            const selectedOption = this.getItem(value);
            $('#hidden_godown_name').val($(selectedOption).text());
        }
    })[0].selectize;
}

function fetchGodowns() {
    $('#tblLoader').show();
    $('.body').hide();

    $.ajax({
        type: 'GET',
        url: '/godowns',
        dataType: 'json',
        success: function (response) {
            $('#tblLoader').hide();
            const $body = $('.body');
            $body.show();

            let rows = '';
            if (response.godowns && response.godowns.length) {
                response.godowns.forEach(function (g) {
                    rows += `
                        <tr>
                            <td>${g.id}</td>
                            <td>${g.name}</td>
                            <td>${g.code || ''}</td>
                            <td class=\"text-capitalize\">${g.type}</td>
                            <td>${g.is_active ? 'Active' : 'Inactive'}</td>
                            <td>
                                <button class=\"btn btn-sm btn-info openDataSidebarForUpdateGodown\" id=\"${g.id}\">Edit</button>
                            </td>
                        </tr>
                    `;
                });
            } else {
                rows = '<tr><td colspan=\"6\" class=\"text-center\">No godowns found.</td></tr>';
            }

            $body.html(`
                <div class=\"table-responsive\">
                    <table class=\"table table-bordered table-striped\">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Code</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th width=\"80\">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            `);

            initGodownSelectize();
        },
        error: function () {
            $('#tblLoader').hide();
            $('#notifDiv').fadeIn().css('background', 'red').text('Error while loading godowns');
            setTimeout(() => $('#notifDiv').fadeOut(), 3000);
        }
    });
}

