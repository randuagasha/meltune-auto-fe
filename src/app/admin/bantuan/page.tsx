'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/services';
import { SupportThread } from '@/types';
import { MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AdminSupportAuditPage() {
  const [threads, setThreads] = useState<SupportThread[]>([]);

  useEffect(() => {
    api.support.getThreads().then(setThreads);
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
            Audit Forum Dukungan & Konsultasi Mekanik
          </h1>
          <p className="text-xs text-[#777871] mt-0.5">
            Superadmin mengawasi seluruh interaksi percakapan konsultasi antara pelanggan dan tim teknisi TORSI.
          </p>
        </div>

        <div className="space-y-4">
          {threads.map(t => (
            <div
              key={t.id}
              className="bg-[#FFFFFF] border border-[#E4E1D9] rounded p-6 space-y-4 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E4E1D9]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#242522]">{t.subject}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded capitalize ${
                        t.status === 'resolved'
                          ? 'bg-neutral-100 text-[#777871]'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#777871] mt-0.5">
                    Pelanggan: <span className="font-semibold text-[#242522]">{t.customerName}</span> • Model: {t.vehicleModel}
                  </div>
                </div>
                <span className="text-[#777871]">
                  Aktivitas: {new Date(t.lastActivity).toLocaleDateString('id-ID')}
                </span>
              </div>

              {/* Message History Accordion */}
              <div className="space-y-2 bg-[#F5F4F0] p-4 rounded max-h-48 overflow-y-auto">
                {t.messages.map(m => (
                  <div key={m.id} className="text-[11px] leading-relaxed">
                    <span className="font-bold text-[#242522]">
                      {m.senderName} ({m.senderRole}):{' '}
                    </span>
                    <span className="text-[#242522]">{m.content}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
