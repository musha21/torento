# TORENTO — Supabase Setup

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. Open **Project Settings → API**.
3. Copy **Project URL** and **anon public** key into `.env.local`:

```bash
cp .env.example .env.local
```

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_SITE_URL=http://localhost:3000
VITE_WHATSAPP_NUMBER=94777666171
```

**Never** put the `service_role` key in any `VITE_*` variable. It bypasses RLS and must stay server-side / SQL Editor only.

## 2. Run SQL migrations

In the Supabase Dashboard → **SQL Editor**, run in order:

1. [`supabase/migrations/001_initial_schema.sql`](../supabase/migrations/001_initial_schema.sql) — tables, indexes, RLS, storage policies, RPCs
2. [`supabase/migrations/002_seed_data.sql`](../supabase/migrations/002_seed_data.sql) — categories, 11 vehicles, destinations, website settings

## 3. Auth configuration

1. Authentication → Providers → Email enabled.
2. Confirm email templates as needed (verification + password reset).
3. Site URL / redirect URLs should include `http://localhost:3000` and your production domain.

## 4. Assign the first admin

Register normally as a customer on `/register`, then in SQL Editor (service role context):

```sql
SELECT public.assign_admin('your-email@example.com');
```

There is **no** public admin registration.

## 5. Storage

Buckets `vehicle-images` and `profile-images` are created by the migration. If Storage policies fail on first run (bucket race), re-run the storage section of `001_initial_schema.sql`.

## 6. Indexes & load handling

Migrations create indexes on:

- vehicles: slug, category, availability, published/featured, daily_price
- bookings: reference, customer, vehicle, status, date ranges
- profiles: role, account_status

For production:

- Host the Vite SPA on a CDN (Vercel / Netlify / Cloudflare Pages) with SPA fallback to `index.html`
- Use Supabase connection pooling (Transaction mode) from the dashboard
- Rely on RLS + indexed queries; do not invent a custom load balancer inside the app

## 7. Verify

```bash
npm run dev
```

- Marketing home loads without env (demo fleet fallback + config banner)
- With env: `/register`, `/login`, `/vehicles`, `/account`, `/admin` (admin only after `assign_admin`)

## Testing checklist

- [ ] Customer cannot change `profiles.role`
- [ ] Customer booking inserts as `pending` / `unpaid` only
- [ ] Customer cannot approve bookings
- [ ] Admin approve blocked when overlapping confirmed/active booking exists
- [ ] Public can read published vehicles only
- [ ] Service role key never appears in browser bundle
