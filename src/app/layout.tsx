import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';

export const metadata: Metadata = {
  title: 'MELTUNE AUTO | Precision in Every Service',
  description: 'Workshop otomotif modern dengan perawatan kendaraan presisi, teknisi bersertifikasi, dan ketersediaan suku cadang berkualitas.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-[#F5F4F0] text-[#242522]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
