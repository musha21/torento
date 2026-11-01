import React, { useMemo } from 'react';
import { Mail, Phone } from 'lucide-react';
import { WhatsAppIcon } from '../components/icons/WhatsAppIcon';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { SeoHead } from '../components/seo/SeoHead';
import { PAGE_META } from '../lib/seo/meta';
import { organizationJsonLd } from '../lib/seo/structuredData';
import { generateGeneralInquiryUrl } from '../utils/whatsapp';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

export default function ContactPage() {
  const meta = PAGE_META.contact;
  const { whatsappDigits, whatsappDisplay } = useSiteSettings();
  const whatsappUrl = generateGeneralInquiryUrl(
    "Hello TORENTO! I'd like to enquire about vehicle availability and booking."
  );
  const jsonLd = useMemo(() => [organizationJsonLd()], [whatsappDigits]);

  return (
    <div className="min-h-screen bg-[#ECE3D1] text-[#242320] flex flex-col">
      <SeoHead {...meta} jsonLd={jsonLd} />
      <Navbar variant="light" />
      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-editorial-sub text-[#A86438] mb-2 tracking-[0.2em] text-xs">CONTACT</p>
          <h1 className="font-editorial-heading text-4xl sm:text-5xl uppercase mb-4">
            Talk to TORENTO
          </h1>
          <p className="text-[#43282A]/85 mb-10 leading-relaxed">
            The fastest way to check availability, share travel dates, and confirm a vehicle is
            WhatsApp. We respond with clear next steps for your Sri Lanka journey.
          </p>

          <div className="space-y-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] text-white px-5 py-4 rounded-lg font-semibold hover:opacity-95 transition-opacity"
            >
              <WhatsAppIcon className="w-5 h-5 shrink-0" />
              <span>
                WhatsApp enquiry
                <span className="block text-sm font-normal opacity-90 tabular-nums">
                  {whatsappDisplay}
                </span>
              </span>
            </a>

            <a
              href={`tel:+${whatsappDigits}`}
              className="flex items-center gap-3 bg-white/70 border border-[#43282A]/15 px-5 py-4 rounded-lg hover:border-[#A86438]/50 transition-colors"
            >
              <Phone className="w-5 h-5 text-[#A86438] shrink-0" />
              <span className="text-sm">
                Call / SMS
                <span className="block text-[#43282A]/70 tabular-nums">{whatsappDisplay}</span>
              </span>
            </a>

            <div className="flex items-start gap-3 bg-white/50 border border-[#43282A]/10 px-5 py-4 rounded-lg text-sm text-[#43282A]/80">
              <Mail className="w-5 h-5 text-[#A86438] shrink-0 mt-0.5" />
              <p>
                Prefer email? Ask via WhatsApp for the best contact channel for your booking — we do
                not publish unverified addresses or opening hours here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
