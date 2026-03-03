// services/trip.service.ts

import api from '@/config/api'; // your axios instance

export type GenerateTripInput = {
  area: 'Kathmandu' | 'Pokhara' | 'Bhaktapur' | 'Lalitpur';
  vibes: string[];
  numberOfPlaces: number;
  itineraryName?: string;
  budgetLevel?: number;
  durationHours?: number;
  numberOfPeople?: number;
};

export async function generateRecommendation(preferences: GenerateTripInput) {
  try {
    const response = await api.post('/recommend', preferences);
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
