<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Product;
use Illuminate\Http\Request;
use Auth;

class CompanyController extends Controller
{
    public function index()
    {
        return view('product.company');
    }
    public function store(Request $request)
    {
        if (Company::where('company_name', $request->hidden_company_name)->first()) {
            return response()->json([
                'msg' => 'duplicate',
                'status' => 'duplicate',
            ]);
        } else {
            if ($request->hasFile('company_icon')) {
                $company_icon = $request->company_icon->store('categories', 'public');
            } else {
                $company_icon = '';
            }
            Company::create([
                'company_name' => $request->hidden_company_name,
                'company_icon' => $company_icon,
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
        $company = company::where('id', $id)->first();
        return response()->json([
            'msg' => 'Fetched',
            'status' => 'success',
            'company' => $company,
        ]);
    }
    public function update(Request $request, $id)
    {
        $query = Company::where('company_name', $request->company_name)
            ->where('id', '!=', $id)->first();
        if ($query) {
            return response()->json([
                'msg' => 'duplicate',
                'status' => 'duplicate',
            ]);
        } else {
            $company_icon = '';
            if ($request->hasFile('company_icon')) {
                $company_icon = $request->company_icon->store('categories', 'public');
            } else {
                $company_icon = $request->hidden_company_icon;
            }

            Company::where('id', $id)->update([
                'company_name' => $request->company_name,
                'company_icon' => $company_icon,
            ]);

            return response()->json([
                'msg' => 'Added',
                'status' => 'success',
            ]);
        }
    }
    public function destroy($id)
    {
        if (Company::where('id', $id)->delete()) {
            Product::where('company_id', $id)->delete();
            return response()->json([
                'msg'    => 'Deleted',
                'status' => 'success'
            ]);
        }
        return response()->json([
            'msg' => 'failed',
            'status' => 'failed'
        ]);
    }
    public function getCompanies()
    {
        $companies = company::all();
        return response()->json([
            'msg'       => 'Companies Fetched',
            'status'    => 'success',
            'companies' => $companies
        ]);
    }
}