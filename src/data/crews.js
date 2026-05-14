// 10-crew roster. 6 crews of 3 people, 4 crews of 4 people.
// Speed multipliers range 0.85–1.15x. Daily capacity is derived:
//   base = size * 5 customers/day, then scaled by speed multiplier, rounded.

const PALETTE = [
  '#2563eb', '#16a34a', '#dc2626', '#9333ea', '#0891b2',
  '#ea580c', '#ca8a04', '#db2777', '#0d9488', '#7c3aed',
];

const ROSTER = [
  { name: 'Crew Alpha',   size: 4, speed: 1.15, notes: 'Most experienced, fast turnarounds' },
  { name: 'Crew Bravo',   size: 4, speed: 1.05, notes: 'Strong on large properties' },
  { name: 'Crew Charlie', size: 4, speed: 1.00, notes: 'Generalist' },
  { name: 'Crew Delta',   size: 4, speed: 0.90, notes: 'Newer crew, ramping up' },
  { name: 'Crew Echo',    size: 3, speed: 1.10, notes: 'Tight unit, efficient' },
  { name: 'Crew Foxtrot', size: 3, speed: 1.05, notes: 'Solid all-around' },
  { name: 'Crew Golf',    size: 3, speed: 1.00, notes: 'Generalist' },
  { name: 'Crew Hotel',   size: 3, speed: 0.95, notes: 'Detail-focused' },
  { name: 'Crew India',   size: 3, speed: 0.90, notes: 'Best on small lots' },
  { name: 'Crew Juliet',  size: 3, speed: 0.85, notes: 'Trainee-heavy this season' },
];

export function generateCrews() {
  return ROSTER.map((crew, i) => {
    const capacity = Math.round(crew.size * 5 * crew.speed);
    return {
      id: `CR${String(i + 1).padStart(2, '0')}`,
      name: crew.name,
      size: crew.size,
      speed: crew.speed,
      capacity,
      color: PALETTE[i],
      notes: crew.notes,
    };
  });
}
