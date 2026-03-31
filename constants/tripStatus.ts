import type { Trip } from '@/features/trip/trip.types';
import colors from '@/theme/colors';

export const STATUS_LABEL: Record<Trip['status'], string> = {
  current: 'Active',
  saved: 'Saved',
  completed: 'Completed'
};

export const STATUS_COLOR: Record<Trip['status'], string> = {
  current: colors.status.success,
  saved: colors.brand.primary,
  completed: colors.status.complete
};
