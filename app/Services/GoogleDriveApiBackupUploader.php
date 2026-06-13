<?php

namespace App\Services;

use App\Models\UserBackupMailSetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Uploads a zip to Google Drive using a one-time OAuth refresh token + OAuth client
 * credentials from .env (no UI, no per-user Google flow).
 */
class GoogleDriveApiBackupUploader
{
    /** @var array<string,mixed>|null */
    protected $integrationSettings = null;
    /** @var object|null */
    protected $integrationRow = null;
    /** @var array<int,UserBackupMailSetting|null> */
    protected $userDriveSettings = [];

    public function isConfigured(?int $userId = null): bool
    {
        if ($this->userDriveRefreshToken($userId) !== null) {
            return $this->nonEmpty($this->credential('client_id', (string) config('backup.google_drive_api.client_id')))
                && $this->nonEmpty($this->credential('client_secret', (string) config('backup.google_drive_api.client_secret')));
        }

        $settings = $this->getIntegrationSettings();
        $enabled = (bool) config('backup.google_drive_api.enabled') || !empty($settings);

        return $enabled
            && $this->nonEmpty($this->credential('client_id', (string) config('backup.google_drive_api.client_id')))
            && $this->nonEmpty($this->credential('client_secret', (string) config('backup.google_drive_api.client_secret')))
            && $this->nonEmpty($this->credential('refresh_token', (string) config('backup.google_drive_api.refresh_token')));
    }

    /**
     * @return string Human-readable reference (file id + optional link)
     *
     * @throws \RuntimeException
     */
    public function uploadZip(string $absoluteZipPath, string $zipFilename, ?int $userId = null): string
    {
        if (! is_readable($absoluteZipPath)) {
            throw new \RuntimeException('Zip file is not readable: '.$absoluteZipPath);
        }

        $accessToken = $this->getValidAccessToken($userId);

        $metadata = ['name' => $zipFilename];
        $folderId = $this->folderId($userId);
        if ($folderId === '') {
            $folderId = $this->resolveOrCreateFolderId($accessToken, $userId);
        }
        if ($folderId !== '') {
            $metadata['parents'] = [$folderId];
        }

        $boundary = 'DriveBoundary'.bin2hex(random_bytes(8));
        $eol = "\r\n";
        $metaJson = json_encode($metadata, JSON_UNESCAPED_SLASHES);
        if ($metaJson === false) {
            throw new \RuntimeException('Failed to encode Drive metadata JSON.');
        }

        $zipBinary = file_get_contents($absoluteZipPath);
        if ($zipBinary === false) {
            throw new \RuntimeException('Failed to read zip for upload.');
        }

        $body = '--'.$boundary.$eol
            .'Content-Type: application/json; charset=UTF-8'.$eol.$eol
            .$metaJson.$eol
            .'--'.$boundary.$eol
            .'Content-Type: application/zip'.$eol.$eol
            .$zipBinary.$eol
            .'--'.$boundary.'--';

        $url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink';

        $response = Http::withToken($accessToken)
            ->withBody($body, 'multipart/related; boundary='.$boundary)
            ->timeout(600)
            ->post($url);

        if ($response->failed()) {
            Log::warning('backup.google_drive_api_http', ['body' => $response->body(), 'status' => $response->status()]);

            throw new \RuntimeException('Drive API upload failed (HTTP '.$response->status().').');
        }

        $id = $response->json('id');
        $link = $response->json('webViewLink');
        if ($id) {
            return $link ? ($id.' | '.$link) : (string) $id;
        }

        throw new \RuntimeException('Drive API returned no file id.');
    }

    /**
     * Returns a valid access token, reusing a cached one until it is close to
     * expiry. Only refreshes against Google when needed, so a single warm token
     * keeps working and the connection auto-renews silently.
     */
    public function getValidAccessToken(?int $userId = null): string
    {
        $cached = $this->cachedAccessToken($userId);
        if ($cached !== null) {
            return $cached;
        }

        return $this->fetchAccessToken($userId);
    }

    /**
     * Force a token refresh against Google (ignoring cache). Used by the
     * scheduled keep-alive command so refresh tokens are exercised/rotated
     * regularly and never silently expire.
     */
    public function keepAlive(?int $userId = null): bool
    {
        $this->fetchAccessToken($userId);

        return true;
    }

