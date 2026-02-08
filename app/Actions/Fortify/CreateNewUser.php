<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        return \DB::transaction(function () use ($input) {
            $twilioAccount = \App\Models\TwilioAccount::create([
                'name' => $input['hotel_name'] . ' Account',
                'account_sid' => 'AC' . \Str::random(32), // Placeholder SID
                'auth_token' => \Str::random(32), // Placeholder Token
                'status' => 'active',
            ]);

            $hotel = \App\Models\Hotel::create([
                'name' => $input['hotel_name'],
                'slug' => \Str::slug($input['hotel_name']),
                'phone' => $input['hotel_phone'],
                'address' => $input['hotel_address'],
                'status' => 'pending',
                'trust_level' => 0,
                'twilio_account_id' => $twilioAccount->id,
            ]);

            return User::create([
                'hotel_id' => $hotel->id,
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
                'role' => 'owner',
            ]);
        });
    }
}
