# TORENTO — Sri Lanka Travel & Vehicle Rentals

Premium car & bike rental platform for Sri Lanka tourism.

**Stack:** Vite · React 19 · TypeScript · Tailwind CSS v4 · Motion · React Router · Supabase

## Quick start

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
# Fill Supabase keys — see docs/SUPABASE_SETUP.md
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

Without Supabase env vars, the public marketing site still loads using local demo fleet data and shows a configuration banner. Auth, bookings, and admin require Supabase.

## Routes

| Path | Description |
|------|-------------|
| `/` | Editorial marketing homepage |
| `/vehicles` | Fleet catalogue |
| `/vehicles/:slug` | Vehicle detail + rental request |
| `/login` `/register` `/forgot-password` | Auth |
| `/account/*` | Customer dashboard |
| `/admin/*` | Admin console (role-gated) |

## Database setup

See [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) for migrations, RLS, indexes, storage buckets, and assigning the first admin.

## Scripts

- `npm run dev` — development server (port 3000)
- `npm run build` — production build
- `npm run preview` — preview build
- `npm run lint` — TypeScript check
"# torento" 
