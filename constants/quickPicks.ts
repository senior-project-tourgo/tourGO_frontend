import { Ionicons } from '@expo/vector-icons';

export type QuickPick = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  query: string;
};

export const QUICK_PICKS: QuickPick[] = [
  { label: 'Thamel', icon: 'storefront-outline', query: 'Thamel, Kathmandu' },
  { label: 'Lakeside', icon: 'water-outline', query: 'Lakeside, Pokhara' },
  {
    label: 'Bhaktapur',
    icon: 'library-outline',
    query: 'Bhaktapur Durbar Square'
  },
  {
    label: 'Patan',
    icon: 'color-palette-outline',
    query: 'Patan Durbar Square, Lalitpur'
  },
  { label: 'Boudha', icon: 'globe-outline', query: 'Boudhanath, Kathmandu' },
  { label: 'Ason', icon: 'basket-outline', query: 'Ason, Kathmandu' }
];
