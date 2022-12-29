 
let b_type      = '';
let p_service   = '';
let s_service   = '';
let s_s_service = '';
$(document).ready(function(){
     
   var editor = CKEDITOR.replace( 'ckeditor',
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
    CKFinder.setupCKEditor( editor );
    CKEDITOR.config.fontSize_defaultLabel       =   '12px';
    CKEDITOR.config.fontSize_defaultParagraph   =   '12px';
    CKEDITOR.config.fontSize                    =   '12 Pixels/12px;Big/2.3em;30 Percent More/130%;Bigger/larger;Very Small/x-small';
    b_type      = $('#b_type').val();
    p_service   = $('#p_service').val();
    s_service   = $('#s_service').val();
    s_s_service = $('#s_s_service').val();
    $('select[name="blog_type"]').focus();
    $('select[name="blog_type"]').val(b_type).trigger('change');
    $('select[name="blog_type"]').blur();
    $('select[name="primary_service_id"]').val(p_service).trigger('change');
})
$('#blog_type').change(function(){
    var type_id = $(this).val();
    if(type_id == 2){
        $('.services_row').show();
        $('.services-info').addClass('blog-required');
    }else{
        $('.services-info').removeClass('blog-required');
        $('.services_row').hide();
        $('#primary_service_id').val(0).trigger('change');
        $('#secondary_services').val(0).trigger('change');
        // $('#sub_secondary_services').val(0).trigger('change');
    }
})
$(document).on('click', '#save-blog', function () {
    let dirty = false;
    $('.blog-required').each(function () {
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
    var blog_details    =   CKEDITOR.instances['ckeditor'].getData();
    
    $('#SaveBlogForm').ajaxSubmit({
        type    :   "POST",
        url     :   "/save-blog",
        data    :   {
            blog_details    :   blog_details
        },
        cache   :   false,
        success :   function(response){
            CurrentRef.attr('disabled', false);
            CurrentRef.text('Save');
            if (response.msg == 'blog_added'){
                $('#SaveBlogForm')[0].reset();
                $('.cke_editable p').empty();
                $('.dropify-preview').css('display','none');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Blog Added');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                    window.location = '/blogs';
                }, 1000);
            }
            else if (response.msg == 'blog_image_required'){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Upload Blog Thumbnail Image');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
            else if (response.msg == 'cover_image_required'){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Upload Blog Cover Image');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
            else if (response.msg == 'title_already_exists'){
                $('#title').focus();
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Blog Title Already Exists');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
            else{
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Not added at this moment');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
        },
        error   :   function(e){
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Not added at this moment');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
        }
    })
})

$('#primary_service_id').change(function(){
    $('#secondary_services').empty();
    // $('#sub_secondary_services').empty();
    // $("#sub_secondary_services").append(`<option value="0">Sub Secondary Services</option>`);
    var primary_service_id = $(this).val();
    $.ajax({
        url     :   `/get-sub-category-against-main-cat/${primary_service_id}`,
        success :   function(response){
            $("#secondary_services").append(`<option value="0">Sub Categories</option>`).focus();
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
 
$('#title').keyup(function(){
    var blog_title = $(this).val();
    str = blog_title.replace(/\s+/g, '-').toLowerCase();
            $('#blog-slug').val(str)
            $('#page_slug').val(str)
    
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

$(document).on('click', '.dropify-clear', function () {
    var old_input_name = $(this).parent().children('input').attr('data-old_input');
    $('input[name="' + old_input_name + '"]').val('');
});