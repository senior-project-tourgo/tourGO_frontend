import { PaceOption } from '@/components/PaceSelector';

export const PACE_OPTIONS: PaceOption[] = [
  {
    value: 'relaxed',
    label: 'Relaxed',
    description: '1–2 places per day',
    icon: 'leaf-outline'
  },
  {
    value: 'balanced',
    label: 'Balanced',
    description: '3–4 places per day',
    icon: 'walk-outline'
  },
  {
    value: 'packed',
    label: 'Packed',
    description: '5+ places per day',
    icon: 'flash-outline'
  }
];
