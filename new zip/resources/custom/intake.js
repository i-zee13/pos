var segments = location.href.split('/');
var id;
var invalidSave = [];
var counter = 0;
var mulitple_clients = [];
var current_client_array = [];
var current_intake_form;
var form_old_value;
var deleteRef = '';
var flag = false;



function gridaction(element) {
    var action = '';
    var details1 = `<a href="/intake-view/${element.id}" class="dropdown-item" type="button">Details</a>`;
    if(element.intake_form_type == 5 || element.intake_form_type == 6 ||  element.intake_form_type == 7){
        var document1 = `<a href="/intake-form-document/${element.id}" class="dropdown-item" type="button">Document</a>`;
    }else{
        var document1 = ``;
    }
    var sendemail1 = `<a href="javascript:;"  onclick="resendFormEmail('${element['client_id']}','${element['unique_key']}')" class="dropdown-item" type="button">Resend Email</a>`;
    var openform = `<a href="/intake/form/${element['unique_key']}"  target="_blank"  class="dropdown-item" type="button">Open Form</a>`;
    if (element['status'] == 1) {
        action = `${sendemail1} ${openform}`;
    } else if (element['status'] == 2 || element['status'] == 4) {
        action = `${document1} ${details1}`;
    } else if (element['status'] == 3) {
        action = `${document1} ${details1} ${details1}`;
    }
    return action;

}

