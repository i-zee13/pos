<?php

namespace App\Http\Controllers;

use App\Jobs\RunDatabaseBackupJob;
use App\Models\BackupLog;
use App\Models\UserBackupMailSetting;
use App\Services\DatabaseBackupService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;

class DatabaseBackupController extends Controller
{
    public function index()
    {
        $logs = BackupLog::orderByDesc('id')->paginate(30);

        $databases = DatabaseBackupService::resolveDatabaseNamesFromConfig();

        $mailSetting = UserBackupMailSetting::where('user_id', Auth::id())->first();

        return view('backups.index', compact('logs', 'databases', 'mailSetting'));
    }

    public function storeMailSettings(Request $request)
    {
        $validated = $request->validate([
            'gmail' => 'required|email|max:255',
            'app_password' => 'nullable|string|min:8|max:256',
        ]);

        $setting = UserBackupMailSetting::firstOrNew(['user_id' => Auth::id()]);
        $setting->gmail = $validated['gmail'];

        if (! empty($validated['app_password'])) {
            $plain = preg_replace('/\s+/', '', $validated['app_password']);
            $setting->app_password_encrypted = Crypt::encryptString($plain);
        }

        $setting->save();

        return redirect()->route('backups.index')->with('success', 'Gmail settings saved. App password is stored encrypted on the server.');
    }

    public function store(Request $request)
    {
        $databases = DatabaseBackupService::resolveDatabaseNamesFromConfig();
        if (empty($databases)) {
            return redirect()->route('backups.index')->with('error', 'No databases configured. Set BACKUP_DATABASES or DB_DATABASE in .env.');
        }

        $log = BackupLog::create([
            'user_id' => Auth::id(),
            'databases' => $databases,
            'status' => 'pending',
            'triggered_by' => 'manual',
        ]);

        RunDatabaseBackupJob::dispatch($log->id);

        return redirect()->route('backups.index')->with('success', 'Backup queued. Wait a few seconds and refresh to see status. For async runs, keep `php artisan queue:work` running on the server.');
    }

    public function download(BackupLog $backup)
    {
        if (! $backup->isDownloadable()) {
            abort(404);
        }

        return Storage::disk('local')->download($backup->local_relative_path, $backup->zip_filename);
    }
}
