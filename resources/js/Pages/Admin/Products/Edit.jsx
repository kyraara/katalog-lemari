import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ChevronLeft, Upload, X, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Edit({ product, categories }) {
    // Initialize variants from product data
    const initialVariants = (product.variants || []).map(v => ({
        id: v.id,
        color_name: v.color_name,
        color_hex: v.color_hex || '#000000',
        stock: v.stock,
        existing_images: v.images || [],
        images: [],
    }));

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        category_id: product.category_id || '',
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        dp_amount: product.dp_amount || '',
        dimensions: product.dimensions || '',
        material: product.material || '',
        status: product.status || 'active',
        variants: initialVariants,
        deleted_variants: [],
        deleted_images: [],
    });

    const [variantPreviews, setVariantPreviews] = useState(initialVariants.map(() => []));

    const addVariant = () => {
        setData('variants', [...data.variants, { color_name: '', color_hex: '#000000', stock: 0, existing_images: [], images: [] }]);
        setVariantPreviews(prev => [...prev, []]);
    };

    const removeVariant = (index) => {
        if (data.variants.length <= 1) return;
        const variant = data.variants[index];
        if (variant.id) {
            setData('deleted_variants', [...data.deleted_variants, variant.id]);
        }
        setData('variants', data.variants.filter((_, i) => i !== index));
        setVariantPreviews(variantPreviews.filter((_, i) => i !== index));
    };

    const updateVariant = (index, field, value) => {
        const updated = [...data.variants];
        updated[index] = { ...updated[index], [field]: value };
        setData('variants', updated);
    };

    const removeExistingImage = (vIndex, imageId) => {
        setData('deleted_images', [...data.deleted_images, imageId]);
        const updated = [...data.variants];
        updated[vIndex] = { ...updated[vIndex], existing_images: updated[vIndex].existing_images.filter(img => img.id !== imageId) };
        setData('variants', updated);
    };

    const handleVariantImages = (index, e) => {
        const files = Array.from(e.target.files);
        const updated = [...data.variants];
        updated[index] = { ...updated[index], images: [...(updated[index].images || []), ...files] };
        setData('variants', updated);

        const newPreviews = [...variantPreviews];
        newPreviews[index] = [...(newPreviews[index] || []), ...files.map(f => URL.createObjectURL(f))];
        setVariantPreviews(newPreviews);
    };

    const removeNewImage = (vIndex, imgIndex) => {
        const updated = [...data.variants];
        const imgs = [...updated[vIndex].images];
        imgs.splice(imgIndex, 1);
        updated[vIndex] = { ...updated[vIndex], images: imgs };
        setData('variants', updated);

        const prev = [...variantPreviews];
        URL.revokeObjectURL(prev[vIndex][imgIndex]);
        prev[vIndex] = prev[vIndex].filter((_, i) => i !== imgIndex);
        setVariantPreviews(prev);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.products.update', product.id), { forceFormData: true });
    };

    return (
        <AdminLayout header={`Edit: ${product.name}`}>
            <Head title={`Edit ${product.name}`} />
            <div className="max-w-4xl mx-auto">
                <Link href={route('admin.products.index')} className="inline-flex items-center text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors mb-6">
                    <ChevronLeft size={16} className="mr-1" /> Kembali
                </Link>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                    {/* Product Info */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Informasi Produk</h3>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Nama Lemari *</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-zinc-900 dark:focus:border-zinc-50" />
                            {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Kategori *</label>
                            <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className="w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-zinc-900 dark:focus:border-zinc-50">
                                <option value="">Pilih Kategori</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Deskripsi</label>
                            <textarea rows={4} value={data.description} onChange={e => setData('description', e.target.value)} className="w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-zinc-900 dark:focus:border-zinc-50" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Harga Kontan (Rp) *</label>
                                <input type="number" value={data.price} onChange={e => setData('price', e.target.value)} className="w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50" />
                                {errors.price && <p className="text-rose-500 text-xs mt-1">{errors.price}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Minimal DP (Rp)</label>
                                <input type="number" value={data.dp_amount} onChange={e => setData('dp_amount', e.target.value)} className="w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50" />
                                {errors.dp_amount && <p className="text-rose-500 text-xs mt-1">{errors.dp_amount}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Material</label>
                                <input type="text" value={data.material} onChange={e => setData('material', e.target.value)} className="w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Dimensi</label>
                                <input type="text" value={data.dimensions} onChange={e => setData('dimensions', e.target.value)} placeholder="P x L x T cm" className="w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Status</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50">
                                <option value="active">Aktif</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                    </div>

                    {/* Variants */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Varian Warna</h3>
                            <button type="button" onClick={addVariant} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                                <Plus size={14} /> Tambah Warna
                            </button>
                        </div>

                        {data.variants.map((variant, vIndex) => (
                            <div key={variant.id || `new-${vIndex}`} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full border-2 border-zinc-300 dark:border-zinc-600" style={{ backgroundColor: variant.color_hex || '#ccc' }} />
                                        <h4 className="font-medium text-zinc-900 dark:text-zinc-50">{variant.color_name || `Varian ${vIndex + 1}`}</h4>
                                    </div>
                                    {data.variants.length > 1 && (
                                        <button type="button" onClick={() => removeVariant(vIndex)} className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nama Warna *</label>
                                        <input type="text" value={variant.color_name} onChange={e => updateVariant(vIndex, 'color_name', e.target.value)} className="w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Kode Warna</label>
                                        <div className="flex gap-2">
                                            <input type="color" value={variant.color_hex || '#000000'} onChange={e => updateVariant(vIndex, 'color_hex', e.target.value)} className="w-12 h-[42px] rounded-lg border-zinc-300 dark:border-zinc-700 cursor-pointer" />
                                            <input type="text" value={variant.color_hex || ''} onChange={e => updateVariant(vIndex, 'color_hex', e.target.value)} className="flex-grow rounded-xl border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50 text-sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Stok *</label>
                                        <input type="number" value={variant.stock} onChange={e => updateVariant(vIndex, 'stock', parseInt(e.target.value) || 0)} className="w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50 text-sm" />
                                    </div>
                                </div>

                                {/* Images */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Foto Varian</label>
                                    <div className="flex flex-wrap gap-3">
                                        {/* Existing images */}
                                        {(variant.existing_images || []).map((img) => (
                                            <div key={img.id} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 group">
                                                <img src={`/storage/${img.image_path}`} alt="" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => removeExistingImage(vIndex, img.id)} className="absolute top-1 right-1 p-1 bg-rose-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                                            </div>
                                        ))}
                                        {/* New previews */}
                                        {(variantPreviews[vIndex] || []).map((src, imgIdx) => (
                                            <div key={`new-${imgIdx}`} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-emerald-300 dark:border-emerald-700 group">
                                                <img src={src} alt="" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => removeNewImage(vIndex, imgIdx)} className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                                                <span className="absolute bottom-0 inset-x-0 bg-emerald-700/80 text-white text-[10px] text-center py-0.5">Baru</span>
                                            </div>
                                        ))}
                                        <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl cursor-pointer hover:border-zinc-500 transition-colors text-zinc-400">
                                            <Upload size={18} /><span className="text-[10px] mt-1">Upload</span>
                                            <input type="file" multiple accept="image/*" onChange={e => handleVariantImages(vIndex, e)} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3">
                        <Link href={route('admin.products.index')} className="px-6 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">Batal</Link>
                        <button type="submit" disabled={processing} className="px-6 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Update Produk'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
