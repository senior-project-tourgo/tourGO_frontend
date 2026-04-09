import { useEffect, useState } from 'react';
import type { Place } from '@/features/place/place.types';

export type GoogleReview = {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
};

export type GoogleData = {
  description?: string;
  address?: string;
  totalRatings?: number;
  reviews?: GoogleReview[];
};

const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY2;

export function useGooglePlace(place: Place) {
  const [googleData, setGoogleData] = useState<GoogleData>({});

  useEffect(() => {
    if (!place.mapsLinkKey || !GOOGLE_KEY) return;

    fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.mapsLinkKey}&fields=editorial_summary,user_ratings_total,reviews,formatted_address&key=${GOOGLE_KEY}`
    )
      .then(r => r.json())
      .then(data => {
        const result = data?.result ?? {};
        setGoogleData({
          description:
            result.editorial_summary?.overview ??
            place.description ??
            undefined,
          address: result.formatted_address ?? place.address ?? undefined,
          totalRatings: result.user_ratings_total,
          reviews: result.reviews?.slice(0, 3)
        });
      })
      .catch(() => {});
  }, [place.mapsLinkKey, place.description, place.address]);

  return googleData;
}
