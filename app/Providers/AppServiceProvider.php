<?php

namespace App\Providers;

use App\Models\Organization;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\URL;


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
        $organization   =   Organization::first();

        View::share([
            'organization'              =>  $organization,
            'developer'                 =>  "Storeeo.App +92-333-6701313",
        ]);

        // Set the default tenant for URL generation
        // URL::defaults(['tenant' => request()->route('tenant')]);
    }
}
