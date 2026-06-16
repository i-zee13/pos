<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BatchStockMgt extends Model
{
    use \App\Models\Concerns\BelongsToTenant;
    use HasFactory;
    protected $table    =   'stock_batches_items';
    protected $guarded  =    [];
}
