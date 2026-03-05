import { useState } from 'react';
import { View, Pressable, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from './AppText';
import { FormField } from './FormField';

import colors from '@/theme/colors';

type Props = {
  label?: string;
  value?: string;
  onChange?: (date: string) => void;
  required?: boolean;
  error?: string;
};

export default function DatePickerBar({
  label,
  value,
  onChange,
  required,
  error
}: Props) {
  const today = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(value || today);
  const [open, setOpen] = useState(false);

  const handleSelect = (day: any) => {
    setSelectedDate(day.dateString);
    onChange?.(day.dateString);
    setOpen(false);
  };

  const hasValue = !!selectedDate;

  return (
    <View className="w-full">
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
          <AppText className="font-medium text-colors-text">
            {format(new Date(selectedDate), 'EEEE, MMM d')}
          </AppText>

          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.text.DEFAULT}
          />
        </Pressable>
      </FormField>

      {/* CALENDAR MODAL */}
      <Modal visible={open} animationType="slide" transparent>
        <Pressable
          className="flex-1 justify-end bg-black/30"
          onPress={() => setOpen(false)}
        >
          <Pressable className="rounded-t-3xl bg-white p-4" onPress={() => {}}>
            <Calendar
              current={selectedDate}
              onDayPress={handleSelect}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: '#000'
                }
              }}
              theme={{
                todayTextColor: '#000',
                arrowColor: '#000'
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
