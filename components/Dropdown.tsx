// components/ui/Dropdown.tsx

import { useState } from 'react';
import { Pressable, View, Modal } from 'react-native';
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
          onPress={() => setOpen(true)}
          className="flex-row items-center justify-between"
        >
          <AppText className={value ? '' : 'text-gray-400'}>
            {value || 'Select option'}
          </AppText>

          <Ionicons name="chevron-down" size={18} color={colors.text.DEFAULT} />
        </Pressable>
      </FormField>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/30"
          onPress={() => setOpen(false)}
        >
          <View className="w-72 rounded-2xl bg-colors-surface-background p-2">
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
        </Pressable>
      </Modal>
    </View>
  );
}
