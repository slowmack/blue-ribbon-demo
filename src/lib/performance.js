// Per-person and team performance scoring. Deterministic per-person via a
// seed derived from the person's id. Productivity ties to crew.speed so the
// existing "fast crew" narrative carries through to the people profile.

const BASE_STOPS_PER_HOUR = 5;
const PRODUCTIVITY_VARIANCE = 0.15; // ±15% per person around the crew's speed

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

function gaussian(rand) {
  const u = 1 - rand();
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function hashString(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

export function computePersonStats(crew, person) {
  const rand = mulberry32(hashString(person.id));
  const productivity = clamp(
    BASE_STOPS_PER_HOUR * crew.speed * (1 + gaussian(rand) * PRODUCTIVITY_VARIANCE),
    3.5,
    7.0
  );
  const quality = clamp(
    3.6 + rand() * 1.2 + person.tenureYears * 0.04,
    3.5,
    5.0
  );
  const attendance = 88 + rand() * 11;
  return { productivity, quality, attendance };
}

export function computeTeamStats(crew, peopleWithStats) {
  const n = peopleWithStats.length || 1;
  const sum = (key) => peopleWithStats.reduce((s, p) => s + p.stats[key], 0);
  const productivity = sum('productivity') / n;
  const quality = sum('quality') / n;
  const attendance = sum('attendance') / n;
  const totalTenure = peopleWithStats.reduce((s, p) => s + p.tenureYears, 0);

  // Composite 1–5 star score: weighted blend.
  //   productivity normalized against the realistic ceiling (~6.5 stops/hr)
  //   quality already 1–5
  //   attendance normalized from [85, 100] window
  const productivityStar = clamp((productivity / 6.5) * 5, 1, 5);
  const attendanceStar   = clamp(((attendance - 85) / 15) * 5, 1, 5);
  const composite = (
    productivityStar * 0.40 +
    quality          * 0.30 +
    attendanceStar   * 0.30
  );

  return {
    productivity,
    quality,
    attendance,
    totalTenure,
    composite: clamp(composite, 1, 5),
  };
}

export function attachStats(crew, people) {
  return people.map((person) => ({
    ...person,
    stats: computePersonStats(crew, person),
  }));
}
