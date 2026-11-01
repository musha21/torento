import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, ArrowUp } from 'lucide-react';
import { generateGeneralInquiryUrl } from '../utils/whatsapp';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

export const Footer: React.FC = () => {
  const { whatsappDigits, whatsappDisplay } = useSiteSettings();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = generateGeneralInquiryUrl();

  return (
    <footer id="contact" className="bg-[#242320] text-[#ECE3D1] border-t border-white/10 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <img src="/brand/torento-logo.png" alt="TORENTO Motors" className="h-14 object-contain" />
            <span className="font-editorial-heading text-3xl sm:text-4xl text-white tracking-[0.2em] font-normal block">
              TORENTO
            </span>
            <p className="font-editorial-sub text-[#A86438] text-xs tracking-[0.24em]">
              RENT A CAR & BIKE IN SRI LANKA
            </p>
            <p className="font-editorial-heading text-lg text-white/90 italic pt-1">
              "YOUR JOURNEY. YOUR FREEDOM."
            </p>
            <p className="text-sm text-white/60 font-light leading-relaxed max-w-sm pt-2">
              Premium editorial vehicle rentals for international tourists and local explorers. Discover Sri Lanka's beaches, heritage citadels, and tea-blanketed mountains at your own rhythm.
            </p>
          </div>

          {/* Navigation Column (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-editorial-sub text-white/40 text-[11px] tracking-[0.24em] mb-4">
              NAVIGATION
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-[0.14em]">
              <li>
                <Link to="/" className="text-white/75 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="text-white/75 hover:text-white transition-colors">
                  Vehicles
                </Link>
              </li>
              <li>
                <Link to="/cars" className="text-white/75 hover:text-white transition-colors">
                  Cars
                </Link>
              </li>
              <li>
                <Link to="/bikes" className="text-white/75 hover:text-white transition-colors">
                  Bikes
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="text-white/75 hover:text-white transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/75 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/75 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white/75 hover:text-white transition-colors">
                  Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-editorial-sub text-white/40 text-[11px] tracking-[0.24em] mb-4">
              DIRECT CONTACT
            </h4>
            <ul className="space-y-3 text-xs text-white/75">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-[#25D366] transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span className="tabular-nums">WhatsApp: {whatsappDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:+${whatsappDigits}`}
                  className="flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#A86438] shrink-0" />
                  <span className="tabular-nums">Phone: {whatsappDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@torento-rentals.lk"
                  className="flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#A86438] shrink-0" />
                  <span>Email: hello@torento-rentals.lk</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <MapPin className="w-4 h-4 text-[#A86438] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Katunayake CMB Airport Hub & Colombo Central Depot, Sri Lanka
                </span>
              </li>
            </ul>
          </div>

          {/* Social & Dispatch (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-editorial-sub text-white/40 text-[11px] tracking-[0.24em] mb-4">
              CONNECT
            </h4>
            <div className="flex gap-3 mb-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Torento on Instagram"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-[#A86438] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Torento on Facebook"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-[#A86438] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Torento on TikTok"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-[#A86438] transition-colors font-bold text-xs"
              >
                TK
              </a>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#A86438]" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <p>© 2026 TORENTO. ALL RIGHTS RESERVED.</p>
          <p className="text-center sm:text-right">
            Demonstration editorial experience. Vehicle bookings and requirements are confirmed directly via WhatsApp.
          </p>
        </div>
      </div>
    </footer>
  );
};
