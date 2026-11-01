import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PageLoader } from '../ui/Spinner';

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, configured } = useAuth();
  const location = useLocation();

  if (!configured) {
    return (
      <div className="min-h-screen bg-[#ECE3D1] flex items-center justify-center p-6">
        <div className="max-w-lg rounded-xl border border-[#D8C9AD] bg-white/50 p-8 text-center">
          <h1 className="font-editorial-heading text-2xl mb-2">Supabase not configured</h1>
          <p className="text-sm text-[#43282A]/90">
            Add <code className="text-[#A86438]">VITE_SUPABASE_URL</code> and{' '}
            <code className="text-[#A86438]">VITE_SUPABASE_ANON_KEY</code> to{' '}
            <code>.env.local</code>. See <code>docs/SUPABASE_SETUP.md</code>.
          </p>
        </div>
      </div>
    );
  }

  if (loading) return <PageLoader label="Checking session…" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
};

export const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, loading, configured, isAdmin } = useAuth();
  const location = useLocation();

  if (!configured) {
    return (
      <div className="min-h-screen bg-[#ECE3D1] flex items-center justify-center p-6">
        <div className="max-w-lg rounded-xl border border-[#D8C9AD] bg-white/50 p-8 text-center">
          <h1 className="font-editorial-heading text-2xl mb-2">Supabase not configured</h1>
          <p className="text-sm text-[#43282A]/90">
            Configure environment variables before accessing the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (loading) return <PageLoader label="Verifying admin access…" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#ECE3D1] flex items-center justify-center p-6">
        <div className="max-w-lg rounded-xl border border-[#D8C9AD] bg-white/50 p-8 text-center">
          <h1 className="font-editorial-heading text-2xl mb-2">Access denied</h1>
          <p className="text-sm text-[#43282A]/90">
            This area is restricted to authorized TORENTO administrators.
            {profile?.role === 'customer' ? ' Your account is a customer account.' : ''}
          </p>
          <a href="/account" className="inline-block mt-4 text-[#A86438] underline text-sm">
            Go to my account
          </a>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};
