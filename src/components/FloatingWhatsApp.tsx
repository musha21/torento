import React from 'react';
import { generateGeneralInquiryUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappUrl = generateGeneralInquiryUrl(
    'Hello Torento! I would like to check vehicle availability and rental rates for my Sri Lanka journey.'
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
