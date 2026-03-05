import { useState } from 'react';
import { View, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { AppText } from '@/components/AppText';
import { FormField } from './FormField';

type Props = {
  label?: string;
  value?: Date;
  onChange: (time: Date) => void;
  required?: boolean;
  error?: string;
};

export function TimePickerBar({
  label,
  value,
  onChange,
  required,
  error
}: Props) {
  const [show, setShow] = useState(false);

  const selected = value ?? new Date();

  const handleChange = (_: any, date?: Date) => {
    setShow(false);
    if (date) onChange(date);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

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
          onPress={() => setShow(true)}
          className="flex-row items-center justify-between"
        >
          <AppText className={value ? '' : 'text-gray-400'}>
            {value ? formatTime(selected) : 'Select time'}
          </AppText>
        </Pressable>
      </FormField>

      {show && (
        <DateTimePicker
          value={selected}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}
    </View>
  );
}
