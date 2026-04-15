<?php

namespace App\Http\Controllers;

use App\Models\Godown;
use App\Models\Product;
use App\Models\StockTransfer;
use App\Models\StockTransferItem;
use App\Models\GodownStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StockTransferController extends Controller
{
    public function index()
    {
        if (request()->wantsJson()) {
            $transfers = StockTransfer::with('items')->orderBy('transfer_date', 'desc')->get();
            return response()->json(['transfers' => $transfers]);
        }

        return view('stock_transfers.index');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'from_godown_id' => 'required|different:to_godown_id|exists:godowns,id',
            'to_godown_id'   => 'required|exists:godowns,id',
            'transfer_date'  => 'required|date',
            'description'    => 'nullable|string',
            'items'          => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty'        => 'required|numeric|min:0.01',
        ]);

        $transfer = null;

        DB::transaction(function () use (&$transfer, $data) {
            $fromGodown = $data['from_godown_id'];
            $toGodown   = $data['to_godown_id'];
            // Identify shop godown for syncing products table stock_balance
            $shopGodownId = Godown::where('type', 'shop')->orderBy('id')->value('id');

            $transfer = StockTransfer::create([
                'from_godown_id' => $fromGodown,
                'to_godown_id'   => $toGodown,
                'transfer_date'  => $data['transfer_date'],
                'reference_no'   => request()->input('reference_no'),
                'description'    => $data['description'] ?? null,
                'created_by'     => Auth::id(),
            ]);

            foreach ($data['items'] as $item) {
                $product = Product::find($item['product_id']);
                $companyId = $product ? $product->company_id : null;

                // Check available stock in from_godown
                $current = \App\Models\GodownStock::where([
                    'godown_id'  => $fromGodown,
                    'company_id' => $companyId,
                    'product_id' => $item['product_id'],
                ])->lockForUpdate()->value('stock') ?? 0;

                if ($current < $item['qty']) {
                    abort(422, "Insufficient stock for product {$item['product_id']} in selected godown.");
                }

                // Decrease from_godown, increase to_godown
                // updateGodownStock will automatically sync products.stock_balance if godown is shop
                updateGodownStock($fromGodown, $companyId, $item['product_id'], $item['qty'], 2);
                updateGodownStock($toGodown, $companyId, $item['product_id'], $item['qty'], 1);

                StockTransferItem::create([
                    'stock_transfer_id' => $transfer->id,
                    'product_id'        => $item['product_id'],
                    'qty'               => $item['qty'],
                ]);
            }
        });

        return response()->json([
            'status' => 'success',
            'transfer_id' => $transfer->id,
        ]);
    }

    /**
     * Products available in a given godown (from godowns_stocks table only).
     */
    public function products($godownId)
    {
        $stocks = GodownStock::where('godown_id', $godownId)
            ->where('stock', '>', 0)
            ->join('products', 'products.id', '=', 'godowns_stocks.product_id')
            ->select(
                'products.id',
                'products.product_name',
                'products.sale_price',
                'products.new_purchase_price',
                'products.old_purchase_price',
                'products.barcode',
                'products.expiry_date',
                'godowns_stocks.stock'
            )
            ->orderBy('products.product_name')
            ->get();

        return response()->json(['products' => $stocks]);
    }
}

