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


# Architecture Decisions & Justifications

## Authentication & Security

### Laravel Sanctum for API Authentication

**Decision**: Used Laravel Sanctum instead of Passport or JWT

Laravel Sanctum was selected because it provides simple token-based authentication that's perfect for Single Page Applications. It includes built in CSRF protection and integrates seamlessly with Laravel. Unlike Passport, it doesn't require OAuth complexity, and unlike JWT, it handles token management automatically with proper database storage and revocation.

### Token Management

**Decision**: Store tokens in localStorage with automatic cleanup

Tokens are stored in localStorage to maintain user sessions across browser refreshes. The system automatically cleans up tokens when users log out or when authentication fails, ensuring security.

## Database Design

### SQLite Database

**Decision**: Used SQLite instead of MySQL or PostgreSQL

SQLite was chosen because it eliminates the need for an external database server, making development and deployment simpler. It's perfect for small to medium scale applications and provides sufficient performance for this use case. The single file database also simplifies containerization and backup processes.

### Data Integrity

**Decision**: Foreign key constraints with cascade deletion

I implemented foreign key constraints to ensure data consistency. When a user is deleted, their articles are automatically removed through cascade deletion, preventing unused data and maintaining database integrity.

## Frontend Architecture

### React Context for State Management

**Decision**: Used React Context instead of Redux

For this application's complexity level, React Context provides sufficient state management without the complexity of Redux. It's simpler to understand and maintain with no additional dependencies required. The authentication state and user data are easily managed through context providers.

### Service Layer

**Decision**: Centralized API service with Axios

All API calls are handled through a centralized service layer using Axios. It provides a single source for API interactions, ensures consistent error handling across the application, and makes it easy to modify endpoints or add new features.

## Testing Strategy

**Frontend**: Vitest + Testing Library

The frontend uses Vitest with Testing Library for component testing and user interaction simulation. This ensures application reliability and catches breaking changes early in development.

## Deployment & Containerization

### Single Container Approach

**Decision**: One Dockerfile running both services

I chose a single container approach to simplify development setup and reduce resource usage. This makes it easier deploy the application (locally), while still maintaining the separation between backend and frontend services.

## Security

### Input Validation

**Decision**: Server side validation for all inputs

All user inputs are validated on the server side to prevent malicious data and ensure data quality. It provides security regardless of client side validation and gives users clear error messages when validation fails.

### Authorization

**Decision**: User based access control

Users can only create, update, or delete their own articles. This authorization check is implemented on every protected endpoint, preventing unauthorized access and ensuring data security.

## API Design

### RESTful Endpoints

**Decision**: Standard REST API design

The API follows REST conventions.

### Consistent Response Format

**Decision**: Standardized JSON responses

All API responses follow a consistent format with success status, message, and data fields. This consistency makes frontend integration straightforward and provides clear feedback for both succes and errors.

## API Endpoints


| Method | Endpoint             | Description                             | Authentication Required |
| ------ | -------------------- | --------------------------------------- | ----------------------- |
| GET    | `/`                  | API information and available endpoints | No                      |
| POST   | `/api/register`      | User registration                       | No                      |
| POST   | `/api/login`         | User login                              | No                      |
| GET    | `/api/user`          | Get current user profile                | Yes                     |
| POST   | `/api/logout`        | User logout                             | Yes                     |
| GET    | `/api/articles`      | Get all articles                        | No                      |
| GET    | `/api/articles/{id}` | Get specific article                    | Yes                     |
| POST   | `/api/articles`      | Create new article                      | Yes                     |
| PUT    | `/api/articles/{id}` | Update article                          | Yes                     |
| DELETE | `/api/articles/{id}` | Delete article                          | Yes                     |

All protected endpoints require a Bearer token in the Authorization header.

## Backend Reusability

**Modular Structure**: Controllers, models, and services are organized in a way that makes them easy to extend and reuse across different features.

**Authentication Service**: Laravel Sanctum provides a complete authentication system that can be used by any client application.

## Protected Routes Implementation

The frontend implements a  protected route system using React Router and authentication context:

**ProtectedRoute Component**: A wrapper component that checks authentication status before rendering protected content. It handles loading states and redirects unauthenticated users to the login page.

**Authentication Context**: Centralized state management for user authentication, including token storage, user profile, and authentication status.

**Automatic Redirects**: Unauthenticated users are automatically redirected to the login page.

**Loading States**: Loading indicators during authentication checks to provide better user experience.

**Token Validation**: Automatic token validation on page refresh and API calls, with cleanup of invalid tokens.

## BEM Styling Methodology

The frontend uses BEM (Block Element Modifier) methodology combined with Tailwind CSS for maintainable and scalable styling:

**BEM Structure**: Each component follows BEM naming convention with blocks (components), elements (parts of components), and modifiers (variations).

**Example BEM Class Structure**:

```scss
.article-form {                    // Block
  &__container {                   // Element
    @apply max-w-4xl mx-auto;     // Tailwind class
  }
  
  &__field {                       // Element
    &-input {                      // Element of element
      &--error {                   // Modifier
        @apply border-red-300;     // Tailwind class
      }
    }
  }
}
```

- **Maintainability**: Clear naming convention makes styles easy to find and modify
- **Reusability**: Components can be easily reused with consistent styling
- **Performance**: Tailwind's utility classes provide optimized CSS output
- **Consistency**: BEM ensures consistent naming across all components

**Component Organization**: Each  component has its own SCSS file following BEM methodology.
