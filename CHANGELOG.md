## In Progress

- [ ] Owner-walkthrough rehearsal in browser
- [ ] Optional: rained-out Tuesday scenario (reshuffle week + update stats)
- [ ] Optional polish: heading-aware truck icon, scrubbable progress bar
- [ ] Decision before live demo: keep OSM tiles or swap to Google Maps / Mapbox

## 2026-05-14

- [x] First pass: per-crew enable/disable that redistributed workload across remaining crews. User clarified: just want a map-visibility filter, not a re-optimization.
- [x] Reverted: routes always built from all 10 crews. New `visibleCrewIds` state filters routes/dots/trucks at the render layer only.
- [x] Stats panel stays fleet-wide regardless of visibility — headline number doesn't shift when isolating crews.
- [x] Per-crew "Only" button (visible on hover) — one-click isolate.
- [x] "Show all" link in the Crews header when at least one crew is hidden.
- [x] Visual states: hidden crew card faded, swatch becomes outline-only, eye-dot indicator (● visible / ○ hidden) next to crew name.

## Deferred

- [ ] Create GitHub repo `slowmack/blue-ribbon-demo` and push — Sean will set this up once Phase 0 nears the final demo
- [ ] Deploy to Vercel for a shareable URL to share with the Blue Ribbon owner

## 2026-05-13 (Day 3)

- [x] Built `src/lib/schedule.js` — weekly→daily splitter using per-crew balanced k-means sub-clustering with farthest-first seeding + Lloyd iterations
- [x] Built `src/lib/animation.js` — positionAlongRoute interpolates truck lat/lng along a list of stops by progress 0..1 and reports visitedCount
- [x] Exported `nearestNeighborOrder`, `centroid`, `assignBalanced` from routing.js so schedule.js can reuse them
- [x] Built `DayPicker.jsx` — Week + Mon–Fri tabs
- [x] Built `PlaybackControls.jsx` — play/pause/reset + 0.5×/1×/2×/4× speeds + progress bar
- [x] App.jsx: selectedDay + isPlaying + progress + speed state; requestAnimationFrame loop with auto-pause at progress=1
- [x] MapView: renders day's polylines, animated truck markers (white-outline crew-color circles), fades visited stops
- [x] StatsPanel: switches to per-day stats when a day is selected, preserves before/after delta
- [x] Fixed initial spike: first attempt slicing the weekly NN path into 5 chunks made Fri 197 mi because outliers cluster at the end of NN traversals. Replaced with per-crew sub-clustering; Fri dropped to 69 mi
- [x] Validated: weekly headline unchanged (3,429 → 459 mi, 87%). Daily fleet totals: Mon 63 / Tue 138 / Wed 76 / Thu 79 / Fri 69 (optimized) vs Mon 171 / Tue 285 / Wed 177 / Thu 200 / Fri 153 (random) — 2–3× per-day reduction

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
