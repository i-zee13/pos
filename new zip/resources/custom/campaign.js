let discount_on_batches = [];
let all_courses =   [];
let all_campaign_courses =   [];
let id ='';
$(document).ready(function () {
    id =  $('.hidden_campaign_id').val() 
    if (location.pathname == `/edit-campaign/${id}` && id>0)  {
        $.ajax({
            url      : `/get-campaign-courses/${id}`,
            post     : 'get',
            success  : function(response){
                        response.campaign_courses.forEach(element=>{
                            discount_on_batches.push({
                                'campaign_id' :     element.id,
                                'batch_id'    :     element.batch_id,
                                'course_id'   :     element.course_id,
                            })
                            
                            });
                        } 
        })
getCourses();

    }
 
campaignsList();

$('.discount_type').on('change',function(){
    $('#discount').val('');
    $('#discount').on('input', function () {
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
})
$(document).on('click','.add-btn',function(){
    var batch_id    =  $(this).attr('batch-id')
    var course_id   =  $(this).attr('course-id')
    if($(this).attr('status') == 1){
         $(this).text('Remove')
         $(this).addClass('red-bg')
         $(this).attr('status','0')
         discount_on_batches.push({
            'batch_id'    :     batch_id,
            'course_id'   :     course_id,
            'campaign_id' :     '0'
        })
      
    }else{
        $(this).text('Add')
        $(this).removeClass('red-bg')
        $(this).attr('status','1')
        // $(this).parent().parent().remove();
        var batch_id  = $(this).attr('batch-id');
            // $(`#new-row-${batch_id}`).remove();
            discount_on_batches = discount_on_batches.filter(x => x.batch_id != batch_id);
          
        }
})
$('#save-campaign').on('click',function(){
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
    if(discount_on_batches == ''){
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please Select At least one Course for Campaign');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
   
    $('#form').ajaxSubmit({
        url      :   '/save-campaign',
        type     :   'post',
        data     :   {
                       'discount_on_batches' : discount_on_batches,
                     },
        success  :  function(response){
                    if(response.status == 'success'){
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text("Campaign has been Added");
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                        setTimeout(() => {
                            window.location = "/campaigns";
                            $('#notifDiv').fadeOut();
                        }, 1000);
                    }
                    if(response.status == 'failed'){
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text("Not Added at this Moment");
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }
                    }
    });
})
function getCourses(){
    var url = '';
    if(id != ''){
        url       =   `/get-courses/${id}`;
    }else{
        id=0;
        url       =   `/get-courses/${id}`;
    }
    $.ajax({
        url       :  url,
        type      :   'get',
        success   :   function(response){
            $('.course_list').append(`<table class="table table-hover dt-responsive nowrap CoursesListTable"  style="width:100%">
            <thead>
                <tr>
                    <th>Course Title</th>
                    <th>Course Code</th>
                    <th>Batch Code</th>
                    <th>ACTIONS</th>
                </tr>
            </thead>
            <tbody></tbody></table>`);
            $('.CoursesListTable tbody').empty();
            all_courses =    response.courses;
            
            response.courses.forEach((element,key) => {
                var action_button   = '';
                if(discount_on_batches.some(x => x.batch_id == element['batch_id'])){
                    action_button = `<button type="button" id="add-btn" class="btn btn-default btn-line mb-0 add-btn red-bg" course-id="${element['id']}"  batch-id="${element['batch_id']}" status="0">Remove</button>`
                }else{
                    action_button = `<button type="button" id="add-btn" class="btn btn-default btn-line mb-0 add-btn " course-id="${element['id']}"  batch-id="${element['batch_id']}" status="1">Add</button>`
                }
                $('.CoursesListTable tbody').append(`
                <tr>
                <td>
                    <div class="ProListDiv"><img class="PrList_img" src="/storage/${element['course_thumbnail']}" alt="">
                        <div class="PR_Name">${element['course_title']}</div>
                    </div>
                </td>
                <td><div class="PR_Name">${element['course_code']}</div></td>
                <td><div class="PR_Name">${element['batch_code']}</div></td>
                <td>
                    ${action_button}
                </td>
            </tr>`);
            });
            $('.CoursesListTable').fadeIn();
            $('.CoursesListTable').DataTable();
            $('.loader').hide();
        }
        })
}
function campaignsList(){
    $('.campaigns_list').empty();
    $('.loader').show();
    $.ajax({
        url       :  '/all-campaigns',
        type      :   'get',
        success   :   function(response){
            $('.campaigns_list').append(`
            <table class="table table-hover dt-responsive nowrap CampaignsListTable"  style="width:100%">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Campaign Title</th>
                    <th>Label</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody></tbody></table>`);
            $('.CampaignsListTable tbody').empty();
            all_campaign_courses = response.campaign_courses;

            
 

            response.campaigns.forEach((element,key) => {
               $('.CampaignsListTable tbody').append(`
               <tr>
                <td>${key+1}</td>
                <td>${element['campaign_title']}</td>
                <td>
                   ${element['label_title']}
                <td>
               
                    <a href="/edit-campaign/${element['id']}" class="btn btn-default btn-line edit_faq" style=" ${element['status']==0 ? 'pointer-events: none' : 'pointer-events: block'}"> Edit</a>
                    <button id="${element['id']}" class="btn btn-default red-bg delete_campaign" hidden>Delete</button>
                    <button id="${element['id']}" class="btn btn-default status_change_campaign" compaign-id="" data-value="${element['status']==0 ? '0' : '1'}">${element['status']==0 ? 'Inactive' : 'Active'}</button>
                </td>
                </tr>
                `);
            });
            $('.CampaignsListTable').fadeIn();
            $('.CampaignsListTable').DataTable();
            $('.loader').hide();
        }
        })
}
$('.delete_campaign').on('click',function(){
    var id  =   $(this).attr('id');
    $.ajax({
        url     :  `/delete-campaign/${id}`,
        type    :   'post',
        data: {
            _token: $('meta[name="csrf_token"]').attr('content'),
            id: id
        },
        success :   function(response){
                    if(response.status == 'success'){
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text("Campaign has been Deleted");
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    campaignsList();
                    }
                    if(response.status == 'failed'){
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text("Not Added at this Moment");
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }
                    if(response.msg == 'date_error'){
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text("Start date Should be greate or Equal to Today");
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }
                    
        }
    })
})

$(document).on('click','.status_change_campaign',function(){
     
    var id           =   $(this).attr('id');
    var batch_found  =   '0';
    var data         =   ''
    var duplicate    =   [];
    var current_campaign_courses    =   all_campaign_courses.filter(x => x.campaign_id == id);
    current_campaign_courses.forEach((element)=>{
        duplicate =  all_campaign_courses.filter(function(x) {
            return x.batch_id == element.batch_id;
            })
        duplicate.filter(function(x) { 
            if(x.status != 0){
                data = all_campaign_courses.filter(x => x.batch_id == element.batch_id && x.campaign_id != id && element.status == 0 );
                if(data != ''){
                   batch_found = '1';
                   }
            }
        })
    })
    if(batch_found ==1){
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Same Batch already in Active Compaign');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    var thisRef = $(this);
    thisRef.text('Processing...');
    thisRef.attr('disabled', 'disabled');
    var campaign_status      =   '';
  
    var current_status  =   $(this).attr('data-value');
    if(current_status == 1){
        campaign_status      =   0;
    }else{
        campaign_status      =   1;
    }
    var CurrentRef      =   $(this);
    CurrentRef.attr('disabled', 'disabled');
    $.ajax({
        type    :   'POST',
        url     :   `/campaign-status-change`,
        data    :   {
            _token      :   $('meta[name="csrf_token"]').attr('content'),
            id          :   id,
            campaign_status  :   campaign_status,
        },
        success :   function (response) {
            CurrentRef.attr('disabled', false);
            if(response.msg == 'status_change'){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('campaign Status Change');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                campaignsList();
            }
        }
    });
})
