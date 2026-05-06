///runwatch
// import swal from 'sweetalert';
let deleteRef           =   '';
let all_batches         =   [];
let all_batch_slots    =   [];
let previous_batch_id   =   '';
let batch_id    =   '';
let slot_id     =   '';
 $(document).ready(function(){
    $.ajax({
        url     :   `/active-batches-list-with-slots`,
        type    :   'get',
        success :   function(response){
            all_batches     =   response.batches;   
            all_batch_slots =   response.batch_slots;   
        }
    });
});
$('.datepicker').datepicker({
    autoclose: true,
    todayHighlight: true,
    toggleActive: true,
    pickdate:false,
    format: "hh:mm"
})
    .on('changeDate', function (ev) {
        $(this).datepicker('hide');
    });
$(document).on('click','.add_faqs',function(){
    openSidebar();
    $('.weekday').removeAttr('checked');
    $('#saveSessionForm')[0].reset();
    $('input[name="session_code"]').focus();
    $('input[name="session_code"]').blur();

    $('input[name="session_title"]').focus();
    $('input[name="session_title"]').blur();

    $('input[name="max_students"]').focus();
    $('input[name="max_students"]').blur();

    $('select[name="course_id"]').val('0').trigger('change');
    $('select[name="primary_teacher_id"]').val('0').trigger('change');
    $('select[name="sub_teacher_id"]').val('0').trigger('change');
    $('input[name="hidden_session_id"]').val('');
})
$(document).on('click', '#save-session', function () {
    let dirty = false;
    $('.session-required').each(function () {
        if (!$(this).val() || $(this).val() == 0) {
            dirty = true;
        }
    });

    if($('input[type=checkbox]:checked').length == 0){
        dirty = true;
   }
   if( $('select[name="primary_teacher_id"]').val() == $('select[name="sub_teacher_id"]').val() ){
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Instructor Should not be Same');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
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
   
    $('#saveSessionForm').ajaxSubmit({
        type    :   "POST",
        url     :   "/save-session",
        success :   function(response){
            CurrentRef.attr('disabled', false);
            CurrentRef.text('Save');
            
            if(response.status == 'success'){
                $('.loader').show();
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Session has been Added');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                $('#saveSessionForm')[0].reset();
                closeSidebar();
                all_sessions_list();
            }
            if(response.status == 'duplicate'){
                $('.loader').show();
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Session Code already Exist.');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            } 
            if(response.status == 'error'){
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
$(document).on('click','.edit_session',function(){
   
    openSidebar();
    $('.weekday').prop('checked',false);
    var id = $(this).attr('id');
    var CurrentRef = $(this);
    CurrentRef.attr('disabled', 'disabled');
    CurrentRef.text('Processing...');
        $.ajax({
            type    :   'GET',
            url     :   `/get-session/${id}`,
            success :   function (response) {
                console.log(response.session);
                CurrentRef.attr('disabled', false);
                CurrentRef.text('Edit');
                batch_id    =   response.session.batch_id;
                slot_id    =   response.session.slot_id;
                $('select[name="course_id"]').focus();
                $('select[name="course_id"]').val(response.session.course_id).trigger('change');
                $('select[name="course_id"]').blur();

                $('select[name="primary_teacher_id"]').focus();
                $('select[name="primary_teacher_id"]').val(response.session.primary_teacher_id).trigger('change');
                $('select[name="primary_teacher_id"]').blur();

                $('select[name="sub_teacher_id"]').focus();
                $('select[name="sub_teacher_id"]').val(response.session.sub_teacher_id).trigger('change');
                $('select[name="sub_teacher_id"]').blur();

                $('input[name="session_code"]').focus();
                $('input[name="session_code"]').val(response.session.session_code);
                $('input[name="session_code"]').blur();

                $('input[name="max_students"]').focus();
                $('input[name="max_students"]').val(response.session.max_students);
                $('input[name="max_students"]').blur();
               
                // $('input[name="start_time"]').focus();
                // $('input[name="start_time"]').val(response.session.start_time);
                // $('input[name="start_time"]').blur();

                // $('input[name="end_time"]').focus();
                // $('input[name="end_time"]').val(response.session.end_time);
                // $('input[name="end_time"]').blur();

                $('input[name="eb_max_days"]').focus();
                $('input[name="eb_max_days"]').val(response.session.eb_max_days);
                $('input[name="eb_max_days"]').blur();

               
                $('input[name="session_start_date"]').val(response.session.session_start_date);
                $('input[name="session_start_date"]').blur();
                
                
                $('input[name="session_end_date"]').val(response.session.session_end_date);
                $('input[name="session_end_date"]').blur();
                
             
                $('input[name="hidden_session_id"]').val(response.session.id);
                $('input[name="hidden_session_day_id"]').val(response.session.session_day_id);
               
              response.day.forEach(day =>{
                if(day == 1){
                    $('#weekday-mon').prop('checked', true);
                }else if(day == '2'){
                    $('#weekday-tue').prop('checked', true);
                }else if(day == '3'){
                    $('#weekday-wed').prop('checked', true);
                }else if(day == '4'){
                    $('#weekday-thu').prop('checked', true);
                }else if(day == '5'){
                    $('#weekday-fri').prop('checked', true);
                }else if(day == '6'){
                    $('#weekday-sat').prop('checked', true);
                }else {
                    $('#weekday-sun').prop('checked', true);
                }
              })
              if(response.day.length == '7'){
                $('#all').prop('checked', true);
              }
            }
        });
})
// $(document).on('click','.status_change_session',function(){
   
//     var id              =   $(this).attr('id');
//     var session_status    =   '';
//     var current_status  =   $(this).attr('data-value');
//     if(current_status == 1){
//         session_status      =   0;
//     }else{
//         session_status      =   1;
//     }
//     var CurrentRef      =   $(this);
//     CurrentRef.attr('disabled', 'disabled');
//     $.ajax({
//         type    :   'POST',
//         url     :   `/session-status-change`,
//         data    :   {
//             _token        :   $('meta[name="csrf_token"]').attr('content'),
//             id            :   id,
//             session_status  :   session_status,
//         },
//         success :   function (response) {
//             CurrentRef.attr('disabled', false);
//             if(response.msg == 'status_change'){
//                 $('#notifDiv').fadeIn();
//                 $('#notifDiv').css('background', 'green');
//                 $('#notifDiv').text('Session Status Updated');
//                 setTimeout(() => {
//                     $('#notifDiv').fadeOut();
//                 }, 3000);
//                 all_sessions_list();
//             }
//         }
//     });
// })
function all_sessions_list(){
    $('.session_list').empty();
    $.ajax({
        type    :   'GET',
        url     :   '/all-sessions-list',
        success :   function(response){
            console.log(response)
          
            $('.session_list').append(`
            <table class="table table-hover dt-responsive nowrap sessionListTable" style="width:100%;">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Course Code</th>
                    <th>Batch Code</th>
                    <th>Session Code</th>
                    <th>Time</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody></tbody>
            </table>`);
            $('.sessionListTable tbody').empty();
            response.sessions.forEach((element, key) => {
                $('.sessionListTable tbody').append(`
                    <tr>
                        <td>${key + 1}</td>
                        <td>${element['course_code']}</td>
                        <td>${element['batch_code']}</td>
                        <td>${element['session_code']}</td>
                        <td>${moment(element.start_time, "hh").format('LT') +' - '+moment(element.end_time, "hh").format('LT')}</td>
                        <td>
                        <button id="${element['id']}" class="btn btn-default   edit_session">Edit</button>
                        <button id="${element['id']}" class="btn btn-default status_change_session" 
                            data-value="${element.status}">${element.status==1 ? 'Active' : 'Inactive'}</button>
                        <button id="${element['id']}" class="btn btn-default ${element.delete_status==1 ? 'red-bg' : 'btn-line'}   delete_session" data-value="${element.delete_status}" >${element.delete_status==1 ? 'Delete' : 'Restore'}</button>

                        </td>
                    </tr>`);
            });
            $('.sessionListTable').fadeIn();
            $('.sessionListTable').DataTable();
            $('.loader').hide();
        }
    })
}
//Delete Faq
$(document).on('click', '.delete_session', function () {
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
                url: '/delete-session',
                data: {
                    _token        :  $('meta[name="csrf_token"]').attr('content'),
                    id            :  id,
                    delete_status :  delete_status
                },
                success: function (response) {
                    if (response.status == 'success') {
                        all_sessions_list();
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
      
});
$('.courses').change(function(){
    var course_id   =   $(this).val();
    var batch       =   all_batches.filter(x => x.course_id == course_id
     );
    if(batch){
        $('#batches').empty();
        $('.slot').empty();
        $('#batches').append(`<option value="0">Select Batch Code</option>`)
        $('.slot').append(`<option value="0">Select Batch Slot</option>`)
        batch.forEach(data => {
            $('#batches').append(`<option value="${data.id}" ${data.id == batch_id ? 'selected' : ''}>${data.batch_code}</option>`);
        });
    }
});
$('#batches').change(function(){
    console.log(slot_id)
    var  batch_id      =   $(this).val();
    var  batch_slots   =   all_batch_slots.filter(x => x.batch_id == batch_id );
    if(batch_slots){
        $('.slot').empty();
        $('.slot').append(`<option value="0">Select Batch Slot</option>`)
        batch_slots.forEach(data => {
            $('.slot').append(`<option value="${data.id}" ${data.id == slot_id ? 'selected' : ''}>${moment(data.start_time, "hh mm").format('LT')} to ${moment(data.end_time, "hh mm").format('LT')}</option>`);
        });
    }
});
$('#all').change(function() {
    $('.weekday').prop("checked", this.checked);
});
$('.weekday').change(function(){
    if($('input:checkbox:checked.weekday').length === $("input:checkbox.weekday").length){
        $('#all').prop("checked",true);
    }
    else{
        $('#all').prop("checked",false);
    }
})
all_sessions_list()