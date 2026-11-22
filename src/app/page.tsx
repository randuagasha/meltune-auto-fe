'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/components/auth/AuthProvider';
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
import { motion } from 'motion/react';
import {
  EASE_LUXURY,
  fadeInUp,
  fadeInScale,
  staggerContainer,
  staggerContainerSlow,
} from '@/lib/motion';

export default function HomePage() {
  const { user } = useAuth();
  const bookingLink = user ? '/pelanggan/booking' : '/auth/login?redirect=/pelanggan/booking';
  const loyaltyLink = user ? '/pelanggan/loyalitas' : '/auth/login?redirect=/pelanggan/loyalitas';

  return (
    <>
      <Header />
      <main className="flex-1 overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-[#E4E1D9] bg-[#ECEAE4]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainerSlow}
                className="lg:col-span-7 space-y-6"
              >
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E4E1D9] rounded-full text-xs font-semibold text-[#D96B3A] shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#D96B3A] animate-ping" />
                  <span>Bengkel Spesialis & Workbay Presisi</span>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#242522] leading-[1.08] tracking-tight font-heading"
                >
                  Perawatan kendaraan yang tepat, presisi tanpa kompromi.
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-lg text-[#777871] leading-relaxed max-w-2xl"
                >
                  MELTUNE AUTO menyatukan diagnostik digital terkalibrasi, mekanik spesialis bersertifikasi, dan transparansi pengerjaan penuh untuk setiap kilometer perjalanan Anda.
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  className="pt-2 flex flex-wrap items-center gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2, ease: EASE_LUXURY }}
                  >
                    <Link
                      href={bookingLink}
                      className="bg-[#D96B3A] hover:bg-[#BF582D] text-white px-6 py-3.5 rounded font-medium transition-colors inline-flex items-center gap-2 text-base shadow-sm"
                    >
                      <span>Reservasi Servis</span>
                      <ArrowRight size={16} />
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, ease: EASE_LUXURY }}
                  >
                    <Link
                      href="/produk"
                      className="bg-[#FFFFFF] hover:bg-[#ECEAE4] text-[#242522] border border-[#E4E1D9] px-6 py-3.5 rounded font-medium transition-colors inline-flex items-center gap-2 text-base shadow-2xs"
                    >
                      <span>Eksplor Suku Cadang</span>
                    </Link>
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="pt-6 grid grid-cols-3 gap-6 border-t border-[#E4E1D9] text-left"
                >
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
                </motion.div>
              </motion.div>

              {/* Editorial Hero Visual with smooth entrance */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE_LUXURY, delay: 0.2 }}
                className="lg:col-span-5 relative"
              >
                <div className="aspect-4/3 rounded-lg overflow-hidden border border-[#E4E1D9] shadow-md bg-[#242522] group">
                  <img
                    src="https://images.unsplash.com/photo-1606577924006-27d39b132ae2?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                    alt="MELTUNE AUTO Workshop Workbay"
                    className="w-full h-full object-cover opacity-90 group-hover:scale-106 transition-transform duration-700 ease-out"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -20, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: EASE_LUXURY }}
                  whileHover={{ y: -4, boxShadow: '0 14px 30px rgba(0,0,0,0.09)' }}
                  className="absolute -bottom-6 -left-6 bg-[#FFFFFF] border border-[#E4E1D9] p-4 rounded shadow-lg max-w-xs hidden sm:block cursor-default"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#ECEAE4] flex items-center justify-center text-[#D96B3A]">
                      <Gauge size={22} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#242522]">Kalibrasi Presisi</div>
                      <div className="text-[11px] text-[#777871]">OBD-II, Laser Toe & Camber</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* WORKSHOP INTRODUCTION (3 PILLARS) */}
        <section className="py-20 bg-[#F5F4F0] border-b border-[#E4E1D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: Wrench,
                  title: 'Standar Mekanikal Ketat',
                  desc: 'Setiap torsi baut, volume fluida pengganti, dan celah elektroda busi dikerjakan mengikuti panduan manual servis manufaktur resmi.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Transparansi Visual Masalah',
                  desc: 'Foto dan catatan mekanik diunggah langsung ke akun pelanggan sebelum suku cadang diganti. Tidak ada biaya siluman.',
                },
                {
                  icon: Award,
                  title: 'Suku Cadang & Pelumas Resmi',
                  desc: 'Kami mengoperasikan inventaris resmi Motul, Liqui Moly, Brembo, dan komponen OEM yang tersertifikasi bebas barang tiruan.',
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={fadeInUp}
                    whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE_LUXURY } }}
                    className="bg-[#FFFFFF] p-8 rounded border border-[#E4E1D9] space-y-3 shadow-2xs hover:border-[#D96B3A]/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded bg-[#ECEAE4] flex items-center justify-center text-[#D96B3A]">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-[#242522] font-heading">{item.title}</h3>
                    <p className="text-sm text-[#777871] leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* FEATURED SERVICES */}
        <section className="py-20 bg-[#ECEAE4]/30 border-b border-[#E4E1D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
              className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
            >
              <div>
                <span className="text-xs uppercase tracking-widest text-[#D96B3A] font-semibold">
                  Katalog Workshop
                </span>
                <h2 className="text-3xl font-extrabold text-[#242522] font-heading mt-1">
                  Layanan Servis Terpilih
                </h2>
              </div>
              <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <Link
                  href="/layanan"
                  className="text-sm font-semibold text-[#D96B3A] hover:text-[#BF582D] inline-flex items-center gap-1.5"
                >
                  <span>Lihat Seluruh Layanan</span>
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  title: 'Advanced Engine Tune-Up',
                  category: 'Perawatan Mesin',
                  price: 'Rp 650.000',
                  duration: '90 Menit',
                  desc: 'Pembersihan throttle body, pembacaan live parameter ECU, dan pengecekan emisi.',
                  img: 'https://images.unsplash.com/photo-1646807284302-170c9505b2e7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
                },
                {
                  title: 'Full Synthetic Fluid & Filter',
                  category: 'Servis Berkala',
                  price: 'Rp 850.000',
                  duration: '45 Menit',
                  desc: 'Oli full synthetic ester base, filter OEM baru, serta 24 poin cek keselamatan.',
                  img: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
                },
                {
                  title: 'Precision Brake Overhaul',
                  category: 'Sistem Rem',
                  price: 'Rp 550.000',
                  duration: '75 Menit',
                  desc: 'Flushing minyak rem vakum, pembersihan kaliper, dan instalasi kampas rem OEM.',
                  img: 'https://plus.unsplash.com/premium_photo-1661373022510-dfd61512e080?q=80&w=1231&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
                },
              ].map((srv, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE_LUXURY } }}
                  className="bg-[#FFFFFF] border border-[#E4E1D9] rounded overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
                >
                  <div className="aspect-16/10 overflow-hidden bg-neutral-900">
                    <img
                      src={srv.img}
                      alt={srv.title}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-600 ease-out"
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
                          href={bookingLink}
                          className="text-xs font-semibold text-[#D96B3A] hover:text-[#BF582D] mt-0.5 inline-block"
                        >
                          Booking Slot &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* HOW BOOKING WORKS */}
        <section className="py-20 bg-[#F5F4F0] border-b border-[#E4E1D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
              className="max-w-2xl"
            >
              <span className="text-xs uppercase tracking-widest text-[#D96B3A] font-semibold">
                Alur Pemesanan
              </span>
              <h2 className="text-3xl font-extrabold text-[#242522] font-heading mt-1">
                Cara Reservasi Servis di MELTUNE AUTO
              </h2>
              <p className="text-sm text-[#777871] mt-2">
                Tanpa antrean fisik tidak pasti. Booking waktu kedatangan dan verifikasi teknisi siap di workbay.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
            >
              {[
                { step: '01', title: 'Pilih Kendaraan', desc: 'Pilih mobil yang terdaftar di akun atau tambah kendaraan baru.' },
                { step: '02', title: 'Pilih Paket Servis', desc: 'Tentukan jenis perawatan sesuai kebutuhan jarak tempuh mesin.' },
                { step: '03', title: 'Pilih Jadwal & Slot', desc: 'Sistem membatasi 2 mobil per slot waktu agar pengerjaan fokus.' },
                { step: '04', title: 'Kirim Masalah & Foto', desc: 'Unggah deskripsi gejala serta foto komponen bermasalah.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ y: -5, transition: { duration: 0.25, ease: EASE_LUXURY } }}
                  className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] relative shadow-2xs hover:border-[#D96B3A]/40 transition-colors"
                >
                  <span className="font-heading font-extrabold text-2xl text-[#D96B3A]/30">
                    {item.step}
                  </span>
                  <h4 className="text-base font-bold text-[#242522] font-heading mt-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#777871] mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5, ease: EASE_LUXURY }}
              className="mt-8 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-block"
              >
                <Link
                  href={bookingLink}
                  className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-sm font-semibold px-6 py-3 rounded inline-flex items-center gap-2 shadow-sm transition-colors"
                >
                  <CalendarCheck size={16} />
                  <span>Mulai Reservasi Servis Online</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* LOYALTY & DAILY STREAK BANNER */}
        <section className="py-16 bg-[#242522] text-[#F5F4F0] border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-8 space-y-3">
                <motion.span
                  variants={fadeInUp}
                  className="text-xs uppercase tracking-widest text-[#D96B3A] font-semibold flex items-center gap-1.5"
                >
                  <Sparkles size={14} className="text-[#D96B3A] animate-pulse" />
                  Program Loyalitas MELTUNE AUTO
                </motion.span>
                <motion.h2
                  variants={fadeInUp}
                  className="text-2xl sm:text-3xl font-bold font-heading text-white"
                >
                  Check-in harian. Kumpulkan poin. Tukar reward perawatan.
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  className="text-sm text-neutral-400 max-w-2xl leading-relaxed"
                >
                  Pertahankan streak kunjungan web setiap hari untuk mendapatkan poin bertingkat. Tukarkan poin dengan botol wiper concentrate, kain microfiber 500 GSM, hingga oli mesin genuine tanpa biaya tambahan.
                </motion.p>
              </div>
              <motion.div
                variants={fadeInUp}
                className="lg:col-span-4 flex justify-start lg:justify-end"
              >
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2, ease: EASE_LUXURY }}
                >
                  <Link
                    href={loyaltyLink}
                    className="bg-[#D96B3A] hover:bg-[#BF582D] text-white font-semibold text-sm px-6 py-3.5 rounded transition-colors inline-flex items-center gap-2 shadow-sm"
                  >
                    <span>Buka Dashboard Loyalitas</span>
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 bg-[#F5F4F0] border-b border-[#E4E1D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
              className="max-w-2xl mb-12"
            >
              <span className="text-xs uppercase tracking-widest text-[#D96B3A] font-semibold">
                Testimoni Pengguna
              </span>
              <h2 className="text-3xl font-extrabold text-[#242522] font-heading mt-1">
                Dipercaya Pemilik Kendaraan Harian & Antusias
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  quote: 'Bawa Civic Turbo ke MELTUNE AUTO karena ada getaran rem pada kecepatan tinggi. Mekanik menjelaskan runout rotor dengan micrometer gauge sebelum ambil tindakan bubut.',
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
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE_LUXURY } }}
                  className="bg-[#FFFFFF] p-8 rounded border border-[#E4E1D9] flex flex-col justify-between space-y-6 shadow-2xs hover:border-[#D96B3A]/40 transition-colors"
                >
                  <p className="text-sm text-[#777871] leading-relaxed italic">
                    "{t.quote}"
                  </p>
                  <div className="pt-4 border-t border-[#E4E1D9]">
                    <div className="text-sm font-bold text-[#242522] font-heading">{t.name}</div>
                    <div className="text-xs text-[#D96B3A]">{t.car}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 bg-[#ECEAE4]/60">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInScale}
            className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#242522] font-heading">
              Siap merasakan standar perawatan kendaraan yang sesungguhnya?
            </h2>
            <p className="text-base text-[#777871] max-w-xl mx-auto">
              Jadwalkan servis Anda hari ini di workbay kami atau konsultasikan gejala kendala mobil Anda langsung dengan teknisi kepala MELTUNE AUTO.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={bookingLink}
                  className="bg-[#D96B3A] hover:bg-[#BF582D] text-white px-8 py-3.5 rounded font-semibold text-sm transition-colors shadow-sm inline-block"
                >
                  Reservasi Jadwal Servis
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/kontak"
                  className="bg-[#FFFFFF] hover:bg-[#ECEAE4] text-[#242522] border border-[#E4E1D9] px-8 py-3.5 rounded font-semibold text-sm transition-colors shadow-2xs inline-block"
                >
                  Hubungi via WhatsApp
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
