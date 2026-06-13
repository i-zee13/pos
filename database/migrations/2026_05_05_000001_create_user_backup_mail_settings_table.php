<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserBackupMailSettingsTable extends Migration
{
    public function up()
    {
        Schema::create('user_backup_mail_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();
            $table->string('gmail', 255);
            $table->text('app_password_encrypted')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_backup_mail_settings');
    }
}
