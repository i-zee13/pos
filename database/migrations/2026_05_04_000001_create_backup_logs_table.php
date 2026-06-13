<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
| Raw SQL (MySQL 5.7+ / MariaDB 10.2+ with JSON):
|
| CREATE TABLE `backup_logs` (
|   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
|   `user_id` bigint unsigned DEFAULT NULL,
|   `zip_filename` varchar(255) DEFAULT NULL,
|   `local_relative_path` varchar(512) DEFAULT NULL,
|   `databases` json NOT NULL,
|   `status` varchar(32) NOT NULL DEFAULT 'pending',
|   `size_bytes` bigint unsigned DEFAULT NULL,
|   `gdrive_uploaded` tinyint(1) NOT NULL DEFAULT '0',
|   `gdrive_remote_path` varchar(512) DEFAULT NULL,
|   `error_message` text,
|   `triggered_by` varchar(32) NOT NULL DEFAULT 'manual',
|   `created_at` timestamp NULL DEFAULT NULL,
|   `updated_at` timestamp NULL DEFAULT NULL,
|   `completed_at` timestamp NULL DEFAULT NULL,
|   PRIMARY KEY (`id`),
|   KEY `backup_logs_user_id_index` (`user_id`),
|   KEY `backup_logs_status_index` (`status`)
| ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
*/

class CreateBackupLogsTable extends Migration
{
    public function up()
    {
        Schema::create('backup_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->string('zip_filename', 255)->nullable();
            $table->string('local_relative_path', 512)->nullable();
            $table->json('databases');
            $table->string('status', 32)->default('pending')->index();
            $table->unsignedBigInteger('size_bytes')->nullable();
            $table->boolean('gdrive_uploaded')->default(false);
            $table->string('gdrive_remote_path', 512)->nullable();
            $table->text('error_message')->nullable();
            $table->string('triggered_by', 32)->default('manual');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('backup_logs');
    }
}
