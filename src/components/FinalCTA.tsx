import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Compass } from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { generateGeneralInquiryUrl } from '../utils/whatsapp';
import finalCtaImage from '../assets/images/final_cta_adventure_1793337219003.jpg';

const FINAL_CTA_IMAGE = finalCtaImage;

export const FinalCTA: React.FC = () => {
  const whatsappUrl = generateGeneralInquiryUrl(
    "Hello Torento! I'm ready to begin planning my Sri Lanka rental journey. Please advise on available cars and motorbikes for my travel dates."
  );

  return (
    <section className="relative w-full min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-[#242320]">
      {/* Cinematic Full-Width Background */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={FINAL_CTA_IMAGE}
          alt="Travelers with vehicle overlooking scenic green Sri Lankan mountains at sunset"
          className="w-full h-full object-cover object-center"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {/* Editorial Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#242320] via-black/55 to-black/40" />
      </div>

      {/* Content Box */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 flex flex-col items-center">
        {/* Emblem or Top Marker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-6"
        >
          <Compass className="w-4 h-4 text-[#A86438] animate-spin-slow" />
          <span className="font-editorial-sub text-[#ECE3D1] text-[11px] tracking-[0.28em]">
            TORENTO RENTALS · SRI LANKA
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-editorial-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-normal uppercase leading-[0.94] tracking-tight mb-8"
        >
          YOUR SRI LANKAN <br />
          ADVENTURE <br />
          <span className="italic text-[#ECE3D1]">STARTS HERE.</span>
        </motion.h2>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl text-[#ECE3D1]/90 font-light max-w-xl mx-auto mb-10 leading-relaxed font-sans"
        >
          Choose your ride. Discover new places. Make every kilometre count.
        </motion.p>

        {/* Dual CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto"
        >
          <a
            href="#vehicles"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#242320] hover:bg-[#ECE3D1] font-semibold text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>FIND YOUR RIDE</span>
            <ChevronRight className="w-4 h-4 text-[#A86438]" />
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>CHAT ON WHATSAPP</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
