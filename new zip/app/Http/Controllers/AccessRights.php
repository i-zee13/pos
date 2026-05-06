<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\User as Emp;
use App\Http\Controllers\core\AccessRightsAuth;
use App\Models\AccessRights as AR;
use App\ControllersList as CL;
use App\Models\User;
use DB;
use Auth;
use Illuminate\Routing\Router;

class AccessRights extends AccessRightsAuth
{
    public $controllerName = "AccessRights";

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('access_rights.list', [ 'employees' => User::select('id', 'username')->whereRaw('super = 0')->get()]);
    }
    
    public function listAllRights()
    {
        echo json_encode(AR::selectRaw('(SELECT name from users where id = employee_id) as name, employee_id, count(*) as total_rights')->groupBy('employee_id')->get());
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

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        
        if(AR::where('employee_id', $request->employee_id)->first()){
            echo json_encode("exist");die;
        }
        $data = array();
        foreach ($request->rights as $right) {
            $data[] = array('employee_id' => $request->employee_id, 'controller_right' => $right);
        }

        AR::insert($data);
        echo json_encode('success');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($employee_id)
    {
        echo json_encode(AR::where('employee_id', $employee_id)->get());
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        
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
        if(AR::where('employee_id', $id)->delete()){
            $data = array();
            foreach ($request->rights as $right) {
                $data[] = array('employee_id' => $id, 'controller_right' => $right);
            }
            AR::insert($data);
            echo json_encode('success');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($employeeId)
    {
        
    }

    public function revokeAccRight($employeeId){
        
        AR::where('employee_id', $employeeId)->delete();
        echo json_encode('success');
    }
}
