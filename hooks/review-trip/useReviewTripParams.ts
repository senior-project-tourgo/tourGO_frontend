// review-trip/hooks/useReviewTripParams.ts

import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Place } from '@/features/place/place.types';

interface UseReviewTripParamsProps {
  setInitialPlaces: (places: { place: Place; order: number }[]) => void;
}

export function useReviewTripParams({
  setInitialPlaces
}: UseReviewTripParamsProps) {
  const { places, itineraryName } = useLocalSearchParams<{
    places: string;
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
    if (!places) return;

    try {
      const parsed: Place[] = JSON.parse(places as string);

      const formatted = parsed.map((place, index) => ({
        place,
        order: index + 1
      }));

      setInitialPlaces(formatted);
    } catch (error) {
      console.error('Failed to parse places:', error);
    }
  }, [places]);

  return { finalItineraryName };
}
