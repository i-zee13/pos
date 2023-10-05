let multiple_attribute = [];
let multiple_tags = [];
let seo_description = [];
let counter = 0;
let all_attributes=[];
let attribute=[];
let current_attribute= '';
let current_attribute_value = '';
let Weightage   =  0;
let next_value = 0;
var items=[];
let attribute_id='';
let attribute_values = [] ;
 
 function listaction(element){
    var action = '';
    var detail  =   ` <a  href="/view-course/${element['id']}"  class="dropdown-item" type="button">Detail</a>`
    var edit    =   ` <a  href="/edit-course/${element['id']}" class="dropdown-item" type="button">Edit</a>`
    var lesson  =   ` <a  href="/course-lesson/${element['id']}" class="dropdown-item" type="button">Lesson</a>`
    var status  = `${element['status']}`
    if(status == 2 || status == 1){
        action = `${detail} ${edit} ${lesson}`;
    }else{
        action = `${detail} ${edit}`;
    }
   
    return action;
 }

$(document).ready(function(){
    getdata();
     var id =  $('.hidden_course_id').val() 
     $.ajax({
        url  : `/get-attribute-and-tags/${id}`,
        type : 'get',
        success : function(response){
            response.course_attribute.forEach(element => {
                multiple_attribute.push({
                    'id'                    : element.id,
                    'attribute_id'          : element.attribute_id,
                    'attribute_value_id'    : element.attribute_value_id,
                    'attribute'             : element.attibure_name,
                    'attribute_value'       : element.attribute_value,
                    });
            })
            response.course_tags.forEach(element => {
                multiple_tags.push({
                    'tag'    :     element.tag_name,
                });
            })
        }
     });
    function getdata(){
        $.ajax({
        url         :   '/get-data',
        type        :   'get',
        success     :  function(response){
          
            $('.main_category').append(`<option value="0">Select Category</option>`)
            $('.sub_category').append(`<option value="0">Select Sub Category</option>`)
            // $('.attribute').append(`<option value="0">Select Attribute</option>`)
            response.main_category.forEach(element => {
                $('.main_category').append(` <option value="${element['id']}">${element['service_name']}</option>`)
            });
            sub_categories = response.sub_category;
            all_attributes = response.attribute_values;
            attribute      =   response.attribute;
          
            response.attribute.forEach(element => {
                $('.attribute').append(`<option style="display:none;" class="get_attribute_${element['id']}" value="${element['id']}" data-name="${element['name']}">${element['name']}</option>`)
            });
        
            //  items   = response.attribute;
           
        }
    });
    }
if (location.pathname == "/add-course" || location.pathname == "/edit-course/"+id) {
var select = $('.attribute').selectize({
    create:function(input,callback){
        $.ajax({
            url      :   '/save-attribute',
            type     :   'post',
             headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data     :  {
                'attribute_name' :    input,
                'operation'      :   'add_attribute',
            },
            success  :  function(response){
                $('.attribute').append(`<option style="display:none;" class="get_attribute_${response.data.id}" value="${response.data.id}" data-name="${response.data.name}">${response.data.name}</option>`)
                callback({value:response.data.id,text:response.data.name})
            }
        })  
    },
});
var selectize = select[0].selectize;
$('.attribute').on('click',function(){
    // alert($('.attribute_value').selectize.clear());
    attribute.forEach(element => {
                         selectize.addOption({value:element.id,text:element.name});
                        });
   
})
var select2 = $('.attribute_value').selectize({
    create:function(value,callback){
        $.ajax({
            url      :   '/save-attribute-value',
            type     :   'post',
             headers : {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data     :  {
                'attribute_id'    :    attribute_id,
                'attribute_value' :    value,
                'operation_state' :   'add_attribute_value',
            },
            success  :  function(response){
                current_attribute_value_id = response.value.id;
                current_attribute_value = response.value.attribute_value;
            $('.attribute_value').append(`<option style="display:none;"  class="value_${current_attribute_value_id}" value="${current_attribute_value_id}" data-value="${current_attribute_value}">${current_attribute_value}</option>`)
                callback({value:response.value.id,text:response.value.attribute_value})
            }
        })  
    },
});
var selectize2='';
 selectize2 = select2[0].selectize;
selectize.on('change', function onChange(id) {
   
    // selectize2.on('option_clear');
//   $('.attribute_value').append(`<option value="0">Select Attribute Value</option>`)
     attribute_id             =   id;
    attribute_values          =  all_attributes.filter(x=> x.attribute_id == attribute_id ) ;   
    current_attribute         =  $(`.get_attribute_${id}`).attr('data-name');
    current_attribute_id      =  $(`.get_attribute_${id}`).attr('value');
   
    // $('.attribute_value').append(`<option value="0">Select Attribute Value</option>`)

   
    if(attribute_values){
        selectize2.clearOptions();
        selectize2.clear();
        // $('.attribute_value').empty();
        attribute_values.forEach(element => {
            selectize2.addOption({value:element.id,text:element.attribute_value});
            $('.attribute_value').append(`<option style="display:none;"  class="value_${element['id']}" value="${element['id']}" data-value="${element['attribute_value']}">${element['attribute_value']}</option>`)
        });
    }
   
    selectize2.focus();

    

});
}
     CKEDITOR.replace( 'long_description',
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
});
//End Ready Function //


var switchStatus = false;
$(".show_btn").on('change', function() {
    if ($(this).is(':checked')) {
        switchStatus = $(this).is(':checked');
        $('.btn_text').text('Hide')
        $('.show_gradution_block').css('display','block');
        $('.show_btn').val('1');
    }
    else {
       switchStatus = $(this).is(':checked');
       $('.btn_text').text('Show')
       $('.show_gradution_block').css('display','none');
       $('.show_btn').val('0');

    }
});
$('.main_category').change(function(){
    $('.sub_category').append(`<option value="0">Select Sub Category</option>`)
     var id     =   $(this).val();
    $.ajax({
        url     :   `/get-sub-category-against-main-cat/${id}`,
        type    :   'get',
        success :   function(response){
                    $('.sub_category').empty();
                    $('.sub_category').append(`<option value="0">Select Sub Category</option>`)
                    response.forEach(element => {
                        $('.sub_category').append(`<option value="${element['id']}">${element['service_name']}</option>`)
                    });
        }
    });
});
// $('.attribute').change(function(){
    // $('.attribute_value').append(`<option value="0">Select Attribute Value</option>`)
    // var id     =   $(this).val();
    // var attribute_values   =   all_attributes.filter(x=> x.attribute_id == id ) ;   
    // current_attribute      =  $(`.get_attribute_${id}`).attr('data-name');
    // current_attribute_id      =  $(`.get_attribute_${id}`).attr('value');
    //    $('.attribute_value').empty();
    //    $('.attribute_value').append(`<option value="0">Select Attribute Value</option>`)
    //    if(attribute_values){
    //        attribute_values.forEach(element => {
    //            $('.attribute_value').append(`<option  class="value_${element['id']}" value="${element['id']}" data-value="${element['attribute_value']}">${element['attribute_value']}</option>`)
    //        });
    //    }
// });
$('.add_attribute').on('click',function(){
    var flag = true;
    var id  = $('.attribute_value').val();
    current_attribute_value     =  $(`.value_${id}`).attr('data-value');
    current_attribute_value_id  =  $(`.value_${id}`).attr('value');
    if($('.attribute').val() > 0 && $('.attribute_value').val() > 0) 
    {
        multiple_attribute.filter(function(x){
            if(x.attribute_value == current_attribute_value && x.attribute_value_id == current_attribute_value_id){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text("Attribute already Added");
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                flag = false;
                return;
                }
        });
        if(flag == true)
        {
            multiple_attribute.push({
            'id'                    : id,
            'attribute_id'          : current_attribute_id,
            'attribute_value_id'    : current_attribute_value_id,
            'attribute'             : current_attribute,
            'attribute_value'       : current_attribute_value,
            });
            $(`.multiple_attribute_tbl`).empty();
            multiple_attribute.forEach(function(data,key) {
                $(`.multiple_attribute_tbl`).append(`
                    <tr id="#new-row-">
                    <td style="width:395px">${data.attribute}</td>
                    <td>${data.attribute_value}</td>
                    <td><button class="btn btn-primary red-bg  remove" id="${data.id}" data-id="${data.attribute}"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>`
                );
            })
            }
    }else{
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please Select Attribute First');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
    }
    $('.attribute').val(0).trigger('change');
    $('.attribute_value').val(0).trigger('change');
})
$(document).on('click','.remove',function(){
 $(this).parent().parent().remove();
 var row_id  = $(this).attr('id');
    // $(`#new-row-${row_id}`).remove();
    multiple_attribute = multiple_attribute.filter(x => x.id != row_id);
    
})
$('.add_tag').on('click',function(){
    var tag  = $('.tag_input').val();
  if(tag) 
  {
    multiple_tags.push({
        'tag'    :     tag,
    });
   $(`.multiple_tags_tbl`).empty();
    multiple_tags.forEach(function(data) {
        $(`.multiple_tags_tbl`).append(`
        <div class="alert fade show alert-color _add-secon" role="alert">${data.tag}
        <button type="button" class="close" data-value="${data.tag}" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">×</span> </button>
        </div>
           `
        );
   })
  }else{
      $('#notifDiv').fadeIn();
      $('#notifDiv').css('background', 'red');
      $('#notifDiv').text('Please Add Tag First');
      setTimeout(() => {
          $('#notifDiv').fadeOut();
      }, 3000);
  }
  $('.tag_input').val('')
})
$(document).on('click','.close',function(){
      var tag_value  = $(this).attr('data-value');
       multiple_tags = multiple_tags.filter(x => x.tag != tag_value);
})
$('.btn_save_course').click(function(){
    let dirty = false;
    $('.course-required').each(function () {
        if (!$(this).val() || $(this).val() == 0) {
            dirty = true;
        }
    });
    if( $('input[name="course_pricing_model"]:checked').length == 0 ||  $('input[name="course_incubator"]:checked').length == 0){
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
    if($('.show_btn').val() == 1 && $('.total_weightage').attr('data-value') < 100){
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text("Weightage Percantage Should be 100%");
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    // old__tag_array         =   $('.tag_array').attr('data-tag');
    // old__attribute_array   =   $('.attribute_array').attr('data-attribute');
    // if($('.hidden_course_id').val() != '' || $('.hidden_course_id').val() != null){
    //     multiple_tags.push(old__tag_array)
    //     multiple_attribute.push(old__attribute_array)
    // }
   
    if($('.show_btn').val() == 1){
        total_weightage        =   $('.total_weightage').attr('data-value')
        courseFormSubmit();
    }else{
        swal({
            title: "Are you sure?",
            text: "You are Sumbitting data without Gradution Ceriteria!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((yes) => {
          if(yes){
            total_weightage   =   0;
            courseFormSubmit();
          }
        })
    }
    var long_description    =   CKEDITOR.instances['long_description'].getData();
   
    function courseFormSubmit(){
        seo_description=[];
        seo_description.push({
            'page_meta'                 :  $('input[name="page_meta"]').val(),
            'meta_description'          :  $('textarea[name="meta_description"]').val(),
            'meta_keywords'             :  $('textarea[name="meta_keywords"]').val(),
            'meta_property_url'         :  $('input[name="meta_property_url"]').val(),
            'meta_property_type'        :  $('input[name="meta_property_type"]').val(),
            'meta_property_title'       :  $('input[name="meta_property_title"]').val(),
            'meta_property_description' :  $('textarea[name="meta_property_description"]').val(),
            'meta_property_image'       :  $('input[name="meta_property_image"]').val(),
            'footer_content'            :  $('textarea[name="footer_content"]').val(),
        });
    $('#course_form').ajaxSubmit({
        url     :   '/store-course',
        type    :   'post',
        data    :   {
                    'multiple_tags'      : multiple_tags,
                    'long_description'   : long_description,
                    'multiple_attribute' : multiple_attribute,
                    'total_weightage'    : total_weightage,
                    'seo_description'    : JSON.stringify(seo_description),
                    },
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
                    window.location = "/courses";
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
    }
 })
 $('.only_numerics').on('input',function(){
    var sum=0;
    $('.only_numerics').each(function() {
        sum += Number($(this).val());    
    });
   
    if(sum >100){
        $('.total_weightage').attr('data-value','0')
        $(this).val('0')
        sum=0;
        $('.total_weightage').attr('placeholder',sum+'%');
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text("Weightage Percantage Should not be greater then 100%");
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }
    $('.total_weightage').attr('placeholder',sum+'%');
    $('.total_weightage').attr('data-value',sum);  
   
 })
// $('.only_numerics').on('focus',function(){
//     var sum=0;
//     $('.only_numerics').each(function() {
//         sum += Number($(this).val());    
//     });
//     if(sum == 0){
//         next_value = 0;
//     }
//     if(sum <= 100){
//         next_value  = 100-sum;
//         $('.total_weightage').attr('placeholder',sum+'%');
//         $('.total_weightage').attr('data-value',sum);  
//         console.log('if sum is < 100',next_value) 
//     }else{
        
//         if($(this).val() > 100 && next_value == 0 && $('.total_weightage').attr('data-value') == 0 ){
//             $(this).val('100')
//         } 
//         if($(this).val() > 100 && next_value == 0 && $('.total_weightage').attr('data-value') == 100 ){
//             alert(next_value)
//             $(this).val('0')
//         }
//          if($(this).val() > next_value && next_value != 0 ){ 
//             $(this).val(next_value)
//         }
//     }
//     // Weightage = Weightage + $(this).val();
// });
$('#yes001').click(function(){
    $('.course_price').css('display','block');
});
$('#no001').click(function(){
    $('.course_price').css('display','none');
});
$(document).on('click', '.dropify-clear', function () {
    var old_input_name = $(this).parent().children('input').attr('data-old_input');
    $('input[name="' + old_input_name + '"]').val('');
    $(this).parent().children('input').val('')

})
$(document).on('click','.btn-status',function(){
    $("input[name='radio_status']").prop('checked',false);
    $('#hidden_status_modal').click();
   var course_status    =    0
   var course_id        =    $(this).attr('data-id');
    course_status       =    $(this).attr('data-status');
    $('.save_status').attr('course-id',course_id);
   if(course_status == 1){
    $('#draft_status').prop('checked',true);
   }
   if(course_status == 2){
    $('#publish_status').prop('checked',true);
   }
   if(course_status == 3 ){
    $('#remove_status').prop('checked',true);
   }
    
});

$('#save_status').on('click',function(){
   
    var updated_status  =  $("input[name='radio_status']:checked").val();
    var course_id       =  $('.save_status').attr('course-id');
    $.ajax({
        url   :  '/update-course-status',
        type  :   'Post',
        headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                 },
        data   :    {
                    'updated_status':   updated_status,
                    'course_id'     :   course_id,
                    },
        success :   function(response){
           
             if (response.status == "success") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'Green');
                $('#notifDiv').text('Course Status has been Updated');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 1500);
                fetchClientList();
                $('.close-modal').click();
                $("input[name='radio_status']").prop('checked',false);
            }else{
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'Red');
                $('#notifDiv').text('Not Updated at this Moment');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 1500);
            }
        },
        error: function (e) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Not Updated at this Moment');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
        }
    })
});





