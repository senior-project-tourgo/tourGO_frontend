export type GroupType = {
  id: string;
  label: string;
  icon: string;
  defaultPeople: number;
  description: string;
};

export const GROUP_TYPES: GroupType[] = [
  {
    id: 'solo',
    label: 'Solo',
    icon: 'person-outline',
    defaultPeople: 1,
    description: 'Just me'
  },
  {
    id: 'couple',
    label: 'Couple',
    icon: 'heart-outline',
    defaultPeople: 2,
    description: 'Romantic getaway'
  },
  {
    id: 'family',
    label: 'Family',
    icon: 'home-outline',
    defaultPeople: 4,
    description: 'General family activities'
  },
  {
    id: 'small_kids',
    label: 'With Small Kids',
    icon: 'happy-outline',
    defaultPeople: 4,
    description: 'Kid-friendly spots only'
  },
  {
    id: 'friends',
    label: 'Friends',
    icon: 'people-outline',
    defaultPeople: 4,
    description: 'Casual hangout (2–6)'
  },
  {
    id: 'office',
    label: 'Office / Team',
    icon: 'briefcase-outline',
    defaultPeople: 10,
    description: 'Team building (5–20)'
  },
  {
    id: 'large_group',
    label: 'Large Group',
    icon: 'people-circle-outline',
    defaultPeople: 15,
    description: 'Weddings, reunions (7+)'
  },
  {
    id: 'school',
    label: 'School / College',
    icon: 'school-outline',
    defaultPeople: 20,
    description: 'Educational, budget-conscious'
  },
  {
    id: 'elderly',
    label: 'With Elderly',
    icon: 'walk-outline',
    defaultPeople: 4,
    description: 'Accessible, shorter durations'
  },
  {
    id: 'accessibility',
    label: 'Accessibility Needs',
    icon: 'body-outline',
    defaultPeople: 2,
    description: 'Wheelchair-friendly, mobility support'
  }
];
