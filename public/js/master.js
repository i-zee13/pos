// For arr.reduce/array.reduce algorithm
// orderData.contents.reduce((sum, val) => sum + val.net_weight, 0)
let dateTimeFormat  =  "yyyy-mm-dd hh:ii";
let dateFormat      =  "yyyy-mm-dd";
let timeFormat      =  "hh:ii";

Dropzone.autoDiscover = false;
let subNavItems = [];
let parentModRef = null;
let editSubNavItem = null;
var allActivities = [];
var filtersArray = ["900", "901", "902", "903", "904", "905", "906", "907", "908", "909", "910"];
var selected_customer_id = 0;
var filterStartDate = '';
var filterEndDate = '';
var filterDate = 0;
var searchQuery = null;
let allTasksCreated = [];
let files_url = '';
let all_files = [];
$(document).ready(function () {
    $('.dropify').dropify();
    var segments = location.href;
    segments = $.trim(segments.replace('#', ''));
    segments = segments.split('/');
    // console.log(segments);
    var bar = $('.bar');
    var percent = $('.percent');
    var status = $('#status');
    if(segments[3] != "add-purchase-order" && segments[3] != "intake-form-document"){
        $('form').ajaxForm({
            beforeSend: function () {
                status.empty();
                var percentVal = '0%';
                bar.width(percentVal);
                percent.html(percentVal);
            },
            uploadProgress: function (event, position, total, percentComplete) {
                var percentVal = percentComplete + '%';
                bar.width(percentVal);
                percent.html(percentVal);
                console.log(percentVal);
            },
            complete: function (xhr) {
    
                status.html(xhr.responseText);
    
            }
        });
    }
  

    var segments = location.href.split('/');
    var action = segments[3];

    if (action == 'view_all_activities') {
        fetchActivities(filtersArray, filterDate, filterStartDate, filterEndDate);
    }

    let activeTaskForComments = null;

    if (action == 'Tasks' || action == 'Correspondence') {
        fetchTaskFromMaster();
    }

    $(".centralizedTaskDp").datepicker({
        format: "yyyy-mm-dd",
        startDate: "+0d"
    }).on('changeDate', function (e) {
        $(this).datepicker('hide');
    });

    $("#transaction_date_cash").datepicker({
        format: "yyyy-mm-dd",
        startDate: "+0d"
    }).on('changeDate', function (e) {
        $(this).datepicker('hide');
    });

    $('#modalCloseTaskCentralized').on('click', function () {
        $('#taskCentralizedModal').removeClass('modalShow');
    });

    $(document).on('change', '.taskStatusChange', function () {
        $(this).parent().parent().find('.TS-Circle').removeClass('TS-InReview')
        $(this).parent().parent().find('.TS-Circle').removeClass('TS-InProgress')
        $(this).parent().parent().find('.TS-Circle').removeClass('TS-NotStarted')
        $(this).parent().parent().find('.TS-Circle').removeClass('TS-Completed')
        $(this).parent().parent().find('.TS-Circle').removeClass('TS-Cancelled')

        if ($(this).val() == "in-review")
            $(this).parent().parent().find('.TS-Circle').addClass('TS-InReview')
        else if ($(this).val() == "in-progress")
            $(this).parent().parent().find('.TS-Circle').addClass('TS-InProgress')
        else if ($(this).val() == "not-started")
            $(this).parent().parent().find('.TS-Circle').addClass('TS-NotStarted')
        else if ($(this).val() == "completed")
            $(this).parent().parent().find('.TS-Circle').addClass('TS-Completed')
        else if ($(this).val() == "cancelled")
            $(this).parent().parent().find('.TS-Circle').addClass('TS-Cancelled')

        ajaxer('/UpdateTaskStatus', 'POST', {
            _token: $('[name="csrf_token"]').attr('content'),
            id: activeTaskForComments.id,
            status: $(this).val()
        }).then(x => {
            activeTaskForComments.task_status = $(this).val();
        });
    });

    $(document).on('click', '.deleteTaskFromModal', function () {
        if (!confirm('Are you sure you want to delete this task?'))
            return;
        $(this).attr('disabled', true);
        ajaxer('/Correspondence/Delete', 'POST', {
            _token: $('[name="csrf_token"]').attr('content'),
            id: $(this).attr('task-id')
        }).then(x => {
            $(this).parent().parent().remove();
        })
    });
    // for text type inputs which are required to accept only numeric values
    $(document).on('input','.only_numerics' , function(){
        this.value = this.value.replace(/[^0-9]/gi,'');
    })
   // for text type inputs which are required to accept only aplphabetic values
    $(document).on('input','.only_alphabets', function() {
    this.value = this.value.replace(/[^a-z]/gi,'');
    })

    $(document).on('click', '.modalShowTaskCentralized', function () {
        $('.customerSelectDD .select2').attr('style', 'width: 208px !important');
        $('.assignToDD .select2').css('width', '100%');
        $('#taskCentralizedModal').addClass('modalShow');
    });

    $(document).on('change', '#taskPriority', function () {
        $(this).parent().parent().find('.fa-flag').removeClass('TaskCritical')
        $(this).parent().parent().find('.fa-flag').removeClass('TaskHigh')
        $(this).parent().parent().find('.fa-flag').removeClass('TaskLow')
        $(this).parent().parent().find('.fa-flag').removeClass('TaskMedium')

        if ($(this).val() == "critical")
            $(this).parent().parent().find('.fa-flag').addClass('TaskCritical')
        else if ($(this).val() == "high")
            $(this).parent().parent().find('.fa-flag').addClass('TaskHigh')
        else if ($(this).val() == "medium")
            $(this).parent().parent().find('.fa-flag').addClass('TaskMedium')
        else if ($(this).val() == "low")
            $(this).parent().parent().find('.fa-flag').addClass('TaskLow')
    });

    $(document).on('click', '.viewTaskDetails', function () {

        $('.TaskAtachList').empty();
        if (action == "Tasks") {
            $('.attachments_div').hide();
        } else {
            $('.attachments_div').show();
        }
        $('.customerSelectDDViewDetails .select2').attr('style', 'width: 208px !important');
        $('.assignToDDViewTaskDetails .select2').css('width', '100%');

        let taskFnd = allTasksCreated.find(x => x.id == $(this).attr('task-id'));

        if (!taskFnd)
            return;

        activeTaskForComments = taskFnd;

        $('.flag_colors').removeClass('TaskHigh');
        $('.flag_colors').removeClass('TaskCritical');
        $('.flag_colors').removeClass('TaskMedium');
        $('.flag_colors').removeClass('TaskLow');

        $('#viewDetailsTaskTitleModal').html(`<img class="_T-img-title" src="images/task-icon-b.svg" alt="">${taskFnd.title}`);
        $('#customerIdViewTaskDetails').val(taskFnd.customer_id).trigger('change');
        $('#dueDateViewTaskDetails').val(taskFnd.due_date).trigger('change');
        $('.taskStatusChange').val(taskFnd.task_status).trigger('change');
        $('#dueTimeViewTaskDetails').val(moment(taskFnd.due_time, 'hh:mm').format('h:mm A')).trigger('change');
        $('#taskPriorityViewDetails').val(taskFnd.task_priority ? taskFnd.task_priority : 'low').trigger('change');
        $('#viewDetailsTaskMomModal').text(taskFnd.mom);
        $('#viewDetailsReminderTime').val(moment(taskFnd.reminder_time, 'hh:mm').format('h:mm A')).trigger('change');
        $('#viewDetailsReminderDate').val(taskFnd.reminder_date);
        $('#viewDetailsAssignedTo').val(taskFnd.assigned_to.split(",")).trigger("change");
        $('#viewDetailsAssignedTo').attr('disabled', true)
        $('.flag_colors').addClass((!taskFnd.task_priority ? '' : (taskFnd.task_priority == 'critical' ? 'TaskCritical' : (taskFnd.task_priority == 'high' ? 'TaskHigh' : (taskFnd.task_priority == 'medium' ? 'TaskMedium' : 'TaskLow')))));
        $('.taskCommentsActivityWindow').empty();
        if (taskFnd.task_comments) {
            let comments = JSON.parse(taskFnd.task_comments);
            comments.forEach(x => {
                $('.taskCommentsActivityWindow').append(`
        <li class="${loggedInUser.user_id == x.employee_id ? 'RS-Comments' : 'LS-Comments'}">
        <div class="timeline-info">
            <div class="historyDiv">
                <h4>${x.name}</h4>
                <p>${x.comment}</p>
                <small>${moment(x.at, 'YYYY-MM-DD HH:mm:ss').format('hh:mm A')}</small>
            </div>
        </div>
        <div class="timeline-icon"><img src="${x.picture.replace(".", "")}"
                alt=""></div>
    </li>
        `);
            });
            setTimeout(() => {
                $(".TaskCommentSec").animate({
                    scrollTop: $('.TaskCommentSec').prop("scrollHeight")
                }, 500);
            }, 250);
        }

        $('.downloadAllDocs').attr('task-id', taskFnd.id);
        var files = JSON.parse(taskFnd.files);
        all_files = [];
        if (files) {

            if (files['multiple_documents']) {
                files['multiple_documents'].forEach(x => {
                    $('.TaskAtachList').append(`<div class="DownloadList">
                    <div class="row">
                        <div class="col-auto">
                            <div class="DF-icon"><img
                                    src="/images/file-attach-icon-b.svg" alt="">
                            </div>
                        </div>
                        <div class="col DLtitle">${x.name + '.' + x.extension}</div>
                        <div class="col-auto"><span class="FileSize">22kb</span>
                            <a href="${files_url + x.link}" class="btn btn-primary AllDownload-btn"><i
                                    class="fa fa-download"></i></a></div>
                    </div>
                </div>`);
                    all_files.push(files_url + x.link);
                });
            }

            if (files['voice_note']) {
                files['voice_note'].forEach(x => {
                    $('.TaskAtachList').append(`<div class="DownloadList">
                    <div class="row">
                        <div class="col">
                            <div class="playerOuter" data-ap
                                data-ap-file="${files_url + x.link}"
                                data-ap-width="100" data-ap-amplify="1"
                                data-ap-scaleFactor="40"></div>
                        </div>
                        <div class="col-auto"><span class="FileSize">22kb</span>
                            <a href="${files_url + x.link}" class="btn btn-primary AllDownload-btn"><i
                                    class="fa fa-download"></i></a></div>
                    </div>
                </div>`);
                    all_files.push(files_url + x.link);
                });

                var playerCount = 0;
                $("[data-ap]").each(function () {
                    var playerID = "ap-top-" + playerCount;
                    $(this).attr("ID", playerID);
                    new AudioPlayer({
                        element: "#" + playerID,
                        file: $(this).data("ap-file"),
                        width: 470,
                        amplify: 2,
                        scaleFactor: 60
                    });
                });
            }

            if (files['multiple_images']) {
                files['multiple_images'].forEach(x => {
                    $('.TaskAtachList').append(`<div class="DownloadList">
                    <div class="row">
                        <div class="col-auto">
                            <div class="DF-icon"><img
                                    src="/images/file-attach-icon-b.svg" alt="">
                            </div>
                        </div>
                        <div class="col DLtitle">${x.name + '.' + x.extension}</div>
                        <div class="col-auto"><span class="FileSize">22kb</span>
                            <a href="${files_url + x.link}" class="btn btn-primary AllDownload-btn"><i
                                    class="fa fa-download"></i></a></div>
                    </div>
                </div>`);
                    all_files.push(files_url + x.link);
                });

            }

        }
    });


    $(document).on('click', '.downloadAllDocs', function () {
        all_files.forEach(x => {
            window.open(x);
        });
        return;
        var thisRef = $(this);
        thisRef.attr('disabled', 'disabled');
        thisRef.text('Processing...');
        $.ajax({
            type: 'POST',
            url: '/DownloadMultipleDocs/' + $(this).attr('task-id'),
            data: {
                _token: $('[name="csrf_token"]').attr('content')
            },
            success: function (response) {
                thisRef.removeAttr('disabled');
                thisRef.text('Download All');
            }
        })
    })


    $(document).on('input', '#commentOnTask', function () {
        ajaxer('/TypingStatusOnTask', 'POST', {
            _token: $('[name="csrf_token"]').attr('content'),
            'task_id': activeTaskForComments.id,
            'comment': $(this).val()
        })
    });

    $(document).on('click', '#sendComment', function () {
        if (!$('#commentOnTask').val().trim())
            return;

        $('.taskCommentsActivityWindow').append(`
            <li class="RS-Comments">
            <div class="timeline-info">
                <div class="historyDiv">
                    <h4>${loggedInUser.name}</h4>
                    <p>${$('#commentOnTask').val()}</p>
                    <small>${moment().format('hh:mm A')}</small>
                </div>
            </div>
            <div class="timeline-icon"><img src="${loggedInUser.picture.replace(".", "")}"
                    alt=""></div>
        </li>
            `);
        $(".TaskCommentSec").animate({
            scrollTop: $('.TaskCommentSec').prop("scrollHeight")
        }, 250);
        ajaxer('/PostTaskComment', 'POST', {
            _token: $('[name="csrf_token"]').attr('content'),
            'comment': $('#commentOnTask').val(),
            'task_id': activeTaskForComments.id
        })
        scrollTop: $('.TaskCommentSec').prop("scrollHeight")
        $('#commentOnTask').val("")
    });

    $('#modalExpand-btn').click(function () {
        //Saif Work
        $("#taskCentralizedModal").toggleClass("modalExpand");
        $('.test_i').toggleClass('fa-expand fa-compress');
    });

    $('#saveCentralizedTask').click(function () {
        if (!$('#taskTitleTaskCentralized').val() || !$('#momTaskMomCentralized').val() || !$('#assigned_toTaskCentralized').val().length || !$('#customerIdTaskCentralized').val()) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return
        }
        $(this).attr('disabled', true)
        $(this).text('Saving')
        $('.tasksListTable tbody').html('<tr><td colspan="8" style="text-align: center; line-height: 3; font-weight: bold; font-size: 14px">LOADING</td> </tr>');
        $.ajax({
            type: 'POST',
            url: '/Correspondence',
            data: {
                _token: $('[name="csrf_token"]').attr('content'),
                due_date: $('#dueDateDpTaskCentralized').val(),
                due_time: $('#dueTimeDDTaskCentralized').val(),
                title: $('#taskTitleTaskCentralized').val(),
                assigned_to: $('#assigned_toTaskCentralized').val(),
                reminder_date: $('#reminderDateDpTaskCentralized').val(),
                reminder_time: $('#reminderTimeDDTaskCentralized').val(),
                mom: $('#momTaskMomCentralized').val(),
                customer_id: $('#customerIdTaskCentralized').val(),
                priority: $('#taskPriority').val(),
                type: 'task'
            },
            success: function (response) {
                allTasksCreated = JSON.parse(response).data;
                renderTasksInTasksPage();
                $('#momTaskMomCentralized').val("")
                $('#taskTitleTaskCentralized').val("")
                $(this).removeAttr('disabled')
                $(this).text('Save Task')
                $('#assigned_toTaskCentralized').val(null).trigger('change');
                $('#customerIdTaskCentralized').val('0').trigger('change');
                $('#modalCloseTaskCentralized').click();
            }.bind($(this))
        })
    });

    navItemsScript();
    actionListeners();

    $(".datepicker").datepicker({
        format: "yyyy-mm-dd"
    }).on('changeDate', function (e) {
        $(this).datepicker('hide');
    });

    $('#productlist01').click(function () {
        if ($('#product-cl-sec').hasClass('active')) {
            closeSidebar()
        } else {
            openSidebar()
        }
    });

    $("#example").DataTable();

    $(".table-PL").dataTable({
        searching: false,
        paging: false,
        info: false
    });

    $("#pl-close, .close-sidebar, .overlay, .pl-close").on("click", function () {
        closeSidebar();
    });

    $(document).on("click", ".closeProductAddSidebar", function () {
        closeSidebar();
    });

    $(document).on("click", "#SN-close, .overlay-blure", function (e) {
        // allClasses = e.target.classList;
        // if(allClasses[2] && allClasses[2] == 'snCloseBtn'){

        // }
        // alert($(window).width());
        closeSubNav();
    });

    $(document).on("click", "#SN-close, .overlay-for-sidebar", function () {
        closeSidebar();
    });

    $(document).on("click", ".openSubMenu", function () {
        let name = $(this).attr("attr-name");
        let item = subNavItems.find(
            x => x.parent.toLowerCase() == name.toLowerCase()
        );
        $("#subNavItems").empty();
        $("#subNavHeader").html(item.parent);
        item.child.forEach(element => {
            $("#subNavItems").append(element);
        });
        closeSidebar();
        openSubNav();
    });

    $(document).on('click', '.open_search_modal', function () {
        $('.SearchList').empty();
        $('#tblLoader_search').hide();
        $('.search_whole_site').val('');
    });

    $(document).on('input', '.search_whole_site', function () {
        if ($(this).val().length > 2) {
            $('.SearchList').empty();
            $('#tblLoader_search').show();
            fetchSiteSearchReasult($(this).val());
        } else if ($(this).val() == '') {
            $('.SearchList').empty();
            $('#tblLoader_search').hide();
        }
    });

    $(document).on('click', '.filter_checkBox', function () {
        //900 = order
        //901 = product
        //902 = customer
        //903 = supplier
        //904 = shipper
        //905 = task
        if ($(this).prop('checked')) {
            filtersArray.push($(this).attr('id'));
        } else {
            if (filtersArray.indexOf($(this).attr('id')) > -1) {
                filtersArray.splice(filtersArray.indexOf($(this).attr('id')), 1);
            }
        }
        $('.filters_count').text(`(${filtersArray.length}/11)`)
        renderDataAfterFilters(selected_customer_id, filtersArray, searchQuery);

    });

    $(document).on('change', '#emp_for_activity', function () {
        selected_customer_id = $(this).val();
        $('.all_activities').empty();
        renderDataAfterFilters(selected_customer_id, filtersArray, searchQuery);
    });

    $(document).on('change', '.date_filter', function () {
        filterDate = $(this).val();
        if ($(this).val() == 5) {
            $('.custom_filter_div').show();
        } else {
            $('.custom_filter_div').hide();
            fetchActivities(filtersArray, filterDate, filterStartDate, filterEndDate, searchQuery);
        }
    });

    $(document).on('change', '.filterStartDate', function () {
        filterStartDate = $(this).val();
        if (filterEndDate) {
            fetchActivities(filtersArray, filterDate, filterStartDate, filterEndDate, searchQuery);
        }
    });

    $(document).on('change', '.filterEndDate', function () {
        filterEndDate = $(this).val()
        if (filterStartDate) {
            fetchActivities(filtersArray, filterDate, filterStartDate, filterEndDate, searchQuery);
        }
    });

    $(document).on('input', '.searchActivities', function () {
        if ($(this).val() == '') {
            searchQuery = null;
        } else {
            searchQuery = $(this).val();
        }
        renderDataAfterFilters(selected_customer_id, filtersArray, searchQuery);
    });

});
$(window).on("load", function () {
    $("._act-TL .body").mCustomScrollbar({
        theme: "dark-2"
    });
    $("._activitycards, .left_Info").mCustomScrollbar({
        theme: "dark-2"
    });
    $(".OrderDL .body").mCustomScrollbar({
        theme: "dark-2"
    });
    // $(".TaskCommentSec").mCustomScrollbar({
    //     theme: "dark-2"
    // });
});

