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
        {options.map(option => {
          const selected = option === value;

          // Try to use a unique, stable key
          let key: React.Key;
          if (typeof option === 'object' && option !== null && 'id' in option) {
            // @ts-ignore - assumes presence of id field
            key = option.id;
          } else {
            key = String(option);
          }

          return (
            <TouchableOpacity
              key={key}
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
