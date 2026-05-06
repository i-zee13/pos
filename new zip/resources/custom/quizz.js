///runwatch
// import swal from 'sweetalert';
let deleteRef            =   '';
let new_index            =   0;
let question_unique_id   =   '';
let is_correct           =   0;
let radio_value          =   1;
let existing_question_id =   0;
let existing_quizz_id    =   0;
let multiple_answers     =   [];
var segments = location.href.split('/');
let i     =   1;
$(document).ready(function(){
    function Generator() {};
    Generator.prototype.rand =  Math.floor(Math.random() * 10) + Date.now();
    Generator.prototype.getId = function() {
       return this.rand++;
    };
    var idGen =new Generator();
    new_index    =   idGen.rand;
    if (segments[5] == "edit") { 
        getQuestions();
        // $.ajax({
        // url     :   '/get-options-of-question'+existing_question_id,
        // type    :   'get',
        // success :   function(response){
        //     alert("fetchex");
        // }
        // })
    }
    if(location.pathname == "/quizzes"){
        getQuizzes();
     }
})
$(document).on('click','.add_button',function(){
    function Generator() {};
    Generator.prototype.rand =  Math.floor(Math.random() * 10) + Date.now();
    Generator.prototype.getId = function() {
       return this.rand++;
    };
    var idGen =new Generator();
    $('input[name="question_unique_id"]').val(idGen.rand);
    openSidebar();
    existing_question_id = 0
    $('#question_id').val('');
    $('input[name="hidden_quizz_id_for_question"]').val(existing_quizz_id);
    $('.true_false').css('display','none');
    $('.multi_choice').css('display','block');
    $('.new-answer-card').empty();
    addNewAnswer();   
    $('#questionForm')[0].reset();
    // $('input[name="question_type"]').focus();
    // $('input[name="title"]').blur();
    // $('input[name="sequence"]').focus();
    // $('input[name="sequence"]').blur();
    // $('input[name="hidden_lesson_id"]').val('');

})
$(document).on('click', '.save-quizz-btn', function () {
let dirty = false;
    $('.quizz-required').each(function () {
        if (!$(this).val()) {
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
    $('#saveQuizzForm').ajaxSubmit({
        type    :   "POST",
        url     :   "/quizzes",
        success :   function(response){
            if(response.status == 'success'){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Quizz has been Stored, Add Your Questions');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                // $('#saveQuizzForm')[0].reset();
                $('input[name="unique_id"]').val(response.quizz.unique_id);
                $('input[name="title"]').val(response.quizz.title);
                $('input[name="time"]').val(response.quizz.time);
                $('input[name="no_of_attempts"]').val(response.quizz.no_of_attempts);
                $('input[name="pass_marks"]').val(response.quizz.pass_marks);
                $('input[name="hidden_quizz_id"]').val(response.quizz.id);
                CurrentRef.attr('disabled', false);
                CurrentRef.text('Update');
                $('#questions').css('display','block');
                  getQuestions();

            }
            if(response.status == 'failed'){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Not added at this moment');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                CurrentRef.attr('disabled', false);
                CurrentRef.text('Save');
                $('#questions').css('display','none');
            }
            if(response.status == 'duplicate'){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Quizz Already Exist');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                CurrentRef.attr('disabled', false);
                CurrentRef.text('Save');   
            }
        }
    })
});
$(document).on('click', '.save-question-btn', function () {
    let dirty = false;
        $('.question-required').each(function () {
            if (!$(this).val()) {
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
            multiple_answers = [];
            return;
        }
        if(radio_value == 1){
        if($('.add-answer-btn').hasClass('save-answer')){
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Save your Last Answer First (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            multiple_answers = [];
            return;
        }   
        //multi answers arrray 
        $('.answer_div').each((key,element) => {
            var existing_answer_id =  0;
            var uid                =  $(element).attr('data-unique-id');
            existing_answer_id     =  $(element).find('#answer_id').val();
            if(is_correct == 0){
                is_correct         =  $('.correct-'+uid).val()
            }
            multiple_answers.push({
            'uid'             :   uid,
            'answer_id'       :   existing_answer_id,
            'answer_title'    :   $('.title-'+uid).val(),
            'correct_answer'  :   $('.correct-'+uid).val(),
            });
        })
        if(multiple_answers.length == 0){
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Add at Least one Answer  (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
       
        if(is_correct == 0){
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Select Correct Answer.');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            multiple_answers = [];
            return;
         }
        }
        var CurrentRef = $(this);
        CurrentRef.attr('disabled', 'disabled');
        CurrentRef.text('Processing...');
        $('#questionForm').ajaxSubmit({
            type    :   "POST",
            url     :   "/add-question",
            data    :   {
                        'multiple_answers' : multiple_answers
                        },
            success :   function(response){
                if(response.status == 'success'){
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Questions has been Added');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    $('#questionForm')[0].reset();
                    CurrentRef.attr('disabled', false);
                    CurrentRef.text('Save');
                    $('#question_id').val('');
                    existing_question_id  = 0 ;
                    existing_answer_id    = 0 ;
                    multiple_answers = [];
                    is_correct = 0;
                    uid = 0;
                    $('.dropify-clear').click();
                    closeSidebar();
                    getQuestions();

                } if(response.status == 'failed'){
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not added at this moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    CurrentRef.attr('disabled', false);
                    CurrentRef.text('Save');   
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
$(document).on('click','.add-answer',function(){
    function Generator() {};
    Generator.prototype.rand =  Math.floor(Math.random() * 10) + Date.now();
    Generator.prototype.getId = function() {
       return this.rand++;
    };
    var idGen =new Generator();
    new_index    =   idGen.rand
    $(this).addClass('save-answer');
    $(this).removeClass('add-answer');
    $(this).text('Save Answer');
    addNewAnswer();
});
$(document).on('click','.save-answer',function(){
    if ($('.title-'+new_index).val() == '') {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please provide Answer Title first (*)');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
     
    // if(multiple_answers.length==4){
    //     $('#notifDiv').fadeIn();
    //     $('#notifDiv').css('background', 'red');
    //     $('#notifDiv').text('Cant add More then 4');
    //     setTimeout(() => {
    //         $('#notifDiv').fadeOut();
    //     }, 3000);
    //     return;
    // }
    // multiple_answers.push({
    //     'index'           :   new_index,
    
    //     'answer_title'    :   $('.title-'+new_index).val(),
    //     'answer_audio'    :   $('.audio-'+new_index).val(),
    //     'answer_image'    :   $('.image-'+new_index).val(),
    //     'correct_answer'  :   $('.correct-'+new_index).val(),
    //     });
    //  new_index = multiple_answers.length;
   
     $(this).removeClass('save-answer');
     $(this).addClass('add-answer');
     $(this).text('Add an Answer');
     i++;
})
$(document).on('click','.remove',function(){
    $(this).closest(".answer_div").remove();
    // $(this).parent().parent().remove();
    var row_id  = $(this).attr('data-index');
       $(`#new-row-${row_id}`).remove();
    //    multiple_answers = multiple_answers.filter(x => x.index != row_id);
       $('.add-answer-btn').removeClass('save-answer');
       $('.add-answer-btn').addClass('add-answer');
       $('.add-answer-btn').text('Add an Answer');
    // new_index = multiple_answers.length;
   })
//Delete 
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
 function addNewAnswer(){
    $('.new-answer-card').append(
        ` <div class="card p-20 top_border mb-3 answer_div" data-unique-id="${new_index}">
        <h2 class="_head03">Option: <span>${i}</span>
            <div class="switch-div">
                <span>Correct Answer</span>
                <label class="switch">
                    <input type="radio" name="correct_answer" class="correct-${new_index} correct" value="0">
                    <span class="slider round"></span>
                </label>
            </div>
        </h2>
        <div class="form-wrap p-0">
            <div class="row">  
                <div class="col-md-12 pt-5 PB-10">
                    <label class="font12 mb-5">Title</label>
                        <input type="text" id="answer_title" class="form-control title-${new_index}" name="answer_title">
                </div>
               <input type="hidden" name="answer_id" id="answer_id">
                <div class="col-md-4 pr-0">
                    <div class="form-wrap pt-0 pb-0">
                        <label class="font11 mb-5">Audio (Optional)</label>
                        <div class="upload-pic"></div> 
                        <input type="file" id="input-file-now" class=" dropify image audio-${new_index}" name="answer_audio"  accept="audio/*" data-allowed-file-extensions="mp3" data-name ="answer" />
                    </div>
                </div>
                <div class="col-md-4 pr-0">
                    <div class="form-wrap pt-0 pb-0">
                        <label class="font11 mb-5">Image (Optional)</label>
                        <div class="upload-pic"></div>
                        <input type="file" id="input-file-now" class="dropify image image-${new_index}" name="answer_image"  accept="image/*" data-allowed-file-extensions="jpg png jpeg JPEG" data-name="answer" />
                    </div>
                </div>
                <div class="col-md-4">
                    <button title="Delete" data-index="${new_index}" class="btn btn-primary red-bg answer-del remove"><i class="fa fa-trash"></i></button>
                </div>
            </div> 
        </div>
</div>`);
$('.image').dropify();
 }
$(document).on('click',`.correct`,function(){
    $('.correct').val(0);
    $(this).val(1);
})
$(document).ready(function(){
    $('.image').dropify(); //initializing dropify
    $('.dropify-clear').click(function(e){
      e.preventDefault();
      
})
})
$(document).on('focus', 'input:text', function() {
    $(this).closest('form-group').addClass('focused');
});
$(document).on('input', 'input:file', function() {
    
    var current_Clicked =   $(this);
    var file            =   $(this)[0].files[0];   
    var file_name       =   $(this).attr('data-name');
    var answer_id       =   $(this).closest('div.row').find("input[name='answer_id']").val();
    var question_id     =   $('#question_id').val();
    question_unique_id  =   $('input[name="question_unique_id"]').val();

    var fd            =  new FormData();
    fd.append('image', file); 
    fd.append('file_name', file_name); 
    fd.append('answer_unique_id', new_index); 
    fd.append('question_unique_id', question_unique_id); 
    fd.append('answer_id', answer_id); 
    fd.append('question_id', question_id); 
    fd.append('quizz_id', existing_quizz_id); 

        setTimeout(() => {
            // console.log($(this).parent('div').hasClass('has-preview'));
            if($(this).parent('div').hasClass('has-preview')){
              $.ajax({
                url         : '/add-question',  
                data        : fd,
                cache       : false,
                processData : false,
                contentType : false,
                type        : 'POST',
                headers     : {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                             },
              
                success : function(response){
                    if(response.file_name == 'question'){
                        $('#question_id').val(response.id);
                       existing_question_id = response.id;

                    }else{
                       current_Clicked.closest('div.row').find("input[name='answer_id']").val(response.id);
                    // alert(current_Clicked.closest('div.row').find("input[name='answer_id']").val())

                    }
                }
              })
            }
        }, 1000);

});
$(document).on('click','.question_type',function(){
     var thisRef = $(this);
    swal({
        title      : "Are you sure?",
        text       : "All Previous Entries will Removed",
        icon       : "warning",
        buttons    : true,
        dangerMode : true,
        focusCancel: false,
      })
      .then((willDelete) => {
        if (willDelete) {
            $('#multi_question').val(''); 
            $('#true-false-question').val(''); 
            $('#grade').val(''); 
            i = 0;
            if($(this).val()==2){
                thisRef.prop('checked',true);
                radio_value = 2
            $('.true_false').css('display','block');
            $('.multi_choice').css('display','none');
            $('#grade').removeClass('question-required');
            $('#multi_question').removeClass('question-required');
            }else{
                radio_value = 1
                thisRef.prop('checked',true);
            $('.true_false').css('display','none');
            $('.multi_choice').css('display','block');
            $('.new-answer-card').empty();
            $('#grade').addClass('question-required');
            $('#true-false-question').removeClass('question-required');
            $('#multi_question').addClass('question-required');
            addNewAnswer();
            }
        }else{
            thisRef.prop('checked',false);
            if(thisRef.hasClass('multi')){
                $('.q_true_false').prop('checked',true)
            }else{
                $('.q_multi').prop('checked',true)
            }
        }
      });
    // $(".dropify-clear").click(); 
    // var thisRef = $(this);
    // deleteRef.attr('disabled', 'disabled');
    // deleteRef.text('Processing...');
    // var id = $(this).attr('id');
    // $.ajax({
    //     type: 'POST',
    //     url: '/delete-lesson',
    //     data: {
    //         _token: $('meta[name="csrf_token"]').attr('content'),
    //         id: id
    //     },
    //     success: function (response) {
    //         if (response.status == 'success') {
                
    //             all_lessones_list();
    //             $('#notifDiv').fadeIn();
    //             $('#notifDiv').css('background', 'green');
    //             $('#notifDiv').text('Successfully deleted.');
    //             setTimeout(() => {
    //                 $('#notifDiv').fadeOut();
    //             }, 3000);
    //         } else {
    //             deleteRef.removeAttr('disabled');
    //             deleteRef.text('Delete');
    //             $('#notifDiv').fadeIn();
    //             $('#notifDiv').css('background', 'red');
    //             $('#notifDiv').text('Unable to delete at the moment');
    //             setTimeout(() => {
    //                 $('#notifDiv').fadeOut();
    //             }, 3000);
    //         }
    //     }
    // });
   
   
})
function getQuestions(){
    existing_quizz_id = $('input[name="hidden_quizz_id"]').val()
    $('#tblLoader').show();
    $('.tbl-div').empty();
    $.ajax({
    url      :  '/get-questions-list/'+existing_quizz_id,
    type     :  'get',
    success  :  function(response){
        $('.tbl-div').append(`    
        <table class="table table-hover dt-responsive nowrap Quizzes-list" id="example" style="width:100%">
            <thead>
                <tr>
                    <th>Question Title</th>
                    <th>Type</th>
                    <th>Grade</th>
                    <th>Action</th>
                </tr>
            </thead>
        <tbody> 
            
        </tbody>
    </table>`);
    $('.Quizzes-list tbody').empty();
    response.questions.forEach(data => {
    
        $('.Quizzes-list tbody').append(`
        <tr>
        <td>${data.question_title}</td>
        <td>${data.question_type == 1 ? 'Multiple Choice' : 'True/False'}</td>
        <td><span class="font-no">8</span></td>
        <td>
            <button class="btn btn-default btn-line mb-0 openSidebarForEdit" data-id="${data.id}">Edit</button>
            <button class="btn btn-default red-bg mb-0 delete-question" data-id="${data.id}">Delete</button>
        </td>
    </tr>
    `)
    })
    $('.Quizzes-list').fadeIn();
    $('.Quizzes-list').DataTable();
    $('#tblLoader').hide();
    }
})
}
function getQuizzes(){
    $('#tblLoader').show();
    $('.quizz-tbl-div').empty();
    $.ajax({
    url      :  '/get-quizz-list',
    type     :  'get',
    success  :  function(response){
        $('.quizz-tbl-div').append(`    
        <table class="table table-hover dt-responsive nowrap quizzes" id="example" style="width:100%">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Quiz Title</th> 
                      <th>Time</th>
                      <th>Questions</th>
                      <th>No. of Attempts</th>
                      <th>Pass Mark</th> 
                      <th>Status</th>                      
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  </tbody>
                </table>`);
    $('.quizzes tbody').empty();
    response.quizzes.forEach(data => {
        existing_quizz_id = data.id
        $('.quizzes tbody').append(`
        <tr>
        <td>${data.course_title}</td>
        <td>${data.title}</td>
        <td><span class="font-no">${data.time} minute</span></td>
        <td><span class="font-no">${data.total_questions}</span></td> 
        <td><span class="font-no">${data.no_of_attempts}</span></td> 
        <td><span class="font-no">${data.pass_marks}</span></td> 
        <td class="change-status" data-id="${data.id}" data-value="${data.status}"><i class="fa fa-circle ${data.status == 1 ? 'active-st' : 'inactive-st'}"></i> ${data.status == 1 ? 'Active' : 'In-Active'}</td> 
        <td>
          <a href="/quizzes/${data.id}/edit" class="btn btn-default btn-line mb-0">Edit</a>
          <button class="btn btn-default mb-0">Results</button>
          <button class="btn btn-default red-bg mb-0">Delete</button>
        </td>
      </tr> 
    `)
    })
    $('.quizzes').fadeIn();
    $('.quizzes').DataTable();
    $('#tblLoader').hide();

    }
})
}
$(document).on('click','.openSidebarForEdit',function(){
    var q_id =  $(this).attr('data-id');
    var CurrentRef = $(this);
    CurrentRef.attr('disabled', 'disabled');
    CurrentRef.text('Processing...');
    $.ajax({
        url     :   '/get-question-for-edit/'+q_id,
        type    :   'get',
        success :   function(response){
            console.log(response);
            CurrentRef.attr('disabled', false);
            CurrentRef.text('Edit');
              openSidebar();
              $('.new-answer-card').empty();
              existing_question_id = response.question.id;
        
              $('input[name="hidden_quizz_id_for_question"]').val(response.question.quizz_id)
              $('input[name="question_id"]').val(response.question.id)
              $('input[name="question_unique_id"]').val(response.question.unique_id)

              if(response.question.question_type == 2){
                radio_value = 2
                $('.q_true_false').prop('checked',true)
                $('.true_false').css('display','block');
                $('.multi_choice').css('display','none');
                //Required Fields
                $('#grade').removeClass('question-required');
                $('#multi_question').removeClass('question-required');

                if(response.question.true_false == 1){
                  $('.true').prop('checked',true)
                }else{
                  $('.false').prop('checked',true)
                }
                //geting image
                var input = `<input type="hidden"  name="hidden_question_image" value="${response.question.question_image}"/> 
                <input type="file" id="input-file-now" class="dropify"  name="question_image" data-old_input="hidden_question_image"  data-default-file = "/storage/${response.question.question_image}" value="${response.question.question_image}"  data-allowed-file-extensions="jpg png jpeg JPEG" data-max-file-size="5M" data-name="question"/>`
                $('.img').empty();
                $('.img').html(input);
                $('.dropify').dropify();
                //geting Audio
                var input = `<input type="hidden"  name="hidden_question_audio" value="${response.question.question_audio}"/> 
                <input type="file" id="input-file-now" class="dropify"  name="question_audio" data-old_input="hidden_question_audio"  data-default-file = "/storage/${response.question.question_audio}" value="${response.question.question_audio}"  accept="audio/*" data-allowed-file-extensions="mp3" data-max-file-size="5M" data-name="question"/>`
                $('.audio').empty();
                $('.audio').html(input);
                $('.dropify').dropify();

                $('input[name="question_title_true_false"]').focus();
                $('input[name="question_title_true_false"]').val(response.question.question_title);
                $('input[name="question_title_true_false"]').blur();
              }else{
                radio_value = 1
                //Required Fields
                $('#grade').addClass('question-required');
                $('#true-false-question').removeClass('question-required');
                $('#multi_question').addClass('question-required');

                $('.q_multi').prop('checked',true)
                $('.true_false').css('display','none');
                $('.multi_choice').css('display','block');

                $('input[name="question_title"]').focus();
                $('input[name="question_title"]').val(response.question.question_title);
                $('input[name="question_title"]').blur();

                $('input[name="grade"]').focus();
                $('input[name="grade"]').val(response.question.grade);
                $('input[name="grade"]').blur();
               
                //geting Audio
                var input = `<input type="hidden"  name="hidden_question_audio" value="${response.question.question_audio}"/> 
                <input type="file" id="input-file-now" class="dropify"  name="question_audio" data-old_input="hidden_question_audio"  accept="audio/*" data-default-file = "/storage/${response.question.question_audio}" value="${response.question.question_audio}"  accept="audio/*" data-allowed-file-extensions="mp3" data-max-file-size="5M" data-name="question"/>`
                $('.audio').empty();
                $('.audio').html(input);
                $('.dropify').dropify();
               
                response.answers.forEach(data => {
                    $('.new-answer-card').append(
                        ` <div class="card p-20 top_border mb-3 answer_div " data-unique-id="${data.unique_id}">
                            <h2 class="_head03">Option: <span>${i}</span>
                                <div class="switch-div">
                                    <span>Correct Answer</span>
                                    <label class="switch">
                                        <input type="radio" name="correct_answer" class="correct-${data.unique_id} correct" value="${data.correct_answer}" ${data.correct_answer == 1 ? 'checked' : ''}>
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                            </h2>
                        <div class="form-wrap p-0">
                            <div class="row">  
                                <div class="col-md-12 pt-5 PB-10">
                                <label class="font12 mb-5">Title</label>
                                        <input type="text" id="answer_title" class="form-control title-${data.unique_id}" name="answer_title" value="${data.answer_title}">
                                   
                                </div>
                               <input type="hidden" name="answer_id" id="answer_id" value="${data.id}">
                                <div class="col-md-4 pr-0">
                                    <div class="form-wrap pt-0 pb-0">
                                        <label class="font11 mb-5">Audio (Optional)</label>
                                        <div class="upload-pic"></div> 
                                        <input type="hidden"  name="hidden_answer_audio" value="${data.answer_audio}"/> 
                                        <input type="file" id="input-file-now" class="dropify image audio-${data.unique_id}"  name="answer_audio" data-old_input="hidden_answer_audio"  data-default-file = "/storage/${data.answer_audio}" value="${data.answer_audio}"  accept="audio/*" data-allowed-file-extensions="mp3" data-max-file-size="5M" data-name="answer"/>  
                                    </div>
                                </div>
                                <div class="col-md-4 pr-0">
                                    <div class="form-wrap pt-0 pb-0">
                                        <label class="font11 mb-5">Image (Optional)</label>
                                        <div class="upload-pic"></div>
                                        <input type="hidden"  name="hidden_answer_image" value="${data.answer_image}"/> 
                                        <input type="file" id="input-file-now" class="dropify image image-${data.unique_id}"  name="answer_image" data-old_input="hidden_answer_image"  data-default-file = "/storage/${data.answer_image}" value="${data.answer_image}"  accept="image/*" data-allowed-file-extensions="jpg png jpeg JPEG" data-max-file-size="5M"  data-name="answer"/>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <button title="Delete" data-index="${data.unique_id}" class="btn btn-primary red-bg answer-del remove"><i class="fa fa-trash"></i></button>
                                </div>
                            </div> 
                        </div>
                </div>`);
                $('.image').dropify();
                })
              }
       
            
        }
    })
})
$(document).on('click','.change-status',function(){
    var q_id            =  $(this).attr('data-id');
    var current_status  =  $(this).attr('data-value');
    var  status         =   '';
    if(current_status == 0){
        status = 1;
    }else{
        status = 0;
    }
    $.ajax({
        url     :  '/change-quizz-status',
        type    :   'get',
        data    :   {
                     'status'  :   status,
                     'id'      :   q_id,
                    },
        success :  function(response){
            if(response.status == 'success'){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Status has been Updated');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                getQuizzes();
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
})
$(document).on('click','.delete-question',function(){
    var q_id            =  $(this).attr('data-id');
    var CurrentRef = $(this);
    CurrentRef.attr('disabled', 'disabled');
    CurrentRef.text('Processing...');
    $.ajax({
        url     :  '/delete-question',
        type    :   'get',
        data    :   {
                     'id'      :   q_id,
                    },
        success :  function(response){
            CurrentRef.attr('disabled', false);
            CurrentRef.text('Delete');
            if(response.status == 'success'){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('Question has  Deleted');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                getQuestions();
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


