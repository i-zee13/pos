<?php

namespace App\Http\Controllers;

use App\Jobs\RunDatabaseBackupJob;
use App\Models\BackupLog;
use App\Models\UserBackupMailSetting;
use App\Services\DatabaseBackupService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class DatabaseBackupController extends Controller
{
    public function index()
    {
        $logs = BackupLog::orderByDesc('id')->limit(5)->get(); 

        $databases = DatabaseBackupService::resolveDatabaseNamesFromConfig();

        $mailSetting = UserBackupMailSetting::where('user_id', Auth::id())->first();

        return view('backups.index', compact('logs', 'databases', 'mailSetting'));
    }

    public function logs()
    {
        $logs = BackupLog::orderByDesc('id')->limit(15)->get();

        return view('backups.logs', compact('logs'));
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

    public function connectGoogleDrive()
    {
        $clientId = trim((string) config('backup.google_drive_api.client_id'));
        if ($clientId === '') {
            return redirect()->route('backups.index')->with('error', 'Google OAuth client ID is missing. Set GOOGLE_DRIVE_CLIENT_ID in .env.');
        }

        $state = Str::random(40);
        session(['google_drive_oauth_state' => $state]);

        $query = http_build_query([
            'client_id' => $clientId,
            'redirect_uri' => route('backups.google.callback'),
            'response_type' => 'code',
            'scope' => implode(' ', [
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/userinfo.email',
            ]),
            'access_type' => 'offline',
            'prompt' => 'consent',
            'include_granted_scopes' => 'true',
            'state' => $state,
        ]);

        return redirect()->away('https://accounts.google.com/o/oauth2/v2/auth?'.$query);
    }

    public function googleDriveCallback(Request $request)
    {
        if ($request->filled('error')) {
            return redirect()->route('backups.index')->with('error', 'Google Drive connection cancelled: '.$request->input('error'));
        }

        if (! hash_equals((string) session('google_drive_oauth_state'), (string) $request->input('state'))) {
            return redirect()->route('backups.index')->with('error', 'Google Drive connection failed because the OAuth state did not match.');
        }

        session()->forget('google_drive_oauth_state');

        $clientId = trim((string) config('backup.google_drive_api.client_id'));
        $clientSecret = trim((string) config('backup.google_drive_api.client_secret'));
        if ($clientId === '' || $clientSecret === '') {
            return redirect()->route('backups.index')->with('error', 'Google OAuth client credentials are missing in .env.');
        }

        $tokenResponse = Http::asForm()
            ->timeout(60)
            ->post('https://oauth2.googleapis.com/token', [
                'client_id' => $clientId,
                'client_secret' => $clientSecret,
                'code' => $request->input('code'),
                'grant_type' => 'authorization_code',
                'redirect_uri' => route('backups.google.callback'),
            ]);

        if ($tokenResponse->failed()) {
            Log::warning('backup.google_drive_oauth_exchange_failed', ['body' => $tokenResponse->body()]);

            return redirect()->route('backups.index')->with('error', 'Google Drive connection failed while exchanging the OAuth code.');
        }

        $refreshToken = $tokenResponse->json('refresh_token');
        $accessToken = $tokenResponse->json('access_token');
        if (! is_string($refreshToken) || $refreshToken === '') {
            return redirect()->route('backups.index')->with('error', 'Google did not return a refresh token. Reconnect and approve offline access when prompted.');
        }

        $email = null;
        if (is_string($accessToken) && $accessToken !== '') {
            $profile = Http::withToken($accessToken)
                ->timeout(30)
                ->get('https://www.googleapis.com/oauth2/v3/userinfo');
            $profileEmail = $profile->json('email');
            $email = is_string($profileEmail) ? $profileEmail : null;
        }

        $setting = UserBackupMailSetting::firstOrNew(['user_id' => Auth::id()]);
        $setting->gmail = $email ?: ($setting->gmail ?: Auth::user()->email);
        $setting->google_drive_refresh_token_encrypted = Crypt::encryptString($refreshToken);
        $setting->google_drive_connected_at = now();
        if (! $setting->google_drive_folder_name) {
            $setting->google_drive_folder_name = (string) config('backup.google_drive_api.folder_name', 'POS DBs Backups');
        }
        $setting->save();

        return redirect()->route('backups.index')->with('success', 'Google Drive connected. Manual backups from your login will upload to this Drive account.');
    }

    public function disconnectGoogleDrive()
    {
        $setting = UserBackupMailSetting::where('user_id', Auth::id())->first();
        if ($setting) {
            $setting->google_drive_refresh_token_encrypted = null;
            $setting->google_drive_folder_id = null;
            $setting->google_drive_connected_at = null;
            $setting->save();
        }

        return redirect()->route('backups.index')->with('success', 'Google Drive disconnected for your user.');
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

        return response()->download(storage_path('app/'.$backup->local_relative_path), $backup->zip_filename);
    }
}
