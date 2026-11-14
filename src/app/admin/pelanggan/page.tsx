'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Search, UserX, UserCheck, Trash2, Mail, Phone, Calendar } from 'lucide-react';

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
  const [customers, setCustomers] = useState<CustomerRecord[]>([
    {
      id: 'usr_mock_user',
      fullName: 'Budi Santoso',
      email: 'budi@torsi.id',
      phone: '+6281234567890',
      totalVehicles: 2,
      totalBookings: 2,
      loyaltyPoints: 420,
      status: 'active',
      registeredAt: '2026-09-15',
    },
    {
      id: 'usr_cust_danang',
      fullName: 'Danang Prasetyo',
      email: 'danang@example.com',
      phone: '+6281399887766',
      totalVehicles: 1,
      totalBookings: 1,
      loyaltyPoints: 120,
      status: 'active',
      registeredAt: '2026-10-02',
    },
    {
      id: 'usr_cust_reza',
      fullName: 'Reza Pratama',
      email: 'reza@example.com',
      phone: '+6281755443322',
      totalVehicles: 1,
      totalBookings: 0,
      loyaltyPoints: 30,
      status: 'suspended',
      registeredAt: '2026-10-20',
    },
  ]);

  const [search, setSearch] = useState('');

  const toggleStatus = (id: string) => {
    setCustomers(prev =>
      prev.map(c =>
        c.id === id ? { ...c, status: c.status === 'active' ? 'suspended' : 'active' } : c
      )
    );
  };

  const deleteCustomer = (id: string) => {
    if (!confirm('Hapus akun pelanggan ini? Data kendaraan dan riwayat akan diarsipkan.')) return;
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const filtered = customers.filter(c =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
            Manajemen Akun Pelanggan
          </h1>
          <p className="text-xs text-[#777871] mt-0.5">
            Daftar pengguna dengan role Customer, monitoring poin loyalty, dan pembatasan akses suspensi akun.
          </p>
        </div>

        {/* Filter bar */}
        <div className="bg-[#FFFFFF] p-4 rounded border border-[#E4E1D9] flex items-center justify-between">
          <div className="relative w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777871]" />
            <input
              type="text"
              placeholder="Cari nama, email, nomor HP..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-xs text-[#242522] focus:outline-none focus:border-[#D96B3A]"
            />
          </div>
          <span className="text-xs text-[#777871]">Total: {filtered.length} Pelanggan</span>
        </div>

        {/* Customers Table */}
        <div className="bg-[#FFFFFF] rounded border border-[#E4E1D9] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F4F0] text-[#777871] uppercase text-[10px]">
              <tr>
                <th className="p-3">Pelanggan</th>
                <th className="p-3">Kontak WhatsApp</th>
                <th className="p-3">Mobil & Booking</th>
                <th className="p-3">Poin Loyalitas</th>
                <th className="p-3">Status Akun</th>
                <th className="p-3 text-right">Tindakan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E1D9]">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-[#F5F4F0]">
                  <td className="p-3">
                    <div className="font-bold text-[#242522]">{c.fullName}</div>
                    <div className="text-[11px] text-[#777871]">{c.email}</div>
                  </td>
                  <td className="p-3 text-[#777871]">{c.phone}</td>
                  <td className="p-3">
                    <div className="text-[#242522] font-semibold">{c.totalVehicles} Mobil Terdaftar</div>
                    <div className="text-[11px] text-[#777871]">{c.totalBookings}x Reservasi</div>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-[#D96B3A]">{c.loyaltyPoints} Poin</span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        c.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(c.id)}
                        className={`p-1.5 rounded transition-colors text-xs font-semibold ${
                          c.status === 'active'
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                        title={c.status === 'active' ? 'Suspend Akun' : 'Aktifkan Kembali'}
                      >
                        {c.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                      <button
                        onClick={() => deleteCustomer(c.id)}
                        className="p-1.5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                        title="Hapus Akun"
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
      </div>
    </AdminLayout>
  );
}