function resendFormEmail(client_id, unique_key) {
    $('#notifDiv').fadeIn();
    $('#notifDiv').css('background', 'blue');
    $('#notifDiv').text('sending....');
    $.ajax({
        type: 'get',
        url: `/send-intake-form-email/${client_id}/${unique_key}`,
        success: function (response) {
            if (response.status == 'success') {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text(response.msg);
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            } else {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text(response.msg);
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
        }
    });
}
$(document).on('click', '.customer_page_link', function () {
    var not_found = true;

    current_cust_active_page = parseFloat($(this).attr('name'));
    not_found = false;

    if (!not_found) {
        $('.cust_list_div').empty();
        $('.cust_grid_div').empty();

        /**   Pagination   **/

        all_cust[current_cust_active_page].map(function (element) {
            var actionbtn = gridaction(element);

            $('.cust_list_div').append(`<div class="Product-row">
            <div class="row">
            <div class="col colStyle" style="max-width:385px">
                <div style="display:table; margin-top: -5px; margin-bottom:-5px;">
                    <div class="_emp-D"><img 
                            src="/images/form-avatar-icon.svg" class="doc-img"
                            alt=""></div>
                    <div class="textMiddle">${element['first_name'] ? element['first_name'] : 'NA'} ${element['last_name'] ? element['last_name'] : 'NA'}</div>
                </div>
            </div>
            <div class="col colStyle" style="max-width:220px">
                    <div class="pt-5">${element['form_type'] == 1 ? 'Real Estate Purchase' : element['form_type'] == 2 ? 'Real Estate Purchase' : element['form_type'] == 3 ? 'Real Estate Purchase & Sell' : element['form_type'] == 4 ? 'Real Estate Title Transfer'
                    : element['form_type'] == 5 ? 'Wills' : element['form_type'] == 6 ? 'POA-Health' : element['form_type'] == 7 ? 'POA-Property' : 'Na'}</div>
            </div>
            <div class="col colStyle" style="max-width:150px">
            <div class="pt-5">${moment(element.created_at).format('Y-M-D')}</div>    </div>
            <div class="col colStyle" style="max-width:190px">
            <div class="pt-5">${element['status'] == 1 ? 'Pending' : (element['status'] == 2 ? 'Accepted' : (element['status'] == 3 ? 'Partially filed' : (element['status'] == 4 ? 'Submitted' : 'Cancelled')))}</div>

            </div>
            <div class="col colStyle" style="max-width:180px">
                <div class="dropdown">
                    <button class="btn remove_click dropdown-toggle" type="button" id="dropdownMenu2"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Action </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                    ${actionbtn}
                </div>

            </div>
        </div>
     </div>`);

            $('.cust_grid_div').append(` <div class="col-lg-3 col-md-4">
        <div class="_product-card ${element['is_active'] == '0' ? '_deactive-cus' : ''}">
         <img src="/images/form-avatar-icon.svg" class="doc-img" alt="" >
            <h2 >${element['first_name'] ? element['first_name'] : 'NA'} ${element['last_name'] ? element['last_name'] : 'NA'}</h2> 
            <div class="con_info pt-0 PB-20">
                <p><i class="fa fa-envelope"></i>${element['status'] == 1 ? 'Pending' : (element['status'] == 2 ? 'Accepted' : (element['status'] == 3 ? 'Partially filed' : (element['status'] == 4 ? 'Submitted' : 'Cancelled')))}</p>
                <p><i class="fa fa-solid fa-clock"></i>${moment(element.created_at).format('Y-M-D')}</p>
                <p><i class="fa fa-globe"></i>
                ${element['form_type'] == 1 ? 'Real Estate Purchase' : element['form_type'] == 2 ? 'Real Estate Purchase' : element['form_type'] == 3 ? 'Real Estate Purchase & Sell' : element['form_type'] == 4 ? 'Real Estate Title Transfer'
                : element['form_type'] == 5 ? 'Wills' : element['form_type'] == 6 ? 'POA-Health' : element['form_type'] == 7 ? 'POA-Property' : 'Na'}
                </p>
                <div class="PT-20">
                <div class="dropdown">
                    <button class="btn remove_click dropdown-toggle" type="button" id="dropdownMenu2"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Action </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                    ${actionbtn}
            </div>
                </div>

            </div>
    
        </div>
        </div>`);
        });
    }
})
var item = [];
var all_cust = [];
var item = [];
var current_action = 'client';


function fetchFormList() {
    var random_string = makeid(50);
    allFormsList = [];
    $('.dynamic_search').val('');
    $('.dynamic_filter').val(0).trigger('change');
    if ($('.dynamic_filter').val() != '0') {
        $('.dynamic_filter').val(0).trigger('change');
        rendersearch('', 0);
        $('.count_customers').text(total_customers);

    }
    $('.tblLoader').fadeIn();
    $('.cust_list_div').empty();
    $('.cust_grid_div').empty();
    $('.list_view_div').empty();
    $('.grid_view_div').empty();
    $('.pagination_cust').empty();

    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: '/intake-list',
            data: {
                // random_string: random_string
            },
            success: function (response) {

                $('.data_div').empty();
                $('.data_div').show();
                $('.tblLoader').hide();
                var response = JSON.parse(response);

                allFormsList = response.client;
                $('.doc_key').val(random_string);
                $('.operation_docs').val(random_string);

                total_customers = response.client.length;
                $('.count_customers').text(total_customers);
                var recsPerPage = 12;
                total_cust_pages = Math.ceil(total_customers / recsPerPage);
                var offset = 0;
                var pageNo = 0;
                var current_records = 0;
                var array_items_count = 0;
                var total_indexes = 0;

                fetchPagination(total_cust_pages, current_records, 'client');
                $('.pagination_cust').append(`<li name="-1" class="page-item customer_page_link disabled previous"><a class="page-link" tabindex="-1">Previous</a></li>`);
                var i;
                for (i = 1; i <= total_cust_pages; i++) {
                    $('.pagination_cust').append(`<li name="${i}" class="page-item customer_page_link ${i <= 1 ? 'active' : ''}"><a class="page-link">${i}</a></li>`);
                    all_cust.push({})
                }
                $('.pagination_cust').append('<li class="page-item customer_page_link next" name="+1"><a class="page-link">Next</a></li>');
                //cust_base_url = response.base_url;
                var test = [];
                
                response.client.forEach(element => {

                    /**   Landing    **/
                   
                    var actionbtn = gridaction(element);
                    current_records++;
                    array_items_count++;
                    if (current_records <= 12) {
                        $('.cust_list_div').append(`<div class="Product-row " >
                        <div class="row">
                            <div class="col colStyle" style="max-width:385px">
                                <div style="display:table; margin-top: -5px; margin-bottom:-5px;">
                                    <div class="_emp-D"><img
                                            src="/images/form-avatar-icon.svg" class="doc-img"
                                            alt=""></div>
                                    <div class="textMiddle">${element['first_name'] ? element['first_name'] : 'NA'} ${element['last_name'] ? element['last_name'] : 'NA'}</div>
                                </div>
                            </div>
                            <div class="col colStyle" style="max-width:220px">
                                <div class="pt-5">${element['form_type'] == 1 ? 'Real Estate Purchase' : element['form_type'] == 2 ? 'Real Estate Purchase' : element['form_type'] == 3 ? 'Real Estate Purchase & Sell' : element['form_type'] == 4 ? 'Real Estate Title Transfer'
                                : element['form_type'] == 5 ? 'Wills' : element['form_type'] == 6 ? 'POA-Health' : element['form_type'] == 7 ? 'POA-Property' : 'Na'}</div>
                            </div>
                           
                            <div class="col colStyle" style="max-width:150px">
                            <div class="pt-5">${moment(element.created_at).format('Y-M-D')}</div>    </div>
                            <div class="col colStyle" style="max-width:190px">
                            <div class="pt-5">${element['status'] == 1 ? 'Pending' : (element['status'] == 2 ? 'Accepted' : (element['status'] == 3 ? 'Partially filed' : (element['status'] == 4 ? 'Submitted' : 'Cancelled')))}</div> 
                        </div>
                            <div class="col colStyle" style="max-width:180px">
                                <div class="dropdown">
                                    <button class="btn remove_click dropdown-toggle" type="button" id="dropdownMenu2"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Action </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                    ${actionbtn}
                                </div>
                            </div>

                            </div>
                        </div>
                     </div>`);

                        $('.cust_grid_div').append(` <div class="col-lg-3 col-md-4">
                        <div class="_product-card ${element['is_active'] == '0' ? '_deactive-cus' : ''}">
                         <img src="/images/form-avatar-icon.svg" class="doc-img" alt="" >
                            <h2 >${element['first_name'] ? element['first_name'] : 'NA'} ${element['last_name'] ? element['last_name'] : 'NA'}</h2> 
                            <div class="con_info pt-0 PB-20">
                                <p><i class="fa fa-envelope"></i>${element['status'] == 1 ? 'Pending' : (element['status'] == 2 ? 'Accepted' : (element['status'] == 3 ? 'Partially filed' : (element['status'] == 4 ? 'Submitted' : 'Cancelled')))}</p>
                                <p><i class="fa fa-solid fa-clock"></i>${moment(element.created_at).format('Y-M-D')}</p>
                                <p><i class="fa fa-globe"></i>
                                ${element['form_type'] == 1 ? 'Real Estate Purchase' : element['form_type'] == 2 ? 'Real Estate Purchase' : element['form_type'] == 3 ? 'Real Estate Purchase & Sell' : element['form_type'] == 4 ? 'Real Estate Title Transfer'
                                : element['form_type'] == 5 ? 'Wills' : element['form_type'] == 6 ? 'POA-Health' : element['form_type'] == 7 ? 'POA-Property' : 'Na'}
                                </p>
                    
                                <div class="PT-20">
                                <div class="dropdown">
                                <button class="btn remove_click dropdown-toggle" type="button" id="dropdownMenu2"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Action </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                ${actionbtn}
                            </div>

                                </div>

                            </div>
                    
                        </div>
                    </div>`);
                    }
                    test.push(element);
                    all_cust[total_indexes] = test;
                    if (array_items_count == 12) {
                        array_items_count = 0;
                        test = [];
                        total_indexes++;
                    }
                });
             
                resolve(allFormsList);
            }
        });
    })
}

