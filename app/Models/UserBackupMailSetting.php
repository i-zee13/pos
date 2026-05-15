<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserBackupMailSetting extends Model
{
    protected $table = 'user_backup_mail_settings';

    protected $fillable = [
        'user_id',
        'gmail',
        'app_password_encrypted',
        'google_drive_refresh_token_encrypted',
        'google_drive_folder_id',
        'google_drive_folder_name',
        'google_drive_connected_at',
    ];

    protected $hidden = [
        'app_password_encrypted',
        'google_drive_refresh_token_encrypted',
    ];

    protected $casts = [
        'google_drive_connected_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hasStoredAppPassword(): bool
    {
        return $this->app_password_encrypted !== null && $this->app_password_encrypted !== '';
    }

    public function hasConnectedGoogleDrive(): bool
    {
        return $this->google_drive_refresh_token_encrypted !== null && $this->google_drive_refresh_token_encrypted !== '';
    }
}
