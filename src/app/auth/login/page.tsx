'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!supabase) {
      setErrorMsg('Layanan autentikasi Supabase belum terkonfigurasi.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMsg('Alamat email atau kata sandi tidak cocok. Silakan coba lagi.');
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMsg('Alamat email belum dikonfirmasi. Silakan periksa kotak masuk email Anda.');
        } else {
          setErrorMsg(error.message);
        }
        return;
      }

      if (data.user) {
        await refreshUser();
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, is_active')
          .eq('id', data.user.id)
          .single();

        if (profile && !profile.is_active) {
          await supabase.auth.signOut();
          setErrorMsg('Akun Anda ditangguhkan. Silakan hubungi layanan workshop MELTUNE AUTO.');
          return;
        }

        const role = profile?.role || 'customer';
        const redirectParam = searchParams.get('redirect');

        if (redirectParam && redirectParam.startsWith('/')) {
          router.push(redirectParam);
        } else if (role === 'superadmin') {
          router.push('/admin/dashboard');
        } else if (role === 'mechanic') {
          router.push('/mekanik/dashboard');
        } else {
          router.push('/pelanggan/dashboard');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal masuk ke akun');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFFFFF] py-8 px-6 shadow-sm border border-[#E4E1D9] sm:rounded-lg sm:px-10 space-y-6">
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

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
          disabled={loading}
          className="w-full bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold py-3 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>{loading ? 'Memverifikasi...' : 'Masuk Sekarang'}</span>
          <ArrowRight size={14} />
        </button>
      </form>

      <div className="text-center text-xs text-[#777871]">
        Belum memiliki akun?{' '}
        <Link href="/auth/register" className="font-semibold text-[#D96B3A] hover:underline">
          Daftar akun pelanggan baru
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo className="justify-center" />
        <h2 className="mt-6 text-2xl font-extrabold text-[#242522] font-heading">
          Masuk ke Portal Akun
        </h2>
        <p className="mt-1 text-xs text-[#777871]">
          Kelola reservasi, kendaraan, dan poin loyalitas harian Anda di MELTUNE AUTO.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={<div className="text-center text-xs text-[#777871]">Memuat formulir masuk...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
