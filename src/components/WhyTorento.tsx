import React from 'react';
import { motion } from 'motion/react';
import { MessageSquareText, CalendarRange, Users2, Compass } from 'lucide-react';

export const WhyTorento: React.FC = () => {
  const benefits = [
    {
      number: '01',
      title: 'EASY BOOKING',
      description: 'Book your vehicle directly through WhatsApp.',
      detail:
        'Skip bureaucratic rental desks. Inquire, share your dates, inspect real photos of the exact car or bike, and confirm details directly with our team on WhatsApp.',
      icon: MessageSquareText,
    },
    {
      number: '02',
      title: 'FLEXIBLE RENTALS',
      description: 'Rental options for different travel needs and durations.',
      detail:
        'Whether you need a surf-hopper scooter for 3 days in Weligama or a family hybrid sedan for a fortnight grand loop across the tea hills, we tailor agreements to your itinerary.',
      icon: CalendarRange,
    },
    {
      number: '03',
      title: 'LOCAL SUPPORT',
      description: 'Get assistance from a local rental team.',
      detail:
        'Our native Sri Lankan team understands local highway rules, mountain elevation climbs, and weather changes. We are always one WhatsApp message away for honest local route advice.',
      icon: Users2,
    },
    {
      number: '04',
      title: 'FREEDOM TO EXPLORE',
      description: 'Discover Sri Lanka on your own schedule.',
      detail:
        'Stop at roadside king coconut stalls, linger at golden beach sunsets, and conquer misty mountain passes on your own rhythm without tour bus constraints.',
      icon: Compass,
    },
  ];

  return (
    <section id="why-torento" className="py-24 sm:py-32 bg-[#E6DCC8]/50 border-b border-[#43282A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-px bg-[#A86438]" />
            <span className="font-editorial-sub text-[#A86438] tracking-[0.25em]">
              THE TORENTO DIFFERENCE
            </span>
          </div>
          <h2 className="font-editorial-heading text-4xl sm:text-5xl lg:text-6xl text-[#242320] uppercase font-normal leading-[1.05]">
            TRAVEL WITH <br />
            <span className="italic text-[#43282A]">CONFIDENCE.</span>
          </h2>
        </div>

        {/* 4 Benefits with Thin Hairline Separators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-[#43282A]/15 border-t border-b border-[#43282A]/15 py-10 sm:py-12">
          {benefits.map((b, idx) => {
            const IconComponent = b.icon;
            return (
              <motion.div
                key={b.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="lg:px-8 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#A86438] font-semibold">
                      {b.number}
                    </span>
                    <IconComponent className="w-5 h-5 text-[#43282A]/60 group-hover:text-[#A86438] transition-colors" />
                  </div>

                  <h3 className="font-editorial-heading text-xl sm:text-2xl text-[#242320] uppercase mb-3 leading-snug">
                    {b.title}
                  </h3>

                  <p className="text-xs uppercase tracking-[0.14em] text-[#A86438] font-medium mb-3">
                    {b.description}
                  </p>

                  <p className="text-sm text-[#43282A]/80 font-light leading-relaxed">
                    {b.detail}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
