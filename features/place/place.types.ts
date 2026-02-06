// features/place/place.types.ts

export type Place = {
  placeId: string;
  placeName: string;
  promotions: string[]; // promo IDs from your DB
  image: string;
  location: PlaceLocation;
  mapsLinkKey: string; // key to resolve Google Maps link
  averageRating: number; // numeric average rating value (e.g. 4.3)
  priceRange: PriceRange;
  openingHours: OpeningHours;
  isActive: boolean;
  typicalTimeSpent: string;
  vibe: string[];
  specialFacilities: string[];
  contactNumber: string;
  socialMedia: SocialMedia;
};

export type OpeningHours = {
  monday: TimeRange[];
  tuesday: TimeRange[];
  wednesday: TimeRange[];
  thursday: TimeRange[];
  friday: TimeRange[];
  saturday: TimeRange[];
  sunday: TimeRange[];
};

export type TimeRange = {
  open: string; // 'HH:mm'
  close: string; // 'HH:mm'
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
