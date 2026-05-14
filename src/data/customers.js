// Synthetic customer generator — 300 residential customers across NWA.
// Deterministic via seeded PRNG so the demo always renders the same picture.

const CITIES = [
  { name: 'Bentonville',  lat: 36.3729, lng: -94.2088, weight: 0.20, color: '#2563eb' },
  { name: 'Rogers',       lat: 36.3320, lng: -94.1185, weight: 0.18, color: '#16a34a' },
  { name: 'Springdale',   lat: 36.1867, lng: -94.1288, weight: 0.16, color: '#dc2626' },
  { name: 'Fayetteville', lat: 36.0626, lng: -94.1574, weight: 0.14, color: '#9333ea' },
  { name: 'Bella Vista',  lat: 36.4814, lng: -94.2735, weight: 0.10, color: '#0891b2' },
  { name: 'Centerton',    lat: 36.3589, lng: -94.2832, weight: 0.08, color: '#ea580c' },
  { name: 'Lowell',       lat: 36.2562, lng: -94.1313, weight: 0.08, color: '#ca8a04' },
  { name: 'Cave Springs', lat: 36.2670, lng: -94.2335, weight: 0.06, color: '#db2777' },
];

const STREET_NAMES = [
  'Walnut', 'Oak', 'Maple', 'Cedar', 'Elm', 'Pine', 'Hickory', 'Dogwood',
  'Ridge', 'Hilltop', 'Meadow', 'Sunset', 'Lakeview', 'Spring', 'Creek', 'Briarwood',
  'Bluebird', 'Cardinal', 'Heritage', 'Pinnacle', 'Lookout', 'Crossroads', 'Stonebridge',
];
const STREET_SUFFIXES = ['St', 'Ave', 'Ln', 'Dr', 'Rd', 'Ct', 'Way', 'Blvd'];

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
  // Box-Muller transform — sample standard normal
  const u = 1 - rand();
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function pickWeightedCity(rand) {
  const r = rand();
  let acc = 0;
  for (const city of CITIES) {
    acc += city.weight;
    if (r < acc) return city;
  }
  return CITIES[CITIES.length - 1];
}

function pickPropertySize(rand) {
  const r = rand();
  if (r < 0.40) return 'small';
  if (r < 0.85) return 'medium';
  return 'large';
}

function pickFrequency(rand) {
  return rand() < 0.75 ? 'weekly' : 'biweekly';
}

function synthAddress(rand, city) {
  const number = Math.floor(rand() * 9500) + 100;
  const street = STREET_NAMES[Math.floor(rand() * STREET_NAMES.length)];
  const suffix = STREET_SUFFIXES[Math.floor(rand() * STREET_SUFFIXES.length)];
  return `${number} ${street} ${suffix}, ${city.name}, AR`;
}

export function generateCustomers(count = 300, seed = 1337) {
  const rand = mulberry32(seed);
  const customers = [];
  // Spread roughly 4–5 miles around each city center; ~0.05° lat ≈ 3.4 mi
  const spread = 0.045;

  for (let i = 0; i < count; i++) {
    const city = pickWeightedCity(rand);
    const lat = city.lat + gaussian(rand) * spread;
    const lng = city.lng + gaussian(rand) * spread;

    customers.push({
      id: `C${String(i + 1).padStart(4, '0')}`,
      address: synthAddress(rand, city),
      lat,
      lng,
      city: city.name,
      zoneColor: city.color,
      propertySize: pickPropertySize(rand),
      frequency: pickFrequency(rand),
    });
  }

  return customers;
}

export const ZONE_LEGEND = CITIES.map(({ name, color }) => ({ name, color }));
