'use client';

import { useState, useEffect } from 'react';
import { MechanicLayout } from '@/components/layout/MechanicLayout';
import { api } from '@/services';
import { ServiceItem } from '@/types';
import { Clock, Layers, ShieldCheck } from 'lucide-react';

export default function MechanicServicesViewPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    api.services.getAll().then(setServices);
  }, []);

  return (
    <MechanicLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
            Daftar Servis Workshop & Prosedur Operasional
          </h1>
          <p className="text-xs text-[#777871] mt-0.5">
            Daftar paket pengerjaan resmi TORSI. Pengaturan harga dan penambahan layanan berada di bawah wewenang superadmin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(s => (
            <div
              key={s.id}
              className="bg-[#FFFFFF] border border-[#E4E1D9] rounded overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/10 bg-neutral-900 overflow-hidden">
                  <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#D96B3A] uppercase tracking-wider text-[10px]">
                      {s.category}
                    </span>
                    <span className="text-[#777871] flex items-center gap-1 text-[11px]">
                      <Clock size={12} />
                      {s.estimatedDurationMinutes} Menit
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#242522]">{s.name}</h3>
                  <p className="text-xs text-[#777871] leading-relaxed">{s.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-[#E4E1D9] flex items-center justify-between text-xs">
                  <span className="text-[#777871]">Tarif Konsumen</span>
                  <span className="font-bold text-[#242522] font-heading">
                    Rp {s.price.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MechanicLayout>
  );
}
