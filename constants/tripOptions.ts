import { Ionicons } from '@expo/vector-icons';

export type PaceOption = {
  value: string;
  label: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export const PACE_OPTIONS: PaceOption[] = [
  {
    value: 'relaxed',
    label: 'Relaxed',
    description: 'Take it slow and enjoy each place',
    icon: 'leaf-outline'
  },
  {
    value: 'balanced',
    label: 'Balanced',
    description: 'A mix of exploring and relaxing',
    icon: 'walk-outline'
  },
  {
    value: 'packed',
    label: 'Packed',
    description: 'Fit in as many highlights as possible',
    icon: 'flash-outline'
  }
];
