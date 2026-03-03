<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('godowns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            // Limit code length so the unique index fits older MySQL key length limits
            $table->string('code', 100)->nullable()->unique();
            $table->enum('type', ['shop', 'warehouse'])->default('shop');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('godowns');
    }
};

