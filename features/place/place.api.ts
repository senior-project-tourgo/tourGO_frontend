import api from '../../config/api';
import { Place } from './place.types';
export async function fetchActivePlaces(limit?: number): Promise<Place[]> {
  try {
    const response = await api.get<Place[]>('/places/get-all-places', {
      params: {
        active: true,
        limit
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch places', { cause: error });
  }
}
