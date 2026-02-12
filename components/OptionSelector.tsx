import { View, TouchableOpacity } from 'react-native';
import { AppText } from '@/components/AppText';

type OptionSelectorProps<T> = {
  label: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;

  renderOption?: (option: T, selected: boolean) => React.ReactNode;
  containerClassName?: string;
  optionClassName?: string;
};

export function OptionSelector<T>({
  label,
  options,
  value,
  onChange,
  renderOption,
  containerClassName = 'flex-row flex-wrap gap-2',
  optionClassName = 'px-4 py-2 rounded-full border border-gray-300'
}: OptionSelectorProps<T>) {
  return (
    <View>
      <AppText>{label}</AppText>

      <View className={containerClassName}>
        {options.map((option, index) => {
          const selected = option === value;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => onChange(option)}
              className={`${optionClassName} ${
                selected
                  ? 'border-colors-brand-primary bg-colors-brand-primary'
                  : ''
              }`}
            >
              {renderOption ? (
                renderOption(option, selected)
              ) : (
                <AppText className={selected ? 'text-white' : ''}>
                  {String(option)}
                </AppText>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
