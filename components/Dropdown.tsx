// components/ui/Dropdown.tsx
import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';

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
      {label && <Text className="mb-1 text-sm text-gray-500">{label}</Text>}

      <Pressable
        onPress={() => setOpen(!open)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-3"
      >
        <Text>{value}</Text>
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
              <Text>{option}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
