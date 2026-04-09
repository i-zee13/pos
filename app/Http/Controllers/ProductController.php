<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index()
    {
        $companies       = Company::all();
        $products        = Product::all();
        $next_product_id = Product::count() + 1;
        return view('product.products', compact('companies', 'next_product_id', 'products'));
    }
    public function store(Request $request)
    {
        $duplicateField = '';
        // $barcodeArray = explode(',', $request->barcode);


        if (Product::where('company_id', $request->company_id)
            ->where('product_name', $request->hidden_product_name)
            ->where('id', '!=', $request->hidden_product_id)
            ->exists()
        ) {
            $duplicateField = 'Product Name with same  Company already Exist';
        } elseif (Product::whereIn('barcode', $request->barcode)
            ->where('id', '!=', $request->hidden_product_id)
            ->exists()
        ) {
            $duplicateField = 'barcode already Exist';
        }
        if ($duplicateField != '') {
            return response()->json([
                'msg'    =>  'duplicate',
                'duplicate_msg' => $duplicateField,
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
            $product->barcode            =  isset($request->barcode) ? implode(',', $request->barcode) : $request->barcode_span;
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
            ->orderBy('created_at', 'ASC')->get();
        $maxId = Product::withTrashed()->max('id');
        return response()->json([
            'msg'       =>  'Products Fetched',
            'status'    =>  'success',
            'data'      =>   $data,
            'barcode'   =>  $maxId + 1
        ]);
    }
      public function getProductStock($id)
    {   
        // dd()
        $new_prod = Product::where('id',$id)->first();
            return response()->json([
                'new_prod'=> $new_prod
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
    public function deleteProduct(Request $request, $id)
    {
        $status = $request->input('status');

        // Soft delete (existing behavior)
        if ($status === 'delete' && Product::where('id', $id)->delete()) {
            return response()->json([
                'msg' => 'Product has Deleted Successfully',
                'status' => 'success'
            ]);
        }

        // Restore (existing behavior)
        if ($status === 'restore' && ($p = Product::withTrashed()->find($id)) && $p->restore()) {
            return response()->json([
                'msg' => 'Product has Restored Successfully',
                'status' => 'success'
            ]);
        }

        // Hard delete + purge all stock/transaction rows for this product
        if ($status === 'purge') {
            $product = Product::withTrashed()->find($id);
            if (!$product) {
                return response()->json([
                    'msg' => 'Product not found',
                    'status' => 'failed'
                ]);
            }

            DB::transaction(function () use ($id, $product) {
                // Stock tables
                DB::table('vendor_stocks')->where('product_id', $id)->delete();
                DB::table('vendor_stock_managment')->where('product_id', $id)->delete();
                DB::table('stock_batches_items')->where('product_id', $id)->delete();

                // Transaction line tables (invoice product rows)
                DB::table('products_purchases')->where('product_id', $id)->delete();
                DB::table('products_sales')->where('product_id', $id)->delete();
                DB::table('products_returns')->where('product_id', $id)->delete();
                DB::table('sale_return_products')->where('product_id', $id)->delete();
                DB::table('product_replacements')->where('product_id', $id)->delete();

                // Finally remove product itself (including soft-deleted row)
                $product->forceDelete();
            });

            return response()->json([
                'msg' => 'Product purged (deleted from stock + transactions).',
                'status' => 'success'
            ]);
        }

        return response()->json([
            'msg' => 'failed',
            'status' => 'failed'
        ]);
    }

    //Change price Controlls
    public function changePrice()
    {
        $companies = Company::get();
        return view('product.change-price', compact('companies'));
    }

    public function getCompanyProducts(Request $request)
    {
        $companyId = $request->input('company_id');
        $products = Product::where('company_id', $companyId)
            ->select('id', 'product_name', 'sale_price', 'new_purchase_price', 'old_purchase_price')
            ->get();
        return response()->json(['products' => $products]);
    }

    public function updateProduct(Request $request, $id)
    {
        $salePrice = $request->input('salePrice');

        $product = Product::find($id);
        if ($product) {
            $product->sale_price = $salePrice;
            $product->save();

            return response()->json(['products' => $product]);
        }

        return response()->json(['success' => false, 'message' => 'Product not found.']);
    }
}
