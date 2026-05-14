## Project Context

Blue Ribbon Demo Simulator — Phase 0 wedge before the production build for the Blue Ribbon residential lawn-care business. A client-side React app that simulates 300 synthetic NWA customers and 10 crews, demonstrates before/after route optimization, weekly schedule, and animated route playback.

Goal: a polished, interactive demo Sean shows to the Blue Ribbon owner to earn buy-in for real customer data extraction. Demo code becomes the front-end of the production system later — none of it is throwaway.

## Current State

- Project directory scaffolded at `~/projects/blue-ribbon-demo/`
- Standard docs in place (this file, CHANGELOG.md, ARCHITECTURE.mermaid)
- Vite + React app initialized, deps installed (leaflet, react-leaflet)
- Synthetic customer + crew data generators built
- Map shell rendering 300 customer dots over Northwest Arkansas, color-coded by zone
- Sidebar listing 10 crews with names, size, speed, capacity
- Google Maps key deferred — using Leaflet + OpenStreetMap tiles for now
- Git initialized locally, no remote yet

## Next Actions

- Create empty `slowmack/blue-ribbon-demo` repo on GitHub, then `git remote add origin`
- Day 2: implement route assignment (nearest-neighbor heuristic) and before/after toggle with stats panel
- Day 3: weekly schedule view + animated route playback
- Optional half day: rained-out Tuesday weather scenario

## Known Bugs

- None yet — Day 1 only covers scaffold + static visualization

## Session Log

- 2026-05-13: Day 1 — project scaffold, Vite+React init, synthetic data, map shell with customer dots and crew sidebar

## Key Files

- `src/data/customers.js` — synthetic customer generator (300 records across 8 NWA cities)
- `src/data/crews.js` — 10-crew roster with size, speed, capacity
- `src/App.jsx` — main layout: map + sidebar
- `src/components/MapView.jsx` — Leaflet map with customer dot rendering
- `src/components/CrewSidebar.jsx` — crew list
- `ARCHITECTURE.mermaid` — system diagram
