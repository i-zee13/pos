///runwatch
// import swal from 'sweetalert';
let deleteRef   = '';
let p_service   = '';
let s_service   = '';
let s_s_service = '';
$('#datepicker, #datepicker2').datepicker({
    autoclose: true,
    todayHighlight: true,
    toggleActive: true,
    format: dateFormat
})
$(document).ready(function(){
    })
$(document).on('click','.add_coupon',function(){
    openSidebar();
    $('#saveCouponForm')[0].reset();
    // $('input[name="coupon_code"]').focus();
    $('input[name="coupon_code"]').blur();
    $('input[name="discount_amount"]').blur();
    $('input[name="transcations_allowed"]').blur();
    $('input[name="minimum_order_value"]').blur();
    $('select[name="coupon_type"]').trigger('change');
    $('input[name="hidden_coupon_id"]').val('');
})
$('#coupon_type').change(function(){
    var type_id = $(this).val();
    if(type_id == 2){
        $('.services_row').show();
        $('.student-dropdown').addClass('coupon-required');
    }else{
        $('.student-dropdown').removeClass('coupon-required');
        $('.services_row').hide();
        $('#student_id').val(0).trigger('change');
    }
})
$(document).on('click', '#save-coupon', function () {
    let dirty = false;
        $('.coupon-required').each(function () {
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
        var CurrentRef = $(this);
        CurrentRef.attr('disabled', 'disabled');
        CurrentRef.text('Processing...');
        $('#saveCouponForm').ajaxSubmit({
            type    :   "POST",
            url     :   "/save-coupon",
            success :   function(response){
                if(response.status == 'success'){
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Coupon has been Added');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    $('#saveCouponForm')[0].reset();
                    CurrentRef.attr('disabled', false);
                    CurrentRef.text('Save');
                      closeSidebar();
                      all_coupons_list();
                }
                if(response.status == 'duplicate'){
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Coupon Code has already Exist');
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
$(document).on('click','.edit_coupon',function(){
    openSidebar();
    var id = $(this).attr('id');
    var CurrentRef = $(this);
    CurrentRef.attr('disabled', 'disabled');
    CurrentRef.text('Processing...');
        $.ajax({
            type    :   'GET',
            url     :   `/get-coupon/${id}`,
            success :   function (response) {
                CurrentRef.attr('disabled', false);
                CurrentRef.text('Edit');
                $('select[name="coupon_type"]').focus();
                $('select[name="coupon_type"]').val(response.coupon.coupon_type).trigger('change');
                $('select[name="coupon_type"]').blur();

                $('select[name="student_id"]').focus();
                $('select[name="student_id"]').val(response.coupon.student_id).trigger('change');
                $('select[name="student_id"]').blur();
               
                $('input[name="coupon_code"]').focus();
                $('input[name="coupon_code"]').val(response.coupon.coupon_code);
                $('input[name="coupon_code"]').blur();

                $('select[name="discount_type"]').focus();
                $('select[name="discount_type"]').val(response.coupon.discount_type).trigger('change');
                $('select[name="discount_type"]').blur();
               
                $('input[name="discount_amount"]').focus();
                $('input[name="discount_amount"]').val(response.coupon.discount_amount);
                $('input[name="discount_amount"]').blur();
                

                $('input[name="transcations_allowed"]').focus();
                $('input[name="transcations_allowed"]').val(response.coupon.transcations_allowed);
                $('input[name="transcations_allowed"]').blur();

                $('input[name="minimum_order_value"]').focus();
                $('input[name="minimum_order_value"]').val(response.coupon.minimum_order_value);
                $('input[name="minimum_order_value"]').blur();
               
                $('input[name="start_date"]').val(response.coupon.start_date);
                $('input[name="start_date"]').blur();
                
                $('input[name="end_date"]').val(response.coupon.end_date);
                $('input[name="end_date"]').blur();
             
                $('input[name="hidden_coupon_id"]').val(response.coupon.id);
                $('input[name="hidden_status"]').val(response.coupon.status);
              
                
                
            }
        });
})
$(document).on('click','.status_change_coupon',function(){
    var coupon_status   =   '';
    var id              =   $(this).attr('id');
    var current_status  =   $(this).attr('data-value');
    if(current_status == 1){
        coupon_status   =   2;
    }else{
        coupon_status   =   1;
    }
    var CurrentRef      =   $(this);
    CurrentRef.attr('disabled', 'disabled');
    $.ajax({
        type    :   'POST',
        url     :   `/coupon-status-change`,
        data    :   {
            _token         :   $('meta[name="csrf_token"]').attr('content'),
            id             :   id,
            coupon_status  :   coupon_status,
        },
        success :   function (response) {
            CurrentRef.attr('disabled', false);
            if(response.msg == 'status_change'){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Coupon Status Change');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
               all_coupons_list();
            }
        }
    });
})
function all_coupons_list(){
    $('.loader').show();
    $('.coupons_list').empty();
    $.ajax({
        type    :   'GET',
        url     :   '/all-coupons-list',
        success :   function(response){
            $('.coupons_list').append(`
            <table class="table table-hover dt-responsive nowrap couponListTable" style="width:100%;">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Coupon Code</th>
                        <th>Coupon Type</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>`);
            $('.couponListTable tbody').empty();
            response.coupons.forEach((element, key) => {
                $('.couponListTable tbody').append(`
                    <tr>
                        <td>${key + 1}</td>
                        <td>${element['coupon_code']}</td>
                        <td>${element['coupon_type'] == 1 ? 'Generic' : 'Specific Student'}</td>
                        <td>${element['start_date']}</td>
                        <td>${element['end_date']}</td>
                        <td>
                            <button  id="${element['id']}" class="btn btn-default btn-line edit_coupon">Edit</button>
                            <button id="${element['id']}" class="btn btn-default status_change_coupon" 
                                data-value="${element.status}">${element.status==1 ? 'Active' : element.status==2 ? 'Inactive' : 'Uitlize'}</button>
                        </td>
                    </tr>`);
            });
            $('.couponListTable').fadeIn();
            $('.couponListTable').DataTable();
            $('.loader').hide();
        }
    })
}
$('.discount_type').on('change',function(){
    $('#discount_amount').val('');
    $('#discount_amount').on('input', function () {
        if($('.discount_type').val()==2 && $(this).val() > 100){
            $(this).val('0');
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text("Percantage Should not be greater then 100%");
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
    })
})

all_coupons_list();