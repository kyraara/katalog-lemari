<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class SitemapController extends Controller
{
    public function index()
    {
        $products = Product::where('is_active', true)->get();
        // Base URLs
        $urls = [
            ['url' => url('/'), 'priority' => '1.0', 'changefreq' => 'daily'],
            ['url' => url('/katalog'), 'priority' => '0.9', 'changefreq' => 'daily'],
            ['url' => url('/tentang'), 'priority' => '0.5', 'changefreq' => 'monthly'],
            ['url' => url('/kontak'), 'priority' => '0.5', 'changefreq' => 'monthly'],
        ];

        // Add Product URLs
        foreach ($products as $product) {
            $urls[] = [
                'url' => url("/product/{$product->slug}"),
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $product->updated_at->toAtomString(),
            ];
        }

        return response()->view('sitemap', [
            'urls' => $urls
        ])->header('Content-Type', 'text/xml');
    }
}
