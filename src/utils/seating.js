import { shuffle, chunk, mulberry32 } from './random';
import { couplesFromGuests } from './couples';

const rngFromSeed = (seed) => mulberry32(Number(seed) || 1);

const seatRandom = (guests, tables, rng) => {
  const perTable = guests.length / tables;
  const out = Array.from({ length: tables }, () => ({ seats: Array(perTable).fill(null) }));
  const s = shuffle(guests, rng);
  let k = 0;
  for (let t = 0; t < tables; t++) {
    for (let i = 0; i < perTable; i++) out[t].seats[i] = s[k++];
  }
  return { tables: out, seatsPerTable: perTable };
};

const seatAlternate = (guests, tables, rng) => {
  const perTable = guests.length / tables;
  const men = shuffle(guests.filter(g => g.gender === 'M'), rng);
  const women = shuffle(guests.filter(g => g.gender === 'F'), rng);
  const menChunks = chunk(men, tables);
  const womenChunks = chunk(women, tables);
  const out = Array.from({ length: tables }, () => ({ seats: Array(perTable).fill(null) }));
  for (let t = 0; t < tables; t++) {
    const m = menChunks[t] || [];
    const w = womenChunks[t] || [];
    let i = 0, j = 0, s = 0;
    const startMale = true;
    while (s < perTable) {
      out[t].seats[s++] = ((s - 1) % 2 === 0) === startMale ? (m[i++] || null) : (w[j++] || null);
    }
  }
  return { tables: out, seatsPerTable: perTable };
};

const seatTraditional = (guests, tables, rng) => {
  const perTable = guests.length / tables;
  const couples = shuffle(couplesFromGuests(guests), rng);
  const out = Array.from({ length: tables }, () => ({ seats: Array(perTable).fill(null) }));
  let idx = 0;
  for (let t = 0; t < tables; t++) {
    for (let c = 0; c < perTable / 2; c++) {
      const [man, woman] = couples[idx++ % couples.length];
      const base = (2 * c) % perTable;
      out[t].seats[base] = man;
      out[t].seats[(base + 1) % perTable] = woman; // woman to the right
    }
  }
  return { tables: out, seatsPerTable: perTable };
};

const seatOpposite = (guests, tables, rng) => {
  const perTable = guests.length / tables;
  const couples = shuffle(couplesFromGuests(guests), rng);
  const out = Array.from({ length: tables }, () => ({ seats: Array(perTable).fill(null) }));
  let idx = 0;
  for (let t = 0; t < tables; t++) {
    for (let c = 0; c < perTable / 2; c++) {
      const [man, woman] = couples[idx++ % couples.length];
      const base = c % perTable;
      out[t].seats[base] = man;
      out[t].seats[(base + perTable / 2) % perTable] = woman; // opposite side
    }
  }
  return { tables: out, seatsPerTable: perTable };
};

export const generateSeating = (guests, tables, mode, seed = 1) => {
  const rng = rngFromSeed(seed);
  if (mode === 'random')      return seatRandom(guests, tables, rng);
  if (mode === 'alternate')   return seatAlternate(guests, tables, rng);
  if (mode === 'traditional') return seatTraditional(guests, tables, rng);
  return seatOpposite(guests, tables, rng);
};
