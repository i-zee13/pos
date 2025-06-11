<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class TenantServiceProvider extends ServiceProvider
{
    public function register()
    {
        //
    }

    public function boot()
    {
        $host = request()->getHost();
        $tenant = $this->getTenantFromHost($host);
        
        if ($tenant) {
            $this->configureTenant($tenant);
        } else {
            // If no tenant is detected, ensure the default connection is 'mysql'
            // and the 'tenant' connection uses its default from config/database.php (pointing to 'pos').
            Config::set('database.default', 'mysql');
        }
    }

    protected function getTenantFromHost($host)
    {
        // Determine if running on localhost or 127.0.0.1 (common for artisan serve)
        if (str_contains($host, 'localhost') || str_contains($host, '127.0.0.1')) {
            $pathSegment = request()->segment(1);
            // If the first path segment exists and is not our test route, use it as tenant
            if ($pathSegment && $pathSegment !== 'tenant-test') {
                return $pathSegment;
            }
            // If on localhost but no tenant path segment is found, it's the main app.
            return null;
        }
        
        // For actual subdomains in production (e.g., tenant1.yourdomain.com)
        $parts = explode('.', $host);
        // Check if it's a subdomain (e.g., tenant.domain.com, which has 3 or more parts)
        if (count($parts) > 2) {
            return $parts[0]; // Return the first part as the tenant name
        }
        
        // If not a subdomain and not explicitly a localhost tenant path, it's the main app.
        return null;
    }

    protected function configureTenant($tenant)
    {
        $host = request()->getHost();
        
        // Load tenant-specific .env file
        $envPath = base_path("tenants/{$tenant}/.env");
        if (file_exists($envPath)) {
            $this->loadTenantEnv($envPath);
        }

        // Set database name based on environment
        if (str_contains($host, 'localhost') || str_contains($host, '127.0.0.1')) {
            Config::set('database.connections.tenant.database', 'pos');
            Config::set('database.connections.tenant.username', env('DB_USERNAME', 'forge'));
            Config::set('database.connections.tenant.password', env('DB_PASSWORD', ''));
        } else {
            Config::set('database.connections.tenant.database', "pos_{$tenant}");
            Config::set('database.connections.tenant.username', $env['DB_USERNAME'] ?? env('DB_USERNAME'));
            Config::set('database.connections.tenant.password', $env['DB_PASSWORD'] ?? env('DB_PASSWORD'));
        }

        // Configure tenant-specific storage
        $this->configureTenantStorage($tenant);

        // Set the default database connection to tenant
        Config::set('database.default', 'tenant');
    }

    protected function loadTenantEnv($envPath)
    {
        $env = parse_ini_file($envPath);
        foreach ($env as $key => $value) {
            putenv("{$key}={$value}");
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
    }

    protected function configureTenantStorage($tenant)
    {
        Config::set('filesystems.disks.tenant', [
            'driver' => 'local',
            'root' => storage_path("tenants/{$tenant}"),
        ]);
    }
} 