// /services/place/placeGoogle.types.ts

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
