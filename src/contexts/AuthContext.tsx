import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, tryGetSupabase } from '../lib/supabase/client';
import type { Profile } from '../types/database';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  configured: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  refreshProfile: () => Promise<void>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null; profile: Profile | null }>;
  signUp: (
    email: string,
    password: string,
    meta: { full_name: string; phone?: string }
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    const supabase = tryGetSupabase();
    if (!supabase) {
      setProfile(null);
      return null;
    }
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error) {
      console.warn('Profile load failed:', error.message);
      setProfile(null);
      return null;
    }
    const next = data as Profile | null;
    setProfile(next);
    return next;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) await loadProfile(user.id);
  }, [user?.id, loadProfile]);

  useEffect(() => {
    const supabase = tryGetSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        loadProfile(data.session.user.id).finally(() => mounted && setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        loadProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = tryGetSupabase();
    if (!supabase) {
      return {
        error: 'Supabase is not configured. See docs/SUPABASE_SETUP.md.',
        profile: null,
      };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      setSession(data.session);
      setUser(data.user);
      const nextProfile = await loadProfile(data.user.id);
      return { error: null, profile: nextProfile };
    }
    return { error: error?.message ?? null, profile: null };
  }, [loadProfile]);

  const signUp = useCallback(
    async (email: string, password: string, meta: { full_name: string; phone?: string }) => {
      const supabase = tryGetSupabase();
      if (!supabase) return { error: 'Supabase is not configured. See docs/SUPABASE_SETUP.md.' };
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: meta.full_name,
            phone: meta.phone || '',
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });
      return { error: error?.message ?? null };
    },
    []
  );

  const signOut = useCallback(async () => {
    const supabase = tryGetSupabase();
    if (supabase) await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const supabase = tryGetSupabase();
    if (!supabase) return { error: 'Supabase is not configured.' };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/security`,
    });
    return { error: error?.message ?? null };
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const supabase = tryGetSupabase();
    if (!supabase) return { error: 'Supabase is not configured.' };
    const { error } = await supabase.auth.updateUser({ password });
    return { error: error?.message ?? null };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      loading,
      configured: isSupabaseConfigured,
      isAdmin: profile?.role === 'admin' && profile?.account_status === 'active',
      isCustomer: profile?.role === 'customer',
      refreshProfile,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
    }),
    [
      session,
      user,
      profile,
      loading,
      refreshProfile,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
