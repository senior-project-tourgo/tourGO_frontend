import colors from '@/theme/colors';
import type { Trip } from '@/features/trip/trip.types';

export const STATUS_LABEL: Record<Trip['status'], string> = {
  current: 'Active',
  saved: 'Saved',
  completed: 'Completed'
};

export const STATUS_COLOR: Record<Trip['status'], string> = {
  current: '#22c55e',
  saved: colors.brand.primary,
  completed: '#94a3b8'
};
