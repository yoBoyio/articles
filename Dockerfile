FROM php:8.2-cli

#  system packages
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite3 \
    libsqlite3-dev \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

#  PHP extensions
RUN docker-php-ext-install pdo pdo_sqlite bcmath

#  Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /app
COPY . .

# Laravel dependencies
RUN cd backend && composer install

# React dependencies
RUN cd frontend && npm install

# Setup Laravel
RUN cd backend && \
    cp .env.example .env && \
    php artisan key:generate && \
    touch database/database.sqlite && \
    php artisan migrate --force

EXPOSE 8000 3000

# Start both services
CMD bash -c "cd backend && php artisan serve --host=0.0.0.0 --port=8000 & cd frontend && npm run dev -- --host 0.0.0.0 --port 3000"