function rendersearch(search = null, type = null) {
    if (current_action == 'client') {
        $('.cust_list_div').empty();
        $('.cust_grid_div').empty();
        $('.list_view_div').empty();
        $('.grid_view_div').empty();
        $('.pagination_cust').empty();



        if (search == '') {
            searchArray = allFormsList;
        } else {
            searchArray = allFormsList.filter(function (x) {
                return (x.first_name ? x.first_name.toLowerCase().includes(search) : '') || (x.last_name ? x.last_name.toLowerCase().includes(search) : '');
            });
        }

        if (type == '1') {

            searchArray = searchArray.filter(function (x) {
                return x.status == 1;
            });
        } else if (type == '2') {
            searchArray = searchArray.filter(function (x) {
                return x.status == 2;
            });
        } else if (type == '3') {
            searchArray = searchArray.filter(function (x) {
                return x.status == 3;
            });
        } else if (type == '4') {
            searchArray = searchArray.filter(function (x) {
                return x.status == 4;
            });
        }

        var recsPerPage = 12;
        total_cust_pages = Math.ceil(searchArray.length / recsPerPage);
        $('.count_customers').text(searchArray.length);
        var offset = 0;
        var pageNo = 0;
        var current_records = 0;
        var array_items_count = 0;
        var total_indexes = 0;

        fetchPagination(total_cust_pages, current_records, 'client');
        $('.pagination_cust').append(`<li name="-1" class="page-item customer_page_link disabled previous"><a class="page-link" tabindex="-1">Previous</a></li>`);
        var i;
        for (i = 1; i <= total_cust_pages; i++) {
            $('.pagination_cust').append(`<li name="${i}" class="page-item customer_page_link ${i <= 1 ? 'active' : ''}"><a class="page-link">${i}</a></li>`);
            all_cust.push({})
        }
        $('.pagination_cust').append('<li class="page-item customer_page_link next" name="+1"><a class="page-link">Next</a></li>');
        var test = [];

        /**   Search   **/

        searchArray.forEach(element => {
            var actionbtn = gridaction(element);
            //console.table(element);
            current_records++;
            array_items_count++;
            if (current_records <= 12) {
                $('.cust_list_div').append(`<div class="Product-row " >
                <div class="row">
                    <div class="col colStyle" style="max-width:385px">
                        <div style="display:table; margin-top: -5px; margin-bottom:-5px;">
                            <div class="_emp-D"><img
                                    src="/images/form-avatar-icon.svg" class="doc-img"
                                    alt=""></div>
                            <div class="textMiddle">${element['first_name'] ? element['first_name'] : 'NA'} ${element['last_name'] ? element['last_name'] : 'NA'}</div>
                        </div>
                    </div>
                    <div class="col colStyle" style="max-width:220px">
                        <div class="pt-5">
                        ${element['form_type'] == 1 ? 'Real Estate Purchase' : element['form_type'] == 2 ? 'Real Estate Purchase' : element['form_type'] == 3 ? 'Real Estate Purchase & Sell' : element['form_type'] == 4 ? 'Real Estate Title Transfer'
                        : element['form_type'] == 5 ? 'Wills' : element['form_type'] == 6 ? 'POA-Health' : element['form_type'] == 7 ? 'POA-Property' : 'Na'}</div>
                    </div>
                   
                    <div class="col colStyle" style="max-width:150px">
                    <div class="pt-5">${moment(element.created_at).format('Y-M-D')}</div>    </div>
                    <div class="col colStyle" style="max-width:190px">
                    <div class="pt-5">${element['status'] == 1 ? 'Pending' : (element['status'] == 2 ? 'Accepted' : (element['status'] == 3 ? 'Partially filed' : (element['status'] == 4 ? 'Submitted' : 'Cancelled')))}</div>

                    </div>
                    <div class="col colStyle" style="max-width:180px">
                    <div class="dropdown">
                    <button class="btn remove_click dropdown-toggle" type="button" id="dropdownMenu2"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Action </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                    ${actionbtn}
                </div>

                    </div>
                </div>
             </div>`);
                var actionbtn = gridaction(element);
                $('.cust_grid_div').append(` <div class="col-lg-3 col-md-4">
                        <div class="_product-card ${element['is_active'] == '0' ? '_deactive-cus' : ''}">
                         <img src="/images/form-avatar-icon.svg" class="doc-img" alt="" >
                            <h2 >${element['first_name'] ? element['first_name'] : 'NA'} ${element['last_name'] ? element['last_name'] : 'NA'}</h2> 
                            <div class="con_info pt-0 PB-20">
                                <p><i class="fa fa-envelope"></i>${element['status'] == 1 ? 'Pending' : (element['status'] == 2 ? 'Accepted' : (element['status'] == 3 ? 'Partially filed' : (element['status'] == 4 ? 'Submitted' : 'Cancelled')))}</p>
                                <p><i class="fa fa-solid fa-clock"></i>${moment(element.created_at).format('Y-M-D')}</p>
                                <p><i class="fa fa-globe"></i>
                                ${element['form_type'] == 1 ? 'Real Estate Purchase' : element['form_type'] == 2 ? 'Real Estate Purchase' : element['form_type'] == 3 ? 'Real Estate Purchase & Sell' : element['form_type'] == 4 ? 'Real Estate Title Transfer'
                        : element['form_type'] == 5 ? 'Wills' : element['form_type'] == 6 ? 'POA-Health' : element['form_type'] == 7 ? 'POA-Property' : 'Na'}</p>
                    
                                <div class="PT-20">
                                <div class="dropdown">
                                <button class="btn remove_click dropdown-toggle" type="button" id="dropdownMenu2"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Action </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                ${actionbtn}
                            </div>

                                </div>

                            </div>
                    
                        </div>
                    </div>`);
            }
            test.push(element);
            all_cust[total_indexes] = test;
            if (array_items_count == 12) {
                array_items_count = 0;
                test = [];
                total_indexes++;
            }
        });

    }


}


