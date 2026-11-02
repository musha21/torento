import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ArrowUpRight, Compass, User } from 'lucide-react';
import { generateGeneralInquiryUrl } from '../utils/whatsapp';
import { useAuth } from '../contexts/AuthContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

interface NavbarProps {
  onOpenBookingModal?: () => void;
  variant?: 'dark' | 'light';
}

export const Navbar: React.FC<NavbarProps> = ({ variant = 'dark' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { whatsappDigits, whatsappDisplay } = useSiteSettings();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const generalWhatsAppUrl = generateGeneralInquiryUrl();
  const solid = variant === 'light' || isScrolled || !isHome;

  const homeAnchors = [
    { name: '01. Cinematic Overview', href: '/' },
    { name: '02. The Island Experience', href: '/#experience' },
    { name: '03. Vehicle Categories', href: '/#categories' },
    { name: '04. Rental Collection', href: '/vehicles' },
    { name: '05. Cars', href: '/cars' },
    { name: '06. Bikes', href: '/bikes' },
    { name: '07. Destinations', href: '/destinations' },
    { name: '08. About', href: '/about' },
    { name: '09. Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${solid
            ? 'bg-[#242320]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-lg'
            : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle Navigation Menu"
                className="group flex items-center gap-2.5 text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 transition-colors bg-black/20 backdrop-blur-xs">
                  {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </div>
                <span className="font-editorial-sub text-[11px] text-white/90 group-hover:text-white tracking-[0.24em]">
                  {menuOpen ? 'CLOSE' : 'MENU'}
                </span>
              </button>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 text-center">
              <Link to="/" className="group inline-flex flex-col items-center focus:outline-hidden">
                <img
                  src="/brand/torento-logo.png"
                  alt="TORENTO Motors"
                  className="h-10 sm:h-12 w-auto object-contain drop-shadow-md"
                />
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href={`tel:+${whatsappDigits}`}
                className="hidden lg:flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40 bg-black/20"
                title="Call Torento Team"
              >
                <Phone className="w-3.5 h-3.5 text-[#A86438]" />
                <span className="tabular-nums tracking-wide font-medium">{whatsappDisplay}</span>
              </a>

              {user ? (
                <Link
                  to={isAdmin ? '/admin' : '/account'}
                  className="flex items-center gap-1.5 text-xs text-white/90 px-3 py-2 rounded-full border border-white/20 hover:border-white/40 bg-black/20"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isAdmin ? 'Admin' : 'Account'}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-1.5 text-xs text-white/90 px-3 py-2 rounded-full border border-white/20 hover:border-white/40 bg-black/20"
                >
                  Sign in
                </Link>
              )}

              <a
                href={generalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#A86438] hover:bg-[#8e522c] text-white text-xs font-semibold px-3.5 sm:px-4 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span className="tracking-wider uppercase text-[11px]">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-[#242320]/97 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-12 lg:p-20 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] text-[#ECE3D1] overflow-y-auto overscroll-contain">
          <div className="flex justify-between items-center pt-14 sm:pt-16 shrink-0">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#A86438]">
              <Compass className="w-4 h-4" />
              <span>Editorial Navigation</span>
            </div>
            <button type="button" onClick={() => setMenuOpen(false)} className="text-white/70">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-auto max-w-5xl">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/40 mb-6">Directory</p>
              <ul className="space-y-4 sm:space-y-6">
                {homeAnchors.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="font-editorial-heading text-xl sm:text-3xl lg:text-4xl hover:text-[#A86438] transition-colors flex items-center justify-between group"
                    >
                      <span>{link.name}</span>
                      <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A86438]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-12">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/40 mb-4">TORENTO Identity</p>
                <p className="font-editorial-heading text-2xl text-white mb-4">
                  &quot;YOUR JOURNEY. YOUR FREEDOM.&quot;
                </p>
                <p className="text-sm text-white/70 leading-relaxed font-light mb-8 max-w-md">
                  Premium car & bike rentals for international tourists and local explorers discovering Sri Lanka.
                </p>
                <div className="flex flex-wrap gap-3">
                  {user ? (
                    <>
                      <Link
                        to={isAdmin ? '/admin' : '/account'}
                        onClick={() => setMenuOpen(false)}
                        className="text-sm border border-white/30 px-4 py-2 rounded-full hover:bg-white/10"
                      >
                        {isAdmin ? 'Admin Dashboard' : 'My Account'}
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          signOut();
                          setMenuOpen(false);
                        }}
                        className="text-sm border border-white/30 px-4 py-2 rounded-full hover:bg-white/10"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                        className="text-sm border border-white/30 px-4 py-2 rounded-full hover:bg-white/10"
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMenuOpen(false)}
                        className="text-sm bg-[#A86438] px-4 py-2 rounded-full"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-3 mt-8">
                <p className="text-[11px] uppercase tracking-[0.25em] text-[#A86438]">Direct WhatsApp Dispatch</p>
                <a
                  href={generalWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#A86438] text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#8e522c] transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Chat with Team
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