$(".form-control").on("focus blur", function (e) {
    $(this)
        .parent()
        .toggleClass(
            "focused",
            e.type === "focus" || this.value.length > 0
        );
}).trigger("blur");
$(".formselect").select2();
$(".sd-type").select2({
    createTag: function (params) {
        var term = $.trim(params.term);
        if (term === "") {
            return null;
        }
        return {
            id: term,
            text: term,
            newTag: true // add additional parameters
        };
    }
});

(function ($) {
    $(window).on("load", function () {
        $("._act-TL .body").mCustomScrollbar({
            theme: "dark-2"
        });
        $("._activityEmp-timeline, .TaskAtachList, .TaskAddDoc").mCustomScrollbar({
            theme: "dark-2"
        });
    });
})(jQuery);


function deleteOnConfirmation(localRef, parentRef, url, module) {
    localRef.attr('disabled', true)
    localRef.text('Deleting')
    $.ajax({
        type: 'POST',
        url: url,
        data: {
            _token: $('[name="csrf_token"]').attr('content'),
            id: parentRef.attr('c-id')
        },
        success: function (response) {
            $('.completionCheckMark').show();
            $('.actionBtnsDiv').hide();
            if (module == 'correspondence') {
                parentRef.parent().parent().parent().parent().parent().parent().parent().remove();
                $('#deleteCorrespondenceMsg').text('Correspondence has been deleted');
            }
            localRef.removeAttr('disabled')
            localRef.text('Yes')
            setTimeout(() => {
                $('.closeConfirmationModal').click();
            }, 1500);
        }.bind(parentRef)
    })
}

