<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReportsController extends Controller
{
   public function vendorReport(){
     return view('reports.vendor');
   }
}
