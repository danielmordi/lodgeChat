<?php

namespace Tests\Feature;

use App\Models\Hotel;
use App\Models\User;
use App\Models\Guest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenancyScopingTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_only_see_guests_from_their_hotel()
    {
        $hotel1 = Hotel::factory()->create();
        $hotel2 = Hotel::factory()->create();

        $user1 = User::factory()->create(['hotel_id' => $hotel1->id]);
        $user2 = User::factory()->create(['hotel_id' => $hotel2->id]);

        $guest1 = Guest::factory()->create(['hotel_id' => $hotel1->id]);
        $guest2 = Guest::factory()->create(['hotel_id' => $hotel2->id]);

        // Acting as user 1
        $this->actingAs($user1);
        $this->assertCount(1, Guest::all());
        $this->assertEquals($guest1->id, Guest::first()->id);

        // Acting as user 2
        $this->actingAs($user2);
        $this->assertCount(1, Guest::all());
        $this->assertEquals($guest2->id, Guest::first()->id);
    }

    public function test_guests_are_automatically_assigned_to_the_users_hotel()
    {
        $hotel = Hotel::factory()->create();
        $user = User::factory()->create(['hotel_id' => $hotel->id]);

        $this->actingAs($user);

        $guest = Guest::create([
            'name' => 'John Doe',
            'phone' => '1234567890',
            'source' => 'whatsapp',
            'opted_in' => true,
        ]);

        $this->assertEquals($hotel->id, $guest->hotel_id);
    }
}
