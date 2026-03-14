import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Package, FolderOpen, TrendingUp, Plus } from 'lucide-react';

export default function Dashboard({ stats }) {
    const statCards = [
        {
            label: 'Total Produk',
            value: stats.products,
            icon: Package,
            color: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
            href: route('admin.products.index'),
        },
        {
            label: 'Total Kategori',
            value: stats.categories,
            icon: FolderOpen,
            color: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
            href: route('admin.categories.index'),
        },
    ];

    return (
        <AdminLayout header="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statCards.map((card) => (
                        <Link
                            key={card.label}
                            href={card.href}
                            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${card.color}`}>
                                    <card.icon size={24} />
                                </div>
                                <TrendingUp size={16} className="text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors" />
                            </div>
                            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">{card.value}</div>
                            <div className="text-sm text-zinc-500 dark:text-zinc-400">{card.label}</div>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Aksi Cepat</h3>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={route('admin.products.create')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm"
                        >
                            <Plus size={16} />
                            Tambah Produk
                        </Link>
                        <Link
                            href={route('admin.categories.create')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-sm"
                        >
                            <Plus size={16} />
                            Tambah Kategori
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
