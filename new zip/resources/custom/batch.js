// import swal from 'sweetalert';
let deleteRef   = '';
let p_service   = '';
let s_service   = '';
let s_s_service = '';
let all_courses = [];
let current_start_time = '';
let current_end_time   = '';
let multiple_slots = [];
let batch_language_array = [];
let slot_id     = 0;
let valueStart  ='';
let valueStop   ='';
let language    ='';
$(function () {
    $('.datetimepicker3').datetimepicker({
        format: 'LT'
    });
});  
lang =  $('.language').select2({
                    multiple: true,
                });
$(document).ready(function(){
    var batch_id =  $('.hidden_batch_id').val();
    $.ajax({
        url     :   '/course-list',
        type    :    'get',
        success :  function(response){
            all_courses =   response.client;
        }
    })
    if (location.pathname == `/edit-batch/${batch_id}`) {
        $.ajax({
            url     :   '/get-batch-languages/'+batch_id,
            type    :    'get',
            success :  function(response){
                 response.languages.forEach(data =>{
                    if(data.id == data.batch_lang[0]){
                    batch_language_array.push(data.batch_lang[0])
                    }
                })
             lang.val(batch_language_array).trigger("change");
            }
        })
        $.ajax({
           url     : `/get-batch-slots/${batch_id}`,
           type    : 'get',
           success : function(response){
            var options = {
                hour   : 'numeric',
                minute : 'numeric',
                hour12 : true
                };
               response.batch_slots.forEach(element => {
                    var start_time = new Date("February 04, 2011 "+element.start_time);
                    var end_time   = new Date("February 04, 2011 "+element.end_time);
                    multiple_slots.push({
                    'slot_id'       : element.id,
                    'start_time'    : start_time.toLocaleString('en-US', options),
                    'end_time'      : end_time.toLocaleString('en-US', options),
                    });
                    if(multiple_slots.length > 0){
                        $('#sesssion_duration').attr('readonly',true);
                    }
               })
           }
        });
    }else{
        all_batches_list()
    }
})
$('#datepicker, #datepicker2 ,#datepicker3 , #datepicker4').datepicker({
    autoclose: true,
    todayHighlight: true,
    toggleActive: true,
    format: dateFormat
})
.on('changeDate', function (ev) {
    $(this).datepicker('hide');
});
// $(document).on('click','.add_faqs',function(){
//     openSidebar();
//     $('#saveBatchForm')[0].reset();
//     $('input[name="batch_code"]').focus();
//     $('input[name="batch_code"]').blur();

//     $('input[name="batch_title"]').blur();

//     $('input[name="grace_period"]').blur();

//     $('input[name="eb_discount"]').blur();

//     $('input[name="eb_max_days"]').blur();

