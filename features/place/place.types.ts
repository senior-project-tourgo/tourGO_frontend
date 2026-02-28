import type { VibeId } from '../vibe/vibe.types';

/* --------------------------------------------------
 * ID Types
 * -------------------------------------------------- */

export type PlaceId = `plc_${string}`;
export type PromotionId = `promo_${string}`;

/* --------------------------------------------------
 * Core Entity
 * -------------------------------------------------- */

export type Place = {
  placeId: PlaceId;
  placeName: string;

  promotions: PromotionId[]; // strongly typed promo IDs

  image: string;
  location: PlaceLocation;

  mapsLinkKey: string; // key to resolve Google Maps link

  averageRating: number; // e.g. 4.3
  priceRange: PriceRange;

  openingHours: OpeningHours;
  isActive: boolean;

  typicalTimeSpent: string;

  vibe: VibeId[]; // ✅ no more string[]
  specialFacilities: SpecialFacility[];

  contactNumber: string | null;
  socialMedia: SocialMedia;
};

/* --------------------------------------------------
 * Supporting Types
 * -------------------------------------------------- */

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
  area: 'Kathmandu' | 'Pokhara' | 'Bhaktapur' | 'Lalitpur';
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

/* --------------------------------------------------
 * Special Facilities (typed, not string[])
 * -------------------------------------------------- */

export type SpecialFacility =
  | 'wheelchair-accessibility'
  | 'kids-friendly'
  | 'parking'
  | 'pet-friendly'
  | 'toilet'
  | 'no-reservations-required';
