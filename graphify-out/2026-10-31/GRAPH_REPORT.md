# Graph Report - torento-rental-platform  (2026-10-31)

## Corpus Check
- 123 files · ~341,094 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .example 1, .webmanifest 1)

## Summary
- 584 nodes · 1568 edges · 55 communities (21 shown, 34 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6d6e6eed`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- VehiclesPage.tsx
- package.json
- LoginPage.tsx
- compilerOptions
- dependencies
- react
- App.tsx
- Changelog
- TORENTO — Supabase Setup
- Supabase
- vite-env.d.ts
- vercel.json
- Changelog
- Writing Guidelines for Postgres References
- Section Definitions
- Supabase Postgres Best Practices
- advanced-full-text-search.md
- advanced-jsonb-indexing.md
- conn-idle-timeout.md
- conn-limits.md
- conn-pooling.md
- conn-prepared-statements.md
- data-batch-inserts.md
- data-n-plus-one.md
- data-pagination.md
- data-upsert.md
- lock-advisory.md
- lock-deadlock-prevention.md
- lock-short-transactions.md
- lock-skip-locked.md
- monitor-explain-analyze.md
- monitor-pg-stat-statements.md
- monitor-vacuum-analyze.md
- query-composite-indexes.md
- query-covering-indexes.md
- query-index-types.md
- query-missing-indexes.md
- query-partial-indexes.md
- schema-constraints.md
- schema-data-types.md
- schema-foreign-key-indexes.md
- schema-lowercase-identifiers.md
- schema-partitioning.md
- schema-primary-keys.md
- security-privileges.md
- security-rls-basics.md
- security-rls-performance.md
- _template.md
- BookingRequestForm.tsx
- generate-sitemap.mjs
- devDependencies
- scripts
- vite.config.ts
- VehicleDetailPage.tsx
- lib/whatsapp.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 53 edges
2. `tryGetSupabase()` - 37 edges
3. `App()` - 35 edges
4. `PageLoader()` - 35 edges
5. `useToast()` - 31 edges
6. `useAuth()` - 30 edges
7. `SeoHead()` - 29 edges
8. `WhatsAppIcon()` - 27 edges
9. `react-router-dom` - 25 edges
10. `EmptyState()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `RequireAdmin()`  [EXTRACTED]
  src/App.tsx → src/components/auth/RequireAuth.tsx
- `App()` --calls--> `RequireAuth()`  [EXTRACTED]
  src/App.tsx → src/components/auth/RequireAuth.tsx
- `App()` --calls--> `PageLoader()`  [EXTRACTED]
  src/App.tsx → src/components/ui/Spinner.tsx
- `App()` --calls--> `SiteSettingsProvider()`  [EXTRACTED]
  src/App.tsx → src/contexts/SiteSettingsContext.tsx
- `VehicleDetailPage()` --calls--> `FloatingWhatsApp()`  [EXTRACTED]
  src/pages/vehicles/VehicleDetailPage.tsx → src/components/FloatingWhatsApp.tsx

## Import Cycles
- None detected.

## Communities (55 total, 34 thin omitted)

### Community 0 - "VehiclesPage.tsx"
Cohesion: 0.10
Nodes (54): lucide-react, motion, Destinations(), DestinationsProps, EditorialStatement(), FinalCTA(), FloatingWhatsApp(), Footer() (+46 more)

### Community 1 - "package.json"
Cohesion: 0.11
Nodes (17): name, private, type, version, autoprefixer, dotenv, esbuild, express (+9 more)

### Community 2 - "LoginPage.tsx"
Cohesion: 0.12
Nodes (31): @hookform/resolvers, react-hook-form, react-router-dom, zod, authFieldClass, authLabelClass, AuthShell(), AuthShellProps (+23 more)

### Community 3 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 4 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, date-fns, dotenv, express, @google/genai, @hookform/resolvers, lucide-react, motion (+10 more)

### Community 5 - "react"
Cohesion: 0.08
Nodes (65): react, @supabase/supabase-js, RequireAdmin(), RequireAuth(), ConfirmDialog(), ConfirmDialogProps, EmptyState(), PageLoader() (+57 more)

### Community 6 - "App.tsx"
Cohesion: 0.09
Nodes (34): react-dom, AboutPage, AccountBookings, AccountOverview, AccountProfile, AccountSecurity, AdminAvailability, AdminBookings (+26 more)

### Community 7 - "Changelog"
Cohesion: 0.10
Nodes (20): [0.1.3](https://github.com/supabase/agent-skills/compare/v0.1.2...v0.1.3) (2026-06-02), [0.1.4](https://github.com/supabase/agent-skills/compare/v0.1.3...v0.1.4) (2026-06-05), [0.1.5](https://github.com/supabase/agent-skills/compare/v0.1.4...v0.1.5) (2026-07-10), [0.1.6](https://github.com/supabase/agent-skills/compare/v0.1.5...supabase-v0.1.6) (2026-07-30), [0.1.7](https://github.com/supabase/agent-skills/compare/v0.1.6...supabase-v0.1.7) (2026-08-12), [0.1.8](https://github.com/supabase/agent-skills/compare/v0.1.7...supabase-v0.1.8) (2026-09-24), [0.1.9](https://github.com/supabase/agent-skills/compare/v0.1.8...supabase-v0.1.9) (2026-09-28), Bug Fixes (+12 more)

### Community 8 - "TORENTO — Supabase Setup"
Cohesion: 0.12
Nodes (14): 1. Create a Supabase project, 2. Run SQL migrations, 3. Auth configuration, 4. Assign the first admin, 5. Storage, 6. Indexes & load handling, 7. Verify, Testing checklist (+6 more)

### Community 9 - "Supabase"
Cohesion: 0.11
Nodes (15): Fix suggestion, Source, What happened, Skill Feedback, Steps, Core Principles, Debugging, Making and Committing Schema Changes (+7 more)

### Community 12 - "Changelog"
Cohesion: 0.12
Nodes (16): [1.2.0](https://github.com/supabase/agent-skills/compare/v1.1.1...v1.2.0) (2026-06-02), [1.3.0](https://github.com/supabase/agent-skills/compare/v1.2.0...v1.3.0) (2026-06-05), [1.4.0](https://github.com/supabase/agent-skills/compare/v1.3.0...v1.4.0) (2026-07-10), [1.5.0](https://github.com/supabase/agent-skills/compare/supabase-postgres-best-practices-v1.4.0...supabase-postgres-best-practices-v1.5.0) (2026-07-30), [1.6.0](https://github.com/supabase/agent-skills/compare/supabase-postgres-best-practices-v1.5.0...supabase-postgres-best-practices-v1.6.0) (2026-07-30), Bug Fixes, Bug Fixes, Bug Fixes (+8 more)

### Community 13 - "Writing Guidelines for Postgres References"
Cohesion: 0.12
Nodes (15): 1. Concrete Transformation Patterns, 2. Error-First Structure, 3. Quantified Impact, 4. Self-Contained Examples, 5. Semantic Naming, Code Example Standards, Comments, Impact Level Guidelines (+7 more)

### Community 14 - "Section Definitions"
Cohesion: 0.20
Nodes (9): 1. Query Performance (query), 2. Connection Management (conn), 3. Security & RLS (security), 4. Schema Design (schema), 5. Concurrency & Locking (lock), 6. Data Access Patterns (data), 7. Monitoring & Diagnostics (monitor), 8. Advanced Features (advanced) (+1 more)

### Community 15 - "Supabase Postgres Best Practices"
Cohesion: 0.33
Nodes (5): How to Use, References, Rule Categories by Priority, Supabase Postgres Best Practices, When to Apply

### Community 48 - "BookingRequestForm.tsx"
Cohesion: 0.21
Nodes (20): date-fns, BookingRequestForm(), Props, MonthCalendar(), MonthCalendarProps, WEEKDAYS, dateOnlyToPickupIso(), dateOnlyToReturnIso() (+12 more)

### Community 49 - "generate-sitemap.mjs"
Cohesion: 0.11
Nodes (12): destIds, destSrc, __dirname, out, paths, root, site, staticPaths (+4 more)

### Community 50 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, autoprefixer, esbuild, tailwindcss, tsx, @types/express, @types/node, @types/react (+3 more)

### Community 51 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, clean, dev, lint, preview, seo:sitemap

### Community 52 - "vite.config.ts"
Cohesion: 0.33
Nodes (4): @tailwindcss/vite, vite, vite-plugin-pwa, @vitejs/plugin-react

### Community 53 - "VehicleDetailPage.tsx"
Cohesion: 0.13
Nodes (22): VehicleCollection(), VehicleCollectionProps, VehicleImageCarousel(), VehicleImageCarouselProps, WhatsAppBookingModal(), WhatsAppBookingModalProps, Vehicle, VEHICLES (+14 more)

### Community 54 - "lib/whatsapp.ts"
Cohesion: 0.33
Nodes (12): SiteSettingsContext, SiteSettingsContextValue, SiteSettingsProvider(), DEFAULT_WHATSAPP_NUMBER, formatWhatsAppDisplay(), generateBookingInquiryUrl(), getDefaultWhatsAppDigits(), getEnvWhatsAppDigits() (+4 more)

## Knowledge Gaps
- **12 isolated node(s):** `@google/genai`, `dotenv`, `express`, `@types/express`, `@types/node` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 276 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `VehiclesPage.tsx`, `package.json`, `LoginPage.tsx`, `App.tsx`, `BookingRequestForm.tsx`, `VehicleDetailPage.tsx`, `lib/whatsapp.ts`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **What connects `@google/genai`, `dotenv`, `express` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `VehiclesPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09639727361246349 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `react-router-dom` connect `LoginPage.tsx` to `VehiclesPage.tsx`, `package.json`, `react`, `App.tsx`, `BookingRequestForm.tsx`, `VehicleDetailPage.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `LoginPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11711711711711711 - nodes in this community are weakly interconnected._