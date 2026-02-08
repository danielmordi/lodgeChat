<?php

namespace App\Models\Concerns;

use App\Models\Hotel;
use App\Models\Scopes\HotelScope;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

trait BelongsToHotel
{
    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::addGlobalScope(new HotelScope);

        static::creating(function ($model) {
            if (Auth::check() && !$model->hotel_id) {
                $model->hotel_id = Auth::user()->hotel_id;
            }
        });
    }

    /**
     * Get the hotel that the model belongs to.
     */
    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }
}
