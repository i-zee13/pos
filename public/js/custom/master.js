$('#productlist01').click(function () {
    if ($('#product-cl-sec').hasClass('active')) {
        closeSidebar()
    } else {
        openSidebar()
    }
});
$("#pl-close, .close-sidebar, .overlay, .pl-close").on("click", function () {
    closeSidebar();
});

$(document).on("click", ".closeProductAddSidebar", function () {
    closeSidebar();
});

$(document).on("click", "#SN-close, .overlay-blure", function (e) {

    closeSubNav();
});

$(document).on("click", "#SN-close, .overlay-for-sidebar", function () {
    closeSidebar();
});

function closeSidebar() {
    $(".customer_form_div").removeClass("active");
    $(".poc_form_div").removeClass("active");
    $("#product-cl-sec").removeClass("active");
    $("#product-add").removeClass("active");
    $("#performaPreferences").removeClass("active");
    $(".overlay").removeClass("active");
    //$("body").toggleClass("no-scroll");
    $("#contentContainerDiv").removeClass("blur-div");
    $(".sticky-footer").removeClass("blur-div");
    $(".overlay-for-sidebar").css("display", "none");
    $("body").removeClass("no-scroll");
}

function openSidebar(element = "#product-cl-sec") {
    $(element).addClass("active");
    $(".overlay").addClass("active");
    $(".collapse.in").toggleClass("in");
    $("a[aria-expanded=true]").attr("aria-expanded", "false");
    $("body").toggleClass("no-scroll");
    $("#contentContainerDiv").addClass("blur-div");
    $(".sticky-footer").addClass("blur-div");
    $(".overlay-for-sidebar").css("display", "block");
}

var currentDate = new Date();

var startDate = new Date();
startDate.setMonth(currentDate.getMonth() - 1);

var formattedStartDate = startDate.toISOString().split('T')[0];
var formattedEndDate = currentDate.toISOString().split('T')[0];

$('.start_date').val(formattedStartDate);
$('.end_date').val(formattedEndDate);


$('#add-product').on('focus', function () {
    $(this).css('background', '#152e4d ');
});
$('#add-product').on('blur', function () {
    $(this).css('background', 'green');
});
$(document).on('mouseenter', '.show_purchase', function () {
    $('.pp').show();
}).on('mouseleave', '.show_purchase', function () {
    $('.pp').hide();
});

function addCommas(nStr) {
    nStr = parseFloat(nStr); // Parse, but don't round yet

    let x = nStr.toString().split('.'); // Convert to string and split
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';

    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    // Remove .00 if present
    if (x2 === '.00') {
      x2 = '';
    }

    return x1 + x2;
}
 

$(document).on('click', '.btn-invoice-delete', function() {
    deleteRef       = $(this);
    var id          = deleteRef.attr('id');
    var route       = deleteRef.attr('route');
    var invoice_for = deleteRef.attr('invoice-for');
    var id          = deleteRef.attr('id');
    var customer_id = deleteRef.attr('data-customer-id');
console.log(customer_id)
    swal({
            title: "Are you sure?",
            // text    : "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => { 
            deleteRef.attr('disabled', 'disabled');
            deleteRef.text('Processing...');
            if (willDelete) {
                $.ajax({
                    type: 'delete',
                    url: route,
                    data: {
                        _token      : $('meta[name="csrf_token"]').attr('content'),
                        id          : id,
                        route       : route,
                        invoice_for : invoice_for,
                        customer_id : customer_id
                    },
                    success: function(r) {
                        if (r.status == 'success') {
                            deleteRef.closest('tr').remove();
                            $('#notifDiv').fadeIn().css('background', 'green').text('Invoice deleted Successfully !');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);
                        } else {
                            $('#notifDiv').fadeIn().css('background', 'red').text('Not deleted at this moment !');
                            setTimeout(() => {
                                $('#notifDiv').fadeOut();
                            }, 3000);
                        }
                    }
                })
            }
        });

})