var lastOp = "";
var glob_type = '';
var deleteRef = '';
$(document).ready(function() {

    fetchIngredients();

    $(document).on('click', '.openDataSidebarForAddingIngredients', function() {
        $('input[name="ingredients_id"]').val("");
        if (lastOp == "update") {
            $('input[name="ingredients_name"]').val("");
            $('input[name="ingredients_name"]').blur();
        }
        lastOp = 'add';

        if ($('#saveIngredients input[name="_method"]').length) {
            $('#saveIngredients input[name="_method"]').remove();
        }

        $('input[id="operation"]').val('add');
        openSidebar();
    });

    $(document).on('click', '#saveIngredients', function() {
        if (!$('input[name="ingredients_name"]').val()) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        $('#saveIngredients').attr('disabled', 'disabled');
        $('#cancelIngredients').attr('disabled', 'disabled');
        $('#saveIngredients').text('Processing..');

        var ajaxUrl = "/Ingredients";
        if ($('#operation').val() !== "add") {
            ajaxUrl = "/Ingredients/" + $('input[name="ingredients_id"]').val();
        }

        $('#saveIngredientsForm').ajaxSubmit({
            type: "POST",
            url: ajaxUrl,
            data: $('#saveIngredientsForm').serialize(),
            cache: false,
            success: function(response) {
                if (JSON.parse(response) == "success") {
                    fetchIngredients();
                    $('#saveIngredients').removeAttr('disabled');
                    $('#cancelIngredients').removeAttr('disabled');
                    $('#saveIngredients').text('Save');

                    $('#notifDiv').text('Ingredients have been updated successfully');
                    if ($('#operation').val() !== "update") {
                        $('#saveIngredientsForm').find("input[name='ingredients_name']").val("");
                        $('#saveIngredientsForm').find("select").val("0").trigger('change');
                        $('#notifDiv').text('Ingredients have been added successfully');
                    }

                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#saveIngredients').removeAttr('disabled');
                    $('#cancelIngredients').removeAttr('disabled');
                    $('#saveIngredients').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add Ingredients at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            },
            error: function(err) {
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function(i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                    });
                }
            }
        });

    });

    $(document).on('click', '.openDataSidebarForUpdateIngredients', function() {
        $('input[id="operation"]').val('update');
        lastOp = 'update';
        $('#dataSidebarLoader').show();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();

        var id = $(this).attr('id');
        $('input[name="ingredients_id"]').val(id);

        if (!$('#saveIngredientsForm input[name="_method"]').length) {
            $('#saveIngredientsForm').append('<input name="_method" value="PUT" hidden />');
        }

        $.ajax({
            type: 'GET',
            url: '/Ingredients/' + id,
            success: function(response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="ingredients_name"]').focus();
                $('input[name="ingredients_name"]').val(response.ingredients_name);
                $('input[name="ingredients_name"]').blur();
            }
        });

        openSidebar();
    });

    $(document).on('click', '.deleteIngredients', function(){
        var id = $(this).attr('id');
        glob_type = $(this).attr('name');
        $('.confirm_delete').attr('id', id);
        deleteRef = $(this);
        $('#hidden_btn_to_open_modal').click();
    })

    $(document).on('click', '.confirm_delete', function() {
        var IngredientId = $(this).attr('id');
        var thisRef = $(this);
        thisRef.attr('disabled', 'disabled');
        deleteRef.parent().ajaxSubmit({
            type: "POST",
            url: '/Ingredients/' + IngredientId,
            data: deleteRef.parent().serialize(),
            cache: false,
            success: function(response) {
                if (response) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Ingredient have been deleted');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    thisRef.removeAttr('disabled');
                    deleteRef.parent().parent().parent().remove();
                    $('.cancel_delete_modal').click();
                } else {
                    document.write(response);
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to delete the Ingredient at this moment');
                    setTimeout(() => {
                        thisRef.removeAttr('disabled');
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        });
    });
});

function fetchIngredients() {
    $.ajax({
        type: 'GET',
        url: '/GetIngredients',
        success: function(response) {
            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap ingredientsTable" style="width:100%;"><thead><tr><th>S.No</th><th>Ingredients</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.ingredientsTable tbody').empty();
            var response = JSON.parse(response);
            var sNo = 1;
            response.forEach(element => {
                $('.ingredientsTable tbody').append('<tr><td>' + sNo++ + '</td><td>' + element['ingredients_name'] + '</td><td><button id="' + element['id'] + '" class="btn btn-default btn-line openDataSidebarForUpdateIngredients">Edit</button><form id="deleteIngredientsForm" style="display: inline-block"><input type="text" name="_method" value="DELETE" hidden /><input type="text" name="_token" value="' + $('meta[name="csrf_token"]').attr('content') + '" hidden /><button type="button" id="' + element['id'] + '" class="btn btn-default red-bg deleteIngredients" name="ingredients" title="Delete">Delete</button></form></td></tr>');
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.ingredientsTable').DataTable();
        }
    });
}
