<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Articles API Server',
        'version' => '1.0.0',
        'endpoints' => [
            'GET /api/articles' => 'Get all articles',
            'GET /api/articles/{id}' => 'Get specific article',
            'POST /api/articles' => 'Create new article',
            'PUT /api/articles/{id}' => 'Update article',
            'DELETE /api/articles/{id}' => 'Delete article',
        ],
        'documentation' => 'This is an API-only server. Use the endpoints above to interact with the articles data.'
    ]);
});
