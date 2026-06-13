<!DOCTYPE html>
<html lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="A fully featured admin theme which can be used to build CRM, CMS, etc.">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="csrf_token" content="{{ csrf_token() }}">
    <!-- Favicon -->
    <link rel="shortcut icon" href="https://dashkit.goodthemes.co/assets/favicon/favicon.ico" type="image/x-icon">
    {{ seo()->render() }}
    <!-- Map CSS -->
    <link rel="stylesheet" href="{{asset('/assets/css/mapbox-gl.css')}}">

    <!-- Libs CSS -->
    <link rel="stylesheet" href="{{asset('/assets/css/libs.bundle.css')}}">
    <!-- SC-CSS -->
    <link href="https://fonts.googleapis.com/css?family=Poppins:300,300i,400,400i,500,600,700,800" rel="stylesheet">
    <!-- <link rel="stylesheet" type="text/css" href="{{asset('/css/bootstrap.min.css?v=1.0')}}"> -->
    <link rel="stylesheet" type="text/css" href="{{asset('/css/datatables.min.css')}}" />
    <link href="{{asset('/vendor/fontawesome-free/css/all.min.css')}}" rel="stylesheet" type="text/css">

    <link rel='stylesheet' id='dokan-fontawesome-css' href='/fonts/font-awesome.min.css?ver=2.9.27' type='text/css' media='all' />
    <link rel="stylesheet" type="text/css" href="{{asset('/css/select2-bootstrap4.css')}}">
    <link rel="stylesheet" type="text/css" href="{{asset('/css/select2.min.css')}}">
    <link rel="stylesheet" type="text/css" href="{{asset('/css/dropify.min.css')}}" />
    <link rel="stylesheet" type="text/css" href="{{asset('/css/dropzone.css')}}" />
    <link rel="stylesheet" type="text/css" href="{{asset('/css/datepicker.css?v=1.1')}}" />
    <!-- <link rel="stylesheet" type="text/css" href="{{asset('/css/timepicker.css?v=1.1')}}" /> -->
    <!-- Theme CSS -->
    <link rel="stylesheet" href="{{asset('/assets/css/theme.bundle.css')}}" id="stylesheetLight">
    <link rel="stylesheet" href="{{asset('/assets/css/theme-dark.bundle.css')}}" id="stylesheetDark" disabled="">
    <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css')}}"> -->
  <link href="{{asset('/css/wizard.css')}}" rel="stylesheet" type="text/css" />
    <link href="{{asset('/css/jquery.steps.css')}}" rel="stylesheet">
    <link rel="stylesheet" href="{{asset('/css/selectize.css')}}">
    <link rel="stylesheet" type="text/css" href="{{asset('/css/style.css?v=8.3')}}">
    <link rel="stylesheet" type="text/css" href="{{asset('/css/menu.css?v=6.4')}}" />
    {{-- Preview only: DataTables new UI — disable this line after approval --}}
    <link rel="stylesheet" type="text/css" href="{{asset('/css/datatables-theme.css?v=3.5')}}" />
    <link rel="stylesheet" type="text/css" href="{{asset('/css/brand-theme.css?v=1.3')}}" />
    <link rel="stylesheet" type="text/css" href="{{asset('/css/product.css?v=8.2')}}" />
    <link rel="stylesheet" type="text/css" href="{{asset('/css/jquery.mCustomScrollbar.css')}}" />
    <link rel="stylesheet" href="{{asset('/css/animate.css')}}">
    <script src="{{asset('/js/moment.js')}}"></script>
    <style>
  
     .prod-bal-div{
        float: right;   
        color: #040725;
        font-weight: bolder;
        font-family:'Rationale', sans-serif !important;
        font-size: 18px;
        }
        /* body {
            display: none
        } */
        .sidebox-content, .right_Info{
            border-radius :10px;
        }
        .btn{
            border-radius :5px !important;
        }
         td{
            font-weight: bolder !important;
        }
        input{
            font-weight: 700
        }
       .comment{
           
            color: #ffffff;
            font-size: 13px; 
            font-family: monospace;
            padding: 4px 10px;
            background: #040725;
            border-radius: 5px;
        }
        #notifDiv {
            display: none;
            background: red;
            color: white;
            font-weight: 400;
            font-size: 15px;
            width: 350px;
            position: fixed;
            top: 80%;
            left: 10%;
            z-index: 10000;
            padding: 10px 20px
        }

        #addMoreProductsInOrder:hover {
            color: white !important
        }

        #product-cl-sec {
            box-shadow: 0px 0px 100px 0px rgba(0, 0, 0, 0.5);
        }

        .overlay-for-sidebar {
            display: none;
            position: fixed;
            width: 100vw;
            height: 100vh;
            z-index: 998;
            opacity: 0;
        }

        /* .select2 {
            width: 100% !important;
            z-index: 999
        } */

        .dz-image img {
            width: 100%;
            height: 100%;
        }

        .peventsDisabled {
            pointer-events: none
        }

        .datepicker-dropdown {
            z-index: 1060 !important;
        }

        #repDelayBtn:hover,
        #addProdBtn:hover,
        #markComplBtn:hover {
            color: white !important
        }

        .select2 {
            width: 100% !important;
        }

        .loader {
            display: block;
            -webkit-user-select: none;
            margin: auto;
            background-color: hsl(0, 0%, 90%);
        }

       .smBTN:focus,#save:focus,#print-invoice:focus {
            background: white !important;
            color: #040725 !important;
            border: 1px solid #040725 !important;
        }
        #save:hover,#print-invoice:hover {
            background: white !important;
            color: #040725 !important;
            border: 1px solid #040725 !important;
        }

        .btn-product-add:focus {
            background: green !important;
            color: white !important;
            border: 1px solid #040725 !important;
        }

        /* @media (max-width: 320px) {

            tbody {
                overflow-x: auto;
                white-space: nowrap;
            }
        } */ 

        .lds-ring div {
            box-sizing: border-box;
            display: block;
            position: absolute;
            width: 34px;
            height: 34px;
            margin: 6px;
            border: 6px solid #001e35;
            border-radius: 50%;
            animation: lds-ring 1.5s cubic-bezier(.7, .1, .3, .9) infinite;
            border-color: transparent;
            border-top-color: #001e35;
        }
        .lds-ring :nth-child(1) {
            animation-delay: -0.1s;
            opacity: 0.8;
        }
        .lds-ring :nth-child(2) {
            animation-delay: -0.2s;
            opacity: 0.6;
        }
        .lds-ring :nth-child(3) {
            animation-delay: -0.3s;
            opacity: 0.4;
        }
        .lds-ring :nth-child(4) {
            animation-delay: -0.4s;
            opacity: 0.2;
        }
        @keyframes lds-ring {
        0% {
        transform: rotate(0deg);
        }
        100% {
        transform: rotate(360deg);
        }
        }
        .loader-div {position: absolute;	display: inline-block;	width: 50px;height: 50px;margin: auto;
            left: 0;right: 0;top: 0;bottom: 0;}

            @-webkit-keyframes wcLoading {
    0% {
        -webkit-transform: scaleY(0.1);
        transform: scaleY(0.1);
        background: var(--white);
    }

    50% {
        -webkit-transform: scaleY(1);
        transform: scaleY(1);
        background: #001e35;
    }

    100% {
        -webkit-transform: scaleY(0.1);
        transform: scaleY(0.1);
        background: transparent;
    }
}

