<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SaleReturn extends Model
{
    use \App\Models\Concerns\BelongsToTenant;
    use HasFactory;
    use SoftDeletes;
    protected $table = 'sale_return_invoices';
}
