// services/trip.service.ts

import { tripsMock } from '@/mock/trips.mock';
import { tripPlacesMock } from '@/mock/tripplaces.mock';
import { placesMock } from '@/mock/places.mock';

export async function generateTrip(userId: string) {
  // simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // generate new incremental id (like DB auto-increment)
  const newTripNumber = tripsMock.length + 1;
  const tripId = `trip_${newTripNumber.toString().padStart(3, '0')}`;

  // simulate backend selecting places (random 3)
  const generatedPlaces = [...placesMock]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // create trip record
  tripsMock.push({
    tripId,
    userId,
    tripName: 'Generated Trip',
    preferenceId: `pref_${Date.now()}`,
    status: 'DRAFT',
    doneDate: null,
    totalPlaces: generatedPlaces.length,
    estimatedBudget: null,
    createdAt: new Date().toISOString()
  });

  // create tripPlaces records
  generatedPlaces.forEach((place, index) => {
    tripPlacesMock.push({
      tripPlaceId: `tp_${Date.now()}_${index}`,
      tripId,
      placeId: place.placeId,
      order: index + 1
    });
  });

  // simulate backend response
  return tripId;
}
