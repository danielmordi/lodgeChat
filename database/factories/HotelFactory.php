<?php

namespace Database\Factories;

use App\Models\TwilioAccount;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Hotel>
 */
class HotelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->company() . ' Hotel';
        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'timezone' => 'Africa/Lagos',
            'status' => 'active',
            'twilio_account_id' => TwilioAccount::factory(),
        ];
    }
}
