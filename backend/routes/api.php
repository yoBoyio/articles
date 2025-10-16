<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Article;
use App\Http\Controllers\AuthController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'data' => ['user' => $request->user()]
        ]);
    });
    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    Route::get('/profile', [AuthController::class, 'profile']);
});

Route::prefix('articles')->middleware('auth:sanctum')->group(function () {
    Route::get('/', function () {
        return response()->json([
            'success' => true,
            'data' => Article::with('user')->orderBy('created_at', 'desc')->get()
        ]);
    });
    
    Route::get('/{id}', function ($id) {
        $article = Article::with('user')->findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $article
        ]);
    });
    
    Route::post('/', function (Request $request) {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);
        
        $article = Article::create([
            'title' => $validatedData['title'],
            'content' => $validatedData['content'],
            'user_id' => $request->user()->id,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Article created successfully',
            'data' => $article->load('user')
        ], 201);
    });
    
    Route::put('/{id}', function (Request $request, $id) {
        $article = Article::findOrFail($id);
        
        if ($article->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only update your own articles',
            ], 403);
        }
        
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);
        
        $article->update($validatedData);
        
        return response()->json([
            'success' => true,
            'message' => 'Article updated successfully',
            'data' => $article->load('user')
        ]);
    });
    
    Route::delete('/{id}', function (Request $request, $id) {
        $article = Article::findOrFail($id);
        
        if ($article->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only delete your own articles',
            ], 403);
        }
        
        $article->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Article deleted successfully'
        ]);
    });
});