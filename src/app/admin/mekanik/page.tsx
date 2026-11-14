'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Plus, Wrench, Check, X, Shield, ToggleLeft, ToggleRight } from 'lucide-react';

interface MechanicRecord {
  id: string;
  fullName: string;
  email: string;
  specialization: string;
  assignedBays: string[];
  status: 'active' | 'inactive';
}

export default function AdminMechanicsPage() {
  const [mechanics, setMechanics] = useState<MechanicRecord[]>([
    {
      id: 'usr_mech_hendra',
      fullName: 'Hendra Wijaya',
      email: 'hendra@torsi.id',
      specialization: 'Lead Diagnostics & Powertrain',
      assignedBays: ['Bay 1', 'Bay 2'],
      status: 'active',
    },
    {
      id: 'usr_mech_agus',
      fullName: 'Agus Salim',
      email: 'agus@torsi.id',
      specialization: 'Chassis, Suspension & Wheel Alignment',
      assignedBays: ['Bay 3'],
      status: 'active',
    },
    {
      id: 'usr_mech_fauzi',
      fullName: 'Fauzi Rahmat',
      email: 'fauzi@torsi.id',
      specialization: 'Auto-Electrical & Air Conditioning',
      assignedBays: ['Bay 4'],
      status: 'active',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    specialization: '',
    assignedBays: 'Bay 1, Bay 2',
  });

  const handleToggleActive = (id: string) => {
    setMechanics(prev =>
      prev.map(m =>
        m.id === id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m
      )
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newM: MechanicRecord = {
      id: `usr_mech_${Date.now()}`,
      fullName: formData.fullName,
      email: formData.email,
      specialization: formData.specialization,
      assignedBays: formData.assignedBays.split(',').map(s => s.trim()),
      status: 'active',
    };
    setMechanics([...mechanics, newM]);
    setShowModal(false);
    setFormData({ fullName: '', email: '', specialization: '', assignedBays: 'Bay 1, Bay 2' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
              Manajemen Tim Mekanik Workshop
            </h1>
            <p className="text-xs text-[#777871] mt-0.5">
              Akun teknisi hanya dapat dibuat oleh superadmin. Pendaftaran publik dilarang menjadi mekanik.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-4 py-2.5 rounded transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <Plus size={15} />
            <span>Tambah Mekanik Baru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mechanics.map(m => (
            <div
              key={m.id}
              className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#242522] text-[#F5F4F0] flex items-center justify-center font-bold font-heading">
                      {m.fullName.slice(0, 1)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#242522]">{m.fullName}</h3>
                      <div className="text-[11px] text-[#777871]">{m.email}</div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      m.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E4E1D9] space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#777871] uppercase">Spesialisasi</span>
                    <div className="font-semibold text-[#242522] mt-0.5">{m.specialization}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#777871] uppercase">Alokasi Workbay</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {m.assignedBays.map((bay, i) => (
                        <span key={i} className="bg-[#ECEAE4] text-[#242522] px-2 py-0.5 rounded text-[10px]">
                          {bay}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleToggleActive(m.id)}
                  className={`w-full text-xs font-semibold py-2 rounded transition-colors ${
                    m.status === 'active'
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {m.status === 'active' ? 'Nonaktifkan Akun Teknisi' : 'Aktifkan Kembali'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Add Mechanic */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] border border-[#E4E1D9] rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4E1D9]">
                <h3 className="text-base font-bold text-[#242522] font-heading">
                  Buat Akun Mekanik Baru
                </h3>
                <button onClick={() => setShowModal(false)} className="text-[#777871]">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#242522] mb-1">Nama Lengkap Teknisi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Tri Wahyudi"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#242522] mb-1">Email Karyawan (@torsi.id)</label>
                  <input
                    type="email"
                    required
                    placeholder="tri@torsi.id"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#242522] mb-1">Spesialisasi Mekanikal</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Overhaul Transmisi Matik & Rem"
                    value={formData.specialization}
                    onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#242522] mb-1">Penugasan Bay (Pisahkan dengan koma)</label>
                  <input
                    type="text"
                    value={formData.assignedBays}
                    onChange={e => setFormData({ ...formData, assignedBays: e.target.value })}
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
                    Buat Akun Mekanik
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
