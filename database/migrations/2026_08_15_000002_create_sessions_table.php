<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Laravel database sessions (avoids long file-session locks under slow sale saves).
 *
 * After migrate, set SESSION_DRIVER=database in .env (or rely on config default).
 * Redis is better if available: SESSION_DRIVER=redis
 *
 * id length 191: utf8mb4 PK limit on older MySQL/MariaDB (255*4 > 1000 bytes).
 */
class CreateSessionsTable extends Migration
{
    public function up()
    {
        // Drop partial table left by a failed migrate (e.g. key-too-long on varchar 255).
        Schema::dropIfExists('sessions');

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id', 191)->primary();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->text('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sessions');
    }
}
