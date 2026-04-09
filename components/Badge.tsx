import colors from '@/theme/colors';
import { AppText } from './AppText';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BadgeProps {
  label?: string;
  iconName?: keyof typeof Ionicons.glyphMap;

  bgColor?: string;
  textColor?: string;
  size?: 'sm' | 'md'; // 'sm' = current default, 'md' = larger
}

export function Badge({
  label,
  iconName,
  bgColor = colors.brand.neutrals,
  textColor = colors.text.DEFAULT,
  size = 'sm'
}: BadgeProps) {
  // Define size mappings
  const sizeStyles = {
    sm: {
      px: 'px-2',
      py: 'py-[2px]',
      text: 'text-xs',
      icon: 12,
      gap: 'gap-1'
    },
    md: {
      px: 'px-3',
      py: 'py-2',
      text: 'text-sm',
      icon: 14,
      gap: 'gap-2'
    }
  };

  const styles = sizeStyles[size];

  return (
    <View
      className={`flex-row items-center ${styles.gap} rounded-full ${styles.px} ${styles.py}`}
      style={{ backgroundColor: bgColor }}
    >
      {iconName && (
        <Ionicons name={iconName} size={styles.icon} color={textColor} />
      )}
      {label && (
        <AppText
          className={`font-bold ${styles.text}`}
          style={{ color: textColor }}
        >
          {label}
        </AppText>
      )}
    </View>
  );
}
