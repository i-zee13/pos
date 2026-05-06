<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostalCode extends Model
{

    protected $fillable =
    [
        'country_id',
        'state_id',
        'city_id',
        'postal_code',
        'created_by',
        'updated_by'
    ];
    protected $table = 'postal_codes';
}
