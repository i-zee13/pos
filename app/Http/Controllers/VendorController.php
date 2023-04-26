<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Auth;

class VendorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        dd(34);
        return view('customer.index');
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

    public function store(Request $request)
    {
        // dd($request->all());
        if (Customer::where('customer_name', $request->customer_name)->first()) {
            return response()->json([
                'msg' => 'duplicate',
                'status' => 'duplicate',
            ]);
        } else {
            Customer::create([
                'customer_name' => $request->customer_name,
                'customer_type' => $request->customer_type,
                'created_by' => Auth::user()->id,
            ]);
            return response()->json([
                'msg' => 'Added',
                'status' => 'success',
            ]);
        }
    }
    public function show($id)
    {
        $customer = Customer::where('id', $id)->first();
        return response()->json([
            'msg' => 'Fetched',
            'status' => 'success',
            'customer' => $customer,
        ]);
    }
    public function update(Request $request, $id)
    {
        $query = Customer::where('customer_name', $request->customer_name)
            ->where('id', '!=', $id)->first();
        if ($query) {
            return response()->json([
                'msg' => 'duplicate',
                'status' => 'duplicate',
            ]);
        } else {
            Customer::where('id', $id)->update([
                'customer_name' => $request->customer_name,
                'customer_type' => $request->customer_type,
                'created_by'    => Auth::user()->id,
            ]);
            return response()->json([
                'msg' => 'Added',
                'status' => 'success',
            ]);
        }
    }
    public function destroy($id)
    {
        if (Customer::where('id', $id)->delete()) {
            return response()->json([
                'msg' => 'Deleted',
                'status' => 'success'
            ]);
        }
        return response()->json([
            'msg' => 'failed',
            'status' => 'failed'
        ]);
    }
    public function getCustomers()
    {
        $customers = Customer::all();
        return response()->json([
            'msg' => 'Customer Fetched',
            'status' => 'success',
            'customers' => $customers
        ]);
    }
}