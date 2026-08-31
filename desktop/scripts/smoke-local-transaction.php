#!/usr/bin/env php
<?php
/** Smoke: Cash Received (customer ledger jama) on SQLite */
declare(strict_types=1);

$repo = dirname(__DIR__, 2);
require $repo . '/vendor/autoload.php';
$app = require $repo . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Http\Controllers\TransactionController;
use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

$tmpDir = sys_get_temp_dir() . '/storeeo-trx-' . getmypid();
@mkdir($tmpDir, 0777, true);
$dbPath = $tmpDir . '/pos-local.sqlite';
touch($dbPath);
config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => $dbPath]);
DB::purge('sqlite');
DB::reconnect('sqlite');
copy($repo . '/database/desktop_sqlite_bootstrap.php', $tmpDir . '/desktop_sqlite_bootstrap.php');
copy($repo . '/desktop/assets/sqlite-bootstrap.sql', $tmpDir . '/sqlite-bootstrap.sql');
passthru(PHP_BINARY . ' ' . escapeshellarg($tmpDir . '/desktop_sqlite_bootstrap.php') . ' ' . escapeshellarg($dbPath), $code);
if ($code !== 0) {
    exit(1);
}
DB::reconnect('sqlite');
$user = User::query()->orderBy('id')->first();
Auth::loginUsingId($user->id);

$customer = Customer::query()->where('customer_type', 2)->orderBy('id')->first();
if (!$customer) {
    fwrite(STDERR, "no customer\n");
    exit(1);
}
$customer->balance = 50;
$customer->save();

$req = Request::create('/transaction-store', 'POST', [
    'operation' => 'customer',
    'amount_to' => 1,
    'action' => 'add',
    'transaction_date' => date('Y-m-d'),
    'hidden_cust_id' => [$customer->id],
    'amount' => [10],
    'comment' => ['Khalil ne diye'],
]);
$req->setUserResolver(fn () => $user);

$response = app(TransactionController::class)->store($req);
$payload = $response->getData(true);
echo json_encode($payload) . "\n";
if (($payload['status'] ?? '') !== 'success') {
    fwrite(STDERR, "FAIL store\n");
    exit(2);
}

$count = CustomerLedger::where('customer_id', $customer->id)->where('trx_type', 3)->count();
$bal = (float) Customer::find($customer->id)->balance;
echo "ledger_rows=$count customer_balance=$bal\n";
if ($count < 1) {
    exit(3);
}
echo "OK cash received transaction saved\n";
exit(0);
