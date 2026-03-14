<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductVariant;
use App\Models\ProductImage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category', 'variants.images')->latest()->paginate(10);
        return Inertia::render('Admin/Products/Index', [
            'products' => $products
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'dp_amount' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|string|max:255',
            'material' => 'nullable|string|max:255',
            'status' => 'required|in:active,draft',
            'variants' => 'required|array|min:1',
            'variants.*.color_name' => 'required|string|max:255',
            'variants.*.color_hex' => 'nullable|string|max:7',
            'variants.*.stock' => 'required|integer|min:0',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();

        $product = Product::create([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'dp_amount' => $validated['dp_amount'] ?? 0,
            'dimensions' => $validated['dimensions'] ?? null,
            'material' => $validated['material'] ?? null,
            'status' => $validated['status'],
        ]);

        // Process variants
        foreach ($validated['variants'] as $i => $variantData) {
            $variant = $product->variants()->create([
                'color_name' => $variantData['color_name'],
                'color_hex' => $variantData['color_hex'] ?? null,
                'stock' => $variantData['stock'],
            ]);

            // Handle images for this variant
            $fileKey = "variants.{$i}.images";
            if ($request->hasFile($fileKey)) {
                foreach ($request->file($fileKey) as $j => $image) {
                    $path = $image->store('products', 'public');
                    $variant->images()->create([
                        'image_path' => $path,
                        'is_primary' => $j === 0 && $i === 0,
                    ]);
                }
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function show($id)
    {
        //
    }

    public function edit(Product $product)
    {
        $product->load('variants.images');
        $categories = Category::all();
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'dp_amount' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|string|max:255',
            'material' => 'nullable|string|max:255',
            'status' => 'required|in:active,draft',
            'variants' => 'required|array|min:1',
            'variants.*.id' => 'nullable|integer',
            'variants.*.color_name' => 'required|string|max:255',
            'variants.*.color_hex' => 'nullable|string|max:7',
            'variants.*.stock' => 'required|integer|min:0',
            'deleted_variants' => 'nullable|array',
            'deleted_images' => 'nullable|array',
        ]);

        if ($product->name !== $validated['name']) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
        }

        $product->update([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => $validated['slug'] ?? $product->slug,
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'dp_amount' => $validated['dp_amount'] ?? 0,
            'dimensions' => $validated['dimensions'] ?? null,
            'material' => $validated['material'] ?? null,
            'status' => $validated['status'],
        ]);

        // Delete removed variants
        if (!empty($validated['deleted_variants'])) {
            $variantsToDelete = ProductVariant::whereIn('id', $validated['deleted_variants'])->where('product_id', $product->id)->get();
            foreach ($variantsToDelete as $v) {
                foreach ($v->images as $img) {
                    if (Storage::disk('public')->exists($img->image_path)) {
                        Storage::disk('public')->delete($img->image_path);
                    }
                }
                $v->delete();
            }
        }

        // Delete individual images
        if (!empty($validated['deleted_images'])) {
            $imagesToDelete = ProductImage::whereIn('id', $validated['deleted_images'])->get();
            foreach ($imagesToDelete as $img) {
                if (Storage::disk('public')->exists($img->image_path)) {
                    Storage::disk('public')->delete($img->image_path);
                }
                $img->delete();
            }
        }

        // Update or create variants
        foreach ($validated['variants'] as $i => $variantData) {
            if (!empty($variantData['id'])) {
                // Update existing
                $variant = ProductVariant::find($variantData['id']);
                if ($variant && $variant->product_id === $product->id) {
                    $variant->update([
                        'color_name' => $variantData['color_name'],
                        'color_hex' => $variantData['color_hex'] ?? null,
                        'stock' => $variantData['stock'],
                    ]);
                }
            } else {
                // Create new
                $variant = $product->variants()->create([
                    'color_name' => $variantData['color_name'],
                    'color_hex' => $variantData['color_hex'] ?? null,
                    'stock' => $variantData['stock'],
                ]);
            }

            // Handle new images for this variant
            $fileKey = "variants.{$i}.images";
            if ($request->hasFile($fileKey)) {
                foreach ($request->file($fileKey) as $image) {
                    $path = $image->store('products', 'public');
                    $variant->images()->create([
                        'image_path' => $path,
                        'is_primary' => false,
                    ]);
                }
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        foreach ($product->variants as $variant) {
            foreach ($variant->images as $image) {
                if (Storage::disk('public')->exists($image->image_path)) {
                    Storage::disk('public')->delete($image->image_path);
                }
            }
        }
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }
}
