'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/services';
import { ProductItem } from '@/types';
import { Plus, Edit2, Trash2, Package, Check, X } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'engine_oil' as ProductItem['category'],
    description: '',
    price: 300000,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
  });

  const loadProducts = () => {
    api.products.getAll().then(setProducts);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'engine_oil',
      description: '',
      price: 300000,
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800',
      isAvailable: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      stock: p.stock,
      imageUrl: p.imageUrl,
      isAvailable: p.isAvailable,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus produk ini dari katalog store TORSI?')) return;
    await api.products.delete(id);
    loadProducts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ProductItem = {
      id: editingId || `prd_${Date.now()}`,
      ...formData,
    };
    await api.products.save(payload);
    setShowModal(false);
    loadProducts();
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
              Kontrol harga retail, batch stock, dan visibilitas suku cadang resmi workshop TORSI.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-4 py-2.5 rounded transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <Plus size={15} />
            <span>Tambah Produk Baru</span>
          </button>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E4E1D9] rounded overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F4F0] text-[#777871] uppercase text-[10px]">
              <tr>
                <th className="p-3">Nama Produk</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Stok Workshop</th>
                <th className="p-3">Harga Satuan</th>
                <th className="p-3">Ketersediaan</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E1D9]">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-[#F5F4F0]">
                  <td className="p-3">
                    <div className="font-bold text-[#242522]">{p.name}</div>
                    <div className="text-[11px] text-[#777871] line-clamp-1">{p.description}</div>
                  </td>
                  <td className="p-3 capitalize text-[#777871]">{p.category.replace('_', ' ')}</td>
                  <td className="p-3 font-semibold text-[#242522]">{p.stock} Unit</td>
                  <td className="p-3 font-bold font-heading text-[#242522]">
                    Rp {p.price.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.stock > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.stock > 0 ? 'Tersedia' : 'Habis'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-[#777871] hover:text-[#242522] hover:bg-[#ECEAE4] rounded"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Product */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] border border-[#E4E1D9] rounded-lg max-w-lg w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4E1D9]">
                <h3 className="text-base font-bold text-[#242522] font-heading">
                  {editingId ? 'Edit Suku Cadang' : 'Tambah Suku Cadang Baru'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-[#777871]">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#242522] mb-1">Nama Produk</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                    className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#242522] mb-1">URL Foto Produk</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                  />
                </div>

                <div className="pt-3 border-t border-[#E4E1D9] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-[#777871]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-[#D96B3A] hover:bg-[#BF582D] text-white font-semibold px-4 py-2 rounded"
                  >
                    Simpan Suku Cadang
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
