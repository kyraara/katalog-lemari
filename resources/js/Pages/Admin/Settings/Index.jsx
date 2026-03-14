import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ settings }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        credit_interest_rate: settings.credit_interest_rate || '0',
        credit_tenor_options: settings.credit_tenor_options || '3,6,12',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'));
    };

    return (
        <AdminLayout header="Pengaturan Global">
            <Head title="Pengaturan" />
            
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">Pengaturan Cicilan / Kredit</h2>
                    
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                                Bunga Cicilan per Bulan (%)
                            </label>
                            <input 
                                type="number" 
                                step="any"
                                value={data.credit_interest_rate} 
                                onChange={e => setData('credit_interest_rate', e.target.value)}
                                className="w-full sm:w-1/2 rounded-xl border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-zinc-900 dark:focus:border-zinc-50" 
                            />
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Isi 0 jika tanpa bunga (cicilan 0%). Contoh: 2.5</p>
                            {errors.credit_interest_rate && <div className="text-red-500 text-sm mt-1">{errors.credit_interest_rate}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                                Pilihan Tenor (Bulan)
                            </label>
                            <input 
                                type="text" 
                                value={data.credit_tenor_options} 
                                onChange={e => setData('credit_tenor_options', e.target.value)}
                                placeholder="3,6,12"
                                className="w-full sm:w-1/2 rounded-xl border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-zinc-900 dark:focus:border-zinc-50" 
                            />
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Pisahkan dengan koma. Contoh: 3,6,12,24</p>
                            {errors.credit_tenor_options && <div className="text-red-500 text-sm mt-1">{errors.credit_tenor_options}</div>}
                        </div>

                        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="px-6 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
