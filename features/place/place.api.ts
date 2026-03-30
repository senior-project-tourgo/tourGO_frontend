import api from '../../config/api';
import { Place } from './place.types';

export async function getActivePlaces(limit?: number): Promise<Place[]> {
  try {
    const response = await api.get<Place[]>('/places/get-all-places', {
      params: { active: true, limit }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch places', { cause: error });
  }
}

export async function searchPlaces(q: string, limit = 20): Promise<Place[]> {
  try {
    const response = await api.get<Place[]>('/places/search', {
      params: { q, limit }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to search places', { cause: error });
  }
}
