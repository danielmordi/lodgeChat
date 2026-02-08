<?php

namespace App\Http\Controllers;

use App\Interfaces\PaymentServiceInterface;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentServiceInterface $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function checkout(string $reference)
    {
        $payment = Payment::where('reference', $reference)->firstOrFail();

        if ($payment->status === 'successful') {
            return "Payment already successful.";
        }

        return view('payment.checkout', compact('payment'));
    }

    public function verify(string $reference)
    {
        $success = $this->paymentService->verifyPayment($reference);

        if ($success) {
            return "Payment successful! Your booking is confirmed.";
        }

        return "Payment verification failed.";
    }
}
