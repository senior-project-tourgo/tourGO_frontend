import { tripsMock } from '@/mock/trips.mock';
import { tripPlacesMock } from '@/mock/tripplaces.mock';
import { placesMock } from '@/mock/places.mock';

type GenerateTripInput = {
  area?: 'Kathmandu' | 'Pokhara' | 'Bhaktapur' | 'Lalitpur';
  vibes?: string[];
  numberOfPlaces?: number;
  itineraryName?: string;
  budgetLevel?: number;
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
    const num = Number(trip.tripId.split('_')[1]);
    return num > max ? num : max;
  }, 0);

  const newTripNumber = highestTripNumber + 1;
  const tripId = `trip_${newTripNumber.toString().padStart(3, '0')}`;
  const preferenceId = `pref_${newTripNumber.toString().padStart(3, '0')}`;

  /* --------------------------------------------------
   * 2️⃣ Filter by area (if selected)
   * -------------------------------------------------- */

  let filteredPlaces = placesMock.filter(place => place.isActive);

  if (preferences.area) {
    filteredPlaces = filteredPlaces.filter(
      place => place.location.area === preferences.area
    );
  }

  /* --------------------------------------------------
   * 3️⃣ Filter by vibes (if selected)
   * -------------------------------------------------- */

  if (preferences.vibes && preferences.vibes.length > 0) {
    filteredPlaces = filteredPlaces.filter(place =>
      preferences.vibes!.some(vibe => place.vibe.includes(vibe))
    );
  }

  /* --------------------------------------------------
   * 4️⃣ Fallback safety (if too few matches)
   * -------------------------------------------------- */

  if (filteredPlaces.length < 2) {
    // relax vibe constraint but keep area
    filteredPlaces = placesMock.filter(place => {
      const areaMatch = preferences.area
        ? place.location.area === preferences.area
        : true;
      return place.isActive && areaMatch;
    });
  }

  /* --------------------------------------------------
   * 5️⃣ Randomly pick 2–3 places
   * -------------------------------------------------- */

  const shuffled = [...filteredPlaces].sort(() => Math.random() - 0.5);

  const numberOfPlaces =
    preferences.numberOfPlaces && shuffled.length >= preferences.numberOfPlaces
      ? preferences.numberOfPlaces
      : Math.min(3, shuffled.length);

  const generatedPlaces = shuffled.slice(0, numberOfPlaces);

  /* --------------------------------------------------
   * 6️⃣ Create trip record
   * -------------------------------------------------- */

  tripsMock.push({
    tripId,
    userId,
    tripName: preferences.itineraryName ?? 'Generated Trip',
    preferenceId,
    status: 'DRAFT',
    doneDate: null,
    totalPlaces: generatedPlaces.length,
    estimatedBudget: null,
    createdAt: new Date().toISOString()
  });

  /* --------------------------------------------------
   * 7️⃣ Generate tripPlace records
   * -------------------------------------------------- */

  let highestTripPlaceNumber = tripPlacesMock.reduce((max, tp) => {
    const num = Number(tp.tripPlaceId.split('_')[1]);
    return num > max ? num : max;
  }, 0);

  generatedPlaces.forEach((place, index) => {
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