@keyframes wcLoading {
    0% {
        -webkit-transform: scaleY(0.1);
        transform: scaleY(0.1);
        background: var(--white);
    }

    50% {
        -webkit-transform: scaleY(1);
        transform: scaleY(1);
        background: #001e35;
    }

    100% {
        -webkit-transform: scaleY(0.1);
        transform: scaleY(0.1);
        background: transparent;
    }
}

.preloader {
    width: 100%;
    height: 100vh;
    background-color: var(--black-2);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99999;
}

.loading {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    z-index: 2;
}

.loading .bar {
    width: 3px;
    height: 60px;
    /* background: var(--white); */
    display: inline-block;
    /* -webkit-transform-origin: bottom center; */
    /* transform-origin: bottom center; */
    -webkit-animation: wcLoading 1.5s ease-in-out infinite;
    animation:wcLoading 1.5s ease-in-out infinite;
}
#content-wrapper, body{
    /* background-color: #f1f1f1; */
    background-color: #fff;
}
.loading .bar1 {
    -webkit-animation-delay: 0.1s;
    animation-delay: 0.1s;
}

.loading .bar2 {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
}

.loading .bar3 {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
}

.loading .bar4 {
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
}

.loading .bar5 {
    -webkit-animation-delay: 0.5s;
    animation-delay: 0.5s;
}

