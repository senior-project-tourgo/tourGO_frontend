import colors from '@/theme/colors';
import { AppText } from './AppText';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BadgeProps {
  label?: string;
  iconName?: keyof typeof Ionicons.glyphMap;

  bgColor?: string;
  textColor?: string;
}

export function Badge({
  label,
  iconName,
  bgColor = colors.brand.neutrals,
  textColor = colors.text.DEFAULT
}: BadgeProps) {
  return (
    <View
      className="flex-row items-center gap-1 rounded-full px-2 py-[2px]"
      style={{ backgroundColor: bgColor }}
    >
      {iconName && <Ionicons name={iconName} size={12} color={textColor} />}

      {label && (
        <AppText className="text-xs font-bold" style={{ color: textColor }}>
          {label}
        </AppText>
      )}
    </View>
  );
}
