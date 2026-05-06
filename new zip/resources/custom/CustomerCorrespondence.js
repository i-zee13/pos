let allCorrespondences = null;
let allMultiplePocs = null;
let attachments = {
    "voice": [],
    "docs": [],
    "images": []
};
let activeAttachmentMod = "voice";
let taskCompletion = null;
let timeOptions = null;
let employeesList = null;
let searchedCorrespondences = [];
let customerId = location.href.split('/')[5].replace('#', '');
let activeLogType = 'call';
let filterActive = false;
var allItems = [];
var allProductsForModal = [];
var assignSamples = [];
var current_action = '';
var current_open_modal = '';
var interested_in_array = [];
var multiple_voice_notes_array = [];
var multiple_documents_array = [];
var multiple_images_array = [];
var allCustOrdersArray = [];
var empPicBaseUrl = '';
var total_order_pages = 0;
var total_order_records = 0;
var all_orders = [];
var current_cust_active_page = 1;
$(document).ready(function() {

            $('footer').hide();

            $('#content-wrapper').addClass('pb-0')

            $('#contentContainerDiv').parent().removeClass('container');
            $('#contentContainerDiv').parent().addClass('container-fluid');
            $('#contentContainerDiv').parent().addClass('pl-0');

            $('#paymentTable').DataTable();

            fetchAllCorrespondences();


            //Code Start For Modal Sampling
            $('#modalClose').on('click', function() {
                $('#modalWindow').removeClass('modalShow');
            });
            $('.sample_modal').on('click', function() {
                $('#modalWindow').addClass('modalShow');
                if ($(this).attr('type') == 'sample') {
                    current_action = 'customer_sampling';
                    $('.sample_heading').text('Sample');
                    $('.sampleTableBody').empty();
                    $('.transaction_id').parent().parent().show();
                    $('.courier').parent().parent().show();
                    assignSamples = [];
                } else {
                    current_action = 'price_quotation';
                    $('.sample_heading').text('Quotation');
                    $('.sampleTableBody').empty();
                    $('.transaction_id').parent().parent().hide();
                    $('.courier').parent().parent().hide();
                    assignSamples = [];
                }

            });

            $('#modalExpand-btn-sample').click(function() {
                $("#modalWindow").toggleClass("modalExpand");
                $('i').toggleClass('fa-expand fa-compress');
            });
            //Code End for Modal Sampling



            $('.nav-pills .nav-item').click(function() {
                $('.SearchActivity').val("");
                $(".filtersDivComplete").show();
                $(".filterActiviesDD").show();
                if ($(this).find('a').text() !== "Activity")
                    $(".filterActiviesDD").hide();

                if ($(this).find('a').text() == "Order" || $(this).find('a').text() == "Payment") {
                    $(".filtersDivComplete").hide();
                } else {
                    renderCorrespondences(allCorrespondences, taskCompletion);
                }



            })

            $('.datepickerCorrespondence').datepicker({
                format: 'dd/mm/yyyy',
                startDate: '+0d',
                autoclose: true
            }).datepicker("setDate", new Date());

            $(".assignedDate").datepicker({
                format: "yyyy-mm-dd"
            }).on('changeDate', function(e) {
                $(this).datepicker('hide');
            }).datepicker("setDate", new Date());

            $(document).on('click', '.closeWindow', function() {
                $('#taskWindow').removeClass('modalShow');
                $('#noteWindow').removeClass('modalShow');
                $('#logWindow').removeClass('modalShow');
                $('.AttachFilesDiv').empty()
                attachments = {
                    "voice": [],
                    "docs": [],
                    "images": []
                }
            });

            $('.createLog').on('click', function() {
                $('#logWindow').addClass('modalShow');
                activeLogType = $(this).attr('type');
                $('#logType').text(($(this).attr('type') == 'email' ? "an " + $(this).attr('type') : 'a ' + $(this).attr('type')))
                $('#momLog').attr('placeholder', 'Describe the ' + $(this).attr('type') + '*')
                $('#taskWindow').removeClass('modalShow');
                $('#noteWindow').removeClass('modalShow');
                $('.AttachFilesDiv').empty()
                current_open_modal = 'log';
                attachments = {
                    "voice": [],
                    "docs": [],
                    "images": []
                }
            });

            $('#createTask').on('click', function() {
                activeLogType = '';
                $('#taskWindow').addClass('modalShow');
                $('#noteWindow').removeClass('modalShow');
                $('#logWindow').removeClass('modalShow');
                $('#assigned_to').val(null).trigger('change');
                $('.AttachFilesDiv').empty()
                current_open_modal = 'task';
                attachments = {
                    "voice": [],
                    "docs": [],
                    "images": []
                }
            });

            $('#createNote').on('click', function() {
                activeLogType = '';
                current_open_modal = '';
                $('#taskWindow').removeClass('modalShow');
                $('#noteWindow').addClass('modalShow');
                $('#logWindow').removeClass('modalShow');
                $('.AttachFilesDiv').empty()
                attachments = {
                    "voice": [],
                    "docs": [],
                    "images": []
                }
            });

            $('.modalExpand-btn').click(function() {
                if (activeLogType == 'call' || activeLogType == 'email' || activeLogType == 'meeting' || current_open_modal == 'task') {
                    $(this).parent().parent().parent().parent().toggleClass("modalExpand");
                } else {
                    $(this).parent().parent().parent().toggleClass("modalExpand");
                }

                $(this).find('i').toggleClass('fa-expand fa-compress');
            });

            $(document).on('click', '.paymentHistory', function() {
                $('#loaderDiv').show();
                $('#paymentHistoryTable').hide();
                $('#paymentHistoryTable tbody').empty();
                $(this).attr('disabled', true)
                $.ajax({
                    type: 'POST',
                    url: '/GetPaymentHistory',
                    data: {
                        _token: $('[name="csrf_token"]').attr('content'),
                        order_id: $(this).attr('oid')
                    },
                    success: function(response) {
                        $('#paymentHistoryTable tbody').empty();
                        $('#loaderDiv').hide();
                        $('#paymentHistoryTable').show();
                        response.forEach(element => {
                            $('#paymentHistoryTable tbody').append(`
                        <tr>
                            <td>${element.type == 1 ? 'Cheque' : 'Cash'}</td>
                            <td>${addCommas(element.amount)}</td>
                            <td>${moment(element.created_at).format('Y-M-D')}</td>
                        </tr>
                    `);
                        });
                        $(this).removeAttr('disabled')
                    }.bind($(this))
                })
            });

            $(document).on('click', '.add_competition', function() {
                if ($('.company_name_competition_modal').val() == '' || $('.country_competition_modal').val() == '') {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the required information(*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    return;
                }
                $('.close').click();
            })

            $('#saveLog').click(function() {
                //debugger;
                var poc_data = [];
                if (!$('#momLog').val() || $('#select_poc_correspondence').val() == null || $('#select_poc_correspondence').val() == '') {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the required information');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    return
                }

                $("#select_poc_correspondence option:selected").each(function() {
                    poc_data.push({
                        'poc': $(this).val(),
                        'independence': $(this).attr("independence")
                    });
                });

                $(this).attr('disabled', true)
                $(this).text('Saving')
                $('#saveLogForm').ajaxSubmit({
                    type: 'POST',
                    url: '/Correspondence',
                    data: {
                        _token: $('[name="csrf_token"]').attr('content'),
                        mom: $('#momLog').val(),
                        due_date: $('#logDp').val(),
                        due_time: $('#logTime').val(),
                        customer_id: customerId,
                        type: activeLogType,
                        poc: poc_data,
                        competition_company: $('.company_name_competition_modal').val(),
                        competition_country: $('.country_competition_modal').val(),
                        sub_category: $('.select_interested_category').val(),
                        product: $('.select_interested_products').val(),
                        attachments: attachments
                    },
                    success: function(response) {
                        fetchAllCorrespondences();
                        $('#momLog').val("");
                        $('#select_poc_correspondence').val('');
                        $(this).removeAttr('disabled')
                        $(this).text('Log Activity')
                            //$("input[name='voice_note']").val(null)
                        $('.company_name_competition_modal').val('')
                        $('.country_competition_modal').val('')
                        $('.select_interested_category').val(0).trigger('change');
                        $('.select_interested_products').val(0).trigger('change');
                    }.bind($(this))
                })
            });

            $('#saveNote').click(function() {
                if (!$('#momNote').val()) {
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
                $.ajax({
                    type: 'POST',
                    url: '/Correspondence',
                    data: {
                        _token: $('[name="csrf_token"]').attr('content'),
                        mom: $('#momNote').val(),
                        customer_id: customerId,
                        type: 'note'
                    },
                    success: function(response) {
                        fetchAllCorrespondences();
                        $('#momNote').val("")
                        $(this).removeAttr('disabled')
                        $(this).text('Save Note')
                    }.bind($(this))
                })
            });

            $('#userFilter').change(function() {
                let query = $('#userFilter').find(":selected").attr('attr-name').toLowerCase();
                if (query == "all") {
                    if (filterActive) {
                        searchedCorrespondences = [];
                        $('input[name="filterCb[]"]:checked').each(function() {
                            let query = $(this).attr('item').toLowerCase();
                            searchedCorrespondences.push(...allCorrespondences.filter(x => (x.type && x.type.toLowerCase().includes(query))));
                        });
                    } else {
                        searchedCorrespondences = allCorrespondences
                    }
                } else {
                    if (filterActive) {
                        searchedCorrespondences = searchedCorrespondences.filter(x => (x.assigned_to && x.assigned_to.toLowerCase().includes(query)) || x.created_by.toLowerCase().includes(query));
                    } else {
                        searchedCorrespondences = [];
                        searchedCorrespondences.push(...allCorrespondences.filter(x => (x.assigned_to && x.assigned_to.toLowerCase().includes(query)) || x.created_by.toLowerCase().includes(query)));
                    }
                }
                renderCorrespondences(searchedCorrespondences);
            });

            $(document).on('click', '.filtersDiv [type="checkbox"]', function() {
                searchedCorrespondences = [];
                if (!$('input[name="filterCb[]"]:checked').length || $(this).attr('item') == "all") {
                    filterActive = false;
                    if ($(this).attr('item') == "all") {
                        $('input[name="filterCb[]"]:checked').prop('checked', false)
                        if ($(this).prop('checked'))
                            $(this).prop('checked', false)
                        else
                            $(this).prop('checked', true)
                    }
                    searchedCorrespondences = allCorrespondences;
                } else {
                    filterActive = true;
                    $('[item="all"]').prop('checked', false);
                    $('input[name="filterCb[]"]:checked').each(function() {
                        let query = $(this).attr('item').toLowerCase();
                        searchedCorrespondences.push(...allCorrespondences.filter(x => (x.type && x.type.toLowerCase().includes(query))));
                    });
                }
                if ($('#userFilter').find(":selected").attr('attr-name') !== "all") {
                    let newQ = $('#userFilter').find(":selected").attr('attr-name').toLowerCase();
                    searchedCorrespondences = searchedCorrespondences.filter(x => (x.assigned_to && x.assigned_to.toLowerCase().includes(newQ)) || x.created_by.toLowerCase().includes(newQ));
                }
                renderCorrespondences(searchedCorrespondences);
                $('#dropdownMenuButton').text('FIlter Activity (' + $('input[name="filterCb[]"]:checked').length + '/5)');
            });

            $(document).on('input', '.SearchActivity', function() {
                if (!$(this).val()) {
                    renderCorrespondences(allCorrespondences);
                    return;
                }
                searchedCorrespondences = [];
                let query = $(this).val().toLowerCase();
                searchedCorrespondences.push(...allCorrespondences.filter(x => (x.title && x.title.toLowerCase().includes(query) || x.mom.toLowerCase().includes(query) || (x.assigned_to && x.assigned_to.toLowerCase().includes(query)) || x.month_name.toLowerCase().includes(query))));
                renderCorrespondences(searchedCorrespondences, taskCompletion, query);
                if (!searchedCorrespondences.length) {
                    $('.dynamicDataDiv, .dynamicTasksDiv, .dynamicNotesDiv').html(`
    <div class="loader" style="text-align: center; display: block; line-height: 20">
        No results found
    </div>`)
                }
            });

            var task_complete_ref = '';
            $(document).on('click', '.taskCompleted', function(e) {
                task_complete_ref = $(this);
                $(this).find('.label__checkbox').attr('disabled', true);
                $('.save_task_completion').attr('id', $(this).attr('c-id'));

            });
            $(document).on('click', '.save_task_completion', function() {
                if ($('#task_comment').val() == '') {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please Enter Comment!');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    return;
                }
                $(document.body).css({
                    'cursor': 'wait'
                });
                var thisRef = $(this);
                thisRef.attr('disabled', 'disabled');
                thisRef.text('Please Wait...');
                $('.close_comment_modal').attr('disabled', 'disabled');
                $.ajax({
                    type: 'POST',
                    url: '/TaskCompleted',
                    data: {
                        _token: $('[name="csrf_token"]').attr('content'),
                        id: $(this).attr('id'),
                        comment: $('#task_comment').val()
                    },
                    success: function(response) {
                        thisRef.removeAttr('disabled');
                        thisRef.text('Save');
                        $('.close_comment_modal').removeAttr('disabled');
                        $('.close_comment_modal').click();
                        $(document.body).css({
                            'cursor': 'default'
                        });
                        task_complete_ref.removeClass('taskCompleted')
                        task_complete_ref.find('.label__checkbox').attr('disabled', true)
                        task_complete_ref.find('.label__checkbox').attr('checked', true)
                    }.bind(task_complete_ref)
                });
            })

            $(document).on('click', '.pinCorresp', function() {
                $(this).attr('disabled', true)
                $.ajax({
                    type: 'POST',
                    url: '/UpdatePinStatus',
                    data: {
                        _token: $('[name="csrf_token"]').attr('content'),
                        id: $(this).attr('c-id'),
                        pin: 1
                    },
                    success: function(response) {
                        fetchAllCorrespondences();
                    }.bind($(this))
                })
            });

            $(document).on('click', '.unpinCorresp', function() {
                $(this).attr('disabled', true)
                $.ajax({
                    type: 'POST',
                    url: '/UpdatePinStatus',
                    data: {
                        _token: $('[name="csrf_token"]').attr('content'),
                        id: $(this).attr('c-id'),
                        pin: 0
                    },
                    success: function(response) {
                        fetchAllCorrespondences();
                    }.bind($(this))
                })
            });

            let parentDeleteRef = null;

            $(document).on('click', '.deleteCorrespondence', function() {
                $('#openConfirmationModal').click();
                $('.actionBtnsDiv').show();
                $('.completionCheckMark').hide();
                $('#deleteCorrespondenceMsg').text('Are you sure you want to delete this correspondence?');
                parentDeleteRef = $(this);
            });

            $(document).on('click', '.yesDeleteIt', function() {
                allCorrespondences = allCorrespondences.filter(x => x.id != parentDeleteRef.attr('c-id'));
                deleteOnConfirmation($(this), parentDeleteRef, '/Correspondence/Delete', 'correspondence');
            });

            $('#saveTask').click(function() {
                if (!$('#taskTitle').val() || !$('#momTask').val() || $('#assigned_to').val() == '' || $('#assigned_to').val() == null) {
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
                $('#saveTaskForm').ajaxSubmit({
                    type: 'POST',
                    url: '/Correspondence',
                    data: {
                        _token: $('[name="csrf_token"]').attr('content'),
                        due_date: $('#dueDateDp').val(),
                        due_time: $('#dueTimeDD').val(),
                        title: $('#taskTitle').val(),
                        assigned_to: $('#assigned_to').val(),
                        reminder_date: $('#reminderDateDp').val(),
                        reminder_time: $('#reminderTimeDD').val(),
                        mom: $('#momTask').val(),
                        customer_id: customerId,
                        type: 'task',
                        priority: $('#taskPriorityCorrespondence').val(),
                        attachments: attachments
                    },
                    success: function(response) {
                        fetchAllCorrespondences();
                        fetchTaskFromMaster();
                        $('#momTask').val("")
                        $('#taskTitle').val("")
                        $(this).removeAttr('disabled')
                        $("input[name='voice_note[]']").val(null)
                        $("input[name='multiple_documents[]']").val(null)
                        $("input[name='multiple_images[]']").val(null)
                        $(this).text('Save Task')
                        $('#assigned_to').val(null).trigger('change');
                    }.bind($(this))
                })
            });

            $(document).on('click', '.saveChangesButton', function() {
                $(this).attr('disabled', true)
                $(this).text('Saving')
                $.ajax({
                    type: 'POST',
                    url: '/SaveCorrespondenceChanges',
                    data: {
                        _token: $('[name="csrf_token"]').attr('content'),
                        mom: $(this).parent().parent().parent().find('textarea').val(),
                        title: $(this).attr('c-type') == 'task' ? $(this).parent().parent().parent().find('.taskTitleInput').val() : '',
                        id: $(this).attr('c-id'),
                        change_type: 'text'
                    },
                    success: function(response) {
                        fetchAllCorrespondences();
                    }.bind($(this))
                })
            });

            $(document).on('change', '._Activity .datepickerCorrespondence', function() {
                $(document.body).css({
                    'cursor': 'wait'
                });
                let payload = {
                    _token: $('[name="csrf_token"]').attr('content'),
                    date_type: $(this).attr('date-type'),
                    date: $(this).val(),
                    id: $(this).attr('c-id'),
                    change_type: 'date'
                }
                $.ajax({
                    type: 'POST',
                    url: '/SaveCorrespondenceChanges',
                    data: payload,
                    success: function(response) {
                        $(document.body).css({
                            'cursor': 'default'
                        });
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Date has been changed');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 1500);
                        return;
                    }.bind($(this))
                })
            })

            $(document).on('change', '._Activity .timeDD', function() {
                $(document.body).css({
                    'cursor': 'wait'
                });
                let payload = {
                    _token: $('[name="csrf_token"]').attr('content'),
                    time_type: $(this).attr('time-type'),
                    time: $(this).val(),
                    id: $(this).attr('c-id'),
                    change_type: 'time'
                }
                $.ajax({
                    type: 'POST',
                    url: '/SaveCorrespondenceChanges',
                    data: payload,
                    success: function(response) {
                        $(document.body).css({
                            'cursor': 'default'
                        });
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Time has been changed');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 1500);
                        return;
                    }.bind($(this))
                })
            })

            $(document).on('click', '.cancelChangesButton', function() {
                $(this).parent().parent().hide();
                $(this).parent().parent().parent().find('.DivTextarea').hide();
                $(this).parent().parent().parent().find('.momPara').show();
            })

            $(document).on('click', '.taskTitleInput', function() {
                $(this).parent().parent().parent().parent().parent().find('.saveChangesDiv').show();
            })

            $(document).on('click', '.momPara', function() {
                $(this).parent().find('.DivTextarea').show();
                $(this).hide();
                $(this).parent().parent().parent().find('.saveChangesDiv').show();
            })

            $(document).on('change', '#taskPriorityCorrespondence', function() {
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
            })

            $(document).on('change', '.select_product_sample', function() {
                var product_val = $(this).val();
                var items = [];
                $('.select_item_sample').empty();
                $('.select_item_sample').append('<option value="0" disabled selected>Select Item*</option>');
                items = allItems.filter(function(x) {
                    return x.product_id == product_val;
                });
                items.forEach(element => {
                    $('.select_item_sample').append(`<option value="${element['id']}" name="${element['standrad_unit_price']}" selected>${element['name']}</option>`);
                });
            });

            $(document).on('click', '.add_sample_to_table', function() {
                var id_found = false;

                if ($('.select_product_sample').val() == 0 || $('.select_product_sample').val() == null || $('.select_item_sample').val() == 0 || $('.select_item_sample').val() == null) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please Select all fields!');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    return;
                }

                assignSamples.find(x => {
                    if (x.product_id == $('.select_product_sample').val() && x.item_id == $('.select_item_sample').val() && x.customer_id == customerId) {
                        id_found = true;
                    }
                });

                if (id_found) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Record already Exist!');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    return;
                }
                assignSamples.push({
                    'product_id': $('.select_product_sample').val(),
                    'product_name': $('.select_product_sample').find('option:selected').text(),
                    'item_id': $('.select_item_sample').val(),
                    'item_name': $('.select_item_sample').find('option:selected').text(),
                    'item_price': $('.select_item_sample').find('option:selected').attr('name'),
                    'customer_id': customerId
                });

                $('.sampleTableBody').empty();

                if (current_action == 'customer_sampling') {
                    assignSamples.forEach(element => {
                        $('.sampleTableBody').append(`<div class="row alert alert-color" role="alert">
                    <div class="col-md-6"><strong>Product:</strong> ${element['product_name']} </div>
                    <div class="col-md-6"><strong>Product Item:</strong> ${element['item_name']} </div>
        
                    <button type="button" id="${element['product_id']+'/'+element['item_id']+'/'+element['customer_id']}" class="close alert_close remove_sample" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`);
                    });
                } else {
                    assignSamples.forEach(element => {
                        $('.sampleTableBody').append(`<div class="row alert alert-color" role="alert">
                    <div class="col-md-5" style="padding-top:3px"><strong>Product:</strong> ${element['product_name']} </div>
                    <div class="col-md-4" style="padding-top:3px"><strong>Product Item:</strong> ${element['item_name']} </div>
                    <div class="col-auto">Price: <input type="number" value="${element['item_price']}" class="quote_unit_price"
                            style="border:solid 1px #e5e5e5; font-size: 13px; width:70px"></div>
                    <button type="button" id="${element['product_id']+'/'+element['item_id']+'/'+element['customer_id']}" class="close alert_close remove_sample" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`);
                    });

                }

                // console.log(assignSamples);
            });

            $(document).on('input', '.quote_unit_price', function() {
                var ids = $(this).parent().parent().find('.remove_sample').attr('id').split('/');
                var value = $(this).val();

                assignSamples.find(x => {
                    if (x.product_id == ids[0] && x.item_id == ids[1] && x.customer_id == ids[2]) {
                        x.item_price = value;
                    }
                });
                //console.log(assignSamples);
            });

            $(document).on('click', '.remove_sample', function() {
                var thisRef = $(this).attr('id').split('/');
                assignSamples = assignSamples.filter(x => !(x.item_id == thisRef[1] && x.customer_id == thisRef[2]));
                $(this).parent().parent().remove();
            });

            $(document).on('click', '.save_sampling', function() {
                if (!assignSamples.length) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please Add Samples First!');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    return;
                }

                // if($('.transaction_id').val() == '' || $('.courier').val() == ''){
                //     $('#notifDiv').fadeIn();
                //     $('#notifDiv').css('background', 'red');
                //     $('#notifDiv').text('Please fill all fields with(*)!');
                //     setTimeout(() => {
                //         $('#notifDiv').fadeOut();
                //     }, 3000);
                //     return;
                // }
                var thisRef = $(this);
                thisRef.text('Processing...');
                thisRef.attr('disabled', 'disabled');
                $.ajax({
                    type: 'POST',
                    url: '/save_customer_sampling',
                    data: {
                        _token: $('input[name="_token"]').val(),
                        assign_samples: assignSamples,
                        delivery_date: $('.expected_delivery_date').val(),
                        transaction_id: $('.transaction_id').val(),
                        courier: $('.courier').val(),
                        remarks: $('.sampleRemarks').val(),
                        action: current_action
                    },
                    success: function(response) {
                        var response = JSON.parse(response);
                        thisRef.text('Save');
                        thisRef.removeAttr('disabled');
                        if (response == 'success') {
                            $('#notifDiv').fadeIn();
                            $('#notifDiv').css('background', 'green');
                            $('#notifDiv').text('Added Successfully!');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);
                            $('.transaction_id').val('');
                            $('.courier').val('');
                            $('.sampleRemarks').val('');
                            assignSamples = [];
                            $('.sampleTableBody').empty();
                            $('.select_product_sample').val(0).trigger('change');
                            $('.select_customer_sample').val(0).trigger('change');
                            $('.select_item_sample').empty();
                            $('.select_item_sample').append('<option value="0" disabled selected>Select Item*</option>');
                            //fetchAllCorrespondences();
                            $('#modalClose').click();
                        } else {
                            $('#notifDiv').fadeIn();
                            $('#notifDiv').css('background', 'red');
                            $('#notifDiv').text('Failed to add samples at the moment!');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);
                        }
                    }
                });

            });

            $(document).on('click', '.add_interested_products', function() {
                $('.close').click();
                // interested_in_array = [];
                // interested_in_array.push({
                //     'category_id': $('.select_interested_category').val() ? $('.select_interested_category').val() : null,
                //     'products': $('.select_interested_products').val() ? $('.select_interested_products').val() : null 
                // });
            });


            $(document).on('click', '.multi_attachments', function() {

                if (current_open_modal == 'task') {
                    if ($(this).attr('type') == 'voice') {
                        $('.upload_voice_notes').click();
                    } else if ($(this).attr('type') == 'doc') {
                        $('.upload_documents').click();
                    } else {
                        $('.upload_images').click();
                    }
                } else {
                    if ($(this).attr('type') == 'voice') {
                        $('.upload_voice_notes_log').click();
                    } else if ($(this).attr('type') == 'doc') {
                        $('.upload_documents_log').click();
                    } else {
                        $('.upload_images_log').click();
                    }
                }

            })


            $(document).on('change', '.upload_voice_notes', function(e) {
                activeAttachmentMod = 'voice';
                Main(activeAttachmentMod)
            });

            $(document).on('change', '.upload_documents', function(e) {
                activeAttachmentMod = 'docs';
                Main(activeAttachmentMod)
            });

            $(document).on('change', '.upload_images', function(e) {
                activeAttachmentMod = 'images';
                Main(activeAttachmentMod)
            });

            $(document).on('change', '.upload_voice_notes_log', function() {
                activeAttachmentMod = 'voice';
                Main(activeAttachmentMod)
            });

            $(document).on('change', '.upload_documents_log', function() {
                activeAttachmentMod = 'docs';
                Main(activeAttachmentMod)
            });

            $(document).on('change', '.upload_images_log', function() {
                activeAttachmentMod = 'images';
                Main(activeAttachmentMod)
            });


            $(document).on('click', '.remove_file', function() {
                var file_name = $(this).attr('id');
                var file_mod = $(this).attr('mod');
                if (file_mod == 'voice') {
                    attachments['voice'] = attachments['voice'].filter(x => x['converted_name'] != file_name);
                } else if (file_mod == 'docs') {
                    attachments['docs'] = attachments['docs'].filter(x => x['converted_name'] != file_name);
                } else {
                    attachments['images'] = attachments['images'].filter(x => x['converted_name'] != file_name);
                }
                displayMultipleDocs();
            });


            $(document).on('click', '.orderCard_page_link', function() {
                        //return;
                        var not_found = false;
                        current_cust_active_page = parseFloat($(this).attr('name'));
                        if (!not_found) {
                            $('.orders_card_div').empty();
                            all_orders[current_cust_active_page].map(function(element) {
                                        $('.orders_card_div').append(` <div class="_Activity">
                    <div class="act_date">${moment(element['created_at']).format('MMMM YYYY') }</div>
                    <div class="Activity-card OrderCard">
                        <div class="row">
                            <div class="col-auto pr-0">
                                <h2><img src="${element['status'] != 'performa' ? '/images/order-card-icon.svg' : '/images/performa-card-icon.svg'}" alt="">
                                    ${element['status'] != 'performa' ? 'Order' : 'Performa'}</h2>
                            </div>
                            <div class="col top_right-act pl-0"> 
                                <div class="topActins float-right">
                                    <div class="btn-group _more-action">
                                        <button class="btn btn-sm dropdown-toggle" type="button" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false"> More Actions </button>
                                        <div class="dropdown-menu dropdown-menu-right" style="min-width:auto !important">
                                            ${element['status'] == 'performa' ? `<a id="${ element['id'] }" class="dropdown-item viewInvoice" data-toggle="modal" data-target="#performaInvoiceModal">View Invoice</a>` : `<a id="${ element['id'] }" class="dropdown-item viewOrderSheet" data-toggle="modal" data-target=".orderSheetModal">Order Sheet</a>
                                            <a href="/OrderDetails/${element['id']}" class="dropdown-item">Order Detail</a>`}
                                        </div>
                                    </div>
                                </div> 
                                <div class="float-right ml-10 mr-20"><strong class="font13 float-left">Status: </strong>
                                    <span class="TS-Circle TS-Completed mr-5"></span> <strong>${element['current_status']}</strong>
                                </div> 
                                <div class="top-Date pr-10">${ moment(element['created_at']).format('MMMM DD, YYYY') } at ${element['created_time']}</div>
                            </div>
                        </div>
                        <div class="row pt-10">
                            <div class="col">
                                <div class="col-12 p-0 text-gray">Created by</div>
                                <div class="col-auto p-0 l-height"><img class="_User-img" src="${element['emp_picture'] ? empPicBaseUrl+element['emp_picture'] : '/images/avatar.svg'}" alt="">
                                    <strong>${element['created_by']}</strong></div>
                            </div>
                            <div class="col">
                                <div class="col-12 p-0 text-gray">Order Type:</div>
                                <div class="col-auto l-height p-0"><strong>${element['order_type']}</strong></div>
                            </div>
                            <div class="col">
                                <div class="col-12 p-0 text-gray"> E-Invoice:</div>
                                <div class="col-auto l-height p-0"><strong>${element['eform_num']}</strong></div>
                            </div>
                            <div class="col-auto">
                                <div class="col-12 p-0 text-gray"> Order Amount:</div>
                                <div class="col-auto l-height p-0 orderVal">${element['currency_symbol']}. ${addCommas(element['total_amount'])}</div>
                            </div>
                        </div>
                        <div class="row m-0"> 
                            <div class="assigned-to AssTask pl-0">
                                <div class="col-12 p-0 text-gray">Assigned to Supplier:</div>
                                <div class="col-12 pl-0 float-left">
                                    <div class="form-s2 date-List EMP__List">
                                        <select class="form-control formselect" multiple="multiple" disabled>
                                            <option selected>${element['supplier'] ? element['supplier'] : ''}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div> 
                        <div class="row task-detail">
                            <div class="col-md-12 p-0"> <a class="taskDetailL" data-toggle="collapse" href="#collapseExample${element['id']}"
                                    role="button" aria-expanded="false" aria-controls="collapseExample${element['id']}"><i
                                        class="fa fa-angle-down"></i> View
                                    Detail</a>
                                <div class="collapse" id="collapseExample${element['id']}">
                                    <div class="col-md-12 p-0 overflowYV m-0 mt-20">
                                        <table class="table table-hover dt-responsive nowrap m-0" style="width:100%">
                                            <thead>
                                                <tr>
                                                    <th>Product Name</th>
                                                    <th>Item Name</th>
                                                    <th>QTY.</th>
                                                    <th>Unit Price</th>
                                                    <th>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody class="order_detail_${element['id']}">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> `);
                $(`.order_detail_${element['id']}`).empty();
                element['content'].forEach(items => {
                    $(`.order_detail_${element['id']}`).append(`<tr>
                        <td>${items['product_name']}</td>
                        <td>${items['item_name']}</td>
                        <td>${items['qty']}</td>
                        <td>${element['currency_symbol']+addCommas(items['unit_price'])}</td>
                        <td>${element['currency_symbol']+addCommas(items['amount'])}</td>
                    </tr>`);
                }) 
               
            });
            $(".formselect").select2();
        }
    })

});

