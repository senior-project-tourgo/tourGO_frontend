import CuratingTripOverlay from '@/components/CuratingTripOverlay';
import { DEFAULT_STEPS, SURPRISE_STEPS } from '@/constants/steps';
import { PaceValue } from '@/constants/paceOptions';
import { TRANSPORT_OPTIONS, TransportMode } from '@/constants/transportOptions';
import { Area, Place } from '@/features/place/place.types';
import {
  generateRecommendation,
  getSurpriseRecommendation
} from '@/services/trip.service';
import { AxiosError } from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, View } from 'react-native';

export default function CuratingTripScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<Record<string, string>>();

  const { mode } = params;
  const isSurprise = mode === 'surprise';

  // prevents duplicate execution per mount
  const calledRef = useRef(false);

  const normalizeString = (v: string | string[] | undefined) => {
    if (Array.isArray(v)) return v[0] ?? '';
    return v ?? '';
  };

  const normalizeNumber = (v: string | string[] | undefined, name: string) => {
    const raw = Array.isArray(v) ? v[0] : v;
    const n = Number(raw);
    if (!Number.isFinite(n)) {
      throw new Error(`Invalid param "${name}": "${raw}"`);
    }
    return n;
  };

  const checkVibeMismatch = (places: Place[], vibes: string[]) => {
    let matchCount = 0;
    const unmatchedNames: string[] = [];

    for (const place of places) {
      const hasMatch = place.vibe.some(v => vibes.includes(v));
      if (hasMatch) matchCount++;
      else unmatchedNames.push(place.placeName);
    }

    return { matchCount, unmatchedNames };
  };

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const run = async () => {
      try {
        if (isSurprise) {
          const result = await getSurpriseRecommendation();

          const placeIds = result.recommendedPlaces
            .map(p => p.placeId)
            .join(',');

          router.replace({
            pathname: '/review-trip',
            params: {
              placeIds,
              itineraryName: 'Surprise Trip ✨'
            }
          });

          return;
        }

        const vibes: string[] = params.vibes ? JSON.parse(params.vibes) : [];

        const transportModeRaw = normalizeString(params.transportMode);
        const priceRangeRaw = normalizeString(params.priceRange);
        const areaRaw = normalizeString(params.travelingArea);

        const result = await generateRecommendation({
          area: (areaRaw || undefined) as Area | undefined,
          vibes,
          pace: normalizeString(params.pace) as PaceValue,
          itineraryName: normalizeString(params.itineraryName),
          tripDate: normalizeString(params.tripDate),
          startTime: normalizeString(params.startTime),
          endTime: normalizeString(params.endTime),
          numberOfPeople: normalizeNumber(
            params.numberOfPeople,
            'numberOfPeople'
          ),
          groupType: normalizeString(params.groupType) || undefined,
          startLat: params.startLat ? Number(params.startLat) : undefined,
          startLng: params.startLng ? Number(params.startLng) : undefined,
          transportMode: TRANSPORT_OPTIONS.some(
            o => o.value === transportModeRaw
          )
            ? (transportModeRaw as TransportMode)
            : undefined,
          priceRange: (['$', '$$', '$$$', '$$$$'] as const).includes(
            priceRangeRaw as any
          )
            ? (priceRangeRaw as '$' | '$$' | '$$$' | '$$$$')
            : undefined
        });

        const placeIds = result.recommendedPlaces.map(p => p.placeId).join(',');

        const { matchCount, unmatchedNames } = checkVibeMismatch(
          result.recommendedPlaces,
          vibes
        );

        const baseParams = {
          placeIds,
          itineraryName: params.itineraryName,
          startLat: params.startLat,
          startLng: params.startLng,
          startLabel: params.startLabel
        };

        router.replace({
          pathname: '/review-trip',
          params:
            matchCount < result.recommendedPlaces.length
              ? {
                  ...baseParams,
                  mismatchMatchCount: String(matchCount),
                  mismatchTotalCount: String(result.recommendedPlaces.length),
                  mismatchUnmatched: JSON.stringify(unmatchedNames)
                }
              : baseParams
        });
      } catch (error) {
        // allow retry on failure
        calledRef.current = false;

        const axiosError = error as AxiosError<{ message?: string }>;

        Alert.alert(
          'Could not generate itinerary',
          axiosError.response?.data?.message ||
            'Something went wrong. Please try again.',
          [{ text: 'Go Back', onPress: () => router.back() }]
        );
      }
    };

    run();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <CuratingTripOverlay
        steps={isSurprise ? SURPRISE_STEPS : DEFAULT_STEPS}
        durationMs={28000}
      />
    </View>
  );
}
