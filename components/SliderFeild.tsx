import { View } from 'react-native';
import Slider from '@react-native-community/slider';
import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';

type SliderFieldProps = {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  unit?: string; // optional (e.g., "hours", "km", etc.)
};

export function SliderField({
  label,
  value,
  onChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  unit
}: SliderFieldProps) {
  return (
    <View className="w-full">
      {(label || unit) && (
        <AppText>
          {label} {unit && `: ${value} ${unit}`}
        </AppText>
      )}

      <Slider
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={colors.brand.primary}
      />
    </View>
  );
}
