import { Ionicons } from '@expo/vector-icons';

export type SelectorOption<T extends string = string> = {
  value: T;
  label: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};
