'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/services';
import { Booking } from '@/types';
import { Search, Calendar, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadBookings = () => {
    api.bookings.getAll().then(setBookings).catch(() => {});
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleUpdateStatus = async (id: string, status: Booking['status']) => {
    setErrorMsg(null);
    try {
      await api.bookings.updateStatus(id, status);
      setSuccessMsg(`Status booking berhasil diubah ke '${status}'.`);
      setTimeout(() => setSuccessMsg(null), 3500);
      loadBookings();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengubah status booking');
    }
  };

  const filtered = bookings.filter(b => {
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchSearch =
      b.bookingReference.toLowerCase().includes(search.toLowerCase()) ||
      b.userName.toLowerCase().includes(search.toLowerCase()) ||
      b.licensePlate.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
            Master Kontrol Seluruh Booking Workshop
          </h1>
          <p className="text-xs text-[#777871] mt-0.5">
            Superadmin memiliki otoritas penuh untuk meninjau, mengubah status, atau membatalkan reservasi pelanggan.
          </p>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-4 py-3 rounded flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Filter bar */}
        <div className="bg-[#FFFFFF] p-4 rounded border border-[#E4E1D9] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777871]" />
            <input
              type="text"
              placeholder="Cari kode booking, plat, nama..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-xs text-[#242522] focus:outline-none focus:border-[#D96B3A]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded text-xs capitalize transition-colors font-semibold ${
                  filterStatus === st
                    ? 'bg-[#242522] text-[#F5F4F0]'
                    : 'bg-[#ECEAE4] text-[#777871] hover:bg-[#E4E1D9]'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-[#FFFFFF] border border-[#E4E1D9] rounded overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F4F0] text-[#777871] uppercase text-[10px]">
              <tr>
                <th className="p-3">Ref & Pelanggan</th>
                <th className="p-3">Kendaraan</th>
                <th className="p-3">Jadwal Slot</th>
                <th className="p-3">Biaya Servis</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Tindakan Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E1D9]">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-[#F5F4F0]">
                  <td className="p-3">
                    <div className="font-mono font-bold text-[#242522]">{b.bookingReference}</div>
                    <div className="text-[11px] text-[#777871]">{b.userName}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-[#242522]">{b.vehicleName}</div>
                    <div className="font-mono text-[#D96B3A] text-[11px]">{b.licensePlate}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-[#242522] font-medium">{b.scheduledDate}</div>
                    <div className="text-[11px] text-[#777871]">{b.scheduledTimeSlot} WIB</div>
                  </td>
                  <td className="p-3 font-bold font-heading text-[#242522]">
                    Rp {b.totalPrice.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800'
                          : b.status === 'pending'
                          ? 'bg-orange-100 text-orange-800'
                          : b.status === 'completed'
                          ? 'bg-neutral-100 text-[#242522]'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <select
                      value={b.status}
                      onChange={e => handleUpdateStatus(b.id, e.target.value as any)}
                      className="text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded px-2 py-1 font-medium text-[#242522]"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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
