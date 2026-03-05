// components/ui/Dropdown.tsx

import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from './AppText';
import { FormField } from './FormField';

import colors from '@/theme/colors';

type DropdownProps = {
  label?: string;
  options: string[];
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
};

export function Dropdown({
  label,
  options,
  value,
  onChange,
  required,
  error
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const sortedOptions = [...options].sort((a, b) =>
    String(a).localeCompare(String(b))
  );

  const hasValue = !!value;

  return (
    <View className="w-full">
      <FormField
        label={label}
        required={required}
        error={error}
        hasValue={hasValue}
      >
        <Pressable
          onPress={() => setOpen(prev => !prev)}
          className="flex-row items-center justify-between"
        >
          <AppText className={value ? '' : 'text-gray-400'}>
            {value || 'Select option'}
          </AppText>

          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.text.DEFAULT}
          />
        </Pressable>
      </FormField>

      {open && (
        <View className="mt-2 rounded-lg border border-gray-200 bg-white">
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
