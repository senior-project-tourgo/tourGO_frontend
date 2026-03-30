export const BADGE_THRESHOLDS = [
  { badge: 'Legend', xp: 1000 },
  { badge: 'Adventurer', xp: 500 },
  { badge: 'Explorer', xp: 100 },
  { badge: 'Newcomer', xp: 0 }
] as const;

export type BadgeName = (typeof BADGE_THRESHOLDS)[number]['badge'];
