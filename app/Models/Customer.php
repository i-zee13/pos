<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use \App\Models\Concerns\BelongsToTenant;
    use HasFactory;
    protected $table    =   'customers';
    protected $guarded  =    [];
}