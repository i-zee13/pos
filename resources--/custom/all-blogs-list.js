// import swal from 'sweetalert';
let deleteRef   = '';
function all_blogs_list(){
    $('.all_blogs').empty();
    $('.loader').show();

    $.ajax({
        type    :   'GET',
        url     :   '/all-blogs-list',
        success :   function(response){
            $('.all_blogs').append('<table class="table table-hover dt-responsive nowrap BlogsListTable" style="width:100%;"><thead><tr><th>S.No</th><th>Date</th><th>Blog Title</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.BlogsListTable tbody').empty();
            response.all_blogs.forEach((element, key) => {
                $('.BlogsListTable tbody').append(`
                    <tr>
                        <td>${key + 1}</td>
                        <td>${element['blog_date'] ? element['blog_date'] : '00-00-0000'}</td>
                        <td>${element['title']}</td>
                        <td>
                            <a href="/edit-blog/${element['id']}" id="${element['id']}" class="btn btn-default btn-line edit_blog"> Edit </a>
                            <button id="${element['id']}" class="btn btn-default red-bg delete_blog">Delete</button>
                            <button id="${element['id']}" class="btn btn-default status_change_blog" data-value="${element.published}">${element.published==1 ? 'Not Published' : 'Published'}</button>
                        </td>
                    </tr>`);
            });
            $('.BlogsListTable').fadeIn();
            $('.BlogsListTable').DataTable();
            $('.loader').hide();
        }
    })
}
// $(document).on('click','.edit_blog',function(){
//     openSidebar();
//     var id = $(this).attr('id');
//     var CurrentRef = $(this);
//     CurrentRef.attr('disabled', 'disabled');
//     CurrentRef.text('Processing...');
//         $.ajax({
//             type    :   'GET',
//             url     :   `/GetBlog/${id}`,
//             success :   function (response) {
//                 window.location = '/edit-blog';
//                 $('select[name="blog_type"]').focus();
//                 $('select[name="blog_type"]').val(response.blog_result.faq_type).trigger('change');
//                 $('select[name="blog_type"]').blur();
//                 $('select[name="primary_service_id"]').val(response.blog_result.primary_service_id).trigger('change');
//                 $('textarea[name="faq_answer"]').focus();
//                 $('textarea[name="faq_answer"]').val(response.blog_result.answer);
//                 $('textarea[name="faq_answer"]').blur();
//                 $('input[name="hidden_blog_id"]').val(response.blog_result.id);
//                 $('#p_service').val(response.blog_result.primary_service_id);
//                 $('#s_service').val(response.blog_result.secondary_service_id);
//                 $('#s_s_service').val(response.blog_result.sub_service_id);
//                 p_service   = $('#p_service').val();
//                 s_service   = $('#s_service').val();
//                 s_s_service = $('#s_s_service').val();
//             }
//         });
// })
$(document).on('click','.status_change_blog',function(){
    var blog_status     =   '';
    var id              =   $(this).attr('id');
    var current_status  =   $(this).attr('data-value');
    if(current_status == 1){
        blog_status     =   0;
    }else{
        blog_status     =   1;
    }
    var CurrentRef      =   $(this);
    CurrentRef.attr('disabled', 'disabled');
    $.ajax({
        type    :   'POST',
        url     :   `/blog-status-change`,
        data    :   {
            _token      :   $('meta[name="csrf_token"]').attr('content'),
            id          :   id,
            blog_status :   blog_status,
        },
        success :   function (response) {
            CurrentRef.attr('disabled', false);
            if(response.msg == 'status_change'){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Blog Status Change');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                all_blogs_list();
            }
        }
    });
})
//Delete Blog
$(document).on('click', '.delete_blog', function () {
    var id = $(this).attr('id');
    deleteRef = $(this);
    swal({
        title   : "Are you sure?",
        // text    : "",
        icon    : "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            var thisRef = $(this);
            deleteRef.attr('disabled', 'disabled');
            deleteRef.text('Processing...');
            var id = $(this).attr('id');
            $.ajax({
                type: 'POST',
                url: '/delete-blog',
                data: {
                    _token: $('meta[name="csrf_token"]').attr('content'),
                    id: id
                },
                success: function (response) {
                    if (response.msg == 'blog_deleted') {
                        all_blogs_list();
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
all_blogs_list();