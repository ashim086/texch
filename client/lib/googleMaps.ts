// ─── Haversine distance between two lat/lng points ──────────────────────────

export function haversineKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Reverse-geocode lat/lng → human-readable address ────────────────────────
// Uses Nominatim (OpenStreetMap) — completely free, no API key required.

interface NominatimResult {
    display_name: string;
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
    const url =
        `https://nominatim.openstreetmap.org/reverse` +
        `?lat=${lat}&lon=${lng}&format=json&accept-language=en`;

    const res = await fetch(url, {
        headers: { "Accept": "application/json" },
    });

    if (!res.ok) throw new Error("Nominatim request failed");

    const data: NominatimResult = await res.json();
    return data.display_name;
}
