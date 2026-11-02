-- TORENTO seed data (categories, vehicles, destinations, settings)

INSERT INTO public.categories (id, name, slug, description, image) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Cars', 'cars', 'Compact hatchbacks and touring sedans for island roads.', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'),
  ('11111111-1111-1111-1111-111111111102', 'Bikes', 'bikes', 'Scooters and motorcycles for coastal and mountain rides.', 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'),
  ('11111111-1111-1111-1111-111111111103', 'Premium', 'premium', 'Executive and VIP vehicles for elevated journeys.', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.vehicles (
  name, slug, brand, model, category_id, year, description, specifications,
  daily_price, weekly_price, monthly_price, deposit_amount, min_rental_days,
  main_image, gallery, availability_status, is_featured, is_published, badge, category_label
) VALUES
(
  'Toyota Aqua', 'toyota-aqua', 'Toyota', 'Aqua',
  '11111111-1111-1111-1111-111111111101', 2019,
  'The quintessential Sri Lankan touring hatchback. Exceptional hybrid fuel economy for long coastal drives and mountain climbs.',
  '{"transmission":"Automatic","fuel_type":"Hybrid","passenger_capacity":"5 Passengers","luggage_capacity":"2 Medium Bags","air_conditioning":true,"mileage_limit":"100 km/day included","highlights":["Exceptional 28+ km/L fuel economy","Compact size for narrow hill country lanes","Cold climate control"]}'::jsonb,
  8500, 52000, 180000, 25000, 1,
  'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1000&q=80',
  '[]'::jsonb, 'available', TRUE, TRUE, 'Most Popular', 'Compact Hatchback'
),
(
  'Suzuki Wagon R', 'suzuki-wagon-r', 'Suzuki', 'Wagon R',
  '11111111-1111-1111-1111-111111111101', 2018,
  'Nimble, high-seating posture and supremely affordable. Ideal for couples and budget travelers moving between Colombo, Galle, and Mirissa.',
  '{"transmission":"Automatic","fuel_type":"Petrol","passenger_capacity":"4 Passengers","luggage_capacity":"2 Small Bags","air_conditioning":true,"mileage_limit":"100 km/day included","highlights":["High headroom & elevated visibility","Effortless Colombo city parking","Reliable fuel mileage"]}'::jsonb,
  7000, 42000, 150000, 20000, 1,
  'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80',
  '[]'::jsonb, 'available', FALSE, TRUE, 'Budget Choice', 'Economy City & Touring'
),
(
  'Toyota Prius', 'toyota-prius', 'Toyota', 'Prius',
  '11111111-1111-1111-1111-111111111101', 2020,
  'Smooth suspension and whisper-quiet hybrid performance across Sri Lanka’s Southern Expressway and Central Highlands.',
  '{"transmission":"Automatic","fuel_type":"Hybrid","passenger_capacity":"5 Passengers","luggage_capacity":"3 Large Bags","air_conditioning":true,"mileage_limit":"100 km/day included","highlights":["Ultra-smooth regenerative hybrid drive","Spacious trunk for oversized suitcases","Advanced safety braking"]}'::jsonb,
  10000, 60000, 210000, 30000, 1,
  'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1000&q=80',
  '[]'::jsonb, 'available', TRUE, TRUE, 'Long Range Tourer', 'Executive Hybrid Sedan'
),
(
  'Toyota Axio', 'toyota-axio', 'Toyota', 'Axio',
  '11111111-1111-1111-1111-111111111101', 2019,
  'The proven favorite of Sri Lankan journeys. Outstanding stability, plush rear seating, and dependable performance on all road conditions.',
  '{"transmission":"Automatic","fuel_type":"Hybrid","passenger_capacity":"5 Passengers","luggage_capacity":"3 Large Bags","air_conditioning":true,"mileage_limit":"100 km/day included","highlights":["Proven hill-country suspension","Generous passenger legroom","Dual-zone climate cooling"]}'::jsonb,
  9000, 54000, 190000, 28000, 1,
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
  '[]'::jsonb, 'available', FALSE, TRUE, NULL, 'Comfort Touring Sedan'
),
(
  'Honda Dio', 'honda-dio', 'Honda', 'Dio',
  '11111111-1111-1111-1111-111111111102', 2021,
  'The classic Sri Lankan beach hopper. Lightweight twist-and-go scooter ideal for cruising between Weligama surf spots, cafes, and secret beaches.',
  '{"transmission":"Automatic","fuel_type":"Petrol","passenger_capacity":"2 Riders (Helmets Incl.)","luggage_capacity":"Underseat Storage","air_conditioning":false,"mileage_limit":"Unlimited coastal km","highlights":["Twist-and-go automatic transmission","Underseat helmet bay & phone charger hook","Includes 2 DOT safety helmets"]}'::jsonb,
  3000, 18000, 65000, 10000, 1,
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
  '[]'::jsonb, 'available', TRUE, TRUE, 'Beach Favorite', 'Coastal Explorer Scooter'
),
(
  'Yamaha FZ Version 3.0', 'yamaha-fz', 'Yamaha', 'FZ V3',
  '11111111-1111-1111-1111-111111111102', 2020,
  'Muscular street styling with an upright seating posture. Fantastic torque for tackling mountain switchbacks towards Ella and Nuwara Eliya.',
  '{"transmission":"Manual","fuel_type":"Petrol","passenger_capacity":"2 Riders (Helmets Incl.)","luggage_capacity":"Rear Carrier Rack","air_conditioning":false,"mileage_limit":"120 km/day included","highlights":["Single-channel ABS braking","Wide rear radial tire for wet tarmac grip","Torquey 150cc fuel-injected engine"]}'::jsonb,
  4000, 24000, 85000, 15000, 1,
  'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
  '[]'::jsonb, 'available', FALSE, TRUE, 'Rider Recommended', 'Naked Street Explorer'
),
(
  'Honda Hornet CB250', 'honda-hornet', 'Honda', 'Hornet CB250',
  '11111111-1111-1111-1111-111111111102', 2019,
  'The legendary inline-4 powerhouse celebrated across Sri Lanka. Crisp exhaust roar, broad stance, and exhilarating highway touring presence.',
  '{"transmission":"Manual","fuel_type":"Petrol","passenger_capacity":"2 Riders (Helmets Incl.)","luggage_capacity":"Side Bag Mounting Points","air_conditioning":false,"mileage_limit":"120 km/day included","highlights":["Famous 4-cylinder high-revving engine","Wide stance with dual front disc brakes","Premium enthusiast ride"]}'::jsonb,
  5000, 30000, 110000, 20000, 1,
  'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1000&q=80',
  '[]'::jsonb, 'available', TRUE, TRUE, 'Island Legend', 'Performance Sports Tourer'
),
(
  'Bajaj Pulsar 150', 'bajaj-pulsar', 'Bajaj', 'Pulsar 150',
  '11111111-1111-1111-1111-111111111102', 2018,
  'Tough, reliable, and comfortable. Sri Lanka’s most dependable two-wheeler workhorse for conquering dirt roads, village trails, and highway stretches.',
  '{"transmission":"Manual","fuel_type":"Petrol","passenger_capacity":"2 Riders (Helmets Incl.)","luggage_capacity":"Sturdy Rear Rack","air_conditioning":false,"mileage_limit":"Unlimited km included","highlights":["Robust dual gas-charged rear shocks","Low fuel consumption on long journeys","Comfortable split seat"]}'::jsonb,
  3500, 21000, 75000, 12000, 1,
  'https://images.unsplash.com/photo-1571188654248-7a89213915f7?auto=format&fit=crop&w=1000&q=80',
  '[]'::jsonb, 'available', FALSE, TRUE, NULL, 'Reliable Island Commuter'
),
(
  'Toyota Premio', 'toyota-premio', 'Toyota', 'Premio',
  '11111111-1111-1111-1111-111111111103', 2020,
  'Timeless luxury with woodgrain accents, plush reclining rear seats, and whisper-quiet ride comfort for high-level delegations and family tours.',
  '{"transmission":"Automatic","fuel_type":"Petrol","passenger_capacity":"5 Passengers","luggage_capacity":"3 Large Suitcases","air_conditioning":true,"mileage_limit":"100 km/day included","highlights":["Plush velvet/leather upholstery","Woodgrain dashboard & rear sunshade","Superior sound insulation"]}'::jsonb,
  13000, 78000, 280000, 50000, 1,
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
  '[]'::jsonb, 'available', TRUE, TRUE, 'Chauffeur Grade', 'Luxury VIP Sedan'
),
(
  'Toyota Allion', 'toyota-allion', 'Toyota', 'Allion',
  '11111111-1111-1111-1111-111111111103', 2019,
  'Sporty executive elegance. Combines responsive throttle feel with refined passenger comfort on island-wide cultural loop journeys.',
  '{"transmission":"Automatic","fuel_type":"Petrol","passenger_capacity":"5 Passengers","luggage_capacity":"3 Large Suitcases","air_conditioning":true,"mileage_limit":"100 km/day included","highlights":["Aerodynamic executive styling","Keyless smart entry & push start","Spacious rear passenger lounge"]}'::jsonb,
  12500, 75000, 270000, 45000, 1,
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
  '[]'::jsonb, 'available', FALSE, TRUE, NULL, 'Executive Sport Sedan'
),
(
  'Toyota Corolla Hybrid', 'toyota-corolla', 'Toyota', 'Corolla Hybrid',
  '11111111-1111-1111-1111-111111111103', 2021,
  'Contemporary design loaded with digital safety tech, Apple CarPlay / Android Auto connectivity, and serene hybrid glide.',
  '{"transmission":"Automatic","fuel_type":"Hybrid","passenger_capacity":"5 Passengers","luggage_capacity":"3 Large Suitcases","air_conditioning":true,"mileage_limit":"100 km/day included","highlights":["Latest touchscreen multimedia with navigation","Toyota Safety Sense pre-collision radar","Low emission eco touring"]}'::jsonb,
  11500, 69000, 250000, 40000, 1,
  'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=80',
  '[]'::jsonb, 'available', TRUE, TRUE, 'Modern Comfort', 'Modern Touring Sedan'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.destinations (
  name, slug, description, region, tagline, elevation_or_vibe, recommended_ride,
  distance_from_colombo, scenic_highlights, image, is_published
) VALUES
(
  'Ella', 'ella',
  'Perched amidst mist-shrouded emerald ridges, Ella is Sri Lanka’s premier hill country sanctuary. Wind through hairpin turns flanked by tea pickers, cross beneath the Nine Arches Viaduct, and marvel at cascading Ravana Falls.',
  'Central Highlands · Badulla District',
  'Mountains, tea plantations and scenic roads.',
  '1,041 m Elevation · Misty Pine Breezes',
  'Yamaha FZ or Toyota Prius (Great mountain torque)',
  '205 km via Southern Expressway & Wellawaya',
  '["Nine Arches Bridge","Ella Rock Sunset Lookout","Ravana Waterfall Hairpins"]'::jsonb,
  'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80', TRUE
),
(
  'Sigiriya', 'sigiriya',
  'Rise with the dawn as the colossal 5th-century Lion Rock fortress ascends sheer out of jungle plains. Long, straight rural tarmac framed by lotus lakes and grazing wild peacocks make this drive pure magic.',
  'Cultural Triangle · Matale District',
  'Ancient history and breathtaking landscapes.',
  'Ancient UNESCO Citadel · Golden Jungle Plains',
  'Toyota Axio or Premio (Smooth highway cruising)',
  '175 km via Central Expressway',
  '["Lion Rock Citadel","Pidurangala Sunrise Rock","Minneriya Elephant Corridor"]'::jsonb,
  'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80', TRUE
),
(
  'Mirissa', 'mirissa',
  'Where azure Indian Ocean breakers meet coconut palm points. Park your scooter beachfront, catch early morning swell at Secret Beach, and embark on blue whale watching expeditions at golden hour.',
  'Southern Coast · Matara District',
  'Golden beaches and coastal adventures.',
  'Sea Level · Tropical Surf & Palm Breezes',
  'Honda Dio (Effortless beach hopping & parking)',
  '150 km via Southern Expressway (Exit Weligama)',
  '["Coconut Tree Hill","Secret Beach Cove","Weligama Surf Bay"]'::jsonb,
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', TRUE
),
(
  'Kandy', 'kandy',
  'The sacred sanctuary of the Temple of the Tooth Relic, cradled around a tranquil mountain lake and enveloped by mist. Journey through lush Mahaweli river valleys and historic spice gardens.',
  'Hill Capital · Central Province',
  'Culture, nature and mountain journeys.',
  '500 m Elevation · Sacred Mountain Capital',
  'Toyota Aqua or Axio (Agile in city & mountain climbs)',
  '115 km via A1 Highway or Central Expressway',
  '["Temple of the Sacred Tooth","Kandy Lake Promenade","Peradeniya Royal Botanical Gardens"]'::jsonb,
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80', TRUE
),
(
  'Nuwara Eliya', 'nuwara-eliya',
  'Crisp 14°C mountain air, Tudor-style heritage bungalows, and endless velvety carpets of Ceylon tea. Drive around the serene shores of Lake Gregory and ascend the dramatic hairpins of Ramboda Pass.',
  'Highlands · "Little England"',
  'Cool weather, green hills and beautiful roads.',
  '1,868 m Elevation · Crisp Alpine Climate',
  'Toyota Prius or Allion (Comfortable heated uphill touring)',
  '165 km via Gampola & Ramboda Falls',
  '["Lake Gregory Waterfront","Mackwoods Labookellie Tea Estate","Ramboda 100m Falls Pass"]'::jsonb,
  'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80', TRUE
),
(
  'Galle', 'galle',
  'A living 400-year-old UNESCO fortified city surrounded by the ocean. Cobblestone alleyways, Dutch colonial architecture, boutique artisan shops, and sunset walks along the coral-stone ramparts.',
  'Southern Province · Galle Fort',
  'Historic streets and southern coastal experiences.',
  'Ocean Bastion · 17th-Century Living Citadel',
  'Honda Dio or Toyota Aqua (Ideal for narrow historic lanes)',
  '120 km via Southern Expressway (E01)',
  '["Dutch Lighthouse & Flag Rock","Pedlar Street Boutiques","Ramparts Sunset Bastion"]'::jsonb,
  'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80', TRUE
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.website_settings (setting_key, setting_value) VALUES
(
  'hero',
  '{
    "heading": "THE ROAD IS YOURS",
    "description": "YOUR JOURNEY. YOUR FREEDOM. Premium car and bike rentals across Sri Lanka.",
    "background_image": ""
  }'::jsonb
),
(
  'contact',
  '{
    "whatsapp": "94777666171",
    "email": "hello@torento.lk",
    "phone": "94777666171",
    "address": "Colombo, Sri Lanka"
  }'::jsonb
),
(
  'social',
  '{
    "instagram": "",
    "facebook": "",
    "tiktok": ""
  }'::jsonb
),
(
  'footer',
  '{
    "tagline": "YOUR JOURNEY. YOUR FREEDOM.",
    "disclaimer": "Rental terms apply. Valid driving licence and deposit required."
  }'::jsonb
),
(
  'pricing_defaults',
  '{
    "currency": "LKR",
    "min_rental_days": 1,
    "default_deposit": 25000
  }'::jsonb
)
ON CONFLICT (setting_key) DO NOTHING;
