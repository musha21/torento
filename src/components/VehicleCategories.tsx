import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import type { Category } from '../types/database';
import { fetchCategories } from '../lib/vehicles';

interface VehicleCategoriesProps {
  onSelectCategory: (category: string) => void;
}

const CATEGORY_IMAGE_BY_SLUG: Record<string, string> = {
  cars: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
  bikes: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80',
  premium: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
};

const GENERIC_CATEGORY_IMAGE =
  'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=900&q=80';

function imageForCategory(cat: Category): string {
  if (cat.image) return cat.image;
  return CATEGORY_IMAGE_BY_SLUG[cat.slug] || GENERIC_CATEGORY_IMAGE;
}

export const VehicleCategories: React.FC<VehicleCategoriesProps> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchCategories().then((list) => {
      if (mounted) setCategories(list);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!categories.length) return null;

  return (
    <section id="categories" className="py-24 sm:py-32 bg-[#E6DCC8]/40 border-b border-[#43282A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            From nimble beach scooters along southern surf bays to premium hybrid sedans traversing high mountain
            passes, choose the vehicle tailored to your Sri Lankan journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => {
            const title = cat.name.toUpperCase();
            const description =
              cat.description?.trim() ||
              `Browse our ${cat.name.toLowerCase()} available for self-drive and chauffeur journeys across Sri Lanka.`;
            const imageUrl = imageForCategory(cat);
            const number = String(idx + 1).padStart(2, '0');

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                className="group relative bg-[#ECE3D1] border border-[#43282A]/15 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-[#A86438]/50"
              >
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-[#242320]">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#242320]/80 via-[#242320]/20 to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#242320]/80 backdrop-blur-xs px-3 py-1 rounded-sm border border-white/10 text-white">
                    <span className="font-editorial-sub text-[10px] tracking-[0.2em]">
                      CATEGORY {number}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-editorial-heading text-2xl sm:text-3xl text-[#242320] uppercase mb-2 group-hover:text-[#A86438] transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-[#43282A]/85 font-light leading-relaxed mb-6">{description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectCategory(cat.slug)}
                    className="w-full mt-2 inline-flex items-center justify-between px-5 py-3.5 bg-[#43282A] text-white hover:bg-[#A86438] transition-colors duration-200 text-xs uppercase tracking-[0.2em] font-semibold cursor-pointer group-hover:bg-[#A86438]"
                  >
                    <span>EXPLORE {title}</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
