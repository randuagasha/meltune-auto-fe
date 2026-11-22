'use client';

import { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/services';
import { ProductItem } from '@/types';
import { Plus, Edit2, Trash2, Package, Check, X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { modalOverlayVariants, modalContentVariants, EASE_LUXURY } from '@/lib/motion';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'engine_oil' as ProductItem['category'],
    description: '',
    price: 300000,
    stock: 20,
    imageUrl: '',
    isAvailable: true,
  });

  const loadProducts = () => {
    api.products.getAll({ all: true }).then(setProducts).catch(() => {});
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setImageFile(null);
    setImagePreview('');
    setFormData({
      name: '',
      category: 'engine_oil',
      description: '',
      price: 300000,
      stock: 20,
      imageUrl: '',
      isAvailable: true,
    });
    setErrorMsg(null);
    setShowModal(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setEditingId(p.id);
    setImageFile(null);
    setImagePreview(p.imageUrl || '');
    setFormData({
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      stock: p.stock,
      imageUrl: p.imageUrl || '',
      isAvailable: p.isAvailable,
    });
    setErrorMsg(null);
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Ukuran file maksimal 5MB');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMsg('Format file harus JPG, PNG, atau WebP');
      return;
    }

    setErrorMsg(null);
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setImagePreview(b64);
      setFormData(prev => ({ ...prev, imageUrl: b64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus produk ini dari katalog store MELTUNE AUTO?')) return;
    try {
      await api.products.delete(id);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus produk');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      let finalImageUrl = formData.imageUrl;

      // If user uploaded a new image file, upload it to storage
      if (imageFile && imagePreview.startsWith('data:')) {
        try {
          const up = await api.products.uploadImage(imagePreview, imageFile.name);
          if (up?.url) {
            finalImageUrl = up.url;
          }
        } catch {
          // Fallback to data URI if storage upload encounters any network hiccup
          finalImageUrl = imagePreview;
        }
      }

      await api.products.save({
        id: editingId || undefined,
        ...formData,
        imageUrl: finalImageUrl,
      });

      setShowModal(false);
      loadProducts();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan suku cadang');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
              Inventaris Produk & Stok Suku Cadang
            </h1>
            <p className="text-xs text-[#777871] mt-0.5">
              Kontrol harga retail, batch stock, dan visibilitas suku cadang resmi workshop MELTUNE AUTO.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-4 py-2.5 rounded transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <Plus size={15} />
            <span>Tambah Suku Cadang Baru</span>
          </button>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E4E1D9] rounded overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F4F0] text-[#777871] uppercase text-[10px]">
              <tr>
                <th className="p-3">Suku Cadang</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Stok Workshop</th>
                <th className="p-3">Harga Satuan</th>
                <th className="p-3">Ketersediaan</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E1D9]">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[#777871]">
                    Belum ada data suku cadang terdaftar.
                  </td>
                </tr>
              ) : (
                products.map(p => (
                  <tr key={p.id} className="hover:bg-[#F5F4F0]">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded bg-[#ECEAE4] border border-[#E4E1D9] shrink-0 overflow-hidden flex items-center justify-center">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={18} className="text-[#777871]" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[#242522]">{p.name}</div>
                          <div className="text-[11px] text-[#777871] line-clamp-1">{p.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 capitalize text-[#777871]">{p.category.replace('_', ' ')}</td>
                    <td className="p-3 font-semibold text-[#242522]">{p.stock} Unit</td>
                    <td className="p-3 font-bold font-heading text-[#242522]">
                      Rp {p.price.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          p.isAvailable && p.stock > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {p.isAvailable && p.stock > 0 ? 'Tersedia' : 'Habis / Nonaktif'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          title="Edit Suku Cadang"
                          className="p-1.5 text-[#777871] hover:text-[#242522] hover:bg-[#ECEAE4] rounded"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          title="Hapus Suku Cadang"
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Product */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              variants={modalOverlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                variants={modalContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-[#FFFFFF] border border-[#E4E1D9] rounded-lg max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#E4E1D9]">
                  <h3 className="text-base font-bold text-[#242522] font-heading">
                    {editingId ? 'Edit Suku Cadang' : 'Tambah Suku Cadang Baru'}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-[#777871] hover:text-[#242522]">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#242522] mb-1">Nama Suku Cadang</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Motul 300V Power 5W-40 (2L)"
                      className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#242522] mb-1">Kategori</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                      >
                        <option value="engine_oil">Oli Mesin (Engine Oil)</option>
                        <option value="parts">Suku Cadang & Rem</option>
                        <option value="car_care">Car Care & Pembersih</option>
                        <option value="accessories">Aksesori & Perkakas</option>
                        <option value="maintenance">Perawatan Umum</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-[#242522] mb-1">Jumlah Stok</label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={formData.stock}
                        onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#242522] mb-1">Harga Jual (Rp)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={1000}
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#242522] mb-1">Deskripsi Spesifikasi</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Jelaskan spesifikasi, kompatibilitas, atau keunggulan suku cadang..."
                      className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                    />
                  </div>

                  {/* FILE UPLOAD FOR IMAGE */}
                  <div>
                    <label className="block font-semibold text-[#242522] mb-1">
                      Foto Suku Cadang (Upload File)
                    </label>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {imagePreview ? (
                      <div className="flex items-center gap-4 p-3 bg-[#F5F4F0] border border-[#E4E1D9] rounded">
                        <div className="w-20 h-20 rounded bg-white border border-[#E4E1D9] overflow-hidden shrink-0 flex items-center justify-center">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <div className="text-[11px] font-semibold text-[#242522]">
                            {imageFile ? imageFile.name : 'Foto tersimpan'}
                          </div>
                          <div className="text-[10px] text-[#777871]">
                            {imageFile ? `${(imageFile.size / 1024).toFixed(1)} KB` : 'Foto aktif'}
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-[#242522] hover:bg-[#383a35] text-white text-[10px] font-semibold px-2.5 py-1 rounded transition-colors"
                            >
                              Ganti Foto
                            </button>
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-semibold px-2.5 py-1 rounded transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#E4E1D9] hover:border-[#D96B3A] bg-[#F5F4F0] hover:bg-[#ECEAE4]/50 rounded-lg p-5 text-center cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-white border border-[#E4E1D9] flex items-center justify-center mx-auto text-[#D96B3A] mb-2 shadow-xs">
                          <Upload size={18} />
                        </div>
                        <div className="text-xs font-bold text-[#242522]">
                          Pilih foto dari komputer
                        </div>
                        <div className="text-[10px] text-[#777871] mt-0.5">
                          Mendukung format JPG, PNG, atau WebP (Maksimal 5MB)
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isAvailable"
                      checked={formData.isAvailable}
                      onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="rounded border-[#E4E1D9] text-[#D96B3A] focus:ring-[#D96B3A]"
                    />
                    <label htmlFor="isAvailable" className="text-xs text-[#242522] font-semibold cursor-pointer">
                      Tampilkan suku cadang ini di katalog publik
                    </label>
                  </div>

                  {errorMsg && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3 py-2 rounded">
                      {errorMsg}
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#E4E1D9] flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-[#777871] hover:text-[#242522]"
                    >
                      Batal
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={submitting}
                      className="bg-[#D96B3A] hover:bg-[#BF582D] text-white font-semibold px-4 py-2 rounded transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs"
                    >
                      {submitting && <Loader2 size={13} className="animate-spin" />}
                      <span>{submitting ? 'Menyimpan Suku Cadang...' : 'Simpan Suku Cadang'}</span>
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
