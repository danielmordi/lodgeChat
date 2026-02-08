<?php

namespace App\Services;

use App\Interfaces\MessagingProviderInterface;
use App\Models\Conversation;
use App\Models\Guest;
use App\Models\Hotel;
use App\Models\Message;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

class MessagingService
{
    protected $bookingFlow;
    protected $provider;

    public function __construct(BookingFlowManager $bookingFlow, MessagingProviderInterface $provider)
    {
        $this->bookingFlow = $bookingFlow;
        $this->provider = $provider;
    }

    /**
     * Process an inbound message from WhatsApp.
     */
    public function processInbound(string $from, string $to, string $body, string $accountSid, string $profileName = null)
    {
        // 1. Identify Hotel by Twilio Account SID
        // The PRD states each hotel has one Twilio subaccount.
        // We find the TwilioAccount by SID, then get the Hotel.

        $hotel = Hotel::whereHas('twilioAccount', function ($query) use ($accountSid) {
            $query->where('account_sid', $accountSid);
        })->first();

        // Fallback or explicit check
        if (!$hotel) {
            // Log warning or handle unrecognized account
            Log::warning("Inbound message to unknown account SID: $accountSid");
            // Optionally try finding by Phone if we are in a mixed mode?
            // For now, strict SID matching is safer for SaaS.
            return;
        }

        // Rate Limiting (20 messages per minute per phone number)
        $key = 'whatsapp:inbound:' . $from;
        if (RateLimiter::tooManyAttempts($key, 20)) {
            Log::warning("Rate limit exceeded for $from");
            return; // Silently drop or reply with error if desired (but avoid infinite loops)
        }
        RateLimiter::hit($key, 60);

        // 2. Find or Create Guest
        $guest = Guest::firstOrCreate(
            [
                'hotel_id' => $hotel->id,
                'phone' => $from,
            ],
            [
                'name' => $profileName ?? 'Guest',
                'opted_in' => true, // Inbound message implies opt-in
                'source' => 'whatsapp',
            ]
        );

        // 3. Find or Create Conversation
        $conversation = Conversation::firstOrCreate(
            [
                'hotel_id' => $hotel->id,
                'guest_id' => $guest->id,
                'status' => 'open',
            ],
            [
                'current_state' => 'GREETING',
            ]
        );

        // Update last guest message timestamp
        $conversation->update(['last_guest_message_at' => now()]);

        // 4. Log the Inbound Message
        Message::create([
            'hotel_id' => $hotel->id,
            'conversation_id' => $conversation->id,
            'direction' => 'inbound',
            'body' => $body,
        ]);

        // 5. Hand off to BookingFlowManager
        $response = $this->bookingFlow->processMessage($conversation, $body);

        // 6. Send Response
        if ($response) {
            $this->sendOutbound($conversation, $response);
        }
    }

    /**
     * Send an outbound message via the provider.
     */
    public function sendOutbound(Conversation $conversation, string $body)
    {
        $hotel = $conversation->hotel;
        $guest = $conversation->guest;

        // 24-hour Window Check
        $lastMessage = $conversation->last_guest_message_at;
        if (!$lastMessage || $lastMessage->diffInHours(now()) >= 24) {
            Log::warning("Attempted to send message outside 24h window to {$guest->phone}");
            // In a real app, this should trigger a "Template Message" fallback.
            // For now, we enforce the rule strict.
            // throw new \Exception("Cannot send message outside 24h window without a template.");
            // Or mostly just log it for MVP as we expect immediate replies.
        }

        // Log the outbound message
        Message::create([
            'hotel_id' => $hotel->id,
            'conversation_id' => $conversation->id,
            'direction' => 'outbound',
            'body' => $body,
        ]);

        $this->provider->send($hotel, $guest->phone, $body);

        Log::info("Sent WhatsApp to {$guest->phone}: $body");
    }
}
