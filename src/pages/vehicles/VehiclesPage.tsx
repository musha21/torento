import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import { parseISO, startOfDay, addDays } from 'date-fns';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { FloatingWhatsApp } from '../../components/FloatingWhatsApp';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/Spinner';
import { SeoHead } from '../../components/seo/SeoHead';
import { WhatsAppIcon } from '../../components/icons/WhatsAppIcon';
import { VehicleImageCarousel } from '../../components/vehicles/VehicleImageCarousel';
import { fetchLegacyVehicles } from '../../lib/vehicles';
import {
  expandUnavailableDays,
  fetchVehicleUnavailableRanges,
  isRangeAvailable,
  toDateKey,
} from '../../lib/availability';
import {
  filterVehicles,
  formatLkrPrice,
  generateFleetInquiryUrl,
  generateGeneralInquiryUrl,
} from '../../lib/whatsapp';
import { DEFAULT_PICKUP_LOCATION, PICKUP_LOCATIONS } from '../../lib/locations';
import { PAGE_META } from '../../lib/seo/meta';
import { breadcrumbJsonLd } from '../../lib/seo/structuredData';
import type { LegacyVehicle } from '../../types/database';

function categoryFromPath(pathname: string): string {
  if (pathname.startsWith('/cars')) return 'cars';
  if (pathname.startsWith('/bikes')) return 'bikes';
  return 'all';
}

function metaForPath(pathname: string) {
  if (pathname.startsWith('/cars')) return PAGE_META.cars;
  if (pathname.startsWith('/bikes')) return PAGE_META.bikes;
  return PAGE_META.vehicles;
}

function headingForPath(pathname: string) {
  if (pathname.startsWith('/cars')) {
    return {
      eyebrow: 'Cars',
      title: 'Rent a car in Sri Lanka',
      blurb:
        'Automatic and hybrid cars for city streets, expressways and hill-country touring with TORENTO.',
    };
  }
  if (pathname.startsWith('/bikes')) {
    return {
      eyebrow: 'Bikes',
      title: 'Rent a bike or scooter',
      blurb:
        'Scooters and motorcycles for coastal days and mountain roads — enquire with TORENTO on WhatsApp.',
    };
  }
  return {
    eyebrow: 'Fleet',
    title: 'Rental Collection',
    blurb:
      'Browse cars, bikes and premium vehicles available for self-drive and chauffeur journeys across Sri Lanka.',
  };
}

function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

