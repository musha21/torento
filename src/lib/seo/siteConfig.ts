/**
 * TORENTO — SEO site configuration
 * Production canonicals use VITE_SITE_URL (never treat localhost as production).
 */

export const SITE_NAME = 'TORENTO';
export const SITE_TAGLINE = 'Rent a Car & Bike in Sri Lanka';
export const SITE_DEFAULT_TITLE = `${SITE_NAME} — ${SITE_TAGLINE} | Your Journey. Your Freedom.`;
export const SITE_DEFAULT_DESCRIPTION =
  'Discover Sri Lanka at your own pace with TORENTO. Premium car and motorbike rentals with direct WhatsApp booking for international travelers and locals.';

/** Fallback production origin used when env is missing or localhost (sitemap / build). */
export const PRODUCTION_SITE_URL_FALLBACK = 'https://torento.lk';

export function getSiteUrl(): string {
  const raw = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();
  if (!raw) return PRODUCTION_SITE_URL_FALLBACK;
  try {
    const url = new URL(raw);
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      return PRODUCTION_SITE_URL_FALLBACK;
    }
    return url.origin;
  } catch {
    return PRODUCTION_SITE_URL_FALLBACK;
  }
}

export function absoluteUrl(path = '/'): string {
  const base = getSiteUrl().replace(/\/$/, '');
  if (!path || path === '/') return `${base}/`;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function defaultOgImageUrl(): string {
  return absoluteUrl('/brand/torento-logo.png');
}

export { getWhatsAppDigits, formatWhatsAppDisplay, OWNER_WHATSAPP_DIGITS } from '../whatsapp';
