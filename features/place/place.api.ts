import { Place } from './place.types';
import api from '../../config/api';
export async function fetchActivePlaces(limit?: number): Promise<Place[]> {
  try {
    const response = await api.get<Place[]>('/places', {
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
