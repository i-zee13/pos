var operation = "";
var participation_id = null;
var base_url = window.location.origin;
//alert(base_url);
fetchParticipations();
function fetchParticipations() {

  all_participations = [];
  $.ajax({
    type: 'GET',
    url: '/brands',
    success: function (response) {
      $('.body').empty();
      $('.body').append('<table class="table table-hover dt-responsive nowrap subCatsListTable" style="width:100%;"><thead><tr><th>Name</th><th>logo</th><th>Action</th></tr></thead><tbody></tbody></table>');
      $('.subCatsListTable tbody').empty();

      var sNo = 1;
      all_sub_cat = response;
      response.forEach(element => {
        $('.subCatsListTable tbody').append('<tr><td>' + element['brand_name'] + '</td><td><img style="width:auto; height:30px;" src="' + 'storage/' + element['thumbnail'] + '" alt=""></td><td><button onclick="getBrandToEdit(' + element['id'] + ')" id="' + element['id'] + '" class="btn btn-default btn-line openSidebar">Edit</button><button onclick="deleteParticipation(' + element['id'] + ')" type="button" id="' + element['id'] + '" class="btn btn-default red-bg delete_btn" title="Delete">Delete</button></td></tr>');
      });
      $('#tblLoader').hide();
      $('.body').fadeIn();
      $('.subCatsListTable').DataTable();

    }
  });
}
function storeData(type, url) {

  if (
    $('#name').val() == "" ||
    $('#description').val() == ""
  ) {
    $('#notifDiv').fadeIn();
    $('#notifDiv').css('background', 'red');
    $('#notifDiv').text('Please provide all the required information (*)');
    setTimeout(() => {
      $('#notifDiv').fadeOut();
    }, 3000);
    return;
  }
  var formdata = new FormData();
  var name = $('#brand_name').val();

  formdata.append('name', name);
  description = $('#description').val();
  brand_id = $('#brand_id').val();

  formdata.append('brand_id', brand_id);
  formdata.append('description', description);
  var brandCustomId = $('input[name="brand_id"]').val();
  formdata.append('brand_custom_id', brandCustomId);
  formdata.append('image', $('#image')[0].files[0]);
  if ($('#save').text() == 'Update') {


    $.ajax({
      url: `/updateBrand/${participation_id}`,
      type: 'post',
      data: formdata,
      async: false,
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
      },
      contentType: false,
      processData: false,
      success: function (response) {
        if (response == "updated") {
          $('#notifDiv').fadeIn();
          setTimeout(() => {
            $('#notifDiv').fadeOut(), 10000
          })
          $('#notifDiv').css('background', 'green');
          $('#notifDiv').text('record updated successfully');

          $('#name').val("");
          $('#description').val("");
          $('#image').val(null);
          $('#brand_name').val("");
          $('.dropify-preview').attr('style', 'disply:none');
        }
      },

    });
    
    $('#pl-close').click();
    fetchParticipations();
    $('#save').text('Save');
    operation = "";
    return;

  }
  if ($('#save').text() == 'Save') {


    $.ajax({
      url: url,
      type: type,
      data: formdata,
      async: false,
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
      },
      contentType: false,
      processData: false,
      success: function (response) {
        if (response == "success") {
          $('#notifDiv').fadeIn();
          $('#notifDiv').css('background', 'green');
          $('#notifDiv').text('record added successfully');

          $('#name').val("");
          $('#description').val("");
          $('#image').val(null);
          $('#brand_name').val("");
          $('.dropify-preview').attr('style', 'disply:none');
        }
      },

    });
    setTimeout(() => {
      $('#notifDiv').fadeOut(), 3000
    })
    $('#pl-close').click();
    fetchParticipations();
  }


}
function getBrandToEdit(id) {
  operation = "update";
  participation_id = id;
  $.ajax({
    type: 'GET',
    url: `/editBrand/${id}`,
    async: false,
    success: function (responce) {
      var brand = responce;
      if (brand != '') {


        $('#brand_id').val(brand.brand_custom_id);
        $('#id-div').addClass('focused');
        $('#brand_name').val(brand.brand_name);
        $('#name-div').addClass('focused');
        $('#description').val(brand.description);
        $('#save').text('Update');
        openSidebar();
      }
    }

  })




  // openSidebar();
}
function deleteParticipation(id) {
  $.ajax({
    type: 'GET',
    url: `/deleteBrand/${id}`,
    success: function (response) {
      var e = response;
      if (e == "deleted") {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'green');
        $('#notifDiv').text('record deleted successfully');
        setTimeout(() => { $('#notifDiv').fadeOut(), 3000 })
      }
      fetchParticipations();
    }
  })

}


$(document).ready(function () {
  $('#example').DataTable();
});


$(document).ready(function () {

  $('#pl-close, .overlay').on('click', function (e) {
    e.preventDefault();
    $('#product-cl-sec').removeClass('active');
    $('.overlay').removeClass('active');
    $('body').toggleClass('no-scroll')
    $('#name').val("");
    $('#description').val("");
    $('#image').val(null);
    $('#brand_name').val("");
    $('.dropify-preview').attr('style', 'disply:none');
    $('#save').text('Save');


  });

  $('#productlist01').on('click', function () {
    $('#product-cl-sec').addClass('active');
    $('.overlay').addClass('active');
    $('.collapse.in').toggleClass('in');
    $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    $('body').toggleClass('no-scroll')
  });
  $('#save').on('click', function (e) {

    e.preventDefault();
    storeData('POST', '/brands');
  })

});




$(document).ready(function () {
  $('#SN-close, .overlay-blure').on('click', function () {
    $('#_subNav-id').removeClass('active');
    $('#content-wrapper').removeClass('blur-div');
    $('body').removeClass('no-scroll')
    $('#name').val("");
    $('#description').val("");
    $('#image').val(null);
    $('.dropify-preview').attr('style', 'disply:none');
    $('#save').text('Save');
  });
  $('#sidebar-menu').on('click', function () {
    $('#_subNav-id').addClass('active');
    $('#content-wrapper').addClass('blur-div');
    $('body').addClass('no-scroll')
  });
});


$('.form-control').on('focus blur', function (e) {
  $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
})
  .trigger('blur');
$(".formselect").select2();

$('.sd-type').select2({
  createTag: function (params) {
    var term = $.trim(params.term);

    if (term === '') {
      return null;
    }

    return {
      id: term,
      text: term,
      newTag: true // add additional parameters
    }
  }
});

// $('#datepicker').datepicker({
//     format: 'mm-dd-yyyy'
// });

// $('#tags').select2({
// 	tags: true,
//    // data: ["tag1","tag2"],
//     tokenSeparators: [','], 
//     placeholder: "Add Tags",
//     /* the next 2 lines make sure the user can click away after typing and not lose the new tag */
//     selectOnClose: true, 
//     closeOnSelect: false
// });
