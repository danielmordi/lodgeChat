<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('phone');
            $table->text('address');
            $table->string('timezone')->default('Africa/Lagos');
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->foreignId('twilio_account_id')->constrained('twilio_accounts');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};
