'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/services';
import { ServiceItem } from '@/types';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    api.services.getAll().then(setServices);
  }, []);

  const categories = [
    { id: 'all', label: 'Semua Layanan' },
    { id: 'maintenance', label: 'Perawatan Berkala' },
    { id: 'diagnostics', label: 'Diagnostik & ECU' },
    { id: 'repair', label: 'Sistem Rem & Suspensi' },
    { id: 'detailing', label: 'Sirkulasi & AC' },
  ];

  const filtered = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <>
      <Header />
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-2xl mb-10">
            <span className="text-xs uppercase tracking-widest text-[#D96B3A] font-semibold">
              Katalog Layanan MELTUNE AUTO
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#242522] font-heading mt-1">
              Presisi Mekanikal untuk Setiap Komponen
            </h1>
            <p className="text-sm text-[#777871] mt-2 leading-relaxed">
              Seluruh pengerjaan dijalankan menggunakan alat diagnostik standar pabrikan, spesifikasi torsi presisi, dan teknisi spesialis bersertifikasi.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-[#E4E1D9]">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-semibold rounded transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#242522] text-[#F5F4F0]'
                    : 'bg-[#ECEAE4] text-[#242522] hover:bg-[#E4E1D9]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(srv => (
              <div
                key={srv.id}
                className="bg-[#FFFFFF] border border-[#E4E1D9] rounded overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="aspect-16/10 overflow-hidden bg-neutral-900">
                    <img
                      src={srv.imageUrl || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800'}
                      alt={srv.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#D96B3A] font-semibold uppercase tracking-wider">
                        {srv.category}
                      </span>
                      <span className="text-xs text-[#777871] flex items-center gap-1">
                        <Clock size={12} />
                        {srv.estimatedDurationMinutes} Menit
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#242522] font-heading">
                      {srv.name}
                    </h3>
                    <p className="text-sm text-[#777871] leading-relaxed">
                      {srv.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-[#E4E1D9] flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-[#777871]">Biaya Servis</div>
                      <div className="text-lg font-extrabold text-[#242522] font-heading">
                        Rp {srv.price.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <Link
                      href={`/pelanggan/booking?service=${srv.id}`}
                      className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-4 py-2.5 rounded transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Booking Layanan</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Workshop Warranty note */}
          <div className="mt-16 bg-[#ECEAE4]/60 border border-[#E4E1D9] p-6 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={24} className="text-[#D96B3A] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#242522] font-heading">
                  Garansi Pengerjaan & Suku Cadang Asli
                </h4>
                <p className="text-xs text-[#777871] mt-0.5">
                  Seluruh pekerjaan bengkel MELTUNE AUTO dilindungi garansi 14 hari atau 1.000 km kalibrasi ulang tanpa biaya tambahan.
                </p>
              </div>
            </div>
            <Link
              href="/kontak"
              className="text-xs font-semibold text-[#242522] underline hover:text-[#D96B3A] shrink-0"
            >
              Konsultasi Teknis &rarr;
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
