<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\MessagingService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class WhatsAppWebhookController extends Controller
{
    protected $messagingService;

    public function __construct(MessagingService $messagingService)
    {
        $this->messagingService = $messagingService;
    }

    /**
     * Handle incoming WhatsApp webhook from Twilio.
     */
    public function handle(Request $request): Response
    {
        Log::info('Incoming WhatsApp Webhook', $request->all());

        // Basic validation
        // In production, we should validate the X-Twilio-Signature header.

        $from = $request->input('From'); // e.g., "whatsapp:+1234567890"
        $to = $request->input('To');     // e.g., "whatsapp:+0987654321"
        $body = $request->input('Body');
        $profileName = $request->input('ProfileName');

        $accountSid = $request->input('AccountSid');

        // Clean up numbers (remove 'whatsapp:' prefix if needed for logic, 
        // but typically better to keep strictly E.164 or whatever Twilio sends)
        // Our service expects full strings for now.

        // Process message asynchronously? 
        // Ideally yes, but for MVP synchronous is fine for immediate response if needed.
        // However, Twilio expects TwiML or 200 OK fast.

        try {
            $this->messagingService->processInbound($from, $to, $body, $accountSid, $profileName);
        } catch (\Exception $e) {
            Log::error("Error processing WhatsApp message: " . $e->getMessage());
            // Return 200 to Twilio so it doesn't retry endlessly
            return response('Error', 200);
        }

        return response('OK', 200);
    }
}
