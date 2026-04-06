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
  suitableFor: string[];
  specialFacilities: string[];
  contactNumber: string | null;
  socialMedia: SocialMedia;
  description?: string;
  address?: string;
  reviews?: PlaceReview[];
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

export type Area = 'Kathmandu' | 'Pokhara' | 'Bhaktapur' | 'Lalitpur';

export type PlaceLocation = {
  area: Area;
  lat: number;
  lng: number;
};

export type SocialMedia = {
  instagram?: SocialPlatform | null;
  tiktok?: SocialPlatform | null;
  facebook?: SocialPlatform | null;
  whatsapp?: WhatsAppPlatform | null;
};

export type SocialPlatform = {
  handle?: string;
  page?: string;
  likes: number;
};

export type WhatsAppPlatform = {
  number?: string;
  handle?: string;
};

export type PriceRange = '$' | '$$' | '$$$' | '$$$$';

export type PlaceReview = {
  text: string;
  rating: number;
  author: string;
  time: string;
};
