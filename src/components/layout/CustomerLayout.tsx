'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  History,
  ShoppingBag,
  Sparkles,
  MessageSquare,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { EASE_LUXURY } from '@/lib/motion';

const MENU_ITEMS = [
  { href: '/pelanggan/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pelanggan/kendaraan', label: 'Kendaraan Saya', icon: Car },
  { href: '/pelanggan/booking', label: 'Reservasi Servis', icon: CalendarCheck },
  { href: '/pelanggan/riwayat', label: 'Riwayat Booking', icon: History },
  { href: '/pelanggan/toko', label: 'Toko & Keranjang', icon: ShoppingBag },
  { href: '/pelanggan/loyalitas', label: 'Loyalitas & Streak', icon: Sparkles },
  { href: '/pelanggan/bantuan', label: 'Forum Dukungan Mekanik', icon: MessageSquare },
  { href: '/pelanggan/profil', label: 'Profil Akun', icon: User },
];

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isReady } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(pathname));
    }
  }, [isReady, user, router, pathname]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#F5F4F0] flex items-center justify-center text-xs text-[#777871]">
        Memuat sesi pelanggan...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="w-full md:w-64 bg-[#FFFFFF] border-r border-[#E4E1D9] flex flex-col justify-between shrink-0 shadow-xs">
        <div>
          <div className="p-6 border-b border-[#E4E1D9]">
            <Logo />
            <div className="mt-4 p-3 bg-[#ECEAE4]/60 rounded border border-[#E4E1D9]/80 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#242522] text-[#F5F4F0] flex items-center justify-center font-bold text-xs shrink-0">
                {user.fullName ? user.fullName.slice(0, 1) : 'U'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-[#242522] truncate">{user.fullName || 'Pelanggan'}</div>
                <div className="text-[10px] text-[#777871] uppercase tracking-wider">Customer Portal</div>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {MENU_ITEMS.map(item => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-colors ${
                    active
                      ? 'text-white font-semibold'
                      : 'text-[#242522] hover:bg-[#ECEAE4]'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeCustomerNav"
                      className="absolute inset-0 bg-[#D96B3A] rounded shadow-xs -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={active ? 'text-white' : 'text-[#777871]'} />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight size={14} className="text-white" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#E4E1D9] space-y-2">
          <Link
            href="/"
            className="block text-center text-xs text-[#777871] hover:text-[#242522] py-1.5 transition-colors"
          >
            &larr; Ke Halaman Utama
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

      {/* Main Content Area with silk smooth entrance */}
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
