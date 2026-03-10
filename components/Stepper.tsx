import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import { FormField } from './FormField';

type StepperProps = {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  required?: boolean;
  error?: string;
};

export function Stepper({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  required,
  error
}: StepperProps) {
  const decrease = () => {
    if (value > min) onChange(value - 1);
  };

  const increase = () => {
    if (value < max) onChange(value + 1);
  };

  const disableMinus = value <= min;
  const disablePlus = value >= max;

  return (
    <FormField label={label} required={required} error={error} hasValue={true}>
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={decrease}
          disabled={disableMinus}
          className={`rounded-lg p-2 ${
            disableMinus ? 'opacity-40' : 'active:bg-gray-200'
          }`}
        >
          <Ionicons name="remove" size={20} />
        </Pressable>

        <AppText className="text-lg font-semibold">{value}</AppText>

        <Pressable
          onPress={increase}
          disabled={disablePlus}
          className={`rounded-lg p-2 ${
            disablePlus ? 'opacity-40' : 'active:bg-gray-200'
          }`}
        >
          <Ionicons name="add" size={20} />
        </Pressable>
      </View>
    </FormField>
  );
}
