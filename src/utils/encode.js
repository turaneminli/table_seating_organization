const toUrlSafe = (b64) =>
  b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

const fromUrlSafe = (s) => s.replace(/-/g, "+").replace(/_/g, "/");

export const encodePlan = (obj) => {
  const json = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = btoa(bin);
  return toUrlSafe(b64);
};

export const decodePlan = (s) => {
  try {
    const b64 = fromUrlSafe(s);
    const pad = "=".repeat((4 - (b64.length % 4)) % 4);
    const bin = atob(b64 + pad);
    const bytes = new Uint8Array([...bin].map((c) => c.charCodeAt(0)));
    const json = new TextDecoder().decode(bytes);
    console.log("JSON", json);
    return JSON.parse(json);
  } catch {
    return null;
  }
};
