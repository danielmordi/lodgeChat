<?php

namespace App\Interfaces;

use App\Models\Booking;

interface PaymentServiceInterface
{
    /**
     * Generate a payment link for a booking.
     *
     * @param Booking $booking
     * @return string The payment URL
     */
    public function generatePaymentLink(Booking $booking): string;

    /**
     * Verify a payment (callback).
     *
     * @param string $reference
     * @return bool
     */
    public function verifyPayment(string $reference): bool;
}
