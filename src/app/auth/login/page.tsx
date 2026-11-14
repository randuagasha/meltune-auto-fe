'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/components/auth/AuthProvider';
import { ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { switchRole } = useAuth();
  const [email, setEmail] = useState('budi@torsi.id');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('admin')) {
      switchRole('superadmin');
      router.push('/admin/dashboard');
    } else if (email.includes('hendra') || email.includes('mekanik')) {
      switchRole('mechanic');
      router.push('/mekanik/dashboard');
    } else {
      switchRole('customer');
      router.push('/pelanggan/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo className="justify-center" />
        <h2 className="mt-6 text-2xl font-extrabold text-[#242522] font-heading">
          Masuk ke Portal Akun
        </h2>
        <p className="mt-1 text-xs text-[#777871]">
          Kelola reservasi, kendaraan, dan poin loyalitas harian Anda.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FFFFFF] py-8 px-6 shadow-sm border border-[#E4E1D9] sm:rounded-lg sm:px-10 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#242522] mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777871]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#242522]">
                  Kata Sandi
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] font-medium text-[#D96B3A] hover:underline"
                >
                  Lupa sandi?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777871]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold py-3 rounded transition-colors flex items-center justify-center gap-2"
            >
              <span>Masuk Sekarang</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-[#E4E1D9]">
            <p className="text-[11px] text-[#777871] font-medium mb-2 text-center">
              Pilihan Akun Demo Cepat:
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setEmail('budi@torsi.id');
                  setPassword('password');
                }}
                className="p-1.5 bg-[#ECEAE4] hover:bg-[#E4E1D9] rounded text-[10px] font-semibold text-[#242522]"
              >
                Pelanggan
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('hendra@torsi.id');
                  setPassword('password');
                }}
                className="p-1.5 bg-[#ECEAE4] hover:bg-[#E4E1D9] rounded text-[10px] font-semibold text-[#242522]"
              >
                Mekanik
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@torsi.id');
                  setPassword('password');
                }}
                className="p-1.5 bg-[#ECEAE4] hover:bg-[#E4E1D9] rounded text-[10px] font-semibold text-[#242522]"
              >
                Superadmin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-[#777871]">
            Belum memiliki akun?{' '}
            <Link href="/auth/register" className="font-semibold text-[#D96B3A] hover:underline">
              Daftar akun pelanggan baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
