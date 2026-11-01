/**
 * TORENTO — Sri Lanka Travel Destinations Data
 */

export interface Destination {
  id: string;
  name: string;
  region: string;
  tagline: string;
  description: string;
  elevationOrVibe: string;
  recommendedRide: string;
  distanceFromColombo: string;
  scenicHighlights: string[];
  imageUrl: string;
}

export const DESTINATIONS: Destination[] = [
  {
    id: 'ella',
    name: 'Ella',
    region: 'Central Highlands · Badulla District',
    tagline: 'Mountains, tea plantations and scenic roads.',
    description:
      'Perched amidst mist-shrouded emerald ridges, Ella is Sri Lanka’s premier hill country sanctuary. Wind through hairpin turns flanked by tea pickers, cross beneath the Nine Arches Viaduct, and marvel at cascading Ravana Falls.',
    elevationOrVibe: '1,041 m Elevation · Misty Pine Breezes',
    recommendedRide: 'Yamaha FZ or Toyota Prius (Great mountain torque)',
    distanceFromColombo: '205 km via Southern Expressway & Wellawaya',
    scenicHighlights: ['Nine Arches Bridge', 'Ella Rock Sunset Lookout', 'Ravana Waterfall Hairpins'],
    imageUrl: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'sigiriya',
    name: 'Sigiriya',
    region: 'Cultural Triangle · Matale District',
    tagline: 'Ancient history and breathtaking landscapes.',
    description:
      'Rise with the dawn as the colossal 5th-century Lion Rock fortress ascends sheer out of jungle plains. Long, straight rural tarmac framed by lotus lakes and grazing wild peacocks make this drive pure magic.',
    elevationOrVibe: 'Ancient UNESCO Citadel · Golden Jungle Plains',
    recommendedRide: 'Toyota Axio or Premio (Smooth highway cruising)',
    distanceFromColombo: '175 km via Central Expressway',
    scenicHighlights: ['Lion Rock Citadel', 'Pidurangala Sunrise Rock', 'Minneriya Elephant Corridor'],
    imageUrl: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'mirissa',
    name: 'Mirissa',
    region: 'Southern Coast · Matara District',
    tagline: 'Golden beaches and coastal adventures.',
    description:
      'Where azure Indian Ocean breakers meet coconut palm points. Park your scooter beachfront, catch early morning swell at Secret Beach, and embark on blue whale watching expeditions at golden hour.',
    elevationOrVibe: 'Sea Level · Tropical Surf & Palm Breezes',
    recommendedRide: 'Honda Dio (Effortless beach hopping & parking)',
    distanceFromColombo: '150 km via Southern Expressway (Exit Weligama)',
    scenicHighlights: ['Coconut Tree Hill', 'Secret Beach Cove', 'Weligama Surf Bay'],
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'kandy',
    name: 'Kandy',
    region: 'Hill Capital · Central Province',
    tagline: 'Culture, nature and mountain journeys.',
    description:
      'The sacred sanctuary of the Temple of the Tooth Relic, cradled around a tranquil mountain lake and enveloped by mist. Journey through lush Mahaweli river valleys and historic spice gardens.',
    elevationOrVibe: '500 m Elevation · Sacred Mountain Capital',
    recommendedRide: 'Toyota Aqua or Axio (Agile in city & mountain climbs)',
    distanceFromColombo: '115 km via A1 Highway or Central Expressway',
    scenicHighlights: ['Temple of the Sacred Tooth', 'Kandy Lake Promenade', 'Peradeniya Royal Botanical Gardens'],
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'nuwara-eliya',
    name: 'Nuwara Eliya',
    region: 'Highlands · "Little England"',
    tagline: 'Cool weather, green hills and beautiful roads.',
    description:
      'Crisp 14°C mountain air, Tudor-style heritage bungalows, and endless velvety carpets of Ceylon tea. Drive around the serene shores of Lake Gregory and ascend the dramatic hairpins of Ramboda Pass.',
    elevationOrVibe: '1,868 m Elevation · Crisp Alpine Climate',
    recommendedRide: 'Toyota Prius or Allion (Comfortable heated uphill touring)',
    distanceFromColombo: '165 km via Gampola & Ramboda Falls',
    scenicHighlights: ['Lake Gregory Waterfront', 'Mackwoods Labookellie Tea Estate', 'Ramboda 100m Falls Pass'],
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'galle',
    name: 'Galle',
    region: 'Southern Province · Galle Fort',
    tagline: 'Historic streets and southern coastal experiences.',
    description:
      'A living 400-year-old UNESCO fortified city surrounded by the ocean. Cobblestone alleyways, Dutch colonial architecture, boutique artisan shops, and sunset walks along the coral-stone ramparts.',
    elevationOrVibe: 'Ocean Bastion · 17th-Century Living Citadel',
    recommendedRide: 'Honda Dio or Toyota Aqua (Ideal for narrow historic lanes)',
    distanceFromColombo: '120 km via Southern Expressway (E01)',
    scenicHighlights: ['Dutch Lighthouse & Flag Rock', 'Pedlar Street Boutiques', 'Ramparts Sunset Bastion'],
    imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80',
  },
];
