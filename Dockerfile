FROM php:8.3-cli

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./

RUN composer install --optimize-autoloader --no-dev --no-scripts --no-interaction

COPY . .

RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

EXPOSE 8080

CMD php artisan serve --host=0.0.0.0 --port=8080
```

Then add a `.dockerignore` file:
```
/node_modules
/public/hot
/public/storage
/storage/*.key
/vendor
.env
.phpunit.result.cache