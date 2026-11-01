import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Car, Compass, ShieldCheck } from 'lucide-react';

interface VehicleCategoriesProps {
  onSelectCategory: (category: 'cars' | 'bikes' | 'premium') => void;
}

export const VehicleCategories: React.FC<VehicleCategoriesProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'cars' as const,
      number: '01',
      title: 'CARS',
      subtitle: 'Comfort & Family Island Touring',
      description: 'Comfortable journeys for families, couples and travellers exploring the island.',
      fleet: ['Toyota Prius', 'Toyota Axio', 'Suzuki Wagon R', 'Toyota Aqua'],
      rateRange: 'From LKR 7,000 / day',
      cta: 'EXPLORE CARS',
      // High-res editorial automobile image
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 'bikes' as const,
      number: '02',
      title: 'BIKES',
      subtitle: 'Coastline Hoppers & Mountain Steeds',
      description: "Experience the freedom of Sri Lanka's coastal roads and hidden destinations.",
      fleet: ['Honda Dio', 'Honda Hornet', 'Yamaha FZ', 'Bajaj Pulsar'],
      rateRange: 'From LKR 3,000 / day',
      cta: 'EXPLORE BIKES',
      // High-res editorial motorcycle coastal image
      imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 'premium' as const,
      number: '03',
      title: 'PREMIUM RIDES',
      subtitle: 'Executive Comfort & Chauffeur Grade',
      description: 'More space, more comfort and a premium experience for longer journeys.',
      fleet: ['Toyota Allion', 'Toyota Premio', 'Toyota Corolla'],
      rateRange: 'From LKR 11,500 / day',
      cta: 'EXPLORE PREMIUM',
      // High-res editorial luxury VIP sedan
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
    },
  ];

  return (
    <section id="categories" className="py-24 sm:py-32 bg-[#E6DCC8]/40 border-b border-[#43282A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-px bg-[#A86438]" />
              <span className="font-editorial-sub text-[#A86438] tracking-[0.25em]">
                FIND YOUR PERFECT RIDE
              </span>
            </div>
            <h2 className="font-editorial-heading text-4xl sm:text-5xl lg:text-6xl text-[#242320] uppercase font-normal leading-[1.05]">
              READY FOR <br />
              <span className="italic text-[#43282A]">THE ROAD?</span>
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#43282A]/80 font-light leading-relaxed">
            From nimble beach scooters along southern surf bays to premium hybrid sedans traversing high mountain passes, choose the vehicle tailored to your Sri Lankan journey.
          </p>
        </div>

        {/* 3 Editorial Category Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              className="group relative bg-[#ECE3D1] border border-[#43282A]/15 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-[#A86438]/50"
            >
              {/* Top Image Container with zoom on hover */}
              <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-[#242320]">
                <img
                  src={cat.imageUrl}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#242320]/80 via-[#242320]/20 to-transparent" />

                {/* Editorial Category Index Tag */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#242320]/80 backdrop-blur-xs px-3 py-1 rounded-sm border border-white/10 text-white">
                  <span className="font-editorial-sub text-[10px] tracking-[0.2em]">
                    CATEGORY {cat.number}
                  </span>
                </div>

                {/* Rate tag */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/70 block">
                      Starting Rate
                    </span>
                    <span className="text-sm font-semibold tracking-wide text-[#ECE3D1]">
                      {cat.rateRange}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-editorial-heading text-2xl sm:text-3xl text-[#242320] uppercase mb-2 group-hover:text-[#A86438] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#A86438] font-medium mb-4">
                    {cat.subtitle}
                  </p>
                  <p className="text-sm text-[#43282A]/85 font-light leading-relaxed mb-6">
                    {cat.description}
                  </p>

                  {/* Suggested fleet preview (unboxed metadata) */}
                  <div className="pt-4 border-t border-[#43282A]/10 mb-6">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#43282A]/60 block mb-2 font-medium">
                      Featured Island Models
                    </span>
                    <p className="text-xs text-[#242320] font-medium leading-relaxed">
                      {cat.fleet.join(' · ')}
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className="w-full mt-2 inline-flex items-center justify-between px-5 py-3.5 bg-[#43282A] text-white hover:bg-[#A86438] transition-colors duration-200 text-xs uppercase tracking-[0.2em] font-semibold cursor-pointer group-hover:bg-[#A86438]"
                >
                  <span>{cat.cta}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
