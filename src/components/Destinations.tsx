import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import { DESTINATIONS, Destination } from '../data/destinations';

interface DestinationsProps {
  onSelectVehicleForDestination?: (vehicleName: string) => void;
}

export const Destinations: React.FC<DestinationsProps> = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeDest = DESTINATIONS[activeIdx];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % DESTINATIONS.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + DESTINATIONS.length) % DESTINATIONS.length);
  };

  return (
    <section id="destinations" className="py-24 sm:py-32 bg-[#242320] text-[#ECE3D1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-px bg-[#A86438]" />
              <span className="font-editorial-sub text-[#A86438] tracking-[0.25em]">
                YOUR JOURNEY STARTS HERE
              </span>
            </div>
            <h2 className="font-editorial-heading text-4xl sm:text-5xl lg:text-6xl text-white uppercase font-normal leading-[1.05]">
              BEYOND THE <br />
              <span className="italic text-[#ECE3D1]/80">ORDINARY.</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#ECE3D1]/50 font-mono">
              0{activeIdx + 1} / 0{DESTINATIONS.length}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Destination"
                className="w-10 h-10 rounded-full border border-white/20 hover:border-white/60 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Destination"
                className="w-10 h-10 rounded-full border border-white/20 hover:border-white/60 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Spotlight Hero for Active Destination */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          {/* Main Visual Frame (7 cols) */}
          <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[480px] lg:h-[540px] overflow-hidden border border-white/10 group">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeDest.id}
                src={activeDest.imageUrl}
                alt={activeDest.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#242320] via-[#242320]/20 to-transparent" />

            {/* In-photo Badge */}
            <div className="absolute top-6 left-6 bg-[#242320]/80 backdrop-blur-md px-4 py-2 border border-white/10 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#A86438]" />
              <span className="font-editorial-sub text-[10px] text-white tracking-[0.22em]">
                {activeDest.region}
              </span>
            </div>

            {/* Bottom Title on Image */}
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="font-editorial-heading text-4xl sm:text-5xl text-white uppercase tracking-tight mb-1">
                {activeDest.name}
              </h3>
              <p className="text-sm text-[#ECE3D1]/80 font-light">
                {activeDest.tagline}
              </p>
            </div>
          </div>

          {/* Editorial Detail Column (5 cols) */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 p-8 sm:p-10 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDest.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div>
                  <span className="font-editorial-sub text-[#A86438] text-[10px] tracking-[0.26em] block mb-2">
                    DESTINATION PROFILE
                  </span>
                  <h4 className="font-editorial-heading text-2xl sm:text-3xl text-white uppercase mb-4">
                    {activeDest.name}
                  </h4>
                  <p className="text-sm text-[#ECE3D1]/85 font-light leading-relaxed">
                    {activeDest.description}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#A86438] block font-medium">
                      Geography & Atmosphere
                    </span>
                    <span className="text-xs text-white font-medium">
                      {activeDest.elevationOrVibe}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#A86438] block font-medium">
                      Recommended Rental Pairing
                    </span>
                    <span className="text-xs text-white font-medium">
                      {activeDest.recommendedRide}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#A86438] block font-medium">
                      Transit Distance
                    </span>
                    <span className="text-xs text-white font-medium">
                      {activeDest.distanceFromColombo}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#A86438] block font-medium mb-1">
                      Scenic Driving Highlights
                    </span>
                    <div className="flex flex-wrap gap-2 text-xs text-[#ECE3D1]/80">
                      {activeDest.scenicHighlights.map((hl) => (
                        <span
                          key={hl}
                          className="px-2.5 py-1 bg-white/5 border border-white/10 text-[11px]"
                        >
                          {hl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <Link
                to={`/destinations/${activeDest.id}`}
                className="flex-1 inline-flex items-center justify-between px-6 py-3.5 border border-white/25 hover:border-[#A86438] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors"
              >
                <span>Explore {activeDest.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/vehicles"
                className="flex-1 inline-flex items-center justify-between px-6 py-3.5 bg-[#A86438] hover:bg-[#8e522c] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors"
              >
                <span>Choose ride</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Horizontal Editorial Thumbnail Strip (Click to switch) */}
        <div>
          <span className="font-editorial-sub text-white/40 text-[10px] tracking-[0.25em] block mb-4">
            SELECT DESTINATION TO EXPLORE
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {DESTINATIONS.map((dest, idx) => {
              const isSelected = idx === activeIdx;
              return (
                <button
                  type="button"
                  key={dest.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`text-left p-2.5 sm:p-3 border transition-all duration-200 cursor-pointer group ${
                    isSelected
                      ? 'border-[#A86438] bg-white/10'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <div className="relative h-20 sm:h-24 w-full mb-2 overflow-hidden">
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 text-[9px] font-mono text-white">
                      0{idx + 1}
                    </div>
                  </div>
                  <h5 className="font-editorial-heading text-sm text-white uppercase truncate">
                    {dest.name}
                  </h5>
                  <p className="text-[10px] text-white/50 truncate">
                    {dest.region.split('·')[0]}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
