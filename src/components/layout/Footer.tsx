import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#242522] text-[#ECEAE4] pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-neutral-800">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Logo variant="light" />
            <p className="text-sm text-neutral-400 leading-relaxed pt-2">
              Perawatan kendaraan yang tepat, didukung layanan profesional dan kebutuhan otomotif dalam satu tempat.
            </p>
            <p className="text-xs text-[#D96B3A] font-medium tracking-wide">
              Perawatan Tepat. Perjalanan Tenang.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-heading">
              Layanan Workshop
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li><Link href="/layanan" className="hover:text-white transition-colors">Tune-Up & Kalibrasi ECU</Link></li>
              <li><Link href="/layanan" className="hover:text-white transition-colors">Servis Berkala Fluida & Filter</Link></li>
              <li><Link href="/layanan" className="hover:text-white transition-colors">Sistem Pengereman Presisi</Link></li>
              <li><Link href="/layanan" className="hover:text-white transition-colors">Laser Wheel Alignment</Link></li>
              <li><Link href="/layanan" className="hover:text-white transition-colors">Ozone Interior Sanitization</Link></li>
            </ul>
          </div>

          {/* Suku Cadang & Toko */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-heading">
              Suku Cadang & Store
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li><Link href="/produk" className="hover:text-white transition-colors">Oli Mesin Kinerja Tinggi</Link></li>
              <li><Link href="/produk" className="hover:text-white transition-colors">Cairan Rem & Radiator Coolant</Link></li>
              <li><Link href="/produk" className="hover:text-white transition-colors">Perawatan Bodi & Detailing</Link></li>
              <li><Link href="/produk" className="hover:text-white transition-colors">Filter Udara & Kabin OEM</Link></li>
              <li><Link href="/pelanggan/loyalitas" className="hover:text-white transition-colors">Katalog Reward Loyalitas</Link></li>
            </ul>
          </div>

          {/* Workshop Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-heading">
              Lokasi & Jam Kerja
            </h4>
            <div className="space-y-2.5 text-sm text-neutral-400">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#D96B3A] shrink-0 mt-0.5" />
                <span>Kawasan Otomotif BSD Blok B3 No. 12, Tangerang Selatan, Banten 15310</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={16} className="text-[#D96B3A] shrink-0" />
                <span>Senin - Sabtu: 08:30 - 17:30 WIB</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-[#D96B3A] shrink-0" />
                <span>+62 21 5590 8820 / +62 811 9876 543</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#D96B3A] shrink-0" />
                <span>layanan@meltune.id</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 MELTUNE AUTO (Automotive Service & Parts). Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-6">
            <Link href="/tentang" className="hover:text-neutral-300">Tentang Workshop</Link>
            <Link href="/kontak" className="hover:text-neutral-300">Kontak WhatsApp</Link>
            <Link href="/auth/login" className="hover:text-neutral-300">Masuk Akun</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
