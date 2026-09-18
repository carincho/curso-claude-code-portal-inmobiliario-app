export type Coordinates = { lat: number; lng: number };

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    return null;
  }

  try {
    const url = `https://geocode.googleapis.com/v4/geocode/address/${encodeURIComponent(address)}?key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const location = data.results?.[0]?.location;

    if (typeof location?.latitude !== "number" || typeof location?.longitude !== "number") {
      return null;
    }

    return { lat: location.latitude, lng: location.longitude };
  } catch {
    return null;
  }
}