export default function VehiclesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pathCategory = categoryFromPath(location.pathname);
  const meta = metaForPath(location.pathname);
  const heading = headingForPath(location.pathname);

  const [fleet, setFleet] = useState<LegacyVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAvail, setCheckingAvail] = useState(false);
  const [availableIds, setAvailableIds] = useState<Set<string> | null>(null);
  const [category, setCategory] = useState(pathCategory);
  const [query, setQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  const pickup = searchParams.get('pickup') || '';
  const ret = searchParams.get('return') || '';
  const locParam = searchParams.get('location') || DEFAULT_PICKUP_LOCATION;

  const [draftPickup, setDraftPickup] = useState(pickup);
  const [draftReturn, setDraftReturn] = useState(ret);
  const [customLocation, setCustomLocation] = useState(
    PICKUP_LOCATIONS.includes(locParam as (typeof PICKUP_LOCATIONS)[number]) ? '' : locParam
  );
  const [locationMode, setLocationMode] = useState(
    PICKUP_LOCATIONS.includes(locParam as (typeof PICKUP_LOCATIONS)[number]) ? locParam : 'Other'
  );

  useEffect(() => {
    setCategory(pathCategory);
  }, [pathCategory]);

  useEffect(() => {
    setDraftPickup(pickup);
    setDraftReturn(ret);
    if (PICKUP_LOCATIONS.includes(locParam as (typeof PICKUP_LOCATIONS)[number])) {
      setLocationMode(locParam);
      setCustomLocation('');
    } else if (locParam) {
      setLocationMode('Other');
      setCustomLocation(locParam);
    }
  }, [pickup, ret, locParam]);

  useEffect(() => {
    fetchLegacyVehicles()
      .then(setFleet)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!pickup || !ret || ret <= pickup) {
      setAvailableIds(null);
      setCheckingAvail(false);
      return;
    }

    setCheckingAvail(true);
    const from = startOfDay(parseISO(pickup));
    const to = addDays(startOfDay(parseISO(ret)), 1);

    (async () => {
      const next = new Set<string>();
      await Promise.all(
        fleet.map(async (v) => {
          const uuid = v.dbId && isUuid(v.dbId) ? v.dbId : isUuid(v.id) ? v.id : null;
          if (!uuid) {
            // Local demo fleet — treat as available
            next.add(v.id);
            return;
          }
          const { ranges } = await fetchVehicleUnavailableRanges(uuid, from, to);
          const blocked = expandUnavailableDays(ranges);
          if (isRangeAvailable(pickup, ret, blocked)) {
            next.add(v.id);
          }
        })
      );
      if (!cancelled) {
        setAvailableIds(next);
        setCheckingAvail(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fleet, pickup, ret]);

  const dateFilterActive = Boolean(pickup && ret && ret > pickup);

  const filtered = useMemo(() => {
    let list = filterVehicles(fleet, category, query);
    if (maxPrice !== '') {
      list = list.filter((v) => v.dailyRateLkr <= Number(maxPrice));
    }
    if (dateFilterActive && availableIds) {
      list = list.filter((v) => availableIds.has(v.id));
    }
    return list;
  }, [fleet, category, query, maxPrice, dateFilterActive, availableIds]);

  const applyDateFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftPickup || !draftReturn || draftReturn <= draftPickup) return;
    const resolved =
      locationMode === 'Other'
        ? customLocation.trim() || DEFAULT_PICKUP_LOCATION
        : locationMode;
    const next = new URLSearchParams(searchParams);
    next.set('pickup', draftPickup);
    next.set('return', draftReturn);
    next.set('location', resolved);
    setSearchParams(next);
  };

  const clearDates = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('pickup');
    next.delete('return');
    next.delete('location');
    setSearchParams(next);
    setDraftPickup('');
    setDraftReturn('');
    setLocationMode(DEFAULT_PICKUP_LOCATION);
    setCustomLocation('');
  };

  const vehicleHref = (v: LegacyVehicle) => {
    const base = `/vehicles/${v.slug || v.id}`;
    if (!dateFilterActive) return base;
    const q = new URLSearchParams({
      pickup,
      return: ret,
      location: locParam,
    });
    return `${base}?${q.toString()}`;
  };

  const jsonLd = useMemo(
    () => [
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: heading.title, path: meta.path },
      ]),
    ],
    [heading.title, meta.path]
  );

  const fleetKind =
    pathCategory === 'cars' ? 'cars' : pathCategory === 'bikes' ? 'bikes' : 'general';
  const waEmpty =
    pickup || ret
      ? generateGeneralInquiryUrl(
          `Hello TORENTO team! I need a ${
            fleetKind === 'cars' ? 'car' : fleetKind === 'bikes' ? 'bike' : 'vehicle'
          }${pickup || ret ? ` from ${pickup || '…'} to ${ret || '…'}` : ''} near ${locParam}. Could you please confirm availability and pricing? Thank you!`
        )
      : generateFleetInquiryUrl(fleetKind);

  return (
    <div className="min-h-screen bg-[#ECE3D1] text-[#242320] flex flex-col">
      <SeoHead {...meta} jsonLd={jsonLd} />
      <Navbar variant="light" />
      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-editorial-sub text-[#A86438] mb-2">{heading.eyebrow}</p>
          <h1 className="font-editorial-heading text-4xl sm:text-5xl mb-3">{heading.title}</h1>
          <p className="text-[#43282A]/80 max-w-2xl mb-8">{heading.blurb}</p>

          <form
            onSubmit={applyDateFilter}
            className="mb-8 rounded-xl border border-[#D8C9AD] bg-white/70 p-4 space-y-3"
          >
            <p className="text-xs uppercase tracking-wider text-[#43282A]/60 font-medium">
              Check availability
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#43282A]/55">
                  Pickup
                </label>
                <input
                  type="date"
                  value={draftPickup}
                  onChange={(e) => setDraftPickup(e.target.value)}
                  className="mt-1 w-full border border-[#43282A]/20 rounded-lg px-3 py-2 text-sm bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#43282A]/55">
                  Return
                </label>
                <input
                  type="date"
                  value={draftReturn}
                  min={draftPickup || undefined}
                  onChange={(e) => setDraftReturn(e.target.value)}
                  className="mt-1 w-full border border-[#43282A]/20 rounded-lg px-3 py-2 text-sm bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#43282A]/55">
                  Location
                </label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A86438]" />
                  <select
                    value={locationMode}
                    onChange={(e) => setLocationMode(e.target.value)}
                    className="w-full border border-[#43282A]/20 rounded-lg pl-8 pr-3 py-2 text-sm bg-white"
                  >
                    {PICKUP_LOCATIONS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#A86438] text-white text-xs font-semibold uppercase tracking-wider rounded-lg"
                >
                  Apply
                </button>
                {dateFilterActive && (
                  <button
                    type="button"
                    onClick={clearDates}
                    className="px-3 py-2.5 text-xs text-[#43282A]/70 underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            {locationMode === 'Other' && (
              <input
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Custom location"
                className="w-full border border-[#43282A]/20 rounded-lg px-3 py-2 text-sm bg-white"
              />
            )}
            {dateFilterActive && (
              <p className="text-xs text-[#43282A]/75">
                Showing vehicles free {pickup} → {ret}
                {locParam ? ` · ${locParam}` : ''}
              </p>
            )}
          </form>

          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', to: '/vehicles', label: 'ALL' },
                { id: 'cars', to: '/cars', label: 'cars' },
                { id: 'bikes', to: '/bikes', label: 'bikes' },
                { id: 'premium', to: '/vehicles', label: 'premium' },
              ].map((c) => (
                <Link
                  key={c.id}
                  to={{
                    pathname: c.id === 'premium' ? '/vehicles' : c.to,
                    search: searchParams.toString() ? `?${searchParams.toString()}` : '',
                  }}
                  onClick={() => setCategory(c.id)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider border ${
                    category === c.id
                      ? 'bg-[#242320] text-[#ECE3D1] border-[#242320]'
                      : 'border-[#43282A]/30 text-[#43282A] hover:border-[#A86438]'
                  }`}
                >
                  {c.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-1 gap-3 flex-col sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#43282A]/50" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name or transmission"
                  className="w-full pl-10 pr-3 py-2.5 border border-[#43282A]/20 bg-white/70 rounded-lg text-sm"
                />
              </div>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Max daily LKR"
                className="w-full sm:w-40 px-3 py-2.5 border border-[#43282A]/20 bg-white/70 rounded-lg text-sm"
              />
            </div>
          </div>

          {loading || checkingAvail ? (
            <PageLoader label={checkingAvail ? 'Checking availability…' : undefined} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title={dateFilterActive ? 'No vehicles available for those dates' : 'No vehicles found'}
              description={
                dateFilterActive
                  ? 'Try different dates, or message TORENTO on WhatsApp for alternatives.'
                  : 'Try another category or clear your search filters.'
              }
              action={
                dateFilterActive ? (
                  <a
                    href={waEmpty}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#25D366] underline"
                  >
                    <WhatsAppIcon className="w-4 h-4" /> WhatsApp enquire
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate('/vehicles')}
                    className="text-sm text-[#A86438] underline"
                  >
                    Clear filters
                  </button>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((v, cardIndex) => (
                <Link
                  key={v.id}
                  to={vehicleHref(v)}
                  className="group bg-white/70 border border-[#43282A]/15 overflow-hidden hover:border-[#A86438]/50 transition-colors"
                >
                  <div className="h-48 overflow-hidden bg-[#242320]">
                    <VehicleImageCarousel
                      images={[v.imageUrl, ...(v.gallery || [])].filter(Boolean)}
                      alt={`${v.name} for rent in Sri Lanka`}
                      intervalMs={4000 + (cardIndex % 3) * 400}
                      className="!aspect-auto h-full"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between gap-2">
                      <h2 className="font-editorial-heading text-xl uppercase">{v.name}</h2>
                      <span className="text-sm font-semibold text-[#43282A] whitespace-nowrap">
                        {formatLkrPrice(v.dailyRateLkr)}
                      </span>
                    </div>
                    <p className="text-[11px] uppercase tracking-wider text-[#43282A]/60 mt-1">
                      {v.categoryLabel} · {v.category}
                    </p>
                    <p className="text-xs text-[#43282A]/80 mt-2 line-clamp-2">{v.description}</p>
                    {dateFilterActive && (
                      <p className="text-[10px] uppercase tracking-wider text-[#A86438] mt-3">
                        Available {toDateKey(parseISO(pickup))} → {toDateKey(parseISO(ret))}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
