import { Ionicons } from '@expo/vector-icons';

export type SelectorOption<T extends string = string> = {
  /** Unique value to identify the option */
  value: T;
  /** Main label shown on UI */
  label: string;
  /** Optional secondary description text */
  description?: string;
  /** Optional icon from Ionicons */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Optional width override for layout, e.g., '31%' */
  width?: string | number;
};
