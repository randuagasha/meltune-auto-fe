'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/services';
import { RewardItem } from '@/types';
import { Sparkles, Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminLoyaltyPage() {
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [basePoints, setBasePoints] = useState(15);
  const [streakMultiplier, setStreakMultiplier] = useState(5);
  const [savedSettings, setSavedSettings] = useState(false);

  useEffect(() => {
    api.loyalty.getRewards().then(setRewards);
  }, []);

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
            Pengaturan Program Loyalitas & Reward Pelanggan
          </h1>
          <p className="text-xs text-[#777871] mt-0.5">
            Konfigurasi formula poin daily streak dan inventaris reward produk perawatan mobil.
          </p>
        </div>

        {savedSettings && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Pengaturan aturan streak loyalitas berhasil disimpan.</span>
          </div>
        )}

        {/* Rule Config */}
        <div className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] max-w-xl space-y-4">
          <h2 className="text-base font-bold text-[#242522] font-heading flex items-center gap-2">
            <Sparkles size={16} className="text-[#D96B3A]" />
            <span>Formula Poin Daily Streak</span>
          </h2>

          <form onSubmit={handleSaveRules} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#242522] mb-1">
                  Poin Dasar Per Check-In
                </label>
                <input
                  type="number"
                  value={basePoints}
                  onChange={e => setBasePoints(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded font-bold text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#242522] mb-1">
                  Pengali Bonus Streak (Per Hari)
                </label>
                <input
                  type="number"
                  value={streakMultiplier}
                  onChange={e => setStreakMultiplier(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded font-bold text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                />
              </div>
            </div>

            <p className="text-[11px] text-[#777871]">
              Contoh: Pelanggan streak 5 hari berturut-turut akan mendapatkan {basePoints} + (5 × {streakMultiplier}) = {basePoints + 5 * streakMultiplier} poin pada hari ke-5.
            </p>

            <button
              type="submit"
              className="bg-[#242522] hover:bg-[#383a35] text-white font-semibold px-4 py-2 rounded transition-colors"
            >
              Simpan Parameter Streak
            </button>
          </form>
        </div>

        {/* Rewards List */}
        <div className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] space-y-4">
          <h2 className="text-base font-bold text-[#242522] font-heading">
            Daftar Produk Reward yang Dapat Ditukarkan Pelanggan
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rewards.map(r => (
              <div key={r.id} className="p-4 bg-[#F5F4F0] rounded border border-[#E4E1D9] space-y-2 text-xs">
                <div className="aspect-video bg-neutral-900 rounded overflow-hidden">
                  <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-[#242522] line-clamp-1">{r.title}</h4>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-extrabold text-[#D96B3A]">{r.pointsCost} Poin</span>
                  <span className="text-[#777871]">Stok: {r.stock} Unit</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
