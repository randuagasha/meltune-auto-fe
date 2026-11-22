'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  BarChart3,
  Users,
  Wrench,
  Layers,
  Package,
  CalendarCheck,
  ShoppingBag,
  Sparkles,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { motion } from 'motion/react';
import { EASE_LUXURY } from '@/lib/motion';

const ADMIN_MENU = [
  { href: '/admin/dashboard', label: 'Eksekutif Analitik', icon: BarChart3 },
  { href: '/admin/booking', label: 'Semua Booking Workshop', icon: CalendarCheck },
  { href: '/admin/pelanggan', label: 'Kelola Pelanggan', icon: Users },
  { href: '/admin/mekanik', label: 'Kelola Akun Mekanik', icon: Wrench },
  { href: '/admin/layanan', label: 'Katalog Layanan', icon: Layers },
  { href: '/admin/produk', label: 'Inventaris & Toko', icon: Package },
  { href: '/admin/pesanan', label: 'Pesanan Suku Cadang', icon: ShoppingBag },
  { href: '/admin/loyalitas', label: 'Program Loyalitas & Reward', icon: Sparkles },
  { href: '/admin/bantuan', label: 'Audit Forum Dukungan', icon: MessageSquare },
  { href: '/admin/pengaturan', label: 'Pengaturan Workshop', icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isReady } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(pathname));
      return;
    }
    if (user.role !== 'superadmin') {
      if (user.role === 'mechanic') {
        router.push('/mekanik/dashboard');
      } else {
        router.push('/pelanggan/dashboard');
      }
    }
  }, [isReady, user, router, pathname]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#F5F4F0] flex items-center justify-center text-xs text-[#777871]">
        Memverifikasi otorisasi direksi...
      </div>
    );
  }

  if (!user || user.role !== 'superadmin') return null;

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col md:flex-row">
      {/* Sidebar Admin */}
      <aside className="w-full md:w-68 bg-[#FFFFFF] border-r border-[#E4E1D9] flex flex-col justify-between shrink-0 shadow-xs">
        <div>
          <div className="p-6 border-b border-[#E4E1D9]">
            <Logo />
            <div className="mt-4 p-3 bg-[#242522] text-[#F5F4F0] rounded flex items-center gap-3 shadow-xs">
              <div className="w-8 h-8 rounded bg-[#D96B3A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                <Shield size={14} />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold truncate">{user.fullName}</div>
                <div className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">
                  Superadmin Akses Penuh
                </div>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
            {ADMIN_MENU.map(item => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
                    active
                      ? 'text-white font-semibold'
                      : 'text-[#242522] hover:bg-[#ECEAE4]'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeAdminNav"
                      className="absolute inset-0 bg-[#D96B3A] rounded shadow-xs -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} className={active ? 'text-white' : 'text-[#777871]'} />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight size={13} className="text-white" />}
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
            &larr; Halaman Depan
          </Link>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded border border-rose-200 transition-colors"
          >
            <LogOut size={14} />
            <span>Keluar Sesi Superadmin</span>
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
