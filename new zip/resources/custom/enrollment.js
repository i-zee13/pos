///runwatch
// import swal from 'sweetalert';
let deleteRef   = '';
let p_service   = '';
let s_service   = '';
let s_s_service = '';
let batches     = [];
let sessions    = [];
let banks       = [];
let filter_batches = [];
let batch_price_after_discount = 0;
let total_amount = 0;
let registraion_amount = 0;
let batch_price_after_subscription = 0;
let after_extra_diss = 0;
let extra = 0;


var segments = location.href.split('/');
$(document).ready(function(){
    if (segments[3] == "create-enrollment") { 
        $.ajax({
            'url'   :   '/all-batches-sessions',
            'type'  :   'get',
            success :   function(response){
                batches  =   response.batches;
                sessions =   response.sessions;
            }
        })
        // $.ajax({
        //     'url'   :   '/get-banks',
        //     'type'  :   'get',
        //     success :   function(response){
        //         banks  =   response.banks;
        //     }
        // })
    }
    if (segments[3] == "enrollment-detail") { 
        $.ajax({
            'url'   :   '/get-banks',
            'type'  :   'get',
            success :   function(response){
                banks  =   response.banks;
            }
        })
    }
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
})


$(document).on('click','.add_enrollment',function(){
    openSidebar();
  
    $('#SaveEnrollmentForm')[0].reset();
    $('input[name="faq_question"]').focus();
    $('input[name="faq_question"]').blur();
    $('select[name="faq_type"]').trigger('change');
})

