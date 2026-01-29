// features/place/place.types.ts

export type Place = {
  placeId: string;
  placeName: string;
  promotions: string[]; // promo IDs from your DB
  image: string;
  location: PlaceLocation;
  mapsLinkKey: string; // key to resolve Google Maps link
  averageRatingKey: string; // key to resolve rating from ratings table/service
  priceRange: PriceRange;
  openingHours: string;
  isActive: boolean;
  typicalTimeSpent: string;
  vibe: string[];
  specialFacilities: string[];
  contactNumber: string;
  socialMedia: SocialMedia;
};

export type PlaceLocation = {
  area: string;
  city: string;
  lat: number;
  lng: number;
};

export type SocialMedia = {
  instagram?: SocialPlatform | null;
  tiktok?: SocialPlatform | null;
  facebook?: SocialPlatform | null;
  whatsapp?: SocialPlatform | null;
};

export type SocialPlatform = {
  handle?: string;
  page?: string;
  likes: number;
};

export type PriceRange = '$' | '$$' | '$$$' | '$$$$';
