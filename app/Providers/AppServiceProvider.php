<?php

namespace App\Providers;

use App\Models\Organization;
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
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        View::share('developer', "Storeeo.App +92-333-6701313");

        // Resolve organization lazily (per-request) so the tenant scope can use
        // the logged-in user's tenant_id, which is not available yet at boot time.
        View::composer('*', function ($view) {
            static $organization = null;
            static $loaded = false;

            if (!$loaded) {
                $organization = Organization::first();

                // Agar tenant scope ne row filter kar di (e.g. organization ka
                // tenant_id abhi backfill nahi hua, ya user ke tenant_id se match
                // nahi karta) to unscoped fallback le lein taake views na toote.
                if (!$organization) {
                    $organization = Organization::withoutGlobalScope('tenant')->first();
                }

                $loaded = true;
            }

            $view->with('organization', $organization);
        });
    }
}
