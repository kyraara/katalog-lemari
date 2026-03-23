import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ClientLayout from '@/Layouts/ClientLayout';
import { Search, Filter, ShoppingBag } from 'lucide-react';

export default function Index({ products, categories, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/katalog', { search: searchTerm, category: selectedCategory }, { preserveState: true });
    };

    const handleCategoryChange = (slug) => {
        const newCategory = slug === selectedCategory ? '' : slug;
        setSelectedCategory(newCategory);
        router.get('/katalog', { search: searchTerm, category: newCategory }, { preserveState: true });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    // Get primary image from first variant
    const getProductImage = (product) => {
        if (!product.variants || product.variants.length === 0) return null;
        for (const variant of product.variants) {
            const primary = variant.images?.find(img => img.is_primary);
            if (primary) return primary.image_path;
        }
        return product.variants[0]?.images?.[0]?.image_path || null;
    };

    // Get total stock across all variants
    const getTotalStock = (product) => {
        if (!product.variants) return 0;
        return product.variants.reduce((sum, v) => sum + v.stock, 0);
    };

    return (
        <ClientLayout>
            <Head title="Katalog Lemari Premium" />

            {/* Simple Header instead of full Hero */}
            <div className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 pt-8 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                        Katalog Lengkap
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">Jelajahi seluruh koleksi lemari premium kami.</p>
                </div>
            </div>

            {/* Main Content */}
            <div id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sticky top-24">
                            <div className="flex items-center gap-2 mb-6 text-zinc-900 dark:text-zinc-50 font-semibold text-lg">
                                <Filter size={20} />
                                <h2>Filter Kategori</h2>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => handleCategoryChange('')}
                                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === '' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-medium' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                                >
                                    Semua Kategori
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryChange(category.slug)}
                                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === category.slug ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-medium' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-grow">
                        {products.data.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                                <ShoppingBag size={48} className="mx-auto text-zinc-300 dark:text-zinc-600 mb-4" />
                                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-2">Tidak ada produk ditemukan</h3>
                                <p className="text-zinc-500 dark:text-zinc-400">Coba ubah kata kunci pencarian atau filter kategori.</p>
                                {(searchTerm || selectedCategory) && (
                                    <button
                                        onClick={() => { setSearchTerm(''); setSelectedCategory(''); router.get('/katalog'); }}
                                        className="mt-6 px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                                    >
                                        Reset Filter
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.data.map((product) => {
                                        const totalStock = getTotalStock(product);
                                        const imagePath = getProductImage(product);

                                        return (
                                            <Link
                                                key={product.id}
                                                href={`/product/${product.slug}`}
                                                className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-zinc-900/50 transition-all duration-300 hover:-translate-y-1"
                                            >
                                                {/* Image */}
                                                <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
                                                    {imagePath ? (
                                                        <img
                                                            src={`/storage/${imagePath}`}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                                                            <ShoppingBag size={48} opacity={0.5} />
                                                        </div>
                                                    )}

                                                    {/* Stock badge */}
                                                    <div className="absolute top-4 right-4">
                                                        {totalStock === 0 ? (
                                                            <span className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm text-rose-600 dark:text-rose-400 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                                                Sold Out
                                                            </span>
                                                        ) : totalStock <= 3 ? (
                                                            <span className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm text-amber-600 dark:text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                                                Sisa {totalStock}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-5 flex flex-col flex-grow">
                                                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 font-medium tracking-wide border border-zinc-200 dark:border-zinc-700 w-fit px-2 py-0.5 rounded-md">
                                                        {product.category?.name || 'Uncategorized'}
                                                    </div>
                                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1 line-clamp-2">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-2 flex-grow">
                                                        {product.description}
                                                    </p>

                                                    {/* Color swatches */}
                                                    {product.variants && product.variants.length > 1 && (
                                                        <div className="flex items-center gap-1.5 mb-4">
                                                            {product.variants.map((v) => (
                                                                <div
                                                                    key={v.id}
                                                                    className="w-5 h-5 rounded-full border-2 border-zinc-200 dark:border-zinc-700"
                                                                    style={{ backgroundColor: v.color_hex || '#ccc' }}
                                                                    title={v.color_name}
                                                                />
                                                            ))}
                                                            <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-1">{product.variants.length} warna</span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-end justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                                        <div>
                                                            <span className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">Harga</span>
                                                            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                                                {formatPrice(product.price)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                {products.last_page > 1 && (
                                    <div className="mt-12 flex justify-center gap-2">
                                        {products.links.map((link, index) => {
                                            const isEllipsis = link.label.includes('...');
                                            const label = link.label.replace('&laquo;', '«').replace('&raquo;', '»');
                                            if (isEllipsis) return <span key={index} className="px-4 py-2 text-zinc-500 dark:text-zinc-400">...</span>;
                                            return link.url ? (
                                                <Link key={index} href={link.url}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${link.active ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900' : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}>
                                                    {label}
                                                </Link>
                                            ) : (
                                                <span key={index} className="px-4 py-2 rounded-lg font-medium text-zinc-400 dark:text-zinc-600 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-not-allowed">{label}</span>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}
