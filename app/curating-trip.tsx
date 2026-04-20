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

/* -----------------------------
   Safe param helpers
------------------------------ */

type Param = string | string[] | undefined;

const asString = (v: Param): string | undefined => {
  if (Array.isArray(v)) return v[0];
  return v;
};

const asNumber = (v: Param): number | undefined => {
  const raw = Array.isArray(v) ? v[0] : v;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
};

/* -----------------------------
   Component
------------------------------ */

export default function CuratingTripScreen() {
  const router = useRouter();

  // IMPORTANT: don't over-type this — Expo Router params are dynamic
  const params = useLocalSearchParams();

  const mode = asString(params.mode);
  const isSurprise = mode === 'surprise';

  const calledRef = useRef(false);

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
        /* -------------------------
           SURPRISE FLOW
        -------------------------- */
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

        /* -------------------------
           NORMAL FLOW
        -------------------------- */

        const vibes: string[] = params.vibes
          ? JSON.parse(asString(params.vibes) ?? '[]')
          : [];

        const transportModeRaw = asString(params.transportMode);
        const priceRangeRaw = asString(params.priceRange);
        const areaRaw = asString(params.travelingArea);

        const result = await generateRecommendation({
          area: areaRaw as Area | undefined,
          vibes,
          pace: asString(params.pace) as PaceValue,
          itineraryName: asString(params.itineraryName) ?? '',
          tripDate: asString(params.tripDate) ?? '',
          startTime: asString(params.startTime) ?? '',
          endTime: asString(params.endTime) ?? '',
          numberOfPeople: (() => {
            const n = asNumber(params.numberOfPeople);
            if (!n) throw new Error('Invalid numberOfPeople');
            return n;
          })(),
          groupType: asString(params.groupType) || undefined,
          startLat: asNumber(params.startLat),
          startLng: asNumber(params.startLng),

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
          itineraryName: asString(params.itineraryName),
          startLat: asString(params.startLat),
          startLng: asString(params.startLng),
          startLabel: asString(params.startLabel)
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
