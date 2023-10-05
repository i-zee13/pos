var segments = location.href.split('/');

$(document).ready(function(){
    $("#save").click(function(){
        var action_type =   $(this).attr('action_type');
        if( $.trim($('input[name="name"]').val()) != '' ){

            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'blue');
            $('#notifDiv').text('Saving....');
            var id          =   Number($(this).attr('form_type_id'));
            var name        =   $('input[name="name"]').val();
            var document    =   CKEDITOR.instances['ckeditor'].getData();
            var url         =   action_type == 'update' ? `/intake-form-type/${id}/edit` : "/intake-form-type"
            $.ajax({
                url: url,
                type: "POST",
                data: {
                    name   : name,
                    document: document
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                cache: false,
                success: function(response){

                    if(response.status=='success'){

                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text(response.msg);
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                            window.location = '/intake-form-type';
                        }, 1000);
                    }
                    else {

                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text(response.msg);
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }

                }
            });
        }else{
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Name field is missing.');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 5000);
        }
    });

    CKEDITOR.replace( 'ckeditor',
        {
            height: '500px',
            toolbar : 'Classic',
            removePlugins: 'link,image,blockquote',
            toolbarStartupExpanded : false,
        });
    CKEDITOR.config.extraPlugins = 'justify';
    CKEDITOR.config.fontSize_defaultLabel = '12px';
    CKEDITOR.config.fontSize_defaultParagraph = '12px';

});