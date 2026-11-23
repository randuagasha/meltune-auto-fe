'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/services';
import { RewardItem } from '@/types';
import { Sparkles, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminLoyaltyPage() {
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [basePoints, setBasePoints] = useState(15);
  const [streakMultiplier, setStreakMultiplier] = useState(5);
  const [maxBonus, setMaxBonus] = useState(25);
  const [loading, setLoading] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    api.loyalty.getRewards().then(setRewards).catch(() => {});
    api.admin.getSettings().then(data => {
      if (data) {
        if (data.dailyCheckInBasePoints !== undefined) setBasePoints(data.dailyCheckInBasePoints);
        if (data.dailyStreakBonusMultiplier !== undefined) setStreakMultiplier(data.dailyStreakBonusMultiplier);
        if (data.maxStreakBonusPoints !== undefined) setMaxBonus(data.maxStreakBonusPoints);
      }
    }).catch(() => {});
  }, []);

  const handleSaveRules = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      await api.admin.updateSettings({
        dailyCheckInBasePoints: basePoints,
        dailyStreakBonusMultiplier: streakMultiplier,
        maxStreakBonusPoints: maxBonus,
      });
      setSavedSettings(true);
      setTimeout(() => setSavedSettings(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan aturan loyalitas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
            Pengaturan Program Loyalitas & Reward Pelanggan
          </h1>
          <p className="text-xs text-[#777871] mt-0.5">
            Konfigurasi formula poin daily streak yang tersimpan di Supabase `workshop_settings` dan katalog reward.
          </p>
        </div>

        {savedSettings && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Pengaturan aturan streak loyalitas berhasil disimpan ke database.</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Rule Config */}
        <div className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] max-w-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E4E1D9]">
            <Sparkles size={16} className="text-[#D96B3A]" />
            <h3 className="text-sm font-bold text-[#242522] font-heading">
              Formula Kalkulasi Poin Check-in Harian
            </h3>
          </div>

          <form onSubmit={handleSaveRules} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#242522] mb-1">
                Base Poin Check-in Per Hari
              </label>
              <input
                type="number"
                min={1}
                value={basePoints}
                onChange={e => setBasePoints(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
              />
              <span className="text-[10px] text-[#777871] mt-0.5 block">
                Poin dasar yang diterima pelanggan pada hari pertama check-in.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-[#242522] mb-1">
                Pengali Bonus Streak Berturut-turut
              </label>
              <input
                type="number"
                min={1}
                value={streakMultiplier}
                onChange={e => setStreakMultiplier(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
              />
              <span className="text-[10px] text-[#777871] mt-0.5 block">
                Tambahan poin per hari streak berturut-turut (Streak Hari × Pengali).
              </span>
            </div>

            <div>
              <label className="block font-semibold text-[#242522] mb-1">
                Batas Maksimal Bonus Streak (Cap)
              </label>
              <input
                type="number"
                min={1}
                value={maxBonus}
                onChange={e => setMaxBonus(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
              />
              <span className="text-[10px] text-[#777871] mt-0.5 block">
                Maksimal bonus streak yang bisa diraih pelanggan per hari.
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#D96B3A] hover:bg-[#BF582D] text-white font-semibold px-5 py-2.5 rounded transition-colors inline-flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={14} />
                <span>{loading ? 'Menyimpan...' : 'Simpan Parameter Poin'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Rewards Catalog View */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#242522] font-heading">
            Daftar Barang Reward Aktif di Workshop ({rewards.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rewards.map(r => (
              <div
                key={r.id}
                className="bg-[#FFFFFF] border border-[#E4E1D9] rounded p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="aspect-video bg-neutral-900 rounded overflow-hidden">
                    <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-xs font-bold text-[#242522] line-clamp-1">{r.title}</h4>
                  <p className="text-[11px] text-[#777871] line-clamp-2 leading-relaxed">
                    {r.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E4E1D9] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#D96B3A] font-heading">{r.pointsCost} Poin</span>
                  <span className="text-[#777871] text-[11px]">Sisa Stok: {r.stock}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
