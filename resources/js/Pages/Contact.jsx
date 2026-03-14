import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ClientLayout from '@/Layouts/ClientLayout';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Contact() {
    return (
        <ClientLayout>
            <Head title="Kontak Kami | Katalog Lemari Premium" />

            {/* Header */}
            <div className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">
                        Hubungi Kami
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400">
                        Punya pertanyaan mengenai stok, custom ukuran, atau proses pengiriman? Tim kami siap membantu Anda.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                    
                    {/* Left: Contact Info */}
                    <div className="w-full lg:w-1/2 space-y-10">
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">Informasi Kontak</h2>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                                Jangan ragu untuk menghubungi kami melalui saluran di bawah ini. Untuk respons tercepat, silakan kirim pesan melalui WhatsApp.
                            </p>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">WhatsApp / Telepon</h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 mt-1">+62 821-7603-2925</p>
                                    <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-1 mb-2">(Format chat: Halo admin, saya ingin bertanya tentang lemari...)</p>
                                    <a
                                        href="https://wa.me/6282176032925?text=Halo%20admin,%20saya%20ingin%20bertanya%20mengenai%20katalog%20lemari"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                                    >
                                        Chat WhatsApp Sekarang &rarr;
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Email</h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 mt-1">halo@kataloglemari.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Alamat Workshop / Showroom</h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                                        Jl. Sudirman No 45, Komplek Furniture<br/>
                                        Jakarta Selatan, DKI Jakarta 12345<br/>
                                        Indonesia
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Jam Operasional</h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                                        Senin - Jumat: 09.00 - 17.00 WIB<br/>
                                        Sabtu: 10.00 - 15.00 WIB<br/>
                                        Minggu & Libur Nasional: Tutup
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Map Embed */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white dark:bg-zinc-900 p-2 sm:p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl h-full min-h-[400px]">
                            {/* Dummy Google Maps Embed fallback to static visualization since no real API key is needed for a simple iframe */}
                            <iframe 
                                title="Lokasi Toko"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%20Selatan%2C%20Kota%20Jakarta%20Selatan%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1683437505874!5m2!1sid!2sid" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0, borderRadius: '1.5rem' }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                </div>
            </div>
        </ClientLayout>
    );
}
