import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import colors from '../theme/colors';

type SelectableChipsProps<
  T extends {
    id: string | number;
    label: string;
    icon: string;
    description?: string;
  }
> = {
  title: string;
  options: T[];
  selectedOption?: T | null;
  onSelect: (option: T) => void;
  showDescription?: boolean;
};

function SelectableChips<
  T extends {
    id: string | number;
    label: string;
    icon: string;
    description?: string;
  }
>({
  title,
  options,
  selectedOption,
  onSelect,
  showDescription = true
}: SelectableChipsProps<T>) {
  return (
    <View className="gap-2">
      <AppText className="text-base font-medium">{title}</AppText>

      <View className="flex-row flex-wrap gap-2">
        {options.map(opt => {
          const selected = selectedOption?.id === opt.id;

          return (
            <Pressable
              key={opt.id}
              onPress={() => onSelect(opt)}
              className={`flex-row items-center gap-1.5 rounded-full border px-3 py-2 ${
                selected
                  ? 'border-colors-brand-primary bg-colors-brand-primary/10'
                  : 'border-colors-text bg-colors-surface-background'
              }`}
            >
              <Ionicons
                name={opt.icon as any}
                size={14}
                color={selected ? colors.brand.primary : colors.text.DEFAULT}
              />
              <AppText
                variant="caption"
                className={`font-semibold ${
                  selected ? 'text-colors-text' : 'text-colors-text'
                }`}
              >
                {opt.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {showDescription && selectedOption?.description && (
        <AppText variant="caption" className="text-secondary">
          {selectedOption.description}
        </AppText>
      )}
    </View>
  );
}

export default SelectableChips;
