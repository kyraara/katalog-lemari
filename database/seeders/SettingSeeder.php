<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Setting::updateOrCreate(
            ['key' => 'credit_interest_rate'],
            ['value' => '0']
        );

        \App\Models\Setting::updateOrCreate(
            ['key' => 'credit_tenor_options'],
            ['value' => '3,6,12']
        );
    }
}
