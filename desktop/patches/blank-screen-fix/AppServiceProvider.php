<?php

namespace App\Providers;

use App\Models\Organization;
use App\Support\SqliteMysqlPolyfills;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        // Electron desktop: Program Files is often read-only.
        // Prefer process env (getenv), not env() — config:cache makes env() null.
        $desktopStorage = getenv('DESKTOP_STORAGE_PATH') ?: '';
        if ($desktopStorage === '' && PHP_OS_FAMILY === 'Windows') {
            $appData = getenv('APPDATA') ?: '';
            $base = str_replace('\\', '/', (string) base_path());
            $packaged = str_contains($base, '/resources/app-local')
                || str_contains($base, '/Resources/app-local')
                || str_contains($base, '/app-local');
            $defaultSessions = base_path('storage/framework/sessions');
            $notWritable = !is_dir($defaultSessions) || !is_writable($defaultSessions);
            if ($appData !== '' && ($packaged || $notWritable)) {
                $desktopStorage = rtrim($appData, '\\/').DIRECTORY_SEPARATOR.'StoreeoPOS'.DIRECTORY_SEPARATOR.'laravel-storage';
            }
        }

        if (is_string($desktopStorage) && $desktopStorage !== '') {
            foreach ([
                '',
                'app',
                'app/public',
                'app/public/images',
                'framework',
                'framework/cache',
                'framework/cache/data',
                'framework/sessions',
                'framework/views',
                'logs',
            ] as $dir) {
                $path = $desktopStorage.($dir !== '' ? DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $dir) : '');
                if (! is_dir($path)) {
                    @mkdir($path, 0777, true);
                }
            }
            $this->app->useStoragePath($desktopStorage);
        }
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        View::share('developer', "Storeeo.App +92-333-6701313");

        // Offline desktop SQLite: MySQL helpers used in raw SQL (DATE_FORMAT, …)
        if (class_exists(SqliteMysqlPolyfills::class)) {
            SqliteMysqlPolyfills::register();
        }

        // Resolve organization lazily (per-request) so the tenant scope can use
        // the logged-in user's tenant_id, which is not available yet at boot time.
        View::composer('*', function ($view) {
            static $organization = null;
            static $loaded = false;

            if (!$loaded) {
                try {
                    $organization = Organization::first();

                    // Agar tenant scope ne row filter kar di (e.g. organization ka
                    // tenant_id abhi backfill nahi hua, ya user ke tenant_id se match
                    // nahi karta) to unscoped fallback le lein taake views na toote.
                    if (!$organization) {
                        $organization = Organization::withoutGlobalScope('tenant')->first();
                    }
                } catch (\Throwable $e) {
                    $organization = null;
                }

                $loaded = true;
            }

            $view->with('organization', $organization);
        });
    }
}
