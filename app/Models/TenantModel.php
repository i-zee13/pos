<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TenantModel extends Model
{
    // Remove the hardcoded connection
    // The connection will be determined by the TenantServiceProvider
    // based on whether it's a tenant subdomain or main domain
} 