// components/ui/Dropdown.tsx
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from './AppText';

type DropdownProps = {
  label?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export function Dropdown({ label, options, value, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <View className="w-full">
      {label && (
        <AppText className="mb-1 text-sm text-gray-500">{label}</AppText>
      )}

      <Pressable
        onPress={() => setOpen(!open)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-3"
      >
        <AppText>{value}</AppText>
      </Pressable>

      {open && (
        <View className="mt-2 rounded-lg border border-gray-200 bg-white">
          {options.map(option => (
            <Pressable
              key={option}
              onPress={() => {
                onChange(option);
                setOpen(false);
              }}
              className="border-b border-gray-100 px-4 py-3"
            >
              <AppText>{option}</AppText>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
