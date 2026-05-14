## Project Context

Blue Ribbon Demo Simulator — Phase 0 wedge before the production build for the Blue Ribbon residential lawn-care business. A client-side React app that simulates 300 synthetic NWA customers and 10 crews, demonstrates before/after route optimization, weekly schedule, and animated route playback.

Goal: a polished, interactive demo Sean shows to the Blue Ribbon owner to earn buy-in for real customer data extraction. Demo code becomes the front-end of the production system later — none of it is throwaway.

### Related docs and links

- **Live demo**: https://blue-ribbon-demo.vercel.app/ (Vercel, auto-deploys on push to main)
- **GitHub**: https://github.com/slowmack/blue-ribbon-demo
- `BUILD_PLAN.md` (this repo) — full Phase 0 build plan: scope, what the demo shows, synthetic data spec, day-by-day estimate.
- `~/projects/blue-ribbon/` — Sean's source folder for plan docs: holds the production build plan (Phases 1–5) **and** a copy of the Phase 0 demo plan. Phase 0 here feeds into Phase 1 there once the owner grants data access. Demo components carry forward as the production front-end.

## Current State

**Phase 0 shipped.** Live at https://blue-ribbon-demo.vercel.app/, repo at github.com/slowmack/blue-ribbon-demo, auto-deploys on push to main.

**Feature inventory:**
- Vite + React SPA, Leaflet + OpenStreetMap tiles (no Maps API key)
- 300 synthetic customers across 8 NWA cities, 10 crews (6× size-3 + 4× size-4, speeds 0.85–1.15×)
- Three-mode toggle: **Setup / Unoptimized / Optimized**
- Routing: random partition (unoptimized) vs capacity-proportional balanced k-means + nearest-neighbor (optimized)
- StatsPanel: total miles / hours / avg / longest, with before-after delta
- Weekly schedule split: each crew's stops sub-clustered into 5 balanced days, NN-ordered locally
- DayPicker (Week + M/T/W/Th/F) and animated playback (truck markers + visited-stop fade), 30-sec wall-clock at 1×, speeds 0.5×/1×/2×/4×
- Per-crew visibility toggle (display filter; routes still computed against all 10 crews), "Only" button per crew, "Show all" link
- Rained-out Tuesday scenario: redistributes Tuesday's work across Mon/Wed/Thu/Fri via the same k-means
- Crew profile drawer (Setup mode only): clicking a crew card opens a right-side drawer with synthetic people (3–4 per crew, roles Lead/Mower/Trimmer/Helper, tenure) and performance scoring (productivity tied to crew speed, quality stars, attendance %, 5-star team composite)
- Synthetic-data banner at top of map (DEMO tag + caveat)
- Dots are crew-colored across all modes (Setup uses optimized assignment); no zone/city coloring

**Headline numbers:** 3,429 → 459 mi/wk (87% reduction), hours 323 → 221 (31% reduction). Stats stay fleet-wide when isolating crews — the headline doesn't shift.

## Next Actions

- Owner-walkthrough rehearsal: open https://blue-ribbon-demo.vercel.app/ and click through Setup → Unoptimized → Optimized → Week → Day → Play → 🌧 Rain out Tuesday. Time how the story lands.
- Send the link to the Blue Ribbon owner when Sean's ready
- Optional polish: animate the truck with a heading-aware icon instead of a plain circle; scrubbable progress bar
- Maps key decision before owner meeting: stay on OSM tiles or swap to Google Maps / Mapbox for visual polish

## Known Bugs

- None known. Not yet stress-tested in mobile/tablet viewports (out of scope per build plan).

## Session Log

- 2026-05-13: Day 1 — project scaffold, Vite+React init, synthetic data, map shell with customer dots and crew sidebar
- 2026-05-13: Day 2 — routing engine (random + balanced k-means/nearest-neighbor), mode toggle, stats panel, route polylines on map
- 2026-05-13: Day 3 — weekly schedule split (per-crew sub-clustering), DayPicker, animated playback, truck markers, visited-stop fade
- 2026-05-14: Per-crew enable/disable (later corrected) — first pass redistributed workload across remaining crews; reverted to a pure map-visibility toggle per user feedback. Routes stay computed against all 10 crews; toggle just hides dots/route/truck on the map. Added "Only" button per crew and "Show all" link.
- 2026-05-14: Setup screen polish — dropped zone (city) coloring entirely. Dots are now crew-colored across all modes (Setup uses optimized assignment as canonical owner map). Removed zone legend.
- 2026-05-14: Rained-out Tuesday scenario — toggle in sidebar; Tuesday's customers redistribute across Mon/Wed/Thu/Fri via the same balanced k-means.
- 2026-05-14: Synthetic-data banner at top of map — DEMO tag + "Real customers would replace these 300 dots" caveat.
- 2026-05-14: **Shipped to production.** Pushed to `slowmack/blue-ribbon-demo` on GitHub, deployed to Vercel. Live at https://blue-ribbon-demo.vercel.app/. Email-privacy rewrite required during push (filter-branch to swap `slw@smack.co` → `slowmack@users.noreply.github.com`).
- 2026-05-14: Crew profile drawer — clicking a crew card in Setup mode opens a right-side drawer with synthetic people, individual scores (productivity / quality / attendance / tenure), and team-level composite rating.

## Key Files

- `BUILD_PLAN.md` — Phase 0 plan (scope, demo scenes, data spec, estimate)
- `ARCHITECTURE.mermaid` — system diagram
- `src/data/customers.js` — synthetic customer generator (300 records across 8 NWA cities)
- `src/data/crews.js` — 10-crew roster with size, speed, capacity
- `src/lib/distance.js` — haversine + route-miles helpers
- `src/lib/routing.js` — random + optimized route builders, fleetStats, exported nearestNeighborOrder/centroid/assignBalanced for reuse
- `src/lib/schedule.js` — weekly→daily split via per-crew sub-clustering, dayFleetStats, DAY_LABELS
- `src/lib/animation.js` — positionAlongRoute interpolation
- `src/App.jsx` — main layout + state wiring + rAF animation loop
- `src/components/MapView.jsx` — Leaflet map, customer dots, route polylines, truck markers, visited-stop fade
- `src/components/CrewSidebar.jsx` — mode toggle + stats + day picker + playback controls + crew list
- `src/components/ModeToggle.jsx` — Setup / Unoptimized / Optimized toggle
- `src/components/StatsPanel.jsx` — fleet stats with before/after delta + period label
- `src/components/DayPicker.jsx` — Week / Mon / Tue / Wed / Thu / Fri buttons
- `src/components/PlaybackControls.jsx` — play/pause, reset, speed selector, progress bar
- `src/data/people.js` — synthetic crew member generator (names, roles, tenure) keyed by crew
- `src/lib/performance.js` — computePersonStats, computeTeamStats, attachStats; composite 1–5 star rating
- `src/components/CrewProfile.jsx` — right-side drawer shown in Setup mode when a crew card is clicked
