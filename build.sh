#!/bin/bash
composer update
php artisan config:cache
npm install
npm run build
php artisan migrate --force
php artisan serve --host=0.0.0.0 --port=${PORT}