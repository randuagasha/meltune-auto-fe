'use client';

import { useState, useEffect } from 'react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { api } from '@/services';
import { Vehicle } from '@/types';
import { Car, Plus, Trash2, Edit2, Check, X, Shield } from 'lucide-react';

export default function CustomerVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: 2022,
    licensePlate: '',
    transmission: 'automatic' as Vehicle['transmission'],
    fuelType: 'petrol' as Vehicle['fuelType'],
    notes: '',
  });

  const loadVehicles = () => {
    api.vehicles.getAll().then(setVehicles);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      transmission: 'automatic',
      fuelType: 'petrol',
      notes: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditingId(v.id);
    setFormData({
      brand: v.brand,
      model: v.model,
      year: v.year,
      licensePlate: v.licensePlate,
      transmission: v.transmission,
      fuelType: v.fuelType,
      notes: v.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data kendaraan ini?')) return;
    await api.vehicles.delete(id);
    loadVehicles();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await api.vehicles.update(editingId, formData);
    } else {
      await api.vehicles.create({
        userId: 'usr_mock_user',
        ...formData,
      });
    }
    setShowModal(false);
    loadVehicles();
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
              Kendaraan Terdaftar
            </h1>
            <p className="text-xs text-[#777871] mt-0.5">
              Daftarkan seluruh mobil Anda untuk mempermudah riwayat dan penjadwalan servis di workshop TORSI.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-4 py-2.5 rounded transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <Plus size={15} />
            <span>Tambah Mobil Baru</span>
          </button>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vehicles.map(v => (
            <div
              key={v.id}
              className="bg-[#FFFFFF] border border-[#E4E1D9] rounded p-6 flex flex-col justify-between space-y-4 hover:shadow-sm transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded bg-[#ECEAE4] text-[#D96B3A] flex items-center justify-center">
                      <Car size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#242522] font-heading">
                        {v.brand} {v.model}
                      </h3>
                      <div className="text-xs text-[#777871]">Tahun Produksi: {v.year}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(v)}
                      className="p-1.5 text-[#777871] hover:text-[#242522] hover:bg-[#ECEAE4] rounded"
                      title="Edit Kendaraan"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                      title="Hapus Kendaraan"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#E4E1D9] grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#777871] uppercase">Nomor Plat</span>
                    <div className="font-mono font-bold text-[#242522] mt-0.5">{v.licensePlate}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#777871] uppercase">Transmisi</span>
                    <div className="capitalize font-medium text-[#242522] mt-0.5">{v.transmission}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#777871] uppercase">Bahan Bakar</span>
                    <div className="capitalize font-medium text-[#242522] mt-0.5">{v.fuelType}</div>
                  </div>
                </div>

                {v.notes && (
                  <div className="mt-3 p-2.5 bg-[#F5F4F0] rounded text-xs text-[#777871]">
                    <span className="font-semibold text-[#242522]">Catatan Servis: </span>
                    {v.notes}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <a
                  href={`/pelanggan/booking?vehicle=${v.id}`}
                  className="w-full bg-[#242522] hover:bg-[#383a35] text-white text-xs font-semibold py-2 rounded text-center block transition-colors"
                >
                  Booking Servis untuk Mobil Ini
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Form Add/Edit */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] border border-[#E4E1D9] rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4E1D9]">
                <h3 className="text-base font-bold text-[#242522] font-heading">
                  {editingId ? 'Perbarui Data Kendaraan' : 'Tambah Mobil Baru'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#777871] hover:text-[#242522]"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#242522] mb-1">Merek</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Honda"
                      value={formData.brand}
                      onChange={e => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded focus:outline-none focus:border-[#D96B3A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#242522] mb-1">Model / Varian</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Civic Turbo"
                      value={formData.model}
                      onChange={e => setFormData({ ...formData, model: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded focus:outline-none focus:border-[#D96B3A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#242522] mb-1">Tahun Pembuatan</label>
                    <input
                      type="number"
                      required
                      min={1990}
                      max={2027}
                      value={formData.year}
                      onChange={e => setFormData({ ...formData, year: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded focus:outline-none focus:border-[#D96B3A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#242522] mb-1">Nomor Plat Polisi</label>
                    <input
                      type="text"
                      required
                      placeholder="B 1234 TRS"
                      value={formData.licensePlate}
                      onChange={e => setFormData({ ...formData, licensePlate: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-[#F5F4F0] border border-[#E4E1D9] rounded focus:outline-none focus:border-[#D96B3A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#242522] mb-1">Transmisi</label>
                    <select
                      value={formData.transmission}
                      onChange={e => setFormData({ ...formData, transmission: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded focus:outline-none focus:border-[#D96B3A]"
                    >
                      <option value="automatic">Automatic (AT)</option>
                      <option value="manual">Manual (MT)</option>
                      <option value="cvt">CVT Continuously Variable</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#242522] mb-1">Bahan Bakar</label>
                    <select
                      value={formData.fuelType}
                      onChange={e => setFormData({ ...formData, fuelType: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded focus:outline-none focus:border-[#D96B3A]"
                    >
                      <option value="petrol">Bensin (Petrol)</option>
                      <option value="diesel">Diesel</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="electric">Electric (EV)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#242522] mb-1">Catatan Khusus (Opsional)</label>
                  <textarea
                    rows={2}
                    placeholder="Spesifikasi oli preferensi, riwayat servis sebelumnya..."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded focus:outline-none focus:border-[#D96B3A]"
                  />
                </div>

                <div className="pt-3 border-t border-[#E4E1D9] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-medium text-[#777871] hover:text-[#242522]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-4 py-2 rounded transition-colors inline-flex items-center gap-1.5"
                  >
                    <Check size={14} />
                    <span>{editingId ? 'Simpan Perubahan' : 'Daftarkan Kendaraan'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
