var lastOp = "";
var glob_type = '';
var deleteRef = '';
var ingArray = [];
var ingValue = 0;
var recipeName = '';
var checkUrl = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

$(document).ready(function() {
    $('.addBody').append('<table class="table table-hover dt-responsive nowrap addItemsTable" style="width:100%;"><thead><tr><th>id</th><th>Ingredient Name</th><th>Ingredient Value</th><th>Action</th></tr></thead><tbody></tbody><tfoot><tr><th ></th><th style="text-align:right">Total:</th><th id="totalIngVal">0.00%</th><th></th></tr></tfoot></table>');
    $('.addItemsTable').DataTable();
    $('.editItemsTable').DataTable();

    fetchItems();


    //var id = window.location.href.substring(window.location.href.lastIndexOf('/') + 2);



    if(checkUrl == 'edit#' || checkUrl == 'edit'){
        var str = window.location.href;
        var arr = str.split('/');
        var r_id = arr[arr.length-2];
        //alert(r_id);
        fetchItemsIng(r_id);
    }

    $(document).on('click', '.deleteItems', function(){
        var id = $(this).attr('id');
        glob_type = $(this).attr('name');
        $('.confirm_delete').attr('id', id);
        deleteRef = $(this);
        $('#hidden_btn_to_open_modal').click();
    })

    $(document).on('click', '.confirm_delete', function() {
        var RecipeId = $(this).attr('id');
        var thisRef = $(this);
        thisRef.attr('disabled', 'disabled');
        deleteRef.parent().ajaxSubmit({
            type: "POST",
            url: '/Items/' + RecipeId,
            data: deleteRef.parent().serialize(),
            cache: false,
            success: function(response) {
                if (response) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Items have been deleted');
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
                    $('#notifDiv').text('Unable to delete the Items at this moment');
                    setTimeout(() => {
                        thisRef.removeAttr('disabled');
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        });
    });
});

function fetchItemsIng(id) {

    $.ajax({
        type: 'GET',
        url: '/fetchItemsIng/'+ id,
        success: function(response) {
            var response = JSON.parse(response);
            ingArray = [];
            ingValue = 0;
            response.forEach(element => {
                ingArray.push({ingId: String(element['ing_id']),  ingName:  element['ingredients_name'],value:element['ingredients_value']});
                ingValue += +element['ingredients_value'];
                $('#ingAdd_'+element['ing_id']).addClass('red-bg');
                $('#ingAdd_'+element['ing_id']).text('Remove');
                $('#ingAdd_'+element['ing_id']).attr("onclick","removeIng('"+element['ing_id']+"','"+element['ingredients_name']+"')");
            });
            $('#totalIngVal').text(ingValue+'%');
            console.log(ingArray);
        }
    });
}

function fetchItems() {
    var origin   = window.location.origin;
    //alert(origin);
    $.ajax({
        type: 'GET',
        url: '/GetItems',
        success: function(response) {
            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap ItemsTable" style="width:100%;"><thead><tr><th>S.No</th><th>Items Name</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.ItemsTable tbody').empty();
            var response = JSON.parse(response);
            var sNo = 1;
            response.forEach(element => {
                $('.ItemsTable tbody').append('<tr><td>' + sNo++ + '</td><td>' + element['item_recipe_name'] + '</td><td><a id="' + element['id'] + '" class="btn btn-default btn-line" href="'+origin+'/Items/' + element['id'] + '/edit">Edit</a><form id="deleteIngredientsForm" style="display: inline-block"><input type="text" name="_method" value="DELETE" hidden /><input type="text" name="_token" value="' + $('meta[name="csrf_token"]').attr('content') + '" hidden /><button type="button" id="' + element['id'] + '" class="btn btn-default red-bg deleteItems" name="items" title="Delete">Delete</button></form></td></tr>');
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.ItemsTable').DataTable();
        }
    });
}

function addIng(id,name){

    $('#ingAdd_'+id).addClass('red-bg');
    $('#ingAdd_'+id).text('Remove');
    $('#ingAdd_'+id).attr("onclick","removeIng('"+id+"','"+name+"')");
    //alert(name);
    ingArray.push({ingId: id,  ingName:  name,value:''});
    //alert(id);
    //console.log(ingArray);
}

function removeIng(id,name) {


    for (var i = 0; i < ingArray.length; i++)
        if (ingArray[i].ingId && ingArray[i].ingId === id) {
            ingArray.splice(i, 1);
            break;
        }
    $('#ingAdd_'+id).removeClass('red-bg');
    $('#ingAdd_'+id).text('Add');
    $('#ingAdd_'+id).attr("onclick","addIng('"+id+"','"+name+"')");

    console.log(ingArray);

}

$(document).on('click', '.addIngBtn', function() {
    ingValue = 0;
    $('#totalIngVal').text('0.00%');

    if(checkUrl == 'edit#' || checkUrl == 'edit'){

        if (Array.isArray(ingArray) && ingArray.length) {
            console.log(ingArray);
            $('.editBody').empty();
            $('.editBody').append('<table class="table table-hover dt-responsive nowrap editItemsTable" style="width:100%;"><thead><tr><th>id</th><th>Ingredient Name</th><th>Ingredient Value</th><th>Action</th></tr></thead><tbody></tbody><tfoot><tr><th ></th><th style="text-align:right">Total:</th><th id="totalIngVal">0.00%</th><th></th></tr></tfoot></table>');
            $('.editItemsTable tbody').empty();
            var sNo = 1;
            ingArray.forEach(element => {
                $('.editItemsTable tbody').append('<tr><td>' + element['ingId'] + '</td><td>' + element['ingName'] + '</td><td><input type="number" class="form-control text-filed" name="ingValue" id="ingValue_'+ element['ingId']+'" onchange="plusIngValues('+element['ingId']+');"></td><td><button type="button" name="' + element['ingName'] + '" id="' + element['ingId'] + '" class="btn btn-default red-bg removeIngBtnGrid" title="Delete">Remove</button></td></tr>');
            });
            $('#tblLoader').hide();
            $('.editBody').fadeIn();
            $('.editItemsTable').DataTable();
            closeSidebar();
        }else{
            alert('please select Ingredients');
            return false;
        }

    }else{
        if (Array.isArray(ingArray) && ingArray.length) {
            console.log(ingArray);
            $('.addBody').empty();
            $('.addBody').append('<table class="table table-hover dt-responsive nowrap addItemsTable" style="width:100%;"><thead><tr><th>id</th><th>Ingredient Name</th><th>Ingredient Value</th><th>Action</th></tr></thead><tbody></tbody><tfoot><tr><th ></th><th style="text-align:right">Total:</th><th id="totalIngVal">0.00%</th><th></th></tr></tfoot></table>');
            $('.addItemsTable tbody').empty();
            var sNo = 1;
            ingArray.forEach(element => {
                $('.addItemsTable tbody').append('<tr><td>' + element['ingId'] + '</td><td>' + element['ingName'] + '</td><td><input type="number" class="form-control text-filed" name="ingValue" id="ingValue_'+ element['ingId']+'" onchange="plusIngValues('+element['ingId']+');"></td><td><button type="button" name="' + element['ingName'] + '" id="' + element['ingId'] + '" class="btn btn-default red-bg removeIngBtnGrid" title="Delete">Remove</button></td></tr>');
            });
            $('#tblLoader').hide();
            $('.addBody').fadeIn();
            $('.addItemsTable').DataTable();
            closeSidebar();
        }else{
            alert('please select Ingredients');
            return false;
        }
    }




});

$(document).on('click', '.removeIngBtnGrid', function() {

    var id = $(this).attr('id');
    var name = $(this).attr('name');

    ingValue = 0;
    $('#totalIngVal').text('0.00%');
    //console.log(ingArray);
    for (var i = 0; i < ingArray.length; i++){
        if (ingArray[i].ingId && ingArray[i].ingId === id) {
            console.log('yes');
            ingArray.splice(i, 1);
            break;
        }
    }

    $(this).parent().parent().remove();
    $('#ingAdd_'+id).removeClass('red-bg');
    $('#ingAdd_'+id).text('Add');
    $('#ingAdd_'+id).attr("onclick","addIng('"+id+"','"+name+"')");

    console.log(ingArray);
});

$(document).on('click', '#productlist01', function() {

    var item_recipe_name = $("#item_recipe_name").val();
    if(item_recipe_name == ''){
        alert('please enter Items name');
        closeSidebar();
        return false;
    }else{
        recipeName = item_recipe_name;
    }


});

function plusIngValues(id) {

    var val = $("#ingValue_"+id).val() || 0;
    //ingValue += +val;
    //console.log(ingValue);
    //console.log(ingArray);
    $('#totalIngVal').text('0.00%');

    /// add value in object
    var objIndex = ingArray.findIndex((obj => obj.ingId == id));
    ingArray[objIndex].value = val;

    ingValue = 0;
    const totalValues = ingArray.reduce((sum, currentValue) => {
        return sum + Number(currentValue.value);
    }, 0);
    ingValue = totalValues;
    console.log(totalValues);
    $('#totalIngVal').text(ingValue+'%');
}

$(document).on('click', '.saveIngForm', function() {

   var getReciptName = document.getElementById("item_recipe_name").value;
    recipeName = getReciptName;
    if(ingValue ===100){
        if(recipeName != '' && recipeName != null){
            if(checkUrl == 'edit#' || checkUrl == 'edit'){

                var str = window.location.href;
                var arr = str.split('/');
                var r_id = arr[arr.length-2];

                $.ajax({
                    type: 'POST',
                    url: '/editItemsData',
                    data: {data: ingArray,recipeName:recipeName,r_id:r_id},
                    cache: false,
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
                    },
                    success: function(response) {
                        if(response == 1){
                            window.location = "/Items";
                        }
                    }
                });

            }else{
                $.ajax({
                    type: 'POST',
                    url: '/saveItemsData',
                    data: {data: ingArray,recipeName:recipeName},
                    cache: false,
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
                    },
                    success: function(response) {
                        if(response == 1){
                            window.location = "/Items";
                        }
                    }
                });
            }


        }else{
            alert('please enter Items name');
            return false;
        }
        console.log(recipeName);
        //alert('yes');

    }else{
        alert('Ingredient Value Not 100%');
    }


});




