'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/components/auth/AuthProvider';
import { Menu, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE_LUXURY } from '@/lib/motion';

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/layanan', label: 'Layanan Servis' },
  { href: '/produk', label: 'Suku Cadang' },
  { href: '/tentang', label: 'Tentang Kami' },
  { href: '/kontak', label: 'Kontak' },
];

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/auth/login';
    if (user.role === 'superadmin') return '/admin/dashboard';
    if (user.role === 'mechanic') return '/mekanik/dashboard';
    return '/pelanggan/dashboard';
  };

  const cartLink = user ? '/pelanggan/toko' : '/auth/login?redirect=/pelanggan/toko';
  const bookingLink = user ? '/pelanggan/booking' : '/auth/login?redirect=/pelanggan/booking';

  return (
    <header className="sticky top-0 z-40 bg-[#F5F4F0]/95 backdrop-blur-md border-b border-[#E4E1D9] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE_LUXURY }}
        >
          <Logo />
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map(link => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active ? 'text-[#D96B3A] font-semibold' : 'text-[#242522] hover:text-[#D96B3A]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="desktop-active-nav-pill"
                    className="absolute inset-0 bg-[#ECEAE4] rounded-md -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              href={cartLink}
              className="p-2 text-[#242522] hover:text-[#D96B3A] transition-colors relative flex items-center justify-center rounded-full hover:bg-[#ECEAE4]"
              title="Keranjang Suku Cadang"
            >
              <ShoppingBag size={20} />
            </Link>
          </motion.div>

          <Link
            href={getDashboardLink()}
            className="text-sm font-medium text-[#242522] hover:text-[#D96B3A] px-3 py-1.5 transition-colors rounded hover:bg-[#ECEAE4]"
          >
            {user ? `Portal ${user.role === 'customer' ? 'Pelanggan' : user.role === 'mechanic' ? 'Mekanik' : 'Superadmin'}` : 'Masuk Akun'}
          </Link>

          <motion.div
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: EASE_LUXURY }}
          >
            <Link
              href={bookingLink}
              className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-sm font-medium px-4 py-2 rounded transition-colors inline-flex items-center gap-2 shadow-xs"
            >
              <span>Reservasi Servis</span>
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href={bookingLink}
            className="bg-[#D96B3A] text-white text-xs px-3 py-1.5 rounded font-medium"
          >
            Booking
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-[#242522] hover:bg-[#ECEAE4] rounded transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE_LUXURY }}
            className="md:hidden bg-[#F5F4F0] border-b border-[#E4E1D9] px-4 py-4 space-y-3 overflow-hidden shadow-lg"
          >
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-2 text-sm font-medium transition-colors ${
                  pathname === link.href ? 'text-[#D96B3A] font-bold' : 'text-[#242522] hover:text-[#D96B3A]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-[#E4E1D9] flex flex-col gap-2">
              <Link
                href={cartLink}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-[#242522] py-2 flex items-center gap-2"
              >
                <ShoppingBag size={16} />
                <span>Keranjang Suku Cadang</span>
              </Link>
              <Link
                href={getDashboardLink()}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-[#242522] py-2"
              >
                {user ? `Portal ${user.role}` : 'Masuk Akun'}
              </Link>
              <Link
                href={bookingLink}
                onClick={() => setMobileOpen(false)}
                className="bg-[#D96B3A] text-white text-sm font-medium text-center py-2.5 rounded shadow-sm"
              >
                Reservasi Servis Sekarang
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
