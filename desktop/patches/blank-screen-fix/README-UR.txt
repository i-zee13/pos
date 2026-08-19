Storeeo POS — blank screen PATCH v2 (kai files)

Pehle sirf AppServiceProvider kaafi NAHI — yeh 4 files copy karo.

A) App BAND karo (Task Manager → Storeeo POS / php.exe End task)

B) Files copy (overwrite):

1) AppServiceProvider.php
   → ...\Storeeo POS\resources\app-local\app\Providers\AppServiceProvider.php

2) SqliteMysqlPolyfills.php
   → ...\Storeeo POS\resources\app-local\app\Support\SqliteMysqlPolyfills.php
   (Support folder na ho to banao)

3) ForceLocalPasswordChange.php
   → ...\Storeeo POS\resources\app-local\app\Http\Middleware\ForceLocalPasswordChange.php

4) desktop-health.php
   → ...\Storeeo POS\resources\app-local\public\desktop-health.php

C) Cache clear (important):
   Folder delete/empty karo (files):
   ...\Storeeo POS\resources\app-local\bootstrap\cache\
   Sirf YE RAKHO agar hon: packages.php , services.php
   Baaki *.php DELETE (config.php, etc.)

D) App open karo, phir Chrome mein yeh URL kholo:
   http://127.0.0.1:8787/desktop-health.php

   - Agar "OK desktop-health" dikhe → PHP chal raha hai
   - Phir kholo: http://127.0.0.1:8787/login
   - Agar Chrome mein login dikhe lekin Electron white ho → Electron shell purani hai;
     tab StoreeoPOS-Setup-0.3.2.exe full install chahiye (ek dafa)

E) Login: admin / admin123

Install path tip:
  Desktop shortcut → Right click → Open file location
  → resources\app-local\...
