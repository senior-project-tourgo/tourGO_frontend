import { Ionicons } from '@expo/vector-icons';

export const FACILITY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  parking: 'car-outline',
  'free parking': 'checkmark-circle-outline',
  'paid parking': 'card-outline',

  wifi: 'wifi-outline',
  wheelchair: 'accessibility-outline',
  restroom: 'water-outline',
  atm: 'card-outline',

  restaurant: 'restaurant-outline',
  'dine-in': 'restaurant-outline',
  takeout: 'fast-food-outline',

  breakfast: 'restaurant-outline',
  lunch: 'restaurant-outline',
  coffee: 'cafe-outline',
  dinner: 'restaurant-outline',

  reservations: 'calendar-outline',

  beer: 'beer-outline',
  wine: 'wine-outline',
  cocktails: 'wine-outline',

  'kid-friendly': 'happy-outline',
  photography: 'camera-outline',
  'guided tour': 'person-outline',
  souvenir: 'bag-outline',
  prayer: 'book-outline',
  meditation: 'leaf-outline'
};
