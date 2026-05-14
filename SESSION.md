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
- Headline numbers from current synthetic data: **3,429 → 459 mi/wk (87% reduction)**, hours 323 → 221 (31% reduction)

## Next Actions

- Day 3: weekly schedule view — break each crew's weekly route into M–F daily segments respecting daily capacity
- Day 3: animated route playback with play/pause/speed control for a selected day
- Day 3: clickable crew/day to drill into a single day's route
- Optional half day: rained-out Tuesday weather scenario (reshuffle the week)
- Deferred until Phase 0 nears final: create `slowmack/blue-ribbon-demo` on GitHub and push

## Known Bugs

- None yet — Day 1 only covers scaffold + static visualization

## Session Log

- 2026-05-13: Day 1 — project scaffold, Vite+React init, synthetic data, map shell with customer dots and crew sidebar
- 2026-05-13: Day 2 — routing engine (random + balanced k-means/nearest-neighbor), mode toggle, stats panel, route polylines on map

## Key Files

- `BUILD_PLAN.md` — Phase 0 plan (scope, demo scenes, data spec, estimate)
- `ARCHITECTURE.mermaid` — system diagram
- `src/data/customers.js` — synthetic customer generator (300 records across 8 NWA cities)
- `src/data/crews.js` — 10-crew roster with size, speed, capacity
- `src/lib/distance.js` — haversine + route-miles helpers
- `src/lib/routing.js` — random + optimized route builders, fleetStats
- `src/App.jsx` — main layout + state wiring
- `src/components/MapView.jsx` — Leaflet map, customer dots, route polylines
- `src/components/CrewSidebar.jsx` — mode toggle + stats + crew list
- `src/components/ModeToggle.jsx` — Setup / Unoptimized / Optimized toggle
- `src/components/StatsPanel.jsx` — fleet stats with before/after delta
