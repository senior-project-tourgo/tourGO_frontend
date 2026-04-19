import api from '@/config/api';

export type PlaceGoogleDetails = {
  description: string | null;
  address: string | null;
  totalRatings: number | null;
  photoUrl: string | null;
  reviews: {
    author_name: string;
    rating: number;
    text: string;
    relative_time_description: string;
  }[];
};

export async function getPlaceGoogleDetails(
  placeId: string
): Promise<PlaceGoogleDetails> {
  const response = await api.get<PlaceGoogleDetails>(
    `/places/${placeId}/google-details`
  );
  return response.data;
}
