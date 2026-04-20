import { Ionicons } from '@expo/vector-icons';

export type IoniconName = keyof typeof Ionicons.glyphMap;

export type Step = {
  icon: IoniconName;
  label: string;
};

export const DEFAULT_STEPS: Step[] = [
  { icon: 'location-outline', label: 'Scanning nearby places…' },
  { icon: 'compass-outline', label: 'Matching your vibes…' },
  { icon: 'time-outline', label: 'Fitting your time window…' },
  { icon: 'star-outline', label: 'Ranking top spots…' },
  { icon: 'map-outline', label: 'Building your itinerary…' }
];

export const SURPRISE_STEPS: Step[] = [
  { icon: 'shuffle-outline', label: 'Picking a random vibe…' },
  { icon: 'location-outline', label: 'Finding hidden gems…' },
  { icon: 'star-outline', label: 'Ranking the best spots…' },
  { icon: 'map-outline', label: 'Assembling your surprise…' }
];
