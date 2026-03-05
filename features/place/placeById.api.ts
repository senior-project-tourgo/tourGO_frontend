import api from '../../config/api';
import { Place } from './place.types';

export async function getPlaceById(placeId: string): Promise<Place> {
  try {
    const response = await api.get<Place>(`/places/get-places/${placeId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch place with id: ${placeId}`, {
      cause: error
    });
  }
}

export async function getPlacesByIds(placeIds: string[]): Promise<Place[]> {
  try {
    const results = await Promise.all(
      placeIds.map(placeId => api.get<Place>(`/places/get-places/${placeId}`))
    );

    return results.map(res => res.data);
  } catch (error) {
    throw new Error('Failed to fetch places by ids', {
      cause: error
    });
  }
}
