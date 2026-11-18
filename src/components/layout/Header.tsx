'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/components/auth/AuthProvider';
import { Menu, X, ShoppingBag, ArrowRight } from 'lucide-react';

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

  return (
    <header className="sticky top-0 z-40 bg-[#F5F4F0]/95 backdrop-blur-md border-b border-[#E4E1D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  active ? 'text-[#D96B3A] font-semibold' : 'text-[#242522] hover:text-[#D96B3A]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/pelanggan/toko"
            className="p-2 text-[#242522] hover:text-[#D96B3A] transition-colors relative"
            title="Keranjang"
          >
            <ShoppingBag size={20} />
          </Link>

          <Link
            href={getDashboardLink()}
            className="text-sm font-medium text-[#242522] hover:text-[#D96B3A] px-3 py-1.5 transition-colors"
          >
            {user ? `Portal ${user.role === 'customer' ? 'Pelanggan' : user.role === 'mechanic' ? 'Mekanik' : 'Superadmin'}` : 'Masuk Akun'}
          </Link>

          <Link
            href="/pelanggan/booking"
            className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-sm font-medium px-4 py-2 rounded transition-colors inline-flex items-center gap-2"
          >
            <span>Reservasi Servis</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href="/pelanggan/booking"
            className="bg-[#D96B3A] text-white text-xs px-3 py-1.5 rounded"
          >
            Booking
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-[#242522] hover:bg-[#ECEAE4] rounded"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#F5F4F0] border-b border-[#E4E1D9] px-4 py-4 space-y-3">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-[#242522] hover:text-[#D96B3A]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#E4E1D9] flex flex-col gap-2">
            <Link
              href={getDashboardLink()}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-[#242522] py-2"
            >
              {user ? `Portal ${user.role}` : 'Masuk Akun'}
            </Link>
            <Link
              href="/pelanggan/booking"
              onClick={() => setMobileOpen(false)}
              className="bg-[#D96B3A] text-white text-sm font-medium text-center py-2.5 rounded"
            >
              Reservasi Servis Sekarang
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
