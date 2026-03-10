import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';
import { PaceOption } from '@/constants/tripOptions';

type PaceSelectorProps = {
  label?: string;
  value?: string;
  options: PaceOption[];
  onChange: (value: string) => void;
};

export function PaceSelector({
  label,
  value,
  options,
  onChange
}: PaceSelectorProps) {
  return (
    <View className="gap-2">
      {label && <AppText className="text-base font-medium">{label}</AppText>}

      <View className="gap-2">
        {options.map(option => {
          const selected = option.value === value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              className={`flex-row items-center gap-3 rounded-full border px-4 py-3 ${
                selected
                  ? 'border-colors-brand-primary bg-colors-brand-primary/10'
                  : 'border-gray-300'
              }`}
            >
              {option.icon && (
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={selected ? colors.brand.primary : colors.text.DEFAULT}
                />
              )}

              <View className="flex-1">
                <AppText
                  className={`font-medium ${selected ? 'text-colors-brand-primary' : 'text-colors-text'}`}
                >
                  {option.label}
                </AppText>

                {option.description && (
                  <AppText className="text-sm text-gray-500">
                    {option.description}
                  </AppText>
                )}
              </View>

              {selected && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.brand.primary}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
export { PaceOption };
