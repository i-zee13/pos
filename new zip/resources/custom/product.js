currentWizardStep = 1;
brandType = "new";
productType = "new";
Dropzone.autoDiscover = false;
var brandImgsToken;

allProducts = [];
allItems = [];

var segments = location.href.split('/');

var container20FtCbmLimit = 29.25077203;
var container40FtCbmLimit = 57.66580772;
var container40FtHcCbmLimit = 73.54479825;
var allProductsArray = [];
var total_records = 0;
var totalPages = 0;
var all_products_gallery = [];
var current_active_page = 1;

let itemsAddedFromAddProductPage = [];
let uuId = 1;
let updatingTmpRecId = null;

let productsTbl = null;

var glob_type = '';
var deleteRef = '';

$(document).ready(function () {

    var action = segments[3];

    if (action === "BrandProducts")
        fetchProducts();

    if (action == "ProductItems")
        fetchItems(segments[4]);

    if (action.includes("Gallery"))
        fetchProductsForGallery();

    if (action == 'ProductDetail')
        fetchForProductDetail(segments[4]);

    if (action == 'items')
        fetchAllItems();

    if (action == 'ProductOrderOccurence')
        fetchAllOccurences();

    $(document).on('input', '#ttlQtyCbmCalc', function () {
        if (!$(this).val())
            return;
        updateContainer20Ft();
    });

    $(document).on('input', '#additionalWeightPerCtnCbmCalc', function () {
        if ($('#ttlQtyCbmCalc').val())
            updateContainer20Ft();
    });
    $('#addFromListPage').on('click', function () {
        openSidebar();
    })
     //remove the border if it is red
    $(document).on('input','.required', function () {
        $(this).css('border','0px');
        if($(this).val() ===''){
            $(this).css('border','1px solid red');
        }
    })
    $(document).on('click', '.editItemSidebar', function () {
        openSidebar();

        $('[name="variant_id_2"]').val(0).trigger('change')
        $('[name="variant_quantity_2"]').val("").blur()

        $('[name="variant_id_3"]').val(0).trigger('change')
        $('[name="variant_quantity_3"]').val("").blur()

        let itemId = $(this).attr('attr-id')
        let activeItem = allItems.find(x => x.id == itemId)
        if (activeItem.unit_id) {
            $('#unitDDSidebar').val(activeItem.unit_id).trigger('change')
        }
        if (activeItem.variant_id) {
            $('#variantDDSidebar').val(activeItem.variant_id).trigger('change')
        }
        if (activeItem.variant_id_2) {
            $('[name="variant_id_2"]').val(activeItem.variant_id_2).trigger('change')
            $('[name="variant_quantity_2"]').val(activeItem.variant_quantity_2).focus().blur()
        }
        if (activeItem.variant_id_3) {
            $('[name="variant_id_3"]').val(activeItem.variant_id_3).trigger('change')
            $('[name="variant_quantity_3"]').val(activeItem.variant_quantity_3).focus().blur()
        }

        $('[name="item_id"]').val(itemId);

        $('input[name="unit_quantity"]').focus();
        $('[name="unit_quantity"]').val(activeItem.unit_quantity)
        $('input[name="unit_quantity"]').blur();

        $('input[name="unit_weight"]').focus();
        $('[name="unit_weight"]').val(activeItem.unit_weight)
        $('input[name="unit_weight"]').blur();

        $('input[name="unit_variant_quantity"]').focus();
        $('[name="unit_variant_quantity"]').val(activeItem.unit_variant_quantity)
        $('input[name="unit_variant_quantity"]').blur();

        $('input[name="actual_cbm"]').focus();
        $('[name="actual_cbm"]').val(activeItem.actual_cbm)
        $('input[name="actual_cbm"]').blur();

        $('input[name="length"]').focus();
        $('[name="length"]').val(activeItem.length)
        $('input[name="length"]').blur();

        $('input[name="width"]').focus();
        $('[name="width"]').val(activeItem.width)
        $('input[name="width"]').blur();

        $('input[name="height"]').focus();
        $('[name="height"]').val(activeItem.height)
        $('input[name="height"]').blur();

        $('input[name="name"]').focus();
        $('[name="name"]').val(activeItem.name)
        $('input[name="name"]').blur();

        $('input[name="cbm_value"]').focus();
        $('[name="cbm_value"]').val(activeItem.cbm_value)
        $('input[name="cbm_value"]').blur();

        $('input[name="cbm_value_label"]').focus();
        $('[name="cbm_value_label"]').val(activeItem.cbm_value)
        $('input[name="cbm_value_label"]').blur();

        $('input[name="master_carton_unit_price"]').focus();
        $('[name="master_carton_unit_price"]').val(activeItem.master_carton_unit_price)
        $('input[name="master_carton_unit_price"]').blur();

        $('input[name="description"]').focus();
        $('[name="description"]').val(activeItem.description)
        $('input[name="description"]').blur();
        // from here
        $('input[name="variant_1_packiging_weigth"]').focus();
        $('[name="variant_1_packiging_weigth"]').val(activeItem.variant_1_packiging_weigth)
        $('input[name="variant_1_packiging_weigth"]').blur();

        $('input[name="variant_2_packiging_weigth"]').focus();
        $('[name="variant_2_packiging_weigth"]').val(activeItem.variant_2_packiging_weigth)
        $('input[name="variant_2_packiging_weigth"]').blur();

        $('input[name="variant_3_packiging_weigth"]').focus();
        $('[name="variant_3_packiging_weigth"]').val(activeItem.variant_3_packiging_weigth)
        $('input[name="variant_3_packiging_weigth"]').blur();

        $('input[name="master_carton_packiging_weigth"]').focus();
        $('[name="master_carton_packiging_weigth"]').val(activeItem.master_carton_packiging_weigth)
        $('input[name="master_carton_packiging_weigth"]').blur();

        $('input[name="variant_unit_price"]').focus();
        $('[name="variant_unit_price"]').val(activeItem.variant_unit_price)
        $('input[name="variant_unit_price"]').blur();


    });

    $(document).on('click', '.editProductSidebar', function () {
        openSidebar();

        let productId = $(this).attr('attr-id')
        let activeProduct = allProducts.find(x => x.id == productId)
        if (activeProduct.primary_service_id) {
            $('#mainCatDDProductsSidebar').val(activeProduct.primary_service_id).trigger('change')
        }
        if (activeProduct.sub_category_id) {
            $('#subCatDD').val(activeProduct.sub_category_id).trigger('change')
        }

        $('[name="product_id"]').val(productId);

        $('input[name="sku"]').focus();
        $('[name="sku"]').val(activeProduct.sku)
        $('input[name="sku"]').blur();
        $('input[name="name"]').focus();
        $('[name="name"]').val(activeProduct.name)
        $('input[name="name"]').blur();

        $('#thumbnaildropifyDiv').empty();
        $('#thumbnaildropifyDiv').append(`<input type="file" name="thumbnail" id="thumbnail" class="dropify" accept="image/x-png,image/jpg,image/jpeg" />`);
        $('#thumbnaildropifyDiv input').attr("data-default-file", activeProduct.picture);
        $('#thumbnaildropifyDiv input').dropify();

        $('#pictureDropifyDiv').empty();
        $('#pictureDropifyDiv').append(`<input type="file" name="picture" id="picture" class="dropify" accept="image/x-png,image/jpg,image/jpeg" />`);
        $('#pictureDropifyDiv input').attr("data-default-file", activeProduct.detailed_picture);
        $('#pictureDropifyDiv input').dropify();

        $('[name="description"]').val(activeProduct.description);
    });

    $('#mainCatDDProductsSidebar').change(function () {
        let mainCatId = $(this).val()
        let subCats = secServices.filter(x => x.primary_service_id == mainCatId);
        if (subCats.length)
            $("#subCatDD").empty();
        subCats.forEach(element => {
            var newSubCat = new Option(element.service_name, element.id, true, true);
            $("#subCatDD").append(newSubCat);
        });
    });

    $('#saveItemsAddProductPage').click(function () {
       
        let dirty = false;
        $('.required').css('border', '0px');
        $('.required').each(function () {
            if (!$(this).val()) {
                dirty = true;
                $(this).css('border', '1px solid red')
            }
        });

        if (dirty) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        let isNegitive = false;
        $('.positive').css('border', '0px');
        $('.positive').each(function () {
            if ($(this).val() <= 0 && $(this).val() != '') {
                isNegitive = true;
                $(this).css('border', '1px solid red');
            }
        });
        if(isNegitive){
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Value Cannot Zero Or Less Than Zero');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
       
        if ($('#variantDDSidebar').val() == '0' && $('[name="unit_quantity"]').val()) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select variant carefully");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
        if ($('#variantDDSidebar').val() == '0' && $('[name="variant_1_packiging_weigth"]').val()) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select variant carefully");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
       
        if ($('#variantDDSidebar').val() == '0' && $('[name="unit_quantity"]').val() && $('[name="variant_1_packiging_weigth"]').val()  ) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select variant carefully");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
        if ($('#variantDDSidebar').val() != 0 && $('[name="variant_1_packiging_weigth"]').val() != "" && $('[name="unit_quantity"]').val() =="" ) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please Provide The Quantity");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }

        //for second variant 
        if ($('[name="variant_id_2"]').val() == '0' && $('[name="variant_quantity_2"]').val() != '') {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select Second variant carefully");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
        if ($('[name="variant_id_2"]').val() == '0' && $('[name="variant_2_packiging_weigth"]').val() != "") {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select Second variant carefully");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
       
        if ($('[name="variant_id_2"]').val() == '0' && $('[name="variant_quantity_2"]').val() != "" && $('[name="variant_2_packiging_weigth"]').val() != "" ) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select Second variant carefully");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
      
        // for third variant
        if ($('[name="variant_id_3"]').val() == '0' && $('[name="variant_quantity_3"]').val() != '') {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select variant carefully");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
        if ($('[name="variant_id_3"]').val() == '0' && $('[name="variant_3_packiging_weigth"]').val() != "") {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select variant carefully");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
       
        if ($('[name="variant_id_3"]').val() == '0' && $('[name="variant_quantity_3"]').val() != "" && $('[name="variant_3_packiging_weigth"]').val() != "" ) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select variant carefully");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }

        let itemObj = {};

        if (updatingTmpRecId)
            itemObj = itemsAddedFromAddProductPage.find(x => x.id == updatingTmpRecId);

        if (!updatingTmpRecId)
            itemObj.id = uuId++;

        itemObj.description = $('[name="description_item"]').val();
        itemObj.unit = {
            id: $('#unitDDSidebar').val(),
            name: $.trim($('#unitDDSidebar :selected').text()),
            weight: $('[name="unit_weight"]').val()
           
        }

        itemObj.variant_1 = {
            id: $('#variantDDSidebar').val() != '0' ? $('#variantDDSidebar').val() : null,
            name: $('#variantDDSidebar :selected').val() != '0' ? $.trim($('#variantDDSidebar :selected').text()) : '',
            unit_qty: $('[name="unit_quantity"]').val() != '0' ? $('[name="unit_quantity"]').val() : null,
            variant_1_packiging_weigth: $('[name="variant_1_packiging_weigth"]').val() != '0' ? $('[name="variant_1_packiging_weigth"]').val() : null,
        }
        itemObj.variant_2 = {
            id: $('[name="variant_id_2"]').val() != '0' ? $('[name="variant_id_2"]').val() : null,
            name: $('[name="variant_id_2"] :selected').val() != '0' ? $.trim($('[name="variant_id_2"] :selected').text()) : null,
            var_1_qty: $('[name="variant_quantity_2"]').val() != '0' ? $('[name="variant_quantity_2"]').val() : null,
            variant_2_packiging_weigth: $('[name="variant_2_packiging_weigth"]').val(),
        }
        itemObj.variant_3 = {
            id: $('[name="variant_id_3"]').val() != '0' ? $('[name="variant_id_3"]').val() : null,
            name: $('[name="variant_id_3"] :selected').val() != '0' ? $.trim($('[name="variant_id_3"] :selected').text()) : null,
            var_2_qty: $('[name="variant_quantity_3"]').val() != '0' ? $('[name="variant_quantity_3"]').val() : null,
            variant_3_packiging_weigth: $('[name="variant_3_packiging_weigth"]').val(),
        }
        itemObj.ctn_size = $.trim($('[name="unit_variant_quantity"]').val())
        itemObj.master_carton_packiging_weigth = $.trim($('[name="master_carton_packiging_weigth"]').val())
        itemObj.length = $.trim($('[name="length"]').val())
        itemObj.width = $.trim($('[name="width"]').val())
        itemObj.height = $.trim($('[name="height"]').val())
        itemObj.cbm = (!isNaN(parseFloat($('[name="length"]').val())) && !isNaN(parseFloat($('[name="width"]').val())) && !isNaN(parseFloat($('[name="height"]').val())) ? ((parseFloat($('[name="width"]').val()) * parseFloat($('[name="height"]').val()) * parseFloat($('[name="length"]').val()) * 16.39) / 1000000).toFixed(2) : 0)
        itemObj.actual_cbm = $('[name="actual_cbm"]').val() ? $.trim($('[name="actual_cbm"]').val()) : 0
        itemObj.master_carton_unit_price = $('[name="master_carton_unit_price"]').val() ? $.trim($('[name="master_carton_unit_price"]').val()) : 0
        itemObj.variant_unit_price = $('[name="variant_unit_price"]').val() ? $.trim($('[name="variant_unit_price"]').val()) : 0
        //from
        itemObj.variant_1_packiging_weigth = $('[name="variant_1_packiging_weigth"]').val() ? $.trim($('[name="variant_1_packiging_weigth"]').val()) : 0
        itemObj.variant_2_packiging_weigth = $('[name="variant_2_packiging_weigth"]').val() ? $.trim($('[name="variant_2_packiging_weigth"]').val()) : 0
        itemObj.variant_3_packiging_weigth = $('[name="variant_3_packiging_weigth"]').val() ? $.trim($('[name="variant_3_packiging_weigth"]').val()) : 0
        itemObj.unit_weight  = $('[name="unit_weight"]').val();
        itemObj.unit_quantity =  $('[name="unit_quantity"]').val() != '0' ? $('[name="unit_quantity"]').val() : null,
        itemObj.variant_quantity_2 = $('[name="variant_quantity_3"]').val() != '0' ? $('[name="variant_quantity_3"]').val() : null 
        itemObj.variant_quantity_3 =  $('[name="variant_3_packiging_weigth"]').val() != '0' ? $('[name="variant_3_packiging_weigth"]').val() : null,
        itemObj.unit_variant_quantity =  $('[name="unit_variant_quantity"]').val() != '0' ? $('[name="unit_variant_quantity"]').val() : null,
        itemObj.master_carton_packiging_weigth =  $('[name="master_carton_packiging_weigth"]').val() != '0' ? $('[name="master_carton_packiging_weigth"]').val() : null,
        itemObj.name = $('[name="name"]').val()
        itemObj.description = $('[name="item_description"]').val()

        //to 
        itemObj.alias = itemObj.unit.weight + "gmx" + (itemObj.variant_1.id ? itemObj.variant_1.unit_qty + "x" : '') + (itemObj.variant_2.var_1_qty && itemObj.variant_2.id ? itemObj.variant_2.var_1_qty + "x" : "") + (itemObj.variant_3.var_2_qty && itemObj.variant_3.id ? itemObj.variant_3.var_2_qty + "x" : "") + itemObj.ctn_size;

        if (!updatingTmpRecId)
            itemsAddedFromAddProductPage.push(itemObj);

        $('#productsTblDiv').html(`
            <div class="col-12">
                <div class="row title-row">
                    <div class="col-3 col-sn"><strong>S.No</strong></div>
                    <div class="col"><strong>Name</strong></div>
                    <div class="col-3 all-col"><strong>Variant</strong></div>
                    <div class="col-3 all-col"><strong>Unit Type</strong></div>
                    <div class="col-3 all-col"><strong>Unit Weight</strong></div>
                    <div class="col-3 all-col"><strong>CBM</strong></div>
                    <div class="col-3 all-col"><strong>Actual CBM</strong></div>
                    <div class="col action-col"><strong>Action</strong></div>
                </div>
            </div>
        `);
        itemsAddedFromAddProductPage.forEach((ia, idx) => {
            
            $('#productsTblDiv').append(`
            <div class="col-12">
                <div class="row detail-row">
                    <div class="col-3 col-sn">${idx + 1}</div>
                    <div class="col">${ia.unit.weight + "gmx" + ia.variant_1.unit_qty + "x" + (ia.variant_2.var_1_qty && ia.variant_2.id ? ia.variant_2.var_1_qty + "x" : "") + (ia.variant_3.var_2_qty && ia.variant_3.id ? ia.variant_3.var_2_qty + "x" : "") + ia.ctn_size}</div>
                    <div class="col-3 all-col">${ia.variant_1.name}</div>
                    <div class="col-3 all-col">${ia.unit.name}</div>
                    <div class="col-3 all-col">${ia.unit.weight}</div>
                    <div class="col-3 all-col">${ia.cbm}</div>
                    <div class="col-3 all-col">${ia.actual_cbm}</div>
                    <div class="col-4 action-col">
                        <button class="btn smBTN btn-line mb-0 editTmpItem" rec-id="${ia.id}">Edit</button>
                        <button class="btn smBTN mb-0" data-toggle="collapse" rec-id="${ia.id}" href="#collapseExample-${idx + 1}" role="button" aria-expanded="false" aria-controls="collapseExample-${idx + 1}">View Detail</button>
                        <button class="btn smBTN deleteItemFromTmpList red-bg mb-0" rec-id="${ia.id}">Delete</button>
                    </div>
                </div>
            </div>
            <div class="col-12 collapse" id="collapseExample-${idx + 1}" colspan="9">
                <div class="items-Details-td">
                    <button type="button" class="close alert_close" data-toggle="collapse" href="#collapseExample-${idx + 1}" role="button" aria-expanded="true" aria-controls="collapseExample-${idx + 1}"> <span aria-hidden="true">×</span>
                    </button>
                    <strong>Description: </strong> ${ia.description}
                    <div class="row PT-10">
                        <div class="col"><strong style="display: block">Unit Weight </strong> ${ia.unit.weight}</div>
                        ${ia.variant_1.id ? '<div class="col"><strong style="display: block">' + ia.variant_1.name + ' QTY. </strong> ' + ia.variant_1.unit_qty + '</div>' : ''}
                        ${ia.variant_2.id ? '<div class="col"><strong style="display: block">' + ia.variant_2.name + ' QTY. </strong> ' + ia.variant_2.var_1_qty + '</div>' : ''}
                        ${ia.variant_3.id ? '<div class="col"><strong style="display: block">' + ia.variant_3.name + ' QTY. </strong> ' + ia.variant_3.var_2_qty + '</div>' : ''}
                        <div class="col"><strong style="display: block">Carton QTY. </strong> ${ia.ctn_size}</div>
                    </div>
                </div>
            </div>
        `);
        })

        $('#productsTblDiv table').DataTable()

        $(this).text('Saved');
        setTimeout(() => {
            $('#saveItemForm input').val("").blur()
            $('#saveItemForm select').val(0).trigger('change')
            $('#saveItemForm textarea').val("")
            closeSidebar();
            $(this).text('Save');
        }, 500);
        updatingTmpRecId = null;
    });

    $(document).on('click', '#addTmpItem', function () {
        $('#saveItemForm input').val("").blur()
        $('#saveItemForm select').val(0).trigger('change')
        $('#saveItemForm textarea').val("")
        updatingTmpRecId = null;
        $('.required').css('border', '0px');
        openSidebar();
    });

    $('#saveProductBtn').click(function () {
        
        let dirty = false
        $('.requiredAddProduct').each(function () {
            if (!$(this).val())
                dirty = true
        })

        if (dirty || !itemsAddedFromAddProductPage.length) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select variants carefully");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }

        $(this).text('Saving').attr('disabled', true);

        $('#saveProductForm').ajaxSubmit({
            type: "POST",
            url: '/SaveProductRevamp',
            data: {
                items: itemsAddedFromAddProductPage
            },
            cache: false,
            success: function (response) {
                if (response.code == 200) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Product have been added successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                        location.href = "/Products";
                    }, 3000);
                } else if (response.code == 101 || response.code == 100) {
                    $(this).text('Save').removeAttr('disabled');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to save product information. Following exception occured: ' + response.message);
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 5000);
                } else {
                    $(this).text('Save').removeAttr('disabled');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to save items information but product is saved. Following exception occured: ' + response.message);
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 5000);
                }
            }.bind($(this))
        });

    })

    $(document).on('click', '.editTmpItem', function () {
        updatingTmpRecId = $(this).attr('rec-id')
        openSidebar();
        let itmFnd = itemsAddedFromAddProductPage.find(x => x.id == updatingTmpRecId)
        $('[name="description_item"]').val(itmFnd.description)

        $('#unitDDSidebar').val(itmFnd.unit.id).trigger('change')
        $('[name="unit_weight"]').val(itmFnd.unit.weight)

        $('#variantDDSidebar').val(itmFnd.variant_1.id).trigger('change')
        $('[name="unit_quantity"]').val(itmFnd.variant_1.unit_qty)

        if (itmFnd.variant_2.id) {
            $('[name="variant_id_2"]').val(itmFnd.variant_2.id).trigger('change')
            $('[name="variant_quantity_2"]').val(itmFnd.variant_2.var_1_qty).focus()
        } else {
            $('[name="variant_id_2"]').val(0).trigger('change')
            $('[name="variant_quantity_2"]').val("").focus()
        }

        if (itmFnd.variant_3.id) {
            $('[name="variant_id_3"]').val(itmFnd.variant_3.id).trigger('change')
            $('[name="variant_quantity_3"]').val(itmFnd.variant_3.var_2_qty).focus()
        } else {
            $('[name="variant_id_3"]').val(0).trigger('change')
            $('[name="variant_quantity_3"]').val("").focus()
        }

        $('[name="cbm_value_label"]').val(itmFnd.cbm).focus()
        $('[name="actual_cbm"]').val(itmFnd.actual_cbm).focus()
        $('[name="length"]').val(itmFnd.length).focus()
        $('[name="width"]').val(itmFnd.width).focus()
        $('[name="height"]').val(itmFnd.height).focus()
        $('[name="unit_variant_quantity"]').val(itmFnd.ctn_size).focus()
        $('[name="master_carton_unit_price"]').val(itmFnd.master_carton_unit_price).focus()
        $('[name="variant_1_packiging_weigth"]').val(itmFnd.variant_1_packiging_weigth).focus()
        $('[name="variant_2_packiging_weigth"]').val(itmFnd.variant_2_packiging_weigth !==0 ? itmFnd.variant_2_packiging_weigth :'' ).focus()
        $('[name="variant_3_packiging_weigth"]').val(itmFnd.variant_3_packiging_weigth !==0 ? itmFnd.variant_3_packiging_weigth :'').focus()
        $('[name="master_carton_packiging_weigth"]').val(itmFnd.master_carton_packiging_weigth).focus()
        $('[name="variant_unit_price"]').val(itmFnd.variant_unit_price).focus()
        $('[name="name"]').val(itmFnd.name).focus()
        $('[name="item_description"]').val(itmFnd.description).focus()
    })

    $(document).on('click', '.deleteItemFromTmpList', function () {
        if (!window.confirm('Are you sure you want to remove this entry?'))
            return;
        let recId = $(this).attr('rec-id')
        $(this).parent().parent().remove();
        itemsAddedFromAddProductPage = itemsAddedFromAddProductPage.filter(x => x.id != recId);
    })

    $('#saveItemFromSidebar').click(function () {

        let dirty = false;
        $('.required').each(function () {
            if (!$(this).val())
                dirty = true;
        });

        if (dirty) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        if ($('#variantDDSidebar').val() == '0' && $('[name="unit_quantity"]').val()) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select variant carefully");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
        if ($('#variantDDSidebar').val() == '0' && $('[name="variant_1_packiging_weigth"]').val()) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select variant carefully");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
       
        if ($('#variantDDSidebar').val() == '0' && $('[name="unit_quantity"]').val() && $('[name="variant_1_packiging_weigth"]').val()  ) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select variant carefully");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
        if ($('#variantDDSidebar').val() != 0 && $('[name="variant_1_packiging_weigth"]').val() != "" && $('[name="unit_quantity"]').val() =="" ) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please Provide The Quantity");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }

        //for second variant 
        if ($('[name="variant_id_2"]').val() == '0' && $('[name="variant_quantity_2"]').val() != '') {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select Second variant carefully");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
        if ($('[name="variant_id_2"]').val() == '0' && $('[name="variant_2_packiging_weigth"]').val() != "") {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select Second variant carefully");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
       
        if ($('[name="variant_id_2"]').val() == '0' && $('[name="variant_quantity_2"]').val() != "" && $('[name="variant_2_packiging_weigth"]').val() != "" ) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select Second variant carefully");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
      
        // for third variant
        if ($('[name="variant_id_3"]').val() == '0' && $('[name="variant_quantity_3"]').val() != '') {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select variant carefully");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
        if ($('[name="variant_id_3"]').val() == '0' && $('[name="variant_3_packiging_weigth"]').val() != "") {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select variant carefully");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
       
        if ($('[name="variant_id_3"]').val() == '0' && $('[name="variant_quantity_3"]').val() != "" && $('[name="variant_3_packiging_weigth"]').val() != "" ) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select variant carefully");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
        // till here for third variant

        $(this).text('Saving..')
        $(this).attr('disabled', true)
        $('#saveItemForm').ajaxSubmit({
            type: 'POST',
            url: '/SaveItem',
            success: function (response) {
                if (JSON.parse(response).code == 200) {
                    fetchItems(segments[4]);
                    $('#pl-close').click();
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Item saved successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to update Item information');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
                $(this).text('Save')
                $(this).removeAttr('disabled')
            }.bind($(this))
        });
    });

    $('#saveProductFromSidebar').click(function () {

        let dirty = false;
        $('.required').each(function () {
            if (!$(this).val())
                dirty = true;
        });

        $(this).text('Saving..')
        $(this).attr('disabled', true)
        $('#saveProductForm').ajaxSubmit({
            type: 'POST',
            url: '/SaveProduct',
            success: function (response) {
                if (JSON.parse(response).code == 200) {
                    fetchProducts();
                    $('#pl-close').click();
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Product saved successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to update product information');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
                $(this).text('Save')
                $(this).removeAttr('disabled')
            }.bind($(this))
        });
    });

    $(document).on('click', '.deleteItem', function () {
        var id = $(this).attr('attr-id');
        glob_type = $(this).attr('name');
        $('.confirm_delete').attr('id', id);
        deleteRef = $(this);
        $('#hidden_btn_to_open_modal').click();
    })

    // $(document).on('click', '.deleteItem', function() {
    //     var result = confirm("This action will delete this item permanently");
    //     if (!result) {
    //         return;
    //     }
    //     var id = $(this).attr('attr-id');
    //     $(this).text("DELETING");
    //     $(this).attr("disabled", true);
    //     $.ajax({
    //         type: 'POST',
    //         url: '/DeleteItem',
    //         data: {
    //             id: id,
    //             _token: $("meta[name='csrf_token']").attr('content')
    //         },
    //         success: function(response) {
    //             if (JSON.parse(response).code == 200) {
    //                 $('#notifDiv').fadeIn();
    //                 $('#notifDiv').css('background', 'green');
    //                 $('#notifDiv').text('Item deleted successfully');
    //                 setTimeout(() => {
    //                     $('#notifDiv').fadeOut();
    //                 }, 3000);
    //                 $(this).parent().parent().remove();
    //             } else {
    //                 $('#notifDiv').fadeIn();
    //                 $('#notifDiv').css('background', 'red');
    //                 $('#notifDiv').text('Unable to delete Item');
    //                 setTimeout(() => {
    //                     $('#notifDiv').fadeOut();
    //                 }, 3000);
    //                 $(this).text("DELETE");
    //                 $(this).removeAttr("disabled");
    //             }
    //         }.bind($(this))
    //     });
    // });


    //Delete
    $(document).on('click', '.deleteProduct', function () {
        var id = $(this).attr('attr-id');
        glob_type = $(this).attr('name');
        $('.confirm_delete').attr('id', id);
        deleteRef = $(this);
        $('#hidden_btn_to_open_modal').click();
    })

    $(document).on('click', '.confirm_delete', function () {
        var id = $(this).attr('id');
        deleteRef.text("DELETING");
        deleteRef.attr("disabled", true);
        var thisRef = $(this);
        thisRef.attr('disabled', true);
        var url = glob_type == 'product_item' ? '/DeleteItem' : '/DeleteProduct'
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                id: id,
                _token: $("meta[name='csrf_token']").attr('content')
            },
            success: function (response) {
                if (JSON.parse(response).code == 200) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Product deleted successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    thisRef.removeAttr('disabled')
                    deleteRef.parent().parent().remove();
                    $('.cancel_delete_modal').click();
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to delete product');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    deleteRef.text("DELETE");
                    deleteRef.removeAttr("disabled");
                }
            }.bind(deleteRef)
        });
    });

    brandImgsToken = makeid();
    setTimeout(() => {
        $('#dzContainer').append('<form action="/brandImgsDzRoute" class="dropzone" id="brandImgsDzForm" method="POST" enctype="multipart/form-data"></form>');
        $('#brandImgsDzForm').append('<input name="_token" value="' + $("meta[name='csrf_token']").attr('content') + '" hidden />');
        $('#brandImgsDzForm').append('<input name="img_token" value="' + brandImgsToken + '" hidden />');
        $("form#brandImgsDzForm").dropzone({
            url: "/brandImgsDzRoute",
            addRemoveLinks: true,
            acceptedFiles: "image/*",
            init: function () {
                this.on("success", function (file, uploadedFileName) {
                    file.serverFn = uploadedFileName;
                    $('.dz-default').hide();
                });
            },
            removedfile: function (file) {
                $.ajax({
                    type: 'POST',
                    url: '/removeBrandImages',
                    data: {
                        _token: $("meta[name='csrf_token']").attr('content'),
                        fileName: file.serverFn
                    },
                    success: function (data) {
                        if (!$('.dz-image-preview').length) {
                            $('.dz-default').show();
                        }
                    }
                });
                var _ref;
                return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
            }
        });
    }, 500);

    $(document).on('click', '#saveBrand', function () {

        let dirty = false
        $('.requiredBrand').css('border', '0')
        $('.requiredBrand').each(function () {
            if (!$(this).val()) {
                dirty = true
                $(this).css('border', '1px solid red')
            }
        })

        if (dirty) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please provide all the required information");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }

        $(this).text('Saving').attr('disabled', true);

        $('#saveBrandForm').ajaxSubmit({
            type: "POST",
            url: '/SaveBrand',
            data: {
                img_token: brandImgsToken
            },
            cache: false,
            success: function (response) {
                if (response.code == 200) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Brand have been added successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                        $('[name="brand_id"]').append(`<option value="${response.id}">${response.name}</option>`)
                        $('[name="brand_id"]').val(response.id).trigger('change')
                        closeSidebar()
                    }, 3000);
                } else {
                    $(this).text('Save').removeAttr('disabled');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to save brand');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 5000);
                }
            }.bind($(this))
        });
    });

    $(document).on('change', '#mainCatDD', function () {
        fetchSubCat($(this).val());
    });

    var oldLength = 0;
    $(document).on('keydown', 'input[name="length"]', function () {
        oldLength = $(this).val();
    });

    $(document).on('input', 'input[name="length"]', function () {
        newVal = $(this).val();
        if (isNaN($(this).val()) || !$(this).val()) {
            newVal = 1;
        }
        if ($('input[name="width"]').val() && $('input[name="height"]').val()) {
            var cbmCalc = (parseFloat($('input[name="width"]').val()) * parseFloat($('input[name="height"]').val()) * parseFloat(newVal) * 16.39) / 1000000;
            $('input[name="actual_cbm"]').val(cbmCalc.toFixed(4));
            $('input[name="cbm_value"]').val(cbmCalc.toFixed(4));
        }
    });

    $('#brandsTable').DataTable();

    var oldWidth = 0;
    $(document).on('keydown', 'input[name="width"]', function () {
        oldWidth = $(this).val();
    });

    $(document).on('input', 'input[name="width"]', function () {
        newVal = $(this).val();
        if (isNaN($(this).val()) || !$(this).val()) {
            newVal = 1;
        }
        if ($('input[name="length"]').val() && $('input[name="height"]').val()) {
            var cbmCalc = (parseFloat($('input[name="length"]').val()) * parseFloat($('input[name="height"]').val()) * parseFloat(newVal) * 16.39) / 1000000;
            $('input[name="actual_cbm"]').val(cbmCalc.toFixed(4));
            $('input[name="cbm_value"]').val(cbmCalc.toFixed(4));
        }
    });

    var oldHeight = 0;
    $(document).on('keydown', 'input[name="height"]', function () {
        oldHeight = $(this).val();
    });

    $(document).on('input', 'input[name="height"]', function () {
        newVal = $(this).val();
        if (isNaN($(this).val()) || !$(this).val()) {
            newVal = 1;
        }
        if ($('input[name="length"]').val() && $('input[name="width"]').val()) {
            var cbmCalc = (parseFloat($('input[name="length"]').val()) * parseFloat($('input[name="width"]').val()) * parseFloat(newVal) * 16.39) / 1000000;
            $('input[name="actual_cbm"]').val(cbmCalc.toFixed(4));
            $('input[name="cbm_value"]').val(cbmCalc.toFixed(4));
        }
    });

    $(document).on('change', 'select[name="existing_brand_id"]', function () {
        $.ajax({
            type: 'GET',
            url: '/GetProductsForBrand/' + $('select[name="existing_brand_id"]').val(),
            success: function (response) {
                var response = JSON.parse(response);
                response.forEach(element => {
                    $('select[name="existing_product_id"]').append('<option value="' + element['id'] + '">' + element['name'] + '</option>');
                });
            }
        });
    });

    $(document).on('click', '.newBrandTab', function () {
        brandType = "new";
        $('input[name="brandType"]').val("new");
    });

    $(document).on('click', '.existingBrandTab', function () {
        brandType = "existing";
        $('input[name="brandType"]').val("existing");
    });

    $(document).on('click', '.newProdTab', function () {
        productType = "new";
        $('input[name="productType"]').val("new");
    });

    $(document).on('click', '.existingProdTab', function () {
        productType = "existing";
        $('input[name="productType"]').val("existing");
    });


    //Excel Sheet Input Change Action
    $(document).on('change', '.excel_file_productwise', function () {
        var file = $('.excel_file_productwise')[0].files[0]
        if (file) {
            $('.file_name_product').text(file.name);
        }
    });

    $(document).on('change', '.excel_file_productItems', function () {
        var file = $('.excel_file_productItems')[0].files[0]
        if (file) {
            $('.file_name_items').text(file.name);
        }
    });

    $(document).on('change', '.excel_file_productItems_update', function () {
        var file = $('.excel_file_productItems_update')[0].files[0]
        if (file) {
            $('.file_name_items_update').text(file.name);
        }
    });

    $('.AddBrand').click(function () {
        openSidebar('#product-add')
    })

    //Save Excel Sheet
    $(document).on('click', '.upload_products_brand_wise', function () {
        var thisRef = $(this);
        if ($('.select_brand').val() == 0 || $('.select_brand').val() == null) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Select Brand.');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        thisRef.text('Processing...');
        thisRef.attr('disabled', 'disabled');
        $('#upload_brandwiseProducts_form').ajaxSubmit({
            type: "POST",
            url: '/upload_products_brandwise',
            data: $('#upload_brandwiseProducts_form').serialize(),
            cache: false,
            success: function (response) {
                thisRef.removeAttr('disabled');
                thisRef.text('Bulk Upload');
                $('.file_name_product').text('Choose File');
                $('.excel_file_productwise').val('');

                $('.error_message_products_div').hide();
                $('.not_uploadable_products_table').empty();

                var response = JSON.parse(response);
                if (response.status == 'failed') {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add products at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('.select_brand').val('0').trigger('change');
                    if (response.not_upload_able == '') {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Products added successfully.');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    } else {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Products added successfully.');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                        $('#tblLoader').hide();
                        $('.body').fadeIn();
                    }
                }

                if (response.not_upload_able.length > 0) {
                    $('.error_message_products_div').show();
                    $('.not_uploadable_products_table').append('<table class="table table-hover dt-responsive nowrap" id="not_uploadable_products" style="width:100%;"><thead><tr><th>Custom ID</th><th>SKU</th><th>Reason</th></tr></thead><tbody></tbody></table>');
                    $('#not_uploadable_products tbody').empty();
                    jQuery.each(response.not_upload_able, function (i, val) {
                        var test = i;
                        $('#not_uploadable_products tbody').append(`<tr><td>${val.custom_id}</td><td>${val.sku}</td><td>${val.reason}</td></tr>`);
                    });
                    $('#not_uploadable_products').DataTable();
                } else {
                    $('.error_message_products_div').hide();
                    $('.not_uploadable_products_table').empty();
                }

            },
            error: function (err) {
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function (i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after($('<small class="validationErrors" style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                    });
                }
            }
        });
    });

    $(document).on('click', '.upload_product_item', function () {
        var thisRef = $(this);
        thisRef.text('Processing...');
        thisRef.attr('disabled', 'disabled');
        $('#upload_productsItem_form').ajaxSubmit({
            type: "POST",
            url: '/upload_product_items',
            data: {
                op: 'add'
            },
            cache: false,
            success: function (response) {
                thisRef.removeAttr('disabled');
                thisRef.text('Bulk Upload');
                $('.file_name_items').text('Choose File');
                $('.excel_file_productItems').val('');

                $('.error_message_div').hide();
                $('.not_uploadable_items_table').empty();

                var response = JSON.parse(response);
                if (response.status == 'failed') {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add items at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('.select_product').val('0').trigger('change');
                    if (response.not_upload_able == '') {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Items added successfully.');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    } else {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Items added successfully.');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                        $('#tblLoader').hide();
                        $('.body').fadeIn();
                    }
                }
                if (response.not_upload_able.length > 0) {
                    $('.error_message_div').show();
                    $('.not_uploadable_items_table').append('<table class="table table-hover dt-responsive nowrap" id="not_uploadable_product_items" style="width:100%;"><thead><tr><th>Custom ID</th><th>SKU</th><th>Reason</th></tr></thead><tbody></tbody></table>');
                    $('#not_uploadable_product_items tbody').empty();
                    jQuery.each(response.not_upload_able, function (i, val) {
                        var test = i;
                        $('#not_uploadable_product_items tbody').append(`<tr><td>${val.custom_id}</td><td>${val.name}</td><td>${val.reason}</td></tr>`);
                    });
                    $('#not_uploadable_product_items').DataTable();
                } else {
                    $('.error_message_div').hide();
                    $('.not_uploadable_items_table').empty();
                }

            },
            error: function (err) {
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function (i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after($('<small class="validationErrors" style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                    });
                }
            }
        });
    });

    $(document).on('click', '.update_product_item', function () {

        if (!$('.excel_file_productItems_update')[0].files.length > 0) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please upload file.');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return
        }

        var thisRef = $(this);
        thisRef.text('Processing...');
        thisRef.attr('disabled', 'disabled');
        $('#update_productsItem_form').ajaxSubmit({
            type: "POST",
            url: '/upload_product_items',
            data: {
                op: 'update'
            },
            cache: false,
            success: function (response) {
                thisRef.removeAttr('disabled');
                thisRef.text('Bulk Upload');
                $('.file_name_items_update').text('Choose File');
                $('.excel_file_productItems_update').val('');

                $('.error_message_div_update').hide();
                $('.not_uploadable_items_table_update').empty();

                var response = JSON.parse(response);
                if (response.status == 'failed') {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add items at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('.select_product').val('0').trigger('change');
                    if (response.not_upload_able == '') {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Items updated successfully.');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    } else {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Items updated successfully.');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                        $('#tblLoader').hide();
                        $('.body').fadeIn();
                    }
                }
                if (response.not_upload_able.length > 0) {
                    $('.error_message_div_update').show();
                    $('.not_uploadable_items_table_update').append('<table class="table table-hover dt-responsive nowrap" id="not_uploadable_product_items_update" style="width:100%;"><thead><tr><th>Custom ID</th><th>SKU</th><th>Reason</th></tr></thead><tbody></tbody></table>');
                    $('#not_uploadable_product_items_update tbody').empty();
                    jQuery.each(response.not_upload_able, function (i, val) {
                        var test = i;
                        $('#not_uploadable_product_items_update tbody').append(`<tr><td>${val.custom_id}</td><td>${val.name}</td><td>${val.reason}</td></tr>`);
                    });
                    $('#not_uploadable_product_items_update').DataTable();
                } else {
                    $('.error_message_div_update').hide();
                    $('.not_uploadable_items_table_update').empty();
                }

            },
            error: function (err) {
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function (i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after($('<small class="validationErrors" style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                    });
                }
            }
        });
    });




    $(document).on('click', '.AddNewItem', function () {
        $('#saveItemForm').trigger('reset');
        $('#addItemSidebarDiv').show();
        $('#cbmCalcSidebarDiv').hide();
        $('.heading_div').html('Add <span>Item</span>');
        $('#addProduct').text('Add Item');
        $('.required').css('border', '0px');
        openSidebar('#product-add');
    });

    $(document).on('click', '.CbmCalc', function () {
        $('#addItemSidebarDiv').hide();
        $('#cbmCalcSidebarDiv').show();
        $('.heading_div').html('CBM <span>Calculation</span>');
        $('#addProduct').text('Save');
        $('#cbmValForCalc').val($(this).attr('cbm-val'));
        $('#unitWeightForCalc').val($(this).attr('unit-weight'));
        $('#cbmValForCalc').focus();
        $('#cbmValForCalc').blur();
        $('#unitWeightForCalc').focus();
        $('#unitWeightForCalc').blur();
        $('#cbmValForCalc').attr('disabled', true);
        $('#unitWeightForCalc').attr('disabled', true);
        $('#netWeightCbmCalc').attr('disabled', true);
        $('#toatlCbmCalc').attr('disabled', true);
        openSidebar('#product-add');
    });

    $(document).on('click', '#addProduct', function () {
        SaveProduct(segments[4]);
    });

    $(document).on('click', '.save_new_price', function () {
        var thisRef = $(this);
        var new_price = thisRef.parent().parent().find('.new_price').val();
        if (new_price == '') {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Enter Price!');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        thisRef.text('Processing...');
        thisRef.attr('disabled', 'disabled');
        $.ajax({
            type: "POST",
            url: '/update_item_price/' + thisRef.attr('id'),
            data: {
                _token: $('meta[name="csrf_token"]').attr('content'),
                new_price: new_price
            },
            cache: false,
            success: function (response) {
                var response = JSON.parse(response);
                thisRef.removeAttr('disabled');
                thisRef.text('Save');
                if (response.code == 200) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Saved Successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    thisRef.parent().parent().find('.new_price').val('');
                    thisRef.parent().parent().find('.standrad_up').text(new_price);
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to save price at the moment!');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        });
    });

    $(document).on('click', '.send_excel_email', function () {
        // if ($('#excel_email').val() == '') {
        //     $('#notifDiv').fadeIn();
        //     $('#notifDiv').css('background', 'red');
        //     $('#notifDiv').text('Please enter Email address!');
        //     setTimeout(() => {
        //         $('#notifDiv').fadeOut();
        //     }, 3000);
        //     return
        // }
        // if (!validateEmail($('#excel_email').val())) {
        //     $('#notifDiv').fadeIn();
        //     $('#notifDiv').css('background', 'red');
        //     $('#notifDiv').text('Invalid Email Format!');
        //     setTimeout(() => {
        //         $('#notifDiv').fadeOut();
        //     }, 3000);
        //     return
        // }
        // window.open('/send_excel_through_mail', '_blank');
        var thisRef = $(this);
        thisRef.attr('disabled', 'disabled');
        thisRef.text('Please Wait...');
        $.ajax({
            type: 'GET',
            url: '/send_excel_through_mail',
            data: {
                _token: $('input[name="_token"]').val(),
                email: $('#excel_email').val()
            },
            success: function (response) {
                //    var response = JSON.parse(response);
                //console.log(response);
                thisRef.text('Download');
                thisRef.removeAttr('disabled');
                window.open(response);
                location.href(response);
                return;
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Send Successfully!');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                $('#excel_email').val('');
                $('.close_excel_modal').click();

            }
        });

    });


    $(document).on('click', '.page_link', function () {
        var not_found = true;

        current_active_page = parseFloat($(this).attr('name'));
        //$(this).addClass('active');
        not_found = false;

        if (!not_found) {
            $('.product_list_view_div').empty();
            $('.products_grid_view_div').empty();
            all_products_gallery[current_active_page].map(function (element) {
                $('.product_list_view_div').append(`<div class="Product-row">
                        <a href="ProductDetail/${element['id']}" style="text-decoration: inherit;">
                            <div class="row">
                            
                            <div class="col col2 pr-0 pt-11">${element['id']}</div>
                            <div class="col col2 pr-0 pt-11">${element['sku']}</div>
                            <div class="col col3 pr-0 pt-11">${element['pro_brand_name']}</div>
                            <div class="col col4 pr-0">
                                <div class="row" style="display:table">
                                <div class="col-auto p-0"><div class="Product-IMG"><img src="${element['picture']}" alt="" /></div></div>
                                <div class="col p-0" style="vertical-align: middle; display:table-cell">${element['name']}</div>
                                </div>
                            </div>
                            <div class="col col5 pr-0 pt-11">${element['sub_category']}</div>
                               
                               
                              
                            </div>
                        </a>
                    </div>`);

                $('.products_grid_view_div').append(`<div class="col-lg-3 col-md-4">
                        <a href="ProductDetail/${element['id']}" style="text-decoration: inherit;">
                            <div class="_product-card">
                                <h2>${element['name']}</h2>
                                <div class="PR-Thumb">
                                    <div class="middle"><img src="${element['picture']}" alt="" /></div>
                                </div>
                            </div>
                        </a>
                    </div>`);
            });
        }

    })

    $(document).on('input', '.search_product', function () {
        rendersearch($(this).val().toLowerCase());
    })


    $(document).on('change', '.brand_filter', function () {
        var filter_array = [];
        if ($(this).val() == 0) {
            filter_array = allItems;
        } else {
            filter_array = allItems.filter(x => x.brand == $(this).val());
        }

        $('.body').empty();
        $('.body').append('<table class="table table-hover dt-responsive nowrap itemsTable" style="width:100%"><thead><tr><th>S.No</th><th>Product Name</th> <th>Item Name</th> <th>Price</th> <th>New Price</th> <th>Action</th> </tr> </thead><tbody></tbody></table>');
        $('.itemsTable tbody').empty();
        sno = 1;
        filter_array.forEach(element => {
            $('.itemsTable tbody').append(`<tr>
            <td> ${sno++} </td>
            <td> ${element.product_name} </td>
            <td> ${element.name} </td>
            <td class="standrad_up"> ${element.master_carton_unit_price} </td>
            <td> <input name="new_price" class="new_price" type="number" style="fonr-size:13px;"/> </td>
            <td>
                <a style="cursor: pointer" id="${element.id}"
                    class="btn btn-default btn-line save_new_price">Save</a>
            </td>
        </tr>`);
        })
        $('.itemsTable').DataTable();
    })

    $(document).on('click', '.viewOccurences', function () {
        let itmName = $(this).attr('item-name');
        let prodName = $(this).attr('product-name')
        ajaxer('/GetOccurencies', 'POST', {
            _token: csrfToken,
            'item_id': $(this).attr('id')
        }).then(x => {
            $('#occurenciesModalTblDiv').empty().html(`<table class="table table-hover dt-responsive nowrap table-PL" style="width:100% !important"
            id="occurenciesModalTbl">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Item</th>
                    <th>E-Invoice</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>`)
            x.forEach(o => {
                $('#occurenciesModalTbl tbody').append(`
                    <tr>
                        <td>${prodName}</td>
                        <td>${itmName}</td>
                        <td>
                            <a target="_blank" href="/Orders/${o.order_id}/edit${(o.status && o.status.toLowerCase() == 'completed' ? '/historic' : '')}">${o.invoice}</a>
                        </td>
                    </tr>
                `)
            });
            $('#occurenciesModalTbl').DataTable()
        })
    })

    //Download Product Items Excel
    $(document).on('click', '.download_product_items', function () {
        var thisRef = $(this);
        thisRef.attr('disabled', 'disabled');
        thisRef.text('Please Wait...');
        $.ajax({
            type: 'GET',
            url: '/download_product_items',
            data: {
                _token: $('input[name="_token"]').val()
            },
            success: function (response) {
                thisRef.text('Download Sample');
                thisRef.removeAttr('disabled');
                window.open(response);
                return;
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Send Successfully!');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                $('#excel_email').val('');
                $('.close_excel_modal').click();

            }
        });
    })
    $(document).on('input','#product_sku',function(){
        var product_sku = $(this).val();
        $.ajax({
            url:`checkProducSKUAvailablity/${product_sku}`,
            async: false,
            success: function(e){
                if(e == 1){
                    $('#error_for_sku').show();
                    $('#saveProductBtn').prop('disabled', 'disabled');
                }
                else{
                    $('#error_for_sku').hide();
                    $('#saveProductBtn').prop('disabled', '');
                }
            }
        })
    })

});

function validateCurrentStep() {
    if (currentWizardStep == 1) {
        if (brandType == "new") {
            if (!$('input[name="brand_custom_id"]').val() || !$('input[name="brand_name"]').val() || $('select[name="sub_category_id"]').val() == 0) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please provide all the required information (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return false;
            }
        } else {
            if ($('select[name="existing_brand_id"]').val() == 0) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please provide all the required information (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return false;
            }
        }
    } else {
        if (productType == "new") {
            if (!$('input[name="sku"]').val() || !$('input[name="product_name"]').val()) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please provide all the required information (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return false;
            }
        } else {
            if ($('select[name="existing_product_id"]').val() == 0) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please provide all the required information (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return false;
            }
        }
    }
    return true;
}

function SaveProduct(thisRef) {
    let dirty = false;
    
    $('.required').css('border', '0px');
    $('.required').each(function () {
        if (!$(this).val()) {
            dirty = true;
            $(this).css('border', '1px solid red')
        }
    });
    if (dirty) {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please provide all the required information');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    let isNegitive = false;
    $('.positive').css('border', '0px');
    $('.positive').each(function () {
        if ($(this).val() <= 0 && $(this).val() != '') {
            isNegitive = true;
            $(this).css('border', '1px solid red');
        }
    });
    if(isNegitive){
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Value Cannot Be Zero Or Less Than Zero');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }

    if ($('#variantDDSidebar').val() == '0' && $('[name="unit_quantity"]').val()) {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text("Please select variant carefully");
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 3000);
        return;
    }
    if ($('#variantDDSidebar').val() == '0' && $('[name="variant_1_packiging_weigth"]').val()) {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text("Please select variant carefully");
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 3000);
        return;
    }
   
    if ($('#variantDDSidebar').val() == '0' && $('[name="unit_quantity"]').val() && $('[name="variant_1_packiging_weigth"]').val()  ) {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text("Please select variant carefully");
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 3000);
        return;
    }
    if ($('#variantDDSidebar').val() != 0 && $('[name="variant_1_packiging_weigth"]').val() != "" && $('[name="unit_quantity"]').val() =="" ) {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text("Please Provide The Quantity");
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 3000);
        return;
    }
    
    //for second variant 
    if ($('[name="variant_id_2"]').val() == '0' && $('[name="variant_quantity_2"]').val() != '') {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text("Please select Second variant carefully");
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 3000);
        return;
    }
    if ($('[name="variant_id_2"]').val() == '0' && $('[name="variant_2_packiging_weigth"]').val() != "") {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text("Please select Second variant carefully");
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 3000);
        return;
    }
   
    if ($('[name="variant_id_2"]').val() == '0' && $('[name="variant_quantity_2"]').val() != "" && $('[name="variant_2_packiging_weigth"]').val() != "" ) {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text("Please select Second variant carefully");
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 3000);
        return;
    }
  
    // for third variant
    if ($('[name="variant_id_3"]').val() == '0' && $('[name="variant_quantity_3"]').val() != '') {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text("Please select variant carefully");
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 3000);
        return;
    }
    if ($('[name="variant_id_3"]').val() == '0' && $('[name="variant_3_packiging_weigth"]').val() != "") {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text("Please select variant carefully");
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 3000);
        return;
    }
   
    if ($('[name="variant_id_3"]').val() == '0' && $('[name="variant_quantity_3"]').val() != "" && $('[name="variant_3_packiging_weigth"]').val() != "" ) {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text("Please select variant carefully");
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 3000);
        return;
    }

    if (segments[3] == 'ProductDetail') {
        $('#addProduct').attr('disabled', 'disabled');
        $('#addProduct').text('Processing..');
    } else {
        thisRef.parent().parent().children().attr('class', 'disabled');
        thisRef.text('Processing..');
    }

    var ajaxUrl = "/Products";

    var postData = {
        brandType: $('[name="brandType"]').val(),
        productType: $('[name="productType"]').val(),
        brand_custom_id: $('[name="brand_custom_id"]').val(),
        brand_name: $('[name="brand_name"]').val(),
        primary_service_id: $('[name="main_cat_id"]').val(),
        sub_category_id: $('[name="sub_category_id"]').val(),
        brand_description: $('[name="brand_description"]').val(),
        existing_brand_id: $('[name="existing_brand_id"]').val(),
        sku: $('[name="sku"]').val(),
        product_name: $('[name="product_name"]').val(),
        picture: $('[name="picture"]').val(),
        product_description: $('[name="product_description"]').val(),
        existing_product_id: $('[name="existing_product_id"]').val(),
        item_description: $('[name="item_description"]').val(),
        unit_id: $('[name="unit_id"]').val(),
        unit_weight: $('[name="unit_weight"]').val(),
        variant_id: $('[name="variant_id"]').val(),
        unit_quantity: $('[name="unit_quantity"]').val(),
        variant_id_2: $('[name="variant_id_2"]').val(),
        variant_quantity_2: $('[name="variant_quantity_2"]').val(),
        variant_id_3: $('[name="variant_id_3"]').val(),
        variant_quantity_3: $('[name="variant_quantity_3"]').val(),
        unit_variant_quantity: $('[name="unit_variant_quantity"]').val(),
        length: $('[name="length"]').val(),
        width: $('[name="width"]').val(),
        height: $('[name="height"]').val(),
        cbm_value: $('[name="cbm_value"]').val(),
        actual_cbm: $('[name="actual_cbm"]').val(),
        master_carton_unit_price: $('[name="master_carton_unit_price"]').val(),
        //new fields added on 17-11 - from here 
        unit_weight: $('[name="unit_weight"]').val() ? $('[name="unit_weight"]').val() : null,
        variant_1_packiging_weigth: $('[name="variant_1_packiging_weigth"]').val() ? $('[name="variant_1_packiging_weigth"]').val() : null,
        variant_2_packiging_weigth: $('[name="variant_2_packiging_weigth"]').val() ? $('[name="variant_2_packiging_weigth"]').val() : null,
        variant_3_packiging_weigth: $('[name="variant_3_packiging_weigth"]').val() ? $('[name="variant_3_packiging_weigth"]').val() : null,
        master_carton_packiging_weigth: $('[name="master_carton_packiging_weigth"]').val() ? $('[name="master_carton_packiging_weigth"]').val() : null,
        master_carton_unit_price: $('[name="master_carton_unit_price"]').val() ? $('[name="master_carton_unit_price"]').val() : null,
        variant_unit_price: $('[name="variant_unit_price"]').val() ? $('[name="variant_unit_price"]').val() : null,
        //till here
        _token: $('meta[name="csrf_token"]').attr('content'),
        img_token: brandImgsToken
    }

    $.ajax({
        type: "POST",
        url: ajaxUrl,
        data: postData,
        cache: false,
        success: function (response) {
            var response = JSON.parse(response);
            if (response["status"] == "success") {
                if ($('[name="thumbnail"]').val()) {
                    $('#thumbnailForm').append('<input type="text" name="brand_id" value="' + response["brand_id"] + '" hidden />');
                    $('#productImgForm').append('<input type="text" name="product_id" value="' + response["product_id"] + '" hidden />');
                    $('#thumbnailForm').ajaxSubmit({
                        type: "POST",
                        url: '/brandThumbImg',
                        data: $('#thumbnailForm').serialize(),
                        cache: false,
                        success: function (response) {
                            if (response == "success") {
                                if ($('[name="product_picture"]').val()) {
                                    $('#productImgForm').ajaxSubmit({
                                        type: "POST",
                                        url: '/productImg',
                                        data: $('#productImgForm').serialize(),
                                        cache: false,
                                        success: function (response) {
                                            if (response == "success") {
                                                $('#notifDiv').fadeIn();
                                                $('#notifDiv').css('background', 'green');
                                                $('#notifDiv').text('Product have been added successfully');
                                                setTimeout(() => {
                                                    $('#notifDiv').fadeOut();
                                                    location.reload();
                                                }, 3000);
                                            } else {
                                                $('#notifDiv').fadeIn();
                                                $('#notifDiv').css('background', 'red');
                                                $('#notifDiv').text('Failed to add the product at this moment');
                                                setTimeout(() => {
                                                    $('#notifDiv').fadeOut();
                                                }, 3000);
                                            }
                                        }
                                    });
                                }
                            } else {
                                $('#notifDiv').fadeIn();
                                $('#notifDiv').css('background', 'red');
                                $('#notifDiv').text('Failed to add the product at this moment');
                                setTimeout(() => {
                                    $('#notifDiv').fadeOut();
                                }, 3000);
                            }
                        }
                    });
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Product have been added successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                        location.reload();
                    }, 3000);
                }
            } else {
                if (segments[3] == 'ProductDetail') {
                    $('#addProduct').removeAttr('disabled');
                    $('#addProduct').text('Add Item');
                } else {
                    thisRef.parent().parent().children().removeClass('disabled');
                    thisRef.text('Finish');
                }

                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Failed to add the product at this moment');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
        },
        error: function (err) {
            if (err.status == 422) {
                $.each(err.responseJSON.errors, function (i, error) {
                    var el = $(document).find('[name="' + i + '"]');
                    el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                });
            }
        }
    });

}

