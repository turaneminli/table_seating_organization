export const snapTables = (
  totalGuests,
  requested,
  { requireEvenPerTable = true } = {}
) => {
  let req = Number.isFinite(requested) ? Math.max(1, Math.floor(requested)) : 1;
  req = Math.min(req, totalGuests);

  const divisors = [];
  for (let d = 1; d <= totalGuests; d++)
    if (totalGuests % d === 0) divisors.push(d);

  const candidates = divisors.filter((d) => {
    const per = totalGuests / d;
    if (per < 2) return false;
    if (requireEvenPerTable && per % 2 !== 0) return false;
    return true;
  });

  if (candidates.length === 0) {
    return {
      tables: 1,
      perTable: totalGuests,
      warning: "Using 1 table due to low guest count.",
    };
  }

  let best = candidates[0];
  for (const c of candidates) {
    if (Math.abs(c - req) < Math.abs(best - req)) best = c;
  }

  return {
    tables: best,
    perTable: totalGuests / best,
    warning:
      best !== req
        ? `Adjusted tables from ${req} → ${best} to keep seats/table valid.`
        : "",
  };
};
