import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, FolderOpen, LogOut, Menu, X, Moon, Sun, ChevronRight, Home, Settings } from 'lucide-react';

export default function AdminLayout({ children, header }) {
    const { auth } = usePage().props;
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
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

    const navItems = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: LayoutDashboard, active: route().current('admin.dashboard') },
        { name: 'Produk', href: route('admin.products.index'), icon: Package, active: route().current('admin.products.*') },
        { name: 'Kategori', href: route('admin.categories.index'), icon: FolderOpen, active: route().current('admin.categories.*') },
        { name: 'Pengaturan', href: route('admin.settings.index'), icon: Settings, active: route().current('admin.settings.*') },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex transition-colors duration-300">
            {/* Sidebar Overlay (Mobile) */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-zinc-200 dark:border-zinc-800">
                    <Link href={route('admin.dashboard')} className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="Logo Katalog Lemari" className="h-9 w-9 object-cover rounded-lg shadow-sm" />
                        <span className="font-bold text-lg text-zinc-900 dark:text-white">Admin Panel</span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-grow p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${item.active
                                    ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 shadow-sm'
                                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.name}
                            {item.active && <ChevronRight size={14} className="ml-auto" />}
                        </Link>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                    <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                        <Home size={18} />
                        Lihat Katalog
                    </Link>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                        <LogOut size={18} />
                        Keluar
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-grow flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                            <Menu size={24} />
                        </button>
                        {header && <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{header}</h2>}
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className="text-sm text-zinc-500 dark:text-zinc-400 hidden sm:block">
                            {auth?.user?.name}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-grow p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
