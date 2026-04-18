import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';
import { VIBE_ICONS } from '@/constants/vibes/vibeIcons';

interface VibeChipProps {
  id: string;
  title: string;
  isSelected: boolean;
  showDot?: boolean;
  onPress: () => void;
}

export function VibeChip({
  id,
  title,
  isSelected,
  showDot,
  onPress
}: VibeChipProps) {
  const iconName =
    id === 'all' ? 'apps-outline' : (VIBE_ICONS[id] ?? 'sparkles-outline');

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 24,
        backgroundColor: isSelected
          ? colors.brand.primary
          : colors.brand.neutrals,
        borderWidth: 1.5,
        borderColor: isSelected ? colors.brand.primary : colors.brand.neutrals
      }}
    >
      <Ionicons
        name={iconName}
        size={16}
        color={isSelected ? 'white' : colors.brand.secondary}
      />

      <AppText
        style={{
          fontSize: 13,
          fontWeight: '600',
          color: isSelected ? 'white' : colors.brand.secondary
        }}
      >
        {title}
      </AppText>

      {!isSelected && showDot && (
        <View
          style={{
            backgroundColor: colors.brand.primary,
            width: 7,
            height: 7,
            borderRadius: 3.5
          }}
        />
      )}
    </Pressable>
  );
}
