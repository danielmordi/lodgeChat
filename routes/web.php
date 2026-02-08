<?php

use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/checkout/{reference}', [PaymentController::class, 'checkout'])->name('payment.checkout');
Route::post('/checkout/{reference}', [PaymentController::class, 'verify'])->name('payment.verify');

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('analytics', function () {
        return Inertia::render('analytics');
    })->name('analytics');

    Route::get('bookings', function () {
        return Inertia::render('bookings');
    })->name('bookings');

    Route::get('conversations', function () {
        return Inertia::render('conversations');
    })->name('conversations');

    Route::get('guests', function () {
        return Inertia::render('guests');
    })->name('guests');

    Route::get('promotions', function () {
        return Inertia::render('promotions');
    })->name('promotions');

    Route::get('rooms', function () {
        return Inertia::render('rooms');
    })->name('rooms');

    Route::get('storefront', function () {
        return Inertia::render('storefront');
    })->name('storefront');

    Route::get('settings', function () {
        return Inertia::render('settings');
    })->name('settings');
});

require __DIR__ . '/settings.php';