    protected function fetchAccessToken(?int $userId = null): string
    {
        $userRefreshToken = $this->userDriveRefreshToken($userId);
        $tokenPayload = [
            'client_id' => $this->credential('client_id', (string) config('backup.google_drive_api.client_id')),
            'client_secret' => $this->credential('client_secret', (string) config('backup.google_drive_api.client_secret')),
            'refresh_token' => $userRefreshToken ?: $this->credential('refresh_token', (string) config('backup.google_drive_api.refresh_token')),
            'grant_type' => 'refresh_token',
        ];

        $response = Http::asForm()
            ->timeout(60)
            ->post('https://oauth2.googleapis.com/token', $tokenPayload);

        if ($response->failed()) {
            $body = $response->json();
            Log::warning('backup.google_drive_token', ['body' => $response->body()]);

            $error = is_array($body) ? (string) ($body['error'] ?? '') : '';

            if ($userRefreshToken !== null) {
                // Try external rotation endpoint first so an expired/rotated token
                // can be replaced automatically instead of forcing a manual reconnect.
                if (in_array($error, ['invalid_grant', 'deleted_client'], true)) {
                    $rotated = $this->rotateRefreshTokenFromEndpoint();
                    if ($rotated) {
                        $token = $this->retryWithRefreshToken($tokenPayload, $rotated, $userId);
                        if ($token !== null) {
                            $this->saveUserRefreshToken($userId, $rotated);

                            return $token;
                        }
                    }
                    $this->clearUserDriveToken($userId);
                }

                throw new \RuntimeException('Connected Google Drive token expired or was revoked. Reconnect Google Drive from DB Backups.');
            }

            // .env / integration based admin token: try external rotation endpoint once.
            if (in_array($error, ['invalid_grant', 'deleted_client'], true)) {
                $rotated = $this->rotateRefreshTokenFromEndpoint();
                if ($rotated) {
                    $token = $this->retryWithRefreshToken($tokenPayload, $rotated, $userId);
                    if ($token !== null) {
                        return $token;
                    }
                    Log::warning('backup.google_drive_token_retry_failed', ['refresh' => 'rotated']);
                }
            }

            throw new \RuntimeException('Google OAuth token refresh failed.');
        }

        $token = $response->json('access_token');
        if (! is_string($token) || $token === '') {
            throw new \RuntimeException('Google OAuth response missing access_token.');
        }

        $this->persistTokenResponse($response->json(), $userId);

        return $token;
    }

    /**
     * Retries the token request with a freshly rotated refresh token and persists
     * the resulting access token on success.
     *
     * @param  array<string,mixed>  $tokenPayload
     */
    protected function retryWithRefreshToken(array $tokenPayload, string $refreshToken, ?int $userId): ?string
    {
        $tokenPayload['refresh_token'] = $refreshToken;
        $retry = Http::asForm()
            ->timeout(60)
            ->post('https://oauth2.googleapis.com/token', $tokenPayload);

        if ($retry->ok() && is_string($retry->json('access_token')) && $retry->json('access_token') !== '') {
            $this->persistTokenResponse($retry->json(), $userId);

            return (string) $retry->json('access_token');
        }

        Log::warning('backup.google_drive_token_retry_failed', ['body' => $retry->body()]);

        return null;
    }

    /**
     * Persists access token (with expiry) and a rotated refresh token if Google
     * returned one. This keeps the connection alive without manual reconnects.
     *
     * @param  array<string,mixed>|null  $json
     */
    protected function persistTokenResponse(?array $json, ?int $userId): void
    {
        if (! is_array($json)) {
            return;
        }

        $accessToken = isset($json['access_token']) ? (string) $json['access_token'] : '';
        $expiresIn = isset($json['expires_in']) ? (int) $json['expires_in'] : 3500;
        // Refresh a bit early to avoid using a token that expires mid-upload.
        $expiresAt = now()->addSeconds(max(60, $expiresIn - 120));

        if ($accessToken !== '') {
            $this->storeAccessToken($userId, $accessToken, $expiresAt);
        }

        // Google rotates refresh tokens for some clients; persist the new one.
        $newRefresh = isset($json['refresh_token']) ? trim((string) $json['refresh_token']) : '';
        if ($newRefresh !== '') {
            if ($userId && $this->userDriveRefreshToken($userId) !== null) {
                $this->saveUserRefreshToken($userId, $newRefresh);
            } else {
                $this->saveIntegrationSetting('refresh_token', $newRefresh);
                $this->integrationSettings['refresh_token'] = $newRefresh;
            }
        }
    }