function renderPage() {
    
    if (controller == "Customer") {
        $.getScript("/js/custom/customer.js?v=3.2");
    } else if (controller == "CustomerTypes") {
        $.getScript("/js/custom/customer-types.js?v=1.5.0.1");
    } else if (controller == "ProspectCustomers") {
        $.getScript("/js/custom/prospect-customers.js?v=1.5.0.1");
    } else if (controller == "Suppliers") {
        $.getScript("/js/custom/suppliers.js?v=1.5.0.1");
    } else if (controller == "AccessRights") {
        $.getScript("/js/custom/access_rights.js?v=1.5.0.1");
    } else if (controller == "Notifications" || controller == 'ViewAllNotifications') {
        $.getScript("/js/custom/notifications.js?v=1.5.2");
    } else if (controller == "RegisterController" || controller == "Employee") {
        $.getScript("/js/custom/employee.js?v=1.5.0.1");
    } else if (controller == "Categories") {
        $.getScript("/js/custom/categories.js?v=1.5.0.1");
    } else if (controller == "Units") {
        $.getScript("/js/custom/units.js?v=1.5.0.1");
    } else if (controller == "Ingredients") {
        $.getScript("/js/custom/ingredients.js?v=1.5.0.1");
    } else if (controller == "Items") {
        $.getScript("/js/custom/items.js?v=1.5.0.1");
    } else if (controller == "Recipes") {
        $.getScript("/js/custom/recipes.js?v=1.5.0.1");
    }
    else if (controller == "Variants") {
        $.getScript("/js/custom/variants.js?v=1.5.0.1");
    } else if (controller == "Shipping") {
        $.getScript("/js/custom/shipping_company.js?v=1.5.0.1");
    } else if (controller == "DeliveryPorts") {
        $.getScript("/js/custom/ports.js?v=1.5.0.1");
    } else if (controller == "Orders" || controller == "OrderManagement" || controller == "Dispatch" || controller == 'HomeController') {
        // $.getScript("/js/custom/ordersNew.js?v=2.6");
        // $.getScript("/js/custom/orders.js?v=2.6");
        $.getScript("/js/custom/order-dispatch.js?v=2.6");
    } else if (controller == "Performas") {
        $.getScript("/js/custom/performaNew.js?v=2.6");
        //$.getScript("https://code.jquery.com/jquery-3.2.1.min.js");
    }
    else if (controller == "Correspondence") {
        $.getScript('/js/custom/CustomerCorrespondence.js?v=1.6.6');
        $.getScript('/js/custom/orders.js?v=2.6');
    } else if (controller == "Products" && controllerAction != 'viewProductItems') {
        $.getScript("/js/custom/product.js?v=3.0");
        $.getScript("/js/jquery.steps.min.js?v=1.5.0.1");
        $.getScript("/js/form-wizard-data.js");
        $.getScript("/js/form-file-upload-data.js");
    } else if (controller == "PNLController") {
        $.getScript("/js/custom/pnl.js?v=2.6.2");
    } else if (controller == "PaymentController") {
        $.getScript("/js/custom/payment.js?v=1.5.0.1");
    } else if (controller == "Currency") {
        $.getScript("/js/custom/currency.js?v=1.5.0.1");
    } else if (controller == 'ForwarderController') {
        $.getScript('/js/custom/forwarder.js?v=1.5.0.1');
    } else if (controller == 'ForwarderController') {
        $.getScript('/js/custom/forwarder.js?v=1.5.0.1');
    } else if (controller == 'SettingsController') {
        $.getScript('/js/custom/settings.js?v=2.1');
    } else if (controller == 'DashboardController') {
        $.getScript('/js/dashboard.js?v=1.8');
    } else if (controller == 'SetPriceForCustomersController') {
        $.getScript('/js/SetPriceForCustomers.js?v=1.8');
    } else if (controller == 'StockManagmentController' && controllerAction == 'indexForOpeningStock') {
        $.getScript('/js/custom/manage_opening_stocks.js?v=1.8');
    } else if (controller == 'StockManagmentController' && controllerAction == 'indexForProductionStock') {
        $.getScript('/js/custom/manage_production_stock.js?v=1.8');
    } else if (controller == 'StockManagmentController' && controllerAction == 'transferStock') {
        $.getScript('/js/custom/stock_transfer.js?v=1.8');
    } else if (controller == 'BrandsController') {
        $.getScript('/js/custom/brands.js?v=1.8');
    } else if (controller == 'Products' && controllerAction == 'viewProductItems') {
        $.getScript('/js/custom/viewProductsItems.js?v=1.8');
    } else if (controller == 'BatchController') {
        $.getScript('/js/custom/batch-managment.js?v=1.8');
    } else if (controller == 'OrderSheetController') {
        $.getScript('/js/custom/order-sheet.js?v=1.8');
    } else if (controller == 'PurchaseController') {
        $.getScript('/js/custom/purchase_order.js?v=1.8');
    }else if (controller == "GeographicalSettingsController") {
        $.getScript("/js/custom/geographical_setting.js?v=1.5.0.1");
    }else if (controller == "MessageLayoutController") {
        $.getScript("/js/custom/message.js?v=1.5.0.1");
    } else if (controller == "StudentController" || controller == "IntakeFormFrontendController") {
        $.getScript("/js/custom/student.js?v=1.5.0.1");
    }else if (controller == "TeacherController") {
        $.getScript("/js/custom/teacher.js?v=1.5.0.1");
    } else if (controller == "IntakeController") {
        $.getScript("/js/custom/intake.js?v=1.5.0.1");
    }else if (controller == "OrganizationController") {
        $.getScript("/js/custom/organization.js?v=1.5.0.1");
    }else if (controller == "BlogsController") {
        if(location.pathname == '/blogs'){
            $.getScript("/js/custom/all-blogs-list.js?v=1.5.0.1");
        }else{
            $.getScript("/js/custom/blogs.js?v=1.5.0.1");
        }
    }else if (controller == "FaqsController") {
        $.getScript("/js/custom/faq.js?v=1.5.0.1");
    }else if (controller == "AttributeController") {
        $.getScript("/js/custom/attribute.js?v=1.5.0.1");
    }else if (controller == "CourseController") {
        $.getScript("/js/custom/course.js?v=1.5.0.1");
    }else if (controller == "CourseBatchController") {
        $.getScript("/js/custom/batch.js?v=1.5.0.1");
    }else if (controller == "CourseLessonController") {
        $.getScript("/js/custom/lesson.js?v=1.5.0.1");
    }else if (controller == "BatchSessionController") {
        $.getScript("/js/custom/session.js?v=1.5.0.1");
    }else if (controller == "EnrollmentController") {
        $.getScript("/js/custom/enrollment.js?v=1.5.0.1");
    }else if (controller == "CampaignController") {
        $.getScript("/js/custom/campaign.js?v=1.5.0.1");
    }else if (controller == "CouponController") {
        $.getScript("/js/custom/coupon.js?v=1.5.0.1");
    }else if (controller == "QuizzController") {
        $.getScript("/js/custom/quizz.js?v=1.5.0.1");
    }else if (controller == "BankAccController") {
        $.getScript("/js/custom/banks.js?v=1.5.0.1");
    }else if (controller == "StripController") {
        $.getScript("/js/custom/OnlinePayments.js?v=1.5.0.1");
    }

    //$.getScript('/js/custom/form-file-upload-data.js');
    

    $('#contentContainerDiv').removeClass('blur-div');
}

