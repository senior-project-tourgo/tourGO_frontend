import { SelectorOption } from './selectorOptions';

export const TIME_WINDOW_OPTIONS: SelectorOption[] = [
  {
    value: 'morning',
    label: 'Morning',
    description: '08:00 – 12:00 • Cafes and early exploring',
    icon: 'sunny-outline'
  },
  {
    value: 'afternoon',
    label: 'Afternoon',
    description: '12:00 – 17:00 • Lunch spots and markets',
    icon: 'partly-sunny-outline'
  },
  {
    value: 'evening',
    label: 'Evening',
    description: '17:00 – 22:00 • Dinner and nightlife',
    icon: 'moon-outline'
  },
  {
    value: 'fullday',
    label: 'Full Day',
    description: '09:00 – 20:00 • Explore all day',
    icon: 'time-outline'
  }
];

export type TimeWindowValue = (typeof TIME_WINDOW_OPTIONS)[number]['value'];

export const TIME_WINDOW_RANGES: Record<
  TimeWindowValue,
  { start: string; end: string }
> = {
  morning: { start: '08:00', end: '12:00' },
  afternoon: { start: '12:00', end: '17:00' },
  evening: { start: '17:00', end: '22:00' },
  fullday: { start: '09:00', end: '20:00' }
};
