import { PaceOption } from '@/components/PaceSelector';

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
