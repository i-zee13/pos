<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Product;
use Illuminate\Http\Request;
use Auth;

class ProductController extends Controller
{
    Public function index(){
        $companies = Company::all();
        return view('product.products',compact('companies'));
    }
    public function store(Request $request)
    {
        if(Product::where('company_id',$request->company_id)->where('product_name',$request->product_name)->where('id','!=',$request->hidden_product_id)->first()){
        return response()->json([
             'msg'    =>  'duplicate',
             'status' =>  'error',
        ]);
        }else{
            if($request->hasFile('product_icon')){
                $product_icon   =  $request->product_icon->store('categories', 'public');
             }else{
                $product_icon   =  '';
                 }
                 if($request->hidden_product_id > 0){
                    $product    =   Product::where('id',$request->hidden_product_id)->first();
                }else{
                   $product     =   new Product(); 
                }
                   $product->barcode            =  $request->barcode;
                   $product->product_name       =  $request->product_name;
                   $product->size               =  $request->size;
                   $product->old_purchase_price =  $request->purchase_price;
                   $product->sale_price         =  $request->sale_price;
                   $product->company_id         =  $request->company_id;
                   $product->product_icon       =  $product_icon;
                   $product->created_by         =  Auth::user()->id;
            if($product->save()){
                return response()->json([
                    'msg'   => 'Product Added',
                    'status'=>  'success',
                    ]);
            }else{
                return response()->json([
                    'msg'   => 'Product Not Added',
                    'status'=>  'failed',
                    ]);
            }
            
        }
    }
    public function getProducts()
    {
        $data =  Product::selectRaw('products.* , (SELECT company_name FROM companies WHERE id = products.company_id) as company_name')->get();
        return response()->json([
            'msg'       =>  'Products Fetched',
            'status'    =>  'success',
            'data'      =>   $data
        ]);
    }
    public function getSubCatToUpdate($id)
    {
        $query    =  Product::where('products.id', $id)
                        ->leftjoin('companies', 'companies.id','=','products.company_id')
                        ->selectRaw( 'products.* , (SELECT company_name FROM companies WHERE id = products.company_id) as company_name')
                        ->first();
                        return response()->json([
                            'msg'       =>  'Product Fetched for update',
                            'status'    =>  'success',
                            'product'   =>   $query
                        ]);
    }
    public function deleteProduct($id){
        if (Product::where('id', $id)->delete()) {
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
    
}
