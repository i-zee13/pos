<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockManagment extends Model
{
    use HasFactory;
    protected $table    =   'vendor_stock_managment';
    protected $guarded  =    [];
}
