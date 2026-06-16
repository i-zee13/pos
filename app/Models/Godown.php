<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Godown extends Model
{
    use \App\Models\Concerns\BelongsToTenant;
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'type',
        'is_active',
    ];
}

