import { Pressable, View } from 'react-native';
import { AppText } from './AppText';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/theme/colors';

type IconTileProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  selected?: boolean;
  onPress?: () => void;
  width?: string | number;
  description?: string;
};

export function IconTile({
  icon,
  label,
  selected = false,
  onPress,
  width = '47%',
  description
}: IconTileProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`
        items-center justify-center
        gap-1
        rounded-[14px] border
        px-2
        py-3
        ${selected ? 'border-colors-brand-primary bg-colors-brand-primary/10' : 'border-colors-text/20 bg-colors-surface-background'}
      `}
      style={{ width: typeof width === 'number' ? width : (width as any) }} // ✅ safe for TS
    >
      <View
        className={`
          h-9 w-9 items-center
          justify-center rounded-full
          ${selected ? 'bg-colors-brand-primary/20' : 'bg-colors-text/10'}
        `}
      >
        <Ionicons
          name={icon}
          size={18}
          color={selected ? colors.brand.primary : colors.text.DEFAULT}
        />
      </View>
      <AppText
        variant="caption"
        className={`text-center font-semibold ${selected ? 'text-colors-brand-primary' : 'text-colors-text'}`}
      >
        {label}
      </AppText>
      {description && (
        <AppText
          variant="caption"
          className="text-center text-[10px] text-gray-500"
          numberOfLines={1}
        >
          {description}
        </AppText>
      )}
    </Pressable>
  );
}
