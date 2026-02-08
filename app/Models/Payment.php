<?php

namespace App\Models;

use App\Models\Concerns\BelongsToHotel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory, BelongsToHotel;

    protected $fillable = [
        'hotel_id',
        'booking_id',
        'provider',
        'reference',
        'amount',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];


    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
}
