import { SelectorOption } from './selectorOptions';

export const TRANSPORT_OPTIONS = [
  {
    value: 'walking',
    label: 'Walking',
    description: 'Up to ~2 km radius',
    icon: 'walk-outline'
  },
  {
    value: 'bicycling',
    label: 'Bicycling',
    description: 'Up to ~8 km radius',
    icon: 'bicycle-outline'
  },
  {
    value: 'driving',
    label: 'Driving',
    description: 'Up to ~35 km radius',
    icon: 'car-outline'
  },
  {
    value: 'transit',
    label: 'Transit',
    description: 'Public transportation options',
    icon: 'train-outline'
  }
] as const satisfies readonly SelectorOption[];

export type TransportMode = (typeof TRANSPORT_OPTIONS)[number]['value'];
