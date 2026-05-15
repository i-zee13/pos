<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddGoogleDriveOauthToUserBackupMailSettingsTable extends Migration
{
    public function up()
    {
        Schema::table('user_backup_mail_settings', function (Blueprint $table) {
            $table->text('google_drive_refresh_token_encrypted')->nullable()->after('app_password_encrypted');
            $table->string('google_drive_folder_id', 255)->nullable()->after('google_drive_refresh_token_encrypted');
            $table->string('google_drive_folder_name', 255)->nullable()->after('google_drive_folder_id');
            $table->timestamp('google_drive_connected_at')->nullable()->after('google_drive_folder_name');
        });
    }

    public function down()
    {
        Schema::table('user_backup_mail_settings', function (Blueprint $table) {
            $table->dropColumn([
                'google_drive_refresh_token_encrypted',
                'google_drive_folder_id',
                'google_drive_folder_name',
                'google_drive_connected_at',
            ]);
        });
    }
}
