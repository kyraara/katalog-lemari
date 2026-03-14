import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit, Trash2, Package, Eye } from 'lucide-react';

export default function Index({ products }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    const handleDelete = (id, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus "${name}"?`)) {
            router.delete(route('admin.products.destroy', id));
        }
    };

    return (
        <AdminLayout header="Manajemen Produk">
            <Head title="Manajemen Produk" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Total {products.total} produk
                    </p>
                    <Link
                        href={route('admin.products.create')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm"
                    >
                        <Plus size={16} />
                        Tambah Produk
                    </Link>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Produk</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Kategori</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Harga</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Stok</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {products.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <Package size={40} className="mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
                                            <p className="text-zinc-500 dark:text-zinc-400">Belum ada produk.</p>
                                            <Link href={route('admin.products.create')} className="text-sm font-medium text-zinc-900 dark:text-zinc-50 underline mt-2 inline-block">
                                                Tambah produk pertama
                                            </Link>
                                        </td>
                                    </tr>
                                ) : (
                                    products.data.map((product) => (
                                        <tr key={product.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                                                        {product.images && product.images.length > 0 ? (
                                                            <img
                                                                src={`/storage/${product.images[0].image_path}`}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Package size={16} className="text-zinc-400 dark:text-zinc-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-zinc-900 dark:text-zinc-50 text-sm">{product.name}</div>
                                                        <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs">{product.slug}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{product.category?.name || '-'}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">{formatPrice(product.price)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-medium ${product.stock === 0 ? 'text-rose-600 dark:text-rose-400' : product.stock <= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                    {product.stock === 0 ? 'Habis' : product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${product.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'}`}>
                                                    {product.status === 'active' ? 'Aktif' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/product/${product.slug}`}
                                                        target="_blank"
                                                        className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                                        title="Lihat di katalog"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>
                                                    <Link
                                                        href={route('admin.products.edit', product.id)}
                                                        className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                        className="p-2 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                                        title="Hapus"
                                                    >
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

                    {/* Pagination */}
                    {products.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-center gap-2">
                            {products.links.map((link, index) => {
                                const label = link.label.replace('&laquo;', '«').replace('&raquo;', '»');
                                if (link.label.includes('...')) return <span key={index} className="px-3 py-1.5 text-zinc-400">...</span>;
                                return link.url ? (
                                    <Link key={index} href={link.url} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${link.active ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                                        {label}
                                    </Link>
                                ) : (
                                    <span key={index} className="px-3 py-1.5 rounded-lg text-sm text-zinc-300 dark:text-zinc-600">{label}</span>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
