import { Ionicons } from '@expo/vector-icons';

export const FOR_ICONS: Record<
  'couple' | 'family' | 'first-timer' | 'friends' | 'kids' | 'solo' | 'groups',
  keyof typeof Ionicons.glyphMap
> = {
  couple: 'heart-outline',
  family: 'home-outline',
  'first-timer': 'sparkles-outline',
  friends: 'people-outline',
  kids: 'game-controller-outline',
  solo: 'person-outline',
  groups: 'people-circle-outline'
};
