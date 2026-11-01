/**
 * Build-time sitemap for TORENTO public routes.
 * Uses VITE_SITE_URL / VITE_PUBLIC_SITE_URL; never emits localhost as production base.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const FALLBACK = 'https://torento.lk';

function resolveSiteUrl() {
  const raw = (process.env.VITE_PUBLIC_SITE_URL || process.env.VITE_SITE_URL || '').trim();
  if (!raw) return FALLBACK;
  try {
    const u = new URL(raw);
    if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') return FALLBACK;
    return u.origin;
  } catch {
    return FALLBACK;
  }
}

function extractVehicleIds(src) {
  const ids = [];
  const re = /id:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src))) ids.push(m[1]);
  return [...new Set(ids)];
}

function extractDestinationIds(src) {
  const ids = [];
  const re = /id:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src))) ids.push(m[1]);
  return [...new Set(ids)];
}

const site = resolveSiteUrl();
const vehiclesSrc = fs.readFileSync(path.join(root, 'src/data/vehicles.ts'), 'utf8');
const destSrc = fs.readFileSync(path.join(root, 'src/data/destinations.ts'), 'utf8');
const vehicleIds = extractVehicleIds(vehiclesSrc);
const destIds = extractDestinationIds(destSrc);

const staticPaths = [
  '/',
  '/vehicles',
  '/cars',
  '/bikes',
  '/about',
  '/contact',
  '/destinations',
];

const paths = [
  ...staticPaths,
  ...vehicleIds.map((id) => `/vehicles/${id}`),
  ...destIds.map((id) => `/destinations/${id}`),
];

const today = new Date().toISOString().slice(0, 10);
const urls = paths
  .map((p) => {
    const loc = p === '/' ? `${site}/` : `${site}${p}`;
    const priority =
      p === '/' ? '1.0' : p === '/vehicles' || p === '/cars' || p === '/bikes' ? '0.9' : '0.7';
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const out = path.join(root, 'public/sitemap.xml');
fs.writeFileSync(out, xml, 'utf8');
console.log(`[seo] Wrote ${paths.length} URLs to public/sitemap.xml (base: ${site})`);

const robots = `User-agent: *
Allow: /

Disallow: /admin
Disallow: /admin/
Disallow: /account
Disallow: /account/
Disallow: /login
Disallow: /register
Disallow: /forgot-password

Sitemap: ${site}/sitemap.xml
`;

fs.writeFileSync(path.join(root, 'public/robots.txt'), robots, 'utf8');
console.log(`[seo] Wrote public/robots.txt`);
