<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('hotels', function (Blueprint $table) {
            $table->enum('status', ['pending', 'active', 'paused', 'suspended'])->default('pending')->change();
            $table->tinyInteger('trust_level')->default(0)->after('status');
            $table->timestamp('whatsapp_verified_at')->nullable()->after('trust_level');
            $table->text('business_verification_url')->nullable()->after('whatsapp_verified_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hotels', function (Blueprint $table) {
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active')->change();
            $table->dropColumn(['trust_level', 'whatsapp_verified_at', 'business_verification_url']);
        });
    }
};
