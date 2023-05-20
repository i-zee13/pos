<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Product;
use Illuminate\Http\Request;
use Auth;

class ProductController extends Controller
{
    public function index()
    {
        $companies       = Company::all();
        $products        = Product::all();
        $next_product_id = Product::count() + 1; 
        return view('product.products', compact('companies', 'next_product_id','products'));
    }
    public function store(Request $request)
    {
        // dd($request->all());
        $duplicateField = '';
        if (Product::where('company_id', $request->company_id)
            ->where('product_name', $request->hidden_product_name)
            ->where('id', '!=', $request->hidden_product_id)
            ->exists()
        ) {
            $duplicateField = 'Product Name with same  Company already Exist';
        } elseif (Product::where('barcode', $request->barcode)
            ->where('id', '!=', $request->hidden_product_id)
            ->exists()
        ) {
            $duplicateField = 'barcode already Exist';
        }
        if ($duplicateField != '') {
            return response()->json([
                'msg'    =>  'duplicate',
                'duplicate_msg' => $duplicateField ,
                'status' =>  'error',
            ]);
        } else {
            if ($request->hasFile('product_icon')) {
                $product_icon   =  $request->product_icon->store('categories', 'public');
            } else {
                $product_icon   =  '';
            }
            if ($request->hidden_product_id > 0) {
                $product    =   Product::where('id', $request->hidden_product_id)->first();
            } else {
                $product     =   new Product();
            }
            $product->barcode            =  $request->barcode;
            $product->product_name       =  $request->hidden_product_name;
            $product->size               =  $request->size;
            $product->old_purchase_price =  $request->purchase_price;
            $product->sale_price         =  $request->sale_price;
            $product->company_id         =  $request->company_id;
            $product->product_icon       =  $product_icon;
            $product->created_by         =  Auth::user()->id;
            if ($product->save()) {
                $next_product_id = $product->id + 1;
                return response()->json([
                    'msg'   => 'Product Added',
                    'status' =>  'success',
                    'next_product_id' => $next_product_id
                ]);
            } else {
                return response()->json([
                    'msg'   => 'Product Not Added',
                    'status' =>  'failed',
                ]);
            }
        }
    }
    public function getProducts()
    {
        $data =  Product::selectRaw('products.* , (SELECT company_name FROM companies WHERE id = products.company_id) as company_name')
                        ->orderBy('created_at', 'DESC')->get();
         
        $maxId = Product::withTrashed()->max('id'); 
        return response()->json([
            'msg'       =>  'Products Fetched',
            'status'    =>  'success',
            'data'      =>   $data,
            'barcode'   =>  $maxId + 1
        ]);
    }
    public function getSubCatToUpdate($id)
    {
        $query    =  Product::where('products.id', $id)
            ->leftjoin('companies', 'companies.id', '=', 'products.company_id')
            ->selectRaw('products.* , (SELECT company_name FROM companies WHERE id = products.company_id) as company_name')
            ->first();
        return response()->json([
            'msg'       =>  'Product Fetched for update',
            'status'    =>  'success',
            'product'   =>   $query
        ]);
    }
    public function deleteProduct(Request $request,$id)
    {   
        if ($request->status == 'delete' && Product::where('id', $id)->delete()) {
            return response()->json([
                'msg' => 'Product has Deleted Successfully',
                'status' => 'success'
            ]);
        }else if( Product::withTrashed()->find($id)->restore()){
            return response()->json([
                'msg' => 'Product has Restored Successfully',
                'status' => 'success'
            ]);
        }else{
            return response()->json([
            'msg' => 'failed',
            'status' => 'failed'
        ]);
        }
        
    }
}
