import React from 'react';
import { motion } from 'motion/react';
import { Search, Send, Compass, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: 'STEP 01',
      title: 'CHOOSE',
      action: 'Browse available cars and bikes.',
      description:
        'Explore our handpicked fleet of hybrid sedans, economical hatchbacks, and coastal motorbikes with transparent daily rates.',
      icon: Search,
    },
    {
      step: 'STEP 02',
      title: 'CONTACT',
      action: 'Send your rental requirements through WhatsApp.',
      description:
        'Click to connect directly. Share your preferred pickup location (Airport CMB, Colombo, or coastal hub) and travel dates with our team.',
      icon: Send,
    },
    {
      step: 'STEP 03',
      title: 'EXPLORE',
      action: 'Confirm the booking with the rental team and enjoy your journey.',
      description:
        'Meet your representative, review your vehicle in person, collect the keys, and experience the full freedom of Sri Lanka.',
      icon: Compass,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-[#ECE3D1] border-b border-[#43282A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-px bg-[#A86438]" />
            <span className="font-editorial-sub text-[#A86438] tracking-[0.25em]">
              THE PROCESS
            </span>
            <span className="w-6 h-px bg-[#A86438]" />
          </div>
          <h2 className="font-editorial-heading text-4xl sm:text-5xl lg:text-6xl text-[#242320] uppercase font-normal leading-[1.05]">
            THREE STEPS. <br />
            <span className="italic text-[#43282A]">ONE ADVENTURE.</span>
          </h2>
        </div>

        {/* Horizontal Timeline on Desktop / Vertical Timeline on Mobile */}
        <div className="relative">
          {/* Desktop timeline horizontal line */}
          <div className="hidden lg:block absolute top-10 left-[16%] right-[16%] h-px bg-[#43282A]/20 -z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 relative z-10">
            {steps.map((st) => {
              const IconComp = st.icon;
              return (
                <div
                  key={st.step}
                  className="flex flex-col items-center text-center p-8 bg-white border border-[#43282A]/20 shadow-md relative group transition-all duration-300"
                >
                  {/* Step Node Icon */}
                  <div className="w-16 h-16 rounded-full bg-[#43282A] text-white flex items-center justify-center mb-5 shadow-sm group-hover:bg-[#A86438] transition-colors duration-300">
                    <IconComp className="w-7 h-7" />
                  </div>

                  {/* Step Label */}
                  <span className="font-editorial-sub text-[#A86438] text-[11px] tracking-[0.24em] mb-2 font-mono">
                    {st.step}
                  </span>

                  {/* Step Title */}
                  <h3 className="font-editorial-heading text-3xl text-[#242320] uppercase mb-2">
                    {st.title}
                  </h3>

                  {/* Action */}
                  <p className="text-xs uppercase tracking-[0.16em] text-[#43282A] font-semibold mb-3">
                    {st.action}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-[#43282A]/85 font-light leading-relaxed">
                    {st.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Action below steps */}
        <div className="mt-14 text-center">
          <a
            href="#vehicles"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-[#A86438] hover:text-[#43282A] transition-colors"
          >
            <span>Start Step 1: Browse Available Fleet</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
