'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { ArrowRight, Lock, Mail, User, Phone } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/auth/otp');
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo className="justify-center" />
        <h2 className="mt-6 text-2xl font-extrabold text-[#242522] font-heading">
          Pendaftaran Pelanggan TORSI
        </h2>
        <p className="mt-1 text-xs text-[#777871]">
          Daftarkan akun untuk booking servis, mencatat riwayat mobil, dan poin loyalitas harian.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FFFFFF] py-8 px-6 shadow-sm border border-[#E4E1D9] sm:rounded-lg sm:px-10 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#242522] mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777871]" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242522] mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777871]" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="budi@email.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242522] mb-1">
                Nomor WhatsApp Aktif
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777871]" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="081234567890"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242522] mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777871]" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimal 8 karakter"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                />
              </div>
            </div>

            <p className="text-[11px] text-[#777871] leading-tight">
              Pendaftaran publik secara otomatis menetapkan akun sebagai <strong>Customer</strong>. Akses mekanik hanya dapat dibuat oleh superadmin workshop.
            </p>

            <button
              type="submit"
              className="w-full bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold py-3 rounded transition-colors flex items-center justify-center gap-2"
            >
              <span>Lanjut Verifikasi OTP</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="text-center text-xs text-[#777871]">
            Sudah memiliki akun?{' '}
            <Link href="/auth/login" className="font-semibold text-[#D96B3A] hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
