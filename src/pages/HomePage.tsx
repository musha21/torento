import React, { useMemo, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { EditorialStatement } from '../components/EditorialStatement';
import { VehicleCategories } from '../components/VehicleCategories';
import { VehicleCollection } from '../components/VehicleCollection';
import { Destinations } from '../components/Destinations';
import { WhyTorento } from '../components/WhyTorento';
import { HowItWorks } from '../components/HowItWorks';
import { FinalCTA } from '../components/FinalCTA';
import { Footer } from '../components/Footer';
import { WhatsAppBookingModal } from '../components/WhatsAppBookingModal';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { SeoHead } from '../components/seo/SeoHead';
import type { LegacyVehicle } from '../types/database';
import { VEHICLES } from '../data/vehicles';
import { PAGE_META } from '../lib/seo/meta';
import { organizationJsonLd, websiteJsonLd } from '../lib/seo/structuredData';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedVehicleForModal, setSelectedVehicleForModal] = useState<LegacyVehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const jsonLd = useMemo(() => [organizationJsonLd(), websiteJsonLd()], []);

  const handleCategorySelect = (cat: 'cars' | 'bikes' | 'premium') => {
    setActiveCategory(cat);
    const element = document.getElementById('vehicles');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenCustomQuote = (vehicle: LegacyVehicle) => {
    setSelectedVehicleForModal(vehicle);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#ECE3D1] text-[#242320] flex flex-col font-sans selection:bg-[#A86438] selection:text-white">
      <SeoHead {...PAGE_META.home} jsonLd={jsonLd} />
      <Navbar onOpenBookingModal={() => handleOpenCustomQuote(VEHICLES[0])} />
      <main className="flex-1">
        <Hero
          onExploreVehicles={() => {
            const el = document.getElementById('vehicles');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        <EditorialStatement />
        <VehicleCategories onSelectCategory={handleCategorySelect} />
        <VehicleCollection
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onOpenCustomQuote={handleOpenCustomQuote}
        />
        <Destinations />
        <WhyTorento />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppBookingModal
        vehicle={selectedVehicleForModal}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVehicleForModal(null);
        }}
      />
      <FloatingWhatsApp />
    </div>
  );
}
