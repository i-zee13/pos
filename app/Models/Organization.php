<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use \App\Models\Concerns\BelongsToTenant;
    use HasFactory;
        
    protected $guarded = [];
    protected $table = "organization";

    protected $casts = [
        'purchi_use_dynamic' => 'boolean',
        'purchi_config' => 'array',
    ];
}
