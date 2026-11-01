import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { FloatingWhatsApp } from '../../components/FloatingWhatsApp';
import { SeoHead } from '../../components/seo/SeoHead';
import { DESTINATIONS } from '../../data/destinations';
import { PAGE_META } from '../../lib/seo/meta';
import { breadcrumbJsonLd } from '../../lib/seo/structuredData';

export default function DestinationsIndexPage() {
  const meta = PAGE_META.destinationsIndex;
  const jsonLd = useMemo(
    () => [
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Destinations', path: '/destinations' },
      ]),
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[#ECE3D1] text-[#242320] flex flex-col">
      <SeoHead {...meta} jsonLd={jsonLd} />
      <Navbar variant="light" />
      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-editorial-sub text-[#A86438] mb-2 tracking-[0.2em] text-xs">
            DESTINATIONS
          </p>
          <h1 className="font-editorial-heading text-4xl sm:text-5xl uppercase mb-3">
            Sri Lanka by road
          </h1>
          <p className="text-[#43282A]/80 max-w-2xl mb-12">
            Scenic places that pair well with a TORENTO car or bike — from misty Ella to Mirissa’s
            coast.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESTINATIONS.map((dest) => (
              <Link
                key={dest.id}
                to={`/destinations/${dest.id}`}
                className="group bg-white/60 border border-[#43282A]/15 overflow-hidden hover:border-[#A86438]/50 transition-colors"
              >
                <div className="h-48 overflow-hidden bg-[#242320]">
                  <img
                    src={dest.imageUrl}
                    alt={`${dest.name}, Sri Lanka — scenic travel destination`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h2 className="font-editorial-heading text-2xl uppercase mb-1">{dest.name}</h2>
                  <p className="text-[11px] uppercase tracking-wider text-[#43282A]/60 mb-2">
                    {dest.region}
                  </p>
                  <p className="text-sm text-[#43282A]/85">{dest.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
