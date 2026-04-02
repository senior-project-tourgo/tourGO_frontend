import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';

export function NavRow({
  icon,
  label,
  onPress
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-full bg-colors-surface-background px-4 py-4 shadow-sm"
    >
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.brand.neutrals }}
      >
        <Ionicons name={icon} size={18} color={colors.brand.secondary} />
      </View>

      <AppText variant="body" className="flex-1 font-semibold">
        {label}
      </AppText>

      <Ionicons
        name="chevron-forward"
        size={16}
        color={colors.brand.secondary}
      />
    </Pressable>
  );
}
