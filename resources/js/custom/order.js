var segments =  location.href;
segments    =  $.trim(segments.replace('#', ''));
segments    =  segments.split('/');
var lastOp = "add";
var inv_pref = [];
var order_content = [];
var deleted_order_content = [];
var retailer = '';
var order_update_id = '';

var current_list = 'all_orders';
var total_orders = 0;
var totalOrdersPages = 0;
var all_orders_list = [];

var count_all_orders = 0;
var count_processed_orders = 0;
var count_completed_orders = 0;
var count_cancelled_orders = 0;

var core_orders = [];
var new_orders_array = [];
var processed_orders_array = [];
var completed_orders_array = [];
var cancelled_orders_array = [];

var inventory_for_order = [];
var add_product_ref = '';

var remove_order_content = [];
var all_special_discounts = [];
var item_scheme_schemes    = [];

var added_product_image = '';
var frieght_price       =   0;
var scheme_id           =   0;
var scheme_min_qty      =   0;
var scheme_rule         =   0;
var scheme_type         =   '';
var discount_on_tp      =   0;
var scheme_title        =   '';
var scheme_datatype     =   '';
var scheme_discount     =   0;
var scheme_applied      =   0;
var is_tax              =   0
var tax_class_id        =   0;
var tax_amount          =   0;
var proc_dist_id        =   0;
var proc_dist_dsct      =   0;
var last_input_id       =   '';
var booker_discount     =   0;
var is_deleted_item     =   0;

