import fetch from "node-fetch";
/** Возвращает [lng, lat] для США */
export async function geocode(place) {
    // Если нет явного указания США — дописываем ", USA"
    const q = /usa|united\s*states|,?\s*[A-Z]{2}\s*,?\s*USA/i.test(place)
        ? place
        : `${place}, USA`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, {
        headers: {
            "User-Agent": "HolyMove/1.0 (support@holymove.example)",
            "Accept": "application/json",
        },
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Geocode error ${res.status}: ${text || res.statusText}`);
    }
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0].lon && data[0].lat) {
        const lng = parseFloat(data[0].lon);
        const lat = parseFloat(data[0].lat);
        // быстрая проверка, что это США (в США долгота отрицательная)
        if (lng > 0)
            throw new Error(`Geocode sanity check failed: lng=${lng} (ожидали США, отрицательная долгота)`);
        return [lng, lat];
    }
    throw new Error(`No coordinates found for "${q}"`);
}
