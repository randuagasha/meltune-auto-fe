'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { api } from '@/services';
import { Vehicle, ServiceItem, Booking } from '@/types';
import {
  Car,
  Wrench,
  Calendar,
  Clock,
  Camera,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

const TIME_SLOTS = [
  '08:30 - 10:00',
  '10:00 - 11:30',
  '13:00 - 14:30',
  '14:30 - 16:00',
  '16:00 - 17:30',
];

export default function CustomerBookingPage() {
  const router = useRouter();

  // Wizard state: Step 1 to 8
  const [step, setStep] = useState(1);

  // Master options
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);

  // Selected state
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState<string>('');
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Booking completion
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    api.vehicles.getAll().then(v => {
      setVehicles(v);
      if (v.length > 0) setSelectedVehicleId(v[0].id);
    });
    api.services.getAll().then(s => setServices(s));

    // Tomorrow as minimum default date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduledDate(tomorrow.toISOString().slice(0, 10));
  }, []);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
  const selectedServices = services.filter(s => selectedServiceIds.includes(s.id));
  const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.estimatedDurationMinutes, 0);

  const toggleService = (id: string) => {
    setSelectedServiceIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    // Mock upload storing local blob URLs
    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      newUrls.push(URL.createObjectURL(files[i]));
    }
    setUploadedPhotos(prev => [...prev, ...newUrls]);
  };

  const handleSubmitBooking = async () => {
    if (!selectedVehicle) {
      setErrorMsg('Pilih kendaraan terlebih dahulu');
      return;
    }
    if (selectedServiceIds.length === 0) {
      setErrorMsg('Pilih minimal satu layanan');
      return;
    }
    if (!scheduledDate || !scheduledTimeSlot) {
      setErrorMsg('Tentukan tanggal dan slot waktu kedatangan');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await api.bookings.create({
        vehicleId: selectedVehicle.id,
        vehicleName: `${selectedVehicle.brand} ${selectedVehicle.model} ${selectedVehicle.year}`,
        licensePlate: selectedVehicle.licensePlate,
        serviceIds: selectedServiceIds,
        serviceNames: selectedServices.map(s => s.name),
        totalPrice,
        totalDurationMinutes: totalDuration,
        scheduledDate,
        scheduledTimeSlot,
        problemDescription: problemDescription || 'Servis berkala standar.',
        photoUrls: uploadedPhotos,
      });
      setCreatedBooking(res);
      setStep(8); // Final step
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengirim booking');
    } finally {
      setSubmitting(false);
    }
  };

  const STEPS = [
    { num: 1, label: 'Pilih Mobil' },
    { num: 2, label: 'Layanan' },
    { num: 3, label: 'Tanggal' },
    { num: 4, label: 'Slot Waktu' },
    { num: 5, label: 'Foto Kendala' },
    { num: 6, label: 'Deskripsi Masalah' },
    { num: 7, label: 'Review Pesanan' },
    { num: 8, label: 'Selesai' },
  ];

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
              Reservasi Jadwal Servis Workshop
            </h1>
            <p className="text-xs text-[#777871] mt-0.5">
              Alur 8 langkah presisi untuk memastikan persiapan suku cadang dan teknisi di workbay TORSI.
            </p>
          </div>
          {step < 8 && (
            <div className="text-xs font-semibold text-[#D96B3A] bg-orange-50 border border-orange-200 px-3 py-1.5 rounded">
              Langkah {step} dari 8
            </div>
          )}
        </div>

        {/* Step Progress Bar */}
        <div className="bg-[#FFFFFF] border border-[#E4E1D9] p-4 rounded overflow-x-auto">
          <div className="flex items-center min-w-[620px] justify-between">
            {STEPS.map((s, idx) => {
              const active = step === s.num;
              const done = step > s.num;
              return (
                <div key={s.num} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-heading transition-colors ${
                      done
                        ? 'bg-emerald-600 text-white'
                        : active
                        ? 'bg-[#D96B3A] text-white ring-4 ring-orange-100'
                        : 'bg-[#ECEAE4] text-[#777871]'
                    }`}
                  >
                    {done ? '✓' : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-medium whitespace-nowrap ${
                      active ? 'text-[#242522] font-bold' : 'text-[#777871]'
                    }`}
                  >
                    {s.label}
                  </span>
                  {idx < STEPS.length - 1 && (
                    <div className="w-6 h-[1px] bg-[#E4E1D9] mx-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step Content Container */}
        <div className="bg-[#FFFFFF] border border-[#E4E1D9] rounded p-6 sm:p-8">
          {/* STEP 1: Select Registered Vehicle */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#242522] font-heading flex items-center gap-2">
                <Car size={18} className="text-[#D96B3A]" />
                <span>Langkah 1: Pilih Kendaraan yang Akan Diservis</span>
              </h3>
              <p className="text-xs text-[#777871]">
                Pilih dari daftar kendaraan terdaftar di akun Anda atau daftarkan mobil baru.
              </p>

              {vehicles.length === 0 ? (
                <div className="p-6 bg-[#F5F4F0] rounded text-center space-y-2">
                  <p className="text-xs text-[#777871]">Anda belum memiliki kendaraan terdaftar.</p>
                  <a
                    href="/pelanggan/kendaraan"
                    className="text-xs font-semibold text-[#D96B3A] underline"
                  >
                    + Tambah Kendaraan Baru
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {vehicles.map(v => {
                    const isSelected = selectedVehicleId === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVehicleId(v.id)}
                        className={`p-4 rounded border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#D96B3A] bg-orange-50/40 ring-1 ring-[#D96B3A]'
                            : 'border-[#E4E1D9] bg-[#F5F4F0] hover:bg-[#ECEAE4]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#242522]">
                            {v.brand} {v.model} ({v.year})
                          </span>
                          <span className="font-mono text-xs font-bold text-[#D96B3A]">
                            {v.licensePlate}
                          </span>
                        </div>
                        <div className="text-xs text-[#777871] mt-2 capitalize">
                          Transmisi {v.transmission} • Mesin {v.fuelType}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Select Workshop Services */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#242522] font-heading flex items-center gap-2">
                <Wrench size={18} className="text-[#D96B3A]" />
                <span>Langkah 2: Pilih Layanan Workshop yang Diinginkan</span>
              </h3>
              <p className="text-xs text-[#777871]">
                Anda dapat memilih lebih dari satu paket perawatan. Estimasi biaya dan durasi akan diakumulasikan.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {services.map(s => {
                  const isChecked = selectedServiceIds.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleService(s.id)}
                      className={`p-4 rounded border cursor-pointer transition-all flex items-start gap-3 ${
                        isChecked
                          ? 'border-[#D96B3A] bg-orange-50/40 ring-1 ring-[#D96B3A]'
                          : 'border-[#E4E1D9] bg-[#F5F4F0] hover:bg-[#ECEAE4]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-1 accent-[#D96B3A]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#242522]">{s.name}</span>
                          <span className="text-xs font-extrabold text-[#D96B3A] font-heading">
                            Rp {s.price.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <p className="text-xs text-[#777871] mt-1 line-clamp-2">{s.description}</p>
                        <div className="text-[11px] text-[#777871] mt-2 flex items-center gap-1">
                          <Clock size={11} />
                          <span>Estimasi durasi: {s.estimatedDurationMinutes} menit</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedServiceIds.length > 0 && (
                <div className="mt-4 p-3 bg-[#ECEAE4] rounded flex items-center justify-between text-xs font-bold text-[#242522]">
                  <span>Total {selectedServiceIds.length} Layanan Terpilih</span>
                  <span>
                    Rp {totalPrice.toLocaleString('id-ID')} (~{totalDuration} menit)
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Select Service Date */}
          {step === 3 && (
            <div className="space-y-4 max-w-md">
              <h3 className="text-base font-bold text-[#242522] font-heading flex items-center gap-2">
                <Calendar size={18} className="text-[#D96B3A]" />
                <span>Langkah 3: Pilih Tanggal Kedatangan Servis</span>
              </h3>
              <p className="text-xs text-[#777871]">
                Workshop beroperasi Senin sampai Sabtu. Tanggal masa lampau tidak dapat dipilih.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#242522] mb-1">
                  Tanggal Booking
                </label>
                <input
                  type="date"
                  required
                  min={scheduledDate}
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded font-medium text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Select Time Slot */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#242522] font-heading flex items-center gap-2">
                <Clock size={18} className="text-[#D96B3A]" />
                <span>Langkah 4: Pilih Slot Jam Kedatangan</span>
              </h3>
              <p className="text-xs text-[#777871]">
                Setiap slot waktu dibatasi maksimal 2 kendaraan untuk menjaga ketelitian inspeksi teknisi.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {TIME_SLOTS.map((slot, i) => {
                  const isSelected = scheduledTimeSlot === slot;
                  return (
                    <div
                      key={i}
                      onClick={() => setScheduledTimeSlot(slot)}
                      className={`p-4 rounded border text-center cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#D96B3A] bg-[#242522] text-white'
                          : 'border-[#E4E1D9] bg-[#F5F4F0] hover:bg-[#ECEAE4] text-[#242522]'
                      }`}
                    >
                      <div className="font-bold text-sm font-heading">{slot} WIB</div>
                      <div className={`text-[10px] mt-1 ${isSelected ? 'text-amber-300' : 'text-emerald-700'}`}>
                        Tersedia (Sisa 1 Bay)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Upload Problem Photos */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#242522] font-heading flex items-center gap-2">
                <Camera size={18} className="text-[#D96B3A]" />
                <span>Langkah 5: Unggah Foto Masalah Kendaraan (Opsional)</span>
              </h3>
              <p className="text-xs text-[#777871]">
                Bantu mekanik mempersiapkan alat dengan melampirkan foto rembesan oli, keausan ban, atau lampu indikator dashboard.
              </p>

              <div className="border-2 border-dashed border-[#E4E1D9] rounded p-8 text-center bg-[#F5F4F0]">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer inline-flex flex-col items-center justify-center gap-2 text-xs font-semibold text-[#D96B3A]"
                >
                  <div className="w-10 h-10 rounded-full bg-[#ECEAE4] flex items-center justify-center text-[#242522]">
                    <Camera size={20} />
                  </div>
                  <span>Klik untuk memilih foto dari perangkat Anda</span>
                  <span className="text-[10px] text-[#777871] font-normal">
                    Format JPG, PNG hingga 5MB per berkas
                  </span>
                </label>
              </div>

              {uploadedPhotos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                  {uploadedPhotos.map((url, idx) => (
                    <div key={idx} className="aspect-square rounded border border-[#E4E1D9] overflow-hidden bg-black relative">
                      <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Write Problem Description */}
          {step === 6 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#242522] font-heading flex items-center gap-2">
                <FileText size={18} className="text-[#D96B3A]" />
                <span>Langkah 6: Catatan Gejala & Deskripsi Keluhan</span>
              </h3>
              <p className="text-xs text-[#777871]">
                Tuliskan sedetail mungkin kendala yang dirasakan (misal: bunyi decit saat pengereman, RPM drop saat AC hidup, atau oli menetes).
              </p>

              <textarea
                rows={5}
                value={problemDescription}
                onChange={e => setProblemDescription(e.target.value)}
                placeholder="Contoh: Tarikan gas bawah terasa sedikit tersendat saat suhu mesin mulai panas, minta cek busi dan throttle body."
                className="w-full px-4 py-3 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A] leading-relaxed"
              />
            </div>
          )}

          {/* STEP 7: Review & Submit Booking */}
          {step === 7 && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-[#242522] font-heading flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#D96B3A]" />
                <span>Langkah 7: Tinjau Rincian Reservasi Sebelum Konfirmasi</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F5F4F0] p-6 rounded border border-[#E4E1D9] text-xs">
                <div className="space-y-3">
                  <div>
                    <span className="text-[#777871] uppercase tracking-wider text-[10px]">Kendaraan</span>
                    <div className="font-bold text-sm text-[#242522] mt-0.5">
                      {selectedVehicle?.brand} {selectedVehicle?.model} ({selectedVehicle?.year})
                    </div>
                    <div className="font-mono text-[#D96B3A] font-semibold">{selectedVehicle?.licensePlate}</div>
                  </div>

                  <div>
                    <span className="text-[#777871] uppercase tracking-wider text-[10px]">Waktu Reservasi</span>
                    <div className="font-bold text-sm text-[#242522] mt-0.5">{scheduledDate}</div>
                    <div className="text-[#777871]">{scheduledTimeSlot} WIB</div>
                  </div>

                  <div>
                    <span className="text-[#777871] uppercase tracking-wider text-[10px]">Foto Masalah Terlampir</span>
                    <div className="text-[#242522] mt-0.5">{uploadedPhotos.length} foto siap ditinjau mekanik</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[#777871] uppercase tracking-wider text-[10px]">Paket Servis Dipilih</span>
                    <ul className="mt-1 space-y-1">
                      {selectedServices.map(s => (
                        <li key={s.id} className="flex justify-between text-[#242522]">
                          <span>• {s.name}</span>
                          <span className="font-semibold">Rp {s.price.toLocaleString('id-ID')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-[#E4E1D9] flex justify-between font-bold text-sm text-[#242522]">
                    <span>Total Estimasi Biaya:</span>
                    <span className="text-[#D96B3A] font-heading text-base">
                      Rp {totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {problemDescription && (
                    <div>
                      <span className="text-[#777871] uppercase tracking-wider text-[10px]">Keluhan Pelanggan</span>
                      <p className="mt-0.5 text-[#242522] italic">"{problemDescription}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: Booking Submitted Successfully */}
          {step === 8 && createdBooking && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>

              <span className="text-xs uppercase font-semibold tracking-wider text-emerald-700">
                Reservasi Berhasil Dikirimkan
              </span>
              <h2 className="text-2xl font-extrabold text-[#242522] font-heading">
                Nomor Referensi Booking:
              </h2>
              <div className="text-2xl font-mono font-extrabold text-[#D96B3A] bg-[#ECEAE4] px-6 py-2 rounded inline-block">
                {createdBooking.bookingReference}
              </div>

              <p className="text-xs text-[#777871] max-w-md mx-auto leading-relaxed">
                Permintaan booking Anda telah diteruskan ke mekanik operasional workshop. Silakan pantau status persetujuan dan catatan persiapan workbay melalui halaman riwayat.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => router.push('/pelanggan/riwayat')}
                  className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-5 py-2.5 rounded transition-colors"
                >
                  Lihat Riwayat & Status Booking
                </button>
                <button
                  onClick={() => router.push('/pelanggan/dashboard')}
                  className="bg-[#FFFFFF] border border-[#E4E1D9] text-[#242522] text-xs font-semibold px-5 py-2.5 rounded hover:bg-[#ECEAE4] transition-colors"
                >
                  Kembali ke Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Wizard Controls */}
          {step < 8 && (
            <div className="mt-8 pt-4 border-t border-[#E4E1D9] flex items-center justify-between">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-xs font-semibold text-[#242522] hover:bg-[#ECEAE4] rounded inline-flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>Kembali</span>
                </button>
              ) : (
                <div />
              )}

              {step < 7 ? (
                <button
                  onClick={() => {
                    if (step === 1 && !selectedVehicleId) {
                      setErrorMsg('Pilih kendaraan terlebih dahulu');
                      return;
                    }
                    if (step === 2 && selectedServiceIds.length === 0) {
                      setErrorMsg('Pilih minimal satu layanan');
                      return;
                    }
                    if (step === 4 && !scheduledTimeSlot) {
                      setErrorMsg('Pilih slot waktu kedatangan');
                      return;
                    }
                    setErrorMsg(null);
                    setStep(step + 1);
                  }}
                  className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-6 py-2.5 rounded inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Lanjut Langkah Berikutnya</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  onClick={handleSubmitBooking}
                  disabled={submitting}
                  className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-6 py-2.5 rounded inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <span>{submitting ? 'Mengirimkan...' : 'Konfirmasi & Kirim Reservasi'}</span>
                  <CheckCircle2 size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}
