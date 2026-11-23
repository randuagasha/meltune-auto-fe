'use client';

import { useState, useEffect } from 'react';
import { MechanicLayout } from '@/components/layout/MechanicLayout';
import { api } from '@/services';
import { SupportThread } from '@/types';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function MechanicSupportPage() {
  const [threads, setThreads] = useState<SupportThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const loadThreads = () => {
    api.support.getThreads().then(t => {
      setThreads(t);
      if (!activeThreadId && t.length > 0) setActiveThreadId(t[0].id);
    }).catch(() => {});
  };

  useEffect(() => {
    loadThreads();
  }, []);

  const activeThread = threads.find(t => t.id === activeThreadId);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThreadId || !replyText.trim()) return;
    await api.support.sendMessage(activeThreadId, replyText);
    setReplyText('');
    loadThreads();
  };

  const handleToggleResolve = async (id: string, currentStatus: SupportThread['status']) => {
    const nextStatus = currentStatus === 'resolved' ? 'in_progress' : 'resolved';
    await api.support.updateStatus(id, nextStatus);
    loadThreads();
  };

  return (
    <MechanicLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
            Pusat Konsultasi Teknis & Tanya Mekanik
          </h1>
          <p className="text-xs text-[#777871] mt-0.5">
            Jawab langsung pertanyaan pelanggan seputar indikator dashboard, jadwal servis, dan rekomendasi fluida mobil.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E4E1D9] rounded overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
          {/* Threads List */}
          <div className="md:col-span-4 border-r border-[#E4E1D9] flex flex-col">
            <div className="p-4 border-b border-[#E4E1D9] bg-[#F5F4F0] text-xs font-bold text-[#242522]">
              Semua Pertanyaan Pelanggan ({threads.length})
            </div>
            <div className="divide-y divide-[#E4E1D9] overflow-y-auto flex-1 max-h-[500px]">
              {threads.map(t => {
                const isSelected = activeThreadId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveThreadId(t.id)}
                    className={`w-full text-left p-4 transition-colors block ${
                      isSelected ? 'bg-orange-50/50 border-l-4 border-l-[#D96B3A]' : 'hover:bg-[#F5F4F0]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#242522]">{t.customerName}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded capitalize ${
                          t.status === 'resolved'
                            ? 'bg-neutral-100 text-[#777871]'
                            : t.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-[#D96B3A] mt-1 line-clamp-1">
                      {t.subject}
                    </div>
                    <p className="text-[10px] text-[#777871] mt-0.5">{t.vehicleModel}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Pane */}
          <div className="md:col-span-8 flex flex-col justify-between">
            {activeThread ? (
              <>
                <div className="p-4 border-b border-[#E4E1D9] bg-[#FFFFFF] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#242522]">{activeThread.subject}</h3>
                    <div className="text-[11px] text-[#777871]">
                      Pelanggan: <span className="font-semibold text-[#242522]">{activeThread.customerName}</span> ({activeThread.vehicleModel})
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleResolve(activeThread.id, activeThread.status)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1.5 ${
                      activeThread.status === 'resolved'
                        ? 'bg-neutral-200 text-[#242522]'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <CheckCircle2 size={13} />
                    <span>{activeThread.status === 'resolved' ? 'Buka Kembali' : 'Tandai Selesai'}</span>
                  </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto flex-1 max-h-[400px] bg-[#F5F4F0]/40">
                  {activeThread.messages.map(m => {
                    const isMechanic = m.senderRole === 'mechanic' || m.senderRole === 'superadmin';
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMechanic ? 'items-end' : 'items-start'}`}
                      >
                        <div className="text-[10px] text-[#777871] mb-1">
                          {m.senderName} ({m.senderRole})
                        </div>
                        <div
                          className={`max-w-md p-3.5 rounded text-xs leading-relaxed ${
                            isMechanic
                              ? 'bg-[#242522] text-[#F5F4F0]'
                              : 'bg-[#FFFFFF] border border-[#E4E1D9] text-[#242522]'
                          }`}
                        >
                          {m.content}
                        </div>
                        <div className="text-[9px] text-[#777871] mt-1">
                          {new Date(m.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="p-4 border-t border-[#E4E1D9] bg-[#FFFFFF] flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Berikan saran teknis / diagnosa resmi..."
                    className="flex-1 px-3 py-2 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                  />
                  <button
                    type="submit"
                    className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-4 py-2 rounded transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Balas</span>
                    <Send size={13} />
                  </button>
                </form>
              </>
            ) : (
              <div className="p-12 text-center text-xs text-[#777871]">
                Pilih topik diskusi pelanggan untuk merespon.
              </div>
            )}
          </div>
        </div>
      </div>
    </MechanicLayout>
  );
}