function displayMultipleDocs() {
    $('.AttachFilesDiv').empty();
    attachments['voice'].forEach(element => {
        $('.AttachFilesDiv').append(`<div class="alert" role="alert">
            <span class="AtFName">${element['name']}</span>
            <button type="button" class="close remove_file" mod="voice" id="${element['converted_name']}" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>`);
    })

    attachments['docs'].forEach(element => {
        $('.AttachFilesDiv').append(`<div class="alert" role="alert">
            <span class="AtFName">${element['name']}</span>
            <button type="button" class="close remove_file" mod="docs" id="${element['converted_name']}" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>`);
    })

    attachments['images'].forEach(element => {
        $('.AttachFilesDiv').append(`<div class="alert" role="alert">
            <span class="AtFName">${element['name']}</span>
            <button type="button" class="close remove_file" mod="images" id="${element['converted_name']}" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>`);
    })
    
}

function fetchAllCorrespondences() {
    $('.closeWindow').click();
    $('.dynamicDataDiv').html(`
    <div class="loader" style="text-align: center; display: block; line-height: 20">
        LOADING..
    </div>`)
    allItems = [];
    allProductsForModal = [];
    $(`.select_product_sample`).empty();
    $('.select_product_sample').append(`<option value="0" selected disabled>Select Product*</option>`);
    $('.select_competition_category').empty()
    $('.select_competition_product').empty()
    $('.select_interested_category').empty()
    $('.select_interested_products').empty()
    $.ajax({
        type: 'GET',
        url: '/GetCorrespondences/' + customerId,
        success: function (response) {
            $('.select_competition_category').append(`<option selected value="0" disabled>Select Service</option>`)
            // $('.select_interested_category').append(`<option selected value="0" disabled>Select Service</option>`)
            $('.select_competition_product').append(`<option selected value="0" disabled>Select Product</option>`)

            response.secondary_services.forEach(element => {
                $('.select_competition_category').append(`<option value="${element['id']}">${element['service_name']}</option>`)
                $('.select_interested_category').append(`<option value="${element['id']}">${element['service_name']}</option>`)
            });

            allProductsForModal = response.products;
            allItems = response.items;
            allProductsForModal.forEach(element => {
                $('.select_product_sample').append(`<option value="${element['id']}">${element['name']}</option>`);
                $('.select_competition_product').append(`<option value="${element['id']}">${element['name']}</option>`);
                $('.select_interested_products').append(`<option value="${element['id']}">${element['name']}</option>`);
            });
            allCorrespondences = response.correspondences;
            allMultiplePocs = response.multiple_pocs;
            taskCompletion = response.completed_tasks;
            timeOptions = response.time_options;
            employeesList = response.employees;
            allCustOrdersArray = response.orders
            empPicBaseUrl = response.base_url;
            renderCorrespondences(allCorrespondences, taskCompletion, null, allMultiplePocs, response.base_url);
            renderCustomerOrders();
        }
    })
}

