@extends('layouts.app')

@section('content')
<style>
  .modal-header .close { 
      margin: 0px ;  
}
  .pocPROFILE {
    font-size: 14px;
    padding: 15px 20px;
    line-height: 22px
  }

  .pocPROFILE h3 {
    font-size: 25px;
    margin: 0
  }

  .pocPROFILE h2 {
    font-size: 15px
  }

  .pocPic img {
    position: relative;
    width: 70px;
    height: 70px;
    height: auto;
    border-radius: 50%;
    -webkit-box-shadow: 0 0 20px 0 rgba(103, 92, 139, .25);
    box-shadow: 0 0 20px 0 rgba(103, 92, 139, .25);
  }

  .pocPROFILE .rightCont {
    letter-spacing: 1px;
    text-align: right
  }

  .pocPROFILE .rightCont .POCPH {
    font-size: 16px;
    display: block
  }

  .pocPROFILE .rightCont .POCPH strong {
    width: 108px;
    display: inline-block
  }

  .rightCont a {
    color: #EBB30A
  }

  .rightCont a:HOVER {
    text-decoration: underline
  }

  .pocPROFILE .form-control,
  .pocPROFILE .custom-select-sm,
  .pocPROFILE .form-s2 .select2-container .select2-selection--single,
  .phoneinput {
    box-shadow: none;
    height: 33px;
    background-color: #fff;
    border: solid 1px #e5e5e5;
    border-radius: 0;
    font-size: 13px;
  }

  .pocPROFILE .infoDiv {
    background-color: #f9f9f9;
    padding: 5px;
    margin-bottom: 8px;
  }

  .pocPROFILE .infoDiv .control-label {
    font-size: 13px;
    color: #7d7d7d !important;
    line-height: normal;
    margin-bottom: 0
  }

  .pocPROFILE .infoDiv p {
    font-size: 14px;
    color: #282828;
    line-height: normal;
    margin-bottom: 0
  }

  .pocPROFILE .p-col-L {
    padding-right: 4px
  }

  .pocPROFILE .p-col-R {
    padding-left: 4px
  }

  .ADD-border {
    border: solid 1px #ededed;
    padding: 10px 10px 4px 10px
  }

  .pocPROFILE .header {
    color: #424242;
    padding: 20px 0px;
    position: relative;
    box-shadow: none;
    background: none;
    border-bottom: solid 2px #ededed;
    margin-bottom: 5px;
    padding: 10px 0px;
  }

  .pocPROFILE .fa {
    color: #EBB30A
  }

  .POCBCard {
    width: 310px;
    height: auto
  }

  .PT-25 {
    padding-top: 25px !important
  }

  .pocPROFILE .dropify-wrapper {
    height: 150px;
    width: 100%;
  }

  .label-update {
    background: #EBB30A;
    color: #fff;
    text-align: center;
    font-size: 11px;
    line-height: 1;
    padding: 3px;
    margin-top: -24px;
    margin-left: 7px;
    z-index: 5;
    position: relative;
    width: 50px
  }

  .pocPROFILE .dropify-message p {
    letter-spacing: 0;
  }

  ._ch-pass {
    padding-top: 28px
  }

  .pocPROFILE .btn-primary,
  .pocPROFILE .btn-cancel {
    font-size: 13px
  }

  .change-password {
    box-shadow: none;
    padding: 15px;
    border: 1px solid rgba(0, 0, 0, .1);
  }

  .cp-close {
    line-height: 1;
    padding: 5px;
    position: absolute;
    right: -5px;
    top: -4px;
    opacity: .4;
    filter: grayscale(1)
  }

  .nam-title {
    font-size: 18px;
    margin-top: 15px;
    display: inline-block;
    letter-spacing: 1px
  }

  .con_info p {
    margin: 0;
    letter-spacing: 1.2px
  }

  .btn-edit-p {
    padding: 6px 14px 6px 14px;
    letter-spacing: 1px;
    font-size: 13px;
    line-height: 1;
    margin-top: -5px;
    float: right;
    margin-left: 10px
  }

  .btn-edit-line {
    color: #040725;
    background: #fff;
    border: 1px solid #040725;
  }

  .link-doc {
    border-bottom: solid 1px #EBEBEB;
    color: #282828;
    display: block;
    padding-top: 5px;
    padding-bottom: 5px;
    text-decoration: underline
  }

  .link-doc p {
    line-height: 1.3rem;
    height: 1.3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    font-size: 13px;
    font-: ;
    weight: normal;
    margin-bottom: 0px
  }

  .link-doc p img {
    width: 18px;
    height: 18px;
    filter: invert();
    margin-right: 8px;
    opacity: 0.5
  }

  .btn-primary {
    letter-spacing: 1px
  }

  .line-none h2:before {
    display: none;
  }

  .date-birth input {
    width: 70px;
    margin-right: 10px;
    display: inline-block;
  }

  .addBTN-act {
    font-size: 13px;
    background-color: #040725;
    border: none;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;
    -khtml-border-radius: 0;
    box-shadow: 2px 2px 10px 0 rgb(79 79 79 / 20%);
    padding: 6px 10px;
    color: #fff !important;
    float: right;
    cursor: pointer;
  }

  .closeBTN-d {
    background: #282828;
    border-radius: 50%;
    color: #fff;
    font-size: 14px;
    line-height: 22px;
    width: 24px;
    height: 24px;
    text-align: center;
    padding: 0;
    line-height: 1;
    border: solid 1px #282828 !important;
    outline: none;
    display: block;
    opacity: 0.5;
    margin-top: 5px;
  }

  .closeBTN-d:HOVER,
  .closeBTN-d:focus {
    opacity: 1;
    background: #f12300;
    border: solid 1px #f12300 !important;
  }

  .closeBTN-d i {
    color: #fff !important;
  }

  .phoneinput {
    padding-left: 10px;
  }

  .phone-SL {
    height: auto !important;
    margin: 0px;
  }

  .phone-SL .custom-select {
    font-size: 13px
  }

  .font11 {
    font-size: 11px;
  }

  .pt-7 {
    padding-top: 7px;
  }

  .mb-0 {
    margin-bottom: 0 !important;
  }


  .add-more-btn {
    color: #040725;
    background: linear-gradient(90deg, #e7e7e7 0%, #e7e7e7 100%);
    border: solid 1px #e7e7e7;
    box-shadow: none !important;
  }

  .pt-22 {
    padding-top: 22px !important;
  }

  /*  .disabled {
    background-color: #f5f5f5 !important;
    border: solid 1px #fff !important;
  } */

  .top-border {
    border-top: solid 2px #152e4d ;
  }

  .addBTN-act {
    padding: 3px 14px;
  }

  .close {
    position: absolute;
    top: -3px;
    right: 10px;
    z-index: 5;
    font-size: 32px
  }

  .close:focus {
    outline: none !important;
  }

  .close span {
    padding: 5px;
    line-height: 1;
  }

  .add-stock-input {
    font-size: 13px;
    width: 100px;
    height: 25px;
    box-shadow: none;
    border-color: #dddddd;
    padding: 0px 5px 0 8px;
    background-color: #f6f6f6;
  }
</style>
<div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content top-border">
            <div class="modal-header statusMH">
                <h5 class="modal-title" id="exampleModalLabel">Status: <span class="modal_poc_name"> </span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body p-20">
                    <div class="row">
                        <div class="col-4">
                            <div class="custom-control custom-radio">
                                <input class="custom-control-input radio_status net_sale" type="radio" value="1" id="net_sale" name="radio_status" checked="checked">
                                <label class="custom-control-label head-sta" for="net_sale">Net Sale</label>
                            </div>
                        </div>

                        <div class="col-4">
                            <div class="custom-control custom-radio">
                                <input class="custom-control-input radio_status add_to_ledger" type="radio" value="2" id="add_to_ledger" name="radio_status">
                                <label class="custom-control-label head-sta" for="add_to_ledger">Add to Ledger</label>
                            </div>
                        </div>

                        <div class="col-4">
                            <div class="custom-control custom-radio">
                                <input class="custom-control-input radio_status bank_transfer" type="radio" value="3" id="bank_transfer" name="radio_status">
                                <label class="custom-control-label head-sta" for="bank_transfer"> Bank Transfer</label>
                            </div>
                        </div> 
                    </div>

                </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary save_status"  style="font-size: 12px;" btn-value='0'>Save</button>
                <button type="submit" class="btn btn-primary save_status"  style="font-size: 12px;" btn-value='1'>Print</button>
            </div>
        </div>
    </div>
    <button hidden data-toggle="modal" data-target="#deleteModal" id="hidden_btn_to_open_modal"></button>
</div>
 

<!-- HEADER -->
<div class="header">
  <!-- Body -->
  <div class="header-body">
    <div class="row  ">
      <div class="col">
        <!-- Pretitle -->
        <h6 class="header-pretitle">
          Overview
        </h6>
        <!-- Title -->
        <h1 class="header-title">
          <h2 class="_head01">Sale <span>Invoice</span></h2>
        </h1>
      </div>
      <div class="col-auto">
        <ol class="breadcrumb">
          <li><a href="#"><span>Sale</span></a></li>
          <li><span>add</span></li>
        </ol>
        <!-- Button -->
        <!-- <a href="https://dashkit.goodthemes.co/index.html#!" class="btn btn-primary lift">
                        Create Report <i class="fa fa-car"></i>
                </a> -->
      </div>
    </div>
  </div>
</div>
<form id="form" enctype="multipart/form-data" class="">
  @csrf
  <input type="hidden" id="hidden_invoice_id" class="form-control " value="{{@$invoice->id}}" name="hidden_invoice_id">
  <input type="hidden" id="curren_customer_id" class="form-control " value="{{@$invoice->customer_id}}" name="customer_id">
  <input type="hidden" name="customer_ledger" id="customer_ledger" value="{{json_encode(@$get_customer_ledger)}}">
  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="body pocPROFILE">
          <div class="row">
            <div class="col-12">
              <div class="header pt-0">
                <h2>Sale <span>Definition</span>
              </h2>
              <a href="{{route('sales')}}" type="submit" class="btn btn-primary mr-2" id="cancel" style="    margin-top: -10px;float: right;">Sales</a>
              </div>

            </div>
             
          </div>
          <div class="se_cus-type p-20 mb-3">
            <div class="row">

              <div class="col-md-3 mb-10">
                <label class="control-label mb-5">Invoice #</label>
                <input type="text" id="" class="form-control required" placeholder="" name="invoice_no" value="{{@$invoice ? $invoice->invoice_no : $invoice_no}}">
              </div>
              <div class="col-md-3">
                <label class="control-label mb-5">Date </label>
                <div>
                  <input autocomplete="off" id="datepicker" type="text" class="form-control new_dob new_form_field " name="invoice_date" value="{{@$invoice ? $invoice->created_at->format('Y-d-m') : $current_date}}">
                </div>

              </div>
              <div class="col-md-3 client">
                <h2 class="_head04 border-0">Select <span>Cusotmer</span>*</h2>
                <div class="form-s2">
                <select class="form-control formselect custom er_id form_clear required" name="customer_id" id="customer_id" {{@$invoice->customer_id ? 'disabled' : ''}}>
                    <option value="0"> Select Customer*</option>
                    @foreach($customers as $customer)
                    <option value="{{$customer->id}}" {{$customer->id == @$invoice->customer_id ? 'selected' : ''}}>{{$customer->customer_name}}</option>
                    @endforeach
                  </select>
                </div>
              </div>
               <div class="col-md-3 client">
                <h2 class="_head04 border-0">Invoice<span> Type</span>*</h2>
                <div class="form-s2">
                <select class="form-control formselect form_clear required" name="invoice_type" id="invoice_type" {{@$invoice->customer_id ? 'disabled' : ''}}>
                    <option value="1" {{@$invoice->invoice_type ==1 ? 'selected' : ''}}>Net Sale</option>
                    <option value="2" {{@$invoice->invoice_type ==2 ? 'selected' : ''}}>Add To Ledger</option>
                </select>
                </div>
              </div>
             
             
            </div>

          </div>
          <div class="row">
            <div class="col-12">
              <div class="header pt-0">
                <h2>Stock <span>Definition</span></h2>
              </div>
            </div>
          </div>
          <div class="se_cus-type p-20 mb-3">
              <div class="row">
                <div class=" col-12">
                  <div class="row">
                    <!-- <div class="col-md-3 mb-30">
                      <div class="card cp-stats">
                        <div class="cp-stats-icon"><img src="/images/totalreveneue.svg" alt="" /></div>
                        <h5 class="text-muted">Total Reveneue</h5>
                        <h3 class="cp-stats-value dashboard_avg_rev">Loading...</h3>
                        <p class="mb-0"></p>
                      </div>
                    </div> -->

                    <div class="col-md-3 mb-30">

                      <div class="card cp-stats">
                        <div class="cp-stats-icon"><img src="/images/totalbookings.svg" alt="" /></div>
                        <h5 class="text-muted">Stock Balance</h5>
                        <h3 class="cp-stats-value dashboard_ttl_orders stock_balance">0</h3>
                        <p class="mb-0"></p>
                      </div>

                    </div>

                    <div class="col-md-3 mb-30">

                      <div class="card cp-stats">
                        <div class="cp-stats-icon"><img src="/images/active-cust.svg" alt="" /></div>
                        <h5 class="text-muted">Retail Price</h5>
                        <h3 class="cp-stats-value dashboard_active_cust retail_price">0</h3>
                        <p class="mb-0"></p>
                      </div>

                    </div>

                    <div class="col-md-3 mb-30">

                      <div class="card cp-stats">
                        <div class="cp-stats-icon"><img src="/images/avg-rv-cust.svg" alt="" /></div>
                        <h5 class="text-muted">Previous Receivable</h5>
                        <h3 class="cp-stats-value dashboard_avg_rev_perCust previous_payable">0</h3>
                        <p class="mb-0"></p>
                      </div>

                    </div>

                  </div>

                </div>
               
              </div>
          </div>
          <div class="row display" style="display: none;">
            <input type="hidden" id=""   value="1" name="form_status" >
            <input type="hidden" id="stock_products"  name="stock_products" value="{{json_encode($products)}}">

            <div class="col-12">
              <div class="property_info">
                <div class="row">
                  <div class="col-12 pt-10">
                    <div class="header pt-0">
                      <h2> Sale <span>Information</span></h2>
                    </div>
                  </div>
                </div>

                <div class="infoDiv p-15">
                <form id="purchse-form">
                  <div class="row">

                    <div class="col-md-2 mb-10">

                      <label class="control-label mb-5">ID</label>
                      <input type="text" id="bar-code" class="form-control bar-code" placeholder="" name="bar_code" data-attr='bar_code'>

                    </div>
                    <div class="col-md-3 mb-10">

                      <label class="control-label mb-5">Product Name</label>
                      <div class="form-s2">
                        <!-- <input type="text" id="product-name" class="form-control required " placeholder="" name="product_name" data-attr='product'> -->
                        <select class="form-control formselect products" name="product_name" id="products">
                          <option value="0"> Select Product *</option>
                          @foreach($products as $product)
                          <option value="{{$product->id}}">{{$product->product_name}}
                          </option>
                          @endforeach
                        </select>
                      </div>
                    </div>

                    <div class="col-md-3 mb-10">
                      <label class="control-label mb-5">Purchase Price</label>
                      <input type="text" id="purchase_price" class="form-control " placeholder="" name="purchase_price" readonly>
                    </div>
                    <div class="col-md-3 mb-10">
                      <label class="control-label mb-5">Retail Price</label>
                      <input type="text" id="retail_price" class="form-control" placeholder="" name="retail_price" readonly>
                    </div>

                    <div class="col-md-2 mb-10">

                      <label class="control-label mb-5">Quantity *</label>
                      <input type="text" id="qty" class="form-control   only_numerics" placeholder="" name="qty">

                    </div>
                    <div class="col-md-3">
                      <label class="control-label mb-5">Expiry Date</label>
                      <div>
                        <input autocomplete="off" id="datepicker" type="text" class="form-control new_dob new_form_field expiry_date " name="expiry_date">
                      </div>
                    </div>

                    <div class="col-md-3 mb-10">
                      <label class="control-label mb-5">Amount</label>
                      <input type="text" id="amount" class="form-control  " placeholder="" name="amount" readonly>
                    </div>

                    <div class="col-md-3  PT-20" id="btns_div">
                      <button type="button" id="add-product" class="btn btn-primary mr-2">Add</button>
                    </div>

                  </div>
                  </form>
                </div>
              </div>
            </div>

            <div class="col-12">

              <div class="form-wrap p-0">

                <div class=" show_existing_div" style="display: none">
                  <div class="col-12">
                    <div class="header pt-0">
                      <h2>Sale<span> Products List:</span></h2>
                    </div>
                  </div>
                  <div class=" p-15 show_existing_div" style="display:none">
                    <div class="row">
                      <div class="col-md-12 productRate-table m-0 body_customer_id mt-20 mb-30">
                        <table class="table table-bordered table-hover dt-responsive nowrap" id="designationsTable" style="width:100%;">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Product </th>
                              <th>Quantity</th>
                              <th>Price</th>
                              <th>Amount</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                          </tbody>
                          <tfoot class="table-footer">
                            <tr rowspan="5">
                              <th colspan="" style="text-align:right;font-family:sans-serif">Previous Payable</th>
                              <th class="previous_payable" colspan="" style="text-align: center;">0
                                <!-- <input type="text" value="" class="qty-input add-stock-input previous_payable" name="previous_payable"> -->
                              </th>
                              <th colspan="" style="text-align:right;font-family:sans-serif">Grand Total</th>
                              <th class="grand-total" colspan="4" style="text-align: center;">0</th>
                            </tr>
                            <tr rowspan="5">
                              
                            </tr>
                            @if (Route::currentRouteName() == 'sale-edit')
                              <tr rowspan="5">
                                  <th colspan="3" style="text-align:right;font-family:sans-serif">Paid</th>
                                  <th class="paid_amount" colspan="4" style="text-align: center;">0</th>
                              </tr>
                          @endif
                            
                            <tr rowspan="5"  class="th-to-hide">
                              <!-- <th colspan="3" style="text-align:right;font-family:sans-serif">Disscount </th>
                              <th class="" colspan="4" style="text-align: center;">
                                <input type="text" value="" class=" qty-input add-stock-input" data-id="" data-value="">
                              </th> -->
                            </tr><tr rowspan="5"  class="th-to-hide">
                              <th colspan="3" style="text-align:right;font-family:sans-serif">Service charges </th>
                              <th class="" colspan="4" style="text-align: center;">
                                <input type="text" value="" class=" qty-input add-stock-input service_charges_input" data-id="" data-value="">
                              </th>
                            </tr>
                            <tr rowspan="5"  class="th-to-hide">
                              <th colspan="3" style="text-align:right;font-family:sans-serif">{{Route::currentRouteName() == 'sale-edit' ? 'Remaining Amount' : 'Net Amount'}}</th>
                              <th class="" colspan="4" style="text-align: center;">
                                <input type="text" value="" class="qty-input add-stock-input amount_pay_input remaning_amount" name="amount_paid" readonly>
                              </th>
                            </tr>
                            <tr rowspan="5"  class="th-to-hide">
                              <th colspan="3" style="text-align:right;font-family:sans-serif">Cash Recived</th>
                              <th class="" colspan="4" style="text-align: center;">
                                <input type="number" class="add-stock-input amount_received">
                              </th>
                            </tr> 
                            <tr rowspan="5"  class="th-to-hide">
                              <th colspan="3" style="text-align:right;font-family:sans-serif">Cash Return</th>
                              <th class="cash_return" colspan="4" style="text-align: center;">
                               0 
                              </th>
                            </tr>
                            
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12 mt-25 p-0 detail_form">

                </div>

                <div class="col-md-12 text-right pr-0 PT-10" id="btns_div">
                  <button type="button" id="save" class="btn btn-primary mr-2">Save</button>
                  <button type="button" id="print-invoice" class="btn btn-primary mr-2">Print</button>               
                  <a href="{{route('sales')}}" type="submit" class="btn btn-cancel" id="cancel">Cancel</a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</form>




@endsection
@push('js')
<script>
  var clients = JSON.parse('{!! json_encode($customers)  !!}');
</script>
<script src="{{mix('js/custom/sale.js')}}"> </script>

@endpush