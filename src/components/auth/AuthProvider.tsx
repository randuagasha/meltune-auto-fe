'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '@/types';
import { api } from '@/services';

interface AuthContextType {
  user: UserProfile;
  switchRole: (role: UserRole) => void;
  logout: () => void;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>({
    id: 'usr_mock_user',
    email: 'budi@torsi.id',
    fullName: 'Budi Santoso',
    phone: '+6281234567890',
    role: 'customer',
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    api.auth.getCurrentUser().then(u => {
      setUser(u);
      setIsReady(true);
    });

    const handler = () => {
      api.auth.getCurrentUser().then(setUser);
    };
    window.addEventListener('torsi-storage-update', handler);
    return () => window.removeEventListener('torsi-storage-update', handler);
  }, []);

  const switchRole = (role: UserRole) => {
    const updated = api.auth.switchRole(role);
    setUser(updated);
  };

  const logout = () => {
    switchRole('customer');
  };

  return (
    <AuthContext.Provider value={{ user, switchRole, logout, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
