/**
 * TORENTO — WhatsApp Integration & Pricing Utilities
 */

/** Owner default — +94 77 766 6171 */
export const OWNER_WHATSAPP_DIGITS = '94777666171';

let runtimeWhatsAppDigits: string | null = null;

export function normalizeWhatsAppDigits(input?: string | null): string {
  const digits = String(input || '').replace(/\D/g, '');
  return digits || OWNER_WHATSAPP_DIGITS;
}

export function getEnvWhatsAppDigits(): string {
  const fromEnv =
    typeof import.meta !== 'undefined'
      ? (import.meta.env?.VITE_WHATSAPP_NUMBER as string | undefined)
      : undefined;
  return normalizeWhatsAppDigits(fromEnv);
}

/** Env → owner default (used when DB contact.whatsapp is absent). */
export function getDefaultWhatsAppDigits(): string {
  return getEnvWhatsAppDigits();
}

/** Hydrated by SiteSettingsProvider from website_settings.contact.whatsapp */
export function setRuntimeWhatsAppNumber(input?: string | null): void {
  runtimeWhatsAppDigits = normalizeWhatsAppDigits(input);
}

export function getWhatsAppDigits(): string {
  if (runtimeWhatsAppDigits) return runtimeWhatsAppDigits;
  return getEnvWhatsAppDigits();
}

/** @deprecated Prefer getWhatsAppDigits() — kept for existing imports */
export const DEFAULT_WHATSAPP_NUMBER = getEnvWhatsAppDigits();

export function formatWhatsAppDisplay(digits?: string): string {
  const d = normalizeWhatsAppDigits(digits ?? getWhatsAppDigits());
  // Sri Lanka mobile: 94 + 9 digits → +94 XX XXX XXXX
  if (d.startsWith('94') && d.length === 11) {
    return `+94 ${d.slice(2, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
  }
  return `+${d}`;
}

export const GENERAL_INQUIRY_MESSAGE =
  "Hello TORENTO team! I'm interested in your car and bike rental services in Sri Lanka. Could you please share more information about your available vehicles, rental prices, and booking process? Thank you!";

export const CONTACT_INQUIRY_MESSAGE =
  "Hello TORENTO team! I'd like to enquire about vehicle availability and booking for my Sri Lanka trip. Could you please advise on next steps? Thank you!";

export const CARS_FLEET_INQUIRY_MESSAGE =
  'Hello TORENTO team! I am interested in renting a car in Sri Lanka. Could you please share your available cars, daily prices, and rental requirements? Thank you!';

export const BIKES_FLEET_INQUIRY_MESSAGE =
  'Hello TORENTO team! I am interested in renting a bike or scooter in Sri Lanka. Could you please share your available bikes, daily prices, and rental requirements? Thank you!';

export type FleetInquiryKind = 'general' | 'cars' | 'bikes' | 'contact';

export function buildWaMeUrl(message: string, phoneNumber: string = getWhatsAppDigits()): string {
  const cleanNumber = normalizeWhatsAppDigits(phoneNumber);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/** Format ISO yyyy-mm-dd (or Date-parseable) as "10 Nov". */
export function formatInquiryDate(iso?: string | null): string | null {
  if (!iso) return null;
  const trimmed = String(iso).trim();
  if (!trimmed || /^flexible/i.test(trimmed)) return trimmed || null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (m) {
    const day = Number(m[3]);
    const month = Number(m[2]) - 1;
    if (month >= 0 && month < 12) return `${day} ${MONTHS_SHORT[month]}`;
  }
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return trimmed;
  return `${d.getUTCDate()} ${MONTHS_SHORT[d.getUTCMonth()]}`;
}

export function formatInquiryDateRange(startDate?: string, endDate?: string): string | null {
  const start = formatInquiryDate(startDate);
  const end = formatInquiryDate(endDate);
  if (start && end) return `${start} – ${end}`;
  if (start) return `from ${start}`;
  if (end) return `until ${end}`;
  return null;
}

export function fleetInquiryMessage(kind: FleetInquiryKind): string {
  switch (kind) {
    case 'cars':
      return CARS_FLEET_INQUIRY_MESSAGE;
    case 'bikes':
      return BIKES_FLEET_INQUIRY_MESSAGE;
    case 'contact':
      return CONTACT_INQUIRY_MESSAGE;
    default:
      return GENERAL_INQUIRY_MESSAGE;
  }
}

export function generateFleetInquiryUrl(
  kind: FleetInquiryKind = 'general',
  phoneNumber: string = getWhatsAppDigits()
): string {
  return buildWaMeUrl(fleetInquiryMessage(kind), phoneNumber);
}

export interface WhatsAppInquiryOptions {
  vehicleType?: string;
  pricePerDay?: number;
  pickupLocation?: string;
  rentalDays?: number;
  startDate?: string;
  endDate?: string;
  driverOption?: 'Self-Drive' | 'With Chauffeur';
  customNotes?: string;
}

export function buildVehicleInquiryMessage(
  vehicleName: string,
  options?: WhatsAppInquiryOptions
): string {
  const typeLabel = options?.vehicleType?.trim();
  const subject = typeLabel
    ? `the ${vehicleName} ${typeLabel}`
    : `the ${vehicleName}`;

  const lines: string[] = [
    `Hello TORENTO team! I'm interested in renting ${subject}.`,
    '',
  ];

  const dateRange = formatInquiryDateRange(options?.startDate, options?.endDate);
  if (dateRange) {
    lines.push(`Rental dates: ${dateRange}`);
  } else if (options?.startDate && !formatInquiryDate(options.startDate)) {
    lines.push(`Rental start: ${options.startDate}`);
  } else if (options?.rentalDays) {
    lines.push(`Duration: ${options.rentalDays} day(s)`);
  }

  if (options?.pickupLocation?.trim()) {
    lines.push(`Pickup location: ${options.pickupLocation.trim()}`);
  }

  if (typeof options?.pricePerDay === 'number' && Number.isFinite(options.pricePerDay)) {
    lines.push(`Listed price: ${formatLkrPrice(options.pricePerDay)}/day`);
  }

  if (options?.driverOption) {
    lines.push(`Preference: ${options.driverOption}`);
  }

  if (options?.customNotes?.trim()) {
    lines.push(`Notes: ${options.customNotes.trim()}`);
  }

  if (lines[lines.length - 1] !== '') lines.push('');
  lines.push(
    'Could you please confirm availability and the total rental cost? Thank you!'
  );

  return lines.join('\n');
}

