<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $current_time = Carbon::now();
        $message = '';

        if ($current_time->hour < 12) {
            $message = 'Good Morning';
        } elseif ($current_time->hour >= 12 && $current_time->hour < 18) {
            $message = 'Good Afternoon';
        } else {
            $message = 'Good Evening';
        }
        return view('home', compact('message'));
    }
    public function deleteInvoice(Request $request)
    {
        dd($request->all());
    }
}
