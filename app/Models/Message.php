<?php

namespace App\Models;

use App\Models\Concerns\BelongsToHotel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory, BelongsToHotel;

    protected $fillable = [
        'hotel_id',
        'conversation_id',
        'direction',
        'body',
        'provider_message_id',
    ];


    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }
}
