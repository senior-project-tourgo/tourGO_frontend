// services/trip.service.ts

import { PaceOption } from '@/components/PaceSelector';
import api from '@/config/api';
import { Place } from '@/features/place/place.types';

export type GenerateTripInput = {
  area: 'Kathmandu' | 'Pokhara' | 'Bhaktapur' | 'Lalitpur';
  vibes: string[];
  pace: PaceOption['value'];
  itineraryName?: string;
  budgetLevel?: number;
  durationHours?: number;
  numberOfPeople?: number;
};

export type GenerateRecommendationResult = {
  recommendedPlaces: Place[];
  itineraryId?: string;
};

export async function generateRecommendation(
  preferences: GenerateTripInput
): Promise<GenerateRecommendationResult> {
  try {
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
}) {
  try {
    const response = await api.post('/trips/create-trip', payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Trip creation failed');
  }
}
