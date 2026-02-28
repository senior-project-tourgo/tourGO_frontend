import { tripsMock } from '@/mock/trips.mock';
import { tripPlacesMock } from '@/mock/tripplaces.mock';
import { placesMock } from '@/mock/places.mock';

import type { TripId, TripPlaceId } from '@/features/place/trip-place.types';
import type { VibeId } from '@/features/vibe/vibe.types';

type GenerateTripInput = {
  area?: 'Kathmandu' | 'Pokhara' | 'Bhaktapur' | 'Lalitpur';
  vibes?: VibeId[];
  numberOfPlaces?: number;
  itineraryName?: string;
  budgetLevel?: number; // 1–4
  durationHours?: number;
  numberOfPeople?: number;
};

export async function generateTrip(
  userId: string,
  preferences: GenerateTripInput
): Promise<TripId> {
  await new Promise(resolve => setTimeout(resolve, 800));

  /* --------------------------------------------------
   * 1️⃣ Generate next tripId safely (typed)
   * -------------------------------------------------- */

  const highestTripNumber = tripsMock.reduce((max, trip) => {
    const match = trip.tripId.match(/^trip_(\d+)$/);
    const num = match ? Number(match[1]) : 0;
    return num > max ? num : max;
  }, 0);

  const newTripNumber = highestTripNumber + 1;
  const padded = newTripNumber.toString().padStart(3, '0');

  const tripId = `trip_${padded}` as TripId;
  const preferenceId = `pref_${padded}`;

  /* --------------------------------------------------
   * 2️⃣ Base filtering (active + area)
   * -------------------------------------------------- */

  let basePlaces = placesMock.filter(place => place.isActive);

  if (preferences.area) {
    basePlaces = basePlaces.filter(
      place => place.location.area === preferences.area
    );
  }

  /* --------------------------------------------------
   * 3️⃣ Budget soft filtering
   * -------------------------------------------------- */

  if (preferences.budgetLevel) {
    const allowedPriceLevels = ['$', '$$', '$$$', '$$$$'].slice(
      0,
      preferences.budgetLevel
    );

    const budgetFiltered = basePlaces.filter(place =>
      allowedPriceLevels.includes(place.priceRange)
    );

    if (budgetFiltered.length >= 2) {
      basePlaces = budgetFiltered;
    }
  }

  /* --------------------------------------------------
   * 4️⃣ Score by vibe (typed VibeId)
   * -------------------------------------------------- */

  const scoredPlaces = basePlaces
    .map(place => ({
      place,
      score: preferences.vibes?.filter(v => place.vibe.includes(v)).length ?? 0
    }))
    .sort((a, b) => b.score - a.score);

  /* --------------------------------------------------
   * 5️⃣ Determine number of places
   * -------------------------------------------------- */

  const requested = preferences.numberOfPlaces ?? 3;
  const numberOfPlaces = Math.min(requested, scoredPlaces.length);

  const selected = scoredPlaces.slice(0, numberOfPlaces).map(x => x.place);

  if (selected.length === 0) {
    throw new Error('No places available at the moment.');
  }

  /* --------------------------------------------------
   * 6️⃣ Create trip record
   * -------------------------------------------------- */

  tripsMock.push({
    tripId,
    userId,
    tripName: preferences.itineraryName ?? 'Generated Trip',
    preferenceId,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    startedAt: null,
    pausedAt: null,
    completedAt: null,
    totalDuration: null
  });

  /* --------------------------------------------------
   * 7️⃣ Generate tripPlace records (typed IDs)
   * -------------------------------------------------- */

  let highestTripPlaceNumber = tripPlacesMock.reduce((max, tp) => {
    const match = tp.tripPlaceId.match(/^tp_(\d+)$/);
    const num = match ? Number(match[1]) : 0;
    return num > max ? num : max;
  }, 0);

  selected.forEach((place, index) => {
    highestTripPlaceNumber += 1;

    const tripPlaceId =
      `tp_${highestTripPlaceNumber.toString().padStart(3, '0')}` as TripPlaceId;

    tripPlacesMock.push({
      tripPlaceId,
      tripId,
      placeId: place.placeId,
      order: index + 1
    });
  });

  return tripId;
}
