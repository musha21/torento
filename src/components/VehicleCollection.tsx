import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Car,
  Fuel,
  Users,
  Search,
  SlidersHorizontal,
  Info,
  CalendarCheck,
  CheckCircle2,
} from 'lucide-react';
import { VEHICLES } from '../data/vehicles';
import type { Category, LegacyVehicle } from '../types/database';
import { fetchCategories, fetchLegacyVehicles } from '../lib/vehicles';
import {
  formatLkrPrice,
  convertLkrToUsd,
  generateVehicleInquiryUrl,
  generateGeneralInquiryUrl,
  filterVehicles,
  vehicleTypeLabel,
} from '../utils/whatsapp';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { VehicleImageCarousel } from './vehicles/VehicleImageCarousel';

interface VehicleCollectionProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onOpenCustomQuote: (vehicle: LegacyVehicle) => void;
}

export const VehicleCollection: React.FC<VehicleCollectionProps> = ({
  activeCategory,
  onCategoryChange,
  onOpenCustomQuote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currencyMode, setCurrencyMode] = useState<'LKR' | 'USD'>('LKR');
  const [fleet, setFleet] = useState<LegacyVehicle[]>(VEHICLES);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchLegacyVehicles(), fetchCategories()]).then(([list, cats]) => {
      if (!mounted) return;
      if (list.length) setFleet(list);
      setDbCategories(cats);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const categories = [
    { id: 'all', label: 'ALL FLEET' },
    ...dbCategories.map((c) => ({
      id: c.slug,
      label: c.name.toUpperCase(),
    })),
  ];

  const filteredVehicles = filterVehicles(fleet, activeCategory, searchQuery);

  return (
    <section id="vehicles" className="py-24 sm:py-32 bg-[#ECE3D1] border-b border-[#43282A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-px bg-[#A86438]" />
              <span className="font-editorial-sub text-[#A86438] tracking-[0.25em]">
                OUR COLLECTION
              </span>
            </div>
            <h2 className="font-editorial-heading text-4xl sm:text-5xl lg:text-6xl text-[#242320] uppercase font-normal leading-[1.05]">
              FIND YOUR <br />
              <span className="italic text-[#43282A]">NEXT RIDE.</span>
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            {/* Currency switcher for tourists & locals */}
            <div className="flex items-center gap-2 text-xs font-medium text-[#43282A]/70">
              <span className="uppercase tracking-widest text-[10px]">Show Rates in:</span>
              <div className="inline-flex p-1 bg-[#E6DCC8] border border-[#43282A]/15 rounded-xs">
                <button
                  type="button"
                  onClick={() => setCurrencyMode('LKR')}
                  className={`px-2.5 py-1 text-[11px] font-semibold tracking-wider transition-colors cursor-pointer ${
                    currencyMode === 'LKR'
                      ? 'bg-[#43282A] text-white shadow-xs'
                      : 'text-[#43282A] hover:text-black'
                  }`}
                >
                  LKR (රු)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrencyMode('USD')}
                  className={`px-2.5 py-1 text-[11px] font-semibold tracking-wider transition-colors cursor-pointer ${
                    currencyMode === 'USD'
                      ? 'bg-[#43282A] text-white shadow-xs'
                      : 'text-[#43282A] hover:text-black'
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            <p className="text-xs text-[#43282A]/70 flex items-center gap-1.5 font-light">
              <Info className="w-3.5 h-3.5 text-[#A86438] shrink-0" />
              <span>Demonstration sample rates. Direct inquiry confirms live quote.</span>
            </p>
          </div>
        </div>

        {/* Filter Controls Bar (Zero-Pill discipline: clean segmented tabs + search) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#43282A]/15">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onCategoryChange(cat.id)}
                  className={`px-4 sm:px-5 py-2 text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-200 cursor-pointer border ${
                    isActive
                      ? 'bg-[#43282A] text-white border-[#43282A] shadow-xs'
                      : 'bg-transparent text-[#43282A]/75 border-transparent hover:border-[#43282A]/30 hover:text-[#242320]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-[#43282A]/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search model, hybrid, auto..."
              className="w-full bg-white/70 border border-[#43282A]/20 pl-9 pr-4 py-2 text-xs text-[#242320] placeholder-[#43282A]/40 focus:outline-hidden focus:border-[#A86438] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#43282A]/60 hover:text-black uppercase tracking-wider"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Vehicle Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-20 bg-white/40 border border-[#43282A]/10 p-8">
            <Car className="w-10 h-10 text-[#A86438] mx-auto mb-3 opacity-60" />
            <h3 className="font-editorial-heading text-xl uppercase text-[#242320] mb-2">
              No vehicles matched your search
            </h3>
            <p className="text-sm text-[#43282A]/70 mb-4">
              Try adjusting your filter or search query.
            </p>
            <button
              type="button"
              onClick={() => {
                onCategoryChange('all');
                setSearchQuery('');
              }}
              className="text-xs uppercase tracking-[0.16em] font-semibold text-[#A86438] underline hover:text-[#43282A]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle, cardIndex) => {
              const directWhatsAppUrl = generateVehicleInquiryUrl(vehicle.name, {
                vehicleType: vehicleTypeLabel(vehicle.category),
                pricePerDay: vehicle.dailyRateLkr,
              });
              const cardImages = [vehicle.imageUrl, ...(vehicle.gallery || [])].filter(Boolean);

              return (
                <div
                  key={vehicle.id}
                  className="group bg-white/80 border border-[#43282A]/15 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-[#A86438]/60"
                >
                  {/* Vehicle Image with auto carousel & badge */}
                  <div className="relative h-60 w-full overflow-hidden bg-[#242320]">
                    <VehicleImageCarousel
                      images={cardImages}
                      alt={`${vehicle.name} rental in Sri Lanka`}
                      intervalMs={4000 + (cardIndex % 3) * 400}
                      className="!aspect-auto h-full"
                    />
                    <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Category Label */}
                    <div className="pointer-events-none absolute top-3 left-3 z-[6] bg-[#242320]/80 backdrop-blur-xs px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#ECE3D1] border border-white/10 font-medium">
                      {vehicle.category}
                    </div>

                    {/* Optional badge */}
                    {vehicle.badge && (
                      <div className="pointer-events-none absolute top-3 right-3 z-[6] bg-[#A86438] text-white px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold">
                        {vehicle.badge}
                      </div>
                    )}

                    {/* Availability bottom overlay */}
                    <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-[6] flex items-center justify-between text-white">
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-[#ECE3D1]/90 font-medium tracking-wide">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {vehicle.availability}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Name & Rate */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-editorial-heading text-2xl text-[#242320] uppercase group-hover:text-[#A86438] transition-colors leading-tight">
                            {vehicle.name}
                          </h3>
                          <span className="text-[11px] uppercase tracking-[0.14em] text-[#43282A]/60">
                            {vehicle.categoryLabel}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-editorial-heading text-xl font-bold text-[#43282A] block leading-none tabular-nums">
                            {currencyMode === 'LKR'
                              ? formatLkrPrice(vehicle.dailyRateLkr)
                              : convertLkrToUsd(vehicle.dailyRateLkr)}
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.14em] text-[#43282A]/60 block mt-0.5">
                            per day
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#43282A]/80 font-light leading-relaxed my-3 line-clamp-2">
                        {vehicle.description}
                      </p>

                      {/* Specs Row with unboxed metadata separators */}
                      <div className="pt-3 pb-4 border-t border-[#43282A]/10 grid grid-cols-3 gap-2 text-center text-xs text-[#43282A]/85">
                        <div className="p-2 bg-[#E6DCC8]/40 border border-[#43282A]/10">
                          <span className="text-[9px] uppercase tracking-wider text-[#43282A]/60 block mb-0.5">
                            Gearbox
                          </span>
                          <span className="font-medium text-[11px] block truncate">
                            {vehicle.transmission}
                          </span>
                        </div>
                        <div className="p-2 bg-[#E6DCC8]/40 border border-[#43282A]/10">
                          <span className="text-[9px] uppercase tracking-wider text-[#43282A]/60 block mb-0.5">
                            Fuel
                          </span>
                          <span className="font-medium text-[11px] block truncate">
                            {vehicle.fuelType}
                          </span>
                        </div>
                        <div className="p-2 bg-[#E6DCC8]/40 border border-[#43282A]/10">
                          <span className="text-[9px] uppercase tracking-wider text-[#43282A]/60 block mb-0.5">
                            Capacity
                          </span>
                          <span className="font-medium text-[11px] block truncate">
                            {vehicle.capacity}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#43282A]/10 space-y-2">
                      <Link
                        to={`/vehicles/${vehicle.slug || vehicle.id}`}
                        className="block w-full py-2.5 px-3 border border-[#A86438]/40 text-[#A86438] hover:bg-[#A86438]/10 text-[11px] uppercase tracking-[0.14em] font-semibold text-center transition-colors"
                      >
                        View Details
                      </Link>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenCustomQuote(vehicle)}
                          className="py-2.5 px-3 border border-[#43282A]/30 hover:border-[#43282A] text-[#43282A] hover:bg-[#43282A]/5 text-[11px] uppercase tracking-[0.14em] font-semibold transition-colors text-center cursor-pointer"
                        >
                          Trip Quote
                        </button>
                        <a
                          href={directWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] uppercase tracking-[0.14em] font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5" />
                          <span>Book Ride</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Note on Pricing Integrity */}
        <div className="mt-14 p-6 bg-[#E6DCC8]/70 border border-[#43282A]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-[#43282A]/85">
            <span className="w-2 h-2 rounded-full bg-[#A86438] shrink-0" />
            <span>
              Rates include standard road taxes and safety gear. Chauffeur guides, child seats, and airport meet-and-greet available upon request.
            </span>
          </div>

          <a
            href={generateGeneralInquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.18em] font-bold text-[#A86438] hover:text-[#43282A] underline whitespace-nowrap cursor-pointer"
          >
            Custom Fleet Request →
          </a>
        </div>
      </div>
    </section>
  );
};
