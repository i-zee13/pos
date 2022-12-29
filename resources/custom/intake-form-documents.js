var segments = location.href.split('/');

$(document).ready(function(){
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
$(document).on('click','.productlist01',function () {
    $('#witness-name').val('');
    $('#witness-address').val('');
})
$(document).on('click','.save-witness',function () {
    var name    =   $.trim($('#witness-name').val());
    var address =   $.trim($('#witness-address').val());
    if(name != ''){

        $('.Witness-div').append(`<div class="alert" role="alert">
                                    <div class="row witness"  >
                                        <input type="hidden" name="witness_name[]" value="${name}">
                                        <input type="hidden" name="witness_address[]" value="${address}">
                                        <div class="col-4"><strong>Name:</strong> ${name}</div>
                                        <div class="col-8"><strong>Address:</strong> ${address}
                                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                                <span aria-hidden="true">×</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>`);
        $('html, body').animate({
            scrollTop: $(".Witness-div").offset().top
        }, 1000);
        $('#pl-close').click();
        $('#witness-name').val('');
        $('#witness-address').val('');
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'green');
        $('#notifDiv').text('Witness added successfully.');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
    }else{
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please Fill Required Fields (*).');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
    }
});
$(document).on('click','.print_pdf',function () {
    if($('.witness').length> 0){
        $('#intake-documnet').submit();
    }else{
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Witness are missing.');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
    }
});