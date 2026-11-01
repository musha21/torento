import React from 'react';
import { useLocation } from 'react-router-dom';
import { MobileBottomNav } from './MobileBottomNav';
import { PwaInstallBanner } from '../pwa/PwaInstallBanner';

/**
 * Mobile app chrome for public + auth routes.
 * Hidden on /account/* (own bottom tabs) and /admin/*.
 */
export const PublicAppChrome: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const hide =
    pathname.startsWith('/account') || pathname.startsWith('/admin');

  if (hide) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="pb-24 lg:pb-0 min-h-0">{children}</div>
      <PwaInstallBanner />
      <MobileBottomNav />
    </>
  );
};
