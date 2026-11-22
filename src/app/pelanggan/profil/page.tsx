'use client';

import { useState, useEffect } from 'react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/services';
import { User, Phone, Mail, Shield, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function CustomerProfilePage() {
  const { user, refreshUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      await api.auth.updateProfile({ fullName, phone });
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal menyimpan pembaruan profil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
            Profil Akun Pelanggan
          </h1>
          <p className="text-xs text-[#777871] mt-0.5">
            Informasi identitas untuk konfirmasi booking dan penjemputan suku cadang workshop.
          </p>
        </div>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Profil berhasil diperbarui.</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-xs px-4 py-3 rounded flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="bg-[#FFFFFF] p-8 rounded border border-[#E4E1D9] space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#242522] text-[#F5F4F0] flex items-center justify-center font-bold text-xl font-heading">
              {fullName.slice(0, 1)}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#242522]">{fullName || 'Pelanggan'}</h3>
              <div className="text-xs text-[#777871]">{user?.email || '-'}</div>
              <span className="inline-block mt-1 bg-orange-100 text-[#D96B3A] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                Role: {user?.role || 'customer'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-[#E4E1D9] text-xs">
            <div>
              <label className="block font-semibold text-[#242522] mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#242522] mb-1">Alamat Email (Akun Utama)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 bg-[#ECEAE4] border border-[#E4E1D9] rounded text-[#777871] cursor-not-allowed"
              />
              <span className="text-[10px] text-[#777871] mt-0.5 block">
                Email tertaut dengan kredensial Supabase Auth.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-[#242522] mb-1">Nomor WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#D96B3A] hover:bg-[#BF582D] text-white font-semibold px-6 py-2.5 rounded transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              <span>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </form>
        </div>
      </div>
    </CustomerLayout>
  );
}
