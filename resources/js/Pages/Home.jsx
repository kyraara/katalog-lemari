import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ClientLayout from '@/Layouts/ClientLayout';
import { Search, ShoppingBag, ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';

export default function Home({ featured }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    const getProductImage = (product) => {
        if (!product.variants || product.variants.length === 0) return null;
        for (const variant of product.variants) {
            const primary = variant.images?.find(img => img.is_primary);
            if (primary) return primary.image_path;
        }
        return product.variants[0]?.images?.[0]?.image_path || null;
    };

    const getTotalStock = (product) => {
        if (!product.variants) return 0;
        return product.variants.reduce((sum, v) => sum + v.stock, 0);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/katalog', { search: formData.get('search') });
    };

    return (
        <ClientLayout>
            <Head>
                <title>Beranda | Katalog Lemari Premium</title>
                <meta name="description" content="Temukan koleksi lemari premium dengan desain minimalis modern dan material berkualitas untuk melengkapi keindahan rumah Anda." />
                <meta property="og:title" content="Beranda | Katalog Lemari Premium" />
                <meta property="og:description" content="Koleksi lemari premium dengan desain minimalis modern." />
                <meta property="og:image" content={`${window.location.origin}/images/hero.png`} />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="website" />
            </Head>
            {/* Hero Section */}
            <div className="bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
                {/* Light Mode Hero Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105 dark:hidden"
                    style={{ backgroundImage: "url('/images/hero.png')" }}
                ></div>
                {/* Dark Mode Hero Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105 hidden dark:block"
                    style={{ backgroundImage: "url('/images/hero_dark.png')" }}
                ></div>
                
                {/* Overlay gradient to soften the image slightly but retain its majestic look */}
                <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-[2px]"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-6 leading-tight">
                        Wujudkan Ruangan <br/> Lebih <span className="text-emerald-600 dark:text-emerald-400">Rapi & Elegan</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10">
                        Koleksi lemari premium dengan desain minimalis modern, material berkualitas, dan fungsionalitas tinggi untuk melengkapi keindahan rumah Anda.
                    </p>

                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative flex items-center mb-10">
                        <input
                            type="text"
                            name="search"
                            required
                            placeholder="Cari lemari impian Anda..."
                            className="w-full pl-12 pr-32 py-4 rounded-full border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 shadow-xl transition-all text-lg"
                        />
                        <div className="absolute left-5 text-zinc-400 dark:text-zinc-500">
                            <Search size={24} />
                        </div>
                        <button type="submit" className="absolute right-2 top-2 bottom-2 px-6 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-full font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors hidden sm:flex items-center gap-2">
                            Cari <ArrowRight size={18} />
                        </button>
                        <button type="submit" className="absolute right-2 p-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 sm:hidden">
                            <Search size={20} />
                        </button>
                    </form>

                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-medium">
                        <span className="flex items-center gap-2"><ShieldCheck size={20} className="text-emerald-500" /> Kualitas Premium</span>
                        <span className="flex items-center gap-2"><Truck size={20} className="text-emerald-500" /> Pengiriman Aman</span>
                        <span className="flex items-center gap-2"><Clock size={20} className="text-emerald-500" /> Respons Cepat</span>
                    </div>
                </div>
            </div>

            {/* Featured Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Koleksi Pilihan</h2>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">Produk terlaris dan paling banyak dicari</p>
                    </div>
                    <Link href="/katalog" className="hidden sm:flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                        Lihat Semua <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featured.map((product) => {
                        const totalStock = getTotalStock(product);
                        const imagePath = getProductImage(product);

                        return (
                            <Link
                                key={product.id}
                                href={`/product/${product.slug}`}
                                className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-zinc-900/50 transition-all duration-300 hover:-translate-y-2"
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
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 font-medium tracking-wide uppercase">
                                        {product.category?.name || 'Uncategorized'}
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {product.name}
                                    </h3>
                                    
                                    {/* Swatches */}
                                    {product.variants && product.variants.length > 1 && (
                                        <div className="flex items-center gap-1.5 mt-auto mb-4 pt-4">
                                            {product.variants.map((v) => (
                                                <div
                                                    key={v.id}
                                                    className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700"
                                                    style={{ backgroundColor: v.color_hex || '#ccc' }}
                                                    title={v.color_name}
                                                />
                                            ))}
                                            <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-1">{product.variants.length} warna</span>
                                        </div>
                                    )}

                                    <div className="flex items-end justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                        <div>
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
                
                <div className="mt-10 text-center sm:hidden">
                    <Link href="/katalog" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-bold rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                        Lihat Semua Katalog <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </ClientLayout>
    );
}
