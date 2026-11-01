import { SITE_DEFAULT_DESCRIPTION, SITE_DEFAULT_TITLE, SITE_NAME } from './siteConfig';

export type PageMeta = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
};

export const PAGE_META = {
  home: {
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    path: '/',
  },
  vehicles: {
    title: `Vehicle Rentals in Sri Lanka | Cars, Bikes & Premium | ${SITE_NAME}`,
    description:
      'Browse the TORENTO rental collection — cars, bikes and premium vehicles for self-drive and chauffeur journeys across Sri Lanka.',
    path: '/vehicles',
  },
  cars: {
    title: `Rent a Car in Sri Lanka | Hatchbacks & Touring Sedans | ${SITE_NAME}`,
    description:
      'Hire automatic and hybrid cars with TORENTO for Colombo, coastal roads and hill-country journeys. Enquire on WhatsApp.',
    path: '/cars',
  },
  bikes: {
    title: `Rent a Bike or Scooter in Sri Lanka | ${SITE_NAME}`,
    description:
      'Scooters and motorcycles for beach hopping and mountain roads. Helmets included — book with TORENTO via WhatsApp.',
    path: '/bikes',
  },
  about: {
    title: `About TORENTO | Premium Vehicle Rentals in Sri Lanka`,
    description:
      'TORENTO helps international tourists and local explorers rent cars and bikes to discover Sri Lanka freely — easy WhatsApp booking and local support.',
    path: '/about',
  },
  contact: {
    title: `Contact TORENTO | WhatsApp Vehicle Rental Enquiries`,
    description:
      'Contact TORENTO for car and bike rental availability, quotes and journey advice in Sri Lanka. Message us on WhatsApp to start your booking.',
    path: '/contact',
  },
  destinationsIndex: {
    title: `Sri Lanka Destinations by Car & Bike | ${SITE_NAME}`,
    description:
      'Explore Ella, Sigiriya, Mirissa, Kandy, Nuwara Eliya and Galle with a TORENTO rental — scenic routes and recommended rides.',
    path: '/destinations',
  },
} as const satisfies Record<string, PageMeta>;

export function vehiclePageMeta(name: string, slug: string, description?: string | null): PageMeta {
  const short =
    description?.trim().slice(0, 155) ||
    `Rent the ${name} with TORENTO for your Sri Lanka journey. Check availability and enquire on WhatsApp.`;
  return {
    title: `${name} Rental in Sri Lanka | ${SITE_NAME}`,
    description: short.length < 40 ? `${short} Premium vehicle hire with TORENTO.` : short,
    path: `/vehicles/${slug}`,
    type: 'product',
  };
}

export function destinationPageMeta(
  name: string,
  slug: string,
  tagline?: string | null,
  description?: string | null
): PageMeta {
  const desc =
    tagline?.trim() ||
    description?.trim().slice(0, 155) ||
    `Plan your visit to ${name}, Sri Lanka with a TORENTO car or bike rental.`;
  return {
    title: `Visit ${name} by Car or Bike | ${SITE_NAME}`,
    description: desc,
    path: `/destinations/${slug}`,
  };
}

export function privatePageMeta(title: string, path: string): PageMeta {
  return {
    title: `${title} | ${SITE_NAME}`,
    description: SITE_DEFAULT_DESCRIPTION,
    path,
    noindex: true,
  };
}