    protected function cachedAccessToken(?int $userId): ?string
    {
        if ($userId) {
            $setting = $this->getUserDriveSetting($userId);
            if (! $setting || empty($setting->google_drive_access_token_encrypted) || empty($setting->google_drive_token_expires_at)) {
                return null;
            }
            try {
                if (now()->lt($setting->google_drive_token_expires_at)) {
                    return Crypt::decryptString($setting->google_drive_access_token_encrypted) ?: null;
                }
            } catch (\Throwable $e) {
                return null;
            }

            return null;
        }

        $payload = Cache::get('backup.gdrive.admin_access_token');
        if (is_array($payload) && ! empty($payload['token'])) {
            return (string) $payload['token'];
        }

        return null;
    }

    protected function storeAccessToken(?int $userId, string $accessToken, \DateTimeInterface $expiresAt): void
    {
        if ($userId) {
            $setting = $this->getUserDriveSetting($userId);
            if (! $setting) {
                return;
            }
            $setting->google_drive_access_token_encrypted = Crypt::encryptString($accessToken);
            $setting->google_drive_token_expires_at = $expiresAt;
            $setting->save();
            $this->userDriveSettings[$userId] = $setting;

            return;
        }

        $ttl = max(60, $expiresAt->getTimestamp() - time());
        Cache::put('backup.gdrive.admin_access_token', ['token' => $accessToken], $ttl);
    }

    protected function saveUserRefreshToken(?int $userId, string $refreshToken): void
    {
        $setting = $this->getUserDriveSetting($userId);
        if (! $setting) {
            return;
        }
        $setting->google_drive_refresh_token_encrypted = Crypt::encryptString($refreshToken);
        $setting->save();
        $this->userDriveSettings[$userId] = $setting;
    }

    /**
     * Calls custom endpoint to fetch a fresh refresh_token and persists it in integrations.setting.
     */
    protected function rotateRefreshTokenFromEndpoint(): ?string
    {
        $url = trim((string) config('backup.google_drive_api.refresh_token_rotate_url', ''));
        if ($url === '') {
            return null;
        }

        try {
            $secret = trim((string) config('backup.google_drive_api.refresh_token_rotate_secret', ''));
            $request = Http::timeout(60);
            if ($secret !== '') {
                $request = $request->withHeaders(['X-Backup-Secret' => $secret]);
            }
            $response = $request->post($url, [
                'client_id' => $this->credential('client_id', (string) config('backup.google_drive_api.client_id')),
                'client_secret' => $this->credential('client_secret', (string) config('backup.google_drive_api.client_secret')),
            ]);

            if ($response->failed()) {
                Log::warning('backup.google_drive_rotate_failed', ['status' => $response->status(), 'body' => $response->body()]);
                return null;
            }

            $newToken = (string) $response->json('refresh_token');
            if ($newToken === '') {
                return null;
            }

            $this->saveIntegrationSetting('refresh_token', $newToken);
            // refresh in-memory cache
            $this->integrationSettings['refresh_token'] = $newToken;

            return $newToken;
        } catch (\Throwable $e) {
            Log::warning('backup.google_drive_rotate_exception', ['message' => $e->getMessage()]);
            return null;
        }
    }

    protected function resolveOrCreateFolderId(string $accessToken, ?int $userId = null): string
    {
        $folderName = $this->folderName($userId);
        if ($folderName === '') {
            return '';
        }

        $q = sprintf(
            "mimeType='application/vnd.google-apps.folder' and trashed=false and name='%s'",
            str_replace("'", "\\'", $folderName)
        );

        $list = Http::withToken($accessToken)
            ->timeout(60)
            ->get('https://www.googleapis.com/drive/v3/files', [
                'q' => $q,
                'fields' => 'files(id,name)',
                'pageSize' => 1,
                'spaces' => 'drive',
            ]);

        if ($list->ok()) {
            $existingId = data_get($list->json(), 'files.0.id');
            if (is_string($existingId) && $existingId !== '') {
                return $existingId;
            }
        }

        $create = Http::withToken($accessToken)
            ->timeout(60)
            ->post('https://www.googleapis.com/drive/v3/files', [
                'name' => $folderName,
                'mimeType' => 'application/vnd.google-apps.folder',
            ]);

        if ($create->failed()) {
            Log::warning('backup.google_drive_folder_create', ['status' => $create->status(), 'body' => $create->body()]);
            return '';
        }

        $newId = $create->json('id');
        if (is_string($newId) && $newId !== '') {
            $this->saveUserFolderId($userId, $newId);

            return $newId;
        }

        return '';
    }

