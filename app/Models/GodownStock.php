<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GodownStock extends Model
{
    use \App\Models\Concerns\BelongsToTenant;
    use HasFactory;

    protected $table = 'godowns_stocks';

    protected $fillable = [
        'godown_id',
        'company_id',
        'product_id',
        'stock',
    ];

    public function getStockAttribute($value)
    {
        return round_qty($value ?? 0);
    }

    public function setStockAttribute($value): void
    {
        $this->attributes['stock'] = round_qty($value ?? 0);
    }
}

