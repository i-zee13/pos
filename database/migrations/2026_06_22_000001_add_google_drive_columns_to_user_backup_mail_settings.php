<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddGoogleDriveColumnsToUserBackupMailSettings extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('user_backup_mail_settings')) {
            return;
        }

        Schema::table('user_backup_mail_settings', function (Blueprint $table) {
            if (! Schema::hasColumn('user_backup_mail_settings', 'google_drive_refresh_token_encrypted')) {
                $table->text('google_drive_refresh_token_encrypted')->nullable()->after('app_password_encrypted');
            }
            if (! Schema::hasColumn('user_backup_mail_settings', 'google_drive_access_token_encrypted')) {
                $table->text('google_drive_access_token_encrypted')->nullable()->after('google_drive_refresh_token_encrypted');
            }
            if (! Schema::hasColumn('user_backup_mail_settings', 'google_drive_token_expires_at')) {
                $table->timestamp('google_drive_token_expires_at')->nullable()->after('google_drive_access_token_encrypted');
            }
            if (! Schema::hasColumn('user_backup_mail_settings', 'google_drive_folder_id')) {
                $table->string('google_drive_folder_id', 255)->nullable()->after('google_drive_token_expires_at');
            }
            if (! Schema::hasColumn('user_backup_mail_settings', 'google_drive_folder_name')) {
                $table->string('google_drive_folder_name', 255)->nullable()->after('google_drive_folder_id');
            }
            if (! Schema::hasColumn('user_backup_mail_settings', 'google_drive_connected_at')) {
                $table->timestamp('google_drive_connected_at')->nullable()->after('google_drive_folder_name');
            }
        });
    }

    public function down()
    {
        if (! Schema::hasTable('user_backup_mail_settings')) {
            return;
        }

        Schema::table('user_backup_mail_settings', function (Blueprint $table) {
            $cols = [
                'google_drive_connected_at',
                'google_drive_folder_name',
                'google_drive_folder_id',
                'google_drive_token_expires_at',
                'google_drive_access_token_encrypted',
                'google_drive_refresh_token_encrypted',
            ];
            foreach ($cols as $col) {
                if (Schema::hasColumn('user_backup_mail_settings', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
}
