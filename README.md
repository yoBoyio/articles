# Articles App

A simple full-stack application for managing articles with Laravel backend and React frontend.
This app lets you create, read, update, and delete articles.

## Tech Stack

- **Backend**: Laravel 12 (PHP 8.2)
- **Frontend**: React 19 with Vite
- **Database**: SQLite
- **Styling**: TailwindCSS


## Running the App

### Option 1: Run with Docker (Easiest)

1. Make sure Docker is installed on your computer
2. Run this command:
   ```bash
   docker-compose up --build
   ```
3. Open your browser:
   - Backend API: http://localhost:8000
   - Frontend App: http://localhost:3000

### Option 2: Run Separately (If you have PHP and Node.js installed)

#### Backend (Laravel)

1. Go to the backend folder:

   ```bash
   cd backend
   ```
2. Install dependencies:

   ```bash
   composer install
   ```
3. Setup environment:

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Create database and run migrations:

   ```bash
   touch database/database.sqlite
   php artisan migrate
   ```
5. Start the server:

   ```bash
   php artisan serve
   ```

   Backend will run on http://localhost:8000

#### Frontend (React)

1. Go to the frontend folder:

   ```bash
   cd frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the development server:

   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:3000
