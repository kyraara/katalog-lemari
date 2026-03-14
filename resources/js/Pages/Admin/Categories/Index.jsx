import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';

export default function Index({ categories }) {
    const handleDelete = (id, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"?`)) {
            router.delete(route('admin.categories.destroy', id));
        }
    };

    return (
        <AdminLayout header="Manajemen Kategori">
            <Head title="Manajemen Kategori" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Total {categories.total} kategori</p>
                    <Link href={route('admin.categories.create')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm">
                        <Plus size={16} /> Tambah Kategori
                    </Link>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-200 dark:border-zinc-800">
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Nama</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Jumlah Produk</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {categories.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center">
                                        <FolderOpen size={40} className="mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
                                        <p className="text-zinc-500 dark:text-zinc-400">Belum ada kategori.</p>
                                    </td>
                                </tr>
                            ) : (
                                categories.data.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50">{cat.name}</td>
                                        <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{cat.slug}</td>
                                        <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{cat.products_count} produk</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={route('admin.categories.edit', cat.id)}
                                                    className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                                    <Edit size={16} />
                                                </Link>
                                                <button onClick={() => handleDelete(cat.id, cat.name)}
                                                    className="p-2 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
