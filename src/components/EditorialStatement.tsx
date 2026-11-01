import React from 'react';
import { motion } from 'motion/react';

const CIRCLE_COASTAL_BIKE = '/src/assets/images/circle_coastal_bike_1793337217915.jpg';
const CIRCLE_MOUNTAIN_CAR = '/src/assets/images/circle_mountain_car_1793337218652.jpg';

export const EditorialStatement: React.FC = () => {
  return (
    <section
      id="experience"
      className="relative w-full min-h-screen py-24 sm:py-32 flex flex-col justify-center items-center bg-[#ECE3D1] text-[#242320] px-4 sm:px-6 lg:px-12 overflow-hidden border-b border-[#43282A]/10"
    >
      {/* Subtle editorial watermark/grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#242320_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-6xl mx-auto w-full relative z-10 flex flex-col items-center text-center">
        {/* Small label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 mb-8 sm:mb-12"
        >
          <span className="w-8 h-px bg-[#A86438]" />
          <span className="font-editorial-sub text-[#A86438] tracking-[0.28em]">
            THE SRI LANKAN EXPERIENCE
          </span>
          <span className="w-8 h-px bg-[#A86438]" />
        </motion.div>

        {/* Oversized Statement with 2 Circular Images Integrated Between the Text */}
        <div className="w-full max-w-5xl my-4 sm:my-6">
          {/* Row 1: DISCOVER + circle 1 + THE ISLAND */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 mb-2 sm:mb-4">
            <motion.span
              className="font-editorial-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase text-[#242320]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              DISCOVER
            </motion.span>

            {/* Circular Image 1: Coastal road with motorcycle */}
            <motion.div
              className="relative inline-block w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-xl border-2 border-white rotate-[-4deg] shrink-0"
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              whileInView={{ scale: 1, rotate: -4, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={CIRCLE_COASTAL_BIKE}
                alt="Motorcycle ride along the Sri Lanka palm-fringed coast"
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <motion.span
              className="font-editorial-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase text-[#242320]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              THE ISLAND
            </motion.span>
          </div>

          {/* Row 2: ONE RIDE AT + circle 2 + A TIME. */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2">
            <motion.span
              className="font-editorial-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase text-[#242320]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              ONE RIDE AT
            </motion.span>

            {/* Circular Image 2: Mountain road with car */}
            <motion.div
              className="relative inline-block w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-xl border-2 border-white rotate-[4deg] shrink-0"
              initial={{ scale: 0, rotate: 20, opacity: 0 }}
              whileInView={{ scale: 1, rotate: 4, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={CIRCLE_MOUNTAIN_CAR}
                alt="Car navigating misty tea mountain roads of Ella Sri Lanka"
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <motion.span
              className="font-editorial-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase text-[#A86438] italic"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              A TIME.
            </motion.span>
          </div>
        </div>

        {/* Below the headline supporting copy */}
        <motion.p
          className="mt-10 sm:mt-14 max-w-2xl text-base sm:text-lg md:text-xl text-[#43282A]/85 font-light leading-relaxed font-sans"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          "From golden beaches to misty mountain roads, every journey starts with the freedom to explore."
        </motion.p>

        {/* Minimal decorative emblem inspired by a compass or road */}
        <motion.div
          className="mt-12 sm:mt-16 flex flex-col items-center gap-3"
          initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#43282A]/30 flex items-center justify-center p-3">
            {/* Outer dotted compass ring */}
            <div className="absolute inset-1 rounded-full border border-dashed border-[#A86438]/50 animate-[spin_30s_linear_infinite]" />
            {/* Center compass needle road motif */}
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-[#43282A]"
              viewBox="0 0 40 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="20" cy="20" r="18" strokeDasharray="2 3" strokeOpacity="0.4" />
              <path d="M20 4L23 17L36 20L23 23L20 36L17 23L4 20L17 17L20 4Z" fill="#A86438" fillOpacity="0.15" />
              <circle cx="20" cy="20" r="2.5" fill="#43282A" />
              <line x1="20" y1="4" x2="20" y2="36" strokeOpacity="0.6" />
              <line x1="4" y1="20" x2="36" y2="20" strokeOpacity="0.6" />
            </svg>
          </div>
          <span className="font-editorial-sub text-[10px] tracking-[0.3em] text-[#43282A]/60">
            SRI LANKA · 6.9271° N, 79.8612° E
          </span>
        </motion.div>
      </div>
    </section>
  );
};
