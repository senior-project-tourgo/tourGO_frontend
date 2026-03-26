import { SelectorOption } from './selectorOptions';

export const PACE_OPTIONS = [
  {
    icon: 'leaf-outline',
    label: 'Relaxed',
    description: 'Slow & easy',
    value: 'relaxed'
  },
  {
    icon: 'walk-outline',
    label: 'Balanced',
    description: 'Mix of both',
    value: 'balanced'
  },
  {
    icon: 'flash-outline',
    label: 'Packed',
    description: 'See it all',
    value: 'packed'
  }
] as const satisfies readonly SelectorOption<string>[];

/** Union type of all valid pace values ('relaxed' | 'balanced' | 'packed') */
export type PaceValue = (typeof PACE_OPTIONS)[number]['value'];
