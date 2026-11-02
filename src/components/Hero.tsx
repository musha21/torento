import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowDown, ChevronRight, MapPin } from 'lucide-react';
import { generateGeneralInquiryUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { DEFAULT_PICKUP_LOCATION, PICKUP_LOCATIONS } from '../lib/locations';
import heroBg from '../assets/images/hero_srilanka_road_1793337217686.jpg';

const HERO_BG_IMAGE = heroBg;

interface HeroProps {
  onExploreVehicles?: () => void;
}

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const Hero: React.FC<HeroProps> = ({ onExploreVehicles }) => {
  const navigate = useNavigate();
  const minDate = useMemo(() => todayKey(), []);
  const [pickup, setPickup] = useState('');
  const [ret, setRet] = useState('');
  const [location, setLocation] = useState<string>(DEFAULT_PICKUP_LOCATION);
  const [customLocation, setCustomLocation] = useState('');
  const [error, setError] = useState<string | null>(null);

  const whatsappUrl = generateGeneralInquiryUrl();

  const headlineLines = ['THE ROAD', 'IS YOURS.'];

  const resolvedLocation =
    location === 'Other' ? customLocation.trim() || DEFAULT_PICKUP_LOCATION : location;

  const onFind = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!pickup || !ret) {
      setError('Choose pickup and return dates.');
      return;
    }
    if (ret <= pickup) {
      setError('Return date must be after pickup.');
      return;
    }
    const params = new URLSearchParams({
      pickup,
      return: ret,
      location: resolvedLocation,
    });
    navigate(`/vehicles?${params.toString()}`);
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#242320]">
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ scale: 1.08, opacity: 0.9 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src={HERO_BG_IMAGE}
          alt="Rental vehicle driving through scenic green Sri Lankan mountains and palm plantations"
          className="w-full h-full object-cover object-center"
          loading="eager"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#242320] via-black/45 to-black/35" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/50" />
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 pb-28 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="inline-flex items-center gap-2 mb-6"
        >
          <span className="h-px w-6 bg-[#ECE3D1]/60" />
          <span className="font-editorial-sub text-[#ECE3D1] text-[11px] sm:text-xs tracking-[0.26em]">
            EXPLORE SRI LANKA YOUR WAY
          </span>
          <span className="h-px w-6 bg-[#ECE3D1]/60" />
        </motion.div>

        <motion.h1
          className="mb-6 font-editorial-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-normal tracking-tight uppercase leading-[0.92] drop-shadow-md"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {headlineLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-xl text-[#ECE3D1]/90 font-light max-w-2xl mx-auto mb-8 leading-relaxed font-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          Discover Sri Lanka at your own pace. From coastal escapes to mountain adventures, find the
          perfect ride for your journey.
        </motion.p>

        <motion.form
          onSubmit={onFind}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05 }}
          className="w-full max-w-3xl mb-8 rounded-2xl border border-white/20 bg-[#242320]/75 backdrop-blur-md p-3 sm:p-4 shadow-2xl text-left"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-[0.18em] text-[#ECE3D1]/60">
                Pickup date
              </label>
              <input
                type="date"
                min={minDate}
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.18em] text-[#ECE3D1]/60">
                Return date
              </label>
              <input
                type="date"
                min={pickup || minDate}
                value={ret}
                onChange={(e) => setRet(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="text-[10px] uppercase tracking-[0.18em] text-[#ECE3D1]/60">
                Location
              </label>
              <div className="relative mt-1">
                <MapPin className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A86438]" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-white/15 bg-black/30 pl-8 pr-3 py-2.5 text-sm text-white"
                >
                  {PICKUP_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} className="text-[#242320]">
                      {loc}
                    </option>
                  ))}
                  <option value="Other" className="text-[#242320]">
                    Other
                  </option>
                </select>
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-lg bg-white text-[#242320] hover:bg-[#ECE3D1] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
              >
                Find available
              </button>
            </div>
          </div>
          {location === 'Other' && (
            <input
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="Enter pickup location"
              className="mt-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-white/40"
            />
          )}
          {error && <p className="mt-2 text-xs text-amber-200">{error}</p>}
        </motion.form>

        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <a
            href="#vehicles"
            onClick={onExploreVehicles}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#242320] hover:bg-[#ECE3D1] font-semibold text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>EXPLORE VEHICLES</span>
            <ChevronRight className="w-4 h-4 text-[#A86438]" />
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-[#ECE3D1] hover:text-white border border-[#ECE3D1]/40 hover:border-white font-semibold text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 hover:bg-white/10 active:scale-[0.98]"
          >
            <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
            <span>BOOK THROUGH WHATSAPP</span>
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <a
          href="#experience"
          className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#242320]/75 backdrop-blur-md border border-white/20 text-[#ECE3D1] hover:border-white/50 hover:text-white transition-all duration-300 shadow-lg text-[11px] uppercase tracking-[0.22em] font-medium"
        >
          <span>START YOUR JOURNEY</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-3.5 h-3.5 text-[#A86438]" />
          </motion.span>
        </a>
      </motion.div>
    </section>
  );
};
