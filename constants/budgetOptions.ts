import { type PriceRange } from '@/features/place/place.types';

export const BUDGET_TIERS: {
  value: PriceRange;
  npr: string;
}[] = [
  { value: '$', npr: '0.5k' },
  { value: '$$', npr: '0.5k-5k' },
  { value: '$$$', npr: '1.5k–4k' },
  { value: '$$$$', npr: '4k+' }
];
