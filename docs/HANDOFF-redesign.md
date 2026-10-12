# Handoff: Travelwithvanes redesign (Oct 2026)

Context for Claude Code. All changes below are **uncommitted** in this working tree
(mixed in with older uncommitted work from before this session). Nothing is deployed.

## Goal
Reposition the site as **Rio & Brazil trip planning by Vanessa** (future travel-agent packages),
with self-guided trip guides for South America + Australia as the DIY path. Make it feel
professional and fit small laptop screens (~1000×570 viewport) — "nothing cut off".

## Design system (implemented in `src/app/globals.css`)
- Palette (Rio botanical): white `#ffffff`, mist `#eef3f0`, mata green `#0e4d3a` (primary),
  mar blue `#0a6584` (links/kickers), maracujá yellow `#f5c33b` (**primary CTA only**),
  floresta `#0b2a20` (dark bands), ink `#12241d`. Legacy token names (linen, paper, cobalt,
  clay, sun, espresso, dust…) are remapped to these so untouched pages inherit the palette.
- Type: **Archivo** only (`src/app/layout.tsx`, `axes: ["wdth"]`). Headings use
  `font-stretch: 112%`, weight 620, sentence case. No italic accent words, no ALL-CAPS eyebrows.
- Utilities: `.wrap` (container), `.section` (vh-aware padding), `.t-display/.t-h1/.t-h2/.t-h3/.t-lead`
  (vh-aware type scale), `.kicker`. `--nav-height: 64px`.
- Buttons (`src/components/ui/button.tsx`): `primary` (yellow), `creator` (green),
  `creator-outline`, `light`, `outline-light`; rounded-lg.
- Signature graphic: Copacabana wave band `src/components/layout/calcadao.tsx` — used ONLY under
  the homepage hero and at the top of the footer.

## Redesigned (code done, type-checks clean)
- Nav `src/components/layout/navbar.tsx`, footer, brand mark.
- Home `src/components/home/home-page-client.tsx` + `src/app/page.tsx`: full-bleed hero sized to
  first screen, "Plan it for me / I'll do it myself" split, trips, how it works, Meet Vanessa,
  destinations grid, FAQ, CTA band.
- Trips `src/app/trips/page.tsx` (+ `components/trips/trips-browser.tsx` country filter),
  trip detail `src/app/trips/[slug]/page.tsx` (sticky booking card desktop, sticky bar mobile).
- Plan form `src/app/plan/page.tsx` + `components/trips/plan-trip-form.tsx`.
- Guides list `src/app/itineraries/page.tsx` + `components/itineraries/guide-explorer.tsx`,
  guide detail `src/app/itineraries/[slug]/page.tsx`, `guide-timeline.tsx`.
- About `src/app/about/page.tsx`. Shared sections in `components/trips/planning-sections.tsx`.

## Built earlier this session (working)
- Editable signature trips: Firestore `trip_packages`, admin `/admin/trips`, defaults in
  `src/lib/trip-packages.ts` (shown publicly until the collection has docs), loader `src/lib/trips-data.ts`.
- Enquiries: `/plan` writes to Firestore `trip_enquiries`; admin inbox `/admin/enquiries`.
- Countries layer `src/lib/destinations.ts`; `country` field on itineraries.
- 22 real starter guides `src/lib/starter-itineraries.ts` (Unsplash photos) — seeded from
  `/admin/itineraries` ("Add starter guides" / "Add & publish").
- Stripe fixes: price looked up server-side, cents conversion (`api/stripe/checkout`),
  success page delivers the full guide (`app/checkout/success`). Currency in `src/lib/pricing.ts` (USD).
- `SafeImage` fallback for broken uploads; homepage copy migration for old Firestore values
  (`src/lib/homepage-defaults.ts`); sitemap/robots/404.

## NOT yet verified — do this first
1. **Restart the dev server** (`Ctrl+C`, `npm run dev`). The running server never picked up the
   new `globals.css`, so pages looked half-styled. If CSS still fails, check the terminal for a
   Tailwind error in `globals.css`.
2. Check every redesigned page at **1000×570**, 1440×900 and 390px mobile. Look for anything
   cut off, the hero fitting with its button visible, the calçadão band rendering correctly.
3. `npx tsc --noEmit` and `npm run lint` (2 pre-existing lint errors in
   `media-picker-dialog.tsx` and `ugc-feed-client.tsx` are not from this work).

## Still to do
- Restyle remaining pages to the new system: `/blog`, `/blog/[slug]`, `/ugc`, `/courses/*`,
  checkout success, admin (they inherit colours but still use old ALL-CAPS labels/sizes).
- Remove legacy `text-[10px] uppercase tracking-[...]` patterns site-wide.

## Owner actions (not code)
- **Firebase Storage billing is disabled** (project `travelwithvanessa-c6dba`) — uploaded photos/video
  return HTTP 402. Re-enable billing in Google Cloud.
- Publish `firestore.rules` in the Firebase console (needed for enquiries + trips admin).
- In admin: add starter trips + guides; unpublish the test "Rio" guide (slug `rio`).
- Review trip/guide/FAQ/about copy (written in Vanessa's voice; form promises a 2-business-day reply).
- Don't push/deploy until reviewed — the repo is connected to Vercel.
