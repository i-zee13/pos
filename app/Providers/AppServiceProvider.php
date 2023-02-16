<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use romanzipp\Seo\Facades\Seo;
use romanzipp\Seo\Services\SeoService;
use romanzipp\Seo\Structs\Title;
use Spatie\SchemaOrg\Schema;

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
        // $img = 'img.png';
        // $seo = app(SeoService::class);
        // // seo()->add(
        // //     Title::make()->body('My Title')
        // // );
        // seo()->addFromArray([

        //     // The following items share the same behavior as the equally named shorthand setters.
        
        //     // 'title' => 'Laravel',
        //     // 'description' => 'Laravel',
        //     'charset' => 'utf-8',
        //     'viewport' => 'width=device-width, initial-scale=1',
        
        //     // Twitter & Open Graph
        
        //     // 'twitter' => [
        //     //     // <meta name="twitter:card" content="summary" />
        //     //     // <meta name="twitter:creator" content="@romanzipp" />
        //     //     'card' => 'summary',
        //     //     'creator' => '@romanzipp',
        //     // ],
        
        //     'og' => [
        //         // <meta property="og:locale" content="de" />
        //         // <meta property="og:site_name" content="Laravel" />
        //         'title' => 'zeee',
        //         'image' => $img,
        //         'locale' => 'de',
        //         'site_name' => 'Laravel',
        //     ],

        
        //     // Custom meta & link structs. Each child array defines an attribute => value mapping.
        
        //     'meta' => [
        //         // <meta name="copyright" content="Roman Zipp" />
        //         // <meta name="theme-color" content="#f03a17" />
        //         [
        //             'name' => 'copyright',
        //             'content' => 'Roman Zipp',
        //         ],
        //          [
        //             'name' => 'title',
        //             'content' => 'zee',
        //         ],
        //         [
        //             'name' => 'description',
        //             'content' => 'description ZEEzee',
        //         ],
        //         [
        //             'name' => 'keywords',
        //             'content' => 'zee,khan, niazi',
        //         ],
        //     ],
        
        //     'link' => [
        //         // <link rel="icon" href="/favicon.ico" />
        //         // <link rel="preload" href="/fonts/IBMPlexSans.woff2" />
        //         [
        //             'rel' => 'icon',
        //             'href' => '/favicon.ico',
        //         ],
        //         [
        //             'rel' => 'canonical',
        //             'href' => 'https://www.khanllp.com',
        //         ],
        //     ],
        
        // ]);
       
    }
}
