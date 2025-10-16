<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\QueryException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {
        // Handle API requests with JSON responses
        if ($request->expectsJson() || $request->is('api/*')) {
            return $this->handleApiException($request, $exception);
        }

        return parent::render($request, $exception);
    }

    /**
     * Handle API exceptions and return JSON responses
     */
    protected function handleApiException($request, Throwable $exception)
    {
        if ($exception instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $exception->errors(),
            ], 422);
        }

        if ($exception instanceof AuthenticationException) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
                'error' => 'Authentication required',
            ], 401);
        }

        if ($exception instanceof NotFoundHttpException) {
            return response()->json([
                'success' => false,
                'message' => 'Not found',
                'error' => 'The requested resource was not found',
            ], 404);
        }

        if ($exception instanceof MethodNotAllowedHttpException) {
            return response()->json([
                'success' => false,
                'message' => 'Method not allowed',
                'error' => 'The HTTP method is not allowed for this endpoint',
            ], 405);
        }

        if ($exception instanceof ThrottleRequestsException) {
            return response()->json([
                'success' => false,
                'message' => 'Too many requests',
                'error' => 'Rate limit exceeded. Please try again later.',
            ], 429);
        }

        if ($exception instanceof QueryException) {
            return response()->json([
                'success' => false,
                'message' => 'Database error',
                'error' => 'A database error occurred. Please try again.',
            ], 500);
        }

        // Handle other exceptions
        $statusCode = method_exists($exception, 'getStatusCode') ? $exception->getStatusCode() : 500;
        
        return response()->json([
            'success' => false,
            'message' => 'Internal server error',
            'error' => config('app.debug') ? $exception->getMessage() : 'An unexpected error occurred',
        ], $statusCode);
    }
}