<?php

namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\Guest;
use App\Models\Hotel;
use App\Services\BookingFlowManager;
use App\Services\MessagingService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class ComplianceTest extends TestCase
{
    use RefreshDatabase;

    protected $messagingService;
    protected $hotel;
    protected $guest;
    protected $conversation;
    protected $mockProvider;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock the provider to avoid real API calls and error logging
        $this->mockProvider = \Mockery::mock(\App\Interfaces\MessagingProviderInterface::class);
        $this->mockProvider->shouldReceive('send')->andReturnTrue(); // Default expectation

        $this->app->instance(\App\Interfaces\MessagingProviderInterface::class, $this->mockProvider);

        // Re-resolve MessagingService to inject the mock
        $this->messagingService = app(MessagingService::class);

        $twilioAccount = \App\Models\TwilioAccount::create([
            'name' => 'Test Account',
            'account_sid' => 'AC' . str_repeat('0', 32),
            'auth_token' => str_repeat('0', 32),
            'status' => 'active',
        ]);

        $this->hotel = Hotel::create([
            'name' => 'Compliance Hotel',
            'slug' => 'compliance-hotel',
            'phone' => '+1234567890',
            'address' => '123 Main St',
            'status' => 'active',
            'twilio_account_id' => $twilioAccount->id,
        ]);

        $this->guest = Guest::create([
            'hotel_id' => $this->hotel->id,
            'name' => 'John Doe',
            'phone' => '+1999999999',
            'source' => 'whatsapp',
            'opted_in' => true,
        ]);

        $this->conversation = Conversation::create([
            'hotel_id' => $this->hotel->id,
            'guest_id' => $this->guest->id,
            'status' => 'open',
            'current_state' => 'GREETING',
            'last_guest_message_at' => now(),
        ]);
    }

    public function test_rate_limiting_blocks_excessive_messages()
    {
        $phone = '+1999999999';
        RateLimiter::clear('whatsapp:inbound:' . $phone);

        // Expect warning log when limit exceeded
        Log::shouldReceive('warning')
            ->once()
            ->with("Rate limit exceeded for $phone");

        // Also expect info logs for successful messages (at least one)
        Log::shouldReceive('info')->atLeast()->times(1);

        // Send 21 messages. First 20 pass, 21st fails
        for ($i = 0; $i < 21; $i++) {
            $this->messagingService->processInbound($phone, $this->hotel->phone, 'Hi', 'AC' . str_repeat('0', 32));
        }
    }

    public function test_outbound_window_check_logs_warning_outside_24h()
    {
        // Set last message to 25 hours ago
        $this->conversation->update([
            'last_guest_message_at' => now()->subHours(25)
        ]);

        Log::shouldReceive('warning')
            ->once()
            ->with("Attempted to send message outside 24h window to {$this->guest->phone}");

        // Info log for sending the message (since we only log warning but proceed in current impl)
        // AND the log inside sendOutbound
        Log::shouldReceive('info')->atLeast()->times(1);

        $this->messagingService->sendOutbound($this->conversation, "Delayed message");
    }

    public function test_outbound_window_allows_message_within_24h()
    {
        // Set last message to 1 hour ago
        $this->conversation->update([
            'last_guest_message_at' => now()->subHours(1)
        ]);

        Log::shouldReceive('warning')->never();
        Log::shouldReceive('info')->atLeast()->times(1);

        $this->messagingService->sendOutbound($this->conversation, "Recent message");
    }
}
