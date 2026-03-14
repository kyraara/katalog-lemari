import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';

export default function ClientLayout({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Initialize dark mode from localStorage or system preference
    useEffect(() => {
        const checkDarkMode = () => {
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                return true;
            }
            return false;
        };

        const isDark = checkDarkMode();
        setIsDarkMode(isDark);

        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDarkMode(true);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex-shrink-0 flex items-center gap-3">
                                <img src="/images/logo.png" alt="Logo Katalog Lemari" className="h-10 w-10 object-cover rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800" />
                                <span className="font-bold text-xl tracking-tight hidden sm:block text-zinc-900 dark:text-white">
                                    Katalog Lemari
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden sm:flex sm:items-center sm:gap-6">
                            <Link href="/" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 font-medium transition-colors">
                                Beranda
                            </Link>
                            <Link href="/katalog" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 font-medium transition-colors">
                                Katalog
                            </Link>
                            <Link href="/tentang" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 font-medium transition-colors">
                                Tentang
                            </Link>
                            <Link href="/kontak" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 font-medium transition-colors">
                                Kontak
                            </Link>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-full text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
                                aria-label="Toggle Dark Mode"
                            >
                                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                        </div>

                        {/* Mobile Navigation Button */}
                        <div className="flex items-center sm:hidden gap-2">
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-full text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
                            >
                                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-md text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden absolute top-16 left-0 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-lg pb-3 pt-2 px-4 space-y-1 z-40">
                        <Link
                            href="/"
                            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Beranda
                        </Link>
                        <Link
                            href="/katalog"
                            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Katalog
                        </Link>
                        <Link
                            href="/tentang"
                            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Tentang
                        </Link>
                        <Link
                            href="/kontak"
                            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Kontak
                        </Link>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        &copy; {new Date().getFullYear()} Katalog Lemari. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
