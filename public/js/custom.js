!function (t) {
	"use strict";
	t("#sidebarToggle").click(function (e) {
		e.preventDefault(), t("body").toggleClass("sidebar-toggled"), t(".sidebar").toggleClass("toggled")
	}), t("body.fixed-nav .sidebar").on("mousewheel DOMMouseScroll wheel", function (e) {
		if (768 < $window.width()) {
			var o = e.originalEvent,
				t = o.wheelDelta || -o.detail;
			this.scrollTop += 30 * (t < 0 ? 1 : -1), e.preventDefault()
		}
	}), t(document).scroll(function () {
		100 < t(this).scrollTop() ? t(".scroll-to-top").fadeIn() : t(".scroll-to-top").fadeOut()
	}), t(document).on("click", "a.scroll-to-top", function (e) {
		var o = t(this);
		t("html, body").stop().animate({
			scrollTop: t(o.attr("href")).offset().top
		}, 1e3, "easeInOutExpo"), e.preventDefault()
	})


}(jQuery);

/**
 * Invoice pages: hide form + show #tblLoader until previous balance AJAX finishes.
 * Usage: toggleInvoiceBalanceLoader(true) before fetch, false in complete/error.
 * saleSave must refuse while invoiceBalanceLoading OR invoiceBalanceLoadedFor !== current customer.
 */
window.invoiceBalanceLoading = false;
window.invoiceBalanceLoadedFor = null;
function toggleInvoiceBalanceLoader(isLoading) {
    window.invoiceBalanceLoading = !!isLoading;
    if (isLoading) {
        window.invoiceBalanceLoadedFor = null;
        $('.parent-div').hide();
        $('#tblLoader').show();
        $('#save, #print-invoice').prop('disabled', true);
    } else {
        $('#tblLoader').hide();
        $('.parent-div').show();
        $('#save, #print-invoice').prop('disabled', false);
    }
}

function ensureInvoiceBalanceReady() {
    if (window.invoiceBalanceLoading) {
        $('#notifDiv').fadeIn().css('background', 'red').text('Please wait — customer previous balance is still loading…');
        setTimeout(function () { $('#notifDiv').fadeOut(); }, 3000);
        return false;
    }
    var custId = String($('#customer_id').val() || '');
    if (!custId || custId === '0') {
        return true; // caller handles missing customer
    }
    if (String(window.invoiceBalanceLoadedFor || '') !== custId) {
        $('#notifDiv').fadeIn().css('background', 'red').text('Customer previous balance not loaded yet. Please wait or re-select customer.');
        setTimeout(function () { $('#notifDiv').fadeOut(); }, 3000);
        return false;
    }
    return true;
}

 
function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#imgthu')
                        .attr('src', e.target.result);
                };
                reader.readAsDataURL(input.files[0]);
            }
 }

 
 $('.L_inv_search').click(function(){
    $(this).find('i').toggleClass('fa-search fa-times') 
});
 