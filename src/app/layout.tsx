import type { Metadata } from 'next';
import { Manrope, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { RoleSwitcher } from '@/components/auth/RoleSwitcher';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TORSI | Precision in Every Service',
  description: 'Workshop otomotif modern dengan perawatan kendaraan presisi, teknisi bersertifikasi, dan ketersediaan suku cadang berkualitas.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${manrope.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#F5F4F0] text-[#242522]">
        <AuthProvider>
          <RoleSwitcher />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
