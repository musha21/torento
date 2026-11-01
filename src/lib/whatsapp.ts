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

export interface WhatsAppInquiryOptions {
  pickupLocation?: string;
  rentalDays?: number;
  startDate?: string;
  driverOption?: 'Self-Drive' | 'With Chauffeur';
  customNotes?: string;
}

export function generateVehicleInquiryUrl(
  vehicleName: string,
  options?: WhatsAppInquiryOptions,
  phoneNumber: string = getWhatsAppDigits()
): string {
  const cleanNumber = normalizeWhatsAppDigits(phoneNumber);

  let message = `Hello TORENTO! I am interested in renting ${vehicleName}. Please share availability, pricing and rental requirements.`;

  if (options && (options.pickupLocation || options.rentalDays || options.startDate)) {
    const details: string[] = [];
    if (options.startDate) details.push(`Start Date: ${options.startDate}`);
    if (options.rentalDays) details.push(`Duration: ${options.rentalDays} day(s)`);
    if (options.pickupLocation) details.push(`Pickup Location: ${options.pickupLocation}`);
    if (options.driverOption) details.push(`Preference: ${options.driverOption}`);
    if (options.customNotes) details.push(`Notes: ${options.customNotes}`);

    message = `Hello TORENTO! I would like to inquire about renting ${vehicleName}.\n\nTrip Details:\n${details.join('\n')}\n\nPlease let me know the availability and total quotation.`;
  }

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function generateBookingInquiryUrl(
  bookingReference: string,
  phoneNumber: string = getWhatsAppDigits()
): string {
  const cleanNumber = normalizeWhatsAppDigits(phoneNumber);
  const message = `Hello TORENTO! My booking reference is ${bookingReference}. I would like an update about my rental request.`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function generateGeneralInquiryUrl(
  customMessage?: string,
  phoneNumber: string = getWhatsAppDigits()
): string {
  const cleanNumber = normalizeWhatsAppDigits(phoneNumber);
  const message =
    customMessage ||
    'Hello TORENTO! I am planning to visit Sri Lanka and would like to know about your rental options.';

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
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
