'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

export default function OtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (index: number, val: string) => {
    if (val.length > 1) val = val[0];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto focus next
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const token = otp.join('');
    if (token.length < 6) {
      setErrorMsg('Masukkan 6 digit kode OTP secara lengkap.');
      return;
    }

    if (!supabase) {
      setErrorMsg('Layanan Supabase belum terkonfigurasi.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token,
        type: 'email',
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.session) {
        router.push('/pelanggan/dashboard');
      } else {
        router.push('/auth/login');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verifikasi OTP gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo className="justify-center" />
        <div className="w-12 h-12 rounded-full bg-[#ECEAE4] text-[#D96B3A] flex items-center justify-center mx-auto mt-6">
          <ShieldCheck size={24} />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-[#242522] font-heading">
          Verifikasi Kode OTP
        </h2>
        <p className="mt-1 text-xs text-[#777871] max-w-xs mx-auto">
          Masukkan 6 digit kode keamanan yang dikirimkan ke alamat email terdaftar Anda.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FFFFFF] py-8 px-6 shadow-sm border border-[#E4E1D9] sm:rounded-lg sm:px-10 space-y-6">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-[#242522] mb-1">
                Alamat Email Akun
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-3 py-2 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
              />
            </div>

            <div className="flex justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(idx, e.target.value)}
                  className="w-11 h-12 text-center text-lg font-bold font-heading bg-[#F5F4F0] border border-[#E4E1D9] rounded focus:outline-none focus:border-[#D96B3A] text-[#242522]"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold py-3 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Memverifikasi...' : 'Verifikasi & Masuk ke Dashboard'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="text-center text-xs">
            <Link href="/auth/login" className="text-[#777871] hover:text-[#242522]">
              Kembali ke halaman masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
