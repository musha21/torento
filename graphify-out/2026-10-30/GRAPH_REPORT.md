# Graph Report - torento-rental-platform  (2026-10-30)

## Corpus Check
- 103 files · ~330,635 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 463 nodes · 1061 edges · 48 communities (14 shown, 34 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6d6e6eed`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- package.json
- VehicleDetailPage.tsx
- compilerOptions
- dependencies
- PageLoader
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

## God Nodes (most connected - your core abstractions)
1. `react` - 42 edges
2. `PageLoader()` - 33 edges
3. `tryGetSupabase()` - 31 edges
4. `useAuth()` - 30 edges
5. `App()` - 29 edges
6. `useToast()` - 29 edges
7. `EmptyState()` - 23 edges
8. `formatLkrPrice()` - 22 edges
9. `lucide-react` - 19 edges
10. `react-router-dom` - 16 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `PageLoader()`  [EXTRACTED]
  src/App.tsx → src/components/ui/Spinner.tsx
- `VehicleDetailPage()` --calls--> `FloatingWhatsApp()`  [EXTRACTED]
  src/pages/vehicles/VehicleDetailPage.tsx → src/components/FloatingWhatsApp.tsx
- `VehicleDetailPage()` --calls--> `Footer()`  [EXTRACTED]
  src/pages/vehicles/VehicleDetailPage.tsx → src/components/Footer.tsx
- `Navbar()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/Navbar.tsx → src/contexts/AuthContext.tsx
- `VehicleDetailPage()` --calls--> `Navbar()`  [EXTRACTED]
  src/pages/vehicles/VehicleDetailPage.tsx → src/components/Navbar.tsx

## Import Cycles
- None detected.

## Communities (48 total, 34 thin omitted)

### Community 0 - "react"
Cohesion: 0.10
Nodes (35): lucide-react, motion, react, react-router-dom, links, Destinations(), DestinationsProps, EditorialStatement() (+27 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (38): devDependencies, autoprefixer, esbuild, tailwindcss, tsx, @types/express, @types/node, @types/react (+30 more)

### Community 2 - "VehicleDetailPage.tsx"
Cohesion: 0.26
Nodes (15): BookingRequestForm(), Props, Vehicle, VEHICLES, calcRentalDays(), createBookingRequest(), isSupabaseConfigured, dbVehicleToLegacy() (+7 more)

### Community 3 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 4 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, date-fns, dotenv, express, @google/genai, @hookform/resolvers, lucide-react, motion (+10 more)

### Community 5 - "PageLoader"
Cohesion: 0.11
Nodes (45): ConfirmDialog(), ConfirmDialogProps, EmptyState(), PageLoader(), useToast(), BOOKING_STATUS_LABELS, cancelOwnBooking(), CreateBookingInput (+37 more)

### Community 6 - "App.tsx"
Cohesion: 0.07
Nodes (57): @hookform/resolvers, react-hook-form, @supabase/supabase-js, zod, AccountBookings, AccountOverview, AccountProfile, AccountSecurity (+49 more)

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

## Knowledge Gaps
- **12 isolated node(s):** `@google/genai`, `dotenv`, `express`, `@types/express`, `@types/node` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 239 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `VehicleDetailPage.tsx`, `PageLoader`, `App.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **What connects `@google/genai`, `dotenv`, `express` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.10100475938656796 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.048726467331118496 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._