<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorStock extends Model
{
    use HasFactory;
    protected $table    =   'vendor_stocks';
    protected $guarded  =    [];
}
