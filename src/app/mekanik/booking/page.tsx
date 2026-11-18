'use client';

import { useState, useEffect } from 'react';
import { MechanicLayout } from '@/components/layout/MechanicLayout';
import { api } from '@/services';
import { Booking } from '@/types';
import { CheckCircle2, XCircle, Clock, Camera, FileText, Wrench, X } from 'lucide-react';

export default function MechanicBookingManagementPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Rejection modal
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Mechanic Notes modal
  const [noteBookingId, setNoteBookingId] = useState<string | null>(null);
  const [mechanicNotes, setMechanicNotes] = useState('');

  const loadBookings = () => {
    api.bookings.getAll().then(setBookings);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleUpdateStatus = async (id: string, status: Booking['status']) => {
    await api.bookings.updateStatus(id, status);
    loadBookings();
    if (selectedBooking?.id === id) {
      setSelectedBooking(prev => (prev ? { ...prev, status } : null));
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingId || !rejectionReason.trim()) return;
    await api.bookings.updateStatus(rejectingId, 'rejected', { rejectionReason });
    setRejectingId(null);
    setRejectionReason('');
    loadBookings();
  };

  const handleSaveNotes = async () => {
    if (!noteBookingId) return;
    await api.bookings.updateNotes(noteBookingId, mechanicNotes);
    setNoteBookingId(null);
    setMechanicNotes('');
    loadBookings();
  };

  return (
    <MechanicLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
            Triage & Manajemen Booking Servis
          </h1>
          <p className="text-xs text-[#777871] mt-0.5">
            Periksa foto keluhan mobil pelanggan, konfirmasi atau tolak dengan alasan jelas, dan catat hasil inspeksi workbay.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Booking List */}
          <div className="lg:col-span-6 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#777871]">
              Daftar Permintaan Servis ({bookings.length})
            </h2>

            {bookings.map(b => {
              const isSelected = selectedBooking?.id === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className={`p-4 rounded border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#D96B3A] bg-orange-50/40 ring-1 ring-[#D96B3A]'
                      : 'border-[#E4E1D9] bg-[#FFFFFF] hover:bg-[#F5F4F0]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#242522]">{b.bookingReference}</span>
                    <span
                      className={`capitalize text-[10px] font-bold px-2 py-0.5 rounded ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800'
                          : b.status === 'pending'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-neutral-100 text-[#777871]'
                      }`}
                    >
                      {b.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-2 text-sm font-bold text-[#242522]">{b.vehicleName}</div>
                  <div className="text-xs font-mono text-[#D96B3A]">{b.licensePlate}</div>

                  <div className="mt-2 pt-2 border-t border-[#E4E1D9] flex items-center justify-between text-[11px] text-[#777871]">
                    <span>
                      {b.scheduledDate} • {b.scheduledTimeSlot} WIB
                    </span>
                    <span className="font-semibold text-[#242522]">
                      Rp {b.totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Booking Details Pane */}
          <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E4E1D9] rounded p-6 space-y-6">
            {selectedBooking ? (
              <>
                <div className="flex items-start justify-between pb-4 border-b border-[#E4E1D9]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#D96B3A]">
                      Rincian Pemeriksaan Booking
                    </span>
                    <h3 className="text-lg font-bold text-[#242522] font-heading mt-0.5">
                      {selectedBooking.bookingReference}
                    </h3>
                  </div>
                  <div className="flex gap-1.5">
                    {selectedBooking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(selectedBooking.id, 'confirmed')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1"
                        >
                          <CheckCircle2 size={13} />
                          <span>Konfirmasi</span>
                        </button>
                        <button
                          onClick={() => {
                            setRejectingId(selectedBooking.id);
                            setRejectionReason('');
                          }}
                          className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1"
                        >
                          <XCircle size={13} />
                          <span>Tolak</span>
                        </button>
                      </>
                    )}

                    {selectedBooking.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedBooking.id, 'in_progress')}
                        className="bg-[#242522] hover:bg-[#383a35] text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                      >
                        Mulai Naik Lift (In Progress)
                      </button>
                    )}

                    {selectedBooking.status === 'in_progress' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedBooking.id, 'completed')}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1"
                      >
                        <CheckCircle2 size={13} />
                        <span>Selesaikan Servis</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Customer & Vehicle Info */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#777871] block">Pelanggan:</span>
                    <div className="font-bold text-[#242522]">{selectedBooking.userName}</div>
                    <div className="text-[#777871]">{selectedBooking.userPhone || '+6281234567890'}</div>
                  </div>
                  <div>
                    <span className="text-[#777871] block">Kendaraan:</span>
                    <div className="font-bold text-[#242522]">{selectedBooking.vehicleName}</div>
                    <div className="font-mono text-[#D96B3A] font-semibold">{selectedBooking.licensePlate}</div>
                  </div>
                </div>

                {/* Problem Description */}
                <div className="p-4 bg-[#F5F4F0] rounded text-xs space-y-1">
                  <span className="font-bold text-[#242522]">Keluhan & Deskripsi Gejala Pelanggan:</span>
                  <p className="text-[#242522] italic leading-relaxed">
                    "{selectedBooking.problemDescription}"
                  </p>
                </div>

                {/* Photos */}
                <div>
                  <span className="text-xs font-bold text-[#242522] block mb-2 flex items-center gap-1.5">
                    <Camera size={14} className="text-[#D96B3A]" />
                    <span>Foto Problem Yang Diunggah ({selectedBooking.photoUrls?.length || 0})</span>
                  </span>
                  {selectedBooking.photoUrls && selectedBooking.photoUrls.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {selectedBooking.photoUrls.map((url, i) => (
                        <div key={i} className="aspect-square rounded border border-[#E4E1D9] overflow-hidden bg-black">
                          <img src={url} alt="Problem" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#777871]">Pelanggan tidak melampirkan foto tambahan.</p>
                  )}
                </div>

                {/* Mechanic Notes Section */}
                <div className="pt-4 border-t border-[#E4E1D9] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#242522] flex items-center gap-1.5">
                      <FileText size={14} className="text-[#D96B3A]" />
                      <span>Catatan Teknis Servis Workbay</span>
                    </span>
                    <button
                      onClick={() => {
                        setNoteBookingId(selectedBooking.id);
                        setMechanicNotes(selectedBooking.mechanicNotes || '');
                      }}
                      className="text-xs font-semibold text-[#D96B3A] hover:underline"
                    >
                      + Perbarui Catatan
                    </button>
                  </div>
                  <div className="p-3 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-xs text-[#242522]">
                    {selectedBooking.mechanicNotes || 'Belum ada catatan teknisi yang ditambahkan.'}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-16 text-xs text-[#777871]">
                Pilih salah satu booking pada daftar di sebelah kiri untuk meninjau detail teknis.
              </div>
            )}
          </div>
        </div>

        {/* Modal Reject Booking */}
        {rejectingId && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] border border-[#E4E1D9] rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4E1D9]">
                <h3 className="text-base font-bold text-[#242522] font-heading">
                  Alasan Penolakan Booking
                </h3>
                <button onClick={() => setRejectingId(null)} className="text-[#777871]">
                  <X size={18} />
                </button>
              </div>

              <div className="text-xs text-[#777871]">
                Tuliskan alasan penolakan secara jelas agar pelanggan dapat menjadwalkan ulang atau memahami kendala ketersediaan suku cadang/workbay.
              </div>

              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="Contoh: Suku cadang filter oli model ini sedang dalam pengiriman distributor, slot dialihkan ke hari kerja berikutnya."
                className="w-full px-3 py-2 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingId(null)}
                  className="px-4 py-2 text-xs text-[#777871]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded"
                >
                  Kirim Penolakan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Mechanic Notes */}
        {noteBookingId && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] border border-[#E4E1D9] rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4E1D9]">
                <h3 className="text-base font-bold text-[#242522] font-heading">
                  Catat Kemajuan atau Temuan Teknis
                </h3>
                <button onClick={() => setNoteBookingId(null)} className="text-[#777871]">
                  <X size={18} />
                </button>
              </div>

              <textarea
                rows={4}
                value={mechanicNotes}
                onChange={e => setMechanicNotes(e.target.value)}
                placeholder="Catat nomor bay, spesifikasi oli yang diisi, torsi baut roda yang diterapkan, atau rekomendasi perbaikan lanjut..."
                className="w-full px-3 py-2 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNoteBookingId(null)}
                  className="px-4 py-2 text-xs text-[#777871]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-4 py-2 rounded"
                >
                  Simpan Catatan Servis
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MechanicLayout>
  );
}