//     $('select[name="course_id"]').trigger('change');
//     $('input[name="hidden_batch_id"]').val('');
// })
$(document).on('click', '#save-batch', function () {
let dirty = false;
    $('.batch-required').each(function () {
        if (!$(this).val() || $(this).val() == 0) {
            dirty = true;
        }
    });
    if(multiple_slots == ''){
        dirty = true;
    }
   
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
    $('#saveBatchForm').ajaxSubmit({
        type    :   "POST",
        url     :   "/save-batch",
        data    :   {
            'multiple_slots'      : multiple_slots,
        },
        success :   function(response){
            
            if(response.status == 'success'){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Batch has been Added');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                $('#saveBatchForm')[0].reset();
                setTimeout(() => {
                    window.location = "/batches";
                    $('#notifDiv').fadeOut();
                }, 1500);
            }
            if(response.status == 'duplicate'){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Batch Code has already Exist');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
               CurrentRef.attr('disabled', false);
               CurrentRef.text('Save');
            }
            if(response.status == 'failed'){
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
// $(document).on('click','.edit_batch',function(){
//     // openSidebar();
//     var id = $(this).attr('id');
//     var CurrentRef = $(this);
//     CurrentRef.attr('disabled', 'disabled');
//     CurrentRef.text('Processing...');
//         $.ajax({
//             type    :   'GET',
//             url     :   `/get-batch/${id}`,
//             success :   function (response) {
//                 CurrentRef.attr('disabled', false);
//                 CurrentRef.text('Edit');
//                 $('select[name="course_id"]').focus();
//                 $('select[name="course_id"]').val(response.batch.course_id).trigger('change');
//                 $('select[name="course_id"]').blur();
               
//                 $('input[name="batch_code"]').focus();
//                 $('input[name="batch_code"]').val(response.batch.batch_code);
//                 $('input[name="batch_code"]').blur();

//                 $('input[name="batch_title"]').focus();
//                 $('input[name="batch_title"]').val(response.batch.batch_title);
//                 $('input[name="batch_title"]').blur();
               
//                 $('input[name="grace_period"]').focus();
//                 $('input[name="grace_period"]').val(response.batch.grace_period);
//                 $('input[name="grace_period"]').blur();

//                 $('input[name="eb_discount"]').focus();
//                 $('input[name="eb_discount"]').val(response.batch.eb_discount);
//                 $('input[name="eb_discount"]').blur();

//                 $('input[name="eb_max_days"]').focus();
//                 $('input[name="eb_max_days"]').val(response.batch.eb_max_days);
//                 $('input[name="eb_max_days"]').blur();

//                 $('input[name="batch_price"]').focus();
//                 $('input[name="batch_price"]').val(response.batch.batch_price);
//                 $('input[name="batch_price"]').blur();

               
//                 $('input[name="batch_start_date"]').val(response.batch.batch_start_date);
//                 $('input[name="batch_start_date"]').blur();
                
                
//                 $('input[name="batch_end_date"]').val(response.batch.batch_end_date);
//                 $('input[name="batch_end_date"]').blur();
                
                 
//                 $('input[name="enrollment_start_date"]').val(response.batch.enr_start_date);
//                 $('input[name="enrollment_start_date"]').blur();
                  
//                 $('input[name="enrollment_end_date"]').val(response.batch.enr_end_date);
//                 $('input[name="enrollment_end_date"]').blur();
                
//                 $('textarea[name="batch_description"]').val(response.batch.batch_description);
//                 $('textarea[name="batch_description"]').blur();
                
//                 $('input[name="batch_duration"]').val(response.batch.batch_duration_in_months);
//                 $('input[name="batch_duration"]').blur();

//                 $('input[name="session_duration"]').val(response.batch.session_duration_in_minutes);
//                 $('input[name="session_duration"]').blur();

//                 $('input[name="total_sessions"]').val(response.batch.total_sessions);
//                 $('input[name="total_sessions"]').blur();
             
//                 $('input[name="hidden_batch_id"]').val(response.batch.id);
              
//                 if (response.batch.status ==1) {
//                     $('.active').prop('checked', true);
//                 }else{
//                     $('.inactive').prop('checked', true);

//                 } 
                
//             }
//         });
// })
$(document).on('click','.status_change_batch',function(){
   
    var id              =   $(this).attr('id');
    var batch_status    =   '';
    var current_status  =   $(this).attr('data-value');
    if(current_status == 1){
        batch_status      =   0;
    }else{
        batch_status      =   1;
    }
    var CurrentRef      =   $(this);
    CurrentRef.attr('disabled', 'disabled');
    $.ajax({
        type    :   'POST',
        url     :   `/batch-status-change`,
        data    :   {
            _token        :   $('meta[name="csrf_token"]').attr('content'),
            id            :   id,
            batch_status  :   batch_status,
        },
        success :   function (response) {
            CurrentRef.attr('disabled', false);
            if(response.msg == 'status_change'){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Batch Status Updated');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                all_batches_list();
            }
        }
    });
})
function all_batches_list(){
    $('.loader').show();
    $('.batch_list').empty();
    $.ajax({
        type    :   'GET',
        url     :   '/all-batches-list',
        success :   function(response){
            $('.batch_list').append('<table class="table table-hover dt-responsive nowrap batchListTable" style="width:100%;"><thead><tr><th>S.No</th><th>Course Code</th><th>Batch Code</th><th>Batch Title</th><th>Started From</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.batchListTable tbody').empty();
            response.batches.forEach((element, key) => {
                $('.batchListTable tbody').append(`
                    <tr>
                        <td>${key + 1}</td>
                        <td>${element['course_code']}</td>
                        <td>${element['batch_code']}</td>
                        <td>${element['batch_title']}</td>
                        <td>${element['batch_start_date']}</td>
                        <td>
                            <a href="/edit-batch/${element['id']}" id="${element['id']}" class="btn btn-default   edit_batch">Edit</a>
                            <button id="${element['id']}" class="btn btn-default status_change_batch" 
                                data-value="${element.status}">${element.status==1 ? 'Active' : 'Inactive'}</button>
                            <button id="${element['id']}" class="btn btn-default ${element.delete_status==1 ? 'red-bg' : 'btn-line'}   delete_batch" data-value="${element.delete_status}" >${element.delete_status==1 ? 'Delete' : 'Restore'}</button>

                        </td>
                    </tr>`);
            });
            $('.batchListTable').fadeIn();
            $('.batchListTable').DataTable();
            $('.loader').hide();
        }
    })
}
$(document).on('click', '.delete_batch', function () {
    var id = $(this).attr('id');
    var delete_status    =   '';
    var current_status  =   $(this).attr('data-value');
    if(current_status == 1){
        delete_status      =   0;
    }else{
        delete_status      =   1;
    }
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
                url: '/delete-batch',
                data: {
                    _token        :  $('meta[name="csrf_token"]').attr('content'),
                    id            :  id,
                    delete_status :  delete_status
                },
                success: function (response) {
                    if (response.status == 'success') {
                        all_batches_list();
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
$('#course_list').on('change',function(){
    var course_id  =    $(this).val();
    if(course_id > 0){
    $('.batch_price').prop("readonly", false);
    $('.batch_price').val('');
    var get_selected_course = all_courses.filter( x => x.id == course_id);
        if(get_selected_course[0].course_price > 0)
        {
            $('.batch_price').val(get_selected_course[0].course_price).focus();
            $('input[name="batch_price_usd"]').val(get_selected_course[0].course_price_usd).focus();
            $('.batch_price').prop("readonly", true);
        }
    }
   
})
$('.add_slot').on('click',function(){
    var flag = true;
    if($('#sesssion_duration').val() == '' || $('#sesssion_duration').val() == 0 ){
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text("Please Add Seession Duration First ");
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        flag = false;
        $('#sesssion_duration').focus();
        return;
    }
    current_start_time    =  $('.start_time').val(); 
    current_end_time      =  $('.end_time').val(); 
    if( current_start_time != '' &&  current_end_time != '') 
    {
        multiple_slots.filter(function(x){
            if(x.start_time == current_start_time && x.end_time == current_end_time){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text("Slot already Added");
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                flag = false;
                return;
                }
        });
        if(flag == true)
        {   var session_duration   =    $('#sesssion_duration').val();
            valueStart = $("#start_time").val();
            valueStop  = $("#end_time").val();
            if(valueStart == valueStop){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text("Time should  be different");
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                flag = false;
                return;
            }
            var str0="01/01/1970 " + valueStart;
            var str1="01/01/1970 " + valueStop;
            var diff=(Date.parse(str1)-Date.parse(str0))/1000/60;
            if(diff > session_duration || diff < session_duration){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text("Slot duration should be equal to "+session_duration+" minutes");
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                flag = false;
                return;
            }else{
                slot_id = slot_id+1;
                multiple_slots.push({
                    'id'         : slot_id,
                'start_time'     : current_start_time,
                'end_time'       : current_end_time,
                'slot_id' :     '0'
                });
                if(multiple_slots.length > 0){
                    $('#sesssion_duration').attr('readonly',true);
                }
               
                $(`.multiple_slots_tbl`).empty();
                multiple_slots.forEach(function(data,key) {
                    $(`.multiple_slots_tbl`).append(`
                        <tr id="#new-row-">
                        <td style="width:100px">${key+1}</td>
                        <td style="width:250">${data.start_time}</td>
                        <td>${data.end_time}</td>
                        <td><button class="btn btn-primary red-bg  remove" id="${data.start_time}" ><i class="fa fa-trash"></i></button>
                        </td>
                    </tr>`
                    );
                })
            }
            }
    }else{
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please Select Time First');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
    }
    $('.start_time').val(''); 
    $('.end_time').val(''); 
})
$(document).on('click','.remove',function(){
    $(this).parent().parent().remove();
    var row_id  = $(this).attr('id');
       // $(`#new-row-${row_id}`).remove();
    multiple_slots = multiple_slots.filter(x => x.start_time != row_id);
    if(multiple_slots.length == 0){
        $('#sesssion_duration').removeAttr('readonly');
    }
})

