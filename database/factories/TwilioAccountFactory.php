<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TwilioAccount>
 */
class TwilioAccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'account_sid' => 'AC' . fake()->md5(),
            'auth_token' => fake()->md5(),
            'status' => 'active',
        ];
    }
}