function actionListeners() {
    $(document).on("click", ".deleteSubNavItem", function () {
        if (!window.confirm("Are you sure you want to delete this item?")) return
        let itemId = $(this).attr('item-id')
        $(this).parent().remove();
        $.ajax({
            type: 'POST',
            url: '/Admin/DeleteSubNavItem',
            data: {
                _token: $('input[name="_token"]').val(),
                id: itemId
            },
            success: function () {
                location.reload()
            }
        })
    });

    $(document).on("click", ".savePriorityList", function () {
        let priorityList = [];
        let priority = 1;
        $(this).text('Saving..')
        $(this).parent().parent().find('li').not('.addNewSubMob').each(function () {
            priorityList.push({
                id: $(this).attr('item-id'),
                priority: priority++
            });
        });
        $.ajax({
            type: 'POST',
            url: '/Admin/UpdateSubModPriority',
            data: {
                _token: $('input[name="_token"]').val(),
                data: priorityList
            },
            success: function (response) {
                location.reload();
            }
        })
    });

    $(document).on("keydown", ".parentModEditor", function (e) {
        if (e.keyCode == 13) {
            $(this).attr('disabled', true);
            $.ajax({
                type: 'POST',
                url: '/Admin/UpdateParentMod',
                data: {
                    _token: $('input[name="_token"]').val(),
                    old_parent_mod: $(this).attr('module-name'),
                    parentMod: $(this).val()
                },
                success: function (response) {
                    location.reload();
                }
            })
        }
    });

    $(document).on("click", ".deleteParentMod", function () {
        let itemFnd = allControllersData.find(x => x.parent_module == $(this).attr('parent-module')).parent_module
        if (!window.confirm('This action will delete this item permanently'))
            return;

        $(this).text('Deleting');
        $.ajax({
            type: 'POST',
            url: '/Admin/DeleteParentMod',
            data: {
                _token: $('input[name="_token"]').val(),
                parent_module: itemFnd
            },
            success: function () {
                location.reload();
            }
        })
    });

    $(document).on("click", ".parentMod", function () {
        let itemFnd = allControllersData.find(x => x.parent_module == $(this).text())

        $(".openSubModModal").click();
        $('#exampleModalLabel').text('Parent Module Settings');
        $('#newSubModForm').hide();
        $('#newParentModForm').show();

        $('[name="parent_op"]').val('update');
        $('#newParentModForm').append(`<input name="parent_module_name_update" value="${itemFnd.parent_module}" hidden />`);
        $('[name="parent_module_name_update"]').val(itemFnd.parent_module);
        $('[name="parent_module_name"]').val(itemFnd.parent_module);
        $('[name="show_in_sidebar"]').val(itemFnd.show_in_sidebar);
        setTimeout(() => {
            $('[name="parent_module_name"]').focus();
        }, 500);

        $('#saveParentMod').show();
        $('#saveNewSubMod').hide();
    });

    $(document).on("click", "#saveNewSubMod", function () {
        let updateItemId = parentModRef.attr('item-id');
        let parentMod = parentModRef
            .parent()
            .parent()
            .parent()
            .find("span")
            .text();

        let currentPriority = 1;

        let allItemsWithoutAddLi = parentModRef
            .parent()
            .find("li")
            .not(".addNewSubMob");

        allItemsWithoutAddLi.each(function () {
            if (updateItemId && parentModRef.text() == $(this).text()) {
                currentPriority = $(this).index() + 1;
            }
            if (!updateItemId)
                currentPriority++;
        });

        if (updateItemId)
            parentMod = parentModRef.attr('parent-module-name')

        $(this).text("Saving");
        $(this).attr("disabled", true);

        $("#newSubModForm").ajaxSubmit({
            type: "POST",
            url: "/Admin/SaveSubMod",
            data: {
                priority: currentPriority,
                item_id: updateItemId,
                parent: parentMod
            },
            success: function (response) {
                if (response.code == 200) {
                    $(".close").click();
                }

                location.reload();

                $(this).text("Save");
                $(this).removeAttr("disabled");
            }.bind($(this))
        });
    });

    $(document).on("click", "#saveParentMod", function () {
        let updateItemId = null;
        let currentPriority = $('.parentMod').length + 1;

        $(this).text("Saving");
        $(this).attr("disabled", true);

        $("#newParentModForm").ajaxSubmit({
            type: "POST",
            url: "/Admin/SaveParentMod",
            data: {
                priority: currentPriority
            },
            success: function (response) {
                if (response.code == 200) {
                    $(".close").click();
                }

                location.reload();

                $(this).text("Save");
                $(this).removeAttr("disabled");
            }.bind($(this))
        });
    });

    $(document).on("click", ".addNewSubMob", function (e) {
        if (e.target.classList.contains("savePriorityList") || e.target.classList.contains("deleteParentMod"))
            return;
        parentModRef = $(this);
        $('#saveParentMod').hide();
        $('#saveNewSubMod').show();
        $(".openSubModModal").click();
        $('#newSubModForm').show();
        $('#newParentModForm').hide();
        $(".newSubModForm input").val("");
    });

    $(document).on("click", ".editSubNavItem", function (e) {
        parentModRef = $(this);
        $('#saveParentMod').hide();
        $('#saveNewSubMod').show();
        editSubNavItem = allControllersData.find(x => x.id == $(this).attr('item-id'));
        $(".openSubModModal").click();
        $('#newSubModForm').show();
        $('#newParentModForm').hide();
        $("[name='module_name']").val(editSubNavItem.sub_module ? editSubNavItem.sub_module : editSubNavItem.made_up_name);
        $("[name='route']").val(editSubNavItem.controller);
        $("[name='made_up_name']").val(editSubNavItem.made_up_name);
        $("[name='show_in_sub_menu']").val(editSubNavItem.show_in_sub_menu);

        setTimeout(() => {
            $("[name='module_name']").focus();
            $("[name='route']").focus();
            $("[name='made_up_name']").focus();
        }, 500);
    });

    $(document).on("click", ".addNewParentMod", function (e) {
        $(".openSubModModal").click();
        $('#exampleModalLabel').text('Parent Module Settings');
        $('#newSubModForm').hide();
        $('#newParentModForm').show();

        $('[name="parent_op"]').val('add');

        $('[name="parent_module_name_update"]').remove();

        $(".newParentModForm input").val("");
        $('#saveParentMod').show();
        $('#saveNewSubMod').hide();
    });

    $(document).on("click", ".saveParentPriorityList", function (e) {
        let priorityList = [];
        let priority = 1;
        $('.parentMod').each(function () {
            priorityList.push({
                module: $(this).attr('value'),
                priority: priority++
            });
        });
        $(this).text('Saving..')
        $.ajax({
            type: 'POST',
            url: '/Admin/UpdateParentModPriority',
            data: {
                _token: $('input[name="_token"]').val(),
                data: priorityList
            },
            success: function (response) {
                location.reload();
            }
        })
    });

    $('#menuClose, .overlay-blure').on('click', function () {
        $('#sidebarblue').removeClass('menuShow');
        $('#content-wrapper').removeClass('blur-div');
        $('body').removeClass('no-scroll')
    });

    $('#modalShow').on('click', function () {
        $('#sidebarblue').addClass('menuShow');
        $('#content-wrapper').addClass('blur-div');
        $('body').addClass('no-scroll')
    });
}

