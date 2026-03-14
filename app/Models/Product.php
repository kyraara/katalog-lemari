<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id', 'name', 'slug', 'description',
        'price', 'dp_amount', 'dimensions', 'material', 'status'
    ];

    protected $appends = ['total_stock'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    // Accessor: total stock = sum of all variant stocks
    public function getTotalStockAttribute()
    {
        return $this->variants->sum('stock');
    }
}
