# Blue Ribbon Demo Simulator — Build Plan

## Purpose

A standalone, client-side simulation that demonstrates the route optimization concept using synthetic data — 300 simulated residential customers across Northwest Arkansas and 10 crews of varying composition. The goal is to give the Blue Ribbon owner a tangible view of what the production system would do, without requiring real customer data extraction.

This is a wedge that runs before Phase 1 of the production build plan, not a replacement for it. The demo code becomes the visual layer of the real system later — none of the work is throwaway.

---

## Why This Approach

- Removes the data extraction blocker that is currently slowing things down
- Lets the owner see and react to the concept before committing time to data pulls or system access
- A polished interactive demo is a stronger sales motion than a verbal pitch or static slides
- The before/after optimization comparison is what makes the value tangible — random routes versus optimized routes with a real miles-saved number

---

## Tech Stack

- React, single-page app, fully client-side
- No backend required for the demo
- Google Maps JavaScript API for map display, centered on Northwest Arkansas
- A simple nearest-neighbor heuristic for route generation rather than full OR-Tools — visual smoothness matters more than algorithmic perfection at the demo stage
- Synthetic data generated at load time
- Deploy to Vercel so Sean can share a live URL with the owner

---

## What The Demo Shows

### 1. Setup View
- 300 customer dots distributed across NWA cities, color-coded by zone
- Sidebar listing 10 crews with names, crew size, speed multiplier, and skill notes
- A single "Run Optimization" button

### 2. Before and After Comparison
- Toggle between unoptimized routes and optimized routes
- Stats panel showing total miles, total hours, average route length, longest route
- The delta between the two states is the headline number for the owner

### 3. Weekly Schedule View
- Day-by-day breakdown showing each crew's assigned customers Monday through Friday
- Color-coded route lines per crew on the map
- Click any day to see that day's full route layout

### 4. Animated Route Playback
- Press play and watch crew trucks animate along their routes for the selected day
- Visual time-lapse — a full day of mowing compressed to 30 seconds
- Speed control for pause, normal, fast

### 5. Crew Variation
- Hover any crew to see its attributes and route
- Crews with different sizes and speeds get different daily capacities
- Demonstrates that the system accounts for crew composition, not just geography

### 6. Optional Weather Scenario
- Button to simulate a rained-out Tuesday
- System reshuffles the week, animation shows the rebalance
- Stats panel updates to show the impact on the rest of the week

---

## Synthetic Data Specifications

### Customers
- 300 total, distributed across Bentonville, Rogers, Bella Vista, Centerton, Cave Springs, Lowell, Springdale, Fayetteville
- Realistic density — more concentration in Bentonville and Rogers, fewer in outlying areas
- Each customer record includes synthetic address, lat/lng, property size (small, medium, large), and mow frequency (weekly for most, biweekly for a minority)

### Crews
- 10 crews total
- 6 crews of 3 people, 4 crews of 4 people
- Speed multipliers ranging from 0.85x to 1.15x
- Daily capacity ranging from 15 to 25 customers based on crew size and speed
- Named for memorability — straightforward identifiers, not alliterative

---

## Build Estimate

A focused 2 to 3 day build for a polished version.

- Half a day for map setup and synthetic data generation
- One day for route visualization and the before/after toggle
- One day for animation, stats panel, and polish
- Optional half day for the weather scenario

---

## Demo Day Use

Sean opens the demo on a laptop in front of the Blue Ribbon owner and walks through the scenario. The owner interacts with it directly — toggling the comparison, scrubbing through the week, watching the animation. The goal is for the owner to leave the meeting understanding what this system would do for his business well enough to either grant data access or commit to pulling the customer list himself.

---

## Relationship to Production Build Plan

Once the owner is bought in and real data is available, the production build proceeds through Phases 1 through 5 as specified in the main build plan. The demo's React components, map integration, route visualization, and schedule UI carry forward and become the front-end layer of the production system. The synthetic data generator gets replaced by the real CSV import and geocoding pipeline. The nearest-neighbor heuristic gets replaced by OR-Tools.

Nothing is wasted. The demo is Phase 0.
