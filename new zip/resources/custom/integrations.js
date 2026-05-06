//integrations js custom file

function SaveIntegration(){
    var integrationID   =   $('input[name="integrationID"]').val();
    $('#SaveIntegrationBtn').attr('disabled', 'disabled');
    $('.btn-cancel').attr('disabled', 'disabled');
    $('#SaveIntegrationBtn').text('Processing..');
    $.post(
        '/update-integration/'+integrationID,
        $("#integrationForm").serialize(),
        function(response) {
            if(response.status == 'success'){
                $('#SaveIntegrationBtn').text('Done');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text(response.msg);
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                    window.location   =   "/integration/"+integrationID;
                }, 3000);
            }else {
                $('#SaveIntegrationBtn').removeAttr('disabled');;
                $('.btn-cancel').removeAttr('disabled');
                $('#SaveIntegrationBtn').text('Save');
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text(response.msg);
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
    });
}


