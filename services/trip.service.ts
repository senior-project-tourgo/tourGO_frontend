import { tripsMock } from '@/mock/trips.mock';
import { tripPlacesMock } from '@/mock/tripplaces.mock';
import { placesMock } from '@/mock/places.mock';

type GenerateTripInput = {
  area?: 'Kathmandu' | 'Pokhara' | 'Bhaktapur' | 'Lalitpur';
  vibes?: string[];
  numberOfPlaces?: number;
  itineraryName?: string;
  budgetLevel?: number; // 1–4
  durationHours?: number;
  numberOfPeople?: number;
};

export async function generateTrip(
  userId: string,
  preferences: GenerateTripInput
) {
  await new Promise(resolve => setTimeout(resolve, 800));

  /* --------------------------------------------------
   * 1️⃣ Generate next tripId safely
   * -------------------------------------------------- */

  const highestTripNumber = tripsMock.reduce((max, trip) => {
    const match =
      typeof trip.tripId === 'string'
        ? trip.tripId.match(/^trip_(\d+)$/)
        : null;

    const num = match ? Number(match[1]) : 0;
    return Number.isFinite(num) && num > max ? num : max;
  }, 0);

  const newTripNumber = highestTripNumber + 1;
  const tripId = `trip_${newTripNumber.toString().padStart(3, '0')}`;
  const preferenceId = `pref_${newTripNumber.toString().padStart(3, '0')}`;

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
   * 4️⃣ Score by vibe
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

  /* --------------------------------------------------
   * 6️⃣ Select places
   * -------------------------------------------------- */

  let selected = scoredPlaces.slice(0, numberOfPlaces).map(x => x.place);

  if (selected.length === 0) {
    throw new Error('No places available at the moment.');
  }

  /* --------------------------------------------------
   * 7️⃣ Create trip record (NEW STRUCTURE)
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
   * 8️⃣ Generate tripPlace records
   * -------------------------------------------------- */

  let highestTripPlaceNumber = tripPlacesMock.reduce((max, tp) => {
    const match =
      typeof tp.tripPlaceId === 'string'
        ? tp.tripPlaceId.match(/^tp_(\d+)$/)
        : null;

    const num = match ? Number(match[1]) : 0;
    return Number.isFinite(num) && num > max ? num : max;
  }, 0);

  selected.forEach((place, index) => {
    highestTripPlaceNumber += 1;

    tripPlacesMock.push({
      tripPlaceId: `tp_${highestTripPlaceNumber.toString().padStart(3, '0')}`,
      tripId,
      placeId: place.placeId,
      order: index + 1
    });
  });

  return tripId;
}
