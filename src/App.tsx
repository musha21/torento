/**
 * TORENTO — App Router (React Router)
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import { ToastProvider } from './contexts/ToastContext';
import { RequireAuth, RequireAdmin } from './components/auth/RequireAuth';
import { AccountLayout } from './components/account/AccountLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { PublicAppChrome } from './components/layout/PublicAppChrome';
import { PageLoader } from './components/ui/Spinner';
import { isSupabaseConfigured } from './lib/supabase/client';

const HomePage = lazy(() => import('./pages/HomePage'));
const VehiclesPage = lazy(() => import('./pages/vehicles/VehiclesPage'));
const VehicleDetailPage = lazy(() => import('./pages/vehicles/VehicleDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const DestinationsIndexPage = lazy(() => import('./pages/destinations/DestinationsIndexPage'));
const DestinationDetailPage = lazy(() => import('./pages/destinations/DestinationDetailPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const AccountOverview = lazy(() => import('./pages/account/AccountOverview'));
const AccountBookings = lazy(() => import('./pages/account/AccountBookings'));
const AccountProfile = lazy(() => import('./pages/account/AccountProfile'));
const AccountSecurity = lazy(() => import('./pages/account/AccountSecurity'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminVehicles = lazy(() => import('./pages/admin/AdminVehicles'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));
const AdminAvailability = lazy(() => import('./pages/admin/AdminAvailability'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminDestinations = lazy(() => import('./pages/admin/AdminDestinations'));
const AdminContent = lazy(() => import('./pages/admin/AdminContent'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));

function ConfigBanner() {
  if (isSupabaseConfigured) return null;
  return (
    <div className="bg-amber-900 text-amber-50 text-center text-xs sm:text-sm px-4 py-2 relative z-[100]">
      Supabase is not configured — marketing pages use local demo fleet data. Set{' '}
      <code className="text-amber-200">VITE_SUPABASE_URL</code> and{' '}
      <code className="text-amber-200">VITE_SUPABASE_ANON_KEY</code>. See{' '}
      <code>docs/SUPABASE_SETUP.md</code>.
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteSettingsProvider>
          <ToastProvider>
            <ConfigBanner />
            <Suspense fallback={<PageLoader />}>
              <PublicAppChrome>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/vehicles" element={<VehiclesPage />} />
                  <Route path="/cars" element={<VehiclesPage />} />
                  <Route path="/bikes" element={<VehiclesPage />} />
                  <Route path="/vehicles/:slug" element={<VehicleDetailPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/destinations" element={<DestinationsIndexPage />} />
                  <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                  <Route
                    path="/account"
                    element={
                      <RequireAuth>
                        <AccountLayout />
                      </RequireAuth>
                    }
                  >
                    <Route index element={<AccountOverview />} />
                    <Route path="bookings" element={<AccountBookings />} />
                    <Route path="pending" element={<AccountBookings />} />
                    <Route path="confirmed" element={<AccountBookings />} />
                    <Route path="completed" element={<AccountBookings />} />
                    <Route path="profile" element={<AccountProfile />} />
                    <Route path="security" element={<AccountSecurity />} />
                  </Route>

                  <Route
                    path="/admin"
                    element={
                      <RequireAdmin>
                        <AdminLayout />
                      </RequireAdmin>
                    }
                  >
                    <Route index element={<AdminOverview />} />
                    <Route path="vehicles" element={<AdminVehicles />} />
                    <Route path="bookings" element={<AdminBookings />} />
                    <Route path="availability" element={<AdminAvailability />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="destinations" element={<AdminDestinations />} />
                    <Route path="content" element={<AdminContent />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="profile" element={<AdminProfile />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </PublicAppChrome>
            </Suspense>
          </ToastProvider>
        </SiteSettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
