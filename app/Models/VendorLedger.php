<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorLedger extends Model
{
    use HasFactory;
    protected $table    =   'vendor_ledger';
    protected $guarded  =    [];
}