function fetchSubCat($mainCat) {
    $('[name="sub_category_id"] option').remove();
    $('[name="sub_category_id"]').attr('disabled', 'disabled');
    $('[name="sub_category_id"]').append('<option>Loading...</option>');
    if ($mainCat != "0") {
        $.ajax({
            type: 'GET',
            url: '/getCat/subCat/' + $mainCat,
            success: function (response) {
                var response = JSON.parse(response);
                $('[name="sub_category_id"] option').remove();
                if (!response.length) {
                    $('[name="sub_category_id"]').append('<option value="0">No services found</option>');
                }
                response.forEach(element => {
                    $('[name="sub_category_id"]').append('<option value="' + element["id"] + '">' + element['service_name'] + '</option>');
                });
                $('[name="sub_category_id"]').removeAttr('disabled');
            }
        });
    }
}

function fetchItems(sku) {
    $('#tblLoader').fadeIn();
    $('.body').hide();
    $.ajax({
        type: 'GET',
        url: '/FetchItems/' + sku,
        success: function (response) {
            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap itemsTable" style="width:100%"><thead><tr><th>S.No</th><th>Name</th> <th>Variant</th> <th>Unit</th> <th>CBM</th> <th>Actual CBM</th> <th>Action</th> </tr> </thead><tbody></tbody></table>');
            $('.itemsTable tbody').empty();
            allItems = JSON.parse(response);
            sno = 1;
            allItems.forEach(element => {
                let delBtn = ``;
                if ([21, 25, 4].includes(loggedInUser.user_id))
                    delBtn = `<a attr-id="${element.id}" class="btn btn-default deleteItem red-bg" name="product_item" style="color: white">Delete</a>`
                let itmName = `${element.unit_weight} Gm/${element.unit_name},
                                    ${(element.unit_quantity ? (element.unit_quantity + ' ' + element.unit_name + 's/' + element.variant_name + ',') : '')}
                                    ${(element.variant_2_name ? (element.variant_quantity_2 + ' ' + element.variant_name + 's/' + element.variant_2_name + ',') : '')}
                                    ${(element.variant_3_name ? (element.variant_quantity_3 + ' ' + element.variant_2_name + 's/' + element.variant_3_name + ',') : '')}
                                    ${(element.variant_3_name ? (element.unit_variant_quantity + " " + element.variant_3_name) : (element.variant_2_name ? (element.unit_variant_quantity + " " + element.variant_2_name) : (element.unit_variant_quantity + " " + (element.unit_quantity ? element.variant_name : element.unit_name))))}s/Carton`;
                $('.itemsTable tbody').append(`<tr>
                <td> ${sno++} </td>
                <td> ${itmName} </td>
                <td> ${element.variant ? element.variant : 'NA'} </td>
                <td> ${element.unit} </td>
                <td> ${element.cbm_value ? element.cbm_value : 0} </td>
                <td> ${element.actual_cbm ? element.actual_cbm : 0} </td>
                <td>
                    <a style="cursor: pointer" attr-id="${element.id}"
                        class="btn btn-default btn-line editItemSidebar">Edit</a>
                        ${delBtn}
                </td>
            </tr>`);
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.itemsTable').DataTable();
        }
    });
}

function fetchProducts() {
    $('#tblLoader').fadeIn();
    $('.body').hide();
    $.ajax({
        type: 'GET',
        url: '/FetchProducts/' + segments[4],
        success: function (response) {
            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap productsTable" style="width:100%"><thead><tr><th>S.No</th> <th>SKU</th> <th>Name</th> <th>Total Items</th> <th>Action</th></tr></thead><tbody></tbody></table>');
            $('.productsTable tbody').empty();
            allProducts = JSON.parse(response);
            sno = 1;
            allProducts.forEach(element => {
                let delBtn = ``;
                if ([21, 25, 4].includes(loggedInUser.user_id))
                    delBtn = `<a attr-id="${element.id}" class="btn btn-default deleteProduct red-bg" name="brand_product" style="color: white">Delete</a>`

                $('.productsTable tbody').append(`<tr>
                <td> ${sno++} </td>
                <td> ${element.sku} </td>
                <td> ${element.name} </td>
                <td> ${element.totalItems} </td>
                <td>
                    <a style="cursor: pointer" attr-id="${element.id}"
                        class="btn btn-default btn-line editProductSidebar">Edit</a>
                        <a href="/ProductItems/${element.sku}" class="btn btn-default">View Items</a>
                        ${delBtn}
                </td>
            </tr>`);
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.productsTable').DataTable();
        }
    });
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 50; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function paginationOnEachSide() {
    paginationItems = {
        before: [],
        after: []
    };
    activeFound = false;
    onEachSide = 3
    leftSidedDots = false;
    rightSidedDots = false;
    if ($('.page-item').length > 8) {
        $('.page-item').each(function () {

            //If dots are found, don't remove
            if ($(this).hasClass('disabled')) {
                if (activeFound && $(this).hasClass('disabled')) {
                    rightSidedDots = true;
                } else if (!activeFound && $(this).hasClass('disabled')) {
                    leftSidedDots = true;
                }
                return;
            } else {
                if (rightSidedDots) {
                    //If right sided dots are shown then run this so that the right sided dots (...) are not removed
                    //Second Last element
                    if ($(this).index() + 1 == $('.page-item').length - 1)
                        return;
                }
            }

            //If PREVIOUS button is found, don't remove
            if ($(this).index() == 0) {
                $(this).find('a').text('PREV')
                return;
            }
            //If NEXT button is found, don't remove
            if ($(this).index() + 1 == $('.page-item').length) {
                $(this).find('a').text('NEXT')
                return;
            }

            if ($(this).hasClass('active')) {
                activeFound = true;
            }
            if (activeFound) {
                if (!$(this).hasClass('active')) {
                    paginationItems.after.push($(this));
                }
            } else
                paginationItems.before.push($(this));
        });
        if (paginationItems.before.length / onEachSide > 1) {
            toRemove = paginationItems.before.length - onEachSide;
            paginationItems.before.slice(0, toRemove).forEach(element => {
                element.remove();
            });
        }
        if (paginationItems.after.length / onEachSide > 1) {
            toRemove = paginationItems.after.length - onEachSide;
            paginationItems.after.slice(Math.max(paginationItems.after.length - toRemove, 1)).forEach(element => {
                element.remove();
            });
            if (!rightSidedDots) {
                if (paginationItems.after.length > 4) {
                    indFnd = $('.page-item').length - 2;
                    // $(`<li class="page-item disabled" aria-disabled="true"><span class="page-link">${totalRecords}</span></li>`).insertAfter($('.page-item:eq(' + indFnd + ')'));
                    // $(`<li class="page-item disabled" aria-disabled="true"><span class="page-link">...</span></li>`).insertAfter($('.page-item:eq(' + indFnd + ')'));
                }
            }
        }
    }
}

function fetchForProductDetail(id) {
    $('#tblLoader').fadeIn();
    $('.listOfItems').hide();
    $.ajax({
        type: 'GET',
        url: '/GetProItems/' + id,
        success: function (response) {
            $('.listOfItems').empty();
            $('.listOfItems').append('<li><div class="row"><div class="col-md-7"><strong>Item Name</strong></div><div class="col-md-5"><strong>Action</strong></div></div></li>');
            // return;
            var response = JSON.parse(response);
            sno = 1;
            response.forEach(element => {
                let itmName = `${element.unit_weight} Gm/${element.unit_name},
                                    ${(element.unit_quantity ? (element.unit_quantity + ' ' + element.unit_name + 's/' + element.variant_name + ',') : '')}
                                    ${(element.variant_2_name ? (element.variant_quantity_2 + ' ' + element.variant_name + 's/' + element.variant_2_name + ',') : '')}
                                    ${(element.variant_3_name ? (element.variant_quantity_3 + ' ' + element.variant_2_name + 's/' + element.variant_3_name + ',') : '')}
                                    ${(element.variant_3_name ? (element.unit_variant_quantity + " " + element.variant_3_name) : (element.variant_2_name ? (element.unit_variant_quantity + " " + element.variant_2_name) : (element.unit_variant_quantity + " " + (element.unit_quantity ? element.variant_name : element.unit_name))))}s/Carton`;
                $('.listOfItems').append(`<li>
                <div class="row">
                    <div class="col-md-7">${itmName}</div>
                    <div class="col-md-5">
                        <button class="btn btn-primary mr-5 CbmCalc" unit-weight="${element.unit_weight}" cbm-val="${element.cbm_value}">CBM Calculation</button>
                        <button class="btn btn-primary btn-line" data-toggle="collapse"
                            href="#${"ProductItem" + element.id}" role="button" aria-expanded="false"
                            aria-controls="${"ProductItem" + element.id}">View Detail</button>
                    </div>
                    <div class="collapse" id="${"ProductItem" + element.id}" style="min-width: 100% !important">
                        <div class="items-Details"> <strong>Description: </strong> ${element.description}
                            <div class="row PT-10">
                                <div class="col"><strong style="display: block">Unit Weight </strong> ${element.unit_weight}</div>
                                ${element.unit_quantity ? '<div class="col"><strong style="display: block">' + element.variant_name + ' QTY. </strong> ' + element.unit_quantity + '</div>' : ''}
                                ${element.variant_name_2 ? '<div class="col"><strong style="display: block">' + element.variant_name_2 + ' QTY. </strong> ' + element.variant_quantity_2 + '</div>' : ''}
                                ${element.variant_name_3 ? '<div class="col"><strong style="display: block">' + element.variant_name_3 + ' QTY. </strong> ' + element.variant_quantity_3 + '</div>' : ''}
                                <div class="col"><strong style="display: block">Carton QTY. </strong> ${element.unit_variant_quantity}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>`);
            });
            $('#tblLoader').hide();
            $('.listOfItems').fadeIn();
        }
    });
}

function fetchAllOccurences() {
    $('#tblLoader').fadeIn();
    $('.body').hide();
    $.ajax({
        type: 'POST',
        url: '/fetchAllOccurences',
        data: {
            _token: csrfToken
        },
        success: function (response) {
            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap itemsTable" style="width:100%"><thead><tr><th>S.No</th><th>Product Name</th> <th>Item Name</th> <th>Occurences</th> <th>Action</th> </tr> </thead><tbody></tbody></table>');
            $('.itemsTable tbody').empty();
            response.forEach((x, idx) => {
                if (!x.occurences)
                    return;
                $('.itemsTable tbody').append(`<tr>
                <td> ${idx + 1} </td>
                <td> ${x.product_name} </td>
                <td> ${x.name} </td>
                <td> ${x.occurences} </td>
                <td>
                    <button class="btn btn-default viewOccurences" data-toggle="modal"
                    data-target=".occurencesModal" item-name="${x.name}" product-name="${x.product_name}" id="${x.id}">View</a>
                </td>
            </tr>`);
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.itemsTable').DataTable();
        }
    });
}

function fetchAllItems() {
    $('#tblLoader').fadeIn();
    $('.body').hide();
    $.ajax({
        type: 'GET',
        url: '/FetchAllItems',
        success: function (response) {
            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap itemsTable" style="width:100%"><thead><tr><th>S.No</th><th>Product Name</th> <th>Item Name</th> <th>Price</th> <th>New Price</th> <th>Action</th> </tr> </thead><tbody></tbody></table>');
            $('.itemsTable tbody').empty();
            allItems = JSON.parse(response);
            sno = 1;
            allItems.forEach(element => {
                $('.itemsTable tbody').append(`<tr>
                <td> ${sno++} </td>
                <td> ${element.product_name} </td>
                <td> ${element.name} </td>
                <td class="standrad_up"> ${element.variant_unit_price}</td>
                <td> <input name="new_price" class="new_price" type="number" style="fonr-size:13px;"/> </td>
                <td>
                    <a style="cursor: pointer" id="${element.id}"
                        class="btn btn-default btn-line save_new_price">Save</a>
                </td>
            </tr>`);
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.itemsTable').DataTable();
        }
    });
}

function updateContainer20Ft() {
    var totalCbm = parseFloat($('#cbmValForCalc').val()) * parseFloat($('#ttlQtyCbmCalc').val());
    var totalWeight = parseFloat($('#cbmValForCalc').val()) * parseFloat($('#ttlQtyCbmCalc').val());
    var totalCtns = parseFloat($('#ttlQtyCbmCalc').val());

    totalWeight += $('#additionalWeightPerCtnCbmCalc').val() ? (parseFloat($('#additionalWeightPerCtnCbmCalc').val()) * totalCtns) : 0;

    $('#netWeightCbmCalc').val(totalWeight.toFixed(2));
    $('#toatlCbmCalc').val(totalCbm.toFixed(3));
    $('#netWeightCbmCalc').focus();
    $('#netWeightCbmCalc').blur();
    $('#toatlCbmCalc').focus();
    $('#toatlCbmCalc').blur();

    var percent20Ft = Math.round((totalCbm / container20FtCbmLimit) * 100) + "%";

    var containersNeeded = (totalCbm / container20FtCbmLimit);
    var containersNeededForWeight = (totalWeight / 28000);

    var containersNeededForCalculation = containersNeededForWeight;

    if (containersNeededForWeight >= 1 && containersNeeded >= 1) {
        if (containersNeeded > containersNeededForWeight)
            containersNeededForCalculation = containersNeeded;
    } else if (containersNeeded >= 1 && containersNeededForWeight < 1) {
        containersNeededForCalculation = containersNeeded;
    } else {
        $('#pill-20').empty();
        $('#pill-20').append(`<div class="contDiv"><div class="contProgress" style="width: ${percent20Ft}%"></div><div class="ProgNO">${percent20Ft}</div></div>`);
    }

    if (containersNeededForCalculation >= 1) {
        var flooredContainers = Math.floor(containersNeededForCalculation);
        // var newContainers = Math.ceil(containersNeededForCalculation);
        $('#pill-20 .contDiv').remove();
        $('#pill-20').append('<div id="extra20Ft"></div>');
        // for (var i = 0; i < newContainers; i++) {
        //     if (i <= (flooredContainers - 1)) {
        $('#extra20Ft').append(`<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: 100%"></div><div class="ProgNO SM-PNO" style="top: 45%">100%</div><span style="font-size: 15px; position: absolute; z-index: 10; float: left; top: 60%; left: 40%; color: white;" >x${flooredContainers}</span></div>`);
        // } else {
        var lastPercent = Math.round((containersNeededForCalculation.toFixed(2) - flooredContainers) * 100);
        $('#extra20Ft').append(`<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: ${lastPercent}%"></div><div class="ProgNO SM-PNO">${lastPercent}%</div></div>`);
        // }
        // }
    }

    updateContainer40Ft(totalCbm, totalWeight);
}

function updateContainer40Ft(totalCbm, totalWeight) {
    var percent40Ft = Math.round((totalCbm / container40FtCbmLimit) * 100) + "%";

    var containersNeeded = (totalCbm / container40FtCbmLimit);
    var containersNeededForWeight = (totalWeight / 28000);

    var containersNeededForCalculation = containersNeededForWeight;

    if (containersNeededForWeight >= 1 && containersNeeded >= 1) {
        if (containersNeeded > containersNeededForWeight)
            containersNeededForCalculation = containersNeeded;
    } else if (containersNeeded >= 1 && containersNeededForWeight < 1) {
        containersNeededForCalculation = containersNeeded;
    } else {
        $('#pills-40').empty();
        $('#pills-40').append(`<div class="contDiv"><div class="contProgress" style="width: ${percent40Ft}%"></div><div class="ProgNO">${percent40Ft}</div></div>`);
    }

    if (containersNeededForCalculation >= 1) {
        var flooredContainers = Math.floor(containersNeededForCalculation);
        var newContainers = Math.ceil(containersNeededForCalculation);
        $('#pills-40 .contDiv').remove();
        $('#pills-40').append('<div id="extra40Ft"></div>');
        // for (var i = 0; i < newContainers; i++) {
        //     if (i <= (flooredContainers - 1)) {
        $('#extra40Ft').append(`<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: 100%"></div><div class="ProgNO SM-PNO" style="top: 45%">100%</div><span style="font-size: 15px; position: absolute; z-index: 10; float: left; top: 60%; left: 40%; color: white;" >x${flooredContainers}</span></div>`);
        // } else {
        var lastPercent = Math.round((containersNeededForCalculation.toFixed(2) - flooredContainers) * 100);
        $('#extra40Ft').append(`<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: ${lastPercent}%"></div><div class="ProgNO SM-PNO">${lastPercent}%</div></div>`);
        //     }
        // }
    }
    updateContainer40FtHc(totalCbm, totalWeight);
}

function updateContainer40FtHc(totalCbm, totalWeight) {
    var percent40FtHc = Math.round((totalCbm / container40FtHcCbmLimit) * 100) + "%";

    var containersNeeded = (totalCbm / container40FtHcCbmLimit);
    var containersNeededForWeight = (totalWeight / 28000);

    var containersNeededForCalculation = containersNeededForWeight;

    if (containersNeededForWeight >= 1 && containersNeeded >= 1) {
        if (containersNeeded > containersNeededForWeight)
            containersNeededForCalculation = containersNeeded;
    } else if (containersNeeded >= 1 && containersNeededForWeight < 1)
        containersNeededForCalculation = containersNeeded;
    else {
        $('#pills-hc').empty();
        $('#pills-hc').append(`<div class="contDiv"><div class="contProgress" style="width: ${percent40FtHc}%"></div><div class="ProgNO">${percent40FtHc}</div></div>`);
    }

    if (containersNeededForCalculation >= 1) {
        var flooredContainers = Math.floor(containersNeededForCalculation);
        // var newContainers = Math.ceil(containersNeededForCalculation);
        $('#pills-hc .contDiv').remove();
        $('#pills-hc').append('<div id="extra40FtHc"></div>');
        // for (var i = 0; i < newContainers; i++) {
        //     if (i <= (flooredContainers - 1)) {
        $('#extra40FtHc').append(`<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: 100%"></div><div class="ProgNO SM-PNO" style="top: 45%">100%</div><span style="font-size: 15px; position: absolute; z-index: 10; float: left; top: 60%; left: 40%; color: white;" >x${flooredContainers}</span></div>`);
        // } else {
        var lastPercent = Math.round((containersNeededForCalculation.toFixed(2) - flooredContainers) * 100);
        $('#extra40FtHc').append(`<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: ${lastPercent}%"></div><div class="ProgNO SM-PNO">${lastPercent}%</div></div>`);
        // }
        // }
    }
}

function fetchProductsForGallery() {
    $('.tblLoader').fadeIn();
    $('.product_list_view_div').empty();
    $('.products_grid_view_div').empty();
    $('.search_product').val('');
    $.ajax({
        type: 'GET',
        url: '/FetchprodctsForGallery',
        success: function (response) {
            var response = JSON.parse(response);
            // console.log(response);
            //return;

            $('.tblLoader').hide();
            allProductsArray = response;
            total_records = response.length;
            var recsPerPage = 12;
            totalPages = Math.ceil(total_records / recsPerPage);
            offset = 0;
            var pageNo = 0;
            var current_records = 0;
            var array_items_count = 0;
            var total_indexes = 0;

            //for testing
            fetchPagination(totalPages, current_records);

            $('.pagination').append(`<li name="-1" class="page-item page_link disabled previous"><a class="page-link" tabindex="-1">Previous</a></li>`);
            var i;
            for (i = 1; i <= totalPages; i++) {
                $('.pagination').append(`<li name="${i}" class="page-item page_link ${i <= 1 ? 'active' : ''}"><a class="page-link">${i}</a></li>`);
                all_products_gallery.push({})
            }
            $('.pagination').append('<li class="page-item page_link next" name="+1"><a class="page-link">Next</a></li>');

            //base_url = response.base_url;
            var test = [];
            response.forEach(element => {
                current_records++;
                array_items_count++;
                if (current_records <= 12) {
                    $('.product_list_view_div').append(`<div class="Product-row">
                        <a href="ProductDetail/${element['id']}" style="text-decoration: inherit; color:#282828">
                            <div class="row">
                            <div class="col col2 pr-0 pt-11">${element['id']}</div>
                            <div class="col col2 pr-0 pt-11">${element['sku']}</div>
                            <div class="col col3 pr-0 pt-11">${element['pro_brand_name']}</div>
                            <div class="col col4 pr-0">
                                <div class="row" style="display:table">
                                <div class="col-auto p-0"><div class="Product-IMG"><img src="${element['picture']}" alt="" /></div></div>
                                <div class="col p-0" style="vertical-align: middle; display:table-cell">${element['name']}</div>
                                </div>
                            </div>
                            <div class="col col5 pr-0 pt-11">${element['sub_category']}</div>
                            </div>
                        </a>
                    </div>`);

                    $('.products_grid_view_div').append(`<div class="col-lg-3 col-md-4">
                        <a href="ProductDetail/${element['id']}" style="text-decoration: inherit;">
                            <div class="_product-card">
                                <h2>${element['name']}</h2>
                                <div class="PR-Thumb">
                                    <div class="middle"><img src="${element['picture']}" alt="" /></div>
                                </div>
                            </div>
                        </a>
                    </div>`);
                }
                test.push(element);
                all_products_gallery[total_indexes] = test;
                if (array_items_count == 12) {
                    array_items_count = 0;
                    test = [];
                    total_indexes++;
                }
            });
        }
    });
}

function rendersearch(search = null) {

    $('.product_list_view_div').empty();
    $('.products_grid_view_div').empty();
    $('.pagination').empty();
    if (search == '') {
        searchArray = allProductsArray;
    } else {
        searchArray = allProductsArray.filter(function (x) {
            return (x['name'] ? x.name.toLowerCase().includes(search) : '') || (x.description ? x.description.toLowerCase().includes(search) : '') || (x.sku ? x.sku.toLowerCase().includes(search) : '');
        });
    }


    var recsPerPage = 12;
    totalPages = Math.ceil(searchArray.length / recsPerPage);
    $('.count_poc').text(searchArray.length);
    offset = 0;
    var pageNo = 0;
    var current_records = 0;
    var array_items_count = 0;
    var total_indexes = 0;
    var test = [];
    fetchPagination(totalPages, current_records);
    $('.pagination').append(`<li name="-1" class="page-item poc_page_link disabled previous"><a class="page-link" tabindex="-1">Previous</a></li>`);
    var i;
    for (i = 1; i <= totalPages; i++) {
        $('.pagination').append(`<li name="${i}" class="page-item poc_page_link ${i <= 1 ? 'active' : ''}"><a class="page-link">${i}</a></li>`);
        all_products_gallery.push({})
    }
    $('.pagination').append('<li class="page-item poc_page_link next" name="+1"><a class="page-link">Next</a></li>');

    searchArray.forEach(element => {
        current_records++;
        array_items_count++;
        if (current_records <= 12) {
            $('.product_list_view_div').append(`<div class="Product-row">
                <a href="ProductDetail/${element['id']}" style="text-decoration: inherit;">
                    <div class="row">
                        <div class="col _SNO">
                            <div class="middle">${element['id']}</div>
                        </div>
                        <div class="col _ITEMSKU">
                            <div class="middle">${element['sku']}</div>
                        </div>
                        <div class="col _ITEMPROBRAND">
                            <div class="middle">${element['pro_brand_name']}</div>
                        </div>
                        <div class="col _ITEMNAME">
                            <div class="Product-IMG"><img src="${element['picture']}" alt="" /></div>
                            <div class="Product-Name">${element['name']}</div>
                        </div>
                        <div class="col _ITEMBRAND">
                            <div class="middle">${element['sub_category']}</div>
                        </div>
                    </div>
                </a>
            </div>`);

            $('.products_grid_view_div').append(`<div class="col-lg-3 col-md-4">
                <a href="ProductDetail/${element['id']}" style="text-decoration: inherit;">
                    <div class="_product-card">
                        <h2>${element['name']}</h2>
                        <div class="PR-Thumb">
                            <div class="middle"><img src="${element['picture']}" alt="" /></div>
                        </div>
                    </div>
                </a>
            </div>`);
        }


        test.push(element);
        all_products_gallery[total_indexes] = test;
        if (array_items_count == 12) {
            array_items_count = 0;
            test = [];
            total_indexes++;
        }

    });
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


var item = [];

function fetchPagination(pageLen = null, curPage = null) {
    item = [];
    for (var i = 1; i <= pageLen; i++) {
        item.push(i);
    }
    render(pageLen, curPage, item, true);
}

function render(pageLen = null, curPage, item, first) {
    $('#holder').empty();
    var html = '',
        separatorAdded = false;
    for (var i in item) {
        if (isPageInRange(curPage, i, pageLen, 2, 2)) {
            html += '<li class="page_link" name="' + i + '" data-page="' + i + '">' + item[i] + '</li>';
            // as we added a page, we reset the separatorAdded
            separatorAdded = false;
        } else {
            if (!separatorAdded) {
                // only add a separator when it wasn't added before
                html += '<li class="separator" />';
                separatorAdded = true;
            }
        }
    }

    var holder = document.querySelector('#holder');
    holder.innerHTML = html;
    document.querySelector('#holder>li[data-page="' + curPage + '"]').classList.add('active');
    if (first) {
        holder.addEventListener('click', function (e) {
            if (!e.target.getAttribute('data-page')) {
                // no relevant item clicked (you could however offer expand here )
                return;
            }
            curPage = parseInt(e.target.getAttribute('data-page'));
            render(pageLen, curPage, item);
        });
    }
}

function isPageInRange(curPage, index, maxPages, pageBefore, pageAfter) {
    if (index <= 1) {
        // first 2 pages
        return true;
    }
    if (index >= maxPages - 2) {
        // last 2 pages
        return true;
    }
    if (index >= curPage - pageBefore && index <= curPage + pageAfter) {
        return true;
    }
}
