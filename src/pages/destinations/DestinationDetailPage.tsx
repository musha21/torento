import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { FloatingWhatsApp } from '../../components/FloatingWhatsApp';
import { EmptyState } from '../../components/ui/EmptyState';
import { SeoHead } from '../../components/seo/SeoHead';
import { DESTINATIONS } from '../../data/destinations';
import { destinationPageMeta } from '../../lib/seo/meta';
import { breadcrumbJsonLd } from '../../lib/seo/structuredData';

export default function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const dest = DESTINATIONS.find((d) => d.id === slug);

  const meta = useMemo(
    () =>
      dest
        ? { ...destinationPageMeta(dest.name, dest.id, dest.tagline, dest.description), image: dest.imageUrl }
        : destinationPageMeta('Destination', slug || ''),
    [dest, slug]
  );

  const jsonLd = useMemo(() => {
    if (!dest) return undefined;
    return [
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Destinations', path: '/destinations' },
        { name: dest.name, path: `/destinations/${dest.id}` },
      ]),
    ];
  }, [dest]);

  if (!dest) {
    return (
      <div className="min-h-screen bg-[#ECE3D1] flex flex-col">
        <SeoHead {...meta} noindex />
        <Navbar variant="light" />
        <main className="flex-1 pt-28 pb-20 px-4">
          <EmptyState
            title="Destination not found"
            description="Choose another place from our destinations guide."
          />
          <div className="text-center mt-6">
            <Link to="/destinations" className="text-[#A86438] underline text-sm">
              View all destinations
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ECE3D1] text-[#242320] flex flex-col">
      <SeoHead {...meta} jsonLd={jsonLd} />
      <Navbar variant="light" />
      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-[#43282A]/60 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#A86438]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/destinations" className="hover:text-[#A86438]">
              Destinations
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#43282A]">{dest.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="aspect-[4/3] overflow-hidden bg-[#242320]">
              <img
                src={dest.imageUrl}
                alt={`${dest.name}, Sri Lanka — ${dest.tagline}`}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#A86438] mb-2">{dest.region}</p>
              <h1 className="font-editorial-heading text-4xl sm:text-5xl uppercase mb-3">
                {dest.name}
              </h1>
              <p className="text-lg text-[#43282A]/90 mb-4">{dest.tagline}</p>
              <p className="text-[#43282A]/85 leading-relaxed mb-6">{dest.description}</p>

              <h2 className="font-editorial-heading text-xl uppercase mb-2">Journey notes</h2>
              <ul className="text-sm text-[#43282A]/85 space-y-2 mb-6">
                <li>
                  <strong>Vibe:</strong> {dest.elevationOrVibe}
                </li>
                <li>
                  <strong>From Colombo:</strong> {dest.distanceFromColombo}
                </li>
                <li>
                  <strong>Recommended ride:</strong> {dest.recommendedRide}
                </li>
              </ul>

              <h3 className="font-editorial-heading text-lg uppercase mb-2">Scenic highlights</h3>
              <ul className="list-disc list-inside text-sm text-[#43282A]/85 space-y-1 mb-8">
                {dest.scenicHighlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/vehicles"
                  className="inline-flex bg-[#A86438] text-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wider hover:bg-[#43282A] transition-colors"
                >
                  Browse vehicles
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex border border-[#43282A]/30 px-5 py-2.5 text-sm uppercase tracking-wider hover:border-[#A86438] transition-colors"
                >
                  Enquire on WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
