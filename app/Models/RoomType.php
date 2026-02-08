<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Concerns\BelongsToHotel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RoomType extends Model
{
    use HasFactory, BelongsToHotel;

    protected $fillable = [
        'hotel_id',
        'name',
        'price_per_night',
        'max_guests',
        'active',
    ];

    protected $casts = [
        'price_per_night' => 'decimal:2',
        'active' => 'boolean',
    ];


    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
