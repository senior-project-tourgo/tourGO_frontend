import { useState } from 'react';
import { View, Pressable, Modal } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { FormField } from './FormField';

import colors from '@/theme/colors';

type Props = {
  label?: string;
  value?: Date | null;
  onChange?: (date: Date) => void;
  required?: boolean;
  error?: string;
  className?: string;
};

export default function DatePickerBar({
  label,
  value,
  onChange,
  required,
  error,
  className
}: Props) {
  const [open, setOpen] = useState(false);

  const hasValue = !!value;

  const today = format(new Date(), 'yyyy-MM-dd');

  const selectedDateString = value ? format(value, 'yyyy-MM-dd') : undefined;

  const handleSelect = (day: DateData) => {
    const date = new Date(day.dateString);

    onChange?.(date);
    setOpen(false);
  };

  return (
    <View className={className}>
      <FormField
        label={label ?? 'Trip Date'}
        required={required}
        error={error}
        hasValue={hasValue}
      >
        <Pressable
          onPress={() => setOpen(true)}
          className="flex-row items-center justify-between"
        >
          <AppText
            className={`font-medium ${
              value ? 'text-colors-text' : 'text-colors-text-muted'
            }`}
          >
            {value ? format(value, 'EEEE, MMM d') : 'Select a date'}
          </AppText>

          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.text.DEFAULT}
          />
        </Pressable>
      </FormField>

      <Modal visible={open} transparent animationType="fade">
        <View className="flex-1 justify-center bg-black/30 p-6">
          <Pressable
            className="absolute inset-0"
            onPress={() => setOpen(false)}
          />

          <View className="rounded-3xl bg-colors-surface-background p-4">
            <Calendar
              current={selectedDateString}
              minDate={today}
              onDayPress={handleSelect}
              markedDates={
                selectedDateString
                  ? {
                      [selectedDateString]: {
                        selected: true,
                        selectedColor: colors.brand.primary
                      }
                    }
                  : {}
              }
              theme={{
                todayTextColor: colors.text.DEFAULT,
                arrowColor: colors.text.DEFAULT
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
