<?php
/**
 * Drop into: resources/app-local/public/desktop-health.php
 * App open rakho, Chrome mein kholo: http://127.0.0.1:8787/desktop-health.php
 */
header('Content-Type: text/plain; charset=utf-8');
echo "OK desktop-health\n";
echo 'PHP=' . PHP_VERSION . "\n";
echo 'APPDATA=' . (getenv('APPDATA') ?: '(empty)') . "\n";
echo 'base=' . (isset($_SERVER['SCRIPT_FILENAME']) ? dirname(dirname($_SERVER['SCRIPT_FILENAME'])) : '?') . "\n";

$appData = getenv('APPDATA') ?: '';
$storage = $appData !== '' ? $appData . DIRECTORY_SEPARATOR . 'StoreeoPOS' . DIRECTORY_SEPARATOR . 'laravel-storage' : '';
if ($storage !== '') {
    $ok = @mkdir($storage . DIRECTORY_SEPARATOR . 'framework' . DIRECTORY_SEPARATOR . 'sessions', 0777, true);
    echo 'laravel-storage mkdir=' . ($ok || is_dir($storage) ? 'yes' : 'no') . "\n";    
    echo 'laravel-storage writable=' . (is_writable($storage) ? 'yes' : 'no') . "\n";
}
echo "If you see this text, PHP server is alive.\n";
