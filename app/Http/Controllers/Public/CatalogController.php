<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('variants.images', 'category')->where('status', 'active');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        $products = $query->latest()->paginate(12)->withQueryString();
        $categories = Category::all();

        return Inertia::render('Catalog/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function show($slug)
    {
        $product = Product::with('variants.images', 'category')
            ->where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();

        $settings = \App\Models\Setting::pluck('value', 'key')->toArray();

        return Inertia::render('Catalog/Show', [
            'product' => $product,
            'settings' => $settings,
        ]);
    }
}
