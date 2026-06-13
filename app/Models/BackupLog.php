<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class BackupLog extends Model
{
    use \App\Models\Concerns\BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'zip_filename',
        'local_relative_path',
        'databases',
        'status',
        'size_bytes',
        'gdrive_uploaded',
        'gdrive_remote_path',
        'error_message',
        'triggered_by',
        'completed_at',
    ];

    protected $casts = [
        'databases' => 'array',
        'gdrive_uploaded' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isDownloadable(): bool
    {
        return $this->status === 'completed'
            && $this->local_relative_path
            && Storage::disk('local')->exists($this->local_relative_path);
    }
}
