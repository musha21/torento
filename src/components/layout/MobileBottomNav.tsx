import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Car, Compass, Home, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const tabs = [
  {
    to: '/',
    end: true,
    label: 'Home',
    icon: Home,
    match: (p: string) => p === '/',
  },
  {
    to: '/vehicles',
    end: false,
    label: 'Fleet',
    icon: Car,
    match: (p: string) =>
      p.startsWith('/vehicles') || p.startsWith('/cars') || p.startsWith('/bikes'),
  },
  {
    to: '/destinations',
    end: false,
    label: 'Places',
    icon: Compass,
    match: (p: string) => p.startsWith('/destinations'),
  },
] as const;

export const MobileBottomNav: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const accountTo = user ? '/account' : '/login';
  const accountActive =
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register') ||
    location.pathname.startsWith('/forgot-password');

  return (
    <nav
      aria-label="Primary"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-[#242320]/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-4 max-w-lg mx-auto">
        {tabs.map((tab) => {
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
        <li>
          <NavLink
            to={accountTo}
            className={`flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px] text-[10px] uppercase tracking-[0.12em] transition-colors ${
              accountActive ? 'text-[#A86438]' : 'text-[#ECE3D1]/55 hover:text-[#ECE3D1]'
            }`}
          >
            <User className={`w-5 h-5 ${accountActive ? 'stroke-[2.25]' : ''}`} aria-hidden />
            <span className={accountActive ? 'font-semibold' : 'font-medium'}>Account</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
