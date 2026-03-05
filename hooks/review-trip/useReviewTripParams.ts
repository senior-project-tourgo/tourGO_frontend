// review-trip/hooks/useReviewTripParams.ts

import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Place } from '@/features/place/place.types';
import { getPlacesByIds } from '@/features/place/placeById.api';

interface UseReviewTripParamsProps {
  setInitialPlaces: (places: { place: Place; order: number }[]) => void;
}

export function useReviewTripParams({
  setInitialPlaces
}: UseReviewTripParamsProps) {
  const { placeIds, itineraryName } = useLocalSearchParams<{
    placeIds: string;
    itineraryName: string;
  }>();

  const normalizeStringParam = (
    param: string | string[] | undefined
  ): string => {
    const value = Array.isArray(param) ? param[0] : param;
    return value || '';
  };

  const cleanedItineraryName = normalizeStringParam(itineraryName);
  const defaultItineraryName = 'My Trip';
  const finalItineraryName =
    cleanedItineraryName.trim() || defaultItineraryName;

  useEffect(() => {
    const idsParam = normalizeStringParam(placeIds);
    if (!idsParam) return;

    const ids = idsParam.split(',').filter(Boolean);

    async function loadPlaces() {
      try {
        const places = await getPlacesByIds(ids);

        const formatted = places.map((place, index) => ({
          place,
          order: index + 1
        }));

        setInitialPlaces(formatted);
      } catch (error) {
        console.error('Failed to load places:', error);
      }
    }

    loadPlaces();
  }, [placeIds, setInitialPlaces]);

  return { finalItineraryName };
}