$('.btn_save_enrollment').click(function(){
    let dirty = false;
    $('.required').each(function () {
        if (!$(this).val() || $(this).val() == 0) {
            dirty = false;
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
    $('#course_form').ajaxSubmit({
        url     :   '/save-enrollment',
        type    :   'post',
        success :   function(response){
            if (response.status == "error") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'Red');
                $('#notifDiv').text('Image Should Not be Empty');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            } if (response.status == "success") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'Green');
                $('#notifDiv').text('Course has been Addedd Successfully');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 1500);
                setTimeout(() => {
                    window.location = "/enrollments";
                    $('#notifDiv').fadeOut();
                }, 1000);
            }
            if (response.status == "success_with_method_gateway") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'Green');
                $('#notifDiv').text('Course has been Addedd Successfully');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 1500);
                setTimeout(() => {
                 window.location = '/generate-invoice-pdf/'+response.last_enr_id; 
                    $('#notifDiv').fadeOut();
                }, 1000);
            }
        },
        error: function (e) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Not Added at this Moment');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
        }
    });
     
 })
 $('.btn_add_payment').click(function(){
    var enrollment_id   =   $(this).attr('data-id');
    let dirty = false;
    $('.required').each(function () {
        if (!$(this).val() || $(this).val() == 0) {
            dirty = true;
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
    $('#manual_pay_form').ajaxSubmit({
        url     :   '/save-enrollment-payment/'+enrollment_id,
        type    :   'post',
        success :   function(response){
            if (response.status == "error") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'Red');
                $('#notifDiv').text('Image Should Not be Empty');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            } if (response.status == "success") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'Green');
                $('#notifDiv').text('Payment has been Addedd Successfully');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 1500);
                // setTimeout(() => {
                //     window.location = "/enrollment-detail/"+response.last_enr_id;
                //     $('#notifDiv').fadeOut();
                // }, 1000);
            }
        },
        error: function (e) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Not Added at this Moment');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
        }
    });
     
 })
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
                all_enrollment_list();
            }
        }
    });
})
function all_enrollment_list(){
    $('.enrollment_list').empty();
    $.ajax({
        type    :   'GET',
        url     :   '/all-enrollment-list',
        success :   function(response){
            $('.enrollment_list').append(`
            <table class="table table-hover dt-responsive nowrap EnrollmentListTable" style="width:100%;">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Student</th>
                        <th>Session</th>
                        <th>Batch</th>
                        <th>Course</th>
                        <th>Enroll Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
            <tbody></tbody>
            </table>`
            );
            $('.EnrollmentListTable tbody').empty();
            response.enrollment.forEach((element, key) => {
                $('.EnrollmentListTable tbody').append(`
                    <tr>
                        <td>${key + 1}</td>
                        <td>${element['student_code']}</td>
                        <td>${element['session_code']}</td>
                        <td>${element['batch_code']}</td>
                        <td>${element['course_code']}</td>
                        <td>${element['enrollment_date']}</td>

                        <td>
                            <button id="${element['id']}" class="btn btn-default btn-line edit_faq">
                            Edit
                            </button>
                            <button id="${element['id']}" class="btn btn-default red-bg delete_faq">Delete</button>
                            <button id="${element['id']}" class="btn btn-default status_change_faq" data-value="${element.status}">${element.status==1 ? 'Active' : 'Inactive'}</button>
                        </td>
                    </tr>`);
            });
            $('.EnrollmentListTable').fadeIn();
            $('.EnrollmentListTable').DataTable();
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
                        all_enrollment_list();
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
$(document).on('change','.courses',function(){
    $('.batches').empty();
    $('.sessions').empty();
    $('.batch_price').val('');
    $('#discount').val('');
    $('#batch_price_after_discount').val('');
   var course_id   =   $(this).val();
   var course_duration   =   $('option:selected', this).attr('data-duration');
   $('input[name="course_duration"]').val(course_duration); 

    filter_batches =   batches.filter(x=> x.course_id == course_id);
    $('.batches').append(`<option value="0">Select Batch Code</option>`);
    $('.sessions').append(`<option value="0">Select Session Code</option>`);

    filter_batches.forEach(data=>{
        $('.batches').append(`<option value="${data.id}">${data.batch_code}</option>`);
       
    })
})
$(document).on('change','.batches',function(){
    var batch_id = $(this).val();
    batch_price_after_discount = '';
    var geting_batch_price =   filter_batches.filter(x=> x.id == batch_id);
    var batch_price        =   geting_batch_price[0].batch_price;
    var discount          =   geting_batch_price[0].campaign_discount;
    if(geting_batch_price[0].discount_type == 1){
        batch_price_after_discount =   batch_price - discount;
    }else{
        batch_price_after_discount =  batch_price-((batch_price/100)*discount);
        discount                   =   (batch_price/100)*discount
    }
    console.log(geting_batch_price[0].discount_type)
    $('input[name="batch_start_date"]').val(geting_batch_price[0].batch_start_date);
    $('input[name="batch_end_date"]').val(geting_batch_price[0].batch_end_date);
    $('input[name="campaign_discount_type"]').val(geting_batch_price[0].discount_type);
    $('input[name="sale_campaign_id"]').val(geting_batch_price[0].compaign_id);
    $('input[name="batch_slot_id"]').val(geting_batch_price[0].batch_slot_id);
    

    $('#discount').val('');
    $('#discount').val(discount);

    $('.batch_price').val('');
    $('.batch_price').val(batch_price);
    
    $('#batch_price_after_discount').val('');
    $('#batch_price_after_discount').val(batch_price_after_discount);

    var filter_sessions =   sessions.filter(x=> x.batch_id == batch_id);
     $('.sessions').empty();
     $('.sessions').append(`<option value="0">Select Session Code</option>`);
     filter_sessions.forEach(data=>{
         $('.sessions').append(`<option value="${data.id}">${data.session_code}  </option>`);
     })
 })
 $('.extra_discount').on('input',function(){
   if($('#course_subscription_method').val() == 0){
    $('#notifDiv').fadeIn();
    $('#notifDiv').css('background', 'red');
    $('#notifDiv').text('Please Select Subscription Method First');
    $(this).val(0)
    setTimeout(() => {
        $('#notifDiv').fadeOut();
    }, 1500);
   }
    extra   = $(this).val();
    after_extra_diss = total_amount-extra;
    $('.total_amount').val(after_extra_diss);

 })
//  $('.registraion_amount').on('input',function(){
//     if($(this).val() != ''){
//         registraion_amount =  $(this).val();
//     }else{
//         registraion_amount =  0;
//     }
//      if(batch_price_after_subscription == 0){
//          total_amount = parseInt(registraion_amount)+parseInt(batch_price_after_discount);
//      }else{
//          total_amount = parseInt(registraion_amount)+parseInt(batch_price_after_subscription);
//      }
//      $('.total_amount').val(total_amount-extra);
//  })
$(document).on('change','#course_subscription_method',function(){
    var subscription_method  = $(this).val()
    if(subscription_method == 1){
        batch_price_after_subscription = batch_price_after_discount*1
    }else if(subscription_method == 2){
        batch_price_after_subscription = batch_price_after_discount*2
    }else if(subscription_method == 3){
        batch_price_after_subscription = batch_price_after_discount*3
    }else if(subscription_method == 4){
        batch_price_after_subscription = batch_price_after_discount*4
    }else if(subscription_method == 5){
        batch_price_after_subscription = batch_price_after_discount*5
    }else if(subscription_method == 6){
        batch_price_after_subscription = batch_price_after_discount*6
    }else if(subscription_method == 7){
        batch_price_after_subscription = batch_price_after_discount*7
    }else if(subscription_method == 8){
        batch_price_after_subscription = batch_price_after_discount*8
    }else if(subscription_method == 9){
        batch_price_after_subscription = batch_price_after_discount*9
    }else if(subscription_method == 10){
        batch_price_after_subscription = batch_price_after_discount*10
    }else if(subscription_method == 11){
        batch_price_after_subscription = batch_price_after_discount*11
    }else{
        batch_price_after_subscription = batch_price_after_discount*12
    }
    total_amount = parseInt(registraion_amount)+parseInt(batch_price_after_subscription);
    $('.total_amount').val(total_amount-extra);
})
$(document).on('change','#payment_method',function(){
    var enr_id = $('option:selected', this).attr('enr-id')
    if($(this).val() == 2){
        // window.location = '/generate-invoice-pdf/'+enr_id; 
        $('#manual_pay_div').css('display','none');
    }else{
        $('#manual_pay_div').css('display','');
    }
})
// $(".comapny_account_name").change(function () {
//     $('.comapny_account').empty();
//     var bank_id = $(this).val();
//       var get_accounts    = banks.filter(x=>x.bank_id == bank_id)
//       console.log(get_accounts)
//             $(".comapny_account").focus();
//             $(".comapny_account").append(`<option value="-1">Select Account #</option>`);
//             get_accounts.forEach(data => {
//                 $(".comapny_account").append(`<option value="${data.id}">${data.acc_number}</option>`)
//             })
// })

$(document).on('click',`.approval`,function(){
    var current_status = $('.approval').val();
    if(current_status == 0){
        $(this).val(1);
    }else{
        $(this).val(0);
    }
})
all_enrollment_list();