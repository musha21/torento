import { absoluteUrl, defaultOgImageUrl, getSiteUrl, getWhatsAppDigits, SITE_NAME, SITE_TAGLINE } from './siteConfig';

export function organizationJsonLd() {
  const wa = getWhatsAppDigits();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: getSiteUrl(),
    logo: defaultOgImageUrl(),
    description: `${SITE_NAME} — ${SITE_TAGLINE}`,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['English', 'Sinhala', 'Tamil'],
        telephone: `+${wa}`,
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: getSiteUrl(),
    description: `${SITE_NAME} — ${SITE_TAGLINE}`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: defaultOgImageUrl(),
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function vehicleProductJsonLd(input: {
  name: string;
  description?: string | null;
  image?: string | null;
  path: string;
  dailyPrice?: number | null;
}) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description || undefined,
    image: input.image || undefined,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    url: absoluteUrl(input.path),
  };

  if (typeof input.dailyPrice === 'number' && input.dailyPrice >= 0) {
    data.offers = {
      '@type': 'Offer',
      priceCurrency: 'LKR',
      price: input.dailyPrice,
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(input.path),
    };
  }

  return data;
}
