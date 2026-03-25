// services/trip.service.ts

import api from '@/config/api';
import { SelectorOption } from '@/constants/selectorOptions';
import { TransportMode } from '@/constants/transportOptions';
import { Place } from '@/features/place/place.types';
import type {
  Trip,
  CheckInResult,
  CompleteTripResult
} from '@/features/trip/trip.types';

export async function fetchAllUserTrips(): Promise<Trip[]> {
  try {
    const response = await api.get<Trip[]>('/trips/fetch-all-user-trips');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch trips');
  }
}

export async function getTripById(tripId: string): Promise<Trip> {
  try {
    const response = await api.get<Trip>(`/trips/${tripId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch trip');
  }
}

export async function startTrip(tripId: string): Promise<Trip> {
  try {
    const response = await api.patch<Trip>(`/trips/${tripId}/start`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to start trip');
  }
}

export async function checkIn(
  tripId: string,
  placeId: string
): Promise<CheckInResult> {
  try {
    const response = await api.patch<CheckInResult>(
      `/trips/${tripId}/checkin`,
      { placeId }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Check-in failed');
  }
}

export async function updateTrip(
  tripId: string,
  payload: {
    itineraryName?: string;
    places?: { placeId: string; order: number }[];
  }
): Promise<Trip> {
  try {
    const response = await api.patch<Trip>(`/trips/${tripId}`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update trip');
  }
}

export async function deleteTrip(tripId: string): Promise<void> {
  try {
    await api.delete(`/trips/${tripId}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete trip');
  }
}

export async function completeTrip(
  tripId: string
): Promise<CompleteTripResult> {
  try {
    const response = await api.patch<CompleteTripResult>(
      `/trips/${tripId}/complete`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to complete trip');
  }
}

export type GenerateTripInput = {
  area: 'Kathmandu' | 'Pokhara' | 'Bhaktapur' | 'Lalitpur';
  vibes: string[];
  pace: SelectorOption['value'];
  tripDate: string;
  startTime: string;
  endTime: string;
  itineraryName?: string;
  budgetLevel?: number;
  numberOfPeople?: number;
  groupType?: string;
  startLat?: number;
  startLng?: number;
  transportMode?: TransportMode;
};

export type GenerateRecommendationResult = {
  recommendedPlaces: Place[];
  itineraryId?: string;
};

export async function generateRecommendation(
  preferences: GenerateTripInput
): Promise<GenerateRecommendationResult> {
  try {
    // numberOfPlaces is now computed server-side from startTime/endTime/pace/transportMode
    const response = await api.post<GenerateRecommendationResult>(
      '/recommend',
      preferences
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to generate recommendation'
    );
  }
}

export async function createTrip(payload: {
  itineraryName: string;
  places: { placeId: string; order: number }[];
  status: 'saved' | 'current';
}): Promise<Trip> {
  try {
    const response = await api.post<Trip>('/trips/create-trip', payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Trip creation failed');
  }
}
