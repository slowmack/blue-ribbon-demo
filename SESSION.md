## Project Context

Blue Ribbon Demo Simulator — Phase 0 wedge before the production build for the Blue Ribbon residential lawn-care business. A client-side React app that simulates 300 synthetic NWA customers and 10 crews, demonstrates before/after route optimization, weekly schedule, and animated route playback.

Goal: a polished, interactive demo Sean shows to the Blue Ribbon owner to earn buy-in for real customer data extraction. Demo code becomes the front-end of the production system later — none of it is throwaway.

### Related docs

- `BUILD_PLAN.md` (this repo) — full Phase 0 build plan: scope, what the demo shows, synthetic data spec, day-by-day estimate.
- `~/projects/blue-ribbon/` — Sean's source folder for plan docs: holds the production build plan (Phases 1–5) **and** a copy of the Phase 0 demo plan. Phase 0 here feeds into Phase 1 there once the owner grants data access. Demo components carry forward as the production front-end.

## Current State

- Project directory scaffolded at `~/projects/blue-ribbon-demo/`
- Standard docs in place (this file, CHANGELOG.md, ARCHITECTURE.mermaid, BUILD_PLAN.md)
- Vite + React app initialized, deps installed (leaflet, react-leaflet)
- Synthetic customer + crew data generators built
- Map shell rendering 300 customer dots over Northwest Arkansas, color-coded by zone
- Sidebar listing 10 crews with names, size, speed, capacity
- Google Maps key deferred — using Leaflet + OpenStreetMap tiles for now
- Git initialized locally; GitHub remote deferred until Phase 0 nears the final demo
- **Day 2:** Three-mode toggle (Setup / Unoptimized / Optimized) with live before/after comparison
- **Day 2:** Routing engine — random partition for unoptimized, capacity-proportional balanced k-means + nearest-neighbor for optimized
- **Day 2:** StatsPanel showing total miles, hours, avg route, longest route, with % delta
- **Day 2:** Map renders crew-colored route polylines + dots when in routed mode
- **Day 3:** Week schedule split — each crew's stops sub-clustered into 5 balanced k-means clusters (one per weekday), then NN-ordered locally
- **Day 3:** DayPicker (Week + M/T/W/Th/F) — selecting a day filters the map to that day's routes and switches StatsPanel to per-day numbers
- **Day 3:** PlaybackControls — play/pause/reset, 0.5×/1×/2×/4× speeds, 30-sec base wall-clock duration
- **Day 3:** Animated truck markers (white-outlined crew-colored circles) interpolated along each day's route via requestAnimationFrame
- **Day 3:** Visited stops fade as the truck passes them
- **Day 3+:** Per-crew **visibility toggle** — click any crew card to hide/show its dots, route line, and truck on the map. Routes themselves are always computed against all 10 crews; the toggle is a pure display filter. Hover any crew card to reveal an "Only" button that isolates that crew. "Show all" link in the Crews header brings everyone back.
- Headline numbers from current synthetic data: **3,429 → 459 mi/wk (87% reduction)**, hours 323 → 221 (31% reduction). Stats panel always reflects the fleet — toggling visibility doesn't shift the headline.

## Next Actions

- Sean creating the empty `slowmack/blue-ribbon-demo` repo on GitHub now; once done, add the remote and push 7 commits
- Deploy via Vercel (import from GitHub → auto-detect Vite)
- Owner-walkthrough rehearsal: open the demo, click through Setup → Unoptimized → Optimized → Week → Day → Play → 🌧 Rain out Tuesday
- Optional polish: animate the truck with a heading-aware icon instead of a plain circle; scrubbable progress bar
- Maps key decision before live demo: stay on OSM tiles or swap to Google Maps / Mapbox for polish

## Known Bugs

- None yet — Day 1 only covers scaffold + static visualization

## Session Log

- 2026-05-13: Day 1 — project scaffold, Vite+React init, synthetic data, map shell with customer dots and crew sidebar
- 2026-05-13: Day 2 — routing engine (random + balanced k-means/nearest-neighbor), mode toggle, stats panel, route polylines on map
- 2026-05-13: Day 3 — weekly schedule split (per-crew sub-clustering), DayPicker, animated playback, truck markers, visited-stop fade
- 2026-05-14: Per-crew enable/disable (later corrected) — first pass redistributed workload across remaining crews; reverted to a pure map-visibility toggle per user feedback. Routes stay computed against all 10 crews; toggle just hides dots/route/truck on the map. Added "Only" button per crew and "Show all" link.
- 2026-05-14: Setup screen polish — dropped zone (city) coloring entirely. Dots are now crew-colored across all modes (Setup uses optimized assignment as canonical owner map). Removed zone legend.
- 2026-05-14: Rained-out Tuesday scenario — toggle in sidebar; Tuesday's customers redistribute across Mon/Wed/Thu/Fri via the same balanced k-means.
- 2026-05-14: Synthetic-data banner at top of map — DEMO tag + "Real customers would replace these 300 dots" caveat.

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
