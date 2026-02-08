<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$user = User::first();
if (!$user) {
    echo "No user found in database. Please register first.\n";
    exit(1);
}

Auth::login($user);

try {
    $request = Illuminate\Http\Request::create('/dashboard', 'GET');
    $response = $kernel->handle($request);
    echo "Status: " . $response->getStatusCode() . "\n";
    if ($response->getStatusCode() == 500) {
        echo "Error detected!\n";
    }
} catch (\Throwable $e) {
    echo "Caught Exception: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
