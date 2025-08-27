export const couplesFromGuests = (guests) => {
  const map = new Map(guests.map((g) => [g.name, g.partner]));
  const seen = new Set();
  const couples = [];
  for (const g of guests) {
    if (seen.has(g.name)) continue;
    const pName = map.get(g.name);
    const p = guests.find((x) => x.name === pName);
    if (p) {
      seen.add(g.name);
      seen.add(p.name);
      couples.push(g.gender === "M" ? [g, p] : [p, g]);
    }
  }
  return couples;
};
