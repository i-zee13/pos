<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrganizationLocation extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = "organization_location";
}
