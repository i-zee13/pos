<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Offline 1→1 sync queue (Phase 2 uses this; Phase 1 creates table for readiness).
 * Pending local mutations wait here until net is available.
 */
class CreateSyncQueueTable extends Migration
{
    public function up()
    {
        if (Schema::hasTable('sync_queue')) {
            return;
        }

        Schema::create('sync_queue', function (Blueprint $table) {
            $table->id();
            $table->string('entity_type', 64); // sale_invoice, product, customer, ...
            $table->string('entity_id', 64)->nullable();
            $table->string('operation', 16); // create, update, delete
            $table->json('payload')->nullable();
            $table->string('status', 24)->default('pending')->index(); // pending, synced, failed
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->text('last_error')->nullable();
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sync_queue');
    }
}
