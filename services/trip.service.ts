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
    const id = typeof trip.tripId === 'string' ? trip.tripId : '';
    const match = id.match(/^trip_(\d+)$/);
    if (!match) {
      return max;
    }
    const num = Number(match[1]);
    if (!Number.isFinite(num) || num < 0) {
      return max;
    }
    return num > max ? num : max;
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
   * 3️⃣ Budget-aware filtering (soft influence)
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
   * 4️⃣ Score by vibe matches
   * -------------------------------------------------- */

  const scoredPlaces = basePlaces
    .map(place => {
      const vibeScore =
        preferences.vibes?.filter(v => place.vibe.includes(v)).length ?? 0;

      return { place, score: vibeScore };
    })
    .sort((a, b) => b.score - a.score);

  /* --------------------------------------------------
   * 5️⃣ Determine number of places
   * -------------------------------------------------- */

  const requested = preferences.numberOfPlaces ?? 3;
  const numberOfPlaces = Math.min(requested, scoredPlaces.length);

  /* --------------------------------------------------
   * 6️⃣ Pick top scored, slight shuffle inside same score
   * -------------------------------------------------- */

  const groupedByScore = scoredPlaces.reduce(
    (acc, item) => {
      if (!acc[item.score]) acc[item.score] = [];
      acc[item.score].push(item.place);
      return acc;
    },
    {} as Record<number, typeof basePlaces>
  );

  const sortedScores = Object.keys(groupedByScore)
    .map(Number)
    .sort((a, b) => b - a);

  let selected: typeof basePlaces = [];

  for (const score of sortedScores) {
    const group = groupedByScore[score].sort(() => Math.random() - 0.5);

    for (const place of group) {
      if (selected.length < numberOfPlaces) {
        selected.push(place);
      }
    }
  }

  /* --------------------------------------------------
   * 7️⃣ Estimate budget
   * -------------------------------------------------- */

  const baseCostPerPlace = {
    $: 500,
    $$: 1000,
    $$$: 2000,
    $$$$: 4000
  };

  const estimatedBudget =
    selected.reduce(
      (total, place) => total + baseCostPerPlace[place.priceRange],
      0
    ) * (preferences.numberOfPeople ?? 1);

  /* --------------------------------------------------
   * 8️⃣ Create trip record
   * -------------------------------------------------- */

  tripsMock.push({
    tripId,
    userId,
    tripName: preferences.itineraryName ?? 'Generated Trip',
    preferenceId,
    status: 'DRAFT',
    doneDate: null,
    totalPlaces: selected.length,
    estimatedBudget,
    createdAt: new Date().toISOString()
  });

  /* --------------------------------------------------
   * 9️⃣ Generate tripPlace records
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
