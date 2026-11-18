'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProfile, UserRole } from '@/types';
import { api } from '@/services';
import { supabase } from '@/lib/supabase';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

interface AuthContextType {
  user: UserProfile | null;
  logout: () => Promise<void>;
  isReady: boolean;
  refreshUser: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  const fetchProfile = useCallback(async (sessionUser?: any) => {
    if (USE_MOCK) {
      try {
        const u = await api.auth.getCurrentUser();
        setUser(u);
      } catch {
        setUser(null);
      } finally {
        setIsReady(true);
      }
      return;
    }

    if (!supabase) {
      setUser(null);
      setIsReady(true);
      return;
    }

    try {
      const currentUser = sessionUser || (await supabase.auth.getUser()).data.user;
      if (!currentUser) {
        setUser(null);
        setIsReady(true);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, phone, role, avatar_url, is_active')
        .eq('id', currentUser.id)
        .single();

      if (profile && profile.is_active) {
        setUser({
          id: profile.id,
          email: currentUser.email || '',
          fullName: profile.full_name,
          phone: profile.phone || '',
          role: profile.role as UserRole,
          avatarUrl: profile.avatar_url,
        });
      } else if (profile && !profile.is_active) {
        await supabase.auth.signOut();
        setUser(null);
      } else {
        setUser({
          id: currentUser.id,
          email: currentUser.email || '',
          fullName: currentUser.user_metadata?.full_name || 'Pengguna MELTUNE',
          phone: currentUser.user_metadata?.phone || '',
          role: (currentUser.user_metadata?.role as UserRole) || 'customer',
        });
      }
    } catch {
      setUser(null);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    fetchProfile();

    if (USE_MOCK) {
      const handler = () => {
        api.auth.getCurrentUser().then(setUser);
      };
      window.addEventListener('torsi-storage-update', handler);
      return () => window.removeEventListener('torsi-storage-update', handler);
    }

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          fetchProfile(session.user);
        } else {
          setUser(null);
          setIsReady(true);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [fetchProfile]);

  const switchRole = (role: UserRole) => {
    if (USE_MOCK) {
      const updated = api.auth.switchRole(role);
      setUser(updated);
    }
  };

  const logout = async () => {
    if (!USE_MOCK && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  };

  const refreshUser = async () => {
    await fetchProfile();
  };

  return (
    <AuthContext.Provider value={{ user, logout, isReady, refreshUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
