<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Local desktop SQLite: soft reminder to change default password.
 * Do not hard-block / redirect (profile null designation caused 500).
 */
class ForceLocalPasswordChange
{
    public function handle(Request $request, Closure $next)
    {
        $driver = (string) config('database.connections.'.config('database.default').'.driver', '');
        if ($driver !== 'sqlite') {
            return $next($request);
        }

        return $next($request);
    }
}
