<?php

use App\Models\City;
use App\Models\Country;
use App\Models\PostalCode;
use App\Models\PurchaseInvoice;
use App\Models\State;
use App\Models\Sale as SaleInvoice; 
use App\Models\Student; 
use Firebase\JWT\JWT; 
use Stevebauman\Location\Facades\Location;

if(!function_exists('isStudentActive'))
{
        function isStudentActive($email) : bool
    {
        $doctor = Student::whereEmail($email)->IsActive()->exists();

        if($doctor)
        {
            return true;
        }
        return false;
    }
}
if(!function_exists('timeZoneList'))
{
    function timeZoneList()
    {
        $zones_array = array();
        $timestamp = time();
        $dummy_datetime_object = new DateTime();
        foreach(timezone_identifiers_list() as $key => $zone) {
            date_default_timezone_set($zone);
            $zones_array[$key]['zone'] = $zone;
            $zones_array[$key]['diff_from_GMT'] = 'UTC/GMT ' . date('P', $timestamp);
            $tz = new DateTimeZone($zone);
            $zones_array[$key]['offset'] = $tz->getOffset($dummy_datetime_object);
        }
        return $zones_array;
    }
}
if(!function_exists('GetCurrentLocation'))
{
    function GetCurrentLocation()
    {
        $ip =   isset($_SERVER["REMOTE_ADDR"]) && $_SERVER["REMOTE_ADDR"] != '127.0.0.1' ? $_SERVER["REMOTE_ADDR"] : '103.255.4.42';
        return Location::get($ip);
    }
}
if(!function_exists('GetCountryIdByName'))
{
    function GetCountryIdByName($country_name)
    {
        $country_id =   '';
        try {
            if($country_name != ''){
                $countries  =   Country::whereRaw("lower(name) = lower('{$country_name}')")->first();
                if ($countries) {
                    $country_id                     =    $countries->id;
                }
            }
        }catch (Exception $exception){
            //
        }
        return $country_id;
    }
}
if(!function_exists('GetStateIdByName'))
{
    function GetStateIdByName($state_name)
    {
        $state_id   =   '';
        try {
            if($state_name != ''){
                $states =   State::whereRaw("lower(name) = lower('{$state_name}')")->first();
                if ($states) {
                    $state_id   =    $states->id;
                }
            }
        }catch (Exception $exception){
            //
        }
        return $state_id;
    }
}
if(!function_exists('GetCityIdByName'))
{
    function GetCityIdByName($city_name)
    {
        $city_id   =   '';
        try {
            if($city_name != ''){
                $cities =   City::whereRaw("lower(name) = lower('{$city_name}')")->first();
                if ($cities) {
                    $city_id    =    $cities->id;
                }
            }
        }catch (Exception $exception){
            //
        }
        return $city_id;
    }
}
if(!function_exists('GetPostalCodeIdByName'))
{
    function GetPostalCodeIdByName($postal_code)
    {
        $postal_code_id   =   '';
        try {
            if($postal_code != ''){
                $postal_codes   =   PostalCode::whereRaw("lower(postal_code) = lower('{$postal_code}')")->first();
                if ($postal_codes) {
                    $postal_code_id =    $postal_codes->id;
                }
            }
        }catch (Exception $exception){
            //
        }
        return $postal_code_id;
    }
}

if(!function_exists('getZoomAccessToken'))
{
    function getZoomAccessToken()
    {
        $key = 'UYACpXEnBSrhiuKroMcBRuqkkiwTviHNovOf';
        $payload = array(
            "iss" => '2mO7bNcvRxyXMMWm01infA',
            'exp' => time() + 3600,
        );
        return JWT::encode($payload, $key);
    }
}

if(!function_exists('getInvoice'))
{
    function getInvoice()
{
    $today       = date('Y-m-d');  // Get today's date
    $year        = date('y');
    $invoice_no  = 1;
    $lastinvoice = SaleInvoice::latest()->first();
    
    if ($lastinvoice) {
        $lastinvoiceDate = $lastinvoice->created_at->format('Y-m-d');
        
        if ($lastinvoiceDate === $today) {
            // Invoice was created today, extract the invoice number
            $invoice_no = intval(explode('-', $lastinvoice->invoice_no)[0]);
        }
    }
    
    // Increment the invoice number and append the year
    $invoice_no = $invoice_no . '-' . $year;
    return $invoice_no;
}

}

if(!function_exists('getPurchaseInvoice'))
{
    function getPurchaseInvoice()
    {
        $year        = date('y');
        $invoice_no  = 1;
        $lastinvoice = PurchaseInvoice::latest()->value('id');
        if(isset($lastinvoice)){
            $invoice_no = ($lastinvoice+1).'-'.$year;
           return $invoice_no;
        }else{
            $invoice_no = $invoice_no.'-'.$year;
            return $invoice_no;

        }
    }
}

if(!function_exists('getInvoice'))
{
    function getSaleReturnNo()
    {
        $year        = date('y');
        $invoice_no  = 1;
        $lastinvoice = SaleInvoice::latest()->value('id');
        if(isset($lastinvoice)){
            $invoice_no = ($lastinvoice+1).'-'.$year;
           return $invoice_no;
        }else{
            $invoice_no = $invoice_no.'-'.$year;
            return $invoice_no;

        }
    }
}
