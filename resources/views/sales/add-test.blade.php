@extends('layouts.app')
 
<div class="parent-div" >
    
    <div class="modal fade" id="itemModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content  top_border">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Add Detail <span></span></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>
                </div>
                <div class="modal-body AddDetailPR">

                    <input type="hidden" id="product_id">
                    <div class="row">
                        <div class="col-md-4 PT-8 mb-15">Select Item: </div>
                        <div class="col-md-8 mb-15">
                            <div class="form-s2">
                                <select class="form-control formselect" id="productItems" onchange="itemUnitPrice(this);" placeholder="Select Item" style="width:100%" > 
                                    <option selected>Select Item</option>

                                </select>
                            </div>
                        </div>
                        <div class="col-md-4 PT-8 mb-15">Add Quantity: </div>
                        <div class="col-md-8 mb-15">
                            <input type="number" id="itemQty" class="form-control" placeholder="" style="font-size:13px">
                        </div>
                        <div class="col-md-4 PT-8" style="padding-top: 2px">Unit Price:</div>
                        <div class="col-md-8">
                            <input type="text" id="itemUnitPrice" class="form-control" placeholder="" style="font-size:13px">
                        </div>
                    </div>

                </div>
                <div class="modal-footer border-0" style="background-color: #f6f6f6">
                    <button type="button" class="btn btn-primary confirmItemAdd">Confirm</button>
                    <button type="submit" class="btn btn-cancel" data-dismiss="modal" aria-label="Close">Cancel</button>
                </div>
            </div>
        </div>
    </div>
    @section('content')
    <style>
      td{font-weight: bolder}
      input{font-weight: 700}
        select:focus>option:checked {
            background: #000 !important;
        }

        .OrderWrapper {
            padding: 0 !important;
        }

        .itemQTY {
            font-size: 12px;
            width: 70px;
            padding: 0px 5px;
            border: solid 1px #e6e6e6
        }

        .itemIMG {
            width: 32px;
            height: 32px;
            border: solid 1px #e5e5e5;
            margin-top: -5px;
            margin-bottom: -5px;
            margin-right: 5px;
            float: left
        }

        .productSearch {
            position: relative;
        }

        .productSearch input {
            height: 32px;
            border: solid 1px #eae9e9;
            -webkit-box-shadow: none;
            -moz-box-shadow: none;
            box-shadow: none;
            padding-left: 30px;
            font-size: 13px;
            letter-spacing: 1px;
        }

        .productSearch .fa {
            position: absolute;
            top: 8px;
            left: 8px;
            color: #b5b5b5;
        }

        .AddProductTable {
            padding: 0;
            margin: 0
        }

        .AddProductTable tr {
            border-bottom: solid 1px #eeeeee
        }

        .AddProductTable td {
            padding-bottom: 7px;
            padding-top: 7px
        }

        .ProListDiv {
            padding: 0;
            display: table;
        }

        .ProListDiv .PR_Name {
            display: table-cell;
            vertical-align: middle;
            font-size: 14px;
            letter-spacing: 1px;
            line-height: 16px
        }

        .ProListDiv .PrList_img {
            width: 35px;
            height: 35px;
            margin-right: 8px;
            border: solid 1px #e0e0e0
        }

        .AddProductTable .btn-default {
            padding: 5px 8px;
            font-size: 13px;
            -webkit-border-radius: 0;
            -moz-border-radius: 0;
            border-radius: 0;
            -khtml-border-radius: 0;
            background: linear-gradient(90deg, #1e54d3 0%, #040725 100%);
            color: #fff;
            text-align: center;
            margin: 0;
            line-height: 1;
            min-width: 74px;
            letter-spacing: 1px;
            float: right;
            border: none !important
        }

        .AddDetailPR {
            padding: 25px;
            font-size: 14px
        }

        .AddDetailPR .form-control {
            height: 32px;
            border: solid 1px #dedede;
            -webkit-box-shadow: none;
            -moz-box-shadow: none;
            box-shadow: none;
            padding: 0px 10px;
            font-size: 13px;
            letter-spacing: 1px;
        }

        .AddDetailPR select {
            border-radius: 0;
            padding: 0px 10px;
            height: 32px;
            border: solid 1px #dedede;
            font-size: 14px
        }

        .container-fluid {
            background-color: #f6f6f6;
        }

        .left-sidebox {
            -ms-flex: 420px;
            flex: 0 0 420px;
            max-width: 420px;
            padding-top: 15px;
            padding-bottom: 15px;
        }

        .sidebox-content {
            background-color: #fff;
            box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            width: 100%;
            min-height: calc(100vh - 30px);
        }

        .left_Info_ {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding-right: 5px;
            padding-top: 5px;
            padding-left: 15px;
        }

        .right-sidebox {
            padding-top: 15px;
            padding-right: 15px;
            padding-left: 5px;
            -ms-flex: 0 0 1056px;
            flex: 0 0 1056px;
            max-width: 1056px;
        }

        .right_Info {
            background-color: #fff;
            box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
            padding: 15px;
        }

        .title {
            position: relative;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 10px;
            padding-bottom: 10px;
            display: inline-block;
            width: 100%;
            padding-top: 20px;
        }

        .title span {
            font-family: 'proximanova-light', sans-serif !important
        }

        .CompanyInfo {
            font-size: 14px;
            line-height: 26px;
        }

        .left-sidebox .form-s2 .select2-container .select2-selection--single,
        .left-sidebox .select2-container--default .select2-selection--multiple {
            height: 35px !important;
            border: 1px solid #dbdbdb;
            background-color: #ffffff;
        }

        .font22 {
            font-size: 22px !important
        }

        .total-amt-top {
            float: right
        }

        .custom-select-cs {
            width: 100px;
            border-radius: 0;
            width: 100px;
            border-radius: 0;
            margin-top: 11px;
            background-color: #f6f6f6;
            height: 28px;
        }

        .TAM-div {
            font-family: 'Rationale', sans-serif !important;
            font-size: 28px;
            line-height: 1;
            text-align: right;
        }

        .TAM-div small {
            display: block;
            font-size: 13px;
            font-family: 'proximanova-light', sans-serif !important;
            letter-spacing: 1px
        }

        .inputfileds-top {
            font-size: 14px;
            line-height: 30px;
            border-bottom: solid 1px #dbdbdb
        }

        .inputfileds,
        .inputfileds-top .custom-select-sm {
            font-size: 13px;
            line-height: normal;
            width: 110px;
            border-radius: 0;
            float: right;
            margin-left: 8px;
            border: solid 1px #dbdbdb;
            height: 28px;
            padding-left: 5px;
            padding-right: 5px;
            margin-bottom: 15px;
        }

        .datefileds {
            width: 125px;
        }

        .inputfileds::-webkit-calendar-picker-indicator {
            margin: 2px
        }

        .inputSale {
            width: 90;
            border-radius: 0;
            border: solid 1px #dbdbdb;
            background-color: #f6f6f6;
            height: 24px;
            padding-left: 5px;
            padding-right: 5px;
        }

        .inputvalue {
            width: 110px;
            border-radius: 0;
            border: solid 1px #dbdbdb;
            background-color: #f6f6f6;
            height: 24px;
            padding-left: 5px;
            padding-right: 5px;
        }

        ._notesTER {
            font-size: 14px;
            border: none
        }

        .textarea-HA,
        .textarea-NOTES,
        .textarea-TERMS,
        .textarea-PMessage {
            border: solid 1px #dbdbdb;
            margin-top: 5px
        }

        .ProductTable {
            width: 100%;
            margin-top: 15px;
            line-height: normal
        }

        .ProductTable th {
            font-family: proximanova-semibold, sans-serif !important;
            background-color: #f6f6f6;
            border-bottom: solid 1px #f6f6f6;
            border-top: solid 1px #f6f6f6;
            border-right: solid 1px #f6f6f6;
            font-size: 12px;
            text-align: left;
            padding: 3px;
        }

        .ProductTable th,
        .ProductTable td {
            font-size: 12px;
            padding: 8px 5px;
            letter-spacing: normal
        }

        .ProductTable td {
            border-bottom: solid 1px #f6f6f6;
            border-right: solid 1px #f6f6f6;
            font-size: 12px;
            text-align: left;
        }

        .ProductTable td:first-child,
        .ProductTable th:first-child {
            border-left: solid 1px #f6f6f6;
        }

        .inputtable {
            border: solid 1px #dbdbdb;
            font-size: 12px;
            width: 70px;
            height: 24px;
        }

        ._order-delete {
            font-size: 15px;
            padding: 0px;
            margin: 0px;
            color: #ffffff;
        }

        ._order-delete .fa {
            color: #868686;
            padding: 0;
            margin: 0
        }

        ._order-delete:HOVER .fa {
            color: #f12300
        }

        .totalValues {
            font-size: 14px;
            font-family: proximanova-semibold, sans-serif !important;
        }

        .totalValues td {
            padding: 7px 0px 7px 7px
        }

        .totalNo {
            font-family: 'Rationale', sans-serif !important;
            font-size: 24px;
            line-height: 1
        }

        .td-pn {
            width: 210px;
        }

        .se_cus-type .form-control,
        .se_cus-type .form-s2 .select2-container .select2-selection--single,
        .AddDetailPR .form-s2 .select2-container .select2-selection--single {
            border: 1px solid #eeeeee;
            background-color: #fff;
        }

        .mb-15 {
            margin-bottom: 15px
        }

        .PT-8 {
            padding-top: 8px
        }


        @media (min-width: 1024px) {
            .left-sidebox {
                -ms-flex: 250px;
                flex: 0 0 250px;
                max-width: 250px;
                letter-spacing: normal
            }

            .right-sidebox {
                -ms-flex: 0 0 772px;
                flex: 0 0 772px;
                max-width: 772px;
            }

            .td-pn {
                width: 100px;
            }
        }

        @media (max-width: 1024px) {
            .CompanyInfo {
                line-height: 18px;
                font-size: 13px
            }

            .title {
                position: relative;
                font-size: 18px;
                margin-bottom: 8px;
                padding-bottom: 8px;
                padding-top: 8px;
            }
        }

        @media (min-width: 1280px) {
            .inputfileds-top {
                font-size: 13px
            }

            .inputfileds-top .col-auto {
                padding-left: 10px;
            }

            .left-sidebox {
                -ms-flex: 330px;
                flex: 0 0 330px;
                max-width: 330px;
                letter-spacing: normal
            }

            .right-sidebox {
                -ms-flex: 0 0 947px;
                flex: 0 0 947px;
                max-width: 947px;
            }

            .td-pn {
                width: 160px;
            }

        }

        @media (min-width: 1366px) {
            .left-sidebox {
                -ms-flex: 350px;
                flex: 0 0 350px;
                max-width: 350px;
            }

            .right-sidebox {
                -ms-flex: 0 0 999px;
                flex: 0 0 999px;
                max-width: 999px;
            }

            .td-pn {
                width: 190px;
            }
        }

        @media (min-width: 1440px) {
            .left-sidebox {
                -ms-flex: 380px;
                flex: 0 0 380px;
                max-width: 380px;
            }

            .right-sidebox {
                -ms-flex: 0 0 1044px;
                flex: 0 0 1044px;
                max-width: 1044px;
            }

        }

        .form-s2 .select2-container .select2-selection--single {
            height: 30px !important;
            border: solid 1px #dbdbdb;
            background-color: #ffffff;
        }

        .form-s2 .select2-container--default .select2-selection--single .select2-selection__rendered {
            line-height: 30px !important;
            font-size: 13px;
        }

        .select2-container--default .select2-selection--single .select2-selection__arrow {
            top: 0px !important;
        }
    </style>
    <div class="container-fluid">
          <!-- Start Container Fluid -->
               <div class="page-content">
 
                    <div class="row">
                         <div class="col-lg-8">
                              
                              
                              <div class="row">
                                @foreach($products as $product)
                                   <div class="col-xl-4 col-lg-6 col-md-6">
                                        <div class="card">
                                             <div class="card-body">
                                                  <div class="position-relative text-center bg-light">
                                                       <img src="/images/thumb-placeholder.jpg" alt="" class="img-fluid rounded">
                                                       
                                                  </div>
                                                  <div class="d-flex align-items-center justify-content-between gap-2 mt-3">
                                                       <div>
                                                            <a href="#!" class="text-dark fs-16 fw-semibold">{{$product->product_name}}</a>
                                                            <p class="fs-5 fw-normal mb-0">12-Inch</p>
                                                       </div>
                                                        
                                                  </div>
                                             </div>
                                             <div class="card-footer">
                                                  <div class="d-flex align-items-center justify-content-between">
                                                       <div>
                                                            <p class="text-primary mb-0 fw-medium mb-1 fs-14">Sale Price</p>
                                                            <p class="text-dark fw-semibold fs-16 mb-0">{{$product->sale_price}}</p>
                                                       </div>
                                                       <div class="d-flex align-content-center gap-1">
                                                            <a href="#!" class="btn btn-soft-primary avatar-sm rounded d-flex align-items-center justify-content-center"><i class="ri-shopping-basket-2-line align-middle fs-20"></i></a>
                                                            <a href="#!" class="btn btn-soft-danger avatar-sm rounded d-flex align-items-center justify-content-center"><i class="ri-heart-2-line align-middle fs-20"></i></a>
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                                   @endforeach
                                    
                                   
                              </div>
                              <div class="mb-3">
                                   <nav aria-label="Page navigation example">
                                        <ul class="pagination justify-content-end mb-0">
                                             <li class="page-item"><a class="page-link" href="javascript:void(0);"><i class="ri-arrow-left-s-line"></i></a></li>
                                             <li class="page-item active"><a class="page-link" href="javascript:void(0);">1</a></li>
                                             <li class="page-item"><a class="page-link" href="javascript:void(0);">2</a></li>
                                             <li class="page-item"><a class="page-link" href="javascript:void(0);">3</a></li>
                                             <li class="page-item"><a class="page-link" href="javascript:void(0);"><i class="ri-arrow-right-s-line"></i></a></li>
                                        </ul>
                                   </nav>
                              </div>
                         </div>
                         <div class="col-lg-4">
                              <div class="card">
                                   <div class="card-header">
                                        <h4 class="card-title">Order Summary</h4>
                                        <p class="mb-0">#ORD-2239</p>
                                   </div>
                                   <div class="card-body">
                                        <h5 class="fw-semibold">Total Items <span class="text-muted">(04)</span></h5>
                                        <div class="mt-3 border border-light  p-2 rounded">
                                             <div class="d-flex flex-wrap align-items-center gap-3">
                                                  <div class="rounded bg-light avatar-xl d-flex align-items-center justify-content-center">
                                                       <img src="assets/images/food-icon/pic12.png" alt="" class="avatar-xl">
                                                  </div>
                                                  <div>
                                                       <a href="#!" class="text-dark fs-15 fw-bold">Italian Burata Pizza</a>
                                                       <p class="fs-14 my-1">12-Inch</p>
                                                       <a href="#!" class="link-primary text-decoration-underline fw-semibold">View Details <i class="ri-arrow-right-up-line"></i></a>
                                                  </div>
                                                  <div class="ms-lg-auto">
                                                       <div class="input-step border bg-body-secondary p-1 mt-1 rounded d-inline-flex overflow-visible">
                                                            <button type="button" class="minus bg-light text-dark border-0 rounded fs-20 lh-1 h-100">-</button>
                                                            <input type="number" class="text-dark text-center border-0 bg-body-secondary rounded h-100" value="1" min="0" max="100" readonly="">
                                                            <button type="button" class="plus bg-light text-dark border-0 rounded fs-20 lh-1 h-100">+</button>
                                                       </div>
                                                  </div>
                                             </div>
                                             <hr>

                                             <div class="d-flex align-items-center justify-content-between px-1">
                                                  <div>
                                                       <p class="text-dark fw-semibold fs-16 mb-0">$12.00 <small class="text-decoration-line-through text-muted ms-1">$15.00</small></p>
                                                  </div>
                                                  <div class="d-flex align-content-center gap-1">
                                                       <a href="#!" class="btn btn-soft-danger avatar-sm rounded d-flex align-items-center justify-content-center"><i class="ri-delete-bin-5-line align-middle fs-20"></i></a>
                                                  </div>
                                             </div>
                                        </div>
                                        <div class="mt-3 border border-light  p-2 rounded">
                                             <div class="d-flex flex-wrap align-items-center gap-3">
                                                  <div class="rounded bg-light avatar-xl d-flex align-items-center justify-content-center">
                                                       <img src="assets/images/food-icon/pic15.png" alt="" class="avatar-xl">
                                                  </div>
                                                  <div>
                                                       <a href="#!" class="text-dark fs-15 fw-bold">Meat Tacos</a>
                                                       <p class="fs-14 my-1">3 tacos</p>
                                                       <a href="#!" class="link-primary text-decoration-underline fw-semibold">View Details <i class="ri-arrow-right-up-line"></i></a>
                                                  </div>
                                                  <div class="ms-lg-auto">
                                                       <div class="input-step border bg-body-secondary p-1 mt-1 rounded d-inline-flex overflow-visible">
                                                            <button type="button" class="minus bg-light text-dark border-0 rounded fs-20 lh-1 h-100">-</button>
                                                            <input type="number" class="text-dark text-center border-0 bg-body-secondary rounded h-100" value="2" min="0" max="100" readonly="">
                                                            <button type="button" class="plus bg-light text-dark border-0 rounded fs-20 lh-1 h-100">+</button>
                                                       </div>
                                                  </div>
                                             </div>
                                             <hr>

                                             <div class="d-flex align-items-center justify-content-between px-1">
                                                  <div>
                                                       <p class="text-dark fw-semibold fs-16 mb-0">$30.00 <small class="text-decoration-line-through text-muted ms-1">$34.00</small></p>
                                                  </div>
                                                  <div class="d-flex align-content-center gap-1">
                                                       <a href="#!" class="btn btn-soft-danger avatar-sm rounded d-flex align-items-center justify-content-center"><i class="ri-delete-bin-5-line align-middle fs-20"></i></a>
                                                  </div>
                                             </div>
                                        </div>
                                        <div class="mt-3 border border-light  p-2 rounded">
                                             <div class="d-flex flex-wrap align-items-center gap-3">
                                                  <div class="rounded bg-light avatar-xl d-flex align-items-center justify-content-center">
                                                       <img src="assets/images/food-icon/pic19.png" alt="" class="avatar-xl">
                                                  </div>
                                                  <div>
                                                       <a href="#!" class="text-dark fs-15 fw-bold">Veg Indian Thali</a>
                                                       <p class="fs-14 my-1">Single Person</p>
                                                       <a href="#!" class="link-primary text-decoration-underline fw-semibold">View Details <i class="ri-arrow-right-up-line"></i></a>
                                                  </div>
                                                  <div class="ms-lg-auto">
                                                       <div class="input-step border bg-body-secondary p-1 mt-1 rounded d-inline-flex overflow-visible">
                                                            <button type="button" class="minus bg-light text-dark border-0 rounded fs-20 lh-1 h-100">-</button>
                                                            <input type="number" class="text-dark text-center border-0 bg-body-secondary rounded h-100" value="2" min="0" max="100" readonly="">
                                                            <button type="button" class="plus bg-light text-dark border-0 rounded fs-20 lh-1 h-100">+</button>
                                                       </div>
                                                  </div>
                                             </div>
                                             <hr>

                                             <div class="d-flex align-items-center justify-content-between px-1">
                                                  <div>
                                                       <p class="text-dark fw-semibold fs-16 mb-0">$38.00 <small class="text-decoration-line-through text-muted ms-1">$30.00</small></p>
                                                  </div>
                                                  <div class="d-flex align-content-center gap-1">
                                                       <a href="#!" class="btn btn-soft-danger avatar-sm rounded d-flex align-items-center justify-content-center"><i class="ri-delete-bin-5-line align-middle fs-20"></i></a>
                                                  </div>
                                             </div>
                                        </div>
                                        <div class="position-relative mt-3">
                                             <div class="form-button">
                                                  <form class="d-flex align-items-center justify-content-center">
                                                       <input type="text" class="form-control border rounded" placeholder="Apply Coupon" required="" value="">
                                                       <button type="button" data-toast="" data-toast-text="Your Promo Code Apply Successfully" data-toast-gravity="top" data-toast-position="center" data-toast-classname="success" data-toast-duration="3000" class="btn btn-primary ms-2 rounded-2">
                                                           Apply
                                                       </button>
                                                  </form>
                                             </div>
                                        </div>
                                        <div class="mt-3">
                                             <div class="table-responsive">
                                                  <table class="table table-bordered bg-light-subtle">
                                                       <tbody>
                                                            <tr>
                                                                 <td>
                                                                      <p class="d-flex mb-0 align-items-center gap-1">Items : </p>
                                                                 </td>
                                                                 <td class="text-end text-dark fw-medium">5 (Items)</td>
                                                            </tr>
                                                            <tr>
                                                                 <td>
                                                                      <p class="d-flex mb-0 align-items-center gap-1"> Subtotal : </p>
                                                                 </td>
                                                                 <td class="text-end text-dark fw-medium">$80.00</td>
                                                            </tr>
                                                            <tr>
                                                                 <td>
                                                                      <p class="d-flex mb-0 align-items-center gap-1"> Delivery Charge : </p>
                                                                 </td>
                                                                 <td class="text-end text-dark fw-medium">$00.00</td>
                                                            </tr>
                                                            <tr>
                                                                 <td>
                                                                      <p class="d-flex mb-0 align-items-center gap-1"> Estimated Tax (12.5%) : </p>
                                                                 </td>
                                                                 <td class="text-end text-dark fw-medium">$9.00</td>
                                                            </tr>
                                                            <tr>
                                                                 <td>
                                                                      <p class="d-flex mb-0 align-items-center gap-1 fw-semibold text-danger"> Payable Amount : </p>
                                                                 </td>
                                                                 <td class="text-end text-success fw-semibold">$89.00</td>
                                                            </tr>
                                                       </tbody>
                                                  </table>
                                             </div>
                                        </div>
                                        <h5 class="fw-semibold my-3">Payment Method</h5>
                                        <div class="row g-2">
                                             <div class="col-lg-4">
                                                  <div class="form-check form-checkbox-success ps-0">
                                                       <label for="cash-payment" class="w-100">
                                                            <div class="d-flex align-items-center p-3 rounded gap-2 border">
                                                                 <div class="d-flex align-items-center gap-2">
                                                                     <h5 class="mb-0"><i class="ri-cash-fill text-success"></i> Cash</h5>
                                                                 </div>
                                                                 <div class="ms-auto">
                                                                      <input class="form-check-input float-end" type="radio" name="shipping" id="cash-payment" checked>
                                                                 </div>
                                                            </div>
                                                       </label>
                                                  </div>
                                             </div>
                                             <div class="col-lg-4">
                                                  <div class="form-check form-checkbox-success ps-0">
                                                       <label for="card-payment" class="w-100">
                                                            <div class="d-flex align-items-center p-3 rounded gap-2 border">
                                                                 <div class="d-flex align-items-center gap-2">
                                                                     <h5 class="mb-0"><i class="ri-bank-card-fill text-success"></i> Card</h5>
                                                                 </div>
                                                                 <div class="ms-auto">
                                                                      <input class="form-check-input float-end" type="radio" name="shipping" id="card-payment">
                                                                 </div>
                                                            </div>
                                                       </label>
                                                  </div>
                                             </div>
                                             <div class="col-lg-4">
                                                  <div class="form-check form-checkbox-success ps-0">
                                                       <label for="upi-payment" class="w-100">
                                                            <div class="d-flex align-items-center p-3 rounded gap-2 border">
                                                                 <div class="d-flex align-items-center gap-2">
                                                                     <h5 class="mb-0"><i class="ri-bank-fill text-success"></i> UPI</h5>
                                                                 </div>
                                                                 <div class="ms-auto">
                                                                      <input class="form-check-input float-end" type="radio" name="shipping" id="upi-payment">
                                                                 </div>
                                                            </div>
                                                       </label>
                                                  </div>
                                             </div>
                                        </div>
                                        <div class=" gap-1 hstack mt-3">
                                             <a href="#!" class="btn btn-danger w-100"><i class="ri-close-circle-line"></i> Cancel</a>
                                             <a href="#!" class="btn btn-primary w-100"><i class="ri-shopping-basket-2-line"></i> Order Placed</a>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
               <!-- End Page Content -->
    </div>

</div>
</div>
@endsection
@push('js')
<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>

<script>
    var clients = JSON.parse('{!! json_encode($customers)  !!}');
</script>
<script src="{{mix('js/custom/sale.js')}}"> </script>

@endpush