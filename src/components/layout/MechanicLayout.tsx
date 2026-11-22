'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Wrench,
  CalendarCheck,
  Layers,
  MessageSquare,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { EASE_LUXURY } from '@/lib/motion';

const MECHANIC_MENU = [
  { href: '/mekanik/dashboard', label: 'Operasional Bay', icon: Wrench },
  { href: '/mekanik/booking', label: 'Triage & Konfirmasi Servis', icon: CalendarCheck },
  { href: '/mekanik/layanan', label: 'Daftar Servis Workshop', icon: Layers },
  { href: '/mekanik/bantuan', label: 'Forum Dukungan Teknis', icon: MessageSquare },
];

export function MechanicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isReady } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(pathname));
      return;
    }
    if (user.role !== 'mechanic' && user.role !== 'superadmin') {
      router.push('/pelanggan/dashboard');
    }
  }, [isReady, user, router, pathname]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#F5F4F0] flex items-center justify-center text-xs text-[#777871]">
        Memverifikasi otorisasi mekanik...
      </div>
    );
  }

  if (!user || (user.role !== 'mechanic' && user.role !== 'superadmin')) return null;

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col md:flex-row">
      {/* Sidebar Mechanic */}
      <aside className="w-full md:w-64 md:h-screen md:sticky md:top-0 bg-[#FFFFFF] border-r border-[#E4E1D9] flex flex-col shrink-0 shadow-xs z-30">
        {/* Brand & Profile Section */}
        <div className="p-6 border-b border-[#E4E1D9] shrink-0">
          <Logo />
          <div className="mt-4 p-3 bg-neutral-900 text-white rounded flex items-center gap-3 shadow-xs">
            <div className="w-8 h-8 rounded bg-[#D96B3A] text-white flex items-center justify-center font-bold text-xs shrink-0">
              M
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold truncate">{user.fullName}</div>
              <div className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">
                Mekanik Workshop
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation List */}
        <nav className="flex-1 min-h-0 overflow-y-auto p-4 space-y-1">
          {MECHANIC_MENU.map(item => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-colors ${
                  active
                    ? 'bg-[#242522] text-[#F5F4F0] font-semibold shadow-xs'
                    : 'text-[#242522] hover:bg-[#ECEAE4]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={active ? 'text-[#D96B3A]' : 'text-[#777871]'} />
                  <span>{item.label}</span>
                </div>
                {active && <ChevronRight size={14} className="text-[#D96B3A]" />}
              </Link>
            );
          })}
        </nav>

        {/* Fixed Footer Actions */}
        <div className="p-4 border-t border-[#E4E1D9] space-y-2 shrink-0 mt-auto bg-[#FFFFFF]">
          <Link
            href="/"
            className="block text-center text-xs text-[#777871] hover:text-[#242522] py-1.5 transition-colors"
          >
            &larr; Halaman Publik
          </Link>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded border border-rose-200 transition-colors"
          >
            <LogOut size={14} />
            <span>Keluar Akun</span>
          </motion.button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE_LUXURY }}
          className="max-w-6xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
