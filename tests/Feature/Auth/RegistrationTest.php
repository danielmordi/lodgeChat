<?php

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'hotel_name' => 'Test Hotel',
        'hotel_phone' => '1234567890',
        'hotel_address' => '123 Test St',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('verification.notice'));

    $this->assertDatabaseHas('hotels', [
        'name' => 'Test Hotel',
    ]);

    $user = \App\Models\User::where('email', 'test@example.com')->first();
    expect($user->hotel_id)->not->toBeNull()
        ->and($user->role)->toBe('owner');
});