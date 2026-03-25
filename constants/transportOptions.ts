import { SelectorOption } from './selectorOptions';

export const TRANSPORT_OPTIONS = [
  {
    value: 'walking',
    label: 'Walking',
    description: 'Up to ~2 km radius',
    icon: 'walk-outline'
  },
  {
    value: 'cycling',
    label: 'Cycling',
    description: 'Up to ~8 km radius',
    icon: 'bicycle-outline'
  },
  {
    value: 'motorbike',
    label: 'Motorbike',
    description: 'Up to ~20 km radius',
    icon: 'speedometer-outline'
  },
  {
    value: 'car',
    label: 'Car',
    description: 'Up to ~35 km radius',
    icon: 'car-outline'
  }
] as const satisfies readonly SelectorOption[];

export type TransportMode = (typeof TRANSPORT_OPTIONS)[number]['value'];
