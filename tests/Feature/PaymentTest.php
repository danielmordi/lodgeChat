<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Hotel;
use App\Models\Payment;
use App\Models\RoomType;
use App\Models\Guest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    protected $hotel;
    protected $guest;
    protected $roomType;
    protected $booking;
    protected $payment;

    protected function setUp(): void
    {
        parent::setUp();

        $this->hotel = Hotel::factory()->create([
            'phone' => '+1234567890',
            'address' => '123 Main St',
        ]);

        // Ensure hotel has Twilio account for completeness if needed by observers, but here we test payments directly.

        $this->guest = Guest::factory()->create([
            'hotel_id' => $this->hotel->id,
            'phone' => '+1987654321',
        ]);

        $this->roomType = RoomType::create([
            'hotel_id' => $this->hotel->id,
            'name' => 'Deluxe Suite',
            'price_per_night' => 200.00,
            'max_guests' => 2,
            'active' => true,
        ]);

        $this->booking = Booking::create([
            'hotel_id' => $this->hotel->id,
            'guest_id' => $this->guest->id,
            'room_type_id' => $this->roomType->id,
            'check_in' => '2025-01-01',
            'nights' => 3,
            'amount' => 600.00,
            'status' => 'pending',
        ]);

        $this->payment = Payment::create([
            'hotel_id' => $this->hotel->id,
            'booking_id' => $this->booking->id,
            'provider' => 'local',
            'reference' => 'REF-TEST-123',
            'amount' => 600.00,
            'status' => 'pending',
        ]);
    }

    public function test_checkout_page_renders()
    {
        $response = $this->get(route('payment.checkout', ['reference' => $this->payment->reference]));

        $response->assertStatus(200);
        $response->assertSee('Checkout');
        $response->assertSee('600.00');
    }

    public function test_payment_verification_success()
    {
        $response = $this->post(route('payment.verify', ['reference' => $this->payment->reference]));

        $response->assertStatus(200);
        $response->assertSee('Payment successful!');

        $this->assertEquals('success', $this->payment->fresh()->status);
        $this->assertEquals('confirmed', $this->booking->fresh()->status);
    }
}
