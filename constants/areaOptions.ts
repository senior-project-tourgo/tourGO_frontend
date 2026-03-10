import { SelectorOption } from './selectorOptions';
import { Area } from '@/features/place/place.types';

export type AreaOption = SelectorOption<Area>;

export const AREA_OPTIONS = [
  {
    value: 'Kathmandu',
    label: 'Kathmandu',
    description: 'Capital city rich in culture and temples',
    icon: 'business-outline'
  },
  {
    value: 'Pokhara',
    label: 'Pokhara',
    description: 'Lakeside city with mountain views',
    icon: 'water-outline'
  },
  {
    value: 'Bhaktapur',
    label: 'Bhaktapur',
    description: 'Historic royal city with preserved heritage',
    icon: 'library-outline'
  },
  {
    value: 'Lalitpur',
    label: 'Lalitpur',
    description: 'Known for art and craftsmanship',
    icon: 'color-palette-outline'
  }
] as const satisfies readonly SelectorOption<Area>[];
