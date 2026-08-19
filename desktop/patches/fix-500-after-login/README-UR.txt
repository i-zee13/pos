Login ke baad 500 fix — naya installer NAHI.

App BAND karo, phir overwrite:

1) ProfileController.php
   → ...\resources\app-local\app\Http\Controllers\ProfileController.php

2) ForceLocalPasswordChange.php
   → ...\resources\app-local\app\Http\Middleware\ForceLocalPasswordChange.php

3) SqliteMysqlPolyfills.php  (agar pehle nahi copy ki)
   → ...\resources\app-local\app\Support\SqliteMysqlPolyfills.php

Optional (error dikhane ke liye):
   .env mein:  APP_DEBUG=true
   (baad mein false kar dena)

App open → login admin/admin123 → /home chalna chahiye.