function navItemsScript() {
    const parentModules = [
        ...new Set(
            allControllersData
                .filter(x => x.show_in_sidebar == 1)
                .map(item => item.parent_module)
        )
    ];
    currentPageRight = false;
    let childModules = null;
    $("#parentModulesUl").empty();
    subNavItems.push({
        parent: "search",
        child: []
    });
    $("#parentModulesUl").append(
        `<li> <a data-toggle="modal" data-target="#SearchDiv" class="open_search_modal"><img src="/images/search-icon.svg" alt="" /> Search</a> </li>`
    );
    subNavItems.push({
        parent: "Create New",
        child: [
            // '<li><a class="modalShowTaskCentralized"><img src="/images/task-icon.svg" alt="" />Task</a> </li>',
            // '<li> <a href="/OrderManagement"><img src="/images/order-icon.svg" alt="" />Order</a> </li>',
            // '<li> <a href="/register"><img src="/images/emp-icon.svg" alt="" />Employee</a> </li>',
            // '<li> <a href="/Customer"><img src="/images/customer-icon.svg" alt="" />Customer</a> </li>',
            // '<li> <a href="/AddProduct"><img src="/images/product-icon.svg" alt="" />Product</a> </li>',
            // '<li> <a href="/Shipping"><img src="/images/shippers-icon.svg" alt="" />Shippers</a> </li>',
            // '<li> <a href="/Suppliers"><img src="/images/supplier-icon.svg" alt="" />Supplier</a> </li>',
            // '<li> <a><img src="/images/payment-icon.svg" alt="" />Payment</a> </li>',
            '<li> <a href="/client-create"><img src="/images/customer-icon.svg" alt="" />Client</a> </li>'
        ]
    });
    // $("#parentModulesUl").append(
    //     `<li> <a attr-name="Create New" class="openSubMenu"><img src="/images/add-pluse-icon.svg" alt="" /> Create New</a> </li>`
    // );
    $("#parentModulesUl").append(
        `<li> <a href="/dashboard"><img src="/images/dashboard-icon.svg" alt="" /> Dashboard</a> </li><hr>`
    );

    parentModules.forEach((element, index) => {
        var access_found = true;

        if (element == 'Profit and Loss') {
            if (userDesignation != 1) {
                access_found = false;
            }
        }
        if (!access_found)
            return;

        let childMods = {
            parent: "",
            child: []
        };
        childModules = allControllersData.filter(
            x => x.parent_module == element
        );
        if (childModules.length)
            childModules.sort(
                (a, b) => a.sub_module_priority - b.sub_module_priority
            );

        let anyChildRight = false;

        childModules.forEach(child => {
            if (rightsGiven.includes(child.controller) && child.show_in_sub_menu) {
                childMods.child.push(
                    `<li> <a href="/${child.controller
                    }"><img src="/storage/icons/${child.sub_menu_icon}" alt="" />${child.sub_module ? child.sub_module : child.made_up_name
                    }</a> </li>`
                );
                anyChildRight = true;
            }
        });

        //debugger
        if (!anyChildRight) return;

        if (currentSegment == "Orders") {
            currentSegment = "OrderManagement";
        }

        if (
            rightsGiven.includes(currentSegment) ||
            currentSegment == "home" ||
            currentSegment == "/"
        ) {
            //debugger
            currentPageRight = true;
        }

        // console.log({
        //     right: currentPageRight,
        //     page: currentSegment
        // })

        childMods.parent = element;
        subNavItems.push(childMods);
        if (element !== "Dashboard")
            $("#parentModulesUl").append(
                `<li> <a attr-name="${element}" class="openSubMenu"><img src="/storage/icons/${childModules[0].logo}" alt="" /> ${element}</a> </li>`
            );
    });

    if (currentPageRight) {
        renderPage();
    } else {
        $("#parentModulesUl").empty();
        $(".close").remove();
        $(".modal-title").text("403 Forbidden");
        $("#wrapper").addClass("blur-div");
        $(".modal").css("pointer-events", "none");
        $(".modal-header").css("justify-content", "center");
        $("#assignmendModalContent").html(
            `<div style="text-align: center">You are not authorized to view this page. Please click here to go to <a href="/home">home</a></div>`
        );
        $(".notAllowedError").click();
        return;
    }
}

function openSidebar(element = "#product-cl-sec") {
    $(element).addClass("active");
    $(".overlay").addClass("active");
    $(".collapse.in").toggleClass("in");
    $("a[aria-expanded=true]").attr("aria-expanded", "false");
    $("body").toggleClass("no-scroll");
    $("#contentContainerDiv").addClass("blur-div");
    $(".sticky-footer").addClass("blur-div");
    $(".overlay-for-sidebar").css("display", "block");
}

function closeSidebar() {
    $(".customer_form_div").removeClass("active");
    $(".poc_form_div").removeClass("active");
    $("#product-cl-sec").removeClass("active");
    $("#product-add").removeClass("active");
    $("#performaPreferences").removeClass("active");
    $(".overlay").removeClass("active");
    //$("body").toggleClass("no-scroll");
    $("#contentContainerDiv").removeClass("blur-div");
    $(".sticky-footer").removeClass("blur-div");
    $(".overlay-for-sidebar").css("display", "none");
    $("body").removeClass("no-scroll");
}

function openSubNav() {
    $("#_subNav-id").addClass("active");
    $("#content-wrapper").addClass("blur-div");
    $("body").addClass("no-scroll");
}

function closeSubNav() {
    $("#_subNav-id").removeClass("active");
    $("#content-wrapper").removeClass("blur-div");
    $("body").removeClass("no-scroll");
}

function fetchSiteSearchReasult(str) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: '/GetSiteSearchResult/' + str,
            success: function (response) {
                $('.SearchList').empty();
                $('#tblLoader_search').hide();
                var response = JSON.parse(response);
                var counter = 0;
                $.map(response.data, function (v, i) {
                    if (v.length > 0) {
                        $('.SearchList').append(`<ul id="${counter}"><h3>${i}</h3></ul>`);
                        v.map(function (x) {
                                $(`#${counter}`).append(`<li> <a href="/client-view/${x.id}"><img src="/images/access-right-icon.svg" alt="">  ${x.first_name?x.first_name:''} ${x.middle_name?x.middle_name:''} ${x.last_name?x.last_name:''} </a></li>`);
                        });
                    }
                    counter++;
                });
            }
        });
    })
}

function ajaxer(url, type, payload) {
    console.log('ajaxer')
    return new Promise((resolve, reject) => {
        $.ajax({
            type: type,
            url: url,
            data: payload,
            success: function (response) {
                resolve(response);
            }
        });
    });
}

function formatUnicorn(str) {
    var str = str;
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments) :
            arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
}

var messages = {
    "orders": {
        "created_by_heading": "<span class='blue-text'>Follow Up:</span> New Sales Order",
        "updated_by_heading": "<span class='blue-text'>Follow Up:</span> Sales Order Update",
        "completed_by_heading": "<span class='blue-text'>Follow Up:</span> Sales Order Complete",
        "processed_by_heading": "<span class='blue-text'>Follow Up:</span> Sales Order Dispatch",
        "created_by": "{created_by} has created a New Sales Order for {customer_name} Worth {currency} {total_amount} Order # <a href='/OrderManagement'>{id}</a>",
        "updated_by": "{updated_by} has updated Sales Order # <a href='/OrderManagement'>{id}</a> for {customer_name} worth {currency} {total_amount}",
        "completed_by": "{completed_by} has completed the Sales Order # <a href='/OrderManagement'>{id}</a> for {customer_name} worth {currency} {total_amount}",
        "processed_by": "{processed_by} has created a full dispatch for Sales Order # <a href='/OrderManagement'>{id}</a> for {customer_name} worth {currency} {total_amount}"
    },
    "items": {
        "created_by_heading": "<span class='blue-text'>Follow Up:</span> New Variant",
        "updated_by_heading": "<span class='blue-text'>Follow Up:</span> Update Variant",
        "created_by": "{created_by} has created a new Item <a href='/ProductItems/{product_sku}'>{name}</a> for {product_name}",
        "updated_by": "{updated_by} has updated Item <a href='/ProductItems/{product_sku}'>{name}</a> for {product_name}",
    },
    "products": {
        "created_by_heading": "<span class='blue-text'>Follow Up:</span> New Product",
        "updated_by_heading": "<span class='blue-text'>Follow Up:</span> Update Product",
        "created_by": "{created_at} has created a new Product<a href='/BrandProducts/{brand_id}'>{name}",
        "updated_by": "{updated_by} has Updated Product <a href='/BrandProducts/{brand_id}'>{name}",
    }
};

