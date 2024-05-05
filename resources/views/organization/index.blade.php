@extends('layouts.app')
@section('content')
<style>
  .pt-7 {
    padding-top: 7px !important
  }

  .mb-4 {
    margin-bottom: 4px !important
  }

  .font11 {
    font-size: 11px !important
  }

  .headingDB {
    padding: 15px 20px !important;
    margin-left: -5px
  }

  .tablelist {
    font-size: 12px;
  }

  .tablelist th {
    background-color: #f6f6f6;
    font-size: 13px;
  }

  .tablelist th,
  .tablelist td {
    padding: 5px;
  }

  .tablelist td {
    border-bottom: solid 1px #f0f0f0
  }

  .addlocation {
    width: 100%;
    border-radius: 0;
    letter-spacing: 1px;
    line-height: 1;
  }

  .addlocation:hover,
  .addlocation:focus {
    background: linear-gradient(90deg, #001e35 0%, #001e35 100%);
    color: #fff
  }

  .subheading {
    font-size: 16px;
    padding-bottom: 5px;
    margin-bottom: 5px;
    margin-top: 15px;
    border-bottom: solid 1px #e7e7e7
  }

  .closebtn {
    padding: 10px;
    outline: none;
    font-size: 30px;
    float: right;
    margin-top: -5px;
  }

  .closebtn:focus {
    outline: none !important
  }
</style>
{{ $errors->first('fb_link') }}
<div id="product-cl-sec">
  <a href="#" id="pl-close" class="close-btn-pl"></a>
  <div class="pro-header-text">New <span>Location</span></div>
  <div class="pc-cartlist">
    <div class="overflow-plist">
      <div class="plist-content">
        <div class="_left-filter">
          <div class="container">
            <div class="row">
              <div class="col-12">
                <div id="floating-label" class="card p-20 top_border mb-3">
                  <h2 class="_head03">Location <span>Detail</span></h2>
                  <div class="form-wrap p-0">
                    <input type="hidden" id="hidden_location_country" name="hidden_country_id">
                    <input type="hidden" id="hidden_location_state" name="hidden_state_id">
                    <input type="hidden" id="hidden_location_city" name="hidden_city_id">
                    <form id="location_form">
                      @csrf
                      <input type="hidden" value="" name="location_id" id="location_id">

                      <div class="row">
                        <div class="col-md-4">
                          <div class="form-group">
                            <label class="control-label mb-10">Name *</label>
                            <input type="text" id="" class="form-control required_field" placeholder="" name="location_name">
                          </div>
                        </div>

                        <div class="col-md-4">
                          <div class="form-group">
                            <label class="control-label mb-10">Phone No *</label>
                            <input type="text" id="phone_no" class="form-control required_field" placeholder="" name="phone_no">
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group">
                            <label class="control-label mb-10">Email *</label>
                            <input type="text" id="location_email" class="form-control required_field" placeholder="" name="location_email">
                          </div>
                        </div>
                        <div class="col-md-12">
                          <div class="form-group">
                            <label class="control-label mb-10">Address *</label>
                            <input type="text" id="" class="form-control required_field" placeholder="" name="location_address">
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div class="form-group">
                            <label class="control-label mb-10">Latitude *</label>
                            <input type="text" id="latitude" class="form-control required_field" placeholder="" name="latitude">
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div class="form-group">
                            <label class="control-label mb-10">Longitude *</label>
                            <input type="text" id="longitude" class="form-control required_field" placeholder="" name="longitude">
                          </div>
                        </div>
                        <div class="col-md-6 mb-10">
                          <div class="form-s2">
                            <label class="font11 mb-0">Country *</label>
                            <select class="form-control countries_2 required_field formselect " placeholder="Select Residency Status" id="countries_2" name="country_id">

                            </select>
                          </div>
                        </div>

                        <div class="col-md-6 mb-10">
                          <div class="form-s2">
                            <label class="font11 mb-0">State/Province *</label>

                            <select class="form-control formselect states required_field" placeholder="Select Province/State" id="states_2" name="state_id">

                            </select>
                          </div>
                        </div>
                        <div class="col-md-6 mb-10">
                          <label class="font11 mb-0">City *</label>
                          <div class="form-s2">
                            <select class="form-control formselect cities required_field " placeholder="" id="cities_2" name="location_city_id">

                            </select>
                          </div>
                        </div>
                        <div class="col-md-6 pt-7">
                          <div class="form-group">
                            <label class="control-label mb-10">Postal Code *</label>
                            <input type="text" id="" class="form-control required_field" placeholder="" placeholder="" maxlength="6" minlength="6" name="location_postal_code_id">
                          </div>
                        </div>

                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="_cl-bottom">
    <button type="submit" class="btn btn-primary mr-2" id="savelocationBtn">Save</button>
    <button id="pl-close" type="submit" class="btn btn-cancel mr-2">Cancel</button>
  </div>
</div>
<div id="blureEffct" class="container-fluid">
  <div class="overlay-blure"></div>
  <div class="container">
    <form id="form" enctype="multipart/form-data" class="">
      @csrf
      <input type="hidden" id="hidden_country" value="{{$data !=null ? $data->country_id : ''}}" name="hidden_country_id">
      <input type="hidden" id="hidden_state" value="{{$data !=null ? $data->state_id : ''}}" name="hidden_state_id">
      <input type="hidden" id="hidden_city" value="{{$data !=null ? $data->city_id : ''}}" name="hidden_city_id">
      <input type="hidden" value="{{$data !=null ? $data->id : ''}}" name="hidden_id">
      <div class="row mt-2 mb-3">
        <div class="col-lg-6 col-md-6 col-sm-6">
          <h2 class="_head01">Add <span> Organization</span></h2>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-6">
          <ol class="breadcrumb">
            <li><a href="#"><span>Organization</span></a></li>
            <li><span>Add</span></li>
          </ol>
        </div>
      </div>
      <div class="row">
        <div class="col-md-9 ">
          <div class="card mb-30">
            <div class="header">
              <h2>Organization <span> Details</span></h2>
            </div>
            <div class="body PT-15">
              <div id="floating-label">
                <div class="form-wrap p-0">


                  <div class="row">

                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="control-label mb-10">Organization Name *</label>
                        <input type="text" id="" class="form-control required" placeholder="" value="{{$data!=null ?  $data->name : ''}}" name="name">
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="control-label mb-10">Phone *</label>
                        <input type="text" id="phone_number" class="form-control required" placeholder="" value="{{$data!=null ?  $data->phone_number : ''}}" name="phone_number">
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="control-label mb-10">Email *</label>
                        <input type="text" id="email" class="form-control required" placeholder="" value="{{$data!=null ?  $data->email : ''}}" name="email">
                      </div>
                    </div>
                    <!-- {{--
                    <div class="col-md-4 pt-7">
                      <div class="form-group">
                        <label class="control-label mb-10">Facebook Link</label>
                        <input type="text" id="" class="form-control  url_fb    " placeholder="" value="{{$data!=null ?  $data->fb_link : ''}}" name="fb_link">

                  </div>
                </div>

                <div class="col-md-4 pt-7">
                  <div class="form-group">
                    <label class="control-label mb-10">Insta Link</label>
                    <input type="text" id="" class="form-control   url_insta" placeholder="" value="{{$data!=null ?  $data->insta_link : ''}}" name="insta_link">
                  </div>
                </div>
                <div class="col-md-4 pt-7">
                  <div class="form-group">
                    <label class="control-label mb-10">Youtube Link</label>
                    <input type="text" id="" class="form-control   url_youtube" placeholder="" value="{{$data!=null ?  $data->youtube_link : ''}}" name="youtube_link">
                  </div>
                </div>
                <div class="col-md-4 pt-7">
                  <div class="form-group">
                    <label class="control-label mb-10">Twitter Link</label>
                    <input type="text" id="" class="form-control   url_twitter" placeholder="" value="{{$data!=null ?  $data->twitter_link : ''}}" name="twitter_link">
                  </div>
                </div>

                <div class="col-md-4 pt-7">
                  <div class="form-group">
                    <label class="control-label mb-10">Linked In Link</label>
                    <input type="text" id="" class="form-control   url_linked_in" placeholder="" value="{{$data!=null ?  $data->linkedin_link : ''}}" name="linked_in_link">
                  </div>
                </div>
                --}} -->
                    <div class="col-md-12 pt-10">
                      <div class="form-group">
                        <label class="control-label mb-10">Address *</label>
                        <input type="text" id="" class="form-control required" placeholder="" value="{{$data!=null ?  $data->address : ''}}" name="address">
                      </div>
                    </div>
                    <div class="col-md-4 mb-10">
                      <div class="form-s2">
                        <label class="font11 mb-0">Country *</label>
                        <select class="form-control required countries formselect required" placeholder="Select Residency Status" id="countries" name="country_id">

                        </select>
                      </div>
                    </div>
                    <div class="col-md-4 mb-10">
                      <div class="form-s2">
                        <label class="font11 mb-0">State/Province *</label>

                        <select class="form-control required formselect required" placeholder="Select Province/State" id="states" name="state_id">

                        </select>
                      </div>
                    </div>
                    <div class="col-md-4 mb-10">
                      <label class="font11 mb-0">City *</label>
                      <div class="form-s2">
                        <select class="form-control formselect required" placeholder="" id="cities" name="city_id">

                        </select>
                      </div>
                    </div>
                    <div class="col-md-4 pt-7">
                      <div class="form-group">
                        <label class="control-label mb-10">Postal Code </label>
                        <input type="text" id="" class="form-control required" placeholder="" placeholder="" maxlength="6" minlength="6" name="postal_code_id" value="{{$data!=null ?  $data->postal_code : ''}}">
                      </div>
                    </div>
                    @if($data !=null && $data->id != null)
                    <div class="header w-100 d-none">
                      <h2>Store <span>Locations</span></h2>
                      <a id="productlist01" class="btn add_button openSideBarForAddingLocation"><i class="fa fa-plus"></i>
                        <span>Add New</span></a>
                    </div>

                    <div class="col-12 tablelist PT-20 locations d-none">
                    </div>
                    @endif




                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>



        <div class="col-md-3 ">
          <div class="card mb-30">
            <div class="header">
              <h2>Organization <span> Logo</span></h2>
            </div>
            <div class="col-md-12 PT-10 PB-10">
              <div class="form-wrap p-0">
                <div class="upload-pic"></div>
                <input type="hidden" name="hidden_logo_img" value="{{$data !='' ? $data->logo_img : ''}}">
                <input type="file" id="input-file-now" data-default-file="/storage/{{$data !='' ? $data->logo_img : ''}}" class="dropify" name="logo_img" data-old_input="hidden_logo_img" />
              </div>
            </div>
          </div>


        </div>
        <div class="col-md-12 text-center" style="margin-bottom:50px">
          <button type="button" class="btn btn-primary mr-2 save_form">Save</button>
        </div>
      </div>

    </form>
  </div>
</div>
@endsection
@push('js')
<script src="{{asset('js/custom/organization.js')}}">
</script>

@endpush