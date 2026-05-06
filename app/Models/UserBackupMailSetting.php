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
    ];

    protected $hidden = [
        'app_password_encrypted',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hasStoredAppPassword(): bool
    {
        return $this->app_password_encrypted !== null && $this->app_password_encrypted !== '';
    }
}
