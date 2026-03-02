import { Place } from './place.types';

export async function fetchActivePlaces(limit?: number): Promise<Place[]> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/places?active=true&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch places');
  }

  return response.json();
}
