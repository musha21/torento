# Design System: TORENTO
**Project ID:** codebase (not a Stitch project — tokens live in `src/index.css`)

## 1. Visual Theme & Atmosphere

TORENTO is an editorial travel-rental brand for Sri Lanka: warm, grounded, and cinematic rather than flashy SaaS. The surface is a continuous **warm cream field** with **deep charcoal** chrome (nav, footers, mobile tab bars) and a single **rust terracotta** accent for action and focus.

Marketing pages feel like a travel magazine—full-bleed hero photography, wide uppercase eyebrows, oversized serif headlines, and generous vertical whitespace. Product surfaces (fleet cards, booking calendar, account) stay the same palette but tighten spacing for an app-like mobile shell: fixed charcoal bottom tabs, safe-area padding, and clear primary actions without clutter (no purple gradients, no pill-stat strips, no glow stacks).

Mood keywords: **warm**, **editorial**, **island-grounded**, **restrained**, **cinematic**, **trustworthy**.

## 2. Color Palette & Roles

| Descriptive name | Hex | Role |
| --- | --- | --- |
| Warm Cream | `#ECE3D1` | Primary page canvas and scrollbar track |
| Soft Sand | `#E6DCC8` | Muted panel fills, segmented control tracks, spec chip backgrounds |
| Border Sand | `#D8C9AD` | Card and form outline strokes (often at ~50–70% opacity) |
| Dark Brown | `#43282A` | Secondary body text, hairline borders, inactive chrome |
| Deep Charcoal | `#242320` | Primary text on cream; headers, nav bars, footers, mobile bottom nav |
| Rust Terracotta | `#A86438` | Primary brand accent: CTAs, active tabs, selection highlight, eyebrows, focus rings |
| Pure White | `#FFFFFF` | Text on terracotta/charcoal; translucent card washes (`white/70`–`white/80`) |
| WhatsApp Green | `#25D366` | WhatsApp-only actions and FAB (never used as a general brand accent) |
| WhatsApp Green Hover | `#1ebe57` / `#20ba59` | Hover state for WhatsApp controls |

Functional notes:

- Text on cream defaults to Deep Charcoal; supporting copy uses Dark Brown at reduced opacity (`/70`–`/80`).
- Active / selected UI (tabs, calendar pickup/return, account chips) uses Rust Terracotta fill or text.
- Unavailable calendar days use muted Dark Brown wash with strikethrough—not red error styling.
- Selection (`::selection`) is Rust Terracotta fill with white text.

## 3. Typography Rules

**Display / headings** — Bodoni Moda (fallback Playfair Display, Georgia). Applied via `font-editorial-heading`: serif, slightly tightened letter-spacing (`-0.02em`), often **uppercase** on marketing titles, italic allowed for emphasis lines. Scale freely large on heroes (`text-4xl` → `text-8xl`).

**Body / UI** — Inter (system UI fallbacks). Weights 300–700; prefer 400–600 for forms and meta. Tabular numerals for prices.

**Eyebrows / section labels** — `font-editorial-sub`: uppercase, wide tracking (~`0.18em`–`0.28em`), small size (~`0.75rem` / `text-[10px]`–`text-[11px]`), typically Rust Terracotta on cream or terracotta/cream on charcoal.

Hierarchy: one strong serif headline per section, one short supporting sentence in sans, then actions. Do not let body copy overpower the brand name or display title.

## 4. Component Stylings

* **Buttons**
  * Primary brand: Rust Terracotta fill, white label, uppercase micro-tracking, subtly rounded (`rounded-lg`) on forms; pill (`rounded-full`) acceptable on marketing CTAs and header chips.
  * Secondary: transparent or white/cream with Dark Brown or terracotta outline; same uppercase micro-label language.
  * WhatsApp: WhatsApp Green fill, white glyph + label; sticky FAB is a green circle with the official icon only (no brown surrounding pill).
  * Dark inverse: white fill on charcoal hero/footer CTAs.

* **Cards / containers**
  * Fleet and content cards sit on cream as translucent white (`white/70`–`white/80`) with soft Dark Brown / Border Sand strokes. Corners are mostly squared-off to lightly rounded—not heavily pillowed. Hover may deepen the terracotta border and add a soft elevated shadow (`hover:shadow-xl`), not multi-layer glow.
  * Image headers are full-bleed within the card; overlays (category, badge, availability) are small uppercase labels—terracotta badge, charcoal category chip.

* **Inputs / forms**
  * Light white or cream field, thin Dark Brown border (~15–20% opacity), focus border shifts to Rust Terracotta. Labels are uppercase tracking microcopy. Booking panels use the same cream-system card treatment (`rounded-xl`).

* **Calendar**
  * Selected pickup/return: solid Rust Terracotta, white day number.
  * In-range days: light terracotta wash.
  * Unavailable: muted brown wash + line-through; not selectable on customer views.
  * Today: thin terracotta ring when not selected.

* **Navigation chrome**
  * Top marketing nav: charcoal translucent bar over media, centered logo, cream/white type.
  * Mobile public + account shells: fixed Deep Charcoal bottom tab bar; active tab = Rust Terracotta icon/label; inactive = faded cream. Respect `safe-area-inset-bottom`.
  * PWA install banner: charcoal panel above the tab bar, terracotta accent icon, Install = terracotta pill.

* **Badges & filters**
  * Prefer segmented squares or soft chips over dense pill clusters. Active filter = charcoal or terracotta fill; inactive = outline or ghost on sand.

## 5. Layout Principles

- Content rails center at **`max-w-7xl`** with horizontal padding (`px-4` → `lg:px-8`).
- Marketing sections use generous vertical rhythm (`py-24`–`py-32`); account/product screens use tighter padding but keep cream canvas.
- **Hero is full-bleed**—edge-to-edge photography or dark field; brand + one headline + short support + CTA group. Do not pack stats, schedules, or promo chips into the first viewport.
- Mobile public routes reserve bottom space (`pb-24`) so content clears the tab bar; floating WhatsApp sits above that bar.
- Grids: fleet often **1 → 2 → 3** columns; one job per section (one headline, one short supporting line).
- Imagery should show real vehicles, roads, or island atmosphere—abstract purple gradients and decorative glow are off-brand.
- Depth stays whisper-soft: flat cream base, light borders, occasional soft shadow on hover or sticky chrome—not heavy material stacks.

## 6. Do / Don’t (quick reference)

**Do:** cream canvas, charcoal chrome, single terracotta accent, serif display + wide-tracked eyebrows, WhatsApp green only for WhatsApp.

**Don’t:** default Inter-only marketing pages, purple/indigo AI themes, warm-cream + generic terracotta clones that ignore charcoal chrome, crowded pill rows, inset hero image cards, brown WhatsApp FAB chrome.
