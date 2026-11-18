'use client';

import { useState, useEffect } from 'react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { api } from '@/services';
import { LoyaltyProfile, RewardItem } from '@/types';
import { Sparkles, Flame, Gift, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CustomerLoyaltyPage() {
  const [loyalty, setLoyalty] = useState<LoyaltyProfile | null>(null);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = () => {
    api.loyalty.getProfile().then(setLoyalty);
    api.loyalty.getRewards().then(setRewards);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDailyCheckIn = async () => {
    setLoading(true);
    const res = await api.loyalty.checkIn();
    setLoading(false);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setLoyalty(res.profile);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleRedeem = async (rewardId: string) => {
    const res = await api.loyalty.redeem(rewardId);
    if (res.success) {
      setFeedback({
        type: 'success',
        message: `${res.message}! Kode Voucher Anda: ${res.code}`,
      });
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <CustomerLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
            Loyalitas & Daily Streak MELTUNE AUTO
          </h1>
          <p className="text-xs text-[#777871] mt-0.5">
            Dapatkan reward suku cadang dan produk perawatan terjangkau dengan menjaga streak harian Anda.
          </p>
        </div>

        {feedback && (
          <div
            className={`text-xs px-4 py-3 rounded flex items-center gap-2 border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Top Cards: Streak & Balance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Flame size={24} />
            </div>
            <div>
              <div className="text-xs text-[#777871]">Streak Aktif</div>
              <div className="text-2xl font-extrabold text-[#242522] font-heading">
                {loyalty?.currentStreak || 0} Hari
              </div>
              <div className="text-[11px] text-[#777871]">Rekor terpanjang: {loyalty?.longestStreak || 0} hari</div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-orange-50 text-[#D96B3A] flex items-center justify-center shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <div className="text-xs text-[#777871]">Saldo Poin Tersedia</div>
              <div className="text-2xl font-extrabold text-[#242522] font-heading">
                {loyalty?.points || 0} Poin
              </div>
              <div className="text-[11px] text-[#777871]">Siap ditukar suku cadang</div>
            </div>
          </div>

          <div className="bg-[#242522] text-[#F5F4F0] p-6 rounded border border-neutral-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400">Tombol Check-in Harian</span>
              <span className="text-[10px] text-neutral-400">Reset 00:00 WIB</span>
            </div>
            <button
              onClick={handleDailyCheckIn}
              disabled={loading}
              className="mt-4 bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold py-2.5 rounded transition-colors text-center disabled:opacity-50"
            >
              {loading ? 'Menghitung Streak...' : 'Lakukan Check-In Hari Ini'}
            </button>
          </div>
        </div>

        {/* Rewards Catalog */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#242522] font-heading">
              Katalog Penukaran Reward Perawatan (Affordable Products)
            </h2>
            <p className="text-xs text-[#777871]">
              Poin dipotong langsung dari saldo akun Anda setelah konfirmasi penukaran.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewards.map(r => {
              const canAfford = (loyalty?.points || 0) >= r.pointsCost && r.stock > 0;
              return (
                <div
                  key={r.id}
                  className="bg-[#FFFFFF] border border-[#E4E1D9] rounded overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-square bg-neutral-900 overflow-hidden relative">
                      <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-[#242522]/80 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        Sisa: {r.stock}
                      </div>
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h4 className="text-xs font-bold text-[#242522] line-clamp-1">{r.title}</h4>
                      <p className="text-[11px] text-[#777871] line-clamp-2 leading-relaxed">
                        {r.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <div className="pt-3 border-t border-[#E4E1D9] flex items-center justify-between">
                      <span className="text-xs font-bold text-[#D96B3A] font-heading">
                        {r.pointsCost} Poin
                      </span>
                      <button
                        disabled={!canAfford}
                        onClick={() => handleRedeem(r.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${
                          canAfford
                            ? 'bg-[#242522] hover:bg-[#383a35] text-white'
                            : 'bg-[#ECEAE4] text-[#777871] cursor-not-allowed'
                        }`}
                      >
                        {r.stock === 0 ? 'Habis' : 'Tukar Voucher'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Redemption History */}
        <div className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] space-y-4">
          <h2 className="text-base font-bold text-[#242522] font-heading">
            Riwayat Klaim & Voucher Reward
          </h2>

          {loyalty?.redemptionHistory.length === 0 ? (
            <div className="text-xs text-[#777871] text-center py-4">Belum ada penukaran reward sebelumnya.</div>
          ) : (
            <div className="space-y-3">
              {loyalty?.redemptionHistory.map(item => (
                <div
                  key={item.id}
                  className="p-3 bg-[#F5F4F0] border border-[#E4E1D9] rounded flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-[#242522]">{item.rewardTitle}</div>
                    <div className="text-[#777871] text-[11px]">
                      Klaim: {new Date(item.redeemedAt).toLocaleDateString('id-ID')} (-{item.pointsSpent} Poin)
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold bg-[#ECEAE4] px-2.5 py-1 rounded text-[#D96B3A]">
                      {item.code}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}
