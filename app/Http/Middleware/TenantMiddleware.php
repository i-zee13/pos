<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class TenantMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Get tenant from route parameter
        $tenant = $request->route('tenant');
        
        // Set tenant as default parameter for URL generation
        if ($tenant) {
            URL::defaults(['tenant' => $tenant]);
        }

        return $next($request);
    }
} 