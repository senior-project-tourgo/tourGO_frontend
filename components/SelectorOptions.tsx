import { AppText } from '@/components/AppText';
import { SelectorOption } from '@/constants/selectorOptions';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

type SelectorProps<T extends string> = {
  label?: string;
  value?: T;
  options: readonly SelectorOption<T>[];
  onChange: (value: T) => void;
  required?: boolean;
  error?: string;
};

export function OptionSelector<T extends string>({
  label,
  value,
  options,
  onChange,
  required,
  error
}: SelectorProps<T>) {
  const hasError = !!error;
  const hasSelection = value !== undefined && value !== null;

  return (
    <View className="gap-2">
      {label && (
        <AppText className="text-base font-medium">
          {label}
          {required && (
            <AppText style={{ color: colors.status.error }}> *</AppText>
          )}
        </AppText>
      )}

      <View className="gap-2">
        {options.map(option => {
          const selected = option.value === value;

          const containerStyle = selected
            ? 'border-colors-brand-primary bg-colors-brand-primary/10'
            : hasError
              ? 'border-gray-300 bg-white'
              : !hasSelection
                ? 'border-gray-300 bg-gray-100' // none selected
                : 'border-gray-300 bg-white'; // others when one is selected

          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              className={`flex-row items-center gap-3 rounded-full border px-4 py-3 ${containerStyle}`}
              style={
                hasError && !selected
                  ? {
                      borderColor: colors.status.error,
                      backgroundColor: colors.status.error + '1A'
                    }
                  : undefined
              }
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
                  <AppText variant="muted" className="text-gray-500">
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

        {hasError && (
          <AppText className="text-sm" style={{ color: colors.status.error }}>
            {error || 'Please select an option'}
          </AppText>
        )}
      </View>
    </View>
  );
}
