import sys, json, math
from typing import List, Tuple

EARTH_R = 6371.0  # km

def haversine_km(a: Tuple[float, float], b: Tuple[float, float]) -> float:
    # a=(lon,lat), b=(lon,lat)
    lon1, lat1 = map(math.radians, a)
    lon2, lat2 = map(math.radians, b)
    dlon, dlat = lon2 - lon1, lat2 - lat1
    h = math.sin(dlat/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(dlon/2)**2
    return 2 * EARTH_R * math.asin(math.sqrt(h))

def path_len_km(coords: List[List[float]]) -> float:
    if not coords or len(coords) < 2:
        return 0.0
    total = 0.0
    for i in range(len(coords)-1):
        total += haversine_km(tuple(coords[i]), tuple(coords[i+1]))
    return total

def main():
    data = json.loads(sys.stdin.read() or "{}")

    itinerary = data.get("itinerary", {}) or {}
    resources  = data.get("resources", {}) or {}
    pricing    = data.get("pricing", {}) or {}

    frm = itinerary.get("from")
    to  = itinerary.get("to")
    date = itinerary.get("date")
    hours = float(itinerary.get("hours") or 0)

    geometry = (itinerary.get("geometry") or {})
    coords = geometry.get("coordinates") or []
    km = itinerary.get("km")

    # compute km if missing
    if not km:
        km = round(path_len_km(coords), 3)

    # pricing fallback if not provided
    transport = float(pricing.get("transport") or 0)
    labor     = float(pricing.get("labor") or 0)
    platform  = float(pricing.get("platformFee") or 0)
    est_total = float(pricing.get("estTotal") or (transport + labor + platform))

    helpers = int(resources.get("helpers") or 0)
    vol_m3  = resources.get("estimated_volume_m3")

    # quick suggestions (very simple placeholders)
    suggestions = {
        "crossDockCandidates": [],
        "assetShare": [],
        "notes": [
            "You can plug real depot/vehicle data here to get actionable cross-docking suggestions.",
            "Provide time windows and vehicle capacities to enable real route optimization."
        ]
    }

    result = {
        "short": {
            "from": frm,
            "to": to,
            "date": date,
            "hours": hours,
            "km": km,
            "helpers": helpers,
            "estimated_volume_m3": vol_m3,
            "estTotal": est_total
        },
        "full": {
            "itinerary": {
                "from": frm, "to": to, "date": date, "hours": hours, "km": km,
                "geometry": { "type": "LineString", "coordinates": coords }
            },
            "pricing": {
                "transport": transport,
                "labor": labor,
                "platformFee": platform,
                "estTotal": est_total
            },
            "resources": {
                "helpers": helpers,
                "estimated_volume_m3": vol_m3
            },
            "optimization": {
                "suggestions": suggestions
            }
        }
    }
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()

