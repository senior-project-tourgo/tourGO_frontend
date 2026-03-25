import { Pressable, View } from 'react-native';
import { AppText } from './AppText';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/theme/colors';

type IconTileProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** Tile width style — pass a percentage string like '47%' or a number */
  width?: string | number;
  /** Optional description shown below the label */
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
      style={{
        width: width as any,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: selected ? colors.brand.primary : colors.brand.neutrals,
        backgroundColor: selected
          ? colors.brand.primary + '18'
          : colors.surface.background
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: selected
            ? colors.brand.primary + '20'
            : colors.brand.neutrals + '80',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Ionicons
          name={icon}
          size={18}
          color={selected ? colors.brand.primary : colors.brand.secondary}
        />
      </View>
      <AppText
        variant="caption"
        className="font-semibold"
        style={{
          color: selected ? colors.brand.primary : colors.text.DEFAULT,
          textAlign: 'center'
        }}
      >
        {label}
      </AppText>
      {description ? (
        <AppText
          variant="caption"
          style={{
            color: colors.brand.secondary,
            fontSize: 10,
            textAlign: 'center'
          }}
          numberOfLines={1}
        >
          {description}
        </AppText>
      ) : null}
    </Pressable>
  );
}
