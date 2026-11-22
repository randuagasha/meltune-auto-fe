'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/services';
import { Plus, X, UserCheck, UserX, AlertCircle } from 'lucide-react';

interface MechanicRecord {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  joinedAt?: string;
}

export default function AdminMechanicsPage() {
  const [mechanics, setMechanics] = useState<MechanicRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });

  const loadMechanics = () => {
    setLoading(true);
    api.admin.getMechanics()
      .then(data => {
        setMechanics(data || []);
      })
      .catch(err => {
        setErrorMsg(err.message || 'Gagal memuat data mekanik');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMechanics();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setErrorMsg(null);
    try {
      await api.admin.updateMechanic(id, { status: nextStatus });
      loadMechanics();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengubah status mekanik');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await api.admin.createMechanic({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });
      setShowModal(false);
      setFormData({ fullName: '', email: '', password: '', phone: '' });
      loadMechanics();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal membuat akun mekanik');
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
              Kelola Akun Teknisi Mekanik
            </h1>
            <p className="text-xs text-[#777871] mt-0.5">
              Pendaftaran akun mekanik workshop MELTUNE AUTO bersifat tertutup dan dikelola penuh oleh Superadmin.
            </p>
          </div>
          <button
            onClick={() => {
              setShowModal(true);
              setErrorMsg(null);
            }}
            className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-4 py-2.5 rounded transition-colors inline-flex items-center gap-2 shrink-0"
          >
            <Plus size={15} />
            <span>Tambah Mekanik Baru</span>
          </button>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Mechanics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading && mechanics.length === 0 ? (
            <div className="col-span-3 bg-[#FFFFFF] p-8 rounded border border-[#E4E1D9] text-center text-xs text-[#777871]">
              Memuat data mekanik dari Supabase...
            </div>
          ) : mechanics.length === 0 ? (
            <div className="col-span-3 bg-[#FFFFFF] p-8 rounded border border-[#E4E1D9] text-center text-xs text-[#777871]">
              Belum ada teknisi mekanik terdaftar. Klik tombol Tambah Mekanik Baru di atas.
            </div>
          ) : (
            mechanics.map(m => (
              <div
                key={m.id}
                className="bg-[#FFFFFF] border border-[#E4E1D9] rounded p-6 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-base">
                      {m.fullName.slice(0, 1)}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        m.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-100 text-[#777871]'
                      }`}
                    >
                      {m.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h3 className="font-bold text-sm text-[#242522] font-heading">{m.fullName}</h3>
                    <div className="text-xs text-[#777871]">{m.email}</div>
                    {m.phone && <div className="text-xs text-[#777871] mt-0.5">{m.phone}</div>}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E4E1D9] flex items-center justify-between text-[11px] text-[#777871]">
                  <span>Role: <strong className="text-[#242522]">Teknisi Workbay</strong></span>
                  <button
                    onClick={() => handleToggleStatus(m.id, m.status)}
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded transition-colors ${
                      m.status === 'active'
                        ? 'text-rose-600 hover:bg-rose-50 border border-rose-200'
                        : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                    }`}
                  >
                    {m.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Tambah Mekanik */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] border border-[#E4E1D9] rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4E1D9]">
                <h3 className="text-base font-bold text-[#242522] font-heading">
                  Pendaftaran Akun Mekanik Baru
                </h3>
                <button onClick={() => setShowModal(false)} className="text-[#777871]">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-3">
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
                  <label className="block font-semibold text-[#242522] mb-1">Email Resmi Karyawan</label>
                  <input
                    type="email"
                    required
                    placeholder="tri@meltune.id"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#242522] mb-1">Kata Sandi Awal</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="Minimal 8 karakter"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#242522] mb-1">Nomor Telepon / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+6281234567890"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-[#E4E1D9]">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-[#777871] hover:text-[#242522]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#D96B3A] hover:bg-[#BF582D] text-white font-semibold px-4 py-2 rounded transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Membuat Akun...' : 'Daftarkan Akun Mekanik'}
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