export function generateVehicleInquiryUrl(
  vehicleName: string,
  options?: WhatsAppInquiryOptions,
  phoneNumber: string = getWhatsAppDigits()
): string {
  return buildWaMeUrl(buildVehicleInquiryMessage(vehicleName, options), phoneNumber);
}

export function generateBookingInquiryUrl(
  bookingReference: string,
  phoneNumber: string = getWhatsAppDigits()
): string {
  const message = `Hello TORENTO team! My booking reference is ${bookingReference}. Could you please share an update on my rental request? Thank you!`;
  return buildWaMeUrl(message, phoneNumber);
}

export function generateGeneralInquiryUrl(
  customMessage?: string,
  phoneNumber: string = getWhatsAppDigits()
): string {
  return buildWaMeUrl(customMessage || GENERAL_INQUIRY_MESSAGE, phoneNumber);
}

/** Map pathname to fleet inquiry kind for floating / page CTAs. */
export function fleetKindFromPath(pathname: string): FleetInquiryKind {
  if (pathname.startsWith('/cars')) return 'cars';
  if (pathname.startsWith('/bikes')) return 'bikes';
  if (pathname.startsWith('/contact')) return 'contact';
  return 'general';
}

export function formatLkrPrice(amount: number): string {
  return `LKR ${amount.toLocaleString('en-US')}`;
}

export function convertLkrToUsd(lkrAmount: number, exchangeRate: number = 300): string {
  const usd = Math.round(lkrAmount / exchangeRate);
  return `~$${usd} USD`;
}

export function filterVehicles<T extends { category: string; name: string; transmission?: string }>(
  vehicles: T[],
  category: string,
  searchQuery?: string
): T[] {
  return vehicles.filter((v) => {
    const matchesCategory =
      category.toLowerCase() === 'all' || v.category.toLowerCase() === category.toLowerCase();
    const matchesQuery = !searchQuery
      ? true
      : v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.transmission && v.transmission.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });
}

/** Human label for WhatsApp copy from fleet category slug. */
export function vehicleTypeLabel(category?: string | null): string | undefined {
  const c = (category || '').toLowerCase();
  if (c === 'bikes' || c.includes('bike') || c.includes('scooter')) return 'scooter';
  if (c === 'cars' || c.includes('car')) return 'car';
  if (c === 'premium') return 'premium car';
  return undefined;
}
