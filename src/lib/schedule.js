// Split each crew's weekly route into 5 daily segments (Mon–Fri).
// The weekly route is already in nearest-neighbor order, so consecutive stops
// are geographically close — slicing into 5 contiguous chunks gives 5 daily
// routes that each stay within a sub-region of the crew's cluster.

import { routeMiles, haversineMiles } from './distance.js';
import { nearestNeighborOrder, centroid, assignBalanced } from './routing.js';

export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const SERVICE_HOURS = { small: 0.50, medium: 0.75, large: 1.00 };
const AVG_MPH = 30;

function summarizeDay(stops, crewSpeed) {
  if (stops.length === 0) return { miles: 0, hours: 0 };
  const miles = routeMiles(stops);
  const drivingHours = miles / AVG_MPH;
  const serviceHours = stops.reduce(
    (s, c) => s + SERVICE_HOURS[c.propertySize] / crewSpeed,
    0
  );
  return { miles, hours: drivingHours + serviceHours };
}

// Subdivide a crew's stops into N evenly-sized geographic sub-clusters via
// balanced k-means. Each sub-cluster becomes a day. This avoids the failure
// mode where slicing the weekly NN path puts geographic outliers (which the
// global NN leaves for last) all into the trailing day.
function clusterStopsIntoDays(stops, days) {
  if (stops.length === 0) return Array.from({ length: days }, () => []);
  if (stops.length <= days) {
    const out = stops.map((s) => [s]);
    while (out.length < days) out.push([]);
    return out;
  }

  // Farthest-first seeding for `days` anchors.
  const seeds = [stops[0]];
  while (seeds.length < days) {
    let bestCust = null;
    let bestMin = -1;
    for (const s of stops) {
      let minToAnchors = Infinity;
      for (const a of seeds) {
        const d = haversineMiles(s, a);
        if (d < minToAnchors) minToAnchors = d;
      }
      if (minToAnchors > bestMin) { bestMin = minToAnchors; bestCust = s; }
    }
    seeds.push(bestCust);
  }

  // Even target sizes across days.
  const base = Math.floor(stops.length / days);
  const extra = stops.length % days;
  const targets = Array.from({ length: days }, (_, i) => base + (i < extra ? 1 : 0));

  let centers = seeds.slice();
  let clusters = assignBalanced(stops, centers, targets);
  for (let iter = 0; iter < 3; iter++) {
    centers = clusters.map((c, i) => (c.length > 0 ? centroid(c) : centers[i]));
    clusters = assignBalanced(stops, centers, targets);
  }
  return clusters;
}

export function splitWeeklyRoute(route, crewSpeed, days = 5) {
  const dayClusters = clusterStopsIntoDays(route.stops, days);
  return dayClusters.map((cluster, d) => {
    const stops = cluster.length > 1
      ? nearestNeighborOrder(cluster, centroid(cluster))
      : cluster;
    const { miles, hours } = summarizeDay(stops, crewSpeed);
    return {
      dayIndex: d,
      dayLabel: DAY_LABELS[d],
      stops,
      miles,
      hours,
    };
  });
}

// Returns an array (one per crew) of { crewId, crewName, color, days: [{...}, ...] }
export function buildWeekSchedule(routes, crews) {
  const crewById = new Map(crews.map((c) => [c.id, c]));
  return routes.map((route) => {
    const crew = crewById.get(route.crewId);
    return {
      crewId: route.crewId,
      crewName: route.crewName,
      color: route.color,
      days: splitWeeklyRoute(route, crew?.speed ?? 1),
    };
  });
}

// Collapse a week schedule down to "just day N" — array of pseudo-routes that
// MapView can render the same way it renders the weekly routes.
export function routesForDay(weekSchedule, dayIndex) {
  return weekSchedule.map((crewWeek) => {
    const day = crewWeek.days[dayIndex];
    return {
      crewId: crewWeek.crewId,
      crewName: crewWeek.crewName,
      color: crewWeek.color,
      stops: day.stops,
      miles: day.miles,
      hours: day.hours,
    };
  });
}

// Fleet stats for a particular day across all crews.
export function dayFleetStats(weekSchedule, dayIndex) {
  const dayRoutes = weekSchedule.map((c) => c.days[dayIndex]);
  const totalMiles = dayRoutes.reduce((s, d) => s + d.miles, 0);
  const totalHours = dayRoutes.reduce((s, d) => s + d.hours, 0);
  const longest = dayRoutes.reduce((m, d) => Math.max(m, d.miles), 0);
  const avg = dayRoutes.length === 0 ? 0 : totalMiles / dayRoutes.length;
  return { totalMiles, totalHours, longest, avg };
}
