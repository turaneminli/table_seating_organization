export const mulberry32 = (seed = 1) => {
  let t = seed >>> 0 || 1;
  return function rng() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

export const shuffle = (arr, rng = Math.random) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const chunk = (a, n) => {
  const out = [];
  const size = Math.ceil(a.length / n);
  for (let i = 0; i < n; i++) out.push(a.slice(i * size, (i + 1) * size));
  return out;
};
