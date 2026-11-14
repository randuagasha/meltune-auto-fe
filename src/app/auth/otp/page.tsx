'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

export default function OtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

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

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/pelanggan/dashboard');
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
          Masukkan 6 digit kode keamanan yang dikirimkan ke nomor WhatsApp / Email Anda.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FFFFFF] py-8 px-6 shadow-sm border border-[#E4E1D9] sm:rounded-lg sm:px-10 space-y-6">
          <form onSubmit={handleVerify} className="space-y-6">
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
              className="w-full bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold py-3 rounded transition-colors flex items-center justify-center gap-2"
            >
              <span>Verifikasi & Aktifkan Akun</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="flex items-center justify-between text-xs text-[#777871] pt-2 border-t border-[#E4E1D9]">
            <span>Tidak menerima kode?</span>
            <button
              type="button"
              className="text-[#D96B3A] font-semibold hover:underline flex items-center gap-1"
            >
              <RefreshCw size={12} />
              <span>Kirim ulang</span>
            </button>
          </div>

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
