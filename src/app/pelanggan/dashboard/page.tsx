'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/services';
import { Vehicle, Booking, LoyaltyProfile, ServiceItem } from '@/types';
import {
  Car,
  CalendarCheck,
  Sparkles,
  Flame,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loyalty, setLoyalty] = useState<LoyaltyProfile | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInMsg, setCheckInMsg] = useState<string | null>(null);

  useEffect(() => {
    api.vehicles.getAll().then(setVehicles);
    api.bookings.getAll().then(setBookings);
    api.loyalty.getProfile().then(setLoyalty);
    api.services.getAll().then(setServices);
  }, []);

  const handleDailyCheckIn = async () => {
    setCheckingIn(true);
    try {
      const res = await api.loyalty.checkIn();
      setCheckInMsg(res.message);
      if (res.success) {
        const fresh = await api.loyalty.getProfile();
        setLoyalty(fresh);
      }
    } catch (err: any) {
      setCheckInMsg(err?.message || 'Check-in loyalty gagal diproses.');
    } finally {
      setCheckingIn(false);
      setTimeout(() => setCheckInMsg(null), 4000);
    }
  };

  const activeBooking = bookings.find(b => b.status === 'confirmed' || b.status === 'in_progress');

  return (
    <CustomerLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded border border-[#E4E1D9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D96B3A]">
              Customer Portal MELTUNE AUTO
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242522] font-heading mt-1">
              Selamat Datang, {user?.fullName || 'Pelanggan'}
            </h1>
            <p className="text-xs text-[#777871] mt-1">
              Ringkasan kondisi kendaraan, reservasi workbay, dan poin loyalty harian Anda.
            </p>
          </div>
          <Link
            href="/pelanggan/booking"
            className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-5 py-3 rounded transition-colors inline-flex items-center gap-2 shrink-0"
          >
            <CalendarCheck size={15} />
            <span>Reservasi Servis Baru</span>
          </Link>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Streak & Points Card */}
          <div className="bg-[#FFFFFF] p-5 rounded border border-[#E4E1D9] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#777871]">Streak Kunjungan</span>
              <div className="w-8 h-8 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
                <Flame size={16} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold font-heading text-[#242522]">
                {loyalty?.currentStreak || 0} Hari
              </div>
              <div className="text-[11px] text-[#777871] mt-0.5">Rekor terpanjang: {loyalty?.longestStreak || 0} hari</div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded border border-[#E4E1D9] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#777871]">Poin Loyalitas</span>
              <div className="w-8 h-8 rounded bg-orange-50 text-[#D96B3A] flex items-center justify-center">
                <Sparkles size={16} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold font-heading text-[#242522]">
                {loyalty?.points || 0} Poin
              </div>
              <div className="text-[11px] text-[#777871] mt-0.5">Dapat ditukar produk perawatan</div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded border border-[#E4E1D9] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#777871]">Kendaraan Terdaftar</span>
              <div className="w-8 h-8 rounded bg-neutral-100 text-[#242522] flex items-center justify-center">
                <Car size={16} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold font-heading text-[#242522]">
                {vehicles.length} Unit
              </div>
              <div className="text-[11px] text-[#777871] mt-0.5">Siap dijadwalkan servis</div>
            </div>
          </div>

          {/* Daily Check-in CTA Card */}
          <div className="bg-[#242522] text-[#F5F4F0] p-5 rounded border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                <Sparkles size={13} />
                <span>Check-in Hari Ini</span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Klaim +15 s/d 40 poin loyalitas setiap hari.
              </p>
            </div>
            <button
              onClick={handleDailyCheckIn}
              disabled={checkingIn}
              className="mt-3 w-full bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold py-2 rounded transition-colors text-center disabled:opacity-50"
            >
              {checkingIn ? 'Memproses...' : 'Klaim Check-in'}
            </button>
          </div>
        </div>

        {checkInMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{checkInMsg}</span>
          </div>
        )}

        {/* Active Booking Live Monitor */}
        {activeBooking && (
          <div className="bg-[#FFFFFF] border-2 border-[#D96B3A] p-6 rounded shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D96B3A] animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#D96B3A]">
                  Servis Aktif Sedang Berjalan
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#242522] bg-[#ECEAE4] px-2.5 py-1 rounded">
                Ref: {activeBooking.bookingReference}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#E4E1D9]">
              <div>
                <span className="text-[11px] text-[#777871]">Mobil & Plat</span>
                <div className="text-sm font-bold text-[#242522]">{activeBooking.vehicleName}</div>
                <div className="text-xs font-mono text-[#D96B3A]">{activeBooking.licensePlate}</div>
              </div>
              <div>
                <span className="text-[11px] text-[#777871]">Jadwal Kedatangan</span>
                <div className="text-sm font-bold text-[#242522]">{activeBooking.scheduledDate}</div>
                <div className="text-xs text-[#777871]">{activeBooking.scheduledTimeSlot}</div>
              </div>
              <div>
                <span className="text-[11px] text-[#777871]">Status Workbay</span>
                <div className="text-sm font-bold capitalize text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>{activeBooking.status.replace('_', ' ')}</span>
                </div>
                {activeBooking.mechanicNotes && (
                  <div className="text-[11px] text-[#777871] mt-0.5 line-clamp-1 italic">
                    "{activeBooking.mechanicNotes}"
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Registered Vehicles & Recommended Services */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Vehicles list */}
          <div className="lg:col-span-7 bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#242522] font-heading flex items-center gap-2">
                <Car size={16} className="text-[#D96B3A]" />
                <span>Kendaraan Anda</span>
              </h2>
              <Link
                href="/pelanggan/kendaraan"
                className="text-xs font-semibold text-[#D96B3A] hover:underline"
              >
                Kelola Semua Kendaraan &rarr;
              </Link>
            </div>

            {vehicles.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#777871] bg-[#F5F4F0] rounded border border-[#E4E1D9] space-y-2">
                <Car size={24} className="mx-auto text-[#777871]" />
                <p>Belum ada kendaraan terdaftar pada akun Anda.</p>
                <Link
                  href="/pelanggan/kendaraan"
                  className="inline-block text-xs font-semibold text-[#D96B3A] hover:underline"
                >
                  + Daftarkan Kendaraan Pertama Anda
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {vehicles.map(v => (
                  <div
                    key={v.id}
                    className="p-4 bg-[#F5F4F0] border border-[#E4E1D9] rounded flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-[#242522]">
                        {v.brand} {v.model} ({v.year})
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[#777871]">
                        <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#E4E1D9] text-[#242522] font-semibold">
                          {v.licensePlate}
                        </span>
                        <span className="capitalize">{v.transmission}</span>
                        <span>•</span>
                        <span className="capitalize">{v.fuelType}</span>
                      </div>
                    </div>
                    <Link
                      href={`/pelanggan/booking?vehicle=${v.id}`}
                      className="text-xs font-semibold bg-[#242522] hover:bg-[#383a35] text-white px-3 py-1.5 rounded transition-colors"
                    >
                      Booking Servis
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Maintenance */}
          <div className="lg:col-span-5 bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] space-y-4">
            <h2 className="text-base font-bold text-[#242522] font-heading">
              Rekomendasi Servis Berkala
            </h2>
            {services.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#777871] bg-[#F5F4F0] rounded border border-[#E4E1D9]">
                Tidak ada paket servis yang aktif saat ini.
              </div>
            ) : (
              <div className="space-y-3">
                {services.slice(0, 3).map(s => (
                  <div key={s.id} className="p-3 bg-[#F5F4F0] rounded border border-[#E4E1D9] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#242522]">{s.name}</span>
                      <span className="text-xs font-extrabold text-[#D96B3A] font-heading">
                        Rp {s.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#777871] line-clamp-1">{s.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
