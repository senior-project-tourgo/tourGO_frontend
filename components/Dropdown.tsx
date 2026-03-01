// components/ui/Dropdown.tsx
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import colors from '@/theme/colors';

type DropdownProps = {
  label?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export function Dropdown({ label, options, value, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const sortedOptions = [...options].sort((a, b) =>
    String(a).localeCompare(String(b))
  );

  return (
    <View className="w-full">
      {label && <AppText>{label}</AppText>}

      <Pressable
        onPress={() => setOpen(!open)}
        className="flex-row items-center justify-between rounded-full border border-gray-300 bg-colors-surface-background px-4 py-3"
      >
        <AppText>{value}</AppText>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.text.DEFAULT}
        />
      </Pressable>

      {open && (
        <View className="mt-2 rounded-lg border border-gray-200 bg-colors-surface-background">
          {sortedOptions.map(option => (
            <Pressable
              key={option}
              onPress={() => {
                onChange(option);
                setOpen(false);
              }}
              className="px-4 py-3"
            >
              <AppText>{option}</AppText>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
