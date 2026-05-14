# Blue Ribbon Route Optimizer — Build Plan

## Project Overview

Blue Ribbon is a premium residential lawn care operation in Northwest Arkansas with approximately 300 customers and multiple truck/crew teams. The goal is to build a route optimization system that assigns customers to service days and generates efficient daily routes for each truck — delivered to drivers as a simple mobile-accessible interface.

This is a phased build. Each phase produces something functional and testable before the next begins. Do not start a phase until the prior phase is working and validated against real data.

---

## Tech Stack

- **Backend:** Python, FastAPI
- **Optimization engine:** Google OR-Tools (VRP solver)
- **Geocoding:** Google Maps Geocoding API
- **Map display:** Google Maps JavaScript API
- **Frontend:** React (responsive, mobile-first)
- **Database:** SQLite (upgrade to Postgres if multi-user admin access becomes a requirement)
- **Hosting:** Vercel (frontend), Railway or Render (backend)
- **Project directory:** `~/projects/blue-ribbon-optimizer`

---

## Data Requirements (Needed Before Phase 1)

Confirm the following with the Blue Ribbon owner before building:

- Customer list format (CSV expected) — must include full address per customer
- Number of trucks and whether all trucks depart from a single depot address
- Days of operation (5-day or 6-day week)
- Mow frequency per customer — weekly only, or mix of weekly and biweekly
- Any customer constraints — preferred days, gates that need scheduling, access notes

---

## Phase 1 — Data Foundation

**Goal:** Get clean, geocoded customer data into the system.

- Accept CSV upload of customer records
- Validate and clean address fields
- Call Google Geocoding API to convert each address to lat/lng
- Store customers, coordinates, and truck records in SQLite
- Build a simple admin view showing all customers plotted on a Google Map
- No optimization yet — just confirm data integrity and map accuracy

**Exit criteria:** All ~300 customers are geocoded, visible on map, and no significant geocoding failures.

---

## Phase 2 — Route Optimization Engine

**Goal:** Generate optimized daily routes per truck using OR-Tools.

- Configure OR-Tools VRP with the following constraints:
  - Number of trucks (vehicles)
  - Depot start/end location per truck
  - Customer count per day balanced across trucks
  - Geographic clustering by day to minimize total drive distance
- Run optimization and output: customer → truck assignment, customer → day assignment, ordered stop sequence per truck per day
- Expose results via FastAPI endpoint
- Display color-coded routes per truck on the admin map view — one day at a time

**Exit criteria:** Optimizer produces a full weekly schedule, routes look geographically coherent on the map, and daily workloads are reasonably balanced across trucks.

---

## Phase 3 — Driver App

**Goal:** Give each truck driver a simple mobile view of their daily route.

- Mobile-responsive React page, accessible by browser — no app install required
- Driver selects their truck and the current date
- App displays ordered stop list for the day with customer address and any notes
- Each address is tappable and opens in Google Maps or Waze for turn-by-turn navigation
- No login required for MVP — trucks access via a simple URL with truck ID parameter

**Exit criteria:** A driver can pull up their route on a phone, tap an address, and get turn-by-turn directions within two taps.

---

## Phase 4 — Admin Schedule Management

**Goal:** Allow Blue Ribbon admin to view, adjust, and lock the weekly schedule.

- Admin dashboard showing full week view — all trucks, all days, all routes
- Ability to manually move a customer from one day or truck to another
- Re-run optimization on demand after changes
- Mark customers as skipped for a given week (vacation holds, locked gates, etc.)
- Export daily route sheets as PDF or printable view as backup

**Exit criteria:** Admin can manage the weekly schedule without touching code or data files.

---

## Phase 5 — Weather Integration

**Goal:** Surface weather forecast data to inform schedule decisions.

- Integrate Tomorrow.io API (or National Weather Service API — free, US coverage)
- Each morning, run a forecast check against the week's scheduled days
- Flag any day where rain probability exceeds a configurable threshold (default 70%)
- Display weather warnings on the admin dashboard alongside affected routes
- When a day is flagged, suggest a rebalanced schedule that absorbs displaced customers into remaining days — re-run OR-Tools with updated constraints
- Optional: SMS notification to admin via Twilio when a weather flag fires

**Exit criteria:** Admin is alerted to weather conflicts before drivers depart and can approve a rescheduled week in one action.

---

## Build Principles

- Architecture document before any code — confirm data model and API shape first
- Maintain SESSION.md and CHANGELOG.md throughout
- Each phase tested against real Blue Ribbon data before proceeding
- Mobile-first on all driver-facing views
- Keep the driver app as simple as possible — it is used by people on a truck, not power users
- Do not over-engineer the optimization in Phase 2 — a good-enough route that drivers will actually follow beats a theoretically perfect one they'll ignore
