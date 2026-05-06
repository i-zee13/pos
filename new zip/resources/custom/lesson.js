///runwatch
// import swal from 'sweetalert';
let deleteRef   = '';
$(document).ready(function(){
    CKEDITOR.replace( 'faq_answer',
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
$(document).on('click','.add_lesson',function(){
    openSidebar();
    CKEDITOR.instances['faq_answer'].setData();
    $('#saveLessonForm')[0].reset();

    $('input[name="title"]').focus();
    $('input[name="title"]').blur();

    // $('input[name="sequence"]').focus();
    $('input[name="sequence"]').blur();
    $('input[name="hidden_lesson_id"]').val('');
})
$(document).on('click', '#save-lesson', function () {
let dirty = false;
var lesson_description    =   CKEDITOR.instances['faq_answer'].getData();
    $('.lesson-required').each(function () {
        if (!$(this).val()) {
            dirty = true;
        }
    });  
    if(lesson_description == '')
    {
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
   
    $('#saveLessonForm').ajaxSubmit({
        type    :   "POST",
        url     :   "/save-lesson",
         data   :   {
                    'lesson_description'    :   lesson_description
                    },
        success :   function(response){
            CurrentRef.attr('disabled', false);
            CurrentRef.text('Save');
            if(response.status == 'success'){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Lesson has been Added');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                $('#saveLessonForm')[0].reset();
                CKEDITOR.instances['faq_answer'].setData();
                closeSidebar();
                all_lessones_list();
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
});
$(document).on('click','.edit_lesson',function(){
    openSidebar();
    var id = $(this).attr('id');
    var CurrentRef = $(this);
    CurrentRef.attr('disabled', 'disabled');
    CurrentRef.text('Processing...');
        $.ajax({
            type    :   'GET',
            url     :   `/get-lesson/${id}`,
            success :   function (response) {
                CurrentRef.attr('disabled', false);
                CurrentRef.text('Edit');
               
                $('input[name="title"]').focus();
                $('input[name="title"]').val(response.lesson.title);
                $('input[name="title"]').blur();

                $('textarea[name="faq_answer"]').focus();
                CKEDITOR.instances['faq_answer'].setData(response.lesson.description);
                $('textarea[name="faq_answer"]').blur();

                $('input[name="sequence"]').focus();
                $('input[name="sequence"]').val(response.lesson.sequence);
                $('input[name="sequence"]').blur();

                $('input[name="hidden_lesson_id"]').val(response.lesson.id);
                
            }
        });
})

function all_lessones_list(){
    $('.loader').show();
    var course_id   =  $('.course_id').val();
    $('.lesson_list').empty();
    $.ajax({
        type    :   'GET',
        url     :   `/all-lesson-list/${course_id}`,
        success :   function(response){
            $('.lesson_list').append('<table class="table table-hover dt-responsive nowrap lessonListTable" style="width:100%;"><thead><tr><th>S.No</th><th>Title</th><th>Description</th><th>Sequence</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.lessonListTable tbody').empty();
            response.lessons.forEach((element, key) => {
                $('.lessonListTable tbody').append(`
                    <tr>
                        <td>${key + 1}</td>
                        <td>${element['title']}</td>
                        <td>${element['description']}</td>
                        <td>${element['sequence']}</td>
                        <td>
                            <button id="${element['id']}" class="btn btn-default btn-line edit_lesson">Edit</button>
                            <button id="${element['id']}" class="btn btn-default red-bg delete_lesson">Delete</button>
                        </td>
                    </tr>`);
            });
            $('.lessonListTable').fadeIn();
            $('.lessonListTable').DataTable();
            $('.loader').hide();
        }
    })
}
//Delete Faq
$(document).on('click', '.delete_lesson', function () {
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
                url: '/delete-lesson',
                data: {
                    _token: $('meta[name="csrf_token"]').attr('content'),
                    id: id
                },
                success: function (response) {
                    if (response.status == 'success') {
                        
                        all_lessones_list();
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
all_lessones_list()