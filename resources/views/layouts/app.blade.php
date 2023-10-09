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

    <style>
        /* body {
            display: none
        } */

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
    </style>
    <link href="{{asset('/css/wizard.css')}}" rel="stylesheet" type="text/css" />
    <link href="{{asset('/css/jquery.steps.css')}}" rel="stylesheet">
    <link rel="stylesheet" href="{{asset('/css/selectize.css')}}">
    <link rel="stylesheet" type="text/css" href="{{asset('/css/style.css?v=7.1')}}">
    <link rel="stylesheet" type="text/css" href="{{asset('/css/menu.css?v=6.4')}}" />
    <link rel="stylesheet" type="text/css" href="{{asset('/css/product.css?v=8.1')}}" />
    <link rel="stylesheet" type="text/css" href="{{asset('/css/jquery.mCustomScrollbar.css')}}" />
    <link rel="stylesheet" href="{{asset('/css/animate.css')}}">
    <script src="{{asset('/js/moment.js')}}"></script>

    <!-- Title -->
    <title>Store</title>
</head>
<body style="display: block;">
    @php $close_routes  = closeRoute() @endphp
    @php $is_close      = isClose() @endphp
    <div id="notifDiv">
    </div>

    @if(request()->segment(1) != 'stock-add'  && request()->segment(1) != 'purchase-edit'  &&  request()->segment(1) != 'sale-add' 
        && request()->segment(1) != 'sale-edit'  && request()->segment(1) != 'sale-return'  && request()->segment(1) != 'add-return'  
        && request()->segment(1) != 'edit-sale-return' && request()->segment(1) != 'product-replacement-create' && request()->segment(1) != 'product-replacement-edit')
            @include('layouts.sidebar-menu')
    @endif


    <!-- MAIN CONTENT -->
    <div class="main-content">
        <div id="content-wrapper">
            <div class="overlay-blure"></div>
            <div class="overlay-for-sidebar" style="display: none"></div>

            <div class="container  ">
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
            $("#contentContainerDiv").removeClass("blur-div");
            $('.dropify').dropify();
            $(".formselect").select2();
            $('#example').DataTable({
                "bSort" : false
            });

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
        $(document).on('input', '.only_decimal_numerics', function () {
            this.value = this.value.replace(/[^0-9.:]|(\.[0-9]{10,})/g,'');
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
        if(action != 'customer-ledger-jama' && action != 'customer-ledger-banam' && action != 'vendor-ledger-jama' && action != 'vendor-ledger-banam'  ){
            $(document).on("click", "#SN-close, .overlay-for-sidebar", function () {
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
            .on('changeDate', function (ev) {
                $(this).datepicker('hide');
            });
    </script>
    <!-- Vendor JS -->
    <script src="{{asset('/assets/js/vendor.bundle.js')}}"></script>

    <!-- Theme JS -->
    <script src="{{asset('/assets/js/theme.bundle.js')}}"></script><input type="file" multiple="multiple" class="dz-hidden-input" tabindex="-1" style="visibility: hidden; position: absolute; top: 0px; left: 0px; height: 0px; width: 0px;">
    @stack('js')
    @push('js')
    <script src="{{asset('js/custom/master.js')}}"> </script>
    @endpush
    <script>
            var is_close        =   '{!! $is_close !!}';
            if(is_close == 1){
                let page_route  =   location.href.split('/'); 
                var close_routes=   JSON.parse('{!! json_encode($close_routes) !!}');
                for (var key in close_routes) {
                    if (close_routes.hasOwnProperty(key)) {
                        var value   =   close_routes[key];
                        $(`.${key}`).hide().attr('disabled',true);
                        if(page_route[3] == value){
                            alert("Can't access because sale is close");
                            window.location.href = "/home";
                        }
                    }
                }
            }
    </script>
</body>

</html>
