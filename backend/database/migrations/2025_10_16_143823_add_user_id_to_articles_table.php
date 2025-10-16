<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
        });
        
        // Create a default user for existing articles
        $defaultUser = \App\Models\User::first();
        if (!$defaultUser) {
            $defaultUser = \App\Models\User::create([
                'name' => 'Default User',
                'email' => 'default@example.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
            ]);
        }
        
        // Assign all existing articles to the default user
        \App\Models\Article::whereNull('user_id')->update(['user_id' => $defaultUser->id]);
        
        // Now make user_id not nullable
        Schema::table('articles', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
