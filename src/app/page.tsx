'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Wrench,
  Gauge,
  ShieldCheck,
  CalendarCheck,
  ArrowRight,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-[#E4E1D9] bg-[#ECEAE4]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs uppercase tracking-widest text-[#D96B3A] font-semibold">
                  TORSI Workshop Tangerang Selatan
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#242522] leading-[1.08] tracking-tight">
                  Perawatan kendaraan yang tepat, presisi tanpa kompromi.
                </h1>
                <p className="text-lg text-[#777871] leading-relaxed max-w-2xl">
                  TORSI menyatukan diagnostik digital terkalibrasi, mekanik spesialis bersertifikasi, dan transparansi pengerjaan penuh untuk setiap kilometer perjalanan Anda.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/pelanggan/booking"
                    className="bg-[#D96B3A] hover:bg-[#BF582D] text-white px-6 py-3.5 rounded font-medium transition-colors inline-flex items-center gap-2 text-base shadow-sm"
                  >
                    <span>Reservasi Servis</span>
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/produk"
                    className="bg-[#FFFFFF] hover:bg-[#ECEAE4] text-[#242522] border border-[#E4E1D9] px-6 py-3.5 rounded font-medium transition-colors inline-flex items-center gap-2 text-base"
                  >
                    <span>Eksplor Suku Cadang</span>
                  </Link>
                </div>
                <div className="pt-6 grid grid-cols-3 gap-6 border-t border-[#E4E1D9] text-left">
                  <div>
                    <div className="text-2xl font-bold text-[#242522] font-heading">4 Bay</div>
                    <div className="text-xs text-[#777871] mt-0.5">Workbay Khusus</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#242522] font-heading">100%</div>
                    <div className="text-xs text-[#777871] mt-0.5">Fluida & Part OEM</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#242522] font-heading">Digital</div>
                    <div className="text-xs text-[#777871] mt-0.5">Triage & Laporan Foto</div>
                  </div>
                </div>
              </div>

              {/* Editorial Hero Visual */}
              <div className="lg:col-span-5 relative">
                <div className="aspect-4/3 rounded-lg overflow-hidden border border-[#E4E1D9] shadow-md bg-[#242522]">
                  <img
                    src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=1200"
                    alt="TORSI Workshop Workbay"
                    className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-[#FFFFFF] border border-[#E4E1D9] p-4 rounded shadow-lg max-w-xs hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#ECEAE4] flex items-center justify-center text-[#D96B3A]">
                      <Gauge size={22} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#242522]">Kalibrasi Presisi</div>
                      <div className="text-[11px] text-[#777871]">OBD-II, Laser Toe & Camber</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORKSHOP INTRODUCTION */}
        <section className="py-20 bg-[#F5F4F0] border-b border-[#E4E1D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#FFFFFF] p-8 rounded border border-[#E4E1D9] space-y-3">
                <div className="w-10 h-10 rounded bg-[#ECEAE4] flex items-center justify-center text-[#D96B3A]">
                  <Wrench size={20} />
                </div>
                <h3 className="text-lg font-bold text-[#242522] font-heading">Standar Mekanikal Ketat</h3>
                <p className="text-sm text-[#777871] leading-relaxed">
                  Setiap torsi baut, volume fluida pengganti, dan celah elektroda busi dikerjakan mengikuti panduan manual servis manufaktur resmi.
                </p>
              </div>

              <div className="bg-[#FFFFFF] p-8 rounded border border-[#E4E1D9] space-y-3">
                <div className="w-10 h-10 rounded bg-[#ECEAE4] flex items-center justify-center text-[#D96B3A]">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-lg font-bold text-[#242522] font-heading">Transparansi Visual Masalah</h3>
                <p className="text-sm text-[#777871] leading-relaxed">
                  Foto dan catatan mekanik diunggah langsung ke akun pelanggan sebelum suku cadang diganti. Tidak ada biaya siluman.
                </p>
              </div>

              <div className="bg-[#FFFFFF] p-8 rounded border border-[#E4E1D9] space-y-3">
                <div className="w-10 h-10 rounded bg-[#ECEAE4] flex items-center justify-center text-[#D96B3A]">
                  <Award size={20} />
                </div>
                <h3 className="text-lg font-bold text-[#242522] font-heading">Suku Cadang & Pelumas Resmi</h3>
                <p className="text-sm text-[#777871] leading-relaxed">
                  Kami mengoperasikan inventaris resmi Motul, Liqui Moly, Brembo, dan komponen OEM yang tersertifikasi bebas barang tiruan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED SERVICES */}
        <section className="py-20 bg-[#ECEAE4]/30 border-b border-[#E4E1D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#D96B3A] font-semibold">
                  Katalog Workshop
                </span>
                <h2 className="text-3xl font-extrabold text-[#242522] font-heading mt-1">
                  Layanan Servis Terpilih
                </h2>
              </div>
              <Link
                href="/layanan"
                className="text-sm font-semibold text-[#D96B3A] hover:text-[#BF582D] inline-flex items-center gap-1.5"
              >
                <span>Lihat Seluruh Layanan</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Advanced Engine Tune-Up',
                  category: 'Perawatan Mesin',
                  price: 'Rp 650.000',
                  duration: '90 Menit',
                  desc: 'Pembersihan throttle body, pembacaan live parameter ECU, dan pengecekan emisi.',
                  img: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800',
                },
                {
                  title: 'Full Synthetic Fluid & Filter',
                  category: 'Servis Berkala',
                  price: 'Rp 850.000',
                  duration: '45 Menit',
                  desc: 'Oli full synthetic ester base, filter OEM baru, serta 24 poin cek keselamatan.',
                  img: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800',
                },
                {
                  title: 'Precision Brake Overhaul',
                  category: 'Sistem Rem',
                  price: 'Rp 550.000',
                  duration: '75 Menit',
                  desc: 'Flushing minyak rem vakum, pembersihan kaliper, dan instalasi kampas rem OEM.',
                  img: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&q=80&w=800',
                },
              ].map((srv, i) => (
                <div
                  key={i}
                  className="bg-[#FFFFFF] border border-[#E4E1D9] rounded overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
                >
                  <div className="aspect-16/10 overflow-hidden bg-neutral-900">
                    <img
                      src={srv.img}
                      alt={srv.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-xs text-[#D96B3A] font-medium uppercase tracking-wider">
                        {srv.category}
                      </div>
                      <h3 className="text-lg font-bold text-[#242522] font-heading mt-1">
                        {srv.title}
                      </h3>
                      <p className="text-sm text-[#777871] mt-2 leading-relaxed">
                        {srv.desc}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-[#E4E1D9] flex items-center justify-between">
                      <div>
                        <div className="text-xs text-[#777871]">Mulai dari</div>
                        <div className="text-base font-bold text-[#242522] font-heading">{srv.price}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-[#777871] flex items-center gap-1 justify-end">
                          <Clock size={12} />
                          <span>{srv.duration}</span>
                        </div>
                        <Link
                          href="/pelanggan/booking"
                          className="text-xs font-semibold text-[#D96B3A] hover:text-[#BF582D] mt-0.5 inline-block"
                        >
                          Booking Slot &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW BOOKING WORKS (8 STEPS OVERVIEW) */}
        <section className="py-20 bg-[#F5F4F0] border-b border-[#E4E1D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-widest text-[#D96B3A] font-semibold">
                Alur Pemesanan
              </span>
              <h2 className="text-3xl font-extrabold text-[#242522] font-heading mt-1">
                Cara Reservasi Servis di TORSI
              </h2>
              <p className="text-sm text-[#777871] mt-2">
                Tanpa antrean fisik tidak pasti. Booking waktu kedatangan dan verifikasi teknisi siap di workbay.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[
                { step: '01', title: 'Pilih Kendaraan', desc: 'Pilih mobil yang terdaftar di akun atau tambah kendaraan baru.' },
                { step: '02', title: 'Pilih Paket Servis', desc: 'Tentukan jenis perawatan sesuai kebutuhan jarak tempuh mesin.' },
                { step: '03', title: 'Pilih Jadwal & Slot', desc: 'Sistem membatasi 2 mobil per slot waktu agar pengerjaan fokus.' },
                { step: '04', title: 'Kirim Masalah & Foto', desc: 'Unggah deskripsi gejala serta foto komponen bermasalah.' },
              ].map((item, i) => (
                <div key={i} className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] relative">
                  <span className="font-heading font-extrabold text-2xl text-[#D96B3A]/30">
                    {item.step}
                  </span>
                  <h4 className="text-base font-bold text-[#242522] font-heading mt-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#777871] mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/pelanggan/booking"
                className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-sm font-semibold px-6 py-3 rounded inline-flex items-center gap-2"
              >
                <CalendarCheck size={16} />
                <span>Mulai Reservasi Servis Online</span>
              </Link>
            </div>
          </div>
        </section>

        {/* LOYALTY & DAILY STREAK BANNER */}
        <section className="py-16 bg-[#242522] text-[#F5F4F0] border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <span className="text-xs uppercase tracking-widest text-[#D96B3A] font-semibold flex items-center gap-1.5">
                  <Sparkles size={14} />
                  Program Loyalitas TORSI
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                  Check-in harian. Kumpulkan poin. Tukar reward perawatan.
                </h2>
                <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
                  Pertahankan streak kunjungan web setiap hari untuk mendapatkan poin bertingkat. Tukarkan poin dengan botol wiper concentrate, kain microfiber 500 GSM, hingga oli mesin genuine tanpa biaya tambahan.
                </p>
              </div>
              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <Link
                  href="/pelanggan/loyalitas"
                  className="bg-[#D96B3A] hover:bg-[#BF582D] text-white font-semibold text-sm px-6 py-3.5 rounded transition-colors inline-flex items-center gap-2"
                >
                  <span>Buka Dashboard Loyalitas</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 bg-[#F5F4F0] border-b border-[#E4E1D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs uppercase tracking-widest text-[#D96B3A] font-semibold">
                Testimoni Pengguna
              </span>
              <h2 className="text-3xl font-extrabold text-[#242522] font-heading mt-1">
                Dipercaya Pemilik Kendaraan Harian & Antusias
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: 'Bawa Civic Turbo ke TORSI karena ada getaran rem pada kecepatan tinggi. Mekanik menjelaskan runout rotor dengan micrometer gauge sebelum ambil tindakan bubut.',
                  name: 'Budi Santoso',
                  car: 'Honda Civic FK7',
                },
                {
                  quote: 'Suka sistem bookingnya. Jam 09.00 tiba, mobil langsung masuk lift tanpa nunggu antrean bengkel yang berantakan. Ruang tunggu bersih dan informatif.',
                  name: 'Danang Prasetyo',
                  car: 'Mazda 3 Hatchback',
                },
                {
                  quote: 'Oli yang dipakai benar-benar original terverifikasi. Tidak ada tawaran part aneh-aneh yang tidak perlu diganti. Standar profesional yang langka.',
                  name: 'Reza Pratama',
                  car: 'Toyota Fortuner 2.8',
                },
              ].map((t, i) => (
                <div key={i} className="bg-[#FFFFFF] p-8 rounded border border-[#E4E1D9] flex flex-col justify-between space-y-6">
                  <p className="text-sm text-[#777871] leading-relaxed italic">
                    "{t.quote}"
                  </p>
                  <div className="pt-4 border-t border-[#E4E1D9]">
                    <div className="text-sm font-bold text-[#242522] font-heading">{t.name}</div>
                    <div className="text-xs text-[#D96B3A]">{t.car}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 bg-[#ECEAE4]/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#242522] font-heading">
              Siap merasakan standar perawatan kendaraan yang sesungguhnya?
            </h2>
            <p className="text-base text-[#777871] max-w-xl mx-auto">
              Jadwalkan servis Anda hari ini di workbay kami atau konsultasikan gejala kendala mobil Anda langsung dengan teknisi kepala TORSI.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/pelanggan/booking"
                className="bg-[#D96B3A] hover:bg-[#BF582D] text-white px-8 py-3.5 rounded font-semibold text-sm transition-colors"
              >
                Reservasi Jadwal Servis
              </Link>
              <Link
                href="/kontak"
                className="bg-[#FFFFFF] hover:bg-[#ECEAE4] text-[#242522] border border-[#E4E1D9] px-8 py-3.5 rounded font-semibold text-sm transition-colors"
              >
                Hubungi via WhatsApp
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
