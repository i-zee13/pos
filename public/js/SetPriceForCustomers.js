
//const { isNumber } = require("lodash");


$(document).ready(function () {
  $('#customers').DataTable();
  var refrenceOfPriceListingTable = $('#example').DataTable();
  $('#save_prices_for_items').on('click', function () {
    var data = refrenceOfPriceListingTable.$('input , text').serialize();
    data = JSON.stringify(data);
    // var data = $('#example').serialize();
    // var data = new FormData($('#products_with_prices')[0]);
    // var data = new FormData(test);

    //  .filter((x)=>{
    //     return x != null;
    //   })
    //   console.log(data);
    //   return;



  })
});


$('#datepicker2').datepicker({
  autoclose: true,
  minViewMode: 1,
  format: 'mm/yyyy'
}).on('changeDate', function (selected) {
  startDate = new Date(selected.date.valueOf());
  startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
  $('.to').datepicker('setStartDate', startDate);
});



$('.form-control').on('focus blur', function (e) {
  $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
})
  .trigger('blur');

$(document).ready(function () {
  $('#SN-close, .overlay-blure').on('click', function () {
    $('#_subNav-id').removeClass('active');
    $('#blureEffct').removeClass('blur-div');
    $('body').removeClass('no-scroll')
  });
  $('#sidebar-menu').on('click', function () {
    $('#_subNav-id').addClass('active');
    $('#blureEffct').addClass('blur-div');
    $('body').addClass('no-scroll')
  });




});

function setPriceForCustomer(item_id) {

  var customer_id = $('#customer_id').val();
  var price = $(`#item-${item_id}`).val();
  if (price == '' || $.isNumeric(price)===false || price == 0 ) {
    var el = $('#notifDiv');
    el.fadeIn();
    el.css('background', 'red');
    el.text('Please Enter A Valid Amount');
    setTimeout(() => {
      el.fadeOut();
    }, 3000);
    return;
  }
  $(`#btn-${item_id}`).text('updating...');
  $(`#btn-${item_id}`).prop('disabled', true);

  // alert(price > 0 ? price : 0);
  $.ajax({
    url: `/submit-prices-of-items-for-specific-customer`,
    type: 'POST',
    data: { item_id: item_id, customer_id: customer_id, price: price },
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
    },
    success: function (e) {
      if (e == "success" || e == "updated"){
        var price = $(`#item-${item_id}`).val();
        $(`#btn-${item_id}`).text('Update');
        $(`#btn-${item_id}`).prop('disabled', false);
        var el = $('#notifDiv');
        el.fadeIn();
        el.css('background', 'green');
        el.text(e);
        setTimeout(() => {
          el.fadeOut();
        }, 3000);
      }else{
        var el = $('#notifDiv');
        el.fadeIn();
        el.css('background', 'red');
        el.text(e);

        setTimeout(() => {
          el.fadeOut();
        }, 3000);
      }

    }
  })
}
function redirect(){
  location.href = "/customers-list";
}
function redirectToHome(){
  location.href = "/home";
}

