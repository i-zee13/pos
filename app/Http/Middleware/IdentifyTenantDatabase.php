<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

/**
 * When TENANCY_MODE=database, switch the default mysql connection to the
 * database mapped for the request host (1 code, many DBs).
 */
class IdentifyTenantDatabase
{
    public function handle(Request $request, Closure $next)
    {
        if (config('tenants.mode') !== 'database') {
            return $next($request);
        }

        $host = strtolower($request->getHost());
        // www.app.x.com → app.x.com (map entries without www)
        if (str_starts_with($host, 'www.')) {
            $host = substr($host, 4);
        }

        $domains = config('tenants.domains', []);
        $tenant = $domains[$host] ?? null;

        if ($tenant === null) {
            if (config('tenants.fallback_to_env', true)) {
                return $next($request);
            }

            abort(404, 'Unknown tenant host: '.$host);
        }

        $database = $tenant['database'] ?? null;
        if (!$database) {
            abort(500, 'Tenant map missing database for host: '.$host);
        }

        $connection = config('database.default', 'mysql');

        Config::set("database.connections.{$connection}.database", $database);

        if (!empty($tenant['host'])) {
            Config::set("database.connections.{$connection}.host", $tenant['host']);
        }
        if (!empty($tenant['username'])) {
            Config::set("database.connections.{$connection}.username", $tenant['username']);
        }
        if (array_key_exists('password', $tenant)) {
            Config::set("database.connections.{$connection}.password", $tenant['password']);
        }

        DB::purge($connection);
        DB::reconnect($connection);

        // Optional: expose for views / debugging
        $request->attributes->set('tenant_database', $database);
        $request->attributes->set('tenant_host', $host);

        return $next($request);
    }
}
