<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GodownStock extends Model
{
    use HasFactory;

    protected $table = 'godowns_stocks';

    protected $fillable = [
        'godown_id',
        'company_id',
        'product_id',
        'stock',
    ];
}

