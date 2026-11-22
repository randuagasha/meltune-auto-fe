'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProfile, UserRole } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  logout: () => Promise<void>;
  isReady: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  const fetchProfile = useCallback(async (sessionUser?: any) => {
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
        // Suspended account
        await supabase.auth.signOut();
        setUser(null);
      } else {
        // Fallback for new users before trigger finishes
        setUser({
          id: currentUser.id,
          email: currentUser.email || '',
          fullName: currentUser.user_metadata?.full_name || 'Pelanggan MELTUNE',
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
    } else {
      setIsReady(true);
    }
  }, [fetchProfile]);

  const logout = async () => {
    if (supabase) {
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
    <AuthContext.Provider value={{ user, logout, isReady, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
