// components/ui/Tag.tsx
import { Pressable, Text } from 'react-native';

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
        selected ? 'bg-orange-500' : 'bg-gray-200'
      }`}
    >
      <Text
        className={`text-sm ${
          selected ? 'font-semibold text-white' : 'text-gray-700'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