if (location.pathname == "/courses") {
    fetchClientList();
}
$(document).on('click', '.customer_page_link', function () {
    var not_found   =   true;
    current_cust_active_page = parseFloat($(this).attr('name'));
    not_found       =   false;
    var actionbtn   =   listaction(element);

    if (!not_found) {
        $('.cust_list_div').empty();
        $('.cust_grid_div').empty();
        all_cust[current_cust_active_page].map(function (element) {
          
            $('.cust_list_div').append(`<div class="Product-row">
            <div class="row">
            <div class="col colStyle" style="max-width:355px">
                <div style="display:table; margin-top: -5px; margin-bottom:-5px;">
                    <div class="_emp-D"><img class="doc-img"
                            src="${element['course_thumbnail'] ? '/storage/' + element['course_thumbnail'] : '/images/form-avatar-icon.svg'}"
                            alt=""></div>
                    <div class="textMiddle">${element['course_code'] ? element['course_code'] : 'NA'} </div>
                </div>
            </div>
            <div class="col colStyle" style="max-width:220px">
                <div class="pt-5">${element['course_duration'] ? element['course_duration']+' Months' : 'NA'}</div>
            </div>
            <div class="col colStyle" style="max-width:220px">
            <div class="pt-5">${(element['youtube_link'] ? element['youtube_link'] : 'NA')}</div>    </div>
            <div class="col colStyle" style="max-width:150px">
            <div class="pt-5">${element['status'] == 1 ? 'Draft' : element['status'] == 2 ? 'Publish' : element['status'] == 3 ? 'Remove'  : 'NA'}</div>

            </div>
            <div class="dropdown">
                                <button class="btn remove_click dropdown-toggle" type="button" id="dropdownMenu2"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Action </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                ${actionbtn}
                                </div>
        
            </div>
        </div>
     </div>`);

            $('.cust_grid_div').append(` <div class="col-lg-3 col-md-4">
        <div class="_product-card ${element['is_active'] == '0' ? '_deactive-cus' : ''}">
         <img class="doc-img" src="${element['course_thumbnail'] ? '/storage/' + element['course_thumbnail'] : '/images/form-avatar-icon.svg'}" alt="" >
            <h2 >${element['course_code'] ? element['course_code'] : 'NA'} </h2> 
            <div class="con_info pt-0 PB-20">
                <p><i class="fa fa-phone-square"></i>${element['primary_cellphone'] ? element['primary_cellphone'] : 'NA'}</p>
                <p><i class="fa fa-envelope"></i>${(element['youtube_link'] ? element['youtube_link'] :
                    (element['youtube_link'] ? element['youtube_link'] : 'NA'))}</p>
                <p><i class="fa fa-globe"></i>${element['course_duration'] ? element['course_duration']+' Months' : 'NA'}</p>
    
                <div class="PT-20">
                <div class="dropdown">
                    <button class="btn remove_click dropdown-toggle" type="button" id="dropdownMenu2"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Action </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                    ${actionbtn}
                    </div>

                 </div>
                </div>
                
                <div class="CountryName">${element['city'] ? element['city'] : element['city'] ? element['city'] : 'NA'}</div>

            </div>
    
        </div>
        </div>`);
        });
    }
})
var item = [];
var all_cust = [];
var item = [];
var current_action = 'client';
function fetchClientList() {
    var random_string = makeid(50);
    allCustomersList = [];
    $('.dynamic_search').val('');
    $('.dynamic_filter').val(0).trigger('change');
    if ($('.dynamic_filter').val() != '0') {
        $('.dynamic_filter').val(0).trigger('change');
        rendersearch('', 0);
        $('.count_customers').text(total_customers);

    }
    $('.tblLoader').fadeIn();
    $('.cust_list_div').empty();
    $('.cust_grid_div').empty();
    $('.list_view_div').empty();
    $('.grid_view_div').empty();


    $('.pagination_cust').empty();
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: '/course-list',
            data: {
                random_string: random_string
            },
            success: function (response) {
                $('.data_div').empty();
                $('.data_div').show();
                $('.tblLoader').hide();
               
                allCustomersList = response.client;
                $('.doc_key').val(random_string);
                $('.operation_docs').val(random_string);

                total_customers = response.client.length;
                $('.count_customers').text(total_customers);
                var recsPerPage = 12;
                total_cust_pages = Math.ceil(total_customers / recsPerPage);
                var offset = 0;
                var pageNo = 0;
                var current_records = 0;
                var array_items_count = 0;
                var total_indexes = 0;

                fetchPagination(total_cust_pages, current_records, 'client');
                $('.pagination_cust').append(`<li name="-1" class="page-item customer_page_link disabled previous"><a class="page-link" tabindex="-1">Previous</a></li>`);
                var i;
                for (i = 1; i <= total_cust_pages; i++) {
                    $('.pagination_cust').append(`<li name="${i}" class="page-item customer_page_link ${i <= 1 ? 'active' : ''}"><a class="page-link">${i}</a></li>`);
                    all_cust.push({})
                }
                $('.pagination_cust').append('<li class="page-item customer_page_link next" name="+1"><a class="page-link">Next</a></li>');
                //cust_base_url = response.base_url;
                var test = [];
                response.client.forEach(element => {
                      /**   Landing    **/

                    var actionbtn   =   listaction(element);
                    current_records++;
                    array_items_count++;
                    if (current_records <= 12) {
                        $('.cust_list_div').append(`<div class="Product-row " >
                        <div class="row">
                            <div class="col colStyle" style="max-width:355px">
                                <div style="display:table; margin-top: -5px; margin-bottom:-5px;">
                                    <div class="_emp-D"><img class="doc-img"
                                            src="${element['course_thumbnail'] ? '/storage/' + element['course_thumbnail'] : '/images/form-avatar-icon.svg'}"
                                            alt=""></div>
                                    <div class="textMiddle">${element['course_code'] ? element['course_code'] : 'NA'} </div>
                                </div>
                            </div>
                            <div class="col colStyle" style="max-width:220px">
                                <div class="pt-5">${element['course_duration'] ? element['course_duration']+' Months' : 'NA'}</div>
                            </div>
                           
                            <div class="col colStyle" style="max-width:220px">
                            <div class="pt-5">${(element['youtube_link'] ? element['youtube_link'] : (element['youtube_link'] ? element['youtube_link'] : 'NA'))}</div>    </div>
                            <div class="col colStyle" style="max-width:150px">
                            <div class="pt-5"><button class="btn smBTN btn-default btn-status" data-id="${element['id']}"  data-status="${element['status']}">${element['status'] == 1 ? 'Draft' : element['status'] == 2 ? 'Publish' : element['status'] == 3 ? 'Remove'  : 'NA'}</button></div>
                         </div>
                            <div class="col colStyle" style="max-width:180px">
                            <div class="dropdown">
                                <button class="btn remove_click dropdown-toggle" type="button" id="dropdownMenu2"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Action </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                ${actionbtn}
                                </div>
        
                            </div>
                            </div>
                        </div>
                     </div>`);

                        $('.cust_grid_div').append(` <div class="col-lg-3 col-md-4">
                        <div class="_product-card ${element['is_active'] == '0' ? '_deactive-cus' : ''}">
                         <img class="doc-img" src="${element['course_thumbnail'] ? '/storage/' + element['course_thumbnail'] : '/images/form-avatar-icon.svg'}" alt="" >
                            <h2 >${element['course_code'] ? element['course_code'] : 'NA'} </h2> 
                            <div class="con_info pt-0 PB-20">
                                <p><i class="fa fa-phone-square"></i>${element['primary_cellphone'] ? element['primary_cellphone'] : 'NA'}</p>
                                <p><i class="fa fa-envelope"></i>${(element['youtube_link'] ? element['youtube_link'] :
                                (element['youtube_link'] ? element['youtube_link'] : 'NA'))}</p>
                                <p><i class="fa fa-globe"></i>${element['course_duration'] ? element['course_duration']+' Months' : 'NA'}</p>
                    
                                <div class="PT-20">
                                <div class="dropdown">
                                    <button class="btn remove_click dropdown-toggle" type="button" id="dropdownMenu2"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Action </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                    ${actionbtn}
                                    </div>
        
                                </div>
                                </div>

                                <div class="CountryName">${element['city'] ? element['city'] : element['city'] ? element['city'] : 'NA'}</div>

                            </div>
                    
                        </div>
                    </div>`);
                    }
                    test.push(element);
                    all_cust[total_indexes] = test;
                    if (array_items_count == 12) {
                        array_items_count = 0;
                        test = [];
                        total_indexes++;
                    }
                });

                resolve(allCustomersList);
            }
        });
    })
}
function rendersearch(search = null, type = null) {
    if (current_action == 'client') {
        $('.cust_list_div').empty();
        $('.cust_grid_div').empty();
        $('.list_view_div').empty();
        $('.grid_view_div').empty();
        $('.pagination_cust').empty();



        if (search == '') {
            searchArray = allCustomersList;
        } else {
            searchArray = allCustomersList.filter(function (x) {
                return (x.city ? x.city.toLowerCase().includes(search) : '') || (x.course_code ? x.course_code.toLowerCase().includes(search) : '') || (x.last_name ? x.last_name.toLowerCase().includes(search) : '') || (x.youtube_link ? x.youtube_link.toLowerCase().includes(search) : '');
            });
        }
        if (type == '1') {
            searchArray = searchArray.filter(function (x) {
                return x.status == 1;
            });
        } else if (type == '2') {
            searchArray = searchArray.filter(function (x) {
                return x.status == 2;
            });
        } else if (type == '3') {
            searchArray = searchArray.filter(function (x) {
                return x.status == 3;
            });
        } else if (type == '4') {
            searchArray = searchArray.filter(function (x) {
                return x.status == 4;
            });
        }
        var recsPerPage = 12;
        total_cust_pages = Math.ceil(searchArray.length / recsPerPage);
        $('.count_customers').text(searchArray.length);
        var offset = 0;
        var pageNo = 0;
        var current_records = 0;
        var array_items_count = 0;
        var total_indexes = 0;

        fetchPagination(total_cust_pages, current_records, 'client');
        $('.pagination_cust').append(`<li name="-1" class="page-item customer_page_link disabled previous"><a class="page-link" tabindex="-1">Previous</a></li>`);
        var i;
        for (i = 1; i <= total_cust_pages; i++) {
            $('.pagination_cust').append(`<li name="${i}" class="page-item customer_page_link ${i <= 1 ? 'active' : ''}"><a class="page-link">${i}</a></li>`);
            all_cust.push({})
        }
        $('.pagination_cust').append('<li class="page-item customer_page_link next" name="+1"><a class="page-link">Next</a></li>');
        var test = [];
         /**   Search   **/

        searchArray.forEach(element => {
            current_records++;
            array_items_count++;
            var actionbtn   =   listaction(element);
            if (current_records <= 12) {
                $('.cust_list_div').append(`<div class="Product-row " >
                <div class="row">
                    <div class="col colStyle" style="max-width:355px">
                        <div style="display:table; margin-top: -5px; margin-bottom:-5px;">
                            <div class="_emp-D"><img class="doc-img"
                                    src="${element['course_thumbnail'] ? '/storage/' + element['course_thumbnail'] : '/images/form-avatar-icon.svg'}"
                                    alt=""></div>
                            <div class="textMiddle">${element['course_code'] ? element['course_code'] : 'NA'} </div>
                        </div>
                    </div>
                    <div class="col colStyle" style="max-width:220px">
                        <div class="pt-5">${element['course_duration'] ? element['course_duration']+' Months' : 'NA'}</div>
                    </div>
                   
                    <div class="col colStyle" style="max-width:220px">
                    <div class="pt-5">${(element['youtube_link'] ? element['youtube_link'] : 'NA')}</div>    </div>
                    <div class="col colStyle" style="max-width:150px">
                    <div class="pt-5">${element['status'] == 1 ? 'Draft' : element['status'] == 2 ? 'Publish' : element['status'] == 3 ? 'Remove'  : 'NA'}</div>

                    </div>
                    <div class="col colStyle" style="max-width:180px">
                    <div class="dropdown">
                        <button class="btn remove_click dropdown-toggle" type="button" id="dropdownMenu2"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Action </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                        ${actionbtn}
                        </div>

                     </div>
                    </div>
                </div>
             </div>`);
                var actionbtn   =   listaction(element);
                $('.cust_grid_div').append(` <div class="col-lg-3 col-md-4">
                        <div class="_product-card ${element['is_active'] == '0' ? '_deactive-cus' : ''}">
                         <img class="doc-img" src="${element['course_thumbnail'] ? '/storage/' + element['course_thumbnail'] : '/images/form-avatar-icon.svg'}" alt="" >
                            <h2 >${element['course_code'] ? element['course_code'] : 'NA'} </h2> 
                            <div class="con_info pt-0 PB-20">
                                <p><i class="fa fa-phone-square"></i>${element['primary_cellphone'] ? element['primary_cellphone'] : 'NA'}</p>
                                <p><i class="fa fa-envelope"></i>${(element['youtube_link'] ? element['youtube_link'] :
                                    (element['youtube_link'] ? element['youtube_link'] : 'NA'))}</p>
                                <p><i class="fa fa-globe"></i>${element['course_duration'] ? element['course_duration']+' Months' : 'NA'}</p>
                    
                                <div class="PT-20">
                                <div class="dropdown">
                                    <button class="btn remove_click dropdown-toggle" type="button" id="dropdownMenu2"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Action </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                    ${actionbtn}
                                    </div>
    
                                </div>
                                </div>

                                <div class="CountryName">${element['city'] ? element['city'] : element['city'] ? element['city'] : 'NA'}</div>

                            </div>
                    
                        </div>
                    </div>`);
            }
            test.push(element);
            all_cust[total_indexes] = test;
            if (array_items_count == 12) {
                array_items_count = 0;
                test = [];
                total_indexes++;
            }
        });

    }


}
function capitalize(s) {
    return s.toLowerCase().replace(/\b./g, function (a) {
        return a.toUpperCase();
    });
};
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
function fetchPagination(pageLen = null, curPage = null, type = null) {

    item = [];
    for (var i = 1; i <= pageLen; i++) {
        item.push(i);
    }
    render(pageLen, curPage, item, true, type);
}
function render(pageLen = null, curPage, item, first, type) {
    if (type == 'client') {
        $('#cust_holder').empty();
    } else if (!type) {
        if (current_action == 'client') {
            $('#cust_holder').empty();
        } else {
            $('#poc_holder').empty();
        }
    } else {
        $('#poc_holder').empty();
    }
    //debugger
    var html = '';
    separatorAdded = false;
    for (var i in item) {
        if (isPageInRange(curPage, i, pageLen, 2, 2)) {
            html += '<li class="' + (type == "client" ? 'customer_page_link' : (!type ? (current_action == 'client' ? 'customer_page_link' : 'poc_page_link') : 'poc_page_link')) + '" name="' + i + '" ' + (type == "client" ? 'data-page' : (!type ? (current_action == 'client' ? 'data-page' : 'data-page-poc') : 'data-page-poc')) + '="' + i + '">' + item[i] + '</li>';
            // as we added a page, we reset the separatorAdded
            separatorAdded = false;
        } else {
            if (!separatorAdded) {
                // only add a separator when it wasn't added before
                html += '<li class="separator" />';
                separatorAdded = true;
            }
        }
    }
    if (type == 'client') {
        var holder = document.querySelector('#cust_holder');
        holder.innerHTML = html;
        document.querySelector('#cust_holder>li[data-page="' + curPage + '"]') ? document.querySelector('#cust_holder>li[data-page="' + curPage + '"]').classList.add('active') : '';
    } else if (!type) {
        if (current_action == 'client') {
            var holder = document.querySelector('#cust_holder');
            holder.innerHTML = html;
            document.querySelector('#cust_holder>li[data-page="' + curPage + '"]') ? document.querySelector('#cust_holder>li[data-page="' + curPage + '"]').classList.add('active') : '';
        } else {
            var holder = document.querySelector('#poc_holder');
            holder.innerHTML = html;
            document.querySelector('#poc_holder>li[data-page-poc="' + curPage + '"]') ? document.querySelector('#poc_holder>li[data-page-poc="' + curPage + '"]').classList.add('active') : '';
        }
    } else {
        var holder = document.querySelector('#poc_holder');
        holder.innerHTML = html;
        document.querySelector('#poc_holder>li[data-page-poc="' + curPage + '"]') ? document.querySelector('#poc_holder>li[data-page-poc="' + curPage + '"]').classList.add('active') : '';
    }

    if (first) {
        holder.addEventListener('click', function (e) {
            if (!e.target.getAttribute((type == "client" ? 'data-page' : 'data-page-poc'))) {
                // no relevant item clicked (you could however offer expand here )
                return;
            }
            curPage = parseInt(e.target.getAttribute((type == "client" ? 'data-page' : 'data-page-poc')));
            render(pageLen, curPage, item);
        });
    }
}
function isPageInRange(curPage, index, maxPages, pageBefore, pageAfter) {
    if (index <= 1) {
        // first 2 pages
        return true;
    }
    if (index >= maxPages - 2) {
        // last 2 pages
        return true;
    }
    if (index >= curPage - pageBefore && index <= curPage + pageAfter) {
        return true;
    }
}
//Dynamic Search And Filter
$(document).on('input', '.dynamic_search', function () {

    if ($(this).val().length > 0) {

        rendersearch($(this).val(), $('.dynamic_filter').val());
    }
    if ($(this).val() == '') {

        rendersearch($(this).val(), $('.dynamic_filter').val());
    }
})
$(document).on('change', '.dynamic_filter', function () {

    rendersearch($('.dynamic_search').val(), $(this).val());
})