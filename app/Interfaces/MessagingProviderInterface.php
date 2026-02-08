<?php

namespace App\Interfaces;

use App\Models\Hotel;

interface MessagingProviderInterface
{
    /**
     * Send a message via the provider.
     *
     * @param Hotel $hotel The hotel sending the message (used for credentials/from number)
     * @param string $to The recipient's phone number
     * @param string $body The message body
     * @return bool True if sent successfully
     */
    public function send(Hotel $hotel, string $to, string $body): bool;
}
