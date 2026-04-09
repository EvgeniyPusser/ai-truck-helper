import { Router } from "express";
const router = Router();
function getOrsApiKey() {
    return process.env.ORS_API_KEY || "";
}
function isZip(v) {
    return typeof v === "string" && /^\d{5}$/.test(v);
}
async function geocodeZip(zip) {
    const apiKey = getOrsApiKey();
    if (!apiKey) {
        throw new Error("Missing ORS_API_KEY");
    }
    const url = "https://api.openrouteservice.org/geocode/search?" +
        `text=${encodeURIComponent(zip)}` +
        "&size=1&boundary.country=US";
    const res = await fetch(url, {
        headers: {
            Authorization: apiKey,
            Accept: "application/json",
        },
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`ORS geocode HTTP ${res.status}: ${text || "unknown error"}`);
    }
    const data = await res.json();
    const first = data?.features?.[0]?.geometry?.coordinates;
    if (!Array.isArray(first) || first.length < 2) {
        throw new Error(`Could not geocode ZIP ${zip}`);
    }
    // ORS format: [lng, lat]
    return first;
}
async function orsRoute(coordinates, profile = "driving-car", simplify = true) {
    const apiKey = getOrsApiKey();
    if (!apiKey) {
        throw new Error("Missing ORS_API_KEY");
    }
    const url = `https://api.openrouteservice.org/v2/directions/${encodeURIComponent(profile)}/geojson`;
    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: apiKey,
            "Content-Type": "application/json; charset=utf-8",
            Accept: "application/geo+json, application/json",
        },
        body: JSON.stringify({
            coordinates,
            geometry_simplify: !!simplify,
        }),
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`ORS route HTTP ${res.status}: ${text || "unknown error"}`);
    }
    const geo = await res.json();
    const line = geo?.features?.[0]?.geometry?.coordinates; // [lng,lat][]
    if (!Array.isArray(line) || line.length < 2) {
        throw new Error("No route geometry returned");
    }
    // Convert for Leaflet: [lat, lng]
    return line.map(([lng, lat]) => [lat, lng]);
}
router.post("/route", async (req, res) => {
    try {
        const { coordinates, pickupZip, dropoffZip, profile = "driving-car", simplify = true, } = req.body || {};
        let coords = coordinates;
        if (!Array.isArray(coords) || coords.length < 2) {
            if (!isZip(pickupZip) || !isZip(dropoffZip)) {
                return res.status(400).json({
                    error: "Send either coordinates ([[lng,lat],...]) or pickupZip/dropoffZip (5-digit US ZIP).",
                });
            }
            const [pickup, dropoff] = await Promise.all([
                geocodeZip(pickupZip),
                geocodeZip(dropoffZip),
            ]);
            coords = [pickup, dropoff];
        }
        const latlng = await orsRoute(coords, profile, simplify);
        return res.json({
            route: {
                profile,
                coordinates: latlng,
            },
        });
    }
    catch (e) {
        return res.status(500).json({
            error: "Route calculation failed",
            details: String(e?.message || e),
        });
    }
});
export default router;
