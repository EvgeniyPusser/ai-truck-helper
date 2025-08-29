import fetch from "node-fetch";
import { config } from "../config.js"; // config.orsApiKey
export async function geocode(place) {
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${config.orsApiKey}&text=${encodeURIComponent(place)}&size=1`;
    const res = await fetch(url, {
        headers: {
            "Accept": "application/json",
        },
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`ORS Geocode error ${res.status}: ${text || res.statusText}`);
    }
    const data = await res.json();
    const features = data.features;
    if (Array.isArray(features) && features.length > 0 && features[0].geometry?.coordinates) {
        const [lng, lat] = features[0].geometry.coordinates;
        return [lng, lat];
    }
    throw new Error(`No coordinates found for "${place}"`);
}
