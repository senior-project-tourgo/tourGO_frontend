import { AppText } from '@/components/AppText';
import { SelectorOption } from '@/constants/selectorOptions';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

type SelectorProps<T extends string> = {
  label?: string;
  value?: T;
  options: SelectorOption<T>[];
  onChange: (value: T) => void;
};

export function PaceSelector<T extends string>({
  label,
  value,
  options,
  onChange
}: SelectorProps<T>) {
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
                  className={`font-medium ${
                    selected ? 'text-colors-brand-primary' : 'text-colors-text'
                  }`}
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