function capitalize(s) {
    return s.toLowerCase().replace(/\b./g, function (a) {
        return a.toUpperCase();
    });
};


function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '1' + ',' + '$2');
    }
    return x1 + x2;
}

function fetchPagination(pageLen = null, curPage = null, type = null) {

    item = [];
    for (var i = 1; i <= pageLen; i++) {
        item.push(i);
    }
    render(pageLen, curPage, item, true, type);
}



function render(pageLen = null, curPage, item, first, type) {
    if (type == 'client') {
        $('#cust_holder').empty();
    } else if (!type) {
        if (current_action == 'client') {
            $('#cust_holder').empty();
        } else {
            $('#poc_holder').empty();
        }
    } else {
        $('#poc_holder').empty();
    }
    //debugger
    var html = '';
    separatorAdded = false;
    for (var i in item) {
        if (isPageInRange(curPage, i, pageLen, 2, 2)) {
            html += '<li class="' + (type == "client" ? 'customer_page_link' : (!type ? (current_action == 'client' ? 'customer_page_link' : 'poc_page_link') : 'poc_page_link')) + '" name="' + i + '" ' + (type == "client" ? 'data-page' : (!type ? (current_action == 'client' ? 'data-page' : 'data-page-poc') : 'data-page-poc')) + '="' + i + '">' + item[i] + '</li>';
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
    if (type == 'client') {
        var holder = document.querySelector('#cust_holder');
        holder.innerHTML = html;
        document.querySelector('#cust_holder>li[data-page="' + curPage + '"]') ? document.querySelector('#cust_holder>li[data-page="' + curPage + '"]').classList.add('active') : '';
    } else if (!type) {
        if (current_action == 'client') {
            var holder = document.querySelector('#cust_holder');
            holder.innerHTML = html;
            document.querySelector('#cust_holder>li[data-page="' + curPage + '"]') ? document.querySelector('#cust_holder>li[data-page="' + curPage + '"]').classList.add('active') : '';
        } else {
            var holder = document.querySelector('#poc_holder');
            holder.innerHTML = html;
            document.querySelector('#poc_holder>li[data-page-poc="' + curPage + '"]') ? document.querySelector('#poc_holder>li[data-page-poc="' + curPage + '"]').classList.add('active') : '';
        }
    } else {
        var holder = document.querySelector('#poc_holder');
        holder.innerHTML = html;
        document.querySelector('#poc_holder>li[data-page-poc="' + curPage + '"]') ? document.querySelector('#poc_holder>li[data-page-poc="' + curPage + '"]').classList.add('active') : '';
    }

    if (first) {
        holder.addEventListener('click', function (e) {
            if (!e.target.getAttribute((type == "client" ? 'data-page' : 'data-page-poc'))) {
                // no relevant item clicked (you could however offer expand here )
                return;
            }
            curPage = parseInt(e.target.getAttribute((type == "client" ? 'data-page' : 'data-page-poc')));
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
//Dynamic Search And Filter
$(document).on('input', '.dynamic_search', function () {

    if ($(this).val().length > 0) {

        rendersearch($(this).val(), $('.dynamic_filter').val());
    }
    if ($(this).val() == '') {

        rendersearch($(this).val(), $('.dynamic_filter').val());
    }
})

$(document).on('change', '.dynamic_filter', function () {

    rendersearch($('.dynamic_search').val(), $(this).val());
})



$(document).ready(function () {
   
    // clients[0].status = ''
    // console.log(clients);
        // function adding_client(){
             
           
        // }
        // adding_client();



    if (location.pathname == "/intake-forms") {
        fetchFormList();
    }
    $('.add-more-btn').attr('href', '#');
    $('.new_form_field').addClass('required_client');
    $('#client_type').attr('disabled', true);



    $('#client_type').change(function () {
    $('.add-more-btn').attr('href', '#');

        $('#designationsTable tbody').empty();
        mulitple_clients = [];
        current_client_array = [];

        $('select[name="existing_client"]').val("0").trigger('change');
        $('.disabled').val('');

        var current_action = $(this).val();
        if (current_action == 1) {
            $('.close').css('display', 'block');
            $('.show_existing_div').show();
            $('.client').css('display', 'block');
            $('.disabled').attr('disabled', true);
            $('.disabled').css('background-color', '#f5f5f5 !important')

            $(".add-more-btn").addClass("add_more_client");
            $('#collapseExample').removeClass('show');
            $(".add-more-btn").removeClass("save_client");
            $('.add-more-btn').text('Add More');
            $('.new_form_field').val('');

        }
        else {
            $('.close').css('display', 'none');

            $('.client').css('display', 'none');

            $('.show_existing_div').hide();
            $('.add_more_client').css('display', 'block');
            $('#collapseExample').addClass('show');
            $(".add-more-btn").removeClass("add_more_client");
            $(".add-more-btn").addClass("save_client");
            $('.add-more-btn').text('Save');

            $('.disabled').attr('disabled', false);
            $('.disabled').css('background-color', '');
            $('#marital_status').val(0).trigger('change');
            $("#gender").append(`<option value="0 selected">Select Gender </option>`)
            $('#gender').val(0).trigger('change');
            $('#residence_status').val(0).trigger('change');
            $("#residence_status").append(`<option value="0" selected>Select Residence </option>`)
            $('#employment_status').val(-1).trigger('change');

        }
    });

    $('#intake_form_type').change(function () {
        if($(this).val() == 0){
            $('#client_type').attr('disabled', true);
        }else{
            $('#client_type').removeAttr('disabled', false);
        }
        current_intake_form = $(this).val();
        if (form_old_value == null) {
            form_old_value = current_intake_form;
        }
        if (form_old_value != current_intake_form) {
            if ($('#collapseExample').hasClass('show') || $('#client_type').val() != 0) {
                $('#intake_form_type').click();
            }
        }

        $('#client_type').change(function () {
            $('.detail_form').empty();
            if ($('#client_type').val() != 0) {

                $('#btns_div').css('display', 'block');

                if (current_intake_form == 1 || current_intake_form == 2 || current_intake_form == 3 || current_intake_form == 4) {
                    $('.property_info').css('display', 'block');
                    $('.add-more-btn').css('display', 'block');
                } else {
                    $('.add-more-btn').css('display', 'none');
                    $('.property_info').css('display', 'none');
                }
            }
            else {
                $('#btns_div').hide();
                $('.property_info').css('display', 'none');
                $('.add-more-btn').css('display', 'none');
                $('#collapseExample').removeClass('show');
            }
        });
        $(document).on('click', '.confirm_delete', function () {
            $('#add_more_form').empty();
            $('#form')[0].reset();
            $('select[name="property_type_id"]').val("0").trigger('change');
            $('select[name="country_id"]').val("0").trigger('change');
            $('#intake_form_type').val(0).trigger('change');
            $(".existing_client option").attr('disabled',false);
            $('select[name="client_type"]').val("0").trigger('change');
            $('select[name="existing_client"]').val("0").trigger('change');
            $('.add-more-btn').hide();
            $('.property_info').hide();
            $('.show_existing_div').hide();
            $('#collapseExample').removeClass('show');
            $('.disabled').val('');
            $('.client').css('display', 'none');
            if(current_intake_form == 0){
                $('#client_type').attr('disabled', true);
            }else{
                $('#client_type').removeAttr('disabled', false);
            }
            $('.detail_form').empty();
            $('.cancel_delete_modal').click();
            $('#btns_div').hide();
            $('#designationsTable tbody').empty();
            mulitple_clients = [];
            current_client_array = [];
        })
        $(document).on('click', '.cancel_delete_modal', function () {
            $('select[name="intake_form_type"]').val(form_old_value);
        })

    })
    //Add More Clients 
    $(document).on('click', '.add_more_client', function () {
            $('.close').css('display', 'block');
            $('#collapseExample').addClass('show');
            $(".add-more-btn").removeClass("add_more_client");
            $(".add-more-btn").addClass("save_client");
            $('.add-more-btn').text('Save');
            $('.add-more-btn').attr('href', '#');
            $('.new_form_field').addClass('required_client');
    })

    $(document).on('click', '.save_client', function () {
        if(!$('#new_first_name').val() || !$('#new_email').val())
        {
            $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Fill Required Fields (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
                
        }
        var emailReg            =   /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        var email               =   $('#new_email').val();
        if (emailReg.test(email)==false && email != '') {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Enter Correct Email');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

            $('.add-more-btn').attr('href', '#collapseExample');

            mulitple_clients.push({
                'new_first_name': $('#new_first_name').val(),
                'new_last_name': $('#new_last_name').val(),
                'new_middle_name': $('#new_middle_name').val(),
                'new_email': $('#new_email').val(),
            });

            if ($('#intake_form_type').val() > 4) {

                $(".add-more-btn").hide();
            }
            $('.new_form_field').removeClass('required_client');
            $(".add-more-btn").addClass("add_more_client");
            $('#collapseExample').removeClass('show');
            $(".add-more-btn").removeClass("save_client");
            $('.add-more-btn').text('Add More');
            $('.new_form_field').val('');
            $('#new_marital_status').val(0).trigger('change');
            $('#new_employment_status').val(0).trigger('change');
            $('#new_residence_status').val(0).trigger('change');
            $('.detail_form').empty();
            mulitple_clients.forEach(function (data) {


                $('.detail_form').append(`
                        <h2 class="_head03">${data.new_first_name} ${data.new_last_name}<span></span>
                            <button class="btn addBTN-act" data-toggle="collapse" href="#collapseExample${counter}" role="button" aria-expanded="false" aria-controls="collapseExample${counter}"> View Detail <i class="fa fa-angle-down ml-1"></i></button>
                        </h2>
                        <div class="collapse w-100" id="collapseExample${counter}">
                            <div class=" p-15 add_new">
                                <div class="row">
                                    <div class="col-md-4 mb-10 ">
                                    
                                     <div class="infoDiv">   
                                    <label class="control-label mb-5">First Name </label>
                                        <p><strong> ${data.new_first_name}</strong></p>
                                        </div></div>
                                    <div class="col-md-4 mb-10">
                                     <div class="infoDiv">   
                                    <label class="control-label mb-5">Middle Name </label>
                                        <p><strong> ${data.new_middle_name ? data.new_middle_name : 'NA'}</strong></p>
                                    </div>
                                    </div>
                                    <div class="col-md-4 mb-10">
                                     <div class="infoDiv">   
                                    <label class="control-label mb-5">Last Name </label>
                                        <p><strong> ${data.new_last_name ? data.new_last_name : 'NA'}</strong></p>
                                    </div>
                                    </div>
                                    
                                    </div>
                                    </div>
                                    <div class="col-md-4 mb-10">
                                     <div class="infoDiv">   
                                    <label class="control-label mb-5">Email </label>
                                        <p><strong> ${data.new_email}</strong></p>
                                    </div>
                                    </div>
                                   
                                   
                                    </div>
                                   
                                    </div>
                                  
                                    </div>
                                  
                                    </div>

                                </div>

                            </div>
                        </div>`)
                $(`#collapseExample${counter}`).removeClass('show');
                counter++;
            })
       
    })

    if (segments[3] == 'create-intake') {
        geographical_data();
    }

    function geographical_data() {

        $.ajax({
            url: '/geographical_data',
            success: function (response) {

                $("#gender").append(`<option value="0">Select Gender </option>`)
                $("#countries").append(`<option value="0">Select Country</option>`)
                $("#states").append(`<option value="0">Select State</option>`)
                $("#cities").append(`<option value="0">Select City</option>`)
                $("#postal_code").append(`<option value="0">Select postal</option>`)




                response.result.genders.forEach(data => {
                    //  $("#gender").append(`<option value="${data.id}">${data.gender_name}</option>`)
                    $("#new_gender_id").append(`<option value="${data.id}" data-name="${data.gender_name}">${data.gender_name}</option>`)
                })
                response.result.countries.forEach(data => {
                    $("#countries").append(
                        `<option data-id="${data.id}" value="${data.id}">${data.name}</option>`
                    )
                })

            },


        });
    }
    $(".countries").change(function () {

        $('#states').empty();
        $('#cities').empty();

        $('#postal_code').empty();

        var country_id = $(this).val();
        $.ajax({
            url: `/getStateAgainst_Country/${country_id}`,
            success: function (response) {
                $("#states").append(`<option value="0">Select State</option>`);
                response.states.forEach(data => {
                    $("#states").append(`<option value="${data.id}">${data.name}</option>`)
                })
            }
        });


    })
    $("#states").change(function () {

        $('#cities').empty();
        $('#postal_code').empty();
        var city_id = $(this).val();
        $.ajax({
            url: `/getCityAgainst_States/${city_id}`,
            success: function (response) {
                $("#cities").append(`<option value="0">Select Cities</option>`);
                $('select[name="city_id"]').val('-1').trigger('change');

                response.cities.forEach(data => {
                    $("#cities").append(`<option value="${data.id}">${data.name}</option>`)
                })
            }
        });
    })

    $("#cities").change(function () {

        $('#postal_code').empty();
        var city_id = $(this).val();
        $.ajax({
            url: `/getPostalcodeAgainst_City/${city_id}`,
            success: function (response) {
                $("#postal_code").append(`<option value="0">Select Postal Code</option>`);

                response.PostalCode.forEach(data => {
                    $("#postal_code").append(`<option value="${data.id}">${data.postal_code}</option>`)
                })
            }
        });
    })
})

$('#datepicker , #datepicker2').datepicker({
    autoclose: true,
    todayHighlight: true,
    toggleActive: true,
    format: dateFormat
})
    .on('changeDate', function (ev) {
        $(this).datepicker('hide');
    });

$('.close').on('click', function () {

    $('.new_form_field').removeClass('required_client');
    $('.add-more-btn').attr('href', '#collapseExample');
    $(".add-more-btn").addClass("add_more_client");
    $('#collapseExample').removeClass('show');
    $(".add-more-btn").removeClass("save_client");
    $('.add-more-btn').text('Add More');
    $('.new_form_field').val('');
    $('#new_marital_status').val(0).trigger('change');
    $('#new_employment_status').val(0).trigger('change');
    $('#new_residence_status').val(0).trigger('change');
})

//Saving Intake Client 
$("#save").on('click', function () {
  
    if (($('#intake_form_type').val() <= 4) && ($('#client_type').val() == 2 || $('#client_type').val() == 1) ) {
      
        $('.required').each(function () {
            if (!$(this).val() || $(this).val() == 0) {
                
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please provide all the Required information of Property(*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                flag = true;
                return;

            } else {
                flag = false;
            }
        })
    }
    if (($('#client_type').val() == 2) && $('#collapseExample').hasClass('show')) {
       
        if(!$('#new_first_name').val() || !$('#new_email').val() )
        {
            $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Fill Required Fields (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
                
        }
        var emailReg            =   /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        var email               =   $('#new_email').val();
        if (emailReg.test(email)==false && email != '') {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Enter Correct Email');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
    }
   
    
            if (($('#intake_form_type').val() <= 4) && $('#collapseExample').hasClass('show')) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please fill the new Basic Information First or Close the Module');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (($('#client_type').val() == 1) &&   current_client_array.length < 1 ) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please Select Client First');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
            if (flag == false) {
                $('#save').attr('disabled', 'disabled');
                $('.btn-cancel').attr('disabled', 'disabled');
                $('#save').text('Processing..');
                $('#form').ajaxSubmit({
                    url: '/add-client-intake-form',
                    type: 'post',
                    data: {
                        'mulitple_clients': mulitple_clients,
                        'current_client_array': current_client_array
                    },
                    success: function (response) {
                        
                        mulitple_clients = [];
                        current_client_array = [];
                        $('#form')[0].reset();
                        $('#client_type').val(0).trigger('change');

                        setTimeout(() => {
                            window.location = "/intake-forms";
                            $('#notifDiv').fadeOut();
                        }, 1500);
                        $('.formselect').select2();
                        if ("success") {
                            $('#notifDiv').fadeIn();
                            $('#notifDiv').css('background', 'green');
                            $('#notifDiv').text('Added successfully');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);


                            $('#save').removeAttr('disabled');;
                            $('.btn-cancel').removeAttr('disabled');
                            $('#save').text('Save');
                        }

                    },
            error: function (e) {

                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Failed to save at the moment');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);

                $('#save').removeAttr('disabled');;
                $('.btn-cancel').removeAttr('disabled');
                $('#save').text('Save');

            }
        })
    }
});


$(document).on('click', '.remove_btn', function () {
    var id = $(this).attr('id');
    $("#tr-" + id).remove();
    // this.parentNode.removeChild(this);

    //current_client_array.splice(current_client_array.indexOf(this),1);
    $('#existing_client').children('option[value="' + id + '"]').attr('disabled', false);
    $(".existing_client").select2();
    current_client_array = current_client_array.filter(x => x.existing_client_id != id);
     
})

$(".existing_client").change(function () {

    var current_client_id ;

  
    id = $(this).val();


    if (id != 0) {
        var url = `/get-client/${id}`;

        $.ajax({
            type: 'get',
            url: url,
            success: function (response) {
           
                if (current_intake_form > 4) {
                    $('#designationsTable tbody').empty();
                    current_client_array = [];
                    mulitple_clients     =  [];
                    //  $('#intake_form_type').val(0).trigger('change');
                }



                $('#designationsTable tbody').append(`
            <tr id='tr-${response.client['id']}'>
                <td>${response.client['id']}</td>
                <td>${response.client['first_name'] ? response.client['first_name'] : 'NA'} 
                    ${response.client['last_name']  ? response.client['last_name']  : 'NA'}</td>
                <td>${response.client['email']      ? response.client['email']       : 'NA'}</td>
            
                <td>${response.client['primary_cellphone'] ? response.client['primary_cellphone'] : 'NA'}</td>
                <td>${response.client['primary_address'] ? response.client['primary_address'] : 'NA'}</td>
                <td><button id="${response.client['id']}" class="btn  smBTN red-bg remove_btn" data-index="">Remove</button></td>
            </tr>`);
            // console.log($(".existing_client option:selected"));
            if($('#intake_form_type').val() > 4){ 
                $(".existing_client option").attr('disabled',false);
            }
            $('#existing_client').children('option[value="' + response.client['id'] + '"]').attr('disabled', true);
            $(".existing_client").val('0');
            $(".existing_client").select2();
                current_client_array.push({
                    'existing_client_id': `${response.client['id']}`,
                });
            }
        });
    }
})

function openModel(id) {
     
    var extension = id.substr((id.lastIndexOf('.') + 1));
    $('.btn_modal_download').attr('href', `/storage/${id}`);
    $('.preview  .modal-body').empty();
    if (extension == 'pdf') {
        $('.preview  .modal-body').html
            ('<iframe src ="/storage/' + `${id}` + '" width="100%" height="500px max-height="500"></iframe>');
    } else {
        $('.preview  .modal-body').html('<img src="/storage/' + `${id}` + '" class="cnicCardimg" />');
    }
};

$('.approve_btn').on('click', function () {

    var form_id = $('#form_id').val();

    $.ajax({
        type: 'post',
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        url: `/intake-form-approve/${form_id}`,
        success: function () {
            setTimeout(() => {
                window.location = "/intake-forms";
                $('#notifDiv').fadeOut();
            }, 2000);

            $('.approve_btn').text('Processing');

            if ("success") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Form Approved successfully');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 1500);
            }





        }
    });
});
// var doc_id  = '';
// var pre_id  = null;
// function document_preview(doc_id) {

//     if(pre_id == null){
//          pre_id  = doc_id;
//     }
//     //alert(pre_id)
   
//     $(`#collapseExample${pre_id}`).removeClass('show')
//     pre_id  = doc_id;
   
//     // var data =  $(`#collapseExample${doc_id}`).attr('data-id');
    
//     // $(this).attr('aria-expanded', false);
//     $(this).addClass('collapsed');
//     // $(`#collapseExample${doc_id}`).addClass('show');
    
// }