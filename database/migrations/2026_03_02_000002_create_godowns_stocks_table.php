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
        Schema::create('godowns_stocks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('godown_id');
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('product_id');
            $table->decimal('stock', 12, 2)->default(0);
            $table->timestamps();

            $table->unique(['godown_id', 'company_id', 'product_id'], 'godown_company_product_unique');

            $table->foreign('godown_id')->references('id')->on('godowns')->onDelete('cascade');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('godowns_stocks');
    }
};

