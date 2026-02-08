#!/bin/bash
composer install --no-dev --optimize-autoloader
php artisan config:cache
npm install
npm run build
php artisan migrate --force
php artisan serve --host=0.0.0.0 --port=${PORT}