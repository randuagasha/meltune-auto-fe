'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useFreshnessEffect } from '@/hooks/useFreshnessEffect';
import { api } from '@/services';
import { Booking } from '@/types';
import { Calendar, Clock, Car, CheckCircle2, XCircle, AlertCircle, Ban, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { fadeInUp, staggerContainer } from '@/lib/motion';

export default function CustomerBookingHistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadBookings = () => {
    api.bookings.getAll().then(setBookings).catch(() => {});
  };

  useFreshnessEffect(() => {
    loadBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan reservasi ini?')) return;
    setActionLoading(true);
    setErrorMsg(null);
    try {
      await api.bookings.updateStatus(id, 'cancelled');
      setSuccessMsg('Reservasi berhasil dibatalkan.');
      setTimeout(() => setSuccessMsg(null), 4000);
      loadBookings();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal membatalkan reservasi.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2.5 py-1 rounded">Terkonfirmasi</span>;
      case 'in_progress':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-semibold px-2.5 py-1 rounded animate-pulse">Sedang Pengerjaan</span>;
      case 'completed':
        return <span className="bg-neutral-100 text-[#242522] text-[11px] font-semibold px-2.5 py-1 rounded">Selesai</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-[11px] font-semibold px-2.5 py-1 rounded">Dibatalkan</span>;
      case 'rejected':
        return <span className="bg-rose-100 text-rose-800 text-[11px] font-semibold px-2.5 py-1 rounded">Ditolak Workshop</span>;
      default:
        return <span className="bg-orange-100 text-orange-800 text-[11px] font-semibold px-2.5 py-1 rounded">Menunggu Konfirmasi Mekanik</span>;
    }
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
              Riwayat & Status Reservasi
            </h1>
            <p className="text-xs text-[#777871] mt-0.5">
              Pantau jadwal kedatangan kendaraan, catatan teknisi, dan tahapan servis workbay.
            </p>
          </div>
          <Link
            href="/pelanggan/booking"
            className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-4 py-2.5 rounded transition-colors inline-flex items-center gap-2 shrink-0"
          >
            <span>+ Reservasi Baru</span>
          </Link>
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

        {bookings.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E4E1D9] p-12 text-center rounded space-y-3">
            <Calendar size={36} className="text-[#777871] mx-auto" />
            <h3 className="text-base font-bold text-[#242522] font-heading">
              Belum Ada Reservasi Aktif
            </h3>
            <p className="text-xs text-[#777871] max-w-sm mx-auto">
              Anda belum melakukan booking jadwal servis di workshop MELTUNE AUTO.
            </p>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
            {bookings.map(b => (
              <motion.div
                key={b.id}
                variants={fadeInUp}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="bg-[#FFFFFF] border border-[#E4E1D9] rounded p-6 space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E4E1D9]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-extrabold text-sm text-[#242522]">
                      {b.bookingReference}
                    </span>
                    {getStatusBadge(b.status)}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-[#777871] flex items-center gap-1">
                      <Clock size={13} />
                      <span>Dibuat: {new Date(b.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    {(b.status === 'pending' || b.status === 'confirmed') && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        disabled={actionLoading}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 px-2.5 py-1 rounded transition-colors inline-flex items-center gap-1"
                      >
                        <Ban size={12} />
                        <span>Batalkan</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-[#777871] uppercase">Kendaraan</span>
                    <div className="font-bold text-[#242522] text-sm mt-0.5">{b.vehicleName}</div>
                    <div className="font-mono text-[#D96B3A] font-semibold">{b.licensePlate}</div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#777871] uppercase">Jadwal & Waktu Kedatangan</span>
                    <div className="font-bold text-[#242522] text-sm mt-0.5">{b.scheduledDate}</div>
                    <div className="text-[#777871]">{b.scheduledTimeSlot} WIB</div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#777871] uppercase">Total Biaya Servis</span>
                    <div className="font-extrabold text-[#242522] text-sm font-heading mt-0.5">
                      Rp {b.totalPrice.toLocaleString('id-ID')}
                    </div>
                    <div className="text-[#777871]">{b.totalDurationMinutes} menit estimasi pengerjaan</div>
                  </div>
                </div>

                {/* Services List */}
                <div className="bg-[#F5F4F0] p-3 rounded text-xs space-y-1">
                  <span className="font-semibold text-[#242522]">Paket Servis:</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {b.serviceNames.map((name, i) => (
                      <span
                        key={i}
                        className="bg-[#FFFFFF] border border-[#E4E1D9] px-2 py-0.5 rounded text-[11px] text-[#242522]"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mechanic notes or rejection feedback */}
                {b.mechanicNotes && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800">
                    <span className="font-bold">Catatan Mekanik: </span>
                    {b.mechanicNotes}
                  </div>
                )}

                {b.rejectionReason && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800">
                    <span className="font-bold">Alasan Penolakan: </span>
                    {b.rejectionReason}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </CustomerLayout>
  );
}
