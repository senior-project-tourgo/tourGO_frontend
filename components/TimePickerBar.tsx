import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Platform, Pressable, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { FormField } from './FormField';
import { Button } from './Button';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/theme/colors';

type Props = {
  label?: string;
  value?: Date;
  onChange: (date: Date) => void;
  required?: boolean;
  error?: string;
  className?: string;
  minimumDate?: Date;
  maximumDate?: Date;
};

export function TimePickerBar({
  label,
  value,
  onChange,
  required,
  error,
  className,
  minimumDate,
  maximumDate
}: Props) {
  const [open, setOpen] = useState(false);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

  const hasValue = !!value;

  const handleTimeChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setOpen(false);
    }

    if (!date) return;
    onChange(date);
  };

  return (
    <View className={className}>
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
            {value ? formatTime(value) : 'Select time'}
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

          <View className="rounded-3xl bg-white p-4">
            <DateTimePicker
              value={value ?? new Date()}
              mode="time"
              is24Hour={false}
              display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
              onChange={handleTimeChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
            />

            {Platform.OS === 'ios' && (
              <View className="pt-3">
                <Button title="Done" onPress={() => setOpen(false)} />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
