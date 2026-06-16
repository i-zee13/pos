<?php

namespace App\Providers;

use App\Models\Organization;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        //
    }

    public function boot()
    {
        View::share('developer', "Storeeo.App +92-333-6701313");

        View::composer('*', function ($view) {
            static $organization = null;
            static $loaded = false;

            if (!$loaded) {
                $organization = Organization::first();
                if (!$organization) {
                    $organization = Organization::withoutGlobalScope('tenant')->first();
                }
                $loaded = true;
            }

            $view->with('organization', $organization);
        });
    }
}