function fetchActivities(filteredArray, date, startDate, EndDate, searchQuery = null) {
    $('.all_activities').empty();
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: '/GetActivities',
            data: {
                'date': date,
                'start_date': startDate,
                'end_date': EndDate
            },
            success: function (response) {
                $('.SearchList').empty();
                $('#tblLoader').hide();
                var response = JSON.parse(response);
                //console.log(response);
                allActivities = response;

                if (selected_customer_id != 0) {
                    renderDataAfterFilters(selected_customer_id, filteredArray)
                } else {
                    if (filteredArray.includes("900")) {
                        $.map(response.orders, function (v) {
                            if (v.created_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.created_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="emp-name">${v.created_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> New Sales Order</h5>
                                        <p class="_description">${v.created_by} has created a New Sales Order for ${v.customer_name} Worth ${v.currency}  ${v.total_amount} Order # <a style="color:#040725;" href="/OrderManagement">${v.id}</a></p>
                                    </div>
                                </div>
                                </li>`);
                            }
                            if (v.updated_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.updated_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="update-emp-name">${v.updated_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> Sales Order Update</h5>
                                        <p class="_description">${v.updated_by} has updated Sales Order # <a style="color:#040725;" href="/OrderManagement">${v.id}</a> for ${v.customer_name} worth ${v.currency} ${v.total_amount}</p>
                                    </div>
                                </div>
                                </li>`);
                            }
                            if (v.completed_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.completed_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="processed-emp-name">${v.completed_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> Sales Order Complete</h5>
                                        <p class="_description">${v.completed_by} has completed the Sales Order # <a style="color:#040725;" href="/OrderManagement">${v.id}</a> for ${v.customer_name} worth ${v.currency} ${v.total_amount}</p>
                                    </div>
                                </div>
                                </li>`);
                            }
                            if (v.processed_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.processed_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="completed-emp-name">${v.processed_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> Sales Order Dispatch</h5>
                                        <p class="_description">${v.processed_by} has created a full dispatch for Sales Order # <a style="color:#040725;" href="/OrderManagement">${v.id}</a> for ${v.customer_name} worth ${v.currency} ${v.total_amount}</p>
                                    </div>
                                </div>
                                </li>`);
                            }

                        });
                    }

                    if (filteredArray.includes("906")) {
                        $.map(response.items, function (v) {
                            if (v.created_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.created_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="emp-name">${v.created_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> New Variant</h5>
                                        <p class="_description">${v.created_by} has created a new Item <a style="color:#040725;" href="/ProductItems/${v.product_sku}">${v.name}</a> for ${v.product_name}</p>
                                    </div>
                                </div>
                                </li>`);
                            }
                            if (v.updated_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.updated_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="update-emp-name">${v.updated_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> Update Variant</h5>
                                        <p class="_description">${v.updated_by} has updated Item <a style="color:#040725;" href="/ProductItems/${v.product_sku}">${v.name}</a> for ${v.product_name}</p>
                                    </div>
                                </div>
                                </li>`);
                            }
                        });
                    }

                    if (filteredArray.includes("901")) {
                        $.map(response.products, function (v) {
                            if (v.created_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.created_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="emp-name">${v.created_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> New Product</h5>
                                        <p class="_description">${v.created_at} has created a new Product <a style="color:#040725;" href="/BrandProducts/${v.brand_id}">${v.name}</a></p>
                                    </div>
                                </div>
                                </li>`);
                            }
                            if (v.updated_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.updated_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="update-emp-name">${v.updated_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> Product Update</h5>
                                        <p class="_description">${v.updated_by} has Updated Product <a style="color:#040725;" href="/BrandProducts/${v.brand_id}">${v.name}</a></p>
                                    </div>
                                </div>
                                </li>`);
                            }
                        });
                    }

                    if (filteredArray.includes("902")) {
                        $.map(response.customers, function (v) {
                            if (v.created_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.created_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="emp-name">${v.created_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> New Customer</h5>
                                        <p class="_description">${v.created_by} has created a new customer <a style="color:#040725;" href="/Correspondence/create/${v.id}">${v.company_name}</a> from ${v.country}</p>
                                    </div>
                                </div>
                                </li>`);
                            }
                            if (v.updated_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.updated_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="update-emp-name">${v.updated_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> Update Customer</h5>
                                        <p class="_description">${v.updated_by} has updated customer details <a style="color:#040725;" href="/Correspondence/create/${v.id}">${v.company_name}</a> from ${v.country}</p>
                                    </div>
                                </div>
                                </li>`);
                            }
                        });
                    }

                    if (filteredArray.includes("907")) {
                        $.map(response.pocs, function (v) {
                            if (v.created_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.created_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="emp-name">${v.created_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> New POC</h5>
                                        <p class="_description">${v.created_by} has added a new POC ${v.first_name} for <a style="color:#040725;" href="/Correspondence/create/${v.customer_id}">${v.customer_name}</a> from ${v.cust_country}</p>
                                    </div>
                                </div>
                                </li>`);
                            }
                            if (v.updated_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.updated_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="update-emp-name">${v.updated_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> Update POC</h5>
                                        <p class="_description">${v.updated_by} has updated POC details of ${v.first_name} for <a style="color:#040725;" href="/Correspondence/create/${v.customer_id}">${v.customer_name}</a> from ${v.cust_country}</p>
                                    </div>
                                </div>
                                </li>`);
                            }
                        });
                    }

                    if (filteredArray.includes("903")) {
                        $.map(response.suppliers, function (v) {
                            if (v.created_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.created_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="emp-name">${v.created_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> New Supplier</h5>
                                        <p class="_description">${v.created_by} has created a new supplier <a style="color:#040725;" href="/Suppliers">${v.company_name}</a></p>
                                    </div>
                                </div>
                                </li>`);
                            }
                            if (v.updated_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.updated_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="update-emp-name">${v.updated_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> Update Supplier</h5>
                                        <p class="_description">${v.updated_by} has updated supplier details <a style="color:#040725;" href="/Suppliers">${v.company_name}</a></p>
                                    </div>
                                </div>
                                </li>`);
                            }
                        });
                    }

                    if (filteredArray.includes("908")) {
                        $.map(response.forwarders, function (v) {
                            if (v.created_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.created_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="emp-name">${v.created_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> New Forwarder</h5>
                                        <p class="_description">${v.created_by} has created a new Forwarding Company <a style="color:#040725;" href="/forwarder">${v.company_name}</a></p>
                                    </div>
                                </div>
                                </li>`);
                            }
                            if (v.updated_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.updated_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="update-emp-name">${v.updated_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> Update Forwarder</h5>
                                        <p class="_description">${v.updated_by} has updated Forwarding <a style="color:#040725;" href="/forwarder">${v.company_name}</a></p>
                                    </div>
                                </div>
                                </li>`);
                            }
                        });
                    }

                    if (filteredArray.includes("904")) {
                        $.map(response.shippers, function (v) {
                            if (v.created_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.created_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="emp-name">${v.created_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> New Shipping Company</h5>
                                        <p class="_description">${v.created_by} has created a new Shipping Company <a style="color:#040725;" href="/Shipping">${v.company_name}</a></p>
                                    </div>
                                </div>
                                </li>`);
                            }
                            if (v.updated_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.updated_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="update-emp-name">${v.updated_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> Update Shipping Company</h5>
                                        <p class="_description">${v.updated_by} has updated Shipping Company <a style="color:#040725;" href="/Shipping">${v.company_name}</a></p>
                                    </div>
                                </div>
                                </li>`);
                            }
                        });
                    }

                    if (filteredArray.includes("905")) {
                        $.map(response.tasks, function (v) {
                            if (v.created_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.created_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="emp-name">${v.created_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> New Task</h5>
                                        <p class="_description">${v.created_by} has created a new Task</p>
                                    </div>
                                </div>
                                </li>`);
                            }
                            if (v.updated_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.updated_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="update-emp-name">${v.updated_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> Update Task</h5>
                                        <p class="_description">${v.updated_by} has updated Task</p>
                                    </div>
                                </div>
                                </li>`);
                            }

                            if (v.completed_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.completed_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="update-emp-name">${v.completed_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> Task Completed</h5>
                                        <p class="_description">${v.completed_by} has Completed a Task</p>
                                    </div>
                                </div>
                                </li>`);
                            }
                        });
                    }

                    if (filteredArray.includes("909")) {
                        $.map(response.employees, function (v) {
                            if (v.created_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.created_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="emp-name">${v.created_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> New Employee</h5>
                                        <p class="_description">${v.created_by} has added a new Employee <a style="color:#040725;" href="/register">${v.name}</a></p>
                                    </div>
                                </div>
                                </li>`);
                            }
                            if (v.updated_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.updated_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="update-emp-name">${v.updated_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> Update Employee</h5>
                                        <p class="_description">${v.updated_by} has updated employee <a style="color:#040725;" href="/register">${v.name}</a></p>
                                    </div>
                                </div>
                                </li>`);
                            }
                        });
                    }

                    if (filteredArray.includes("910")) {
                        $.map(response.payments, function (v) {
                            if (v.created_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.created_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="emp-name">${v.created_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> Payment Created</h5>
                                        <p class="_description">New Payment Created</p>
                                    </div>
                                </div>
                                </li>`);
                            }
                            if (v.updated_by) {
                                $('.all_activities').append(`<li>
                                <div class="dateFollowUP">${v.updated_at}</div>
                                <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                                <div class="timeline-info">
                                    <h4 class="update-emp-name">${v.updated_by}</h4>
                                    <div class="historyDiv">
                                        <h5><span class="blue-text">Follow Up:</span> Payment Updated</h5>
                                        <p class="_description"> Payment Updated</p>
                                    </div>
                                </div>
                                </li>`);
                            }
                        });
                    }
                }
                if (searchQuery) {
                    $('.dateFollowUP').mark(searchQuery);
                    $('.emp-name').mark(searchQuery);
                    $('.update-emp-name').mark(searchQuery);
                    $('._description').mark(searchQuery);
                    $('.processed-emp-name').mark(searchQuery);
                    $('.completed-emp-name').mark(searchQuery);
                }
            }
        });
    })
}

