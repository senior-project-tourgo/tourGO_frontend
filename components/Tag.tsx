// components/ui/Tag.tsx
import { Pressable } from 'react-native';
import { AppText } from './AppText';

type TagProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Tag({ label, selected = false, onPress }: TagProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`mb-2 mr-2 rounded-full px-3 py-1 ${
        selected ? 'bg-colors-brand-primary' : 'bg-gray-200'
      }`}
    >
      <AppText
        className={`text-sm ${
          selected ? 'font-semibold text-white' : 'text-colors-text'
        }`}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
