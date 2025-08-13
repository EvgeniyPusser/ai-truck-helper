// server/services/geocode.ts
import fetch from "node-fetch";

/** Возвращает [lng, lat] (США) */
export async function geocode(place: string): Promise<[number, number]> {
  const q = /usa|united\s*states|,?\s*[A-Z]{2}\s*,?\s*USA/i.test(place)
    ? place
    : `${place}, USA`;

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=${encodeURIComponent(q)}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "HolyMove/1.0",
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Geocode error ${res.status}: ${text || res.statusText}`);
  }

  const data: any = await res.json();
  if (Array.isArray(data) && data.length > 0 && data[0].lon && data[0].lat) {
    const lng = parseFloat(data[0].lon);
    const lat = parseFloat(data[0].lat);
    if (lng > 0) throw new Error(`Geocode sanity check failed: lng=${lng} (expected USA negative longitude)`);
    return [lng, lat];
  }

  throw new Error(`No coordinates found for "${q}"`);
}
