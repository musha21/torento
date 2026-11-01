import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VehicleImageCarouselProps {
  images: string[];
  alt: string;
  intervalMs?: number;
  /** Extra classes on the root (e.g. `!aspect-auto h-full` inside fixed-height cards). */
  className?: string;
}

export const VehicleImageCarousel: React.FC<VehicleImageCarouselProps> = ({
  images,
  alt,
  intervalMs = 4000,
  className = '',
}) => {
  const slides = images.filter(Boolean).slice(0, 4);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    setIndex(0);
  }, [slides.join('|')]);

  useEffect(() => {
    if (slides.length <= 1 || paused || reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, paused, reduceMotion, intervalMs]);

  if (slides.length === 0) {
    return (
      <div className="aspect-[4/3] bg-[#242320] overflow-hidden flex items-center justify-center text-[#ECE3D1]/50 text-sm">
        No photos
      </div>
    );
  }

  const go = (dir: -1 | 1, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIndex((i) => (i + dir + slides.length) % slides.length);
  };

  const stopNav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={`relative aspect-[4/3] bg-[#242320] overflow-hidden group ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={`${alt}${slides.length > 1 ? ` — photo ${i + 1}` : ''}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          loading={i === 0 ? 'eager' : 'lazy'}
          referrerPolicy="no-referrer"
        />
      ))}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => go(-1, e)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/45 text-white opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => go(1, e)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/45 text-white opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                onClick={(e) => {
                  stopNav(e);
                  setIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
