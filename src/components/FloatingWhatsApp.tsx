import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { fleetKindFromPath, generateFleetInquiryUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

export const FloatingWhatsApp: React.FC = () => {
  const { pathname } = useLocation();
  const whatsappUrl = useMemo(
    () => generateFleetInquiryUrl(fleetKindFromPath(pathname)),
    [pathname]
  );

  return (
    <aside
      aria-label="WhatsApp Quick Contact"
      className="fixed right-6 z-40 bottom-20 lg:bottom-6 pb-[env(safe-area-inset-bottom)]"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Rental Inquiries with TORENTO"
        className="group inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1ebe57] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <WhatsAppIcon className="w-7 h-7" />
      </a>
    </aside>
  );
};
