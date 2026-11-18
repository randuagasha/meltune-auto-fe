'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/services';
import { ServiceItem } from '@/types';
import { Plus, Edit2, Trash2, Clock, Check, X } from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'maintenance' as ServiceItem['category'],
    description: '',
    price: 500000,
    estimatedDurationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  });

  const loadServices = () => {
    api.services.getAll().then(setServices);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'maintenance',
      description: '',
      price: 500000,
      estimatedDurationMinutes: 60,
      imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s: ServiceItem) => {
    setEditingId(s.id);
    setFormData({
      name: s.name,
      category: s.category,
      description: s.description,
      price: s.price,
      estimatedDurationMinutes: s.estimatedDurationMinutes,
      imageUrl: s.imageUrl || '',
      isActive: s.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus layanan dari katalog workshop?')) return;
    await api.services.delete(id);
    loadServices();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const servicePayload: ServiceItem = {
      id: editingId || `srv_${Date.now()}`,
      ...formData,
    };
    await api.services.save(servicePayload);
    setShowModal(false);
    loadServices();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
              Katalog Layanan & Tarif Servis
            </h1>
            <p className="text-xs text-[#777871] mt-0.5">
              Atur daftar paket pengerjaan, estimasi durasi, deskripsi prosedur, dan harga resmi workshop MELTUNE AUTO.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-4 py-2.5 rounded transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <Plus size={15} />
            <span>Tambah Layanan Baru</span>
          </button>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E4E1D9] rounded overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F4F0] text-[#777871] uppercase text-[10px]">
              <tr>
                <th className="p-3">Nama Layanan</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Durasi</th>
                <th className="p-3">Tarif Servis</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E1D9]">
              {services.map(s => (
                <tr key={s.id} className="hover:bg-[#F5F4F0]">
                  <td className="p-3">
                    <div className="font-bold text-[#242522]">{s.name}</div>
                    <div className="text-[11px] text-[#777871] line-clamp-1">{s.description}</div>
                  </td>
                  <td className="p-3 capitalize text-[#777871]">{s.category}</td>
                  <td className="p-3 text-[#242522]">{s.estimatedDurationMinutes} Menit</td>
                  <td className="p-3 font-bold font-heading text-[#242522]">
                    Rp {s.price.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Aktif
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 text-[#777871] hover:text-[#242522] hover:bg-[#ECEAE4] rounded"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
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

        {/* Modal Service Form */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] border border-[#E4E1D9] rounded-lg max-w-lg w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4E1D9]">
                <h3 className="text-base font-bold text-[#242522] font-heading">
                  {editingId ? 'Edit Paket Layanan' : 'Tambah Layanan Workshop Baru'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-[#777871]">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#242522] mb-1">Nama Layanan</label>
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
                      <option value="maintenance">Perawatan Berkala (Maintenance)</option>
                      <option value="diagnostics">Diagnostik & ECU</option>
                      <option value="repair">Rem & Perbaikan (Repair)</option>
                      <option value="detailing">AC & Sirkulasi (Detailing)</option>
                      <option value="performance">Performa Mesin (Performance)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#242522] mb-1">Durasi Pengerjaan (Menit)</label>
                    <input
                      type="number"
                      required
                      value={formData.estimatedDurationMinutes}
                      onChange={e => setFormData({ ...formData, estimatedDurationMinutes: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#242522] mb-1">Tarif Servis (Rp)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#242522] mb-1">Deskripsi Prosedur Pengerjaan</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#242522] mb-1">URL Foto Layanan</label>
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
                    Simpan Layanan
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