$(document).ready(function () {

    if (segments[3] == 'dispatch-primary-order'  ) {
        //$('.modify_primary_order').text('Dispatch');
        //$('.btn-cancel').attr('href',"/booked-primary-order");
    } else if (segments[3] == 'process-primary-order' ) {
        $('.header').html(`<h2>Edit pending Orders at <span> HO</span></h2>`);
        //$('.btn-cancel').attr('href',"/processed-primary-order");
    } else if ( segments[3] == 'execute-primary-order'  ) {
        $('.header').html(`<h2>Edit pending Orders at <span> WHO</span></h2>`);
        //$('.btn-cancel').attr('href',"/executed-primary-order");
    }
    if (segments[3] == 'booked-primary-order'  ) {
        $('#order-title').html(`<h2>Pending Orders <span> List</span></h2>`);
        primaryOrderList('Pending');
    } else if (segments[3] == 'processed-primary-order' ) {
        $('#order-title').html(`<h2>Pending Orders at<span> HO</span></h2>`);
        primaryOrderList('processed');
    } else if ( segments[3] == 'executed-primary-order'  ) {
        $('#order-title').html(`<h2>Pending Orders at <span> WHO</span></h2>`);
        primaryOrderList('Executed');
    } else if (segments[3] == 'completed-primary-order'  ) {
        $('#order-title').html(`<h2>Completed Orders <span> List</span></h2>`);
    } else if ( segments[3] == 'cancelled-primary-order') {
        $('#order-title').html(`<h2>Cancelled Orders <span> List</span></h2>`);
        primaryOrderList('Cancelled');
    } else if ( segments[3] == 'pending-approvals-primary-order'  ) {
        $('#order-title').html(`<h2>Pending Approval Orders <span> List</span></h2>`);
        primaryOrderList('pending-approval');
    } else if (segments[3] == 'secondary_order') {
        fetchInvPrefs();
    } else if (segments[3] == 'edit_secondary_order') {
        fetchInvPrefs();
        fetchOrderData();
        order_update_id = segments[4];
    } else if (segments[3] == 'secondary_orders_list') {
        fetchSecondaryOrders();
    } else if (segments[3] == 'primary_orders_list'){
        //Controller ma type change ho jay ge
        fetchSecondaryOrders();
    } else if (segments[3] == 'primary_order' || segments[3] == 'return-primary-order'){
        // fetchInvPrefsForPrimary();
    } else if (segments[3] == 'sec_order_city' || segments[3] == 'sec_order_dist' || segments[3] == 'sec_order_dist_monthwise' || segments[3] == 'sec_order_monthDetail'){
        $('.page_name').text(`${(segments[3] == 'sec_order_city' ? 'Cities' : (segments[3] == 'sec_order_dist' ? 'Distributors' : (segments[3] == 'sec_order_dist_monthwise' ? 'Orders' : (segments[3] == 'sec_order_monthDetail' ? 'Order Bookers' : '') )))}`);
        $('.page_name_heading').empty();
        $('.page_name_heading').append(`${(segments[3] == 'sec_order_city' ? 'Cities' : (segments[3] == 'sec_order_dist' ? 'Distributors' : (segments[3] == 'sec_order_dist_monthwise' ? 'Orders' : (segments[3] == 'sec_order_monthDetail' ? 'Order Bookers' : ''))))} <span> List</span><div class="_list-total total_cities">0</div>`);
        fetchOrdersDataBeforeLisitng();
    }else if (segments[3] == 'execute-primary-order' || segments[3] == 'process-primary-order' || segments[3] == 'dispatch-primary-order') {

        fetchOrderData();
        order_update_id = segments[4];
    }
    $('.decimal').keyup(function(){
        var val = $(this).val();
        if(isNaN(val)){
            val = val.replace(/[^0-9\.]/g,'');
            if(val.split('.').length>2)
                val =val.replace(/\.+$/,"");
        }
        $(this).val(val);
    });
    $(document).on('change', '.employee_id', function () {
        if(!segments[3].includes("primary_order") && !segments[3].includes("edit_primary_order")  && !segments[3].includes("return-primary-order")){
            order_content = [];
            $('.order_items').empty();
            $('.item_id').val('0').trigger('change');
            $('.unit_id').empty();
            $('.unit_id').append(`<option selected disabled value='0'>Select Unit</option>`);
            $('.distributor_id').empty();
            $('.distributor_id').append(`<option selected disabled value="0">Please Wait...</option>`);

            $.ajax({
                type: 'POST',
                url: '/getRetailerForOrder/' + $(this).val(),
                data: {
                    _token: $('input[name="_token"]').val()
                },
                success: function (response) {
                    var response = JSON.parse(response);
                    $('.distributor_id').empty();
                    $('.distributor_id').append(`<option selected disabled value="0">Select Retailer</option>`);
                    response.forEach(element => {
                        $('.distributor_id').append(`<option ${segments[3] == 'edit_secondary_order' ? retailer == element['id'] ? 'selected' : '' : ''} value="${element['id']}" rd="${element['discount']}">${element['retailer_name']}</option>`);
                    })
                }
            });
        }

    })

    $(document).on('change', '.distributor_id', function () {
        reset_order_content();
        getRetailerForPrimaryOrder($(this).val());
    })

    //Open SideBar
    $(document).on('click', '.add_product', function () {
        var error = false;
        if (segments[3] == 'edit_primary_order') {
            if (!$('.distributor_id').val()) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please Select Distributor And Employee');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                error = true
            }
        } else if (segments[3] == 'primary_order' || segments[3] == 'return-primary-order') {
            if (!$('.distributor_id').val() || !$('.employee_id').val()) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please Select Distributor And Employee');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                error = true
            }
        }else {
            if (!$('.employee_id').val() || !$('.distributor_id').val()) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please Select Retailer And Employee');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                error = true
            }
        }
        if (error) {
            return;
        }

        openSidebar();
    })

    //Open Item Detail Modal
    $(document).on('click', '.openItemDetailModal', function () {
        $('.quantityTradeScheme').val('');
        scheme_id           =   0;
        add_product_ref     = $(this);
        var item_id         =   $(this).attr('id');
        var trade_price     =   $(this).attr('tp');
        scheme_discount  =   0;
        $('.unit_name').text($(this).attr('unit_name'));
        $('.quantityTradeScheme').attr('item_id',item_id);
        $('.quantityTradeScheme').attr('trade_price',trade_price);
        var schemes =   item_schemes(item_id);
        $('#productTradeSchemes').empty();
        if(typeof schemes !== 'undefined' && schemes !== null){
            schemes.forEach(element => {
                $('#productTradeSchemes').append(`
                                                <p>
                                                <label class="radio-inline">
                                                <input
                                                id="trade_scheme_${element['id']}" 
                                                class="item_scheme" 
                                                type="radio" 
                                                value="${element['id']}"  
                                                data-scheme_id="${element['id']}"
                                                data-item_id ="${item_id}" 
                                                data-trade_price="${trade_price}"
                                                name="tradeschemeScheme" 
                                                />
                                                 ${element['title']} MinQty( ${element['min_qty']} )
                                                </label>
                                                </p>
                                             `);
            });
        }
        added_product_image = $(this).parent().parent().find('.PrList_img').attr('src');
        $('.add_to_cart').attr('name', $(this).attr('name'));
        $('.add_to_cart').attr('pref_id', $(this).attr('pref_id'));
        $('.add_to_cart').attr('sku', $(this).attr('sku'));
        $('.add_to_cart').attr('tp', $(this).attr('tp'));
        $('.add_to_cart').attr('item_id', $(this).attr('item_id'));
        $('.add_to_cart').attr('is_tax', $(this).attr('is_tax'));
        $('.add_to_cart').attr('item_retail_price', $(this).attr('item_retail_price'));
        $('.add_to_cart').attr('tax_class_id', $(this).attr('tax_class_id'));
        $('.add_to_cart').attr('tax_amount', $(this).attr('tax_amount'));
        $('.add_to_cart').attr('item_discount', $(this).attr('item_discount'));
        $('.add_to_cart').attr('spec_discount', $(this).attr('spec_discount'));
        $('.unit_id').val($(this).attr('unit_id'))
    })

    //Search From Inventory List
    $(document).on('input', '.search_from_inventory', function () {
        var inv_searched = [];
        var search = $(this).val();
        if (search == '') {
            inv_searched = inventory_for_order;
        } else {
            inv_searched = inventory_for_order.filter(function (x) {
                return x['item_name'].toLowerCase().includes(search.toLowerCase());
            });
        }
        $('.inventory_table_body').empty();
        inv_searched.forEach(element => {
            if(segments[3] == 'execute-primary-order' || segments[3] == 'process-primary-order' || segments[3] == 'dispatch-primary-order'){
                var item_found  = false;
                found_in_active   =   order_content.some(x => x.item_id == element['item_id']);
                found_in_deleted  =   deleted_order_content.some(y => y.item_id == element['item_id']);
                if(found_in_active || found_in_deleted) {
                    item_found  = true;
                }
                if(!item_found) {
                    var id = '';
                    order_content.forEach(content => {
                        if (content['item_id'] == element['item_id']) {
                            id = content['item_id'];
                        }
                    })
                    $('.inventory_table_body').append(`<tr>
                    <td width="80%">
                        <div class="ProListDiv">
                            <div class="PR_Name">${element['item_name']}</div>
                        </div>
                    </td>
                    <td><button id="${element['item_id']}" name="${element['item_name']}" item_discount="${element['dist_discount']}" spec_discount="${element['spec_discount']}" tp="${element['item_trade_price']}"  unit_id="${element['unit_id']}" sku="${element['item_sku']}" item_id="${element['item_id']}" pref_id="${element['pref_id']}"   is_tax="${element['is_tax']}" item_retail_price="${element['item_retail_price']}"  tax_class_id="${element['tax_class_id']}"  tax_amount="${element['tax_amount']}"   data-toggle="modal" data-target="#QuantityAndUnit" class="btn btn-default mb-0 openItemDetailModal">Add</button></td>
                    </tr>`);
                }
            }
            else {
                var is_added    =   order_content.some(x=>x.pref_id == element['pref_id']);
                var id = '';
                order_content.forEach(content => {
                    if (content['item_id'] == element['item_id']) {
                        id = content['item_id'];
                    }
                })
                $('.inventory_table_body').append(`<tr>
                <td width="80%">
                    <div class="ProListDiv">
                        <div class="PR_Name">${element['item_name']}</div>
                    </div>
                </td>
                <td><button id="${element['item_id']}" name="${element['item_name']}" item_discount="${element['dist_discount']}" spec_discount="${element['spec_discount']}" tp="${element['item_trade_price']}"  unit_id="${element['unit_id']}" sku="${element['item_sku']}" item_id="${element['item_id']}" pref_id="${element['pref_id']}"   is_tax="${element['is_tax']}" item_retail_price="${element['item_retail_price']}"  tax_class_id="${element['tax_class_id']}"  tax_amount="${element['tax_amount']}"   data-toggle="modal" data-target="#QuantityAndUnit" class="btn btn-default mb-0 openItemDetailModal" ${is_added==true?'disabled':''}>${is_added==true?'Added':'Add'}</button></td>
            </tr>`);
            }
        })
    })

    //Add to Cart
    $(document).on('click', '.add_to_cart', function () {
        var error = false;
        var special_dsc = 0;
        if (segments[3] == 'edit_primary_order'  || segments[3] == 'execute-primary-order' || segments[3] == 'process-primary-order' || segments[3] == 'dispatch-primary-order') {
            if (!$('.distributor_id').val() || !$('.quantity').val()) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please provide all the required information (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                error = true;
            }
        } else if (segments[3] == 'primary_order' || segments[3] == 'return-primary-order') {
            if (!$('.distributor_id').val() || !$('.employee_id').val() || !$('.quantity').val()) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please provide all the required information (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                error = true;
            }
        } else {
            if (!$('.employee_id').val() || !$('.unit_id').val() || !$('.distributor_id').val() || !$('.quantity').val()) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please provide all the required information (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                error = true;
            }
        }
        if (error) {
            return;
        }
        var id_found            =   false;
        booker_discount         =   0;
        var booked_total_qty    =   0;
        var booked_order_value  =   0;
        var item_quantity_updated=  0;
        var item_id             =   parseInt($(this).attr('item_id'));
        var item_name           =   $(this).attr('name');
        var item_sku            =   $(this).attr('sku');
        var item_dist_discount  =   parseFloat($(this).attr('item_discount'));
        var special_discount    =   parseFloat($(this).attr('spec_discount'));
        var pref_id             =   parseInt($(this).attr('pref_id'));
        var item_retail_price   =   parseFloat($(this).attr('item_retail_price'));
        var trade_price         =   parseFloat($(this).attr('tp'));
        is_tax                  =   parseInt($(this).attr('is_tax'));
        tax_class_id            =   parseInt($(this).attr('tax_class_id'));
        tax_amount              =   parseInt($(this).attr('tax_amount'));
        var distributor_id      =   parseInt($('.distributor_id').val());
        var unit_id             =   parseInt($('.unit_id').val());
        var quantity            =   parseInt($('.quantity').val())?parseInt($('.quantity').val()):0;
        //Gross Amount
        var grass_amount            =   trade_price*quantity;
        //Gross amount after trade price
        var Grs_Amt_Af_TO           =   grass_amount;
        if(scheme_applied == '1' && scheme_datatype == 'amount'){
            Grs_Amt_Af_TO           =   grass_amount-scheme_discount;
        }
        if( segments[3] == 'execute-primary-order' || segments[3] == 'process-primary-order' || segments[3] == 'dispatch-primary-order'){
            item_quantity_updated   =   quantity;
            distributor_id          =   proc_dist_id;
        }
        //Gross amount after trade price and Distributor Dsicount
        dist_discount_val           =   (parseFloat(item_dist_discount) / 100) * parseFloat(Grs_Amt_Af_TO)
        var Grs_Amt_Af_TO_DD        =   parseFloat(Grs_Amt_Af_TO) - dist_discount_val;

        //Gross amount after trade price , Distributor Dsicount and special discount
        var special_discount_val    =   parseFloat(special_discount)*quantity; //(parseFloat(special_discount) / 100) * parseFloat(Grs_Amt_Af_TO_DD) ;
        var Grs_Amt_Af_TO_DD_SD     =   parseFloat(Grs_Amt_Af_TO_DD) - special_discount_val;


        //Gross amount after trade price , Distributor Dsicount , special discount and booker discount
        var booker_discount_val     =   booker_discount*quantity;
        var Grs_Amt_Af_TO_DD_SD_BD  =   parseFloat(Grs_Amt_Af_TO_DD_SD) - booker_discount_val;

        //Unit price before tax
        var unit_price_bf_tax       =   parseFloat(Grs_Amt_Af_TO_DD_SD_BD/quantity);

        //Unit tax on retail price
        var unit_tax                =   (parseFloat(tax_amount) / 100) * parseFloat(item_retail_price);

        //Total tax
        var total_tax               =   unit_tax*quantity;

        //Gross amount after trade price , Distributor Dsicount , special discount and tax
        var Grs_Amt_Af_TO_DD_SD_tax =   Grs_Amt_Af_TO_DD_SD_BD+total_tax;

        var unit_price              =   parseFloat(Grs_Amt_Af_TO_DD_SD_tax/quantity);


        order_content.find(x => {
            if (x.item_id == item_id && x.unit_id == unit_id && x.distributor_id == distributor_id ) {
                x.pref_id               =   pref_id;
                x.item_id               =   item_id;
                x.item_name             =   item_name;
                x.item_sku              =   item_sku;
                x.unit_id               =   unit_id;
                x.is_tax                =   is_tax;
                x.item_retail_price     =   item_retail_price;
                x.tax_class_id          =   tax_class_id;
                x.tax_amount            =   tax_amount;
                x.distributor_id        =   distributor_id;
                x.item_quantity_updated =   item_quantity_updated;
                x.booked_total_qty      =   booked_total_qty;
                x.parent_qty_sold       =   quantity;
                x.quantity              =   quantity;
                x.trade_price           =   trade_price;
                x.grass_amount          =   grass_amount;
                x.scheme_id             =   scheme_id;
                x.scheme_title          =   scheme_title;
                x.scheme_applied        =   scheme_applied;
                x.scheme_type           =   scheme_type;
                x.scheme_rule           =   scheme_rule;
                x.scheme_datatype       =   scheme_datatype;
                x.scheme_discount       =   scheme_discount;
                x.Grs_Amt_Af_TO         =   Grs_Amt_Af_TO;
                x.dist_discount         =   item_dist_discount;
                x.booker_discount_val   =   booker_discount_val;
                x.dist_discount_val     =   dist_discount_val;
                x.Grs_Amt_Af_TO_DD      =   Grs_Amt_Af_TO_DD;
                x.special_discount      =   special_discount;
                x.special_discount_val  =   special_discount_val;
                x.booker_discount       =   booker_discount;
                x.Grs_Amt_Af_TO_DD_SD_BD=   Grs_Amt_Af_TO_DD_SD_BD;
                x.unit_price_bf_tax     =   unit_price_bf_tax;
                x.unit_tax              =   unit_tax;
                x.total_tax             =   total_tax;
                x.unit_price            =   unit_price;
                x.final_price           =   Grs_Amt_Af_TO_DD_SD_tax;
                id_found = true;
                return;
            }
        });

        if (!id_found) {
            order_content.push({
                'pref_id'               :   pref_id,
                'item_id'               :   item_id,
                'item_name'             :   item_name,
                'item_sku'              :   item_sku,
                'unit_id'               :   unit_id,
                'is_tax'                :   is_tax,
                'item_retail_price'     :   item_retail_price,
                'tax_class_id'          :   tax_class_id,
                'tax_amount'            :   tax_amount,
                'distributor_id'        :   distributor_id,
                'item_quantity_updated' :   item_quantity_updated,
                'booked_total_qty'      :   booked_total_qty,
                'booked_order_value'    :   booked_order_value,
                'parent_qty_sold'       :   quantity,
                'quantity'              :   quantity,
                'trade_price'           :   trade_price,
                'grass_amount'          :   grass_amount,
                'scheme_id'             :   scheme_id,
                'scheme_title'          :   scheme_title,
                'scheme_applied'        :   scheme_applied,
                'scheme_type'           :   scheme_type,
                'scheme_rule'           :   scheme_rule,
                'scheme_datatype'       :   scheme_datatype,
                'scheme_discount'       :   scheme_discount,
                'Grs_Amt_Af_TO'         :   Grs_Amt_Af_TO,
                'dist_discount'         :   item_dist_discount,
                'dist_discount_val'     :   dist_discount_val,
                'Grs_Amt_Af_TO_DD'      :   Grs_Amt_Af_TO_DD,
                'special_discount'      :   special_discount,
                'special_discount_val'  :   special_discount_val,
                'booker_discount'       :   booker_discount,
                'booker_discount_val'   :   booker_discount_val,
                'Grs_Amt_Af_TO_DD_SD_BD':   Grs_Amt_Af_TO_DD_SD_BD,
                'unit_price_bf_tax'     :   unit_price_bf_tax,
                'unit_tax'              :   unit_tax,
                'total_tax'             :   total_tax,
                'unit_price'            :   unit_price,
                'final_price'           :   Grs_Amt_Af_TO_DD_SD_tax,
                'dispatch_qty'          :   0,
                'dispatch_amount'       :   0
            });
        }
        //debugger
        populate_order_content();
    });
    $(document).on('input', '.item_quantity', function () {
        var val = $(this).val()?parseInt($(this).val()):0;
        if(isNaN(val)){
            val = val.replace(/[^0-9\.]/g,'');
            if(val.split('.').length>2)
                val =val.replace(/\.+$/,"");

            if(isNaN(val))
                val =   0;
        }
        val             =   Math.abs(parseFloat(val));
        $(this).val(val);
        if(val == 0)
            $("#booker_discount_"+pref_id).val(0);
        var pref_id     =   parseInt($(this).attr('pref_id'));
        last_input_id   =   "#qty_"+pref_id;

        item_quantity_change(pref_id,1);
    })

    $(document).on('input', '.item_booker_discount', function () {
        var b_val       =   $(this).val()?$(this).val():0
        var pref_id     =   parseInt($(this).attr('pref_id'));
        if(isNaN(b_val)){
            b_val = b_val.replace(/[^0-9\.]/g,'');
            if(b_val.split('.').length>2){
                b_val =b_val.replace(/\.+$/,"");
                $("#booker_discount_"+pref_id).val(b_val);
            }
            if(isNaN(b_val))
                b_val =   0;
        }
        booker_discount =   parseFloat(b_val);
        //debugger;
        last_input_id = "#booker_discount_"+pref_id;
        var cfp=       parseFloat($("#qty_"+pref_id).attr('final_price'));
        if( cfp < b_val){
            $(this).val(0);
            booker_discount =   0;
        }
        //debugger
        item_quantity_change(pref_id,1);
    })


    //Frieght Price ON Whole Order
    $(document).on('input', '.frieght_price', function () {
        //$( ".frieght_price" ).focusout(function() {
        var val = $(this).val()?$(this).val():0.0;
        //debugger
        if(isNaN(val)){
            val = val.replace(/[^0-9\.]/g,'');
            if(val.split('.').length>2){
                val =val.replace(/\.+$/,"");
                $(this).val(val);
            }
            if(isNaN(val))
                val =   0;
        }
        frieght_price   =   val;
        //console.log(frieght_price);
        last_input_id = ".frieght_price";
        populate_order_total();
    })

    //Remove Item From Array (Content Table)
    $(document).on('click', '.remove_order_content', function () {
        var item            = $(this).attr('iid');
        var pref            = $(this).attr('id');
        var unit            = $(this).attr('uid');
        var distributor_id  = $(this).attr('rid');

        remove_order_content.push({
            'pref_id': pref,
            'unit_id': unit,
            'distributor_id':distributor_id
        })

        order_content = order_content.filter(x => !(x.item_id == item && x.unit_id == unit && x.distributor_id == distributor_id));
        $(this).parent().parent().remove();
        populate_order_content();
    })



    $(document).on('click', '.view_order_detail', function () {
        $('.order_num').text('Loading...');
        $('.retailer_name').text('Loading...');
        $('.retailer_phone').text('Loading...');
        $('.retailer_location').text('Loading...');
        $('.status').text('Loading...');
        $('.booking_date').text('Loading...');
        $('.employee_name').text('Loading...');
        $('.order_items_body').empty();
        var thisRef = $(this);
        $.ajax({
            type: 'POST',
            url: '/order_detail/' + thisRef.attr('id'),
            data: {
                _token: $('input[name="_token"]').val(),
                type: 'primary'
            },
            success: function (response) {
                var response = JSON.parse(response);
                $('.order_num').text(response.core.id)
                $('.retailer_name').text(response.core.retailer_name);
                $('.retailer_phone').text(response.core.retailer_phone);
                $('.retailer_location').text(response.core.retailer_address);
                $('.status').text(response.core.status);
                $('.booking_date').text(response.core.order_date);
                $('.employee_name').text(response.core.employee_name);

                var total_qty           =   0;
                var total_to_disc       =   0;
                var total_distr_disc    =   0;
                var total_spc_disc      =   0;
                var total_booker_disc   =   0;
                var total_discount      =   0;
                var total_gross_amount  =   0;
                var total_tax           =   0;
                var total_net_amount    =   0;
                response.content.forEach(element => {
                    total_discount      =   total_discount+parseFloat(element['total_discount']) ;
                    var grossAmount     =   element['tp'] * element['quantity'] ;
                    var tradeDiscount   =   parseFloat(element["scheme_discount"]?element["scheme_discount"]:0);
                    var distDiscount    =   parseFloat(element['distributor_discount']?element["distributor_discount"]:0);
                    var specialDiscount =   parseFloat(element['special_discount_pkr']?element["special_discount_pkr"]:0);
                    var bookerDiscount  =   parseFloat(element['booker_discount_pkr'] ?element["booker_discount_pkr"]:0);
                    var netAmount       =   parseFloat(element['final_price'] ?element["final_price"]:0);
                    //debugger
                    total_qty           =   total_qty+element['quantity'];
                    total_to_disc       =   total_to_disc+tradeDiscount;
                    total_distr_disc    =   total_distr_disc+(parseFloat(element['distributor_discount_pkr']?element["distributor_discount_pkr"]:0));
                    total_spc_disc      =   total_spc_disc+specialDiscount;
                    total_net_amount    =   total_net_amount+(element['final_price'] ?element["final_price"]:0);
                    total_tax           =   total_tax+element['total_tax_amount'];
                    total_booker_disc    =   total_booker_disc+bookerDiscount;
                    total_gross_amount  =   total_gross_amount+netAmount;

                    $('.order_items_body').append(`<tr>
                        <td>${element['item_sku']}</td>
                        <td>${element['item_name']}</td>
                        <td>${addCommas(element['tp'].toFixed(2))}</td>
                        <td>${addCommas(element['quantity'])}</td>
                        <td>${addCommas(grossAmount.toFixed(2))}</td>
                        <td>${addCommas(tradeDiscount.toFixed(2))}</td>
                        <td>${addCommas(distDiscount.toFixed(2))}</td>
                        <td>${addCommas(specialDiscount.toFixed(2))}</td>
                        <td>${addCommas(bookerDiscount.toFixed(2))}</td>
                        <td>${addCommas(element['total_tax_amount'].toFixed(2))}</td>
                        <td>${addCommas(netAmount.toFixed(2))}</td>
                    </tr>`);

                })
                var frieght_price   =   parseFloat(response.core.frieght_price == null ? 0:response.core.frieght_price);
                $('.order_items_body').append(`<tr style="background-color: #eaeaea">
                <td colspan="3"><strong>Total.</strong></td>
                <td><strong>${addCommas(total_qty)}</strong></td>
                <td><strong>${addCommas(total_gross_amount.toFixed(2))}</strong></td>
                <td><strong>${addCommas(total_to_disc.toFixed(2))}</strong></td>
                <td><strong>${addCommas(total_distr_disc.toFixed(2))}</strong></td>
                <td><strong>${addCommas(total_spc_disc.toFixed(2))}</strong></td>
                <td><strong>${addCommas(total_booker_disc.toFixed(2))}</strong></td> 
                <td><strong>${addCommas(total_tax.toFixed(2))}</strong></td>
                <td><strong>${addCommas(total_net_amount.toFixed(2))}</strong></td>
                </tr> 
                <tr>
                <td class="border-0"></td>
                <td class="border-0"></td>
                <td class="border-0"></td>
                <td class="border-0"></td>
                <td class="border-0"></td>
                <td class="border-0"></td>
                <td class="border-0"></td>
                <td class="border-0"></td>
                <td class="border-0"></td>
                    <td><strong>Frieght Price PKR.</strong></td>
                    <td><strong>${addCommas(frieght_price.toFixed(2))}</strong></td>
                </tr>
                <tr>
                <td class="border-0"></td>
                <td class="border-0"></td>
                <td class="border-0"></td>
                <td class="border-0"></td>
                <td class="border-0"></td>
                <td class="border-0"></td>
                <td class="border-0"></td>
                <td class="border-0"></td>
                <td class="border-0"></td>
                    <td style="background-color:#555 ; color:#fff">
                        <strong>Total PKR.</strong></td>
                    <td style="background-color:#555; color:#fff">
                        <strong>${addCommas((total_gross_amount+parseFloat(frieght_price)).toFixed(2))}</strong></td>
                </tr>`);
                //debugger
            }
        });
    });



    $(document).on('click', '.nav-link', function () {
        current_list = $(this).attr('name');
        $('.allOrders_list_view_div').empty();
        $('.processedOrders_list_view_div').empty();
        $('.completedOrders_list_view_div').empty();
        $('.cancelledOrders_list_view_div').empty();

        $('#searchOrders').val('');
        $('.count_all_orders').text(new_orders_array.length);
        $('.count_processed_orders').text(processed_orders_array.length);
        $('.count_completed_orders').text(completed_orders_array.length);
        $('.count_cancelled_orders').text(cancelled_orders_array.length);

        var array = [];
        var order_list_div = '';
        if (current_list == 'all_orders') {
            array = new_orders_array;
            order_list_div = 'allOrders_list_view_div';
        } else if (current_list == 'processed_orders') {
            array = processed_orders_array;
            order_list_div = 'processedOrders_list_view_div';
        } else if (current_list == 'completed_orders') {
            array = completed_orders_array;
            order_list_div = 'completedOrders_list_view_div';
        } else if (current_list == 'cancelled_orders') {
            array = cancelled_orders_array;
            order_list_div = 'cancelledOrders_list_view_div';
        }

        var orders = array.length;
        var recsPerPage = 12;
        var OrdersPages = Math.ceil(orders / recsPerPage);
        offset = 0;
        var pageNo = 0;
        var current_records = 0;
        var array_emp_count = 0;
        var total_indexes = 0;

        fetchPagination(OrdersPages, current_records);
        var cat_index = [];
        array.forEach(element => {
            current_records++;
            array_emp_count++;
            if (current_records <= 12) {
                $(`.${order_list_div}`).append(`<div class="Product-row">
                    <div class="row">
                        <div class="col colStyle" style="max-width:115px">
                            <div class="pt-5">${element['date']}</div>
                        </div>
                        <div class="col colStyle" style="max-width:225px">
                            <div class="pt-5">${element['emp_name']} </div>
                        </div>
                        <div class="col colStyle" style="max-width:137px">
                            <div class="pt-5">${addCommas(element['order_total'].toFixed(2))}</div>
                        </div>
                        <div class="col colStyle" style="max-width:225px">
                            <div class="pt-5">${element['zone_name'] ? element['zone_name'] : 'NA'}</div>
                        </div>
                        <div class="col colStyle" style="max-width:420px; padding-left:0">

                        ${segments[3] == 'primary_orders_list'
                    ?
                    `${current_list == 'completed_orders' || element['status'] == 'completed'  || element['status'] == 'processed'  || element['status'] == 'cancelled' ? `` : `<a href="/edit_primary_order/${element['id']}" class="btn btn-edit">Edit</a> <button class="btn cusDetail mark_process" id="${element['id']}">Mark Process</button>`}
                        <button data-toggle="modal" id="${element['id']}" data-target="#order_detail_modal" class="btn btn-edit view_order_detail">View Detail</button>
                        ${element['status'] == 'processed' ? `<a href="/execute-primary-order/${element['id']}" class="btn btn-edit">Execute</a>` : ``} `
                    :
                    `${current_list == 'all_orders' ? `<a href="/edit_secondary_order/${element['id']}" class="btn btn-edit">Edit</a>
                        <button class="btn cusDetail view_load_sheet" id="${element['id']}">Load Sheet</button>
                        <button class="btn cusDetail view_delivery_challan" id="${element['id']}">Delivery Challan</button>
                        <button class="btn cusDetail view_bill" id="${element['id']}">Bills</button>
                        <button data-toggle="modal" id="${element['id']}" data-target="#order_detail_modal" class="btn btn-edit view_order_detail">Detail</button>` : (current_list == 'processed_orders' ? `<button data-toggle="modal" id="${element['id']}" data-target="#order_detail_modal" class="btn btn-edit view_order_detail">Detail</button>` : (current_list == 'completed_orders' ? `<button data-toggle="modal" id="${element['id']}" data-target="#order_detail_modal" class="btn btn-edit view_order_detail">Detail</button> <button class="btn cusDetail view_load_sheet" id="${element['id']}">Load Sheet</button>` : `<button data-toggle="modal" id="${element['id']}" data-target="#order_detail_modal" class="btn btn-edit view_order_detail">Detail</button>`))}`
                }

                        </div>
                    </div>
                </div>`);
            }
            cat_index.push(element);
            //debugger
            all_orders_list[total_indexes] = cat_index;
            if (array_emp_count == 12) {
                array_emp_count = 0;
                cat_index = [];
                total_indexes++;
            }
        });
    })

    $(document).on('click', '.all_orders_link', function () {
        var not_found = true;
        var current_active_page = parseFloat($(this).attr('name'));
        //let sno = (12 * current_active_page) + 1;
        not_found = false;
        var order_list_div = '';
        if (current_list == 'all_orders') {
            order_list_div = 'allOrders_list_view_div';
        } else if (current_list == 'processed_orders') {
            order_list_div = 'processedOrders_list_view_div';
        } else if (current_list == 'completed_orders') {
            order_list_div = 'completedOrders_list_view_div';
        } else if (current_list == 'cancelled_orders') {
            order_list_div = 'cancelledOrders_list_view_div';
        }

        if (!not_found) {
            $('.allOrders_list_view_div').empty();
            $('.processedOrders_list_view_div').empty();
            $('.completedOrders_list_view_div').empty();
            $('.cancelledOrders_list_view_div').empty();
            all_orders_list[current_active_page].map(function (element) {
                //debugger
                $(`.${order_list_div}`).append(`<div class="Product-row">
                    <div class="row">
                        <div class="col colStyle" style="max-width:115px">
                            <div class="pt-5">${element['date']}</div>
                        </div>
                        <div class="col colStyle" style="max-width:225px">
                            <div class="pt-5">${element['emp_name']} </div>
                        </div>
                        <div class="col colStyle" style="max-width:137px">
                            <div class="pt-5">${addCommas(element['order_total'].toFixed(2))}</div>
                        </div>
                        <div class="col colStyle" style="max-width:225px">
                            <div class="pt-5">${element['zone_name'] ? element['zone_name'] : 'NA'}</div>
                        </div>
                        <div class="col colStyle" style="max-width:420px; padding-left:0">

                        ${segments[3] == 'primary_orders_list'
                    ?
                    `${current_list == 'completed_orders' || element['status'] == 'completed'  || element['status'] == 'processed'  || element['status'] == 'cancelled' ? `` : `<a href="/edit_primary_order/${element['id']}" class="btn btn-edit">Edit</a> <button class="btn cusDetail mark_process" id="${element['id']}">Mark Process</button>`}
                        <button data-toggle="modal" id="${element['id']}" data-target="#order_detail_modal" class="btn btn-edit view_order_detail">View Detail</button>
                        ${element['status'] == 'processed' ? `<a href="/execute-primary-order/${element['id']}" class="btn btn-edit">Execute</a>` : ``} `
                    :
                    `${current_list == 'all_orders' ? `<a href="/edit_secondary_order/${element['id']}" class="btn btn-edit">Edit</a>
                        <a href="/fpdf/loadSheet.php?emp=${element['employee_id']}&date=${element['order_date']}" rel="noopener noreferrer" target="_blank" class="btn cusDetail view_load_sheet" id="${element['id']}">Load Sheet</a>
                        <a href="/fpdf/delivery_challan.php?emp=${element['employee_id']}&date=${element['order_date']}" rel="noopener noreferrer" target="_blank" class="btn cusDetail view_delivery_challan" id="${element['id']}">Delivery Challan</a>
                        <a href="/fpdf/index.php?order=${element['id']}" rel="noopener noreferrer" target="_blank" class="btn cusDetail" id="${element['id']}">Bills</a>
                        <button data-toggle="modal" id="${element['id']}" data-target="#order_detail_modal" class="btn btn-edit view_order_detail">Detail</button>` : (current_list == 'processed_orders' ? `<button data-toggle="modal" id="${element['id']}" data-target="#order_detail_modal" class="btn btn-edit view_order_detail">Detail</button>` : (current_list == 'completed_orders' ? `<button data-toggle="modal" id="${element['id']}" data-target="#order_detail_modal" class="btn btn-edit view_order_detail">Detail</button> <button class="btn cusDetail view_load_sheet" id="${element['id']}">Load Sheet</button>` : `<button data-toggle="modal" id="${element['id']}" data-target="#order_detail_modal" class="btn btn-edit view_order_detail">Detail</button>`))}`
                }


                        </div>
                    </div>
                </div>`);
                //debugger
                //sno++;
            });
        }

    })

    $(document).on('input', '#searchOrders', function () {
        renderOrderSearch($(this).val());
    })


    $(document).on('click', '.mark_complete', function(){
        var thisRef = $(this);
        thisRef.attr('disabled', 'disabled');
        thisRef.text('Processing...');
        //thisRef.parent().find('.btn').attr('disabled', 'disabled');
        $.ajax({
            type: 'POST',
            url: '/mark_dist_order_complete/' + thisRef.attr('id'),
            data: {
                _token: $('input[name="_token"]').val(),
                type: segments[3] == 'primary_orders_list' ? 'primary' : 'secondary'
            },
            success: function (response) {
                var response = JSON.parse(response);
                thisRef.removeAttr('disabled');
                thisRef.text('Mark Complete');
                if(response == 'success'){
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Completed Successfully!');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    fetchSecondaryOrders();
                }else{
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to complete at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        });
    });//
    $(document).on('click','.dist_not_approved',()=>{
        var thisRef = $(this);
        swal("Warning", "Distributor is not approved!", "warning");
    });
    $(document).on('click', '.mark_to_processed', function(){
        var thisRef = $(this);
        swal({
            title: "Are you sure you want to process?",
            text:  "Once processed, you will not be able to recover!",
            icon:  "warning",
            buttons: true,
            buttons: ["No","Yes"],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {

                thisRef.attr('disabled', 'disabled');
                thisRef.text('Processing...');
                $.ajax({
                    type: 'POST',
                    url: '/mark_dist_order_processed/' + thisRef.attr('id'),
                    data: {
                        _token: $('input[name="_token"]').val(),
                    },
                    success: function (response) {
                        var response = JSON.parse(response);
                        thisRef.removeAttr('disabled');
                        thisRef.text('Dispatch');
                        if(response == 'success'){
                            $('#notifDiv').fadeIn();
                            $('#notifDiv').css('background', 'green');
                            $('#notifDiv').text('Processed Successfully!');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);
                            $('#order-title').html(`<h2>Pending Orders <span> List</span></h2>`);
                            primaryOrderList('Pending');
                        }else{
                            $('#notifDiv').fadeIn();
                            $('#notifDiv').css('background', 'red');
                            $('#notifDiv').text('Failed to process at the moment');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);
                        }
                    }
                });
            }
        });
    })
    $(document).on('click', '.mark_to_executed', function(){
        var thisRef = $(this);

        swal({
            title: "Are you sure you want to dispatch?",
            text:  "Once dispatched, you will not be able to recover!",
            icon:  "warning",
            buttons: true,
            buttons: ["No","Yes"],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                thisRef.attr('disabled', 'disabled');
                thisRef.text('Dispatching...');
                $.ajax({
                    type: 'POST',
                    url: '/mark_dist_order_executed/' + thisRef.attr('id'),
                    data: {
                        _token: $('input[name="_token"]').val(),
                    },
                    success: function (response) {
                        var response = JSON.parse(response);
                        thisRef.removeAttr('disabled');
                        thisRef.text('Process');
                        if(response == 'success'){
                            $('#notifDiv').fadeIn();
                            $('#notifDiv').css('background', 'green');
                            $('#notifDiv').text('Processed Successfully!');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);
                            $('#order-title').html(`<h2>Pending Orders <span> List</span></h2>`);
                            primaryOrderList('processed');
                        }else{
                            $('#notifDiv').fadeIn();
                            $('#notifDiv').css('background', 'red');
                            $('#notifDiv').text('Failed to process at the moment');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);
                        }
                    }
                });
            }
        });


    })
    $(document).on('click', '.mark_to_completed', function(){
        var thisRef = $(this);

        swal({
            title: "Are you sure you want to execute?",
            text:  "Once executed, you will not be able to recover!",
            icon:  "warning",
            buttons: true,
            buttons: ["No","Yes"],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {

                thisRef.attr('disabled', 'disabled');
                thisRef.text('Executing...');
                $.ajax({
                    type: 'POST',
                    url: '/mark_dist_order_completed/' + thisRef.attr('id'),
                    data: {
                        _token: $('input[name="_token"]').val(),
                    },
                    success: function (response) {
                        var response = JSON.parse(response);
                        thisRef.removeAttr('disabled');
                        thisRef.text('Executed');
                        if(response == 'success'){
                            $('#notifDiv').fadeIn();
                            $('#notifDiv').css('background', 'green');
                            $('#notifDiv').text('Processed Successfully!');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);
                            $('#order-title').html(`<h2>Pending Orders <span> List</span></h2>`);
                            primaryOrderList('Executed');
                        }else{
                            $('#notifDiv').fadeIn();
                            $('#notifDiv').css('background', 'red');
                            $('#notifDiv').text('Failed to process at the moment');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);
                        }
                    }
                });
            }
        });


    })
    $(document).on('click', '.mark_to_revert', function(){
        var thisRef = $(this);

        swal({
            title: "Are you sure you want to revert?",
            text:  "Once reverted, you will not be able to recover!",
            icon:  "warning",
            buttons: true,
            buttons: ["No","Yes"],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {

                thisRef.attr('disabled', 'disabled');
                thisRef.text('Reverting...');
                $.ajax({
                    type: 'POST',
                    url: '/revert-primary-order/' + thisRef.attr('id'),
                    data: {
                        _token: $('input[name="_token"]').val(),
                    },
                    success: function (response) {
                        var response = JSON.parse(response);
                        thisRef.removeAttr('disabled');
                        thisRef.text('Executed');
                        if(response == 'success'){
                            $('#notifDiv').fadeIn();
                            $('#notifDiv').css('background', 'green');
                            $('#notifDiv').text('Reverted Successfully!');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                                location.href = '/booked-primary-order';
                            }, 200);
                        }else{
                            $('#notifDiv').fadeIn();
                            $('#notifDiv').css('background', 'red');
                            $('#notifDiv').text('Failed to revert at the moment');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);
                        }
                    }
                });
            }
        });



    })
    $(document).on('click', '.mark_process', function(){
        var thisRef = $(this);
        thisRef.attr('disabled', 'disabled');
        thisRef.text('Processing...');
        //thisRef.parent().find('.btn').attr('disabled', 'disabled');
        $.ajax({
            type: 'POST',
            url: '/mark_dist_order_processed/' + thisRef.attr('id'),
            data: {
                _token: $('input[name="_token"]').val(),
                type: segments[3] == 'primary_orders_list' ? 'primary' : 'secondary'
            },
            success: function (response) {
                var response = JSON.parse(response);
                thisRef.removeAttr('disabled');
                thisRef.text('Mark Complete');
                if(response == 'success'){
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Processed Successfully!');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    fetchSecondaryOrders();
                }else{
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to processed at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        });
    })
    //Primary Order
    $(document).on('click', '.save_primary_order', function () {
        if (!$('.order_date').val()) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Select Date');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        if (order_content.length == 0) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Add Order Items');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        var ort = parseFloat($('.order_grand_total').attr('amount'))?parseFloat($('.order_grand_total').attr('amount')):0;
        if (ort == 0) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text("Order total is zero, You can't place empty order.");
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        var thisRef = $(this);
        thisRef.text('Processing...');
        thisRef.attr('disabled', 'disabled');

        var ajax_url = '/savePrimaryOrder';
        if (segments[3] == 'edit_primary_order') {
            ajax_url = `/editPrimaryOrder/${segments[4]}`;
        }
        $.ajax({
            type: 'POST',
            url: ajax_url,
            data: {
                _token: $('input[name="_token"]').val(),
                date: $('.order_date').val(),
                distributor_id: $('.distributor_id').val(),
                employee_id: $('.employee_id').val(),
                type: 'primary',
                order_content: order_content,
                frieght_price: frieght_price? frieght_price:0,
                remove_order_content: remove_order_content
            },
            success: function (response) {
                var response = JSON.parse(response);
                //return;
                thisRef.text('Save Order');
                //thisRef.removeAttr('disabled');
                if (response == 'success') {
                    location.href = "/processed-primary-order"
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to place Order');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        });
    })
    $(document).on('click', '.modify_primary_order', function () {

        if (order_content.length == 0) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Add Order Items');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        var ort = parseFloat($('.total_payment').attr('amount'))?parseFloat($('.total_payment').attr('amount')):0;
        if (ort == 0) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text("Order total is zero, You can't place empty order.");
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        var ajax_url = '';

        if (segments[3] == 'dispatch-primary-order'  ) {
            var ajax_url = `/dispatch-primary-order/${segments[4]}`;
        } else if (segments[3] == 'process-primary-order' ) {
            var ajax_url = `/process-primary-order/${segments[4]}`;
        } else if ( segments[3] == 'execute-primary-order'  ) {
            var ajax_url = `/execute-primary-order/${segments[4]}`;
        }

        var thisRef = $(this);
        thisRef.text('updating...');
        //thisRef.attr('disabled', 'disabled');


        $.ajax({
            type: 'POST',
            url: ajax_url,
            data: {
                _token: $('input[name="_token"]').val(),
                date: $('.order_date').val(),
                order_content: order_content,
                frieght_price: frieght_price? frieght_price:0,
            },
            success: function (response) {
                //var response = JSON.parse(response);
                //return;
                if (segments[3] == 'dispatch-primary-order'  ) {
                    thisRef.text('Dispatch');
                } else if (segments[3] == 'process-primary-order' ) {
                    thisRef.text('Process');
                } else if ( segments[3] == 'execute-primary-order'  ) {
                    thisRef.text('Execute');
                }
                if (response.status == 'success') {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text(response.msg);
                    setTimeout(() => {
                        if (segments[3] == 'dispatch-primary-order'  ) {
                            location.href = "/booked-primary-order"
                        } else if (segments[3] == 'process-primary-order' ) {
                            location.href = "/processed-primary-order"
                        } else if ( segments[3] == 'execute-primary-order'  ) {
                            location.href = "/executed-primary-order"
                        }
                        $('#notifDiv').fadeOut();
                    }, 500);

                } else {
                    thisRef.removeAttr('disabled');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text(response.msg);
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        });
    })



    //Return Primary Order
    $(document).on('click', '.return_primary_order', function () {
        if (!$('.order_date').val()) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Select Date');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        if (order_content.length == 0) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Add Order Items');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        var ort = parseFloat($('.order_grand_total').attr('amount'))?parseFloat($('.order_grand_total').attr('amount')):0;
        if (ort == 0) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text("Order total is zero, You can't place empty order.");
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        var thisRef = $(this);
        thisRef.text('Processing...');
        thisRef.attr('disabled', 'disabled');
        $.ajax({
            type: 'POST',
            url: '/return-primary-order',
            data: {
                _token: $('input[name="_token"]').val(),
                date: $('.order_date').val(),
                distributor_id: $('.distributor_id').val(),
                employee_id: $('.employee_id').val(),
                type: 'primary',
                order_content: order_content,
                frieght_price: frieght_price? frieght_price:0,
                remove_order_content: remove_order_content
            },
            success: function (response) {
                var response = JSON.parse(response);
                //return;
                thisRef.text('Save Order');
                //thisRef.removeAttr('disabled');
                if (response == 'success') {
                    location.href = "/completed-primary-order"
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to place Order');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        });
    })


    ///////Booking Vs Execution START
    $(document).on('change', '.comparison_distributor_id', function(){
        $('.comparison_booker_id').empty();
        $('.comparison_booker_id').append(`<option selected disabled value="0">Please Wait...</option>`);
        $.ajax({
            type: 'POST',
            url: '/orderBookersAgainstDistributors/'+$(this).val(),
            data: {
                _token: $('input[name="_token"]').val()
            },
            success: function (response) {
                var response = JSON.parse(response);
                $('.comparison_booker_id').empty();
                $('.comparison_booker_id').append(`<option selected disabled value="0">Order Booker</option>`);
                response.forEach(element => {
                    $('.comparison_booker_id').append(`<option value="${element['employee_id']}">${element['employee_name']}</option>`);
                })
            }
        });
    })

    $(document).on('click', '.fetch_comparison', function(){
        if(!$('.comparison_date').val() || !$('.comparison_distributor_id').val() || !$('.comparison_booker_id').val()){
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Select Date, Distributor And Order Booker!');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return
        }

        var thisRef = $(this);
        thisRef.attr('disabled', 'disabled');
        thisRef.text('Please Wait...');
        $('.booker_name').text('--');
        $('.booking_date').text('--');
        $('.ttl_booking_amount').text('--');
        $('.ttl_execution_amount').text('--');

        $('.ttl_booking').text('--');
        $('.ttl_booked_orders').text('--');
        $('.ttl_visited_shops').text('--');
        $('.ttl_executions').text('--');
        $('.ttl_orders_exected').text('--');
        $('.ttl_cancel_orders').text('--');
        $('.booking_rows').empty();

        $.ajax({
            type: 'POST',
            url: '/FetchBookingVsExecution',
            data: {
                _token: $('input[name="_token"]').val(),
                date: $('.comparison_date').val(),
                distributor: $('.comparison_distributor_id').val(),
                order_booker: $('.comparison_booker_id').val()
            },
            success: function (response) {
                var response = JSON.parse(response);
                thisRef.removeAttr('disabled');
                thisRef.text('Fetch');
                $('.booker_name').text($('.comparison_booker_id option:selected').text());
                $('.booking_date').text($('.comparison_date').val());

                var total_booking_value = 0;
                var total_execution_value = 0;
                var total_executed_orders = 0;
                var total_cancel_orders = 0;
                //var total_booking_value = 0;
                response.orders.forEach(element => {
                    $('.booking_rows').append(`<div class="Product-row">
                        <div class="row">
                            <div class="col _ITEMNAME" style="max-width:255px;font-size:14px;">
                                <div class="pt-10"><strong>${element['retailer_name']}</strong>
                                    <span class="r-location"><i class="fa fa-map-marker-alt"></i> ${element['retailer_address']}
                                    </span>
                                </div>
                            </div>

                            <div class="col colStyle font-no" style="max-width:159px">
                                <div class="pt-10">${element['total_product_booked']}</div>
                            </div>

                            <div class="col colStyle font-no" style="max-width:172px">
                                <div class="pt-10">${element['status'] == 'completed' ? element['total_products_executed'] : 0}</div>
                            </div>

                            <div class="col colStyle font-no" style="max-width:135px">
                                <div class="pt-10"><small>Rs.</small> ${element['booked_amount'] ? addCommas(element['booked_amount'].toFixed(2)) : 0}</div>
                            </div>

                            <div class="col colStyle font-no" style="max-width:150px">
                                <div class="pt-10"><small>Rs.</small> ${element['status'] == 'completed' ? addCommas(element['executed_amount'].toFixed(2)) : 0}</div>
                            </div>

                            <div class="col colStyle" style="max-width:127px">
                                <div class="pt-10"><i class="fa fa-circle ${(element['status'] == 'completed' ? 'executed-st' : (element['status'] == 'cancelled' ? 'cancel-st' : 'pending-st'))}"></i> ${(element['status'] ? element['status'] : 'Pending')}</div>
                            </div>

                            <div class="col colStyle" style="max-width:115px">
                                <div class="pt-10">
                                    <a href="/bookingVsExecutionDetail/${element['id']}" class="btn btn-default btn-line smBTN">View Detail</a></div>
                            </div>
                        </div>
                    </div>`);

                    if(element['status'] == 'completed'){
                        total_execution_value += (element['executed_amount'] ? element['executed_amount'] : 0);
                        total_executed_orders ++;
                    }
                    if(element['status'] == 'cancelled'){
                        total_cancel_orders ++;
                    }

                    total_booking_value += (element['booked_amount'] ? element['booked_amount'] : 0);

                })
                $('.ttl_booking_amount').text('Rs. ' + addCommas(total_booking_value.toFixed(2)));
                $('.ttl_execution_amount').text('Rs. ' + addCommas(total_execution_value.toFixed(2)));

                $('.ttl_booking').text(response.orders.length);
                $('.ttl_booked_orders').text(response.orders.length);
                $('.ttl_executions').text(total_executed_orders);

                $('.ttl_orders_exected').text(total_executed_orders);
                $('.ttl_cancel_orders').text(total_cancel_orders);

                $('.ttl_visited_shops').text(response.shops_visited);
            }
        });
    })

});
function getRetailerForPrimaryOrder(dist_id){
    {
        inv_pref = [];
        inventory_for_order = [];
        all_special_discounts = [];
        $('.order_items').empty();
        $('.item_id').val('0').trigger('change');
        // $('.unit_id').empty();
        // $('.unit_id').append(`<option selected disabled value='0'>Select Unit</option>`);
        if (segments[3] == 'edit_primary_order') {
            var id = $('#distributor_id_edit').val()
        }
        else{
            var id = dist_id;
        }
        $.ajax({
            type: 'POST',
            url: '/getRetailerForPrimaryOrder/' + id,
            data: {
                _token: $('input[name="_token"]').val()
            },
            success: function (response) {
                var response = JSON.parse(response);
                inv_pref = response.pref;
                inventory_for_order = response.inventory;
                all_special_discounts = response.special_discount;
                inventory_for_order.forEach(element => {
                    item_scheme_schemes[element.item_id] =   [];
                    if (typeof element.schemes !== 'undefined') {
                        element.schemes.forEach(x => {
                            item_scheme_schemes[element.item_id][x.id] = x;
                        });
                    }
                });
                if (segments[3] == 'edit_primary_order' ) {
                    fetchOrderData();
                    order_update_id = segments[4];
                }
                //debugger
                if (segments[3] == 'execute-primary-order' || segments[3] == 'process-primary-order' || segments[3] == 'dispatch-primary-order') {
                    populateExecutedInventory();
                }
                else{
                    populateInventory();
                }

            }
        });
    }
}
function reset_order_content(){
    order_content   =   [];
    populate_order_content();
}
function populate_order_total() {
    if (segments[3] == 'execute-primary-order' || segments[3] == 'process-primary-order' || segments[3] == 'dispatch-primary-order') {
        populate_execute_order_total();
    } else {
        populate_standard_order_total();
    }

}
function populate_standard_order_total(){
    var order_gross_amount      =   0;
    var order_total_discount    =   0;
    var order_sub_total         =   0;
    var order_tax               =   0;
    var order_total_items       =   0;
    var order_total_qty         =   0;
    for (var i=0; i< order_content.length; i++) {
        var element     =   order_content[i];
        order_gross_amount += element['grass_amount'];
        order_total_discount += (element['scheme_discount'] + element['dist_discount_val'] + element['special_discount_val'] + element['booker_discount_val']);
        order_sub_total += element['Grs_Amt_Af_TO_DD_SD_BD'];
        order_tax += element['total_tax'];
        order_total_items   =   order_total_items+1;
        order_total_qty=order_total_qty+element['quantity'];
    }
    order_sub_total =   parseFloat(order_sub_total);
    $('.order_total_items').text(order_total_items);
    $('.order_total_qty').text(order_total_qty);

    $('.order_gross_amount').text(addCommas(order_gross_amount.toFixed(2)));
    $('.order_gross_amount').attr('amount', order_gross_amount);


    $('.order_total_discount').text(addCommas(order_total_discount.toFixed(2)));
    $('.order_total_discount').attr('amount', order_total_discount);


    $('.order_sub_total').text(addCommas(order_sub_total.toFixed(2)));
    $('.order_sub_total').attr('amount', order_sub_total);


    frieght_price           =  frieght_price ? parseFloat(frieght_price) : 0 ;

    var order_sub_total_af_FP     =  order_sub_total + frieght_price;


    $('.order_sub_total_af_FP').text(addCommas(order_sub_total_af_FP.toFixed(2)));
    $('.order_sub_total_af_FP').attr('amount', order_sub_total_af_FP);

    $('.order_tax').text(addCommas(order_tax.toFixed(2)));
    $('.order_tax').attr('amount', order_tax);

    var order_grand_total     =   order_sub_total_af_FP+order_tax;

    $('.order_grand_total').text(addCommas(order_grand_total.toFixed(2)));
    $('.order_grand_total').attr('amount', order_grand_total);
}

function populate_execute_order_total(){
    var order_gross_amount          =   0;
    var order_total_discount        =   0;
    var order_sub_total             =   0;
    var order_tax                   =   0;
    var total_scheme_discount       =   0;
    var total_distributor_discount  =   0;
    var total_special_discount      =   0;
    var total_booker_discount       =   0;
    var order_total_items           =   0;
    var order_total_qty             =   0;
    for (var i=0; i< order_content.length; i++) {
        var element     =   order_content[i];
        order_gross_amount += element['grass_amount'];
        total_scheme_discount += element['scheme_discount'];
        total_distributor_discount += element['dist_discount_val'];
        total_special_discount += element['special_discount_val'];
        total_booker_discount += element['booker_discount_val'];
        order_total_discount += (element['scheme_discount'] + element['dist_discount_val'] + element['special_discount_val'] + element['booker_discount_val']);
        order_sub_total += element['Grs_Amt_Af_TO_DD_SD_BD'];
        order_tax += element['total_tax'];
        order_total_items   =   order_total_items+1;
        order_total_qty     =   order_total_qty+element['parent_qty_sold'];
    }
    $('.order_total_items').text(order_total_items);
    $('.order_total_qty').text(order_total_qty);
    order_sub_total =   parseFloat(order_sub_total);
    if(parseFloat(order_gross_amount)==0)
    {
        frieght_price = 0;
    }
    $('.gross_amount').text(addCommas(order_gross_amount.toFixed(2)));
    $('.total_scheme_discount').text(addCommas(total_scheme_discount.toFixed(2)));
    $('.total_distributor_discount').text(addCommas(total_distributor_discount.toFixed(2)));
    $('.total_special_discount').text(addCommas(total_special_discount.toFixed(2)));
    $('.total_booker_discount').text(addCommas(total_booker_discount.toFixed(2)));


    $('.order_tax').text(addCommas(order_tax.toFixed(2)));
    var total_payment   =   (order_gross_amount+frieght_price+order_tax)-order_total_discount;
    $('.total_payment').text(addCommas(total_payment.toFixed(2)));
    $('.total_payment').attr('amount',total_payment);
}

function populate_standard_order_content(){
    $('.order_items').empty();
    var table = $('#order_table').DataTable();
    table.destroy();
    $('.order_items').empty();
    var order_gross_amount      =   0;
    var order_total_discount    =   0;
    var order_sub_total         =   0;
    var order_tax               =   0;
    var order_total_qty         =   0;
    for (var i=0; i< order_content.length; i++) {
        var element     =   order_content[i];
        $('.order_items').append(` <tr id="otr-${element['pref_id']}" > 
                <td>${element['item_sku']}</td>
                <td style="line-height:14px;">${element['item_name']}</td>
                <td><input   onkeypress="return isNumberKeyOnly(event)" placeholder="0" pref_id="${element['pref_id']}" item_name="${element['item_name']}" item_sku="${element['item_sku']}" trade_price="${element['trade_price']}" scheme_id="${element['scheme_id']}" scheme_applied="${element['scheme_applied']}"  id="qty_${element['pref_id']}" iid="${element['item_id']}" uid="${element['unit_id']}" rid="${element['distributor_id']}"   is_tax="${element['is_tax']}" item_retail_price="${element['item_retail_price']}"  tax_class_id="${element['tax_class_id']}"  tax_amount="${element['tax_amount']}"  item_discount="${element['dist_discount']}" spec_discount="${element['special_discount']}"   value="${element['quantity']}" class="itemQTY item_quantity" min="0" ></td>
                <td>${addCommas(element['trade_price'].toFixed(2))}</td>
                <td id="otd-gross-amount-${element['pref_id']}">${addCommas(element['grass_amount'].toFixed(2))}</td>
                <td>${addCommas(element['scheme_discount'].toFixed(2))}  </td>
                <td>${addCommas(element['dist_discount'].toFixed(2))} </td>
                <td>${addCommas(element['special_discount'].toFixed(2))} </td>
                <td><input placeholder="0" pref_id="${element['pref_id']}"  id="booker_discount_${element['pref_id']}" value="${element['booker_discount']==0?'':element['booker_discount']}" class="itemQTY item_booker_discount" min="0"  onkeypress="return isNumberKey(event)"> </td>
                <td id="otd-total-tax-${element['pref_id']}" >${addCommas(element['total_tax'].toFixed(2))}</td>
                <td id="otd-final-price-${element['pref_id']}" >${addCommas(element['final_price'].toFixed(2))}</td>
                <td><button id="${element['pref_id']}" iid="${element['item_id']}" uid="${element['unit_id']}" rid="${element['distributor_id']}" class="btn smBTN red-bg mb-0 remove_order_content">Delete</button></td>
            </tr>`);
        order_gross_amount += element['grass_amount'];
        order_total_discount += (element['scheme_discount'] + element['dist_discount_val'] + element['special_discount_val'] + element['booker_discount_val']);
        order_sub_total += element['Grs_Amt_Af_TO_DD_SD_BD'];
        order_tax += element['total_tax'];
        order_total_qty=order_total_qty+element['quantity'];
    }
    order_sub_total =   parseFloat(order_sub_total);
    $('.close_modal').click();
    $('.unit_id').val(0).trigger('change');
    $('.quantity').val('');
    $('.order_total_items').text(order_content.length);
    $('.order_total_items').text(order_total_qty);

    $('.order_gross_amount').text(addCommas(order_gross_amount.toFixed(2)));
    $('.order_gross_amount').attr('amount', order_gross_amount);


    $('.order_total_discount').text(addCommas(order_total_discount.toFixed(2)));
    $('.order_total_discount').attr('amount', order_total_discount);


    $('.order_sub_total').text(addCommas(order_sub_total.toFixed(2)));
    $('.order_sub_total').attr('amount', order_sub_total);


    frieght_price           =  frieght_price ? parseFloat(frieght_price) : 0 ;

    var order_sub_total_af_FP     =  order_sub_total + frieght_price;


    $('.order_sub_total_af_FP').text(addCommas(order_sub_total_af_FP.toFixed(2)));
    $('.order_sub_total_af_FP').attr('amount', order_sub_total_af_FP);

    $('.order_tax').text(addCommas(order_tax.toFixed(2)));
    $('.order_tax').attr('amount', order_tax);

    var order_grand_total     =   order_sub_total_af_FP+order_tax;

    $('.order_grand_total').text(addCommas(order_grand_total.toFixed(2)));
    $('.order_grand_total').attr('amount', order_grand_total);

    $('#order_table').DataTable( {
        "bSort": false,
        paging: false
    } );
    //debugger
    populateInventory();
}

function populate_execute_order_content(){
    $('.loader_div').show();
    $('.order_items').empty();
    var table = $('#order_table').DataTable();
    table.destroy();
    $('.order_items').empty();
    var order_total_items           =   0;
    var order_gross_amount          =   0;
    var order_total_discount        =   0;
    var order_sub_total             =   0;
    var order_tax                   =   0;
    var total_scheme_discount       =   0;
    var total_distributor_discount  =   0;
    var total_special_discount      =   0;
    var total_booker_discount       =   0;
    var order_total_qty             =   0;
    for (var i=0; i< order_content.length; i++) {
        var element = order_content[i];
        if(typeof element['item_status'] !== 'undefined' &&  element['item_status'] == '0') {
            //console.log('Deleted item')
        }else{
            var btn = `<button id="${element['pref_id']}" iid="${element['item_id']}" uid="${element['unit_id']}" rid="${element['distributor_id']}" class="btn smBTN red-bg mb-0 remove_order_content">Delete</button>`;
            if (parseInt(element['booked_total_qty']) > 0) {
                btn = `<button id="${element['pref_id']}"  iid="${element['item_id']}" uid="${element['unit_id']}" rid="${element['distributor_id']}" class="btn smBTN red-bg mb-0 "  onclick="change_order_quantity_to_zero('${element['pref_id']}')" type="button">Delete</button>`;
            }
            $('.order_items').append(` <tr id="otr-${element['pref_id']}" > 
                    <td style="line-height:14px;">${element['item_sku']}</td>
                    <td style="line-height:14px;">${element['item_name']}</td>
                    <td>${addCommas(element['booked_total_qty'])}</td>
                    <td><input onkeypress="return isNumberKeyOnly(event)"  placeholder="0" final_price="${parseFloat(element['final_price'])}" pref_id="${element['pref_id']}" booked_total_qty="${parseInt(element['booked_total_qty'])}" item_name="${element['item_name']}" item_sku="${element['item_sku']}" trade_price="${element['trade_price']}" scheme_id="${element['scheme_id']}" scheme_applied="${element['scheme_applied']}"  id="qty_${element['pref_id']}" iid="${element['item_id']}" uid="${element['unit_id']}" rid="${element['distributor_id']}"   is_tax="${element['is_tax']}" item_retail_price="${element['item_retail_price']}"  tax_class_id="${element['tax_class_id']}"  tax_amount="${element['tax_amount']}" item_discount="${element['dist_discount']}" spec_discount="${element['special_discount']}"  value="${element['parent_qty_sold']}" class="itemQTY item_quantity value_input" min="0"  onpress="isNumber(event)"></td>
                    <td>${addCommas(element['trade_price'].toFixed(2))}</td>
                    <td id="otd-gross-amount-${element['pref_id']}">${addCommas(element['grass_amount'].toFixed(2))}</td>
                    <td>${addCommas(element['scheme_discount'].toFixed(2))}  </td>
                    <td>${addCommas(element['dist_discount'].toFixed(2))} </td>
                    <td>${addCommas(element['special_discount'].toFixed(2))} </td>
                    <td><input placeholder="0" pref_id="${element['pref_id']}"  id="booker_discount_${element['pref_id']}" value="${element['booker_discount'] == 0 ? '' : element['booker_discount']}" class="itemQTY value_input  item_booker_discount"   onkeypress="return isNumberKey(event)"> </td>
                    <td id="otd-total-tax-${element['pref_id']}" >${addCommas(element['total_tax'].toFixed(2))}</td>
                    <td id="otd-final-price-${element['pref_id']}" >${addCommas(element['final_price'].toFixed(2))}</td>
                    <td>${btn}</td>
                </tr>`);
            order_gross_amount += element['grass_amount'];
            total_scheme_discount += element['scheme_discount'];
            total_distributor_discount += element['dist_discount_val'];
            total_special_discount += element['special_discount_val'];
            total_booker_discount += element['booker_discount_val'];
            order_total_discount += (element['scheme_discount'] + element['dist_discount_val'] + element['special_discount_val'] + element['booker_discount_val']);
            order_sub_total += element['Grs_Amt_Af_TO_DD_SD_BD'];
            order_tax += element['total_tax'];
            order_total_items = order_total_items + 1;
            order_total_qty     =   order_total_qty+element['parent_qty_sold'];
            debugger
        }
    }
    $('.order_total_items').text(order_total_items);
    $('.order_total_qty').text(order_total_qty);
    order_sub_total =   parseFloat(order_sub_total);
    if(parseFloat(order_gross_amount)==0)
    {
        frieght_price = 0;
    }
    $('.gross_amount').text(addCommas(order_gross_amount.toFixed(2)));
    $('.total_scheme_discount').text(addCommas(total_scheme_discount.toFixed(2)));
    $('.total_distributor_discount').text(addCommas(total_distributor_discount.toFixed(2)));
    $('.total_special_discount').text(addCommas(total_special_discount.toFixed(2)));
    $('.total_booker_discount').text(addCommas(total_booker_discount.toFixed(2)));


    $('.total_tax').text(addCommas(order_tax.toFixed(2)));
    var total_payment   =   (order_gross_amount+frieght_price+order_tax)-order_total_discount;
    $('.total_payment').text(addCommas(total_payment.toFixed(2)));
    $('.total_payment').attr('amount',total_payment);

    $('.close_modal').click();
    $('.unit_id').val(0).trigger('change');
    $('#order_table').DataTable( {
        "bSort": false,
        paging: false
    } );
    $('.loader_div').hide();
    //debugger
    populateExecutedInventory();
}
function populate_order_content() {
    if (segments[3] == 'execute-primary-order' || segments[3] == 'process-primary-order' || segments[3] == 'dispatch-primary-order') {
        populate_execute_order_content();
    } else {
        populate_standard_order_content();
    }
    // if(last_input_id != ''){
    //     //debugger
    //     var fieldInput = $(last_input_id);
    //     var fldLength= fieldInput.val().length;
    //     fieldInput.focus();
    //     fieldInput[0].setSelectionRange(fldLength, fldLength);
    //     //debugger
    // }
}

function item_schemes(item_id){
    if(typeof item_scheme_schemes !== 'undefined' && item_scheme_schemes.length > 0){
        return item_scheme_schemes[item_id];
    }
    else{
        return null;
    }
}
function item_scheme_data(item_id,scheme_id){
    //debugger
    if(typeof item_scheme_schemes !== 'undefined' && item_scheme_schemes.length > 0){
        return item_scheme_schemes[item_id][scheme_id];
    }
    else{
        return null;
    }
}
function fetchInvPrefs() {
    inv_pref = [];
    $.ajax({
        type: 'GET',
        url: '/fetchInvPrefs',
        success: function (response) {
            var response = JSON.parse(response)
            inv_pref = response.pref;
            inventory_for_order = response.inventory;
            populateInventory();
        }
    });
}
function populateInventory() {
    $('.inventory_table_body').empty();
    var searched_arr = [];
    var search = $('.search_from_inventory').val();
    if (search == '') {
        searched_arr = inventory_for_order;
    } else {
        searched_arr = inventory_for_order.filter(function (x) {
            return x['item_name'].toLowerCase().includes(search.toLowerCase());
        });
    }
    //debugger
    searched_arr.forEach(element => {
        var id = '';
        var unit_id = '';
        var distributor_id = '';
        order_content.forEach(content => {
            if (content['item_id'] == element['item_id']) {
                id = content['item_id'];
            }
            unit_id = content['unit_id'];
            distributor_id = content['distributor_id'];
        });
        var is_added    =   order_content.some(x=>x.pref_id == element['pref_id']);
        $('.inventory_table_body').append(`<tr>
            <td width="80%">
                <div class="ProListDiv">
                    <div class="PR_Name">${element['item_name']}</div>
                </div>
            </td>
            <td><button id="${element['item_id']}" name="${element['item_name']}" item_discount="${element['dist_discount']}" spec_discount="${element['spec_discount']}" tp="${element['item_trade_price']}"   unit_id="${element['unit_id']}" unit_name="${element['unit_name']}" sku="${element['item_sku']}" item_id="${element['item_id']}" pref_id="${element['pref_id']}"  is_tax="${element['is_tax']}" item_retail_price="${element['item_retail_price']}"  tax_class_id="${element['tax_class_id']}"  tax_amount="${element['tax_amount']}"   data-toggle="modal" data-target="#QuantityAndUnit" class="btn btn-default mb-0 openItemDetailModal" ${is_added==true?'disabled':''}>${is_added==true?'Added':'Add'}</button></td>
        </tr>`);
    })

}
function populateExecutedInventory() {
    $('.inventory_table_body').empty();
    var searched_arr = [];
    var search = $('.search_from_inventory').val();
    if (search == '') {
        searched_arr = inventory_for_order;
    } else {
        searched_arr = inventory_for_order.filter(function (x) {
            return x['item_name'].toLowerCase().includes(search.toLowerCase());
        });
    }
    //debugger
    searched_arr.forEach(element => {
        var item_found    = false;
        found_in_active   =   order_content.some(x => x.item_id == element['item_id']);
        found_in_deleted  =   deleted_order_content.some(y => y.item_id == element['item_id']);
        if(found_in_active || found_in_deleted) {
            item_found  = true;
        }

        if(!item_found) {

            var is_added    =   order_content.some(x=>x.pref_id == element['pref_id']);
            var id = '';
            var unit_id = '';
            var distributor_id = '';
            order_content.forEach(content => {
                if (content['item_id'] == element['item_id']) {
                    id = content['item_id'];
                }
                unit_id = content['unit_id'];
                distributor_id = content['distributor_id'];
            });
            $('.inventory_table_body').append(`<tr>
            <td width="80%">
                <div class="ProListDiv">
                    <div class="PR_Name">${element['item_name']}</div>
                </div>
            </td>
            <td><button id="${element['item_id']}" name="${element['item_name']}" item_discount="${element['dist_discount']}" spec_discount="${element['spec_discount']}" tp="${element['item_trade_price']}"   unit_id="${element['unit_id']}"  unit_name="${element['unit_name']}" sku="${element['item_sku']}" item_id="${element['item_id']}" pref_id="${element['pref_id']}"  is_tax="${element['is_tax']}" item_retail_price="${element['item_retail_price']}"  tax_class_id="${element['tax_class_id']}"  tax_amount="${element['tax_amount']}"   data-toggle="modal" data-target="#QuantityAndUnit" class="btn btn-default mb-0 openItemDetailModal" ${is_added==true?'disabled':''}>${is_added==true?'Added':'Add'}</button></td>
        </tr>`);
        }
        else{
            //console.log(`${element['item_id']} ${element['item_name']}`);
        }
        //debugger
    })

}
function primaryOrderList(status='pending') {
    status  =   status.toLowerCase();
    $('.primary_order_list').empty();
    //alert(1);
    //var table = $('.primary_order').DataTable();
    //table.destroy();
    $.ajax({
        type: 'GET',
        async:false,
        url: `/primary-order-list/${status}`,
        success: function (response) {
            response.forEach(element=>{
                var is_approved =   false;
                if(element['is_approved'] == '1') {
                    is_approved =   true;
                }
                var rvrt_btn    =   '';
                var disp_btn    =   `<button type="button" dist-name="${element['distributor_name']}" class="btn btn-edit ${is_approved==true ? 'mark_to_processed':'dist_not_approved'} " id="${element['id']}">Process</button>`;
                var proc_btn    =   `<button  type="button"  dist-name="${element['distributor_name']}"  class="btn btn-edit   ${is_approved==true ? 'mark_to_executed':'dist_not_approved'} " id="${element['id']}">Dispatch</button>`;
                var exec_btn    =   `<button  type="button"  dist-name="${element['distributor_name']}"  class="btn btn-edit   ${is_approved==true ? 'mark_to_completed':'dist_not_approved'} " id="${element['id']}">Execute</button> `;
                var cancel_btn  =   `<button  type="button"  dist-name="${element['distributor_name']}"  class="btn btn-edit   ${is_approved==true ? 'mark_to_cancelled':'dist_not_approved'} " id="${element['id']}">Cancel</button>`;
                var det_btn     =   `<button data-toggle="modal" id="${element['id']}" data-target="#order_detail_modal" class="btn btn-edit view_order_detail">Detail</button>`;
                var action      =   `${det_btn}`;
                if(typeof element['web_order'] !== 'undefined' && element['web_order'] != '1'){
                    rvrt_btn    =   `<button  type="button"  class="btn btn-edit mark_to_revert" id="${element['id']}">Revert</button> `;
                }
                if(status == 'pending' ){
                    //var edit_btn =   `<a href="/dispatch-primary-order/${element['id']}" class="btn btn-edit">Edit</a> `;
                        action += `${disp_btn}`;
                }else if(status == 'processed'){
                    if(is_approved==true){
                        var edit_btn = `<a href="/process-primary-order/${element['id']}" class="btn btn-edit">Edit</a> `;
                    }else{
                        var edit_btn = `<button type="button"  dist-name="${element['distributor_name']}" class="btn btn-edit dist_not_approved " id="${element['id']}">Edit</button> `;
                    }
                    action += `${edit_btn} ${proc_btn} ${rvrt_btn} ${cancel_btn}`;
                }else if(status == 'executed'){
                    if(is_approved==true){
                        var edit_btn = `<a href="/execute-primary-order/${element['id']}" class="btn btn-edit">Edit</a> `;
                    }else{
                        var edit_btn = `<button type="button"  dist-name="${element['distributor_name']}"  class="btn btn-edit dist_not_approved " id="${element['id']}">Edit</button> `;
                    }
                    action += `${edit_btn} ${exec_btn} ${rvrt_btn} ${cancel_btn}`;
                }else if(status == 'completed'){

                }else if(status == 'cancelled'){

                }else if(status == 'pending-approval'){

                }
                if (segments[3] == 'pending-approvals-primary-order'){
                    $('.primary_order_list').append(`
                                                        <tr>
                                                            <td>${element['created_at']}</td>
                                                            <td>${element['distributor_name']}</td>
                                                            <td>${element['employee_name']}</td>
                                                            <td>${element['zsm']}</td>
                                                            <td>${element['territory_name']}</td>
                                                            <td>${addCommas(element['order_total'].toFixed(2))}</td>
                                                            <td>${action}</td>
                                                        </tr>
                                                    `);
                }
                else {
                    $('.primary_order_list').append(`
                                                        <tr>
                                                            <td>${element['id']}</td>
                                                            <td>${element['created_at']}</td>
                                                            <td>${element['distributor_name']}</td>
                                                            <td>${element['employee_name']}</td>
                                                            <td>${element['territory_name']}</td>
                                                            <td>${addCommas(element['order_total'].toFixed(2))}</td>
                                                            <td>${action}</td>
                                                        </tr>
                                                    `);
                }
            });
            $('.primary_order').DataTable();

        }
    });
}

function clearPrimaryCompletedOrderList(){
    $('.primary_order_list').empty();
    var table   =   $('.primary_order').DataTable();
    table.destroy();
}
function primaryCompletedOrderList() {
    clearPrimaryCompletedOrderList();
    $('.primary_order_list').empty()
    ;    if (!$('#datepicker2').val() ||  $('#region_id').val() < 1 || $('#area_id').val() < 1 || $('#territory_id').val() < 1) {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please Select All Filters.');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        error = true
    }
    $.ajax({
        type: 'POST',
        async:false,
        url: `/primary-completed-order-list/${status}`,
        data: {
            _token: $('input[name="_token"]').val(),
            date  : $('#datepicker2').val(),
            region_id  : $('#region_id').val(),
            area_id  : $('#area_id').val(),
            territory_id  : $('#territory_id').val(),
            distributor_id  : $('#distributor_id').val()
        },
        success: function (response) {
            response.forEach(element=>{
                var action =    `<button data-toggle="modal" id="${element['id']}" data-target="#order_detail_modal" class="btn btn-edit view_order_detail">Detail</button>`;
                $('.primary_order_list').append(`
                                                    <tr>
                                                        <td>${element['id']}</td>
                                                        <td>${element['created_at']}</td>
                                                        <td>${element['distributor_name']}</td>
                                                        <td>${element['employee_name']}</td>
                                                        <td>${element['territory_name']}</td>
                                                        <td>${addCommas(element['order_total'].toFixed(2))}</td>
                                                        <td>${action}</td>
                                                    </tr>
                                                `);
            });

            $('.primary_order').DataTable();
        }
    });
}

function applyTradeScheme(item_id,thisscheme_id,trade_price,item_qty,scheme_applied){
    item_qty    =   parseInt(item_qty);
    scheme_id   =   thisscheme_id;
    if(scheme_id > 0) {
        var scheme_data  =   item_scheme_data(item_id,scheme_id);
        if(scheme_data === null){
            scheme_applied  =   0;
        }
        else {
            scheme_min_qty  = scheme_data.min_qty;
            scheme_rule     = scheme_data.scheme_rule;
            scheme_type = scheme_data.scheme_type;
            discount_on_tp = scheme_data.discount_on_tp;
            scheme_title = scheme_data.title;
            quantity_free=scheme_data.quantity_free;
        }
        scheme_datatype  =   '';
        scheme_discount  =   0;
        //debugger
        if(scheme_applied == '1' && is_deleted_item == '0') {
            if(scheme_type == 'dotp' && scheme_rule == '4') {
                if (item_qty < scheme_min_qty) {
                    $('.item_scheme').prop("checked", false);
                    alert('Invalid Qunatity in to available this scheme');
                } else {
                    scheme_discount   =   item_qty * discount_on_tp;
                    scheme_datatype   =   'amount';
                }
            }
            else if(scheme_type == 'gift' && scheme_rule == '4')  {
                if (item_qty < scheme_min_qty) {
                    $('.item_scheme').prop("checked", false);
                    alert('Invalid Qunatity in to available this scheme');
                } else {
                    scheme_discount   =   item_qty * discount_on_tp;
                    scheme_datatype    =   'product';
                }
            }
            else if(scheme_type == 'free_product')  {

                if(scheme_rule == '1'){
                    //Discount on TP
                    if (item_qty < scheme_min_qty) {
                        $('.item_scheme').prop("checked", false);
                        alert('Invalid Qunatity in to available this scheme');
                    } else {
                        var tp_aftr_scheme       =   parseFloat( ( scheme_min_qty*trade_price ) / (scheme_min_qty+quantity_free) );
                        discount_on_tp          =   trade_price-tp_aftr_scheme;
                        scheme_discount          =   item_qty * discount_on_tp;
                        scheme_datatype           =   'amount';
                    }
                }
                else if(scheme_rule == '2'){
                    //Discount on Half Quantity
                    var half                  =  parseInt(scheme_min_qty/2);
                    if ( half < scheme_min_qty) {
                        $('.item_scheme').prop("checked", false);
                        alert('Invalid Qunatity in to available this scheme');
                    } else {
                        var tp_aftr_scheme   =   parseFloat( ( scheme_min_qty*trade_price ) / (scheme_min_qty+quantity_free) );
                        //50% discount on half
                        discount_on_tp      =     parseFloat(trade_price-tp_aftr_scheme)/2;
                        var chunks          =     parseInt(item_qty/half);
                        scheme_discount      =     parseFloat(discount_on_tp*chunks);
                        scheme_datatype       =   'amount';
                    }
                }
                else if(scheme_rule == '3'){
                    //Minimum Quantity Restriction
                    if ( item_qty < scheme_min_qty) {
                        $('.item_scheme').prop("checked", false);
                        alert('Invalid Qunatity in to available this scheme');
                    } else {
                        var tp_aftr_scheme         =   parseFloat( ( scheme_min_qty*trade_price ) / (scheme_min_qty+quantity_free) );
                        //50% discount on half
                        discount_on_tp            =     parseFloat(trade_price-tp_aftr_scheme)/2;
                        var chunks                =     parseInt(item_qty/scheme_min_qty);
                        scheme_discount            =     parseFloat(discount_on_tp*chunks);
                        scheme_datatype             =     'amount';
                    }
                }
                else if(scheme_rule == '4'){
                    //Free Product
                    if ( item_qty < scheme_min_qty) {
                        $('.item_scheme').prop("checked", false);
                        alert('Invalid Qunatity in to available this scheme');
                    } else {
                        var chunks                =     parseInt(item_qty/scheme_min_qty);
                        scheme_discount           =     0;//parseFloat(discount_on_tp*chunks);
                        scheme_datatype           =     'product';
                    }
                }
            }
        }
        else{
            scheme_id            =   0;
            scheme_min_qty       =   0;
            scheme_rule          =   0;
            scheme_type          =   '';
            discount_on_tp       =   0;
            scheme_title         =   '';
            scheme_datatype      =   '';
            scheme_discount      =   0;
            scheme_applied       =   0;
            is_deleted_item      =   0; 
        }
    }
    //debugger
}
function fetchOrderData() {
    $.ajax({
        type: 'GET',
        async:false,
        url: `/fetchOrderData/${segments[4]}/${segments[3] == 'edit_secondary_order' ? 'secondary' : 'primary'}`,
        success: function (response) {
            var response = JSON.parse(response);
            $('.order_date').val(response.core.date)
            if (segments[3] == 'edit_primary_order' || segments[3] == 'execute-primary-order' || segments[3] == 'process-primary-order' || segments[3] == 'dispatch-primary-order') {
                var distributor_id      =   parseInt(response.core.distributor_id);
                proc_dist_id            =   distributor_id;
                frieght_price           =   parseFloat(response.core.frieght_price==null ? 0 : response.core.frieght_price);
                deleted_order_content   =   response.deleted_content;
                $('.frieght_price').val(frieght_price);
                $('#frieght_price').val(frieght_price);
                $('.frieght_price').text(addCommas(frieght_price.toFixed(2)));

                //response.content.forEach(function (element){
                for (var i=0; i< response.content.length; i++) {
                    scheme_discount =   0;
                    is_tax          =   0
                    tax_class_id    =   0;
                    tax_amount      =   0;
                    var element     =   response.content[i];
                    booker_discount =   element['booker_discount'];
                    var item_id =   element['item_id'];
                    var item_name = element['item_name'];
                    var item_sku =  element['item_sku'];
                    var pref_id  = parseInt(element['parent_pref_id']);
                    var unit_id  = parseInt(element['parent_unit_id']);
                    var item_retail_price=parseFloat(element['parent_item_retail_price']);
                    is_tax  = parseInt(element['is_tax']);
                    tax_class_id  = parseInt(element['tax_class_id']);
                    if(tax_class_id>0){
                        is_tax  =   1;
                    }
                    tax_amount                  =   parseFloat(element['tax_amount']);
                    dist_discount               =   parseFloat(element['distributor_discount'] == null ? 0:element['distributor_discount']);
                    proc_dist_dsct              =   dist_discount;
                    $('.distributor_discount').val(dist_discount);
                    var item_quantity_booker    =   parseInt(element['item_quantity_booker']);
                    var booked_total_qty        =   parseInt(element['booked_total_qty']);
                    var booked_order_value      =   parseInt(element['booked_order_value']);
                    var parent_qty_sold         =   parseInt(element['parent_qty_sold']);
                    var dispatch_qty            =   parseInt(element['dispatch_qty']);
                    var dispatch_amount         =   parseFloat(element['dispatch_amount']);
                    var item_quantity_updated   =   parent_qty_sold;//parseInt(element['item_quantity_updated']);
                    var quantity                =   parent_qty_sold;
                    var trade_price = parseFloat(element['parent_tp']);
                    scheme_id = parseInt(element['scheme_id']);
                    scheme_applied = scheme_id > 0 ? 1 : 0;
                    //debugger
                    applyTradeScheme(item_id, scheme_id, trade_price, quantity, scheme_applied)
                    if(parseInt(element['scheme_id'])){
                        scheme_id       = parseInt(element['scheme_id']);
                        scheme_applied  = scheme_id > 0 ? 1 : 0;
                    }
                    var special_discount = parseFloat(element['special_discount']);
                    //Gross Amount
                    var grass_amount = trade_price * quantity;
                    //Gross amount after trade price
                    var Grs_Amt_Af_TO = grass_amount;
                    if (scheme_applied == '1' && scheme_datatype != 'gift') {
                        Grs_Amt_Af_TO = grass_amount - parseFloat(parseFloat(element['scheme_discount'])?parseFloat(element['scheme_discount']):0);
                    }
                    if(item_quantity_updated == 0){
                        item_quantity_updated   =   quantity;
                    }
                    //Gross amount after trade price and Distributor Dsicount
                    var dist_discount_val       =   (parseFloat(dist_discount) / 100) * parseFloat(Grs_Amt_Af_TO)
                    var Grs_Amt_Af_TO_DD        =   parseFloat(Grs_Amt_Af_TO) - dist_discount_val;

                    //Gross amount after trade price , Distributor Dsicount and special discount
                    var special_discount_val    =   special_discount*quantity; //(parseFloat(special_discount) / 100) * parseFloat(Grs_Amt_Af_TO_DD) ;
                    var Grs_Amt_Af_TO_DD_SD     =   parseFloat(Grs_Amt_Af_TO_DD) - special_discount_val;

                    //Gross amount after trade price , Distributor Dsicount , special discount and booker discount
                    var booker_discount_val     =   booker_discount*quantity;
                    var Grs_Amt_Af_TO_DD_SD_BD  =   parseFloat(Grs_Amt_Af_TO_DD_SD) - booker_discount_val;


                    //Unit price before tax
                    var unit_price_bf_tax       =   parseFloat(Grs_Amt_Af_TO_DD_SD_BD/item_quantity_updated);

                    //Unit tax on retail price
                    var unit_tax                =   (parseFloat(tax_amount) / 100) * parseFloat(item_retail_price);

                    //Total tax
                    var total_tax               =   unit_tax*item_quantity_updated;

                    //Gross amount after trade price , Distributor Dsicount , special discount and tax
                    var Grs_Amt_Af_TO_DD_SD_tax =   Grs_Amt_Af_TO_DD_SD_BD+total_tax;

                    var unit_price              =   parseFloat(Grs_Amt_Af_TO_DD_SD_tax/item_quantity_updated);


                    order_content.push({
                        'pref_id': pref_id,
                        'item_id': item_id,
                        'item_name': item_name,
                        'item_sku': item_sku,
                        'unit_id': unit_id,
                        'is_tax':is_tax,
                        'item_retail_price':item_retail_price,
                        'tax_class_id':tax_class_id,
                        'tax_amount':tax_amount,
                        'distributor_id': distributor_id,
                        'item_quantity_booker' :item_quantity_booker,
                        'item_quantity_updated':item_quantity_updated,
                        'booked_total_qty':booked_total_qty,
                        'booked_order_value':booked_order_value,
                        'parent_qty_sold':parent_qty_sold,
                        'quantity': quantity,
                        'trade_price': trade_price,
                        'grass_amount': grass_amount,
                        'scheme_id': scheme_id,
                        'scheme_title': scheme_title,
                        'scheme_applied': scheme_applied,
                        'scheme_type': element['scheme_type']?element['scheme_type']:'0',
                        'scheme_rule': parseInt(element['scheme_rule'])?parseInt(element['scheme_rule']):0,
                        'scheme_datatype': scheme_datatype,
                        'scheme_discount': parseFloat(element['scheme_discount'])?parseFloat(element['scheme_discount']):0,
                        'Grs_Amt_Af_TO': Grs_Amt_Af_TO,
                        'dist_discount': dist_discount,
                        'dist_discount_val': dist_discount_val,
                        'Grs_Amt_Af_TO_DD': Grs_Amt_Af_TO_DD,
                        'special_discount': special_discount,
                        'special_discount_val': special_discount_val,
                        'booker_discount'     :   booker_discount,
                        'booker_discount_val'   :   booker_discount_val,
                        'Grs_Amt_Af_TO_DD_SD_BD': Grs_Amt_Af_TO_DD_SD_BD,
                        'unit_price_bf_tax':unit_price_bf_tax,
                        'unit_tax':unit_tax,
                        'total_tax':total_tax,
                        'unit_price':unit_price,
                        'final_price':Grs_Amt_Af_TO_DD_SD_tax,
                        'dispatch_qty':dispatch_qty,
                        'dispatch_amount':dispatch_amount
                    });
                    //debugger
                }
                //});
                if ( segments[3] == 'execute-primary-order' || segments[3] == 'process-primary-order' || segments[3] == 'dispatch-primary-order') {
                    getRetailerForPrimaryOrder(distributor_id);
                }
                //debugger;
                populate_order_content();

            }
            else{
                var retailer = response.core.retailer_id;
                $('.employee_id').val(response.core.employee_id).trigger('change');
                $('.order_items').empty();
                response.content.forEach(element => {
                    order_content.push({
                        'pref_id': element['pref_id'],
                        'item_sku': element['item_sku'],
                        'item_id': element['item_id'],
                        'item_name': element['item_name'],
                        'unit_id': element['unit_id'],
                        'item_retail_price':element['item_retail_price'],
                        'is_tax':element['is_tax'],
                        'tax_class_id':element['tax_class_id'],
                        'tax_amount':element['tax_amount'],
                        'unit_name': element['unit_name'],
                        'distributor_id': response.core.distributor_id,
                        'scheme_discount': element['scheme_discount'],
                        'quantity': element['item_quantity_booker'],
                        'trade_price': element['trade_price'],
                        'unit_price': element['unit_price_after_merchant_discount'],
                        'final_price': element['unit_price_after_merchant_discount'] * element['item_quantity_booker'],
                        'merchant_discount': element['merchant_discount'],
                        'discount': element['booker_discount'],
                        'added_product_image': element['product_image']
                    });
                })
            }
        }
    });
}
function renderOrderSearch(search = null) {
    $('.allOrders_list_view_div').empty();
    $('.processedOrders_list_view_div').empty();
    $('.completedOrders_list_view_div').empty();
    $('.cancelledOrders_list_view_div').empty();
    $('.holder').empty();
    var searchArray = [];
    var array = [];
    var order_list_div = '';
    var counts_div = '';

    if (current_list == 'all_orders') {
        array = core_orders;
        order_list_div = 'allOrders_list_view_div';
        counts_div = 'count_all_orders';
    } else if (current_list == 'processed_orders') {
        array = core_orders.filter(x => x['status'] == 'processed');
        order_list_div = 'processedOrders_list_view_div';
        counts_div = 'count_processed_orders';
    } else if (current_list == 'completed_orders') {
        array = core_orders.filter(x => x['status'] == 'completed');
        order_list_div = 'completedOrders_list_view_div';
        counts_div = 'count_completed_orders';
    } else if (current_list == 'cancelled_orders') {
        array = core_orders.filter(x => x['status'] == 'cancelled');
        order_list_div = 'cancelledOrders_list_view_div';
        counts_div = 'count_cancelled_orders';
    }

    if (search == '') {
        searchArray = array;
    } else {
        searchArray = array.filter(function (x) {
            return (x.emp_name ? x.emp_name.toLowerCase().includes(search.toLowerCase()) : '') || (x.zone_name ? x.zone_name.toLowerCase().includes(search.toLowerCase()) : '') || (x.date ? x.date.includes(search) : '');
        });
    }

    $(`.${counts_div}`).text(searchArray.length);

    var sno = 1;
    var recsPerPage = 12;
    var totalPages = Math.ceil(searchArray.length / recsPerPage);
    offset = 0;
    var pageNo = 0;
    var current_records = 0;
    var array_emp_count = 0;
    var total_indexes = 0;
    var test = [];
    fetchPagination(totalPages, current_records);

    searchArray.forEach(element => {
        current_records++;
        array_emp_count++;
        if (current_records <= 12) {
            $(`.${order_list_div}`).append(`<div class="Product-row">
            <div class="row">
                <div class="col colStyle" style="max-width:115px">
                    <div class="pt-5">${element['date']}</div>
                </div>
                <div class="col colStyle" style="max-width:225px">
                    <div class="pt-5">${element['emp_name']} </div>
                </div>
                <div class="col colStyle" style="max-width:137px">
                    <div class="pt-5">${addCommas(element['order_total'].toFixed(2))}</div>
                </div>
                <div class="col colStyle" style="max-width:225px">
                    <div class="pt-5">${element['zone_name'] ? element['zone_name'] : 'NA'}</div>
                </div>
                <div class="col colStyle" style="max-width:420px; padding-left:0">

                ${segments[3] == 'primary_orders_list'
                ?
                `${current_list == 'completed_orders' || element['status'] == 'completed'  || element['status'] == 'processed'  || element['status'] == 'cancelled' ? `` : `<a href="/edit_primary_order/${element['id']}" class="btn btn-edit">Edit</a> <button class="btn cusDetail mark_process" id="${element['id']}">Mark Process</button>`}
                        <button data-toggle="modal" id="${element['id']}" data-target="#order_detail_modal" class="btn btn-edit view_order_detail">View Detail</button>
                        ${element['status'] == 'processed' ? `<a href="/execute-primary-order/${element['id']}" class="btn btn-edit">Execute</a>` : ``} `
                :
                `${current_list == 'all_orders' ? `<a href="/edit_secondary_order/${element['id']}" class="btn btn-edit">Edit</a>
                <a href="/fpdf/loadSheet.php?emp=${element['employee_id']}&date=${element['order_date']}" rel="noopener noreferrer" target="_blank" class="btn cusDetail view_load_sheet" id="${element['id']}">Load Sheet</a>
                <a href="/fpdf/delivery_challan.php?emp=${element['employee_id']}&date=${element['order_date']}" rel="noopener noreferrer" target="_blank" class="btn cusDetail view_delivery_challan" id="${element['id']}">Delivery Challan</a>
                <a href="/fpdf/index.php?order=${element['id']}" rel="noopener noreferrer" target="_blank" class="btn cusDetail" id="${element['id']}">Bills</a>
                <button data-toggle="modal" id="${element['id']}" data-target="#order_detail_modal" class="btn btn-edit view_order_detail">Detail</button>` : (current_list == 'processed_orders' ? `<button data-toggle="modal" id="${element['id']}" data-target="#order_detail_modal" class="btn btn-edit view_order_detail">Detail</button>` : (current_list == 'completed_orders' ? `<button data-toggle="modal" id="${element['id']}" data-target="#order_detail_modal" class="btn btn-edit view_order_detail">Detail</button> <button class="btn cusDetail view_load_sheet" id="${element['id']}">Load Sheet</button>` : `<button data-toggle="modal" id="${element['id']}" data-target="#order_detail_modal" class="btn btn-edit view_order_detail">Detail</button>`))}`
            }
                </div>
            </div>
        </div>`);
        }


        test.push(element);
        all_orders_list[total_indexes] = test;
        if (array_emp_count == 12) {
            array_emp_count = 0;
            test = [];
            total_indexes++;
        }

    });
}
function fetchPagination(pageLen = null, curPage = null) {
    item = [];
    for (var i = 1; i <= pageLen; i++) {
        item.push(i);
    }
    render(pageLen, curPage, item, true);
}
function render(pageLen = null, curPage, item, first) {
    var segments = location.href.replace(/\/+$/g, '').split('/');
    var pagination_id = 'holder_orders';
    var curOpenPage = 'all_orders_link';

    $(`${pagination_id}`).empty();
    var html = '',
        separatorAdded = false;
    for (var i in item) {
        if (isPageInRange(curPage, i, pageLen, 2, 2)) {
            html += '<li class="' + curOpenPage + '" name="' + i + '" data-page="' + i + '">' + item[i] + '</li>';
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

    var holder = document.querySelector(`#${pagination_id}`);
    holder.innerHTML = html;
    document.querySelector('#' + pagination_id + '>li[data-page="' + curPage + '"]').classList.add('active');
    if (first) {
        holder.addEventListener('click', function (e) {
            if (!e.target.getAttribute('data-page')) {
                // no relevant item clicked (you could however scheme expand here )
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
function fetchSecondaryOrders() {
    $('.allOrders_list_view_div').empty();
    $('.processedOrders_list_view_div').empty();
    $('.completedOrders_list_view_div').empty();
    $('.cancelledOrders_list_view_div').empty();

    $('.count_all_orders').text('0');
    $('.count_processed_orders').text('0');
    $('.count_completed_orders').text('0');
    $('.count_cancelled_orders').text('0');
    $('.tblLoader').show()
    $.ajax({
        type: 'POST',
        url: '/fetchallSeconaryOrders/'+(segments[3] == 'primary_orders_list' ? 'primary' : 'secondary'),
        data: {
            _token: $('input[name="_token"]').val(),
            emp_id: segments[4],
            month: segments[5],
            year: segments[6]
        },
        success: function (response) {
            var response = JSON.parse(response);
            $('.tblLoader').hide();
            total_orders = response.length;
            core_orders = response;
            var recsPerPage = 12;
            totalOrdersPages = Math.ceil(total_orders / recsPerPage);
            offset = 0;
            var current_records = 0;
            var array_emp_count = 0;
            var total_indexes = 0;

            fetchPagination(totalOrdersPages, current_records);
            var cat_index = [];
            response.forEach(element => {
                current_records++;
                array_emp_count++;
                if (current_records <= 12) {
                    $('.allOrders_list_view_div').append(`<div class="Product-row">
                        <div class="row">
                            <div class="col colStyle" style="max-width:115px">
                                <div class="pt-5">${element['date']}</div>
                            </div>
                            <div class="col colStyle" style="max-width:225px">
                                <div class="pt-5">${element['emp_name']} </div>
                            </div>
                            <div class="col colStyle" style="max-width:137px">
                                <div class="pt-5">${addCommas(element['order_total'].toFixed(2))}</div>
                            </div>
                            <div class="col colStyle" style="max-width:225px">
                                <div class="pt-5">${element['zone_name'] ? element['zone_name'] : "NA"}</div>
                            </div>
                            <div class="col colStyle" style="max-width:420px; padding-left:0">
                                ${segments[3] == 'primary_orders_list'
                        ?
                        `${current_list == 'completed_orders' || element['status'] == 'completed'  || element['status'] == 'processed'  || element['status'] == 'cancelled' ? '' : `<a href="/edit_primary_order/${element['id']}" class="btn btn-edit">Edit</a> <button class="btn cusDetail mark_process" id="${element['id']}">Mark Process</button>`}
                                <button data-toggle="modal" id="${element['id']}" data-target="#order_detail_modal" class="btn btn-edit view_order_detail">View Detail</button>
                                ${element['status'] == 'processed' ? `<a href="/execute-primary-order/${element['id']}" class="btn btn-edit">Execute</a>` : ``} `
                        :
                        `<a href="/edit_secondary_order/${element['id']}" class="btn btn-edit">Edit</a> 
                                <a href="/fpdf/loadSheet.php?emp=${element['employee_id']}&date=${element['order_date']}" rel="noopener noreferrer" target="_blank" class="btn cusDetail view_load_sheet" id="${element['id']}">Load Sheet</a>
                                <a href="/fpdf/delivery_challan.php?emp=${element['employee_id']}&date=${element['order_date']}" rel="noopener noreferrer" target="_blank" class="btn cusDetail view_delivery_challan" id="${element['id']}">Delivery Challan</a>
                                <a href="/fpdf/index.php?order=${element['id']}" rel="noopener noreferrer" target="_blank" class="btn cusDetail" id="${element['id']}">Bills</a>
                                <button data-toggle="modal" id="${element['id']}" data-target="#order_detail_modal" class="btn btn-edit view_order_detail">Detail</button>`}

                            </div>
                        </div>
                    </div>`);
                }
                cat_index.push(element);
                //debugger
                all_orders_list[total_indexes] = cat_index;
                if (array_emp_count == 12) {
                    array_emp_count = 0;
                    cat_index = [];
                    total_indexes++;
                }
            });
            new_orders_array = core_orders.filter(x => x['status'] == 'Pending');
            processed_orders_array = core_orders.filter(x => x['status'] == 'processed');
            completed_orders_array = core_orders.filter(x => x['status'] == 'completed');
            cancelled_orders_array = core_orders.filter(x => x['status'] == 'cancelled');

            $('.tblLoader').hide();
            $('.count_all_orders').text(new_orders_array.length);
            $('.count_processed_orders').text(processed_orders_array.length);
            $('.count_completed_orders').text(completed_orders_array.length);
            $('.count_cancelled_orders').text(cancelled_orders_array.length);
            $('#NewOrder-tab').click();
        }
    });
}
function fetchOrdersDataBeforeLisitng(){
    var city_id = segments[4];
    var month = segments[5];
    var year = segments[6];
    var page_type = (segments[3] == 'sec_order_city' ? 1 : (segments[3] == 'sec_order_dist' ? 2 : (segments[3] == 'sec_order_dist_monthwise' ? 3 : (segments[3] == 'sec_order_monthDetail' ? 4 : 0))));
    $.ajax({
        type: 'POST',
        url: '/fetchOrdersDataBeforeLisitng',
        data: {
            _token: $('input[name="_token"]').val(),
            city_id: city_id,
            page_type: page_type,
            month: month,
            year: year
        },
        success: function (response) {
            var response = JSON.parse(response)

            $('.body_table_div').empty();
            if(page_type == 1){
                $('.body_table_div').append('<table class="table table-hover dt-responsive nowrap" id="CitiesForOrder" style="width:100%;"><thead><tr><th>ID</th><th>City Name</th><th>Action</th></tr></thead><tbody></tbody></table>');
                $('#CitiesForOrder tbody').empty();
                var total= 0;
                response.forEach(element => {
                    if(page_type == 1){
                        $('#CitiesForOrder tbody').append(`<tr><td>${element['id']}</td><td>${element['name']}</td><td><a href="/sec_order_dist/${element['id']}" class="btn btn-default" id="${element['id']}">View Detail</a></td></tr>`);
                        total++;
                    }
                });
            }else if(page_type == 2){
                $('.body_table_div').append('<table class="table table-hover dt-responsive nowrap" id="CitiesForOrder" style="width:100%;"><thead><tr><th>ID</th><th>Distributor Name</th><th>Action</th></tr></thead><tbody></tbody></table>');
                $('#CitiesForOrder tbody').empty();
                var total= 0;
                response.forEach(element => {
                    $('#CitiesForOrder tbody').append(`<tr><td>${element['id']}</td><td>${element['distributor_name']}</td><td><a href="/sec_order_dist_monthwise/${element['id']}" class="btn btn-default" id="${element['id']}">View Detail</a></td></tr>`);
                    total++;
                });
            }else if(page_type == 3){
                $('.body_table_div').append('<table class="table table-hover dt-responsive nowrap" id="CitiesForOrder" style="width:100%;"><thead><tr><th>ID</th><th>Month</th><th>Year</th><th>Orders</th><th>Action</th></tr></thead><tbody></tbody></table>');
                $('#CitiesForOrder tbody').empty();
                var total= 0;
                response.forEach(element => {
                    $('#CitiesForOrder tbody').append(`<tr><td>${total+1}</td><td>${element['month_name']}</td><td>${element['year']}</td><td>${element['count']}</td><td><a href="/sec_order_monthDetail/${segments[4]}/${element['month']}/${element['year']}" class="btn btn-default" id="${element['id']}">View Detail</a></td></tr>`);
                    total++;
                });
            }else if(page_type == 4){
                $('.body_table_div').append('<table class="table table-hover dt-responsive nowrap" id="CitiesForOrder" style="width:100%;"><thead><tr><th>ID</th><th>Month</th><th>Year</th><th>Order Booker</th><th>Orders</th><th>Action</th></tr></thead><tbody></tbody></table>');
                $('#CitiesForOrder tbody').empty();
                var total= 0;
                response.forEach(element => {
                    $('#CitiesForOrder tbody').append(`<tr><td>${total+1}</td><td>${element['month_name']}</td><td>${element['year']}</td><td>${element['emp_name']}</td><td>${element['count']}</td><td><a href="/secondary_orders_list/${element['employee_id']}/${segments[5]}/${segments[6]}" class="btn btn-default" id="${element['id']}">View Detail</a></td></tr>`);
                    total++;
                });
            }

            $('.tblLoader').hide();
            $('.openItemDetailModal').fadeIn();
            $('#CitiesForOrder').DataTable();
            $('.total_cities').text(total);
        }
    });
}

function fetchAllRegionAreas(regionId,selected=0,domId=''){
    clearPrimaryCompletedOrderList();
    $('#area_id'+domId).html('<option selected  value="">Select Area</option>');
    $('#territory_id'+domId).html('<option selected  value="">Select Territory</option>');
    $.ajax({
        type: 'GET',
        url: '/RegionAreas/'+regionId,
        success: function (response) {
            var opts    =   '<option selected  value="">Select Area/Zone</option>';
            $.each( response, function( key, obj ) {
                if(obj.id == selected){
                    opts    +=   '<option selected  value="'+ obj.id +'">'+ obj.area_name +'</option>';
                }
                else{
                    opts    +=   '<option   value="'+ obj.id +'">'+ obj.area_name +'</option>';
                }
            });
            $('#area_id'+domId).html(opts);
        }
    });
}
function fetchAllAreaTerritories(AreaId,selected=0){
    clearPrimaryCompletedOrderList();
    reset_order_content();
    $('#territory_id').html('<option selected disabled value="0">Please Wait...</option>');
    $.ajax({
        type: 'GET',
        url: '/AreasTerritories/'+AreaId,
        success: function (response) {
            var opts    =   '<option value="0" selected disabled>Select Territory</option>';
            $.each( response, function( key, obj ) {
                if(obj.id == selected){
                    opts    +=   '<option selected  value="'+ obj.id +'">'+ obj.territory_name +'</option>';
                }
                else {
                    opts += '<option   value="' + obj.id + '">' + obj.territory_name + '</option>';
                }
            });
            $('#territory_id').html(opts);
        }
    });
}
function fetchAllTerritoryDistributor(TerritoryId,selected=0){
    clearPrimaryCompletedOrderList();
    reset_order_content();
    $('#distributor_id').html('<option selected disabled value="0">Please Wait...</option>');
    $.ajax({
        type: 'GET',
        url: '/TerritoryDistributors/'+TerritoryId,
        success: function (response) {
            if (segments[3] == 'completed-primary-order'  ) {
                var opts = '<option value="0" selected >All Distributor</option>';
            }else{
                var opts    =   '<option value="0" selected disabled>Select Distributor</option>';
            }
            $.each( response, function( key, obj ) {

                if(obj.id == selected){
                    opts    +=   '<option selected  value="'+ obj.id +'"    rd="' + obj.discount + '" >'+ obj.distributor_name +'</option>';
                }
                else {
                    opts += '<option   value="' + obj.id + '"    rd="' + obj.discount + '" >' + obj.distributor_name + '</option>';
                }
            });
            $('#distributor_id').html(opts);
        }
    });
}
function fethDistributorEmployees(DistributorId,selected=0){
    if(DistributorId >0 ) {
        reset_order_content();
        $('#employee_id').html('<option selected disabled value="0">Please Wait...</option>');
        $.ajax({
            type: 'GET',
            url: '/getDistributorEmployees/' + DistributorId,
            success: function (response) {
                var opts = '<option disabled selected value="0">Select Employee</option>';
                $.each(response, function (key, obj) {

                    if (obj.employee_id == selected) {
                        opts += '<option selected  value="' + obj.employee_id + '">' + obj.employee_name + '</option>';
                    } else {
                        opts += '<option   value="' + obj.employee_id + '">' + obj.employee_name + '</option>';
                    }
                });
                $('#employee_id').html(opts);
            }
        });
    }
}
$(document).ready(function(){
    if (segments[3] == 'edit_primary_order') {
        //$('#area_id').val($('#area_id_edit').val()).trigger('change');
        fetchAllAreaTerritories($('#area_id_edit').val(),$('#territory_id_edit').val());
        //$('#territory_id').trigger('change');
        fetchAllTerritoryDistributor($('#territory_id_edit').val(),$('#distributor_id_edit').val());
        //$('#distributor_id').trigger('change');
        fethDistributorEmployees($('#distributor_id_edit').val(),$('#employee_id_edit').val());
        $('#distributor_id').trigger('change');
    }
});
$(document).on('click','.item_scheme',function(){
    scheme_id            =   parseInt($(this).data('scheme_id'));
    var item_id          =   parseInt($(this).data('item_id'));
    var trade_price      =   parseFloat($(this).data('trade_price'));
    $('.quantityTradeScheme').data('scheme_id',scheme_id);
    var item_qty        =   parseInt($('.quantityTradeScheme').val());
    scheme_applied   =   0;
    if($('#trade_scheme_'+scheme_id).prop("checked")) {
        scheme_applied   =   1;
    }
    else{
        $('.item_scheme').prop("checked", false);
    }
    applyTradeScheme(item_id,scheme_id,trade_price,item_qty,scheme_applied);
});


$(document).on('change','.quantityTradeScheme',function(){
    var item_id         =   parseInt($(this).data('item_id'));
    var trade_price     =   parseFloat($(this).data('trade_price'));
    var item_qty        =   parseInt($('.quantityTradeScheme').val());
    scheme_applied   =   0;
    if($('#trade_scheme_'+scheme_id).prop("checked")) {
        scheme_applied   =   1;
    }
    else{
        $('.item_scheme').prop("checked", false);
    }
    applyTradeScheme(item_id,scheme_id,trade_price,item_qty,scheme_applied);
});
function item_quantity_change(pref_id,item_status=1) {

    var thisDdisc           =   $("#booker_discount_"+pref_id);
    var thisqty             =   $("#qty_"+pref_id);
    is_tax                  =   0
    tax_class_id            =   0;
    tax_amount              =   0;
    scheme_id               =   0;
    scheme_title            =   '';
    scheme_applied          =   0;
    scheme_type             =   '';
    scheme_datatype         =   '';
    scheme_discount         =   0;
    is_deleted_item         =   0;
    var dist_discount       =   0;
    var booked_total_qty    =   0;
    var item_quantity_updated=  0;
    var item_id             =   parseInt(thisqty.attr('iid'));
    var item_name           =   thisqty.attr('item_name');
    var item_sku            =   thisqty.attr('item_sku');
    var item_dist_discount  =   parseFloat(thisqty.attr('item_discount'));
    var special_discount    =   parseFloat(thisqty.attr('spec_discount'));
    var item_retail_price   =   parseFloat(thisqty.attr('item_retail_price'));
    is_tax                  =   parseInt(thisqty.attr('is_tax'));
    tax_class_id            =   parseInt(thisqty.attr('tax_class_id'));
    tax_amount              =   parseFloat(thisqty.attr('tax_amount'));
    var unit_id             =   parseInt(thisqty.attr('uid'));
    if (segments[3] == 'execute-primary-order' || segments[3] == 'process-primary-order' || segments[3] == 'dispatch-primary-order') {
        var distributor_id  =   proc_dist_id;
    }else{
        var distributor_id  =   parseInt($('.distributor_id').val());
    }

    if (segments[3] == 'execute-primary-order' || segments[3] == 'process-primary-order' || segments[3] == 'dispatch-primary-order') {
        booked_total_qty    =   parseInt(thisqty.attr('booked_total_qty'));

    }
    var quantity            =   parseInt(thisqty.val())? parseInt(thisqty.val()):0;
    if(item_status == 0){
        is_deleted_item     =   1;
    }else{
        is_deleted_item     =   0;
    }
    //debugger
    item_quantity_updated   =   quantity;
    //var booker_discount     =   parseFloat(thisDdisc.val());
    var trade_price         =   parseFloat(thisqty.attr('trade_price'));
    scheme_applied          =   parseInt(thisqty.attr('scheme_applied'));
    scheme_id               =   parseInt(thisqty.attr('scheme_id'));
    applyTradeScheme(item_id, scheme_id, trade_price,quantity,scheme_applied);
    var grass_amount        =   trade_price*quantity;
    var Grs_Amt_Af_TO       =   grass_amount;
    if(scheme_applied=='1' && scheme_datatype == 'amount'){
        Grs_Amt_Af_TO       =   grass_amount-scheme_discount;
    }

    //Gross amount after trade price and Distributor Dsicount
    var dist_discount_val       =   (parseFloat(item_dist_discount) / 100) * parseFloat(Grs_Amt_Af_TO)
    var Grs_Amt_Af_TO_DD        =   parseFloat(Grs_Amt_Af_TO) - dist_discount_val;

    //Gross amount after trade price , Distributor Dsicount and special discount
    var special_discount_val    =   parseFloat(special_discount)*quantity;//(parseFloat(item_discount) / 100) * parseFloat(Grs_Amt_Af_TO_DD) ;
    var Grs_Amt_Af_TO_DD_SD     =   parseFloat(Grs_Amt_Af_TO_DD) - special_discount_val;

    //Gross amount after trade price , Distributor Dsicount , special discount and booker discount
    var booker_discount_val     =   booker_discount*quantity;
    var Grs_Amt_Af_TO_DD_SD_BD  =   parseFloat(Grs_Amt_Af_TO_DD_SD) - booker_discount_val;
    //debugger

    //Unit price before tax
    var unit_price_bf_tax       =   parseFloat(Grs_Amt_Af_TO_DD_SD_BD/quantity);

    //Unit tax on retail price
    var unit_tax                =   (parseFloat(tax_amount) / 100) * parseFloat(item_retail_price);

    //Total tax
    var total_tax               =   unit_tax*quantity;

    //Gross amount after trade price , Distributor Dsicount , special discount and tax
    var Grs_Amt_Af_TO_DD_SD_tax =   Grs_Amt_Af_TO_DD_SD_BD+total_tax;

    var unit_price              =   parseFloat(Grs_Amt_Af_TO_DD_SD_tax/quantity);
    if(unit_price < 0){
        quantity    =   0;
        scheme_discount= 0;
        item_quantity_updated   =0;
        Grs_Amt_Af_TO   =   0;
        dist_discount_val   =   0;
        Grs_Amt_Af_TO_DD   =   0;
        special_discount_val   =   0;
        booker_discount   =   0;
        booker_discount_val=0;
        Grs_Amt_Af_TO_DD_SD_BD   =   0;
        unit_price_bf_tax   =   0;
        unit_tax   =   0;
        total_tax   =   0;
        unit_price   =   0;
        Grs_Amt_Af_TO_DD_SD_tax   =   0;
    }

    //debugger
    order_content.find(x => {
        if (x.item_id == item_id && x.pref_id == pref_id  && x.distributor_id == distributor_id ) {
            x.pref_id               =   pref_id;
            x.item_id               =   item_id;
            x.item_name             =   item_name;
            x.item_sku              =   item_sku;
            x.unit_id               =   unit_id;
            x.distributor_id        =   distributor_id;
            x.item_quantity_updated =   item_quantity_updated;
            x.booked_total_qty      =   booked_total_qty;
            x.parent_qty_sold       =   quantity;
            x.quantity              =   quantity;
            x.trade_price           =   trade_price;
            x.grass_amount          =   grass_amount;
            x.scheme_id             =   scheme_id;
            x.scheme_title          =   scheme_title;
            x.scheme_applied        =   scheme_applied;
            x.scheme_type           =   scheme_type;
            x.scheme_rule           =   scheme_rule;
            x.scheme_datatype       =   scheme_datatype;
            x.scheme_discount       =   scheme_discount;
            x.Grs_Amt_Af_TO         =   Grs_Amt_Af_TO;
            x.dist_discount         =   item_dist_discount;
            x.dist_discount_val     =   dist_discount_val;
            x.Grs_Amt_Af_TO_DD      =   Grs_Amt_Af_TO_DD;
            x.special_discount      =   special_discount;
            x.special_discount_val  =   special_discount_val;
            x.booker_discount       =   booker_discount;
            x.booker_discount_val   =   booker_discount_val;
            x.Grs_Amt_Af_TO_DD_SD_BD=   Grs_Amt_Af_TO_DD_SD_BD;
            x.unit_price_bf_tax     =   unit_price_bf_tax;
            x.unit_tax              =   unit_tax;
            x.total_tax             =   total_tax;
            x.unit_price            =   unit_price;
            x.final_price           =   Grs_Amt_Af_TO_DD_SD_tax;
            x.item_status           =   item_status;
            return;
        }
    });
    $('#otd-gross-amount-'+pref_id).text(addCommas(grass_amount.toFixed(2)));
    $('#otd-total-tax-'+pref_id).text(addCommas(total_tax.toFixed(2)));
    $('#otd-final-price-'+pref_id).text(addCommas(Grs_Amt_Af_TO_DD_SD_tax.toFixed(2)));
    //console.log(order_content);




    //debugger
    if((segments[3] == 'execute-primary-order' || segments[3] == 'process-primary-order' || segments[3] == 'dispatch-primary-order') && item_status == 0){
        $('#otr-'+pref_id).remove();
    }
    populate_order_total();
    //populate_order_content();

}
function change_order_quantity_to_zero(pref_id){
    if(parseInt($("#qty_"+pref_id).val())>0) {
        swal({
            title: "Are you sure you want to delete?",
            text:  "Once deleted, you will not be able to recover!",
            icon:  "warning",
            buttons: true,
            buttons: ["No","Yes"],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                $("#qty_" + pref_id).val(0).trigger('focus');
                item_quantity_change(pref_id,0);
            }
        });
    }
}
$(function() {
    function isNumber(evt) {
        evt = (evt) ? evt : window.event;
        let charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
            evt.preventDefault();
        } else {
            return true;
        }
    }
});
$(document).on('click','.mark_to_cancelled',function () {
    var order_id =  parseInt($(this).attr('id'));
    if (!order_id || order_id < 1) {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Invalid order');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    var thisRef = $(this);

    swal({
        title: "Are you sure you want to cancel?",
        text:  "Once canceled, you will not be able to recover!",
        icon:  "warning",
        buttons: true,
        buttons: ["No","Yes"],
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            thisRef.text('canceling...');
            thisRef.attr('disabled', 'disabled');

            $.ajax({
                type: 'GET',
                url: `/cancel-primary-order/${order_id}`,
                success: function (response) {
                    if (response.status == 'success') {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text(response.msg);
                        setTimeout(() => {
                            location.href = "/cancelled-primary-order"
                            $('#notifDiv').fadeOut();
                        }, 500);

                    } else {
                        thisRef.removeAttr('disabled');
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text(response.msg);
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }
                }
            });
        }else{
            return;
        }
    });

});
// $(".quantityTradeScheme").on("input",function(event) {
//     alert(1);
//     // Allow only backspace and delete
//     if ( event.keyCode == 46 || event.keyCode == 8 ) {
//         // let it happen, don't do anything
//     }
//     else {
//         // Ensure that it is a number and stop the keypress
//         if (event.keyCode < 48 || event.keyCode > 57 ) {
//             event.preventDefault();
//         }
//     }
// });

function isNumberKeyOnly(evt)
{
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    //console.log(charCode)
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}
function isNumberKey(evt)
{
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    //console.log(charCode)
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}



