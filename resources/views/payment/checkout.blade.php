<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout</title>
</head>

<body>
    <h1>Checkout</h1>
    <p>Booking Reference: {{ $payment->booking_id }}</p>
    <p>Amount: ${{ number_format($payment->amount, 2) }}</p>

    <form action="{{ route('payment.verify', $payment->reference) }}" method="POST">
        @csrf
        <button type="submit">Pay Now (Mock)</button>
    </form>
</body>

</html>