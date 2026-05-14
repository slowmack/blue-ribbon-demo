// Synthetic crew members — 3 or 4 people per crew, deterministic per crew.
// Names from small pools, roles depend on crew size, tenure ranges depend on
// role.

const FIRST_NAMES_MALE = [
  'James', 'John', 'Robert', 'Michael', 'David', 'Daniel', 'Carlos', 'Jose',
  'Anthony', 'Mark', 'Steven', 'Brian', 'Kevin', 'Jason', 'Ryan', 'Tyler',
  'Cody', 'Dustin', 'Wyatt', 'Caleb', 'Tucker', 'Hunter', 'Levi', 'Mason',
];

const FIRST_NAMES_FEMALE = [
  'Mary', 'Linda', 'Patricia', 'Jennifer', 'Susan', 'Karen', 'Lisa',
  'Maria', 'Angela', 'Brittany', 'Ashley', 'Megan',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis',
  'Walker', 'Hall', 'Allen', 'Young', 'King',
];

const ROLES_BY_SIZE = {
  3: ['Crew Lead', 'Mower Operator', 'Trimmer'],
  4: ['Crew Lead', 'Mower Operator', 'Trimmer', 'Helper'],
};

const TENURE_RANGES = {
  'Crew Lead':      [3, 12],
  'Mower Operator': [1, 8],
  'Trimmer':        [0.5, 6],
  'Helper':         [0.5, 3],
};

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

function pickFirstName(rand) {
  if (rand() < 0.15) {
    return FIRST_NAMES_FEMALE[Math.floor(rand() * FIRST_NAMES_FEMALE.length)];
  }
  return FIRST_NAMES_MALE[Math.floor(rand() * FIRST_NAMES_MALE.length)];
}

function pickLastName(rand) {
  return LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
}

function tenureFor(role, rand) {
  const [lo, hi] = TENURE_RANGES[role] ?? [0.5, 5];
  // Bias slightly toward the lower end of the range (most workers are newer).
  const skew = Math.pow(rand(), 1.4);
  const years = lo + skew * (hi - lo);
  return Math.round(years * 10) / 10;
}

export function generatePeople(crews) {
  const peopleByCrew = new Map();

  crews.forEach((crew, crewIdx) => {
    const rand = mulberry32(1000 + crewIdx);
    const roles = ROLES_BY_SIZE[crew.size] ?? ROLES_BY_SIZE[3];
    const people = roles.map((role, personIdx) => {
      const firstName = pickFirstName(rand);
      const lastName = pickLastName(rand);
      const tenureYears = tenureFor(role, rand);
      return {
        id: `${crew.id}-P${personIdx + 1}`,
        crewId: crew.id,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        role,
        tenureYears,
      };
    });
    peopleByCrew.set(crew.id, people);
  });

  return peopleByCrew;
}
