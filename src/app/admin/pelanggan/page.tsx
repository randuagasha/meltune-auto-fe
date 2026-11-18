'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/services';
import { Search, UserX, UserCheck, Trash2, Mail, Phone, Calendar, AlertCircle } from 'lucide-react';

interface CustomerRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  totalVehicles: number;
  totalBookings: number;
  loyaltyPoints: number;
  status: 'active' | 'suspended';
  registeredAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadCustomers = () => {
    setLoading(true);
    api.admin.getCustomers()
      .then(data => {
        setCustomers(data || []);
      })
      .catch(err => {
        setErrorMsg(err.message || 'Gagal memuat daftar pelanggan');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.admin.updateCustomerStatus(id, nextStatus as 'active' | 'suspended');
      loadCustomers();
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus akun pelanggan ini secara permanen dari Supabase Auth dan database?')) return;
    try {
      await api.admin.deleteCustomer(id);
      loadCustomers();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus akun');
    }
  };

  const filtered = customers.filter(c => {
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchSearch =
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
            Manajemen Akun Pelanggan
          </h1>
          <p className="text-xs text-[#777871] mt-0.5">
            Daftar pelanggan terdaftar dari Supabase Profiles, status aktif/tangguh, dan riwayat loyalitas.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-[#FFFFFF] p-4 rounded border border-[#E4E1D9] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777871]" />
            <input
              type="text"
              placeholder="Cari nama, email, atau telepon..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-xs text-[#242522] placeholder:text-[#777871] focus:outline-none focus:border-[#D96B3A]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-[#777871]">Filter Status:</span>
            {(['all', 'active', 'suspended'] as const).map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded text-xs font-semibold capitalize transition-colors ${
                  filterStatus === st
                    ? 'bg-[#242522] text-white'
                    : 'bg-[#ECEAE4] text-[#242522] hover:bg-[#E4E1D9]'
                }`}
              >
                {st === 'all' ? 'Semua' : st === 'active' ? 'Aktif' : 'Ditangguhkan'}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-[#FFFFFF] border border-[#E4E1D9] rounded overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F4F0] text-[#777871] uppercase text-[10px]">
              <tr>
                <th className="p-3">Pelanggan</th>
                <th className="p-3">Kontak</th>
                <th className="p-3 text-center">Kendaraan</th>
                <th className="p-3 text-center">Booking</th>
                <th className="p-3 text-right">Poin Loyalitas</th>
                <th className="p-3 text-center">Status Akun</th>
                <th className="p-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E1D9]">
              {loading && customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-[#777871]">
                    Memuat data pelanggan dari Supabase...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-[#777871]">
                    Tidak ada pelanggan yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="hover:bg-[#F5F4F0] transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-[#242522]">{c.fullName}</div>
                      <div className="text-[10px] text-[#777871] flex items-center gap-1 mt-0.5">
                        <Calendar size={11} />
                        <span>Terdaftar: {new Date(c.registeredAt).toLocaleDateString('id-ID')}</span>
                      </div>
                    </td>
                    <td className="p-3 space-y-0.5">
                      <div className="text-[#242522] flex items-center gap-1.5">
                        <Mail size={12} className="text-[#777871]" />
                        <span>{c.email || '-'}</span>
                      </div>
                      <div className="text-[#777871] flex items-center gap-1.5">
                        <Phone size={12} className="text-[#777871]" />
                        <span>{c.phone || '-'}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold text-[#242522]">
                      {c.totalVehicles} Mobil
                    </td>
                    <td className="p-3 text-center font-bold text-[#242522]">
                      {c.totalBookings} Servis
                    </td>
                    <td className="p-3 text-right font-bold text-[#D96B3A] font-heading">
                      {c.loyaltyPoints} Poin
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                          c.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {c.status === 'active' ? 'Aktif' : 'Ditangguhkan'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(c.id, c.status)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors inline-flex items-center gap-1 ${
                          c.status === 'active'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                        title={c.status === 'active' ? 'Tangguhkan Akun' : 'Aktifkan Akun'}
                      >
                        {c.status === 'active' ? <UserX size={12} /> : <UserCheck size={12} />}
                        <span>{c.status === 'active' ? 'Suspend' : 'Aktifkan'}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="px-2 py-1 text-rose-600 hover:bg-rose-50 rounded text-[11px] font-semibold transition-colors"
                        title="Hapus Akun Permanen"
                      >
                        <Trash2 size={13} />
                      </button>
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