function renderDataAfterFilters(cust, filteraArr, searchQuery = null) {
    //900 = order
    //901 = product
    //902 = customer
    //903 = supplier
    //904 = shipper
    //905 = task
    //906 = Items
    //907 = POC
    //908 = Forwarder
    //909 = Employee
    //910 = Payment
    $('.all_activities').empty();
    if (cust == 0) {
        //fetchActivities(filteraArr);
        if (filteraArr.includes("900")) {
            $.map(allActivities.orders, function (v) {
                if (v.created_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> New Sales Order</h5>
                            <p class="_description">${v.created_by} has created a New Sales Order for ${v.customer_name} Worth ${v.currency}  ${v.total_amount} Order # <a style="color:#040725;" href="/OrderManagement">${v.id}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Sales Order Update</h5>
                            <p class="_description">${v.updated_by} has updated Sales Order # <a style="color:#040725;" href="/OrderManagement">${v.id}</a> for ${v.customer_name} worth ${v.currency} ${v.total_amount}</p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.completed_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.completed_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="processed-emp-name">${v.completed_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Sales Order Complete</h5>
                            <p class="_description">${v.completed_by} has completed the Sales Order # <a style="color:#040725;" href="/OrderManagement">${v.id}</a> for ${v.customer_name} worth ${v.currency} ${v.total_amount}</p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.processed_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.processed_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="completed-emp-name">${v.processed_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Sales Order Dispatch</h5>
                            <p class="_description">${v.processed_by} has created a full dispatch for Sales Order # <astyle="color:#040725;"  href="/OrderManagement">${v.id}</a> for ${v.customer_name} worth ${v.currency} ${v.total_amount}</p>
                        </div>
                    </div>
                    </li>`);
                }

            });
        }

        if (filteraArr.includes("906")) {
            $.map(allActivities.items, function (v) {
                if (v.created_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> New Variant</h5>
                            <p class="_description">${v.created_by} has created a new Item <a style="color:#040725;" href="/ProductItems/${v.product_sku}">${v.name}</a> for ${v.product_name}</p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Update Variant</h5>
                            <p class="_description">${v.updated_by} has updated Item <a style="color:#040725;" href="/ProductItems/${v.product_sku}">${v.name}</a> for ${v.product_name}</p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }

        if (filteraArr.includes("901")) {
            $.map(allActivities.products, function (v) {
                if (v.created_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> New Product</h5>
                            <p class="_description">${v.created_at} has created a new Product <a style="color:#040725;" href="/BrandProducts/${v.brand_id}">${v.name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Product Update</h5>
                            <p class="_description">${v.updated_by} has Updated Product <a style="color:#040725;" href="/BrandProducts/${v.brand_id}">${v.name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }

        if (filteraArr.includes("902")) {
            $.map(allActivities.customers, function (v) {
                if (v.created_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> New Customer</h5>
                            <p class="_description">${v.created_by} has created a new customer <a style="color:#040725;" href="/Correspondence/create/${v.id}">${v.company_name}</a> from ${v.country}</p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Update Customer</h5>
                            <p class="_description">${v.updated_by} has updated customer details <a style="color:#040725;" href="/Correspondence/create/${v.id}">${v.company_name}</a> from ${v.country}</p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }

        if (filteraArr.includes("907")) {
            $.map(allActivities.pocs, function (v) {
                if (v.created_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> New POC</h5>
                            <p class="_description">${v.created_by} has added a new POC ${v.first_name} for <astyle="color:#040725;"  href="/Correspondence/create/${v.customer_id}">${v.customer_name}</a> from ${v.cust_country}</p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Update POC</h5>
                            <p class="_description">${v.updated_by} has updated POC details of ${v.first_name} for <astyle="color:#040725;"  href="/Correspondence/create/${v.customer_id}">${v.customer_name}</a> from ${v.cust_country}</p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }

        if (filteraArr.includes("903")) {
            $.map(allActivities.suppliers, function (v) {
                if (v.created_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> New Supplier</h5>
                            <p class="_description">${v.created_by} has created a new supplier <a style="color:#040725;" href="/Suppliers">${v.company_name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Update Supplier</h5>
                            <p class="_description">${v.updated_by} has updated supplier details <a style="color:#040725;" href="/Suppliers">${v.company_name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }

        if (filteraArr.includes("908")) {
            $.map(allActivities.forwarders, function (v) {
                if (v.created_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> New Forwarder</h5>
                            <p class="_description">${v.created_by} has created a new Forwarding Company <a style="color:#040725;" href="/forwarder">${v.company_name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Update Forwarder</h5>
                            <p class="_description">${v.updated_by} has updated Forwarding <a style="color:#040725;" href="/forwarder">${v.company_name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }

        if (filteraArr.includes("904")) {
            $.map(allActivities.shippers, function (v) {
                if (v.created_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> New Shipping Company</h5>
                            <p class="_description">${v.created_by} has created a new Shipping Company <a style="color:#040725;" href="/Shipping">${v.company_name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Update Shipping Company</h5>
                            <p class="_description">${v.updated_by} has updated Shipping Company <a style="color:#040725;" href="/Shipping">${v.company_name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }

        if (filteraArr.includes("905")) {
            $.map(allActivities.tasks, function (v) {
                if (v.created_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> New Task</h5>
                            <p class="_description">${v.created_by} has created a new Task</p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Update Task</h5>
                            <p class="_description">${v.updated_by} has updated Task</p>
                        </div>
                    </div>
                    </li>`);
                }

                if (v.completed_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.completed_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.completed_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Task Completed</h5>
                            <p class="_description">${v.completed_by} has Completed a Task</p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }

        if (filteraArr.includes("909")) {
            $.map(allActivities.employees, function (v) {
                if (v.created_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> New Employee</h5>
                            <p class="_description">${v.created_by} has added a new Employee <a style="color:#040725;" href="/register">${v.name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Update Employee</h5>
                            <p class="_description">${v.updated_by} has updated employee <a style="color:#040725;" href="/register">${v.name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }

        if (filteraArr.includes("910")) {
            $.map(allActivities.payments, function (v) {
                if (v.created_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Payment Created</h5>
                            <p class="_description">New Payment Created</p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Payment Updated</h5>
                            <p class="_description"> Payment Updated</p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }
    } else {
        //orders
        if (filteraArr.includes("900")) {
            $.map(allActivities.orders, function (v) {
                if (v.created_by && v.created_by_id == cust) {
                    $('.all_activities').append(`<li>
                        <div class="dateFollowUP">${v.created_at}</div>
                        <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                        <div class="timeline-info">
                            <h4 class="emp-name">${v.created_by}</h4>
                            <div class="historyDiv">
                                <h5><span class="blue-text">Follow Up:</span> New Sales Order</h5>
                                <p class="_description">${v.created_by} has created a New Sales Order for ${v.customer_name} Worth ${v.currency}  ${v.total_amount} Order # <a style="color:#040725;" href="/OrderManagement">${v.id}</a></p>
                            </div>
                        </div>
                        </li>`);

                }
                if (v.updated_by && v.updated_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Sales Order Update</h5>
                            <p class="_description">${v.updated_by} has updated Sales Order # <a style="color:#040725;" href="/OrderManagement">${v.id}</a> for ${v.customer_name} worth ${v.currency} ${v.total_amount}</p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.completed_by && v.completed_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.completed_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="processed-emp-name">${v.completed_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Sales Order Complete</h5>
                            <p class="_description">${v.completed_by} has completed the Sales Order # <a style="color:#040725;" href="/OrderManagement">${v.id}</a> for ${v.customer_name} worth ${v.currency} ${v.total_amount}</p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.processed_by && v.processed_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.processed_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="completed-emp-name">${v.processed_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Sales Order Dispatch</h5>
                            <p class="_description">${v.processed_by} has created a full dispatch for Sales Order # <astyle="color:#040725;"  href="/OrderManagement">${v.id}</a> for ${v.customer_name} worth ${v.currency} ${v.total_amount}</p>
                        </div>
                    </div>
                    </li>`);
                }

            });
        }

        //Item
        if (filteraArr.includes("906")) {
            $.map(allActivities.items, function (v) {
                if (v.created_by && v.created_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> New Variant</h5>
                            <p class="_description">${v.created_by} has created a new Item <a style="color:#040725;" href="/ProductItems/${v.product_sku}">${v.name}</a> for ${v.product_name}</p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by && v.updated_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Update Variant</h5>
                            <p class="_description">${v.updated_by} has updated Item <a style="color:#040725;" href="/ProductItems/${v.product_sku}">${v.name}</a> for ${v.product_name}</p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }

        //products
        if (filteraArr.includes("901")) {
            $.map(allActivities.products, function (v) {
                if (v.created_by && v.created_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> New Product</h5>
                            <p class="_description">${v.created_at} has created a new Product <a style="color:#040725;" href="/BrandProducts/${v.brand_id}">${v.name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by && v.updated_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Product Update</h5>
                            <p class="_description">${v.updated_by} has Updated Product <a style="color:#040725;" href="/BrandProducts/${v.brand_id}">${v.name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }

        //Customer
        if (filteraArr.includes("902")) {
            $.map(allActivities.customers, function (v) {
                if (v.created_by && v.created_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> New Customer</h5>
                            <p class="_description">${v.created_by} has created a new customer <a style="color:#040725;" href="/Correspondence/create/${v.id}">${v.company_name}</a> from ${v.country}</p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by && v.updated_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Update Customer</h5>
                            <p class="_description">${v.updated_by} has updated customer details <a style="color:#040725;" href="/Correspondence/create/${v.id}">${v.company_name}</a> from ${v.country}</p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }

        //POC
        if (filteraArr.includes("907")) {
            $.map(allActivities.pocs, function (v) {
                if (v.created_by && v.created_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> New POC</h5>
                            <p class="_description">${v.created_by} has added a new POC ${v.first_name} for <astyle="color:#040725;"  href="/Correspondence/create/${v.customer_id}">${v.customer_name}</a> from ${v.cust_country}</p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by && v.updated_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Update POC</h5>
                            <p class="_description">${v.updated_by} has updated POC details of ${v.first_name} for <astyle="color:#040725;"  href="/Correspondence/create/${v.customer_id}">${v.customer_name}</a> from ${v.cust_country}</p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }

        //Supplier
        if (filteraArr.includes("903")) {
            $.map(allActivities.suppliers, function (v) {
                if (v.created_by && v.created_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> New Supplier</h5>
                            <p class="_description">${v.created_by} has created a new supplier <a style="color:#040725;" href="/Suppliers">${v.company_name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by && v.updated_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Update Supplier</h5>
                            <p class="_description">${v.updated_by} has updated supplier details <a style="color:#040725;" href="/Suppliers">${v.company_name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }

        //Forwarder
        if (filteraArr.includes("908")) {
            $.map(allActivities.forwarders, function (v) {
                if (v.created_by && v.created_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> New Forwarder</h5>
                            <p class="_description">${v.created_by} has created a new Forwarding Company <a style="color:#040725;" href="/forwarder">${v.company_name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by && v.updated_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Update Forwarder</h5>
                            <p class="_description">${v.updated_by} has updated Forwarding <a style="color:#040725;" href="/forwarder">${v.company_name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }

        //Shipper
        if (filteraArr.includes("904")) {
            $.map(allActivities.shippers, function (v) {
                if (v.created_by && v.created_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> New Shipping Company</h5>
                            <p class="_description">${v.created_by} has created a new Shipping Company <a style="color:#040725;" href="/Shipping">${v.company_name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by && v.updated_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Update Shipping Company</h5>
                            <p class="_description">${v.updated_by} has updated Shipping Company <a style="color:#040725;" href="/Shipping">${v.company_name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }

        //Tasks
        if (filteraArr.includes("905")) {
            $.map(allActivities.tasks, function (v) {
                if (v.created_by && v.created_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> New Task</h5>
                            <p class="_description">${v.created_by} has created a new Task</p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by && v.updated_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Update Task</h5>
                            <p class="_description">${v.updated_by} has updated Task </p>
                        </div>
                    </div>
                    </li>`);
                }

                if (v.completed_by && v.completed_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.completed_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.completed_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Task Completed</h5>
                            <p class="_description">${v.completed_by} has completed a Task</p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }

        //Employee
        if (filteraArr.includes("909")) {
            $.map(allActivities.employees, function (v) {
                if (v.created_by && v.created_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> New Employee</h5>
                            <p class="_description">${v.created_by} has added a new Employee <a style="color:#040725;" href="/register">${v.name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by && v.updated_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Update Employee</h5>
                            <p class="_description">${v.updated_by} has updated employee <a style="color:#040725;" href="/register">${v.name}</a></p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }

        //Payment
        if (filteraArr.includes("910")) {
            $.map(allActivities.payments, function (v) {
                if (v.created_by && v.created_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.created_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="emp-name">${v.created_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Payment Created</h5>
                            <p class="_description">New Payment Created</p>
                        </div>
                    </div>
                    </li>`);
                }
                if (v.updated_by && v.updated_by_id == cust) {
                    $('.all_activities').append(`<li>
                    <div class="dateFollowUP">${v.updated_at}</div>
                    <div class="timeline-icon"><img src="/images/avatar.svg" alt=""></div>
                    <div class="timeline-info">
                        <h4 class="update-emp-name">${v.updated_by}</h4>
                        <div class="historyDiv">
                            <h5><span class="blue-text">Follow Up:</span> Payment Updated</h5>
                            <p class="_description"> Payment Updated</p>
                        </div>
                    </div>
                    </li>`);
                }
            });
        }
    }
    if (searchQuery) {
        $('.dateFollowUP').mark(searchQuery);
        $('.emp-name').mark(searchQuery);
        $('.update-emp-name').mark(searchQuery);
        $('._description').mark(searchQuery);
        $('.processed-emp-name').mark(searchQuery);
        $('.completed-emp-name').mark(searchQuery);
    }
}

function renderTasksInTasksPage() {
    if (!allTasksCreated.length) {
        $('.tasksListTable tbody').html('<tr><td colspan="8" style="text-align: center; line-height: 3; font-weight: bold; font-size: 14px">No tasks added yet </td> </tr>');
        return;
    }
    $('.tasksListTable tbody').empty();
    allTasksCreated.forEach(x => {
        let statusClass = x.task_status == "in-progress" ? "TS-InProgress" : (x.task_status == "not-started" ? "TS-NotStarted" : (x.task_status == "in-review" ? "TS-InReview" : (x.task_status == "completed" ? "TS-Completed" : "TS-Cancelled")));
        $('.tasksListTable tbody').append(`<tr>
        <td> ${moment(x.created_at, "YYYY-MM-DD HH:mm:ss").format('YYYY-MM-DD')} </td>
        <td> ${x.title} </td>
        <td> ${x.created_by} </td>
        <td> ${x.due_date} </td>
        <td>${moment(x.due_time, 'hh:mm').format('h:mm A')}</td>
        <td>
            <span
                class="fa fa-flag Task${(x.task_priority ? titleCase(x.task_priority) : 'Low')}"></span>${(x.task_priority ? titleCase(x.task_priority) : 'Low')}
        </td>
        <td>
        <span class="${(x.completed_at ? 'Tdone' : (x.due_date < moment().format('YYYY-MM-DD') ? '_TOverdue' : '_TOverdue ' + statusClass))}">${(x.completed_at ? "Done" : (x.due_date < moment().format('YYYY-MM-DD') ? "Overdue" : titleCase(x.task_status.replace("-", " "))))}</span>
        </td>
        <td>
            <button task-id="${x.id}" class="btn btn-default btn-line mb-0 viewTaskDetails"
                data-toggle="modal" data-target="#taskCommentsModal">Comment</button>
            <button task-id="${x.id}"
                class="btn btn-default mb-0 deleteTaskFromModal">Delete</button>
        </td>
    </tr>`)
    })
    $('.tasksListTable').DataTable();
}

function fetchTaskFromMaster() {
    $('.tasksListTable tbody').html('<tr><td colspan="8" style="text-align: center; line-height: 3; font-weight: bold; font-size: 14px">LOADING</td> </tr>');
    ajaxer("/GetAllTasks", "POST", {
        _token: $('meta[name="csrf_token"]').attr('content')
    }).then(x => {
        var response = JSON.parse(x);
        allTasksCreated = response['tasks'];
        files_url = response['files_url'];
        renderTasksInTasksPage();
        $('.viewTaskDetails').removeAttr('disabled')
    })


    setInterval(() => {
        if (!$('#taskCommentsModal').hasClass('show'))
            return;
        ajaxer('/GetCommentsForTask/' + activeTaskForComments.id, 'GET', null).then(x => {
            let comments = JSON.parse(x).comments.task_comments;
            let typingStatus = JSON.parse(x).typing_status;
            if (typingStatus) {
                $('#typingStatusSpan').text(typingStatus.employee_name + ' is typing');
                $('#typingStatusSpan').show();
            } else {
                $('#typingStatusSpan').hide();
            }

            if (comments) {
                comments = JSON.parse(comments);
                if ($('.taskCommentsActivityWindow li').length >= comments.length)
                    return;

                for (let i = $('.taskCommentsActivityWindow li').length; i <= comments.length; i++) {
                    $('.taskCommentsActivityWindow').append(`
            <li class="${loggedInUser.user_id == comments[i].employee_id ? 'RS-Comments' : 'LS-Comments'}">
            <div class="timeline-info">
                <div class="historyDiv">
                    <h4>${comments[i].name}</h4>
                    <p>${comments[i].comment}</p>
                    <small>${moment(comments[i].at, 'YYYY-MM-DD HH:mm:ss').format('hh:mm A')}</small>
                </div>
            </div>
            <div class="timeline-icon"><img src="${comments[i].picture.replace(".", "")}"
                    alt=""></div>
        </li>
            `);
                }
            }
        })
    }, 3000);
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}
function notification(type, message) {
    var bgColor = (type == 'error') ? 'red' : 'green';
    var el = $('#notifDiv');
    el.fadeIn();
    el.css('background', bgColor);
    el.text(message);
    setTimeout(() => {
        el.fadeOut();
    }, 3000);
}

// $('#MCategory, #SCategory').selectize({
//     create: false,
   
//     });
