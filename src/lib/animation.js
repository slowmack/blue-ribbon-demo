// Linear interpolation of a truck's position along a list of ordered stops.
// progress is a value 0..1 spanning the route's total length in miles.

import { haversineMiles } from './distance.js';

export function positionAlongRoute(stops, progress) {
  if (!stops || stops.length === 0) return null;
  if (stops.length === 1) {
    return { lat: stops[0].lat, lng: stops[0].lng, visitedCount: 0 };
  }

  const segments = [];
  let total = 0;
  for (let i = 1; i < stops.length; i++) {
    const d = haversineMiles(stops[i - 1], stops[i]);
    segments.push(d);
    total += d;
  }

  const clamped = Math.max(0, Math.min(1, progress));
  const target = clamped * total;

  let acc = 0;
  for (let i = 0; i < segments.length; i++) {
    if (acc + segments[i] >= target || i === segments.length - 1) {
      const segDist = segments[i] || 1;
      const segProgress = Math.min(1, (target - acc) / segDist);
      const from = stops[i];
      const to = stops[i + 1];
      return {
        lat: from.lat + (to.lat - from.lat) * segProgress,
        lng: from.lng + (to.lng - from.lng) * segProgress,
        visitedCount: i + (segProgress >= 0.999 ? 1 : 0),
      };
    }
    acc += segments[i];
  }

  const last = stops[stops.length - 1];
  return { lat: last.lat, lng: last.lng, visitedCount: stops.length };
}
