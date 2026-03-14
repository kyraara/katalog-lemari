import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ClientLayout from '@/Layouts/ClientLayout';
import { Store, Palette, ShieldCheck, Heart } from 'lucide-react';

export default function About() {
    return (
        <ClientLayout>
            <Head title="Tentang Kami | Katalog Lemari Premium" />

            {/* Header */}
            <div className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">
                        Tentang Kami
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400">
                        Cerita di balik dedikasi kami untuk ruang impian Anda.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="prose prose-zinc dark:prose-invert max-w-none text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                    <p className="mb-8 font-medium text-xl text-zinc-900 dark:text-zinc-50">
                        Kami adalah penyedia furnitur khusus lemari pakaian dan kabinet yang berfokus pada desain minimalis, modern, dan kualitas Premium. Kami percaya bahwa setiap rumah berhak memiliki furnitur yang tidak hanya berfungsi dengan baik, tetapi juga menambah nilai estetika ruang.
                    </p>
                    
                    <p className="mb-8">
                        Berawal dari passion kami terhadap interior yang rapi dan elegan, kami memulai bisnis ini untuk menyederhanakan cara Anda menemukan lemari berkualitas. Dengan mengkurasi material terbaik seperti kayu solid pilihan, MDF premium, dan besi hollow tahan karat, setiap produk kami dirancang untuk bertahan lama melewati berbagai tren waktu.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-16 not-prose">
                        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800">
                            <Palette size={40} className="text-emerald-500 mb-6" />
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">Desain Menawan</h3>
                            <p className="text-zinc-600 dark:text-zinc-400">Setiap lekukan dan sudut dirancang secara saksama untuk memberikan kesan modern, rapi, dan luas pada ruangan Anda.</p>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800">
                            <ShieldCheck size={40} className="text-emerald-500 mb-6" />
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">Tahan Lama</h3>
                            <p className="text-zinc-600 dark:text-zinc-400">Pemilihan material bukan sekadar janji. Kami menggunakan bahan baku grade A untuk memastikan keawetan puluhan tahun.</p>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800">
                            <Heart size={40} className="text-emerald-500 mb-6" />
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">Layanan Personal</h3>
                            <p className="text-zinc-600 dark:text-zinc-400">Pembelian langsung terhubung ke WhatsApp penjual, memastikan Anda mendapat pelayanan manusiawi, hangat, dan negosiasi yang jelas.</p>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800">
                            <Store size={40} className="text-emerald-500 mb-6" />
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">Produk Terkurasi</h3>
                            <p className="text-zinc-600 dark:text-zinc-400">Katalog kami memuat model-model yang telah lewat seleksi ketat fungsionalitas dan estetika. Anda tak lagi bingung memilih.</p>
                        </div>
                    </div>

                    <p>
                        Jelajahi setiap kategori dalam <Link href="/katalog" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">katalog kami</Link> dan temukan lemari yang paling merepresentasikan gaya personal rumah Anda. Karena untuk tempat berlindung Anda yang berharga, pantas mendapatkan tempat penyimpanan yang terbaik.
                    </p>
                </div>
            </div>
        </ClientLayout>
    );
}
