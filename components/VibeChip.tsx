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
      className="flex-row items-center gap-1 space-x-2 rounded-full px-3.5 py-2"
      style={{
        backgroundColor: isSelected
          ? colors.brand.secondary
          : colors.brand.neutrals
      }}
    >
      <Ionicons
        name={iconName}
        size={16}
        color={isSelected ? 'white' : colors.brand.secondary}
      />

      <AppText
        className="text-[13px] font-semibold"
        style={{
          color: isSelected ? 'white' : colors.brand.secondary
        }}
      >
        {title}
      </AppText>

      {!isSelected && showDot && (
        <View
          className="h-[7px] w-[7px] rounded-full"
          style={{ backgroundColor: colors.brand.primary }}
        />
      )}
    </Pressable>
  );
}