.loading .bar6 {
    -webkit-animation-delay: 0.6s;
    animation-delay: 0.6s;
}

.loading .bar7 {
    -webkit-animation-delay: 0.7s;
    animation-delay: 0.7s;
}

.loading .bar8 {
    -webkit-animation-delay: 0.8s;
    animation-delay: 0.8s;
}
.select2-dropdown--below{
            width: 350px !important;
}
.right_Info{
    padding-bottom: 15px !important;
}
 @media only screen and (max-width:575px) {
    
     .navbar-brand-img{ 
            height: 50px !important;
     }
 }
 .select2-container--open .select2-dropdown--above, .select2-container--open .select2-dropdown--below {
    font-weight: bolder;}
    </style>
  

    <!-- Title -->
    <title>Store</title>
</head>

<body style="display: block;font-family: system-ui !important;">
    @php $close_routes = closeRoute() @endphp
    @php $is_close = isClose();
    $is_container = 0;
    @endphp
    <div id="notifDiv">
    </div>

    @if(request()->segment(1) != 'stock-add' && request()->segment(1) != 'purchase-edit' && request()->segment(1) != 'sale-add'
    && request()->segment(1) != 'sale-edit' && request()->segment(1) != 'sale-return' && request()->segment(1) != 'add-return'
    && request()->segment(1) != 'edit-sale-return' && request()->segment(1) != 'product-replacement-create' && request()->segment(1) != 'product-replacement-edit'
    && request()->segment(1) != 'detail' && request()->segment(1) != 'purchase-return-edit' && request()->segment(1) != 'sale-detail')
    <?php $is_container = 1; ?>
    @include('layouts.sidebar-menu')
    @endif



    <!-- MAIN CONTENT -->
    <div class="main-content">
        <div id="content-wrapper">
            <div class="overlay-blure"></div>
            <div class="overlay-for-sidebar" style="display: none"></div>

            <div class="{{$is_container == 1 ? 'container' : ''}}">
                <!-- <div class="md-header-fixed">
                    <div class="MD__Logo"><img src="{{asset('images/Shama-logo.png')}}" alt="" /></div>
                    <button class="mobile__toggler" id="modalShow"><span></span></button>
                </div> -->
                @yield('data-sidebar')
                <div id="contentContainerDiv" class="blur-div">
                    @yield('content')
                </div>
            </div>
            @include('layouts.footer')
        </div>
    </div>

    <!-- JAVASCRIPT -->
    <!-- Map JS -->
    <script src="{{asset('/assets/js/mapbox-gl.js')}}"></script>
    <script src="{{asset('/js/jquery-3.3.1.min.js')}}"></script>
    <script src="{{asset('/js/popper.min.js')}}"></script>
    <script src="{{asset('/js/bootstrap.min.js')}}"></script>
    <script src="{{asset('/js/datatables.min.js')}}"></script>
    <script src="{{asset('/js/select2.min.js')}}"></script>
    <script src="{{asset('/js/dropify.min.js')}}"></script>
    <script src="{{asset('/js/custom.js')}}"></script>
    <script src="{{asset('/js/jquery.form.min.js')}}"></script>
    <script src="{{asset('/js/selectize.min.js')}}"></script>
    <script src="{{asset('/js/bootstrap-datepicker.js?v=1.1')}}"></script>
    <script src="{{asset('/js/dataTables.buttons.min.js')}}"></script>
    <script src="{{asset('/js/jquery.mCustomScrollbar.min.js')}}"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.33/pdfmake.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.1.0/js/buttons.html5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.1.0/js/buttons.print.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.2.2/js/buttons.colVis.min.js"></script>

    <script src="https://cdn.datatables.net/buttons/2.2.2/js/dataTables.buttons.min.js"></script>

    <script>
        let dateFormat = "yyyy-mm-dd";
        var segments = location.href.split('/');
        var action = segments[3];
        $(document).ready(function() {
            setTimeout(() => { 
                $('#tblLoader').hide();
                $('.parent-div').show();
            }, 1500);
            window.reportPageLoader = function (show) {
                var $loader = $('#contentContainerDiv .card.report-list-card > .loader, #contentContainerDiv .card:has(.teacher_attendance_list) > .loader');
                show ? $loader.show() : $loader.hide();
            };

            window.initListDataTable = function (selector, options) {
                var $table = $(selector);
                if (!$table.length) return null;
                if ($.fn.DataTable.isDataTable($table)) {
                    $table.DataTable().clear().destroy();
                }
                $table.removeClass('dtr-inline collapsed');
                return $table.DataTable($.extend(true, {
                    responsive: false,
                    autoWidth: false,
                    scrollX: false,
                    bSort: false,
                    stripeClasses: []
                }, options || {}));
            };

            window.initReportDateRange = function (formSelector, defaultDays) {
                defaultDays = defaultDays || 30;
                var $form = $(formSelector);
                if (!$form.length) return;
                var $start = $form.find('input.start_date, input[name="start_date"]').first();
                var $end = $form.find('input.end_date, input[name="end_date"]').first();
                if (!$start.length || !$end.length) return;
                if (!$end.val()) $end.val(moment().format('YYYY-MM-DD'));
                if (!$start.val()) $start.val(moment().subtract(defaultDays, 'days').format('YYYY-MM-DD'));
            };

            window.initReportDateRangePicker = function (root, defaultDays) {
                defaultDays = defaultDays || 30;
                var $root = root ? $(root) : $(document);
                $root.find('.report-date-range').each(function () {
                    var $wrap = $(this);
                    if ($wrap.data('range-picker-inited')) return;
                    var $display = $wrap.find('.report-range-display');
                    if (!$display.length) return;
                    $wrap.data('range-picker-inited', true);

                    var $start = $wrap.find('input.start_date, input[name="start_date"]').first();
                    var $end = $wrap.find('input.end_date, input[name="end_date"]').first();
                    var pickingEnd = false;

                    function formatDisplay(d) {
                        return moment(d, 'YYYY-MM-DD').format('DD/MM/YYYY');
                    }

                    function syncDisplay() {
                        var s = $start.val();
                        var e = $end.val();
                        if (s && e) {
                            $display.val(formatDisplay(s) + ' – ' + formatDisplay(e));
                        } else if (s) {
                            $display.val(formatDisplay(s) + ' – …');
                        } else {
                            $display.val('');
                        }
                    }

                    function setDefaults() {
                        if (!$end.val()) $end.val(moment().format('YYYY-MM-DD'));
                        if (!$start.val()) $start.val(moment().subtract(defaultDays, 'days').format('YYYY-MM-DD'));
                        pickingEnd = false;
                        syncDisplay();
                    }

                    $display.datepicker({
                        autoclose: false,
                        todayHighlight: true,
                        format: 'yyyy-mm-dd',
                        maxViewMode: 2,
                        forceParse: false
                    }).on('changeDate', function (e) {
                        var d = moment(e.date).format('YYYY-MM-DD');
                        if (!pickingEnd || !$start.val() || ($start.val() && $end.val())) {
                            $start.val(d);
                            $end.val('');
                            pickingEnd = true;
                        } else {
                            var s = moment($start.val(), 'YYYY-MM-DD');
                            var end = moment(d, 'YYYY-MM-DD');
                            if (end.isBefore(s)) {
                                $end.val($start.val());
                                $start.val(d);
                            } else {
                                $end.val(d);
                            }
                            pickingEnd = false;
                            $display.datepicker('hide');
                        }
                        syncDisplay();
                    });

                    function openRangePicker() {
                        if ($display.data('datepicker')) {
                            $display.datepicker('show');
                        }
                    }

                    $display.on('click focus', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        openRangePicker();
                    });

                    $wrap.on('click', function (e) {
                        if ($(e.target).closest('.datepicker').length) return;
                        openRangePicker();
                    });

                    $wrap.data('resetRange', setDefaults);
                    setDefaults();
                });
            };

            window.resetReportDateRangePicker = function (formSelector, defaultDays) {
                var $form = $(formSelector);
                if (!$form.length) return;
                if ($form.find('.report-date-range .report-range-display').length) {
                    $form.find('.report-date-range').each(function () {
                        var fn = $(this).data('resetRange');
                        if (typeof fn === 'function') fn();
                    });
                } else if (typeof initReportDateRange === 'function') {
                    initReportDateRange(formSelector, defaultDays || 30);
                }
            };

            $('form#search-form, .Product-Filter form, form.Product-Filter, form.all-sales-filter-form').each(function () {
                if ($(this).find('.report-date-range .report-range-display').length) {
                    initReportDateRangePicker(this, 30);
                } else if ($(this).find('input.start_date, input[name="start_date"]').length) {
                    initReportDateRange(this, 30);
                }
            });

            function addCommas(nStr) {
                nStr += "";
                x = nStr.split(".");
                x1 = x[0];
                x2 = x.length > 1 ? "." + x[1] : "";
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, "$1" + "," + "$2");
                }
                return x1 + x2;
            }
            $("#contentContainerDiv").removeClass("blur-div");
            $('.dropify').dropify();
            $(".formselect").select2();
            if ($('#example').length && !$.fn.DataTable.isDataTable('#example')) {
                initListDataTable('#example');
            }

            $(".form-control").on("focus blur", function(e) {
                $(this)
                    .parent()
                    .toggleClass(
                        "focused",
                        e.type === "focus" || this.value.length > 0
                    );
            }).trigger("blur");
            // $(".formselect").select2();
            $(".sd-type").select2({
                createTag: function(params) {
                    var term = $.trim(params.term);
                    if (term === "") {
                        return null;
                    }
                    return {
                        id: term,
                        text: term,
                        newTag: true // add additional parameters
                    };
                }
            });

        })
        // for text type inputs which are required to accept only numeric values
        $(document).on('input', '.only_numerics', function() {
            this.value = this.value.replace(/[^0-9.]/g, '');
        })
        // for text type inputs which are required to accept only aplphabetic values
        $(document).on('input', '.only_alphabets', function() {
            this.value = this.value.replace(/[^a-z]/gi, '');
        })
        $(document).on('input', '.only_decimal_numerics', function() {
            this.value = this.value.replace(/[^0-9.:]|(\.[0-9]{10,})/g, '');
        })
        $('#productlist01').click(function() {
            if ($('#product-cl-sec').hasClass('active')) {
                closeSidebar()
            } else {
                openSidebar()
            }
        });
        $("#pl-close, .close-sidebar, .overlay, .pl-close").on("click", function() {
            closeSidebar();
        });
        $(document).on("click", ".closeProductAddSidebar", function() {
            closeSidebar();
        });
        $(document).on("click", "#SN-close, .overlay-blure", function(e) {
            // allClasses = e.target.classList;
            // if(allClasses[2] && allClasses[2] == 'snCloseBtn'){

            // }
            // alert($(window).width());
            closeSubNav();
        });
        if (action != 'customer-ledger-jama' && action != 'customer-ledger-banam' && action != 'vendor-ledger-jama' && action != 'vendor-ledger-banam') {
            $(document).on("click", "#SN-close, .overlay-for-sidebar", function() {
                closeSidebar();
            });
        }
        // $(document).on("click", "#SN-close, .overlay-for-sidebar", function() {
        //     closeSidebar();
        // });

        function closeSidebar() {
            $(".customer_form_div").removeClass("active");
            $(".poc_form_div").removeClass("active");
            $("#product-cl-sec").removeClass("active");
            $("#product-add").removeClass("active");
            $("#performaPreferences").removeClass("active");
            $("#backup-gmail-sidebar").removeClass("active");
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
        $('#datepicker,.datepicker , #datepicker2').datepicker({
                autoclose: true,
                todayHighlight: true,
                toggleActive: true,
                format: dateFormat
            })
            .on('changeDate', function(ev) {
                $(this).datepicker('hide');
            });
    </script>
    <!-- Vendor JS -->
    <script src="{{asset('/assets/js/vendor.bundle.js')}}"></script>

    <!-- Theme JS -->
    <script src="{{asset('/assets/js/theme.bundle.js')}}"></script><input type="file" multiple="multiple" class="dz-hidden-input" tabindex="-1" style="visibility: hidden; position: absolute; top: 0px; left: 0px; height: 0px; width: 0px;">
    @stack('js')

    <script>
        var is_close = '{!! $is_close !!}';
        if (is_close == 1) {
            let page_route = location.href.split('/');
            var close_routes = JSON.parse('{!! json_encode($close_routes) !!}');
            for (var key in close_routes) {
                if (close_routes.hasOwnProperty(key)) {
                    var value = close_routes[key];
                    $(`.${key}`).hide().attr('disabled', true);
                    if (page_route[3] == value) {
                        alert("Can't access because sale is close");
                        window.location.href = "/home";
                    }
                }
            }
        }
    </script>
    <script src="{{asset('/js/custom/master.js')}}"> </script>
</body>

</html>