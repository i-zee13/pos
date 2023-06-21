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
    // allClasses = e.target.classList;
    // if(allClasses[2] && allClasses[2] == 'snCloseBtn'){

    // }
    // alert($(window).width());
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