import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import ClientLayout from '@/Layouts/ClientLayout';
import { ChevronLeft, MessageCircle, Package, Ruler, Shield, Info, Check, Calculator } from 'lucide-react';

export default function Show({ product, settings }) {
    // Component State
    const [selectedVariantId, setSelectedVariantId] = useState(
        product.variants?.[0]?.id || null
    );
    const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'credit'
    
    const minDp = parseInt(product.dp_amount) || 0;
    const [customDp, setCustomDp] = useState(minDp);

    // Settings Parse
    const interestRate = parseFloat(settings?.credit_interest_rate || 0);
    const tenors = (settings?.credit_tenor_options || '3,6,12').split(',').map(t => parseInt(t.trim())).filter(t => !isNaN(t));

    const selectedVariant = useMemo(() => {
        return product.variants?.find(v => v.id === selectedVariantId) || product.variants?.[0];
    }, [selectedVariantId, product.variants]);

    const variantImages = selectedVariant?.images || [];
    const defaultImage = variantImages.find(img => img.is_primary)?.image_path || variantImages[0]?.image_path || null;
    const [selectedImage, setSelectedImage] = useState(defaultImage);

    // Initial DP setup if product changes (not usually needed here but good practice)
    useEffect(() => {
        if (customDp < minDp) {
            setCustomDp(minDp);
        }
    }, [minDp]);

    const handleVariantChange = (variantId) => {
        setSelectedVariantId(variantId);
        const variant = product.variants.find(v => v.id === variantId);
        if (variant) {
            const primary = variant.images?.find(img => img.is_primary)?.image_path || variant.images?.[0]?.image_path || null;
            setSelectedImage(primary);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    const calculateInstallment = (months) => {
        // Validation: DP cannot be bigger than product price, but we assume DP < Price for now.
        const principal = Math.max(0, product.price - customDp);
        // Formula: (Principal * (1 + (bunga/100 * tenor))) / tenor -> if bunga is per month
        // Or simply (Principal / tenor) + (Principal * bunga / 100) per month?
        // Let's use simple flat rate per month: Total = Principal + (Principal * (interestRate/100) * months)
        const totalInterest = principal * (interestRate / 100) * months;
        const totalPayable = principal + totalInterest;
        return totalPayable / months;
    };

    const generateWhatsAppLink = () => {
        const phone = "6282176032925";
        const colorText = selectedVariant ? ` (Warna: ${selectedVariant.color_name})` : '';
        
        let paymentInfo = `*Metode Bayar:* Kontan\n*Harga:* ${formatPrice(product.price)}`;
        if (paymentMethod === 'credit') {
            paymentInfo = `*Metode Bayar:* Kredit\n*Harga Produk:* ${formatPrice(product.price)}\n*Rencana DP:* ${formatPrice(customDp)}\n*(Mohon info estimasi cicilan lebih lanjut)*`;
        }

        const text = `Halo Admin, saya tertarik dengan produk ini:\n\n*Nama:* ${product.name}${colorText}\n${paymentInfo}\n\n*Link:* ${window.location.href}\n\nApakah stok masih tersedia?`;
        
        return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    };

    const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
    const variantStock = selectedVariant?.stock || 0;
    const isSoldOut = variantStock === 0;

    return (
        <ClientLayout>
            <Head>
                <title>{`${product.name} | Katalog Lemari`}</title>
                <meta name="description" content={product.description ? product.description.substring(0, 160) : `Beli ${product.name} berkualitas premium di Katalog Lemari.`} />
                <meta property="og:title" content={`${product.name} | Katalog Lemari`} />
                <meta property="og:description" content={product.description ? product.description.substring(0, 160) : `Beli ${product.name} berkualitas premium di Katalog Lemari.`} />
                {selectedImage && <meta property="og:image" content={`${window.location.origin}/storage/${selectedImage}`} />}
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="product" />
            </Head>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

                {/* Breadcrumbs */}
                <div className="mb-8">
                    <Link href="/katalog" className="inline-flex items-center text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                        <ChevronLeft size={16} className="mr-1" />
                        Kembali ke Katalog
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Left Column: Image Gallery */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        <div className="aspect-[4/3] sm:aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex items-center justify-center relative">
                            {selectedImage ? (
                                <img
                                    src={`/storage/${selectedImage}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover object-center transition-opacity duration-300"
                                />
                            ) : (
                                <Package size={64} className="text-zinc-400 dark:text-zinc-600 opacity-50" />
                            )}

                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {isSoldOut && (
                                    <span className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm text-rose-600 dark:text-rose-400 font-bold px-4 py-2 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700">
                                        Sold Out
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails for current variant */}
                        {variantImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {variantImages.map((image) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setSelectedImage(image.image_path)}
                                        className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === image.image_path ? 'border-zinc-900 dark:border-zinc-50' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img
                                            src={`/storage/${image.image_path}`}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Product Details */}
                    <div className="w-full lg:w-1/2 flex flex-col">

                        <div className="mb-2">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                                {product.category?.name || 'Uncategorized'}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">
                            {product.name}
                        </h1>

                        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
                            {formatPrice(product.price)}
                        </div>

                        {/* ==================== Method selector: Cash / Credit ==================== */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden mb-8 shadow-sm">
                            <div className="flex border-b border-zinc-200 dark:border-zinc-800">
                                <button
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${paymentMethod === 'cash' 
                                            ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900' 
                                            : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50'
                                    }`}
                                >
                                    Beli Kontan
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('credit')}
                                    className={`flex-1 py-3.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${paymentMethod === 'credit' 
                                            ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900' 
                                            : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50'
                                    }`}
                                >
                                    <Calculator size={16} /> Simulasi Cicilan
                                </button>
                            </div>

                            {/* Credit Simulation Content */}
                            {paymentMethod === 'credit' && (
                                <div className="p-5 md:p-6 bg-zinc-50 dark:bg-zinc-800/50">
                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                            Rencana DP (Minimum {formatPrice(minDp)})
                                        </label>
                                        <div className="flex gap-3">
                                            <input 
                                                type="number" 
                                                value={customDp} 
                                                onChange={e => setCustomDp(parseInt(e.target.value) || 0)}
                                                className="w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        </div>
                                        {customDp < minDp && (
                                            <p className="text-rose-500 text-xs mt-1.5 flex items-center"><Info size={12} className="mr-1"/> DP tidak boleh kurang dari minimal ({formatPrice(minDp)}).</p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Estimasi Cicilan per Bulan</h4>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {tenors.map(month => (
                                                <div key={month} className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-center shadow-sm">
                                                    <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold mb-1">{month} Bulan</div>
                                                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                        {formatPrice(calculateInstallment(month))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-3 italic text-center">
                                            *Nilai di atas hanyalah estimasi simulasi. Hasil final tergantung persetujuan leasing.{interestRate > 0 && ` (Estimasi Bunga: ${interestRate}% p.m)`}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ==================== Color Variant Selector ==================== */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 uppercase tracking-wider">
                                    Pilih Warna
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((variant) => {
                                        const isSelected = variant.id === selectedVariantId;
                                        return (
                                            <button
                                                key={variant.id}
                                                onClick={() => handleVariantChange(variant.id)}
                                                className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 ${isSelected
                                                        ? 'border-zinc-900 dark:border-zinc-50 bg-zinc-50 dark:bg-zinc-800 shadow-sm'
                                                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                                                    } ${variant.stock === 0 ? 'opacity-50' : ''}`}
                                            >
                                                <div
                                                    className="w-6 h-6 rounded-full border border-zinc-300 dark:border-zinc-600 flex-shrink-0 relative"
                                                    style={{ backgroundColor: variant.color_hex || '#ccc' }}
                                                >
                                                    {isSelected && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Check size={14} className={variant.color_hex && isLightColor(variant.color_hex) ? 'text-zinc-900' : 'text-white'} strokeWidth={3} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-left">
                                                    <div className={`text-sm font-medium ${isSelected ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                                        {variant.color_name}
                                                    </div>
                                                    <div className={`text-xs ${variant.stock === 0 ? 'text-rose-500 dark:text-rose-400' : 'text-zinc-400 dark:text-zinc-500'}`}>
                                                        {variant.stock === 0 ? 'Habis' : `Stok: ${variant.stock}`}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Stock Status */}
                        <div className="flex items-center gap-2 mb-8">
                            <div className={`w-3 h-3 rounded-full ${isSoldOut ? 'bg-rose-500' : (variantStock <= 3 ? 'bg-amber-500' : 'bg-emerald-500')}`}></div>
                            <span className={`text-sm font-medium ${isSoldOut ? 'text-rose-600 dark:text-rose-400' : (variantStock <= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400')}`}>
                                {isSoldOut ? 'Stok Habis' : `Tersisa ${variantStock} unit (${selectedVariant?.color_name})`}
                            </span>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                <div className="flex items-center text-zinc-500 dark:text-zinc-400 mb-2">
                                    <Ruler size={16} className="mr-2" />
                                    <span className="text-xs uppercase font-semibold tracking-wider">Dimensi</span>
                                </div>
                                <div className="text-zinc-900 dark:text-zinc-50 font-medium whitespace-pre-wrap">
                                    {product.dimensions || '-'}
                                </div>
                            </div>

                            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                <div className="flex items-center text-zinc-500 dark:text-zinc-400 mb-2">
                                    <Shield size={16} className="mr-2" />
                                    <span className="text-xs uppercase font-semibold tracking-wider">Material</span>
                                </div>
                                <div className="text-zinc-900 dark:text-zinc-50 font-medium">
                                    {product.material || '-'}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-10">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-3">Deskripsi Produk</h3>
                            <div className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line text-[15px]">
                                {product.description || 'Tidak ada deskripsi tersedia.'}
                            </div>
                        </div>

                        {/* CTA WhatsApp Button */}
                        <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-800">
                            <a
                                href={isSoldOut || (paymentMethod === 'credit' && customDp < minDp) ? '#' : generateWhatsAppLink()}
                                target={isSoldOut || (paymentMethod === 'credit' && customDp < minDp) ? "_self" : "_blank"}
                                rel="noopener noreferrer"
                                className={`w-full flex items-center justify-center p-4 rounded-xl font-bold text-lg transition-all ${isSoldOut || (paymentMethod === 'credit' && customDp < minDp)
                                        ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20 hover:-translate-y-1'
                                    }`}
                                onClick={(e) => { if (isSoldOut || (paymentMethod === 'credit' && customDp < minDp)) e.preventDefault(); }}
                            >
                                <MessageCircle size={24} className="mr-2" />
                                {isSoldOut ? 'Stok Habis' : (paymentMethod === 'credit' && customDp < minDp ? 'DP Kurang' : 'Tanya via WhatsApp')}
                            </a>
                            {!isSoldOut && (
                                <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-3 flex items-center justify-center">
                                    <Shield size={12} className="mr-1" />
                                    Transaksi aman, langsung dengan pemilik toko
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}

// Helper to detect if a hex color is light (for checkmark contrast)
function isLightColor(hex) {
    if (!hex) return false;
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6;
}
