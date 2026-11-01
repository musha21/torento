import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { SeoHead } from '../seo/SeoHead';
import { privatePageMeta } from '../../lib/seo/meta';

const links = [
  { to: '/admin', end: true, label: 'Overview' },
  { to: '/admin/vehicles', end: false, label: 'Vehicle Management' },
  { to: '/admin/bookings', end: false, label: 'Booking Management' },
  { to: '/admin/availability', end: false, label: 'Availability Calendar' },
  { to: '/admin/customers', end: false, label: 'Customer Management' },
  { to: '/admin/categories', end: false, label: 'Categories' },
  { to: '/admin/destinations', end: false, label: 'Destinations' },
  { to: '/admin/content', end: false, label: 'Website Content' },
  { to: '/admin/settings', end: false, label: 'Pricing & Settings' },
  { to: '/admin/profile', end: false, label: 'Admin Profile' },
];

export const AdminLayout: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const nav = (
    <nav className="space-y-1">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `px-3 py-2.5 text-sm rounded-lg min-h-[44px] flex items-center ${
              isActive ? 'bg-[#A86438] text-white' : 'hover:bg-white/10 text-[#ECE3D1]/90'
            }`
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#ECE3D1] text-[#242320] flex">
      <SeoHead {...privatePageMeta('Admin', location.pathname)} />
      <aside className="hidden lg:flex w-64 flex-col bg-[#242320] text-[#ECE3D1] p-5 sticky top-0 h-screen shrink-0">
        <Link to="/" className="mb-8">
          <img src="/brand/torento-logo.png" alt="TORENTO" className="h-12 object-contain" />
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#A86438] mt-2">Admin Console</p>
        </Link>
        <div className="flex-1 overflow-y-auto">{nav}</div>
        <div className="mt-auto pt-6 border-t border-white/10 text-xs text-white/50">
          {profile?.full_name || 'Administrator'}
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden bg-[#242320] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <img src="/brand/torento-logo.png" alt="TORENTO" className="h-9 object-contain" />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="p-2 -mr-1 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
          >
            {open ? <X /> : <Menu />}
          </button>
        </header>

        {open && (
          <>
            <button
              type="button"
              aria-label="Close menu"
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
              onClick={() => setOpen(false)}
            />
            <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-[min(100%,18rem)] bg-[#242320] text-[#ECE3D1] p-5 overflow-y-auto shadow-2xl pt-[max(1.25rem,env(safe-area-inset-top))]">
              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#A86438]">Admin</p>
                <button type="button" onClick={() => setOpen(false)} className="p-2" aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {nav}
            </div>
          </>
        )}

        <div className="border-b border-[#43282A]/10 bg-white/40 px-4 py-3 flex justify-between items-center gap-2">
          <p className="text-xs uppercase tracking-wider text-[#43282A]/70 truncate">TORENTO Operations</p>
          <div className="flex gap-3 text-sm shrink-0">
            <Link to="/" className="text-[#A86438] hover:underline">
              View site
            </Link>
            <button type="button" onClick={() => signOut()} className="text-[#43282A]/80 hover:underline">
              Sign out
            </button>
          </div>
        </div>
        <main className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
