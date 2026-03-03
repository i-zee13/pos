<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockTransfer extends Model
{
    use HasFactory;

    protected $fillable = [
        'from_godown_id',
        'to_godown_id',
        'transfer_date',
        'reference_no',
        'description',
        'created_by',
    ];

    public function items()
    {
        return $this->hasMany(StockTransferItem::class);
    }
}

