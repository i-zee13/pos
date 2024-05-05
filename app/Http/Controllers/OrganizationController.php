<?php

namespace App\Http\Controllers;

use App\Models\PostalCode;
use App\Models\Organization;
use App\Models\OrganizationLocation;
use Illuminate\Http\Request;
use DB;
use Auth;

class OrganizationController extends Controller
{
   public function index()
   {

      $data           =  Organization::leftjoin('postal_codes', 'organization.postal_code_id', '=', 'postal_codes.id')
         ->select('organization.*', 'postal_codes.postal_code')->first();
      return view('organization.index', compact('data'));
   }
   public function store(Request $request)
   {

      $regex = '/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/';
      $validator       =   $this->validate($request, [
         'name'              => 'required',
         'phone_number'      => 'required',
         'address'           => 'required',
         'country_id'        => 'required',
         'state_id'          => 'required',
         'city_id'           => 'required',
         'postal_code_id'    => 'required',
      ]);
      if ($request->hidden_id != '') {
         $data            =    Organization::find($request->hidden_id);
      } else {
         $data            =    new Organization();
      }
      $existing_postal_code        =   DB::table('postal_codes')->where('postal_codes.postal_code', $request->postal_code_id)
         ->where('postal_codes.country_id', $request->country_id)
         ->first();
      //$postel_code_id     =  $postal_code->id;  
      if ($existing_postal_code) {
         $data->postal_code_id   =   $existing_postal_code->id;
      } else {
         $postal_code                   =    new PostalCode();
         $postal_code->country_id       =    $request->country_id;
         $postal_code->state_id         =    $request->state_id;
         $postal_code->city_id          =    $request->city_id;
         $postal_code->postal_code      =    $request->postal_code_id;
         $postal_code->created_at       =    date('Y-m-d H:i:s');
         $postal_code->created_by       =    Auth::user()->id;
         $postal_code->updated_by       =    Auth::user()->id;
         $postal_code->updated_at       =    date('Y-m-d H:i:s');
         $postal_code->save();
         if ($postal_code->save()) {
            $data->postal_code_id         =   $postal_code->id;
         }
      }
      if ($request->hasFile('logo_img')) {
         $data->logo_img  =   $request->logo_img->store('images', 'public');
      } else {
         $data->logo_img  =    $request->hidden_logo_img;

         if ($request->hidden_logo_img == '') {
            return response()->json([
               'status'    =>  'error',
               'msg'       =>  "Image Should Not be Empty",
            ]);
         }
      }
      $data->name             =   $request->name;
      $data->phone_number     =   $request->phone_number;
      $data->fb_link          =   $request->fb_link;
      $data->email            =   $request->email;
      $data->insta_link       =   $request->insta_link;
      $data->youtube_link     =   $request->youtube_link;
      $data->twitter_link     =   $request->twitter_link;
      $data->linkedin_link    =   $request->linked_in_link;
      $data->address          =   $request->address;
      $data->country_id       =   $request->country_id;
      $data->state_id         =   $request->state_id;
      $data->city_id          =   $request->city_id;

      $data->created_at       =    date('Y-m-d H:i:s');
      $data->created_by       =    Auth::user()->id;
      $data->updated_by       =    Auth::user()->id;
      $data->updated_at       =    date('Y-m-d H:i:s');
      $data->save();
      return response()->json([
         'status'    =>  'success',
         'msg'       =>  "Data Has been Added",

      ]);
   }
   public function storeLocaion(Request $request)
   {
      // dd($request->all());
      $validate           =   $request->validate([
         "location_name"      =>  'required',
         "phone_no"           =>  'required',
         "location_email"     =>  'required',
         "location_address"   =>  'required',
         "latitude"           =>  'required',
         "longitude"          => 'required',
         "country_id"         => 'required',
         "state_id"           => 'required',
         "location_city_id"   => 'required',
         "location_postal_code_id"  => 'required',

      ]);
      if ($request->location_id != '') {
         $id      =   $request->location_id;
         $location                 =   OrganizationLocation::find($id);
      } else {
         $location                 =  new  OrganizationLocation();
      }
      $existing_postal_code        =   DB::table('postal_codes')->where('postal_codes.postal_code', $request->location_postal_code_id)
         ->where('postal_codes.country_id', $request->country_id)
         ->where('postal_codes.state_id', $request->state_id)
         ->where('postal_codes.city_id', $request->city_id)
         ->first();
      //$postel_code_id     =  $postal_code->id;  
      if ($existing_postal_code) {
         // dd("exitisnbg");
         $location->postal_code_id      =   $existing_postal_code->id;
      } else {

         $postal_code                   =    new PostalCode();
         $postal_code->country_id       =    $request->country_id;
         $postal_code->state_id         =    $request->state_id;
         $postal_code->city_id          =    $request->city_id;
         $postal_code->postal_code      =    $request->location_postal_code_id;
         $postal_code->created_at       =    date('Y-m-d H:i:s');
         $postal_code->created_by       =    Auth::user()->id;
         $postal_code->updated_by       =    Auth::user()->id;
         $postal_code->updated_at       =    date('Y-m-d H:i:s');
         $postal_code->save();
         if ($postal_code->save()) {
            $location->postal_code_id         =   $postal_code->id;
         }
      }
      $location->location_name      =   $request->location_name;
      $location->phone_no           =   $request->phone_no;
      $location->email              =   $request->location_email;
      $location->address            =   $request->location_address;
      $location->latitude           =   $request->latitude;
      $location->longitude          =   $request->longitude;
      $location->country_id         =   $request->country_id;
      $location->state_id           =   $request->state_id;
      $location->city_id            =   $request->location_city_id;
      $location->created_at         =    date('Y-m-d H:i:s');
      $location->created_by         =    Auth::user()->id;
      $location->updated_by         =    Auth::user()->id;
      $location->updated_at         =    date('Y-m-d H:i:s');
      $location->save();
      return response()->json([
         'status'    =>  'success',
         'msg'       =>  "Location Has been Added",
         'location'     =>  $location

      ]);
   }
   public function locationList()
   {
      $location   =   OrganizationLocation::all();
      return response()->json([
         'status'    =>  'success',
         'msg'       =>  "Loactions has Fetched",
         'location'     =>  $location

      ]);
   }
   public function getLocation($id)
   {
      $location   =   OrganizationLocation::where('organization_location.id', $id)
         ->leftjoin('postal_codes', 'organization_location.postal_code_id', '=', 'postal_codes.id')
         ->select('organization_location.*', 'postal_codes.postal_code')->first();
      return response()->json([
         'status'    =>  'success',
         'msg'       =>  "Location has Fetched",
         'location'     =>  $location
      ]);
   }
   public function getCountries()
   {
      $countries      =     DB::table('countries')->get();
      $states         =     DB::table('states')->get();

      $result                 = [];
      $result['countries']    = $countries;
      $result['states']       = $states;

      return response()->json([
         'status'    =>  'success',
         'msg'       =>  "Geographyical Data Fetched Successfully",
         'result'    =>   $result
      ]);
   }
   public function getStateAgainst_Country($id)
   {
      $states = DB::table('states')->where('states.country_id', $id)->get();

      return response()->json([
         'status'  =>  'success',
         'msg'     =>  "States Fetched Successfully",
         'states'  =>  $states
      ]);
   }
   public function getCityAgainst_States($id)
   {
      $cities     =  DB::table('cities')->where('cities.state_id', $id)->get();
      return response()->json([
         'status' =>  'success',
         'msg'    =>  "Cities Fetched Successfully",
         'cities' =>  $cities
      ]);
   }
   public function deleteLocation($id)
   {
      $location    =   OrganizationLocation::destroy($id);
      return response()->json([
         'status'    =>  'success',
         'msg'       =>  "Location has Deleted",
         'location'  =>  $location
      ]);
   }
}
