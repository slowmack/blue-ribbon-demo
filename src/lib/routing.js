// Two route-building strategies for the before/after demo:
//
//   buildRandomRoutes — shuffles customers, slices into crew chunks, visits in
//     shuffled order. Produces crisscrossing routes (the "before" picture).
//
//   buildOptimizedRoutes — geographic clustering (constrained k-means style)
//     assigns each customer to the nearest crew anchor; within each crew,
//     nearest-neighbor traversal starting from the centroid. Produces tight
//     local loops (the "after" picture).
//
// Both functions return an array of route objects, one per crew, of shape:
//   { crewId, crewName, color, stops: Customer[], miles, hours }
//
// Time-per-stop model:
//   small  = 0.50 h base service
//   medium = 0.75 h base service
//   large  = 1.00 h base service
//   service hours scaled by 1 / crew.speed
//   driving time = miles / 30 mph

import { haversineMiles, routeMiles } from './distance.js';

const SERVICE_HOURS = { small: 0.50, medium: 0.75, large: 1.00 };
const AVG_MPH = 30;

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rand) {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function centroid(points) {
  if (points.length === 0) return { lat: 36.25, lng: -94.18 };
  let lat = 0, lng = 0;
  for (const p of points) { lat += p.lat; lng += p.lng; }
  return { lat: lat / points.length, lng: lng / points.length };
}

function serviceHoursFor(customer, crewSpeed) {
  return SERVICE_HOURS[customer.propertySize] / crewSpeed;
}

function summarize(route, crew) {
  const miles = routeMiles(route);
  const drivingHours = miles / AVG_MPH;
  const serviceHours = route.reduce(
    (sum, c) => sum + serviceHoursFor(c, crew.speed),
    0
  );
  return { miles, hours: drivingHours + serviceHours };
}

// ---- Random / unoptimized ----------------------------------------------------

export function buildRandomRoutes(customers, crews, seed = 42) {
  const rand = mulberry32(seed);
  const shuffled = shuffle(customers, rand);

  // Partition into 10 sequential chunks, roughly even.
  const chunks = Array.from({ length: crews.length }, () => []);
  shuffled.forEach((c, i) => chunks[i % crews.length].push(c));

  return crews.map((crew, i) => {
    const stops = shuffle(chunks[i], rand);
    const { miles, hours } = summarize(stops, crew);
    return {
      crewId: crew.id,
      crewName: crew.name,
      color: crew.color,
      stops,
      miles,
      hours,
    };
  });
}

// ---- Optimized: geographic clustering + nearest-neighbor --------------------

function assignBalanced(customers, centers, shares) {
  // Capacity-proportional, geographic assignment. Customers are processed in
  // order of how "close" their nearest center is — dense-area customers grab
  // their preferred cluster first; remote customers settle for whatever has
  // capacity left.
  const remaining = shares.slice();
  const buckets = Array.from({ length: centers.length }, () => []);

  const scored = customers.map((cust) => {
    const distances = centers.map((a) => haversineMiles(cust, a));
    const nearest = Math.min(...distances);
    return { cust, distances, nearest };
  });
  scored.sort((a, b) => a.nearest - b.nearest);

  for (const { cust, distances } of scored) {
    const ordered = distances
      .map((d, i) => ({ i, d }))
      .sort((x, y) => x.d - y.d);
    for (const { i } of ordered) {
      if (remaining[i] > 0) {
        buckets[i].push(cust);
        remaining[i] -= 1;
        break;
      }
    }
  }

  return buckets;
}

function nearestNeighborOrder(stops, start) {
  if (stops.length === 0) return [];
  const remaining = stops.slice();
  const ordered = [];
  let cursor = start;
  while (remaining.length > 0) {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = haversineMiles(cursor, remaining[i]);
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    }
    cursor = remaining[bestIdx];
    ordered.push(cursor);
    remaining.splice(bestIdx, 1);
  }
  return ordered;
}

function proportionalShares(crews, totalCount) {
  // Each crew gets a workload share proportional to its weekly capacity.
  // Rounding leftovers get distributed across crews in capacity order.
  const totalCap = crews.reduce((s, c) => s + c.capacity, 0);
  const shares = crews.map((c) => Math.floor(totalCount * c.capacity / totalCap));
  let assigned = shares.reduce((s, x) => s + x, 0);
  let i = 0;
  const order = crews
    .map((c, idx) => ({ idx, cap: c.capacity }))
    .sort((a, b) => b.cap - a.cap);
  while (assigned < totalCount) {
    shares[order[i % order.length].idx] += 1;
    assigned += 1;
    i += 1;
  }
  return shares;
}

export function buildOptimizedRoutes(customers, crews) {
  if (customers.length === 0) return [];

  const shares = proportionalShares(crews, customers.length);

  // Farthest-first seeding for 10 well-spread anchors.
  const seeds = [customers[0]];
  while (seeds.length < crews.length) {
    let bestCust = null;
    let bestMin = -1;
    for (const cust of customers) {
      let minToAnchors = Infinity;
      for (const a of seeds) {
        const d = haversineMiles(cust, a);
        if (d < minToAnchors) minToAnchors = d;
      }
      if (minToAnchors > bestMin) { bestMin = minToAnchors; bestCust = cust; }
    }
    seeds.push(bestCust);
  }

  // Match crews to anchors by density: bigger-capacity crew → denser area.
  // "Density" = count of customers within 5 mi of the anchor.
  const anchorDensity = seeds.map((a, i) => {
    let count = 0;
    for (const c of customers) if (haversineMiles(c, a) < 5) count += 1;
    return { i, count };
  }).sort((x, y) => y.count - x.count);
  const crewByCap = crews
    .map((c, i) => ({ i, cap: c.capacity }))
    .sort((a, b) => b.cap - a.cap);

  // alignedSeeds[crewIdx] = anchor that this crew should anchor on
  const alignedSeeds = new Array(crews.length);
  crewByCap.forEach((c, rank) => {
    alignedSeeds[c.i] = seeds[anchorDensity[rank].i];
  });

  // Balanced k-means: 4 Lloyd iterations with proportional caps.
  let centers = alignedSeeds.slice();
  let assignment;
  for (let iter = 0; iter < 4; iter++) {
    assignment = assignBalanced(customers, centers, shares);
    centers = assignment.map((bucket, i) =>
      bucket.length > 0 ? centroid(bucket) : centers[i]
    );
  }

  return crews.map((crew, i) => {
    const stops = nearestNeighborOrder(assignment[i], centers[i]);
    const { miles, hours } = summarize(stops, crew);
    return {
      crewId: crew.id,
      crewName: crew.name,
      color: crew.color,
      stops,
      miles,
      hours,
    };
  });
}

// ---- Fleet-wide stats --------------------------------------------------------

export function fleetStats(routes) {
  const totalMiles = routes.reduce((s, r) => s + r.miles, 0);
  const totalHours = routes.reduce((s, r) => s + r.hours, 0);
  const longest = routes.reduce((m, r) => Math.max(m, r.miles), 0);
  const avg = routes.length === 0 ? 0 : totalMiles / routes.length;
  return { totalMiles, totalHours, longest, avg };
}
