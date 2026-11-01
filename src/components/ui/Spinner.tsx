import React from 'react';

export const Spinner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#A86438]/30 border-t-[#A86438] ${className}`}
    role="status"
    aria-label="Loading"
  />
);

export const PageLoader: React.FC<{ label?: string }> = ({ label = 'Loading…' }) => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 bg-[#ECE3D1] text-[#242320]">
    <Spinner className="h-8 w-8" />
    <p className="text-sm tracking-wide text-[#43282A]/80">{label}</p>
  </div>
);
