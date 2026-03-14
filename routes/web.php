<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\CatalogController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\SitemapController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/', function () {
    $featured = \App\Models\Product::with('variants.images', 'category')
        ->where('status', 'active')
        ->latest()->take(3)->get();
    return Inertia::render('Home', ['featured' => $featured]);
})->name('home');

Route::get('/katalog', [CatalogController::class, 'index'])->name('catalog.index');
Route::get('/product/{slug}', [CatalogController::class, 'show'])->name('catalog.show');

Route::get('/tentang', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/kontak', function () {
    return Inertia::render('Contact');
})->name('contact');

// Breeze compatibility: redirect 'dashboard' to admin dashboard
Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->middleware('auth')->name('dashboard');

// Admin Routes
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        $productCount = \App\Models\Product::count();
        $categoryCount = \App\Models\Category::count();
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'products' => $productCount,
                'categories' => $categoryCount
            ]
        ]);
    })->name('dashboard');

    Route::resource('categories', CategoryController::class);
    Route::resource('products', ProductController::class);
    Route::get('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'index'])->name('settings.index');
    Route::put('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');
});

// Auth & Profile
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
