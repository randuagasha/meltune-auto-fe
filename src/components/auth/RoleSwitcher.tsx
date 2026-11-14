'use client';

import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import { Users, Shield, Wrench } from 'lucide-react';

export function RoleSwitcher() {
  const { user, switchRole } = useAuth();
  const router = useRouter();

  const handleSwitch = (role: UserRole) => {
    switchRole(role);
    if (role === 'customer') router.push('/pelanggan/dashboard');
    if (role === 'mechanic') router.push('/mekanik/dashboard');
    if (role === 'superadmin') router.push('/admin/dashboard');
  };

  return (
    <aside aria-label="Demo switcher" className="bg-[#242522] text-[#F5F4F0] text-xs py-1.5 px-4 border-b border-neutral-700 select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D96B3A] animate-pulse" />
          <span className="text-[#ECEAE4] font-medium">TORSI Role Switcher:</span>
          <span className="text-neutral-300 font-mono">
            {user.fullName} ({user.role})
          </span>
        </div>

        <nav aria-label="Demo role selector" className="flex items-center gap-1.5">
          <span className="text-neutral-400 mr-1 hidden sm:inline">Simulasi Role:</span>
          <button
            onClick={() => handleSwitch('customer')}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
              user.role === 'customer'
                ? 'bg-[#D96B3A] text-white font-medium'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Users size={13} />
            <span>Customer</span>
          </button>
          <button
            onClick={() => handleSwitch('mechanic')}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
              user.role === 'mechanic'
                ? 'bg-[#D96B3A] text-white font-medium'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Wrench size={13} />
            <span>Mekanik</span>
          </button>
          <button
            onClick={() => handleSwitch('superadmin')}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
              user.role === 'superadmin'
                ? 'bg-[#D96B3A] text-white font-medium'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Shield size={13} />
            <span>Superadmin</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
