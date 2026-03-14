<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'category_id' => 1, // Lemari Pakaian
                'name' => 'Lemari Pakaian 3 Pintu Minimalis',
                'slug' => 'lemari-pakaian-3-pintu-minimalis',
                'description' => 'Lemari pakaian 3 pintu dengan cermin di bagian tengah. Dilengkapi laci dan gantungan baju luas. Cocok untuk kamar tidur utama.',
                'price' => 2500000,
                'dimensions' => '150 x 50 x 200 cm',
                'material' => 'Particle Board (Grade A)',
                'status' => 'active',
                'variants' => [
                    [
                        'color_name' => 'Putih',
                        'color_hex' => '#FFFFFF',
                        'stock' => 5,
                        'images' => ['products/wardrobe-white.png'],
                    ],
                    [
                        'color_name' => 'Coklat Kayu',
                        'color_hex' => '#8B4513',
                        'stock' => 3,
                        'images' => ['products/wardrobe-brown.png'],
                    ],
                    [
                        'color_name' => 'Hitam',
                        'color_hex' => '#1a1a1a',
                        'stock' => 2,
                        'images' => ['products/wardrobe-black.png'],
                    ],
                ],
            ],
            [
                'category_id' => 1, // Lemari Pakaian
                'name' => 'Lemari Pakaian 2 Pintu Sliding Minimalis',
                'slug' => 'lemari-pakaian-2-pintu-sliding-minimalis',
                'description' => 'Lemari pakaian 2 pintu sliding (geser) yang hemat tempat. Cocok untuk kamar minimalis.',
                'price' => 2100000,
                'dimensions' => '120 x 55 x 200 cm',
                'material' => 'MDF Premium',
                'status' => 'active',
                'variants' => [
                    [
                        'color_name' => 'Coklat Tua',
                        'color_hex' => '#5C4033',
                        'stock' => 2,
                        'images' => ['products/sliding-brown.png'],
                    ],
                    [
                        'color_name' => 'Abu-abu',
                        'color_hex' => '#808080',
                        'stock' => 4,
                        'images' => ['products/sliding-gray.png'],
                    ],
                ],
            ],
            [
                'category_id' => 2, // Lemari TV
                'name' => 'Meja TV Minimalis Modern',
                'slug' => 'meja-tv-minimalis-modern',
                'description' => 'Meja TV dengan rak penyimpanan terbuka dan tertutup. Muat untuk TV ukuran 32-55 inch.',
                'price' => 1200000,
                'dimensions' => '160 x 40 x 50 cm',
                'material' => 'Particle Board',
                'status' => 'active',
                'variants' => [
                    [
                        'color_name' => 'Putih Tulang',
                        'color_hex' => '#FAF0E6',
                        'stock' => 0, // Habis = Sold Out test
                        'images' => ['products/tv-white.png'],
                    ],
                    [
                        'color_name' => 'Walnut',
                        'color_hex' => '#773F1A',
                        'stock' => 3,
                        'images' => ['products/tv-walnut.png'],
                    ],
                ],
            ],
            [
                'category_id' => 3, // Lemari Hias
                'name' => 'Lemari Hias Kaca 2 Pintu',
                'slug' => 'lemari-hias-kaca-2-pintu',
                'description' => 'Lemari full kaca dengan rangka minimalis untuk memajang koleksi. Terdapat lampu LED opsional.',
                'price' => 3000000,
                'dimensions' => '90 x 40 x 180 cm',
                'material' => 'Besi Hollow & Kaca Tempered',
                'status' => 'active',
                'variants' => [
                    [
                        'color_name' => 'Hitam',
                        'color_hex' => '#1a1a1a',
                        'stock' => 1,
                        'images' => ['products/display-black.png'],
                    ],
                    [
                        'color_name' => 'Gold',
                        'color_hex' => '#D4AF37',
                        'stock' => 2,
                        'images' => ['products/display-gold.png'],
                    ],
                ],
            ]
        ];

        foreach ($products as $productData) {
            $variantsData = $productData['variants'];
            unset($productData['variants']);

            $product = \App\Models\Product::create($productData);

            foreach ($variantsData as $i => $variantData) {
                $imagesData = $variantData['images'];
                unset($variantData['images']);

                $variant = $product->variants()->create($variantData);

                foreach ($imagesData as $j => $imagePath) {
                    $variant->images()->create([
                        'image_path' => $imagePath,
                        'is_primary' => $j === 0 && $i === 0,
                    ]);
                }
            }
        }
    }
}
