// src/services/geocode.ts
import fetch from "node-fetch";

/**
 * Geocode using OpenStreetMap Nominatim (no API key).
 * Returns [lng, lat] like before.
 */
export async function geocode(place: string): Promise<[number, number]> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(place)}`;

  const res = await fetch(url, {
    headers: {
      // Nominatim requires a valid User-Agent/contact per policy
      "User-Agent": "HolyMove/1.0 (support@holymove.example)",
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
    return [lng, lat];
  }

  throw new Error(`No coordinates found for "${place}"`);
}




