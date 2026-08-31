@echo off
setlocal
REM Storeeo POS — clear invoices/ledgers, keep products/companies/customers
REM 1) Close Storeeo POS first
REM 2) Put reset-invoices-keep-masters-sqlite.sql on Desktop
REM 3) Double-click this .bat OR run from CMD

set "PHP=C:\Users\ZEEHAN COMPUTERS\AppData\Local\Programs\Storeeo POS\resources\php\php.exe"
set "DB=%APPDATA%\StoreeoPOS\database\pos-local.sqlite"
set "SQL=%USERPROFILE%\Desktop\reset-invoices-keep-masters-sqlite.sql"

echo.
echo PHP: %PHP%
echo DB : %DB%
echo SQL: %SQL%
echo.

if not exist "%PHP%" (
  echo ERROR: php.exe not found
  pause
  exit /b 1
)
if not exist "%DB%" (
  echo ERROR: database not found at DB path above
  echo Open File Explorer and check:
  echo   %%APPDATA%%\StoreeoPOS\database\
  pause
  exit /b 1
)
if not exist "%SQL%" (
  echo ERROR: SQL file missing on Desktop
  echo Copy reset-invoices-keep-masters-sqlite.sql to Desktop
  pause
  exit /b 1
)

echo Making backup...
copy /Y "%DB%" "%APPDATA%\StoreeoPOS\database\pos-local-BACKUP-before-reset.sqlite"
if errorlevel 1 (
  echo ERROR: backup failed
  pause
  exit /b 1
)

echo Running reset...
"%PHP%" -r "$db=getenv('APPDATA').'\\StoreeoPOS\\database\\pos-local.sqlite'; $sqlFile=getenv('USERPROFILE').'\\Desktop\\reset-invoices-keep-masters-sqlite.sql'; $sql=file_get_contents($sqlFile); if($sql===false){fwrite(STDERR,\"cannot read SQL\n\"); exit(1);} $pdo=new PDO('sqlite:'.$db); $pdo->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION); $buf=''; foreach(preg_split(\"/\r\n|\n|\r/\",$sql) as $line){ $t=ltrim($line); if($t===''||str_starts_with($t,'--')) continue; $buf.=$line.\"\n\"; if(!str_ends_with(rtrim($line),';')) continue; $stmt=trim($buf); $buf=''; if($stmt==='') continue; try { $pdo->exec($stmt); } catch (Throwable $e) { $m=strtolower($e->getMessage()); if(str_contains($m,'no such table')||str_contains($m,'no such column')) continue; fwrite(STDERR,$e->getMessage().\"\n\"); exit(2);} } echo \"OK reset done\n\";"

if errorlevel 1 (
  echo ERROR: reset failed
  pause
  exit /b 1
)

echo.
echo Done. Open Storeeo POS again.
pause
