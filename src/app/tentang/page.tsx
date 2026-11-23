'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { Target, Compass, Award, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { EASE_LUXURY, fadeInUp, staggerContainer, fadeInScale } from '@/lib/motion';

export default function AboutPage() {
  const { user } = useAuth();
  const bookingLink = user ? '/pelanggan/booking' : '/auth/login?redirect=/pelanggan/booking';

  return (
    <>
      <Header />
      <main className="flex-1 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_LUXURY }}
            className="max-w-3xl"
          >
            <span className="text-xs uppercase tracking-widest text-[#D96B3A] font-semibold">
              Tentang MELTUNE AUTO Workshop
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#242522] font-heading mt-2 leading-tight">
              Presisi Mekanikal Tanpa Kompromi untuk Setiap Kilometer.
            </h1>
            <p className="text-base text-[#777871] mt-4 leading-relaxed">
              <strong>MELTUNE AUTO</strong> hadir untuk memberikan standar perawatan kendaraan tertinggi dengan manifestasi daya mekanikal murni, akurasi setelan, dan transfer tenaga sempurna ke aspal. Kami mendirikan workshop ini sebagai antitesis terhadap bengkel tradisional yang minim transparansi dan manipulatif.
            </p>
          </motion.div>

          {/* Workshop Story & Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE_LUXURY }}
              className="lg:col-span-6 rounded overflow-hidden border border-[#E4E1D9] aspect-4/3 bg-neutral-900 group shadow-md"
            >
              <img
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1200"
                alt="Fasilitas Workshop MELTUNE AUTO"
                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE_LUXURY }}
              className="lg:col-span-6 space-y-6 text-[#242522]"
            >
              <h2 className="text-2xl font-bold font-heading">
                Satu Workshop Fisik Terpusat di BSD, Tangerang Selatan
              </h2>
              <p className="text-sm text-[#777871] leading-relaxed">
                MELTUNE AUTO bukan platform marketplace perantara bengkel abal-abal. Kami beroperasi secara nyata dengan workshop tunggal seluas 850 m² yang dilengkapi empat lift servis hidrolik berkekuatan 4 ton, peralatan laser wheel aligner digital Corghi, dan scanner diagnostik OEM level pabrikan.
              </p>
              <p className="text-sm text-[#777871] leading-relaxed">
                Setiap mekanik yang menangani mobil Anda adalah teknisi tetap bersertifikasi yang wajib mematuhi lembar kerja inspeksi 48 poin dan kalibrasi torsi kunci sebelum kendaraan diserahterimakan.
              </p>
            </motion.div>
          </div>

          {/* Core Values */}
          <div className="pt-8 border-t border-[#E4E1D9]">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-[#242522] font-heading mb-8"
            >
              Pilar Utama Operasional Kami
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              {[
                {
                  icon: Target,
                  title: 'Spesifikasi Tepat',
                  desc: 'Tidak ada istilah perkiraan feeling. Volume oli, nilai viskositas, dan tekanan psi ban disetel sesuai buku manual resmi.',
                },
                {
                  icon: Shield,
                  title: 'Transparansi Biaya',
                  desc: 'Estimasi harga dan foto komponen aus disetujui pelanggan di dashboard sebelum baut pertama dilepas.',
                },
                {
                  icon: Award,
                  title: 'Keaslian Terjamin',
                  desc: 'Hanya menggunakan fluida serta suku cadang genuine dengan distributor terdaftar resmi di Indonesia.',
                },
                {
                  icon: Compass,
                  title: 'Dukungan Langsung',
                  desc: 'Forum konsultasi real-time langsung dijawab oleh mekanik kepala, bukan staf call center umum.',
                },
              ].map((val, idx) => {
                const Icon = val.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={fadeInUp}
                    whileHover={{ y: -6, transition: { duration: 0.25, ease: EASE_LUXURY } }}
                    className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] space-y-3 shadow-2xs hover:border-[#D96B3A]/40 transition-colors"
                  >
                    <Icon size={24} className="text-[#D96B3A]" />
                    <h3 className="text-base font-bold font-heading text-[#242522]">{val.title}</h3>
                    <p className="text-xs text-[#777871] leading-relaxed">
                      {val.desc}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE_LUXURY }}
            className="bg-[#ECEAE4] p-8 rounded border border-[#E4E1D9] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs"
          >
            <div>
              <h3 className="text-xl font-bold font-heading text-[#242522]">
                Ingin berkunjung atau servis kendaraan Anda?
              </h3>
              <p className="text-xs text-[#777871] mt-1">
                Pilih slot servis hari ini agar kendaraan langsung masuk lift tanpa antrean.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={bookingLink}
                className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-6 py-3 rounded transition-colors shrink-0 shadow-sm inline-block"
              >
                Reservasi Jadwal Servis
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
