'use client';

import { useState, useEffect } from 'react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { api } from '@/services';
import { SupportThread } from '@/types';
import { MessageSquare, Send, CheckCircle2, Plus, X } from 'lucide-react';

export default function CustomerSupportPage() {
  const [threads, setThreads] = useState<SupportThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const [newSubject, setNewSubject] = useState('');
  const [newVehicle, setNewVehicle] = useState('Honda Civic Turbo 2021');
  const [newInitialMsg, setNewInitialMsg] = useState('');

  const loadThreads = () => {
    api.support.getThreads().then(t => {
      setThreads(t);
      if (!activeThreadId && t.length > 0) setActiveThreadId(t[0].id);
    });
  };

  useEffect(() => {
    loadThreads();
  }, []);

  const activeThread = threads.find(t => t.id === activeThreadId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThreadId || !newMessage.trim()) return;
    await api.support.sendMessage(activeThreadId, newMessage);
    setNewMessage('');
    loadThreads();
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newInitialMsg.trim()) return;
    const created = await api.support.createThread(newSubject, newVehicle, newInitialMsg);
    setShowNewModal(false);
    setNewSubject('');
    setNewInitialMsg('');
    loadThreads();
    setActiveThreadId(created.id);
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
              Forum Dukungan & Konsultasi Mekanik
            </h1>
            <p className="text-xs text-[#777871] mt-0.5">
              Tanyakan langsung kendala teknis mobil Anda ke tim mekanik kepala MELTUNE AUTO.
            </p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-4 py-2.5 rounded transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <Plus size={15} />
            <span>Buat Topik Baru</span>
          </button>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E4E1D9] rounded overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
          {/* Threads List Sidebar */}
          <div className="md:col-span-4 border-r border-[#E4E1D9] flex flex-col">
            <div className="p-4 border-b border-[#E4E1D9] bg-[#F5F4F0] text-xs font-bold text-[#242522]">
              Diskusi Aktif ({threads.length})
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
                      <span className="text-[10px] font-semibold text-[#D96B3A] uppercase tracking-wider">
                        {t.status}
                      </span>
                      <span className="text-[10px] text-[#777871]">
                        {new Date(t.lastActivity).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#242522] mt-1 line-clamp-1">{t.subject}</h4>
                    <p className="text-[11px] text-[#777871] mt-0.5">{t.vehicleModel}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Conversation Chat Window */}
          <div className="md:col-span-8 flex flex-col justify-between">
            {activeThread ? (
              <>
                <div className="p-4 border-b border-[#E4E1D9] bg-[#FFFFFF] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#242522]">{activeThread.subject}</h3>
                    <div className="text-[11px] text-[#777871]">Mobil: {activeThread.vehicleModel}</div>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded capitalize bg-[#ECEAE4] text-[#242522]">
                    Status: {activeThread.status}
                  </span>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto flex-1 max-h-[400px] bg-[#F5F4F0]/40">
                  {activeThread.messages.map(m => {
                    const isMe = m.senderRole === 'customer';
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="text-[10px] text-[#777871] mb-1">
                          {m.senderName} ({m.senderRole})
                        </div>
                        <div
                          className={`max-w-md p-3.5 rounded text-xs leading-relaxed ${
                            isMe
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
                <form onSubmit={handleSendMessage} className="p-4 border-t border-[#E4E1D9] bg-[#FFFFFF] flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Tulis balasan atau penjelasan tambahan untuk teknisi..."
                    className="flex-1 px-3 py-2 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                  />
                  <button
                    type="submit"
                    className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-4 py-2 rounded transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Kirim</span>
                    <Send size={13} />
                  </button>
                </form>
              </>
            ) : (
              <div className="p-12 text-center text-xs text-[#777871]">
                Pilih atau buat topik diskusi konsultasi mekanik.
              </div>
            )}
          </div>
        </div>

        {/* Modal Create New Thread */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] border border-[#E4E1D9] rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4E1D9]">
                <h3 className="text-base font-bold text-[#242522] font-heading">
                  Mulai Topik Diskusi Servis Baru
                </h3>
                <button onClick={() => setShowNewModal(false)} className="text-[#777871]">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateThread} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#242522] mb-1">Subjek Pertanyaan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bunyi decit saat pengereman kecepatan rendah"
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#242522] mb-1">Model Mobil Terkait</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Honda Civic Turbo 2021"
                    value={newVehicle}
                    onChange={e => setNewVehicle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#242522] mb-1">Pertanyaan / Keluhan Lengkap</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ceritakan sedetail mungkin..."
                    value={newInitialMsg}
                    onChange={e => setNewInitialMsg(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                  />
                </div>

                <div className="pt-3 border-t border-[#E4E1D9] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    className="px-4 py-2 text-[#777871]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-[#D96B3A] hover:bg-[#BF582D] text-white font-semibold px-4 py-2 rounded"
                  >
                    Kirim ke Tim Mekanik
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
