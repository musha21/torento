import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { WhyTorento } from '../components/WhyTorento';
import { HowItWorks } from '../components/HowItWorks';
import { SeoHead } from '../components/seo/SeoHead';
import { PAGE_META } from '../lib/seo/meta';
import { organizationJsonLd, websiteJsonLd } from '../lib/seo/structuredData';

export default function AboutPage() {
  const meta = PAGE_META.about;
  const jsonLd = useMemo(() => [organizationJsonLd(), websiteJsonLd()], []);

  return (
    <div className="min-h-screen bg-[#ECE3D1] text-[#242320] flex flex-col">
      <SeoHead {...meta} jsonLd={jsonLd} />
      <Navbar variant="light" />
      <main className="flex-1 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <p className="font-editorial-sub text-[#A86438] mb-2 tracking-[0.2em] text-xs">ABOUT</p>
          <h1 className="font-editorial-heading text-4xl sm:text-5xl lg:text-6xl uppercase mb-6 leading-tight">
            Travel Sri Lanka <span className="italic text-[#43282A]">your way</span>
          </h1>
          <div className="max-w-3xl space-y-4 text-[#43282A]/90 leading-relaxed">
            <p>
              TORENTO is a Sri Lanka–focused car and bike rental experience for international tourists
              and local explorers who want freedom on the road — beaches, heritage cities, and tea
              country on their own schedule.
            </p>
            <p>
              We keep booking simple: browse the fleet, enquire on WhatsApp, and confirm the exact
              vehicle for your dates. No invented claims here — just a clear path from enquiry to
              keys, with local support when you need route or rental advice.
            </p>
            <p>
              Whether you need a compact hybrid for island touring or a scooter for coastal days,
              start with our{' '}
              <Link to="/vehicles" className="text-[#A86438] underline underline-offset-2">
                rental collection
              </Link>{' '}
              or{' '}
              <Link to="/contact" className="text-[#A86438] underline underline-offset-2">
                contact the team
              </Link>
              .
            </p>
          </div>
        </div>
        <WhyTorento />
        <HowItWorks />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
