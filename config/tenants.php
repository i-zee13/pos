<?php

/*
|--------------------------------------------------------------------------
| Domain → DB map (1 code, many databases)
|--------------------------------------------------------------------------
| Har subdomain ki apni DB + username/password yahan.
| .env sirf local/default DB + TENANCY_MODE ke liye — tenant DBs ke liye nahi.
|
| Naya shop: naya domain block add karo (database / host / username / password).
*/

return [

    // off | database
    'mode' => env('TENANCY_MODE', 'off'),

    // true = unknown host pe .env DB use; false = 404
    'fallback_to_env' => env('TENANCY_FALLBACK_ENV', true),

    'domains' => [

        // Latest code lives here (main)
        'app.storeeo.app' => [
            'database' => 'app_storeeo_app-353035312f2a',
            'host' => 'sdb-69.hosting.stackcp.net',
            'username' => 'app_storeeo_app',
            'password' => '353035312f2a',
        ],

        // Hammad Trad
        'ht.storeeo.app' => [
            'database' => 'storeeoa_hammad_trad',
            'host' => 'sdb-s.hosting.stackcp.net',
            'username' => 'storeeoa_hammad_trad',
            'password' => ';*brv)r^JWMz',
        ],

    ],

];
