import { type PriceRange } from '@/features/place/place.types';

export const BUDGET_TIERS: {
  value: PriceRange;
  npr: string;
  desc: string;
}[] = [
  { value: '$', npr: '0.5k', desc: 'Budget' },
  { value: '$$', npr: '0.5k-5k', desc: 'Moderate' },
  { value: '$$$', npr: '1.5k–4k', desc: 'Upscale' },
  { value: '$$$$', npr: '4k+', desc: 'Luxury' }
];