function renderCorrespondences(correspondences, completed_tasks = null, searchedQ = null, allMultiplePocs = null, url = null) {
    //console.log(completed_tasks);

    $('.loader').remove();
    $('.dynamicDataDiv, .dynamicTasksDiv, .dynamicNotesDiv').empty();
    var count = 0;
    correspondences.filter(x => x.pinned).forEach((element, idx) => {
        var pocs = [];
        if (allMultiplePocs) {
            pocs = allMultiplePocs.filter(function (x) {
                return x.correspondence_id == element.id;
            });
        }

        let taskReminderTimeOptions = ``;
        timeOptions.forEach(timeElem => {
            taskReminderTimeOptions += `<option value='${timeElem}' ${ element.due_time && moment(element.reminder_time, 'hh:mm:ss').format('h:mm A') == timeElem ? 'selected' : '' }>${timeElem}</option>`
        });
        let dueTimeOptions = ``;
        timeOptions.forEach(timeElem => {
            dueTimeOptions += `<option value='${timeElem}' ${ element.due_time && moment(element.due_time, 'hh:mm:ss').format('h:mm A') == timeElem ? 'selected' : '' }>${timeElem}</option>`
        });
        if (element.type == "task") {
            var files = (element.files ? JSON.parse(element.files) : null);
            var files_count = files ? parseFloat(files['multiple_documents'].length) + parseFloat(files['voice_note'].length) + files['multiple_images'].length : 0;
            $('.dynamicDataDiv, .dynamicTasksDiv').append(`
                <div class="_Activity">
                    <div class="act_date">${ element.month_name } ${ moment(element.created_at).format('Y') }
                    </div>
                    <div class="Activity-card">
                        <div class="_pinmark unpinCorresp" c-id="${element.id}"><img src="/images/pin-mark-icon.svg" alt="" /></div>
                        <div class="row">
                            <div class="col-auto">
                                <h2><img src="/images/task-icon-b.svg" alt=""> Task</h2>
                            </div>
                            <div class="col top_right-act">
                                <div class="topActins float-none">
                                    <div class="_more-action">
                                        <div class="dropdown float-right">
                                            <button class="btn btn-primary deleteCorrespondence mr-0" type="button" c-id="${ element.id }"><i
                                            class="fa fa-trash"></i></button>
                                        </div>
                                        <div class="float-right ml-10 mr-20"><strong class="font13 float-left">Status: </strong>
                                            <span class="TS-Circle ${ (!element.task_status || element.task_status == 'not-started' ? 'TS-NotStarted' : (element.task_status == 'in-review' ? 'TS-InReview' : (element.task_status == 'in-progress' ? 'TS-InProgress' : (element.task_status == 'completed' ? 'TS-Completed' : 'TS-Cancelled')))) } mr-5"></span> ${ (!element.task_status || element.task_status == 'not-started' ? 'Not Started' : (element.task_status == 'in-review' ? 'In Review' : (element.task_status == 'in-progress' ? 'In Progress' : (element.task_status == 'completed' ? 'Completed' : 'Cancelled')))) }</div>
                                    </div>
                                </div>
                                <div class="top-Date">${moment(element.created_at, 'Y-M-D').format('MMMM D, Y')} at ${ moment(element.created_at, 'Y-M-D hh:mm:ss').format('hh:mm:ss a') }</div>
                            </div>
                        </div>
                        
                        <div class="col-12 pl-0 pr-0 PT-15 PB-15">
                            <div class="row">
                                 
                                
                            <div class="col TaskTitle">
                                <input type="text" value="${ element.title }" class="taskTitleInput form-control" placeholder="Task Title">
                            </div>
                        </div>
                        <div style="display:none" class="DivTextarea">
                            <textarea class="TaskText Tasktextarea" rows="7">${ element.mom }</textarea>
                        </div>
                        <p class="momPara">${ element.mom }</p>
                    </div>
                    <div class="row task-assign-date">
                        <div class="assigned-to w-auto">
                            <div class="col-12 p-0 text-gray mb-5">Created by
                            </div>
                            <div class="col-auto pl-0 l-height"><img class="_User-img" src="${element.user_picture ? url+element.user_picture: '/images/avatar.svg'}" alt="">
                                <strong class="createdByLabel">${ element.created_by }</strong></div>
                        </div>
                        <div class="assigned-to set-width">
                            <div class="col-12 p-0 text-gray mb-5">Due date:</div>
                            <div class="col-auto l-height p-0">
                                <img class="calendarIcon" src="/images/calendar-icon002.svg" alt="">
                                <input class="assignedDate datepickerCorrespondence" c-type="${element.type}" c-id="${element.id}" date-type="due_date" type="text" value="${moment(element.due_date, 'Y-M-D').format('D/M/Y')}" style="font-size: 13px">
                            </div>
                        </div>
                        <div class="assigned-to set-width">
                            <div class="col-12 p-0 text-gray mb-5">Time:</div>
                            <div class="col-auto l-height p-0">
                                <img class="calendarIcon float-left" src="/images/time-icon.svg" alt="">
                                <div class="form-s2 date-List H-arrow">
                                    <select time-type="due_time" c-id="${element.id}" class="timeDD form-control formselect" style="width: 100px!important">
                                        ${dueTimeOptions}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="assigned-to" style="width: 80px; padding-left: 0; margin-left: -10px; z-index:999">
                            <div class="col-12 p-0 text-gray">Priority:</div>
                            <div class="col-12 p-0">
                              <div class="flag-iconP"><span class="fa fa-flag ${(!element.task_priority ? '' : (element.task_priority == 'critical' ? 'TaskCritical' : (element.task_priority == 'high' ? 'TaskHigh' : (element.task_priority == 'medium' ? 'TaskMedium' : 'TaskLow'))))}"></span> </div>
                              <div class="float-left TaskStAction PriorityFlag">
                                <select class="custom-select SP_flag pr-0 pl-5" disabled style="background-color: white">
                                  <option selected>${(element.task_priority ? titleCase(element.task_priority) : '')}</option>
                                </select>
                              </div>
                            </div>
                        </div>
                        <div class="assigned-to AssTask">
                            <div class="col-12 p-0 text-gray">Assigned to:</div>
                            <div class="col-12 pl-0 float-left">
                                <div class="form-s2 date-List EMP__List">
                                    <select class="form-control customSdType assigned_to_up-${idx}" name="assigned_to" disabled 
                                        multiple="multiple" style="width: 100px!">
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row task-detail" style="display:block !important">
                        <div class="col-md-12 p-0"> 
                            <div class="row m-0">
                            <div class="col-12 TaskBD">
                              <div class="row">
                                <div class="col-auto TotalAttach">
                                  <img class="_T-img-title" src="images/attach-icon-b.svg" alt="">Attachments <span
                                    class="_attachV"> ${files_count}</span>
                                </div>
                                <div class="col-auto  TotalAttach">
                                  <img class="_T-img-title" src="images/comment-icon-b.svg" alt="">Comments <span
                                    class="_attachV"> ${element.task_comments ? JSON.parse(element.task_comments).length : 0}</span>
                                </div>
                                <div class="col">
                                  <a class="taskDetailL-B viewTaskDetails" task-id="${element.id}" data-toggle="modal" data-target="#taskCommentsModal">View
                                    Details</a>
                                </div>
                              </div>
                            </div>
  
                          </div>
                        </div>
                    </div>
                    <div style="display: none" class="row saveChangesDiv">
                        <div class="col-12 EditSaveTask">
                            <a href="#" class="btn-primary mr-2 saveChangesButton" c-id="${element.id}" c-type="${element.type}">Save</a>
                            <a href="#" class="btn-primary btn-outline cancelChangesButton">Cancel</a>
                        </div>
                    </div>
                </div>`);
        } else if (element.type == "note") {
            $('.dynamicDataDiv, .dynamicNotesDiv').append(`
        <div class="_Activity">
            <div class="act_date">${ element.month_name } ${ moment(element.created_at).format('Y') }
            </div>
            <div class="Activity-card">
                <div class="_pinmark unpinCorresp" c-id="${element.id}"><img src="/images/pin-mark-icon.svg" alt=""/></div>
                <div class="row">
                    <div class="col-auto">
                        <h2><img src="/images/note-icon-b.svg" alt=""> Note</h2>
                    </div>
                    <div class="col top_right-act">
                        <div class="topActins float-none">
                            <div class="_more-action">
                                <div class="dropdown float-right">
                                    <button class="btn btn-primary deleteCorrespondence mr-0" type="button"
                                        c-id="${ element.id }"><i
                                        class="fa fa-trash"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="top-Date mr-10">${moment(element.created_at, 'Y-M-D').format('MMMM D, Y')} at ${ moment(element.created_at, 'Y-M-D hh:mm:ss').format('hh:mm:ss a') }</div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 PT-15 PB-15">
                    <div style="display:none" class="DivTextarea">
                        <textarea class="TaskText Tasktextarea" rows="7">${ element.mom }</textarea>
                    </div>
                        <p class="momPara"> ${ element.mom } </p>
                    </div>
                </div>
                <div class="row Activity-bottom">
                    <div class="col-auto"><img class="_User-img" src="${element.user_picture ? url+element.user_picture: '/images/avatar.svg'}" alt=""> </div>
                    <div class="col-auto p-0 l-height"><strong class="createdByLabel">${ element.created_by }</strong></div>
                    <div class="col-auto l-height text-gray">left a note</div>
                </div>
                <div style="display: none" class="row saveChangesDiv"> 
                    <div class="col-12 EditSaveTask">
                        <a href="#" class="btn-primary mr-2 saveChangesButton" c-id="${element.id}" c-type="${element.type}">Save</a>
                        <a href="#" class="btn-primary btn-outline cancelChangesButton">Cancel</a>
                    </div>
                </div>
            </div>
        </div>`);
        } else {
            $('.dynamicDataDiv').append(`
        <div class="_Activity">
            <div class="act_date">${ element.month_name } ${ moment(element.created_at).format('Y') }
            </div>
            <div class="Activity-card">
                <div class="_pinmark unpinCorresp" c-id="${element.id}"><img src="/images/pin-mark-icon.svg" alt=""/></div>
                <div class="row">
                    <div class="col-auto">
                        <h2><img src="/images/${element.type == 'call' ? 'call-icon-b.svg' : (element.type == 'meeting' ? 'meeting-icon-b.svg' : 'email-icon-b.svg')}" alt=""> Log</h2>
                    </div>
                    <div class="col top_right-act">
                        <div class="topActins float-none">
                            <div class="_more-action">
                                <div class="dropdown float-right">
                                    <button class="btn btn-primary deleteCorrespondence mr-0" type="button"
                                        c-id="${ element.id }"><i
                                        class="fa fa-trash"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="top-Date mr-10">${moment(element.created_at, 'Y-M-D').format('MMMM D, Y')} at ${ moment(element.created_at, 'Y-M-D hh:mm:ss').format('hh:mm:ss a') }</div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 PT-15 PB-15">
                    <div style="display:none" class="DivTextarea">
                        <textarea class="TaskText Tasktextarea" rows="7">${ element.mom }</textarea>
                    </div>
                        <p class="momPara"> ${ element.mom } </p>
                    </div>
                </div>
                <div class="row Activity-bottom">
                    <div class="col-auto"><img class="_User-img" src="${element.user_picture ? url+element.user_picture: '/images/avatar.svg'}" alt=""> </div>
                    <div class="col-auto p-0"><strong class="createdByLabel">${ element.created_by }</strong><br>left a ${element.type}</div>
                    <div class="assigned-to AssTask" style="width:380px;padding-left:30px">
                    <div class="col-12 p-0 text-gray">POC:</div>
                        <div class="col-12 pl-0 float-left">
                            <div class="form-s2 date-List EMP__List">
                                <select class="form-control formselect" multiple="multiple" disabled id="selectMultiPOCPinned${element.id}">
                                    
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row task-detail">
                    <div class="col-md-12 p-0">
                        <a class="taskDetailL" data-toggle="collapse" href="#collapseExample${idx}"
                            role="button" aria-expanded="false" aria-controls="collapseExample${idx}"><i
                                class="fa fa-angle-down"></i>
                            View Details</a>
                        <div class="collapse" id="collapseExample${idx}">
                            <div class="taskDetail-div">
                                <div class="row task-assign-date">
                                    <div class="assigned-to">
                                        <div class="col-12 p-0 text-gray mb-5">Due
                                            date:</div>
                                        <div class="col-auto l-height p-0">
                                            <img class="calendarIcon" src="/images/calendar-icon002.svg"
                                                alt="">
                                            <input class="assignedDate datepickerCorrespondence" c-type="${element.type}" c-id="${element.id}" date-type="due_date" type="text"
                                                value="${moment(element.due_date, 'Y-M-D').format('D/M/Y')}"
                                                id="datepicker2" style="font-size: 13px"></div>
                                    </div>
                                    <div class="assigned-to">
                                        <div class="col-12 p-0 text-gray mb-5">Due
                                            Time:</div>
                                        <div class="col-auto l-height p-0">
                                            <img class="calendarIcon float-left" src="/images/time-icon.svg"
                                                alt="">
                                                <div class="form-s2 date-List H-arrow">
                                                    <select time-type="due_time" c-id="${element.id}" class="timeDD form-control formselect" style="width: 100px!important">
                                                        ${dueTimeOptions}
                                                    </select>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="display: none" class="row saveChangesDiv"> 
                    <div class="col-12 EditSaveTask">
                        <a href="#" class="btn-primary mr-2 saveChangesButton" c-id="${element.id}" c-type="${element.type}">Save</a>
                        <a href="#" class="btn-primary btn-outline cancelChangesButton">Cancel</a>
                    </div>
                </div>
            </div>
        </div>`);
            pocs.forEach(data => {
                $(`#selectMultiPOCPinned${element.id}`).append(`<option selected>${data.poc_name}</option>`);
            })
        }

        let empOptions = '';
        employeesList.forEach(emp => {
            empOptions += `<option value="${emp.id}" ${element.assigned_to && element.assigned_to == emp.name} >${emp.name}</option>`
        });

        $(`.assigned_to-${idx}`).append(empOptions);

        var ids = (element.assigned_ids ? element.assigned_ids.split(',') : '');
        $(`.assigned_to-${idx}`).val(ids).trigger('change');
        $(`.assigned_to-${idx}`).select2({
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

    });

    correspondences.filter(x => !x.pinned).forEach((element, idx) => {
        var pocs = [];
        if (allMultiplePocs) {
            pocs = allMultiplePocs.filter(function (x) {
                return x.correspondence_id == element.id;
            });
        }

        let taskReminderTimeOptions = ``;
        timeOptions.forEach(timeElem => {
            taskReminderTimeOptions += `<option value='${timeElem}' ${ element.due_time && moment(element.reminder_time, 'hh:mm:ss').format('h:mm A') == timeElem ? 'selected' : '' }>${timeElem}</option>`
        });
        let dueTimeOptions = ``;
        timeOptions.forEach(timeElem => {
            dueTimeOptions += `<option value='${timeElem}' ${ element.due_time && moment(element.due_time, 'hh:mm:ss').format('h:mm A') == timeElem ? 'selected' : '' }>${timeElem}</option>`
        });
        if (element.type == "task") {
            var files = (element.files ? JSON.parse(element.files) : null);
            var files_count = files ? parseFloat(files['multiple_documents'] ? files['multiple_documents'].length : 0) + parseFloat(files['voice_note'] ? files['voice_note'].length : 0) + parseFloat(files['multiple_images'] ? files['multiple_images'].length : 0) : 0;
            $('.dynamicDataDiv, .dynamicTasksDiv').append(`
                <div class="_Activity">
                    <div class="act_date">${ element.month_name } ${ moment(element.created_at).format('Y') }
                    </div>
                    <div class="Activity-card">
                        <div class="row">
                            <div class="col-auto">
                                <h2><img src="/images/task-icon-b.svg" alt=""> Task</h2>
                            </div>
                            <div class="col top_right-act">
                                <div class="topActins float-none">
                                    <div class="_more-action">
                                        <div class="dropdown float-right">
                                            <button class="btn btn-primary pinCorresp" c-id="${element.id}" type="button"><i
                                            class="fa fa-thumb-tack"></i> </button>
                                            <button class="btn btn-primary deleteCorrespondence mr-0" type="button"
                                                c-id="${ element.id }"><i
                                                class="fa fa-trash"></i></button>
                                        </div>
                                        <div class="float-right ml-10 mr-20"><strong class="font13 float-left">Status: </strong>
                                            <span class="TS-Circle ${ (!element.task_status || element.task_status == 'not-started' ? 'TS-NotStarted' : (element.task_status == 'in-review' ? 'TS-InReview' : (element.task_status == 'in-progress' ? 'TS-InProgress' : (element.task_status == 'completed' ? 'TS-Completed' : 'TS-Cancelled')))) } mr-5"></span> ${ (!element.task_status || element.task_status == 'not-started' ? 'Not Started' : (element.task_status == 'in-review' ? 'In Review' : (element.task_status == 'in-progress' ? 'In Progress' : (element.task_status == 'completed' ? 'Completed' : 'Cancelled')))) }</div>  
                                    </div> 
                                </div>
                                <div class="top-Date">${moment(element.created_at, 'Y-M-D').format('MMMM D, Y')} at ${ moment(element.created_at, 'Y-M-D hh:mm:ss').format('hh:mm:ss a') }</div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 PT-15 PB-15">
                                <div class="row">
                                   
                                
                                <div class="col TaskTitle">
                                    <input type="text" value="${ element.title }" class="taskTitleInput form-control" placeholder="Task Title">
                                </div>
                            </div>
                            <div style="display:none" class="DivTextarea">
                                <textarea class="TaskText Tasktextarea" rows="7">${ element.mom }</textarea>
                            </div>
                            <p class="momPara">${ element.mom }</p>
                        </div>
                    </div>
                    
                    <div class="row task-assign-date">
                        
                        <div class="assigned-to w-auto">
                            <div class="col-12 p-0 text-gray mb-5">Created by
                            </div>
                            <div class="col-auto pl-0 l-height"><img class="_User-img" src="${element.user_picture ? url+element.user_picture: '/images/avatar.svg'}" alt="">
                                <strong class="createdByLabel">${ element.created_by }</strong></div>
                        </div>
                        <div class="assigned-to set-width">
                            <div class="col-12 p-0 text-gray mb-5">Due date:</div>
                            <div class="col-auto l-height p-0">
                                <img class="calendarIcon" src="/images/calendar-icon002.svg" alt="">
                                <input class="assignedDate datepickerCorrespondence" c-type="${element.type}" c-id="${element.id}" date-type="due_date" type="text"
                                    value="${moment(element.due_date, 'Y-M-D').format('D/M/Y')}"
                                    style="font-size: 13px"></div>
                        </div>
                        <div class="assigned-to set-width">
                            <div class="col-12 p-0 text-gray mb-5">Time:</div>
                            <div class="col-auto l-height p-0">
                                <img class="calendarIcon float-left" src="/images/time-icon.svg" alt="">
                                <div class="form-s2 date-List H-arrow">
                                    <select time-type="due_time" c-id="${element.id}" class="timeDD form-control formselect" style="width: 100px!important">
                                        ${dueTimeOptions}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="assigned-to" style="width: 80px; padding-left: 0; margin-left: -10px; z-index:999">
                            <div class="col-12 p-0 text-gray">Priority:</div>
                            <div class="col-12 p-0">
                              <div class="flag-iconP"><span class="fa fa-flag ${(!element.task_priority ? '' : (element.task_priority == 'critical' ? 'TaskCritical' : (element.task_priority == 'high' ? 'TaskHigh' : (element.task_priority == 'medium' ? 'TaskMedium' : 'TaskLow'))))}"></span> </div>
                              <div class="float-left TaskStAction PriorityFlag">
                                <select class="custom-select SP_flag pr-0 pl-5" disabled style="background-color: white">
                                  <option selected>${(element.task_priority ? titleCase(element.task_priority) : '')}</option>
                                </select>
                              </div>
                            </div>
                        </div>
                        <div class="assigned-to AssTask">
                            <div class="col-12 p-0 text-gray">Assigned to:</div>
                            <div class="col-12 pl-0 float-left">
                                <div class="form-s2 date-List EMP__List">
                                    <select class="form-control customSdType assigned_to_up-${idx}" name="assigned_to" disabled 
                                        multiple="multiple" style="width: 100px!">
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row task-detail" style="display:block !important">
                        <div class="col-md-12 p-0"> 
                            <div class="row m-0">
                            <div class="col-12 TaskBD">
                            <div class="row">
                                <div class="col-auto TotalAttach">
                                <img class="_T-img-title" src="images/attach-icon-b.svg" alt="">Attachments <span
                                    class="_attachV"> ${files_count}</span>
                                </div>
                                <div class="col-auto  TotalAttach">
                                <img class="_T-img-title" src="images/comment-icon-b.svg" alt="">Comments <span
                                    class="_attachV"> ${element.task_comments ? JSON.parse(element.task_comments).length : 0}</span>
                                </div>
                                <div class="col">
                                <a class="taskDetailL-B viewTaskDetails" task-id="${element.id}" data-toggle="modal" data-target="#taskCommentsModal">View
                                    Details</a>
                                </div>
                            </div>
                            </div>

                        </div>
                        </div>
                    </div>
                    <div style="display: none" class="row saveChangesDiv"> 
                        <div class="col-12 EditSaveTask">
                            <a href="#" class="btn-primary mr-2 saveChangesButton" c-id="${element.id}" c-type="${element.type}">Save</a>
                            <a href="#" class="btn-primary btn-outline cancelChangesButton">Cancel</a>
                        </div>
                    </div>
                </div>`);
        } else if (element.type == "note") {
            $('.dynamicDataDiv, .dynamicNotesDiv').append(`
        <div class="_Activity">
            <div class="act_date">${ element.month_name } ${ moment(element.created_at).format('Y') }
            </div>
            <div class="Activity-card">
                <div class="row">
                    <div class="col-auto">
                        <h2><img src="/images/note-icon-b.svg" alt=""> Note</h2>
                    </div>
                    <div class="col top_right-act">
                        <div class="topActins float-none">
                            <div class="_more-action">
                                <div class="dropdown float-right">
                                    <button class="btn btn-primary pinCorresp" c-id="${element.id}" type="button"><i
                                    class="fa fa-thumb-tack"></i> </button>
                                    <button class="btn btn-primary deleteCorrespondence mr-0" type="button"
                                        c-id="${ element.id }"><i
                                        class="fa fa-trash"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="top-Date mr-10">${moment(element.created_at, 'Y-M-D').format('MMMM D, Y')} at ${ moment(element.created_at, 'Y-M-D hh:mm:ss').format('hh:mm:ss a') }</div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 PT-15 PB-15">
                    <div style="display:none" class="DivTextarea">
                        <textarea class="TaskText Tasktextarea" rows="7">${ element.mom }</textarea>
                    </div>
                        <p class="momPara"> ${ element.mom } </p>
                    </div>
                </div>
                <div class="row Activity-bottom">
                    <div class="col-auto"><img class="_User-img" src="${element.user_picture ? url+element.user_picture: '/images/avatar.svg'}" alt=""> </div>
                    <div class="col-auto p-0 l-height"><strong class="createdByLabel">${ element.created_by }</strong></div>
                    <div class="col-auto l-height text-gray">left a note</div>
                </div>
                <div style="display: none" class="row saveChangesDiv"> 
                    <div class="col-12 EditSaveTask">
                        <a href="#" class="btn-primary mr-2 saveChangesButton" c-id="${element.id}" c-type="${element.type}">Save</a>
                        <a href="#" class="btn-primary btn-outline cancelChangesButton">Cancel</a>
                    </div>
                </div>
            </div>
        </div>`);
        } else {
            $('.dynamicDataDiv').append(`
        <div class="_Activity">
            <div class="act_date">${ element.month_name } ${ moment(element.created_at).format('Y') }
            </div>
            <div class="Activity-card">
                <div class="row">
                    <div class="col-auto">
                        <h2><img src="/images/${element.type == 'call' ? 'call-icon-b.svg' : (element.type == 'meeting' ? 'meeting-icon-b.svg' : 'email-icon-b.svg')}" alt=""> Log</h2>
                    </div>
                    <div class="col top_right-act">
                        <div class="topActins float-none">
                            <div class="_more-action">
                                <div class="dropdown float-right">
                                <button class="btn btn-primary pinCorresp" c-id="${element.id}" type="button"><i
                                class="fa fa-thumb-tack"></i> </button>
                                    <button class="btn btn-primary deleteCorrespondence mr-0" type="button"
                                        c-id="${ element.id }"><i
                                        class="fa fa-trash"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="top-Date mr-10">${moment(element.created_at, 'Y-M-D').format('MMMM D, Y')} at ${ moment(element.created_at, 'Y-M-D hh:mm:ss').format('hh:mm:ss a') }</div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 PT-15 PB-15">
                    
                    <div style="display:none" class="DivTextarea">
                        <textarea class="TaskText Tasktextarea" rows="7">${ element.mom }</textarea>
                    </div>
                        <p class="momPara"> ${ element.mom } </p>
                    </div>
                </div>
                <div class="row Activity-bottom">
                    <div class="col-auto"><img class="_User-img" src="${element.user_picture ? url+element.user_picture: '/images/avatar.svg'}" alt=""> </div>
                    <div class="col-auto p-0"><strong class="createdByLabel">${ element.created_by }</strong><br>left a ${element.type}</div>
                    <div class="assigned-to AssTask" style="width:380px;padding-left:30px">
                    <div class="col-12 p-0 text-gray">POC:</div>
                        <div class="col-12 pl-0 float-left">
                            <div class="form-s2 date-List EMP__List">
                                <select class="form-control formselect" multiple="multiple" disabled id="selectMultiPOC${element.id}">
                                    
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row task-detail">
                    <div class="col-md-12 p-0">
                        <a class="taskDetailL" data-toggle="collapse" href="#collapseExample${idx}"
                            role="button" aria-expanded="false" aria-controls="collapseExample${idx}"><i
                                class="fa fa-angle-down"></i>
                            View Details</a>
                        <div class="collapse" id="collapseExample${idx}">
                            <div class="taskDetail-div">
                                <div class="row task-assign-date">
                                    <div class="assigned-to">
                                        <div class="col-12 p-0 text-gray mb-5">Due
                                            date:</div>
                                        <div class="col-auto l-height p-0">
                                            <img class="calendarIcon" src="/images/calendar-icon002.svg"
                                                alt="">
                                            <input class="assignedDate datepickerCorrespondence" c-type="${element.type}" c-id="${element.id}" date-type="due_date" type="text"
                                                value="${moment(element.due_date, 'Y-M-D').format('D/M/Y')}"
                                                id="datepicker2" style="font-size: 13px"></div>
                                    </div>
                                    <div class="assigned-to">
                                        <div class="col-12 p-0 text-gray mb-5">Due
                                            Time:</div>
                                        <div class="col-auto l-height p-0">
                                            <img class="calendarIcon float-left" src="/images/time-icon.svg"
                                                alt="">
                                                <div class="form-s2 date-List H-arrow">
                                                    <select time-type="due_time" c-id="${element.id}" class="timeDD form-control formselect" style="width: 100px!important">
                                                        ${dueTimeOptions}
                                                    </select>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="display: none" class="row saveChangesDiv"> 
                    <div class="col-12 EditSaveTask">
                        <a href="#" class="btn-primary mr-2 saveChangesButton" c-id="${element.id}" c-type="${element.type}">Save</a>
                        <a href="#" class="btn-primary btn-outline cancelChangesButton">Cancel</a>
                    </div>
                </div>
            </div>
        </div>`);
            pocs.forEach(data => {
                $(`#selectMultiPOC${element.id}`).append(`<option selected>${data.poc_name}</option>`);
            })
        }

        let empOptions = '';
        employeesList.forEach(emp => {
            empOptions += `<option value="${emp.id}" ${element.assigned_to && element.assigned_to == emp.name} >${emp.name}</option>`
        });
        $(`.assigned_to_up-${idx}`).append(empOptions);
        var ids = (element.assigned_ids ? element.assigned_ids.split(',') : '');
        $(`.assigned_to_up-${idx}`).val(ids).trigger('change');
        $(`.assigned_to_up-${idx}`).select2({
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

    });
    if (searchedQ) {
        // $('.TaskTitle').mark(searchedQ)
        $('.momPara').mark(searchedQ)
        $('.assignedToStrongLabel').mark(searchedQ)
        $('.createdByLabel').mark(searchedQ)
        $('.act_date').mark(searchedQ)
        $('.top-Date').mark(searchedQ)
    }

    $('.datepickerCorrespondence').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true
    });

    $(".formselect").select2();
}

function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function renderCustomerOrders(){
    $('.orders_card_div').empty();
    $('.order_cards_holder').empty();
    total_order_records = allCustOrdersArray.length;
    //$('.count_poc').text(total_order_records);
    var recsPerPage = 8;
    total_order_pages = Math.ceil(total_order_records / recsPerPage);
    offset = 0;
    var pageNo = 0;
    var current_records = 0;
    var array_items_count = 0;
    var total_indexes = 0;
    fetchPagination(total_order_pages, current_records);
    var test = [];
    allCustOrdersArray.forEach(element => {
        current_records++;
        array_items_count++;
        if (current_records <= 8) { 
            $('.orders_card_div').append(` <div class="_Activity">
                <div class="act_date">${moment(element['created_at']).format('MMMM YYYY') }</div>
                <div class="Activity-card OrderCard">
                    <div class="row">
                        <div class="col-auto pr-0">
                            <h2><img src="${element['status'] != 'performa' ? '/images/order-card-icon.svg' : '/images/performa-card-icon.svg'}" alt="">
                                ${element['status'] != 'performa' ? 'Order' : 'Performa'}</h2>
                        </div>
                        <div class="col top_right-act pl-0"> 
                            <div class="topActins float-right">
                                <div class="btn-group _more-action">
                                    <button class="btn btn-sm dropdown-toggle" type="button" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false"> More Actions </button>
                                    <div class="dropdown-menu dropdown-menu-right" style="min-width:auto !important">
                                        ${element['status'] == 'performa' ? `<a id="${ element['id'] }" class="dropdown-item viewInvoice" data-toggle="modal" data-target="#performaInvoiceModal">View Invoice</a>` : `<a id="${ element['id'] }" class="dropdown-item viewOrderSheet" data-toggle="modal" data-target=".orderSheetModal">Order Sheet</a>
                                        <a href="/OrderDetails/${element['id']}" class="dropdown-item">Order Detail</a>`}
                                    </div>
                                </div>
                            </div> 
                            <div class="float-right ml-10 mr-20"><strong class="font13 float-left">Status: </strong>
                                <span class="TS-Circle TS-Completed mr-5"></span> <strong>${element['current_status']}</strong>
                            </div> 
                            <div class="top-Date pr-10">${ moment(element['created_at']).format('MMMM DD, YYYY') } at ${element['created_time']}</div>
                        </div>
                    </div>
                    <div class="row pt-10">
                        <div class="col">
                            <div class="col-12 p-0 text-gray">Created by</div>
                            <div class="col-auto p-0 l-height"><img class="_User-img" src="${element['emp_picture'] ? empPicBaseUrl+element['emp_picture'] : '/images/avatar.svg'}" alt="">
                                <strong>${element['created_by']}</strong></div>
                        </div>
                        <div class="col">
                            <div class="col-12 p-0 text-gray">Order Type:</div>
                            <div class="col-auto l-height p-0"><strong>${element['order_type'] ? element['order_type'] : 'NA'}</strong></div>
                        </div>
                        <div class="col">
                            <div class="col-12 p-0 text-gray"> E-Invoice:</div>
                            <div class="col-auto l-height p-0"><strong>${element['eform_num'] ? element['eform_num'] : 'NA'}</strong></div>
                        </div>
                        <div class="col-auto">
                            <div class="col-12 p-0 text-gray"> Order Amount:</div>
                            <div class="col-auto l-height p-0 orderVal">${element['currency_symbol']}. ${addCommas(element['total_amount'])}</div>
                        </div>
                    </div>
                    <div class="row m-0"> 
                        <div class="assigned-to AssTask pl-0">
                            <div class="col-12 p-0 text-gray">Assigned to Supplier:</div>
                            <div class="col-12 pl-0 float-left">
                                <div class="form-s2 date-List EMP__List">
                                    <select class="form-control formselect assigned_suppliers_${element['id']}" multiple="multiple" disabled> 
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div> 
                    <div class="row task-detail">
                        <div class="col-md-12 p-0"> <a class="taskDetailL" data-toggle="collapse" href="#collapseExample${element['id']}"
                                role="button" aria-expanded="false" aria-controls="collapseExample${element['id']}"><i
                                    class="fa fa-angle-down"></i> View
                                Detail</a>
                            <div class="collapse" id="collapseExample${element['id']}">
                                <div class="col-md-12 p-0 overflowYV m-0 mt-20">
                                    <table class="table table-hover dt-responsive nowrap m-0" style="width:100%">
                                        <thead>
                                            <tr>
                                                <th>Product Name</th>
                                                <th>Item Name</th>
                                                <th>QTY.</th>
                                                <th>Unit Price</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody class="order_detail_${element['id']}">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> `); 
            element['suppliers'].forEach(x => {
                var newOption = new Option(x['supplier'], x['supplier'], true, true);
                $(`.assigned_suppliers_${element['id']}`).append(newOption);
            })

            $(`.order_detail_${element['id']}`).empty();
            element['content'].forEach(items => {
                $(`.order_detail_${element['id']}`).append(`<tr>
                    <td>${items['product_name']}</td>
                    <td>${items['item_name']}</td>
                    <td>${items['qty']}</td>
                    <td>${element['currency_symbol']+addCommas(items['unit_price'])}</td>
                    <td>${element['currency_symbol']+addCommas(items['amount'])}</td>
                </tr>`);
            })
        }
        test.push(element);
        all_orders[total_indexes] = test;
        if (array_items_count == 8) {
            array_items_count = 0;
            test = [];
            total_indexes++;
        }
    });
}

function openPaymentTab() {
    $('.nav-pills .nav-link').removeClass('active show')
    $('#paymentTabPill a.nav-link').addClass('active show');
    $('.tab-content .tab-pane').removeClass('active show')
    $('#pills-payment').addClass('active show');
}

function openOrderTab() {
    $('.nav-pills .nav-link').removeClass('active show')
    $('#orderTabPill a.nav-link').addClass('active show');
    $('.tab-content .tab-pane').removeClass('active show')
    $('#pills-order').addClass('active show');
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

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
        attachments[activeAttachmentMod].push({
            'name': file.name,
            'converted_name': Math.random() + "<!>" + file.name,
            'base64': reader.result.split(',')[1]
        });
        displayMultipleDocs();
        resolve()
    };
    reader.onerror = error => reject(error);
});

