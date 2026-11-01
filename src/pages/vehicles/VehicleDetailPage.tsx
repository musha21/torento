import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Fuel, Users, Gauge } from 'lucide-react';
import { WhatsAppIcon } from '../../components/icons/WhatsAppIcon';
import { VehicleImageCarousel } from '../../components/vehicles/VehicleImageCarousel';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { FloatingWhatsApp } from '../../components/FloatingWhatsApp';
import { BookingRequestForm } from '../../components/booking/BookingRequestForm';
import { PageLoader } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { SeoHead } from '../../components/seo/SeoHead';
import { fetchVehicleBySlug, fetchPublishedVehicles, dbVehicleToLegacy } from '../../lib/vehicles';
import { formatLkrPrice, generateVehicleInquiryUrl } from '../../lib/whatsapp';
import { VEHICLES } from '../../data/vehicles';
import { isSupabaseConfigured } from '../../lib/supabase/client';
import { vehiclePageMeta } from '../../lib/seo/meta';
import { breadcrumbJsonLd, vehicleProductJsonLd } from '../../lib/seo/structuredData';
import type { Vehicle } from '../../types/database';

export default function VehicleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [similar, setSimilar] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      if (!isSupabaseConfigured) {
        const legacy = VEHICLES.find((v) => v.id === slug);
        if (legacy && mounted) {
          setFallbackMode(true);
          setVehicle({
            id: legacy.id,
            name: legacy.name,
            slug: legacy.id,
            brand: legacy.name.split(' ')[0],
            model: legacy.name,
            registration_number: null,
            category_id: null,
            year: null,
            description: legacy.description,
            specifications: {
              transmission: legacy.transmission,
              fuel_type: legacy.fuelType,
              passenger_capacity: legacy.capacity,
              luggage_capacity: legacy.luggage,
              air_conditioning: legacy.airConditioning,
              mileage_limit: legacy.mileageLimit,
              highlights: legacy.highlights,
            },
            daily_price: legacy.dailyRateLkr,
            weekly_price: legacy.dailyRateLkr * 6,
            monthly_price: legacy.dailyRateLkr * 25,
            deposit_amount: 25000,
            min_rental_days: 1,
            pickup_instructions: null,
            main_image: legacy.imageUrl,
            gallery: [],
            thumbnail: legacy.imageUrl,
            availability_status: 'available',
            is_featured: Boolean(legacy.badge),
            is_published: true,
            badge: legacy.badge || null,
            category_label: legacy.categoryLabel,
            created_at: '',
            updated_at: '',
            categories: { id: '', name: legacy.category, slug: legacy.category, description: null, image: null, created_at: '' },
          });
          setSimilar(
            VEHICLES.filter((v) => v.category === legacy.category && v.id !== legacy.id)
              .slice(0, 3)
              .map((v) => ({
                id: v.id,
                name: v.name,
                slug: v.id,
                brand: null,
                model: null,
                registration_number: null,
                category_id: null,
                year: null,
                description: v.description,
                specifications: {},
                daily_price: v.dailyRateLkr,
                weekly_price: null,
                monthly_price: null,
                deposit_amount: null,
                min_rental_days: 1,
                pickup_instructions: null,
                main_image: v.imageUrl,
                gallery: [],
                thumbnail: null,
                availability_status: 'available' as const,
                is_featured: false,
                is_published: true,
                badge: v.badge || null,
                category_label: v.categoryLabel,
                created_at: '',
                updated_at: '',
              }))
          );
        }
        setLoading(false);
        return;
      }

      const data = await fetchVehicleBySlug(slug || '');
      if (!mounted) return;
      if (!data) {
        setVehicle(null);
        setLoading(false);
        return;
      }
      setVehicle(data);
      const { vehicles } = await fetchPublishedVehicles();
      setSimilar(
        vehicles
          .filter((v) => v.category_id === data.category_id && v.id !== data.id)
          .slice(0, 3)
      );
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ECE3D1]">
        <Navbar variant="light" />
        <PageLoader />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#ECE3D1]">
        <Navbar variant="light" />
        <div className="max-w-3xl mx-auto px-4 pt-32 pb-20">
          <EmptyState
            title="Vehicle not found"
            description="This vehicle may be unpublished or the link is incorrect."
            action={
              <Link to="/vehicles" className="text-[#A86438] underline text-sm">
                Back to fleet
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const specs = vehicle.specifications || {};
  const gallery = [vehicle.main_image, ...(vehicle.gallery || [])]
    .filter(Boolean)
    .slice(0, 4) as string[];
  const whatsappUrl = generateVehicleInquiryUrl(vehicle.name);
  const slugPath = vehicle.slug || slug || vehicle.id;
  const meta = vehiclePageMeta(vehicle.name, slugPath, vehicle.description);
  const jsonLd = [
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Vehicles', path: '/vehicles' },
      { name: vehicle.name, path: `/vehicles/${slugPath}` },
    ]),
    vehicleProductJsonLd({
      name: vehicle.name,
      description: vehicle.description,
      image: vehicle.main_image,
      path: `/vehicles/${slugPath}`,
      dailyPrice: Number(vehicle.daily_price),
    }),
  ];

  return (
    <div className="min-h-screen bg-[#ECE3D1] text-[#242320] flex flex-col">
      <SeoHead
        {...meta}
        image={vehicle.main_image || undefined}
        jsonLd={jsonLd}
      />
      <Navbar variant="light" />
      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {fallbackMode && (
            <p className="mb-4 text-xs bg-amber-100 text-amber-900 px-3 py-2 rounded">
              Showing local demo data — configure Supabase to load live fleet records.
            </p>
          )}
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <VehicleImageCarousel
                images={gallery}
                alt={`${vehicle.name} rental vehicle in Sri Lanka`}
              />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#A86438] mb-2">
                {vehicle.categories?.name || vehicle.category_label || 'Fleet'}
              </p>
              <h1 className="font-editorial-heading text-4xl sm:text-5xl uppercase mb-3">
                {vehicle.name}
              </h1>
              {vehicle.badge && (
                <span className="inline-block text-[10px] uppercase tracking-wider bg-[#A86438] text-white px-2 py-1 mb-4">
                  {vehicle.badge}
                </span>
              )}
              <p className="text-[#43282A]/90 leading-relaxed mb-6">{vehicle.description}</p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white/60 border border-[#43282A]/10 p-3 text-center">
                  <Fuel className="w-4 h-4 mx-auto text-[#A86438] mb-1" />
                  <p className="text-[10px] uppercase text-[#43282A]/60">Fuel</p>
                  <p className="text-sm font-medium">{specs.fuel_type || '—'}</p>
                </div>
                <div className="bg-white/60 border border-[#43282A]/10 p-3 text-center">
                  <Gauge className="w-4 h-4 mx-auto text-[#A86438] mb-1" />
                  <p className="text-[10px] uppercase text-[#43282A]/60">Gearbox</p>
                  <p className="text-sm font-medium">{specs.transmission || '—'}</p>
                </div>
                <div className="bg-white/60 border border-[#43282A]/10 p-3 text-center">
                  <Users className="w-4 h-4 mx-auto text-[#A86438] mb-1" />
                  <p className="text-[10px] uppercase text-[#43282A]/60">Capacity</p>
                  <p className="text-sm font-medium">{specs.passenger_capacity || '—'}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mb-6 border-y border-[#43282A]/10 py-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#43282A]/60">Daily</p>
                  <p className="font-editorial-heading text-2xl">{formatLkrPrice(Number(vehicle.daily_price))}</p>
                </div>
                {vehicle.weekly_price && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#43282A]/60">Weekly</p>
                    <p className="font-editorial-heading text-2xl">
                      {formatLkrPrice(Number(vehicle.weekly_price))}
                    </p>
                  </div>
                )}
                {vehicle.monthly_price && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#43282A]/60">Monthly</p>
                    <p className="font-editorial-heading text-2xl">
                      {formatLkrPrice(Number(vehicle.monthly_price))}
                    </p>
                  </div>
                )}
              </div>

              <p className="text-sm mb-4">
                Availability:{' '}
                <strong className="capitalize">{vehicle.availability_status.replace('_', ' ')}</strong>
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full text-sm font-semibold mb-8"
              >
                <WhatsAppIcon className="w-4 h-4" /> WhatsApp inquiry
              </a>

              {(specs.highlights?.length || 0) > 0 && (
                <ul className="space-y-2 mb-8">
                  {specs.highlights!.map((h) => (
                    <li key={h} className="text-sm text-[#43282A]/90 flex gap-2">
                      <span className="text-[#A86438]">•</span> {h}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-12 max-w-3xl">
            <BookingRequestForm vehicle={vehicle} />
          </div>

          {similar.length > 0 && (
            <section className="mt-16">
              <h2 className="font-editorial-heading text-3xl mb-6">Similar vehicles</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {similar.map((s) => {
                  const legacy = dbVehicleToLegacy(s);
                  return (
                    <Link
                      key={s.id}
                      to={`/vehicles/${s.slug}`}
                      className="bg-white/60 border border-[#43282A]/10 overflow-hidden hover:border-[#A86438]/40"
                    >
                      <img src={s.main_image || ''} alt={s.name} className="h-36 w-full object-cover" />
                      <div className="p-3">
                        <p className="font-editorial-heading uppercase">{s.name}</p>
                        <p className="text-xs text-[#43282A]/70">{formatLkrPrice(legacy.dailyRateLkr)} / day</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
