'use client';

import { useState } from 'react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useAuth } from '@/components/auth/AuthProvider';
import { User, Phone, Mail, Shield, CheckCircle2 } from 'lucide-react';

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
              className="bg-[#D96B3A] hover:bg-[#BF582D] text-white font-semibold px-6 py-2.5 rounded transition-colors"
            >
              Simpan Perubahan
            </button>
          </form>
        </div>
      </div>
    </CustomerLayout>
  );
}
