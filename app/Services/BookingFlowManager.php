<?php

namespace App\Services;

use App\Interfaces\PaymentServiceInterface;
use App\Models\Conversation;
use App\Models\RoomType;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class BookingFlowManager
{
    protected $paymentService;

    public function __construct(PaymentServiceInterface $paymentService)
    {
        $this->paymentService = $paymentService;
    }
    /**
     * Process message based on conversation state.
     */
    public function processMessage(Conversation $conversation, string $message): ?string
    {
        $state = $conversation->current_state;
        $message = trim($message);

        // Global commands
        if (strtolower($message) === 'hi' || strtolower($message) === 'menu') {
            return $this->resetConversation($conversation);
        }

        switch ($state) {
            case 'GREETING':
                return $this->handleGreeting($conversation);
            case 'DATE_SELECTION':
                return $this->handleDateSelection($conversation, $message);
            case 'DURATION_SELECTION':
                return $this->handleDurationSelection($conversation, $message);
            case 'ROOM_SELECTION':
                return $this->handleRoomSelection($conversation, $message);
            case 'CONFIRMATION':
                return $this->handleConfirmation($conversation, $message);
            case 'PAYMENT_PENDING':
                return "Your booking is pending payment. Please proceed with the payment link provided.";
            default:
                return "I'm sorry, I didn't understand that. Type 'hi' to start over.";
        }
    }

    protected function resetConversation(Conversation $conversation): string
    {
        $conversation->update([
            'current_state' => 'GREETING',
            'metadata' => []
        ]);
        return $this->handleGreeting($conversation);
    }

    protected function handleGreeting(Conversation $conversation): string
    {
        $conversation->update(['current_state' => 'DATE_SELECTION']);
        return "Welcome to " . $conversation->hotel->name . "! \nWhen would you like to check in? (YYYY-MM-DD)";
    }

    protected function handleDateSelection(Conversation $conversation, string $message): string
    {
        // Basic validation for YYYY-MM-DD
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $message)) {
            return "Please use the format YYYY-MM-DD (e.g., 2024-12-25).";
        }

        try {
            $date = Carbon::parse($message);
            if ($date->isPast()) {
                return "Please select a future date.";
            }

            $conversation->update([
                'current_state' => 'DURATION_SELECTION',
                'metadata' => array_merge($conversation->metadata ?? [], ['check_in' => $message])
            ]);

            return "Got it, " . $date->format('F j, Y') . ". \nHow many nights will you be staying?";

        } catch (\Exception $e) {
            return "Invalid date format. Please try again (YYYY-MM-DD).";
        }
    }

    protected function handleDurationSelection(Conversation $conversation, string $message): string
    {
        if (!is_numeric($message) || $message < 1) {
            return "Please enter a valid number of nights (e.g., 2).";
        }

        $nights = (int) $message;
        $conversation->update([
            'current_state' => 'ROOM_SELECTION',
            'metadata' => array_merge($conversation->metadata ?? [], ['nights' => $nights])
        ]);

        // Fetch available rooms
        // In a real app, we'd check availability against bookings. 
        // For MVP, just list active room types.
        $roomTypes = RoomType::where('hotel_id', $conversation->hotel_id)
            ->where('active', true)
            ->get();

        if ($roomTypes->isEmpty()) {
            return "Sorry, we have no available rooms at the moment.";
        }

        $response = "Available rooms:\n";
        foreach ($roomTypes as $index => $room) {
            // Store mapping of index -> room_id in metadata for selection
            $options[$index + 1] = $room->id;
            $response .= ($index + 1) . ". " . $room->name . " - $" . number_format($room->price_per_night, 2) . "/night\n";
        }
        $response .= "\nReply with the number of your choice.";

        $conversation->update([
            'metadata' => array_merge($conversation->metadata ?? [], ['room_options' => $options])
        ]);

        return $response;
    }

    protected function handleRoomSelection(Conversation $conversation, string $message): string
    {
        $selection = (int) $message;
        $options = $conversation->metadata['room_options'] ?? [];

        if (!isset($options[$selection])) {
            return "Invalid selection. Please reply with the number of the room type.";
        }

        $roomTypeId = $options[$selection];
        $roomType = RoomType::find($roomTypeId);

        $checkIn = $conversation->metadata['check_in'];
        $nights = $conversation->metadata['nights'];
        $totalPrice = $roomType->price_per_night * $nights;

        $conversation->update([
            'current_state' => 'CONFIRMATION',
            'metadata' => array_merge($conversation->metadata ?? [], [
                'room_type_id' => $roomTypeId,
                'total_price' => $totalPrice
            ])
        ]);

        return "Booking Summary:\n" .
            "Room: " . $roomType->name . "\n" .
            "Check-in: " . $checkIn . "\n" .
            "Nights: " . $nights . "\n" .
            "Total: $" . number_format($totalPrice, 2) . "\n\n" .
            "Reply 'yes' to confirm or 'hi' to start over.";
    }

    protected function handleConfirmation(Conversation $conversation, string $message): string
    {
        if (strtolower($message) !== 'yes') {
            return "Please reply 'yes' to confirm your booking, or type 'hi' to restart.";
        }

        // Create Booking
        $data = $conversation->metadata;

        $booking = Booking::create([
            'hotel_id' => $conversation->hotel_id,
            'guest_id' => $conversation->guest_id,
            'room_type_id' => $data['room_type_id'],
            'check_in' => $data['check_in'],
            'nights' => $data['nights'],
            'amount' => $data['total_price'],
            'status' => 'pending', // Default status
        ]);

        // Generate Payment Link
        $paymentLink = $this->paymentService->generatePaymentLink($booking);

        $conversation->update([
            'current_state' => 'PAYMENT_PENDING'
        ]);

        return "Booking confirmed! Your reference is #" . $booking->id . ".\n" .
            "Please make a payment of $" . number_format($data['total_price'], 2) . " to secure your reservation.\n" .
            "Pay here: " . $paymentLink;
    }
}
