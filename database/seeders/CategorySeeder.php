<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Lemari Pakaian', 'slug' => 'lemari-pakaian'],
            ['name' => 'Lemari TV', 'slug' => 'lemari-tv'],
            ['name' => 'Lemari Hias', 'slug' => 'lemari-hias'],
            ['name' => 'Lemari Anak', 'slug' => 'lemari-anak'],
        ];

        foreach ($categories as $category) {
            \App\Models\Category::create($category);
        }
    }
}
