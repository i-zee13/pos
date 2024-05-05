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
        $organization   =   Organization::first();

        View::share([
            'organization'              =>  $organization,
            'developer'                 =>  "Zeeshan Hamza +92-333-6701313",
        ]);
    }
}
