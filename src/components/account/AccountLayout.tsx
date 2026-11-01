import React from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { CalendarDays, Car, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { SeoHead } from '../seo/SeoHead';
import { privatePageMeta } from '../../lib/seo/meta';

const desktopLinks = [
  { to: '/account', end: true, label: 'Overview' },
  { to: '/account/bookings', end: false, label: 'My Bookings' },
  { to: '/account/pending', end: false, label: 'Pending' },
  { to: '/account/confirmed', end: false, label: 'Confirmed' },
  { to: '/account/completed', end: false, label: 'Completed' },
  { to: '/account/profile', end: false, label: 'Profile' },
  { to: '/account/security', end: false, label: 'Security' },
];

const mobileTabs = [
  { to: '/account', end: true, label: 'Home', icon: LayoutDashboard, match: (p: string) => p === '/account' },
  {
    to: '/account/bookings',
    end: false,
    label: 'Bookings',
    icon: CalendarDays,
    match: (p: string) =>
      p.startsWith('/account/bookings') ||
      p.startsWith('/account/pending') ||
      p.startsWith('/account/confirmed') ||
      p.startsWith('/account/completed'),
  },
  { to: '/vehicles', end: false, label: 'Explore', icon: Car, match: (p: string) => false },
  {
    to: '/account/profile',
    end: false,
    label: 'Account',
    icon: User,
    match: (p: string) => p.startsWith('/account/profile') || p.startsWith('/account/security'),
  },
];

export const AccountLayout: React.FC = () => {
  const { profile, signOut, user } = useAuth();
  const location = useLocation();

  const desktopNavClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-3 py-2.5 text-sm transition-colors ${
      isActive
        ? 'bg-[#A86438] font-medium text-white shadow-sm'
        : 'text-[#43282A] hover:bg-white/60'
    }`;

  return (
    <div className="min-h-dvh bg-[#ECE3D1] text-[#242320] flex flex-col">
      <SeoHead {...privatePageMeta('My Account', location.pathname)} />

      <header className="sticky top-0 z-30 border-b border-[#43282A]/15 bg-[#242320] text-[#ECE3D1] pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:py-4">
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <img src="/brand/torento-logo.png" alt="TORENTO" className="h-9 sm:h-10 object-contain shrink-0" />
            <div className="min-w-0">
              <p className="font-editorial-sub text-[10px] tracking-[0.2em] text-[#A86438] uppercase leading-tight">
                Customer
              </p>
              <p className="text-xs tracking-wide text-white/70 truncate hidden sm:block">
                Manage rentals &amp; profile
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 text-sm shrink-0">
            <span className="hidden md:inline text-white/75 truncate max-w-[12rem]">
              {profile?.full_name || user?.email}
            </span>
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-full border border-white/25 px-3 py-1.5 text-[11px] tracking-wider uppercase transition-colors hover:border-[#A86438]/60 hover:bg-white/10 min-h-[36px]"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 mx-auto w-full max-w-7xl px-4 pt-5 sm:pt-6 lg:py-10 lg:grid lg:grid-cols-[240px_1fr] lg:gap-10 pb-24 lg:pb-10">
        <aside className="hidden lg:flex flex-col self-start sticky top-24 rounded-xl border border-[#D8C9AD]/70 bg-white/50 p-3">
          <nav className="space-y-1" aria-label="Account sections">
            {desktopLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={desktopNavClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 border-t border-[#43282A]/10 pt-3 space-y-1">
            <Link
              to="/bikes"
              className="block px-3 py-2 text-sm text-[#A86438] transition-colors hover:underline"
            >
              Browse bikes →
            </Link>
            <Link
              to="/vehicles"
              className="block px-3 py-2 text-sm text-[#A86438] transition-colors hover:underline"
            >
              Full fleet →
            </Link>
          </div>
        </aside>

        <div className="min-w-0 w-full lg:max-w-3xl xl:max-w-4xl">
          <Outlet />
        </div>
      </div>

      {/* Mobile app bottom navigation */}
      <nav
        aria-label="Primary"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-[#242320]/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="grid grid-cols-4 max-w-lg mx-auto">
          {mobileTabs.map((tab) => {
            const Icon = tab.icon;
            const active = tab.match(location.pathname);
            return (
              <li key={tab.to}>
                <NavLink
                  to={tab.to}
                  end={tab.end}
                  className={`flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px] text-[10px] uppercase tracking-[0.12em] transition-colors ${
                    active ? 'text-[#A86438]' : 'text-[#ECE3D1]/55 hover:text-[#ECE3D1]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'stroke-[2.25]' : ''}`} aria-hidden />
                  <span className={active ? 'font-semibold' : 'font-medium'}>{tab.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
