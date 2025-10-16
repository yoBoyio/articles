<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Article;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Articles API Routes
Route::prefix('articles')->group(function () {
    // GET /api/articles - Get all articles
    Route::get('/', function () {
        return Article::orderBy('created_at', 'desc')->get();
    });
    
    // GET /api/articles/{id} - Get specific article
    Route::get('/{id}', function ($id) {
        $article = Article::find($id);
        if (!$article) {
            return response()->json(['error' => 'Article not found'], 404);
        }
        return $article;
    });
    
    // POST /api/articles - Create new article
    Route::post('/', function (Request $request) {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);
        
        $article = Article::create([
            'title' => $request->title,
            'content' => $request->content,
            'created_at' => now(),
        ]);
        
        return response()->json($article, 201);
    });
    
    // PUT /api/articles/{id} - Update article
    Route::put('/{id}', function (Request $request, $id) {
        $article = Article::find($id);
        if (!$article) {
            return response()->json(['error' => 'Article not found'], 404);
        }
        
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);
        
        $article->update([
            'title' => $request->title,
            'content' => $request->content,
        ]);
        
        return response()->json($article);
    });
    
    // DELETE /api/articles/{id} - Delete article
    Route::delete('/{id}', function ($id) {
        $article = Article::find($id);
        if (!$article) {
            return response()->json(['error' => 'Article not found'], 404);
        }
        
        $article->delete();
        return response()->json(['message' => 'Article deleted successfully']);
    });
});
