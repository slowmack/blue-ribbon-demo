## In Progress

- [ ] Day 3: weekly schedule view (M–F per crew, respecting daily capacity)
- [ ] Day 3: animated route playback with play/pause/speed
- [ ] Day 3: clickable crew/day drilldown
- [ ] Optional: rained-out Tuesday scenario

## Deferred

- [ ] Create GitHub repo `slowmack/blue-ribbon-demo` and push — Sean will set this up once Phase 0 nears the final demo

## 2026-05-13 (Day 2)

- [x] Built `src/lib/distance.js` — haversine + routeMiles
- [x] Built `src/lib/routing.js` — buildRandomRoutes + buildOptimizedRoutes + fleetStats
- [x] Random routing: shuffle + sequential chunk partition (crisscrossing routes)
- [x] Optimized routing: farthest-first seeding, capacity-proportional shares, balanced k-means (4 Lloyd iterations), nearest-neighbor traversal
- [x] Crew-to-anchor matching by density: biggest-capacity crew gets densest area
- [x] Time model: per-stop service hours by property size, scaled by crew speed; driving at 30 mph
- [x] Built `ModeToggle.jsx` — Setup / Unoptimized / Optimized segmented control
- [x] Built `StatsPanel.jsx` — total miles, total hours, avg route, longest route + % delta
- [x] Extended `MapView.jsx` to render crew-colored Polylines and tint dots by crew
- [x] Extended `CrewSidebar.jsx` to show per-crew stops/miles/hours when routes are active
- [x] Validated: 3,429 mi → 459 mi/wk (87% miles cut), 323 h → 221 h (31% hours cut), balanced distribution (Alpha 41 stops → Juliet 22 stops)

## 2026-05-13

- [x] Created `~/projects/blue-ribbon-demo/` with SESSION.md, CHANGELOG.md, ARCHITECTURE.mermaid
- [x] Initialized Vite + React app
- [x] Installed leaflet + react-leaflet (Google Maps key deferred per decision to stub)
- [x] Built synthetic customer generator (300 records across 8 NWA cities, zone color-coded)
- [x] Built synthetic crew roster (10 crews, 6×size-3 + 4×size-4, speeds 0.85–1.15x)
- [x] Wired map shell rendering all 300 customer dots over NWA
- [x] Built crew sidebar showing each crew's attributes
- [x] Git initialized locally with .gitignore for node_modules, .env, dist
- [x] Verified `npm run dev` serves the app cleanly
