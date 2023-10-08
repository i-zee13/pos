<?php

namespace App\Http\Controllers;

use App\Models\AdminSaleClose;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Auth;

class AdminSaleCloseController extends Controller
{
    public function saveAdminSaleCloseRecord(Request $request){
        // dd($request->all());
        if(!$request->closing_cash || $request->closing_cash > 0){
            $new_close                  =   new AdminSaleClose();
            $new_close->closing_date    =   $request->close_date;
            $new_close->cash_in_hand    =   $request->ttl_cash_in_hand;
            $new_close->closing_cash    =   $request->closing_cash;
            $new_close->comment         =   $request->closing_comment;
            $new_close->is_closed       =   1;
            $new_close->open_by         =   NULL;
            $new_close->created_by      =   Auth::user()->id;
            $new_close->created_at      =   Carbon::now();
            if($new_close->save()){
                return response()->JSON([
                    'status'            =>  'success',
                    'msg'               =>  'sale close successfully'
                ]);
            }else{
                return response()->JSON([
                    'status'            =>  'failed',
                    'msg'               =>  'sale close failed'
                ]);
            }
        }else{
            return response()->JSON([
                'status'                =>  'closing_cash_null_0',
                'msg'                   =>  'sale close failed'
            ]);
        }
    }
}
