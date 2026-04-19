import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import colors from '@/theme/colors';

type Option = {
  id: string | number;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

type PillTabsProps = {
  options: Option[];
  selectedId: string | number;
  onChange: (id: string | number) => void;
};

export const PillTabs: React.FC<PillTabsProps> = ({
  options,
  selectedId,
  onChange
}) => {
  return (
    <View className="w-full flex-row gap-x-2 rounded-full bg-colors-brand-secondary p-2">
      {options.map(option => {
        const isSelected = option.id === selectedId;

        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            className={`flex-1 items-center justify-center rounded-full py-3 ${
              isSelected ? 'bg-colors-surface-background' : 'bg-transparent'
            }`}
          >
            <View className="flex-row items-center justify-center">
              {option.icon && (
                <Ionicons
                  name={option.icon}
                  size={14}
                  color={colors.text.DEFAULT}
                  style={{
                    marginRight: 6,
                    opacity: isSelected ? 1 : 0
                  }}
                />
              )}

              <AppText
                className={`text-m ${
                  isSelected
                    ? 'font-medium text-colors-text'
                    : 'text-colors-text-inverse'
                }`}
              >
                {option.label}
              </AppText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};
