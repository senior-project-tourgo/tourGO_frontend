import api from '@/config/api';
import { decodePolyline, type LatLng } from '@/utils/decodePolyline';

export type TransportMode = 'driving' | 'walking' | 'bicycling' | 'transit';

export type RouteSegment = {
  coords: LatLng[];
  duration: string; // e.g. "12 mins"
};

/**
 * Fetches a real road route between two points via the backend proxy.
 * Falls back to a straight line with no duration if the API key isn't
 * configured or there's no route for the selected mode.
 */
export async function fetchRouteSegment(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  mode: TransportMode
): Promise<RouteSegment> {
  try {
    const response = await api.get<{ points: string; duration: string }>(
      '/directions',
      {
        params: {
          origin: `${from.lat},${from.lng}`,
          destination: `${to.lat},${to.lng}`,
          mode
        }
      }
    );
    return {
      coords: decodePolyline(response.data.points),
      duration: response.data.duration
    };
  } catch {
    // Graceful fallback — straight line, no duration label
    return {
      coords: [
        { latitude: from.lat, longitude: from.lng },
        { latitude: to.lat, longitude: to.lng }
      ],
      duration: ''
    };
  }
}