async function Main(method) {
    let allFiles = '';
    if(method == 'voice'){
        allFiles = document.querySelector(current_open_modal == 'task' ? '.upload_voice_notes' : '.upload_voice_notes_log').files;
    }else if(method == 'docs'){
        allFiles = document.querySelector(current_open_modal == 'task' ? '.upload_documents' : '.upload_documents_log').files;
    }else{
        allFiles = document.querySelector(current_open_modal == 'task' ? '.upload_images' : '.upload_images_log').files;
    } 
    for (let i = 0; i < allFiles.length; i++) {
        await toBase64(allFiles[i]);
    }
}




function fetchPagination(pageLen = null, curPage = null, type = null) {

    item = [];
    for (var i = 1; i <= pageLen; i++) {
        item.push(i);
    }
    render(pageLen, curPage, item, true, type);
}

function render(pageLen = null, curPage, item, first, type) {
   
    var html = '',
        separatorAdded = false;
    for (var i in item) {
        if (isPageInRange(curPage, i, pageLen, 2, 2)) {
            html += '<li class="orderCard_page_link" name="' + i + ' "data-page="' + i + '">' + item[i] + '</li>';
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
    
    var holder = document.querySelector('#order_cards_holder');
    holder.innerHTML = html;
    document.querySelector('#order_cards_holder>li[data-page="' + curPage + '"]') ? document.querySelector('#order_cards_holder>li[data-page="' + curPage + '"]').classList.add('active') : '';

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