    protected function folderId(?int $userId = null): string
    {
        $setting = $this->getUserDriveSetting($userId);
        if ($setting && $setting->hasConnectedGoogleDrive()) {
            return trim((string) $setting->google_drive_folder_id);
        }

        $folderId = trim((string) config('backup.google_drive_api.folder_id', ''));
        if ($folderId !== '') {
            return $folderId;
        }

        return trim((string) $this->credential('folder_id', ''));
    }

    protected function folderName(?int $userId = null): string
    {
        $setting = $this->getUserDriveSetting($userId);
        if ($setting && $setting->hasConnectedGoogleDrive() && trim((string) $setting->google_drive_folder_name) !== '') {
            return trim((string) $setting->google_drive_folder_name);
        }

        return trim((string) $this->credential('folder_name', (string) config('backup.google_drive_api.folder_name', 'POS DBs Backups')));
    }

    protected function userDriveRefreshToken(?int $userId = null): ?string
    {
        $setting = $this->getUserDriveSetting($userId);
        if (! $setting || ! $setting->hasConnectedGoogleDrive()) {
            return null;
        }

        try {
            $token = Crypt::decryptString($setting->google_drive_refresh_token_encrypted);

            return trim($token) !== '' ? trim($token) : null;
        } catch (\Throwable $e) {
            Log::warning('backup.google_drive_user_token_decrypt_failed', ['user_id' => $userId, 'message' => $e->getMessage()]);

            return null;
        }
    }

    protected function getUserDriveSetting(?int $userId = null): ?UserBackupMailSetting
    {
        if (! $userId) {
            return null;
        }

        if (! array_key_exists($userId, $this->userDriveSettings)) {
            $this->userDriveSettings[$userId] = UserBackupMailSetting::where('user_id', $userId)->first();
        }

        return $this->userDriveSettings[$userId];
    }

    protected function saveUserFolderId(?int $userId, string $folderId): void
    {
        $setting = $this->getUserDriveSetting($userId);
        if (! $setting) {
            return;
        }

        $setting->google_drive_folder_id = $folderId;
        $setting->save();
        $this->userDriveSettings[$userId] = $setting;
    }

    protected function clearUserDriveToken(?int $userId = null): void
    {
        $setting = $this->getUserDriveSetting($userId);
        if (! $setting) {
            return;
        }

        $setting->google_drive_refresh_token_encrypted = null;
        $setting->google_drive_access_token_encrypted = null;
        $setting->google_drive_token_expires_at = null;
        $setting->google_drive_folder_id = null;
        $setting->google_drive_connected_at = null;
        $setting->save();
        $this->userDriveSettings[$userId] = $setting;
    }

    protected function nonEmpty($value): bool
    {
        return is_string($value) && trim($value) !== '';
    }

    protected function credential(string $key, string $fallback = ''): string
    {
        $settings = $this->getIntegrationSettings();
        $value = data_get($settings, $key);
        if (is_string($value) && trim($value) !== '') {
            return trim($value);
        }

        return trim($fallback);
    }

    /**
     * Reads a live google drive backup row from integrations table.
     * Expected JSON keys in integrations.setting:
     * client_id, client_secret, refresh_token, folder_id, folder_name
     *
     * @return array<string,mixed>
     */
    protected function getIntegrationSettings(): array
    {
        if (is_array($this->integrationSettings)) {
            return $this->integrationSettings;
        }

        try {
            $row = DB::table('integrations')
                ->where('type', 'google_drive_backup')
                ->where('section', 'backup')
                ->where('mode', 'live')
                ->where('status', 'active')
                ->orderByDesc('id')
                ->first();

            if (! $row || ! isset($row->setting)) {
                $this->integrationRow = null;
                $this->integrationSettings = [];
                return $this->integrationSettings;
            }
            $this->integrationRow = $row;

            $decoded = json_decode((string) $row->setting, true);
            $this->integrationSettings = is_array($decoded) ? $decoded : [];
        } catch (\Throwable $e) {
            // Keep backward compatibility when table/row is missing.
            $this->integrationSettings = [];
        }

        return $this->integrationSettings;
    }

    protected function saveIntegrationSetting(string $key, string $value): void
    {
        $settings = $this->getIntegrationSettings();
        $settings[$key] = $value;

        if ($this->integrationRow && isset($this->integrationRow->id)) {
            DB::table('integrations')
                ->where('id', $this->integrationRow->id)
                ->update([
                    'setting' => json_encode($settings, JSON_UNESCAPED_SLASHES),
                    'updated_at' => now(),
                ]);
        }
    }
}
