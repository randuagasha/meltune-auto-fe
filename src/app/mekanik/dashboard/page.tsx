'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MechanicLayout } from '@/components/layout/MechanicLayout';
import { api } from '@/services';
import { Booking } from '@/types';
import { Wrench, Calendar, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';

const initialBays = [
  { bay: 'Bay 1 (Lift Hidrolik A)', status: 'Standby / Idle', vehicle: '-', service: 'Siap untuk alokasi servis', tech: 'Teknisi Jaga' },
  { bay: 'Bay 2 (Lift Hidrolik B)', status: 'Standby / Idle', vehicle: '-', service: 'Siap untuk alokasi servis', tech: 'Teknisi Jaga' },
  { bay: 'Bay 3 (Pit Wheel Aligner)', status: 'Standby / Idle', vehicle: '-', service: 'Siap untuk alokasi servis', tech: 'Teknisi Jaga' },
  { bay: 'Bay 4 (Kelistrikan & AC)', status: 'Standby / Idle', vehicle: '-', service: 'Siap untuk alokasi servis', tech: 'Teknisi Jaga' },
];

export default function MechanicDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bays, setBays] = useState(initialBays);

  useEffect(() => {
    api.bookings.getAll().then(setBookings);
    api.dashboard.getMechanicDashboard().then(data => {
      if (data?.activeBayAllocations?.length > 0) {
        setBays(data.activeBayAllocations.map((b: any, i: number) => ({
          bay: b.bayNumber || `Bay ${i + 1}`,
          status: b.status || 'Standby / Idle',
          vehicle: b.vehicle || '-',
          service: b.service || 'Siap untuk alokasi servis',
          tech: 'Teknisi Jaga',
        })));
      }
    }).catch(() => {});
  }, []);

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'in_progress');
  const completedToday = bookings.filter(b => b.status === 'completed');

  return (
    <MechanicLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#D96B3A]">
            Operasional Bengkel
          </span>
          <h1 className="text-2xl font-extrabold text-[#242522] font-heading mt-1">
            Dashboard Teknisi & Alokasi Workbay
          </h1>
          <p className="text-xs text-[#777871] mt-0.5">
            Monitor 4 bay aktif, verifikasi foto keluhan pelanggan, dan perbarui status pengerjaan servis mobil.
          </p>
        </div>

        {/* Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] flex items-center justify-between">
            <div>
              <div className="text-xs text-[#777871]">Menunggu Triage Mekanik</div>
              <div className="text-2xl font-extrabold text-[#D96B3A] font-heading mt-1">
                {pendingBookings.length} Mobil
              </div>
              <div className="text-[11px] text-[#777871]">Perlu konfirmasi ketersediaan bay</div>
            </div>
            <div className="w-10 h-10 rounded bg-orange-50 text-[#D96B3A] flex items-center justify-center">
              <AlertCircle size={20} />
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] flex items-center justify-between">
            <div>
              <div className="text-xs text-[#777871]">Servis Aktif / Berjalan</div>
              <div className="text-2xl font-extrabold text-[#242522] font-heading mt-1">
                {activeBookings.length} Workbay
              </div>
              <div className="text-[11px] text-[#777871]">Dalam tahapan inspeksi & bongkar</div>
            </div>
            <div className="w-10 h-10 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wrench size={20} />
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] flex items-center justify-between">
            <div>
              <div className="text-xs text-[#777871]">Selesai Servis Hari Ini</div>
              <div className="text-2xl font-extrabold text-emerald-700 font-heading mt-1">
                {completedToday.length} Unit
              </div>
              <div className="text-[11px] text-[#777871]">Siap serah terima pelanggan</div>
            </div>
            <div className="w-10 h-10 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
          </div>
        </div>

        {/* Workbay Allocation Status */}
        <div className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] space-y-4">
          <h2 className="text-base font-bold text-[#242522] font-heading flex items-center gap-2">
            <Wrench size={16} className="text-[#D96B3A]" />
            <span>Kondisi Real-Time 4 Workbay MELTUNE AUTO BSD</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bays.map((bay, idx) => {
              const isOccupied = bay.vehicle !== '-' && bay.vehicle !== 'Empty / Standby' && bay.vehicle !== 'Belum Ada Alokasi';
              return (
                <div
                  key={idx}
                  className={`p-4 rounded border text-xs space-y-2 ${
                    isOccupied ? 'bg-orange-50/40 border-orange-200' : 'bg-[#F5F4F0] border-[#E4E1D9]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#242522]">{bay.bay}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isOccupied ? 'bg-[#D96B3A] text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {bay.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#777871] text-[10px] block">Mobil:</span>
                    <div className="font-bold text-[#242522]">{bay.vehicle}</div>
                  </div>
                  <div>
                    <span className="text-[#777871] text-[10px] block">Layanan:</span>
                    <div className="text-[#777871] line-clamp-1">{bay.service}</div>
                  </div>
                  <div className="pt-2 border-t border-[#E4E1D9] text-[10px] text-[#777871]">
                    Teknisi Jaga: <span className="font-semibold text-[#242522]">{bay.tech}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Triage Action List */}
        <div className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#242522] font-heading">
              Daftar Booking Menunggu Tinjauan Mekanik
            </h2>
            <Link
              href="/mekanik/booking"
              className="text-xs font-semibold text-[#D96B3A] hover:underline"
            >
              Lihat Semua Booking & Triage &rarr;
            </Link>
          </div>

          {pendingBookings.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#777871] bg-[#F5F4F0] rounded">
              Tidak ada reservasi pending. Seluruh booking telah ditinjau.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingBookings.map(b => (
                <div
                  key={b.id}
                  className="p-4 bg-[#F5F4F0] border border-[#E4E1D9] rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#242522]">{b.bookingReference}</span>
                      <span className="text-[10px] bg-orange-100 text-[#D96B3A] font-bold px-2 py-0.5 rounded">
                        Perlu Konfirmasi
                      </span>
                    </div>
                    <div className="font-bold text-[#242522] text-sm mt-1">{b.vehicleName} ({b.licensePlate})</div>
                    <p className="text-[#777871] mt-0.5 italic">"{b.problemDescription}"</p>
                  </div>
                  <Link
                    href="/mekanik/booking"
                    className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-4 py-2 rounded shrink-0"
                  >
                    Tinjau Keluhan & Foto &rarr;
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MechanicLayout>
  );
}
