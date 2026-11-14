import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { Target, Compass, Award, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-widest text-[#D96B3A] font-semibold">
              Tentang TORSI Workshop
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#242522] font-heading mt-2 leading-tight">
              Presisi Mekanikal Tanpa Kompromi untuk Setiap Kilometer.
            </h1>
            <p className="text-base text-[#777871] mt-4 leading-relaxed">
              Nama <strong>TORSI</strong> terinspirasi dari torsi putaran mesin, manifestasi daya mekanikal murni, akurasi setelan, dan transfer tenaga sempurna ke aspal. Kami mendirikan workshop ini sebagai antitesis terhadap bengkel tradisional yang minim transparansi dan manipulatif.
            </p>
          </div>

          {/* Workshop Story & Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 rounded overflow-hidden border border-[#E4E1D9] aspect-4/3 bg-neutral-900">
              <img
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1200"
                alt="Fasilitas Workshop TORSI"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-6 space-y-6 text-[#242522]">
              <h2 className="text-2xl font-bold font-heading">
                Satu Workshop Fisik Terpusat di BSD, Tangerang Selatan
              </h2>
              <p className="text-sm text-[#777871] leading-relaxed">
                TORSI bukan platform marketplace perantara bengkel abal-abal. Kami beroperasi secara nyata dengan workshop tunggal seluas 850 m² yang dilengkapi empat lift workbay hidrolik berkekuatan 4 ton, peralatan laser wheel aligner digital Corghi, dan scanner diagnostik OEM level pabrikan.
              </p>
              <p className="text-sm text-[#777871] leading-relaxed">
                Setiap mekanik yang menangani mobil Anda adalah teknisi tetap bersertifikasi yang wajib mematuhi lembar kerja inspeksi 48 poin dan kalibrasi torsi torsi-kunci sebelum kendaraan diserahterimakan.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="pt-8 border-t border-[#E4E1D9]">
            <h2 className="text-2xl font-bold text-[#242522] font-heading mb-8">
              Pilar Utama Operasional Kami
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] space-y-3">
                <Target size={24} className="text-[#D96B3A]" />
                <h3 className="text-base font-bold font-heading text-[#242522]">Spesifikasi Tepat</h3>
                <p className="text-xs text-[#777871] leading-relaxed">
                  Tidak ada istilah perkiraan feeling. Volume oli, nilai viskositas, dan tekanan psi ban disetel sesuai buku manual resmi.
                </p>
              </div>

              <div className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] space-y-3">
                <Shield size={24} className="text-[#D96B3A]" />
                <h3 className="text-base font-bold font-heading text-[#242522]">Transparansi Biaya</h3>
                <p className="text-xs text-[#777871] leading-relaxed">
                  Estimasi harga dan foto komponen aus disetujui pelanggan di dashboard sebelum baut pertama dilepas.
                </p>
              </div>

              <div className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] space-y-3">
                <Award size={24} className="text-[#D96B3A]" />
                <h3 className="text-base font-bold font-heading text-[#242522]">Keaslian Terjamin</h3>
                <p className="text-xs text-[#777871] leading-relaxed">
                  Hanya menggunakan fluida serta suku cadang genuine dengan distributor terdaftar resmi di Indonesia.
                </p>
              </div>

              <div className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] space-y-3">
                <Compass size={24} className="text-[#D96B3A]" />
                <h3 className="text-base font-bold font-heading text-[#242522]">Dukungan Langsung</h3>
                <p className="text-xs text-[#777871] leading-relaxed">
                  Forum konsultasi real-time langsung dijawab oleh mekanik kepala, bukan staf call center umum.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-[#ECEAE4] p-8 rounded border border-[#E4E1D9] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold font-heading text-[#242522]">
                Ingin berkunjung atau servis kendaraan Anda?
              </h3>
              <p className="text-xs text-[#777871] mt-1">
                Pilih slot servis hari ini agar kendaraan langsung masuk lift tanpa antrean.
              </p>
            </div>
            <Link
              href="/pelanggan/booking"
              className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-6 py-3 rounded transition-colors shrink-0"
            >
              Reservasi Jadwal Servis
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
