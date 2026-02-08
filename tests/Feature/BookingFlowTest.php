<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Conversation;
use App\Models\Guest;
use App\Models\Hotel;
use App\Models\RoomType;
use App\Services\BookingFlowManager;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class BookingFlowTest extends TestCase
{
    use RefreshDatabase;

    protected $flowManager;
    protected $hotel;
    protected $guest;
    protected $conversation;
    protected $roomType;

    protected function setUp(): void
    {
        parent::setUp();

        $this->flowManager = app(BookingFlowManager::class);

        $twilioAccount = \App\Models\TwilioAccount::create([
            'name' => 'Test Account',
            'account_sid' => 'AC' . str_repeat('0', 32),
            'auth_token' => str_repeat('0', 32),
            'status' => 'active',
        ]);

        $this->hotel = Hotel::create([
            'name' => 'Grand Hotel',
            'slug' => 'grand-hotel',
            'phone' => '+1234567890',
            'address' => '123 Main St',
            'status' => 'active',
            'twilio_account_id' => $twilioAccount->id,
        ]);

        $this->roomType = RoomType::create([
            'hotel_id' => $this->hotel->id,
            'name' => 'Deluxe Suite',
            'price_per_night' => 200.00,
            'max_guests' => 2,
            'active' => true,
        ]);

        $this->guest = Guest::create([
            'hotel_id' => $this->hotel->id,
            'name' => 'John Doe',
            'phone' => '+1987654321',
            'source' => 'whatsapp',
            'opted_in' => true,
        ]);

        $this->conversation = Conversation::create([
            'hotel_id' => $this->hotel->id,
            'guest_id' => $this->guest->id,
            'status' => 'open',
            'current_state' => 'GREETING',
        ]);
    }

    public function test_flow_greeting_to_date_selection()
    {
        $response = $this->flowManager->processMessage($this->conversation, 'Hi');

        $this->assertStringContainsString('When would you like to check in?', $response);
        $this->assertEquals('DATE_SELECTION', $this->conversation->fresh()->current_state);
    }

    public function test_flow_date_selection_to_duration()
    {
        $this->conversation->update(['current_state' => 'DATE_SELECTION']);

        $futureDate = now()->addMonth()->format('Y-m-d');
        $response = $this->flowManager->processMessage($this->conversation, $futureDate);

        $this->assertStringContainsString('How many nights', $response);
        $this->assertEquals('DURATION_SELECTION', $this->conversation->fresh()->current_state);
        $this->assertEquals($futureDate, $this->conversation->fresh()->metadata['check_in']);
    }

    public function test_flow_duration_to_room_selection()
    {
        $this->conversation->update([
            'current_state' => 'DURATION_SELECTION',
            'metadata' => ['check_in' => '2025-01-01']
        ]);

        $response = $this->flowManager->processMessage($this->conversation, '3');

        $this->assertStringContainsString('Deluxe Suite', $response);
        $this->assertEquals('ROOM_SELECTION', $this->conversation->fresh()->current_state);
        $this->assertEquals(3, $this->conversation->fresh()->metadata['nights']);
        $this->assertArrayHasKey(1, $this->conversation->fresh()->metadata['room_options']);
    }

    public function test_flow_room_selection_to_confirmation()
    {
        $this->conversation->update([
            'current_state' => 'ROOM_SELECTION',
            'metadata' => [
                'check_in' => '2025-01-01',
                'nights' => 3,
                'room_options' => [1 => $this->roomType->id]
            ]
        ]);

        $response = $this->flowManager->processMessage($this->conversation, '1');

        $this->assertStringContainsString('Booking Summary', $response);
        $this->assertStringContainsString('$600.00', $response); // 200 * 3
        $this->assertEquals('CONFIRMATION', $this->conversation->fresh()->current_state);
        $this->assertEquals($this->roomType->id, $this->conversation->fresh()->metadata['room_type_id']);
    }

    public function test_flow_confirmation_to_booking()
    {
        $this->conversation->update([
            'current_state' => 'CONFIRMATION',
            'metadata' => [
                'check_in' => '2025-01-01',
                'nights' => 3,
                'room_options' => [1 => $this->roomType->id],
                'room_type_id' => $this->roomType->id,
                'total_price' => 600.00
            ]
        ]);

        $response = $this->flowManager->processMessage($this->conversation, 'yes');

        $this->assertStringContainsString('Booking confirmed!', $response);
        $this->assertStringContainsString('Pay here:', $response);
        $this->assertEquals('PAYMENT_PENDING', $this->conversation->fresh()->current_state);

        $this->assertDatabaseHas('bookings', [
            'hotel_id' => $this->hotel->id,
            'guest_id' => $this->guest->id,
            'room_type_id' => $this->roomType->id,
            'amount' => 600.00,
            'status' => 'pending'
        ]);
    }
}
