<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $designation    =   DB::table('designations')->where('id',Auth::user()->designation)->first();
        $reporting_to   =   User::where('reporting_to',Auth::user()->reporting_to)->first();
        return view('profile.index',compact(['designation','reporting_to']));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }
    // Update Profile Picture
    public function update_user_profile_pic(Request $request){
        $employee               =   User::find($request->user_id);
        if($request->hasFile('employeePicture')){
            $completeFileName   =   $request->file('employeePicture')->getClientOriginalName();
            $fileNameOnly       =   pathinfo($completeFileName, PATHINFO_FILENAME);
            $extension          =   $request->file('employeePicture')->getClientOriginalExtension();
            $empPicture         =   str_replace(' ', '_', $fileNameOnly).'_'.time().'.'.$extension;
            $path               =   $request->file('employeePicture')->storeAs('public/employees', $empPicture);
            if(Storage::exists('public/employees/'.str_replace('./storage/employees/', '', $employee->picture))){
                Storage::delete('public/employees/'.str_replace('./storage/employees/', '', $employee->picture));
            }
            $employee->picture  =   './storage/employees/'.$empPicture;
            if($employee->save()){
                return response()->JSON([
                    'status'    =>  'success',
                    'msg'       =>  'profile_image_update',
                ]);
            }else{
                return response()->JSON([
                    'status'    =>  'failed',
                    'msg'       =>  'erro_profile_image_update',
                ]);
            }
        }else{
            return response()->JSON([
                'status'        =>  'empty',
                'msg'           =>  'image_required',
            ]);
        }
    }
    // Update User Password
    public function update_user_password(Request $request){
        $employee                   =   User::find($request->user_id);
        $hashedPassword             =   $employee->password;

        if($request->current_password){
            if (Hash::check($request->current_password, $hashedPassword)) {
                $employee->password =   bcrypt($request->confirm_password);
                if($employee->save()){
                    return response()->JSON([
                        'status'    =>  'success',
                        'msg'       =>  'password_change',
                    ]);
                }else{
                    return response()->JSON([
                        'status'    =>  'failed',
                        'msg'       =>  'error_password_change',
                    ]);
                }
            }else{
                return response()->JSON([
                    'status'        =>  'not_match',
                    'msg'           =>  'password_not_match',
                ]);
            }
        }
        else {
            return response()->JSON([
                'status'            =>  'empty',
                'msg'               =>  'all_fields_required',
            ]);
        }
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
