import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import coastalBike from '../../assets/images/circle_coastal_bike_1793337217915.jpg';

export const authFieldClass =
  'mt-1.5 w-full border-0 border-b border-[#43282A]/25 bg-transparent px-0 py-3 text-sm text-[#242320] placeholder:text-[#43282A]/40 focus:outline-none focus:border-[#A86438] focus:ring-0 transition-colors duration-200';

export const authLabelClass =
  'text-[10px] font-medium uppercase tracking-[0.18em] text-[#43282A]/65';

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  banner?: React.ReactNode;
  footer?: React.ReactNode;
};

export const AuthShell: React.FC<AuthShellProps> = ({
  title,
  subtitle,
  children,
  banner,
  footer,
}) => {
  return (
    <div className="min-h-svh bg-[#ECE3D1] text-[#242320] lg:grid lg:grid-cols-2">
      {/* Visual panel — coastal bike */}
      <div className="relative h-[32vh] min-h-[200px] overflow-hidden lg:h-svh lg:min-h-0">
        <motion.img
          src={coastalBike}
          alt="Motorcycle on a coastal road in Sri Lanka"
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          initial={{ scale: 1.08, opacity: 0.85 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#242320] via-[#242320]/45 to-[#242320]/25 lg:bg-gradient-to-r lg:from-[#242320]/75 lg:via-[#242320]/35 lg:to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8 lg:p-12">
          <Link to="/" className="inline-flex w-fit flex-col gap-1">
            <img
              src="/brand/torento-logo.png"
              alt="TORENTO"
              className="h-11 w-auto object-contain drop-shadow-md sm:h-14"
            />
          </Link>

          <motion.div
            className="max-w-md text-white"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            <p className="font-editorial-sub mb-3 text-[10px] tracking-[0.28em] text-[#E9AB00] uppercase sm:text-[11px]">
              Rent a car &amp; bike in Sri Lanka
            </p>
            <p className="font-editorial-heading text-3xl leading-[1.05] font-normal tracking-tight uppercase sm:text-4xl lg:text-5xl">
              Freedom on
              <br />
              <span className="italic text-[#ECE3D1]/95">two wheels.</span>
            </p>
            <p className="mt-3 hidden max-w-sm text-sm font-light text-white/80 lg:block">
              Your journey. Your freedom. Sign in to manage bookings and continue exploring the
              island at your own pace.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form panel — open column, no card box */}
      <div className="relative flex items-start justify-center px-6 py-10 sm:px-10 lg:items-center lg:py-16">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-8 lg:hidden">
            <Link to="/" className="inline-block">
              <img
                src="/brand/torento-logo-on-black.png"
                alt="TORENTO"
                className="h-12 object-contain"
              />
            </Link>
          </div>

          <h1 className="font-editorial-heading mb-1 text-3xl text-[#242320] sm:text-4xl">
            {title}
          </h1>
          <p className="mb-8 text-sm text-[#43282A]/80">{subtitle}</p>
          {banner}
          {children}
          {footer}

          <p className="mt-8 text-center text-[11px] tracking-wide text-[#43282A]/45 uppercase">
            Shared portal for customers &amp; administrators
          </p>
        </motion.div>
      </div>
    </div>
  );
};
