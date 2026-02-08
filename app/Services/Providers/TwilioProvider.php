<?php

namespace App\Services\Providers;

use App\Interfaces\MessagingProviderInterface;
use App\Models\Hotel;
use Illuminate\Support\Facades\Log;
use Twilio\Rest\Client;

class TwilioProvider implements MessagingProviderInterface
{
    public function send(Hotel $hotel, string $to, string $body): bool
    {
        $twilioAccount = $hotel->twilioAccount;

        if (!$twilioAccount) {
            Log::error("Hotel {$hotel->id} attempted to send message without Twilio Account.");
            return false;
        }

        try {
            $client = new Client($twilioAccount->account_sid, $twilioAccount->auth_token);

            $client->messages->create(
                $to,
                [
                    'from' => $hotel->phone,
                    'body' => $body
                ]
            );

            return true;

        } catch (\Exception $e) {
            Log::error("TwilioProvider Error for Hotel {$hotel->id}: " . $e->getMessage());
            return false;
        }
    }
}
