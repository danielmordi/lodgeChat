<?php

namespace App\Services;

use App\Interfaces\PaymentServiceInterface;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Str;

class LocalPaymentService implements PaymentServiceInterface
{
    public function generatePaymentLink(Booking $booking): string
    {
        // For MVP, we'll generate a simple signed URL or just a route execution
        // In reality, this would call Paystack/Flutterwave

        // Generate a unique reference
        $reference = 'REF-' . strtoupper(Str::random(10));

        // Create a pending payment record
        Payment::create([
            'hotel_id' => $booking->hotel_id,
            'booking_id' => $booking->id,
            'provider' => 'local',
            'reference' => $reference,
            'amount' => $booking->amount,
            'status' => 'pending',
        ]);

        // Return a local URL for "mock" payment
        return route('payment.checkout', ['reference' => $reference]);
    }

    public function verifyPayment(string $reference): bool
    {
        $payment = Payment::where('reference', $reference)->first();

        if (!$payment) {
            return false;
        }

        // Mock verification logic
        $payment->update(['status' => 'success']);
        $payment->booking->update(['status' => 'confirmed']);

        return true;
    }
}
