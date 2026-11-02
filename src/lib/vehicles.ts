import { tryGetSupabase, isSupabaseConfigured } from './supabase/client';
import type { Category, LegacyVehicle, Vehicle } from '../types/database';
import { VEHICLES as FALLBACK_VEHICLES } from '../data/vehicles';

function fallbackCategoriesFromFleet(): Category[] {
  const seen = new Map<string, Category>();
  for (const v of FALLBACK_VEHICLES) {
    const slug = v.category;
    if (!slug || seen.has(slug)) continue;
    seen.set(slug, {
      id: slug,
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      slug,
      description: null,
      image: null,
      created_at: '',
    });
  }
  return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));
}

/** Same source of truth as admin: Supabase `categories` table. */
export async function fetchCategories(): Promise<Category[]> {
  const supabase = tryGetSupabase();
  if (!supabase || !isSupabaseConfigured) {
    return fallbackCategoriesFromFleet();
  }

  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error || !data?.length) {
    if (error) console.warn('Failed to fetch categories:', error.message);
    return fallbackCategoriesFromFleet();
  }
  return data as Category[];
}

export function dbVehicleToLegacy(v: Vehicle): LegacyVehicle {
  const specs = v.specifications || {};
  const joinedSlug = (v.categories as { slug?: string } | null | undefined)?.slug;
  const category =
    joinedSlug ||
    (v.category_label?.toLowerCase().includes('bike') ||
    v.category_label?.toLowerCase().includes('scooter')
      ? 'bikes'
      : v.badge?.toLowerCase().includes('premium')
        ? 'premium'
        : 'cars');

  const availabilityMap: Record<string, string> = {
    available: 'Available Today',
    unavailable: 'Currently Unavailable',
    maintenance: 'Under Maintenance',
    hidden: 'Hidden',
  };

  return {
    id: v.slug || v.id,
    dbId: v.id,
    name: v.name,
    category,
    categoryLabel: v.category_label || category,
    dailyRateLkr: Number(v.daily_price),
    transmission: (specs.transmission as 'Automatic' | 'Manual') || 'Automatic',
    fuelType: (specs.fuel_type as 'Hybrid' | 'Petrol' | 'Diesel') || 'Petrol',
    capacity: specs.passenger_capacity || '—',
    luggage: specs.luggage_capacity || '—',
    airConditioning: Boolean(specs.air_conditioning),
    mileageLimit: specs.mileage_limit || '—',
    availability: availabilityMap[v.availability_status] || v.availability_status,
    badge: v.badge || undefined,
    imageUrl: v.main_image || '',
    gallery: (v.gallery || []).filter(Boolean).slice(0, 3),
    description: v.description || '',
    highlights: specs.highlights || [],
    slug: v.slug,
  };
}

export async function fetchPublishedVehicles(): Promise<{ vehicles: Vehicle[]; fromFallback: boolean }> {
  const supabase = tryGetSupabase();
  if (!supabase) {
    return { vehicles: [], fromFallback: true };
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('*, categories(*)')
    .eq('is_published', true)
    .neq('availability_status', 'hidden')
    .order('is_featured', { ascending: false })
    .order('name');

  if (error || !data) {
    console.warn('Failed to fetch vehicles from Supabase:', error?.message);
    return { vehicles: [], fromFallback: true };
  }

  return { vehicles: data as Vehicle[], fromFallback: false };
}

export async function fetchVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const supabase = tryGetSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('vehicles')
    .select('*, categories(*)')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.warn(error.message);
    return null;
  }
  return data as Vehicle | null;
}

export async function fetchLegacyVehicles(): Promise<LegacyVehicle[]> {
  if (!isSupabaseConfigured) {
    return FALLBACK_VEHICLES;
  }
  const { vehicles, fromFallback } = await fetchPublishedVehicles();
  if (fromFallback || vehicles.length === 0) {
    return FALLBACK_VEHICLES;
  }
  return vehicles.map((v) => {
    const legacy = dbVehicleToLegacy(v);
    if (v.categories?.slug) {
      legacy.category = v.categories.slug;
    }
    return legacy;
  });
}

export function estimateRentalTotal(
  dailyPrice: number,
  rentalDays: number,
  weeklyPrice?: number | null,
  monthlyPrice?: number | null
): number {
  if (rentalDays >= 30 && monthlyPrice) {
    const months = Math.floor(rentalDays / 30);
    const rem = rentalDays % 30;
    return months * Number(monthlyPrice) + rem * dailyPrice;
  }
  if (rentalDays >= 7 && weeklyPrice) {
    const weeks = Math.floor(rentalDays / 7);
    const rem = rentalDays % 7;
    return weeks * Number(weeklyPrice) + rem * dailyPrice;
  }
  return rentalDays * dailyPrice;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
