///runwatch
// import swal from 'sweetalert';
let deleteRef   = '';
let p_service   = '';
let s_service   = '';
let s_s_service = '';
$(document).ready(function(){
    var editor = CKEDITOR.replace( 'faq_answer',
        {
            height: '500px',
            toolbar : 'Classic',
            removePlugins: 'blockquote,about',
            toolbarStartupExpanded : false,
            contentsCss: [
                '../css/menu.css?v=6.4'
                ],
                format_tags : 'p;h1;h2;h3;h4;h5;h6;pre;div',
        });
    // CKFinder.setupCKEditor( editor );
    CKEDITOR.config.fontSize_defaultLabel       =   '12px';
    CKEDITOR.config.fontSize_defaultParagraph   =   '12px';
    CKEDITOR.config.fontSize                    =   '12 Pixels/12px;Big/2.3em;30 Percent More/130%;Bigger/larger;Very Small/x-small';
})
$(document).on('click','.add_faqs',function(){
    openSidebar();
    CKEDITOR.instances['faq_answer'].setData();
    $('#SaveFaqsForm')[0].reset();
    $('input[name="faq_question"]').focus();
    $('input[name="faq_question"]').blur();
    $('select[name="faq_type"]').trigger('change');
    $('input[name="hidden_faq_id"]').val('');
})
$('#faq_type').change(function(){
    var type_id = $(this).val();
    if(type_id == 2){
        $('.services_row').show();
        $('.services-info').addClass('faq-required');
    }else{
        $('.services-info').removeClass('faq-required');
        $('.services_row').hide();
        $('#primary_service_id').val(0).trigger('change');
        $('#secondary_services').val(0).trigger('change');
        $('#sub_secondary_services').val(0).trigger('change');
    }
})
$(document).on('click', '#save-faq', function () {
let dirty = false;
    $('.faq-required').each(function () {
        if (!$(this).val() || $(this).val() == 0) {
            dirty = true;
            if ($(this).hasClass('formselect') || $(this).hasClass('sd-type') ) {
                $(this).parent().find('.select2-container').css('border', '0px solid red');
            }else{
                $(this).css('border', '0px solid red');
            }   
        }
    });
    if (dirty) {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please provide all the required information (*)');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    var CurrentRef = $(this);
    CurrentRef.attr('disabled', 'disabled');
    CurrentRef.text('Processing...');
    var faq_details    =   CKEDITOR.instances['faq_answer'].getData();
    if(faq_details == '')
    {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please provide Faq Answer (*)');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);  
        CurrentRef.attr('disabled', false);
        CurrentRef.text('Save');
        return;
      
    }
    $('#SaveFaqsForm').ajaxSubmit({
        type    :   "POST",
        url     :   "/save-faqs",
        data    :   {
            faq_details    :   faq_details
        },
        success :   function(response){
            CurrentRef.attr('disabled', false);
            CurrentRef.text('Save');
            if(response.msg == 'faq_added'){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('FAQs Added');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                $('#SaveFaqsForm')[0].reset();
                CKEDITOR.instances['faq_answer'].setData();
                closeSidebar();
                all_faqs_list();
            }else{
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Not added at this moment');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
        }
    })
})
$(document).on('click','.edit_faq',function(){
    openSidebar();
    var id = $(this).attr('id');
    var CurrentRef = $(this);
    CurrentRef.attr('disabled', 'disabled');
    CurrentRef.text('Processing...');
        $.ajax({
            type    :   'GET',
            url     :   `/GetFaqs/${id}`,
            success :   function (response) {
                CurrentRef.attr('disabled', false);
                CurrentRef.text('Edit');
                $('select[name="faq_type"]').focus();
                $('select[name="faq_type"]').val(response.faqs_result.faq_type).trigger('change');
                $('select[name="faq_type"]').blur();
                $('select[name="primary_service_id"]').val(response.faqs_result.primary_service_id).trigger('change');
                $('input[name="faq_question"]').focus();
                $('input[name="faq_question"]').val(response.faqs_result.question);
                $('input[name="faq_question"]').blur();
                $('textarea[name="faq_answer"]').focus();
                $('textarea[name="faq_answer"]').blur();
                CKEDITOR.instances['faq_answer'].setData(response.faqs_result.answer);
                $('input[name="hidden_faq_id"]').val(response.faqs_result.id);
                $('input[name="hidden_faq_id"]').val(response.faqs_result.id);
                $('#p_service').val(response.faqs_result.primary_service_id);
                $('#s_service').val(response.faqs_result.secondary_service_id);
                $('#s_s_service').val(response.faqs_result.sub_service_id);
                p_service   = $('#p_service').val();
                s_service   = $('#s_service').val();
                s_s_service = $('#s_s_service').val();
            }
        });
})
$('#primary_service_id').change(function(){
    $('#secondary_services').empty();
    // $('#sub_secondary_services').empty();
    // $("#sub_secondary_services").append(`<option value="0">Sub Secondary Services</option>`);
    var primary_service_id = $(this).val();
    $.ajax({
        url     :   `/get-sub-category-against-main-cat/${primary_service_id}`,
        success :   function(response){
            $("#secondary_services").append(`<option value="0">Sub Category</option>`);
            $.when(response.forEach(data => {
                $("#secondary_services").append(`<option value="${data.id}">${data.service_name}</option>`)
            })).then(function(){
                if(s_service){
                    $("#secondary_services").val(s_service).trigger('change'); 
                }
            })

        }
    })
})
// $('#secondary_services').change(function(){
//     $('#sub_secondary_services').empty();
//     var secondary_service_id = $(this).val();
//     $.ajax({
//         url     :   `/get-sub-secondary-services-against-secondary/${secondary_service_id}`,
//         success :   function(response){
//             $("#sub_secondary_services").append(`<option value="0">Sub Secondary Services</option>`);
//             response.sub_sec_services.forEach(data => {
//                 $("#sub_secondary_services").append(`<option value="${data.id}" ${s_s_service == data.id ? 'selected' : ''}>${data.service_name}</option>`)
//             })

//         }
//     })
// })
$(document).on('click','.status_change_faq',function(){
    var faq_status      =   '';
    var id              =   $(this).attr('id');
    var current_status  =   $(this).attr('data-value');
    if(current_status == 1){
        faq_status      =   0;
    }else{
        faq_status      =   1;
    }
    var CurrentRef      =   $(this);
    CurrentRef.attr('disabled', 'disabled');
    $.ajax({
        type    :   'POST',
        url     :   `/faq-status-change`,
        data    :   {
            _token      :   $('meta[name="csrf_token"]').attr('content'),
            id          :   id,
            faq_status  :   faq_status,
        },
        success :   function (response) {
            CurrentRef.attr('disabled', false);
            if(response.msg == 'status_change'){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('FAQs Status Change');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                all_faqs_list();
            }
        }
    });
})
function all_faqs_list(){
    $('.faqs_list').empty();
    $('.loader').show();

    $.ajax({
        type    :   'GET',
        url     :   '/all-faqs-list',
        success :   function(response){
            $('.faqs_list').append('<table class="table table-hover dt-responsive nowrap FaqsListTable" style="width:100%;"><thead><tr><th>S.No</th><th>FAQ Type</th><th>Question</th><th>Answer</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.FaqsListTable tbody').empty();
            response.all_faqs.forEach((element, key) => {
                $('.FaqsListTable tbody').append(`
                    <tr>
                        <td>${key + 1}</td>
                        <td>${element['faq_type'] == 1 ? 'General' : element['faq_type'] == 2 ? 'Category Related' : 'NA'}</td>
                        <td>${element['question']}</td>
                        <td>${element['answer']}</td>
                        <td>
                            <button id="${element['id']}" class="btn btn-default btn-line edit_faq"
                                primary-id="${element.primary_service_id}" sec-id="${element.secondary_service_id}"
                                sub-sec-id="${element.sub_service_id}">
                            Edit
                            </button>
                            <button id="${element['id']}" class="btn btn-default red-bg delete_faq">Delete</button>
                            <button id="${element['id']}" class="btn btn-default status_change_faq" data-value="${element.status}">${element.status==1 ? 'Inactive' : 'Active'}</button>
                        </td>
                    </tr>`);
            });
            $('.FaqsListTable').fadeIn();
            $('.FaqsListTable').DataTable();
            $('.loader').hide();
        }
    })
}
//Delete Faq
$(document).on('click', '.delete_faq', function () {
    var id = $(this).attr('id');
    deleteRef = $(this);
    swal({
        title   : "Are you sure?",
        // text    : "",
        icon    : "warning",
        buttons: true,
        dangerMode: true,
        focusCancel: false,
      })
      .then((willDelete) => {
        if (willDelete) {
            var thisRef = $(this);
            deleteRef.attr('disabled', 'disabled');
            deleteRef.text('Processing...');
            var id = $(this).attr('id');
            $.ajax({
                type: 'POST',
                url: '/delete-faq',
                data: {
                    _token: $('meta[name="csrf_token"]').attr('content'),
                    id: id
                },
                success: function (response) {
                    if (response.msg == 'faq_deleted') {
                        all_faqs_list();
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Successfully deleted.');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    } else {
                        deleteRef.removeAttr('disabled');
                        deleteRef.text('Delete');
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text('Unable to delete at the moment');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }
                }
            });
        }
      });
      
})
all_faqs_list();