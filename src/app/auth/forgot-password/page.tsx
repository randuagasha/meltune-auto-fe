'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/auth/reset-password');
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo className="justify-center" />
        <h2 className="mt-6 text-2xl font-extrabold text-[#242522] font-heading">
          Lupa Kata Sandi
        </h2>
        <p className="mt-1 text-xs text-[#777871] max-w-xs mx-auto">
          Masukkan email akun Anda untuk menerima tautan pemulihan kata sandi.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FFFFFF] py-8 px-6 shadow-sm border border-[#E4E1D9] sm:rounded-lg sm:px-10 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#242522] mb-1">
                Alamat Email Terdaftar
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777871]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="budi@email.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold py-3 rounded transition-colors flex items-center justify-center gap-2"
            >
              <span>Kirim Tautan Pemulihan</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="text-center text-xs pt-2 border-t border-[#E4E1D9]">
            <Link
              href="/auth/login"
              className="text-[#777871] hover:text-[#242522] inline-flex items-center gap-1.5"
            >
              <ArrowLeft size={13} />
              <span>Kembali ke halaman login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
